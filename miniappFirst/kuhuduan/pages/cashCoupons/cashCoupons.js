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

    //获取现金券明细列表
    reqCashList(onSuccess) {
        app.request(
            "/customAccount.do",
            "LIST",
            {
                page_number: this.data.page_number,
                page_count: app.getPageCount(),
            },
            (data, code) => {
                if (data.code === 200) {
                    wx.hideLoading({});
                    onSuccess(data.data);
                }
            }
        );
    },

    //现金券明细列表
    getJifen() {
        this.setData({
            list: [], //现金券明细列表
            page_number: 1, //页数
        });
        wx.showLoading({
            title: "加载中",
            icon: "none",
            mask: true,
        });
        this.reqCashList((data) => {
            this.setData({
                allMoney: data.money,
                list: data.list,
                number: Math.ceil(data.count / app.getPageCount()),
            });
        });
    },

    // 上拉到底部时触发
    onReachBottom() {
        this.data.page_number++;
        if (this.data.page_number > this.data.number) {
            app.showToast("人家是有底线的~");
        } else {
            this.reqCashList((data) => {
                this.setData({
                    allMoney: data.money,
                    list: this.data.list.concat(data.list), //将数组连接起来
                });
            });
        }
    },

    //下拉加载
    onPullDownRefresh: function () {
        this.setData({
            list: [], //现金券明细列表
            page_number: 1, //页数
        });
        this.onLoad();
        setTimeout(function () {
            wx.hideNavigationBarLoading(); //完成停止加载
            wx.stopPullDownRefresh(); //停止下拉刷新
        }, 1500);
    },
});
