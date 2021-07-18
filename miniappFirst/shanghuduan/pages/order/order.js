const app = getApp();

Page({
    data: {
        inputValue: "", //搜索内容
        orderList: [], // 订单列表
        page_number: 1, //页数
        number: "", //总页数
        flag: true, //遮罩层隐藏
        orderId: "", //选择的订单ID
    },

    onShow: function () {
        this.orderList();
    },

    //获取订单列表，将请求封装起来，供下面调用
    reqOrderList(onSuccess) {
        app.request(
            "/merchantCustom.do",
            "ORDERLIST",
            {
                page_number: this.data.page_number,
                page_count: app.getPageCount(),
            },
            (data, code) => {
                wx.hideLoading({
                    success: (res) => {
                        onSuccess(data.data);
                    },
                });
            }
        );
    },

    //初次获取订单列表
    orderList() {
        this.setData({
            orderList: [], // 订单列表
            page_number: 1, //页数
        });
        wx.showLoading({
            title: "加载中",
            icon: "none",
            mask: true,
        });

        this.reqOrderList((data) => {
            this.setData({
                orderList: data.list,
                number: Math.ceil(data.count / app.getPageCount()),
            });
        });
    },

    // 上拉到底部时触发
    onReachBottom() {
        this.setData({
            page_number: this.data.page_number + 1,
        });

        if (this.data.page_number > this.data.number) {
            wx.showToast({
                title: "人家是有底线的~",
                icon: "none",
                duration: 1000,
                mask: true,
            });
        } else {
            this.reqOrderList((data) => {
                this.setData({
                    orderList: this.data.orderList.concat(data.list),
                });
            });
        }
    },

    //搜索输入内容
    searchContent(e) {
        this.setData({
            inputValue: e.detail.value,
        });
    },

    // 搜索
    search() {
        if (this.data.inputValue !== "") {
            this.setData({
                orderList: [], // 订单列表
                number: "",
                page_number: 1, //页数
            });
            wx.showLoading({
                title: "加载中",
                icon: "none",
                mask: true,
            });
            app.request(
                "/merchantCustom.do",
                "ORDERLIST",
                {
                    page_number: this.data.page_number,
                    page_count: app.getPageCount(),
                    condition: [
                        {
                            field1: "name",
                            field2: "mobile_phone",
                            operator: "orField",
                            value: this.data.inputValue,
                        },
                    ],
                },
                (data, code) => {
                    if (data.code === 200) {
                        wx.hideLoading({});
                        this.setData({
                            orderList: this.data.orderList.concat(
                                data.data.list
                            ),
                            number: Math.ceil(
                                data.data.count / app.getPageCount()
                            ),
                        });
                    }
                }
            );
        } else {
            this.orderList();
        }
    },

    //跳转至订单详情
    goToOrderDetail(e) {
        console.log(e.currentTarget.dataset);
        wx.navigateTo({
            url:
                "/pages/orderDetail/orderDetail?order_id=" +
                e.currentTarget.dataset.id +
                "&order_index=" +
                e.currentTarget.dataset.index,
        });
    },

    // 联系客服
    WePhone() {
        app.request("/userInfo.do", "FIND", {}, (data, code) => {
            this.setData({
                mobile_phone: data.data.mobile_phone,
            });
            if (data.code == 200) {
                wx.showModal({
                    title: "客服电话",
                    content: this.data.mobile_phone,
                    showCancel: true,
                    confirmText: "拨号",
                    cancelText: "取消",
                    success: (res) => {
                        if (!res.cancel) {
                            wx.makePhoneCall({
                                phoneNumber: this.data.mobile_phone,
                            });
                        }
                    },
                });
            }
        });
    },

    // 确认自提
    goToConfirm(e) {
        app.request(
            "/merchantCustom.do",
            "RECEIVE",
            {
                orderId: this.data.orderId,
            },
            (data, code) => {
                this.orderList();
                wx.showToast({
                    title: "确认自提成功~",
                    icon: "none",
                    duration: 1000,
                    mask: true,
                });
            }
        );
        this.closeMask();
    },

    //显示遮罩层
    showMask(e) {
        this.setData({
            flag: false,
        });
        this.data.orderId = e.target.dataset.id;
    },

    // 关闭遮罩层
    closeMask() {
        this.setData({ flag: true });
    },

    // 下拉加载
    onPullDownRefresh: function () {
        this.onShow();
        setTimeout(function () {
            wx.hideNavigationBarLoading(); //完成停止加载
            wx.stopPullDownRefresh(); //停止下拉刷新
        }, 1500);
    },
});
