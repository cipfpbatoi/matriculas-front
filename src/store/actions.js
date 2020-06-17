import API from '@/services/api/';

export default {
  loadData (context) {
    return new Promise((resolve, reject) => {
      if (context.state.loaded) resolve();
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
  }
}