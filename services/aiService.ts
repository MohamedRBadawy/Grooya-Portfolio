import { GoogleGenAI, Type } from "@google/genai";
import type { ColorTheme, FontPairing, Portfolio, User, Resume, ExperienceItem, Skill, ResumeProjectItem, Project, AITailoringSuggestions, AIPortfolioReview, ProjectsBlock, SkillsBlock, EducationItem } from '../types';

// A custom error class for API key issues that can be caught in the UI.
export class ApiKeyMissingError extends Error {
    constructor(message = "We're sorry, but the AI service is temporarily unavailable as the API key is not configured.") {
        super(message);
        this.name = "ApiKeyMissingError";
    }
}

// Helper function to get the AI client or throw our custom error.
const getAiClient = () => {
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
        console.error("API_KEY environment variable not set. AI features will not work.");
        throw new ApiKeyMissingError();
    }
    // Initialize the Google GenAI client.
    return new GoogleGenAI({ apiKey: API_KEY });
};


/**
 * Generates an image using the Imagen model based on a text prompt.
 * @param prompt The text prompt describing the desired image.
 * @returns A base64 encoded data URL of the generated JPEG image.
 * @throws An error if the API fails to generate an image.
 */
export const generateImage = async (prompt: string): Promise<string> => {
    try {
        const ai = getAiClient();
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            // Return the image as a data URL, which can be used directly in `src` attributes.
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("API did not return any images.");
        }
    } catch (error) {
        if (error instanceof ApiKeyMissingError) {
            throw error; // Re-throw to be caught by UI
        }
        console.error("Error generating image:", error);
        throw new Error("Failed to generate image. Please check your prompt or API key.");
    }
};

/**
 * Generates a professional project description using AI.
 * @param title The title of the project.
 * @param technologies A string of technologies used (e.g., "React, Node.js").
 * @returns A 2-3 sentence project description.
 */
export const generateProjectDescription = async (title: string, technologies: string): Promise<string> => {
  try {
    const ai = getAiClient();
    // Prompt engineering: Provide clear instructions and an example (few-shot prompting).
    const prompt = `Generate a professional and engaging project description for a software portfolio. The project is called "${title}" and uses the following technologies: ${technologies}. The description should be concise (around 2-3 sentences), highlight the project's purpose and key features, and be suitable for attracting potential employers. Use the STAR (Situation, Task, Action, Result) method as a loose guideline. For example: "Developed a full-stack e-commerce platform (Situation/Task) using React and Node.js to create a responsive and user-friendly shopping experience (Action), resulting in a 20% increase in user engagement (Result)."`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
    if (error instanceof ApiKeyMissingError) {
        throw error;
    }
    console.error("Error generating project description:", error);
    throw new Error("Failed to generate description. Please try again.");
  }
};

/**
 * Generates a headline and subheadline for a portfolio's hero section.
 * @param name The user's name.
 * @param title The user's professional title.
 * @returns An object containing the generated headline and subheadline.
 */
export const generateHeroContent = async (name: string, title: string): Promise<{ headline: string, subheadline: string }> => {
    try {
        const ai = getAiClient();
        const prompt = `Generate a compelling hero section for a personal portfolio. The user's name is "${name}" and their title is "${title}". Generate a short, punchy headline and a slightly longer subheadline (one sentence) that expands on their value proposition. For example, headline: "Hi, I'm Alex Doe", subheadline: "A passionate Frontend Engineer crafting beautiful web experiences."`;

        // Request a JSON response and provide a schema for the expected output.
        // This makes the response more reliable and easier to parse.
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        headline: { type: Type.STRING },
                        subheadline: { type: Type.STRING },
                    },
                    required: ["headline", "subheadline"],
                },
            },
        });

        const json = JSON.parse(response.text);
        return json;

    } catch (error) {
        if (error instanceof ApiKeyMissingError) {
            throw error;
        }
        console.error("Error generating hero content:", error);
        throw new Error("Failed to generate hero content.");
    }
};

/**
 * Generates or rewrites an "About Me" section for a portfolio.
 * @param name The user's name.
 * @param title The user's professional title.
 * @param existingContent Optional existing content to be rewritten and improved.
 * @returns The generated "About Me" text.
 */
export const generateAboutContent = async (name: string, title: string, existingContent?: string): Promise<string> => {
    try {
        const ai = getAiClient();
        const prompt = `You are an expert career coach and copywriter. A user named "${name}", who is a "${title}", wants to write an "About Me" section for their portfolio.
        
        ${existingContent ? `They have provided the following draft: "${existingContent}". Your task is to rewrite and improve this draft.` : 'Your task is to write a compelling "About Me" section from scratch for them.'}
        
        The tone should be professional yet approachable. It should be about 3-4 sentences long. It should highlight their passion, skills, and value proposition. Do not use markdown. Output only the text for the "About Me" section.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        return response.text.trim();
    } catch (error) {
        if (error instanceof ApiKeyMissingError) {
            throw error;
        }
        console.error("Error generating about content:", error);
        throw new Error("Failed to generate about content.");
    }
};

/**
 * Suggests a design theme (colors, fonts) based on the user's professional title.
 * @param userTitle The user's professional title (e.g., "Software Engineer").
 * @returns An object containing suggested design properties.
 */
export const generateDesignSuggestions = async (userTitle: string): Promise<{ theme: ColorTheme, headingFont: string, bodyFont: string, accentColor: string }> => {
  try {
    const ai = getAiClient();
    const prompt = `As a world-class UI/UX designer, suggest a design theme for a personal portfolio for a "${userTitle}". 
    
    Provide a color theme, a font pairing style, and a vibrant accent color (as a hex code).

    - For the theme, you MUST choose one of: 'light', 'dark', 'mint', 'rose'.
    - For the font pairing style, you MUST choose one of: 'sans', 'serif', 'mixed'. 'sans' means sans-serif fonts for both heading and body. 'serif' means serif fonts for both. 'mixed' means a sans-serif heading and a serif body.
    - For the accent color, choose a hex code that complements the theme. For example, for a 'dark' theme, you might suggest a bright color like '#3B82F6' (a vibrant blue).

    Your suggestions should be professional and appropriate for the user's role.`;

    // Again, using JSON mode for a structured, reliable response.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            theme: {
              type: Type.STRING,
              description: "The color theme, one of: 'light', 'dark', 'mint', 'rose'."
            },
            fontPairing: {
              type: Type.STRING,
              description: "The font pairing style, one of: 'sans', 'serif', 'mixed'."
            },
            accentColor: {
              type: Type.STRING,
              description: 'A hex color code, e.g., #3B82F6'
            },
          },
          required: ["theme", "fontPairing", "accentColor"],
        },
      },
    });

    const json: { theme: ColorTheme, fontPairing: FontPairing, accentColor: string } = JSON.parse(response.text);
    
    // --- Response Validation and Sanitization ---
    // Even with a schema, it's good practice to validate the AI's output.
    const validThemes: ColorTheme[] = ['light', 'dark', 'mint', 'rose'];
    const validFonts: FontPairing[] = ['sans', 'serif', 'mixed'];

    if (!validThemes.includes(json.theme)) {
        console.warn(`AI returned invalid theme: ${json.theme}. Defaulting to 'light'.`);
        json.theme = 'light';
    }
    if (!validFonts.includes(json.fontPairing)) {
        console.warn(`AI returned invalid font: ${json.fontPairing}. Defaulting to 'sans'.`);
        json.fontPairing = 'sans';
    }
    if (!/^#[0-9A-F]{6}$/i.test(json.accentColor)) {
         console.warn(`AI returned invalid color: ${json.accentColor}. Defaulting to '#3B82F6'.`);
        json.accentColor = '#3B82F6';
    }

    // Convert the AI's font pairing suggestion into specific font names.
    let headingFont = 'Sora';
    let bodyFont = 'Inter';

    switch (json.fontPairing) {
        case 'sans':
            headingFont = 'Sora';
            bodyFont = 'Inter';
            break;
        case 'serif':
            headingFont = 'Playfair Display';
            bodyFont = 'Lora';
            break;
        case 'mixed':
            headingFont = 'Poppins';
            bodyFont = 'Merriweather';
            break;
    }

    return {
        theme: json.theme,
        accentColor: json.accentColor,
        headingFont,
        bodyFont
    };

  } catch (error) {
    if (error instanceof ApiKeyMissingError) {
        throw error;
    }
    console.error("Error generating design suggestions:", error);
    // Return a sensible default on error to prevent crashes.
    throw new Error("Failed to generate design suggestions.");
  }
};

/**
 * Generates a complete resume structure from a user's portfolio data.
 * @param portfolio The user's portfolio object.
 * @param user The user object.
 * @param allProjects A list of all available projects.
 * @param allSkills A list of all available skills.
 * @returns A promise resolving to the core data for a new Resume object.
 */
export const generateResumeFromPortfolio = async (
    portfolio: Portfolio, 
    user: User, 
    allProjects: Project[], 
    allSkills: Skill[]
): Promise<Omit<Resume, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'title' | 'template' | 'accentColor'>> => {
    try {
        const ai = getAiClient();
        // 1. Pre-process the data to create a simplified, relevant context for the AI.
        const allBlocks = portfolio.pages.flatMap(p => p.blocks);
        
        const referencedProjects = allProjects.filter(p => 
            allBlocks.some(b => b.type === 'projects' && (b as ProjectsBlock).projectIds.includes(p.id))
        );
        const referencedSkills = allSkills.filter(s =>
            allBlocks.some(b => b.type === 'skills' && (b as SkillsBlock).skillIds.includes(s.id))
        );
        
        // This simplified object is much smaller and more focused than the full portfolio object.
        const simplifiedPortfolio = {
            user: { name: user.name, title: user.title, bio: user.bio, email: user.email },
            portfolio: {
                title: portfolio.title,
                hero: allBlocks.find(b => b.type === 'hero'),
                about: allBlocks.find(b => b.type === 'about'),
                experience: allBlocks.find(b => b.type === 'experience'),
                projects: referencedProjects,
                skills: referencedSkills,
            }
        };

        // 2. Construct the prompt with clear instructions for the AI.
        const prompt = `You are an expert career coach and resume writer. Your task is to analyze a developer's portfolio data and generate a professional resume in a structured JSON format.

Here is the simplified portfolio and user data:
${JSON.stringify(simplifiedPortfolio, null, 2)}

Based on this data, generate a resume. Follow these instructions carefully:
1.  **Contact Info:** Use the user's full name, job title, and email.
2.  **Summary:** Create a compelling 2-4 sentence professional summary. Synthesize information from the user's title, bio, and the portfolio's hero and about sections.
3.  **Experience:** Extract all items from the "experience" block. Keep the titles, companies, date ranges, and descriptions as they are.
4.  **Skills:** Extract all skills.
5.  **Projects:** For each project, create a summary. Include the project title, a concise one-sentence description, and the list of technologies used.
6.  **Education:** The portfolio data does not contain education data. Return an empty array for this field.

Return the result as a single JSON object. Do not include any text outside of the JSON object.`;

        // 3. Call the API with the prompt and a detailed JSON schema for the response.
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        fullName: { type: Type.STRING },
                        jobTitle: { type: Type.STRING },
                        email: { type: Type.STRING },
                        phone: { type: Type.STRING, description: 'Optional phone number' },
                        website: { type: Type.STRING, description: 'Optional personal website URL' },
                        linkedin: { type: Type.STRING, description: 'Optional LinkedIn profile URL' },
                        github: { type: Type.STRING, description: 'Optional GitHub profile URL' },
                        summary: { type: Type.STRING },
                        experience: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    title: { type: Type.STRING },
                                    company: { type: Type.STRING },
                                    dateRange: { type: Type.STRING },
                                    description: { type: Type.STRING }
                                }
                            }
                        },
                        education: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    institution: { type: Type.STRING },
                                    degree: { type: Type.STRING },
                                    dateRange: { type: Type.STRING },
                                    description: { type: Type.STRING, description: 'Optional' }
                                }
                            }
                        },
                        skills: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    name: { type: Type.STRING },
                                    category: { type: Type.STRING }
                                }
                            }
                        },
                        projects: {
                             type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    title: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    technologies: { type: Type.ARRAY, items: { type: Type.STRING } }
                                }
                            }
                        }
                    }
                }
            }
        });

        return JSON.parse(response.text);

    } catch (error) {
        if (error instanceof ApiKeyMissingError) {
            throw error;
        }
        console.error("Error generating resume from portfolio:", error);
        throw new Error("Failed to generate resume from portfolio. Please try again.");
    }
};

/**
 * Compares a resume to a job description and provides tailored suggestions.
 * @param resume The user's current resume object.
 * @param jobDescription The raw text of the target job description.
 * @returns An object containing a rewritten summary, suggested keywords, and feedback points.
 */
export const generateResumeTailoringSuggestions = async (resume: Resume, jobDescription: string): Promise<AITailoringSuggestions> => {
    try {
        const ai = getAiClient();
        const simplifiedResume = {
            jobTitle: resume.jobTitle,
            summary: resume.summary,
            experience: resume.experience.map(e => ({ title: e.title, description: e.description })),
            skills: resume.skills.map(s => s.name),
        };

        const prompt = `You are an expert career coach and resume writer. Your task is to analyze a user's resume and a job description, then provide tailored suggestions for improvement.

        Here is the user's current resume data:
        ${JSON.stringify(simplifiedResume, null, 2)}

        Here is the target job description:
        "${jobDescription}"

        Based on this information, perform the following tasks:
        1.  **Rewrite the Summary:** Write a new professional summary (2-4 sentences) that is highly tailored to the job description, incorporating key language and requirements from it.
        2.  **Extract Keywords:** Identify and list 5-7 of the most important technical skills or keywords from the job description that the user should ensure are on their resume.
        3.  **Provide Feedback:** Give 3-4 actionable, high-level feedback points on how the user could improve their experience section to better match the job description.

        Return the result as a single JSON object. Do not include any text outside of the JSON object.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        newSummary: {
                            type: Type.STRING,
                            description: "A rewritten professional summary, tailored to the job description."
                        },
                        suggestedKeywords: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "A list of important keywords from the job description to include in the resume."
                        },
                        feedbackPoints: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "A list of 3-4 actionable feedback points on how to improve the experience section."
                        }
                    },
                    required: ["newSummary", "suggestedKeywords", "feedbackPoints"]
                }
            }
        });

        return JSON.parse(response.text);

    } catch (error) {
        if (error instanceof ApiKeyMissingError) {
            throw error;
        }
        console.error("Error generating resume tailoring suggestions:", error);
        throw new Error("Failed to generate resume suggestions. Please try again.");
    }
};


/**
 * Generates a complete, tailored resume based on a user's base resume and a target job description.
 * @param baseResume The user's existing resume to use as a foundation.
 * @param jobDescription The raw text of the target job description.
 * @returns A promise resolving to the core data for a new, tailored Resume object.
 */
export const generateResumeForJobDescription = async (
    baseResume: Resume, 
    jobDescription: string
): Promise<Omit<Resume, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'title' | 'template' | 'accentColor'>> => {
    try {
        const ai = getAiClient();
        
        // Simplify the resume data to send to the AI.
        const simplifiedResume = {
            fullName: baseResume.fullName,
            jobTitle: baseResume.jobTitle,
            email: baseResume.email,
            phone: baseResume.phone,
            website: baseResume.website,
            linkedin: baseResume.linkedin,
            github: baseResume.github,
            summary: baseResume.summary,
            experience: baseResume.experience,
            education: baseResume.education,
            skills: baseResume.skills,
            projects: baseResume.projects,
        };

        const prompt = `You are an expert career coach and ATS optimization specialist. Your task is to analyze a user's base resume and a target job description, then generate a new, tailored resume in a structured JSON format that is optimized for Applicant Tracking Systems (ATS).

Here is the user's base resume data:
${JSON.stringify(simplifiedResume, null, 2)}

Here is the target job description:
"${jobDescription}"

Based on this information, generate a complete, tailored resume. Follow these instructions carefully:
1.  **Rewrite the Summary:** Create a new professional summary (2-4 sentences) that is highly tailored to the job description, incorporating key language, skills, and qualifications from it.
2.  **Optimize Experience:** For each experience item, rewrite the description's bullet points to highlight accomplishments and skills most relevant to the job description. Use action verbs and quantifiable results where possible. Keep the job titles, companies, and dates the same.
3.  **Prioritize Skills:** Analyze the job description for key skills. Reorder the user's skills list to place the most relevant ones first. Do not add skills the user does not have.
4.  **Maintain Structure:** Keep all other sections (contact info, education, projects) as they are in the base resume.
5.  **ATS Friendliness:** Ensure the language is clear, professional, and uses industry-standard keywords found in the job description.

Return the result as a single, complete JSON object matching the provided schema. Do not include any text outside of the JSON object. All original fields must be present.`;

        // The response schema is identical to generateResumeFromPortfolio, which is good.
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        fullName: { type: Type.STRING },
                        jobTitle: { type: Type.STRING },
                        email: { type: Type.STRING },
                        phone: { type: Type.STRING, description: 'Optional phone number' },
                        website: { type: Type.STRING, description: 'Optional personal website URL' },
                        linkedin: { type: Type.STRING, description: 'Optional LinkedIn profile URL' },
                        github: { type: Type.STRING, description: 'Optional GitHub profile URL' },
                        summary: { type: Type.STRING },
                        experience: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    title: { type: Type.STRING },
                                    company: { type: Type.STRING },
                                    dateRange: { type: Type.STRING },
                                    description: { type: Type.STRING }
                                }
                            }
                        },
                        education: {
                             type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    institution: { type: Type.STRING },
                                    degree: { type: Type.STRING },
                                    dateRange: { type: Type.STRING },
                                    description: { type: Type.STRING, description: 'Optional' }
                                }
                            }
                        },
                        skills: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    name: { type: Type.STRING },
                                    category: { type: Type.STRING }
                                }
                            }
                        },
                        projects: {
                             type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    title: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    technologies: { type: Type.ARRAY, items: { type: Type.STRING } }
                                }
                            }
                        }
                    },
                    required: ["fullName", "jobTitle", "email", "summary", "experience", "education", "skills", "projects"]
                }
            }
        });

        return JSON.parse(response.text);

    } catch (error) {
        if (error instanceof ApiKeyMissingError) {
            throw error;
        }
        console.error("Error generating resume for job description:", error);
        throw new Error("Failed to generate tailored resume. Please try again.");
    }
};


/**
 * Performs an AI-powered review of a user's portfolio.
 * @param portfolio The portfolio to be reviewed.
 * @param user The owner of the portfolio.
 * @returns An object containing structured feedback on the portfolio.
 */
export const generatePortfolioReview = async (portfolio: Portfolio, user: User): Promise<AIPortfolioReview> => {
    try {
        const ai = getAiClient();
        // Simplify the portfolio data to send only what's necessary to the AI.
        const allBlocks = portfolio.pages.flatMap(p => p.blocks);
        const simplifiedPortfolio = {
            userTitle: user.title,
            portfolioTitle: portfolio.title,
            blocks: allBlocks.map(b => {
                // Only include key information from each block to keep the prompt concise.
                switch(b.type) {
                    case 'hero': return { type: 'hero', headline: b.headline, subheadline: b.subheadline };
                    case 'about': return { type: 'about', content: b.content };
                    case 'projects': return { type: 'projects', projectCount: b.projectIds.length };
                    case 'skills': return { type: 'skills', skillCount: b.skillIds.length };
                    default: return { type: b.type };
                }
            })
        };

        const prompt = `You are a world-class career coach and portfolio expert, specializing in the tech industry. Your task is to analyze a user's portfolio data and provide actionable feedback to help them impress recruiters.

        Here is the user's portfolio data:
        ${JSON.stringify(simplifiedPortfolio, null, 2)}

        Based on this data, provide a structured review. Follow these instructions carefully:
        1.  **Overall Impression:** Write a brief, encouraging summary (2-3 sentences) of the portfolio's strengths and key areas for improvement.
        2.  **Content Suggestions:** Provide specific, actionable advice for the 'Hero' and 'About' sections. Focus on making the language more impactful and value-driven.
        3.  **Project Showcase Feedback:** Comment on the presentation of projects. If there are no projects, strongly recommend adding some.
        4.  **Missing Sections:** Identify up to 3 crucial sections that are missing from the portfolio that would significantly improve it. Common valuable sections include 'testimonials', 'experience', 'skills', and 'contact'. Choose from this list: 'hero', 'about', 'projects', 'skills', 'gallery', 'testimonials', 'cta', 'resume', 'links', 'experience', 'contact', 'code', 'services', 'blog', 'video'.

        Return the result as a single JSON object. Do not include any text outside of the JSON object.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        overallImpression: { type: Type.STRING },
                        contentSuggestions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    area: { type: Type.STRING },
                                    suggestion: { type: Type.STRING }
                                }
                            }
                        },
                        projectShowcaseFeedback: { type: Type.STRING },
                        missingSections: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ["overallImpression", "contentSuggestions", "projectShowcaseFeedback", "missingSections"]
                }
            }
        });

        return JSON.parse(response.text);

    } catch (error) {
        if (error instanceof ApiKeyMissingError) {
            throw error;
        }
        console.error("Error generating portfolio review:", error);
        throw new Error("Failed to generate portfolio review. Please try again.");
    }
};