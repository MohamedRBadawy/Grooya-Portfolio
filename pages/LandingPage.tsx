
import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM;
import Button from '../components/ui/Button';
import { Sparkles, FileText, Image as ImageIcon, PenSquare, ArrowRight, Check, ChevronDown } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { portfolioTemplates } from '../services/templates';
import { defaultPalettes } from '../services/palettes';
import { useTranslation } from '../hooks/useTranslation';
import type { PortfolioTemplate } from '../types';

const FeatureCard: React.FC<{ icon: React.ElementType; title: string; description: string }> = ({ icon: Icon, title, description }) => (
    <div className="bg-white/30 dark:bg-slate-900/30 p-6 rounded-xl border border-slate-200/30 dark:border-slate-800/30 shadow-lg backdrop-blur-sm h-full">
        <div className="flex items-center justify-center w-12 h-12 bg-cyan-100 dark:bg-cyan-900/50 rounded-lg mb-4">
            <Icon className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 font-sora mb-2">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400">{description}</p>
    </div>
);

const TemplateVisual: React.FC<{ design: PortfolioTemplate['design'] }> = ({ design }) => {
    const palette = defaultPalettes.find(p => p.id === design.paletteId) || defaultPalettes[0];
    return (
        <div className="aspect-video p-4 flex flex-col gap-2 border-b border-slate-200 dark:border-slate-700" style={{ backgroundColor: palette.colors.background }}>
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
    tier: 'free' | 'pro';
    title: string;
    price: string;
    description: string;
    features: string[];
}> = ({ tier, title, price, description, features }) => {
    const isPro = tier === 'pro';
    return (
        <div className={`p-8 rounded-2xl border-2 flex flex-col ${isPro ? 'bg-slate-50 dark:bg-slate-900 border-teal-500' : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'}`}>
            <h3 className={`text-2xl font-bold font-sora ${isPro ? 'text-teal-600 dark:text-teal-400' : 'text-slate-900 dark:text-slate-50'}`}>{title}</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-2">{description}</p>
            <div className="my-8">
                <span className="text-5xl font-bold text-slate-900 dark:text-slate-50">{price}</span>
                <span className="text-slate-500 dark:text-slate-400">{isPro ? '/ month' : ''}</span>
            </div>
            <ul className="space-y-4 mb-8 flex-grow">
                {features.map((feature, i) => <FeatureListItem key={i}>{feature}</FeatureListItem>)}
            </ul>
             <Link to="/dashboard">
                <Button variant={isPro ? 'primary' : 'secondary'} size="lg" className="w-full">
                    {isPro ? 'Upgrade to Pro' : 'Get Started'}
                </Button>
            </Link>
        </div>
    );
};

const faqs = [
    {
      q: 'What is Grooya?',
      a: 'Grooya is an AI-powered Career Operating System designed to help tech-savvy professionals build stunning portfolios, craft tailored resumes, and manage their career assets in one integrated platform. It uses generative AI to simplify and accelerate the entire process.'
    },
    {
      q: 'Who is this for?',
      a: 'Grooya is built for software developers, UX/UI designers, product managers, data scientists, and any professional who needs to showcase a body of work. It\'s perfect for those seeking new job opportunities or attracting freelance clients.'
    },
    {
      q: 'How does the AI help?',
      a: 'Our AI, powered by Google\'s Gemini models, acts as your creative co-pilot. It can generate professional headlines, write compelling project descriptions, suggest design themes, create unique background images from text, and even tailor your resume for a specific job description.'
    },
    {
      q: 'Do I need to know how to code?',
      a: 'Not at all! Grooya is a completely no-code platform. All customization is done through our intuitive visual editor. If you do know how to code, we offer a custom CSS block for advanced styling.'
    },
    {
      q: 'Is the Starter plan really free?',
      a: 'Yes, the Starter plan is completely free and is not a trial. It provides everything you need to build and publish a professional one-page portfolio. You can upgrade to a Pro plan at any time to unlock more powerful features.'
    },
];

const LandingPage: React.FC = () => {
    const { t } = useTranslation();

    const containerVariants: Variants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
      }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-24 pb-32 text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 dark:from-cyan-950/50 via-white dark:via-slate-950 to-amber-50 dark:to-amber-950/50 opacity-50"></div>
                 <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20800%22%3E%3Cg%20fill%3D%27none%27%20stroke%3D%27%23d1d5db%27%20stroke-width%3D%271%27%3E%3Cpath%20d%3D%27M769%20229L1037%20260.9M927%20880L731%20737%20520%20660%20309%20583%2078%20506%20140%20191%20413%20155%20700%20186%20769%20229z%27%2F%3E%3Cpath%20d%3D%27M310%2031L310%20880M400%2031L400%20880M500%2031L500%20880M600%2031L600%20880M700%2031L700%20880M800%2031L800%20880M900%2031L900%20880M1000%2031L1000%20880M1100%2031L1100%20880M1200%2031L1200%20880M1300%2031L1300%20880M1400%2031L1400%20880M1500%2031L1500%20880M1600%2031L1600%20880M1700%2031L1700%20880M1800%2031L1800%20880M1900%2031L1900%20880M2000%2031L2000%20880M2100%2031L2100%20880M2200%2031L2200%20880M2300%2031L2300%20880M2400%2031L2400%20880M2500%2031L2500%20880M2600%2031L2600%20880M2700%2031L2700%20880M2800%2031L2800%20880M2900%2031L2900%20880M3000%2031L3000%20880M3100%2031L3100%20880M3200%2031L3200%20880M3300%2031L3300%20880M3400%2031L3400%20880M3500%2031L3500%20880M3600%2031L3600%20880M3700%2031L3700%20880M3800%2031L3800%20880M3900%2031L3900%20880M4000%2031L4000%20880M4100%2031L4100%20880M4200%2031L4200%20880M4300%2031L4300%20880M4400%2031L4400%20880M4500%2031L4500%20880M4600%2031L4600%20880M4700%2031L4700%20880M4800%2031L4800%20880M4900%2031L4900%20880M5000%2031L5000%20880M5100%2031L5100%20880M5200%2031L5200%20880M5300%2031L5300%20880M5400%2031L5400%20880M5500%2031L5500%20880M5600%2031L5600%20880M5700%2031L5700%20880M5800%2031L5800%20880M5900%2031L5900%20880M6000%2031L6000%20880M6100%2031L6100%20880M6200%2031L6200%20880M6300%2031L6300%20880M6400%2031L6400%20880M6500%2031L6500%20880M6600%2031L6600%20880M6700%2031L6700%20880M6800%2031L6800%20880M6900%2031L6900%20880M7000%2031L7000%20880M7100%2031L7100%20880M7200%2031L7200%20880M7300%2031L7300%20880M7400%2031L7400%20880M7500%2031L7500%20880M7600%2031L7600%20880M7700%2031L7700%20880M7800%2031L7800%20880M7900%2031L7900%20880%3C%2Fg%3E%3C%2Fsvg%3E')] dark:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20800%22%3E%3Cg%20fill%3D%27none%27%20stroke%3D%27%23334155%27%20stroke-width%3D%271%27%3E%3Cpath%20d%3D%27M769%20229L1037%20260.9M927%20880L731%20737%20520%20660%20309%20583%2078%20506%20140%20191%20413%20155%20700%20186%20769%20229z%27%2F%3E%3Cpath%20d%3D%27M310%2031L310%20880M400%2031L400%20880M500%2031L500%20880M600%2031L600%20880M700%2031L700%20880M800%2031L800%20880M900%2031L900%20880M1000%2031L1000%20880M1100%2031L1100%20880M1200%2031L1200%20880M1300%2031L1300%20880M1400%2031L1400%20880M1500%2031L1500%20880M1600%2031L1600%20880M1700%2031L1700%20880M1800%2031L1800%20880M1900%2031L1900%20880M2000%2031L2000%20880M2100%2031L2100%20880M2200%2031L2200%20880M2300%2031L2300%20880M2400%2031L2400%20880M2500%2031L2500%20880M2600%2031L2600%20880M2700%2031L2700%20880M2800%2031L2800%20880M2900%2031L2900%20880M3000%2031L3000%20880M3100%2031L3100%20880M3200%2031L3200%20880M3300%2031L3300%20880M3400%2031L3400%20880M3500%2031L3500%20880M3600%2031L3600%20880M3700%2031L3700%20880M3800%2031L3800%20880M3900%2031L3900%20880M4000%2031L4000%20880M4100%2031L4100%20880M4200%2031L4200%20880M4300%2031L4300%20880M4400%2031L4400%20880M4500%2031L4500%20880M4600%2031L4600%20880M4700%2031L4700%20880M4800%2031L4800%20880M4900%2031L4900%20880M5000%2031L5000%20880M5100%2031L5100%20880M5200%2031L5200%20880M5300%2031L5300%20880M5400%2031L5400%20880M5500%2031L5500%20880M5600%2031L5600%20880M5700%2031L5700%20880M5800%2031L5800%20880M5900%2031L5900%20880M6000%2031L6000%20880M6100%2031L6100%20880M6200%2031L6200%20880M6300%2031L6300%20880M6400%2031L6400%20880M6500%2031L6500%20880M6600%2031L6600%20880M6700%2031L6700%20880M6800%2031L6800%20880M6900%2031L6900%20880M7000%2031L7000%20880M7100%2031L7100%20880M7200%2031L7200%20880M7300%2031L7300%20880M7400%2031L7400%20880M7500%2031L7500%20880M7600%2031L7600%20880M7700%2031L7700%20880M7800%2031L7800%20880M7900%2031L7900%20880%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20 dark:opacity-20"></div>

                <motion.div 
                    className="relative max-w-4xl mx-auto px-4"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-slate-50 font-sora">
                        The AI-Powered <span className="text-cyan-500">Career Operating System</span>
                    </motion.h1>
                    <motion.p variants={itemVariants} className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-slate-600 dark:text-slate-400">
                        Stop juggling tools. Grooya integrates your learning, projects, and portfolio into one intelligent platform to help you build and showcase your skills.
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
            </section>

            {/* Features Section */}
            <section className="py-24 bg-slate-100 dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-50 font-sora">Everything you need to grow your career</h2>
                        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                            From your first line of code to your dream job offer.
                        </p>
                    </motion.div>

                    <motion.div 
                        className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={containerVariants}
                    >
                        <motion.div variants={itemVariants}>
                            <FeatureCard 
                                icon={PenSquare}
                                title="AI-Guided Portfolios"
                                description="Build beautiful, professional portfolios with an AI mentor that guides you every step of the way, from content to design."
                            />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <FeatureCard 
                                icon={FileText}
                                title="Intelligent Resumes"
                                description="Generate tailored resumes from your portfolio data and use AI to optimize them for specific job descriptions."
                            />
                        </motion.div>
                         <motion.div variants={itemVariants}>
                             <FeatureCard 
                                icon={Sparkles}
                                title="Content Co-Pilot"
                                description="Beat writer's block. Let AI generate compelling headlines, project descriptions, and professional summaries for you."
                            />
                        </motion.div>
                         <motion.div variants={itemVariants}>
                             <FeatureCard 
                                icon={ImageIcon}
                                title="AI Asset Generation"
                                description="Create unique background images and hero visuals from simple text prompts, right inside the editor."
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </section>
            
             {/* Template Showcase Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-50 font-sora">Start with a World-Class Design</h2>
                        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                            Choose a professionally designed template and customize it to make it your own.
                        </p>
                    </motion.div>
                    <motion.div 
                        className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={containerVariants}
                    >
                        {portfolioTemplates.slice(0, 6).map(template => (
                             <motion.div variants={itemVariants} key={template.id}>
                                <Link to={`/templates/${template.id}`} className="block group">
                                    <div className="h-full rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
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
            <section className="py-24 bg-slate-100 dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-50 font-sora">Simple, Transparent Pricing</h2>
                        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                            Choose the plan that's right for you.
                        </p>
                    </motion.div>
                    <motion.div 
                        className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={containerVariants}
                    >
                        <motion.div variants={itemVariants}>
                            <PricingCard
                                tier="free"
                                title="Starter"
                                price="Free"
                                description="Perfect for getting started and building your first portfolio."
                                features={[ '1 Portfolio', '1 free use of each AI text feature', 'AI Image Generation (Pro only)', 'Grooya Branding', '.grooya.site domain', ]}
                            />
                        </motion.div>
                         <motion.div variants={itemVariants}>
                            <PricingCard
                                tier="pro"
                                title="Pro"
                                price="$9"
                                description="For professionals who want to stand out and unlock all features."
                                features={[ '5 Portfolios', '100 AI Text Credits / month', '20 AI Image Credits / month', 'Connect 1 Custom Domain', 'Remove Grooya Branding', ]}
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

             {/* FAQ Section */}
            <section className="py-24">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-50 font-sora">Frequently Asked Questions</h2>
                    </motion.div>
                    <motion.div 
                        className="mt-12 space-y-4"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={containerVariants}
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
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-50 font-sora">Ready to build your future?</h2>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                        Start building your portfolio today. No credit card required.
                    </p>
                    <div className="mt-8">
                         <Link to="/dashboard">
                            <Button size="lg" variant="primary">
                                Launch Your Career
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default LandingPage;