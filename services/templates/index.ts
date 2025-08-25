import type { PortfolioTemplate } from '../../types';
import { developerTemplate } from './developer';
import { designerTemplate } from './designer';
import { photographerTemplate } from './photographer';
import { writerTemplate } from './writer';
import { freelancerTemplate } from './freelancer';
import { minimalistTemplate } from './minimalist';
import { innovatorTemplate } from './innovator';
import { consultantTemplate } from './consultant';
import { boldMinimalistTemplate } from './bold-minimalist';

export const portfolioTemplates: PortfolioTemplate[] = [
    developerTemplate,
    designerTemplate,
    innovatorTemplate,
    consultantTemplate,
    photographerTemplate,
    writerTemplate,
    freelancerTemplate,
    boldMinimalistTemplate,
    minimalistTemplate,
];
