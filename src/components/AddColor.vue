<template lang="pug">
  .screen
    .preview
      div(:style="'background-color:' + activeColor", @click="previewColor = activeColor")
      div.preview-color(:style="'background-color:' + previewColor", @click="$emit('addColor', previewColor, quantity)")
    nav.palette
      .row
        button(style="background-color:black", @click="previewColor = 'black'")
        button(style="background-color:gray", @click="previewColor = 'gray'")
        button(style="background-color:white", @click="previewColor = 'white'")
      .row
        button(v-for="color in analogous", :style="'background-color:' + color", @click="previewColor = color")
      .row
        button(v-for="color in tetrad", :style="'background-color:' + color", @click="previewColor = color")
      .row
        button.icon-eyedropper(@click="pickerVisible = !pickerVisible")
        button.quantity-toggle-btn(@click="sliderVisible = true") x{{quantity}}
      .palette-modal.is-overlay(v-show="pickerVisible")
        .is-overlay(@click="pickerVisible = false")
        picker(:value="{hex: previewColor}", :disableAlpha="true", @input="update")
      .palette-modal.is-overlay(v-show="sliderVisible")
        .is-overlay(@click="sliderVisible = false")
        slider(v-if="sliderVisible", v-model="quantity", direction="vertical", :width="6", height="40%", :min="1", :max="20", :tooltip="false")
</template>

<script>
import tinycolor from 'tinycolor2'
import { Sketch } from 'vue-color'
import slider from 'vue-slider-component'
export default {
  name: 'AddColor',
  props: ['activeColor'],
  components: {
    'picker': Sketch,
    slider
  },
  data () {
    return {
      defaultColor: tinycolor.random().toHexString(),
      previewColor: this.activeColor,
      pickerVisible: false,
      quantity: 1,
      sliderVisible: false
    }
  },
  computed: {
    analogous () {
      const color = !this.activeColor ? this.defaultColor : this.activeColor
      const colors = tinycolor(color).analogous(5, 30)
      colors.shift()
      colors.splice(2, 1)
      return colors.map((color) => color.toHexString())
    },
    tetrad () {
      const color = !this.activeColor ? this.defaultColor : this.activeColor
      const colors = tinycolor(color).tetrad()
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
  overflow:hidden;
  align-items: stretch;
  > * {
    flex: 1;
  }
}
.preview{
  cursor: pointer;
  display: flex;
  flex-direction:column;
  > div{
    flex:1;
  }
}
.preview-color{
  display: flex;
  justify-content: center;
  align-items: center;
  &:after{
    content:'';
    display: block;
    background-image:url('../assets/big-plus.svg');
    background-size:contain;
    background-position:center center;
    background-repeat:no-repeat;
    width:8vmax;
    height:8vmax;
    mix-blend-mode:difference;
  }
}
.palette{
  position: relative;
  background:white;
  display: flex;
  flex-direction:column;
  > .row{
    flex: 1;
    display: flex;
    align-items: stretch;
    > *{
      width:calc(100% / 3);
    }
  }
  .palette-modal{
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
.quantity-toggle-btn{
  font-size:2em;
}
.slider-outer{
  width:100%;
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