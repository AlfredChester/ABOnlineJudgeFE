<template>
  <div v-if="loaded">
    <panel class="content"
      v-for="pContent of content" :key="pContent.title">
      <div slot="title">{{ pContent.title }}</div>
      <div v-katex v-html="pContent.content" key="content" class="content-container markdown-body"></div>
    </panel>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  
  const axios = require('axios')

  export default {
    data() {
      return {
        content: undefined,
        dataFetchCache: undefined,
        loaded: false
      }
    },
    mounted() {
      this.init()
    },
    computed: {
      ...mapGetters(['website'])
    },
    methods: {
      realGet(end) {
        var realSrc
        if (process.env.NODE_ENV === 'development') {
          realSrc = 'http://localhost:8080' + end
        } else {
          realSrc = 'http://alfredoj.natapp1.cc' + end
        }
        return axios.get(realSrc)
      },
      loadRealData() {
        this.loaded = false
        for (var i = 0; i < this.content.length; i++) {
          let that = this.content[i]
          this.realGet(this.content[i].url).then(data => {
            that.content = data.data
          })
        }
        this.loaded = true
      },
      init() {
        if (this.dataFetchCache === undefined) {
          this.realGet('/static/configs/license.json').then(data => {
            // console.log(data)
            this.dataFetchCache = data.data
            this.content = data.data[this.$i18n.t('m.loadedi18nType')]
            this.loadRealData()
          })
        } else {
          this.content = this.dataFetchCache[this.$i18n.t('m.loadedi18nType')]
          this.loadRealData()
        }
      }
    },
    watch: {
      '$i18n.locale' (newVal) {
        this.init()
      }
    }
  }
</script>

<style lang="less">
.content {
  margin-bottom: 20px;
  .content-container {
    margin: 0 50px 20px 50px;
    width: auto;
    p {
      margin-left: 10px;
      margin-right: 10px;
    }
    ul {
      margin-left: 35px;
      margin-right: 10px;
    }
  }
}
</style>