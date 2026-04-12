import { handleAuth } from '@auth0/nextjs-auth0';

// Server-side Auth0 handler. This registers GET handlers for:
//   /api/auth/login, /api/auth/logout, /api/auth/callback, /api/auth/me
// Configure via AUTH0_* env vars in .env.local. See README.md.
export const GET = handleAuth();
