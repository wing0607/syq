import axios from 'axios'
// 请求拦截  设置统一header
import { Toast, Loading } from 'vant'
let loading        //定义loading变量

function startLoading() {
  loading = Toast.loading({
    message: '加载中...',
    forbidClick: false
  })
}
function endLoading() {
  loading.close()
}
axios.interceptors.request.use(config => {

  startLoading()
  config.baseURL = '/api'
  config.timeout = 10000
  config.headers['content-type'] = 'application/json';
  return config
}, error => {
  return Promise.reject(error)
})
axios.interceptors.response.use(response => {
  if (response.data.status == 200) {
    endLoading()
    return Promise.reject(response)
  } else {
    endLoading()
    return response
  }

})
export default axios

