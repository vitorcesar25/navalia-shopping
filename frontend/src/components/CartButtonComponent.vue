<template>
  <v-btn icon color="primary" @click="toggleCartDialog" title="Open Cart">
    <v-icon>mdi-cart</v-icon>
  </v-btn>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "CartButtonComponent",
  methods: {
    ...mapMutations("cart", ["toggleCartDialog"]),
  },
};
</script>
