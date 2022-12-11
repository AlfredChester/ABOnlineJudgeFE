<template>
  <div>
    <NavBar></NavBar>
    <div class="content-app">
      <transition name="fadeInUp" mode="out-in">
        <router-view></router-view>
      </transition>
      <BackTop></BackTop>
    </div>
    <div class="footer">
      <span class="wrapped">
        <span class="logo">
          <img src="../../assets/icon_small.png" height="100px"/>
        </span>
        <span class="slogan">
          <div>ABOJ,</div>
          <div>{{$t('m.OI_Dream_start')}}</div>
        </span>
        <span class="infoCard">
          <p>
            <span>            
              <a href="/status">{{$t('m.Judge_Queue')}}</a>
              |
              <a href="/about">{{$t('m.Judger')}}</a>
              |
              <a href="/FAQ">{{$t('m.FAQ')}}</a>
              |
              <a href="/ThanksPage">{{$t('m.Special_Thanks_AppVue')}}</a>
            </span>
            <br/>
            <span>
              Developed by the ABOJ Dev Team,
              <a href="mailto:abonlinejudge@163.com">Contact us.</a>
            </span>
            <br/>
            <span>
              Copyright &copy; 2022-present 
              <a href="https://github.com/FredB-mine" target="_blank">
                Dr.Alfred.
              </a>
            </span>
            <br/>
            <span>
              Powered by 
              <a href="https://github.com/QingdaoU/OnlineJudge" target="_blank">
                OnlineJudge.
              </a>
            </span>
            <br/>
            <span>
              <span class="upperBox">
                <Select 
                  placeholder="更改语言" style="width: auto;" 
                  size="small" prefix="md-globe" v-model="langCache">
                  <Option v-for="(name, _ID) in languages" 
                    :value="name" :label="_ID" :key="name">
                  </Option>
                </Select>
              </span>
              Build Version: {{version}}.
            </span>
          </p>
        </span>
      </span>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import NavBar from '@oj/components/NavBar.vue'

  export default {
    name: 'app',
    components: {
      NavBar
    },
    data() {
      return {
        version: process.env.VERSION,
        languages: {
          '简体中文': 'zh-CN',
          '繁體中文': 'zh-TW',
          'English': 'en-US'
        },
        langCache: this.$i18n.locale
      }
    },
    created() {
      try {
        document.body.removeChild(document.getElementById('app-loader'))
      } catch (e) {
      }
    },
    mounted() {
      this.getWebsiteConfig()
    },
    methods: {
      ...mapActions(['getWebsiteConfig', 'changeDomTitle'])
    },
    computed: {
      ...mapState(['website'])
    },
    watch: {
      'website'() {
        this.changeDomTitle()
      },
      '$route'() {
        this.changeDomTitle()
      },
      'langCache'() {
        // console.log(this.langCache)
        this.$i18n.locale = this.langCache
      }
    }
  }
</script>

<style lang="less">
  ::-webkit-scrollbar {
    width: 6px;
    background-color: #d8d8d8;
  }

  /* 滚动槽 */
  ::-webkit-scrollbar-track {
    border-radius:10px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #8b8a8a;
  }

  * {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  a {
    text-decoration: none;
    background-color: transparent;

    &:active,
    &:hover {
      outline-width: 0;
    }
  }


  @media screen and (max-width: 1200px) {
    .content-app {
      margin-top: 160px;
      padding: 0 2%;
    }
  }

  @media screen and (min-width: 1200px) {
    .content-app {
      margin-top: 80px;
      padding: 0 2%;
    }
  }

  .content-app {
    min-height: calc(100vh - 60px);
  }

  .footer {
    background-color: rgba(0, 0, 0, .75);
    margin-top: 20px;
    text-align: center;
    font-size: small;
    display: flex;
    .wrapped {
      vertical-align: middle;
      margin-left: auto;
      margin-right: auto;
      margin-top: 20px;
      margin-bottom: 20px;
      display: flex;
      color: white;
      .logo {
        margin-top: auto;
        margin-bottom: auto;
      }
      .slogan {
        margin-top: auto;
        margin-bottom: auto;
        margin-left: 10px;
        font-weight: bold;
        line-height: 1.5;
        font-size: 1.6em;
        text-align: left;
      }
      .infoCard {
        flex: 1;
        text-align: right;
        min-width: 50vw;
        margin-top: auto;
        margin-bottom: auto;
        .upperBox {
          margin-right: 20px;
          .ivu-select {
            .ivu-select-selection {
              background-color: unset;
              border: none;
              box-shadow: none;
              color: white;
            }
          }
        }
      }
      a {
        color: rgba(255, 255, 255, .75);
        &:active,
        &:hover {
          color: white;
        }
      }
    }
  }

  .fadeInUp-enter-active {
    animation: fadeInUp .8s;
  }
</style>
