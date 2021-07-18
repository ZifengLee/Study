//获取应用实例
const app = getApp();
Page({
    data: {
        checkboxItems: {
            name: "USA",
            value: "我已了解并阅读了",
            checked: false,
        },
        canIUse: wx.canIUse("button.open-type.getUserInfo"), // 能否授权
        isDisabled: true, //按钮禁用
        merchantId: "", //扫描得到的商家Id
    },
    onLoad: function (options) {
        console.log(options);
        this.setData({
            merchantId: options.merchantId,
        });
    },
    onShow() {},
    // 用户授权头像以及微信名
    bindGetUserInfo: function (e) {
        if (!this.data.checkboxItems.checked) {
            wx.showToast({
                title: "请先同意商家入驻协议", //提示文字
                duration: 1000, //显示时长
                mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false
                icon: "none", //图标，支持"success"、"loading"
            });
        } else if (e.detail.userInfo) {
            // 获取到用户的信息了，打印到控制台上看下
            wx.login({
                success: (res) => {
                    app.request(
                        "/customUser.do",
                        "LOGIN",
                        {
                            name: e.detail.userInfo.nickName,
                            sex: e.detail.userInfo.gender,
                            image: e.detail.userInfo.avatarUrl,
                            merchant_id: this.data.merchantId,
                        },
                        (data, code) => {
                            if (code === 200) {
                                this.setData({
                                    isHide: false,
                                });
                                wx.navigateBack({
                                    delta: 1,
                                });
                            }
                        }
                    );
                },
            });
        } else {
            //用户按了拒绝按钮
            wx.showModal({
                title: "警告",
                content:
                    "您拒绝了用户信息授权，将无法进入小程序，请授权之后再进入!!!",
                showCancel: false,
                confirmText: "返回授权",
                success: function (res) {
                    // 用户没有授权成功，不需要改变 isHide 的值
                    if (res.confirm) {
                        // console.log('用户点击了“返回授权”');
                    }
                },
            });
        }
    },
    // 平台服务协议
    goToService() {
        wx.navigateTo({
            url: "/pages/platformService/platformService",
        });
    },
    checkboxChange1: function (e) {
        var checkboxItems = this.data.checkboxItems;
        if (checkboxItems.checked == false) {
            checkboxItems["checked"] = true;
            this.setData({
                isDisabled: false,
            });
        } else {
            checkboxItems["checked"] = false;
            this.setData({
                isDisabled: true,
            });
        }
        this.setData({
            checkboxItems: checkboxItems,
        });
    },
    //注册隐私协议
    modalTap() {
        wx.navigateTo({
            url: "/pages/privacyAgreement/privacyAgreement",
        });
    },
});
