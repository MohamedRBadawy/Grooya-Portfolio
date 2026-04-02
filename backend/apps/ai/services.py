"""AI service helpers for quota enforcement, provider selection, and suggestion shaping."""

from __future__ import annotations

import json
import os
import re
from collections import Counter
from dataclasses import dataclass
from datetime import timedelta
from typing import Any
from urllib import error as urllib_error
from urllib import request as urllib_request

from django.db.models import Q
from django.utils import timezone

from apps.ai.models import AIEntitlementPolicy, AIProviderSetting, AIUsageRecord
from apps.billing.models import Subscription
from apps.feature_flags.models import FeatureFlag

DEFAULT_FEATURE_FLAGS = {
    'ai_enabled': True,
    'ai_guided_build_enabled': True,
    'ai_portfolio_review_enabled': True,
    'advanced_analytics_enabled': True,
    'custom_domains_enabled': True,
    'billing_checkout_enabled': False,
    'lead_capture_enabled': True,
}

DEFAULT_POLICIES = {
    Subscription.Tier.FREE: {
        'heroContent': (2, False, 'Free users get a tiny hero writing quota.'),
        'aboutContent': (2, False, 'Free users get a tiny about writing quota.'),
        'projectStory': (2, False, 'Free users get a tiny project story quota.'),
        'experienceEnhancement': (2, False, 'Free users get a tiny experience rewrite quota.'),
        'blockSuggestions': (3, False, 'Free users can ask for a few guided block suggestions.'),
        'portfolioReview': (1, True, 'Free users can request one portfolio review.'),
        'contentTuning': (2, False, 'Free users can retune content a few times.'),
        'designSuggestions': (1, False, 'Free users can request one design direction.'),
        'resumeFromPortfolio': (1, True, 'Free users can draft one resume from a portfolio.'),
        'resumeFromJobDescription': (0, True, 'ATS tailoring is reserved for paid plans.'),
        'resumeTailoring': (0, True, 'ATS tailoring is reserved for paid plans.'),
    },
    Subscription.Tier.STARTER: {
        'heroContent': (25, False, 'Starter includes recurring lightweight hero suggestions.'),
        'aboutContent': (25, False, 'Starter includes recurring about suggestions.'),
        'projectStory': (25, False, 'Starter includes recurring project story suggestions.'),
        'experienceEnhancement': (20, False, 'Starter includes recurring experience rewriting.'),
        'blockSuggestions': (20, False, 'Starter includes guided block suggestions.'),
        'portfolioReview': (8, True, 'Starter includes portfolio reviews.'),
        'contentTuning': (20, False, 'Starter includes content tuning.'),
        'designSuggestions': (8, False, 'Starter includes design direction suggestions.'),
        'resumeFromPortfolio': (6, True, 'Starter includes resume generation from portfolio.'),
        'resumeFromJobDescription': (3, True, 'Starter includes limited resume tailoring.'),
        'resumeTailoring': (6, True, 'Starter includes resume tailoring feedback.'),
    },
    Subscription.Tier.PRO: {
        'heroContent': (100, False, 'Pro includes a larger hero writing quota.'),
        'aboutContent': (100, False, 'Pro includes a larger about writing quota.'),
        'projectStory': (100, False, 'Pro includes a larger project story quota.'),
        'experienceEnhancement': (80, False, 'Pro includes more experience rewriting.'),
        'blockSuggestions': (60, False, 'Pro includes guided block suggestions.'),
        'portfolioReview': (30, True, 'Pro includes portfolio reviews.'),
        'contentTuning': (60, False, 'Pro includes content tuning.'),
        'designSuggestions': (30, False, 'Pro includes design direction suggestions.'),
        'resumeFromPortfolio': (24, True, 'Pro includes resume generation from portfolio.'),
        'resumeFromJobDescription': (15, True, 'Pro includes heavier resume tailoring.'),
        'resumeTailoring': (30, True, 'Pro includes resume tailoring feedback.'),
    },
}

STOPWORDS = {
    'the',
    'and',
    'with',
    'that',
    'this',
    'from',
    'have',
    'your',
    'into',
    'role',
    'for',
    'you',
    'are',
    'our',
    'their',
    'will',
    'using',
    'build',
    'work',
    'experience',
    'team',
}


class AIServiceError(Exception):
    """Base error for AI service failures."""

    code = 'ai_error'


class AIFeatureDisabledError(AIServiceError):
    code = 'feature_disabled'


class AIQuotaExceededError(AIServiceError):
    code = 'quota_exceeded'


class AIProviderUnavailableError(AIServiceError):
    code = 'provider_unavailable'


@dataclass
class AIExecutionResult:
    payload: dict[str, Any]
    provider: str


def bootstrap_ai_defaults() -> None:
    """Ensure server-owned feature flags and entitlement defaults exist."""

    for key, enabled in DEFAULT_FEATURE_FLAGS.items():
        FeatureFlag.objects.get_or_create(
            key=key,
            defaults={
                'enabled': enabled,
                'description': f'Default flag for {key.replace("_", " ")}.',
            },
        )

    for tier, policies in DEFAULT_POLICIES.items():
        for feature, (monthly_quota, heavy_action, description) in policies.items():
            AIEntitlementPolicy.objects.get_or_create(
                tier=tier,
                feature=feature,
                defaults={
                    'monthly_quota': monthly_quota,
                    'heavy_action': heavy_action,
                    'description': description,
                    'enabled': monthly_quota > 0,
                },
            )

    AIProviderSetting.objects.get_or_create(
        provider='heuristic',
        defaults={'enabled': True, 'is_default': not bool(os.environ.get('GEMINI_API_KEY'))},
    )
    AIProviderSetting.objects.get_or_create(
        provider='gemini',
        defaults={'enabled': bool(os.environ.get('GEMINI_API_KEY')), 'is_default': bool(os.environ.get('GEMINI_API_KEY'))},
    )


def get_feature_flags() -> dict[str, bool]:
    bootstrap_ai_defaults()
    flags = DEFAULT_FEATURE_FLAGS.copy()
    flags.update({flag.key: flag.enabled for flag in FeatureFlag.objects.filter(key__in=flags.keys())})
    return flags


def _ensure_session_key(request) -> str:
    if not request.session.session_key:
        request.session.create()
    return request.session.session_key or ''


def get_effective_tier(request) -> str:
    if request.user.is_authenticated:
        subscription = getattr(request.user, 'subscription', None)
        return subscription.tier if subscription else Subscription.Tier.FREE
    return Subscription.Tier.FREE


def get_entitlement_policy(tier: str, feature: str) -> AIEntitlementPolicy:
    bootstrap_ai_defaults()
    policy = AIEntitlementPolicy.objects.filter(tier=tier, feature=feature).first()
    if policy:
        return policy

    fallback = DEFAULT_POLICIES.get(tier, DEFAULT_POLICIES[Subscription.Tier.FREE]).get(feature, (0, False, ''))
    return AIEntitlementPolicy(
        tier=tier,
        feature=feature,
        monthly_quota=fallback[0],
        heavy_action=fallback[1],
        description=fallback[2],
        enabled=fallback[0] > 0,
    )


def _usage_filter_for_request(request) -> Q:
    if request.user.is_authenticated:
        return Q(user=request.user)
    return Q(session_key=_ensure_session_key(request))


def get_usage_snapshot(request, feature: str) -> dict[str, Any]:
    tier = get_effective_tier(request)
    policy = get_entitlement_policy(tier, feature)
    reset_at = timezone.now() + timedelta(days=30)
    period_start = timezone.now() - timedelta(days=30)
    used = AIUsageRecord.objects.filter(
        _usage_filter_for_request(request),
        feature=feature,
        status=AIUsageRecord.Status.SUCCESS,
        created_at__gte=period_start,
    ).count()
    remaining = max(policy.monthly_quota - used, 0)
    return {
        'feature': feature,
        'tier': tier,
        'limit': policy.monthly_quota,
        'used': used,
        'remaining': remaining,
        'resetAt': reset_at.isoformat(),
        'heavyAction': policy.heavy_action,
        'enabled': policy.enabled,
    }


def get_ai_snapshot(request) -> dict[str, Any]:
    tier = get_effective_tier(request)
    feature_names = sorted(DEFAULT_POLICIES.get(tier, DEFAULT_POLICIES[Subscription.Tier.FREE]).keys())
    allowance_by_feature = {feature: get_usage_snapshot(request, feature) for feature in feature_names}
    return {
        'provider': 'gemini' if os.environ.get('GEMINI_API_KEY') else 'heuristic',
        'tier': tier,
        'allowanceByFeature': allowance_by_feature,
        'resetAt': (timezone.now() + timedelta(days=30)).isoformat(),
    }


def _enforce_flags(flags: dict[str, bool], feature: str) -> None:
    if not flags.get('ai_enabled', False):
        raise AIFeatureDisabledError('AI is currently disabled by the backend feature flags.')
    if feature == 'portfolioReview' and not flags.get('ai_portfolio_review_enabled', False):
        raise AIFeatureDisabledError('Portfolio review is currently disabled.')
    if feature in {'heroContent', 'aboutContent', 'projectStory', 'blockSuggestions', 'contentTuning'} and not flags.get('ai_guided_build_enabled', False):
        raise AIFeatureDisabledError('Guided AI building is currently disabled.')


def _enforce_quota(request, feature: str) -> None:
    snapshot = get_usage_snapshot(request, feature)
    if not snapshot['enabled'] or snapshot['limit'] <= 0:
        raise AIFeatureDisabledError('This AI capability is not available on your current plan.')
    if snapshot['remaining'] <= 0:
        raise AIQuotaExceededError('You have reached this AI feature quota for the current period.')


def _normalize_text(value: str | None) -> str:
    return (value or '').strip()


def _human_join(values: list[str]) -> str:
    values = [value for value in values if value]
    if not values:
        return ''
    if len(values) == 1:
        return values[0]
    return ', '.join(values[:-1]) + f' and {values[-1]}'


def _sentence_case(value: str) -> str:
    value = value.strip()
    if not value:
        return value
    return value[0].upper() + value[1:]


def _keywords_from_text(text: str, limit: int = 7) -> list[str]:
    words = re.findall(r'[A-Za-z][A-Za-z0-9.+#-]{2,}', text.lower())
    filtered = [word for word in words if word not in STOPWORDS]
    return [word.title() for word, _ in Counter(filtered).most_common(limit)]


def _split_lines(text: str) -> list[str]:
    parts = re.split(r'[\n.;]+', text)
    return [part.strip('- ').strip() for part in parts if part.strip('- ').strip()]


def _extract_json_block(text: str) -> Any:
    cleaned = text.strip()
    if cleaned.startswith('```'):
        cleaned = re.sub(r'^```(?:json)?', '', cleaned).strip()
        cleaned = re.sub(r'```$', '', cleaned).strip()
    return json.loads(cleaned)


class HeuristicProvider:
    """Structured fallback provider used when the paid AI provider is unavailable."""

    name = 'heuristic'

    def generate(self, feature: str, payload: dict[str, Any]) -> dict[str, Any]:
        handlers = {
            'heroContent': self._hero,
            'aboutContent': self._about,
            'projectStory': self._project,
            'experienceEnhancement': self._experience,
            'contentTuning': self._tune,
            'blockSuggestions': self._sections,
            'portfolioReview': self._portfolio_review,
            'designSuggestions': self._design,
            'resumeFromPortfolio': self._resume_from_portfolio,
            'resumeFromJobDescription': self._resume_for_job_description,
            'resumeTailoring': self._resume_tailoring,
        }
        handler = handlers[feature]
        return handler(payload)

    def _hero(self, payload: dict[str, Any]) -> dict[str, Any]:
        name = _normalize_text(payload.get('name')) or 'Your name'
        title = _normalize_text(payload.get('title')) or 'Your title'
        track = payload.get('track') or 'jobSeeker'
        audience = _normalize_text(payload.get('audience'))
        value_line = 'wins interviews' if track == 'jobSeeker' else 'helps clients trust your work'
        audience_line = f' for {audience}' if audience else ''
        suggestion = {
            'headline': f'{name} | {title}',
            'subheadline': f'I build focused digital experiences that {value_line}{audience_line}.',
        }
        return {
            'original': {
                'headline': _normalize_text(payload.get('current_headline')),
                'subheadline': _normalize_text(payload.get('current_subheadline')),
            },
            'suggestion': suggestion,
            'reasoning_summary': 'The suggestion leads with identity, clarifies the role, and adds a clearer value proposition.',
            'alternatives': [
                {
                    'headline': f'{name}, {title}',
                    'subheadline': f'A practical {title.lower()} focused on clear outcomes, polished delivery, and momentum.',
                }
            ],
        }

    def _about(self, payload: dict[str, Any]) -> dict[str, Any]:
        name = _normalize_text(payload.get('name')) or 'This professional'
        title = _normalize_text(payload.get('title')) or 'creative professional'
        existing = _normalize_text(payload.get('existing_content'))
        audience = _normalize_text(payload.get('audience'))
        audience_note = f' for {audience.lower()}' if audience else ''
        summary = (
            f'{name} is a {title} focused on turning ideas into polished work that feels clear, reliable, and outcome-driven. '
            f'The portfolio should highlight how they translate goals into execution, communicate tradeoffs well, and keep quality high from strategy through delivery{audience_note}. '
            f'The next step is to anchor this story in concrete proof: shipped projects, impact, and a strong contact pathway.'
        )
        if existing:
            summary = (
                f'{name} is a {title} who brings a clear mix of craft, delivery, and collaboration to every project. '
                f'Building on the current draft, this version sharpens the value proposition, adds more confidence to the tone, and focuses the reader on results instead of generic traits. '
                f'Use projects, experience, and client or recruiter-facing outcomes to support the story.'
            )
        return {
            'original': {'content': existing},
            'suggestion': {'content': summary},
            'reasoning_summary': 'The rewrite emphasizes positioning, credibility, and the kind of proof visitors expect next.',
        }

    def _project(self, payload: dict[str, Any]) -> dict[str, Any]:
        title = _normalize_text(payload.get('title')) or 'This project'
        technologies = [item.strip() for item in _normalize_text(payload.get('technologies')).split(',') if item.strip()]
        tech_line = _human_join(technologies[:4]) or 'modern tools'
        description = (
            f'{title} was built to solve a practical problem with a smoother, more reliable user experience. '
            f'The work focused on shaping the product direction, shipping the core flow, and using {tech_line} to keep the implementation maintainable. '
            f'The final result is a stronger example of product thinking, execution quality, and the ability to turn requirements into something people can actually use.'
        )
        return {
            'original': {'description': _normalize_text(payload.get('existing_description'))},
            'suggestion': {'description': description},
            'reasoning_summary': 'The rewrite adds context, execution, and outcome so the project reads like proof of capability instead of a feature list.',
        }

    def _experience(self, payload: dict[str, Any]) -> dict[str, Any]:
        title = _normalize_text(payload.get('title'))
        company = _normalize_text(payload.get('company'))
        original_lines = _split_lines(_normalize_text(payload.get('description')))
        rewritten = []
        for line in original_lines or ['Improved delivery across a core part of the product.']:
            line = line.rstrip('.')
            prefix = f'As {title} at {company}, ' if title and company else ''
            rewritten.append(_sentence_case(f'{prefix}{line}, with a clearer emphasis on ownership, collaboration, and measurable impact.'))
        return {
            'original': {'description': _normalize_text(payload.get('description'))},
            'suggestion': {'description': '\n'.join(rewritten)},
            'reasoning_summary': 'The rewritten version adds stronger action framing and more recruiter-friendly emphasis on ownership and outcomes.',
        }

    def _tune(self, payload: dict[str, Any]) -> dict[str, Any]:
        audience = _normalize_text(payload.get('audience')) or 'the target audience'
        block_type = payload.get('block_type')
        if block_type == 'hero':
            suggestion = {
                'headline': _normalize_text(payload.get('headline')) or 'Portfolio headline',
                'subheadline': f"{_normalize_text(payload.get('subheadline')) or 'A clear portfolio summary.'} Tailored for {audience.lower()} with more emphasis on fit, trust, and relevance.",
            }
            original = {
                'headline': _normalize_text(payload.get('headline')),
                'subheadline': _normalize_text(payload.get('subheadline')),
            }
        else:
            original = {'content': _normalize_text(payload.get('content'))}
            suggestion = {
                'content': f"{original['content'] or 'This portfolio section'} Reframed for {audience.lower()} with clearer proof, sharper value, and a stronger call to continue reading.",
            }
        return {
            'original': original,
            'suggestion': suggestion,
            'reasoning_summary': f'The content was tuned to speak more directly to {audience.lower()}.',
        }

    def _sections(self, payload: dict[str, Any]) -> dict[str, Any]:
        existing = set(payload.get('existing_blocks') or [])
        track = payload.get('track') or 'jobSeeker'
        candidates = ['projects', 'about', 'experience', 'skills', 'contact'] if track == 'jobSeeker' else ['services', 'projects', 'testimonials', 'contact', 'cta']
        reasons = {
            'projects': 'Show real proof instead of just positioning.',
            'about': 'Explain your value and working style clearly.',
            'experience': 'Add trust with real work history and scope.',
            'skills': 'Surface your strengths quickly for scanning visitors.',
            'contact': 'Turn attention into an easy next step.',
            'services': 'Clarify offers and make buying easier.',
            'testimonials': 'Add trust signals from previous work.',
            'cta': 'Guide visitors toward a clear action.',
        }
        picks = []
        for item in candidates:
            if item not in existing:
                picks.append({'type': item, 'reason': reasons[item]})
            if len(picks) == 3:
                break
        return {'suggestions': picks}

    def _portfolio_review(self, payload: dict[str, Any]) -> dict[str, Any]:
        portfolio = payload.get('portfolio') or {}
        pages = portfolio.get('pages') or []
        blocks = [block for page in pages for block in page.get('blocks', [])]
        block_types = {block.get('type') for block in blocks}
        missing = [block for block in ['hero', 'about', 'projects', 'experience', 'contact', 'services', 'testimonials'] if block not in block_types]
        track = portfolio.get('track') or 'jobSeeker'
        impression = (
            'The portfolio already has a workable structure, but it will feel much stronger once the main promise, proof, and contact path are tighter.'
            if blocks
            else 'The portfolio needs foundational sections before it can persuade recruiters or clients effectively.'
        )
        suggestions = []
        if 'hero' in block_types:
            suggestions.append({'area': 'Hero', 'suggestion': 'Lead with a sharper promise that states who you help and why you are credible.'})
        if 'about' in block_types:
            suggestions.append({'area': 'About', 'suggestion': 'Use the About section to connect your working style, strengths, and evidence of delivery.'})
        if 'projects' in block_types:
            suggestions.append({'area': 'Projects', 'suggestion': 'Make each project explain the problem, your role, and the result instead of only naming the stack.'})
        project_feedback = (
            'Projects are the strongest trust-builder for a job-seeker portfolio. Make sure each one has context, decisions, and outcomes.'
            if track == 'jobSeeker'
            else 'Projects should feel like proof of service quality. Add clarity on scope, collaboration, and the business result.'
        )
        return {
            'overallImpression': impression,
            'contentSuggestions': suggestions or [{'area': 'Structure', 'suggestion': 'Start by adding a hero, proof-of-work section, and contact path.'}],
            'projectShowcaseFeedback': project_feedback,
            'missingSections': missing[:3],
        }

    def _design(self, payload: dict[str, Any]) -> dict[str, Any]:
        title = (payload.get('user_title') or '').lower()
        if any(keyword in title for keyword in ['designer', 'creative', 'brand']):
            return {
                'theme': 'rose',
                'headingFont': 'Playfair Display',
                'bodyFont': 'Lora',
                'accentColor': '#e11d48',
            }
        if any(keyword in title for keyword in ['engineer', 'developer', 'backend', 'frontend']):
            return {
                'theme': 'dark',
                'headingFont': 'Sora',
                'bodyFont': 'Inter',
                'accentColor': '#14b8a6',
            }
        return {
            'theme': 'mint',
            'headingFont': 'Poppins',
            'bodyFont': 'Inter',
            'accentColor': '#0f766e',
        }

    def _resume_from_portfolio(self, payload: dict[str, Any]) -> dict[str, Any]:
        portfolio = payload.get('portfolio') or {}
        user = payload.get('user') or {}
        projects = payload.get('all_projects') or []
        skills = payload.get('all_skills') or []
        pages = portfolio.get('pages') or []
        blocks = [block for page in pages for block in page.get('blocks', [])]
        experience_block = next((block for block in blocks if block.get('type') == 'experience'), None)
        project_ids = set()
        skill_ids = set()
        for block in blocks:
            if block.get('type') == 'projects':
                project_ids.update(block.get('projectIds') or [])
            if block.get('type') == 'skills':
                skill_ids.update(block.get('skillIds') or [])
        selected_projects = [
            {
                'id': project.get('id', f"proj-{index}"),
                'title': project.get('title', 'Project'),
                'description': project.get('description', ''),
                'technologies': project.get('technologies', []),
            }
            for index, project in enumerate(projects)
            if project.get('id') in project_ids
        ]
        selected_skills = [skill for skill in skills if skill.get('id') in skill_ids]
        return {
            'fullName': user.get('name', 'Your Name'),
            'jobTitle': user.get('title', portfolio.get('title', 'Professional')),
            'email': user.get('email', ''),
            'phone': user.get('phone', ''),
            'website': user.get('website', ''),
            'linkedin': user.get('linkedin', ''),
            'github': user.get('github', ''),
            'summary': f"{user.get('name', 'This candidate')} is a {user.get('title', 'professional')} focused on clear execution, strong communication, and polished delivery.",
            'experience': (experience_block or {}).get('items', []),
            'education': [],
            'skills': selected_skills,
            'projects': selected_projects,
        }

    def _resume_for_job_description(self, payload: dict[str, Any]) -> dict[str, Any]:
        resume = payload.get('resume') or {}
        job_description = payload.get('job_description', '')
        keywords = _keywords_from_text(job_description, limit=6)
        tailored_summary = (
            f"{resume.get('fullName', 'This candidate')} is a {resume.get('jobTitle', 'professional')} whose background aligns with {', '.join(keywords[:3]) or 'the role requirements'}. "
            'This tailored version prioritizes relevant experience, impact language, and clearer ATS-friendly phrasing.'
        )
        updated = dict(resume)
        updated['summary'] = tailored_summary
        return updated

    def _resume_tailoring(self, payload: dict[str, Any]) -> dict[str, Any]:
        job_description = payload.get('job_description', '')
        keywords = _keywords_from_text(job_description, limit=7)
        return {
            'newSummary': 'A stronger summary should mirror the role language, foreground relevant wins, and surface the most role-aligned skills early.',
            'suggestedKeywords': keywords,
            'feedbackPoints': [
                'Lead with results that match the target role.',
                'Mirror the job description vocabulary where it is truthful.',
                'Move your most relevant tools and strengths closer to the top.',
            ],
        }


class GeminiProvider:
    """Gemini-backed provider used when a backend API key is configured."""

    name = 'gemini'

    def __init__(self) -> None:
        self.api_key = os.environ.get('GEMINI_API_KEY')
        self.model = os.environ.get('GEMINI_MODEL', 'gemini-2.5-flash')

    def generate(self, feature: str, payload: dict[str, Any]) -> dict[str, Any]:
        if not self.api_key:
            raise AIProviderUnavailableError('GEMINI_API_KEY is not configured on the backend.')

        prompt = self._build_prompt(feature, payload)
        response_text = self._request_json(prompt)
        return _extract_json_block(response_text)

    def _request_json(self, prompt: str) -> str:
        endpoint = f'https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}'
        body = json.dumps(
            {
                'contents': [{'parts': [{'text': prompt}]}],
                'generationConfig': {
                    'temperature': 0.7,
                    'responseMimeType': 'application/json',
                },
            }
        ).encode('utf-8')

        request = urllib_request.Request(
            endpoint,
            data=body,
            headers={'Content-Type': 'application/json'},
            method='POST',
        )

        try:
            with urllib_request.urlopen(request, timeout=20) as response:
                payload = json.loads(response.read().decode('utf-8'))
        except urllib_error.HTTPError as exc:
            raise AIProviderUnavailableError(f'Gemini request failed with status {exc.code}.') from exc
        except urllib_error.URLError as exc:
            raise AIProviderUnavailableError('Gemini could not be reached from the backend.') from exc

        try:
            return payload['candidates'][0]['content']['parts'][0]['text']
        except (KeyError, IndexError, TypeError) as exc:
            raise AIProviderUnavailableError('Gemini returned an unexpected response shape.') from exc

    def _build_prompt(self, feature: str, payload: dict[str, Any]) -> str:
        prompts = {
            'heroContent': self._hero_prompt,
            'aboutContent': self._about_prompt,
            'projectStory': self._project_prompt,
            'experienceEnhancement': self._experience_prompt,
            'blockSuggestions': self._sections_prompt,
            'portfolioReview': self._portfolio_review_prompt,
            'designSuggestions': self._design_prompt,
            'resumeFromPortfolio': self._resume_from_portfolio_prompt,
            'resumeFromJobDescription': self._resume_for_job_prompt,
            'resumeTailoring': self._resume_tailoring_prompt,
        }
        builder = prompts.get(feature)
        if not builder:
            raise AIProviderUnavailableError(f'Gemini prompt for {feature} is not implemented.')
        return builder(payload)

    def _hero_prompt(self, payload: dict[str, Any]) -> str:
        return f"""
You are an expert portfolio strategist writing in English.
Create a stronger hero section for a {payload.get('track', 'jobSeeker')} portfolio.

Name: {payload.get('name', '')}
Title: {payload.get('title', '')}
Audience: {payload.get('audience', '')}
Current headline: {payload.get('current_headline', '')}
Current subheadline: {payload.get('current_subheadline', '')}

Return JSON only with this shape:
{{
  "original": {{"headline": "...", "subheadline": "..."}},
  "suggestion": {{"headline": "...", "subheadline": "..."}},
  "reasoning_summary": "One short sentence",
  "alternatives": [{{"headline": "...", "subheadline": "..."}}]
}}
""".strip()

    def _about_prompt(self, payload: dict[str, Any]) -> str:
        return f"""
You are an expert portfolio copywriter writing in English.
Rewrite the About section so it sounds more specific, trustworthy, and outcome-focused.

Name: {payload.get('name', '')}
Title: {payload.get('title', '')}
Track: {payload.get('track', '')}
Audience: {payload.get('audience', '')}
Existing content: {payload.get('existing_content', '')}

Return JSON only with:
{{
  "original": {{"content": "..."}},
  "suggestion": {{"content": "..."}},
  "reasoning_summary": "One short sentence"
}}
""".strip()

    def _project_prompt(self, payload: dict[str, Any]) -> str:
        return f"""
You are an expert portfolio copywriter writing in English.
Rewrite this project description with clearer problem, role, execution, and outcome framing.

Title: {payload.get('title', '')}
Technologies: {payload.get('technologies', '')}
Existing description: {payload.get('existing_description', '')}

Return JSON only with:
{{
  "original": {{"description": "..."}},
  "suggestion": {{"description": "..."}},
  "reasoning_summary": "One short sentence"
}}
""".strip()

    def _experience_prompt(self, payload: dict[str, Any]) -> str:
        return f"""
You are an expert resume writer writing in English.
Rewrite the experience description to sound stronger and more results-oriented without inventing false claims.

Title: {payload.get('title', '')}
Company: {payload.get('company', '')}
Description: {payload.get('description', '')}

Return JSON only with:
{{
  "original": {{"description": "..."}},
  "suggestion": {{"description": "..."}},
  "reasoning_summary": "One short sentence"
}}
""".strip()

    def _sections_prompt(self, payload: dict[str, Any]) -> str:
        return f"""
You are an expert portfolio strategist.
Suggest up to 3 high-impact sections for this portfolio.

Track: {payload.get('track', '')}
Goal: {payload.get('goal', '')}
Role: {payload.get('role', '')}
Existing blocks: {payload.get('existing_blocks', [])}

Only suggest from this list:
['about','projects','skills','gallery','testimonials','cta','resume','links','experience','contact','code','services','blog','video']

Return JSON only with:
{{
  "suggestions": [
    {{"type": "projects", "reason": "Short reason"}}
  ]
}}
""".strip()

    def _portfolio_review_prompt(self, payload: dict[str, Any]) -> str:
        return f"""
You are an expert portfolio reviewer writing concise English feedback.
Review this portfolio and return actionable feedback.

Portfolio JSON:
{json.dumps(payload.get('portfolio', {}), ensure_ascii=True)}

Return JSON only with:
{{
  "overallImpression": "...",
  "contentSuggestions": [
    {{"area": "Hero", "suggestion": "..."}}
  ],
  "projectShowcaseFeedback": "...",
  "missingSections": ["skills", "contact"]
}}
""".strip()

    def _design_prompt(self, payload: dict[str, Any]) -> str:
        return f"""
You are a UI direction assistant.
Suggest a design direction for a portfolio.

User title: {payload.get('user_title', '')}

Return JSON only with:
{{
  "theme": "light|dark|mint|rose",
  "headingFont": "Font Name",
  "bodyFont": "Font Name",
  "accentColor": "#14b8a6"
}}
""".strip()

    def _resume_from_portfolio_prompt(self, payload: dict[str, Any]) -> str:
        return f"""
You are an expert resume writer.
Create a resume draft from the portfolio and linked project/skill data.

Portfolio JSON:
{json.dumps(payload.get('portfolio', {}), ensure_ascii=True)}

User JSON:
{json.dumps(payload.get('user', {}), ensure_ascii=True)}

Projects JSON:
{json.dumps(payload.get('all_projects', []), ensure_ascii=True)}

Skills JSON:
{json.dumps(payload.get('all_skills', []), ensure_ascii=True)}

Return JSON only with:
{{
  "fullName": "...",
  "jobTitle": "...",
  "email": "...",
  "phone": "",
  "website": "",
  "linkedin": "",
  "github": "",
  "summary": "...",
  "experience": [],
  "education": [],
  "skills": [],
  "projects": []
}}
""".strip()

    def _resume_for_job_prompt(self, payload: dict[str, Any]) -> str:
        return f"""
You are an expert ATS resume writer.
Tailor this resume for the target job description while staying truthful.

Resume JSON:
{json.dumps(payload.get('resume', {}), ensure_ascii=True)}

Job description:
{payload.get('job_description', '')}

Return JSON only with the same resume shape after tailoring.
""".strip()

    def _resume_tailoring_prompt(self, payload: dict[str, Any]) -> str:
        return f"""
You are an expert ATS reviewer.
Analyze the resume against the job description and provide targeted suggestions.

Resume JSON:
{json.dumps(payload.get('resume', {}), ensure_ascii=True)}

Job description:
{payload.get('job_description', '')}

Return JSON only with:
{{
  "newSummary": "...",
  "suggestedKeywords": ["keyword"],
  "feedbackPoints": ["point"]
}}
""".strip()


class AIProviderRouter:
    """Routes requests to the configured provider and falls back safely when needed."""

    def __init__(self) -> None:
        self.heuristic_provider = HeuristicProvider()
        self.gemini_provider = GeminiProvider()

    def generate(self, feature: str, payload: dict[str, Any]) -> AIExecutionResult:
        if os.environ.get('GEMINI_API_KEY'):
            try:
                return AIExecutionResult(payload=self.gemini_provider.generate(feature, payload), provider=self.gemini_provider.name)
            except (AIProviderUnavailableError, json.JSONDecodeError, KeyError, TypeError, ValueError):
                pass

        return AIExecutionResult(payload=self.heuristic_provider.generate(feature, payload), provider=self.heuristic_provider.name)


def run_ai_feature(request, feature: str, payload: dict[str, Any], portfolio_id: int | None = None) -> dict[str, Any]:
    flags = get_feature_flags()
    _enforce_flags(flags, feature)
    _enforce_quota(request, feature)

    provider = AIProviderRouter()
    result = provider.generate(feature, payload)

    AIUsageRecord.objects.create(
        user=request.user if request.user.is_authenticated else None,
        session_key='' if request.user.is_authenticated else _ensure_session_key(request),
        feature=feature,
        provider=result.provider,
        portfolio_id=portfolio_id,
        request_payload=payload,
        response_payload=result.payload,
        status=AIUsageRecord.Status.SUCCESS,
        token_estimate=max(len(str(payload)) // 4, 1),
    )

    response = dict(result.payload)
    response['quota'] = get_usage_snapshot(request, feature)
    return response
