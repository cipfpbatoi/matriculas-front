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
  setToken (state, token) {
      state.token = token;
  },
}