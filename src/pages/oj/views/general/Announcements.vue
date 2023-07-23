<template>
  <Panel shadow :padding="10">
    <div slot="title">
      {{ title }}
    </div>
    <div slot="extra">
      <Button v-if="listVisible" type="info" @click="init" :loading="btnLoading">{{ $t('m.Refresh') }}</Button>
      <Button v-else icon="ios-undo" @click="goBack">{{ $t('m.Back') }}</Button>
    </div>

    <transition-group name="announcement-animate" mode="in-out">
      <div class="no-announcement" v-if="!announcements.length" key="no-announcement">
        <p>{{ $t('m.No_Announcements') }}</p>
      </div>
      <template v-if="listVisible">
        <ul class="announcements-container" key="list">
          <li v-for="announcement in announcements" :key="announcement.title">
            <div class="flex-container">
              <div class="title">
                <a class="entry" @click="goAnnouncement(announcement)">
                  {{ announcement.title }}
                </a>
              </div>
              <div class="date">{{ announcement.create_time | localtime }}</div>
              <div class="creator">
                <span v-if="avatarLoaded">
                  <Avatar 
                    :src="avatarSrc[announcement.created_by.username]">
                  </Avatar>
                </span>
                <a class="entry" @click="goUserHome(announcement.created_by.username)">
                  {{ announcement.created_by.username }}
                </a>
              </div>
            </div>
          </li>
        </ul>
        <Pagination v-if="!isContest"
                    key="page"
                    :total="total"
                    :page-size="limit"
                    @on-change="getAnnouncementList">
        </Pagination>
      </template>

      <template v-else>
        <div v-katex v-html="announcement.content" key="content" class="content-container markdown-body"></div>
      </template>
    </transition-group>
  </Panel>
</template>

<script>
import api from '@oj/api'
import Pagination from '@oj/components/Pagination'

export default {
  name: 'Announcement',
  components: {
    Pagination
  },
  data() {
    return {
      limit: 10,
      total: 10,
      btnLoading: false,
      announcements: [],
      announcement: '',
      listVisible: true,
      avatarSrc: {},
      avatarRequestSum: 0
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (this.isContest) {
        this.getContestAnnouncementList()
      } else {
        this.getAnnouncementList()
      }
    },
    getAnnouncementList(page = 1) {
      this.btnLoading = true
      api.getAnnouncementList((page - 1) * this.limit, this.limit).then(res => {
        this.btnLoading = false
        this.announcements = res.data.data.results
        this.avatarRequestSum = 0
        for (var item of this.announcements) {
          api.getUserInfo(item.created_by.username).then(res1 => {
            let username = res1.data.data.user.username
            let gotSrc = res1.data.data.avatar
            this.avatarSrc[username] = gotSrc
            this.avatarRequestSum += 1
          }).catch(err => {
            console.log('[oj/Announcements.vue]: Error', err)
          })
        }
        this.total = res.data.data.total
      }, () => {
        this.btnLoading = false
      })
    },
    getContestAnnouncementList() {
      this.btnLoading = true
      api.getContestAnnouncementList(this.$route.params.contestID).then(res => {
        this.btnLoading = false
        this.announcements = res.data.data
      }, () => {
        this.btnLoading = false
      })
    },
    goAnnouncement(announcement) {
      this.announcement = announcement
      this.listVisible = false
    },
    goUserHome(name1) {
      this.$router.push({
        path: `/user-home?username=${name1}`
      })
    },
    goBack() {
      this.listVisible = true
      this.announcement = ''
    }
  },
  computed: {
    title() {
      if (this.listVisible) {
        return this.isContest ? this.$i18n.t('m.Contest_Announcements') : this.$i18n.t('m.Announcements')
      } else {
        return this.announcement.title
      }
    },
    isContest() {
      return !!this.$route.params.contestID
    },
    avatarLoaded() {
      return this.avatarRequestSum === this.announcements.length
    }
  }
}
</script>

<style scoped lang="less">
.announcements-container {
  margin-top: -10px;
  margin-bottom: 10px;

  li {
    padding-top: 10px;
    list-style: none;
    padding-bottom: 10px;
    margin-left: 20px;
    font-size: 16px;
    border-bottom: 1px solid rgba(187, 187, 187, 0.5);

    &:last-child {
      border-bottom: none;
    }

    .flex-container {
      .title {
        flex: 1 1;
        text-align: left;
        padding-left: 10px;
        margin-top: auto;
        margin-bottom: auto;

        a.entry {
          color: #495060;

          &:hover {
            color: #2d8cf0;
            border-bottom: 1px solid #2d8cf0;
          }
        }
      }

      .creator {
        margin-top: auto;
        margin-bottom: auto;
        flex: none;
        width: 200px;
        text-align: center;

        a.entry {
          color: #495060;

          &:hover {
            color: #2d8cf0;
            border-bottom: 1px solid #2d8cf0;
          }
        }
      }

      .date {
        margin-top: auto;
        margin-bottom: auto;
        flex: none;
        width: 200px;
        text-align: center;
      }
    }
  }
}

.content-container {
  padding: 0 20px 20px 20px;
}

.no-announcement {
  text-align: center;
  font-size: 16px;
}

changeLocale .announcement-animate-enter-active {
  animation: fadeIn 1s;
}
</style>
