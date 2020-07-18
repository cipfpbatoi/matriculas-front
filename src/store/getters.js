const ID_STATUS_INICIADO = 1; // Para filtrar los estados como este o inferiores

export default {
  getStatus: (state) => {
    return state.status;
  },
  getSelectableStatus: (state) => {
    return state.status.filter(item => item.id > ID_STATUS_INICIADO);
  },
  getPaymentStatus: (state) => (id) => {
    return state.paymentStatus.find(item => item.id === id);
  },
  getCourses: (state) => {
    return state.courses;
  },
  getProcesses: (state) => {
    return state.processes;
  },
  getActualProcess: (state) => {
    return state.processes[state.processes.length -1];
  },
  getSchoolYears: (state) => {
    return state.schoolYears;
  },
  getToken: (state) => {
    return state.user.token;
  },
  getUser: (state) => {
    return state.user.name 
      ? state.user.name + ' ' + state.user.surname
      : '';
  },
  getMenu: (state) => {
    if (state.user.token) {
      let menu = [];
      state.processes.forEach(item => menu.push({
        name: item.name,
        path: '/enrollments/process/' + item.id,
        icon: 'mdi-folder'
      }))
      return menu;
    }
    return [
      {
        name: 'Login',
        path: '/login',
        icon: 'mdi-login',
      }
    ]
  }
}
