const EXCLUDED_ROUTES = [
  '/api/auth/get-user',
  '/api/auth/create-user',
  '/api/auth/token',
  '/api/search',
  '/api/search/scp',
  '/api/search/specialties',
  '/api/insert',
  '/api/review',
  '/api/ads',
  '/api/stripe/webhook'
];

module.exports = {
  EXCLUDED_ROUTES,
};