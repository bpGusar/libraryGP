import axios from 'axios';

export const axs = axios.create({
  baseURL: process.env.BASE_AXIOS_URL,
});
