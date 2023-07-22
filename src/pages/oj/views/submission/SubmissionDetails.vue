<template>
  <Row type="flex" justify="space-around">
    <Col :span="20" id="status">
      <Alert :type="status.type === 'primary' ? 'info' : status.type" showIcon>
        <span class="title">
          {{ $t('m.' + status.statusName.replace(/ /g, "_")) }}
        </span>
        <div slot="desc" class="content">
          <span>
            {{ $t('m.Time') }}
            {{ submission.statistic_info.time_cost | submissionTime }}
          </span>
          <span>
            {{ $t('m.Memory') }}: 
            {{ submission.statistic_info.memory_cost | submissionMemory }}
          </span>
          <span>
            {{ $t('m.Lang') }}: 
            {{ submission.language }}
          </span>
          <span>
            {{ $t('m.Author') }}: 
            {{ submission.username }}
          </span>
        </div>
      </Alert>
    </Col>
    <Col :span="20">
      <panel class="container">
        <div slot="title" style="font-size: xx-large; margin-top: 3px;">
          <Menu class="submission-menu" @on-select="selectItem"
                mode="horizontal" :active-name="isCE ? 'CEInfo' : 'Testcase'">
            <MenuItem name="Testcase" v-if="!isCE">
              测试点信息
            </MenuItem>
            <MenuItem name="CEInfo" v-else>
              编译信息
            </MenuItem>
            <MenuItem name="Code">
              源代码
            </MenuItem>
          </Menu>
        </div>
        <div class="content">
          <span v-if="menuSelect === 'CEInfo'">
            <h3>编译信息</h3>
            <pre>{{ submission.statistic_info.err_info }}</pre>
          </span>
          <span v-else-if="menuSelect === 'Testcase'">
            <h3>测试点信息</h3>
            <div class="test-cases-wrap">
              <!--v-for-->
              <div class="wrapper" v-for="Case in submission.info.data">
                <Tooltip placement="top"
                         :content="getTip(Case.test_case)">
                  <div class="test-case" 
                      :style="'background: ' +
                        colors[judge_status[Case.result].short].color">
                      <!--colors[judge_status[Case.result].color]-->
                    <div class="id">
                      #{{ Case.test_case }}
                    </div>
                    <div class="test-case-content">
                      <div class="status">
                        {{ judge_status[Case.result].short }}
                      </div>
                      <div class="info">
                        {{ utils.submissionTimeFormat(Case.cpu_time) }} /
                        {{ utils.submissionMemoryFormat(Case.memory) }}
                      </div>
                    </div>
                  </div>
                </Tooltip>
              </div>
            </div>
          </span>
          <span v-else>
            <div>
              <h3>源代码 - {{ submission.language }}</h3>
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
    <Col v-if="submission.can_unshare" :span="20">
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
    </Col>
  </Row>
</template>

<script>
import api from '@oj/api'
import { JUDGE_STATUS, COLORS } from '@/utils/constants'
import utils from '@/utils/utils'
import Highlight from '@/pages/oj/components/Highlight'

export default {
  name: 'submissionDetails',
  components: {
    Highlight
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
    getTip(testcase) {
      testcase = Number(testcase)
      var data = this.submission.info.data[testcase - 1]
      console.log(JSON.stringify(data, null, 2))
      return ''
    }
  },
  computed: {
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
    }
  }
}
</script>

<style scoped lang="less">
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

#share-btn {
  float: right;
  margin-top: 5px;
  margin-right: 10px;
}

pre {
  border: none;
  background: none;
}
</style>
