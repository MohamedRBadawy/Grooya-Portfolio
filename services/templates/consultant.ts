import type { PortfolioTemplate } from '../../types';

export const consultantTemplate: PortfolioTemplate = {
    id: 'consultant-template',
    name: 'template.consultant.name',
    description: 'template.consultant.desc',
    design: {
        paletteId: 'default-light',
        headingFont: 'Playfair Display',
        bodyFont: 'Lato',
        fontSize: 'md',
        fontWeightHeading: 'bold',
        fontWeightBody: 'normal',
        lineHeight: 'relaxed',
        letterSpacing: 'normal',
        shadowStyle: 'md',
        pageWidth: 'standard',
        buttonStyle: 'rounded',
        accentColor: '#d97706', // amber-600
        spacing: 'spacious',
        cornerRadius: 'md',
        animationStyle: 'fadeIn',
        navigationStyle: 'stickyHeader',
        buttonFillStyle: 'solid',
        buttonHoverEffect: 'lift',
        navAlignment: 'right',
        transparentHeader: false,
        scrollIndicator: 'none',
        parallax: false,
        gridGap: 'spacious',
        logoPosition: 'left',
        cardBorderStyle: { width: 0, style: 'solid' },
        customCss: '',
        mobileMenuStyle: 'overlay',
        mobileMenuAnimation: 'fadeIn',
    },
    pages: [
        {
            id: 'consultant-home',
            name: 'Home',
            path: '/',
            blocks: [
                {
                    id: 'consultant-hero',
                    type: 'hero',
                    headline: 'Jane Doe | Business Strategy Consultant',
                    subheadline: 'Providing actionable insights to help your business scale new heights.',
                    imageUrl: '',
                    ctaText: 'Schedule a Consultation',
                    ctaLink: '#consultant-contact',
                    designOverrides: {
                        background: { direction: 90, color1: '#fdfbfb', color2: '#ebedee' },
                    }
                },
                {
                    id: 'consultant-about',
                    type: 'about',
                    title: 'Results-Driven Strategy',
                    content: 'With over a decade of experience in management consulting, I specialize in market analysis, operational efficiency, and digital transformation. I partner with leadership teams to develop and implement strategies that create lasting value.',
                    mediaUrl: 'https://picsum.photos/seed/consult-about/600/700',
                    mediaType: 'image',
                    mediaPosition: 'right',
                    stickyMedia: false,
                },
                {
                    id: 'consultant-services',
                    type: 'services',
                    title: 'My Expertise',
                    tiers: [
                      { id: 'ctier-1', title: 'Market Analysis', price: '', frequency: '', description: 'Deep-dive analysis of market trends, competitive landscapes, and customer segmentation.', features: ['SWOT Analysis', 'Industry Benchmarking', 'Growth Projections'], buttonText: 'Learn More', isFeatured: false, link: '#' },
                      { id: 'ctier-2', title: 'Strategy Workshop', price: '', frequency: '', description: 'A full-day intensive workshop with your leadership team to define your strategic roadmap.', features: ['Goal Setting', 'KPI Development', 'Action Plan Creation'], buttonText: 'Book a Workshop', isFeatured: true, link: '#' },
                      { id: 'ctier-3', title: 'Operational Review', price: '', frequency: '', description: 'Identifying bottlenecks and implementing process improvements to boost efficiency.', features: ['Process Mapping', 'Performance Metrics', 'Cost Reduction'], buttonText: 'Learn More', isFeatured: false, link: '#' },
                    ],
                },
                {
                    id: 'consultant-testimonials',
                    type: 'testimonials',
                    title: 'Client Success Stories',
                    testimonials: [
                        { id: 'ctest-1', quote: 'Jane\'s insights were invaluable. She helped us identify a new market segment that led to a 40% increase in revenue.', author: 'John Smith', authorTitle: 'CEO, Tech Solutions', authorAvatarUrl: 'https://picsum.photos/seed/c-avatar1/100/100' },
                        { id: 'ctest-2', quote: 'The strategy workshop was a game-changer for our team. We are now more aligned and focused than ever before.', author: 'Emily White', authorTitle: 'COO, Creative Co.', authorAvatarUrl: 'https://picsum.photos/seed/c-avatar2/100/100' },
                    ],
                    designOverrides: {
                        background: { direction: 180, color1: '#f8fafc', color2: '#ffffff' },
                        shapeDividers: {
                            top: { type: 'curve', color: '#ffffff', flipX: true, height: 60 }
                        }
                    }
                },
                {
                    id: 'consultant-contact',
                    type: 'contact',
                    title: 'Let\'s Discuss Your Goals',
                    subtitle: 'Schedule a complimentary 30-minute consultation to see how I can help your business.',
                    buttonText: 'Book a Call',
                }
            ]
        }
    ],
};