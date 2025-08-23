
import React from 'react';
import type { Portfolio, PortfolioAsset, Page } from '../../../types';
import Button from '../../ui/Button';
import { useTranslation } from '../../../hooks/useTranslation';
import { Sparkles, ImageIcon, Trash2, RefreshCw, Plus } from 'lucide-react';

interface AssetsPanelProps {
    portfolio: Portfolio;
    activePage: Page | null;
    setIsGeneratingAsset: (isGenerating: boolean) => void;
    handleDeleteAsset: (assetId: string) => void;
    setRegeneratingPrompt: (prompt: string | null) => void;
    applyingAssetId: string | null;
    setApplyingAssetId: (id: string | null) => void;
    applyMenuRef: React.RefObject<HTMLDivElement>;
    handleApplyAssetToBlock: (asset: PortfolioAsset, blockId: string) => void;
}

/**
 * A UI panel within the editor sidebar for managing AI-generated image assets.
 */
const AssetsPanel: React.FC<AssetsPanelProps> = ({
    portfolio,
    activePage,
    setIsGeneratingAsset,
    handleDeleteAsset,
    setRegeneratingPrompt,
    applyingAssetId,
    setApplyingAssetId,
    applyMenuRef,
    handleApplyAssetToBlock
}) => {
    const { t } = useTranslation();

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Asset Library</h3>
                <Button variant="primary" size="sm" onClick={() => setIsGeneratingAsset(true)}>
                    <Sparkles size={14} className="me-2" />
                    {t('generateNewImage')}
                </Button>
            </div>

            {/* Conditionally render the list of assets or the empty state. */}
            {(portfolio.assets || []).length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                    {portfolio.assets?.map(asset => (
                        <div key={asset.id} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden flex flex-col">
                            {/* Asset Image and Prompt Overlay */}
                            <div className="relative">
                                <img src={asset.url} alt={asset.prompt} className="w-full h-32 object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-2 flex flex-col justify-end">
                                    <p className="text-xs text-white/80 line-clamp-2">{asset.prompt}</p>
                                </div>
                            </div>
                            {/* Action Buttons for the Asset */}
                            <div className="p-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-rose-500 hover:text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/50 dark:hover:text-rose-400"
                                    onClick={() => handleDeleteAsset(asset.id)}
                                >
                                    <Trash2 size={14} className="me-1.5" />
                                    {t('delete')}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                        // Re-use the prompt to generate a new image.
                                        setRegeneratingPrompt(asset.prompt);
                                        setIsGeneratingAsset(true);
                                    }}
                                >
                                    <RefreshCw size={14} className="me-1.5" />
                                    {t('regenerate')}
                                </Button>
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
                                            className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-20 p-1"
                                        >
                                            <p className="text-xs text-slate-500 dark:text-slate-400 p-2">{t('selectBlockToApply')}</p>
                                            <div className="max-h-48 overflow-y-auto">
                                                {activePage?.blocks.map(b => (
                                                    <button
                                                        key={b.id}
                                                        onClick={() => handleApplyAssetToBlock(asset, b.id)}
                                                        className="w-full text-left text-sm p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                                                    >
                                                        <span className="capitalize">{b.type}</span>: {(b as any).title || (b as any).headline || b.id}
                                                    </button>
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