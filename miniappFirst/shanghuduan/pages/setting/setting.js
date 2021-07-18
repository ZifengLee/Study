const app = getApp();

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
        app.request("/merchantCustom.do", "FIND", {}, (data, code) => {
            if (data.code === 200) {
                this.setData({
                    merchant: data.data.merchant,
                });
            }
        });
    },

    //跳转到修改密码页面
    goToChangePassword() {
        wx.navigateTo({
            url: "/pages/changePassword/changePassword",
        });
    },

    // 下拉刷新
    onPullDownRefresh: function () {
        this.onLoad();
        setTimeout(function () {
            wx.hideNavigationBarLoading(); //完成停止加载
            wx.stopPullDownRefresh(); //停止下拉刷新
        }, 1500);
    },
});
