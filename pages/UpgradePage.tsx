import React, { useState } from 'react';
import { Check, Globe, Layers3, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import Button from '../components/ui/Button';
import { launchPlans, paidLaunchPlanOrder } from '../services/platform/plans';
import type { PlanTier } from '../types';

const billingCopy = {
    monthly: 'Monthly',
    annual: 'Annual',
} as const;

const planDescriptions: Record<PlanTier, string> = {
    free: 'Launch your first professional portfolio and resume on a Grooya subdomain.',
    starter: 'Look polished, remove branding, and start capturing serious opportunities.',
    pro: 'Run your professional brand with custom domains, stronger SEO, and advanced controls.',
    premium: 'Reserved for future expansion once team workflows are ready.',
};

const Toggle: React.FC<{
    options: { label: string; value: string }[];
    selected: string;
    setSelected: (value: string) => void;
}> = ({ options, selected, setSelected }) => (
    <div className="flex items-center gap-1 rounded-full bg-slate-200 p-1 dark:bg-slate-800">
        {options.map((option) => (
            <button
                key={option.value}
                onClick={() => setSelected(option.value)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                    selected === option.value
                        ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-50'
                        : 'text-slate-600 dark:text-slate-400'
                }`}
            >
                {option.label}
            </button>
        ))}
    </div>
);

const FeatureListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start gap-3">
        <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/50">
            <Check size={12} className="text-teal-600 dark:text-teal-400" />
        </div>
        <span className="text-slate-700 dark:text-slate-300">{children}</span>
    </li>
);

const PlanCard: React.FC<{
    tier: PlanTier;
    currentTier: PlanTier;
    billingCycle: 'monthly' | 'annual';
    currency: 'USD' | 'EGP';
    billingEnabled: boolean;
}> = ({ tier, currentTier, billingCycle, currency, billingEnabled }) => {
    const plan = launchPlans[tier];
    const isCurrent = currentTier === tier;
    const isPopular = tier === 'pro';
    const isFree = tier === 'free';
    const price = currency === 'EGP'
        ? billingCycle === 'monthly'
            ? plan.monthlyPriceEgp
            : plan.annualPriceEgp
        : billingCycle === 'monthly'
            ? plan.monthlyPriceUsd
            : plan.annualPriceUsd;
    const priceLabel = isFree ? 'Free' : `${currency === 'EGP' ? 'EGP ' : '$'}${price}`;
    const periodLabel = isFree ? '' : billingCycle === 'monthly' ? '/month' : '/year';

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{ y: -4 }}
            className={`relative flex flex-col overflow-hidden rounded-2xl border-2 p-6 ${
                isPopular
                    ? 'border-teal-500 bg-slate-50 dark:bg-slate-900'
                    : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/50'
            }`}
        >
            {isPopular && (
                <div className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/4 rotate-12 rounded-full bg-teal-500 px-4 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    Popular
                </div>
            )}

            <h3 className={`text-xl font-bold font-sora ${isPopular ? 'text-teal-600 dark:text-teal-400' : 'text-slate-900 dark:text-slate-50'}`}>
                {plan.title}
            </h3>
            <p className="mt-2 min-h-[3rem] text-sm text-slate-600 dark:text-slate-400">{planDescriptions[tier]}</p>

            <div className="my-6">
                <span className="text-4xl font-bold text-slate-900 dark:text-slate-50">{priceLabel}</span>
                {periodLabel && <span className="text-slate-500 dark:text-slate-400"> {periodLabel}</span>}
            </div>

            <ul className="mb-8 flex-grow space-y-3">
                {plan.features.map((feature) => (
                    <FeatureListItem key={feature}>{feature}</FeatureListItem>
                ))}
            </ul>

            <Button variant={isPopular ? 'primary' : 'secondary'} className="w-full" disabled={!billingEnabled || isCurrent}>
                {isCurrent ? 'Current plan' : billingEnabled ? `Choose ${plan.title}` : 'Backend checkout soon'}
            </Button>
        </motion.div>
    );
};

const UpgradePage: React.FC = () => {
    const { user, featureFlags } = useData();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
    const [currency, setCurrency] = useState<'USD' | 'EGP'>('EGP');
    const currentTier = user?.subscription?.tier || 'free';

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-50 md:text-5xl font-sora">
                    Pricing for professionals who need results
                </h1>
                <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-400">
                    Grooya launches with a simpler plan model: outcome-focused portfolio building, stronger publishing, real lead capture, and one Pro custom domain for serious personal brands.
                </p>
            </div>

            <div className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Toggle
                    options={[
                        { label: billingCopy.monthly, value: 'monthly' },
                        { label: 'Annual (Save about 2 months)', value: 'annual' },
                    ]}
                    selected={billingCycle}
                    setSelected={(value) => setBillingCycle(value as 'monthly' | 'annual')}
                />
                <Toggle
                    options={[
                        { label: 'EGP', value: 'EGP' },
                        { label: 'USD', value: 'USD' },
                    ]}
                    selected={currency}
                    setSelected={(value) => setCurrency(value as 'USD' | 'EGP')}
                />
            </div>

            {!featureFlags.billingCheckoutEnabled && (
                <div className="mx-auto mb-8 max-w-4xl rounded-2xl border border-amber-200 bg-amber-50/80 p-5 dark:border-amber-900/50 dark:bg-amber-950/30">
                    <div className="flex items-start gap-3">
                        <ShieldCheck className="mt-0.5 text-amber-600 dark:text-amber-300" size={20} />
                        <div>
                            <h2 className="font-semibold text-amber-900 dark:text-amber-100">Backend-owned billing is in progress</h2>
                            <p className="mt-1 text-sm text-amber-900/80 dark:text-amber-100/80">
                                Checkout, coupons, and subscription management are being moved behind the upcoming Django + Stripe backend. The pricing here is production-facing, but plan changes are intentionally disabled until the server is ready.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {paidLaunchPlanOrder.map((tier) => (
                    <PlanCard
                        key={tier}
                        tier={tier}
                        currentTier={currentTier}
                        billingCycle={billingCycle}
                        currency={currency}
                        billingEnabled={featureFlags.billingCheckoutEnabled}
                    />
                ))}
            </div>

            <div className="mt-14 grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-3 flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                        <Globe size={18} className="text-teal-500" />
                        Custom domains in v1
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Pro includes one custom domain in the first release. We’re starting with CNAME-based subdomains like <span className="font-mono">portfolio.example.com</span>, with Cloudflare handling SSL and hostname routing at the edge.
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-3 flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                        <Layers3 size={18} className="text-teal-500" />
                        What changes from the prototype
                    </div>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        <li>• No AI credits, one-time top-ups, or lifetime purchases at launch.</li>
                        <li>• Plans are anchored to publishing quality, lead capture, design depth, and domains.</li>
                        <li>• Billing becomes server-owned, so entitlements can’t be changed from the browser.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default UpgradePage;
