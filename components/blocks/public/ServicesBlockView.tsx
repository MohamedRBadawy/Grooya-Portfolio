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
    const hasBgImage = !!block.designOverrides?.backgroundImage;
    const headingColor = hasBgImage ? '#FFFFFF' : theme.heading;
    const fontWeightHeadingClass = fontWeightStyles[design.fontWeightHeading] || 'font-bold';
    const letterSpacingClass = letterSpacingStyles[design.letterSpacing] || 'tracking-normal';
    const shadowClass = shadowStyles[design.shadowStyle] || 'shadow-md';
    const cardStyles = getCardStyles(design, theme);
    const gridGapClass = getGridGapClass(design.gridGap);

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