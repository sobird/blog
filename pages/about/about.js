//index.js

//获取应用实例
const app = getApp();

Page({
  data: {
    post: {},
    comments: [],
  },

  onLoad: function () {
    const self = this;

    wx.showLoading({
      title: '加载中',
    });

    this.getAboutPage();
    
    // 请求文章评论
    // this.getPostComments(postId);
  },

  getAboutPage: function() {
    var self = this;
    wx.request({
      url: "https://sobird.me/wp-json/wp/v2/pages/2",
      data: {
        noncestr: Date.now()
      },
      success(result) {
        wx.hideLoading();
        
        var data = result.data || [];

        self.setData({
          post: data
        })
      },

      fail({ errMsg }) {
        wx.hideLoading();
      }
    })
  },
  
  // 获取文章评论
  getPostComments:  function(postId) {
    var self = this;
    wx.request({
      url: "https://sobird.me/wp-json/wp/v2/comments",
      data: {
        post: postId,
        noncestr: Date.now()
      },
      success(result) {
        var data = result.data || [];

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
