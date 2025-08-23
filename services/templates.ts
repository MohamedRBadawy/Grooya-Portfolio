

import type { PortfolioTemplate } from '../types';

export const portfolioTemplates: PortfolioTemplate[] = [
    {
        id: 'developer-template',
        name: 'template.developer.name',
        description: 'template.developer.desc',
        design: {
            paletteId: 'default-dark',
            headingFont: 'Sora',
            bodyFont: 'Inter',
            fontSize: 'md',
            fontWeightHeading: 'bold',
            fontWeightBody: 'normal',
            lineHeight: 'normal',
            letterSpacing: 'normal',
            shadowStyle: 'md',
            pageWidth: 'standard',
            buttonStyle: 'rounded',
            accentColor: '#26b3b3', // teal-500
            spacing: 'cozy',
            cornerRadius: 'md',
            animationStyle: 'fadeIn',
            navigationStyle: 'stickyHeader',
            transparentHeader: true,
            scrollIndicator: 'progressBar',
            parallax: true,
            customCss: '',
        },
        pages: [{
            id: 'dev-home',
            name: 'Home',
            path: '/',
            blocks: [
                {
                    id: 'temp-hero',
                    type: 'hero',
                    headline: 'John Doe, Software Engineer',
                    subheadline: 'I build robust and scalable web applications.',
                    imageUrl: 'https://picsum.photos/seed/dev-hero/1200/600',
                    ctaText: 'View My Work',
                    ctaLink: '#projects',
                },
                {
                    id: 'temp-about',
                    type: 'about',
                    title: 'About Me',
                    content: 'I am a passionate developer with a knack for solving complex problems. With a background in computer science and several years of hands-on experience, I specialize in creating efficient, user-friendly, and maintainable code.',
                },
                {
                    id: 'temp-skills',
                    type: 'skills',
                    title: 'My Technical Skills',
                    skillIds: [],
                },
                {
                    id: 'temp-projects',
                    type: 'projects',
                    title: 'Featured Projects',
                    projectIds: [],
                },
                {
                    id: 'temp-experience',
                    type: 'experience',
                    title: 'Work Experience',
                    items: [
                      { id: 'exp-1', title: 'Senior Software Engineer', company: 'Tech Giant Inc.', dateRange: 'Jan 2022 - Present', description: 'Lead developer on the main product team, responsible for architecture and feature implementation.' },
                    ],
                },
                {
                    id: 'temp-contact',
                    type: 'contact',
                    title: 'Get In Touch',
                    subtitle: 'I\'m open to new opportunities and collaborations. Feel free to reach out!',
                    buttonText: 'Send Message',
                },
            ]
        }],
    },
    {
        id: 'designer-template',
        name: 'template.designer.name',
        description: 'template.designer.desc',
        design: {
            paletteId: 'default-light',
            headingFont: 'Playfair Display',
            bodyFont: 'Lato',
            fontSize: 'md',
            fontWeightHeading: 'normal',
            fontWeightBody: 'normal',
            lineHeight: 'relaxed',
            letterSpacing: 'normal',
            shadowStyle: 'lg',
            pageWidth: 'standard',
            buttonStyle: 'pill',
            accentColor: '#ffb84d', // saffron-400
            spacing: 'spacious',
            cornerRadius: 'lg',
            animationStyle: 'slideInUp',
            navigationStyle: 'minimalHeader',
            transparentHeader: false,
            scrollIndicator: 'none',
            parallax: true,
            customCss: '',
        },
        pages: [{
            id: 'designer-home',
            name: 'Home',
            path: '/',
            blocks: [
                {
                    id: 'temp-hero-designer',
                    type: 'hero',
                    headline: 'Jane Smith, Product Designer',
                    subheadline: 'Crafting intuitive and beautiful user experiences.',
                    imageUrl: 'https://picsum.photos/seed/design-hero/1200/600',
                    ctaText: 'See My Portfolio',
                    ctaLink: '#gallery',
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
                    ],
                },
                {
                    id: 'temp-about-designer',
                    type: 'about',
                    title: 'My Design Philosophy',
                    content: 'I believe that great design is not just about aesthetics, but about solving problems and creating seamless interactions. My process is user-centered, iterative, and always focused on achieving business goals through design.',
                },
                {
                    id: 'temp-services',
                    type: 'services',
                    title: 'What I Offer',
                    tiers: [
                      { id: 'tier-1', title: 'UX/UI Design', price: '$2,000', frequency: '', description: 'Full design process from wireframes to high-fidelity prototypes.', features: ['User Research', 'Wireframing', 'Prototyping', 'User Testing'], buttonText: 'Inquire', isFeatured: true, link: '#' },
                    ]
                },
                {
                    id: 'temp-contact-designer',
                    type: 'contact',
                    title: 'Let\'s Create Together',
                    subtitle: 'Have a project in mind? I would love to hear about it.',
                    buttonText: 'Get in Touch',
                },
            ]
        }],
    },
     {
        id: 'photographer-template',
        name: 'template.photographer.name',
        description: 'template.photographer.desc',
        design: {
            paletteId: 'default-dark',
            headingFont: 'Montserrat',
            bodyFont: 'Lato',
            fontSize: 'sm',
            pageWidth: 'full',
            buttonStyle: 'square',
            accentColor: '#f8f9f9', // charcoal-50
            spacing: 'spacious',
            cornerRadius: 'none',
            animationStyle: 'fadeIn',
            navigationStyle: 'minimalHeader',
            fontWeightHeading: 'bold',
            fontWeightBody: 'normal',
            lineHeight: 'relaxed',
            letterSpacing: 'wide',
            shadowStyle: 'sm',
            transparentHeader: true,
            scrollIndicator: 'progressBar',
            parallax: true,
            customCss: '',
        },
        pages: [{
            id: 'photo-home',
            name: 'Home',
            path: '/',
            blocks: [
                {
                    id: 'photo-hero', type: 'hero', headline: 'Alex Doe | Photographer', subheadline: 'Capturing moments that tell a story.', imageUrl: 'https://picsum.photos/seed/photo-hero/1200/800', ctaText: 'Book a Session', ctaLink: '#contact',
                },
                {
                    id: 'photo-gallery', type: 'gallery', title: 'My Work', layout: 'masonry',
                    images: [
                      { id: 'pgal-1', url: 'https://picsum.photos/seed/pgal1/800/1200', caption: 'Portrait' },
                      { id: 'pgal-2', url: 'https://picsum.photos/seed/pgal2/1200/800', caption: 'Landscape' },
                      { id: 'pgal-3', url: 'https://picsum.photos/seed/pgal3/800/800', caption: 'Events' },
                      { id: 'pgal-4', url: 'https://picsum.photos/seed/pgal4/1200/800', caption: 'Nature' },
                    ],
                },
                {
                    id: 'photo-services', type: 'services', title: 'Services',
                    tiers: [
                      { id: 'ptier-1', title: 'Portrait Session', price: '$400', frequency: '', description: '1-hour session with 20 edited photos.', features: ['Outdoor or Studio', 'High-Resolution Images', 'Online Gallery'], buttonText: 'Book Now', isFeatured: true, link: '#' },
                      { id: 'ptier-2', title: 'Event Photography', price: '$1200', frequency: '', description: 'Coverage for events up to 4 hours.', features: ['All-day Coverage', '200+ Edited Photos', 'Fast Turnaround'], buttonText: 'Inquire', isFeatured: false, link: '#' },
                    ]
                },
                {
                    id: 'photo-about', type: 'about', title: 'About the Artist', content: 'My passion is to freeze fleeting moments in time, creating timeless images that can be cherished for a lifetime. I specialize in portrait and event photography, with a focus on natural light and authentic emotion.',
                },
                {
                    id: 'photo-contact', type: 'contact', title: 'Contact Me', subtitle: 'For inquiries about sessions, prints, or collaborations.', buttonText: 'Send Inquiry',
                },
            ]
        }],
    },
    {
        id: 'writer-template',
        name: 'template.writer.name',
        description: 'template.writer.desc',
        design: {
            paletteId: 'default-rose',
            headingFont: 'Lora',
            bodyFont: 'Merriweather',
            fontSize: 'md',
            pageWidth: 'standard',
            buttonStyle: 'rounded',
            accentColor: '#a63022', // terracotta-700
            spacing: 'cozy',
            cornerRadius: 'sm',
            animationStyle: 'slideInUp',
            navigationStyle: 'stickyHeader',
            transparentHeader: false,
            scrollIndicator: 'progressBar',
            parallax: false,
            fontWeightHeading: 'bold',
            fontWeightBody: 'normal',
            lineHeight: 'relaxed',
            letterSpacing: 'normal',
            shadowStyle: 'sm',
            customCss: '',
        },
        pages: [{
            id: 'writer-home',
            name: 'Home',
            path: '/',
            blocks: [
                 {
                    id: 'writer-hero', type: 'hero', headline: 'Jane Doe | Writer & Journalist', subheadline: 'Weaving words into compelling narratives.', imageUrl: 'https://picsum.photos/seed/writer-hero/1200/600', ctaText: 'Read My Work', ctaLink: '#blog',
                },
                {
                    id: 'writer-blog', type: 'blog', title: 'Published Articles',
                    posts: [
                        { id: 'wpost-1', title: 'The Future of Remote Work', excerpt: 'An in-depth analysis of post-pandemic work culture.', imageUrl: 'https://picsum.photos/seed/wpost1/600/400', link: '#' },
                        { id: 'wpost-2', title: 'A Journey Through the Andes', excerpt: 'A travelogue about exploring South American culture and landscapes.', imageUrl: 'https://picsum.photos/seed/wpost2/600/400', link: '#' },
                    ]
                },
                {
                    id: 'writer-about', type: 'about', title: 'About Me', content: 'I am a professional writer with a focus on long-form journalism and cultural commentary. My work has been featured in several national publications, where I strive to uncover the human stories behind the headlines.',
                },
                {
                    id: 'writer-testimonials', type: 'testimonials', title: 'Praise',
                    testimonials: [ { id: 'wtest-1', quote: 'Jane has a unique ability to craft stories that are both informative and deeply moving.', author: 'John Smith', authorTitle: 'Editor, The Daily Chronicle', authorAvatarUrl: 'https://picsum.photos/seed/wavatar1/100/100' }]
                },
                {
                    id: 'writer-links', type: 'links', title: 'Follow Me',
                    links: [ { id: 'wlink-1', platform: 'twitter', url: '#', text: 'Twitter' }, { id: 'wlink-2', platform: 'linkedin', url: '#', text: 'LinkedIn' } ]
                },
            ]
        }],
    },
     {
        id: 'freelancer-template',
        name: 'template.freelancer.name',
        description: 'template.freelancer.desc',
        design: {
            paletteId: 'default-mint',
            headingFont: 'Poppins',
            bodyFont: 'Inter',
            fontSize: 'md',
            pageWidth: 'standard',
            buttonStyle: 'pill',
            accentColor: '#186f6f', // teal-700
            spacing: 'cozy',
            cornerRadius: 'lg',
            animationStyle: 'fadeIn',
            navigationStyle: 'stickyHeader',
            transparentHeader: true,
            scrollIndicator: 'progressBar',
            parallax: true,
            fontWeightHeading: 'bold',
            fontWeightBody: 'normal',
            lineHeight: 'normal',
            letterSpacing: 'normal',
            shadowStyle: 'md',
            customCss: '',
        },
        pages: [{
            id: 'freelance-home',
            name: 'Home',
            path: '/',
            blocks: [
                { id: 'free-hero', type: 'hero', headline: 'Alex Doe | Digital Marketing Consultant', subheadline: 'Driving growth for businesses with data-driven strategies.', imageUrl: 'https://picsum.photos/seed/free-hero/1200/600', ctaText: 'My Services', ctaLink: '#services' },
                { 
                    id: 'free-services', type: 'services', title: 'How I Can Help',
                    tiers: [
                        { id: 'free-tier1', title: 'SEO Audit', price: '$800', frequency: 'one-time', description: 'A comprehensive audit of your website to identify growth opportunities.', features:['Technical SEO Analysis', 'Keyword Research', 'Competitor Analysis'], buttonText: 'Get Audit', isFeatured: false },
                        { id: 'free-tier2', title: 'Content Strategy', price: '$1,500', frequency: '/month', description: 'Ongoing content creation and strategy to boost your rankings.', features:['Monthly Content Calendar', '4 Blog Posts per Month', 'Performance Reporting'], buttonText: 'Get Started', isFeatured: true },
                    ]
                },
                { id: 'free-projects', type: 'projects', title: 'Client Case Studies', projectIds: [] },
                { id: 'free-testimonials', type: 'testimonials', title: 'What My Clients Say', testimonials: [ { id: 'free-test1', quote: 'Alex\'s strategies helped us double our organic traffic in just three months. Highly recommended!', author: 'Jane Smith', authorTitle: 'CEO, Startup Inc.', authorAvatarUrl: 'https://picsum.photos/seed/free-avatar/100/100' }] },
                { id: 'free-contact', type: 'contact', title: 'Ready to Grow?', subtitle: 'Let\'s discuss how I can help your business achieve its goals.', buttonText: 'Schedule a Call' },
            ]
        }],
    },
    {
        id: 'minimalist-template',
        name: 'template.scratch.name',
        description: 'template.scratch.desc',
        design: {
            paletteId: 'default-dark',
            headingFont: 'Sora',
            bodyFont: 'Inter',
            fontSize: 'md',
            pageWidth: 'standard',
            buttonStyle: 'rounded',
            accentColor: '#1e8c8c',
            spacing: 'cozy',
            cornerRadius: 'md',
            animationStyle: 'fadeIn',
            navigationStyle: 'none',
            transparentHeader: false,
            scrollIndicator: 'none',
            parallax: false,
            fontWeightHeading: 'bold',
            fontWeightBody: 'normal',
            lineHeight: 'normal',
            letterSpacing: 'normal',
            shadowStyle: 'md',
            customCss: '',
        },
        pages: [{
            id: 'minimal-home',
            name: 'Home',
            path: '/',
            blocks: []
        }],
    }
];