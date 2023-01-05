<template>
  <!-- MSG Globalization -->
  <div class="register_root">
    <Form ref="formRegister" :model="formRegister" :rules="ruleRegister">
      <FormItem prop="username">
        <Input type="text" v-model="formRegister.username" :placeholder="$t('m.RegisterUsername')" size="large" @on-enter="handleRegister">
        <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="email">
        <Input v-model="formRegister.email" :placeholder="$t('m.Email_Address')" size="large" @on-enter="handleRegister">
        <Icon type="ios-mail-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="password">
        <Input type="password" v-model="formRegister.password" :placeholder="$t('m.RegisterPassword')" size="large" @on-enter="handleRegister">
        <Icon type="ios-lock-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="passwordAgain">
        <Input type="password" v-model="formRegister.passwordAgain" :placeholder="$t('m.Password_Again')" size="large" @on-enter="handleRegister">
        <Icon type="ios-lock-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="captcha">
        <div class="oj-captcha">
          <div class="oj-captcha-code">
            <Input v-model="formRegister.captcha" 
                  :placeholder="$t('m.Captcha')" size="large"
                  @on-enter="handleRegister">
            <Icon type="ios-bulb-outline" slot="prepend"></Icon>
            </Input>
          </div>
          <div class="oj-captcha-img">
            <Tooltip content="Click to refresh" placement="top">
              <img :src="captchaSrc" @click="getCaptchaSrc"/>
            </Tooltip>
          </div>
        </div>
      </FormItem>
      <FormItem prop="agree_tos" class="agree_tos_formitem">
        <Checkbox label="agree"
                  v-model="formRegister.agree_tos"
                  style="vertical-align: center;">
                  {{ $t('m.Read_And_Agree') }}
                  <a href="/tos">
                    {{ $t('m.ABOJs_Tos') }}
                  </a>
                  {{ $t('m.And') }}
                  <a href="/tos">
                    {{ $t('m.ABOJs_Privacy_Policy') }}
                  </a>
        </Checkbox>
      </FormItem>
    </Form>
    <div class="footer_register">
      <Button
        type="primary"
        @click="handleRegister"
        class="btn" long
        :loading="btnRegisterLoading">
        {{ $t('m.UserRegister') }}
      </Button>
      <Button
        @click="switchMode('login')"
        class="btn" long>
        {{ $t('m.Already_Registed') }}
      </Button>
    </div>
  </div>
</template>

<script>
  import api from '@oj/api'
  import { mapGetters, mapActions } from 'vuex'
  import { FormMixin } from '@oj/components/mixins'

  export default {
    mixins: [FormMixin],
    mounted () {
      this.getCaptchaSrc()
    },
    data () {
      const CheckUsernameNotExist = (rule, value, callback) => {
        api.checkUsernameOrEmail(value, undefined).then(res => {
          if (res.data.data.username === true) {
            callback(new Error(this.$i18n.t('m.The_username_already_exists')))
          } else {
            callback()
          }
        }, _ => callback())
      }
      const CheckEmailNotExist = (rule, value, callback) => {
        api.checkUsernameOrEmail(undefined, value).then(res => {
          if (res.data.data.email === true) {
            callback(new Error(this.$i18n.t('m.The_email_already_exists')))
          } else {
            callback()
          }
        }, _ => callback())
      }
      const CheckPassword = (rule, value, callback) => {
        if (this.formRegister.password !== '') {
          // 对第二个密码框再次验证
          this.$refs.formRegister.validateField('passwordAgain')
        }
        callback()
      }
      const CheckAgainPassword = (rule, value, callback) => {
        if (value !== this.formRegister.password) {
          callback(new Error(this.$i18n.t('m.password_does_not_match')))
        }
        callback()
      }
      const CheckAgreeTos = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$i18n.t('m.Must_Agree_Tos')))
        }
        callback()
      }

      return {
        btnRegisterLoading: false,
        formRegister: {
          username: '',
          password: '',
          passwordAgain: '',
          email: '',
          captcha: '',
          agree_tos: false
        },
        ruleRegister: {
          username: [
            {
              required: true,
              trigger: 'blur',
              message: this.$i18n.t('m.Username_Cannot_Be_Empty')
            },
            {
              validator: CheckUsernameNotExist,
              trigger: 'blur'
            }
          ],
          email: [
            {
              required: true,
              type: 'email',
              trigger: 'blur',
              message: this.$i18n.t('m.Invalid_Email')
            },
            {
              validator: CheckEmailNotExist,
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              trigger: 'blur',
              min: 6,
              max: 20,
              message: this.$i18n.t('m.Invalid_Password')
            },
            {
              validator: CheckPassword,
              trigger: 'blur'
            }
          ],
          passwordAgain: [
            {
              required: true,
              validator: CheckAgainPassword,
              trigger: 'change'
            }
          ],
          captcha: [
            {
              required: true,
              trigger: 'blur',
              min: 1,
              max: 10,
              message: this.$i18n.t('m.Invalid_Captcha')
            }
          ],
          agree_tos: [
            {
              required: true,
              type: 'boolean',
              validator: CheckAgreeTos,
              trigger: 'change'
            }
          ]
        }
      }
    },
    methods: {
      ...mapActions(['changeModalStatus', 'getProfile']),
      switchMode (mode) {
        this.changeModalStatus({
          mode,
          visible: true
        })
      },
      handleRegister () {
        this.validateForm('formRegister').then(valid => {
          let formData = Object.assign({}, this.formRegister)
          delete formData['passwordAgain']
          this.btnRegisterLoading = true
          api.register(formData).then(res => {
            this.$success(this.$i18n.t('m.Thanks_for_registering'))
            this.switchMode('login')
            this.btnRegisterLoading = false
          }, _ => {
            this.getCaptchaSrc()
            this.formRegister.captcha = ''
            this.btnRegisterLoading = false
          })
        })
      }
    },
    computed: {
      ...mapGetters(['website', 'modalStatus'])
    }
  }
</script>

<style scoped lang="less">
  .agree_tos_formitem {
    line-height: 1px;
  }
  .footer_register {
    overflow: auto;
    margin-bottom: -15px;
    text-align: left;
    .btn {
      margin: 0 0 15px 0;
      &:last-child {
        margin: 0;
      }
    }
  }
</style>
