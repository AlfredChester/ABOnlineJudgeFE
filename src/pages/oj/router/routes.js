// all routes here.
import {
  About,
  ACMRank,
  Announcements,
  ApplyResetPassword,
  CalendarDemo,
  DownloadPage,
  FAQ,
  Home,
  License,
  Listening,
  Logout,
  NotFound,
  OIRank,
  Problem,
  ProblemList,
  ResetPassword,
  SubmissionDetails,
  SubmissionList,
  ThanksPage,
  UserHome
} from '../views'

import i18n from '@/i18n'
import * as Contest from '@oj/views/contest'
import * as Setting from '@oj/views/setting'

export default [
  {
    name: 'home',
    path: '/',
    meta: {title: i18n.t('m.Home')},
    component: Home
  },
  {
    name: 'logout',
    path: '/logout',
    meta: {title: i18n.t('m.Logout')},
    component: Logout
  },
  {
    name: 'apply-reset-password',
    path: '/apply-reset-password',
    meta: {title: i18n.t('m.Apply_Reset_Password')},
    component: ApplyResetPassword
  },
  {
    name: 'reset-password',
    path: '/reset-password/:token',
    meta: {title: i18n.t('m.Reset_Password')},
    component: ResetPassword
  },
  {
    name: 'problem-list',
    path: '/problem',
    meta: {title: i18n.t('m.Problem_List')},
    component: ProblemList
  },
  {
    name: 'problem-details',
    path: '/problem/:problemID',
    meta: {title: i18n.t('m.Problem_Details')},
    component: Problem
  },
  {
    name: 'submission-list',
    path: '/status',
    meta: {title: i18n.t('m.Submission_List')},
    component: SubmissionList
  },
  {
    name: 'submission-details',
    path: '/status/:id/',
    meta: {title: i18n.t('m.Submission_Details')},
    component: SubmissionDetails
  },
  {
    name: 'contest-list',
    path: '/contest',
    meta: {title: i18n.t('m.Contest_List')},
    component: Contest.ContestList
  },
  {
    name: 'contest-details',
    path: '/contest/:contestID/',
    component: Contest.ContestDetails,
    meta: {title: i18n.t('m.Contest_Details')},
    children: [
      {
        name: 'contest-submission-list',
        path: 'submissions',
        component: SubmissionList
      },
      {
        name: 'contest-problem-list',
        path: 'problems',
        component: Contest.ContestProblemList
      },
      {
        name: 'contest-problem-details',
        path: 'problem/:problemID/',
        component: Problem
      },
      {
        name: 'contest-announcement-list',
        path: 'announcements',
        component: Announcements
      },
      {
        name: 'contest-rank',
        path: 'rank',
        component: Contest.ContestRank
      },
      {
        name: 'acm-helper',
        path: 'helper',
        component: Contest.ACMContestHelper
      }
    ]
  },
  {
    name: 'acm-rank',
    path: '/acm-rank',
    meta: {title: i18n.t('m.ACM_Rank')},
    component: ACMRank
  },
  {
    name: 'oi-rank',
    path: '/oi-rank',
    meta: {title: i18n.t('m.OI_Rank')},
    component: OIRank
  },
  {
    name: 'user-home',
    path: '/user-home',
    component: UserHome,
    meta: {requiresAuth: true, title: i18n.t('m.MyHome')}
  },
  {
    path: '/setting',
    component: Setting.Settings,
    children: [
      {
        name: 'default-setting',
        path: '',
        meta: {requiresAuth: true, title: i18n.t('m.Default_Settings')},
        component: Setting.ProfileSetting
      },
      {
        name: 'profile-setting',
        path: 'profile',
        meta: {requiresAuth: true, title: i18n.t('m.Profile_Settings')},
        component: Setting.ProfileSetting
      },
      {
        name: 'account-setting',
        path: 'account',
        meta: {requiresAuth: true, title: i18n.t('m.Account_Settings')},
        component: Setting.AccountSetting
      },
      {
        name: 'security-setting',
        path: 'security',
        meta: {requiresAuth: true, title: i18n.t('m.Security_Settings')},
        component: Setting.SecuritySetting
      }
    ]
  },
  {
    path: '/about',
    name: 'about',
    meta: {title: i18n.t('m.Judger')},
    component: About
  },
  {
    path: '/faq',
    name: 'faq',
    meta: {title: i18n.t('m.FAQ')},
    component: FAQ
  },
  {
    path: '/ThanksPage',
    name: 'ThanksPage',
    meta: {title: i18n.t('m.ThanksPage')},
    component: ThanksPage
  },
  {
    path: '/listening',
    name: 'Listening',
    meta: {title: i18n.t('m.ListeningPage')},
    component: Listening
  },
  {
    path: '/10a9fc70042_calenderDemo',
    name: 'CalenderDemo',
    meta: {title: '日历预览'},
    component: CalendarDemo
  },
  {
    path: '/downloadCollection',
    name: 'Downloads',
    meta: {title: i18n.t('m.DownloadPage')},
    component: DownloadPage
  },
  {
    path: '/tos',
    name: 'License',
    meta: {title: i18n.t('m.license')},
    component: License
  },
  {
    path: '*',
    meta: {title: '404'},
    component: NotFound
  }
]
