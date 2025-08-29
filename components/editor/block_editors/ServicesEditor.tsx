import React from 'react';
import type { ServicesBlock, PricingTier } from '../../../types';
import { EditorLabel, EditorInput, EditorTextarea } from '../../ui/editor/EditorControls';
import Button from '../../ui/Button';
import { X, Plus } from 'lucide-react';

interface ServicesEditorProps {
  block: ServicesBlock;
  onUpdate: (updates: Partial<ServicesBlock>) => void;
  t: (key: string) => string;
}

export const ServicesEditor: React.FC<ServicesEditorProps> = ({ block, onUpdate, t }) => {
  const updateTier = (tierId: string, field: keyof Omit<PricingTier, 'id' | 'features' | 'isFeatured'>, value: string) => {
    const newTiers = block.tiers.map(tier => tier.id === tierId ? { ...tier, [field]: value } : tier);
    onUpdate({ tiers: newTiers });
  };
  
  const updateTierFeatures = (tierId: string, value: string) => {
    const newTiers = block.tiers.map(tier => tier.id === tierId ? { ...tier, features: value.split('\n') } : tier);
    onUpdate({ tiers: newTiers });
  };
  
  const toggleFeatured = (tierId: string) => {
    const currentTier = block.tiers.find(t => t.id === tierId);
    if (!currentTier) return;
    const shouldBeFeatured = !currentTier.isFeatured;
    const newTiers = block.tiers.map(tier => ({
      ...tier,
      isFeatured: (tier.id === tierId) ? shouldBeFeatured : false
    }));
    onUpdate({ tiers: newTiers });
  };
  
  const addTier = () => {
    const newTier: PricingTier = { id: `tier-${Date.now()}`, title: 'New Plan', price: '$0', frequency: '/mo', description: 'A great starting point for new customers.', features: ['Feature 1', 'Feature 2'], buttonText: 'Sign Up', isFeatured: false };
    onUpdate({ tiers: [...block.tiers, newTier] });
  };
  
  const removeTier = (tierId: string) => {
    onUpdate({ tiers: block.tiers.filter(tier => tier.id !== tierId) });
  };
  
  return (
    <>
      {block.tiers.length > 0 ? (
        <div className="space-y-3">
          <EditorLabel>Pricing Tiers</EditorLabel>
          {block.tiers.map(tier => (
            <div key={tier.id} className="p-3 bg-slate-100 dark:bg-slate-700 rounded-md space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <input type="checkbox" id={`featured-${tier.id}`} checked={tier.isFeatured} onChange={() => toggleFeatured(tier.id)} className="h-4 w-4 text-teal-600 bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-500 rounded focus:ring-teal-500" />
                  <label htmlFor={`featured-${tier.id}`} className="ms-2 text-sm text-slate-600 dark:text-slate-400">{t('markAsFeatured')}</label>
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => removeTier(tier.id)}><X size={14} /></Button>
              </div>
              <EditorInput placeholder={t('tierName')} value={tier.title} onChange={e => updateTier(tier.id, 'title', e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <EditorInput placeholder={t('price')} value={tier.price} onChange={e => updateTier(tier.id, 'price', e.target.value)} />
                <EditorInput placeholder={t('frequency')} value={tier.frequency} onChange={e => updateTier(tier.id, 'frequency', e.target.value)} />
              </div>
              <EditorInput placeholder={t('description')} value={tier.description} onChange={e => updateTier(tier.id, 'description', e.target.value)} />
              <EditorTextarea placeholder={t('features')} value={tier.features.join('\n')} onChange={e => updateTierFeatures(tier.id, e.target.value)} rows={3} />
              <EditorInput placeholder={t('buttonText')} value={tier.buttonText} onChange={e => updateTier(tier.id, 'buttonText', e.target.value)} />
              <EditorInput placeholder={t('buttonLink')} value={tier.link || ''} onChange={e => updateTier(tier.id, 'link', e.target.value)} type="url" />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-4 bg-slate-100 dark:bg-slate-700 rounded-md">
          <p className="text-sm text-slate-600 dark:text-slate-400">{t('services.emptyState')}</p>
        </div>
      )}
      <Button size="sm" variant="secondary" onClick={addTier}><Plus size={14} className="me-2" />{t('addTier')}</Button>
    </>
  );
};
