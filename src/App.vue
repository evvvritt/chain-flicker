<template lang="pug">
  #app.app(:data-route="$route.name")
    loader(v-show="loader")
    transition(name="body", appear)
      .app__body(v-show="!loading")
        router-view(:frames="frames", :activeColor="activeColor", @play="play = !play", @addColor="addColor", @changeColor="changeColor")
        button#all-link.button(title="View All", v-if="frames.length > 0", v-show="!play", @click="allBtnClick", :style="'background-color:' + colorSet[3]")
        button#add-color-btn.button(v-show="!play", @click="addMode", :style="'background-color:' + colorSet[3]", :class="{'add-color-btn--back': $route.name === 'Add'}")
</template>

<script>
import Loader from '@/components/Loader'
// utils
import Web3Utils from 'web3-utils'
import tinycolor from 'tinycolor2'
import FlickerFilmContract from '../dapp-scratch-wrapper/FlickerFilmContract'
let filmContract = new FlickerFilmContract()
export default {
  name: 'app',
  components: {
    Loader
  },
  data () {
    return {
      loading: true,
      loader: true,
      filmCount: 0,
      film: [],
      frames: [],
      index: 0,
      framesPerSec: 8,
      interval: null,
      play: false
    }
  },
  computed: {
    speed () {
      return Math.floor(1000 / this.framesPerSec)
    },
    activeColor () {
      return this.frames[this.index]
    },
    lastColor () {
      return this.frames[this.film.length - 1]
    },
    colorSet () {
      if (!this.activeColor || this.play) return false
      const color = !this.activeColor ? 'white' : this.activeColor
      const colors = tinycolor(color).tetrad()
      return colors.map((t) => { return t.toHexString() })
    }
  },
  watch: {
    play (play) {
      if (!play) return clearInterval(this.interval)
      this.interval = setInterval(() => {
        this.index = this.index + 1 === this.frames.length ? 0 : this.index + 1
      }, this.speed)
    },
    frames () {
      this.resetIndex()
    }
  },
  methods: {
    resetIndex () {
      this.index = 0 // this.frames.length - 1
    },
    addMode () {
      if (this.$route.name === 'Add') return this.$router.go(-1)
      return this.$router.push({name: 'Add'})
    },
    allBtnClick () {
      if (this.$route.name === 'All') return this.$router.go(-1)
      return this.$router.push({name: 'All'})
    },
    getFilm () {
      this.loader = true
      return filmContract.getCount().then((count) => {
        this.getColor(0, parseInt(count))
        return count
      })
    },
    setFrames () {
      let frames = []
      for (var i = 0; i < this.film.length; i++) {
        const item = this.film[i].replace('0x', '')
        const color = '#' + item.substring(0, 6)
        const length = Web3Utils.hexToNumber(item.substring(6))
        for (var x = 0; x < length; x++) {
          frames.push(color)
        }
      }
      frames.reverse()
      this.frames = frames
    },
    getColor (index = 0, length = 0) {
      // exit
      if (index === length) {
        this.setFrames()
        this.loading = false
        this.loader = false
        return
      }
      // recursive
      filmContract.getColor(index).then((item) => {
        this.film.push(item)
        this.getColor(index + 1, length)
        return item
      })
    },
    encodeColor (color, length) {
      if (!color) return false
      length = length > 255 ? 255 : length // max
      length = Web3Utils.padLeft(length, 2).replace('0x', '') // length to hex
      color = tinycolor(color).toHexString() // convert css colors to hex
      color = color.replace('#', '0x') + length
      return color
    },
    addColor (color, length = 1) {
      const code = this.encodeColor(color, length)
      if (code) {
        this.loader = true
        return filmContract.addColor(code).then(() => {
          return setTimeout(() => this.getFilm(), 0) // process.env.CALL_DELAY)
        })
      }
    },
    changeColor (index = -1, color, length) {
      if (index < 0) return false
      const code = this.encodeColor(color, length)
      if (code) {
        return filmContract.changeColor(code, index).then(() => {
          return this.getFilm()
        })
      }
    },
    init () {
      const ready = setInterval(() => {
        if (filmContract.FlickerFilmContract) {
          clearInterval(ready)
          this.getFilm()
        }
      }, 0)
    }
  },
  created () {
    this.init()
  }
}
</script>

<style lang="scss">
$frameWidth: 7vh;
$frameWidthPortrait: 7vw;
@mixin screen ($fw) {
  top:$fw; left:$fw;
  width:calc(100% - #{$fw} * 2) ; height:calc(100% - #{$fw} * 2);
}
@mixin btnPos ($fw, $side1: 'bottom', $side2: 'right' ) {
  #{$side1}:calc(#{$fw} + 1.5rem); 
  #{$side2}:calc(#{$fw} + 1.5rem);
}

*{
  margin:0;
  padding:0; 
  box-sizing:border-box;
}
html{
  background:#1E1E1E;
}
.app {
  font-family: 'Lato', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width:100%; height:100vh;
  position: relative;
  
  .is-overlay{
    position: absolute;
    top:0; left:0;
    width:100%; height:100%;
  }
  .flex{
    display: flex;
  }
  .flex-center{
    align-items: center;
    justify-content: center;
  }

  .app__body{
    &.body-enter-active{
      transition: opacity 1s;
    }
    &.body-enter{
      opacity:0;
    }
  }

  button{
    font-family: inherit;
    font-weight: inherit;
    font-style: inherit;
    appearance:none;
    border:none;
    border-radius:0;
    cursor: pointer;
    background:none;
    &:focus{
      outline:0;
    }
  }

  .button{
    width:3rem; height:3rem;
    padding:0;
    border-radius:4rem;
    box-shadow:0 2px 4px rgba(0,0,0,.25);
    display: flex;
    justify-content: center;
    align-items: center;
    transition:all 300ms;
    transform-origin:center center;
    &:after{
      content:'';
      display:block;
      background-size:100% auto;
      background-repeat:no-repeat;
      background-position:center center;
    }
  }

  #add-color-btn{
    position: fixed;
    @include btnPos($frameWidth);
    &:after{
      background-image:url('./assets/add-btn__plus.svg');
      width:2rem;
      height:2rem;
    }
  }
  &[data-route="Add"] #add-color-btn{
    transform:rotate(-135deg);
    background-color:transparent !important;
    box-shadow:none;
  }

  #all-link{
    position: fixed;
    @include btnPos($frameWidth, 'top', 'right');
    &:after{
      background-image:url('./assets/Eye.svg');
      width:2.25rem;
      height:2.25rem;
    }
  }
  &[data-route="All"] #all-link{
    transform:rotate(90deg);
  }
  &[data-route="Add"] #all-link{
    display:none;
  }

  .screen{
    position: absolute;
    @include screen($frameWidth);
    border-radius:3rem;
    background-color:white;
  }

  

  @media (orientation:portrait) {
    .screen{
      @include screen($frameWidthPortrait);
    }
    #add-color-btn{
      @include btnPos($frameWidthPortrait);
    }
  }
}
</style>
