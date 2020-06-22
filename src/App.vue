<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="CIP FP Batoi"
          class="shrink mr-2"
          contain
          src="@/assets/logoBatoi.png"
          transition="scale-transition"
          width="70"
        />
        <h1>CIP FP Batoi - Automatrícula 2020-21</h1>
      </div>

      <v-spacer></v-spacer>
      <v-btn v-if="logged" class="primary" @click="logout">Logout</v-btn>
      <v-btn v-else class="primary" to="/login">Login</v-btn>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
  computed: {
    logged() {
      return this.$store.getters.getToken;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/login");
    }
  }
};
</script>
