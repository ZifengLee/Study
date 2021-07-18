const app = getApp();

Page({
    data: {
        page_number: 1, //页数
        number: 0, //总页数
        allMoney: "", //现金券总数
        list: [], //现金券明细列表
    },

    onLoad: function (options) {
        this.getJifen();
    },

    //现金券明细列表
    getJifen() {
        wx.showLoading({
            title: "加载中",
            icon: "none",
            mask: true,
        });
        app.request(
            "/customAccount.do",
            "LIST",
            {
                page_number: this.data.page_number,
                page_count: app.getPageCount(),
            },
            (data, code) => {
                wx.hideLoading({
                    success: (res) => {
                        // console.log(data);
                        this.setData({
                            allMoney: data.data.money,
                            list: this.data.list.concat(data.data.list), //将数组连接起来
                            number: Math.ceil(
                                data.data.count / app.getPageCount()
                            ),
                        });
                    },
                });
            }
        );
    },

    // 上拉到底部时触发
    onReachBottom() {
        console.log(6666666);
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
                "/customAccount.do",
                "LIST",
                {
                    page_number: this.data.page_number,
                    page_count: app.getPageCount(),
                },
                (data) => {
                    this.setData({
                        allMoney: data.data.money,
                        list: this.data.list.concat(data.data.list), //将数组连接起来
                        number: Math.ceil(data.data.count / app.getPageCount()),
                    });
                }
            );
        }
    },

    //下拉加载
    onPullDownRefresh: function () {
        this.setData({
            list: [], //现金券明细列表
            page_number: 1, //页数
        });
        this.getJifen();
        setTimeout(function () {
            wx.hideNavigationBarLoading(); //完成停止加载
            wx.stopPullDownRefresh(); //停止下拉刷新
        }, 1500);
    },
});
