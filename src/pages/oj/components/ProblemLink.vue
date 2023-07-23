<template>
    <a :href="'/problem/'">
      
    </a>
  </template>
  
<script>
import api from '@oj/api'

export default {
  name: 'UserLink',
  data() {
    return {
      loading: true,
      data: undefined
    }
  },
  mounted() {
    this.reload()
  },
  props: {
    problemId: {
      required: true,
      type: String,
      default: ''
    }
  },
  methods: {
    reload() {
      if (this.problemId !== undefined && this.problemId !== '') {
        api.getProblemByID(this.problemId).then(res => {
          console.log(res.data.data)
        })
      }
    }
  },
  watch: {
    'problemId'(newVal, oldVal) {
      this.reload()
    }
  }
}
</script>
  
<style lang="less">
a {
  color: #495060;

  &:hover {
    color: #2d8cf0;
    border-bottom: none;
  }
}
</style>