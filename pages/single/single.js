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

    console.log(postId);

    var articles = wx.getStorageSync('articles') || [];

    var post = articles[articles.findIndex(function(item) {
      return item.id == postId;
    })];

    var contentNode = self.convertRichTextNode(post.contentParsed);

    self.setData({
      post: post
    });
    
    // 请求文章评论
    this.getPostComments(postId);
  },

  convertRichTextNode: function (contentNode) {
    console.log(contentNode);
    
    var newNode = [];

    function convertNode(contentNode, child) {
      var _tmp = [];

      contentNode.forEach(function (node, index) {
        var type = node.node;

        var tagName = node.tag;
        var nodeClass = '';
        if (node.attr && node.attr.class) {
          nodeClass = node.attr.class;
        }

        var _newNode = {};

        if(type === 'text') {
          _newNode = {
            type: 'text',
            attrs: {
              class: nodeClass + ' text'
            },
            text: node.text
          };

        } else {
          _newNode = {
            name: tagName,
            attrs: {
              class: nodeClass + ' ' + tagName
            }
          };
        }

        
        
        if(node.nodes) {
          var children = convertNode(node.nodes, _newNode);
          _newNode.children = children;

          console.log('children', children);
          
          newNode.push(node);

          
        } else {
          
        }

        _tmp.push(_newNode);
      });


      return _tmp;
    }

    convertNode(contentNode);


    console.log('newNode', newNode);

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
