<template>
  <div>
    <panel class="container">
      <div slot="title" style="font-size: xx-large; margin-top: 10px;">
        {{ $t('m.ThanksForSupport') }}
      </div>
      <div class="content markdown-body">
        <h1>{{ $t('m.Special_Thanks') }}</h1>
        <div class="ThanksContainer">
          <span v-for="section in groups">
            <h2>{{ section.title }}</h2>
            <ul>
              <li v-for="person in section.people">
                {{ person }}
              </li>
            </ul>
          </span>
          <h2>{{ $t('m.If_you_want_to_support') }}</h2>
          <img style="max-width: 80%;" src="../../../../assets/getMoney.jpg"/>
        </div>
        <div class="iframe-container">
          <h2>Make a live</h2>
          <iframe 
            scrolling="no" border="0" frameborder="no" 
            framespacing="0" allowfullscreen="true" 
            :src="makeliveBilibiliUrl" :title="makeliveTitle">
          </iframe>
        </div>
        <div class="codePreview">
          <h1>Code Preview Test</h1>
          <previewFile 
            fileUrl="/static/codes/cpp/high-precision.h" :vfrom="true" :vprint="true">
          </previewFile>
        </div>
      </div>
    </panel>
  </div>
</template>

<script>
  import previewFile from '@oj/components/PreviewFile.vue'

  export default {
    name: 'ThanksPage',
    components: {
      previewFile
    },
    data() {
      return {
        groups: [
          {
            title: this.$i18n.t('m.TechSupport'),
            people: [
              'Dr.别贞',
              '青岛大学'
            ]
          },
          {
            title: this.$i18n.t('m.EconomicSupport'),
            people: [
              '咖喱不恰不恰牛',
              '可爱的甜甜猫'
            ]
          }
        ],
        makeliveBilibiliUrl: 'https://player.bilibili.com/player.html?aid=53851218&amp;high_quality=1',
        makeliveTitle: '新 宝 岛'
      }
    }
  }
</script>

<style scoped lang="less">
  .container {
    margin-bottom: 20px;
    
    .content {
      font-size: 16px;
      margin: 0 50px 20px 50px;
      .ThanksContainer{
        margin-left: 60px;
        h1 {
          margin-top: 30px;
        }
        ul {
          margin-left: 60px;
          list-style: disc;
          li{
            line-height: 2;
            .title {
              font-weight: 500;
            }
          }
        }
      }
      .iframe-container {
        margin: 10px;
        iframe {
          position: relative;
          top: 0px;
          left: 0px;
          width: 80%;
          min-height: 600px;
        }
      }
    }
  }
</style>
