const app = getApp();

Page({
    data: {
        imgbaseUrl: app.data.imgbaseUrl, // 图片基本路径
        userList: [], //用户列表
        page_number: 1, //页数
        page_count: 10, //条数
        number: "", //总页数
    }, 

    onLoad: function () {
        this.userList();
    },

    //用户列表
    userList() {
        this.setData({
            userList: [], //用户列表
            page_number: 1, //页数
            number: "", //总页数
        });
        wx.showLoading({
            title: "加载中",
            icon: "none",
            mask: true,
        });
        app.request(
            "/merchantCustom.do",
            "LIST",
            {
                page_number: this.data.page_number,
                page_count: this.data.page_count,
            },
            (data, code) => {
                wx.hideLoading({
                    success: (res) => {
                        this.setData({
                            userList: this.data.userList.concat(data.data.list),
                            number: Math.ceil(
                                data.data.count / this.data.page_count
                            ),
                        });
                    },
                });
            }
        );
    },

    // 上拉触底事件
    onReachBottom: function () {
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
            app.request(
                "/merchantCustom.do",
                "LIST",
                {
                    page_number: this.data.page_number,
                    page_count: this.data.page_count,
                },
                (data, code) => {
                    wx.hideLoading({
                        success: (res) => {
                            this.setData({
                                userList: this.data.userList.concat(
                                    data.data.list
                                ),
                                number: Math.ceil(
                                    data.data.count / this.data.page_count
                                ),
                            });
                        },
                    });
                }
            );
        }
    },

    // 下拉加载
    onPullDownRefresh: function () {
        this.userList();
        setTimeout(function () {
            wx.hideNavigationBarLoading(); //完成停止加载
            wx.stopPullDownRefresh(); //停止下拉刷新
        }, 1500);
    },
});
