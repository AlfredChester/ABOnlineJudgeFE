<template>
  <pre v-highlight="code"><code :class="language" :style="styleObject"></code></pre>
</template>

<script>
export default {
  name: 'highlight',
  data() {
    return {
      styleObject: {
        'border-left': 'none'
      }
    }
  },
  props: {
    language: {
      type: String
    },
    code: {
      required: true,
      type: String
    },
    borderColor: {
      type: String,
      default: 'none'
    }
  },
  watch: {
    'borderColor'(newVal, oldVal) {
      console.log(newVal)
      if (newVal === 'none') {
        this.styleObject = {}
      } else {
        this.styleObject['border-left'] = '2.5px solid ' + newVal
      }
    }
  }
}
</script>

<style scoped lang="less">
pre {
  padding: 0;
  // display: block;

  code {
    padding: 20px;
    font-size: 1.1em;
  }
}
</style>
