<template>
  <div>
    <v-navigation-drawer
      v-model="dialog"
      location="right"
      temporary
      width="350"
    >
      <v-toolbar flat color="primary">
        <v-toolbar-title class="white--text">Your Cart</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="toggleCartDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider></v-divider>

      <v-container v-if="!hasCartItems">
        <p class="text-center">Your cart is empty.</p>
      </v-container>
      <v-container v-else>
        <v-row>
          <v-col cols="12" v-for="item in getCartItems" :key="item.productId">
            <v-card outlined height="140px">
              <v-row>
                <v-col cols="4">
                  <v-img :src="item.photo" height="80px" contain></v-img>
                </v-col>
                <v-col cols="8">
                  <v-card-title>{{ item.name }}</v-card-title>
                  <v-card-subtitle>
                    Unit Price: ${{ item.price.toFixed(2) }}
                  </v-card-subtitle>
                  <v-card-subtitle>
                    Quantity: {{ item.quantity }}
                  </v-card-subtitle>
                </v-col>
                <v-col cols="12" class="ma-0 pa-0">
                  <v-row class="ma-0 px-8" justify="end">
                    <v-btn
                      size="24px"
                      class="mr-2"
                      color="primary"
                      icon
                      @click.stop="
                        updateQuantity(item.productId, item.quantity + 1)
                      "
                    >
                      <v-icon size="18px">mdi-plus</v-icon>
                    </v-btn>
                    <v-btn
                      size="24px"
                      color="primary"
                      class="mr-2"
                      icon
                      v-show="item.quantity > 1"
                      @click.stop="
                        updateQuantity(item.productId, item.quantity - 1)
                      "
                    >
                      <v-icon size="18px">mdi-minus</v-icon>
                    </v-btn>
                    <v-btn
                      size="24px"
                      color="red"
                      icon
                      @click.stop="removeItem(item.productId)"
                    >
                      <v-icon size="18px">mdi-trash-can</v-icon>
                    </v-btn>
                  </v-row>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col cols="12">
            <p>Total: ${{ getCartTotal }}</p>
          </v-col>
        </v-row>
      </v-container>
      <div v-show="hasCartItems">
        <v-divider></v-divider>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="red" dark @click.stop="clearCart"> Clear Cart </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark @click.stop="continueFromCart">
            Checkout
          </v-btn>
        </v-card-actions>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "CartComponent",
  components: {
  },
  data() {
    return {};
  },

  computed: {
    ...mapGetters("cart", [
      "getCartDialog",
      "getCartItems",
      "hasCartItems",
      "getCartTotal",
    ]),
    ...mapGetters("user", ["getUser"]),
    dialog: {
      get() {
        return this.getCartDialog;
      },
      set(value) {
        this.setCartDialog(value);
      },
    },
  },

  methods: {
    ...mapMutations("cart", ["setCartDialog"]),
    ...mapMutations("promotion", ["togglePromotionCheckoutDialog"]),
    ...mapActions("cart", [
      "getCartByUserId",
      "updateCartItem",
      "removeCartItem",
      "clearCart",
      "continueFromCart",
    ]),
    /**
     * Toggles the visibility of the cart dialog.
     */
    toggleCartDialog() {
      this.dialog = !this.dialog;
    },
    /**
     * Updates the quantity of an item in the cart.
     *
     * @param {string} productId - The ID of the product to update.
     * @param {number} quantity - The new quantity for the product.
     */
    updateQuantity(productId, quantity) {
      this.updateCartItem({ productId, quantity });
    },
    /**
     * Removes an item entirely from the cart.
     *
     * @param {string} productId - The ID of the product to remove.
     */
    removeItem(productId) {
      this.removeCartItem({ productId });
    },
  },

  watch: {
    getUser: {
      handler(user) {
        if (user) {
          this.getCartByUserId();
        }
      },
      immediate: true,
    },
  },
};
</script>