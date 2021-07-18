const app = getApp()

Page({
    data: {
        imgbaseUrl: app.data.imgbaseUrl, // 图片基本路径
        merchant: {},
    },

    onLoad: function (options) {
        this.getMerchant();
    },

    //商铺信息
    getMerchant() {
        app.request(
            '/merchantCustom.do',
            'FIND', {},
            (data, code) => {
                // console.log(data);
                this.setData({
                    merchant: data.data.merchant,
                })
            }
        )
    },

//跳转到修改密码页面
goToChangePassword(){
    wx.navigateTo({
      url: '/pages/changePassword/changePassword'
    })
  }
})