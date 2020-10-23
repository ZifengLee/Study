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
});
