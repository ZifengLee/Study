const app = getApp();

Page({
    data: {
        imgBaseUrl: app.data.imgbaseUrl, //图片基础路径
        goodsList: [], //商品列表
        merchant_id: "", //商家ID
        distance: "",
        page_number: 1, //页数
        number: 0, //总页数
    },

    //事件处理函数
    onShow() {
        this.data.page_number = 1;
        this.data.goodsList = [];
        this.getList();
    },

    //跳转至搜索页
    goSearch() {
        wx.navigateTo({
            url: "/pages/search/search",
        });
    },

    //获取选取的自提点商家信息
    showMerchantInfo(item) {
        this.setData({
            merchant_id: item.id,
        });
    },

    //获取商品列表
    getList() {
        app.getMerchantInfo((merchant) => {
            this.showMerchantInfo(merchant);
        });
        wx.showLoading({
            title: "加载中",
            icon: "none",
            mask: true,
        });

        app.request(
            "/customCommodity.do",
            "LIST",
            {
                page_number: this.data.page_number,
                page_count: app.getPageCount(),
                merchant_id: this.data.merchant_id, //商家ID
            },
            (data) => {
                wx.hideLoading({
                    success: (res) => {
                        this.setData({
                            goodsList: data.data.list,
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
                "/customCommodity.do",
                "LIST",
                {
                    page_number: this.data.page_number,
                    page_count: app.getPageCount(),
                    merchant_id: this.data.merchant_id, //商家ID
                },
                (data) => {
                    const list = this.data.goodsList;
                    const newlist = list.concat(data.data.list); //将数组连接起来
                    this.setData({
                        goodsList: newlist,
                        number: Math.ceil(data.data.count / app.getPageCount()),
                    });
                }
            );
        }
    },

    //跳转商品详情
    goodDetail(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/goodsDetails/goodsDetails?id=" + id,
        });
    },

    //下拉加载
    onPullDownRefresh: function () {
        this.setData({
            goodsList: [], //商品列表
            page_number: 1, //页数
        });
        this.getList();
        setTimeout(function () {
            wx.hideNavigationBarLoading(); //完成停止加载
            wx.stopPullDownRefresh(); //停止下拉刷新
        }, 1500);
    },
});
