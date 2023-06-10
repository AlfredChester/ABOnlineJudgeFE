<template>
  <panel class="container">
    <div slot="title" style="font-size: xx-large; margin-top: 3px;">
      {{ $t('m.Code_Compresser') }}
    </div>
    <div class="content">
      <CodeMirror :value.sync="code"
                  :languages="languages"
                  :language="language"
                  @resetCode="onResetToTemplate"
                  @changeLang="onChangeLang">
      </CodeMirror>
      <Button v-on:click="compressCode">
        压缩!
      </Button>
      <Button v-on:click="downloadCode" type="primary">
        下载
      </Button>
    </div>
  </panel>
</template>

<script>
  import download from 'downloadjs'
  import CodeMirror from '@oj/components/CodeMirror.vue'
  import CppCompressUtil from '@/utils/cpp_compress'
  // import JsCompressUtil from 'yuicompressor'

  export default {
    components: {
      CodeMirror
    },
    data() {
      return {
        code: '',
        language: 'C++',
        languages: [
          'C', 'C++', 'JavaScript'
        ]
      }
    },
    methods: {
      onResetToTemplate() {
        this.$Modal.confirm({
          content: this.$i18n.t('m.Are_you_sure_you_want_to_reset_your_code'),
          onOk: () => {
            this.code = ''
          }
        })
      },
      onChangeLang(newLang) {
        this.language = newLang
      },
      compressCode() {
        if (this.language === 'C' || this.language === 'C++') {
          this.code = CppCompressUtil.compress(this.code)
          this.$success(this.$i18n.t('m.Succeeded'))
        } else if (this.language === 'JavaScript') {
          this.$success(this.$i18n.t('m.Succeeded'))
        }
      },
      downloadCode() {
        if (this.language === 'C') {
          download(this.code, 'compressed.c', 'text/plain')
        } else if (this.language === 'C++') {
          download(this.code, 'compressed.cpp', 'text/plain')
        } else if (this.language === 'JavaScript') {
          download(this.code, 'compressed.js', 'text/plain')
        }
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
      .CodeMirror-scroll {
        min-height: 50vh !important;
        max-height: 60vh !important;
      }
    }
  }
</style>