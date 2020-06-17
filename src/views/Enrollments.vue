<template>
  <v-card>
    <v-row justify="center" v-for="(error, i) in errors" :key="i">
      <v-alert 
        v-model="error.show" 
        :type="error.type" 
        dismissible
      >{{ error.msg }}</v-alert>
    </v-row>
    <v-card-title>
      <span>Matrícules</span>
    </v-card-title>
    <v-data-table
      v-model="selected"
      show-select
      item-key="id"
      :headers="headers"
      :items="items"
      :search="search"
      :custom-filter="filterData"
      :loading="loading" 
      loading-text="Carregant dades... Espere per favor"
      show-expand
    >
      <template v-slot:body.prepend>
        <tr>
          <td>Filtrar: </td>
          <td colspan="4">
            <v-text-field size="5"
              v-model="search"
              append-icon="mdi-magnify"
              label="Cerca"
              single-line
              hide-details
            ></v-text-field>
          </td>
          <td>
            <v-text-field v-model="searchStatus" type="text" size="3" label="Estat"></v-text-field>
          </td>
          <td></td>
          <td>
            <v-text-field v-model="searchConvocatoria" type="text" size="3" label="Convocatòria"></v-text-field>
          </td>
          <td>
            <v-text-field v-model="searchCicle" type="text" size="5" label="Cicle"></v-text-field>
          </td>
          <td>
            <v-text-field v-model="searchCourse" type="text" size="3" label="Curs"></v-text-field>
          </td>
          <td colspan="3">
            <v-btn color="primary">Llevar filtres</v-btn>
          </td>
        </tr>
      </template>

      <template v-slot:item.presented_on="{ item }">
        <span>{{ showDate(item.presented_on) }}</span>
      </template>
      <template v-slot:item.status="{ item }">
        <span>{{ stateName(item.status) }}</span>
      </template>
      <template v-slot:item.process.id="{ item }">
        <span :title="item.process.name">{{ item.process.id }}</span>
      </template>
      <template v-slot:item.fee_receipt_filename="{ item }">
        <a v-if="item.fee_receipt_filename"
          :href="item.fee_receipt_filename" target="_blank">
          <v-icon
            class="mr-2"
          >
            mdi-file-check-outline
          </v-icon>
        </a>
      </template>
      <template v-slot:item.insurance_receipt_filename="{ item }">
        <a v-if="item.insurance_receipt_filename"
          :href="item.insurance_receipt_filename" target="_blank">
          <v-icon
            class="mr-2"
          >
            mdi-file-check-outline
          </v-icon>
        </a>
      </template>

      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <v-row>
            <v-col cols="12" sm="6">
              <strong class="primary--text">e-mail: </strong>{{ item.email }}
              <br /><strong class="primary--text">Data de naixement: </strong>{{ showDate(item.birthday) }}
              <br /><strong class="primary--text">Promociona: </strong>{{ item.promote }}
              <br /><strong class="primary--text">Accepta assistència: </strong>{{ item.assistance_condition_accept }}
              <br /><strong class="primary--text">Accepta drets d'imatge: </strong>{{ item.image_right_accept }}
            </v-col>
            <v-col cols="12" sm="6">
              <strong class="primary--text">Vegades presentat: </strong>{{ item.presented_times }}
              <br /><strong class="primary--text">Data de creació: </strong>{{ showDateTime(item.created_on) }}
              <br /><strong class="primary--text">Tipus matrícula: </strong>{{ item.process.name }}
              <br /><strong class="primary--text">Data inici: </strong>{{ showDateTime(item.process.start_date) }}
              <br /><strong class="primary--text">Data fi: </strong>{{ showDateTime(item.process.end_date) }}
            </v-col>
          </v-row>
        </td>
      </template>

    <template v-slot:item.actions="{ item }">
      <v-icon title="Canviar estat" class="primary--text"
        @click="openDialog(item)"
      >
        mdi-checkbox-multiple-marked
      </v-icon>
    </template>
    
    </v-data-table>
        
    <v-dialog v-model="dialog.showed" persistent max-width="400px">
      <v-card>
        <v-card-title class="primary--text">
          <span class="headline">Canviar estat</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <p>Indica el nou estat per a l'alumne <strong>{{ dialog.item.name }}</strong></p>
                <v-select v-model="dialog.item.statusName"
                  :items="statusName"
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
  </v-card>
</template>


<script>
  import API from '@/services/api';
  import headers from '@/lib/headers'
  export default {
    data () {
      return {
        searchCourse: '',
        searchCicle: '',
        searchStatus: '',
        searchConvocatoria: '',
        search: '',
        items: [],
        selected: [],
        loading: true,
        expanded: [],
        headers: headers.enrollments,  
        errors: [],
        dialog: {
          showed: false,
          item: {},
        }
      }
    },
    mounted() {
      this.getData();
      this.setFilters();
    },
    computed: {
      status() {
        return this.$store.getters.getStatus || [];
      },
      statusName() {
        return this.status.map(item => item.name);
      },
      courses() {
        return this.$store.getters.getCourses;
      }
    },
    methods: {
      getData() {
        // Load the status if not loaded
        this.$store.dispatch('loadData')
        .then()
        .catch(err => this.errors.push({
          msg: 'Error loading status - ' + err,
          type: 'error',
          show: true,
        }))
        // and load de enrollments
        API.enrollments.getAll()
        .then(response => {
          this.loading = false;
          this.items = response.data.data;
        })
        .catch(err => {
          this.loading = false;
          this.errors.push({
            msg: 'Error loading enrollments - ' + err,
            type: 'error',
            show: true,
          })
        })
      },
      filterData(value, search) {
        return value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().toLocaleUpperCase().indexOf(search.toLocaleUpperCase()) !== -1
      },
      setFilters() {
        let that = this;
        this.headers.find(item => item.text === 'Cicle').filter = (value) => {
          if (!that.searchCicle) return true;
          return that.searchCicle.indexOf(value.toLocaleUpperCase()) !== -1;
        }
        this.headers.find(item => item.text === 'Matr.').filter = (value) => {
          if (!that.searchConvocatoria) return true;
          return value < Number(that.searchConvocatoria);
        }
      },
      stateName(state) {
        return this.status.find(item => item.id === state).name;
      },
      showDate(date) {
        return date ? new Date(date).toLocaleDateString() : '---';
      },
      showDateTime(date) {
        return date ? new Date(date).toLocaleString() : '---';
      },
      openDialog(item) {
        this.dialog.item = {
          id: item.id,  
          name: `${item.student.surname}, ${item.student.name}`,
          statusName: this.stateName(item.status),
        }
        this.dialog.showed = true;
      },
      canviaEstat() {
        let newState = this.dialog.item.statusName;
        let stateId = this.status.find(item => item.name === newState).id;
        this.dialog.showed = false;
        API.status.modify(this.dialog.item.id, stateId)
        .then((response) => this.errors.push({
          msg: `Canviat l'estat de "${response.student.surname}, ${response.student.name}"`,
          type: 'success',
          show: true,
        }))
        .catch(err => this.errors.push({
          msg: 'Error setting state - ' + err,
          type: 'error',
          show: true,
        }))
      }
    }
  }
</script> 

<style scoped>
tbody tr:nth-of-type(4n+3) {
   background-color: rgba(0, 0, 0, .05);
 }
</style>