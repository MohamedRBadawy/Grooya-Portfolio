import type { PortfolioTemplate } from '../../types';

export const minimalistTemplate: PortfolioTemplate = {
    id: 'minimalist-template',
    name: 'template.minimalist.name',
    description: 'template.minimalist.desc',
    design: {
        paletteId: 'default-dark',
        headingFont: 'Sora',
        bodyFont: 'Inter',
        fontSize: 'md',
        pageWidth: 'standard',
        buttonStyle: 'rounded',
        accentColor: '#2dd4bf', // teal-400
        spacing: 'cozy',
        cornerRadius: 'md',
        animationStyle: 'fadeIn',
        navigationStyle: 'stickyHeader',
        buttonFillStyle: 'solid',
        buttonHoverEffect: 'lift',
        navAlignment: 'right',
        transparentHeader: true,
        scrollIndicator: 'none',
        parallax: false,
        fontWeightHeading: 'bold',
        fontWeightBody: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        shadowStyle: 'md',
        gridGap: 'cozy',
        logoPosition: 'left',
        customCss: '',
        mobileMenuStyle: 'overlay',
        mobileMenuAnimation: 'fadeIn',
    },
    pages: [{
        id: 'minimal-home',
        name: 'Home',
        path: '/',
        blocks: [
            {
                id: 'temp-hero-minimal',
                type: 'hero',
                headline: 'Your Name Here',
                subheadline: 'Your professional title or a compelling tagline.',
                imageUrl: '',
                ctaText: 'Contact Me',
                ctaLink: '#temp-contact-minimal',
            },
            {
                id: 'temp-contact-minimal',
                type: 'contact',
                title: 'Get In Touch',
                subtitle: 'I\'m available for new opportunities.',
                buttonText: 'Send Message',
            }
        ]
    }],
};