// pages/search/search.js
const app = getApp();
Page({
    data: {
        imgBaseUrl: app.data.imgbaseUrl, //图片基础路径
        goodsList: [], //商品列表
        hotList: [],
        page_number: 1,
        recommend: 1,
        condition: [
            {
                name: "name",
                value: "橙子",
            },
        ],
        operator: "like",
        name: "",
        merchant_id: "", //商家id
    },

    onLoad: function (options) {
        this.gethotlist();
        //得到缓存的自提点信息
        app.getMerchantInfo((merchant) => {
            this.setData({
                merchant_id: merchant.id,
            });
        });
    },

    //得到搜索的关键词
    getname(e) {
        this.setData({
            condition: [
                {
                    name: "name",
                    operator: "like",
                    value: e.detail.value,
                },
            ],
            name: e.detail.value,
        });
    },

    //对相关商品进行搜索
    itmeSearch(e) {
        if (e.currentTarget.dataset.name !== undefined) {
            this.setData({
                condition: [
                    {
                        name: "name",
                        operator: "like",
                        value: e.currentTarget.dataset.name,
                    },
                ],
                name: e.currentTarget.dataset.name,
            });
        }

        app.request(
            "/customCommodity.do",
            "LIST",
            {
                page_number: Number(this.data.page_number),
                page_count: app.getPageCount(),
                condition: this.data.condition,
                merchant_id: this.data.merchant_id,
            },
            (data, code) => {
                this.setData({
                    goodsList: data.data.list,
                });
                if (data.data.list.length === 0) {
                    wx.showToast({
                        title: "没有搜索到相关商品~",
                        icon: "none",
                        duration: 2000,
                        mask: true,
                    });
                }
            }
        );
    },

    //历史记录列表
    gethotlist() {
        app.request(
            "/customCommodity.do",
            "LIST",
            {
                page_number: this.data.page_number,
                page_count: app.getPageCount(),
                recommend: this.data.recommend,
            },
            (data, code) => {
                console.log(data);
                this.setData({
                    hotList: data.data.list,
                });
            }
        );
    },

    //跳转到商品详情
    detail(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/goodsDetails/goodsDetails?id=" + id,
        });
    },

    // 下拉加载
    onPullDownRefresh: function () {
        this.onLoad();
        this.getLocation();
        setTimeout(function () {
            wx.hideNavigationBarLoading(); //完成停止加载
            wx.stopPullDownRefresh(); //停止下拉刷新
        }, 1500);
    },
});
