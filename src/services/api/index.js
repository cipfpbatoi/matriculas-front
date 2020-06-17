import axios from 'axios';
import store from '@/store';
import {EventBus} from '@/services/eventBus.js';

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
    let message = '';

    if (error.response) {
        console.log(error.response);
        if (error.response.data.data && error.response.data.data.error) {
            message = error.response.data.data.error;

        } else {
            message = error.response.data;
        }
        if (error.response.status !== 400) {
            EventBus.$emit('show', message);
        }
    } else {
        console.log(error);
        message = error.message;
        EventBus.$emit('show', message);
    }

    return Promise.reject(error);
});

const enrollments = {
    getAll: (params) => axios.get(`${baseURL}/application` + (params ? `?${params}` : '')),
    getOne: (id) => axios.get(`${baseURL}/application/${id}`),
};

const status = {
//    getAll: () => axios.get(`${baseURL}/application/status`),
    getAll: () => axios.get(`${baseURL}/status`),
    modify: (id, state) => axios.put(`${baseURL}/application/${id}/status/${state}`),
};

const users = {
    login: (credentials) => axios.post(`${baseURL}/login`, credentials),
    getProfile: () => axios.get(`${baseURL}/users/profile`),
    saveProfile: (profile) => axios.put(`${baseURL}/users`, profile),
    savePassword: (password) => axios.put(`${baseURL}/users`, password),
    register: (user) => axios.post(`${baseURL}/register`, user),
    activation: (token) => axios.get(`${baseURL}/validation/${token}`),
    rememberPassword: (email) => axios.post(`${baseURL}/rememberme`, email),
};

export default {
    enrollments,
    status,
    users,
};
