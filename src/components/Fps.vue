<template lang="pug">
  .screen(:style="'background-color:' + accents[0]")
    div.flex.flex-center(@click="$router.go(-1)")
      span {{framesPerSec}} <span>FPS</span>
    nav(:style="'background:' + accents[2]")
      button.icon(aria-label="Increase Frame Rate", @click="$emit('incrementFps')", :style="'background:' + accents[3]")
      button.icon(aria-label="Deccrease Frame Rate", @click="$emit('incrementFps', -1)", :style="'background:' + accents[3]")
</template>

<script>
export default {
  name: 'Fps',
  props: ['framesPerSec', 'accents'],
  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
.screen{
  display: flex;
  align-items: stretch;
  overflow:hidden;
  > div{
    flex:1 0 66%;
  }
  > nav{
    flex:1 0 33%;
  }
}

nav{
  background:white;
  display: flex;
  flex-direction:column;
  > * {
    flex:1 0 auto;
    &:nth-last-child(n + 2) {
      // border-bottom:1px solid black;
    }
  }
}

.icon{
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  &:after{
    position: relative;
    background-image:url('../assets/add-btn__plus.svg');
    width:2rem;
    height:2rem;
    z-index:10;
  }
  &:last-child{
    &:after{
      background-image:url('../assets/Minus.svg');  
    }
  }
  &:active{
    background:transparent !important;
  }
}

span{
  font-size:8vmax;
  span{
    font-size:32%;
    font-weight: bolder;
  }
}
</style>