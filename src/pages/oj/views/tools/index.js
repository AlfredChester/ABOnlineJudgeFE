const Tools = () => import(/* webpackChunkName: "tools" */ './Tools.vue')
const CodeCompresser = () => import(/* webpackChunkName: "tools" */ './children/CodeCompresser.vue')
const DownloadPage = () => import(/* webpackChunkName: "tools" */ './children/DownloadPage.vue')
const DuckChess = () => import(/* webpackChunkName: "tools" */ './children/DuckChess.vue')
const HomoNumber = () => import(/* webpackChunkName: "tools" */ './children/HomoNumber.vue')
const Listening = () => import(/* webpackChunkName: "tools" */ './children/Listening.vue')
const VideoPage = () => import(/* webpackChunkName: "tools" */ './children/VideoPage.vue')

export {
    Tools, CodeCompresser, DownloadPage,
    DuckChess, HomoNumber, Listening, VideoPage
}
