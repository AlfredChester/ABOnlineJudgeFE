<template>
  <div id="header">
    <Menu theme="light" mode="horizontal" @on-select="handleRoute" :active-name="activeMenu" class="oj-menu">
      <div class="logo">
        <a href="/">
          <img src="../../../assets/title.png"/>
        </a>
      </div>
      <Menu-item name="/">
        <Icon type="md-home"></Icon>
        {{ $t('m.Home') }}
      </Menu-item>
      <Menu-item name="/problem">
        <Icon type="ios-keypad"></Icon>
        {{ $t('m.NavProblems') }}
      </Menu-item>
      <Menu-item name="/contest">
        <Icon type="ios-trophy"></Icon>
        {{ $t('m.Contests') }}
      </Menu-item>
      <Menu-item name="/status">
        <Icon type="ios-pulse"></Icon>
        {{ $t('m.NavStatus') }}
      </Menu-item>
      <Submenu name="rank">
        <template slot="title">
          <Icon type="ios-podium"></Icon>
          {{ $t('m.Rank') }}
        </template>
        <Menu-item name="/acm-rank">
          {{ $t('m.ACM_Rank') }}
        </Menu-item>
        <Menu-item name="/oi-rank">
          {{ $t('m.OI_Rank') }}
        </Menu-item>
      </Submenu>
      <Submenu name="materials">
        <template slot="title">
          <Icon type="ios-book"></Icon>
          {{$t('m.Learning_Materials')}}
        </template>
        <Menu-item name="/listening">
          {{$t('m.ListeningPage')}}
        </Menu-item>
        <Menu-item name="/downloadCollection">
          {{$t('m.DownloadPage')}}
        </Menu-item>
      </Submenu>
      <Submenu name="tools">
        <template slot="title">
          <Icon type="ios-hammer"></Icon>
          {{ $t('m.Tools') }}
        </template>
        <Menu-item name="/code_compresser">
          <Icon type="ios-folder"></Icon>
          {{ $t('m.Code_Compresser') }}
        </Menu-item>
        <Menu-item name="/homoGenerator">
          <Icon type="ios-infinite"></Icon>
          {{ $t('m.Homo_Number_Generator') }}
        </Menu-item>
      </Submenu>
      <Submenu name="about">
        <template slot="title">
          <Icon type="ios-information-circle"></Icon>
          {{ $t('m.About') }}
        </template>
        <Menu-item name="/about">
          {{ $t('m.Judger') }}
        </Menu-item>
        <Menu-item name="/tos">
          {{ $t('m.license') }}
        </Menu-item>
        <Menu-item name="/FAQ">
          {{ $t('m.FAQ') }}
        </Menu-item>
        <Menu-item name="/ThanksPage">
          {{ $t('m.ThanksPage') }}
        </Menu-item>
      </Submenu>
      <!--Not logged in BEGIN-->
      <template v-if="!isAuthenticated">
        <div class="btn-menu">
          <Button ref="loginBtn"
                  shape="circle"
                  @click="handleBtnClick('login')">
                  {{ $t('m.Login') }}
          </Button>
          <Button v-if="website.allow_register" 
                  shape="circle"
                  @click="handleBtnClick('register')"
                  style="margin-left: 5px;">
                  {{ $t('m.Register') }}
          </Button>
        </div>
      </template>
      <!--Not logged in END-->
      <!--Logged In BEGIN-->
      <template v-else>
        <Dropdown class="drop-menu" @on-click="handleRoute" placement="bottom" trigger="click">
          <Button type="text" class="drop-menu-title">
            <Avatar :src="avatar"></Avatar>
            {{ user.username }}
            <Icon type="md-arrow-dropdown"></Icon>
          </Button>
          <Dropdown-menu slot="list">
            <Dropdown-item name="/user-home">{{ $t('m.MyHome') }}</Dropdown-item>
            <Dropdown-item name="/status?myself=1">{{ $t('m.MySubmissions') }}</Dropdown-item>
            <Dropdown-item name="/setting/profile">{{ $t('m.Settings') }}</Dropdown-item>
            <Dropdown-item v-if="isAdminRole" name="/admin">{{ $t('m.Management') }}</Dropdown-item>
            <Dropdown-item divided name="/logout">{{ $t('m.Logout') }}</Dropdown-item>
          </Dropdown-menu>
        </Dropdown>
      </template>
      <!--Logged in END-->
    </Menu>
    <Modal v-model="modalVisible" :width="400">
      <div slot="header" class="modal-title">
        {{ $t('m.Welcome_to') }} {{ website.website_name_shortcut }}
      </div>
      <component :is="modalStatus.mode" v-if="modalVisible"></component>
      <div slot="footer" style="display: none"></div>
    </Modal>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import api from '@oj/api'
  import login from '@oj/views/user/Login'
  import register from '@oj/views/user/Register'

  export default {
    components: {
      login,
      register
    },
    data() {
      return {
        avatar: ''
      }
    },
    mounted() {
      this.getProfile()
      api.getUserInfo(this.user.username).then(data => {
        console.log('[oj/NavBar.vue]: User Avatar:', data.data.data.avatar)
        this.avatar = data.data.data.avatar
      }).catch(err => {
        console.log('[oj/NavBar.vue]: Error occured when loading avatar:')
        console.log('[oj/NavBar.vue]:', err)
      })
    },
    methods: {
      ...mapActions(['getProfile', 'changeModalStatus']),
      handleRoute(route) {
        if (route && route.indexOf('admin') < 0) {
          this.$router.push(route)
        } else {
          window.open('/admin/')
        }
      },
      handleBtnClick(mode) {
        this.changeModalStatus({
          visible: true,
          mode: mode
        })
      }
    },
    computed: {
      ...mapGetters(['website', 'modalStatus', 'user', 'isAuthenticated', 'isAdminRole']),
      // 跟随路由变化
      activeMenu() {
        return '/' + this.$route.path.split('/')[1]
      },
      modalVisible: {
        get() {
          return this.modalStatus.visible
        },
        set(value) {
          this.changeModalStatus({ visible: value })
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  #header {
    min-width: 300px;
    position: fixed;
    top: 0;
    left: 0;
    height: auto;
    width: 100%;
    z-index: 1000;
    background-color: #fff;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
    .oj-menu {
      background: #fdfdfd;
    }
    .logo {
      user-select: none;
      margin-left: 2%;
      margin-right: 2%;
      font-size: 20px;
      float: left;
      line-height: 60px;
      height: 60px;
      width: auto;
      img {
        height: 60px;
      }
    }
    .drop-menu {
      float: right;
      margin-right: 30px;
      position: absolute;
      right: 10px;
      &-title {
        font-size: 18px;
      }
    }
    .btn-menu {
      font-size: 16px;
      float: right;
      margin-right: 10px;
    }
  }
  .modal {
    &-title {
      font-size: 18px;
      font-weight: 600;
    }
  }
</style>
