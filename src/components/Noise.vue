<template lang="pug">
</template>

<script>
import tinycolor from 'tinycolor2'
import _throttle from 'lodash/throttle'
import addAudioFunctions from '@/plugins/noise'
export default {
  name: 'Noise',
  props: ['activeColor', 'isPlaying'],
  data () {
    return {
      context: null,
      brown: null,
      white: null,
      pink: null
    }
  },
  computed: {
    pitch () {
      return tinycolor(this.activeColor).toHsl().s
    }
  },
  watch: {
    pitch (pitch) {
      if (this.isPlaying) {
        this.playSoundByValue(pitch)
      }
    },
    isPlaying (playing) {
      if (!playing) this.mute()
    }
  },
  methods: {
    play (key) {
      this[key].connect(this.context.destination)
    },
    pause (key) {
      this[key].disconnect()
    },
    playSoundByValue: _throttle(function (value) {
      value = value * 100
      this.mute()
      if (value <= 20) {
        // this.play('brown')
      } else if (value <= 60) {
        this.play('brown')
        // this.play('pink')
      } else if (value <= 75) {
        this.play('pink')
      } else if (value <= 90) {
        this.play('pink')
        this.play('white')
      } else {
        this.play('white')
      }
    }, 5),
    mute () {
      this.pause('pink')
      this.pause('brown')
      this.pause('white')
    }
  },
  created () {
    addAudioFunctions()
    if (this.context === null) {
      this.context = new AudioContext()
      this.brown = this.context.createBrownNoise()
      this.white = this.context.createWhiteNoise()
      this.pink = this.context.createPinkNoise()
    }
  }
}
</script>

<style lang="scss" scoped>
div{
  position: fixed;
  top:0; left:0;
  z-index:200;
  background:white;
}
button{
    font-size:4em;
  }
</style>