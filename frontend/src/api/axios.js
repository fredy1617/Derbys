import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8000/api',
    //baseURL: 'https://api-derby.tramusacarrier.com.mx/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add token to headers
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('session/TOKEN API');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;
