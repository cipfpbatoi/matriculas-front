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

        <v-btn align="rigth" @click="getProcesses()">Recarregar les dades</v-btn>
      </v-card-title>

      <v-data-table
        item-key="id"
        :headers="headers"
        :items="items"
        :search="search"
        :loading="loading"
        loading-text="Carregant dades... Espere per favor"
      >
        <template v-slot:item.presented_on="{ item }">
          <span>{{ showDate(item.presented_on) }}</span>
        </template>
        <template v-slot:item.status="{ item }">
          <span>{{ stateName(item.status) }}</span>
        </template>

      </v-data-table>

    </v-card>

  </v-container>  
</template>

<script>
import API from "@/services/api";
import headers from "@/lib/headers";

const DEFAULT_SIZE_PAGE = 25;
// const INSURANZE_TRANS_PAY = 1;
const INSURANZE_CARD_PAY = 2;

export default {
  data() {
    return {
      search: '',
      items: [],
      loading: true,
      headers: headers.enrollments,
      errors: [],
      statusDialog: {
        showed: false,
        item: {},
        totalSelected: 0
      },
    };
  },
}
</script>