

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { initialPortfolios, mockAllUsers } from '../../services/mockData';
import type { Portfolio, User } from '../../types';
import { Search, ArrowUpDown, Eye, FilePenLine } from 'lucide-react';
import Button from '../../components/ui/Button';

// Combine portfolio with its owner for easier display and sorting
interface PortfolioWithUser extends Portfolio {
    owner: User | undefined;
}

type SortKey = 'title' | 'ownerName' | 'isPublished' | 'updatedAt';

const AdminPortfolioManagementPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortKey, setSortKey] = useState<SortKey>('updatedAt');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const portfoliosWithUsers: PortfolioWithUser[] = useMemo(() => {
        return initialPortfolios.map(p => ({
            ...p,
            owner: mockAllUsers.find(u => u.id === p.userId)
        }));
    }, []);

    const sortedAndFilteredPortfolios = useMemo(() => {
        let filtered = portfoliosWithUsers.filter(p =>
            p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.owner && p.owner.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            p.slug.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return filtered.sort((a, b) => {
            let aValue: any;
            let bValue: any;

            if (sortKey === 'ownerName') {
                aValue = a.owner?.name || '';
                bValue = b.owner?.name || '';
            } else {
                aValue = a[sortKey];
                bValue = b[sortKey];
            }

            if (aValue < bValue) {
                return sortDirection === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [searchTerm, sortKey, sortDirection, portfoliosWithUsers]);

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const SortableHeader: React.FC<{ sortKeyName: SortKey, children: React.ReactNode }> = ({ sortKeyName, children }) => (
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <button onClick={() => handleSort(sortKeyName)} className="flex items-center gap-1 group">
                {children}
                <ArrowUpDown size={14} className="opacity-50 group-hover:opacity-100" />
            </button>
        </th>
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 font-sora">Portfolio Management</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">View, search, and manage all portfolios on the platform.</p>

            <div className="mt-8">
                <div className="relative mb-6">
                    <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search by title, owner, or slug..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm ps-10 pe-4 py-2 sm:text-sm focus:ring-cyan-500 focus:border-cyan-500 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500"
                    />
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <SortableHeader sortKeyName="title">Title</SortableHeader>
                                <SortableHeader sortKeyName="ownerName">Owner</SortableHeader>
                                <SortableHeader sortKeyName="isPublished">Status</SortableHeader>
                                <SortableHeader sortKeyName="updatedAt">Last Updated</SortableHeader>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                            {sortedAndFilteredPortfolios.map(portfolio => (
                                <tr key={portfolio.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-slate-900 dark:text-slate-50">{portfolio.title}</div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400">/{portfolio.slug}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {portfolio.owner && (
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img className="h-10 w-10 rounded-full" src={portfolio.owner.avatarUrl} alt="" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-slate-900 dark:text-slate-50">{portfolio.owner.name}</div>
                                                    <div className="text-sm text-slate-500 dark:text-slate-400">{portfolio.owner.email}</div>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            portfolio.isPublished
                                            ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300'
                                            : 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300'
                                        }`}>
                                            {portfolio.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                                        {new Date(portfolio.updatedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link to={`/portfolio/${portfolio.slug}`} target="_blank"><Button variant="ghost" size="sm"><Eye size={16} className="mr-2"/> View</Button></Link>
                                        <Link to={`/dashboard/edit/${portfolio.id}`}><Button variant="ghost" size="sm"><FilePenLine size={16} className="mr-2"/> Edit</Button></Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPortfolioManagementPage;