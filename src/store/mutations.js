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
  setProcess (state, process) {
    let index = state.processes.findIndex(item => item.id === process.id);
    if (index >= 0) {
      state.processes.splice(index,1, process);
    } else {
      state.processes.push(process);
    }
  },
  delProcess (state, idProcess) {
    let index = state.processes.findIndex(item => item.id === idProcess);
    if (index >= 0) {
      state.processes.splice(index,1);
    }
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