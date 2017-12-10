<template lang="pug">
  .modal.is-overlay.flex.flex-center(@click="$emit('close')")
    section(:style="'background:' + background", @click.stop="doNothing")
      div(v-html="text")
      button.button.button--close.icon(@click="$emit('close')")
</template>

<script>
export default {
  name: 'Modal',
  props: ['text', 'background'],
  data () {
    return {

    }
  },
  methods: {
    doNothing () {}
  }
}
</script>

<style lang="scss">
@import '../style/variables';

.modal{
  position: fixed;
  padding:$frameWidth/8;
  font-size:6vw;


  > section{
    position: relative;
    border-radius:2.5rem;
    padding: 4vmax;
    @include screen($frameWidth);
    top: auto; left:auto;
    overflow-y:scroll;
    &::-webkit-scrollbar { 
      display: none; 
    }
    
    .button{
      position: absolute;
      top:1rem; right:1rem;
      z-index: 100;
      &:after{
        background-image:url('../assets/add-btn__plus.svg');
        width:2rem;
        height:2rem;
      }
    }

    > div{
      max-width: 30em;
      max-blend-mode:difference;
    }
  }

  p{
    & + p{
      margin-top: 1em;
    }
  }

  @media (orientation:portrait) {
    > section{
      @include screen($frameWidthPortrait);
      top: auto; left:auto;
    }
  }
}
</style>