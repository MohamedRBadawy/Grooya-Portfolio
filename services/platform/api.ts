/**
 * Small frontend API helper for talking to the Django backend through `/api`.
 * Requests always include credentials so anonymous session-backed AI quotas work.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export interface ApiErrorShape {
  detail?: string;
  code?: string;
  ai?: unknown;
}

export class ApiRequestError extends Error {
  code?: string;
  payload?: ApiErrorShape;

  constructor(message: string, code?: string, payload?: ApiErrorShape) {
    super(message);
    this.name = 'ApiRequestError';
    this.code = code;
    this.payload = payload;
  }
}

const buildUrl = (path: string) => `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

const isBrowser = typeof window !== 'undefined';

const getCsrfToken = () => {
  if (!isBrowser) return '';

  const csrfCookie = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('csrftoken='));

  return csrfCookie ? decodeURIComponent(csrfCookie.split('=')[1] || '') : '';
};

const ensureCsrfCookie = async () => {
  if (!isBrowser || getCsrfToken()) {
    return;
  }

  await fetch(buildUrl('/auth/session/'), {
    credentials: 'include',
  });
};

async function parseError(response: Response): Promise<ApiRequestError> {
  try {
    const payload = (await response.json()) as ApiErrorShape;
    return new ApiRequestError(payload.detail || 'The request failed.', payload.code, payload);
  } catch {
    return new ApiRequestError(`The request failed with status ${response.status}.`);
  }
}

async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const method = (init.method || 'GET').toUpperCase();
  const headers = new Headers(init.headers);

  if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
    await ensureCsrfCookie();
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      headers.set('X-CSRFToken', csrfToken);
    }
    if (!headers.has('Content-Type') && init.body) {
      headers.set('Content-Type', 'application/json');
    }
  }

  const response = await fetch(buildUrl(path), {
    credentials: 'include',
    ...init,
    headers,
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  return apiRequest<T>(path, { ...init, method: 'GET' });
}

export async function apiPost<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
  return apiRequest<T>(path, {
    ...init,
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function apiPut<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
  return apiRequest<T>(path, {
    ...init,
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function apiPatch<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
  return apiRequest<T>(path, {
    ...init,
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function apiDelete(path: string, init?: RequestInit): Promise<void> {
  await apiRequest<void>(path, {
    ...init,
    method: 'DELETE',
  });
}
