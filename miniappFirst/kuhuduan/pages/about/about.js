const app = getApp();
Page({
    data: {
        content: "", //关于我们的内容
    },

    onLoad: function (options) {
        this.getContent();
    },

    //关于我们的内容
    getContent() {
        app.request("/aboutUs.do", "FIND", {}, (data, code) => {
            this.setData({
                content: data.data.aboutUs.content,
            });
        });
    },

    // 下拉加载
    onPullDownRefresh: function () {
        this.onLoad();
        this.getLocation();
        setTimeout(function () {
            wx.hideNavigationBarLoading(); //完成停止加载
            wx.stopPullDownRefresh(); //停止下拉刷新
        }, 1500);
    },
});
