import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { Save, Bell, Code, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useData } from '../../contexts/DataContext';

const EditorLabel: React.FC<{ children: React.ReactNode, htmlFor?: string, className?: string }> = ({ children, htmlFor, className }) => (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5 ${className || ''}`}>{children}</label>
);

const EditorInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className={`block w-full bg-slate-50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-slate-800 dark:text-slate-100 transition-colors p-2 ${props.className}`} />
);

const ToggleSwitch: React.FC<{ label: string; enabled: boolean; setEnabled: (enabled: boolean) => void }> = ({ label, enabled, setEnabled }) => (
    <label className="flex items-center justify-between cursor-pointer">
        <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
        <div className="relative">
            <input type="checkbox" className="sr-only" checked={enabled} onChange={() => setEnabled(!enabled)} />
            <div className={`block w-10 h-6 rounded-full transition-colors ${enabled ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${enabled ? 'translate-x-4' : ''}`}></div>
        </div>
    </label>
);

const AdminSettingsPage: React.FC = () => {
    const { t } = useTranslation();
    const { promoCodes, createPromoCode, deletePromoCode } = useData();
    
    // Mock state for settings. In a real app, this would come from a context or API.
    const [settings, setSettings] = useState({
        bannerEnabled: false,
        bannerText: 'Welcome to Grooya! We are currently in beta.',
        featureFlags: {
            videoBlocks: true,
            aiResumeTailoring: true,
            customDomains: false,
        },
        proPrice: 9,
    });
    
    // State for new promo code form
    const [isCreatingPromo, setIsCreatingPromo] = useState(false);
    const [newPromoCode, setNewPromoCode] = useState('');
    const [newPromoLimit, setNewPromoLimit] = useState(100);
    const [newPromoTier, setNewPromoTier] = useState<'starter' | 'pro' | 'premium'>('pro');
    const [grantsEarlyAdopter, setGrantsEarlyAdopter] = useState(true);

    const handleSettingChange = (key: keyof typeof settings, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleFlagChange = (key: keyof typeof settings.featureFlags, value: boolean) => {
        setSettings(prev => ({
            ...prev,
            featureFlags: {
                ...prev.featureFlags,
                [key]: value,
            }
        }));
    };
    
    const handleCreatePromoCode = () => {
        if (!newPromoCode.trim() || newPromoLimit <= 0) {
            toast.error("Please enter a valid code and usage limit.");
            return;
        }
        createPromoCode({
            code: newPromoCode,
            usageLimit: newPromoLimit,
            grantsTier: newPromoTier,
            isEarlyAdopter: grantsEarlyAdopter,
        });
        toast.success(`Promo code "${newPromoCode}" created!`);
        // Reset form
        setNewPromoCode('');
        setNewPromoLimit(100);
        setNewPromoTier('pro');
        setGrantsEarlyAdopter(true);
        setIsCreatingPromo(false);
    };
    
    const handleDeletePromoCode = (id: string, code: string) => {
        toast((toastInstance) => (
            <div className="flex flex-col items-start gap-3">
                <span className="font-medium">Delete "{code}"?</span>
                <div className="flex gap-2 self-stretch">
                    <Button variant="danger" size="sm" className="flex-grow" onClick={() => { deletePromoCode(id); toast.dismiss(toastInstance.id); }}>
                        Confirm
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-grow" onClick={() => toast.dismiss(toastInstance.id)}>
                        Cancel
                    </Button>
                </div>
            </div>
        ), { duration: 6000 });
    };

    const handleSave = () => {
        // In a real app, you would send this to the backend.
        console.log('Saving settings:', settings);
        toast.success(t('admin.settings.saveSuccess'));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 font-sora">{t('admin.settings.title')}</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">{t('admin.settings.subtitle')}</p>
                </div>
                <Button variant="primary" onClick={handleSave}><Save size={16} className="mr-2" /> {t('admin.settings.save')}</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                    {/* Announcement Banner */}
                    <Card className="!shadow-sm">
                        <div className="p-6">
                             <h2 className="text-xl font-bold font-sora mb-4">{t('admin.settings.announcements.title')}</h2>
                             <div className="space-y-4">
                                <ToggleSwitch label={t('admin.settings.announcements.enable')} enabled={settings.bannerEnabled} setEnabled={(val) => handleSettingChange('bannerEnabled', val)} />
                                <div>
                                    <EditorLabel htmlFor="bannerText">{t('admin.settings.announcements.text')}</EditorLabel>
                                    <EditorInput id="bannerText" value={settings.bannerText} onChange={(e) => handleSettingChange('bannerText', e.target.value)} />
                                </div>
                                {settings.bannerEnabled && (
                                     <div>
                                        <EditorLabel className="!mb-2">{t('admin.settings.announcements.preview')}</EditorLabel>
                                        <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-800 dark:text-cyan-200 text-sm rounded-lg flex items-center gap-3">
                                            <Bell size={16} />
                                            <span>{settings.bannerText}</span>
                                        </div>
                                    </div>
                                )}
                             </div>
                        </div>
                    </Card>

                    {/* Subscription Settings */}
                    <Card className="!shadow-sm">
                         <div className="p-6">
                            <h2 className="text-xl font-bold font-sora mb-4">{t('admin.settings.subscriptions.title')}</h2>
                            <div>
                                <EditorLabel htmlFor="proPrice">{t('admin.settings.subscriptions.proPrice')}</EditorLabel>
                                <div className="relative">
                                     <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 sm:text-sm">$</span>
                                     <EditorInput id="proPrice" type="number" value={settings.proPrice} onChange={(e) => handleSettingChange('proPrice', Number(e.target.value))} className="!pl-7" />
                                </div>
                            </div>
                         </div>
                    </Card>
                </div>
                <div className="space-y-8">
                    {/* Feature Flags */}
                    <Card className="!shadow-sm">
                         <div className="p-6">
                            <h2 className="text-xl font-bold font-sora mb-4">{t('admin.settings.featureFlags.title')}</h2>
                             <div className="space-y-4">
                                <ToggleSwitch label="Enable Video Blocks" enabled={settings.featureFlags.videoBlocks} setEnabled={(val) => handleFlagChange('videoBlocks', val)} />
                                <ToggleSwitch label="Enable AI Resume Tailoring" enabled={settings.featureFlags.aiResumeTailoring} setEnabled={(val) => handleFlagChange('aiResumeTailoring', val)} />
                                <ToggleSwitch label="Enable Custom Domains (Pro)" enabled={settings.featureFlags.customDomains} setEnabled={(val) => handleFlagChange('customDomains', val)} />
                             </div>
                         </div>
                    </Card>
                    {/* Promo Codes */}
                    <Card className="!shadow-sm">
                        <div className="p-6">
                            <h2 className="text-xl font-bold font-sora mb-4">Promo Code Management</h2>
                            <div className="space-y-3">
                                {promoCodes.map(promo => (
                                    <div key={promo.id} className="flex justify-between items-start p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <div>
                                            <p className="font-mono font-semibold text-slate-800 dark:text-slate-200">{promo.code}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs font-semibold capitalize bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300 px-2 py-0.5 rounded-full">{promo.grantsTier}</span>
                                                {promo.isEarlyAdopter && (
                                                    <span className="text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 px-2 py-0.5 rounded-full">Early Adopter 🎖️</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                                Usage: {promo.timesUsed} / {promo.usageLimit}
                                            </p>
                                        </div>
                                        <Button variant="ghost" size="sm" className="!p-2 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/50 flex-shrink-0" onClick={() => handleDeletePromoCode(promo.id, promo.code)}>
                                            <Trash2 size={16}/>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            
                            {isCreatingPromo ? (
                                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
                                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Create New Promo Code</h3>
                                    <div>
                                        <EditorLabel htmlFor="newPromoCode">Code</EditorLabel>
                                        <EditorInput 
                                            id="newPromoCode"
                                            placeholder="e.g., LAUNCH2024"
                                            value={newPromoCode}
                                            onChange={e => setNewPromoCode(e.target.value.toUpperCase())}
                                        />
                                    </div>
                                    <div>
                                        <EditorLabel htmlFor="newPromoLimit">Usage Limit</EditorLabel>
                                        <EditorInput 
                                            id="newPromoLimit"
                                            type="number"
                                            value={newPromoLimit}
                                            onChange={e => setNewPromoLimit(parseInt(e.target.value, 10))}
                                        />
                                    </div>
                                    <div>
                                        <EditorLabel htmlFor="newPromoTier">Grants Tier</EditorLabel>
                                        <select
                                            id="newPromoTier"
                                            value={newPromoTier}
                                            onChange={e => setNewPromoTier(e.target.value as any)}
                                            className="block w-full bg-slate-50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-slate-800 dark:text-slate-100 transition-colors p-2"
                                        >
                                            <option value="starter">Starter</option>
                                            <option value="pro">Pro</option>
                                            <option value="premium">Premium</option>
                                        </select>
                                    </div>
                                     <div className="pt-2">
                                        <ToggleSwitch
                                            label="Grant Early Adopter Badge"
                                            enabled={grantsEarlyAdopter}
                                            setEnabled={setGrantsEarlyAdopter}
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2 pt-2">
                                        <Button variant="secondary" size="sm" onClick={() => setIsCreatingPromo(false)}>Cancel</Button>
                                        <Button variant="primary" size="sm" onClick={handleCreatePromoCode}>Create</Button>
                                    </div>
                                </div>
                            ) : (
                                <Button variant="secondary" size="sm" className="w-full mt-4" onClick={() => setIsCreatingPromo(true)}>
                                    Add New Promo Code
                                </Button>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminSettingsPage;