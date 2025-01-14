<template>
  <v-dialog persistent v-model="isLoading" style="z-index: 3000">
    <v-row justify="center">
      <v-progress-circular
        :size="70"
        :width="4"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </v-row>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["isLoading"]),
  },
  components: {},
  watch: {},
};
</script>