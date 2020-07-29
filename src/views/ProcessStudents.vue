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
          v-model="search"
          append-icon="mdi-magnify"
          label="Cerca"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>

      <v-data-table item-key="id" :headers="headers" :items="items" :search="search">
getCourseName
        <template v-slot:item.course="{ item }">
          <span>{{ getCourseName(item.course) }}</span>
        </template>
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

export default {
  name: "ProcessStudents",
  props: ["processId"],
  data() {
    return {
      items: [],
      search: "",
      headers: headers.processStudents,
      messages: []
    };
  },
  mounted() {
    this.getData();
    this.getProcessStudents();
  },

  computed: {
    process() {
      return this.$store.getters.getProcess(Number(this.processId)) || {};
    },
    courses() {
      return this.$store.getters.getCourses || [];
    }
  },

  methods: {
    getData() {
      this.$store
        .dispatch("loadData")
        .then()
        .catch(err => this.manageError(err, "Error loading data", "error"));
    },
    getProcessStudents() {
      // load de enrollments
      this.loading = true;
      this.items = [];
      console.log('#############'+this.processId);
      API.processes
        .getStudents(this.processId)
        .then(response => {
          this.items = response.data.data.items;
        })
        .catch(err => {
          this.loading = false;
          this.manageError(err, "Error loading students", "error");
        });
    },
    getCourseName(courseId) {
      const course = this.courses.find(item => item.id == courseId);
      return course ? course.name : courseId;
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
    }
  }
};
</script>