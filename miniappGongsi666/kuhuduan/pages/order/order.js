const app = getApp();

Page({
    data: {
        imgBaseUrl: app.data.imgbaseUrl, //图片基础路径
        page_number: 1, //页数
        number: 0, //总页数
        orderList: [], //订单列表
        index: -1, //页签选择的第几个
        flagValue: 120, //订单状态
        orderId: "", //选择的订单ID
        flag: true, //遮罩层隐藏
        type: "", //1为取消订单，2为确认收货
    },

    onLoad: function (options) {
        this.data.index = 0;
        this.data.flagValue = 120;
    },

    onShow: function () {
        this.getList();
    },

    //获取不同状态的订单列表
    getList(e) {
        if (e) {
            this.data.flagValue = e.currentTarget.dataset.value;
        }
        this.data.page_number = 1; //页数
        this.data.orderList = []; //订单列表
        wx.showLoading({
            title: "加载中",
            icon: "none",
            mask: true,
        });
        app.request(
            "/customOrderForm.do",
            "LIST",
            {
                page_number: this.data.page_number,
                page_count: app.getPageCount(),
                condition: [
                    {
                        name: "flag",
                        operator: "=",
                        value: this.data.flagValue,
                    },
                ],
            },
            (data) => {
                wx.hideLoading({
                    success: (res) => {
                        this.setData({
                            flagValue: this.data.flagValue,
                            orderList: data.data.list,
                            number: Math.ceil(
                                data.data.count / app.getPageCount()
                            ),
                        });
                    },
                });
            }
        );
    },

    // 携带订单id跳转至订单详情
    goToOrderDetail(e) {
        // console.log(e)
        wx.navigateTo({
            url:
                "/pages/orderDetail/orderDetail?order_id=" +
                e.currentTarget.dataset.item.id,
        });
    },

    //取消订单
    closeOrder() {
        app.request(
            "/customOrderForm.do",
            "CLOSE",
            {
                id: this.data.orderId, //订单ID
            },
            (data) => {
                if (data.code === 200) {
                    this.getList();
                    wx.showToast({
                        title: "取消订单成功~",
                        icon: "none",
                        duration: 1000,
                        mask: true,
                    });
                }
            }
        );
        this.closeMask();
    },

    //立即支付
    goToPay(e) {
        const id = e.currentTarget.dataset.id;
        app.request(
            "/customOrderForm.do",
            "PAYMENT",
            {
                id: id, //订单ID
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
                            wx.showToast({
                                title: "微信支付成功",
                                icon: "none",
                                duration: 1000,
                                mask: true,
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
                        },
                    });
                    this.getList();
                }
            }
        );
    },

    //确认收货
    finishOrder() {
        app.request(
            "/customOrderForm.do",
            "UPDATE",
            {
                id: this.data.orderId, //订单ID
            },
            (data) => {
                if (data.code === 200) {
                    wx.showToast({
                        title: "确认收货成功~",
                        icon: "none",
                        duration: 1000,
                        mask: true,
                    });
                    this.getList();
                }
            }
        );
        this.closeMask();
    },

    //显示遮罩层
    showMask(e) {
        console.log(e);
        this.setData({
            flag: false,
            type: Number(e.target.dataset.type),
        });
        this.data.orderId = e.target.dataset.id;
    },

    //关闭遮罩层
    closeMask() {
        this.setData({ flag: true });
    },

    //上拉到底部时触发
    onReachBottom() {
        this.data.page_number++;
        if (this.data.page_number > this.data.number) {
            wx.showToast({
                title: "人家是有底线的~",
                icon: "none",
                duration: 1000,
                mask: true,
            });
        } else {
            app.request(
                "/customOrderForm.do",
                "LIST",
                {
                    page_number: this.data.page_number,
                    page_count: app.getPageCount(),
                    condition: [
                        {
                            name: "flag",
                            operator: "=",
                            value: this.data.flagValue,
                        },
                    ],
                },
                (data) => {
                    this.setData({
                        flagValue: this.data.flagValue,
                        orderList: this.data.orderList.concat(data.data.list), //将数组连接起来
                        number: Math.ceil(data.data.count / app.getPageCount()),
                    });
                }
            );
        }
    },

    //下拉加载
    onPullDownRefresh: function () {
        this.setData({
            orderList: [], //订单列表
            page_number: 1, //页数
        });
        this.getList();
        setTimeout(function () {
            wx.hideNavigationBarLoading(); //完成停止加载
            wx.stopPullDownRefresh(); //停止下拉刷新
        }, 1500);
    },
});
