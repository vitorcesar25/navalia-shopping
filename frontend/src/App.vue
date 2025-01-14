<template>
  <v-app>
    <LoadingComponent />
    <HeaderComponent />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import LoadingComponent from "./components/LoadingComponent.vue";
import HeaderComponent from "./components/HeaderComponent.vue";

export default {
  name: "App",
  components: {
    HeaderComponent,
    LoadingComponent,
  },
};
</script>
