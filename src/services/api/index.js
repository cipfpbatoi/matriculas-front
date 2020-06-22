import axios from 'axios';
import store from '@/store';

const DEBUG = process.env.NODE_ENV === 'development';
const baseURL = process.env.VUE_APP_RUTA_API || "http://localhost:3000";

axios.interceptors.request.use((config) => {
    /** In dev, intercepts request and logs it into console for dev */
    if (DEBUG) {
        console.info('✉️ ', config);
    }

    const token = store.getters.token;
    if (token) {
            config.headers['Authorization'] = 'Bearer ' + store.getters.token;
    }
    return config;
}, (error) => {
    if (DEBUG) {
        console.error('✉️ ', error);
    }
    return Promise.reject(error);
});

axios.interceptors.response.use((response) => {
    return response;
}, (error) => {
    return Promise.reject(error);
});

const enrollments = {
    getAll: (params) => axios.get(`${baseURL}/application` + (params ? `?${params}` : '')),
    getOne: (id) => axios.get(`${baseURL}/application/${id}`),
    modifyStatus: (id, state) => axios.put(`${baseURL}/application/${id}/status/${state}`),
};

const data = {
//    getAll: () => axios.get(`${baseURL}/application/status`),
    getStatus: () => axios.get(`${baseURL}/status`),
    getProcesses: () => axios.get(`${baseURL}/processes`),
    getCourses: () => axios.get(`${baseURL}/courses`),
    getShoolYears: () => axios.get(`${baseURL}/school_years`),
};

const users = {
    login: (credentials) => axios.post(`${baseURL}/login`, credentials),
};

export default {
    enrollments,
    data,
    users,
};
