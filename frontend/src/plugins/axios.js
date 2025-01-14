import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.NODE_ENV === "development" ? 'http://127.0.0.1:5001/navalia-shopping/us-central1/api' : process.env.VUE_APP_API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('Unauthorized. Redirecting to login...');
        }
        return Promise.reject(error);
    }
);

export default apiClient;