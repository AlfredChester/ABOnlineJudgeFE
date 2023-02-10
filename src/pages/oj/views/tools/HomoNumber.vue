<template>
  <panel class="container">
    <div slot="title" style="font-size: xx-large; margin-top: 3px;">
      {{ $t('m.Homo_Number_Generator') }}
    </div>
    <div class="content">
      <Input v-model="sourceNumber"
             size="large" placeholder="输入一个数罢"
             @on-change="toHomo">
      </Input>
      <div v-katex key="content" v-html="result"  
           class="result markdown-body">
      </div>
    </div>
  </panel>
</template>


<script>
  import HomoUtil from '@/utils/homo'

  export default {
    data() {
      return {
        sourceNumber: '',
        result: ''
      }
    },
    methods: {
      toHomo() {
        if (this.sourceNumber === '') {
          this.result = ''
          return
        }
        this.result = String(
          HomoUtil.homo(Number(this.sourceNumber))
        )
        this.result = '$ ' + this.result + ' $'
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
      .result {
        margin-top: 20px;
        margin-left: 50px;
        margin-right: 50px;
      }
    }
  }
</style>