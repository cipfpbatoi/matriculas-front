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
        if ((config.url === `${baseURL}/application` 
                || config.url.startsWith(`${baseURL}/application?`)) 
            && new Date() / 1000 + TimeToRefresh > localStorage.expires) {
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
    getAll: (params) => axios
        .get(`${baseURL}/application` + (params ? `?${params}` : '')),
    getReport: (params) => axios
        .get(`${baseURL}/report/application` + (params ? `?${params}` : '')),
    getEnrollment: (id) => axios.get(`${baseURL}/application/${id}`),
    modifyStatus: (id, state) => axios
        .put(`${baseURL}/application/${id}/status`, `status=${state}`),
    submitPaymentFile: (userId, file) => axios
        .post(`${baseURL}/application/${userId}/payment/document`, file),
    submitOtherFile: (userId, file, fileType) => axios
        .post(`${baseURL}/application/${userId}/document/${fileType}`, file),
};

const data = {
    getStatus: () => axios.get(`${baseURL}/application/status`),
    getPaymentStatus: () => axios.get(`${baseURL}/payment/status`),
    getProcesses: () => axios.get(`${baseURL}/process`),
    getProcessTypes: () => axios.get(`${baseURL}/process/type`),
    getCourses: () => axios.get(`${baseURL}/course`),
    getShoolYears: () => axios.get(`${baseURL}/school_years`),
    getDocumentTypes: () => axios.get(`${baseURL}/document/type`),
};

const processes = {
    getAll: () => axios.get(`${baseURL}/process`),
    saveProcess: (process) => axios(getProcessOptions(process)),
    delProcess: (id) => axios.delete(`${baseURL}/process/${id}`),
    submitCsvFile: (processId, file) => axios.post(`${baseURL}/process/${processId}/user`, file),
    getStudents: (processId, params) => axios.get(`${baseURL}/process/${processId}/user` + (params ? `?${params}` : '')),
    delStudent: (processId, student) => axios.delete(`${baseURL}/process/${processId}/user/${student}`),
};

const users = {
    login: (credentials) => axios.post(`${baseURL}/login_check`, credentials),
    refresh: (refreshToken) => axios.post(`${baseURL}/token/refresh`, refreshToken),
    profile: () => axios.get(`${baseURL}/user/profile`),
    resetPsw: (user) => axios
        .post(`${baseURL}/process/${user.id}/user/${user.student.dni}/credentials/reset`),
};

export default {
    enrollments,
    processes,
    data,
    users,
};

function stringToUrlEncoded(params) {
    return Object.entries(params)
        .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
        .join('&');
}

function getProcessOptions(process) {
    return {
        method: process.id ? 'PUT' : 'POST',
        url: `${baseURL}/process` + (process.id ? '/' + process.id : ''),
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: stringToUrlEncoded(process),
    }
}