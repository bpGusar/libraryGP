import axios from 'axios';

export const axs = axios.create({
  baseURL: 'http://localhost:5000/api'
});
