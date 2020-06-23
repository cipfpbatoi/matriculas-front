<template>
  <v-container fluid class="grey lighten-5">
  <v-card>
    <v-row justify="center" v-for="(error, i) in errors" :key="i">
      <v-alert v-model="error.show" :type="error.type" dismissible>{{ error.msg }}</v-alert>
    </v-row>
    <v-card-title justify="center">
      <h2>{{ tableTitle }}</h2>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search.general"
        append-icon="mdi-magnify"
        label="Cerca"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-card-text>
      <v-row  class="filters" align="center">
        <span><strong>Filtrar per: </strong></span>
      <v-spacer></v-spacer>
          <v-select
              v-model="search.status"
            :items="status"
              item-text="name"
              item-value="id"
            label="Estat">
          </v-select>
      <v-spacer></v-spacer>
          <v-select
              v-model="search.course"
              :items="courses"
              item-text="name"
              item-value="id"
            label="Cicle">
          </v-select>
      <v-spacer></v-spacer>
          <v-select
              v-model="search.schoolYear"
              :items="schoolYears"
            label="Curs">
          </v-select>
      </v-row>
    </v-card-text>
    <v-data-table
      v-model="selected"
      show-select
      item-key="id"
      :headers="headers"
      :items="items"
      :search="search.general"
      :loading="loading"
      loading-text="Carregant dades... Espere per favor"
      show-expand
      single-expand
    >

      <template v-slot:item.presented_on="{ item }">
        <span>{{ showDate(item.presented_on) }}</span>
      </template>
      <template v-slot:item.status="{ item }">
        <span>{{ stateName(item.status) }}</span>
      </template>
      <template v-slot:item.promote="{ item }">
            <v-icon  
              :class="(item.promote?'success':'error')+'--text'"
            >{{ item.promote?'mdi-check':'mdi-window-close' }}
            </v-icon>
      </template>
      <template v-slot:item.fee_receipt_filename="{ item }">
        <a v-if="item.fee_receipt_filename" :href="item.fee_receipt_filename" target="_blank">
          <v-icon class="mr-2">mdi-file-check-outline</v-icon>
        </a>
      </template>
      <template v-slot:item.insurance_receipt_filename="{ item }">
        <a
          v-if="item.insurance_receipt_filename"
          :href="item.insurance_receipt_filename"
          target="_blank"
        >
          <v-icon class="mr-2">mdi-file-check-outline</v-icon>
        </a>
      </template>

      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <v-row>
            <v-col cols="12" sm="6">
              <strong class="primary--text">e-mail:</strong>
              {{ item.email }}
              <br />
              <strong class="primary--text">Data de naixement:</strong>
              {{ showDate(item.birthday) }}
              <br />
              <strong class="primary--text">Promociona:</strong>
            <v-icon small 
              :class="(item.promote?'sucess':'error')+'--text'"
            >{{ item.promote?'mdi-check':'mdi-window-close' }}
            </v-icon>
              <br />
              <strong class="primary--text">Vegades presentat:</strong>
              {{ item.presented_times }}
            </v-col>
            <v-col cols="12" sm="6">
              <strong class="primary--text">Accepta assistència:</strong>
            <v-icon small 
              :class="(item.assistance_condition_accept?'sucess':'error')+'--text'"
            >{{ item.assistance_condition_accept?'mdi-check':'mdi-window-close' }}
            </v-icon>
              <br />
              <strong class="primary--text">Accepta drets d'imatge:</strong>
            <v-icon small 
              :class="(item.image_right_accept?'sucess':'error')+'--text'"
            >{{ item.image_right_accept?'mdi-check':'mdi-window-close' }}
            </v-icon>
              <br />
              <strong class="primary--text">Data de creació:</strong>
              {{ showDateTime(item.created_on) }}
              <br />
              <strong class="primary--text">Tipus matrícula:</strong>
              {{ item.process.name }}
            </v-col>
          </v-row>
        </td>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon
          title="Canviar estat"
          class="primary--text"
          @click="openDialog(item)"
        >mdi-checkbox-multiple-marked</v-icon>
      </template>
    </v-data-table>

 </v-card>
    <v-dialog v-model="dialog.showed" persistent max-width="400px">
      <v-card>
        <v-card-title class="primary--text">
          <span class="headline">Canviar estat</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <p>
              Indica el nou estat per a l'alumne
              <strong>{{ dialog.item.name }}</strong>
            </p>
            <v-select
              v-model="dialog.item.status"
              :items="statusForChange"
              item-text="name"
              item-value="id"
              label="Nou estat"
              required
            ></v-select>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog.showed = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="canviaEstat">Canvia</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
 
    <v-dialog v-model="dialogProces" persistent max-width="400px">
      <v-card>
        <v-card-title class="primary--text">
          <span class="headline">Tria convocatòria</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <p>
              Indica de quina convocatòria vols vore les matrícules
            </p>
            <v-select
              v-model="search.proces"
              :items="processes"
              item-text="name"
              item-value="id"
              label="Convocatòria"
              required
            ></v-select>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="showData">Mostra</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>


<script>
import API from "@/services/api";
import headers from '@/lib/headers'

const ID_INICIADO = 1     // Para filtrar los estados como este o inferiores
const TOTS_CURSOS = '- Tots -'    // El valor de no filtrar por curso

export default {
  props: ['process'],
  data() {
    return {
      search: {
        course: '',
        schoolYear: TOTS_CURSOS,
        status: '',
        process: '',
        general: ''
      },
      items: [],
      selected: [],
      loading: true,
      expanded: [],
      headers: headers.enrollments,
      errors: [],
      dialog: {
        showed: false,
        item: {}
      },
      dialogProces: false,
    };
  },
  watch: {
    search: {
      handler() {
        this.getEnrollments();
      },
      deep: true
    },
    process() {
      this.getEnrollments();
    }
  },
  mounted() {
    this.getData();
  },
  computed: {
    tableTitle() {
      return this.process
        ? this.processes.find(item => item.id == this.process).name
        : 'Totes les convocatòries'
    },
    statusForChange() {
      return this.status.filter(item => item.id > ID_INICIADO)
    },
    status() {
      return [{id: '', name: '- Tots -'}].concat(this.$store.getters.getStatus);
    },
    statusNames() {
      return this.status.map(item => item.name);
    },
    courses() {
      return [{id: '', name: '- Tots -'}].concat(this.$store.getters.getCourses);
    },
    schoolYears() {
      return ['- Tots -'].concat(this.$store.getters.getSchoolYears);
    },
    processes() {
      return [{id: '', name: '- Totes -'}].concat(this.$store.getters.getProcesses);
    },
  },
  methods: {
    getData() {
      // Load the status if not loaded
      this.$store
        .dispatch("loadData")
        .then()
        .catch(err =>
          this.errors.push({
            msg: "Error loading status - " + err,
            type: "error",
            show: true
          })
        );
    },
    showData() {
      this.dialogProces = false;
      this.getEnrollments();
    },
    getEnrollments() {
      // and load de enrollments
      let filters = [];
      if (this.process) filters.push('process='+this.process);
      if (this.search.status) filters.push('status='+this.search.status);
      if (this.search.course) filters.push('course='+this.search.course);
      if (this.search.schoolYear && this.search.schoolYear !== TOTS_CURSOS) filters.push('school_year='+this.search.schoolYear);
      if (this.search.general) filters.push('search='+this.search.general);
      API.enrollments
        .getAll(filters.join('&'))
        .then(response => {
          this.loading = false;
          this.items = response.data.data.applications;
        })
        .catch(err => {
          this.loading = false;
          this.errors.push({
            msg: "Error loading enrollments - " + err,
            type: "error",
            show: true
          });
        });
    },
    stateName(state) {
      let stateObject = this.status.find(item => item.id == state);
      return stateObject ? stateObject.name : "";
    },
    showDate(date) {
      return date ? new Date(date).toLocaleDateString() : "---";
    },
    showDateTime(date) {
      return date ? new Date(date).toLocaleString() : "---";
    },
    openDialog(item) {
      this.dialog.item = {
        id: item.id,
        name: `${item.student.surname}, ${item.student.name}`,
        oldStatus: String(item.status),
        status: String(item.status)
      };
      this.dialog.showed = true;
    },
    canviaEstat() {
      this.dialog.showed = false;
      if (this.dialog.item.oldStatus === this.dialog.item.status) {
        this.errors.push({
          msg: `No has canviat l'estat de "${this.dialog.item.name}"`,
          type: "info",
          show: true
        });
        return;
      }
      API.enrollments
        .modifyStatus(this.dialog.item.id, this.dialog.item.status)
        .then(response => {
          let oldEnrollment = this.items.findIndex(item => item.id === this.dialog.item.id);
          this.items.splice(oldEnrollment, 1, response.data.data);
          this.errors.push({
            msg: `Canviat l'estat de "${response.data.data.student.surname}, ${response.data.data.student.name}"`,
            type: "success",
            show: true
          })
        })
        .catch(err =>
          this.errors.push({
            msg: "Error setting state - " + err,
            type: "error",
            show: true
          })
        );
    }
  }
};
</script> 

<style scoped>
tbody tr:nth-of-type(1) {
  background-color: rgba(0, 0, 0, 0.05);
}
.filters {
  border: 1px solid black;
  padding: 0px 10px;
}
</style>