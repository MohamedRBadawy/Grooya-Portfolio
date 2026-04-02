import type {
  AboutBlock,
  AIPortfolioReview,
  AISessionSummary,
  AISuggestionResponse,
  AITailoringSuggestions,
  ColorTheme,
  HeroBlock,
  Palette,
  Portfolio,
  PortfolioBlock,
  Project,
  Resume,
  Skill,
  User,
} from '../types';
import { ApiRequestError, apiPost } from './platform/api';

interface AIEnvelope<T> {
  data: T;
  ai?: AISessionSummary;
}

type HeroSuggestion = AISuggestionResponse<{ headline: string; subheadline: string }>;
type TextSuggestion = AISuggestionResponse<{ content: string }>;
type ProjectSuggestion = AISuggestionResponse<{ description: string }>;

/**
 * Preserves the old error name used throughout the UI, but the message now
 * comes from the backend AI service instead of browser-only API key checks.
 */
export class ApiKeyMissingError extends Error {
  constructor(message = 'The AI service is temporarily unavailable.') {
    super(message);
    this.name = 'ApiKeyMissingError';
  }
}

const mapApiError = (error: unknown): never => {
  if (error instanceof ApiRequestError && error.code === 'provider_unavailable') {
    throw new ApiKeyMissingError(error.message);
  }

  if (error instanceof ApiRequestError) {
    throw new Error(error.message);
  }

  throw error instanceof Error ? error : new Error('The AI request failed.');
};

export const requestHeroSuggestion = async (
  name: string,
  title: string,
  options?: {
    track?: string;
    currentHeadline?: string;
    currentSubheadline?: string;
    audience?: string;
  },
): Promise<HeroSuggestion> => {
  try {
    const response = await apiPost<AIEnvelope<{ original: { headline: string; subheadline: string }; suggestion: { headline: string; subheadline: string }; reasoning_summary: string; alternatives?: { headline: string; subheadline: string }[]; quota?: any }>>('/ai/suggestions/hero', {
      name,
      title,
      track: options?.track,
      current_headline: options?.currentHeadline,
      current_subheadline: options?.currentSubheadline,
      audience: options?.audience,
    });

    return {
      original: response.data.original,
      suggestion: response.data.suggestion,
      reasoningSummary: response.data.reasoning_summary,
      alternatives: response.data.alternatives,
      quota: response.data.quota,
    };
  } catch (error) {
    return mapApiError(error);
  }
};

export const requestAboutSuggestion = async (
  name: string,
  title: string,
  options?: {
    track?: string;
    existingContent?: string;
    audience?: string;
  },
): Promise<TextSuggestion> => {
  try {
    const response = await apiPost<AIEnvelope<{ original: { content: string }; suggestion: { content: string }; reasoning_summary: string; alternatives?: { content: string }[]; quota?: any }>>('/ai/suggestions/about', {
      name,
      title,
      track: options?.track,
      existing_content: options?.existingContent,
      audience: options?.audience,
    });

    return {
      original: response.data.original,
      suggestion: response.data.suggestion,
      reasoningSummary: response.data.reasoning_summary,
      alternatives: response.data.alternatives,
      quota: response.data.quota,
    };
  } catch (error) {
    return mapApiError(error);
  }
};

export const requestProjectStorySuggestion = async (
  title: string,
  technologies: string,
  existingDescription: string,
  track?: string,
): Promise<ProjectSuggestion> => {
  try {
    const response = await apiPost<AIEnvelope<{ original: { description: string }; suggestion: { description: string }; reasoning_summary: string; alternatives?: { description: string }[]; quota?: any }>>('/ai/suggestions/project', {
      title,
      technologies,
      existing_description: existingDescription,
      track,
    });

    return {
      original: response.data.original,
      suggestion: response.data.suggestion,
      reasoningSummary: response.data.reasoning_summary,
      alternatives: response.data.alternatives,
      quota: response.data.quota,
    };
  } catch (error) {
    return mapApiError(error);
  }
};

export const requestExperienceSuggestion = async (
  description: string,
  options?: { title?: string; company?: string },
): Promise<ProjectSuggestion> => {
  try {
    const response = await apiPost<AIEnvelope<{ original: { description: string }; suggestion: { description: string }; reasoning_summary: string; quota?: any }>>('/ai/suggestions/experience', {
      description,
      title: options?.title,
      company: options?.company,
    });

    return {
      original: response.data.original,
      suggestion: response.data.suggestion,
      reasoningSummary: response.data.reasoning_summary,
      quota: response.data.quota,
    };
  } catch (error) {
    return mapApiError(error);
  }
};

export const generateHeroContent = async (name: string, title: string): Promise<{ headline: string; subheadline: string }> => {
  const result = await requestHeroSuggestion(name, title);
  return result.suggestion;
};

export const generateAboutContent = async (name: string, title: string, existingContent?: string): Promise<string> => {
  const result = await requestAboutSuggestion(name, title, { existingContent });
  return result.suggestion.content;
};

export const generateProjectStory = async (title: string, technologies: string, existingDescription: string): Promise<string> => {
  const result = await requestProjectStorySuggestion(title, technologies, existingDescription);
  return result.suggestion.description;
};

export const generateDesignSuggestions = async (userTitle: string): Promise<{ theme: ColorTheme; headingFont: string; bodyFont: string; accentColor: string }> => {
  try {
    const response = await apiPost<AIEnvelope<{ theme: ColorTheme; headingFont: string; bodyFont: string; accentColor: string }>>('/ai/suggestions/design', {
      user_title: userTitle,
    });
    return response.data;
  } catch (error) {
    return mapApiError(error);
  }
};

export const generateResumeFromPortfolio = async (
  portfolio: Portfolio,
  user: User,
  allProjects: Project[],
  allSkills: Skill[],
): Promise<Omit<Resume, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'title' | 'template' | 'accentColor'>> => {
  try {
    const response = await apiPost<AIEnvelope<Omit<Resume, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'title' | 'template' | 'accentColor'>>>('/ai/resumes/from-portfolio', {
      portfolio,
      user,
      all_projects: allProjects,
      all_skills: allSkills,
    });
    return response.data;
  } catch (error) {
    return mapApiError(error);
  }
};

export const generateResumeForJobDescription = async (resume: Resume, jobDescription: string): Promise<Omit<Resume, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'title' | 'template' | 'accentColor'>> => {
  try {
    const response = await apiPost<AIEnvelope<Omit<Resume, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'title' | 'template' | 'accentColor'>>>('/ai/resumes/for-job', {
      resume,
      job_description: jobDescription,
    });
    return response.data;
  } catch (error) {
    return mapApiError(error);
  }
};

export const generateResumeTailoringSuggestions = async (resume: Resume, jobDescription: string): Promise<AITailoringSuggestions> => {
  try {
    const response = await apiPost<AIEnvelope<AITailoringSuggestions>>('/ai/resumes/tailor', {
      resume,
      job_description: jobDescription,
    });
    return response.data;
  } catch (error) {
    return mapApiError(error);
  }
};

export const generatePortfolioReview = async (portfolio: Portfolio, user: User): Promise<AIPortfolioReview> => {
  try {
    const response = await apiPost<AIEnvelope<AIPortfolioReview>>('/ai/review/portfolio', {
      portfolio,
      user,
    });
    return response.data;
  } catch (error) {
    return mapApiError(error);
  }
};

export const enhanceExperienceDescription = async (description: string, options?: { title?: string; company?: string }): Promise<string> => {
  const result = await requestExperienceSuggestion(description, options);
  return result.suggestion.description;
};

export const getSuggestedBlocks = async (
  goal: string,
  role: string,
  existingBlocks: string[],
  track?: string,
): Promise<{ type: PortfolioBlock['type']; reason: string }[]> => {
  try {
    const response = await apiPost<AIEnvelope<{ suggestions: { type: PortfolioBlock['type']; reason: string }[] }>>('/ai/suggestions/sections', {
      goal,
      role,
      existing_blocks: existingBlocks,
      track,
    });
    return response.data.suggestions;
  } catch (error) {
    return mapApiError(error);
  }
};

const hashPrompt = (prompt: string) => prompt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
const toHex = (value: number) => `#${(value % 0xffffff).toString(16).padStart(6, '0')}`;

export const generateColorPalette = async (prompt: string): Promise<Omit<Palette, 'id' | 'name'>> => {
  const seed = hashPrompt(prompt);
  const accent = toHex(seed * 37);
  const background = toHex(seed * 11 + 0xf5f5f5);
  const cardBackground = toHex(seed * 17 + 0xffffff);
  const text = '#0f172a';
  const subtle = '#64748b';

  return {
    colors: {
      background,
      text,
      heading: text,
      subtle,
      cardBackground,
      cardBorder: '#cbd5e1',
      inputBackground: '#ffffff',
      inputBorder: '#cbd5e1',
      inputText: text,
      inputPlaceholder: subtle,
    },
  };
};

export const generateImage = async (_prompt: string): Promise<string> => {
  throw new Error('AI image generation is not enabled in this release.');
};

export const tuneContentForAudience = async (
  block: HeroBlock | AboutBlock,
  audience: string,
  userTitle: string,
): Promise<Partial<HeroBlock | AboutBlock>> => {
  if (block.type === 'hero') {
    const result = await requestHeroSuggestion(block.headline || 'Your Name', userTitle, {
      currentHeadline: block.headline,
      currentSubheadline: block.subheadline,
      audience,
    });
    return result.suggestion;
  }

  const result = await requestAboutSuggestion('You', userTitle, {
    existingContent: block.content,
    audience,
  });
  return { content: result.suggestion.content };
};
