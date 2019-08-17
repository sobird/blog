//index.js
var WxParse = require('../../wxParse/wxParse.js');

//获取应用实例
const app = getApp();

let page = 1;

Page({
  data: {
    articles: [],
    hideMore: true,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  onPullDownRefresh() {
    //wx.showNavigationBarLoading();
  },
  stopPullDownRefresh() {
    wx.stopPullDownRefresh({
      complete(res) {
        wx.hideToast()
        console.log(res, new Date())
      }
    })
  },
  onReachBottom() {
    var self = this;
    self.setData({
      hideMore: false
    });

    page++;
    
    this.getPosts(page);
  },

  //事件处理函数
  bindViewTap: function (event) {
    var id = event.currentTarget.dataset['id'];

    wx.navigateTo({
      url: '../single/single?postId=' + id
    })
  },
  onLoad: function () {
    const self = this;

    this.getPosts();
  },

  // 获取文章列表
  getPosts: function( page = 1) {
    var self = this;
    var url = 'https://sobird.me/wp-json/wp/v2/posts?page=' + page;

    wx.request({
      url: url,
      data: {
        noncestr: Date.now()
      },
      success(result) {

        self.setData({
          loading: false
        })

        var data = result.data || [];
        var oldData = self.data.articles;


        data.filter(function (item) {
          var excerpt = WxParse.wxParse('excerpt', 'html', item.excerpt.rendered, self, 5);
          item.excerptParsed = excerpt;
        });

        self.setData({
          articles: oldData.concat(data),
          hideMore: true
        })
      },

      fail({ errMsg }) {
        console.log('request fail', errMsg)
        self.setData({
          loading: false
        })
      }
    })
  }
})
