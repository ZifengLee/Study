// pages/search/search.js
const app = getApp();
Page({
    data: {
        imgBaseUrl: app.data.imgbaseUrl, //图片基础路径
        goodsList: [], //商品列表
        hotList: [],
        page_number: 1,
        page_count: 3,
        recommend: 1,
        condition: [
            {
                name: "name",
                value: "橙子",
            },
        ],
        operator: "like",
        name: "",
    },

    onLoad: function (options) {
        this.gethotlist();
    },

    // 得到搜索的关键词
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
                page_count: this.data.page_count,
                condition: this.data.condition,
            },
            (data, code) => {
                console.log(data);
                this.setData({
                    goodsList: data.data.list,
                });
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
                page_count: this.data.page_count,
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
});
