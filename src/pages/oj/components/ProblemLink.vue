<template>
    <a :href="'/problem/' + data._id" 
       class="problemlink" v-if="!loading">
      {{ data._id }} {{ data.title }}
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
      if (this.problemId !== 'undefined' && this.problemId !== '') {
        api.getProblemByID(this.problemId).then(res => {
          this.loading = false
          this.data = res.data.data
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
.problemlink a {
  font-weight: bolder;
}
</style>