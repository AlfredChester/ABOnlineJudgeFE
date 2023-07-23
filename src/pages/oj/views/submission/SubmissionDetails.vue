<template>
  <Row justify="center" type="flex">
    <Col :span="14">
      <panel class="container">
        <div slot="title">
          <Menu class="submission-menu" @on-select="selectItem"
                mode="horizontal" :active-name="isCE ? 'CEInfo' : 'Testcase'">
            <MenuItem name="Testcase" v-if="!isCE">
              {{ $t('m.Testcase_Info') }}
            </MenuItem>
            <MenuItem name="CEInfo" v-else>
              {{ $t('m.Compile_Info') }}
            </MenuItem>
            <MenuItem name="Code">
              {{ $t('m.Source_Code') }}
            </MenuItem>
          </Menu>
        </div>
        <div class="content">
          <span v-if="menuSelect === 'CEInfo'">
            <h3>{{ $t('m.Compile_Info') }}</h3>
            <pre>{{ submission.statistic_info.err_info }}</pre>
          </span>
          <span v-else-if="menuSelect === 'Testcase'">
            <h3>{{ $t('m.Testcase_Info') }}</h3>
            <div class="test-cases-wrap">
              <!--v-for-->
              <div class="wrapper" v-for="Case in submission.info.data">
                <Tooltip placement="top">
                  <div class="test-case" :style="'background: ' + (!judging ?
                    colors[judge_status[Case.result].short].color : '#3498db')">
                    <div class="id">
                      #{{ Case.test_case }}
                    </div>
                    <div class="test-case-content" v-if="!judging">
                      <div class="status">
                        {{ judge_status[Case.result].short }}
                      </div>
                      <div class="info">
                        {{ utils.submissionTimeFormat(Case.cpu_time) }} /
                        {{ utils.submissionMemoryFormat(Case.memory) }}
                      </div>
                    </div>
                    <div class="test-case-content" v-else>
                      <span class="spinning">
                        <Icon 
                          type="ios-loading" size=45
                          class="demo-spin-icon-load">
                        </Icon>
                      </span>
                    </div>
                  </div>
                  <template #content>
                    <p class="poptip_content" v-if="!judging">
                      {{ judge_status[Case.result].name }}
                      <span v-if="Case.score">
                        , {{ $t('m.Score') }}: {{ Case.score }}
                      </span>
                    </p>
                    <p v-else>
                      Judging
                    </p>
                    <p v-if="isAdminRole && !judging">
                      Real: {{ Case.real_time }}ms,
                      Exit: {{ Case.exit_code }}
                    </p>
                  </template>
                </Tooltip>
              </div>
            </div>
          </span>
          <span v-else>
            <div style="display: flex;">
              <h3>
                {{ $t('m.Source_Code') }} - {{ submission.language }}
              </h3>
              &nbsp; &nbsp;
              <Button size="small"
                      v-clipboard:copy="submission.code"
                      v-clipboard:success="onCopy"
                      v-clipboard:error="onCopyError">
                {{ $t('m.Copy') }}
              </Button>
            </div>
            <Highlight 
                     :code="submission.code" 
                     :language="submission.language" 
                     border-color="none">
            </Highlight>
          </span>
        </div>
      </panel>
    </Col>
    <Col :span="1"></Col>
    <Col :span="5" id="status">
      <panel class="container">
        <div slot="title" style="font-size: initial;">
          <UserLink :username="submission.username">
          </UserLink>
        </div>
        <div class="content">
          <div class="submission-info">
            <!-- <div class="line">
              <div class="left">
                {{ $t('m.Problem') }}:
              </div>
              <div class="right">
                <ProblemLink :problemId="String(submission.problem)">
                </ProblemLink>
              </div>
            </div> -->
            <div class="line">
              <div class="left">
                {{ $t('m.Status') }}:
              </div>
              <div class="right" :style="'font-weight:bold; color: ' +
                colors[judge_status[submission.result].short].color">
                {{ status.statusName }}
              </div>
            </div>
            <div class="line">
              <div class="left">
                {{ $t('m.Language') }}: 
              </div>
              <div class="right">
                {{ submission.language }}
              </div>
            </div>
            <div class="line">
              <div class="left">
                {{ $t('m.Submit_time') }}:
              </div>
              <div class="right">
                {{ submitTime }}
              </div>
            </div>
            <div class="line">
              <div class="left">
                {{ $t('m.Time') }}
              </div>
              <div class="right">
                {{ submission.statistic_info.time_cost | submissionTime }}
              </div>
            </div>
            <div class="line">
              <div class="left">
                {{ $t('m.Memory') }}: 
              </div>
              <div class="right">
                {{ submission.statistic_info.memory_cost | submissionMemory }}
              </div>
            </div>
            <div class="line" v-if="submission.statistic_info.score">
              <div class="left">
                {{ $t('m.Score') }}:
              </div>
              <div class="right">
                {{ submission.statistic_info.score }}
              </div>
            </div>
          </div>
          <div class="btn">
            <div v-if="submission.can_unshare">
              <div id="share-btn">
                <Button v-if="submission.shared"
                        type="warning" size="large" @click="shareSubmission(false)">
                  {{ $t('m.UnShare') }}
                </Button>
                <Button v-else
                        type="primary" size="large" @click="shareSubmission(true)">
                  {{ $t('m.Share') }}
                </Button>
              </div>
            </div>
            <div v-if="showRejudgeBtn">
              <div id="rejudge-btn">
                <Button size="large" @click="handleRejudge(submission.id)">
                  {{ $t('m.Rejudge') }}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </panel>
    </Col>
  </Row>
</template>

<script>
import api from '@oj/api'
import dayjs from 'dayjs'
import utils from '@/utils/utils'
import UserLink from '@/pages/oj/components/UserLink'
import ProblemLink from '@/pages/oj/components/ProblemLink'
import Highlight from '@/pages/oj/components/Highlight'
import { mapGetters } from 'vuex'
import { JUDGE_STATUS, COLORS, USER_TYPE } from '@/utils/constants'

export default {
  name: 'submissionDetails',
  components: {
    Highlight,
    UserLink,
    ProblemLink
  },
  data() {
    return {
      submission: {
        result: '0',
        code: '',
        info: {
          data: []
        },
        statistic_info: {
          time_cost: '',
          memory_cost: ''
        }
      },
      isConcat: false,
      menuSelect: undefined,
      judge_status: JUDGE_STATUS,
      utils: utils,
      colors: COLORS
    }
  },
  mounted() {
    this.getSubmission()
  },
  methods: {
    handleRejudge(id) {
      api.submissionRejudge(id).then(res => {
        this.$success(this.$i18n.t('m.Succeed'))
      }, () => { this.getSubmission() })
    },
    selectItem(name) {
      this.menuSelect = name
    },
    getSubmission() {
      api.getSubmission(this.$route.params.id).then(res => {
        let data = res.data.data
        if (data.info && data.info.data && !this.isConcat) {
          // score exist means the submission is OI problem submission
          if (data.info.data[0].score !== undefined) {
            this.isConcat = true
          }
          if (this.isAdminRole) {
            this.isConcat = true
          }
        }
        this.submission = data
        console.log(data)
        this.selectItem(this.isCE ? 'CEInfo' : 'Testcase')
      }, () => { })
    },
    shareSubmission(shared) {
      let data = { id: this.submission.id, shared: shared }
      api.updateSubmission(data).then(res => {
        this.getSubmission()
        this.$success(this.$i18n.t('m.Succeeded'))
      }, () => {
      })
    },
    onCopy(event) {
      this.$success(this.$i18n.t('m.Copy_Success'))
    },
    onCopyError(e) {
      this.$error(this.$i18n.t('m.Copy_Fail'))
    }
  },
  computed: {
    ...mapGetters(['user']),
    status() {
      return {
        type: JUDGE_STATUS[this.submission.result].type,
        statusName: JUDGE_STATUS[this.submission.result].name,
        color: JUDGE_STATUS[this.submission.result].color
      }
    },
    isCE() {
      return this.submission.result === -2
    },
    isAdminRole() {
      return this.$store.getters.isAdminRole
    },
    showRejudgeBtn() {
      return this.user.admin_type === USER_TYPE.SUPER_ADMIN && !this.submission.contest
    },
    judging() {
      return this.status.statusName === 'Judging'
    },
    submitTime() {
      var dateTime = this.submission.create_time
      return dayjs(dateTime).format('YYYY-MM-DD HH:MM:DD')
    }
  }
}
</script>

<style scoped lang="less">
.spinning {
  display: block;
  margin: auto;
  font-size: 18px;
  color: white;

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

#status {

  .title {
    font-size: 20px;
  }

  .content {
    margin-top: 10px;
    font-size: 14px;

    span {
      margin-right: 10px;
    }
  }
}

.submission-info {
  margin-bottom: 20px;

  .line {
    display: flex;
    font-size: 16px;
    line-height: 1.5;
    margin-bottom: 5px;

    .left {
      flex: 1 0 auto;
    }

    .right {
      max-width: 175px;
      color: #1c2127;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}

.container {
  margin-bottom: 20px;

  .content {
    font-size: 16px;
    margin: 0 50px 20px 50px;

    .test-cases-wrap {
      display: block;
      margin-top: 20px;

      .wrapper {
        position: relative;
        display: inline-block;

        .test-case {
          position: relative;
          vertical-align: top;
          cursor: pointer;
          margin: 0.3em;
          height: 6em;
          width: 6em;
          padding: 0;
          color: #fff;

          .id {
            position: absolute;
            top: 0;
            left: 0;
            padding: 6px;
            font-size: .65em;
          }

          .test-case-content {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            div {
              margin-top: 2px;
              margin-bottom: 2px;
            }

            .status {
              font-size: 1.25em;
              text-align: center;
              font-weight: bold;
            }

            .info {
              font-size: .7em;
              text-align: center;
            }
          }
        }

        .poptip_content {
          align-items: center;
        }
      }
    }

    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      word-break: break-all;

      code {
        padding: 0px !important;
      }
    }
  }
}

.admin-info {
  margin: 5px 0;

  &-content {
    font-size: 16px;
    padding: 10px;
  }
}

.btn {
  display: flex;
  flex-direction: row-reverse;

  div {
    margin-left: 10px;
  }
}

pre {
  border: none;
  background: none;
}
</style>
