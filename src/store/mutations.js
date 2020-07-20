export default {
  setStatus (state, data) {
    state.status = data;
  },
  setPaymentStatus (state, data) {
    state.paymentStatus = data;
  },
  setCourses (state, data) {
    state.courses = data;
  },
  setProcesses (state, data) {
    state.processes = data;
  },
  setLoaded (state, value) {
      state.loaded = value;
  },
  setUser (state, user) {
      state.user = user;
  },
  logout(state) {
    state.loaded = false;
    ['status', 'paymentStatus', 'courses', 'processes'].forEach(item => state[item] = []);
    state.user = {};
  }
}