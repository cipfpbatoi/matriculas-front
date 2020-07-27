<template>
  <v-container fluid class="grey lighten-5">
    <v-card>
      <v-row justify="center" v-for="(message, i) in messages" :key="i">
        <v-alert v-model="message.show" :type="message.type" dismissible>{{ message.msg }}</v-alert>
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
        <v-spacer></v-spacer>

        <v-btn>
          <v-icon title="Imprimir" @click="printData">mdi-printer</v-icon>
        </v-btn>
        <v-spacer></v-spacer>

        <v-btn align="rigth" @click="getEnrollments()">Recarregar les dades</v-btn>
      </v-card-title>
      <v-card-text>
        <v-row class="filters" align="center">
          <span>
            <strong>Filtrar per:</strong>
          </span>
          <v-spacer></v-spacer>
          <v-select
            v-model="search.status"
            :items="statusAll"
            item-text="name"
            item-value="id"
            label="Estat"
            clearable
          ></v-select>
          <v-spacer></v-spacer>
          <v-select
            v-model="search.course"
            :items="courses"
            item-text="name"
            item-value="id"
            label="Cicle"
            clearable
          ></v-select>
          <v-spacer></v-spacer>
          <v-select v-model="search.schoolYear" :items="schoolYears" label="Curs" clearable></v-select>
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
        disable-pagination
        hide-default-footer
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
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
          >{{ item.promote?'mdi-check':'mdi-window-close' }}</v-icon>
        </template>
        <template v-slot:item.fee_receipt_filename="{ item }">
          <a v-if="item.fee_receipt_filename" :href="item.fee_receipt_filename" target="_blank">
            <v-icon class="mr-2">mdi-file-check-outline</v-icon>
          </a>
        </template>
        <template v-slot:item.insurance_payment_type="{ item }">
          <v-icon
            v-if="isCardPayment(item.insurance_payment_type)"
            class="mr-2"
            :title="item.last_payment.operation_id"
          >mdi-credit-card</v-icon>
          <a
            v-else-if="item.insurance_receipt_filename"
            :href="item.insurance_receipt_filename"
            target="_blank"
          >
            <v-icon class="mr-2">mdi-file-check-outline</v-icon>
          </a>
        </template>

        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <v-row>
              <v-col cols="12" sm="4">
                <strong class="primary--text">e-mail:</strong>
                {{ item.student.email }}
                <br />
                <strong class="primary--text">Data de naixement:</strong>
                {{ showDate(item.birthday) }}
                <br />
                <strong class="primary--text">Promociona:</strong>
                <v-icon
                  small
                  :class="(item.promote?'sucess':'error')+'--text'"
                >{{ item.promote?'mdi-check':'mdi-window-close' }}</v-icon>
                <br />
                <strong class="primary--text">Vegades presentat:</strong>
                {{ item.presented_times }}
              </v-col>
              <v-col cols="12" sm="4">
                <strong class="primary--text">Accepta assistència:</strong>
                <v-icon
                  small
                  :class="(item.assistance_condition_accept?'sucess':'error')+'--text'"
                >{{ item.assistance_condition_accept?'mdi-check':'mdi-window-close' }}</v-icon>
                <br />
                <strong class="primary--text">Accepta drets d'imatge:</strong>
                <v-icon
                  small
                  :class="(item.image_right_accept?'sucess':'error')+'--text'"
                >{{ item.image_right_accept?'mdi-check':'mdi-window-close' }}</v-icon>
                <br />
                <strong class="primary--text">Data de creació:</strong>
                {{ showDateTime(item.created_on) }}
                <br />
                <strong class="primary--text">Tipus matrícula:</strong>
                {{ item.process.name }}
              </v-col>
              <v-col v-if="isCardPayment(item.insurance_payment_type)" cols="12" sm="4">
                <strong class="primary--text">Codi operació:</strong>
                {{ item.last_payment.operation_id }}
                <br />
                <strong class="primary--text">Import:</strong>
                {{ item.last_payment.prize }}
                <br />
                <strong class="primary--text">Estat operació:</strong>
                {{ paymentStatusName(item.last_payment.status) }}
                <br />
                <strong class="primary--text">Data:</strong>
                {{ showDateTime(item.last_payment.last_modified_on) }}
                <br />
              </v-col>
            </v-row>
          </td>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon
            title="Canviar estat"
            class="primary--text"
            @click="openStatusDialog(item)"
          >mdi-checkbox-multiple-marked</v-icon>
          <v-icon
            title="Veure detalls"
            class="primary--text"
            @click="viewEnrollment(item)"
          >mdi-eye</v-icon>
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
            @change="getEnrollments()"
          ></v-select>
        </v-col>
      </v-row>
    </v-card>

    <v-btn class="primary" @click="openStatusDialog()">Canviar estat als sel·leccionats</v-btn>

    <v-dialog v-model="statusDialog.showed" persistent max-width="400px">
      <v-card>
        <v-card-title class="primary--text">
          <span class="headline">Canviar estat</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <p>
              Indica el nou estat per a l'alumne
              <strong>{{ statusDialog.item.name }}</strong>
              <strong v-if="statusDialog.totalSelected > 1">i {{ statusDialog.totalSelected - 1 }} més</strong>
            </p>
            <v-select
              v-model="statusDialog.item.status"
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
          <v-btn color="blue darken-1" text @click="statusDialog.showed = false">Tanca</v-btn>
          <v-btn color="blue darken-1" text @click="canviaEstat">Canvia</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="generalDialog.showed" persistent max-width="400px">
      <v-card>
        <v-title>{{ generalDialog.title }}</v-title>
        <v-card-text>{{ generalDialog.message }}</v-card-text>
      </v-card>
    </v-dialog>

  </v-container>
</template>


<script>
import API from "@/services/api";
import headers from "@/lib/headers";

const DEFAULT_PAGE_SIZE = 25;

export default {
  props: ["process", "status"],
  data() {
    return {
      search: {
        course: "",
        schoolYear: "",
        status: "",
        process: "",
        general: ""
      },
      items: [],
      selected: [],
      loading: true,
      expanded: [],
      headers: headers.enrollments,
      messages: [],
      statusDialog: {
        showed: false,
        item: {},
        totalSelected: 0
      },
      generalDialog: {
        showed: false,
        title: '',
        message: ''
      },
      pagination: {
        page: 1,
        toPage: 0,
        more: false,
        pageSize: DEFAULT_PAGE_SIZE
      },
      sortDesc: false,
      sortBy: ""
    };
  },
  watch: {
    $route(to, from) {
      if (to === from) return;
      if (this.status) {
        this.search.status = Number(this.status);
      }
      this.getData();
      this.getEnrollments();
    },
    search: {
      handler() {
        this.pagination.page = 1; // tornem a vore la 1a pàgina
        this.getEnrollments();
      },
      deep: true
    },
    process() {
      this.pagination.page = 1; // tornem a vore la 1a pàgina
      this.getEnrollments();
    },
    sortBy() {
      this.pagination.page = 1; // tornem a vore la 1a pàgina
      this.getEnrollments();
    },
    sortDesc() {
      this.pagination.page = 1; // tornem a vore la 1a pàgina
      this.getEnrollments();
    }
  },
  mounted() {
    if (this.status) {
      this.search.status = Number(this.status);
    }
    this.getData();
    this.getEnrollments();
  },
  computed: {
    tableTitle() {
      if (!this.processes) {
        // No se han cargado los datos, debe volver a loguearse
        this.$store.dispatch('logout');
        return 'Totes les convocatòries';
      }
      return this.process
        ? this.processes.find(item => item.id == this.process).name
        : "Totes les convocatòries";
    },
    statusForChange() {
      return this.$store.getters.getSelectableStatus;
    },
    statusAll() {
      return this.$store.getters.getStatus;
    },
    courses() {
      return this.$store.getters.getCourses;
    },
    schoolYears() {
      return this.$store.getters.getSchoolYears;
    },
    processes() {
      return this.$store.getters.getProcesses;
    }
  },
  methods: {
    getData() {
      // Load the status if not loaded
      this.$store
        .dispatch("loadData")
        .then()
        .catch(err =>
          this.messages.push({
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
    getParams() {
      let filters = [];
      if (this.process) filters.push("process=" + this.process);
      if (this.search.status) filters.push("status=" + this.search.status);
      if (this.search.course) filters.push("course=" + this.search.course);
      if (this.search.schoolYear)
        filters.push("school_year=" + this.search.schoolYear);
      if (this.search.general) filters.push("search=" + this.search.general);
      if (this.pagination.more || this.pagination.page > 1) {
        if (this.pagination.toPage) {
          filters.push("page=" + (this.pagination.toPage));
          this.pagination.toPage = 0;
        } else {
          filters.push("page=" + (this.pagination.page));
        }
        filters.push("pageSize=" + this.pagination.pageSize);
        if (this.sortBy) filters.push("orderBy=" + this.apiName(this.sortBy));
        if (this.sortDesc) filters.push("order=DESC");
      }
      return filters;
    },
    managemessage(err, msg, type) {
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
    getEnrollments() {
      // load de enrollments
      this.loading = true;
      this.items = [];
      let filters = this.getParams();
      API.enrollments
        .getAll(filters.join("&"))
        .then(response => {
          this.loading = false;
          this.pagination.page = Number(response.data.data.page);
          this.pagination.more = response.data.data.more;
          this.pagination.pageSize = Number(response.data.data.page_size);
          this.items = response.data.data.items;
        })
        .catch(err => {
          this.loading = false;
          this.manageError(err, "Error loading enrollments", "error");
        });
    },
    stateName(state) {
      let stateObject = this.statusAll.find(item => item.id === state);
      return stateObject ? stateObject.name : "";
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
    showDate(date) {
      return date ? new Date(date).toLocaleDateString() : "---";
    },
    showDateTime(date) {
      return date ? new Date(date).toLocaleString() : "---";
    },
    isCardPayment(type) {
      return this.$store.getters.isCardPayment(type);
    },
    paymentStatusName(id) {
      return this.$store.getters.getPaymentStatus(id).name;
    },
    prevPage() {
      this.pagination.toPage = this.pagination.page - 1;
      this.getEnrollments();
    },
    nextPage() {
      this.pagination.toPage = this.pagination.page + 1;
      this.getEnrollments();
    },
    firstPage() {
      this.pagination.toPage = 1;
      this.getEnrollments();
    },
    printData() {
      // Comprobamos que se selecciona process y course
      if (!this.process || !this.search.course) {
        this.messages.push({
          msg: "Has de filtrar al menys per convocatòria i cicle",
          type: "error",
          show: true
        });
        return;
      }
      let filters = this.getParams(0);

      var xhr = new XMLHttpRequest();
      xhr.open(
        "GET",
        "https://matricula.cipfpbatoi.es/api" +
          "/report/application?" +
          filters.join("&"),
        true
      );
      xhr.setRequestHeader("Authorization", "Bearer " + localStorage.token);
      xhr.responseType = "blob";
      let that = this;
      xhr.onload = function() {
        if (this.status === 200) {
          that.closeGeneralDialog(dialogId);
          var blob = new Blob([this.response], { type: "application/pdf" });
          var link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = "report.pdf";
          link.click();
        } else {
          that.closeGeneralDialog(dialogId);
          that.messages.push({
            msg: 'Error generating PDF - ' + this.statusText,
            type: "error",
            show: true
          });
        }
      };

      xhr.send();
      let dialogId = this.openGeneralDialog('Generant informe','Per favor... espere', 10);
      // API.enrollments
      //   .getReport(filters.join("&"))
      //   .then(response => {
      //     console.log(response)
      //            let file = new Blob([response.data], {type: 'application/pdf'});
      //  let fileURL = URL.createObjectURL(file);
      //  window.open(fileURL);
      //  var link = document.createElement('a');
      //   link.href = fileURL; // window.URL.createObjectURL(blob);
      //   link.download = "report.pdf";
      //   link.click();
      //   })
      //   .catch(err => {
      //     this.manageError(err, "Error generating PDF", 'error');
      //   });
    },
    openGeneralDialog(title, message, seconds) {
      this.generalDialog.title = title;
      this.generalDialog.message = message;
      this.generalDialog.showed = true;
      return setTimeout(() => this.closeGeneralDialog(), seconds * 1000);
    },
    closeGeneralDialog(id) {
      if (id) {
        clearInterval(id);
      } else {
          this.messages.push({
            msg: 'Error generating PDF - El servidor està tardant massa temps en respondre',
            type: "error",
            show: true
          });
      }
      this.generalDialog.title = '';
      this.generalDialog.message = '';
      this.generalDialog.showed = false;
    },
    openStatusDialog(item) {
      if (item) {
        // Es canvia 1 registre
        this.statusDialog.item = {
          id: item.id,
          name: `${item.student.surname}, ${item.student.name}`,
          oldStatus: String(item.status),
          status: String(item.status)
        };
        this.statusDialog.totalSelected = 1;
      } else {
        // Es canvien tots els seleccionats
        if (this.selected.length) {
          this.statusDialog.item = {
            id: this.selected[0].id,
            name: `${this.selected[0].student.surname}, ${this.selected[0].student.name}`,
            oldStatus: "",
            status: ""
          };
          this.statusDialog.totalSelected = this.selected.length;
        } else {
          this.messages.push({
            msg: "No hi ha cap registre sel·leccionat",
            type: "info",
            show: true
          });
          return;
        }
      }
      this.statusDialog.showed = true;
    },
    canviaEstat() {
      this.statusDialog.showed = false;
      if (this.statusDialog.totalSelected === 1) {
        if (this.statusDialog.item.oldStatus === this.statusDialog.item.status) {
          this.messages.push({
            msg: `No has canviat l'estat de "${this.statusDialog.item.name}"`,
            type: "info",
            show: true
          });
        } else {
          API.enrollments
            .modifyStatus(this.statusDialog.item.id, this.statusDialog.item.status)
            .then(response => {
              let oldEnrollment = this.items.findIndex(
                item => item.id === this.statusDialog.item.id
              );
              this.items.splice(oldEnrollment, 1, response.data.data);
              this.messages.push({
                msg: `Canviat l'estat de "${response.data.data.student.surname}, ${response.data.data.student.name}"`,
                type: "success",
                show: true
              });
            })
            .catch(err =>
              this.messages.push({
                msg: "Error setting state - " + err.response.data.error,
                type: "error",
                show: true
              })
            );
        }
      } else {
        // se cambian varios estados
        let stateChangePromises = [];
        this.selected.forEach(item =>
          stateChangePromises.push(
            API.enrollments.modifyStatus(item.id, this.statusDialog.item.status)
          )
        );
        if (stateChangePromises.length) {
          Promise.all(stateChangePromises)
            .then(values => {
              let firstAlumn =
                values[0].data.data.student.surname +
                ", " +
                values[0].data.data.student.name;
              this.messages.push({
                msg: `Canviat l'estat de "${firstAlumn}" i de altres ${values.length -
                  1}"`,
                type: "success",
                show: true
              });
            })
            .catch(err =>
              this.messages.push({
                msg: "Error setting state - " + err.response.data.error,
                type: "error",
                show: true
              })
            );
        } else {
          this.messages.push({
            msg: "No has seleccionado ningún alumno",
            type: "info",
            show: true
          });
        }
      }
    },
    viewEnrollment(item) {
//      this.$router.push('/enrollment/'+item.id);
      this.$router.push({ name: 'enrollment', params: { id: item.id, item } });
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