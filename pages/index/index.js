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
    var self = this;

    this.getPosts(1, function(data) {
      self.setData({
        articles: data
      });

      wx.stopPullDownRefresh({
        complete(res) {
          // todo nothing
        }
      })
    });
  },

  onReachBottom() {
    var self = this;
    self.setData({
      hideMore: false
    });

    page++;
    
    this.getPosts(page, function(data) {
      var oldData = self.data.articles;

      self.setData({
        articles: oldData.concat(data),
        hideMore: true
      });
    });
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
  getPosts: function( page = 1, callback) {
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

        data.filter(function (item) {
          var excerpt = WxParse.wxParse('excerpt', 'html', item.excerpt.rendered, self, 5);
          item.excerptParsed = excerpt;
        });


        if (callback) {
          callback(data);
        } else {
          self.setData({
            articles: data
          });
        }
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
