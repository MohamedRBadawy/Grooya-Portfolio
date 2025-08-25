import type { PortfolioTemplate } from '../../types';

export const writerTemplate: PortfolioTemplate = {
    id: 'writer-template',
    name: 'template.writer.name',
    description: 'template.writer.desc',
    design: {
        paletteId: 'default-light',
        headingFont: 'Lora',
        bodyFont: 'Merriweather',
        fontSize: 'md',
        pageWidth: 'standard',
        buttonStyle: 'rounded',
        accentColor: '#1e40af', // blue-700
        spacing: 'cozy',
        cornerRadius: 'sm',
        animationStyle: 'fadeIn',
        navigationStyle: 'stickyHeader',
        buttonFillStyle: 'solid',
        buttonHoverEffect: 'none',
        navAlignment: 'right',
        transparentHeader: false,
        scrollIndicator: 'progressBar',
        parallax: false,
        fontWeightHeading: 'bold',
        fontWeightBody: 'normal',
        lineHeight: 'relaxed',
        letterSpacing: 'normal',
        shadowStyle: 'sm',
        gridGap: 'cozy',
        logoPosition: 'left',
        linkStyle: 'underline',
        cardBorderStyle: { width: 1, style: 'dotted' },
        customCss: '',
        mobileMenuStyle: 'overlay',
        mobileMenuAnimation: 'fadeIn',
    },
    pages: [
        {
            id: 'writer-home',
            name: 'Home',
            path: '/',
            blocks: [
                 {
                    id: 'writer-hero', type: 'hero', headline: 'Jane Doe | Writer & Journalist', subheadline: 'Weaving words into compelling narratives.', imageUrl: '', ctaText: 'Read My Work', ctaLink: '#writer-blog',
                },
                {
                    id: 'writer-about', type: 'about', title: 'About Me', content: 'I am a professional writer with a focus on long-form journalism and cultural commentary. My work has been featured in several national publications, where I strive to uncover the human stories behind the headlines.',
                     designOverrides: {
                        backgroundImage: 'https://www.transparenttextures.com/patterns/clean-textile.png',
                    }
                },
                {
                    id: 'writer-blog', type: 'blog', title: 'Published Articles',
                    posts: [
                        { id: 'wpost-1', title: 'The Future of Remote Work', excerpt: 'An in-depth analysis of post-pandemic work culture and its societal impact.', imageUrl: 'https://picsum.photos/seed/wpost1/600/400', link: '#' },
                        { id: 'wpost-2', title: 'A Journey Through the Andes', excerpt: 'A travelogue about exploring South American culture, landscapes, and the stories of its people.', imageUrl: 'https://picsum.photos/seed/wpost2/600/400', link: '#' },
                        { id: 'wpost-3', title: 'The Ethics of Artificial Intelligence', excerpt: 'Examining the complex moral questions raised by advancements in generative AI.', imageUrl: 'https://picsum.photos/seed/wpost3/600/400', link: '#' },
                    ]
                },
                {
                    id: 'writer-testimonials', type: 'testimonials', title: 'Praise From Editors',
                    testimonials: [ { id: 'wtest-1', quote: 'Jane has a unique ability to craft stories that are both informative and deeply moving. She is a reliable and insightful contributor.', author: 'John Smith', authorTitle: 'Editor, The Daily Chronicle', authorAvatarUrl: 'https://picsum.photos/seed/wavatar1/100/100' }],
                    designOverrides: {
                        background: { direction: 180, color1: '#f8fafc', color2: '#ffffff' }
                    }
                },
                {
                    id: 'writer-resume', type: 'resume', title: 'Press Kit / CV', description: 'For a detailed list of publications, awards, and speaking engagements, please download my curriculum vitae.', fileUrl: '#', buttonText: 'Download CV'
                },
            ]
        },
        {
            id: 'writer-contact',
            name: 'Contact',
            path: '/contact',
            blocks: [
                 {
                    id: 'writer-contact-block', type: 'contact', title: 'Inquiries', subtitle: 'For literary agent inquiries, speaking engagements, or reader messages.', buttonText: 'Send Message'
                },
                {
                    id: 'writer-links', type: 'links', title: 'Follow Me',
                    links: [ { id: 'wlink-1', platform: 'twitter', url: '#', text: 'Twitter' }, { id: 'wlink-2', platform: 'linkedin', url: '#', text: 'LinkedIn' } ]
                },
            ]
        }
    ],
};