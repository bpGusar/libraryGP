import axios from 'axios';
import Cookies from 'js-cookie';

export const axs = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'x-access-token': Cookies.get('token') },
});
