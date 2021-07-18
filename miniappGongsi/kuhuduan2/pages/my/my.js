const app = getApp();
Page({
    data: {
        isshow: false,
        is_custom: 1,
        mobile_phone: "", //用户号码
        page_number: 1,
        merchantInfo: {},//自提点商家信息
        result: '',//扫描二维码得到的结果
        cashCoupons: "",//当前现金券
        servicePhone: "",//客服电话
    },

    onShow() {
        this.getUserinfo();
    },

    //用户信息
    getUserinfo() {
        app.request("/customUser.do", "FIND", {}, (data, code) => {
            //得到缓存的商家信息
            app.getMerchantInfo((merchant) => {
                this.showMerchantInfo(merchant);
            });

            this.setData({
                cashCoupons: data.data.customUser.money,
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

    //获取手机号码
    // getPhoneNumber: function (e) {
    //     var that = this;
    //     console.log(e.detail.errMsg == "getPhoneNumber:ok");
    //     console.log(e.detail);

    //     if (e.detail.errMsg == "getPhoneNumber:ok") {
    //         wx.request({
    //             // url: 'http://localhost/index/users/decodePhone',
    //             data: {
    //                 encryptedData: e.detail.encryptedData,
    //                 iv: e.detail.iv,
    //                 sessionKey: that.data.session_key,
    //                 uid: "",
    //             },
    //             method: "post",
    //             success: function (res) {
    //                 console.log(res);
    //             }
    //         })
    //     }
    // },

    //扫码
    goScanCode: function () {
        // 允许从相机和相册扫码
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

    //现金券明细
    goCashCoupons() {
        wx.navigateTo({
            url: "/pages/cashCoupons/cashCoupons",
        });
    },

    //选择自提点
    pickUpPoint() {
        wx.navigateTo({
            url: "/pages/zitidian/zitidian",
        });
    },

    //自提点商家信息
    showMerchantInfo(item) {
        this.setData({
            merchantInfo: item,
        });
    },

    //跳转购物车
    goCart() {
        wx.navigateTo({
            url: "/pages/cart/cart",
        });
    },

    //基础设置
    goBasicSet() {
        wx.navigateTo({
            url: "/pages/set/set",
        });
    },

    // 联系客服
    contactServicePhone() {
        app.request("/userInfo.do", "FIND", {}, (data, code) => {
            this.setData({
                servicePhone: data.data.mobile_phone,
            });
            if (data.code == 200) {
                wx.showModal({
                    title: "客服电话",
                    content: this.data.servicePhone,
                    showCancel: false,
                    confirmText: "拨打电话",
                    success: () => {
                        wx.makePhoneCall({
                            phoneNumber: this.data.servicePhone,
                        });
                    },
                });
            }
        });
    },

    //关于我们
    aboutUs() {
        wx.navigateTo({
            url: "/pages/about/about",
        });
    },
});
