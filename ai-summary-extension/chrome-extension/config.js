// config.js

// Set to false during local development, true for production build
const IS_PRODUCTION = true;

// Local API URL (dev only)
const API_BASE_URL = 'http://localhost:3001';

// Replace with your actual EC2 IP or domain (e.g., https://ec2-3-108-24-xx.ap-south-1.compute.amazonaws.com)
const PROD_API_BASE_URL = 'https://13.49.66.157';

export const BASE_URL = IS_PRODUCTION ? PROD_API_BASE_URL : API_BASE_URL;
