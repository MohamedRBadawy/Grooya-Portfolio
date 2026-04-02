import type {
  AboutBlock,
  ExperienceBlock,
  HeroBlock,
  Portfolio,
  Project,
  ProjectsBlock,
  Resume,
  Skill,
  SkillsBlock,
  User,
} from '../types';

const findFirstBlock = <TBlock>(portfolio: Portfolio, type: string): TBlock | undefined => {
  for (const page of portfolio.pages) {
    const match = page.blocks.find((block) => block.type === type);
    if (match) {
      return match as TBlock;
    }
  }

  return undefined;
};

/**
 * Builds a structured resume draft from portfolio content without using AI.
 * The goal is to give the user a solid first draft they can immediately edit
 * and export, even before backend resume sync is connected.
 */
export const buildResumeDraftFromPortfolio = ({
  portfolio,
  user,
  projects,
  skills,
}: {
  portfolio: Portfolio;
  user: User;
  projects: Project[];
  skills: Skill[];
}): Omit<Resume, 'id' | 'createdAt' | 'updatedAt'> => {
  const heroBlock = findFirstBlock<HeroBlock>(portfolio, 'hero');
  const aboutBlock = findFirstBlock<AboutBlock>(portfolio, 'about');
  const experienceBlock = findFirstBlock<ExperienceBlock>(portfolio, 'experience');
  const projectsBlock = findFirstBlock<ProjectsBlock>(portfolio, 'projects');
  const skillsBlock = findFirstBlock<SkillsBlock>(portfolio, 'skills');

  const selectedProjects =
    projectsBlock?.projectIds
      .map((projectId) => projects.find((project) => project.id === projectId))
      .filter((project): project is Project => Boolean(project))
      .slice(0, 4)
      .map((project) => ({
        id: `resume-project-${project.id}`,
        title: project.title,
        description: project.description,
        technologies: project.technologies,
      })) ?? [];

  const selectedSkills =
    skillsBlock?.skillIds
      .map((skillId) => skills.find((skill) => skill.id === skillId))
      .filter((skill): skill is Skill => Boolean(skill))
      .slice(0, 12) ?? [];

  return {
    title: `${portfolio.title} Resume`,
    userId: user.id,
    fullName: user.name,
    jobTitle: portfolio.role || user.title,
    email: user.email,
    phone: '',
    website: '',
    linkedin: '',
    github: '',
    summary:
      aboutBlock?.content ||
      heroBlock?.subheadline ||
      user.bio ||
      'Add a short professional summary that explains your strengths, focus, and the kind of work you want to do.',
    experience:
      experienceBlock?.items.map((item) => ({
        ...item,
      })) ?? [],
    education: [],
    skills: selectedSkills.length > 0 ? selectedSkills : skills.slice(0, 8),
    projects:
      selectedProjects.length > 0
        ? selectedProjects
        : [
            {
              id: `resume-project-${Date.now()}`,
              title: 'Featured project',
              description: 'Add one project that best demonstrates your strongest work and measurable results.',
              technologies: [],
            },
          ],
    template: 'classic',
    accentColor: portfolio.design.accentColor || '#1e8c8c',
  };
};
