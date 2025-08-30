import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import Button from '../components/ui/Button';
import { BarChartHorizontal, Users, Clock, ExternalLink, Globe, ArrowRight, Eye } from 'lucide-react';
// FIX: Import AnimatePresence
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/ui/Card';

const StatCard: React.FC<{ title: string, value: string, icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
    <Card className="!shadow-sm">
        <div className="p-6">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-1">{value}</p>
                </div>
                 <div className="w-10 h-10 flex items-center justify-center bg-cyan-100 dark:bg-cyan-900/50 rounded-lg">
                    <Icon className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                </div>
            </div>
        </div>
    </Card>
);

const UpgradeToPremium: React.FC = () => {
    return (
        <div className="h-full flex items-center justify-center">
            <div className="text-center p-8 max-w-lg">
                <div className="w-16 h-16 mx-auto flex items-center justify-center bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full mb-4">
                    <BarChartHorizontal size={32} className="text-white"/>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 font-sora">Unlock Advanced Analytics</h2>
                <p className="mt-4 text-slate-600 dark:text-slate-400">
                    See who's viewing your portfolio, where they're coming from, and how they're engaging with your content. Upgrade to Premium to access detailed analytics and gain a competitive edge.
                </p>
                <Link to="/dashboard/upgrade">
                    <Button variant="primary" size="lg" className="mt-8">
                        Upgrade to Premium <ArrowRight size={18} className="ml-2"/>
                    </Button>
                </Link>
            </div>
        </div>
    );
};

const AnalyticsDashboard: React.FC = () => {
    return (
         <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 font-sora">Portfolio Analytics</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Insights into your portfolio's performance.</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                <StatCard title="Total Views" value="1,287" icon={Eye} />
                <StatCard title="Unique Visitors" value="945" icon={Users} />
                <StatCard title="Avg. Time on Page" value="2m 15s" icon={Clock} />
                <StatCard title="Top Referrer" value="LinkedIn" icon={ExternalLink} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                {/* Traffic Over Time */}
                <Card className="lg:col-span-2 !shadow-sm">
                    <div className="p-6">
                        <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">Views (Last 30 Days)</h3>
                        <div className="mt-4 h-64 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                            <p className="text-slate-500 dark:text-slate-400 text-sm">[Chart Placeholder]</p>
                        </div>
                    </div>
                </Card>
                {/* Visitors by Country */}
                <Card className="!shadow-sm">
                     <div className="p-6">
                        <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                           <Globe size={18}/> Visitors by Country
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex justify-between items-center"><span>🇺🇸 United States</span> <span className="font-semibold">62%</span></li>
                            <li className="flex justify-between items-center"><span>🇬🇧 United Kingdom</span> <span className="font-semibold">15%</span></li>
                            <li className="flex justify-between items-center"><span>🇩🇪 Germany</span> <span className="font-semibold">8%</span></li>
                            <li className="flex justify-between items-center"><span>🇮🇳 India</span> <span className="font-semibold">5%</span></li>
                            <li className="flex justify-between items-center"><span>Others</span> <span className="font-semibold">10%</span></li>
                        </ul>
                     </div>
                </Card>
            </div>
        </div>
    )
}

const AnalyticsPage: React.FC = () => {
    const { entitlements } = useData();

    return (
        <div className="h-full">
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={entitlements.advancedAnalytics ? 'dashboard' : 'upgrade'}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.2 }}
                    >
                        {entitlements.advancedAnalytics ? <AnalyticsDashboard /> : <UpgradeToPremium />}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default AnalyticsPage;