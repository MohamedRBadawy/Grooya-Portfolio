import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockAllUsers, initialPortfolios, initialProjects } from '../../services/mockData';
import { ChevronLeft, Gem, User as UserIcon, Briefcase, FolderKanban } from 'lucide-react';
import Button from '../../components/ui/Button';

const DetailCard: React.FC<{title: string, icon: React.ElementType, children: React.ReactNode}> = ({ title, icon: Icon, children }) => (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <Icon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{title}</h2>
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
);

const AdminUserDetailPage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    
    const user = useMemo(() => mockAllUsers.find(u => u.id === userId), [userId]);
    const userPortfolios = useMemo(() => initialPortfolios.filter(p => p.userId === userId), [userId]);
    // Note: mockProjects don't have userId. For demo, we'll show all projects.
    const userProjects = useMemo(() => initialProjects, []);

    if (!user) {
        return (
            <div>
                <h1 className="text-2xl font-bold text-rose-600">User Not Found</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Could not find a user with ID: {userId}</p>
                 <Link to="/admin/users" className="mt-6 inline-block">
                    <Button variant="secondary">
                        <ChevronLeft size={16} className="mr-2"/> Back to User List
                    </Button>
                </Link>
            </div>
        );
    }
    
    return (
        <div>
            <div className="mb-8">
                 <Link to="/admin/users">
                    <Button variant="ghost">
                        <ChevronLeft size={16} className="mr-2"/> Back to User List
                    </Button>
                </Link>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: User Profile */}
                <div className="lg:col-span-1 space-y-8">
                    <DetailCard title="Profile" icon={UserIcon}>
                        <div className="flex flex-col items-center text-center">
                            <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full mb-4 border-4 border-slate-200 dark:border-slate-700" loading="lazy" decoding="async" />
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{user.name}</h1>
                            <p className="text-slate-600 dark:text-slate-400">{user.title}</p>
                            <a href={`mailto:${user.email}`} className="text-sm text-cyan-600 hover:underline mt-1">{user.email}</a>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 text-left">{user.bio}</p>
                        </div>
                    </DetailCard>
                    <DetailCard title="Subscription" icon={Gem}>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Tier</span>
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    user.subscription?.tier === 'pro' 
                                    ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300' 
                                    : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
                                }`}>
                                    {user.subscription?.tier}
                                </span>
                            </div>
                            {user.subscription?.tier === 'pro' && (
                                <>
                                 <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Text Credits</span>
                                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user.subscription.credits.text} / 100</span>
                                </div>
                                 <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Image Credits</span>
                                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user.subscription.credits.image} / 20</span>
                                </div>
                                </>
                            )}
                        </div>
                    </DetailCard>
                </div>
                
                {/* Right Column: Portfolios & Projects */}
                <div className="lg:col-span-2 space-y-8">
                    <DetailCard title={`Portfolios (${userPortfolios.length})`} icon={FolderKanban}>
                       {userPortfolios.length > 0 ? (
                            <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                               {userPortfolios.map(p => (
                                   <li key={p.id} className="py-3 flex justify-between items-center">
                                       <div>
                                           <Link to={`/portfolio/${p.slug}`} target="_blank" className="font-semibold text-cyan-600 hover:underline">{p.title}</Link>
                                           <p className="text-xs text-slate-500">Updated: {new Date(p.updatedAt).toLocaleDateString()}</p>
                                       </div>
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${ p.isPublished ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300' }`}>
                                            {p.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                   </li>
                               ))}
                           </ul>
                       ) : <p className="text-sm text-slate-500">This user has no portfolios.</p>}
                    </DetailCard>
                     <DetailCard title={`Projects (${userProjects.length})`} icon={Briefcase}>
                       {userProjects.length > 0 ? (
                           <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                               {userProjects.map(p => (
                                   <li key={p.id} className="py-3">
                                       <p className="font-semibold text-slate-800 dark:text-slate-200">{p.title}</p>
                                       <p className="text-sm text-slate-500 line-clamp-2">{p.description}</p>
                                   </li>
                               ))}
                           </ul>
                       ) : <p className="text-sm text-slate-500">This user has no projects.</p>}
                    </DetailCard>
                </div>
            </div>
        </div>
    );
};

export default AdminUserDetailPage;