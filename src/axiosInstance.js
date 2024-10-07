import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

export default axiosInstance;