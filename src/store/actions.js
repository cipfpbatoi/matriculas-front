import API from '@/services/api/';
import * as jwt_decode from 'jwt-decode';

export default {
    loadData(context) {
        return new Promise((resolve, reject) => {
            if (context.state.loaded) {
                resolve();
                return;
            }
            API.data.getStatus()
                .then((resp) => {
                    context.commit('setStatus', resp.data.data);
                    context.commit('setLoaded', true);
                    resolve(resp.data.data);
                })
                .catch((err) => {
                    context.commit('setLoaded', false);
                    reject(err);
                });
            // Se repite lo mismo para Courses, Processes, Schoole_years. Cambiar a Promises.all
            API.data.getProcesses()
                .then((resp) => {
                    context.commit('setProcesses', resp.data.data);
                    context.commit('setLoaded', true);
                    resolve(resp.data.data);
                })
                .catch((err) => {
                    context.commit('setLoaded', false);
                    reject(err);
                });
            API.data.getCourses()
                .then((resp) => {
                    context.commit('setCourses', resp.data.data);
                    context.commit('setLoaded', true);
                    resolve(resp.data.data);
                })
                .catch((err) => {
                    context.commit('setLoaded', false);
                    reject(err);
                });
            API.data.getPaymentStatus()
                .then((resp) => {
                    context.commit('setPaymentStatus', resp.data.data);
                    context.commit('setLoaded', true);
                    resolve(resp.data.data);
                })
                .catch((err) => {
                    context.commit('setLoaded', false);
                    reject(err);
                });

        })
    },
    async login(context, credentials) {
        try {
            const respLogin = await API.users.login(credentials);
            let tokenDecoded = jwt_decode(respLogin.data.token);
            localStorage.setItem('token', respLogin.data.token);
            localStorage.setItem('expires', tokenDecoded.exp);
            // Demanem el perfil
            const respProfile = await API.users.profile();
            respProfile.data.data.token = respLogin.data.token;
            respProfile.data.data.refreshToken = respLogin.data.refresh_token;
            respProfile.data.data.roles = tokenDecoded.roles;
            context.commit('setUser', respProfile.data.data);
            return respProfile.data;
        } catch(err) {
            localStorage.removeItem('token');
            throw err;
        }
    },
    logout({ commit }) {
        localStorage.removeItem('token');
        commit('setUser', {});
    },
    refreshToken(context) {
        alert('refresca');
        let user = context.state.user;
        API.users.refresh(user.refreshToken)
        .then(respLogin => {
            let tokenDecoded = jwt_decode(respLogin.data.token);
            localStorage.setItem('token', respLogin.data.token);
            localStorage.setItem('expires', tokenDecoded.exp);
            user.token = respLogin.data.token;
            user.refreshToken = respLogin.data.refresh_token;
            user.roles = tokenDecoded.roles;
            context.commit('setUser', user);
        })
        .catch((err) => {
            localStorage.removeItem('token');
            throw err;
        })
    }
}