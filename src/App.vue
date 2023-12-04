<template>
  <v-app>
    <sidebar style="background-image: linear-gradient(to bottom, rgb(255, 255, 255), rgb(202, 201, 201));
  "/>
  </v-app>
</template>

<script>
import sidebar from '@/components/sidebar'

export default {
  name: 'App',
  components: { sidebar },

  data: () => ({
    //
  }),
};
</script>
