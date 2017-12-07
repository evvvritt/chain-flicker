<template lang="pug">
  #player.screen(:style="'background-color:' + activeColor", @click="$emit('play')")
</template>

<script>
export default {
  name: 'Player',
  props: ['activeColor', 'isPlaying'],
  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
#player{
  filter:blur(3px);
  cursor: pointer;
}
</style>