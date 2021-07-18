const app = getApp();

Page({
    data: {
        imgbaseUrl: app.data.imgbaseUrl, // 图片基本路径
        userList: [], //用户列表
        page_number: 1, //页数
        number: "", //总页数
    },

    onLoad: function () {
        this.userList();
    },

    //获取用户列表
    reqUserList(onSuccess) {
        app.request(
            "/merchantCustom.do",
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

    //用户列表
    userList() {
        this.setData({
            userList: [], //用户列表
            page_number: 1, //页数
        });
        wx.showLoading({
            title: "加载中",
            icon: "none",
            mask: true,
        });
        this.reqUserList((data) => {
            this.setData({
                userList: data.list,
                number: Math.ceil(data.count / app.getPageCount()),
            });
        });
    },

    // 上拉触底事件
    onReachBottom: function () {
        this.data.page_number++;
        if (this.data.page_number > this.data.number) {
            wx.showToast({
                title: "人家是有底线的~",
                icon: "none",
                duration: 1000,
                mask: true,
            });
        } else {
            this.reqUserList((data) => {
                this.setData({
                    userList: this.data.orderList.concat(data.list),
                });
            });
        }
    },

    // 下拉加载
    onPullDownRefresh: function () {
        this.onLoad();
        setTimeout(function () {
            wx.hideNavigationBarLoading(); //完成停止加载
            wx.stopPullDownRefresh(); //停止下拉刷新
        }, 1500);
    },
});
