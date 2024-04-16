<template>
  <div class="alert alert-danger" v-if="this.isShown" v-on:click="closeError">
    <strong/> {{ this.error }}
  </div>
</template>

<script>
export default {
  name: "ErrorForm",
  data(){
    return{
      error: '',
      isShown: false,
    }
  },
  methods:
      {
        closeError()
        {
          this.isShown = false;
        }
      },
  mounted() {
    this.emitter.on('empty', (data) =>
    {
      this.error = data.error;
      this.isShown = true;
    })
  },
}
</script>

<style scoped>
div {
  display: flex;
  position: fixed;
  width: 50%;
  height: 50%;
  top: 20%;
  left: 25%;
  justify-content: center;
  align-items: center;
  font-size: 500%;
  background-color: rgba(255, 0, 0, 0.8);
}
</style>
