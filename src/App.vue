<template lang="pug">
  #app
    #screen(@click="play = !play", :style="'background-color:' + this.mainColor")
    nav
      button(@click="play = !play")
      button
</template>

<script>
import tinycolor from 'tinycolor2'
export default {
  name: 'app',
  data () {
    return {
      frames: [],
      index: 0,
      framesPerSec: 4,
      interval: null,
      play: false,
      loop: true
    }
  },
  computed: {
    speed () {
      return Math.floor(1000 / this.framesPerSec)
    },
    mainColor () {
      return this.frames[this.index]
    },
    colorSet () {
      const colors = tinycolor(this.mainColor).tetrad()
      return colors.map((t) => { return t.toHexString() })
    }
  },
  watch: {
    play (play) {
      if (!play) return clearInterval(this.interval)
      this.interval = setInterval(() => {
        this.index = this.index + 1 === this.frames.length ? 0 : this.index + 1
      }, this.speed)
    }
  },
  created () {
    for (var i = 0; i < 20; i++) {
      this.frames.push(tinycolor.random().toHexString())
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
    mix-blend-mode:difference;
    transition:max-height 500ms;
    max-height:1.5rem;
    &:hover{
      max-height:2rem;
    }
    button{
      flex:1;
      &:nth-child(odd){
        background-color:#ccc;
      }
      &:nth-child(even){
        background-color:#666;
      }
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
