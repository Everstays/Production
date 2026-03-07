/**
 * API and app URLs.
 * Production: api.everstays.in | Development: dev.everstays.in
 * Override via .env (see .env.example).
 */
const productionApi = 'https://api.everstays.in';
const developmentApi = 'https://dev.everstays.in';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? productionApi : developmentApi);

export const USER_APP_URL =
  import.meta.env.VITE_USER_APP_URL ||
  (import.meta.env.PROD ? 'https://everstays.in' : 'https://dev.everstays.in');
