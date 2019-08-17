//index.js
var WxParse = require('../../wxParse/wxParse.js');

//获取应用实例
const app = getApp();

Page({
  data: {
    articles: [],
    comments: [],
  },

  onLoad: function (options) {
    const self = this;

    var postId = options.postId;

    console.log(postId);

    // 请求最近文章
    
    // 请求文章评论
    this.getPostComments(postId);
  },
  
  // 获取文章评论
  getPostComments:  function(postId) {
    wx.request({
      url: "https://sobird.me/wp-json/wp/v2/comments",
      data: {
        post: postId,
        noncestr: Date.now()
      },
      success(result) {
        var data = result.data || [];
        data.filter(function (item) {
          //var excerpt = WxParse.wxParse('excerpt', 'html', item.excerpt.rendered, self, 5);
          //item.excerptParsed = excerpt;
        });

        self.setData({
          comments: data
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