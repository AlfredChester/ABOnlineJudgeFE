<template>
  <div class="container">
    <div class="avatar-container">
      <img class="avatar" :src="profile.avatar"/>
    </div>
    <Card :padding="100">
      <div v-if="profile.user">
        <p style="margin-top: -10px">
          <span v-if="profile.user" class="emphasis">
            {{ profile.user.username }}
          </span>
          <span v-if="profile.school">
            @{{ profile.school }}
          </span>
        </p>
        <p v-if="profile.mood">
          {{ profile.mood }}
        </p>
        <p v-if="adminType === 'Admin' || adminType === 'Super Admin'">
          <span v-if="profile.user.username === 'alfred'"> 
            <img src="../../../../assets/RedV.svg" class="veryfiedIcon"/>
            ABOnlineJudge站长
          </span>
          <span v-else-if="adminType === 'Admin'">
            <img src="../../../../assets/BlueV.svg" class="veryfiedIcon"/>
            网站管理员
          </span>
          <span v-else>
            <img src="../../../../assets/OrangeV.svg" class="veryfiedIcon"/>
            网站超级管理员
          </span>
        </p>
        <hr id="split"/>
        <div class="flex-container">
          <div class="left">
            <p>
              {{ $t('m.UserHomeSolved') }}
            </p>
            <p class="emphasis">
              {{ profile.accepted_number }}
            </p>
          </div>
          <div class="middle">
            <p>
              {{ $t('m.UserHomeserSubmissions') }}
            </p>
            <p class="emphasis">
              {{ profile.submission_number }}
            </p>
          </div>
          <div class="right">
            <p>
              {{ $t('m.UserHomeScore') }}
            </p>
            <p class="emphasis">
              {{ profile.total_score }}
            </p>
          </div>
        </div>
        <div id="problems">
          <div v-if="problems.length">
            {{ $t('m.List_Solved_Problems') }}
            <Poptip v-if="refreshVisible" trigger="hover" placement="right-start">
              <Icon type="ios-help-circle"></Icon>
              <div slot="content">
                <p>{{ $t('m.RegenerateContent1') }}<br>{{ $t('m.RegenerateContent2') }}</p>
                <Button type="info" @click="freshProblemDisplayID">{{ $t('m.Regenerate') }}</Button>
              </div>
            </Poptip>
          </div>
          <div v-else>
            {{ $t('m.UserHomeIntro') }}
          </div>
          <div class="btns">
            <div class="problem-btn" 
                 v-for="problemID of problems" :key="problemID">
              <Button @click="goProblem(problemID)">
                {{ problemID }}
              </Button>
            </div>
          </div>
        </div>
        <div id="icons">
          <a :href="profile.github">
            <Icon type="logo-github" size="30" color="#515a6e">
            </Icon>
          </a>
          <a :href="'mailto:' + profile.user.email">
            <Icon class="icon" type="ios-mail" size="30" color="#515a6e">
            </Icon>
          </a>
          <a :href="profile.blog">
            <Icon class="icon" type="ios-globe-outline" size="30" color="#515a6e">
            </Icon>
          </a>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import time from '@/utils/time'
  import api from '@oj/api'

  function debug(info) {
    console.log('[oj/UserHome.vue]:\n' + info)
  }

  export default {
    data() {
      return {
        username: '',
        profile: {},
        allProblems: [],
        problems: [],
        adminType: 'Normal User'
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      ...mapActions(['changeDomTitle']),
      init() {
        // 获取用户名称 undefined则为自身
        this.username = this.$route.query.username
        debug('Loading user: ' + this.username)
        // 获取基本信息
        api.getUserInfo(this.username).then(res => {
          this.changeDomTitle({
            title: res.data.data.user.username
          })
          this.profile = res.data.data
          this.adminType = res.data.data.user.admin_type
          // 获取注册时间
          let registerTime = time.utcToLocal(
            this.profile.user.create_time, 'YYYY-MM-D'
          )
          debug('The guy registered at ' + registerTime)
        })
        this.getSolvedProblems()
      },
      getSolvedProblems() {
        api.getProblemList(0, 200, {}).then(res => {
          let problemSum = res.data.data.total
          debug('Got ProblemSum: ' + problemSum)
          // 获取所有问题
          for (var offset = 0; offset < problemSum; offset += 200) {
            api.getProblemList(offset, 200, {}).then(res => {
              for (var item of res.data.data.results) {
                this.allProblems.push(item)
              }
            })
          }
        })
      },
      goProblem(problemID) {
        this.$router.push({
          name: 'problem-details',
          params: {
            problemID: problemID
          }
        })
      },
      freshProblemDisplayID() {
        api.freshDisplayID().then(res => {
          this.$success(this.$i18n.t('m.Succeeded'))
          this.init()
        }).catch(err => {
          console.log('Some error occured at freshProblemDisplayID:', err)
        })
      }
    },
    computed: {
      refreshVisible() {
        if (!this.username) {
          return true
        }
        if (this.username && this.username === this.$store.getters.user.username) {
          return true
        }
        return false
      }
    },
    watch: {
      '$route'(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.init()
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .container {
    position: relative;
    width: 75%;
    margin: 170px auto;
    text-align: center;

    p {
      margin-top: 8px;
      margin-bottom: 8px;
    }

    .veryfiedIcon {
      width: 16px;
      height: 16px;
      margin-bottom: -2.8px;
    }

    .avatar-container {
      position: absolute;
      left: 50%;
      transform: translate(-50%);
      z-index: 1;
      top: -90px;

      .avatar {
        width: 140px;
        height: 140px;
        border-radius: 50%;
        box-shadow: 0 1px 1px 0;
      }
    }

    .emphasis {
      font-size: 20px;
      font-weight: 600;
    }

    #split {
      margin: 20px auto;
      width: 90%;
    }

    .flex-container {
      margin-top: 30px;
      padding: auto 20px;

      .left {
        flex: 1 1;
      }

      .middle {
        flex: 1 1;
        border-left: 1px solid #999;
        border-right: 1px solid #999;
      }

      .right {
        flex: 1 1;
      }
    }

    #problems {
      margin-top: 40px;
      padding-left: 30px;
      padding-right: 30px;
      font-size: 18px;

      .btns {
        margin-top: 15px;

        .problem-btn {
          display: inline-block;
          margin: 5px;
        }
      }
    }

    #icons {
      position: absolute;
      bottom: 40px;
      left: 50%;
      transform: translate(-50%);

      .icon {
        padding-left: 20px;
      }
    }
  }
</style>
