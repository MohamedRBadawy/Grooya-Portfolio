import React from 'react';
import { useData } from '../contexts/DataContext';
import Button from '../components/ui/Button';
import { Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const FeatureListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-center gap-3">
        <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-teal-100 dark:bg-teal-900/50 rounded-full">
            <Check size={12} className="text-teal-600 dark:text-teal-400" />
        </div>
        <span className="text-slate-700 dark:text-slate-300">{children}</span>
    </li>
);

const PlanCard: React.FC<{
    tier: 'free' | 'pro';
    title: string;
    price: string;
    description: string;
    features: string[];
    isCurrent: boolean;
    onSelect: () => void;
}> = ({ tier, title, price, description, features, isCurrent, onSelect }) => {
    const isPro = tier === 'pro';
    return (
        <motion.div 
            className={`p-8 rounded-2xl border-2 flex flex-col ${isPro ? 'bg-slate-50 dark:bg-slate-900 border-teal-500' : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'}`}
            whileHover={{ y: -5, scale: 1.02 }}
        >
            <h3 className={`text-2xl font-bold font-sora ${isPro ? 'text-teal-600 dark:text-teal-400' : 'text-slate-900 dark:text-slate-50'}`}>{title}</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-2">{description}</p>
            <div className="my-8">
                <span className="text-5xl font-bold text-slate-900 dark:text-slate-50">{price}</span>
                <span className="text-slate-500 dark:text-slate-400">{isPro ? '/ month' : ''}</span>
            </div>
            <ul className="space-y-4 mb-8 flex-grow">
                {features.map((feature, i) => (
                    <FeatureListItem key={i}>{feature}</FeatureListItem>
                ))}
            </ul>
            <Button
                onClick={onSelect}
                variant={isPro ? 'primary' : 'secondary'}
                size="lg"
                className="w-full"
                disabled={isCurrent}
            >
                {isCurrent ? 'Current Plan' : (isPro ? 'Upgrade to Pro' : 'Switch to Free')}
            </Button>
        </motion.div>
    );
};


const UpgradePage: React.FC = () => {
    const { user, upgradeToPro, switchToFree } = useData();
    const currentTier = user?.subscription?.tier || 'free';

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-50 font-sora">
                    Find the Plan That's Right for You
                </h1>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Unlock powerful features to create a stunning portfolio and accelerate your career.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <PlanCard
                    tier="free"
                    title="Starter"
                    price="Free"
                    description="Perfect for getting started and building your first portfolio."
                    features={[
                        '1 Portfolio',
                        '1 free use of each AI text feature',
                        'AI Image Generation (Pro only)',
                        'Grooya Branding',
                        '.grooya.site domain',
                    ]}
                    isCurrent={currentTier === 'free'}
                    onSelect={switchToFree}
                />
                <PlanCard
                    tier="pro"
                    title="Pro"
                    price="$9"
                    description="For professionals who want to stand out and unlock all features."
                    features={[
                        '5 Portfolios',
                        '100 AI Text Credits / month',
                        '20 AI Image Credits / month',
                        'Connect 1 Custom Domain',
                        'Remove Grooya Branding',
                    ]}
                    isCurrent={currentTier === 'pro'}
                    onSelect={upgradeToPro}
                />
            </div>
        </div>
    );
};

export default UpgradePage;