<template lang="pug">
  .screen
    .preview
      div(:style="'background-color:' + activeColor", @click="previewColor = activeColor")
      div(:style="'background-color:' + previewColor")
    nav.palette
      div
        button(style="background-color:black", @click="previewColor = 'black'")
        button(style="background-color:gray", @click="previewColor = 'gray'")
        button(style="background-color:white", @click="previewColor = 'white'")
      div
        button(v-for="color in analogous", :style="'background-color:' + color", @click="previewColor = color")
      div
        button(v-for="color in tetrad", :style="'background-color:' + color", @click="previewColor = color")
      div
        button.icon-eyedropper(@click="pickerVisible = !pickerVisible")
      .picker-outer.is-overlay(v-show="pickerVisible")
        .is-overlay(@click="pickerVisible = false")
        picker(:value="colors", :disableAlpha="true", @input="update")
</template>

<script>
import tinycolor from 'tinycolor2'
import { Sketch } from 'vue-color'
export default {
  name: 'AddColor',
  props: ['activeColor'],
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
        hex: this.activeColor
      }
    },
    analogous () {
      const colors = tinycolor(this.activeColor).analogous(5, 30)
      colors.shift()
      colors.splice(2, 1)
      return colors.map((color) => color.toHexString())
    },
    tetrad () {
      const colors = tinycolor(this.activeColor).tetrad()
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
  display: flex;
  align-items: stretch;
  > * {
    flex: 1;
  }
}
.preview{
  display: flex;
  flex-direction:column;
  > div{
    flex:1;
  }
}
.palette{
  position: relative;
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
  .picker-outer{
    display: flex;
    align-items: center;
    justify-content: center;
    background:rgba(0,0,0,.5);
  }
}
.icon-eyedropper{
  display: flex;
  align-items: center;
  justify-content: center;
  &:after{
    content:'';
    display: block;
    background-image:url('../assets/Eyedropper.svg');
    background-size:contain;
    background-position:center center;
    background-repeat:no-repeat;
    width:6vmax;
    height:6vmax;
  }
}

@media (max-width:480px) {
  .preview{
    flex:1 0 25%;
  }
  .palette{
    flex:1 0 75%;
  }
}
</style>