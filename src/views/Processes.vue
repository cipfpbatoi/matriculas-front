<template>
  <v-container fluid class="grey lighten-5">
    <v-card>
      <v-row justify="center" v-for="(message, i) in messages" :key="i">
        <v-alert v-model="message.show" :type="message.type" dismissible>{{ message.msg }}</v-alert>
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
        <v-btn color="primary" align="rigth" @click="openDialog(null)">
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
        <template v-slot:item.process_form_url="{ item }">
          <a :href="item.process_form_url" target="_blank">
            <v-icon color="primary" class="mr-2">mdi-link-variant</v-icon>
          </a>
        </template>
        <template v-slot:item.file="{ item }">
          <a v-if="item.file" :href="item.file" target="_blank">
            <v-icon class="mr-2">mdi-file-check-outline</v-icon>
          </a>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
            title="Canviar convocatòria"
            class="primary--text"
            @click="openDialog(item)"
          >mdi-pencil</v-icon>
          <v-icon
            title="Pujar fitxer CSV"
            class="primary--text"
            @click="openFileDialog(item)"
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
                  <v-text-field
                    :value="dialog.item.start_date + ' 00:00:00'"
                    label="Data d'inici"
                    readonly
                  ></v-text-field>
                  <v-date-picker
                    v-model="dialog.item.start_date"
                    label="Data d'inici"
                    locale="es-es"
                    required
                  ></v-date-picker>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    :value="dialog.item.end_date + ' 23:59:59'"
                    label="Data de fí"
                    readonly
                  ></v-text-field>
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

    <v-dialog v-model="fileDialog.showed" persistent max-width="500px">
      <v-card>
        <v-card-title class="primary--text">
          <span class="headline">Canvia fitxer d'alumnes</span>
        </v-card-title>
        <v-card-text>
          <v-alert
            type="error"
          >ATENCIÓ: quan li dones a 'GUARDA' el fitxer que puges sobreescriurà l'actual, que no podrà ser recuperat de cap manera !!!</v-alert>
          <v-file-input
            v-model="fileDialog.file"
            show-size
            clearable
            counter
            chips
            presistent-hint
            :label="fileDialog.title"
            :disabled="fileDialog.loading"
          ></v-file-input>
          <v-container v-if="fileDialog.loading">
            <v-row class="fill-height" align-content="center" justify="center">
              <v-col class="subtitle-1 text-center" cols="12">Pujant fitxer...</v-col>
              <v-col cols="10">
                <v-progress-linear color="primary accent-4" indeterminate rounded height="6"></v-progress-linear>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            :disabled="fileDialog.loading"
            @click="fileDialog.showed = false"
          >Tanca</v-btn>
          <v-btn
            color="blue darken-1"
            text
            :disabled="fileDialog.loading"
            @click="submitFile"
          >Guarda</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dniDialog.showed" persistent max-width="500px">
      <v-card>
        <v-card-title class="primary--text">
          <span class="headline">Enviar enllaç de matrícula</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="dniDialog.processName"
            label="Convocatòria"
            readonly
          ></v-text-field>
          <v-text-field
            v-model="dniDialog.dniAlumn"
            :rules="[rules.required, rules.dni]"
            label="Dni de l'alumne"
            required
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            :disabled="dniDialog.loading"
            @click="dniDialog.showed = false"
          >Tanca</v-btn>
          <v-btn
            color="blue darken-1"
            text
            :disabled="dniDialog.loading || !dniDialog.dniAlumn"
            @click="sendLink"
          >Enviar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
const TIMEOUT = 15000;

import API from "@/services/api";

import headers from "@/lib/headers";

export default {
  data() {
    return {
      search: "",
      headers: headers.processes,
      messages: [],
      dialog: {
        showed: false,
        item: {}
      },
      fileDialog: {
        showed: false,
        loading: false
      },
      dniDialog: {
        showed: false,
        loading: false,
        dniAlumn: "",
        processCode: ""
      },
      rules: {
          required: value => !!value || 'Camp obligatori',
          counter: value => value.length <= 20 || 'Max 20 caracters',
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(value) || 'Invalid e-mail.';
          },
          dni: value => {
            const pattern = /^([A-Z]|[0-9]){2}[0-9]{7}[A-Z]$/
            return pattern.test(value) || 'Dni invàlid'
          },
      },
    }
  },
  mounted() {
    this.getData();
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
      let process = Object.assign({}, this.dialog.item);
      if (typeof process.start_date === "string") {
        process.start_date = process.start_date + " 00:00:00";
      }
      if (typeof process.end_date === "string") {
        process.end_date = process.end_date + " 23:59:59";
      }
      this.$store
        .dispatch("saveProcess", process)
        .then(response => {
          this.dialog.showed = false;
          this.messages.push({
            msg: "Guardada la convocatòria amb id " + response.id,
            type: "success",
            show: true
          });
        })
        .catch(err => {
          this.dialog.showed = false;
          this.manageError(err, "Error saving process", "error");
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
        this.dialog.item.start_date = "";
        this.dialog.item.end_date = "";
      }
      this.dialog.showed = true;
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
    deleteProcess(item) {
      if (
        confirm('Segur que vols eliminar la convocatòria "' + item.name + '"?')
      ) {
        this.$store
          .dispatch("delProcess", item)
          .then(() => {
            this.messages.push({
              msg: "Eliminada la convocatòria " + item.id,
              type: "success",
              show: true
            });
          })
          .catch(err => {
            this.dialog.showed = false;
            this.manageError(err, "Error saving process", "error");
          });
      }
    },
    openFileDialog(item) {
      this.fileDialog.file = null;
      this.fileDialog.loading = false;
      this.fileDialog.process = item;
      this.fileDialog.showed = true;
    },
    openDniDialog(item) {
      this.dniDialog.dniAlumn = "";
      this.dniDialog.processCode = item.code;
      this.dniDialog.processName = item.name;
      this.dniDialog.loading = false;
      this.dniDialog.showed = true;
    },
    submitFile() {
      if (this.fileDialog.file) {
        this.fileDialog.loading = true;
        let dialogClearer = setTimeout(() => {
          alert("Temps d'espera esgotat");
          this.fileDialog.loading = false;
        }, TIMEOUT);
        let formData = new FormData();
        formData.append(
          this.fileDialog.field,
          this.fileDialog.file,
          this.fileDialog.file.name
        );
        API.process
          .submitFile(this.user.id, formData)
          .then(response => {
            clearTimeout(dialogClearer);
            this.fileDialog.showed = false;
            alert("msg ok + cambiar fichero");
            console.log(response);
          })
          .catch(err => {
            clearTimeout(dialogClearer);
            this.fileDialog.loading = false;
            this.messages.push({
              msg: "Error uploading file - " + err.response.data.error,
              type: "error",
              show: true
            });
          });
      } else {
        alert("No has seleccionat cap fitxer");
      }
    },
    sendLink() {
      alert("Se enviará...");
    }
  }
};
</script>