// 获取应用实例
const app = getApp();

Component({
    data: {
      canIUse: wx.canIUse('button.open-type.getUserInfo'),// 能否授权
      userInfo:{},
    },
    properties: {
      isHide:{
        type:'Boolean',
        default:false
      },
      isLogin:{
        type:'Boolean',
        default:false
      },
      weixinInfo:{
        type:'Object',
        default:{}
      }
    },
    pageLifetimes: {
        // 组件所在页面的生命周期函数
        hide() {
            this.setData({
                isHide: true
            });
            // wx.removeStorageSync('goodsoattributes');
        },
    },
    
    methods: {
       // 授权
    // 用户授权头像以及微信名
    bindGetUserInfo: function (e) {
      var that = this
      // console.log(e)
      if (e.detail.userInfo) {
          // 获取到用户的信息了，打印到控制台上看下
         
          // this.data.weixinInfo = e.detail.userInfo;
          wx.login({
            success:res => {
              // console.log('用户id' + res.code)
              // console.log(e.detail.userInfo);
              app.request(
                '/customUser.do',
                "SAVE",
                {
                  code:res.code,
                  name:e.detail.userInfo.nickName,
                  sex:e.detail.userInfo.gender,
                  image:e.detail.userInfo.avatarUrl
                },
                (data,code) => {
                    // console.log(data)
                    this.setData({
                        isHide: false,
                       
                    })
                    that.onLoad() 
                }
            )
            }
          })
         
          // wx.setStorageSync('username')
          //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
          this.setData({
              isHide: false,
              // main:true
          });
          // this.login();
          // this.getLocation()
      } else {
          //用户按了拒绝按钮
          wx.showModal({
              title: '警告',
              content: '您拒绝了用户信息授权，将无法进入小程序，请授权之后再进入!!!',
              showCancel: false,
              confirmText: '返回授权',
              success: function (res) {
                  // 用户没有授权成功，不需要改变 isHide 的值
                  if (res.confirm) {
                      // console.log('用户点击了“返回授权”');

                  }
              }
          });
      }
  },
    }
})