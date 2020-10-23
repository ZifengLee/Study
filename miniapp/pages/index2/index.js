const app = getApp();

Page({
    data: {
        imgBaseUrl: app.data.imgbaseUrl, //图片基础路径
        name: "", //店铺名称
        image: "", //店铺头像
        address: "", // 店铺地址
        number: 0, //会员数
        goodsList: [], //商品列表
        distance: "",
        pageNum: 1,
        goods_count: 0,
        hasMore: true,
    },

    // 获取商品列表
    getList() {
        //没有更多了就不再发送请求
        if (!this.data.hasMore) return;
        console.log(1111111);

        app.request(
            "/customCommodity.do",
            "LIST",
            {
                page_number: this.data.pageNum,
                page_count: app.getPageCount(),
            },
            (data) => {
                const list = this.data.goodsList;
                const newlist = list.concat(data.data.list);

                this.setData({
                    hasMore: data.data.list.length > 0,
                    goodsList: newlist,
                });
            }
        );
    },

    showMerchantInfo(item) {
        this.setData({
            address: item.address,
            distance: item.distance,
            image: item.image,
            name: item.name,
            number: item.number,
        });
    },

    // 获取商家
    getMerchant() {
        //如果存在,直接获取并返回
        app.getMerchantInfo((merchant) => {
            this.showMerchantInfo(merchant);
        });
    },

    //事件处理函数
    onShow() {
        this.data.pageNum = 1;
        this.data.goodsList = [];
        this.getList();
        this.getMerchant();
    },

    //
    onReachBottom() {
        this.data.pageNum++;
        this.getList();
    },

    //商品详情
    goodDetail(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/details/details?id=" + id,
        });
    },

    // 下拉加载
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
