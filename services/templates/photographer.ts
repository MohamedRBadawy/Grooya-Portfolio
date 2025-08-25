import type { PortfolioTemplate } from '../../types';

export const photographerTemplate: PortfolioTemplate = {
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
        accentColor: '#ffffff', // white
        spacing: 'spacious',
        cornerRadius: 'none',
        animationStyle: 'blurIn',
        navigationStyle: 'floatingDots',
        buttonFillStyle: 'outline',
        buttonHoverEffect: 'none',
        navAlignment: 'center',
        fontWeightHeading: 'normal',
        fontWeightBody: 'normal',
        lineHeight: 'relaxed',
        letterSpacing: 'wide',
        shadowStyle: 'sm',
        transparentHeader: true,
        scrollIndicator: 'none',
        parallax: true,
        gridGap: 'compact',
        logoPosition: 'center',
        customCss: '',
        mobileMenuStyle: 'overlay',
        mobileMenuAnimation: 'fadeIn',
    },
    pages: [
        {
            id: 'photo-home',
            name: 'Home',
            path: '/',
            blocks: [
                {
                    id: 'photo-hero', type: 'hero', headline: 'Alex Doe | Photographer', subheadline: 'Capturing moments that tell a story.', imageUrl: '', ctaText: 'Book a Session', ctaLink: '#photo-services',
                    designOverrides: {
                        backgroundImage: 'https://picsum.photos/seed/photo-hero/1600/900',
                        backgroundOpacity: 0.4,
                    }
                },
                {
                    id: 'photo-gallery', type: 'gallery', title: 'My Work', layout: 'masonry',
                    images: [
                      { id: 'pgal-1', url: 'https://picsum.photos/seed/pgal1/800/1200', caption: 'Portrait' },
                      { id: 'pgal-2', url: 'https://picsum.photos/seed/pgal2/1200/800', caption: 'Landscape' },
                      { id: 'pgal-3', url: 'https://picsum.photos/seed/pgal3/800/800', caption: 'Events' },
                      { id: 'pgal-4', url: 'https://picsum.photos/seed/pgal4/1200/800', caption: 'Nature' },
                      { id: 'pgal-5', url: 'https://picsum.photos/seed/pgal5/800/1000', caption: 'Urban' },
                      { id: 'pgal-6', url: 'https://picsum.photos/seed/pgal6/800/600', caption: 'Abstract' },
                    ],
                },
                {
                    id: 'photo-services', type: 'services', title: 'Services',
                    tiers: [
                      { id: 'ptier-1', title: 'Portrait Session', price: '$400', frequency: '', description: '1-hour session with 20 edited photos.', features: ['Outdoor or Studio', 'High-Resolution Images', 'Online Gallery'], buttonText: 'Book Now', isFeatured: true, link: '#' },
                      { id: 'ptier-2', title: 'Event Photography', price: '$1200', frequency: '', description: 'Coverage for events up to 4 hours.', features: ['Full-day Coverage', '200+ Edited Photos', 'Fast Turnaround'], buttonText: 'Inquire', isFeatured: false, link: '#' },
                      { id: 'ptier-3', title: 'Wedding Package', price: '$2500', frequency: '', description: 'Complete wedding day coverage.', features: ['Full-day Coverage', 'Engagement Session', 'Photo Album'], buttonText: 'Inquire', isFeatured: false, link: '#' },
                    ],
                    designOverrides: {
                        backgroundImage: 'https://www.transparenttextures.com/patterns/concrete-wall.png',
                        backgroundOpacity: 0.05
                    }
                },
            ]
        },
        {
            id: 'photo-about',
            name: 'About',
            path: '/about',
            blocks: [
                {
                    id: 'photo-about-block', type: 'about', title: 'About the Artist', content: 'My passion is to freeze fleeting moments in time, creating timeless images that can be cherished for a lifetime. I specialize in portrait and event photography, with a focus on natural light and authentic emotion.',
                    mediaUrl: 'https://picsum.photos/seed/photo-about/800/1000',
                    mediaType: 'image',
                    mediaPosition: 'left',
                    designOverrides: {
                        background: { direction: 90, color1: '#1e293b', color2: '#111827' }
                    }
                },
            ]
        },
        {
            id: 'photo-contact-page',
            name: 'Contact',
            path: '/contact',
            blocks: [
                {
                    id: 'photo-contact', type: 'contact', title: 'Contact Me', subtitle: 'For inquiries about sessions, prints, or collaborations.', buttonText: 'Send Inquiry',
                },
                 {
                    id: 'photo-links',
                    type: 'links',
                    title: 'Follow My Work',
                    links: [
                        { id: 'link-ig', platform: 'custom', url: '#', text: 'Instagram' },
                        { id: 'link-fb', platform: 'custom', url: '#', text: 'Facebook' },
                    ],
                },
            ]
        }
    ],
};