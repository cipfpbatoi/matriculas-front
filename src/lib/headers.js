const enrollments = [
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
    class: "primary--text  text-subtitle-2"
  },
  {
    text: "Promociona",
    sortable: true,
    value: "promote",
    class: "primary--text text-subtitle-2",
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
    align: "start",
    sortable: true,
    value: "school_year",
    class: "primary--text  text-subtitle-2",
  },
  {
    text: "Tases",
    align: "start",
    sortable: true,
    value: "insurance_payment_type",
    class: "primary--text  text-subtitle-2"
  },
  {
    text: "Segur",
    align: "start",
    sortable: true,
    value: "insurance_receipt_filename",
    class: "primary--text  text-subtitle-2"
  },
  {
    text: "Canviar estat",
    value: "actions",
    sortable: false,
    class: "primary--text  text-subtitle-2"
  }
];

export default { enrollments };