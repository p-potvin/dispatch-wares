import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3001/api' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('vault_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor to log Correlation IDs for TDD debugging
api.interceptors.response.use(response => {
  console.log(`[Trace ID]: ${response.headers['x-correlation-id']}`);
  return response;
});

export default api;