const app = getApp();

Page({
    data: {
        imgBaseUrl: app.data.imgbaseUrl, //图片基础路径
        goodsList: [], //商品列表
        merchant_id: "", //商家ID
        page_number: 1, //页数
        allPage: 0, //总页数
    },

    onShow() {
        this.setData({
            goodsList: [], //商品列表
            page_number: 1, //页数
        });
        this.getList();
    },

    // 获取滚动条当前位置
    onPageScroll: function (e) {
        console.log(e);
        if (e.scrollTop > 100) {
            this.setData({
                floorstatus: true,
            });
        } else {
            this.setData({
                floorstatus: false,
            });
        }
    },

    //回到顶部
    goTop: function (e) {
        // 一键回到顶部
        if (wx.pageScrollTo) {
            wx.pageScrollTo({
                scrollTop: 0,
            });
        } else {
            wx.showModal({
                title: "提示",
                content:
                    "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
            });
        }
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
    reqGoodList(onSuccess) {
        app.request(
            "/customCommodity.do",
            "LIST",
            {
                page_number: this.data.page_number,
                page_count: app.getPageCount(),
                merchant_id: this.data.merchant_id, //商家ID
            },
            (data, code) => {
                if (data.code === 200) {
                    wx.hideLoading({});
                    onSuccess(data.data);
                }
            }
        );
    },

    //商品列表
    getList() {
        app.getMerchantInfo((merchant) => {
            this.showMerchantInfo(merchant);
        });
        wx.showLoading({
            title: "加载中",
            icon: "none",
            mask: true,
        });
        this.reqGoodList((data) => {
            this.setData({
                goodsList: data.list,
                allPage: Math.ceil(data.count / app.getPageCount()),
            });
        });
    },

    // 上拉到底部时触发
    onReachBottom() {
        this.data.page_number++;
        if (this.data.page_number > this.data.allPage) {
            app.showToast("人家是有底线的~");
        } else {
            this.reqGoodList((data) => {
                this.setData({
                    goodsList: this.data.goodsList.concat(data.list), //将数组连接起来
                });
            });
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
