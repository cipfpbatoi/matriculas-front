<template>
  <v-container fluid class="grey lighten-5">
    <v-card>
      <v-row justify="center" v-for="(error, i) in errors" :key="i">
        <v-alert v-model="error.show" :type="error.type" dismissible>{{ error.msg }}</v-alert>
      </v-row>
      <v-card-title justify="center">
        <h2>Gestionar Convocatòries</h2>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Cerca"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn color="primary" align="rigth" @click="openDialog">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>

      <v-data-table item-key="id" :headers="headers" :items="items" :search="search">
        <template v-slot:item.start_date="{ item }">
          <span>{{ showDate(item.start_date) }}</span>
        </template>
        <template v-slot:item.end_date="{ item }">
          <span>{{ showDate(item.end_date) }}</span>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
            title="Canviar convocatòria"
            class="primary--text"
            @click="openDialog(item)"
          >mdi-pencil</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog.showed" persistent max-width="620px">
      <v-card>
        <v-card-title class="primary--text">
          <span class="headline">{{ editing ? 'Canviar' : 'Nova'}} convocatòria</span>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12" md="1">
                  <v-text-field v-model="dialog.item.id" label="Id" disabled></v-text-field>
                </v-col>
                <v-col cols="12" md="2">
                  <v-text-field v-model="dialog.item.type" label="Tipo" pattern="[1|2]"></v-text-field>
                </v-col>
                <v-col cols="9">
                  <v-text-field v-model="dialog.item.name" label="Nom" required></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-label>Data d'inici</v-label>
                  <v-date-picker 
                    v-model="dialog.item.start_date" 
                    label="Data d'inici"
                    locale="es-es"
                    required
                    ></v-date-picker>
                </v-col>
                <v-col cols="12" md="6">
                  <v-label>Data de fí</v-label>
                  <v-date-picker 
                    v-model="dialog.item.end_date" 
                    label="Data de fí" 
                    locale="es-es"
                    required
                  ></v-date-picker>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog.showed = false">Tanca</v-btn>
          <v-btn color="blue darken-1" text @click="saveProcess">Guarda</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import API from "@/services/api";
import headers from "@/lib/headers";

export default {
  data() {
    return {
      search: "",
      headers: headers.processes,
      errors: [],
      dialog: {
        showed: false,
        item: {}
      }
    };
  },
  computed: {
    items() {
      return this.$store.getters.getProcesses;
    },
    editing() {
      return this.dialog.item.id;
    }
  },
  methods: {
    saveProcess() {
      API.processes
        .getAll()
        .then(response => {
          this.loading = false;
          this.pagination.page = Number(response.data.data.page);
          this.pagination.more = response.data.data.more;
          this.pagination.pageSize = Number(response.data.data.sizePage);
          this.items = response.data.data.applications;
        })
        .catch(err => {
          this.manageError(err, "Error loading enrollments", "error");
        });
    },
    showDate(date) {
      return date ? new Date(date).toLocaleDateString() : "---";
    },
    openDialog(item) {
      if (item) {
        this.dialog.item = Object.assign({}, item);
        this.dialog.item.start_date = item.start_date.split("T")[0];
        this.dialog.item.end_date = item.end_date.split("T")[0];
      } else {
        this.dialog.item = {};
      }
      this.dialog.showed = true;
    }
  }
};
</script>