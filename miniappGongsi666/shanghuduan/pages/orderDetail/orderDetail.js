const app = getApp();

Page({
    data: {
        orderDetail: {}, //订单基本信息
        goodsList: [], //订单商品列表
        index: "", //订单编号
        flag: true, //遮罩层隐藏
        id: "", //订单id
    },

    onLoad: function (options) {
        console.log(options);
        this.setData({
            id: options.order_id,
            index: options.order_index,
        });

        this.orderDetail();
    },

    //订单明细
    orderDetail() {
        app.request(
            "/merchantCustom.do",
            "LOAD",
            {
                id: this.data.id,
            },
            (data, code) => {
                console.log(data);
                this.setData({
                    orderDetail: data.data.orderInfo, //订单基本信息
                    goodsList: data.data.list, //订单商品列表
                });
            }
        );
    },

    // 确认自提
    goToConfirm() {
        // console.log(e);
        app.request(
            "/merchantCustom.do",
            "RECEIVE",
            {
                orderId: this.data.id,
            },
            (data, code) => {
                if (data.code == 200) {
                    wx.showToast({
                        title: "确认自提成功~",
                        icon: "none",
                        duration: 1000,
                        mask: true,
                    });
                    this.closeMask();
                    wx.navigateBack({
                        delta: 1,
                    });
                }
            }
        );
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

});
