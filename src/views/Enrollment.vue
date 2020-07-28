<template>
  <v-container fluid class="grey lighten-5">
    <v-card>
      <v-row justify="center" v-for="(message, i) in messages" :key="i">
        <v-alert v-model="message.show" :type="message.type" dismissible>{{ message.msg }}</v-alert>
      </v-row>
      <v-card-title>
        {{ alumn }}
        <v-spacer></v-spacer>
        <v-btn v-if="item.type==2"
          color="warning" 
          @click="resetPsw"
        >Reset password</v-btn>
      </v-card-title>
      <v-card-subtitle>Matrícula</v-card-subtitle>

      <v-card-text>
        <v-row>
          <v-col cols="12" sm="2">
            <v-text-field v-model="item.id" label="Id" readonly></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field v-model="item.type" label="Tipo" readonly></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-select
              v-model="item.status"
              :items="statusForChange"
              item-text="name"
              item-value="id"
              label="Estat"
              readonly
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field v-model="item.student.name" label="Nom" readonly></v-text-field>
          </v-col>
          <v-col cols="12" sm="8">
            <v-text-field v-model="item.student.surname" label="Cognoms" readonly></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="2">
            <v-text-field v-model="item.student.nia" label="NIA" readonly></v-text-field>
          </v-col>
          <v-col cols="12" sm="2">
            <v-text-field v-model="item.student.dni" label="Nif" readonly></v-text-field>
          </v-col>
          <v-col cols="12" sm="2">
            <v-text-field :value="showDate(item.student.birthday)" label="Data naixem." readonly></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="item.student.email" label="email" readonly></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field v-model="item.process.name" label="Convocatòria" readonly></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field v-model="item.course.name" label="Cicle" readonly></v-text-field>
          </v-col>
          <v-col cols="12" sm="2">
            <v-text-field v-model="item.school_year" label="Curs" readonly></v-text-field>
          </v-col>
          <v-col cols="12" sm="2">
            <v-text-field v-model="item.from_school_year" label="Curs anterior" readonly></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="2">
            <v-switch v-model="item.promote" :label="`${toSiNo(item.promote)} promociona`" readonly></v-switch>
          </v-col>
          <v-col cols="12" sm="3">
            <v-switch
              v-model="item.assistance_condition_accept"
              :label="`${toSiNo(item.assistance_condition_accept)} accepta condicions`"
              readonly
            ></v-switch>
          </v-col>
          <v-col cols="12" sm="3">
            <v-switch
              v-model="item.image_right_accept"
              :label="`${toSiNo(item.image_right_accept)} accepta drets d'imatge`"
              readonly
            ></v-switch>
          </v-col>
          <v-col cols="12" sm="2">
            <div color="primary">
              Taxes:
              <a
                v-if="item.fee_receipt_filename"
                :href="item.fee_receipt_filename"
                :title="item.fee_receipt_filename"
                target="_blank"
              >
                <v-icon large>mdi-file-check-outline</v-icon>
              </a>
              <v-btn small color="warning" @click="openDialog('fee')">Canviar</v-btn>
            </div>
          </v-col>
          <v-col cols="12" sm="2">
            <div color="primary">
              Segur:
          <v-icon large
            v-if="isCardPayment(item.insurance_payment_type)"
            class="mr-2"
            :title="item.last_payment.operation_id"
          >mdi-credit-card</v-icon>
          <template v-else>
            <a v-if="item.insurance_receipt_filename"
              :href="item.insurance_receipt_filename"
              :title="item.insurance_receipt_filename"
              target="_blank"
            >
              <v-icon large class="mr-2">mdi-file-check-outline</v-icon>
            </a>
            <v-btn small color="warning" @click="openDialog('insurance')">Canviar</v-btn>
          </template>
            </div>
          </v-col>
        </v-row>
        <v-row v-if="item.type===2">
          <v-col cols="12" sm="2">
            <v-switch
              v-model="item.reserved_places"
              :label="`${toSiNo(item.assistance_condition_accept)} plaça reservada`"
              readonly
            ></v-switch>
          </v-col>
          <v-col cols="12" sm="3">
            <v-switch
              v-model="item.web_family_accept"
              :label="`${toSiNo(item.assistance_condition_accept)} accepta Web Family`"
              readonly
            ></v-switch>
          </v-col>
          <v-col cols="12" sm="7">
            <fieldset>
              <legend>Altres documents</legend>
            <span v-for="doc in item.documents" :key="doc.id" color="primary">
              <a :href="doc.filename" target="_blank">
                <v-icon large>{{ docTypeInfo(doc.type).icon }}</v-icon>
                {{ docTypeInfo(doc.type).name }}
              </a>
            </span>

            </fieldset>

          </v-col>

        </v-row>

        <fieldset v-if="isCardPayment(item.insurance_payment_type)">
          <legend>Dades del pagament amb targeta</legend>
          <v-row>
            <v-col cols="12" sm="5">
              <v-text-field v-model="item.last_payment.operation_id" label="Codi operació" readonly></v-text-field>
            </v-col>
            <v-col cols="12" sm="5">
              <v-text-field
                v-model="item.last_payment.provider_reference"
                label="Referència"
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="2">
              <v-text-field v-model="item.last_payment.prize" label="Import (€)" readonly></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="5">
              <v-text-field v-model="item.last_payment.description" label="Descripció" readonly></v-text-field>
            </v-col>
            <v-col cols="12" sm="2">
              <v-text-field v-model="item.last_payment.status" label="Estat" readonly></v-text-field>
            </v-col>
            <v-col cols="12" sm="5">
              <v-text-field :value="showDateTime(item.student.birthday)" label="Data" readonly></v-text-field>
            </v-col>
          </v-row>
        </fieldset>

        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field :value="showDateTime(item.created_on)" label="Data creació" readonly></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field :value="showDateTime(item.presented_on)" label="Data present." readonly></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field v-model="item.presented_times" label="Vegades presentada" readonly></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="$router.go(-1)">Tornar</v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="fileDialog.showed" persistent max-width="500px">
      <v-card>
        <v-card-title class="primary--text">
          <span class="headline">{{ fileDialog.title }}</span>
        </v-card-title>
        <v-card-text>
          <v-alert type="error">ATENCIÓ: quan li dones a 'GUARDAR' el fitxer que puges sobreescriurà l'actual, que no podrà ser recuperat de cap manera !!!</v-alert>
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
  </v-container>
</template>

<script>
const TIMEOUT = 15000;

import API from "@/services/api"; 

export default {
  name: "Enrollment",
  props: ["id"],
  data() {
    return {
      messages: [],
      fileFee: null,
      fileDialog: {
        showed: false,
        loading: false
      }
    };
  },
  computed: {
    item() {
      return this.$route.params.item;
    },
    alumn() {
      return `${this.$route.params.item.student.surname},  ${this.$route.params.item.student.name}`;
    },
    statusForChange() {
      return this.$store.getters.getSelectableStatus;
    }
  },
  methods: {
    isCardPayment(type) {
      return this.$store.getters.isCardPayment(type);
    },
    showDate(date) {
      return date ? new Date(date).toLocaleDateString() : "---";
    },
    showDateTime(date) {
      return date ? new Date(date).toLocaleString() : "---";
    },
    toSiNo(value) {
      return value ? "Sí" : "No";
    },
    docTypeInfo(type) {
      return this.$store.getters.getDocTypeInfo(type);
    },
    openDialog(type) {
      this.fileDialog.file = null;
      this.fileDialog.loading = false;
      switch (type) {
        case "fee":
          this.fileDialog.title = "Canvia fitxer de Taxes";
          this.fileDialog.field = "fee_receipt_file";
          break;
        case "insurance":
          this.fileDialog.title = "Canvia fitxer de Segur";
          this.fileDialog.field = "insurance_receipt_file";
          break;
      }
      this.fileDialog.showed = true;
    },
    resetPsw() {
          API.users.resetPsw(this.item)
            .then(response => {
              this.messages.push({
                msg: `S'ha resetejat correctament la contrasenya de l'usuari "${response.data.data.student.name}"`,
                type: "success",
                show: true
              });
            })
            .catch(err =>
              this.messages.push({
                msg: "Error resetting password - " + err.response.data.error,
                type: "error",
                show: true
              })
            );
    },
    submitFile() {
      if (this.fileDialog.file) {
        this.fileDialog.loading = true;
        let dialogClearer = setTimeout(() => {
          alert("Temps d'espera esgotat");
          this.fileDialog.loading = false;
        }, TIMEOUT);
        let formData = new FormData();
        formData.append(this.fileDialog.field, this.fileDialog.file, this.fileDialog.file.name)
        API.processes.submitFile(this.item.id, formData)
        .then((response) => {
          clearTimeout(dialogClearer);
          this.fileDialog.showed = false;
              this.messages.push({
                msg: "Fitxer pujat correctament",
                type: "success",
                show: true
              })
          this.item[this.fileDialog.field + 'name'] = response.data.data[this.fileDialog.field + 'name'];
        })
        .catch((err) => {
          clearTimeout(dialogClearer);
          this.fileDialog.loading = false;
              this.messages.push({
                msg: "Error uploading file - " + err.response.data.error,
                type: "error",
                show: true
              })
        })
      } else {
        alert('No has seleccionat cap fitxer');
      }
    }
  }
};
</script>

<style scoped>
fieldset {
  padding: 10px;
}
</style>
