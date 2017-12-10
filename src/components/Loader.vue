<template lang="pug">
  .loader.is-overlay.flex.flex-center
    div
</template>

<script>
export default {
  name: 'Loader',
  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
.loader{
  position: fixed;
  z-index:90;
  > div{
    width:6rem;
    height:6rem;
    background:white;
    border-radius:100rem;
    overflow:hidden;
    position: relative;
    animation: spin 4s infinite;
    // filter:blur(3px);
    box-shadow:0 2px 4px rgba(0,0,0,.25);
    &:after{
      content:'';
      display: block;
      position: absolute;
      bottom:-5%; left:0;
      width:100%; height:55%;
      background:black;
    }
  }
}

@keyframes spin{
  0%{
    transform:rotate(0deg);
  }
  33%{
    transform:rotate(20deg);
  }
  66%{
    transform:rotate(-740deg);
  }
  100%{
    transform:rotate(-720deg);
  }
}
</style>