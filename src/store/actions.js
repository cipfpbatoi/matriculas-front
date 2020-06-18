import API from '@/services/api/';

export default {
  loadData (context) {
    return new Promise((resolve, reject) => {
      if (context.state.loaded) {
          resolve();
          return;
      }
      API.status.getAll()
          .then((resp) => {
              context.commit('setStatus', resp.data.data);
              context.commit('setLoaded', true);
              resolve(resp.data.data);
          })
          .catch((err) => {
              context.commit('setLoaded', false);
              reject(err);
          });
    })
  },
  login (context, credentials) {
    return new Promise((resolve, reject) => {
        API.users.login(credentials)
            .then((resp) => {
//                let token = resp.data.data.token;
                let token = resp.data;
                localStorage.setItem('token', token);
                context.commit('setToken', token);
                resolve(resp);
            })
            .catch((err) => {
                localStorage.removeItem('token');
                reject(err);
            });
    });
},
logout ({commit}) {
    localStorage.removeItem('token');
    commit('setToken', '');
}

}