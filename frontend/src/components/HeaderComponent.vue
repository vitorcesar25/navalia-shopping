<template>
  <v-app-bar app>
    <v-toolbar-title>Navalia Shopping</v-toolbar-title>
    <v-spacer></v-spacer>
    <LoginComponent />
  </v-app-bar>
</template>

<script>
import LoginComponent from "./LoginComponent.vue";
export default {
  name: "HeaderComponent",
  components: {
    LoginComponent,
  },
};
</script>
    