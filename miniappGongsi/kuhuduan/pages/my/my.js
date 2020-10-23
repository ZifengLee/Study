const app = getApp();
Page({
    data: {
        isshow: false,
        phone: "0756-86256548",
        is_custom: 0,
        mobile_phone: "", //电话号码
        zongfen: "",
        page_number: 1,
        merchantInfo: {},
        // avatarUrl: "", //用户头像
        // nickName: "", //昵称
    },

    showMerchantInfo(item) {
        this.setData({
            merchantInfo: item,
        });
    },

    //用户信息
    getUserinfo() {
        app.request("/customUser.do", "FIND", {}, (data, code) => {
            app.getMerchantInfo((merchant) => {
                this.showMerchantInfo(merchant);
            });

            this.setData({
                is_custom: data.data.customUser.is_custom,
                avatarUrl: data.data.customUser.image,
                mobile_phone: data.data.customUser.mobile_phone,
                nickName: data.data.customUser.name,
            });
        });
    },

    //登录
    login() {
        wx.getSetting({
            success: (res) => {
                wx.getUserInfo({
                    success: (res) => {
                        var userInfo = res.userInfo;
                        var nickName = userInfo.nickName;
                        var avatarUrl = userInfo.avatarUrl;
                        var gender = userInfo.gender;
                        app.request(
                            "/customUser.do",
                            "LOGIN",
                            {
                                name: nickName,
                                sex: gender,
                                image: avatarUrl,
                            },
                            () => {
                                this.getUserinfo();
                            }
                        );
                    },
                    fail: (res) => {
                        console.log("wx.getUserInfo fail", res);
                    },
                });
            },
        });
    },

    getJifen() {
        app.request(
            "/customAccount.do",
            "LIST",
            {
                page_number: this.data.page_number,
                page_count: app.getPageCount(),
            },
            (data, code) => {
                this.setData({
                    zongfen: data.data.integral,
                });
            }
        );
    },

    onShow() {
        this.getUserinfo();
        this.getJifen();
    },

    goCart() {
        wx.navigateTo({
            url: "/pages/cart/cart",
        });
    },
    goSet() {
        wx.navigateTo({
            url: "/pages/set/set",
        });
    },

    // 联系客服
    WePhone() {
        var that = this;
        app.request("/userInfo.do", "FIND", {}, (data, code) => {
            this.setData({
                mobile_phone: data.data.mobile_phone,
            });
            if (data.code == 200) {
                wx.showModal({
                    title: "客服电话",
                    content: this.data.mobile_phone,
                    showCancel: false,
                    confirmText: "拨打电话",
                    success: function (res) {
                        wx.makePhoneCall({
                            phoneNumber: that.data.mobile_phone,
                        });
                    },
                });
            }
        });
    },

    goWe() {
        wx.navigateTo({
            url: "/pages/about/about",
        });
    },

    goJifen() {
        wx.navigateTo({
            url: "/pages/jifen/jifen",
        });
    },
    gozitidian() {
        wx.navigateTo({
            url: "/pages/zitidian/zitidian",
        });
    },
});
