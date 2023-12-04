<template>
  <div>
    <canvas id="pieChart" style="max-width: 1000px; max-height: 1000px;"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import Rent from "@/Services/rent";

export default {
  mounted() {
    this.listarPendente();
    this.listarPrazo();
    this.listarAtrasado();
  },
  data() {
    return {
      pendenteCount: 0,
      prazoCount: 0,
      atrasadoCount: 0,
      chart: null, 
    };
  },
  methods: {
    listarPendente() {
      Rent.listar_Pendente()
        .then(response => {
          this.pendenteCount = response.data;
          this.updatePieChart();
        });
    },
    listarPrazo() {
      Rent.listar_Prazo()
        .then(response => {
          this.prazoCount = response.data;
          this.updatePieChart();
        });
    },
    listarAtrasado() {
      Rent.listar_Atrasado()
        .then(response => {
          this.atrasadoCount = response.data;
          this.updatePieChart();
        });
    },
    createPieChart() {
      const ctx = document.getElementById("pieChart").getContext("2d");

      const labels = ["Pendente", "No prazo", "Atrasado"];
      const data = [this.pendenteCount, this.prazoCount, this.atrasadoCount];

      const backgroundColor = ["orange", "green", "red"];

      if (this.chart) {
        this.chart.destroy(); 
      }

      this.chart = new Chart(ctx, {
        type: "pie",
        data: {
          labels: labels,
          datasets: [
            {
              data: data,
              backgroundColor: backgroundColor,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          aspectRatio: 1, // Defina o aspectRatio para ajustar o tamanho do gráfico
        },
      });
    },
    updatePieChart() {
      if (this.chart) {
        this.chart.data.datasets[0].data = [this.pendenteCount, this.prazoCount, this.atrasadoCount];
        this.chart.update(); // Atualiza o gráfico existente
      } else {
        this.createPieChart();
      }
    },
  },
};
</script>
