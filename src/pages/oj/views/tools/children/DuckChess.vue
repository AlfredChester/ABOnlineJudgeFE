<template>
  <iframe src="/static/games/DuckchessOnline/index.html"
          class="DuckChessFrame">
  </iframe>
</template>

<script>
export default {
  name: 'DuckChess'
}
</script>

<style lang="less">
  .DuckChessFrame {
    width: 100%;
    height: 80vh;
    border: none;
  }
</style>