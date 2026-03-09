/**
 * Backend API base URL.
 * Production: localhost:3000 | Development: dev.everstays.in
 * Override via .env for local backend (see .env.example).
 */
const productionApi = 'https://localhost:3000';
const developmentApi = 'https://dev.everstays.in';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? productionApi : developmentApi);
