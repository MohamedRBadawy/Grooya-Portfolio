
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../../hooks/useTranslation';
import type { Portfolio } from '../../../types';
import EditableText from '../../ui/EditableText';
import toast from 'react-hot-toast';
import { getButtonProps, cornerRadiusStyles, fontWeightStyles, letterSpacingStyles } from './utils';

interface BlockViewProps {
    block: any;
    design: Portfolio['design'];
    theme: Portfolio['customPalettes'][0]['colors'];
    itemVariant: any;
    isEditable?: boolean;
    onUpdateBlock?: (blockId: string, field: string, value: any) => void;
}

export const ContactBlockView: React.FC<BlockViewProps> = ({ block, design, theme, itemVariant, isEditable, onUpdateBlock }) => {
    const { t } = useTranslation();
    const buttonProps = getButtonProps(design);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast(t('contact.formDisabled'));
    };
    const hasBgImage = !!block.designOverrides?.backgroundImage;
    const headingColor = hasBgImage ? '#FFFFFF' : theme.heading;
    const subtleColor = hasBgImage ? '#cbd5e1' : theme.subtle;
    const inputBg = hasBgImage ? 'rgba(255, 255, 255, 0.1)' : theme.inputBackground;
    const inputBorder = hasBgImage ? 'rgba(255, 255, 255, 0.2)' : theme.inputBorder;
    const inputColor = hasBgImage ? '#FFFFFF' : theme.inputText;
    const fontWeightHeadingClass = fontWeightStyles[design.fontWeightHeading] || 'font-bold';
    const letterSpacingClass = letterSpacingStyles[design.letterSpacing] || 'tracking-normal';
    
    const inputStyle = `w-full border p-3 transition-colors duration-200 focus:outline-none ${cornerRadiusStyles[design.cornerRadius]}`;

    return (
        <div id={block.id}>
            <div className={`mx-auto px-4 ${design.pageWidth === 'full' ? 'w-full max-w-2xl' : 'container max-w-2xl'}`}>
                <motion.div variants={itemVariant} className="overflow-hidden"><EditableText as="h2" value={block.title} onSave={(value) => onUpdateBlock?.(block.id, 'title', value)} isEditable={isEditable} className={`text-3xl mb-4 text-center font-heading ${fontWeightHeadingClass} ${letterSpacingClass}`} style={{ color: headingColor }} /></motion.div>
                <motion.div variants={itemVariant}><EditableText as="p" value={block.subtitle} onSave={(value) => onUpdateBlock?.(block.id, 'subtitle', value)} isEditable={isEditable} className={`mb-8 text-center`} style={{ color: subtleColor }} /></motion.div>
                
                <motion.form variants={itemVariant} onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="sr-only">{t('contact.name')}</label>
                        <input type="text" id="name" name="name" placeholder={t('contact.name')} required className={inputStyle} style={{'--tw-ring-color': design.accentColor, backgroundColor: inputBg, borderColor: inputBorder, color: inputColor} as React.CSSProperties} />
                    </div>
                    <div>
                        <label htmlFor="email" className="sr-only">{t('contact.email')}</label>
                        <input type="email" id="email" name="email" placeholder={t('contact.email')} required className={inputStyle} style={{'--tw-ring-color': design.accentColor, backgroundColor: inputBg, borderColor: inputBorder, color: inputColor} as React.CSSProperties} />
                    </div>
                    <div>
                        <label htmlFor="message" className="sr-only">{t('contact.message')}</label>
                        <textarea id="message" name="message" placeholder={t('contact.message')} required rows={5} className={inputStyle} style={{'--tw-ring-color': design.accentColor, backgroundColor: inputBg, borderColor: inputBorder, color: inputColor} as React.CSSProperties}></textarea>
                    </div>
                    <button type="submit" {...buttonProps} className={`${buttonProps.className} w-full`}>
                        {block.buttonText || t('contact.submit')}
                    </button>
                </motion.form>
            </div>
        </div>
    );
};
