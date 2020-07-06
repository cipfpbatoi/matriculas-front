import axios from 'axios';
import StoreActions from "@/store/actions";

const DEBUG = process.env.NODE_ENV === 'development';
const baseURL = process.env.VUE_APP_RUTA_API || "http://localhost:3000";
const TimeToRefresh = 15 * 60;  // 15 minuts

axios.interceptors.request.use((config) => {
    /** In dev, intercepts request and logs it into console for dev */
    if (DEBUG) {
        console.info('✉️ ', config);
    }

    const token = localStorage.token;
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
        // comprobamos si hemos de refrescar el token
        if (new Date() / 1000 + TimeToRefresh > localStorage.expires) {
            StoreActions.refreshToken();
        }
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
    modifyStatus: (id, state) => axios.put(`${baseURL}/application/${id}/status`, `status=${state}`),
};

const data = {
    //    getAll: () => axios.get(`${baseURL}/application/status`),
    getStatus: () => axios.get(`${baseURL}/application/status`),
    getPaymentStatus: () => axios.get(`${baseURL}/payment/status`),
    getProcesses: () => axios.get(`${baseURL}/process`),
    getCourses: () => axios.get(`${baseURL}/course`),
    getShoolYears: () => axios.get(`${baseURL}/school_years`),
};

const users = {
    login: (credentials) => axios.post(`${baseURL}/login_check`, credentials),
    refresh: (refreshToken) => axios.post(`${baseURL}/token/refresh`, refreshToken),
    profile: () => axios.get(`${baseURL}/user/profile`),
};

export default {
    enrollments,
    data,
    users,
};
