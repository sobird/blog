//index.js
var WxParse = require('../../wxParse/wxParse.js');

//获取应用实例
const app = getApp();

Page({
  data: {
    post: {},
    comments: [],
  },

  onLoad: function (options) {
    const self = this;

    var postId = options.postId;

    var articles = wx.getStorageSync('articles') || [];

    var post = articles[articles.findIndex(function(item) {
      return item.id == postId;
    })];

    // var contentNode = self.convertRichTextNode(post.contentParsed);
    // post.contentNode = contentNode;

    self.setData({
      post: post
    });
    
    // 请求文章评论
    this.getPostComments(postId);
  },

  convertRichTextNode: function (contentNode) {
    var newNode = [];

    function convertNode(contentNode, newNode) {
      contentNode.forEach(function (node) {
        var tmp = {};
        var type = node.node;
        var tagName = node.tag;
        var attrs = {};

        node.attr && Object.assign(attrs, node.attr);

        switch (tagName) {
          case 'wxxxcode-style':
            tagName = 'code';
            break;
          default:
            // todo nothing
        } 

        if(type === 'text') {
          tmp = {
            type,
            text: node.text
          }
        } else {
          attrs.class = tagName;

          tmp = {
            name: tagName,
            attrs,
            children: []
          }
        }

        newNode.push(tmp);
        
        if(node.nodes) {
          convertNode(node.nodes, tmp.children);
        } 
      });
    }
    convertNode(contentNode, newNode);

    return newNode;
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
