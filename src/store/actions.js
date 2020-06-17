import API from '@/services/api/';

export default {
  loadData (context) {
    if (context.state.loaded) return;
    API.status.getAll()
        .then((resp) => {
            context.commit('setStatus', resp.data.data);
            context.commit('setLoaded', true);
        })
        .catch(() => {
            context.commit('setLoaded', false);
        });
  },
}