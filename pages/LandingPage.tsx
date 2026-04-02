import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Sparkles, FileText, Palette, LayoutDashboard, ArrowRight, Check, ChevronDown } from 'lucide-react';
// FIX: The type `Variants` is not exported from framer-motion in some versions.
import { motion } from 'framer-motion';
import { portfolioTemplates } from '../services/templates';
import { defaultPalettes } from '../services/palettes';
import { useTranslation } from '../hooks/useTranslation';
import type { PortfolioTemplate } from '../types';
import { launchPlans } from '../services/platform/plans';

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


const AnimatedUIPreview: React.FC = () => {
    // FIX: Removed incorrect `Variants` type.
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.3, delayChildren: 0.5 } }
    };
    // FIX: Removed incorrect `Variants` type.
    const itemVariants = {
        hidden: { y: 10, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 100 } }
    };

    return (
        <motion.div 
            className="relative mt-12 max-w-4xl mx-auto"
            // FIX: Replaced spread props with direct props to fix framer-motion type error.
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="relative aspect-[16/10] bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl backdrop-blur-lg p-4">
                <div className="flex items-center gap-1.5 mb-3">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg h-[calc(100%-24px)] p-4 flex gap-4">
                    {/* Left Pane */}
                    <motion.div variants={itemVariants} className="w-1/3 bg-white dark:bg-slate-800/50 rounded-md p-2 space-y-2">
                        <div className="h-4 w-3/4 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                        <div className="h-3 w-1/2 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                        <div className="h-3 w-5/6 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                    </motion.div>
                    {/* Right Pane */}
                    <div className="w-2/3 space-y-3">
                        <motion.div variants={itemVariants} className="h-12 w-full rounded-md bg-white dark:bg-slate-800/50 flex items-center p-2">
                             <div className="w-8 h-8 rounded-full bg-cyan-200 dark:bg-cyan-900/50 mr-2"></div>
                             <div className="space-y-1 flex-grow">
                                <div className="h-2 w-1/3 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                                <div className="h-2 w-2/3 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                             </div>
                        </motion.div>
                        <motion.div variants={itemVariants} className="h-24 w-full rounded-md bg-white dark:bg-slate-800/50 p-2 space-y-1">
                            <div className="h-2 w-1/4 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                            <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700"></div>
                            <div className="h-2 w-5/6 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                            <div className="h-2 w-3/4 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

const FeatureShowcase: React.FC<{
    icon: React.ElementType;
    title: string;
    description: string;
    children: React.ReactNode;
    align: 'left' | 'right';
}> = ({ icon: Icon, title, description, children, align }) => (
    <div className={`grid md:grid-cols-2 gap-12 items-center ${align === 'right' ? 'md:grid-flow-col-dense' : ''}`}>
        <div className={align === 'right' ? 'md:col-start-2' : ''}>
            <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-100 dark:bg-cyan-900/50 rounded-lg mb-4">
                <Icon className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-50 font-sora mb-4">{title}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-lg">{description}</p>
        </div>
        <div className="relative">
            {children}
        </div>
    </div>
);


const TemplateVisual: React.FC<{ design: PortfolioTemplate['design'] }> = ({ design }) => {
    const palette = defaultPalettes.find(p => p.id === design.paletteId) || defaultPalettes[0];
    return (
        <div className="aspect-[4/3] p-4 flex flex-col gap-2 border-b border-slate-200 dark:border-slate-700" style={{ backgroundColor: palette.colors.background }}>
            <div className="flex justify-between items-center">
                <div className="w-1/4 h-3 rounded-full" style={{ backgroundColor: palette.colors.heading }}></div>
                <div className="flex gap-1">
                    <div className="w-8 h-3 rounded-full" style={{ backgroundColor: palette.colors.subtle }}></div>
                    <div className="w-8 h-3 rounded-full" style={{ backgroundColor: palette.colors.subtle }}></div>
                </div>
            </div>
            <div className="w-3/4 h-5 rounded" style={{ backgroundColor: design.accentColor }}></div>
            <div className="w-full h-3 rounded-full mt-2" style={{ backgroundColor: palette.colors.text }}></div>
            <div className="w-5/6 h-3 rounded-full" style={{ backgroundColor: palette.colors.text }}></div>
        </div>
    );
};

const FeatureListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-center gap-3">
        <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-teal-100 dark:bg-teal-900/50 rounded-full">
            <Check size={12} className="text-teal-600 dark:text-teal-400" />
        </div>
        <span className="text-slate-700 dark:text-slate-300">{children}</span>
    </li>
);

const PricingCard: React.FC<{
    tier: string;
    title: string;
    price: string;
    description: string;
    features: string[];
    isPopular?: boolean;
}> = ({ tier, title, price, description, features, isPopular = false }) => {
    return (
        <div className={`p-8 rounded-2xl border-2 flex flex-col relative overflow-hidden ${isPopular ? 'bg-slate-50 dark:bg-slate-900 border-teal-500' : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'}`}>
            {isPopular && <div className="absolute top-0 right-0 bg-teal-500 text-white text-xs font-bold px-8 py-1 -rotate-45 translate-x-1/3 translate-y-1/2">Most Popular</div>}
            <h3 className={`text-2xl font-bold font-sora ${isPopular ? 'text-teal-600 dark:text-teal-400' : 'text-slate-900 dark:text-slate-50'}`}>{title}</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-2 h-12">{description}</p>
            <div className="my-8">
                <span className="text-5xl font-bold text-slate-900 dark:text-slate-50">{price === '0' ? 'Free' : `$${price}`}</span>
                <span className="text-slate-500 dark:text-slate-400">{price !== '0' ? '/ month' : ''}</span>
            </div>
            <ul className="space-y-4 mb-8 flex-grow">
                {features.map((feature, i) => <FeatureListItem key={i}>{feature}</FeatureListItem>)}
            </ul>
             <Link to={tier === 'free' ? "/dashboard" : "/dashboard/upgrade"}>
                <Button variant={isPopular ? 'primary' : 'secondary'} size="lg" className="w-full">
                    {tier === 'free' ? 'Get Started' : `Choose ${title}`}
                </Button>
            </Link>
        </div>
    );
};

const faqs = [
    {
      q: 'What is Grooya?',
      a: 'Grooya is a portfolio and resume platform built for professionals who need results. It helps job seekers and freelancers publish stronger portfolios, present their work clearly, and turn attention into opportunities.'
    },
    {
      q: 'Who is this for?',
      a: 'Grooya is designed for developers, designers, marketers, consultants, and other professionals who need to show proof of work. It is especially useful for people trying to get hired or win freelance clients.'
    },
    {
      q: 'What makes Grooya different from a generic site builder?',
      a: 'Grooya focuses on portfolio outcomes, not just page design. The product guides users toward the right structure, stronger proof of work, recruiter-friendly presentation, better client conversion, and integrated resume support.'
    },
    {
      q: 'Do I need to know how to code?',
      a: 'Not at all! Grooya is a completely no-code platform. All customization is done through our intuitive visual editor. If you do know how to code, we offer a custom CSS block for advanced styling.'
    },
    {
      q: 'How does pricing work?',
      a: 'Grooya launches with Free, Starter, and Pro plans. The paid plans focus on practical advantages like removing branding, stronger analytics, better design controls, and custom domains instead of AI credits or one-time credit packs.'
    },
];

const LandingPage: React.FC = () => {
    const { t } = useTranslation();

    // FIX: Removed incorrect `Variants` type.
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
      }
    };

    // FIX: Removed incorrect `Variants` type.
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 100 } }
    };
    
    const heroMotionProps = {
        initial: "hidden",
        animate: "visible",
        variants: containerVariants,
    };

    const sectionMotionProps = {
        initial: { opacity: 0, y: 50 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.3 },
        transition: { duration: 0.5 },
    };

    const gridMotionProps = {
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, amount: 0.2 },
        variants: containerVariants,
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-24 pb-32 text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 dark:from-cyan-950/50 via-white dark:via-slate-950 to-amber-50 dark:to-amber-950/50 opacity-50"></div>
                 <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20800%22%3E%3Cg%20fill%3D%27none%27%20stroke%3D%27%23d1d5db%27%20stroke-width%3D%271%27%3E%3Cpath%20d%3D%27M769%20229L1037%20260.9M927%20880L731%20737%20520%20660%20309%20583%2078%20506%20140%20191%20413%20155%20700%20186%20769%20229z%27%2F%3E%3Cpath%20d%3D%27M310%2031L310%20880M400%2031L400%20880M500%2031L500%20880M600%2031L600%20880M700%2031L700%20880M800%2031L800%20880M900%2031L900%20880M1000%2031L1000%20880M1100%2031L1100%20880M1200%2031L1200%20880M1300%2031L1300%20880M1400%2031L1400%20880M1500%2031L1500%20880M1600%2031L1600%20880M1700%2031L1700%20880M1800%2031L1800%20880M1900%2031L1900%20880M2000%2031L2000%20880M2100%2031L2100%20880M2200%2031L2200%20880M2300%2031L2300%20880M2400%2031L2400%20880M2500%2031L2500%20880M2600%2031L2600%20880M2700%2031L2700%20880M2800%2031L2800%20880M2900%2031L2900%20880M3000%2031L3000%20880M3100%2031L3100%20880M3200%2031L3200%20880M3300%2031L3300%20880M3400%2031L3400%20880M3500%2031L3500%20880M3600%2031L3600%20880M3700%2031L3700%20880M3800%2031L3800%20880M3900%2031L3900%20880M4000%2031L4000%20880M4100%2031L4100%20880M4200%2031L4200%20880M4300%2031L4300%20880M4400%2031L4400%20880M4500%2031L4500%20880M4600%2031L4600%20880M4700%2031L4700%20880M4800%2031L4800%20880M4900%2031L4900%20880M5000%2031L5000%20880M5100%2031L5100%20880M5200%2031L5200%20880M5300%2031L5300%20880M5400%2031L5400%20880M5500%2031L5500%20880M5600%2031L5600%20880M5700%2031L5700%20880M5800%2031L5800%20880M5900%2031L5900%20880M6000%2031L6000%20880M6100%2031L6100%20880M6200%2031L6200%20880M6300%2031L6300%20880M6400%2031L6400%20880M6500%2031L6500%20880M6600%2031L6600%20880M6700%2031L6700%20880M6800%2031L6800%20880M6900%2031L6900%20880M7000%2031L7000%20880M7100%2031L7100%20880M7200%2031L7200%20880M7300%2031L7300%20880M7400%2031L7400%20880M7500%2031L7500%20880M7600%2031L7600%20880M7700%2031L7700%20880M7800%2031L7800%20880M7900%2031L7900%20880%3C%2Fg%3E%3C%2Fsvg%3E')] dark:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20800%22%3E%3Cg%20fill%3D%27none%27%20stroke%3D%27%23334155%27%20stroke-width%3D%271%27%3E%3Cpath%20d%3D%27M769%20229L1037%20260.9M927%20880L731%20737%20520%20660%20309%20583%2078%20506%20140%20191%20413%20155%20700%20186%20769%20229z%27%2F%3E%3Cpath%20d%3D%27M310%2031L310%20880M400%2031L400%20880M500%2031L500%20880M600%2031L600%20880M700%2031L700%20880M800%2031L800%20880M900%2031L900%20880M1000%2031L1000%20880M1100%2031L1100%20880M1200%2031L1200%20880M1300%2031L1300%20880M1400%2031L1400%20880M1500%2031L1500%20880M1600%2031L1600%20880M1700%2031L1700%20880M1800%2031L1800%20880M1900%2031L1900%20880M2000%2031L2000%20880M2100%2031L2100%20880M2200%2031L2200%20880M2300%2031L2300%20880M2400%2031L2400%20880M2500%2031L2500%20880M2600%2031L2600%20880M2700%2031L2700%20880M2800%2031L2800%20880M2900%2031L2900%20880M3000%2031L3000%20880M3100%2031L3100%20880M3200%2031L3200%20880M3300%2031L3300%20880M3400%2031L3400%20880M3500%2031L3500%20880M3600%2031L3600%20880M3700%2031L3700%20880M3800%2031L3800%20880M3900%2031L3900%20880M4000%2031L4000%20880M4100%2031L4100%20880M4200%2031L4200%20880M4300%2031L4300%20880M4400%2031L4400%20880M4500%2031L4500%20880M4600%2031L4600%20880M4700%2031L4700%20880M4800%2031L4800%20880M4900%2031L4900%20880M5000%2031L5000%20880M5100%2031L5100%20880M5200%2031L5200%20880M5300%2031L5300%20880M5400%2031L5400%20880M5500%2031L5500%20880M5600%2031L5600%20880M5700%2031L5700%20880M5800%2031L5800%20880M5900%2031L5900%20880M6000%2031L6000%20880M6100%2031L6100%20880M6200%2031L6200%20880M6300%2031L6300%20880M6400%2031L6400%20880M6500%2031L6500%20880M6600%2031L6600%20880M6700%2031L6700%20880M6800%2031L6800%20880M6900%2031L6900%20880M7000%2031L7000%20880M7100%2031L7100%20880M7200%2031L7200%20880M7300%2031L7300%20880M7400%2031L7400%20880M7500%2031L7500%20880M7600%2031L7600%20880M7700%2031L7700%20880M7800%2031L7800%20880M7900%2031L7900%20880%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20 dark:opacity-20"></div>

                <motion.div 
                    className="relative max-w-4xl mx-auto px-4"
                    {...heroMotionProps}
                >
                    <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-slate-50 font-sora">
                        Build a job-winning portfolio in <span className="text-cyan-500">minutes</span>.
                    </motion.h1>
                    <motion.p variants={itemVariants} className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-slate-600 dark:text-slate-400">
                        Publish a portfolio that wins opportunities. Grooya helps job seekers and freelancers turn their work, services, and resume into a clearer professional story.
                    </motion.p>
                    <motion.div variants={itemVariants} className="mt-10">
                        <Link to="/dashboard">
                            <Button size="lg" variant="primary">
                                Get Started for Free
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>
                <AnimatedUIPreview />
            </section>

            {/* Features Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
                    <motion.div {...sectionMotionProps}>
                        <FeatureShowcase
                            align="left"
                            icon={Sparkles}
                            title="Guided structure, not guesswork"
                            description="Start with a portfolio flow designed for either getting hired or getting clients. Grooya helps you show the right proof, organize it clearly, and launch with confidence."
                        >
                            <img src="https://images.unsplash.com/photo-1611117775350-ac3950943898?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="Guided portfolio building" className="rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800" />
                        </FeatureShowcase>
                    </motion.div>

                     <motion.div {...sectionMotionProps}>
                        <FeatureShowcase
                            align="right"
                            icon={FileText}
                            title="A resume that stays connected"
                            description="Turn your portfolio into an editable resume draft, keep multiple versions, and present your experience in a format recruiters can scan quickly."
                        >
                             <img src="https://images.unsplash.com/photo-1554224155-1696413565d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="Resume builder" className="rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800" />
                        </FeatureShowcase>
                    </motion.div>

                    <motion.div {...sectionMotionProps}>
                         <FeatureShowcase
                            align="left"
                            icon={Palette}
                            title="Design control with a professional point of view"
                            description="Customize your site deeply when you need to, but start from intentional defaults that already look polished on desktop and mobile."
                        >
                            <img src="https://images.unsplash.com/photo-1553877522-c36980345985?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="Design Customization" className="rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800" />
                        </FeatureShowcase>
                    </motion.div>
                </div>
            </section>
            
             {/* Template Showcase Section */}
            <section className="py-24 bg-slate-100 dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        className="text-center"
                        {...sectionMotionProps}
                    >
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-50 font-sora">Start with a World-Class Design</h2>
                        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                            Choose a professionally designed template and customize it to make it your own.
                        </p>
                    </motion.div>
                    <motion.div 
                        className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                        {...gridMotionProps}
                    >
                        {portfolioTemplates.slice(0, 6).map(template => (
                             <motion.div variants={itemVariants} key={template.id}>
                                <Link to={`/templates/${template.id}`} className="block group">
                                    <div className="h-full rounded-xl overflow-hidden shadow-lg hover:shadow-cyan-500/10 dark:hover:shadow-cyan-400/10 transition-all duration-300 transform hover:-translate-y-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                        <TemplateVisual design={template.design} />
                                        <div className="p-6">
                                            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 font-sora">{t(template.name)}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 h-10">{t(template.description)}</p>
                                            <span className="mt-4 text-sm font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                Preview Template <ArrowRight size={16} />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

             {/* Pricing Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        className="text-center"
                        {...sectionMotionProps}
                    >
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-50 font-sora">Simple, Transparent Pricing</h2>
                        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                            Choose the plan that's right for you.
                        </p>
                    </motion.div>
                    <motion.div 
                        className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
                        {...gridMotionProps}
                    >
                        <motion.div variants={itemVariants}>
                            <PricingCard
                                tier="free"
                                title={launchPlans.free.title}
                                price="0"
                                description="Start publishing your professional presence for free."
                                features={launchPlans.free.features}
                            />
                        </motion.div>
                         <motion.div variants={itemVariants}>
                            <PricingCard
                                tier="pro"
                                title={launchPlans.pro.title}
                                price={String(launchPlans.pro.monthlyPriceUsd)}
                                description="Run your portfolio like a serious professional brand."
                                features={launchPlans.pro.features}
                                isPopular={true}
                            />
                        </motion.div>
                         <motion.div variants={itemVariants}>
                            <PricingCard
                                tier="starter"
                                title={launchPlans.starter.title}
                                price={String(launchPlans.starter.monthlyPriceUsd)}
                                description="Look polished and convert more opportunities."
                                features={launchPlans.starter.features}
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

             {/* FAQ Section */}
            <section className="py-24 bg-slate-100 dark:bg-slate-900">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        className="text-center"
                        {...sectionMotionProps}
                    >
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-50 font-sora">Frequently Asked Questions</h2>
                    </motion.div>
                    <motion.div 
                        className="mt-12 space-y-4"
                        {...gridMotionProps}
                    >
                        {faqs.map((faq, i) => (
                             <motion.div variants={itemVariants} key={i}>
                                <details className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 group">
                                    <summary className="font-semibold text-lg cursor-pointer flex justify-between items-center text-slate-900 dark:text-slate-100">
                                        {faq.q}
                                        <ChevronDown className="details-arrow text-slate-500"/>
                                    </summary>
                                    <p className="mt-4 text-slate-600 dark:text-slate-400">{faq.a}</p>
                                </details>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
            
            {/* CTA Section */}
            <section className="py-24">
                 <motion.div 
                    className="max-w-4xl mx-auto px-4 text-center"
                    {...sectionMotionProps}
                >
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-50 font-sora">Ready to build your future?</h2>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                        Build a portfolio that helps people understand your value fast, whether you are trying to get hired or win the next client.
                    </p>
                    <Link to="/dashboard" className="mt-8 inline-block">
                        <Button size="lg" variant="primary">
                           Start Building Now
                           <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </Link>
                </motion.div>
            </section>

        </div>
    );
};

export default LandingPage;
