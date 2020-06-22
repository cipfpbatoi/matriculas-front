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
  }
}
