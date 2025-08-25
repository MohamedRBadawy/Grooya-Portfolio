import type { Portfolio, Spacing } from '../../../types';
import React from 'react';

export const cornerRadiusStyles = {
    none: 'rounded-none',
    sm: 'rounded-md',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
};

export const fontWeightStyles: { [key: string]: string } = {
    normal: 'font-normal',
    bold: 'font-bold',
};
export const lineHeightStyles: { [key: string]: string } = {
    tight: 'leading-tight',
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
};
export const letterSpacingStyles: { [key: string]: string } = {
    normal: 'tracking-normal',
    wide: 'tracking-wider',
};

export const shadowStyles: { [key: string]: string } = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
};

export const getGridGapClass = (gap: Spacing | undefined): string => {
    switch (gap) {
        case 'compact': return 'gap-4'; // 1rem
        case 'cozy': return 'gap-8'; // 2rem
        case 'spacious': return 'gap-12'; // 3rem
        default: return 'gap-8'; // Default to cozy
    }
};

export const hexToRgba = (hex: string, alpha: number) => {
    if (!hex.startsWith('#')) return hex;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getButtonProps = (design: Portfolio['design'], variant?: 'solid' | 'outline') => {
    const { buttonFillStyle = 'solid', buttonHoverEffect = 'none', accentColor, buttonStyle, cornerRadius } = design;

    const finalVariant = variant || buttonFillStyle;

    const buttonCornerClass = {
        rounded: cornerRadius === 'lg' ? 'rounded-lg' : 'rounded-md',
        pill: 'rounded-full',
        square: 'rounded-none',
    }[buttonStyle];

    const baseClasses = `inline-block px-8 py-3 font-semibold transition-all duration-300 transform`;

    const fillClasses = finalVariant === 'solid'
        ? `bg-[--accent-color] text-white`
        : `border-2 border-[--accent-color] bg-transparent text-[--accent-color] hover:bg-[--accent-color] hover:text-white`;

    const hoverClasses = {
        none: '',
        lift: 'hover:-translate-y-1 hover:shadow-lg',
        scale: 'hover:scale-105',
    }[buttonHoverEffect];

    return {
        className: `${baseClasses} ${buttonCornerClass} ${fillClasses} ${hoverClasses}`,
        style: { '--accent-color': accentColor } as React.CSSProperties
    };
};

export const getCardStyles = (design: Portfolio['design'], theme: any): React.CSSProperties => {
    const styles: React.CSSProperties = {
        backgroundColor: theme.cardBackground,
        borderColor: theme.cardBorder,
    };

    if (design.cardBorderStyle && design.cardBorderStyle.width >= 0) {
        if (design.cardBorderStyle.width === 0) {
             styles.borderWidth = '0px';
        } else {
            styles.borderWidth = `${design.cardBorderStyle.width}px`;
            styles.borderStyle = design.cardBorderStyle.style;
        }
    } else {
        // default
        styles.borderWidth = '1px';
        styles.borderStyle = 'solid';
    }

    return styles;
};