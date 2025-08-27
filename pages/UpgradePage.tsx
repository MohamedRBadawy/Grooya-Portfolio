

import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import Button from '../components/ui/Button';
import { Check, Sparkles, ArrowRight, LifeBuoy } from 'lucide-react';
import { motion } from 'framer-motion';

const plansData = {
  monthly: {
    USD: [
      { tier: 'free', title: 'Free', price: '0', description: 'For personal use & students.', features: ['1 Portfolio', '1 Resume', '1 free use per AI text feature', 'Standard Blocks & Design', 'Grooya Branding'] },
      { tier: 'starter', title: 'Starter', price: '5', description: 'For professionals getting started.', features: ['3 Portfolios', '3 Resumes', '50 AI Text Credits / month', '10 AI Image Credits / month', 'Remove Branding'] },
      { tier: 'pro', title: 'Pro', price: '15', description: 'For serious professionals & freelancers.', features: ['10 Portfolios', 'Unlimited Resumes', '150 AI Text Credits / month', '30 AI Image Credits / month', 'Pro Blocks & Design Tools', 'Custom Domain', 'ATS Optimization'] },
      { tier: 'premium', title: 'Premium', price: '30', description: 'For power users & agencies.', features: ['Unlimited Portfolios', 'Unlimited Resumes', '500 AI Text Credits / month', '100 AI Image Credits / month', 'Bilingual Sites', 'Advanced Analytics'] },
    ],
    EGP: [
      { tier: 'free', title: 'Free', price: '0', description: 'للاستخدام الشخصي والطلاب.', features: ['ملف شخصي واحد', 'سيرة ذاتية واحدة', 'استخدام مجاني واحد لكل ميزة ذكاء اصطناعي', 'أقسام وتصاميم قياسية', 'علامة Grooya التجارية'] },
      { tier: 'starter', title: 'Starter', price: '200', description: 'للمحترفين الذين يبدأون للتو.', features: ['3 ملفات شخصية', '3 سير ذاتية', '50 رصيد نصي AI / شهر', '10 أرصدة صور AI / شهر', 'إزالة العلامة التجارية'] },
      { tier: 'pro', title: 'Pro', price: '450', description: 'للمحترفين الجادين والمستقلين.', features: ['10 ملفات شخصية', 'سير ذاتية غير محدودة', '150 رصيد نصي AI / شهر', '30 رصيد صور AI / شهر', 'أقسام وتصاميم احترافية', 'نطاق مخصص', 'تحسين ATS'] },
      { tier: 'premium', title: 'Premium', price: '800', description: 'للمستخدمين المتقدمين والوكالات.', features: ['ملفات شخصية غير محدودة', 'سير ذاتية غير محدودة', '500 رصيد نصي AI / شهر', '100 رصيد صور AI / شهر', 'مواقع ثنائية اللغة', 'تحليلات متقدمة'] },
    ]
  },
  annual: {
    USD: [
      { tier: 'free', title: 'Free', price: '0', description: 'For personal use & students.', features: ['1 Portfolio', '1 Resume', '1 free use per AI text feature', 'Standard Blocks & Design', 'Grooya Branding'] },
      { tier: 'starter', title: 'Starter', price: '50', description: 'For professionals getting started.', features: ['3 Portfolios', '3 Resumes', '50 AI Text Credits / month', '10 AI Image Credits / month', 'Remove Branding'] },
      { tier: 'pro', title: 'Pro', price: '150', description: 'For serious professionals & freelancers.', features: ['10 Portfolios', 'Unlimited Resumes', '150 AI Text Credits / month', '30 AI Image Credits / month', 'Pro Blocks & Design Tools', 'Custom Domain', 'ATS Optimization'] },
      { tier: 'premium', title: 'Premium', price: '300', description: 'For power users & agencies.', features: ['Unlimited Portfolios', 'Unlimited Resumes', '500 AI Text Credits / month', '100 AI Image Credits / month', 'Bilingual Sites', 'Advanced Analytics'] },
    ],
    EGP: [
        { tier: 'free', title: 'Free', price: '0', description: 'للاستخدام الشخصي والطلاب.', features: ['ملف شخصي واحد', 'سيرة ذاتية واحدة', 'استخدام مجاني واحد لكل ميزة ذكاء اصطناعي', 'أقسام وتصاميم قياسية', 'علامة Grooya التجارية'] },
        { tier: 'starter', title: 'Starter', price: '2000', description: 'للمحترفين الذين يبدأون للتو.', features: ['3 ملفات شخصية', '3 سير ذاتية', '50 رصيد نصي AI / شهر', '10 أرصدة صور AI / شهر', 'إزالة العلامة التجارية'] },
        { tier: 'pro', title: 'Pro', price: '4500', description: 'للمحترفين الجادين والمستقلين.', features: ['10 ملفات شخصية', 'سير ذاتية غير محدودة', '150 رصيد نصي AI / شهر', '30 رصيد صور AI / شهر', 'أقسام وتصاميم احترافية', 'نطاق مخصص', 'تحسين ATS'] },
        { tier: 'premium', title: 'Premium', price: '8000', description: 'للمستخدمين المتقدمين والوكالات.', features: ['ملفات شخصية غير محدودة', 'سير ذاتية غير محدودة', '500 رصيد نصي AI / شهر', '100 رصيد صور AI / شهر', 'مواقع ثنائية اللغة', 'تحليلات متقدمة'] },
    ]
  }
};

const Toggle: React.FC<{ options: {label: string, value: string}[], selected: string, setSelected: (value: string) => void }> = ({ options, selected, setSelected }) => {
    return (
        <div className="flex items-center gap-1 p-1 bg-slate-200 dark:bg-slate-800 rounded-full">
            {options.map(opt => (
                <button 
                    key={opt.value}
                    onClick={() => setSelected(opt.value)}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${selected === opt.value ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    )
}

const FeatureListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start gap-3">
        <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-teal-100 dark:bg-teal-900/50 rounded-full mt-0.5">
            <Check size={12} className="text-teal-600 dark:text-teal-400" />
        </div>
        <span className="text-slate-700 dark:text-slate-300">{children}</span>
    </li>
);

const PlanCard: React.FC<{
    plan: any;
    isCurrent: boolean;
    onSelect: () => void;
    isPopular?: boolean;
    currency: 'USD' | 'EGP';
    billing: 'monthly' | 'annual';
}> = ({ plan, isCurrent, onSelect, isPopular = false, currency, billing }) => {
    
    const priceSuffix = billing === 'monthly' ? '/mo' : '/yr';
    const currencySymbol = currency === 'USD' ? '$' : 'EGP ';

    const motionProps: any = {
        whileHover: { y: -5, scale: 1.02 },
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
    };
    
    return (
        <motion.div 
            className={`p-6 rounded-2xl border-2 flex flex-col relative overflow-hidden ${isPopular ? 'bg-slate-50 dark:bg-slate-900 border-teal-500' : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'}`}
            {...motionProps}
        >
            {isPopular && <div className="absolute top-0 right-0 bg-teal-500 text-white text-xs font-bold px-8 py-1 -rotate-45 translate-x-1/3 translate-y-1/2">Most Popular</div>}
            <h3 className={`text-xl font-bold font-sora ${isPopular ? 'text-teal-600 dark:text-teal-400' : 'text-slate-900 dark:text-slate-50'}`}>{plan.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1 h-10">{plan.description}</p>
            <div className="my-6">
                <span className="text-4xl font-bold text-slate-900 dark:text-slate-50">{plan.price === '0' ? 'Free' : `${currencySymbol}${plan.price}`}</span>
                {plan.price !== '0' && <span className="text-slate-500 dark:text-slate-400"> {priceSuffix}</span>}
            </div>
            <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature: string, i: number) => (
                    <FeatureListItem key={i}>{feature}</FeatureListItem>
                ))}
            </ul>
            <Button
                onClick={onSelect}
                variant={isPopular ? 'primary' : 'secondary'}
                size="lg"
                className="w-full"
                disabled={isCurrent}
            >
                {isCurrent ? 'Current Plan' : `Choose ${plan.title}`}
            </Button>
        </motion.div>
    );
};

const OneTimePurchaseCard: React.FC<{
    title: string;
    description: string;
    price: string;
    onPurchase: () => void;
    icon: React.ElementType;
    isPurchased?: boolean;
    currency?: 'USD' | 'EGP';
}> = ({ title, description, price, onPurchase, icon: Icon, isPurchased = false, currency = 'USD' }) => (
    <div className={`p-6 rounded-2xl border-2 flex flex-col bg-white dark:bg-slate-900 ${isPurchased ? 'border-green-500' : 'border-slate-200 dark:border-slate-700'}`}>
        <div className="flex items-center gap-3 mb-2">
            <Icon className="w-6 h-6 text-amber-500" />
            <h3 className="text-xl font-bold font-sora text-slate-900 dark:text-slate-50">{title}</h3>
        </div>
        <p className="text-slate-600 dark:text-slate-400 flex-grow">{description}</p>
        <div className="flex items-center justify-between mt-6">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-50">{price} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">/ one-time</span></span>
            <Button onClick={onPurchase} variant="secondary" disabled={isPurchased}>
                {isPurchased ? 'Purchased' : 'Purchase'}
            </Button>
        </div>
    </div>
);

const UpgradePage: React.FC = () => {
    const { user, upgradeToStarter, upgradeToPro, upgradeToPremium, switchToFree, applyPromoCode, makeOneTimePurchase } = useData();
    const currentTier = user?.subscription?.tier || 'free';
    const [promoCode, setPromoCode] = useState('');
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
    const [currency, setCurrency] = useState<'USD' | 'EGP'>('USD');

    const handleApplyPromo = () => {
        if(promoCode) {
            applyPromoCode(promoCode);
        }
    };
    
    const displayedPlans = plansData[billingCycle][currency];
    const upgradeActions: { [key: string]: () => void } = {
        'free': switchToFree,
        'starter': upgradeToStarter,
        'pro': upgradeToPro,
        'premium': upgradeToPremium
    };
    
    const hasLifetime = user?.oneTimePurchases?.includes('proLifetime');

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-50 font-sora">
                    Find the Plan That's Right for You
                </h1>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Unlock powerful features to create a stunning portfolio and accelerate your career.
                </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                 <Toggle options={[{label: 'Monthly', value: 'monthly'}, {label: 'Annual (Save 15%)', value: 'annual'}]} selected={billingCycle} setSelected={setBillingCycle as any} />
                 <Toggle options={[{label: 'USD', value: 'USD'}, {label: 'EGP', value: 'EGP'}]} selected={currency} setSelected={setCurrency as any} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayedPlans.map((plan, index) => (
                    <PlanCard
                        key={plan.tier}
                        plan={plan}
                        isCurrent={currentTier === plan.tier}
                        onSelect={upgradeActions[plan.tier]}
                        isPopular={plan.tier === 'pro'}
                        currency={currency}
                        billing={billingCycle}
                    />
                ))}
            </div>

            <div className="mt-16">
                 <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 font-sora">
                        One-Time Purchases
                    </h2>
                    <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                        For those who prefer not to subscribe.
                    </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    <OneTimePurchaseCard 
                        icon={LifeBuoy}
                        title="Pro for Life"
                        description="Get all Pro features, forever. A single payment for lifetime access to our professional toolkit."
                        price={currency === 'USD' ? '$199' : 'EGP 5000'}
                        onPurchase={() => makeOneTimePurchase('proLifetime')}
                        isPurchased={hasLifetime}
                        currency={currency}
                    />
                     <OneTimePurchaseCard 
                        icon={Sparkles}
                        title="AI Text Credits"
                        description="Top up your account with a bundle of 50 AI text generation credits. Perfect for when you need an extra creative boost."
                        price={currency === 'USD' ? '$5' : 'EGP 150'}
                        onPurchase={() => makeOneTimePurchase('creditsTextTier1')}
                        currency={currency}
                    />
                     <OneTimePurchaseCard 
                        icon={Sparkles}
                        title="AI Image Credits"
                        description="Need more visuals? Purchase a pack of 10 AI image generation credits to create stunning, unique assets for your portfolio."
                        price={currency === 'USD' ? '$10' : 'EGP 300'}
                        onPurchase={() => makeOneTimePurchase('creditsImageTier1')}
                        currency={currency}
                    />
                </div>
            </div>
            
            <div className="max-w-xl mx-auto mt-16 text-center p-6 bg-amber-100/50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-2xl">
                <h4 className="font-semibold text-amber-800 dark:text-amber-200">Are you an Early Adopter?</h4>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">Enter your promo code to unlock exclusive perks.</p>
                 <div className="mt-4 flex gap-2 justify-center">
                    <input 
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="e.g., GROOYA-ALPHA"
                        className="w-full max-w-xs bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded-lg shadow-sm sm:text-sm focus:ring-amber-500 focus:border-amber-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                    />
                    <Button variant="secondary" onClick={handleApplyPromo} disabled={!promoCode}>Apply <ArrowRight size={16} className="ml-1.5"/></Button>
                </div>
            </div>
        </div>
    );
};

export default UpgradePage;