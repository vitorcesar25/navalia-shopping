<template>
  <v-app>
    <LoadingComponent />
    <HeaderComponent />
    <v-main>
      <router-view />
    </v-main>
    <CartComponent />
  </v-app>
</template>

<script>
import CartComponent from "./components/CartComponent.vue";
import LoadingComponent from "./components/LoadingComponent.vue";
import HeaderComponent from "./components/HeaderComponent.vue";

export default {
  name: "App",
  components: {
    HeaderComponent,
    CartComponent,
    LoadingComponent,
  },
};
</script>