//index.js
var WxParse = require('../../wxParse/wxParse.js');

console.log(WxParse);

//获取应用实例
const app = getApp()

Page({
  data: {
    articles: [],
    motto: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    test: function(){
      return '1212'
    }
  },
  onPullDownRefresh() {
    wx.showToast({
      title: 'loading...',
      icon: 'loading'
    })
    console.log('onPullDownRefresh', new Date())
  },
  stopPullDownRefresh() {
    wx.stopPullDownRefresh({
      complete(res) {
        wx.hideToast()
        console.log(res, new Date())
      }
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    const self = this
    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    var test = WxParse.wxParse('motto', 'html', '<view>Hello World</view>', self, 5);

    console.log(test);

    // 请求最近文章
    wx.request({
      url: "https://sobird.me/wp-json/wp/v2/posts",
      data: {
        noncestr: Date.now()
      },
      success(result) {
        wx.showToast({
          title: '请求成功',
          icon: 'success',
          mask: true,
          duration: 2000,
        })
        self.setData({
          loading: false
        })

        var data = result.data || [];
        data.filter(function(item) {
          var excerpt = WxParse.wxParse('excerpt', 'html', item.excerpt.rendered, self, 5);
          item.excerptParsed = excerpt;

          console.log(excerpt);
        });

        self.setData({
          articles: data
        })
      },

      fail({ errMsg }) {
        console.log('request fail', errMsg)
        self.setData({
          loading: false
        })
      }
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  _wxParse: function() {
    var self = this;
    WxParse.wxParse('motto', 'html', '<view>Hello World</view>', self, 5);

    return '11'
  }
})
