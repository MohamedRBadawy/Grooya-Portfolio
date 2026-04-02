/**
 * Backend-auth service wrappers used by the auth and data contexts.
 */

import type { FeatureFlags, Project, Skill, User } from '../../types';
import { apiGet, apiPost, apiPut } from './api';

export interface AuthSessionResponse {
  authenticated: boolean;
  user: User | null;
  feature_flags?: Record<string, boolean>;
  ai?: unknown;
  catalog?: {
    projects?: Project[];
    skills?: Skill[];
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
  title?: string;
}

export interface ProfilePayload {
  name?: string;
  email?: string;
  title?: string;
  bio?: string;
  avatar_url?: string;
  project_catalog?: Project[];
  skill_catalog?: Skill[];
}

export interface ProfileResponse {
  user: User;
  catalog: {
    projects: Project[];
    skills: Skill[];
  };
  feature_flags?: Record<string, boolean>;
  ai?: unknown;
}

export const fetchSession = () => apiGet<AuthSessionResponse>('/auth/session/');

export const loginWithPassword = (payload: LoginPayload) =>
  apiPost<AuthSessionResponse>('/auth/login/', payload);

export const registerAccount = (payload: RegisterPayload) =>
  apiPost<AuthSessionResponse>('/auth/register/', payload);

export const logoutSession = () => apiPost<AuthSessionResponse>('/auth/logout/', {});

export const fetchProfile = () => apiGet<AuthSessionResponse>('/auth/profile/');

export const updateProfile = (payload: ProfilePayload) =>
  apiPut<ProfileResponse>('/auth/profile/', payload);
