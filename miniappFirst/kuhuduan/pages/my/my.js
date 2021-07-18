const app = getApp();
Page({
    data: {
        is_custom: 0, //是否是新用户 0为新用户
        mobile_phone: "", //用户号码
        page_number: 1,
        merchantInfo: {}, //自提点商家信息
        merchantId: "", //扫描二维码得到的结果
        cashCoupons: "", //当前现金券
        servicePhone: "", //客服电话
    },

    onShow() {
        this.getUserinfo();
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

    //用户信息
    getUserinfo() {
        app.request("/customUser.do", "FIND", {}, (data, code) => {
            this.setData({
                cashCoupons: data.data.customUser.money,
                is_custom: data.data.customUser.is_custom,
            });
            //得到缓存的自提点信息
            app.getMerchantInfo((merchant) => {
                this.showMerchantInfo(merchant);
            });
        });
    },

    //扫码
    goScanCode: function () {
        // 允许从相机和相册扫码
        wx.scanCode({
            success: (res) => {
                var result = res.result;
                // 匹配字符串
                if (result.match(/:/)) {
                    var a = result.indexOf(":");
                    var length = result.length;
                    // 截取字符串
                    if (result.substring(0, a) == "merchant_id") {
                        this.setData({
                            merchantId: result.substring(a + 1, length),
                        });
                        // 如果不是新用户，跳到线下支付
                        if (this.data.is_custom === 1) {
                            wx.navigateTo({
                                url:
                                    "/pages/payment/payment?merchantId=" +
                                    this.data.merchantId,
                            });
                        } else {
                            // 如果是新用户，进行登录
                            wx.navigateTo({
                                url:
                                    "/pages/login/login?merchantId=" +
                                    this.data.merchantId,
                            });
                        }
                    } else {
                        app.showToast("扫描的不是商家二维码~");
                    }
                } else {
                    app.showToast("扫描的不是商家二维码~");
                }
            },
        });
    },

    //现金券明细
    goCashCoupons() {
        wx.navigateTo({
            url: "/pages/cashCoupons/cashCoupons",
        });
    },

    //选择自提点
    pickUpPoint() {
        if (this.data.is_custom === 1) {
            wx.navigateTo({
                url: "/pages/zitidian/zitidian",
            });
        } else {
            app.showToast("请先授权登录~");
        }
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
        if (this.data.is_custom === 1) {
            wx.navigateTo({
                url: "/pages/set/set",
            });
        } else {
            app.showToast("请先授权登录~");
        }
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
                    showCancel: true,
                    confirmText: "拨号",
                    cancelText: "取消",
                    success: (res) => {
                        if (!res.cancel) {
                            wx.makePhoneCall({
                                phoneNumber: this.data.servicePhone,
                            });
                        }
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

    // 下拉加载
    onPullDownRefresh: function () {
        this.getUserinfo(); //在下拉加载中不能调用onShow方法
        setTimeout(function () {
            wx.hideNavigationBarLoading(); //完成停止加载
            wx.stopPullDownRefresh(); //停止下拉刷新
        }, 1500);
    },
});
