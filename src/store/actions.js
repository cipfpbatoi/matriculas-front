import API from '@/services/api/';

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
            localStorage.setItem('token', respLogin.data.token);
            // Demanem el perfil
            const respProfile = await API.users.profile();
            respProfile.data.data.token = respLogin.data.token;
            context.commit('setUser', respProfile.data.data);
            return respProfile.data;
        } catch(err) {
            localStorage.removeItem('token');
            throw err;
        }
    },
    // login(context, credentials) {
    //     return new Promise((resolve, reject) => {
    //         API.users.login(credentials)
    //             .then((resp) => {
    //                 //                let token = resp.data.data.token;
    //                 let token = resp.data;
    //                 localStorage.setItem('token', token.token);
    //                 context.commit('setToken', token);
    //                 resolve(resp);
    //             })
    //             .catch((err) => {
    //                 localStorage.removeItem('token');
    //                 reject(err);
    //             });
    //     });
    // },
    logout({ commit }) {
        localStorage.removeItem('token');
        commit('setToken', '');
    }

}