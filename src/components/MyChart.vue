<template>
  <div>
    <canvas ref="myChart"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';
import Produto from "@/Services/book"; 
import book from '@/Services/book';

export default {
  name: 'MyChart',
  mounted() {
    this.fetchMaisAlugados(); 
  },

  data() {
    return {
      maisAlugados: [],
    };
  },

  methods: {

    fetchMaisAlugados() {
     
      Produto.alugados() 
        .then(response => {
          this.maisAlugados = response.data.slice(0, 4);
          this.createChart(); 
        })
        .catch(error => {
          console.error("Erro ao buscar mais alugados:", error);
        });
    },

    createChart() {
      const ctx = this.$refs.myChart.getContext('2d');

  
      const nomesLivros = this.maisAlugados.map(book => book.name); 
      const estoques = this.maisAlugados.map(book => book.amount); 

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: nomesLivros, 
          datasets: [
            {
              label: 'Estoques',
              data: estoques, 
              backgroundColor: ['#081933', 'blue', '#3C4BF0'], 
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    },
  },
};
</script>