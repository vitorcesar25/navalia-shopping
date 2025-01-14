<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="400px"
    data-testid="login-dialog"
  >
    <template v-slot:activator="{ props }">
      <v-btn
        data-testid="login-button"
        color="primary"
        dark
        v-bind="props"
        @click="openDialog"
        rounded
      >
        <v-icon left class="mr-2">mdi-account</v-icon>
        {{ loginButtonLabel }}
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="text-h6">Select User</v-card-title>
      <v-card-text>
        <v-select
          data-testid="user-selection"
          v-model="selectedUser"
          :items="users"
          item-title="name"
          item-value="id"
          label="Choose a User"
          dense
          outlined
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          data-testid="confirm-login"
          color="primary"
          @click="loginUser"
          :disabled="!selectedUser"
        >
          Select
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "LoginComponent",

  data() {
    return {
      dialog: false,
      selectedUser: null,
    };
  },

  computed: {
    ...mapGetters("user", ["getUser", "mockAvailableUsers"]),

    user: {
      get() {
        return this.getUser;
      },
    },

    users: {
      get() {
        return this.mockAvailableUsers;
      },
    },

    loginButtonLabel() {
      return this.user ? this.user.name : "Login";
    },
  },

  methods: {
    ...mapActions("user", ["login"]),

    promptUserLogin() {
      if (!this.user) {
        this.openDialog();
      }
    },

    openDialog() {
      this.dialog = true;
    },

    loginUser() {
      const user = this.users.find((u) => u.id === this.selectedUser);
      if (user) {
        this.login(user);
        this.dialog = false;
      }
    },
  },

  created() {
    this.promptUserLogin();
  },
};
</script>