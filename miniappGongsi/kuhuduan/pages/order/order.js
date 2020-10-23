const app = getApp();

Page({
    data: {
        imgBaseUrl: app.data.imgbaseUrl, //图片基础路径
        page_number: 1, //页数
        page_count: 10, //条数
        number: 0, //总页数
        orderList: [], //订单列表
        index: -1, //页签选择的第几个
        flagValue: -1, //订单状态
    },

    onLoad: function (options) {
        this.data.index = 0;
        this.data.flagValue = 120;
        this.getList();
    },

    onShow: function () {},

    scrollToUpper() {
        // console.log("到顶了");
    },

    //获取不同状态的订单列表
    getList(e) {
        this.data.flagValue = e.currentTarget.dataset.value;
        this.data.page_number = 1; //页数
        this.data.orderList = []; //订单列表

        app.request(
            "/customOrderForm.do",
            "LIST",
            {
                page_number: this.data.page_number,
                page_count: this.data.page_count,
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
                    number: Math.ceil(data.data.count / this.data.page_count),
                });
            }
        );
    },

    //列表到底了
    scrollToLower() {
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
                    page_count: this.data.page_count,
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
                        number: Math.ceil(
                            data.data.count / this.data.page_count
                        ),
                    });
                }
            );
        }
    },

    //取消订单
    closeOrder(e) {
        const id = e.currentTarget.dataset.id;
        app.request(
            "/customOrderForm.do",
            "CLOSE",
            {
                id: id, //订单ID
            },
            (data) => {
                this.getList();
            }
        );
    },

    // 确认收货
    confirmOrder(e) {
        const id = e.currentTarget.dataset.id;
        app.request(
            "/customOrderForm.do",
            "UPDATE",
            {
                id: id, //订单ID
            },
            (data) => {
                this.getList();
            }
        );
    },
});
