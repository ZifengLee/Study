const app = getApp();

Page({
    data: {
        imgBaseUrl: app.data.imgbaseUrl, // 图片路径
        goodId: "", //商品ID
        orderId: "", //订单ID
        merchantInfo: {}, //商家门店信息
        mobile_phone: "",
        userInfo: {
            mobile_phone: "",
            remark: "",
        },
        orderInfo: {},
        actuallyAmount: 0.0,
        showModal: false,
        commdity: [],
        buttonClicked: false, //避免多次点击
    },

    onLoad: function (options) {
        this.setData({
            carts: wx.getStorageSync("carts"),
        });
        this.data.goodId = options.id;
        app.getMerchantInfo((merchant) => {
            this.setData({
                merchantInfo: merchant,
            });
        });
        console.log(this.data.merchantInfo);

        //拿到订单的数据
        if (app.data.orderInfo) {
            console.log(app.data.orderInfo);

            this.setData({
                orderInfo: app.data.orderInfo,
                actuallyAmount: app.data.orderInfo.actuallyAmount,
            });
        }
        this.getGoodsDetail();
        this.getUserMobile_phone();
    },

    // 获取详情页的数据
    getGoodsDetail() {
        var that = this;
        let carts = wx.getStorageSync("carts") || [];
        if (this.data.goodId === undefined) {
            // 初始化toastStr字符串
            var toastStr = "cid:";
            // 遍历取出已勾选的cid
            for (var i = 0; i < this.data.carts.length; i++) {
                if (this.data.carts[i].selected) {
                    toastStr += this.data.carts[i].cid;
                    toastStr += " ";
                }
            }
            const req = carts.filter((it) => it.selected);
            this.setData({
                commdity: req,
            });
        } else {
            const req = [];
            req.push(wx.getStorageSync("goods"));
            console.log(req);
            this.setData({
                commdity: req,
            });
        }

        app.request(
            "/customOrderForm.do",
            "SHOPING",
            { commodity: this.data.commdity },
            (data) => {
                console.log(data);
                if (data.code === 200) {
                    app.data.orderInfo = data.data;
                    this.setData({
                        orderInfo: app.data.orderInfo,
                    });
                } else {
                    wx.showToast({
                        title: data.message,
                        icon: "none",
                        duration: 1000,
                        mask: true,
                    });
                }
            }
        );
    },

    //提示
    showToast(title) {
        wx.showToast({
            title: title, //提示文字
            duration: 2000, //显示时长
            mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false
            icon: "none", //图标，支持"success"、"loading"
        });
    },

    //提交订单
    payOrder() {
        let carts = wx.getStorageSync("carts") || [];
        this.buttonClicked(this);
        if (this.data.mobile_phone != null) {
            if (this.data.mobile_phone.length === 11) {
                wx.showLoading({
                    title: "加载中",
                    icon: "none",
                    mask: true,
                });
                app.request(
                    "/customOrderForm.do",
                    "ADD",
                    {
                        merchant_id: this.data.merchantInfo.id,
                        take_phone: this.data.mobile_phone,
                        remark: this.data.userInfo.remark,
                        commodity: this.data.commdity,
                    },
                    (data, code) => {
                        if (data.code === 200) {
                            this.data.orderId = data.data.id;
                            //从购物车提交的订单，清除所选中商品的缓存
                            if (this.data.goodId === undefined) {
                                carts = carts.filter((it) => !it.selected);
                                wx.setStorage({ key: "carts", data: carts });
                            }
                            this.goToPay();
                        }
                    }
                );
            }
        } else {
            wx.showModal({
                content: "请填写取货电话",
                confirmText: "确认",
            });
        }
    },

    //立即支付
    goToPay() {
        app.request(
            "/customOrderForm.do",
            "PAYMENT",
            {
                id: this.data.orderId,
            },
            (data, code) => {
                if (data.code === 200) {
                    this.setData({
                        freeTime: 1,
                    });
                    wx.requestPayment({
                        timeStamp: data.data.pay_info.timeStamp,
                        nonceStr: data.data.pay_info.nonceStr,
                        package: data.data.pay_info.package,
                        signType: "MD5",
                        paySign: data.data.pay_info.paySign,
                        success(res) {
                            wx.showToast({
                                title: "微信支付成功",
                                icon: "none",
                                duration: 1000,
                                mask: true,
                            });
                            wx.switchTab({
                                url: "/pages/goods/goods",
                            });
                        },
                        fail(err) {
                            wx.hideLoading();
                            wx.showToast({
                                title: "支付失败",
                                icon: "none",
                                duration: 1000,
                                mask: true,
                            });
                            wx.switchTab({
                                url: "/pages/order/order",
                            });
                        },
                    });
                }
            }
        );
    },

    //用户电话
    getUserMobile_phone() {
        app.request("/customUser.do", "FIND", {}, (data, code) => {
            this.setData({
                mobile_phone: data.data.customUser.mobile_phone,
            });
            this.data.userInfo.mobile_phone = this.data.mobile_phone;
        });
    },

    //填写手机号码
    changeCustomerInfoMobilePhone(e) {
        this.setData({
            showModal: true,
        });
    },

    //填写备注
    changeRemark(e) {
        this.data.userInfo.remark = e.detail.value;
    },

    //填写取货电话后确认
    bindshowModalSuccess(e) {
        this.data.userInfo.mobile_phone = e.detail;
        this.setData({
            mobile_phone: e.detail,
            showModal: false,
        });
        if (e.detail.length != 0) {
            //保存用户取货电话
            app.request(
                "/customUser.do",
                "UPDATE",
                {
                    mobile_phone: e.detail,
                },
                (data) => {}
            );
        }
    },

    //避免多次点击
    buttonClicked: function () {
        var that = this;
        this.setData({
            buttonClicked: true,
        });
        setTimeout(function () {
            that.setData({
                buttonClicked: false,
            });
        }, 2000);
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
