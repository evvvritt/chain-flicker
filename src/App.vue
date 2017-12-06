<template lang="pug">
  #app
    #screen(:style="'background-color:' + this.mainColor")
    nav
      button(aria-label="play", :style="'background-color:' + this.colorSet[3]")
      button(aria-label="speed", :style="'background-color:' + this.colorSet[2]")
      button(aria-label="add", :style="'background-color:' + this.colorSet[1]")
</template>

<script>
import tinycolor from 'tinycolor2'
export default {
  name: 'app',
  data () {
    return {
      frames: ['FF6A6A', '0E1A81', '26554E', '000000', '0000000', '5D385F'],
      index: 0,
      framesPerSec: 4
    }
  },
  computed: {
    interval () {
      return Math.floor(1000 / this.framesPerSec)
    },
    mainColor () {
      return '#' + this.frames[this.index]
    },
    colorSet () {
      const colors = tinycolor(this.mainColor).tetrad()
      return colors.map((t) => { return t.toHexString() })
    }
  }
}
</script>

<style lang="scss">
html{
  background:#666;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  button{
    appearance:none;
    border:none;
    border-radius:0;
    cursor: pointer;
    &:focus{
      outline:0;
    }
  }
  
  nav{
    position: fixed;
    width:100%;
    bottom:0; left:0;
    display:flex;
    align-items: stretch;
    height:100%;
    mix-blend-mode:hard-light;
    transition:max-height 500ms;
    max-height:5vh;
    &:hover{
      max-height:7vh;
    }
    button{
      flex:1;
    }
  }
}
#screen{
  position: fixed;
  width:100%; height:100%;
  top:0; left:0;
  z-index:0;
}
</style>
