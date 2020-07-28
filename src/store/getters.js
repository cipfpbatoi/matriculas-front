const ID_STATUS_INICIADO = 1; // Para filtrar los estados como este o inferiores
const INSURANZE_CARD_PAY = 2; // Tipo de pago con tarjeta

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
    if (state.user.token) {
      let menu = [];
      state.processes.forEach(item => menu.push({
        name: item.name,
        path: '/enrollments/process/' + item.id,
        icon: 'mdi-folder-lock' + (item.type === 2 ? '-open':''),
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
  },
  getDocTypeInfo: () => (type) => {
    let info = {};
    switch (type) {
      case 1:
        info.name = 'Còpia dni/nie';
        info.icon = 'mdi-card-account-details';
        break;
      case 2:
        info.name = 'Fotografia';
        info.icon = 'mdi-account-box';
        break;
      default:
        info.name = 'altres';
        info.icon = 'mdi-file-check-outline';
    }
    return info;
  },
}
