<template>
  <div>
    <NavBar></NavBar>
    <div class="content-app">
      <transition name="fadeInUp" mode="out-in">
        <router-view></router-view>
      </transition>
      <BackTop></BackTop>
    </div>
    <MyFooter></MyFooter>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import NavBar from '@oj/components/NavBar.vue'
  import MyFooter from '@oj/components/Footer.vue'

  export default {
    name: 'app',
    components: {
      NavBar,
      MyFooter
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

  .fadeInUp-enter-active {
    animation: fadeInUp .8s;
  }
</style>
