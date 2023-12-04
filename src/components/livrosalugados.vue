<template>
    <div>
      <v-card width="100%" class="elevation-3" style="border-radius: 20px; background-color: rgba(255, 255, 255, 0.603);">
        <v-card-title class="black--text">
          <h3>Livros Mais Alugados</h3>
        </v-card-title>
        <v-card-text width="100%" style="position: relative; right: 10px;" >
          <v-row>
            <v-col v-for="(book, index) in topMaisAlugados" :key="index" cols="12" sm="6" md="4" lg="3">
              <v-card class="elevation-5" style="margin: 10px; width: 300px; background-color: rgba(255, 255, 255, 0.603);">
                <v-card-title>{{ index + 1 }}. {{ book.name }}</v-card-title>
                <v-card-text class="grey--text">
                  Autor: {{ book.author }}
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>
  </template>
  <script>
  import ApiService from "@/Services/book"; 
  
  export default {
    data() {
      return {
        maisAlugados: [],
        topMaisAlugados: []
      };
    },
    mounted() {
      this.fetchMaisAlugados();
    },
    methods: {
      fetchMaisAlugados() {
        ApiService.alugados()
          .then(response => {
            this.maisAlugados = response.data; 
            this.topMaisAlugados = this.maisAlugados.slice(0, 4); 
          })
          .catch(error => {
            console.error("Erro ao buscar mais alugados:", error);
          });
      }
    }
  };
  </script>
  