const app = getApp();
Page({
    data: {
        mobile_phone: "", //用户号码
    },

    onLoad() {
        this.getUserinfo();
    },

    //用户信息
    getUserinfo() {
        app.request("/customUser.do", "FIND", {}, (data, code) => {
            this.setData({
                mobile_phone: data.data.customUser.mobile_phone,
            });
        });
    },
  })