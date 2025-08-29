import React from 'react';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';
import Button from './ui/Button';
import { Gem, Calendar, RefreshCw, XCircle, Star } from 'lucide-react';

const CreditUsageBar: React.FC<{ used: number, total: number, label: string }> = ({ used, total, label }) => {
    const remaining = total - used;
    const remainingPercentage = total > 0 ? (remaining / total) * 100 : 0;
    
    return (
        <div>
            <div className="flex justify-between items-center mb-1 text-sm">
                <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>
                <span className="text-slate-500 dark:text-slate-400">{remaining} / {total} remaining</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                <div 
                    className="bg-teal-500 h-2.5 rounded-full" 
                    style={{ width: `${remainingPercentage}%` }}
                ></div>
            </div>
        </div>
    );
};

const BillingCard: React.FC = () => {
    const { user, cancelSubscription, renewSubscription } = useData();

    if (!user) return null;

    const { tier, status, renewsAt, credits } = user.subscription;
    const hasLifetime = user.oneTimePurchases?.includes('proLifetime');
    const isPaidTier = tier !== 'free' || hasLifetime;
    const totalCreditsMap = {
        starter: { text: 50, image: 10 },
        pro: { text: 150, image: 30 },
        premium: { text: 500, image: 100 },
        free: { text: 0, image: 0 },
    };

    const effectiveTier = hasLifetime ? 'pro' : tier;
    const totalTextCredits = totalCreditsMap[effectiveTier]?.text || 0;
    const totalImageCredits = totalCreditsMap[effectiveTier]?.image || 0;
    
    const renewalDate = renewsAt ? new Date(renewsAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <Gem size={20} className="text-cyan-500" />
                Subscription Details
            </h2>
            
            <div className="space-y-4 flex-grow">
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Current Plan</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 capitalize">{effectiveTier}</span>
                </div>
                 <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Status</span>
                    {hasLifetime ? (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 flex items-center gap-1">
                            <Star size={12}/> Lifetime Member
                        </span>
                    ) : (
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'}`}>
                            {status}
                        </span>
                    )}
                </div>
                {isPaidTier && !hasLifetime && (
                     <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <Calendar size={16} />
                            {status === 'active' ? 'Renews on' : 'Expires on'}
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{renewalDate}</span>
                    </div>
                )}

                {isPaidTier && (
                    <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200">Monthly AI Credits</h3>
                        <CreditUsageBar used={totalTextCredits - credits.text} total={totalTextCredits} label="Text Credits"/>
                        <CreditUsageBar used={totalImageCredits - credits.image} total={totalImageCredits} label="Image Credits"/>
                    </div>
                )}
            </div>

            <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-4 space-y-3">
                <Link to="/dashboard/upgrade">
                    <Button variant="secondary" className="w-full">Manage Plans & Purchases</Button>
                </Link>
                {isPaidTier && !hasLifetime && status === 'active' && (
                    <Button variant="danger" className="w-full" onClick={cancelSubscription}>
                        <XCircle size={16} className="mr-2" />
                        Cancel Subscription
                    </Button>
                )}
                {isPaidTier && !hasLifetime && status === 'canceled' && (
                     <Button variant="primary" className="w-full" onClick={renewSubscription}>
                        <RefreshCw size={16} className="mr-2" />
                        Renew Subscription
                    </Button>
                )}
            </div>
        </div>
    );
};

export default BillingCard;
