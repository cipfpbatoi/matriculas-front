<template>
  <v-container fluid class="grey lighten-5">
    <v-card>
      <v-row justify="center" v-for="(message, i) in messages" :key="i">
        <v-alert v-model="message.show" :type="message.type" dismissible>{{ message.msg }}</v-alert>
      </v-row>
      <v-card-title justify="center">
        <h2>Estudiants preinscrits en la convocatòria</h2>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Cerca"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
      </v-card-title>

      <v-data-table item-key="id" :headers="headers" :items="items" :search="search">
        <template v-slot:item.type="{ item }">
          <span>{{ showTypeName(item.type) }}</span>
        </template>
        <template v-slot:item.start_date="{ item }">
          <span>{{ showDate(item.start_date) }}</span>
        </template>
        <template v-slot:item.end_date="{ item }">
          <span>{{ showDate(item.end_date) }}</span>
        </template>
        <template v-slot:item.process_form_url="{ item }">
          <a :href="item.process_form_url" :title="item.process_form_url" target="_blank">
            <v-icon color="primary" class="mr-2">mdi-link-variant</v-icon>
          </a>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
            title="Canviar convocatòria"
            class="primary--text"
            @click="openDialog(item)"
          >mdi-pencil</v-icon>
          <v-icon
            title="Pujar CSV alumnes preinscrits"
            class="primary--text"
            @click="openFileDialog(item)"
            :disabled="item.type==1"
          >mdi-upload</v-icon>
          <v-icon
            title="Eliminar convocatòria"
            class="primary--text"
            @click="deleteProcess(item)"
          >mdi-delete</v-icon>
          <v-icon
            title="Vore matrícules"
            class="primary--text"
            @click="$router.push('/enrollments/process/' + item.id)"
          >mdi-account-multiple</v-icon>
          <v-icon
            title="Enviar enllaç a DNI"
            class="primary--text"
            @click="openDniDialog(item)"
          >mdi-card-account-details</v-icon>
        </template>
      </v-data-table>
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
      API.processes
        .getStudents(Number(this.processId))
        .then(response => {
          this.items = response.data.data.items;
        })
        .catch(err => {
          this.loading = false;
          this.manageError(err, "Error loading students", "error");
        });
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