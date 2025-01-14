<template>
  <v-app-bar app>
    <v-toolbar-title>Navalia Shopping</v-toolbar-title>
    <v-spacer></v-spacer>
    <CartButtonComponent />
    <LoginComponent />
  </v-app-bar>
</template>

<script>
import LoginComponent from "./LoginComponent.vue";
import CartButtonComponent from "./CartButtonComponent.vue";
export default {
  name: "HeaderComponent",
  components: {
    LoginComponent,
    CartButtonComponent,
  },
};
</script>
    