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
  setDocTypes (state, data) {
    state.documentTypes = data;
    state.documentTypes.forEach(type => {
      switch (type.id) {
        case 1:
          type.icon = 'mdi-card-account-details';
          break;
        case 2:
          type.icon = 'mdi-account-box';
          break;
        default:
          type.icon = 'mdi-file-check-outline';
      } 
    })
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