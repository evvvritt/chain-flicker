<template lang="pug">
  #app
    #screen(@click="play = !play", :style="'background-color:' + this.activeColor")
    button(v-show="!play", @click="addMode = !addMode", :style="'background-color:' + this.colorSet[3]", :class="{'addmode--close': addMode}")
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
      addMode: false
    }
  },
  computed: {
    speed () {
      return Math.floor(1000 / this.framesPerSec)
    },
    activeColor () {
      return this.addMode ? this.frames[this.frames.length - 1] : this.frames[this.index]
    },
    colorSet () {
      const colors = tinycolor(this.activeColor).tetrad()
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

  > button{
    position: fixed;
    bottom:3rem; right:3rem;
    width:5em; height:5em;
    background:#666;
    display: block;
    padding:0;
    border-radius:4rem;
    box-shadow:0 2px 4px rgba(0,0,0,.25);
    display: flex;
    justify-content: center;
    align-items: center;
    transition:all 300ms;
    transform-origin:center center;
    &.addmode--close{
      transform:rotate(-135deg);
      background-color:transparent !important;
      box-shadow:none;
    }
    &:after{
      content:'';
      display:block;
      background-image:url('./assets/add-btn__plus.svg');
      background-size:100% auto;
      background-repeat:no-repeat;
      background-position:center center;
      width:3em;
      height:3em;
    }
  }
}
#screen{
  position: fixed;
  width:100%; height:100%;
  top:0; left:0;
  z-index:0;
  cursor: pointer;
}
</style>
