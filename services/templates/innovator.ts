import type { PortfolioTemplate } from '../../types';

export const innovatorTemplate: PortfolioTemplate = {
    id: 'innovator-template',
    name: 'template.innovator.name',
    description: 'template.innovator.desc',
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
        pageWidth: 'full',
        buttonStyle: 'square',
        accentColor: '#2563eb', // blue-600
        spacing: 'cozy',
        cornerRadius: 'none',
        animationStyle: 'blurIn',
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
            id: 'innovator-home',
            name: 'Home',
            path: '/',
            blocks: [
                {
                    id: 'innovator-hero',
                    type: 'hero',
                    headline: 'Alex Doe | AI Researcher & Innovator',
                    subheadline: 'Building the next generation of intelligent systems.',
                    imageUrl: '',
                    ctaText: 'Explore My Research',
                    ctaLink: '#innovator-projects',
                    designOverrides: {
                        backgroundImage: 'https://picsum.photos/seed/innovator-hero/1600/900',
                        backgroundOpacity: 0.7,
                        shapeDividers: {
                            bottom: { type: 'slant', color: '#020617', flipX: false, height: 120 }
                        }
                    }
                },
                {
                    id: 'innovator-about',
                    type: 'about',
                    title: 'My Mission',
                    content: 'I am dedicated to pushing the boundaries of artificial intelligence, with a focus on creating ethical and impactful technologies that solve real-world problems. My work lies at the intersection of machine learning, data science, and human-computer interaction.',
                    designOverrides: {
                       background: '#020617',
                       shapeDividers: {
                            bottom: { type: 'slant', color: '#0f172a', flipX: true, height: 80 }
                        }
                    }
                },
                {
                    id: 'innovator-projects',
                    type: 'projects',
                    title: 'Key Projects & Publications',
                    projectIds: ['proj-2', 'proj-4'],
                    designOverrides: {
                        background: '#0f172a'
                    }
                },
                {
                    id: 'innovator-code',
                    type: 'code',
                    title: 'Neural Network Snippet',
                    language: 'python',
                    code: `
import torch
import torch.nn as nn

class SimpleNN(nn.Module):
    def __init__(self):
        super(SimpleNN, self).__init__()
        self.layer1 = nn.Linear(784, 128)
        self.relu = nn.ReLU()
        self.layer2 = nn.Linear(128, 10)

    def forward(self, x):
        x = self.layer1(x)
        x = self.relu(x)
        x = self.layer2(x)
        return x
                    `.trim(),
                },
                {
                    id: 'innovator-contact',
                    type: 'contact',
                    title: 'Connect & Collaborate',
                    subtitle: 'I am always open to discussing new research, ideas, or partnership opportunities.',
                    buttonText: 'Send Email',
                }
            ]
        }
    ],
};
