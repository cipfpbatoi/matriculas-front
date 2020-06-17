export default {
  loaded: false,
  status: [],
  headers: {
    enrollments: [
      {
        text: 'Cognoms',
        align: 'start',
        sortable: true,
        value: 'student.surname',
      },
      {
        text: 'Nom',
        align: 'start',
        sortable: false,
        value: 'student.name',
      },
      {
        text: 'Data pres.',
        align: 'start',
        sortable: true,
        value: 'presented_on',
      },
      {
        text: 'Estat',
        align: 'start',
        sortable: true,
        value: 'status',
      },
      {
        text: 'NIA',
        align: 'end',
        sortable: false,
        value: 'student.nia',
      },
      {
        text: 'Matr.',
        sortable: true,
        value: 'process.id',
      },
      {
        text: 'Cicle',
        align: 'start',
        sortable: true,
        value: 'course.name',
        filter: (value) => {
          if (!this.searchCicle) return true;
          return value === this.searchCicle;
        }
      },
      {
        text: 'Curs',
        align: 'start',
        sortable: true,
        value: 'school_year',
      },
    ],  
  }
}
