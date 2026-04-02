import React from 'react';
import { motion } from 'framer-motion';
import type { Portfolio, PricingTier } from '../../../types';
import EditableText from '../../ui/EditableText';
import { CheckCircle2 } from 'lucide-react';
import { getButtonProps, cornerRadiusStyles, fontWeightStyles, letterSpacingStyles, shadowStyles, getCardStyles, getGridGapClass } from './utils';

interface BlockViewProps {
    block: any;
    design: Portfolio['design'];
    theme: Portfolio['customPalettes'][0]['colors'];
    itemVariant: any;
    isEditable?: boolean;
    onUpdateBlock?: (blockId: string, field: string, value: any) => void;
}

export const ServicesBlockView: React.FC<BlockViewProps> = ({ block, design, theme, itemVariant, isEditable, onUpdateBlock }) => {
    const { backgroundImage, textColor: textColorOverride } = block.designOverrides || {};
    const hasBgImage = !!backgroundImage;
    const headingColor = textColorOverride || (hasBgImage ? '#FFFFFF' : theme.heading);
    const fontWeightHeadingClass = fontWeightStyles[design.fontWeightHeading] || 'font-bold';
    const letterSpacingClass = letterSpacingStyles[design.letterSpacing] || 'tracking-normal';
    const shadowClass = shadowStyles[design.shadowStyle] || 'shadow-md';
    const cardStyles = getCardStyles(design, theme);
    const gridGapClass = getGridGapClass(design.gridGap);
    const layoutVariant = block.layoutVariant || 'cards';

    if (layoutVariant === 'comparison') {
        return (
            <div id={block.id}>
                <div className={`mx-auto px-4 ${design.pageWidth === 'full' ? 'w-full' : 'container'}`}>
                    <motion.div variants={itemVariant} className="overflow-hidden">
                        <EditableText as="h2" value={block.title} onSave={(value) => onUpdateBlock?.(block.id, 'title', value)} isEditable={isEditable} className={`text-3xl mb-10 text-center font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`} style={{ color: headingColor }} />
                    </motion.div>
                    <motion.div variants={itemVariant} className="overflow-x-auto">
                        <div className={`grid min-w-[960px] gap-4 ${gridGapClass}`} style={{ gridTemplateColumns: `220px repeat(${Math.max(block.tiers.length, 1)}, minmax(220px, 1fr))` }}>
                            <div className="rounded-2xl p-6" style={{ backgroundColor: theme.cardBackground, border: `1px solid ${theme.cardBorder}` }}>
                                <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: design.accentColor }}>Compare</p>
                                <p className="mt-4 text-sm" style={{ color: theme.subtle }}>Pick the service tier that matches the engagement size and pace you need.</p>
                            </div>
                            {block.tiers.map((tier: PricingTier) => (
                                <div key={tier.id} className={`rounded-2xl p-6 ${shadowClass}`} style={{ ...cardStyles, borderColor: tier.isFeatured ? design.accentColor : cardStyles.borderColor }}>
                                    <h3 className={`text-2xl font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`} style={{ color: theme.heading }}>{tier.title}</h3>
                                    <p className="mt-2 text-sm" style={{ color: theme.subtle }}>{tier.description}</p>
                                    <div className="mt-6">
                                        <span className="text-4xl font-heading font-bold" style={{ color: theme.heading }}>{tier.price}</span>
                                        <span className="ml-2 text-sm" style={{ color: theme.subtle }}>{tier.frequency}</span>
                                    </div>
                                    <a href={tier.link || '#'} {...getButtonProps(design, tier.isFeatured ? 'solid' : 'outline')} className={`${getButtonProps(design, tier.isFeatured ? 'solid' : 'outline').className} mt-6 block w-full text-center !px-6 !py-3`}>
                                        {tier.buttonText}
                                    </a>
                                </div>
                            ))}
                            <div className="rounded-2xl p-6" style={{ backgroundColor: theme.cardBackground, border: `1px solid ${theme.cardBorder}` }}>
                                <p className="text-sm font-semibold" style={{ color: theme.heading }}>Included</p>
                            </div>
                            {block.tiers.map((tier: PricingTier) => (
                                <div key={`${tier.id}-features`} className="rounded-2xl p-6" style={{ backgroundColor: theme.cardBackground, border: `1px solid ${theme.cardBorder}` }}>
                                    <ul className="space-y-3">
                                        {tier.features.map((feature: string, index: number) => (
                                            <li key={index} className="flex items-start gap-2 text-sm" style={{ color: theme.text }}>
                                                <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" style={{ color: design.accentColor }} />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    if (layoutVariant === 'minimal') {
        return (
            <div id={block.id}>
                <div className={`mx-auto px-4 ${design.pageWidth === 'full' ? 'w-full' : 'container max-w-5xl'}`}>
                    <motion.div variants={itemVariant} className="overflow-hidden">
                        <EditableText as="h2" value={block.title} onSave={(value) => onUpdateBlock?.(block.id, 'title', value)} isEditable={isEditable} className={`text-3xl mb-10 text-center font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`} style={{ color: headingColor }} />
                    </motion.div>
                    <div className="space-y-4">
                        {block.tiers.map((tier: PricingTier) => {
                            const buttonProps = tier.isFeatured ? getButtonProps(design, 'solid') : getButtonProps(design, 'outline');
                            return (
                                <motion.div key={tier.id} variants={itemVariant} className={`grid items-center gap-6 rounded-2xl p-6 ${shadowClass} lg:grid-cols-[1.2fr_0.8fr_0.8fr]`} style={{ ...cardStyles, borderColor: tier.isFeatured ? design.accentColor : cardStyles.borderColor }}>
                                    <div>
                                        <h3 className={`text-2xl font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`} style={{ color: theme.heading }}>{tier.title}</h3>
                                        <p className="mt-2 text-sm" style={{ color: theme.subtle }}>{tier.description}</p>
                                    </div>
                                    <ul className="space-y-2">
                                        {tier.features.slice(0, 3).map((feature: string, index: number) => (
                                            <li key={index} className="flex items-start gap-2 text-sm" style={{ color: theme.text }}>
                                                <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" style={{ color: design.accentColor }} />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="text-left lg:text-right">
                                        <div>
                                            <span className="text-3xl font-heading font-bold" style={{ color: theme.heading }}>{tier.price}</span>
                                            <span className="ml-2 text-sm" style={{ color: theme.subtle }}>{tier.frequency}</span>
                                        </div>
                                        <a href={tier.link || '#'} {...buttonProps} className={`${buttonProps.className} mt-4 inline-block !px-6 !py-3`}>
                                            {tier.buttonText}
                                        </a>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div id={block.id}>
            <div className={`mx-auto px-4 ${design.pageWidth === 'full' ? 'w-full' : 'container'}`}>
                <motion.div variants={itemVariant} className="overflow-hidden"><EditableText as="h2" value={block.title} onSave={(value) => onUpdateBlock?.(block.id, 'title', value)} isEditable={isEditable} className={`text-3xl mb-12 text-center font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`} style={{ color: headingColor }} /></motion.div>
                <motion.div variants={itemVariant} className={`grid grid-cols-1 lg:grid-cols-3 ${gridGapClass} items-center`}>
                    {block.tiers.map((tier: PricingTier) => {
                        const buttonProps = tier.isFeatured ? getButtonProps(design, 'solid') : getButtonProps(design, 'outline');
                        const tierCardStyles = { ...cardStyles };
                        if (tier.isFeatured) {
                            tierCardStyles.borderColor = design.accentColor;
                        }
                        return (
                            <div 
                                key={tier.id}
                                className={`p-8 flex flex-col h-full transition-all duration-300 ${tier.isFeatured ? 'transform lg:scale-105' : ''} ${cornerRadiusStyles[design.cornerRadius]} ${shadowClass}`}
                                style={tierCardStyles}
                            >
                                <h3 className={`text-2xl font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`} style={{ color: theme.heading }}>{tier.title}</h3>
                                <p className={`mt-2`} style={{ color: theme.subtle }}>{tier.description}</p>
                                <div className="my-6">
                                    <span className={`text-4xl font-heading ${fontWeightHeadingClass}`} style={{ color: theme.heading }}>{tier.price}</span>
                                    <span style={{ color: theme.subtle }}>{tier.frequency}</span>
                                </div>
                                <ul className="space-y-4 mb-8 flex-grow">
                                    {tier.features.map((feature: string, index: number) => (
                                        <li key={index} className="flex items-center">
                                            <CheckCircle2 size={18} className="me-3" style={{ color: design.accentColor }}/>
                                            <span style={{ color: theme.text }}>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <a 
                                    href={tier.link || '#'}
                                    {...buttonProps}
                                    className={`${buttonProps.className} block w-full text-center !px-6 !py-3`}
                                >
                                    {tier.buttonText}
                                </a>
                            </div>
                        )
                    })}
                </motion.div>
            </div>
        </div>
    );
};
