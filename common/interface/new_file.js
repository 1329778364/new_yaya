//index.js


import { config } from '../../config.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    login_pic:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              //从数据库获取用户信息
              that.queryUsreInfo();
              //用户已经授权过
              wx.switchTab({
                url: '/pages/index/index'
              })
            }
          });
        }
      }
    })
    // 登录图片
    wx.request({
      url: config.api_base_url + 'index/login_pic',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          login_pic: res.data.msg
        })
      }
    })

  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      //插入登录的用户的相关信息到数据库
      var openid = getApp().globalData.openid; 
      wx.request({
        url: config.api_base_url + 'Xcx/login', 
        data: {
          userinfo: e.detail.userInfo,
          openid: openid
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        method:'post',
        success(res) {
          if (res.data.result==1){
            wx.switchTab({
              url: '/pages/index/index'
            })
          }else{
            console.log("写入失败")
          }
        }
      })
      //授权成功后，跳转进入小程序首页
      
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  //获取用户信息接口
  queryUsreInfo: function () {
    // var openid = getApp().globalData.openid;
    // wx.request({
    //   url: getApp().globalData.urlPath + 'hstc_interface/queryByOpenid',
    //   data: {
    //     openid: getApp().globalData.openid
    //   },
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     console.log(res.data);
    //     getApp().globalData.userInfo = res.data;
    //   }
    // }) 
  },  
})

index.json


{
  "navigationBarTitleText": "授权登录"
}


index.wxml

<view wx:if="{{canIUse}}">
    <view class='header'>
        <image src='{{login_pic}}'></image>
    </view>
    <!-- <view class='content'>
        <view>申请获取以下权限</view>
        <text>获得你的公开信息(昵称，头像等)</text>
    </view> -->
    <button class='bottom' type='primary' open-type="getUserInfo" lang="zh_CN" bindgetuserinfo="bindGetUserInfo">
        开启
    </button>
</view>
<view wx:else>请升级微信版本</view>

index.js

.header {
    margin: 90rpx 0 90rpx 50rpx;
    /* border-bottom: 1px solid #ccc; */
    text-align: center;
    width: 650rpx;
    height: 600rpx;
    line-height: 450rpx;
}
 
.header image {
    width: 300px;
    height: 350px;
}
 
.content {
    margin-left: 50rpx;
    margin-bottom: 90rpx;
}
 
 
 
 
 // *****************************
 onLoad: function (options) {
     //获取栏目
     var that = this
     wx.showLoading({
       title: ''
     })
     // 查看是否授权
     wx.getSetting({
       success: function (res) {
         if (!res.authSetting['scope.userInfo']) {
           //未登录,跳转到登录页
           wx.redirectTo({
             url: '/pages/login/index',
           })
         }
       }
     })
     //获取banner
     wx.request({
       url: config.api_base_url + 'index/banner', 
       header: {
         'content-type': 'application/json' // 默认值
       },
       success(res) {
         that.setData({
           slider: res.data.msg.banner,
           text: res.data.msg.pmd
         })
       }
     })
     
     
     setTimeout(function () {
       wx.hideLoading()
       that.setData({
         hidden: false
       })
     }, 2000)
     
   },
.content text {
    display: block;
    color: #9d9d9d;
    margin-top: 40rpx;
}
 
.bottom {
    border-radius: 80rpx;
    margin: 70rpx 50rpx;
    font-size: 35rpx;
}



// *****************************
onLoad: function (options) {
    //获取栏目
    var that = this
    wx.showLoading({
      title: ''
    })
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (!res.authSetting['scope.userInfo']) {
          //未登录,跳转到登录页
          wx.redirectTo({
            url: '/pages/login/index',
          })
        }
      }
    })
    //获取banner
    wx.request({
      url: config.api_base_url + 'index/banner', 
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          slider: res.data.msg.banner,
          text: res.data.msg.pmd
        })
      }
    })
    
    
    setTimeout(function () {
      wx.hideLoading()
      that.setData({
        hidden: false
      })
    }, 2000)
    
  },