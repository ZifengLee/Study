const app = getApp();

Page({
    data: {
        imgBaseUrl: app.data.imgbaseUrl, // 图片路径
        goodId: "", //商品ID
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
                    // console.log(app.data.orderInfo);
                    if (that.data.goodId === undefined) {
                        carts = carts.filter((it) => !it.selected);
                        wx.setStorage({ key: "carts", data: carts });
                    }
                } else {
                    wx.showToast({
                        title: data.message,
                        icon: "none",
                        duration: 1000,
                        mask: true,
                    });
                    //TODO 显示失败
                }
            }
        );
        // app.request(
        //     "/customCommodity.do",
        //     "FIND",
        //     {
        //         id: this.data.goodId,
        //     },
        //     (data) => {
        //         const value = data.data.data;
        //         console.log(value);
        //         this.openAttributes(value);
        //     }
        // );
    },

    //提交订单
    payOrder() {
        if (this.data.userInfo.mobile_phone === "") {
            wx.showToast({
                title: "请添加取货电话",
            });
        } else {
            app.request(
                "/customOrderForm.do",
                "ADD",
                {
                    merchant_id: this.data.merchantInfo.id,
                    take_phone: this.data.userInfo.mobile_phone,
                    remark: this.data.userInfo.remark,
                    commodity: this.data.commdity,
                },
                (data) => {
                    // TODO 微信支付
                    if (data.code === 200) {
                        wx.showModal({
                            title: "提交成功",
                        });
                        setTimeout(() => {
                            wx.switchTab({
                                url: "/pages/index/index",
                            });
                        }, 1500);
                    }
                }
            );
        }
    },

    //填写手机号码
    changeCustomerInfoMobilePhone(e) {
        this.setData({
            showModal: true,
        });
    },

    changeRemark(e) {
        this.data.userInfo.remark = e.detail.value;
    },

    bindshowModalSuccess(e) {
        this.data.userInfo.mobile_phone = e.detail;
        this.setData({
            mobile_phone: e.detail,
            showModal: false,
        });
    },
});
