<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense nav>
        <v-list-item
          link
          v-for="item in menu"
          :key="item.name">
          <v-list-item-icon v-if="item.icon">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title @click="go(item.path)">{{ item.name }}</v-list-item-title>
              <template v-if="logged">
                <v-list-item v-for="itemStatus in selectableStatus" :key="itemStatus.id"
                  @click="go(item.path + '/status/' + itemStatus.id)">
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ itemStatus.name }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="logged" link @click="go('/')">
          <v-list-item-icon>
            <v-icon>mdi-folder-multiple</v-icon>
          </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Totes les convocatòries</v-list-item-title>
            </v-list-item-content>
        </v-list-item>


      </v-list>
      <template v-slot:append>
        <div class="pa-2" v-if="logged">
          <v-btn block @click="logout">Logout</v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <div class="d-flex align-center">
        <v-img
          alt="CIP FP Batoi"
          class="shrink mr-2 logo"
          contain
          src="@/assets/logoBatoi.png"
          transition="scale-transition"
          width="60"
        />
        <h1>CIP FP Batoi - Automatrícula</h1>
      </div>
      <v-spacer></v-spacer>
      <h3 v-if="logged" class="primary">Hola {{ user }}</h3>
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
    drawer: false,
  }),
  computed: {
    logged() {
      return this.$store.getters.getToken;
    },
    user() {
      return this.$store.getters.getUser;
    },
    menu() {
      return this.$store.getters.getMenu;
    },
    selectableStatus() {
      return this.$store.getters.getSelectableStatus;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/login");
    },
    go(path) {
      if (this.$route.path !== path)
        this.$router.push(path);
      this.drawer = false;
    }
  }
};
</script>
