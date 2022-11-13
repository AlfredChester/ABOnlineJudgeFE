import api from '@oj/api'
import i18n from '@/i18n'

export default {
  data () {
    return {
      captchaSrc: ''
    }
  },
  methods: {
    validateForm (formName) {
      return new Promise((resolve, reject) => {
        this.$refs[formName].validate(valid => {
          if (!valid) {
            this.$error(i18n.t('m.Please_Validate_Error_Fields'))
          } else {
            resolve(valid)
          }
        })
      })
    },
    getCaptchaSrc () {
      api.getCaptcha().then(res => {
        this.captchaSrc = res.data.data
      })
    }
  }
}
