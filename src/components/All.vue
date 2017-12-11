<template lang="pug">
  section
    div(v-for="(frame, index) in frames", :style="'background-color:' + frame", :data-value="frame", @click="click(index)")
</template>

<script>
export default {
  name: 'All',
  props: ['frames'],
  data () {
    return {

    }
  },
  methods: {
    click (index) {
      this.$emit('updateIndex', index)
      this.$router.push({name: 'Player'})
    }
  }
}
</script>

<style lang="scss" scoped>
section{
  // width:6rem;
  margin:0 auto;
  padding:44vh 0;
  border-radius:1rem;
  overflow:hidden;
  // filter:blur(2px);
  > div {
    margin:0 auto;
    width:10vw;
    cursor: pointer;
    border-radius:.5rem;
    &:after{
      content:'';
      display: block;
      padding-bottom:10vh;
    }
    &:nth-last-child(n + 2) {
      // border-bottom: 1px solid rgba(0,0,0,.5);  
    }
  }
}
</style>