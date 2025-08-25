import type { PortfolioTemplate } from '../../types';

export const boldMinimalistTemplate: PortfolioTemplate = {
    id: 'bold-minimalist-template',
    name: 'template.bold.name',
    description: 'template.bold.desc',
    design: {
        paletteId: 'default-dark',
        headingFont: 'Inter',
        bodyFont: 'Inter',
        fontSize: 'md',
        fontWeightHeading: 'bold',
        fontWeightBody: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        shadowStyle: 'none',
        pageWidth: 'full',
        buttonStyle: 'square',
        accentColor: '#f43f5e', // rose-500
        spacing: 'spacious',
        cornerRadius: 'none',
        animationStyle: 'fadeIn',
        navigationStyle: 'none',
        buttonFillStyle: 'solid',
        buttonHoverEffect: 'none',
        navAlignment: 'right',
        transparentHeader: false,
        scrollIndicator: 'none',
        parallax: false,
        gridGap: 'compact',
        logoPosition: 'left',
        cardBorderStyle: { width: 2, style: 'dotted' },
        customCss: `
            h1, h2, h3 {
                text-transform: uppercase;
            }
        `,
        mobileMenuStyle: 'overlay',
        mobileMenuAnimation: 'fadeIn',
    },
    pages: [
        {
            id: 'bold-home',
            name: 'Home',
            path: '/',
            blocks: [
                {
                    id: 'bold-hero',
                    type: 'hero',
                    headline: 'ALEX DOE',
                    subheadline: 'VISUAL ARTIST & DEVELOPER',
                    imageUrl: '',
                    ctaText: 'EXPLORE',
                    ctaLink: '#bold-gallery',
                    designOverrides: {
                        background: '#020617',
                    }
                },
                {
                    id: 'bold-gallery',
                    type: 'gallery',
                    title: 'PROJECTS',
                    layout: 'grid',
                    images: [
                      { id: 'bgal-1', url: 'https://picsum.photos/seed/bgal1/800/800', caption: '' },
                      { id: 'bgal-2', url: 'https://picsum.photos/seed/bgal2/800/800', caption: '' },
                      { id: 'bgal-3', url: 'https://picsum.photos/seed/bgal3/800/800', caption: '' },
                    ],
                    designOverrides: {
                        background: '#ffffff',
                        textColor: '#020617'
                    }
                },
                {
                    id: 'bold-links',
                    type: 'links',
                    title: 'INDEX',
                    links: [
                        { id: 'blink-1', platform: 'github', url: '#', text: 'GitHub' },
                        { id: 'blink-2', platform: 'custom', url: '#', text: 'Are.na' },
                        { id: 'blink-3', platform: 'custom', url: '#', text: 'Instagram' },
                    ]
                },
                {
                    id: 'bold-contact',
                    type: 'contact',
                    title: 'INQUIRIES',
                    subtitle: 'AVAILABLE FOR COMMISSIONS AND COLLABORATIONS.',
                    buttonText: 'SUBMIT',
                     designOverrides: {
                        background: '#ffffff',
                        textColor: '#020617'
                    }
                },
            ]
        }
    ],
};
