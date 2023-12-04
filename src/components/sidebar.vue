<template>
    <v-app>
      <!-- Barra de aplicativo -->
      <v-app-bar app class="light-blue darken-4" height="80">
        <v-app-bar-nav-icon @click="toggleDrawer" class="white--text"></v-app-bar-nav-icon>
        <v-toolbar-title class="white--text display-1">
            <span class="font-weight-light">WDA</span>
            <span> Library</span>
        </v-toolbar-title>
      </v-app-bar>
  
      <!-- Menu lateral -->
      <v-navigation-drawer app v-model="drawerOpen" class="Bar-drawer" width="300">
        <v-img src="../assets/dsd-removebg-preview.png" class="mt-15 ml-5" width="250"></v-img>
        <v-list style="position: relative; top: 40px;">
          <v-list-item to="/">
            <v-list-item-icon>
              <v-icon class="white--text">mdi-dots-square</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="white--text">Dashboard</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="Users">
            <v-list-item-icon>
              <v-icon class="white--text">mdi-account-star</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="white--text">Usuário</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          
          <v-list-item to="Company">
            <v-list-item-icon>
              <v-icon class="white--text">mdi-domain</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="white--text">Editora</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="Book">
            <v-list-item-icon>
              <v-icon class="white--text">mdi-book</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="white--text">Livros</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="Rent">
            <v-list-item-icon>
              <v-icon class="white--text">mdi-book-check</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="white--text">Aluguel</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

        </v-list>
      </v-navigation-drawer>
      <v-main>
        <RouterView/>
      </v-main>
    </v-app>
  </template>
  
  <script>
  import {  RouterView } from 'vue-router';
  
  export default {
    data() {
        return {
            drawerOpen: false, 
        };
    },
    methods: {
        toggleDrawer() {
            this.drawerOpen = !this.drawerOpen; 
        },
    },
};
  </script>

<style>
  .Bar-drawer{
    background-image: linear-gradient(to bottom, rgb(3, 64, 133), black);
  }

</style>