import axios from 'axios';

export const axs = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'x-access-token': localStorage.getItem('token') },
});
