<template>
  <div>
    <a :href="fileUrl" v-if="vfrom">源文件地址:{{  fileUrl  }}</a>
    <div id="container" :style="'height: ' + height + 'px;'"></div>
    <Button size="large" v-on:click="getVal" v-if="vprint">在控制台输出文件内容</Button>
  </div>
</template>

<script>
import * as monaco from 'monaco-editor'
import { loadWASM } from 'onigasm'
// import { Registry } from 'monaco-textmate'
// import { wireTmGrammars } from 'monaco-editor-textmate'
// import fetch from 'cross-fetch'

export default {
  name: 'PreviewCode',
  components: {
    monaco
  },
  data() {
    return {
      editor: null
    }
  },
  mounted() {
    const base = '/static/codes/wasm'
    const grammars = new Map()
    grammars.set('cpp', 'source.cpp')
    // console.log(grammars)
    // console.log((await fetch(`/static/configs/cppStyle.json`)).text())
    // const registry = new Registry({
    //   getGrammarDefinition: async (scopeName) => {
    //     // 语法文件格式，有json、plist
    //     return {
    //       format: 'json',
    //       content: await (await fetch(`/static/configs/cppGrammar.json`)).text()
    //     }
    //   }
    // })
    // console.log(registry)
    // console.log(themeData)
    var realSrc
    if (process.env.NODE_ENV === 'development') {
      realSrc = 'http://localhost:8080/static/configs/OneDarkPro.json'
    } else {
      realSrc = 'http://alfredoj.natapp1.cc/static/configs/OneDarkPro.json'
    }
    this.$http({
      url: realSrc,
      method: 'get'
    }).then((data) => {
      // console.log(data)
      monaco.editor.defineTheme('OneDarkPro', data.data)
      monaco.editor.setTheme('OneDarkPro')
      // console.log(monaco.editor)
    })
    // /static/configs/OneDarkPro.json
    // cppStyleConverted.json
    // console.log(registry)
    const init = async () => {
      await loadWASM(`${base}/onigasm.wasm`)
      this.initEditor()
    }
    init()
    // wireTmGrammars(monaco, registry, grammars, this.editor)
  },
  props: {
    fileUrl: {
      type: String,
      required: true
    },
    height: {
      type: String,
      default: '500'
    },
    darkMode: {
      type: Boolean,
      default: false
    },
    vfrom: {
      type: Boolean,
      default: false
    },
    vprint: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    initEditor() {
      var realSrc
      if (process.env.NODE_ENV === 'development') {
        realSrc = 'http://localhost:8080' + this.fileUrl
      } else {
        realSrc = 'http://alfredoj.natapp1.cc' + this.fileUrl
      }
      // console.log(realSrc)
      this.$http({
        url: realSrc,
        method: 'get'
      }).then((data) => {
        // console.log(data)
        this.editor = monaco.editor.create(document.getElementById('container'), {
          value: data.data,
          language: 'cpp',
          automaticLayout: true,
          theme: this.darkMode ? 'vs-dark' : 'vs-light'
        })
      })
    },
    getVal() {
      console.log(this.editor.getValue())
    }
  }
}
</script>

<style lang="less" scoped>

</style>