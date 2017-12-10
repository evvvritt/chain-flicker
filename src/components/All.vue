<template lang="pug">
  section
    div(v-for="frame in frames", :style="'background-color:' + frame", :data-value="frame")
</template>

<script>
export default {
  name: 'All',
  props: ['frames'],
  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
section{
  width:6rem;
  margin:3rem auto;
  border-radius:1rem;
  overflow:hidden;
  > div {
    width:100%;
    &:after{
      content:'';
      display: block;
      padding-bottom:100%;
    }
    &:nth-last-child(n + 2) {
      // border-bottom: 1px solid rgba(0,0,0,.5);  
    }
  }
}
</style>