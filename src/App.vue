<template lang="pug">
  #app.app
    router-view(:activeColor="activeColor", @play="play = !play")
    button#add-color-btn.button(v-show="!play", @click="addMode", :style="'background-color:' + colorSet[3]", :class="{'add-color-btn--back': $route.name === 'Add'}")
</template>

<script>
import tinycolor from 'tinycolor2'
import AddColor from '@/components/AddColor'
export default {
  name: 'app',
  components: {
    AddColor
  },
  data () {
    return {
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
      return this.frames[this.frames.length - 1]
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
        this.index = this.index - 1 < 0 ? this.frames.length - 1 : this.index - 1
      }, this.speed)
    }
  },
  methods: {
    addMode () {
      if (this.$route.name === 'Add') return this.$router.go(-1)
      return this.$router.push({name: 'Add'})
    },
    resetIndex () {
      this.index = this.frames.length - 1
    }
  },
  created () {
    for (var i = 0; i < 20; i++) {
      this.frames.push(tinycolor.random().toHexString())
    }
    this.resetIndex()
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
@mixin btnPos ($fw) {
  bottom:calc(#{$fw} + 1.5rem); 
  right:calc(#{$fw} + 1.5rem);
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
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width:100%; height:100vh;
  position: relative;
  
  .is-overlay{
    position: absolute;
    top:0; left:0;
    width:100%; height:100%;
  }

  button{
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
      background-image:url('./assets/add-btn__plus.svg');
      background-size:100% auto;
      background-repeat:no-repeat;
      background-position:center center;
      width:2rem;
      height:2rem;
    }
  }

  #add-color-btn{
    position: fixed;
    @include btnPos($frameWidth);
    
    &.add-color-btn--back{
      transform:rotate(-135deg);
      background-color:transparent !important;
      box-shadow:none;
    }
  }

  .screen{
    position: absolute;
    overflow:scroll;
    @include screen($frameWidth);
    border-radius:3rem;
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
