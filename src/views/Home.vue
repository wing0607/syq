<template>
  <div class="wing-stage-container">
    <div class="wing-grid">
      <div class="wing-grid-list">
        <span style="position: relative">
          {{this.$moment(this.infoData.realtime.tm).format("llll")+':00' }}
          <div class="wing-xxtitle" v-if="this.xxTitle.t0">{{this.xxTitle.t0}}</div>
        </span>
      </div>
      <div class="wing-grid-list">
        <div class="wing-grid-item">
          今日雨量：
          <span class="wing-grid-item-num">{{this.numFilter(this.infoData.realtime.rain,1) }}</span> mm
        </div>
        <div class="wing-grid-item wing-grid-r">
          <!-- {{this.infoData.realtime.rain > 0 ? "雨量等级:" : ""}}
          <span
            v-html="this.infoData.realtime.rain > 0 ? rainLevel(this.infoData.realtime.rain) : ''"
          ></span>-->
          雨量等级:
          <span v-html="rainLevel(this.infoData.realtime.rain)"></span>
        </div>
      </div>
      <div class="wing-grid-list">
        <div class="wing-grid-item">
          水库水位：
          <span class="wing-grid-item-num">{{this.numFilter(this.infoData.realtime.val,2)}}</span> m
          <span class="skswyj" v-if="this.show"></span>
        </div>
        <div class="wing-grid-item wing-grid-r">
          ({{this.xxTitle.t4}})
          汛限水位：
          {{this.numFilter(this.infoData.realtime.xxsw,2)}} m
        </div>
      </div>
      <div class="wing-grid-list">
        <div class="wing-grid-item">
          水库库容：
          <span class="wing-grid-item-num">{{this.numFilter(this.infoData.realtime.sskr,0)}}</span> 万m³
        </div>
        <div class="wing-grid-item wing-grid-r">
          汛限库容：
          {{this.numFilter(this.infoData.realtime.xxkr,0)}} 万m³
        </div>
      </div>
      <div class="wing-grid-list">
        <div class="wing-grid-item">
          库容比例：
          <span
            class="wing-grid-item-num"
          >{{this.numFilter((this.infoData.realtime.sskr / this.infoData.realtime.xxkr) * 100,2)}}</span> %
        </div>
        <div class="wing-grid-item">
          <span>今日水位变化：</span>
          <span v-html="this.text"></span>
        </div>
      </div>
    </div>

    <div class="wing-box-container">
      <div class="wing-table-top clearfix">
        <span class="fl wing-title">十日水位降雨</span>
        <span class="gray fr">
          降雨
          <span class="blue">
            <b>{{this.tenRain}}</b>
            <span>mm</span>
          </span>

          <span class="orange" v-html="this.tenWater"></span>
        </span>
      </div>
      <div class="charts" :style="{width: '100%', height: '240px', 'margin-top': '-30px'}">
        <div id="myChart" :style="{width: '100%', height: '200px'}"></div>
        <div id="waterLevelChart" :style="{width: '100%', height: '200px', 'margin-top': '-120px'}"></div>
      </div>
    </div>

    <div class="wing-box-container">
      <div class="wing-table-top clearfix">
        <p class="fl wing-title">降雨一水位统计</p>
      </div>
      <table class="wing-table wing-waterTable" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th>时间</th>
            <th>累计雨量</th>
            <th>水位变化</th>
            <th>库容变化</th>
          </tr>
        </thead>
        <tbody v-html="this.waterLevelTable"></tbody>
      </table>
    </div>

    <div class="wing-box-container">
      <div class="wing-table-top clearfix">
        <span class="fl wing-title">近十日水雨情</span>
        <span class="gray fr">
          降雨:
          <span class="blue">
            <b>{{this.tenRain}}</b>
            <span>mm</span>
          </span>

          <span class="orange" v-html="this.tenWater"></span>
        </span>
      </div>
      <table class="wing-table" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th>时间</th>
            <th>降雨</th>
            <th>8时水位</th>
            <th>库容</th>
            <th>累计雨量</th>
          </tr>
        </thead>
        <tbody v-html="this.tenTable"></tbody>
      </table>
    </div>
    <div class="wing-box-container">
      <div class="wing-table-top">水位库容特性表</div>
      <table class="wing-table wing-levelTable" cellspacing="0" cellpadding="0">
        <tbody v-html="this.waterTable"></tbody>
      </table>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
import Vue from 'vue'
import moment from 'moment/min/moment-with-locales'
import * as dd from 'dingtalk-jsapi'
import collectSticker$ from 'dingtalk-jsapi/api/biz/chat/collectSticker'
Vue.prototype.$moment = moment

export default {
  name: 'Home',
  components: {},
  data() {
    return {
      nowTime: this.$moment().format('h:mm:ss'),
      code: this.getParam('code') || 2137,
      infoData: { realtime: { rain: '' } },
      text: '',
      tenTable: '',
      waterTable: '',
      tenRain: '',
      tenWater: '',
      show: false,
      xxTitle: {},
      waterLevelTable: ''
    }
  },
  methods: {
    numFilter(value, num) {
      var val = ''
      if (value == '' || value == undefined || isNaN(value)) {
        val = parseFloat(0).toFixed(num)
      } else {
        val = parseFloat(value).toFixed(num)
      }

      return val
    },

    //判断雨大小
    rainLevel(rain) {
      if (rain <= 0) {
        return '无'
      }
      if (rain < 10) {
        return '<span class="wing-rain wing-rain1"></span>小雨'
      } else if (rain < 25) {
        return '<span class="wing-rain wing-rain2"></span>中雨'
      } else if (rain < 50) {
        return '<span class="wing-rain wing-rain3"></span>大雨'
      } else if (rain < 100) {
        return '<span class="wing-rain wing-rain4"></span>暴雨'
      } else if (rain < 250) {
        return '<span class="wing-rain wing-rain5"></span>大暴雨'
      } else {
        return '<span class="wing-rain wing-rain6"></span>特大暴雨'
      }
    },
    getParam(name) {
      return (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [
        ,
        null
      ])[1]
    },
    userAgentObj() {
      const ua = navigator.userAgent.toLowerCase()
      let isWeiXin = false,
        isDingTalk = false,
        isApp = false,
        obj = {}
      if (ua.match(/DingTalk/i) == 'dingtalk') {
        //用钉钉打开
        isDingTalk = true
      } else if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        //用微信打开
        isWeiXin = true
      } else {
        //用其他浏览器打开
        isApp = true
      }
      obj.isWeiXin = isWeiXin
      obj.isDingTalk = isDingTalk
      obj.isApp = isApp
      localStorage.setItem('userAgentObj', JSON.stringify(obj))
      return obj
    },
    changePageTitle(title) {
      let userAgentObj =
        JSON.parse(localStorage.getItem('userAgentObj')) || null

      if (userAgentObj && userAgentObj.isDingTalk) {
        dd.ready(function() {
          dd.biz.navigation.setTitle({
            title: title //控制标题文本，空字符串表示显示默认文本
          })
        })
      } else {
        document.title = title
      }
    },
    getInfo() {
      this.axios
        .get('/rw/info/' + this.code)
        .then(res => {
          this.changePageTitle(res.data.stnm + '水雨情')
          this.infoData = res.data

          var features = JSON.parse(res.data.feature)

          if (res.data.period == 'tx') {
            this.xxTitle.t0 = '台汛期'
            this.xxTitle.t4 = '台'
            this.xxTitle.t1 = '汛限'
            this.xxTitle.t2 = '汛限'
          } else if (res.data.period == 'mx') {
            this.xxTitle.t0 = '梅汛期'
            this.xxTitle.t1 = '汛限'
            this.xxTitle.t2 = '汛限'
            this.xxTitle.t4 = '梅'
          } else {
          }
          var diff = this.infoData.realtime.diff

          this.text = parseFloat(Math.abs(this.infoData.realtime.diff)).toFixed(
            2
          )
          if (diff > 0) {
            this.text =
              "<span style='color:#FFF884;'  class='font38'>↑ </span>" +
              "<span ><b style='color:#FFF884;'  class='font38'>" +
              this.text +
              '</b> m' +
              '</span>'
          } else if (this.text == 0) {
            this.text = "<b  class='font38'>" + this.text + '</b> m'
          } else {
            this.text =
              "<span style='color:#6DF3FF; ' class=' font38'>↓ </span>" +
              "<span  ><b style='color:#6DF3FF;'  class='font38'>" +
              this.text +
              '</b> m' +
              '</span>'
          }
          if (!features) {
            this.waterTable += '<tr><td>暂无资料</td></tr>'
          } else {
            var tableHtml = ''
            features.row1.map(obj => {
              tableHtml +=
                '<tr><td>' +
                obj.col1 +
                "</td><td colspan='2' width='30%'>" +
                obj.col2.replace('m3', 'm³') +
                '</td></tr>'
            })

            features.row2.map(obj => {
              if (isNaN(obj.col1)) {
                tableHtml +=
                  "<tr><td width='45%'>" +
                  obj.col1 +
                  "</td><td width='30%'>" +
                  (isNaN(obj.col2)
                    ? obj.col2.replace('m3', 'm³')
                    : parseFloat(obj.col2).toFixed(2)) +
                  "</td><td width='30%'>" +
                  (isNaN(obj.col3)
                    ? obj.col3.replace('m3', 'm³')
                    : parseFloat(obj.col3).toFixed(0)) +
                  '</td></tr>'
              } else {
                // 下面库容
                tableHtml +=
                  "<tr><td width='45%'>" +
                  obj.col1 +
                  "</td><td width='30%'>" +
                  (obj.col2.length > 0
                    ? isNaN(obj.col2)
                      ? obj.col2.replace('m3', 'm³')
                      : parseFloat(obj.col2).toFixed(0)
                    : '') +
                  "</td><td width='30%'>" +
                  (isNaN(obj.col3)
                    ? obj.col3.replace('m3', 'm³')
                    : parseFloat(obj.col3).toFixed(0)) +
                  '</td></tr>'
              }
            })
            this.waterTable = tableHtml
          }
          if (this.infoData.realtime.val > this.infoData.realtime.xxsw) {
            this.show = true
          }
          this.waterLevel(this.xxTitle.t1, this.infoData.realtime.xxsw)
        })
        .catch(err => {})
    },
    tenTableHtml(data, num) {
      var str = ''
      if (data.rainlist[num].status == '1') {
        str +=
          '<td class="orange">' + data.rainlist[num].val.toFixed(1) + '</td>'
      } else {
        str += '<td>' + data.rainlist[num].val.toFixed(1) + '</td>'
      }
      str +=
        '<td>' +
        data.rsvrlist[num].val.toFixed(2) +
        '</td>' +
        '<td>' +
        data.krlist[num].kr.toFixed(0) +
        '</td>'
      var sum = 0
      for (var i = 0; i <= num; i++) {
        sum += parseFloat(data.rainlist[i].val)
      }
      if (data.rainlist[num].status == '1') {
        str += '<td class="orange">' + sum.toFixed(1) + '</td></tr>'
      } else {
        str += '<td>' + sum.toFixed(1) + '</td></tr>'
      }
      return str
    },
    waterLevelHtml(data, num2) {
      var str = ''
      var rain = 0
      for (var i = 0; i <= num2; i++) {
        rain += data.rainlist[i].val
      }

      if (data.rainlist[num2].status == 1) {
        str += '<td class="orange">' + Math.abs(rain).toFixed(1) + '</td><td>'
      } else {
        str += '<td>' + Math.abs(rain).toFixed(1) + '</td><td>'
      }

      var realtime = this.infoData.realtime.val - data.rsvrlist[num2].val

      if (realtime > 0) {
        str +=
          "<span style='color:#EB521B; display:block; ' class='fl'>↑</span>" +
          '<span >' +
          realtime.toFixed(2) +
          '</span>'
      } else if (realtime == 0) {
        str += '<span >' + realtime.toFixed(2) + '</span>'
      } else {
        str +=
          '<span style="color:#159F8E; display:block;" class="fl">↓</span>' +
          '<span >' +
          Math.abs(realtime).toFixed(2) +
          '</span>'
      }
      str += '</td><td>'
      var sskr = this.infoData.realtime.sskr - data.krlist[num2].kr
      if (sskr > 0) {
        str +=
          "<span style='color:#EB521B; display:block;' class='fl'>↑</span>" +
          "<span style='display:block' class='fl'>" +
          sskr.toFixed(0) +
          '</span>'
      } else if (sskr == 0) {
        str +=
          "<span style='display:block' class='fl'>" +
          sskr.toFixed(0) +
          '</span>'
      } else {
        str +=
          '<span style="color:#159F8E; display:block;" class="fl">↓</span>' +
          "<span style='display:block;' class='fl'>" +
          Math.abs(sskr).toFixed(0) +
          '</span>'
      }
      str += '</td></tr>'

      return str
    },

    tenDayInfo() {
      this.axios
        .get('/rw/tenday/' + this.code)
        .then(res => {
          var data = res.data

          var etWater = data.rsvrlist[9].val
          var stWater = this.infoData.realtime.val

          if (stWater > etWater) {
            this.tenWater =
              " <span class='gray'>水位:</span><span >↑ </span>" +
              '<span ><b>' +
              Math.abs(etWater - stWater).toFixed(2) +
              '</b> m' +
              '</span>'
          } else if (stWater == etWater) {
            this.tenWater =
              '<span class="gray">水位:</span><b>' +
              Math.abs(etWater - stWater).toFixed(2) +
              '</b> m'
          } else {
            this.tenWater =
              "<span class='gray'>水位:</span><span style='color:#159F8E; ' >↓</span>" +
              "<span style='color:#159F8E;' ><b>" +
              Math.abs(etWater - stWater).toFixed(2) +
              '</b> m' +
              '</span>'
          }

          var tableHtml =
            '<tr><td>实时</td><td>' +
            this.numFilter(this.infoData.realtime.rain, 1) +
            '</td><td>' +
            this.numFilter(this.infoData.realtime.val, 2) +
            '</td><td>' +
            this.numFilter(this.infoData.realtime.sskr, 0) +
            '</td><td>-</td></tr>'
          tableHtml += '<tr><td>' + this.$moment().format('MM.DD') + '</td>'
          tableHtml += this.tenTableHtml(data, 0)
          tableHtml +=
            '<tr><td>' +
            this.$moment()
              .subtract(1, 'days')
              .format('MM.DD') +
            '</td>'
          tableHtml += this.tenTableHtml(data, 1)
          tableHtml +=
            '<tr><td>' +
            this.$moment()
              .subtract(2, 'days')
              .format('MM.DD') +
            '</td>'
          tableHtml += this.tenTableHtml(data, 2)
          tableHtml +=
            '<tr><td>' +
            this.$moment()
              .subtract(3, 'days')
              .format('MM.DD') +
            '</td>'
          tableHtml += this.tenTableHtml(data, 3)
          tableHtml +=
            '<tr><td>' +
            this.$moment()
              .subtract(4, 'days')
              .format('MM.DD') +
            '</td>'
          tableHtml += this.tenTableHtml(data, 4)
          tableHtml +=
            '<tr><td>' +
            this.$moment()
              .subtract(5, 'days')
              .format('MM.DD') +
            '</td>'
          tableHtml += this.tenTableHtml(data, 5)
          tableHtml +=
            '<tr><td>' +
            this.$moment()
              .subtract(6, 'days')
              .format('MM.DD') +
            '</td>'
          tableHtml += this.tenTableHtml(data, 6)
          tableHtml +=
            '<tr><td>' +
            this.$moment()
              .subtract(7, 'days')
              .format('MM.DD') +
            '</td>'
          tableHtml += this.tenTableHtml(data, 7)
          tableHtml +=
            '<tr><td>' +
            this.$moment()
              .subtract(8, 'days')
              .format('MM.DD') +
            '</td>'
          tableHtml += this.tenTableHtml(data, 8)
          tableHtml +=
            '<tr><td>' +
            this.$moment()
              .subtract(9, 'days')
              .format('MM.DD') +
            '</td>'
          tableHtml += this.tenTableHtml(data, 9)
          this.tenTable = tableHtml
          var waterLevelHtml = '<tr><td>今日</td>'
          waterLevelHtml += this.waterLevelHtml(data, 0)
          waterLevelHtml += '<tr><td>二日</td>'
          waterLevelHtml += this.waterLevelHtml(data, 1)
          waterLevelHtml += '<tr><td>三日</td>'
          waterLevelHtml += this.waterLevelHtml(data, 2)
          waterLevelHtml += '<tr><td>四日</td>'
          waterLevelHtml += this.waterLevelHtml(data, 3)
          waterLevelHtml += '<tr><td>五日</td>'
          waterLevelHtml += this.waterLevelHtml(data, 4)
          waterLevelHtml += '<tr><td>七日</td>'
          waterLevelHtml += this.waterLevelHtml(data, 6)
          waterLevelHtml += '<tr><td>十日</td>'
          waterLevelHtml += this.waterLevelHtml(data, 9)
          this.waterLevelTable = waterLevelHtml
        })
        .catch(err => {})
    },
    drawLine() {
      this.axios.get('/rw/dayrain/' + this.code).then(res => {
        var data = res.data.result
        var tms = [],
          rains = []
        var minMaxRain = []
        var sumRain = 0
        data.forEach(element => {
          tms.push(element.tm)
          rains.push(null != element.valrain ? element.valrain.toFixed(1) : '-')
          if (element.valrain) {
            minMaxRain.push(element.valrain)
            sumRain += element.valrain
          }
        })

        this.tenRain = sumRain.toFixed(1)
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption({
          title: { text: '' },
          tooltip: {
            trigger: 'axis',
            formatter: function(params) {
              return (
                '时间：' +
                moment(params[0].name).format('MM月DD日HH时mm分') +
                '<br>降雨：' +
                (isNaN(params[0].value)
                  ? '-'
                  : parseFloat(params[0].value).toFixed(1) + 'mm')
              )
            }
          },

          xAxis: {
            axisTick: {
              show: true
            },

            data: tms,
            position: 'top',
            // boundaryGap: false,
            axisLabel: {
              //interval: 119, // 自定义显示X轴坐标显示间隔
              //rotate: 30,
              textStyle: {
                color: '#333',
                fontSize: '12'
              },

              formatter: val => {
                return moment(val).format('MM-DD')
              },
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: '#E8E9F1'
              }
            },
            splitLine: { show: false }
          },
          yAxis: {
            axisTick: {
              show: false
            },
            type: 'value',
            inverse: true,
            min: 0,
            max: Math.max(...minMaxRain) + 3,
            axisLabel: {
              rotate: 0,
              formatter: function(value, index) {
                return value.toFixed(1)
              },
              textStyle: {
                color: '#2D8BEE', //更改坐标轴文字颜色
                fontSize: 10 //更改坐标轴文字大小
              }
            },
            splitLine: { show: false },
            axisLine: {
              lineStyle: {
                color: '#E8E9F1'
              }
            }
          },
          series: [
            {
              barWidth: 13, //柱图宽度
              barGap: 13, //柱图间距
              name: '销量',
              type: 'bar',
              data: rains,
              color: '#6AA9FC'
            }
          ]
        })
      })
    },
    waterLevel(xxTitle, xxsw) {
      this.axios.get('/rw/hour/' + this.code).then(res => {
        var tms = [],
          rsvrs = [],
          minMaxRsvr = []
        var data = res.data.result

        data.forEach(element => {
          tms.push(element.tm)
          // tms.push(moment(element.tm));
          rsvrs.push(null != element.val ? element.val.toFixed(2) : '-')
          if (element.val) {
            minMaxRsvr.push(element.val)
          }
        })

        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(
          document.getElementById('waterLevelChart')
        )
        // 绘制图表

        var option = {
          title: { text: '' },
          tooltip: {
            trigger: 'axis',
            formatter: function(params) {
              return (
                '时间：' +
                moment(params[0].name).format('MM月DD日HH时mm分') +
                '<br>' +
                params[0].seriesName +
                '：' +
                (isNaN(params[0].value)
                  ? '-'
                  : parseFloat(params[0].value).toFixed(2) + 'm')
              )
            }
          },

          xAxis: [
            {
              axisTick: {
                show: true
              },

              boundaryGap: true,
              show: true,

              axisLine: {
                onZero: false,
                lineStyle: {
                  color: '#E8E9F1'
                }
              },
              data: tms,
              axisLabel: {
                interval: 48, // 自定义显示X轴坐标显示间隔
                //rotate: 45,
                textStyle: {
                  color: '#333',
                  fontSize: '12'
                },
                formatter: val => {
                  return moment(val).format('MM-DD')
                }
              },
              splitLine: { show: false }
            }
          ],

          yAxis: [
            {
              // name: '水位(m)',
              axisTick: {
                show: false
              },
              type: 'value',
              max: Math.max(...minMaxRsvr) + 1,
              min: Math.min(...minMaxRsvr) - 1,
              axisLabel: {
                rotate: 0,
                formatter: function(value, index) {
                  return value.toFixed(1)
                },
                textStyle: {
                  color: '#03ACBE', //更改坐标轴文字颜色
                  fontSize: 10 //更改坐标轴文字大小
                }
              },
              splitLine: { show: false },
              axisLine: {
                lineStyle: {
                  color: '#E8E9F1'
                }
              }
            }
          ],

          series: [
            {
              name: '水位',
              type: 'line',
              animation: true,
              symbol: 'none',
              areaStyle: {},
              lineStyle: {
                width: 1,
                color: '#00DFF6' //改变曲线线颜色
              },
              mooth: true,
              data: rsvrs,
              color: '#E5FCFE',

              // itemStyle: {normal: {label: {show: true}}},

              markPoint: {
                symbol: 'pin',
                // symbol:
                //'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMoAAABACAYAAABbTugWAAAFnUlEQVR4Xu3db2gbdRgH8O+TpH0htklHB8OpiNa66Tv3alZ8PRTapJgKHWNrXVp8oRvM4gtfOEFBWkUnyMiftZPhwBab1hfia930jfWl64oKUwZi2/WuvmuTe+SStK5bk+YuDfZy33tV6P3+PJ+7L7lc7o+gzkv84tLBfCh0FJYctgJ6CECnKA4ACANoqfPw7L6xBP4BYKrgLwALAUvmEdAbwVzux6nX2m/Xs1SpR+fRtHFEVPoBfRGAHQ4uFKi3wDwg36jo1ZlEZG63B9u1oHRfWmwJ5puGAR0A5Ondnij7o0D1AvoLIBP54Hry61f3259CNS81ByU6sRJBLnBGVN8AsK/mGbEDCuyewB0V+RQh68LMQJtRS7fug6Iq0bRxUiBjANprmQTbUqDOAksKHZlJRD6HiLoZy1VQujNmR9CyLgPS5WZQtqHA/yOg11Xl5Mxw5Den4zsOSixpxCHIAGh1OhjXp8AeEFiF4nR2ODLlZC7VB8U+1MqYY6I452QArkuBvSiggo9mTodHqj0Uqyoo8UltXjfNCVH078WiOScKuBFQwdWmcHhgqk/Wdmq/Y1DskORMcxaKYzt1xv9TwHMCgm9D4XDPTmGpHBRViaWNK4Ac9xwAJ0yBqgX0i2wicqLSYVjFoMRSxgcA3qp6PK5IAY8KCDA6PRQpu6+XDUpv2nhZFY7ODHjUiNOmQFFA0VfubNi2QekdNx7XHH4uXbhIRgr4RcCUEJ6dHoz8fm/B9wel8L1k9TtAn/eLDuukwH8Cci2baH3h3u8r9wUlmlo5JZAJ0lHAtwKig9lE25YMbAmKfYGjrMsCgP2+RWLhFAAWtUk7776QcmtQ0uY7onqeUhTwu4CKnJ9JhN/dcNgMSvyzvx/MNTXf4qXyft9FWH9J4E4+uP7Yxv0sm0GJpYw3AdiXzHOhAAWKAiPZociH9h/FoBTOdJk3ATxJIQpQoCggwK/TiXCnfQasEJSe1OpzAVjXCUQBCmwVsBDomh1q/aEQlGjS/FhEzxKJAhS4V0AuZIfCZwtBiaWMG3xaCncRCmwjoLiZHY4ckt708sOqwT+JRAEKbC9ghfKPCi9+5O5BgcoCCrxi32/yHhRvE4sCFCgjIHhfYknjKwh6iUQBCpQRUExLLGX8BOAIkShAgbICcxJLmbcBfYhIFKBAWYFb9ifKKp8qz12EAhUEBMt2UFw9YpKwFPCRwBqD4qOtzVLdC/DQy70dW/pIgF/mfbSxWap7AZ4edm/Hlj4S4A+OPtrYLNW9AC9hcW/Hlj4SkGjK6BPgSx/VzFIp4FhAesaXHwnkgn84bskGFPCRQPHGraQxD8FTPqqbpVLAkUDpDkfzE0DPOGrJlSngI4FCUHozq11qWdd8VDdLpYAjgc3HFfWmzQUFOhy15soU8IkAH4Dnkw3NMmsT2AxK96XFlmC+yX6kalttXbI1BRpPgA/pbrxtyorqIMDXPtQBlV02nsB9LxKKpVcGoDLeeKWyIgq4Fyjzajrje0C63HfLlhRoLIFtX3YaTRpPiGCOLzttrI3NatwLlH19dixpxCGYdN81W1KgcQTKBsUuMZY0RiEYaZxyWQkF3AlUDErxBUPGFUCOu+uerSjQGAKVgwIgPqnNOdOcheJYY5TMKijgXGDHoNhd2mFZN80JUfQ7H4ItKOB9gaqCUihTVaIZc0wU57xfNiuggDOB6oNS6rd0NiwDoNXZUFybAt4VcBwUu9TujNkRtKzL/FHSuxueM3cm4CooG4disYxxCiqjANqdDcu1KeAtAfdBKdUZnViJBNZwVkVeB7DPW+VzthSoTqDmoGwMU7qfZRjAIIDD1Q3PtSjgDYFdC8rd5UbTxhFROSHQl3h7sTd2BM6yskBdgnL3kPGLSwfzodBRC/KMqNqPROoEcKB0J+UD3EAU8ILAv3MBiZwvM0S2AAAAAElFTkSuQmCC',
                // symbolOffset: ['34%', '-50%'],

                symbolSize: 70,
                itemStyle: {
                  color: '#519AF0'
                },

                data: [
                  // {
                  //   type: 'max',
                  //   name: '最大值'
                  // },
                  // { type: 'min', name: '最小值' },
                  {
                    name: '当前水位',
                    value: res.data.lastval,
                    xAxis: res.data.lasttm,
                    yAxis: res.data.lastval
                  }
                ],
                label: {
                  normal: {
                    formatter: function(res, index) {
                      var value = res.data.value
                      return value.toFixed(2)
                    }
                  }
                }
              }
            }
          ]
        }

        if (xxsw) {
          option.series[0].markLine = {
            silent: true,
            data: [
              {
                silent: true,
                yAxis: xxsw,
                type: 'average',
                name: xxTitle + '水位',
                symbol: 'none',
                lineStyle: {
                  //警戒线的样式  ，虚实  颜色
                  type: 'solid',
                  color: '#FF3838'
                }
              }
            ],
            label: {
              position: 'middle', //将警示值放在哪个位置，三个值“start”,"middle","end"  开始  中点 结束
              formatter: xxTitle + '水位(' + xxsw.toFixed(2) + ' m)',
              color: '#FF3838'
              // fontSize: 14
            }
          }
        }

        if (option && typeof option === 'object') {
          myChart.setOption(option, true)
        }
      })
    }
  },
  mounted() {
    this.drawLine()
    //this.waterLevel()
    this.getInfo()
    this.tenDayInfo()
    this.userAgentObj()
  }
}
</script>
<style>
.wing-stage-container {
  background: url('../assets/bg.png') no-repeat #edf0f4;
  background-size: 100%;
  padding: 20px;
  margin-bottom: 100px;
}
.wing-grid {
  color: #fff;
  font-size: 24px;
}
.wing-grid-list {
  display: flex;
  align-content: center;
  padding: 0 0 15px 0;
}
.wing-grid-item {
  flex: 1;
  height: 48px;
  line-height: 48px;
}
.wing-grid-item-num {
  color: #fff961;
  font-size: 38px;
  font-weight: 600;
}
/* .wing-grid .van-grid-item__content {
  background: none;
  padding: 16px 0px 16px 8px;
} 

.wing-sec-left {
  width: 40%;
}
.wing-icon {
  background: #4b9bf0;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  margin: auto;
  background-size: contain;
}*/

/* 设备像素比为 1 */
@media only screen and (-webkit-min-device-pixel-ratio: 1),
  only screen and (min-device-pixel-ratio: 1) {
  .wing-icon1 {
    background-image: url(../assets/icon1.png);
  }
  .wing-icon2 {
    background-image: url(../assets/icon2.png);
  }
  .wing-icon3 {
    background-image: url(../assets/icon3.png);
  }
  .wing-icon4 {
    background-image: url(../assets/icon4.png);
  }
}
/* 设备像素比为 2 */
@media only screen and (-webkit-min-device-pixel-ratio: 2),
  only screen and (min-device-pixel-ratio: 2) {
  .wing-icon1 {
    background-image: url(../assets/icon1@2x.png);
  }
  .wing-icon2 {
    background-image: url(../assets/icon2@2x.png);
  }
  .wing-icon3 {
    background-image: url(../assets/icon3@2x.png);
  }
  .wing-icon4 {
    background-image: url(../assets/icon4@2x.png);
  }
}

.wing-sec-right {
  width: 60%;
}
.wing-sec-grid .van-grid-item__content {
  flex-direction: inherit;
}
.wing-fir-grid {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
}
.wing-fir-grid span {
  font-size: 0.6rem;
  margin-bottom: 0.5rem;
}
.wing-fir-grid p {
  text-align: left;
  font-size: 0.8rem;
}
.wing-tips {
  border: 1px dotted rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  padding: 0.5rem;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}
.wing-tips span {
  margin-right: 0.8rem;
}
.wing-sec-right p {
  font-size: 0.85rem;
}
.wing-sec-right .wing-fir-p {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);

  height: 1.2rem;
}
.wing-box-container {
  background: #fff;
  border-radius: 30px;
  padding: 30px;
  margin-bottom: 30px;
}
.wing-table-top p > span > span.gray,
.wing-table-top span.gray {
  margin: 0 10px;
  font-size: 24px;
}
.gray {
  color: #808080;
}
.blue {
  color: #2d8bee;
}
.orange {
  color: #eb521b;
}
.wing-table-top {
  font-size: 28px;
}
.wing-table {
  border-left: 1px solid #eee;
  border-top: 1px solid #eee;
  border-right: 1px solid #eee;
  width: 100%;
  margin: 30px 0;
}
.wing-table th,
.wing-table td {
  border-bottom: 1px solid #f7f8fa;
  font-weight: inherit;
  padding: 10px 20px;
  font-size: 24px;
  color: #666;
  text-align: left;
}
.wing-table thead tr:nth-child(odd) {
  background-color: #f9f9f9;
}
.wing-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}
.wing-title {
  font-size: 28px;
  margin-top: 4px;
}
.skswyj {
  background: url(../assets/yj.png) no-repeat right center;
  background-size: contain;
  padding: 15px 40px 0 0;
  animation: fade 1200ms infinite;
  -webkit-animation: fade 1200ms infinite;
}

@keyframes fade {
  from {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  to {
    opacity: 1;
  }
}
.wing-rain {
  padding: 18px;
}
.wing-rain1 {
  background: url(../assets/ic_rain_01@2x.png) no-repeat center;
  background-size: contain;
}
.wing-rain2 {
  background: url(../assets/ic_rain_02@2x.png) no-repeat center;
  background-size: contain;
}
.wing-rain3 {
  background: url(../assets/ic_rain_03@2x.png) no-repeat center;
  background-size: contain;
}
.wing-rain4 {
  background: url(../assets/ic_rain_04@2x.png) no-repeat center;
  background-size: contain;
}
.wing-rain5 {
  background: url(../assets/ic_rain_05@2x.png) no-repeat center;
  background-size: contain;
}
.wing-rain6 {
  background: url(../assets/ic_rain_06@2x.png) no-repeat center;
  background-size: contain;
}
.wing-fir-grid p.wing-time {
  font-size: 1.2rem;
  margin-left: -0.7rem;
}
.wing-xxtitle {
  background: url(../assets/ic_mxq@2x.png) no-repeat center;
  background-size: contain;
  position: absolute;
  width: 67px;
  height: 27px;
  top: 0rem;
  right: -80px;
  color: #1374da;
  font-size: 18px;
  text-align: center;
}
.wing-table-top p.fr {
  display: flex;
}
.wing-table-top span.blue {
  font-size: 32px;
}
.wing-table-top span.orange {
  font-size: 32px;
}
.wing-levelTable tr th,
.wing-levelTable tr td {
  text-align: center;
  padding: 14px;
}
.font38 {
  font-size: 38px;
}
.wing-table td.orange {
  color: #eb521b;
}
.wing-grid-r {
  padding-top: 4px;
}
.wing-waterTable tr th,
.wing-waterTable tr td {
  font-size: 28px;
}
/* #myChart {
  width: 660px;
  height: 120px;
}
#waterLevelChart {
  width: 660px;
  height: 150px;
  margin-top: 20px;
} */
</style>
