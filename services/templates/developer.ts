import type { PortfolioTemplate } from '../../types';

export const developerTemplate: PortfolioTemplate = {
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
        shadowStyle: 'lg',
        pageWidth: 'standard',
        buttonStyle: 'pill',
        accentColor: '#3b82f6', // blue-500
        spacing: 'cozy',
        cornerRadius: 'lg',
        animationStyle: 'slideInFromLeft',
        navigationStyle: 'stickyHeader',
        buttonFillStyle: 'outline',
        buttonHoverEffect: 'lift',
        navAlignment: 'right',
        transparentHeader: true,
        scrollIndicator: 'progressBar',
        parallax: true,
        gridGap: 'cozy',
        logoPosition: 'left',
        customCss: '',
        mobileMenuStyle: 'drawer',
        mobileMenuAnimation: 'slideIn',
    },
    pages: [
        {
            id: 'dev-home',
            name: 'Home',
            path: '/',
            blocks: [
                {
                    id: 'temp-hero-dev',
                    type: 'hero',
                    headline: 'John Doe, Software Engineer',
                    subheadline: 'I build robust and scalable full-stack web applications.',
                    imageUrl: '',
                    ctaText: 'View My Work',
                    ctaLink: '#temp-projects-dev',
                    designOverrides: {
                        backgroundImage: 'https://picsum.photos/seed/dev-hero/1600/900',
                        backgroundOpacity: 0.6,
                        shapeDividers: {
                            bottom: { type: 'slant', color: '#020617', flipX: true, height: 80 }
                        }
                    }
                },
                {
                    id: 'temp-about-dev',
                    type: 'about',
                    title: 'About Me',
                    content: 'I am a passionate developer with a knack for solving complex problems. With a background in computer science and several years of hands-on experience, I specialize in creating efficient, user-friendly, and maintainable code using modern frameworks.',
                    mediaUrl: 'https://picsum.photos/seed/dev-about/600/800',
                    mediaType: 'image',
                    mediaPosition: 'left',
                    stickyMedia: true,
                    designOverrides: {
                       background: { direction: 160, color1: '#020617', color2: '#111827' }
                    }
                },
                {
                    id: 'temp-experience-dev',
                    type: 'experience',
                    title: 'Work Experience',
                    items: [
                      { id: 'exp-1', title: 'Senior Software Engineer', company: 'Tech Giant Inc.', dateRange: 'Jan 2022 - Present', description: 'Lead developer on the main product team, responsible for architecture design and feature implementation in a high-traffic environment.' },
                      { id: 'exp-2', title: 'Frontend Developer', company: 'Startup Innovations', dateRange: 'Jun 2020 - Dec 2021', description: 'Developed and maintained responsive user interfaces using React and TypeScript, improving application performance by 25%.' },
                    ],
                },
                {
                    id: 'temp-skills-dev',
                    type: 'skills',
                    title: 'My Technical Stack',
                    skillIds: ['skill-1', 'skill-2', 'skill-3', 'skill-9', 'skill-4', 'skill-7', 'skill-10'],
                     designOverrides: {
                        backgroundImage: 'https://www.transparenttextures.com/patterns/subtle-carbon.png',
                        border: { top: { width: 1, style: 'dashed', color: '#334155' }, bottom: { width: 1, style: 'dashed', color: '#334155' } },
                        padding: { top: '8rem', bottom: '8rem' }
                    }
                },
                {
                    id: 'temp-projects-dev',
                    type: 'projects',
                    title: 'Featured Projects',
                    projectIds: ['proj-1', 'proj-4'],
                },
                 {
                    id: 'temp-code-dev',
                    type: 'code',
                    title: 'Code Snippet Example',
                    language: 'typescript',
                    code: `
        // Custom hook for fetching data with loading and error states
        import { useState, useEffect } from 'react';

        function useFetch<T>(url: string) {
          const [data, setData] = useState<T | null>(null);
          const [loading, setLoading] = useState<boolean>(true);
          const [error, setError] = useState<Error | null>(null);

          useEffect(() => {
            const fetchData = async () => {
              try {
                const response = await fetch(url);
                if (!response.ok) throw new Error('Network response was not ok');
                const result = await response.json();
                setData(result);
              } catch (err) {
                setError(err as Error);
              } finally {
                setLoading(false);
              }
            };

            fetchData();
          }, [url]);

          return { data, loading, error };
        }
                    `.trim(),
                     designOverrides: {
                        background: { direction: 20, color1: '#0f172a', color2: '#1e293b' }
                    }
                },
                {
                    id: 'temp-testimonials-dev',
                    type: 'testimonials',
                    title: 'What My Colleagues Say',
                    testimonials: [
                        { id: 'test-1', quote: 'John is an exceptional developer with a keen eye for detail and architecture. A true asset to any engineering team.', author: 'Jane Smith', authorTitle: 'Project Manager', authorAvatarUrl: 'https://picsum.photos/seed/avatar1/100/100' },
                    ],
                },
                {
                    id: 'temp-cta-dev',
                    type: 'cta',
                    title: "Let's Collaborate",
                    subtitle: 'I am currently available for new projects and opportunities.',
                    buttonText: 'Get in Touch',
                    buttonLink: '/contact',
                }
            ]
        },
        {
            id: 'dev-contact',
            name: 'Contact',
            path: '/contact',
            blocks: [
                {
                    id: 'temp-contact-dev',
                    type: 'contact',
                    title: 'Get In Touch',
                    subtitle: 'I\'m open to new opportunities and collaborations. Feel free to reach out!',
                    buttonText: 'Send Message',
                },
                 {
                    id: 'temp-links-dev',
                    type: 'links',
                    title: 'Find Me Online',
                    links: [
                        { id: 'link-gh', platform: 'github', url: '#', text: 'GitHub' },
                        { id: 'link-li', platform: 'linkedin', url: '#', text: 'LinkedIn' },
                    ],
                },
            ]
        }
    ],
};