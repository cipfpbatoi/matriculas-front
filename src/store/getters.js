export default {
  getStatus: (state) => {
    return state.status;
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
        path: '/process/' + item.id,
        icon: 'mdi-folder'
      }))
      menu.push({
          name: 'Totes',
          path: '/',
          icon: 'mdi-folder-multiple'
      });
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
