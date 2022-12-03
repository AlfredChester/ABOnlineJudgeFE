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
      <!-- <img src="../../assets/icon_small.png" height="100px"/>
      <p>CopyRight &copy; 2022-present Dr.Alfred</p>
      <p>
        Powered by 
        <a href="https://github.com/QingdaoU/OnlineJudge">
          OnlineJudge
        </a>, Owner:Alfred
      </p>
      <p>
        Ver: {{version}}
      </p> -->
      <span class="wrapped">
        <span class="logo">
          <img src="../../assets/icon_small.png" height="100px"/>
        </span>
        <span class="slogan">
          <div>ABOJ</div>
          <div>OI梦的开始</div>
        </span>
        <span class="infoCard">
          <p>
            <span>            
              <a href="/status">评测队列</a>
              |
              <a href="/about">评分细则</a>
              |
              <a href="/FAQ">常见问题</a>
              |
              <a href="/ThanksPage">特别鸣谢</a>
            </span>
            <br/>
            <span>
              Developed by the ABOJ Dev Team 
            </span>
            <br/>
            <span>
              CopyRight &copy; 2022-present Dr.Alfred
            </span>
            <br/>
            <span>
              Powered by 
              <a href="https://github.com/QingdaoU/OnlineJudge">
                OnlineJudge
              </a>
            </span>
            <br/>
            <span>
              Build Version: {{version}}
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
        version: process.env.VERSION
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
      // vertical-align: middle;
      margin-left: auto;
      margin-right: auto;
      margin-top: 20px;
      margin-bottom: 20px;
      display: flex;
      color: white;
      .slogan {
        margin-top: auto;
        margin-bottom: auto;
        font-weight: bold;
        line-height: 1.5;
        font-size: 1.6em;
      }
      .infoCard {
        flex: 1;
        text-align: right;
        min-width: 50vw;
        margin-top: auto;
        margin-bottom: auto;
        a {
          color: white;
        }
      }
    }
  }

  .fadeInUp-enter-active {
    animation: fadeInUp .8s;
  }
</style>
