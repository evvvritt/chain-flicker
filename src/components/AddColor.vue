<template lang="pug">
  .screen
    section
      div(:style="'background-color:' + lastColor")
      div(:style="'background-color:' + previewColor")
    nav
      div
        button(style="background-color:black", @click="previewColor = 'black'")
        button(style="background-color:gray", @click="previewColor = 'gray'")
        button(style="background-color:white", @click="previewColor = 'white'")
      div
        button(v-for="color in analogous", :style="'background-color:' + color", @click="previewColor = color")
      div
        button(v-for="color in tetrad", :style="'background-color:' + color", @click="previewColor = color")
      div
        button
    picker(v-show="pickerVisible", :value="colors", :disableAlpha="true", @input="update")
</template>

<script>
import tinycolor from 'tinycolor2'
import { Sketch } from 'vue-color'
export default {
  name: 'AddColor',
  props: ['lastColor'],
  components: {
    'picker': Sketch
  },
  data () {
    return {
      previewColor: 'transparent',
      pickerVisible: false,
      tinycolor: tinycolor
    }
  },
  computed: {
    colors () {
      return {
        hex: this.lastColor
      }
    },
    analogous () {
      const colors = tinycolor(this.lastColor).analogous(5, 30)
      colors.shift()
      colors.splice(2, 1)
      return colors.map((color) => color.toHexString())
    },
    tetrad () {
      const colors = tinycolor(this.lastColor).tetrad()
      colors.shift()
      return colors.map((color) => color.toHexString())
    }
  },
  methods: {
    update (value) {
      this.previewColor = value.hex
    }
  }
}
</script>

<style lang="scss" scoped>
.screen{
  // position: fixed;
  display: flex;
  align-items: stretch;
  > section, 
  > nav{
    flex: 1;
  }
  > section{
    display: flex;
    flex-direction:column;
    > div{
      flex:1;
    }
  }
  > nav{
    background:white;
    display: flex;
    flex-direction:column;
    > div{
      flex: 1;
      display: flex;
      align-items: stretch;
    }
    button{
      width:calc(100% / 3);
    }
  }
}
</style>