<template>
  <div id="app">
    <div id="nav">
      <span class="text">FDSAF你好</span>
      <input type="button" @click="handleX" value="click">
      <router-link to="/">Home</router-link>
      |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script type="application/javascript">
  import {mapGetters} from "vuex";
  //简单实现mapGetters
  const getters = {
    a: () => 1,
    b: () => 2,
  }

  function fns(keys) {
    const data = {}
    keys.forEach(key => {
      if (getters.hasOwnProperty(key)) {
        data[key] = getters[key]
      }
    })
    return data
  }

  export default {
    computed: {
      ...mapGetters(['test']),
      ...fns(['a', 'b'])
    },
    mounted() {
      this.$store.dispatch('setTest', 9).then(() => {
        console.log(this.test)
      })
      console.log(this.a,this.b)
    },
    methods: {
      handleX: function () {
        const i = {num: 1};
        i.num++;
        this.$store.dispatch('setTest', i.num).then(() => {
        })
        console.log(this.test)
      }
    }
  }
  document.addEventListener('DOMContentLoad', function () {
    const html = document.querySelector('html')
    let fontSize = window.innerWidth / 10
    fontSize = fontSize > 50 ? 50 : fontSize
    html.style.fontSize = fontSize + "px"
  })
</script>

<style lang="scss" scoped>
  @import "src/assets/styles/global";

  .text {
    font-family: "Days One";
    font-size: px2rem(40);
  }
</style>
