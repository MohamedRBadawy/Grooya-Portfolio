import type { PortfolioTemplate } from '../../types';

export const freelancerTemplate: PortfolioTemplate = {
    id: 'freelancer-template',
    name: 'template.freelancer.name',
    description: 'template.freelancer.desc',
    design: {
        paletteId: 'default-light',
        headingFont: 'Poppins',
        bodyFont: 'Inter',
        fontSize: 'md',
        pageWidth: 'standard',
        buttonStyle: 'pill',
        accentColor: '#0d9488', // teal-600
        spacing: 'cozy',
        cornerRadius: 'lg',
        animationStyle: 'slideInUp',
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
        mobileMenuStyle: 'drawer',
        mobileMenuAnimation: 'slideIn',
    },
    pages: [
        {
            id: 'freelance-home',
            name: 'Home',
            path: '/',
            blocks: [
                { id: 'free-hero', type: 'hero', headline: 'Alex Doe | Digital Marketing Consultant', subheadline: 'Driving growth for businesses with data-driven strategies.', imageUrl: 'https://picsum.photos/seed/free-hero/1200/600', ctaText: 'My Services', ctaLink: '#free-services', designOverrides: { shapeDividers: { bottom: { type: 'slant', color: '#ffffff', flipX: false, height: 80 } } } },
                { 
                    id: 'free-testimonials', 
                    type: 'testimonials', 
                    title: 'What My Clients Say', 
                    testimonials: [ 
                        { id: 'free-test1', quote: 'Alex\'s strategies helped us double our organic traffic in just three months. Highly recommended!', author: 'Jane Smith', authorTitle: 'CEO, Startup Inc.', authorAvatarUrl: 'https://picsum.photos/seed/free-avatar/100/100' }, 
                        { id: 'free-test2', quote: 'The most professional and results-oriented consultant we have ever worked with.', author: 'John Davis', authorTitle: 'Founder, E-commerce Brand', authorAvatarUrl: 'https://picsum.photos/seed/free-avatar2/100/100' }
                    ],
                    designOverrides: {
                        backgroundImage: 'https://picsum.photos/seed/free-test-bg/1600/900',
                        backgroundOpacity: 0.8,
                        textColor: '#FFFFFF'
                    }
                },
                { 
                    id: 'free-services', type: 'services', title: 'How I Can Help',
                    tiers: [
                        { id: 'free-tier1', title: 'SEO Audit', price: '$800', frequency: 'one-time', description: 'A comprehensive audit of your website to identify growth opportunities.', features:['Technical SEO Analysis', 'Keyword Research', 'Competitor Analysis'], buttonText: 'Get Audit', isFeatured: false },
                        { id: 'free-tier2', title: 'Content Strategy', price: '$1,500', frequency: '/month', description: 'Ongoing content creation and strategy to boost your rankings.', features:['Monthly Content Calendar', '4 Blog Posts per Month', 'Performance Reporting'], buttonText: 'Get Started', isFeatured: true },
                        { id: 'free-tier3', title: 'Full Retainer', price: 'Contact', frequency: '', description: 'A complete, hands-on marketing solution tailored to your business needs.', features: ['SEO & Content', 'PPC Management', 'Weekly Strategy Calls'], buttonText: 'Inquire', isFeatured: false },
                    ]
                },
                { id: 'free-projects', type: 'projects', title: 'Client Case Studies', projectIds: [] },
                { id: 'free-cta', type: 'cta', title: "Ready to Grow?", subtitle: "Let's discuss how I can help your business achieve its goals.", buttonText: "Schedule a Free Consultation", buttonLink: "#", designOverrides: { background: { direction: 45, color1: '#f0f9ff', color2: '#f1f5f9' } } },
            ]
        },
        {
            id: 'freelance-about',
            name: 'About',
            path: '/about',
            blocks: [
                {
                    id: 'free-about', type: 'about', title: 'My Approach', content: 'I partner with businesses to build a sustainable engine for organic growth. My approach is rooted in data, transparency, and a deep understanding of your customers and business objectives. I don\'t just deliver reports; I deliver results.'
                },
                {
                    id: 'free-experience', type: 'experience', title: 'Professional Background', items: [{id: 'exp-1', title: 'Digital Marketing Lead', company: 'SaaS Corp', dateRange: '2019-2022', description: 'Led a team of 5 marketers, growing organic search traffic by 300% over two years.'}]
                },
                {
                    id: 'free-contact', type: 'contact', title: 'Send a Direct Message', subtitle: 'Fill out the form below and I will get back to you within 24 hours.', buttonText: 'Send Inquiry'
                },
            ]
        }
    ],
};