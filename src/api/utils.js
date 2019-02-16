import axios from 'axios';

// export const API_DOMAIN = process.env.NODE_ENV === 'production' ? `//${window.location.host}` : 'http://10.30.52.68:8080';
export const API_DOMAIN = process.env.NODE_ENV === 'production' ? '' : '';

// Supos - auth token
const HEADER_AUTHORIZATION_TICKET =
  window.parent.localStorage.getItem('ticket') ||
  window.localStorage.getItem('ticket');
export const HEADER_AUTHORIZATION = {
  Authorization: `Bearer ${HEADER_AUTHORIZATION_TICKET || 'data-technology'}`,
};

const instance = axios.create({
  baseURL: "http://localhost:8088/api",
  headers: Object.assign({}, HEADER_AUTHORIZATION),
  timeout: 10000,
});

/**
 * 生成用于取消请求的cancel与token
 * @see https://github.com/axios/axios#cancellation
 */
export const makeCancelTokenSource = () => axios.CancelToken.source();

export default instance;
