import React from 'react';
import type { Resume } from '../types';
import { Mail, Phone, Globe, Linkedin, Github } from 'lucide-react';

interface ResumePreviewProps {
  resume: Resume;
}

const ResumeSection: React.FC<{ title: string; children: React.ReactNode, accentColor: string }> = ({ title, children, accentColor }) => (
    <section className="mb-6">
        <h2 className="text-xl font-bold uppercase tracking-wider mb-2 pb-1 border-b-2" style={{ borderColor: accentColor, color: accentColor }}>
            {title}
        </h2>
        {children}
    </section>
);

const ResumePreview: React.FC<ResumePreviewProps> = ({ resume }) => {
    const { 
        fullName, jobTitle, email, phone, website, linkedin, github, summary, experience,
        education, skills, projects, accentColor 
    } = resume;

    return (
        <div className="bg-white text-cream-950 p-8 shadow-lg rounded-md font-sans">
            <header className="text-center mb-8 border-b pb-4">
                <h1 className="text-4xl font-bold tracking-tight">{fullName}</h1>
                <h2 className="text-xl font-light text-cream-700 mt-1">{jobTitle}</h2>
                <div className="flex justify-center items-center gap-4 text-sm text-cream-800 mt-4 flex-wrap">
                    {email && <a href={`mailto:${email}`} className="flex items-center gap-1.5 hover:text-cream-950"><Mail size={14}/> {email}</a>}
                    {phone && <span className="flex items-center gap-1.5"><Phone size={14}/> {phone}</span>}
                    {website && <a href={website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-cream-950"><Globe size={14}/> {website}</a>}
                    {linkedin && <a href={`https://` + linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-cream-950"><Linkedin size={14}/> {linkedin}</a>}
                    {github && <a href={`https://` + github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-cream-950"><Github size={14}/> {github}</a>}
                </div>
            </header>

            <main>
                <ResumeSection title="Summary" accentColor={accentColor}>
                    <p className="text-cream-900 leading-relaxed">{summary}</p>
                </ResumeSection>

                <ResumeSection title="Experience" accentColor={accentColor}>
                    <div className="space-y-4">
                        {experience.map(exp => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-semibold text-lg">{exp.title}</h3>
                                    <span className="text-sm font-light text-cream-700">{exp.dateRange}</span>
                                </div>
                                <h4 className="font-medium text-cream-800">{exp.company}</h4>
                                <p className="text-cream-900 mt-1 text-sm">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </ResumeSection>
                
                <ResumeSection title="Skills" accentColor={accentColor}>
                    <div className="flex flex-wrap gap-2">
                        {skills.map(skill => (
                            <span key={skill.id} className="bg-cream-200 text-cream-800 text-sm font-medium px-3 py-1 rounded-full">{skill.name}</span>
                        ))}
                    </div>
                </ResumeSection>
                
                <ResumeSection title="Projects" accentColor={accentColor}>
                    <div className="space-y-4">
                        {projects.map(proj => (
                            <div key={proj.id}>
                                <h3 className="font-semibold text-lg">{proj.title}</h3>
                                <p className="text-cream-900 mt-1 text-sm">{proj.description}</p>
                                <p className="text-xs text-cream-700 mt-1">
                                    <span className="font-semibold">Technologies:</span> {proj.technologies.join(', ')}
                                </p>
                            </div>
                        ))}
                    </div>
                </ResumeSection>

                <ResumeSection title="Education" accentColor={accentColor}>
                     <div className="space-y-4">
                        {education.map(edu => (
                             <div key={edu.id}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-semibold text-lg">{edu.institution}</h3>
                                    <span className="text-sm font-light text-cream-700">{edu.dateRange}</span>
                                </div>
                                <h4 className="font-medium text-cream-800">{edu.degree}</h4>
                                {edu.description && <p className="text-cream-900 mt-1 text-sm">{edu.description}</p>}
                            </div>
                        ))}
                    </div>
                </ResumeSection>
            </main>
        </div>
    );
};

export default ResumePreview;