import axios from 'axios';

export const axs = axios.create({
  baseURL: 'http://localhost:5000/api',
});

axs.interceptors.request.use(
  (config) => {
    if (localStorage.getItem('token') !== null) {
      config.headers['x-access-token'] = localStorage.getItem('token');
    }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  },
);
