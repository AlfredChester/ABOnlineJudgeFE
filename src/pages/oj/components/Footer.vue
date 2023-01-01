<template>
  <div class="footer">
    <span class="wrapped">
      <span class="inner_wrap">
        <span class="logo">
          <img src="../../../assets/icon_small.png" height="100px"/>
        </span>
        <span class="slogan">
          <div>ABOJ,</div>
          <div>{{ $t('m.OI_Dream_start') }}</div>
        </span>
        <span class="infoCard">
          <p>
            <span id="links">            
              <a href="/status">
                {{ $t('m.Judge_Queue') }}
              </a> |
              <a href="/about">
                {{ $t('m.Judger') }}
              </a> |
              <a href="/FAQ">
                {{ $t('m.FAQ') }}
              </a> |
              <a href="/ThanksPage">
                {{ $t('m.Special_Thanks_AppVue') }}
              </a>
            </span> <br/>
            <span id="developer">
              Developed by the ABOJ Dev Team,
              <a href="mailto:abonlinejudge@163.com">
                Contact us.
              </a>
            </span> <br/>
            <span id="copyright">
              Copyright &copy; 2022-present 
              <a href="https://github.com/FredB-mine" 
                 target="_blank">
                Dr.Alfred.
              </a>
            </span> <br/>
            <span id="power_by">
              Powered by 
              <a href="https://github.com/QingdaoU/OnlineJudge" 
                 target="_blank">
                OnlineJudge.
              </a>
            </span> <br/>
            <span id="more">
              <span class="infoCard_line_extension">
                <Select placeholder="更改语言" size="small" 
                        prefix="md-globe" style="width: auto;"
                        v-model="langCache">
                  <Option v-for="(name, _ID) in languages" 
                    :value="name" :label="_ID" :key="name">
                  </Option>
                </Select>
              </span>
              Build Version: {{ version }}.
            </span>
          </p>
        </span>
      </span>
    </span>
  </div>
</template>

<script>
export default {
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
  watch: {
    'langCache'() {
      this.$i18n.locale = this.langCache
      this.$success(this.$i18n.t('m.Succeeded'))
    },
    '$i18n.locale'(newVal) {
      this.langCache = newVal
    }
  }
}
</script>

<style lang="less">
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
    color: white;

    .inner_wrap {
      min-width: 60vw;
      display: flex;

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
        margin-top: auto;
        margin-bottom: auto;

        .infoCard_line_extension {
          margin-right: 10px;

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
</style>