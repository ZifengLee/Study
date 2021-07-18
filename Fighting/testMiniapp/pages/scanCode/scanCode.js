const app = getApp()

Page({
    data: {
        result: '',
    },

    // onLoad: function () {

    //     // this.getScancode();
    // },

    onLoad:function(){
        wx.scanCode({
            success: (res) => {
                var result = res.result;
                this.setData({
                    result: result,
                })
                wx.navigateTo({
                    url: "/pages/payment/payment?merchantName=" + this.data.result,
                });
            }
        })
    },
    // getScancode: function () {
    //     // 允许从相机和相册扫码
    //     wx.scanCode({
    //         success: (res) => {
    //             var result = res.result;
    //             this.setData({
    //                 result: result,
    //             })
    //             wx.navigateTo({
    //                 url: "/pages/payment/payment?merchantName=" + this.data.result,
    //             });
    //         }
    //     })
    // }

})