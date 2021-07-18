const app = getApp();

Page({
    data: {
        imgBaseUrl: app.data.imgbaseUrl, // 图片路径
        orderDetail: {}, //订单详情
        goodsList: [], //订单商品列表
        order_id: "", // 订单id
        Minutes: "", // 计时中的分
        Second: "", // 计时中的秒
        payAmount: 0, // 实付
        servicePhone: "", //客服电话
        flag: true, //遮罩层隐藏
        buttonClicked: false, //避免多次点击
    },

    onLoad: function (options) {
        console.log(options);
        let order_id = options.order_id;
        this.setData({
            order_id: order_id,
        });
        this.getOrderDetail();
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

    //订单详情
    getOrderDetail() {
        app.request(
            "/customOrderForm.do",
            "FIND",
            {
                id: this.data.order_id,
            },
            (data, code) => {
                // console.log(data);
                this.setData({
                    orderDetail: data.data.order[0], //订单详情
                    goodsList: data.data.list, //订单商品列表
                });
                if (this.data.orderDetail.flag == "待付款") {
                    this.djs();
                }
            }
        );
    },

    // 待付款订单倒计时
    djs() {
        // 获取订单时间
        let create_time = this.data.orderDetail.create_time.split(".")[0];
        let djs = setInterval(() => {
            // 把订单时间转换为30分钟后的时间戳当成结束时间
            let endTime = new Date(create_time).getTime() + 30 * 60 * 1000;
            // 实时获取当前时间
            let date = new Date();
            let now = date.getTime();
            // 时间差
            let ts = endTime - now;
            //计算剩余的分钟数
            var mm = Math.floor((ts / 1000 / 60) % 60);
            //计算剩余的秒数
            var ss = Math.floor((ts / 1000) % 60);
            // 如果显示的分秒小于10,需要在其前面加上0更美观
            mm = mm < 10 ? "0" + mm : mm;
            ss = ss < 10 ? "0" + ss : ss;
            if (ts <= 0) {
                clearInterval(djs);
            } else {
                this.setData({
                    Minutes: mm,
                    Second: ss,
                });
            }
        }, 1000);
    },

    //立即支付
    goToPay() {
        this.buttonClicked(this);
        app.request(
            "/customOrderForm.do",
            "PAYMENT",
            {
                id: this.data.order_id,
            },
            (data, code) => {
                if (data.code === 200) {
                    wx.requestPayment({
                        timeStamp: data.data.pay_info.timeStamp,
                        nonceStr: data.data.pay_info.nonceStr,
                        package: data.data.pay_info.package,
                        signType: "MD5",
                        paySign: data.data.pay_info.paySign,
                        success(res) {
                            this.showToast("微信支付成功");
                        },
                        fail(err) {
                            wx.hideLoading();
                            this.showToast("支付失败");
                        },
                    });
                    // 返回上一级页面
                    wx.navigateBack({ delta: 1 });
                }
            }
        );
    },

    // 取消订单
    cancel() {
        // 先让用户选择是否确定取消订单
        app.request(
            "/customOrderForm.do",
            "CLOSE",
            {
                id: this.data.order_id,
            },
            (data, code) => {
                if (data.code == 200) {
                    wx.showToast({
                        title: "订单已超时,系统自动取消",
                        icon: "none",
                        duration: 1500,
                        mask: true,
                        success: (result) => {
                            setTimeout(() => {
                                wx.navigateBack({
                                    delta: 1,
                                });
                            }, 1500);
                        },
                    });
                }
            }
        );
    },

    // 确认收货
    confirmOrder() {
        app.request(
            "/customOrderForm.do",
            "UPDATE",
            {
                id: this.data.order_id, //订单ID
            },
            (data, code) => {
                if (data.code == 200) {
                    this.showToast("确认收货成功");
                    this.getList();
                    this.closeMask();
                }
            }
        );
    },

    //显示遮罩层
    showMask(e) {
        this.setData({
            flag: false,
        });
        this.data.order_id = e.target.dataset.id;
    },

    // 关闭遮罩层
    closeMask() {
        this.setData({ flag: true });
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
