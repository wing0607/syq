<template>
  <div id="app">
    <router-view />
    <van-tabbar v-model="active" @change="onChange">
      <van-tabbar-item name="home" class="wing-tabItem wing-tabItem-fir">水位监控</van-tabbar-item>
      <van-tabbar-item name="inWater" class="wing-tabItem wing-tabItem-sec">出库流量监测</van-tabbar-item>
      <van-tabbar-item name="outWater" class="wing-tabItem wing-tabItem-third">出入库流量</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
import Vue from 'vue'
import { Toast, Loading } from 'vant'
Vue.use(Toast)
Vue.use(Loading)
export default {
  data() {
    return {
      active: 'home'
    }
  },
  mounted() {
    //this.funLoading()
  },
  methods: {
    // funLoading() {
    //   Toast.loading({
    //     message: '加载中...',
    //     forbidClick: true
    //   })
    // },
    onChange(index) {
      if (index == 'inWater' || index == 'outWater') {
        Toast('该功能暂未开通')
        this.active = 'home'
        return
      }
    }
  }
}
</script>

<style>
.wing-tabItem .van-tabbar-item__icon {
  height: 42px;
  width: 100%;
}
.wing-tabItem-fir .van-tabbar-item__icon {
  background: url(assets/ic_tab_swjk_nor@2x.png) no-repeat center;
  background-size: contain;
}
.wing-tabItem-fir.van-tabbar-item--active .van-tabbar-item__icon {
  background: url(assets/ic_tab_swjk_select@2x.png) no-repeat center;
  background-size: contain;
}
.wing-tabItem-sec .van-tabbar-item__icon {
  background: url(assets/ic_tab_cklljc_nor@2x.png) no-repeat center;
  background-size: contain;
}
.wing-tabItem-sec.van-tabbar-item--active .van-tabbar-item__icon {
  background: url(assets/ic_tab_cklljc_select@2x.png) no-repeat center;
  background-size: contain;
}
.wing-tabItem-third .van-tabbar-item__icon {
  background: url(assets/ic_tab_crkll_nor@2x.png) no-repeat center;
  background-size: contain;
}
.wing-tabItem-third.van-tabbar-item--active .van-tabbar-item__icon {
  background: url(assets/ic_tab_crkll_select@2x.png) no-repeat center;
  background-size: contain;
}
</style>
