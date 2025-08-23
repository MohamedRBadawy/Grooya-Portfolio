
import React, { useMemo } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM;
import { initialPortfolios, mockAllUsers, initialResumes, initialProjects } from '../../services/mockData';
import { Users, FolderKanban, FileText, CheckCircle, Gem, Package } from 'lucide-react';

const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ElementType;
    change?: string;
    changeType?: 'increase' | 'decrease';
}> = ({ title, value, icon: Icon, change, changeType }) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-1">{value}</p>
            {change && (
                <p className={`text-xs mt-1 ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                    {change}
                </p>
            )}
        </div>
        <div className="w-12 h-12 flex items-center justify-center bg-cyan-100 dark:bg-cyan-900/50 rounded-full">
            <Icon className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
        </div>
    </div>
);

const AdminDashboardPage: React.FC = () => {
    const stats = useMemo(() => {
        const totalUsers = mockAllUsers.length;
        const proUsers = mockAllUsers.filter(u => u.subscription?.tier === 'pro').length;
        const totalPortfolios = initialPortfolios.length;
        const publishedPortfolios = initialPortfolios.filter(p => p.isPublished).length;
        return {
            totalUsers,
            proUsers,
            proUsersPercent: totalUsers > 0 ? ((proUsers / totalUsers) * 100).toFixed(1) + '%' : '0%',
            totalPortfolios,
            publishedPortfolios,
            publishedPercent: totalPortfolios > 0 ? ((publishedPortfolios / totalPortfolios) * 100).toFixed(1) + '%' : '0%',
            totalResumes: initialResumes.length,
            totalProjects: initialProjects.length,
        };
    }, []);
    
    const recentPortfolios = [...initialPortfolios].sort((a,b) => b.updatedAt - a.updatedAt).slice(0,5);

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 font-sora">Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Overview of the Grooya platform.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                <StatCard title="Total Users" value={stats.totalUsers} icon={Users} />
                <StatCard title="Pro Users" value={`${stats.proUsers} (${stats.proUsersPercent})`} icon={Gem} />
                <StatCard title="Total Portfolios" value={stats.totalPortfolios} icon={FolderKanban} />
                <StatCard title="Published Portfolios" value={`${stats.publishedPortfolios} (${stats.publishedPercent})`} icon={CheckCircle} />
                <StatCard title="Total Resumes" value={stats.totalResumes} icon={FileText} />
                <StatCard title="Total Projects" value={stats.totalProjects} icon={Package} />
            </div>

            <div className="mt-10">
                 <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 font-sora mb-4">Recent Activity</h2>
                 <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                     <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                        {recentPortfolios.map(p => {
                            const user = mockAllUsers.find(u => u.id === p.userId);
                            return (
                                <li key={p.id} className="py-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img src={user?.avatarUrl} alt={user?.name} className="w-9 h-9 rounded-full"/>
                                        <div>
                                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                <span className="font-semibold">{user?.name}</span> updated portfolio: <Link to={`/dashboard/edit/${p.id}`} className="text-cyan-600 hover:underline">{p.title}</Link>
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {new Date(p.updatedAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                     <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${ p.isPublished ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300' }`}>
                                        {p.isPublished ? 'Published' : 'Draft'}
                                    </span>
                                </li>
                            );
                        })}
                     </ul>
                 </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;