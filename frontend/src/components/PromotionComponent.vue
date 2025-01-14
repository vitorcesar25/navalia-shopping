<template>
  <v-container v-if="promotions && promotions.length && !promotionLoading">
    <p class="mb-4">Promotional Offers:</p>
    <v-card
      @click="selectPromotion(promotion.id)"
      v-for="promotion in promotions"
      :key="promotion.id"
      small
      class="mb-2"
      :color="selectedPromotion === promotion.id ? 'primary' : 'white'"
    >
      <v-radio-group v-model="selectedPromotion" hide-details>
        <v-radio :value="promotion.id"></v-radio>
      </v-radio-group>
      <v-card-title>
        {{ promotion.name }}
      </v-card-title>
      <v-chip
        v-if="promotion.id === bestOfferId"
        class="ml-2"
        :color="selectedPromotion === promotion.id ? 'white' : 'green'"
        label
      >
        Recommended
      </v-chip>
      <v-card-text>
        <p v-if="promotion.total !== promotion.subtotal">
          <del class="grey--text">$ {{ promotion.total }}</del>
          <strong class="ml-2 text-h6">$ {{ promotion.subtotal }}</strong>
        </p>
        <p v-else>
          <strong>$ {{ promotion.subtotal }}</strong>
        </p>
      </v-card-text>
    </v-card>
  </v-container>
  <v-container v-else-if="promotionLoading">
    <v-row justify="center">
      <v-progress-circular indeterminate color="primary" class="my-4"></v-progress-circular>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  name: "PromotionComponent",
  data() {
    return {};
  },
  computed: {
    ...mapGetters("promotion", [
      "getPromotions",
      "getBestOfferId",
      "getSelectedPromotion",
      "getPromotionLoading",
    ]),
    ...mapGetters("cart", ["getCartItems"]),
    promotions() {
      return this.getPromotions;
    },
    bestOfferId() {
      return this.getBestOfferId;
    },
    selectedPromotion: {
      get() {
        return this.getSelectedPromotion;
      },
      set(value) {
        this.selectedPromotion(value);
      },
    },
    promotionLoading() {
      return this.getPromotionLoading;
    },
  },
  methods: {
    ...mapMutations("promotion", ["togglePromotionLoading", "selectPromotion"]),
    ...mapActions("promotion", ["calculatePromotions"]),
  },
  watch: {
    getCartItems: {
      handler(value) {
        if (value) {
          this.calculatePromotions();
        }
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.del {
  text-decoration: line-through;
}
</style>