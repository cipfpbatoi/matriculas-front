export default {
  setStatus (state, data) {
    state.status = data;
  },
  setLoaded (state, value) {
      state.loaded = value;
  },
  setToken (state, token) {
      state.token = token;
  },
}