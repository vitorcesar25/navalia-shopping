<template>
  <v-app>
    <LoadingComponent />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import LoadingComponent from "./components/LoadingComponent.vue";

export default {
  name: "App",
  components: {
    LoadingComponent,
  },
};
</script>
