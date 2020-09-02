<template>
  <v-container fluid class="grey lighten-5">
    <v-card>
      <v-row justify="center" v-for="(message, i) in messages" :key="i">
        <v-alert v-model="message.show" :type="message.type" dismissible>{{ message.msg }}</v-alert>
      </v-row>
      <v-card-title justify="center">
        <h2>{{ process.name }} (preinscrits)</h2>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search.general"
          append-icon="mdi-magnify"
          label="Cerca"
          single-line
          hide-details
        ></v-text-field>
          <v-spacer></v-spacer>
          <v-select
            v-model="search.course"
            :items="courses"
            item-text="name"
            item-value="id"
            label="Cicle"
            clearable
          ></v-select>
      </v-card-title>

      <v-data-table 
        item-key="id" 
        :headers="headers" 
        :items="items" 
        :search="search"
        :loading="loading"
        loading-text="Carregant dades... Espere per favor"
        disable-pagination
        hide-default-footer
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
      >
        <template v-slot:item.activated="{ item }">
          <v-icon
            :class="(item.activated?'success':'error')+'--text'"
          >{{ item.activated?'mdi-check':'mdi-window-close' }}</v-icon>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon
            title="Eliminar convocatòria"
            class="primary--text"
            @click="deleteStudent(item)"
          >mdi-delete</v-icon>
        </template>
      </v-data-table>

      <v-row class="text-center pt-2">
        <v-col cols="2">
          Mostrando de
          <strong>{{ (pagination.pageSize * (pagination.page -1) + 1 )}}</strong> hasta
          <strong>{{ pagination.pageSize * (pagination.page -1) + items.length }}</strong>
        </v-col>
        <v-col cols="8">
          <v-btn text :disabled="pagination.page <= 1" @click="firstPage">
            <v-icon class="primary--text">mdi-chevron-double-left</v-icon>
          </v-btn>
          <v-btn text :disabled="pagination.page <= 1" @click="prevPage">
            <v-icon class="primary--text">mdi-chevron-left</v-icon>
          </v-btn>
          <span class="primary--text">Pàgina {{ pagination.page }}</span>
          <v-btn text :disabled="!pagination.more" @click="nextPage">
            <v-icon class="primary--text">mdi-chevron-right</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="2">
          <v-select
            v-model="pagination.pageSize"
            :items="[10, 25, 50, 100]"
            label="Matrícules per pàgina"
            dense
            required
            @change="getProcessStudents"
          ></v-select>
        </v-col>
      </v-row>

      <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="$router.push('/processes')">Tornar</v-btn>
      </v-card-actions>
    </v-card>

  </v-container>
</template>

<script>
import API from "@/services/api";

import headers from "@/lib/headers";

const DEFAULT_SIZE_PAGE = 25;

export default {
  name: "ProcessStudents",
  props: ["processId"],
  data() {
    return {
      items: [],
      search: {
        course: "",
        schoolYear: "",
        status: "",
        process: "",
        general: ""
      },
      headers: headers.processStudents,
      messages: [],
      loading: true,
      pagination: {
        page: 1,
        toPage: 0,
        more: false,
        pageSize: DEFAULT_SIZE_PAGE
      },
      sortDesc: false,
      sortBy: ""
    }
  },
  mounted() {
    this.getData();
    this.getProcessStudents();
  },

  watch: {
    $route(to, from) {
      if (to === from) return;
      this.getData();
      this.getProcessStudents();
    },
    search: {
      handler() {
        this.pagination.page = 1; // tornem a vore la 1a pàgina
        this.getProcessStudents();
      },
      deep: true
    },
    processId() {
      this.pagination.page = 1; // tornem a vore la 1a pàgina
      this.getProcessStudents();
    },
    sortBy() {
      this.pagination.page = 1; // tornem a vore la 1a pàgina
      this.getProcessStudents();
    },
    sortDesc() {
      this.pagination.page = 1; // tornem a vore la 1a pàgina
      this.getProcessStudents();
    }
  },

  computed: {
    process() {
      return this.$store.getters.getProcess(Number(this.processId)) || {};
    },
    courses() {
      return this.$store.getters.getCourses;
    },
  },

  methods: {
    getData() {
      this.$store
        .dispatch("loadData")
        .then()
        .catch(err => this.manageError(err, "Error loading data", "error"));
    },
    getProcessStudents() {
      this.loading = true;
      this.items = [];
      let filters = this.getParams();
      API.processes
        .getStudents(this.processId, filters.join("&"))
        .then(response => {
          this.loading = false;
          this.pagination.page = Number(response.data.data.page);
          this.pagination.more = response.data.data.more;
          this.pagination.pageSize = Number(response.data.data.page_size);
          this.items = response.data.data.items;
        })
        .catch(err => {
          this.loading = false;
          this.manageError(err, "Error loading students", "error");
        });
    },
    deleteStudent(student) {
      const studentName = `${student.surname1} ${student.surname2}, ${student.name}`;
      if (confirm(`Segur que vols eliminar l'alume 
        "${studentName}"?`)) {
        API.processes
          .delStudent(this.processId, student.dni)
          .then(() => {
            const index = this.items.findIndex(item => item.id === student.id);
            this.items.splice(index, 1);
            this.messages.push({
              msg: "Eliminat l'alumne " + studentName,
              type: "success",
              show: true
            });
          })
          .catch(err => {
            this.loading = false;
            this.manageError(err, "Error deleting student " + studentName, "error");
          });

        }
    },
    manageError(err, msg, type) {
      this.messages.push({
        msg: msg + " - " + err.response.data.error,
        type,
        show: true
      });
      if (err.response.status === 401) {
        let msgToken = "";
        if (/expired/i.test(err.response.data.error)) {
          msgToken = "Tu token ha caducado. Debes loguearte de nuevo";
        } else {
          msgToken = "No estás logueado. Debes loguearte";
        }
        this.messages.push({
          msg: msgToken,
          type: "error",
          show: true
        });
        this.$router.push({ name: "login", params: { msgToken } });
      }
    },
    prevPage() {
      this.pagination.toPage = this.pagination.page - 1;
      this.getProcessStudents();
    },
    nextPage() {
      this.pagination.toPage = this.pagination.page + 1;
      this.getProcessStudents();
    },
    firstPage() {
      this.pagination.toPage = 1;
      this.getProcessStudents();
    },
    getParams() {
      let filters = [];
      if (this.search.course) filters.push("course=" + this.search.course);
      if (this.search.general) filters.push("search=" + this.search.general);
      if (this.pagination.more || this.pagination.page > 1) {
        if (this.pagination.toPage) {
          filters.push("page=" + this.pagination.toPage);
          this.pagination.toPage = 0;
        } else {
          filters.push("page=" + this.pagination.page);
        }
        if (this.sortBy) filters.push("orderBy=" + this.apiName(this.sortBy));
        if (this.sortDesc) filters.push("order=DESC");
      }
      if (this.pagination.pageSize !== DEFAULT_SIZE_PAGE) {
        filters.push("page_size=" + this.pagination.pageSize);
      }
      return filters;
    },
    apiName(field) {
      switch (field) {
        case "student.surname":
          return "student";
        case "course.name":
          return "course";
        default:
          return field;
      }
    },
  }
};
</script>