<template>
  <panel class="container">
    <div slot="title" class="bigger_title">
      {{ $t('m.DownloadPage') }}
    </div>
    <div class="content markdown-body">
      <span class="MaterialType" 
        v-for="MaterialType in Downloads">
        <h1 class="Mat_title">
          {{ MaterialType.title }}
        </h1>
        <!--Normal files-->
        <Row v-for="single in MaterialType.datas" 
             class="type_row" :key="single.src">
          <Col span="23">
            <li class="ele_title">
              {{ single.title }}
            </li>
          </Col>
          <Col span="1">
            <a :href="single.src" v-if="!single.src.endsWith('.jpg')">
              <Button 
                :size="buttonSize" icon="ios-download-outline" 
                type="primary" style="text-align:right;">
                {{ $t('m.Download_i18n') }}
              </Button>
            </a>
            <span v-else>
              <Button
                :size="buttonSize" icon="ios-eye-outline" 
                type="primary" style="text-align:right;"
                @click="previewImg(
                  'http://alfredoj.natapp1.cc' + single.src
                )">
                {{ $t('m.preview') }}
              </Button>
            </span>
          </Col>
        </Row>
        <!--Pdf preview-->
        <Row v-for="single in MaterialType.pdfDatas" 
             class="type_row" :key="single.src">
          <!--File name-->
          <Col span="23">
            <li class="ele_title">
              {{ single.title }}
            </li>
          </Col>
          <Col span="1">
            <Button
              :size="buttonSize" icon="ios-eye-outline" 
              type="primary" style="text-align:right;"
              v-on:click="handleSwitching(single.title)">
              {{ $t('m.preview') }}
            </Button>
          </Col>
          <Card :padding="0" v-if="single.show">
            <div style="margin: 10px 10px;">
              <!--Sidebar icons-->
              <div style="display: flex;">
                <ButtonGroup vertical>
                  <Button 
                    icon="md-close"
                    v-on:click="handleSwitching(single.title)">
                  </Button>
                  <Button 
                    icon="ios-arrow-up"
                    v-on:click="handlePageSwitching(single, 'up')">
                  </Button>
                  <Button 
                    icon="ios-arrow-down"
                    v-on:click="handlePageSwitching(single, 'down')">
                  </Button>
                  <Button 
                    icon="ios-download-outline"
                    v-on:click="downloadPdf(single)">
                  </Button>
                </ButtonGroup>
              </div>
              <!--Pdf Preview-->
              <div v-if="single.loadingRatio !== 1" 
                class="loading_div">
                <Spin class="img">
                  <Icon 
                    type="ios-loading" size=50
                    class="demo-spin-icon-load">
                  </Icon>
                </Spin>
                <br/>
                玩命加载中
              </div>
              <pdf
                v-show="single.loadingRatio === 1"
                ref="pdf"
                :key="single.currentPage"
                :src="single.src"
                :page="single.currentPage"
                style="margin-top: -175px;"
                @progress="single.loadingRatio = $event">
              </pdf>
            </div>  
          </Card>
        </Row>
      </span>
    </div>
  </panel>
</template>

<script>
  import pdf from 'vue-pdf'
  import 'viewerjs/dist/viewer.css'
  import { mapGetters } from 'vuex'
  import { api as viewerApi } from 'v-viewer'
  import utils from '@/utils/utils'
  
  function requireListening(grade) {
    return require(`../../../../assets/Listenings/${grade}/${grade}.zip`)
  }

  function requireGeography(grade) {
    return require(`../../../../assets/Geography/${grade}/index.zip`)
  }

  function requireChinese(name) {
    return require(`../../../../assets/ChinesePack/${name}`)
  }

  function requirePdf(_title, sum) {
    return {
      title: _title,
      src: '/static/Docs/' + _title + '.pdf',
      pageSum: sum,
      show: false,
      currentPage: 1,
      loadingRatio: 0,
      downloadName: _title + '.pdf'
    }
  }

  export default {
    name: 'Downloads',
    components: {
      pdf
    },
    data() {
      return {
        buttonSize: 'large',
        Downloads: {
          Exercises: {
            title: '模拟卷/练习卷',
            datas: [],
            pdfDatas: [
              requirePdf('Unit 8   Reading ABCD', 7),
              requirePdf('英语初一上学期期中考试-市北', 8),
              requirePdf('7A 市北期中 听力文字及参考答案', 4)
            ]
          },
          Listening: {
            title: '听力部分',
            datas: [
              {
                title: '7A初中英语听力训练 zip压缩包',
                src: requireListening('7A')
              }
            ],
            pdfDatas: []
          },
          Geography: {
            title: '地理配套光盘',
            datas: [
              {
                title: '上海版地理（六年级第一、二学期）配套光盘-2021',
                src: requireGeography(6)
              },
              {
                title: '上海版地理（七年级第一、二学期）配套光盘-2022',
                src: requireGeography(7)
              }
            ],
            pdfDatas: []
          },
          Chinese: {
            title: '语文学习资料包',
            datas: [
              {
                title: '现代文阅读笔记',
                src: requireChinese('现代文阅读.jpg')
              },
              {
                title: '期中考试复习范围',
                src: requireChinese('mid-term.jpg')
              },
              {
                title: '单元练习2家默范围及要求',
                src: requireChinese('单元练习2家默范围及要求.jpg')
              },
              {
                title: '期末考试复习范围',
                src: requireChinese('7Afinal.jpg')
              }
            ],
            pdfDatas: [
              requirePdf('《两小儿辩日》（翻译＋内容理解）', 15),
              requirePdf('《书戴嵩画牛》', 22),
              requirePdf('《学弈》文学常识及翻译', 8),
              requirePdf('《学弈》内容理解', 5),
              requirePdf('《伯牙鼓琴》', 18),
              requirePdf('《朝花夕拾》阅读任务单1', 2),
              requirePdf('《陈太丘与友期行》（全）', 16),
              requirePdf('《观沧海》课件', 12),
              requirePdf('《天净沙•秋思》课件', 12),
              requirePdf('《咏雪》（全）', 16),
              requirePdf('《论语》十二章（全）', 21),
              requirePdf('《诫子书》（全）', 17),
              requirePdf('《诫子书》家默卷及参考答案', 2),
              requirePdf('《狼》课件（全）', 32),
              requirePdf('《狼》家默卷及答案', 3),
              requirePdf('《穿井得一人》课件', 16),
              requirePdf('《穿井得一人》家默卷', 1),
              requirePdf('杞人忧天 课件', 17),
              requirePdf('期中综合练习卷二', 5),
              requirePdf('期中综合练习卷三', 5),
              requirePdf('期中综合二及综合三现代文阅读参考答案', 1),
              requirePdf('风华初级中学2021学年第一学期七年级语文阶段单元练习(3)', 4),
              requirePdf('单元练习二文言文讲评', 14),
              requirePdf('作文《我懂得了爱》写作指导', 5),
              requirePdf('7A 语文复习本--by 吴宇桐', 8),
              requirePdf('周末练习七', 2)
            ]
          },
          truth: {
            title: '真 理 诞 生 于 一 百 块 钱 之 后',
            datas: [],
            pdfDatas: [
              requirePdf('七上地理练习册答案', 7),
              requirePdf('七年级上科学练习册答案', 68),
              requirePdf('上海练习册道德与法治七年级（全一册）(7)', 16),
              requirePdf('中国历史第一册练习部分参考答案', 16),
              requirePdf('中国历史第二册练习部分参考答案', 12)
            ]
          }
        },
        AllImage: []
      }
    },
    mounted() {
      for (var _name in this.Downloads) {
        for (var _file of this.Downloads[_name].datas) {
          if (_file.src.endsWith('.jpg')) {
            this.AllImage.push(_file.src)
            console.log(`[handleSwitching/DownloadPage.vue] Added ${_file.src} to AllImage`)
          }
        }
      }
    },
    methods: {
      previewImg(url) {
        let AIMG = this.AllImage
        AIMG = AIMG.sort((a, b) => {
          return a === url ? 1 : -1
        })
        console.log('[oj/DownloadPage.vue] All images (sorted):', AIMG)
        const $viewer = viewerApi({
          images: AIMG
        })
        console.log('[oj/DownloadPage.vue] Viewer object:', $viewer)
      },
      print(obj) {
        console.log(obj)
      },
      downloadPdf(obj) {
        utils.realAxiosGet(
          obj.src, {
            responseType: 'blob'
          }
        ).then((res) => {
          const url = window.URL.createObjectURL(res.data)
          const link = document.createElement('a')
          let fileName = obj.downloadName
          console.log('[oj/DownloadPage.vue] fileName is', fileName)
          link.href = url
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
        })
      },
      goRoute(url) {
        window.location.href = url
      },
      handleSwitching(title) {
        for (var name in this.Downloads) {
          this.Downloads[name].pdfDatas.forEach(element => {
            if (element.title !== title) {
              element.show = false
            } else {
              element.show = !element.show
              console.log('[oj/DownloadPage.vue] loading ratio: ', element.loadingRatio)
            }
          })
        }
      },
      handlePageSwitching(element, mode) {
        if (mode === 'up' && element.currentPage > 1) {
          element.currentPage -= 1
        } else if (mode === 'down' && element.currentPage < element.pageSum) {
          element.currentPage += 1
        } else {
          this.$info('没有这一页哦 ^_^')
        }
      }
    },
    computed: {
      ...mapGetters(['isAuthenticated', 'isAdminRole'])
    }
  }
</script>

<style scoped lang="less">
  .container {
    margin-bottom: 20px;
    .bigger_title {
      font-size: xx-large; 
      margin-top: 3px;
    }
    .content {
      font-size: 16px;
      margin: 0 50px 20px 50px;
      >ul {
        list-style: disc;
        li {
          line-height: 2;
          .title {
            font-weight: 500;
          }
        }
      }
      .MaterialType {
        margin-bottom: 10px;
        .Mat_title {
          margin-top:15px; 
          margin-bottom: 15px;
        }
        .type_row {
          margin-bottom: 5px;
          .ele_title {
            margin-top:6px; 
            margin-bottom: 6px;
          }
          .loading_div {
            margin-top: -175px; 
            text-align: center;
            .img {
              display: block;
              width: 200px;
              height: 150px;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              margin: auto;
              font-size: 18px;
              color: rgb(1, 1, 1);
            }
          }
        }
      }
    }
    .demo-spin-icon-load {
      animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
      from {
        transform: rotate(0deg);
      }
      50% {
        transform: rotate(180deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }
</style>