<template>
  <div v-if="loaded">
    <panel class="content" v-for="pContent of content" 
      :key="pContent.title" :id="pContent.id">
      <div slot="title">
        {{ pContent.title }}
      </div>
      <div v-katex v-html="pContent.content" key="content" 
            class="content-container markdown-body">
      </div>
    </panel>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import utils from '@/utils/utils'

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
      loadRealData() {
        this.loaded = false
        for (var i = 0; i < this.content.length; i++) {
          let that = this.content[i]
          utils.realAxiosGet(this.content[i].url).then(data => {
            that.content = data.data
          })
        }
        this.loaded = true
      },
      init() {
        if (this.dataFetchCache === undefined) {
          utils.realAxiosGet('/static/configs/license.json').then(data => {
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