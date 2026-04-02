/**
 * Typed resume repository that stores resume content in the backend JSON field.
 */

import type { Resume } from '../../types';
import { apiDelete, apiGet, apiPost, apiPut } from './api';

interface BackendResumeRecord {
  id: number | string;
  title: string;
  content: Omit<Resume, 'id' | 'title' | 'createdAt' | 'updatedAt'>;
  template: Resume['template'];
  accent_color: string;
  created_at: string;
  updated_at: string;
}

interface ResumeWritePayload {
  title: string;
  content: Omit<Resume, 'id' | 'title' | 'createdAt' | 'updatedAt'>;
  template: Resume['template'];
  accent_color: string;
}

const mapResumeRecord = (record: BackendResumeRecord): Resume => ({
  id: String(record.id),
  title: record.title,
  ...record.content,
  template: record.template,
  accentColor: record.accent_color,
  createdAt: new Date(record.created_at).getTime(),
  updatedAt: new Date(record.updated_at).getTime(),
});

const toResumePayload = (resume: Resume): ResumeWritePayload => ({
  title: resume.title,
  content: {
    userId: resume.userId,
    fullName: resume.fullName,
    jobTitle: resume.jobTitle,
    email: resume.email,
    phone: resume.phone,
    website: resume.website,
    linkedin: resume.linkedin,
    github: resume.github,
    summary: resume.summary,
    experience: resume.experience,
    education: resume.education,
    skills: resume.skills,
    projects: resume.projects,
    template: resume.template,
    accentColor: resume.accentColor,
  },
  template: resume.template,
  accent_color: resume.accentColor,
});

export const listResumes = async (): Promise<Resume[]> => {
  const records = await apiGet<BackendResumeRecord[]>('/resumes/');
  return records.map(mapResumeRecord);
};

export const createResumeRecord = async (resume: Resume): Promise<Resume> => {
  const record = await apiPost<BackendResumeRecord>('/resumes/', toResumePayload(resume));
  return mapResumeRecord(record);
};

export const updateResumeRecord = async (resume: Resume): Promise<Resume> => {
  const record = await apiPut<BackendResumeRecord>(`/resumes/${resume.id}/`, toResumePayload(resume));
  return mapResumeRecord(record);
};

export const deleteResumeRecord = (resumeId: string) => apiDelete(`/resumes/${resumeId}/`);
