<template>
    <v-card class="elevation-5] ml-5 mt-2" width="97%" style="padding: 20px; height: 97%; border-radius: 20px;
     background-color: rgba(255, 255, 255, 0.685);">
      <div>
        <h1 class="display-2 black--text">Dashboard</h1>
        <p class="font-weight-light">dashboard / <span class="blue--text">itens</span></p>
      </div>

      <v-row>
        <v-col >
          <MaisAlugados />
        </v-col>
      </v-row>
      
      <v-row style="margin-bottom: 40px;">
        <v-col cols="12" sm="12" md="6">
          <v-card class="card-2 elevation-5" style="background-color: rgba(255, 255, 255, 0.411);">
            <h2>Status dos aluguéis</h2>
            <ChartsPizza></ChartsPizza>
          </v-card>
        </v-col>
        <v-col cols="12" sm="12" md="6">
          <v-card class="card-2 elevation-5" height="350px" style="background-color: rgba(255, 255, 255, 0.384);">
            <h2>Estoque dos livros mais alugados</h2>
            <my-chart style="height: 250px; position: relative; top: 35px;"></my-chart> 
          </v-card>
        </v-col>
      </v-row>
   </v-card>
</template>

<script>
  import MyChart from '@/components/MyChart.vue'; 
  import MaisAlugados from "@/components/livrosalugados.vue";
  import ChartsPizza from "@/components/ChartsPizza.vue";
  export default {
    name: 'App',
    components: {
      MyChart,
      MaisAlugados,
      ChartsPizza
    },
  };

</script>

<style>
  .card{
    height: 150px;
    width: 100%;
    border-radius: 15px !important;
    padding: 10px;
    
  }

  .icons{
    width: 90px;
    background-color: rgba(5, 194, 100, 0.507);
    font-size: 46px !important;
    border-radius: 10px;
    
  }

  .card-2{
    height: 100%;
    padding: 10px;
    border-radius: 20px !important;
     /* Defina a cor da borda desejada */
  }

</style>