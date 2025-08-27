import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useTranslation } from '../hooks/useTranslation';
import Button from '../components/ui/Button';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import BillingCard from '../components/BillingCard';

const EditorLabel: React.FC<{ children: React.ReactNode, htmlFor?: string }> = ({ children, htmlFor }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">{children}</label>
);

const EditorInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className={`block w-full bg-slate-50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-slate-800 dark:text-slate-100 transition-colors p-2 ${props.className}`} />
);
const EditorTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea {...props} className={`block w-full bg-slate-50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 rounded-lg shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 text-slate-800 dark:text-slate-100 transition-colors p-2 ${props.className}`} />
);

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useData();
  const { t } = useTranslation();
  const [formData, setFormData] = useState(user);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  if (!formData) {
    return <div>Loading...</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      updateUser(formData);
      toast.success(t('profileUpdated'));
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 font-sora">{t('myProfile')}</h1>
        {user?.isEarlyAdopter && (
            <span className="text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 px-3 py-1 rounded-full">
                Early Adopter 🎖️
            </span>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Main Content: Profile Form */}
          <div className="xl:col-span-3">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div>
                <EditorLabel htmlFor="name">{t('fullName')}</EditorLabel>
                <EditorInput
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <EditorLabel htmlFor="title">{t('jobTitle')}</EditorLabel>
                <EditorInput
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <EditorLabel htmlFor="email">{t('contactEmail')}</EditorLabel>
                <EditorInput
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <EditorLabel htmlFor="bio">{t('bio')}</EditorLabel>
                <EditorTextarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={5}
                  required
                />
              </div>
              <div className="pt-4 flex justify-end">
                  <Button type="submit" variant="primary">
                      <Save className="w-4 h-4 me-2" />
                      {t('updateProfile')}
                  </Button>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Avatar & Billing */}
          <div className="xl:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex flex-col items-center">
                <img
                  src={formData.avatarUrl}
                  alt="User avatar"
                  className="w-40 h-40 rounded-full object-cover mb-4 border-4 border-slate-200 dark:border-slate-700"
                />
                <div className="w-full mt-2">
                  <EditorLabel htmlFor="avatarUrl">{t('avatarUrl')}</EditorLabel>
                  <EditorInput
                    id="avatarUrl"
                    name="avatarUrl"
                    type="url"
                    value={formData.avatarUrl}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <BillingCard />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
