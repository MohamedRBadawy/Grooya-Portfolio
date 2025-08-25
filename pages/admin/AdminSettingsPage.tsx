
import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { Save, Bell, Code } from 'lucide-react';
import toast from 'react-hot-toast';

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
            </div>
        </div>
    );
};

export default AdminSettingsPage;