const processes = [
  {
    text: "Id",
    align: "start",
    sortable: true,
    value: "id",
    class: "primary--text  text-subtitle-2"
  },
  {
    text: "Nom",
    align: "start",
    sortable: true,
    value: "name",
    class: "primary--text  text-subtitle-2"
  },
  {
    text: "Inici",
    align: "start",
    sortable: true,
    value: "start_date",
    class: "primary--text  text-subtitle-2"
  },
  {
    text: "Fin",
    align: "start",
    sortable: true,
    value: "end_date",
    class: "primary--text  text-subtitle-2"
  },
  {
    text: "Fitxer CSV",
    align: "start",
    sortable: false,
    value: "file",
    class: "primary--text  text-subtitle-2"
  },
  {
    text: "Accions",
    value: "actions",
    sortable: false,
    class: "primary--text  text-subtitle-2"
  },
];
const enrollments = [
  {
    text: "Accions",
    value: "actions",
    sortable: false,
    class: "primary--text  text-subtitle-2"
  },
  {
    text: "Id",
    align: "start",
    sortable: true,
    value: "id",
    class: "primary--text  text-subtitle-2"
  },
  {
    text: "Cognoms",
    align: "start",
    sortable: true,
    value: "student.surname",
    class: "primary--text  text-subtitle-2"
  },
  {
    text: "Nom",
    align: "start",
    sortable: false,
    value: "student.name",
    class: "primary--text  text-subtitle-2"
  },
  {
    text: "Data pres.",
    align: "start",
    sortable: true,
    value: "presented_on",
    class: "primary--text  text-subtitle-2"
  },
  {
    text: "Estat",
    align: "start",
    sortable: true,
    value: "status",
    class: "primary--text  text-subtitle-2",
  },
  {
    text: "NIA",
    align: "end",
    sortable: false,
    value: "student.nia",
    class: "primary--text  text-subtitle-2",
    type: 1,
  },
  {
    text: "DNI",
    align: "end",
    sortable: false,
    value: "student.dni",
    class: "primary--text  text-subtitle-2"
  },
  {
    text: "Promociona",
    sortable: true,
    value: "promote",
    class: "primary--text text-subtitle-2",
    type: 1,
  },
  {
    text: "Cicle",
    align: "start",
    sortable: true,
    value: "course.name",
    class: "primary--text text-subtitle-2",
  },
  {
    text: "Curs",
    sortable: true,
    value: "school_year",
    class: "primary--text  text-subtitle-2",
  },
  {
    text: "Ant.",
    sortable: true,
    value: "from_school_year",
    class: "primary--text  text-subtitle-2",
    type: 1,
  },
  {
    text: "Taxes",
    align: "start",
    sortable: true,
    value: "fee_receipt_filename",
    class: "primary--text  text-subtitle-2"
  },
  {
    text: "Segur",
    align: "start",
    sortable: true,
    value: "insurance_payment_type",
    class: "primary--text  text-subtitle-2"
  },
  {
    text: "Altres docs.",
    align: "start",
    sortable: true,
    value: "documents",
    class: "primary--text  text-subtitle-2",
    type: 2,
  },
];

export default { 
  enrollments,
  processes,
};