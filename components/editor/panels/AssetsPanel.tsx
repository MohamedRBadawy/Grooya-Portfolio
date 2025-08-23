import React from 'react';
import type { Portfolio, PortfolioAsset, Page, PortfolioBlock } from '../../../types';
import Button from '../../ui/Button';
import { useTranslation } from '../../../hooks/useTranslation';
import { Sparkles, ImageIcon, Trash2, RefreshCw, Plus, Upload, Download } from 'lucide-react';

interface AssetsPanelProps {
    portfolio: Portfolio;
    activePage: Page | null;
    onAddAsset: (assetData: Omit<PortfolioAsset, 'id' | 'createdAt'>) => void;
    setIsGeneratingAsset: (isGenerating: boolean) => void;
    handleDeleteAsset: (assetId: string) => void;
    setRegeneratingPrompt: (prompt: string | null) => void;
    applyingAssetId: string | null;
    setApplyingAssetId: (id: string | null) => void;
    applyMenuRef: React.RefObject<HTMLDivElement>;
    handleApplyAssetToBlock: (asset: PortfolioAsset, blockId: string, action: 'background' | 'mainImage' | 'addToGallery') => void;
}

/**
 * A UI panel within the editor sidebar for managing AI-generated image assets.
 */
const AssetsPanel: React.FC<AssetsPanelProps> = ({
    portfolio,
    activePage,
    onAddAsset,
    setIsGeneratingAsset,
    handleDeleteAsset,
    setRegeneratingPrompt,
    applyingAssetId,
    setApplyingAssetId,
    applyMenuRef,
    handleApplyAssetToBlock
}) => {
    const { t } = useTranslation();
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const url = e.target?.result as string;
                onAddAsset({ url, prompt: file.name });
            };
            reader.readAsDataURL(file);
        }
        if(event.target) event.target.value = '';
    };

    const handleDownloadAsset = (asset: PortfolioAsset) => {
        const link = document.createElement('a');
        link.href = asset.url;
        const fileExtension = asset.url.startsWith('data:image/jpeg') ? 'jpeg' : 'png';
        link.download = `grooya-asset-${asset.id}.${fileExtension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getApplyActions = (block: PortfolioBlock) => {
        const actions: { label: string, action: 'background' | 'mainImage' | 'addToGallery' }[] = [
            { label: 'Set as Background', action: 'background' }
        ];
        if (block.type === 'hero' || block.type === 'about') {
            actions.push({ label: 'Set as Main Image', action: 'mainImage' });
        }
        if (block.type === 'gallery') {
            actions.push({ label: 'Add to Gallery', action: 'addToGallery' });
        }
        return actions;
    };


    return (
        <div className="p-4">
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
            <div className="flex justify-between items-center mb-4 gap-2">
                 <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <Upload size={14} className="me-2" />
                    Upload
                </Button>
                <Button variant="primary" size="sm" onClick={() => setIsGeneratingAsset(true)}>
                    <Sparkles size={14} className="me-2" />
                    {t('generateNewImage')}
                </Button>
            </div>

            {/* Conditionally render the list of assets or the empty state. */}
            {(portfolio.assets || []).length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                    {portfolio.assets?.map(asset => (
                        <div key={asset.id} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden flex flex-col group">
                            {/* Asset Image and Prompt Overlay */}
                            <div className="relative">
                                <img src={asset.url} alt={asset.prompt} className="w-full h-32 object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-2 flex flex-col justify-end">
                                    <p className="text-xs text-white/80 line-clamp-2">{asset.prompt}</p>
                                </div>
                            </div>
                            {/* Action Buttons for the Asset */}
                            <div className="p-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-1">
                                <Button size="sm" variant="ghost" className="p-1.5 h-auto" onClick={() => handleDownloadAsset(asset)} title="Download Asset"><Download size={14} /></Button>
                                <Button size="sm" variant="ghost" className="p-1.5 h-auto" onClick={() => { setRegeneratingPrompt(asset.prompt); setIsGeneratingAsset(true); }} title="Regenerate with same prompt"><RefreshCw size={14} /></Button>
                                <Button size="sm" variant="ghost" className="p-1.5 h-auto text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/50" onClick={() => handleDeleteAsset(asset.id)} title="Delete Asset"><Trash2 size={14} /></Button>
                                <div className="relative">
                                    {/* The "Apply" button toggles a dropdown menu. */}
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="!bg-teal-100 dark:!bg-teal-900/50 !text-teal-700 dark:!text-teal-300"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setApplyingAssetId(applyingAssetId === asset.id ? null : asset.id);
                                        }}
                                    >
                                        <Plus size={14} className="me-1.5" />
                                        {t('apply')}
                                    </Button>
                                    {/* Dropdown menu to select which block to apply the image to. */}
                                    {applyingAssetId === asset.id && (
                                        <div
                                            ref={applyMenuRef}
                                            onClick={e => e.stopPropagation()}
                                            className="absolute bottom-full right-0 mb-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-20 p-1"
                                        >
                                            <div className="max-h-60 overflow-y-auto">
                                                {activePage?.blocks.map(b => (
                                                    <div key={b.id} className="text-sm">
                                                        <div className="px-2 py-1.5 font-semibold text-slate-800 dark:text-slate-200 capitalize border-b border-slate-200 dark:border-slate-700">
                                                            {b.type}: {(b as any).title || (b as any).headline || 'Untitled'}
                                                        </div>
                                                        <div className="p-1">
                                                        {getApplyActions(b).map(action => (
                                                            <button
                                                                key={action.action}
                                                                onClick={() => handleApplyAssetToBlock(asset, b.id, action.action)}
                                                                className="w-full text-left p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                                                            >
                                                                {action.label}
                                                            </button>
                                                        ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // Empty state when there are no assets.
                <div className="text-center py-16 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                    <ImageIcon size={32} className="mx-auto text-slate-400 dark:text-slate-500" />
                    <h3 className="mt-4 text-lg font-medium text-slate-800 dark:text-slate-300">{t('noAssets')}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('getStartedAssets')}</p>
                </div>
            )}
        </div>
    );
};

export default AssetsPanel;