<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">Product List</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="4" v-for="product in products" :key="product.id">
        <v-card>
          <v-img :src="product.photo" height="200px" class="align-end">
            <v-card-subtitle class="white--text">
              {{ product.name }}
            </v-card-subtitle>
          </v-img>
          <v-card-text>
            <div class="text-h6">Price: {{ product.price.toFixed(2) }}</div>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              @click="addToCart({ productId: product.id })"
            >
              Add to Cart
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center" class="mt-4">
      <v-pagination
        v-model="pageIndex"
        :length="pagination.totalPages"
        :disabled="loading"
      ></v-pagination>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "ProductList",
  components: {},
  data() {
    return {
      pageIndex: 1,
      loading: false,
      pagination: {
        totalPages: 1,
      },
    };
  },

  computed: {
    ...mapState("product", ["productPageData"]),
    ...mapState("user", ["user"]),
    products() {
      return this.productPageData[this.pageIndex - 1]?.products || [];
    },
  },

  methods: {
    ...mapActions("product", ["getProducts"]),
    ...mapActions("cart", ["addToCart"]),

    /**
     * Fetches products asynchronously for the given page index.
     *
     * @param {number} pageIndex - The page index to fetch.
     */
    async getProductsAsync(pageIndex) {
      this.loading = true;
      try {
        await this.getProducts({ pageIndex: pageIndex - 1 });
        this.updatePagination(pageIndex);
      } catch (error) {
        console.error("Error fetching products:", error.message);
        alert("There was an issue fetching products. Please try again.");
      } finally {
        this.loading = false;
      }
    },

    /**
     * Updates the pagination based on the current page index.
     *
     * @param {number} pageIndex - The current page index.
     */
    updatePagination(pageIndex) {
      if (this.productPageData[pageIndex - 1]?.nextPageToken) {
        this.pagination.totalPages = Math.max(
          this.pagination.totalPages,
          pageIndex + 1
        );
      }
    },

    /**
     * Handles the page change event for pagination.
     *
     * @param {number} newPageIndex - The new page index selected.
     */
    onPageChange(newPageIndex) {
      this.pageIndex = newPageIndex;
      this.getProductsAsync(newPageIndex);
    },
  },

  watch: {
    /**
     * Watches for changes in the `user` and fetches products if necessary.
     */
    user: {
      handler() {
        if (this.productPageData?.length === 0 && this.user) {
          this.getProductsAsync(this.pageIndex);
        }
      },
      immediate: true,
    },

    /**
     * Watches for changes in the `pageIndex` and triggers a page change.
     *
     * @param {number} newPageIndex - The new page index selected.
     */
    pageIndex(newPageIndex) {
      this.onPageChange(newPageIndex);
    },
  },

  /**
   * Lifecycle hook to fetch initial product data on component creation.
   */
  async created() {
    if (this.productPageData?.length === 0 && this.user) {
      await this.getProductsAsync(this.pageIndex);
    }
  },
};
</script>