





import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { LayoutDashboard, Users, FolderKanban, Settings, Newspaper, ChevronLeft } from 'lucide-react';
import ThemeSwitcher from '../ThemeSwitcher';

const AdminNavLink: React.FC<{ to: string; icon: React.ElementType; children: React.ReactNode; disabled?: boolean }> = ({ to, icon: Icon, children, disabled = false }) => {
  const activeClasses = "bg-slate-200 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400";
  const inactiveClasses = "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800";
  const disabledClasses = "text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60";

  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          disabled ? disabledClasses : (isActive ? activeClasses : inactiveClasses)
        }`
      }
      onClick={(e) => disabled && e.preventDefault()}
    >
      <Icon size={18} />
      <span>{children}</span>
       {disabled && <span className="ml-auto text-xs bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">Soon</span>}
    </NavLink>
  );
};


const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useData();
    return (
        <div className="min-h-screen flex bg-slate-100 dark:bg-slate-950">
            <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 font-sora">Admin Panel</h2>
                    <p className="text-xs text-slate-500">Grooya Platform</p>
                </div>
                <nav className="flex-grow p-4 space-y-2">
                    <AdminNavLink to="/admin/dashboard" icon={LayoutDashboard}>Dashboard</AdminNavLink>
                    <AdminNavLink to="/admin/users" icon={Users}>Users</AdminNavLink>
                    <AdminNavLink to="/admin/portfolios" icon={FolderKanban}>Portfolios</AdminNavLink>
                    <AdminNavLink to="/admin/templates" icon={Newspaper}>Templates</AdminNavLink>
                    <AdminNavLink to="/admin/settings" icon={Settings}>Settings</AdminNavLink>
                </nav>
                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                            <img src={user?.avatarUrl} alt="Admin" className="w-9 h-9 rounded-full"/>
                            <div>
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user?.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p>
                            </div>
                        </div>
                        <ThemeSwitcher />
                    </div>
                    <Link to="/dashboard" className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
                        <ChevronLeft size={16}/>
                        Back to App
                    </Link>
                </div>
            </aside>
            <div className="flex-grow">
                <main className="p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;