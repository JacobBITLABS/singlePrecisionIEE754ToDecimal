<template>
  <!-- <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    
  </div> -->
  <div>
    <div class="margin-div">
      <IEEE754FloatingPointVisualiser/>
    </div>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue';
import IEEE754FloatingPointVisualiser from './components/IEEE754FloatingPointVisualiser.vue'

export default {
  name: 'App',
  components: {
    // HelloWorld,
    IEEE754FloatingPointVisualiser
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.margin-div{
  text-align: center;
  width: 100%;
  display: block;
  margin: 0, auto;
  margin-top: 110px;
}
</style>
