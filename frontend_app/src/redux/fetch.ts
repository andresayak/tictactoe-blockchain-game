import axios from 'axios';

export const api = axios.create({
  timeout: 60000,
  baseURL: process.env.APP_API_ORIGIN,
});
