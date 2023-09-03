<template>
  <panel class="container">
    <div slot="title" style="font-size: xx-large; margin-top: 3px;">
      {{ $t('m.VideoPage') }}
    </div>
    <div class="content">
    </div>
  </panel>
</template>

<script>
export default {
  name: 'VideoPage',
  data() {
    return {
      shows: []
    }
  }
}
</script>

<style lang="less">
.container {
  margin-bottom: 20px;

  .content {
    font-size: 16px;
    margin: 0 50px 20px 50px;
  }
}
</style>