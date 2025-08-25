import type { PortfolioTemplate } from '../../types';

export const designerTemplate: PortfolioTemplate = {
    id: 'designer-template',
    name: 'template.designer.name',
    description: 'template.designer.desc',
    design: {
        paletteId: 'default-light',
        headingFont: 'Playfair Display',
        bodyFont: 'Lora',
        fontSize: 'md',
        fontWeightHeading: 'bold',
        fontWeightBody: 'normal',
        lineHeight: 'relaxed',
        letterSpacing: 'normal',
        shadowStyle: 'lg',
        pageWidth: 'standard',
        buttonStyle: 'pill',
        accentColor: '#f97316', // Orange 500
        spacing: 'spacious',
        cornerRadius: 'lg',
        animationStyle: 'revealUp',
        navigationStyle: 'minimalHeader',
        buttonFillStyle: 'solid',
        buttonHoverEffect: 'scale',
        navAlignment: 'center',
        transparentHeader: false,
        scrollIndicator: 'none',
        parallax: false,
        gridGap: 'spacious',
        logoPosition: 'center',
        cardBorderStyle: { width: 1, style: 'solid' },
        customCss: '',
        mobileMenuStyle: 'overlay',
        mobileMenuAnimation: 'fadeIn',
    },
    pages: [
        {
            id: 'designer-home',
            name: 'Home',
            path: '/',
            blocks: [
                {
                    id: 'temp-hero-designer',
                    type: 'hero',
                    headline: 'Jane Smith',
                    subheadline: 'A Product Designer crafting intuitive and beautiful user experiences where form follows function.',
                    imageUrl: '', // Typography-focused hero
                    ctaText: 'See My Portfolio',
                    ctaLink: '#temp-gallery',
                    designOverrides: {
                        background: { direction: 20, color1: '#fff7ed', color2: '#fefce8' },
                        shapeDividers: {
                            bottom: { type: 'curve', color: '#ffffff', flipX: false, height: 100 }
                        }
                    }
                },
                {
                    id: 'temp-about-designer',
                    type: 'about',
                    title: 'My Design Philosophy',
                    content: 'I believe that great design is not just about aesthetics, but about solving problems and creating seamless interactions that feel effortless. My process is user-centered, iterative, and always focused on achieving business goals through empathetic design.',
                    mediaUrl: 'https://picsum.photos/seed/design-about/600/800',
                    mediaType: 'image',
                    mediaPosition: 'right',
                    stickyMedia: true,
                },
                {
                    id: 'temp-gallery',
                    type: 'gallery',
                    title: 'Selected Works',
                    layout: 'masonry',
                    images: [
                      { id: 'gal-1', url: 'https://picsum.photos/seed/d-gal1/800/600', caption: 'Mobile App UI' },
                      { id: 'gal-2', url: 'https://picsum.photos/seed/d-gal2/800/1200', caption: 'Website Redesign' },
                      { id: 'gal-3', url: 'https://picsum.photos/seed/d-gal3/800/800', caption: 'Branding Project' },
                      { id: 'gal-4', url: 'https://picsum.photos/seed/d-gal4/800/900', caption: 'Dashboard Concept' },
                    ],
                },
                {
                    id: 'temp-services',
                    type: 'services',
                    title: 'What I Offer',
                    tiers: [
                      { id: 'tier-1', title: 'UX/UI Design', price: '$2,000', frequency: '', description: 'Full design process from wireframes to high-fidelity prototypes.', features: ['User Research', 'Wireframing', 'Prototyping', 'User Testing'], buttonText: 'Inquire', isFeatured: true, link: '#' },
                       { id: 'tier-2', title: 'Design Audit', price: '$800', frequency: '', description: 'A comprehensive review of your existing product with actionable feedback.', features: ['Heuristic Evaluation', 'Usability Report', 'Competitor Analysis'], buttonText: 'Get Audit', isFeatured: false, link: '#' },
                    ],
                     designOverrides: {
                        backgroundImage: 'https://www.transparenttextures.com/patterns/az-subtle.png',
                    }
                },
                {
                    id: 'temp-testimonials-designer',
                    type: 'testimonials',
                    title: 'From My Clients',
                    testimonials: [
                        { id: 'test-1', quote: 'Jane has an incredible ability to translate complex requirements into clean, beautiful, and user-friendly designs.', author: 'John Doe', authorTitle: 'CEO, Innovate Inc.', authorAvatarUrl: 'https://picsum.photos/seed/avatar2/100/100' },
                    ],
                },
                {
                    id: 'temp-cta-designer',
                    type: 'cta',
                    title: "Have a project in mind?",
                    subtitle: "I'm always excited to discuss new ideas and collaborations.",
                    buttonText: 'Let\'s Talk',
                    buttonLink: '/process',
                }
            ]
        },
        {
            id: 'designer-process',
            name: 'My Process',
            path: '/process',
            blocks: [
                 {
                    id: 'temp-experience-designer',
                    type: 'experience',
                    title: 'My Design Process',
                    items: [
                      { id: 'exp-1', title: '1. Discover & Define', company: 'Research Phase', dateRange: '', description: 'Conducting user interviews, competitive analysis, and stakeholder workshops to understand the problem space and define project goals.' },
                      { id: 'exp-2', title: '2. Ideate & Design', company: 'Creative Phase', dateRange: '', description: 'Creating user flows, wireframes, and high-fidelity prototypes to explore solutions and visualize the user experience.' },
                      { id: 'exp-3', title: '3. Test & Iterate', company: 'Validation Phase', dateRange: '', description: 'Running usability tests with real users to gather feedback and iteratively refine the design until it is intuitive and effective.' },
                    ],
                 },
                 {
                    id: 'temp-contact-designer',
                    type: 'contact',
                    title: 'Let\'s Create Together',
                    subtitle: 'Have a project in mind? I would love to hear about it.',
                    buttonText: 'Get in Touch',
                },
            ]
        }
    ],
};