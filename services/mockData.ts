import type { User, Project, Skill, Portfolio, EducationItem, Resume, PromoCode } from '../types';

export const mockUser: User = {
  id: 'user-1',
  name: 'Alex Doe',
  title: 'Senior Frontend Engineer',
  email: 'alex.doe@example.com',
  bio: 'Creative frontend developer with a passion for building beautiful, responsive, and intuitive user interfaces. I turn complex problems into elegant solutions.',
  avatarUrl: 'https://picsum.photos/seed/alexdoe/200/200',
  role: 'admin',
  isEarlyAdopter: true,
  subscription: {
    tier: 'pro',
    status: 'active',
    renewsAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
    freeFeaturesUsed: {},
    credits: {
      text: 100,
      image: 20,
    },
  },
};

export const mockAllUsers: User[] = [
    mockUser,
    {
      id: 'user-admin',
      name: 'Grooya Admin',
      title: 'Platform Administrator',
      email: 'admin@Grooya.com',
      bio: 'System administrator for the Grooya platform.',
      avatarUrl: 'https://picsum.photos/seed/admingrooya/200/200',
      role: 'admin',
      isEarlyAdopter: true,
      subscription: {
        tier: 'premium',
        status: 'active',
        renewsAt: Date.now() + 365 * 24 * 60 * 60 * 1000,
        freeFeaturesUsed: {},
        credits: {
          text: 9999,
          image: 9999,
        },
      },
    },
    {
      id: 'user-2',
      name: 'Jane Smith',
      title: 'UX/UI Designer',
      email: 'jane.smith@example.com',
      bio: 'Designing user-centric digital experiences that are both beautiful and functional.',
      avatarUrl: 'https://picsum.photos/seed/janesmith/200/200',
      role: 'user',
      isEarlyAdopter: false,
      subscription: {
        tier: 'free',
        status: 'active',
        freeFeaturesUsed: { heroContent: true },
        credits: { text: 0, image: 0 },
      },
    },
    {
      id: 'user-3',
      name: 'Sam Wilson',
      title: 'Backend Developer',
      email: 'sam.wilson@example.com',
      bio: 'Building scalable and efficient server-side applications.',
      avatarUrl: 'https://picsum.photos/seed/samwilson/200/200',
      role: 'user',
      isEarlyAdopter: false,
      subscription: {
        tier: 'pro',
        status: 'active',
        renewsAt: Date.now() + 15 * 24 * 60 * 60 * 1000,
        freeFeaturesUsed: {},
        credits: { text: 85, image: 12 },
      },
    },
    {
      id: 'user-4',
      name: 'Maria Garcia',
      title: 'Product Manager',
      email: 'maria.garcia@example.com',
      bio: 'Leading product strategy from concept to launch.',
      avatarUrl: 'https://picsum.photos/seed/mariagarcia/200/200',
      role: 'user',
      isEarlyAdopter: false,
      subscription: {
        tier: 'free',
        status: 'active',
        freeFeaturesUsed: {},
        credits: { text: 0, image: 0 },
      },
    }
];

export const masterSkillsList: Skill[] = [
  { id: 'skill-1', name: 'TypeScript', category: 'Language' },
  { id: 'skill-2', name: 'React', category: 'Framework' },
  { id: 'skill-3', name: 'Node.js', category: 'Framework' },
  { id: 'skill-4', name: 'Tailwind CSS', category: 'Tool' },
  { id: 'skill-5', name: 'Figma', category: 'Tool' },
  { id: 'skill-6', name: 'PostgreSQL', category: 'Database' },
  { id: 'skill-7', name: 'AWS', category: 'Cloud' },
  { id: 'skill-8', name: 'GraphQL', category: 'Language' },
  { id: 'skill-9', name: 'Next.js', category: 'Framework' },
  { id: 'skill-10', name: 'Docker', category: 'Tool' },
];

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'E-commerce Platform',
    description: 'A full-stack e-commerce site with a custom CMS, payment integration, and a responsive user-facing storefront.',
    imageUrl: 'https://picsum.photos/seed/ecomm/600/400',
    technologies: ['React', 'Node.js', 'PostgreSQL'],
    link: '#',
  },
  {
    id: 'proj-2',
    title: 'Data Visualization Dashboard',
    description: 'An interactive dashboard for visualizing complex datasets using D3.js and React, providing real-time insights.',
    imageUrl: 'https://picsum.photos/seed/dataviz/600/400',
    technologies: ['React', 'TypeScript', 'D3.js'],
    link: '#',
  },
  {
    id: 'proj-3',
    title: 'Mobile Banking App',
    description: 'A cross-platform mobile application for personal banking, built with React Native and focused on security and UX.',
    imageUrl: 'https://picsum.photos/seed/banking/600/400',
    technologies: ['React Native', 'TypeScript', 'Firebase'],
    link: '#',
  },
   {
    id: 'proj-4',
    title: 'Project Management Tool',
    description: 'A SaaS application to help teams manage tasks, timelines, and collaboration, featuring a kanban board and calendar views.',
    imageUrl: 'https://picsum.photos/seed/pmtool/600/400',
    technologies: ['Next.js', 'GraphQL', 'Tailwind CSS'],
    link: '#',
  },
];

export const mockEducation: EducationItem[] = [
    {
        id: 'edu-1',
        institution: 'University of Technology',
        degree: 'B.S. in Computer Science',
        dateRange: '2014 - 2018',
        description: 'Graduated with honors, focusing on web development and database management tracks.'
    }
];

const now = Date.now();
const oneDay = 1000 * 60 * 60 * 24;

export const mockPromoCodes: PromoCode[] = [
  {
    id: 'promo-1',
    code: 'GROOYA-ALPHA',
    usageLimit: 1000,
    timesUsed: 50,
    grantsTier: 'premium',
    isEarlyAdopter: true,
    createdAt: now - 10 * oneDay,
  }
];

export const initialResumes: Resume[] = [
    {
        id: 'resume-1',
        title: 'Standard Developer Resume',
        userId: 'user-1',
        createdAt: now - (oneDay * 2),
        updatedAt: now,
        fullName: 'Alex Doe',
        jobTitle: 'Senior Frontend Engineer',
        email: 'alex.doe@example.com',
        phone: '555-123-4567',
        website: 'alexdoe.dev',
        linkedin: 'linkedin.com/in/alexdoe',
        github: 'github.com/alexdoe',
        summary: 'Dedicated and innovative Senior Frontend Engineer with over 5 years of experience in designing, developing, and deploying high-quality web applications. Proficient in React, TypeScript, and modern frontend technologies, with a strong commitment to creating intuitive user experiences and scalable solutions.',
        experience: [
          { id: 'exp-1', title: 'Senior Frontend Engineer', company: 'Tech Solutions Inc.', dateRange: 'Jan 2021 - Present', description: 'Led the development of a new client-facing dashboard using React and TypeScript, improving performance by 30%. Mentored junior developers and established new coding standards.' },
          { id: 'exp-2', title: 'Frontend Developer', company: 'WebCrafters LLC', dateRange: 'Jun 2018 - Dec 2020', description: 'Developed and maintained responsive websites for various clients using HTML, CSS, and JavaScript. Collaborated with designers to translate mockups into functional web pages.' },
        ],
        education: mockEducation,
        skills: masterSkillsList.slice(0, 5),
        projects: [
            { id: 'proj-1', title: 'E-commerce Platform', description: 'Developed a full-stack e-commerce site with a custom CMS and payment integration.', technologies: ['React', 'Node.js', 'PostgreSQL'] },
            { id: 'proj-2', title: 'Data Visualization Dashboard', description: 'Built an interactive dashboard for visualizing complex datasets using D3.js and React.', technologies: ['React', 'TypeScript', 'D3.js'] }
        ],
        template: 'classic',
        accentColor: '#1e8c8c'
    }
];


export const initialPortfolios: Portfolio[] = [
  {
    id: 'port-1',
    title: 'My Frontend Developer Portfolio',
    slug: 'alex-doe-frontend',
    userId: 'user-1',
    isPublished: true,
    design: {
      paletteId: 'default-dark',
      headingFont: 'Sora',
      bodyFont: 'Inter',
      fontSize: 'md',
      fontWeightHeading: 'bold',
      fontWeightBody: 'normal',
      lineHeight: 'relaxed',
      letterSpacing: 'normal',
      shadowStyle: 'md',
      pageWidth: 'standard',
      buttonStyle: 'rounded',
      accentColor: '#1e8c8c', // teal-600
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
      gridGap: 'cozy',
      logoPosition: 'left',
      customCss: '',
      mobileMenuStyle: 'overlay',
      mobileMenuAnimation: 'fadeIn',
    },
    pages: [
        {
            id: 'page-1-1',
            name: 'Home',
            path: '/',
            blocks: [
              {
                id: 'block-1-1',
                type: 'hero',
                headline: 'Hi, I\'m Alex Doe',
                subheadline: 'A passionate Frontend Engineer crafting beautiful web experiences.',
                imageUrl: 'https://picsum.photos/seed/hero/1200/600',
                ctaText: 'View My Work',
                ctaLink: '#projects',
              },
              {
                id: 'block-1-2',
                type: 'about',
                title: 'About Me',
                content: 'I have over 5 years of experience in web development, specializing in React and modern JavaScript frameworks. I am dedicated to building high-quality applications that are both functional and aesthetically pleasing. Let\'s create something amazing together!',
              },
              {
                id: 'block-1-3',
                type: 'projects',
                title: 'Featured Projects',
                projectIds: ['proj-1', 'proj-2'],
              },
              {
                id: 'block-1-4',
                type: 'skills',
                title: 'My Skills',
                skillIds: ['skill-1', 'skill-2', 'skill-4', 'skill-8', 'skill-9'],
              },
            ]
        }
    ],
    assets: [],
    designPresets: [],
    createdAt: now - (oneDay * 10),
    updatedAt: now - (oneDay * 2),
  },
  {
    id: 'port-2',
    title: 'Creative Portfolio',
    slug: 'alex-doe-creative',
    userId: 'user-1',
    isPublished: false,
    design: {
      paletteId: 'default-mint',
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
      accentColor: '#ffa126', // saffron-500
      spacing: 'spacious',
      cornerRadius: 'lg',
      animationStyle: 'slideInUp',
      navigationStyle: 'minimalHeader',
      buttonFillStyle: 'solid',
      buttonHoverEffect: 'scale',
      navAlignment: 'center',
      transparentHeader: false,
      scrollIndicator: 'none',
      parallax: false,
      gridGap: 'cozy',
      logoPosition: 'left',
      customCss: '',
      mobileMenuStyle: 'overlay',
      mobileMenuAnimation: 'fadeIn',
    },
    pages: [
        {
            id: 'page-2-1',
            name: 'Home',
            path: '/',
            blocks: [
                {
                    id: 'block-2-1',
                    type: 'hero',
                    headline: 'Alex Doe: Creative Developer',
                    subheadline: 'Where design meets code.',
                    imageUrl: 'https://picsum.photos/seed/creative/1200/600',
                    ctaText: 'Get In Touch',
                    ctaLink: 'mailto:alex.doe@example.com',
                },
                {
                    id: 'block-2-2',
                    type: 'projects',
                    title: 'Creative Works',
                    projectIds: ['proj-3', 'proj-4'],
                },
            ]
        }
    ],
    assets: [],
    designPresets: [],
    createdAt: now - (oneDay * 5),
    updatedAt: now - (oneDay * 5),
  },
  {
    id: 'port-3',
    title: 'Comprehensive Showcase',
    slug: 'comprehensive-showcase',
    userId: 'user-1',
    isPublished: true,
    design: {
      paletteId: 'default-light',
      headingFont: 'Poppins',
      bodyFont: 'Lato',
      fontSize: 'md',
      fontWeightHeading: 'bold',
      fontWeightBody: 'normal',
      lineHeight: 'normal',
      letterSpacing: 'normal',
      shadowStyle: 'md',
      pageWidth: 'standard',
      buttonStyle: 'rounded',
      accentColor: '#1e8c8c', // teal-600
      spacing: 'cozy',
      cornerRadius: 'md',
      animationStyle: 'fadeIn',
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
      mobileMenuStyle: 'overlay',
      mobileMenuAnimation: 'fadeIn',
    },
    pages: [
        {
            id: 'page-3-1',
            name: 'Home',
            path: '/',
            blocks: [
              {
                id: 'block-3-1',
                type: 'hero',
                headline: 'Alex Doe: Full-Stack Problem Solver',
                subheadline: 'Building robust applications from concept to deployment.',
                imageUrl: 'https://picsum.photos/seed/comprehensive-hero/1200/600',
                ctaText: 'Explore My Work',
                ctaLink: '#projects',
                designOverrides: {
                    backgroundImage: 'https://picsum.photos/seed/parallax-hero/1600/900',
                    backgroundOpacity: 0.5,
                }
              },
              {
                id: 'block-3-2',
                type: 'about',
                title: 'My Philosophy',
                content: 'I believe in the power of technology to solve real-world problems. My approach combines clean code, user-centric design, and scalable architecture to create impactful digital experiences. I am constantly learning and adapting to new technologies, always striving to push the boundaries of what is possible on the web. My goal is to not just build websites, but to create lasting digital assets that provide real value to users and businesses alike. I thrive in collaborative environments where I can work with talented teams to bring ambitious ideas to life.',
                mediaUrl: 'https://picsum.photos/seed/about-sticky/600/800',
                mediaType: 'image',
                mediaPosition: 'left',
                stickyMedia: true,
              },
              {
                id: 'block-3-11',
                type: 'experience',
                title: 'Work Experience',
                items: [
                  { id: 'exp-1', title: 'Senior Frontend Engineer', company: 'Tech Solutions Inc.', dateRange: 'Jan 2021 - Present', description: 'Led the development of a new client-facing dashboard using React and TypeScript, improving performance by 30%. Mentored junior developers and established new coding standards.' },
                  { id: 'exp-2', title: 'Frontend Developer', company: 'WebCrafters LLC', dateRange: 'Jun 2018 - Dec 2020', description: 'Developed and maintained responsive websites for various clients using HTML, CSS, and JavaScript. Collaborated with designers to translate mockups into functional web pages.' },
                ],
              },
              {
                id: 'block-3-3',
                type: 'projects',
                title: 'Selected Works',
                projectIds: ['proj-1', 'proj-2', 'proj-3', 'proj-4'],
              },
              {
                id: 'block-3-4',
                type: 'skills',
                title: 'Technical Skillset',
                skillIds: ['skill-1', 'skill-2', 'skill-3', 'skill-4', 'skill-5', 'skill-6', 'skill-7', 'skill-8', 'skill-9', 'skill-10'],
              },
               {
                id: 'block-3-12',
                type: 'code',
                title: 'Custom React Hook',
                language: 'TypeScript',
                code: `
        import { useState, useEffect } from 'react';

        function useWindowSize() {
          const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
          useEffect(() => {
            const handleResize = () => {
              setSize([window.innerWidth, window.innerHeight]);
            };
            window.addEventListener('resize', handleResize);
            return () => {
              window.removeEventListener('resize', handleResize);
            };
          }, []);
          return size;
        }
                `.trim(),
              },
              {
                id: 'block-3-5',
                type: 'gallery',
                title: 'Design & UI Explorations',
                layout: 'grid',
                images: [
                  { id: 'gal-1', url: 'https://picsum.photos/seed/gal1/800/600', caption: 'Dashboard UI Concept' },
                  { id: 'gal-2', url: 'https://picsum.photos/seed/gal2/800/600', caption: 'Mobile App Wireframes' },
                  { id: 'gal-3', url: 'https://picsum.photos/seed/gal3/800/600', caption: 'Logo Design Process' },
                ],
              },
              {
                id: 'block-3-13',
                type: 'services',
                title: 'My Services',
                tiers: [
                    { id: 'tier-1', title: 'Website Development', price: '$1,500', frequency: 'one-time', description: 'A fully responsive and customized website to meet your business needs.', features: ['Up to 5 Pages', 'Custom Design', 'Mobile Responsive', 'Basic SEO'], buttonText: 'Get Started', isFeatured: false },
                    { id: 'tier-2', title: 'Web Application', price: '$4,000', frequency: 'one-time', description: 'A powerful web application with a custom backend and database.', features: ['Unlimited Pages', 'API Integration', 'Database Setup', 'Admin Dashboard'], buttonText: 'Get Started', isFeatured: true },
                    { id: 'tier-3', title: 'Ongoing Support', price: '$500', frequency: '/month', description: 'Continuous support, updates, and maintenance for your web project.', features: ['Monthly Updates', 'Security Monitoring', 'Performance Tuning', 'Priority Support'], buttonText: 'Get Started', isFeatured: false },
                ]
              },
              {
                id: 'block-3-6',
                type: 'testimonials',
                title: 'What My Colleagues Say',
                testimonials: [
                  { id: 'test-1', quote: 'Alex is an exceptional developer with a keen eye for detail. A true asset to any team.', author: 'Jane Smith', authorTitle: 'Project Manager', authorAvatarUrl: 'https://picsum.photos/seed/avatar1/100/100' },
                  { id: 'test-2', quote: 'I was consistently impressed with Alex\'s ability to tackle complex challenges and deliver high-quality results.', author: 'John Davis', authorTitle: 'Lead Engineer', authorAvatarUrl: 'https://picsum.photos/seed/avatar2/100/100' },
                ],
              },
              {
                id: 'block-3-7',
                type: 'video',
                title: 'Project Walkthrough',
                videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                caption: 'A brief demo of the Data Visualization Dashboard in action.',
              },
               {
                id: 'block-3-14',
                type: 'blog',
                title: 'From My Blog',
                posts: [
                  { 
                    id: 'post-1', 
                    title: 'The Rise of Server-Side Rendering with React', 
                    excerpt: 'Exploring the benefits and challenges of SSR frameworks like Next.js and how they are changing the landscape of web development.',
                    imageUrl: 'https://picsum.photos/seed/blog1/600/400',
                    link: '#'
                  },
                  { 
                    id: 'post-2', 
                    title: 'A Deep Dive into CSS Grid and Flexbox', 
                    excerpt: 'A practical guide to mastering modern CSS layouts, with real-world examples and best practices for creating responsive designs.',
                    imageUrl: 'https://picsum.photos/seed/blog2/600/400',
                    link: '#'
                  },
                ]
              },
              {
                id: 'block-3-9',
                type: 'resume',
                title: 'My Experience',
                description: 'For a detailed overview of my professional background and accomplishments, please download my resume.',
                fileUrl: '#',
                buttonText: 'Download CV',
              },
              {
                id: 'block-3-10',
                type: 'links',
                title: 'Find Me Online',
                links: [
                  { id: 'link-gh', platform: 'github', url: '#', text: 'GitHub' },
                  { id: 'link-li', platform: 'linkedin', url: '#', text: 'LinkedIn' },
                  { id: 'link-tw', platform: 'twitter', url: '#', text: 'Twitter' },
                ],
              },
              {
                id: 'block-3-8',
                type: 'contact',
                title: 'Get In Touch',
                subtitle: 'I\'m currently open to new opportunities. Feel free to send me a message!',
                buttonText: 'Send Message',
              },
            ],
        }
    ],
    assets: [],
    designPresets: [
        {
            id: 'preset-1',
            name: 'Vibrant Tech',
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
                accentColor: '#2dd4bf', // teal-400
                spacing: 'cozy',
                cornerRadius: 'lg',
                animationStyle: 'fadeIn',
                navigationStyle: 'stickyHeader',
            }
        }
    ],
    createdAt: now - oneDay,
    updatedAt: now,
  },
];
