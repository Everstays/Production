/**
 * API and app URLs.
 * Production: localhost:3000 | Development: dev.everstays.in
 * Override via .env (see .env.example).
 */
const productionApi = 'https://localhost:3000';
const developmentApi = 'https://dev.everstays.in';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? productionApi : developmentApi);

export const USER_APP_URL =
  import.meta.env.VITE_USER_APP_URL ||
  (import.meta.env.PROD ? 'https://live.everstays.in' : 'https://dev.everstays.in');
