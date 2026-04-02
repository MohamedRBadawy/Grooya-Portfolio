import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Gem, Globe, ShieldCheck } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import Button from './ui/Button';
import { launchPlans } from '../services/platform/plans';

/**
 * Billing is intentionally read-only until backend-owned Stripe flows replace
 * the current prototype billing actions. This card mirrors launch entitlements
 * without pretending checkout is already production-ready.
 */
const BillingCard: React.FC = () => {
    const { user, featureFlags } = useData();

    if (!user) return null;

    const hasLifetime = user.oneTimePurchases?.includes('proLifetime');
    const effectiveTier = hasLifetime ? 'pro' : user.subscription.tier;
    const plan = launchPlans[effectiveTier];
    const renewalDate = user.subscription.renewsAt
        ? new Date(user.subscription.renewsAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : null;

    return (
        <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-slate-200">
                <Gem size={20} className="text-cyan-500" />
                Billing Overview
            </h2>

            <div className="flex-grow space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Current plan</span>
                    <span className="font-bold capitalize text-slate-900 dark:text-slate-100">{plan.title}</span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Status</span>
                    <span className="text-sm font-semibold capitalize text-slate-800 dark:text-slate-200">
                        {hasLifetime ? 'lifetime' : user.subscription.status}
                    </span>
                </div>

                {renewalDate && !hasLifetime && (
                    <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                        <span className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
                            <Calendar size={16} />
                            Renewal date
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{renewalDate}</span>
                    </div>
                )}

                <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        <ShieldCheck size={16} />
                        Included in this plan
                    </div>
                    <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                        {plan.features.slice(0, 6).map((feature) => (
                            <li key={feature}>• {feature}</li>
                        ))}
                    </ul>
                </div>

                <div className="rounded-lg border border-cyan-200 bg-cyan-50/80 p-4 dark:border-cyan-900/60 dark:bg-cyan-950/30">
                    <div className="mb-2 flex items-center gap-2 font-semibold text-cyan-800 dark:text-cyan-200">
                        <Globe size={16} />
                        Backend billing migration
                    </div>
                    <p className="text-sm text-cyan-900/80 dark:text-cyan-100/80">
                        {!featureFlags.billingCheckoutEnabled
                            ? 'Stripe checkout, coupon redemption, and the billing portal are being moved to the backend. This screen is read-only until those flows are connected.'
                            : 'Backend-owned billing is active for this environment.'}
                    </p>
                </div>
            </div>

            <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-700">
                <Link to="/dashboard/upgrade">
                    <Button variant="secondary" className="w-full">
                        View Plans
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default BillingCard;
