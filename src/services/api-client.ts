import axios, { AxiosRequestConfig, AxiosError } from "axios";

export interface FetchResponse<T> {
  count: number;
  next: string | null;
  results: T[];
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://api.rawg.io/api",
  timeout: 10000,
  params: {
    key: import.meta.env.VITE_RAWG_API_KEY,
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    } else if (error.response?.status === 429) {
      console.error('Rate limit exceeded');
    } else if (error.response?.status && error.response.status >= 500) {
      console.error('Server error');
    } else if (!error.response) {
      console.error('Network error');
    }
    return Promise.reject(error);
  }
);

class APIClient<T> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getAll = (config: AxiosRequestConfig & { url?: string } = {}) => {
    const { url, ...axiosConfig } = config;
    const endpoint = url || this.endpoint;
    return axiosInstance
      .get<FetchResponse<T>>(endpoint, axiosConfig)
      .then((res) => res.data);
  };


}

export default APIClient;
