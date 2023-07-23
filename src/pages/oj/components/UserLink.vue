<template>
  <div class="userlink">
    <a :href="'/user-home?username=' + username">
      <span v-if="!loading">
        <Avatar :src="image"></Avatar>
      </span>
      {{ username }}
    </a>
  </div>
</template>

<script>
import api from '@oj/api'

export default {
  name: 'UserLink',
  data() {
    return {
      loading: true,
      image: undefined
    }
  },
  mounted() {
    this.reload()
  },
  props: {
    username: {
      required: true,
      type: String,
      default: ''
    }
  },
  methods: {
    reload() {
      if (this.username !== '') {
        api.getUserInfo(this.username).then(res => {
          this.loading = false
          this.image = res.data.data.avatar
        }).catch(err => {
          console.log('[oj/UserLink.vue]: Error', err)
        })
      }
    }
  },
  watch: {
    'username'(newVal, oldVal) {
      this.reload()
    }
  }
}
</script>

<style lang="less">
.userlink a {
  color: #495060;

  &:hover {
    color: #2d8cf0;
    border-bottom: none;
  }
}
</style>