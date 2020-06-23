export default {
  getStatus: (state) => {
    return state.status;
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
    return state.token;
  },
  getMenu: (state) => {
    if (state.token) {
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
