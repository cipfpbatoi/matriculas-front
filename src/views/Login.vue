<template>
  <v-container fluid class="grey lighten-5">
    <v-row justify="center" v-for="(error, i) in errors" :key="i">
      <v-alert v-model="error.show" :type="error.type" dismissible>{{ error.msg }}</v-alert>
    </v-row>

    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="validateForm">
      <v-card class="mx-auto" max-width="400" :loading="sending">
        <v-card-title>
          <span>Login</span>
        </v-card-title>
        <v-row justify="center">
          <v-col cols="11">
            <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>

            <v-text-field
              v-model="password"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show ? 'text' : 'password'"
              @click:append="show = !show"
              :rules="passwordRules"
              label="Contrasenya"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-btn type="submit" :disabled="!valid || sending" color="primary" class="mr-4">Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>


<script>
export default {
  props: ["redirectTo"],
  data: () => ({
    sending: false,
    password: "",
    passwordRules: [v => !!v || "Password is required"],
    email: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    errors: [],
    valid: true,
    show: false
  }),

  computed: {
    logged() {
      return this.$store.getters.getToken;
    }
  },
  mounted() {
    if (this.logged) {
      alert("Ja estas loguejat");
      this.$router.push("/");
    }
    if (this.$route.params.msg) {
      this.errors.push({
        msg: this.$route.params.msg,
        type: "info",
        show: true
      });
    }
  },

  methods: {
    async validateForm() {
      this.$refs.form.validate();
      if (this.valid) {
        this.sending = true;

        try {
          const resp = await this.$store.dispatch("login", {
            username: this.email,
            password: this.password
          });
          this.sending = false;
          this.email = this.password = "";
          console.log(resp);

          if (this.redirectTo) {
            this.$router.push(this.redirectTo);
          } else {
            this.$router.push("/");
          }
        } catch (err) {
          this.sending = false;
          console.log(err);
          if (err.response.status === 401) {
            this.errors.push({
              msg: "Usuari o contrasenya no vàlids",
              type: "error",
              show: true
            });
          } else {
            this.errors.push({
              msg:
                "Server error - " + err + "(" + err.response.data.message + ")",
              type: "error",
              show: true
            });
          }
        }
      }
    },
    resetForm() {
      this.$refs.form.reset();
    }
  }
};
</script>

<style scoped>
v-text-field {
  padding: 10px;
  border: 10px;
}
</style>