<template>
  <div class="home">
    <span class="icon-bookmark"></span>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import {setUserName,getUserName} from "../utils/common/cookie";

export default {
  name: 'Home',
  data() {
    return {
      home:{
        username:'zhangsan'
      }
    }
  },
  mounted() {
    setUserName(this.home.username)
    console.log(getUserName());
  },
  components: {
    HelloWorld
  },
}
</script>
