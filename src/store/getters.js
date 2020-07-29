const ID_STATUS_INICIADO = 1; // Para filtrar los estados como este o inferiores
const INSURANZE_CARD_PAY = 2; // Tipo de pago con tarjeta
const MAX_PROCESESS_IN_MENU = 5;  // Les convocatòries que apareixen en el menú

export default {
  isCardPayment: () => (id) => {
    return id === INSURANZE_CARD_PAY;
  },
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
  getProcess: (state) => (id) => {
    return state.processes.find(item => item.id === id);
  },
  getActualProcess: (state) => {
    if (!state.processes.length) return {};
    let now = new Date();
    let actual = state.processes[0];
    state.processes.forEach(process => {
      if (process.end_date > actual.end_date && process.end_date < now.toISOString()) {
        actual = process;
      }
    })
    return actual;
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
    if (state.user.token || localStorage.token) {
      let menu = [];
//      const max_items = Math.min(MAX_PROCESESS_IN_MENU, state.processes.length);
      const processesOrdered = state.processes
        .sort((itemA, itemB) => itemA.end_date < itemB.end_date)
        .slice(0, MAX_PROCESESS_IN_MENU);
      processesOrdered.forEach(item => menu.push({
          name: item.name,
          path: '/enrollments/process/' + item.id,
          icon: 'mdi-folder-lock' + (item.type === 2 ? '-open' : ''),
        })
      )
      return menu;
    }
    return [
      {
        name: 'Login',
        path: '/login',
        icon: 'mdi-login',
      }
    ]
  },
  getDocTypes: (state) => {
    return state.documentTypes;
  },
  getDocTypeInfo: (state) => (id) => {
    return state.documentTypes.find(item => item.id === id);
  },
  getProcessTypes: (state) => {
    return state.processTypes;
  },
}
