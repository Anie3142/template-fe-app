/**
 * Typed fetch wrapper for the backend API.
 *
 * The token is fetched from the Auth0 session via the server-side route at
 * `/api/auth/me` (provided by `@auth0/nextjs-auth0`). For client-side calls
 * you can use `useUser()` to read the session and attach the access token
 * however your backend expects it.
 *
 * For now this is a minimal fetch wrapper. Regenerate `api-types.ts` from the
 * backend OpenAPI spec via `npm run gen:api` and tighten the return types.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api/v1';

export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  token?: string | null;
}

export async function apiFetch<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { body, token, headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API ${response.status}: ${await response.text()}`);
  }

  return response.json() as Promise<T>;
}
