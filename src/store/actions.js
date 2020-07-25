import API from '@/services/api/';
import * as jwt_decode from 'jwt-decode';

export default {
    loadData(context) {
        return new Promise((resolve, reject) => {
            if (context.state.loaded) {
                resolve(context.getters.getActualProcess);
                return;
            }
            API.processes.getAll()
                .then((resp) => {
                    context.commit('setProcesses', resp.data.data);
                    context.commit('setLoaded', true);
                    resolve(context.getters.getActualProcess);
                })
                .catch((err) => {
                    context.commit('setLoaded', false);
                    reject(err);
                });
            // Se repite lo mismo para Courses, Status, Schoole_years. Cambiar a Promises.all
            API.data.getStatus()
                .then((resp) => {
                    context.commit('setStatus', resp.data.data);
                    context.commit('setLoaded', true);
//                    resolve(resp.data.data);
                })
                .catch(() => {
                    context.commit('setLoaded', false);
//                    reject(err);
                });
            API.data.getCourses()
                .then((resp) => {
                    context.commit('setCourses', resp.data.data);
                    context.commit('setLoaded', true);
//                    resolve(resp.data.data);
                })
                .catch(() => {
                    context.commit('setLoaded', false);
//                    reject(err);
                });
            API.data.getPaymentStatus()
                .then((resp) => {
                    context.commit('setPaymentStatus', resp.data.data);
                    context.commit('setLoaded', true);
//                    resolve(resp.data.data);
                })
                .catch(() => {
                    context.commit('setLoaded', false);
//                    reject(err);
                });

        })
    },
    async login(context, credentials) {
        try {
            const respLogin = await API.users.login(credentials);
            let tokenDecoded = jwt_decode(respLogin.data.token);
            localStorage.setItem('token', respLogin.data.token);
            localStorage.setItem('expires', tokenDecoded.exp);
            localStorage.setItem('refresh_token', respLogin.data.refresh_token);
            // Demanem el perfil
            const respProfile = await API.users.profile();
            respProfile.data.data.token = respLogin.data.token;
            respProfile.data.data.refreshToken = respLogin.data.refresh_token;
            respProfile.data.data.roles = tokenDecoded.roles;
            context.commit('setUser', respProfile.data.data);
            return respProfile.data;
        } catch(err) {
            localStorage.removeItem('token');
            localStorage.removeItem('expires');
            localStorage.removeItem('refresh_token');
            throw err;
        }
    },
    logout({ commit }) {
        localStorage.removeItem('token');
        localStorage.removeItem('expires');
        localStorage.removeItem('refresh_token');
//        commit('setUser', {});
        commit('logout');
    },
    refreshToken() {
        // Al ser llamado desde el API no tiene acceso al context
        API.users.refresh(localStorage.refresh_token)
        .then(respLogin => {
            let tokenDecoded = jwt_decode(respLogin.data.token);
            localStorage.setItem('token', respLogin.data.token);
            localStorage.setItem('expires', tokenDecoded.exp);
            localStorage.setItem('refresh_token', respLogin.data.refresh_token);
        })
        .catch((err) => {
            localStorage.removeItem('token');
            localStorage.removeItem('expires');
            localStorage.removeItem('refresh_token');
                throw err;
        })
    },
    saveProcess(context, process) {
        return new Promise((resolv, reject) => {
            API.processes.saveProcess(process)
            .then(response => {
                context.commit('setProcess', response.data.data);
                resolv(response.data.data);
            })
            .catch(err => {
                reject(err);
            });
        })
    },
    delProcess(context, process) {
        return new Promise((resolv, reject) => {
            API.processes.delProcess(process.id)
            .then(() => {
                context.commit('delProcess', process.id);
                resolv();
            })
            .catch(err => {
                reject(err);
            });
        })
    }

}