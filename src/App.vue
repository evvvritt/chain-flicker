<template lang="pug">
  #app.app(:data-route="$route.name")
    loader(v-show="loader", @click="loader = false")
    transition(name="body", appear)
      .app__body(v-show="!loading")
        router-view(
        :frames="frames", 
        :framesPerSec="framesPerSec",
        :accents="accents", 
        :activeColor="activeColor", 
        @play="play = !play",
        @updateIndex="updateIndex", 
        @addColor="addColor", 
        @changeColor="changeColor",
        @incrementFps="incrementFps")
        //- buttons
        button#info-link.button(@click="infoVisible = !infoVisible", v-show="btnVisible('Info')", :style="'background:' + accents[3]") ?
        button#all-link.button.icon(
        title="View All", 
        v-if="frames.length > 0", 
        v-show="btnVisible('All')", 
        @click="view('All')", 
        :style="'background-color:' + accents[3]")
        button#add-link.button.icon(
        v-show="btnVisible('Add')", 
        @click="view('Add')", 
        :style="'background-color:' + accents[3]", 
        :class="{'button--close': $route.name === 'Add'}")
        button#fps-link.button.icon(
        title="Edit Frame Rate", 
        v-if="frames.length > 0",
        v-show="btnVisible('Fps')",  
        @click="view('Fps')",
        :style="'background-color:' + accents[3]",
        :class="{'button--close': $route.name === 'Fps'}")
    //- modals
    modal(v-show="infoVisible", @click="infoVisible = false", :background="accents[3]", text=`<p>Hi&nbsp; :-)</p><p>"What is this?"</p><p>This is a decentralized app (dApp) inspired by the flicker films of the late artist Paul&nbsp;Sharits.</p><p>The film is hosted on the Ethereum Blockchain. You can add colors by using an identity manager like <a href='https://aepps.com' target='_blank' rel='noopener'>Aepps.com's</a> or <a href='https://metamask.io/' target='_blank' rell='noopener'>Meta Mask</a>, while on the Rinkeby Test Network.</p><p><a href='https://github.com/evvvritt/flicker-chain' target="_blank" rel="noopener">GitHub</a></p>`, @close="infoVisible = false")
</template>

<script>
import Loader from '@/components/Loader'
import Modal from '@/components/Modal'
// utils
import Web3Utils from 'web3-utils'
import tinycolor from 'tinycolor2'
import FlickerFilmContract from '../dapp-scratch-wrapper/FlickerFilmContract'
let filmContract = new FlickerFilmContract()
export default {
  name: 'app',
  components: {
    Loader,
    Modal
  },
  data () {
    return {
      readOnly: false,
      loading: true,
      loader: true,
      filmCount: 0,
      film: [],
      frames: [],
      index: 0,
      framesPerSec: 8,
      interval: null,
      play: false,
      infoVisible: false
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
      return this.frames[this.frames.length - 1]
    },
    accents () {
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
    view (name) {
      if (this.$route.name === name) return this.$router.go(-1)
      return this.$router.push({name: name})
    },
    btnVisible (name) {
      return this.$route.meta.buttons.indexOf(name) > -1 && !this.play && !this.infoVisible
    },
    updateIndex (index) {
      this.index = index
    },
    incrementFps (value = 1) {
      this.framesPerSec = this.framesPerSec + value < 0 ? 0 : this.framesPerSec + value
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
      if (this.readOnly) {
        this.infoVisible = true
        return
      }
      const code = this.encodeColor(color, length)
      if (code) {
        this.loader = true
        return filmContract.addColor(code).then(() => {
          return setTimeout(() => this.getFilm(), 0) // process.env.CALL_DELAY)
        })
      }
    },
    changeColor (index = -1, color, length) {
      if (this.readOnly || index < 0) return false
      const code = this.encodeColor(color, length)
      if (code) {
        return filmContract.changeColor(code, index).then(() => {
          return this.getFilm()
        })
      }
    },
    init () {
      // watch for read only
      window.eventBus.$on('readOnly', () => {
        console.log('read only')
        this.readOnly = true
      })
      // get film after contract is constructed
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
@import './style/variables';

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
  font-weight: 300;
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

  a{
    &, &:link, &:visited{
      color:inherit;
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
    &.button--close{
      transform:rotate(-135deg);
      background-color:transparent !important;
      box-shadow:none;
      &:after{
        background-image:url('./assets/add-btn__plus.svg');
      }
    }
  }

  .icon{
    &:after{
      content:'';
      display:block;
      background-size:100% auto;
      background-repeat:no-repeat;
      background-position:center center;
    }
  }

  #info-link{
    position: fixed;
    @include btnPos($frameWidth, 'top', 'left');
    font-size:2rem;
  }

  #add-link{
    position: fixed;
    @include btnPos($frameWidth);
    &:after{
      background-image:url('./assets/add-btn__plus.svg');
      width:2rem;
      height:2rem;
    }
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

  #fps-link{
    position: fixed;
    @include btnPos($frameWidth, 'bottom', 'left');
    &:after{
      width:2.25rem;
      height:2.25rem;
    }
    &:not(.button--close):after{
      background-image:url('./assets/Stopwatch.svg');
    }
    &.button--close{
      transform:rotate(45deg);
    }
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
    #add-link{
      @include btnPos($frameWidthPortrait);
    }
    #fps-link{
      @include btnPos($frameWidthPortrait, 'left', 'bottom'); 
    }
    #all-link{
      @include btnPos($frameWidthPortrait, 'top', 'right');
    }
    #info-link{
      @include btnPos($frameWidthPortrait, 'top', 'left');
    }
  }
}
</style>
