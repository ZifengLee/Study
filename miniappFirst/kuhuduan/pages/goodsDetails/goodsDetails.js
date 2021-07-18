const app = getApp();
Page({
    data: {
        goodId: "", //商品ID
        goodsContent: {}, //商品数据
        isShow: false, //显示遮罩层和购物车弹窗
        chooseType: "", //按钮类型 1为加入购物车 2为立即购买
        isopen: false, //显示多品类选择
        number: 1, //数量
        imgBaseUrl: app.data.imgbaseUrl, //图片基础路径
        specActive: -1, // 当前选择的规格
        specActive2: -1, //二级选择规格
        goodsNumber: 1, // 默认选择商品数量
        oneName: "", //一级名字
        twoName: "", //二级名字
        showImage: "", //显示的主图图片
        sizeMessage: [], //商品规格信息
        showPrice: "0.0", //显示的价格,
    },

    //获取商品列表的商品ID
    onLoad: function (options) {
        this.getList(options.id);
        this.data.goodId = options.id;
    },

    //提示
    showToast(title) {
        wx.showToast({
            title: title, //提示文字
            duration: 2000, //显示时长
            mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false
            icon: "none", //图标，支持"success"、"loading"
        });
    },

    //选择商品第一种类型
    OneSelectSpecOne: function (e) {
        if (this.data.specActive === e.currentTarget.dataset.index) {
            let two = this.data.goodsContent.two;
            for (let i = 0; i < two.length; i++) {
                two[i].isEnable2 = true;
            }

            this.setData({
                specActive: -1,
                goodsContent: this.data.goodsContent,
            });
        } else {
            var oneName = e.currentTarget.dataset.onename;

            //xxxxxxx
            let two = this.data.goodsContent.two;
            for (let i = 0; i < two.length; i++) {
                two[i].isEnable2 = false;
            }

            // //xxxxxxx2
            let itemList = this.data.goodsContent.commodity_item;
            for (let i = 0; i < itemList.length; i++) {
                if (itemList[i].style === oneName) {
                    for (let j = 0; j < two.length; j++) {
                        if (
                            two[j].specification === itemList[i].specification
                        ) {
                            two[j].isEnable2 = true;
                            break;
                        }
                    }
                }
            }

            this.setData({
                specActive: e.currentTarget.dataset.index,
                goodsContent: this.data.goodsContent,
            });
        }
    },

    //选择商品第二种类型
    OneSelectSpecTwo: function (e) {
        if (this.data.specActive2 === e.currentTarget.dataset.index) {
            let one = this.data.goodsContent.one;

            for (let i = 0; i < one.length; i++) {
                one[i].isEnable1 = true;
            }

            this.setData({
                specActive2: -1,
                goodsContent: this.data.goodsContent,
            });
        } else {
            var twoName = e.currentTarget.dataset.twoname;

            //xxxxxxx
            let one = this.data.goodsContent.one;
            for (let i = 0; i < one.length; i++) {
                one[i].isEnable1 = false;
            }

            //xxxxxxx2
            let itemList = this.data.goodsContent.commodity_item;
            for (let i = 0; i < itemList.length; i++) {
                if (itemList[i].specification === twoName) {
                    for (let j = 0; j < one.length; j++) {
                        if (one[j].style === itemList[i].style) {
                            one[j].isEnable1 = true;
                            break;
                        }
                    }
                }
            }

            this.setData({
                specActive2: e.currentTarget.dataset.index,
                goodsContent: this.data.goodsContent,
            });
        }
    },

    // 获取商品详情数据
    getList(id) {
        app.request(
            "/customCommodity.do",
            "FIND",
            {
                id,
            },
            (data) => {
                const value = data.data.data;
                this.openAttributes(value);
            }
        );
    },

    // 加入购物车的弹窗显示
    goCart() {
        this.setData({
            isShow: true,
            chooseType: 1,
        });
    },

    //立即购买的弹窗显示
    buy() {
        this.setData({
            isShow: true,
            chooseType: 2,
        });
    },

    //弹窗关闭
    close() {
        this.setData({
            isShow: false,
        });
    },

    // 加减数字
    add() {
        this.setData({
            number: this.data.number + 1,
        });
    },
    sub() {
        if (this.data.number > 1) {
            this.setData({
                number: this.data.number - 1,
            });
        }
    },

    // 立即购买
    submitOrder() {
        const goods = this.data.goodsContent;
        if (this.data.isopen) {
            // 处理带多个商品
            if (this.data.specActive === -1 || this.data.specActive2 === -1) {
                this.showToast("请先选定一个商品");
                return;
            }
            const selectItem = goods.commodity_item.find(
                (item) =>
                    item.style ===
                        goods.commodity_item[this.data.specActive].style &&
                    item.specification ===
                        goods.commodity_item[this.data.specActive2]
                            .specification
            );
            goods.selected = true;
            goods.number = this.data.number;
            goods.commodityItemId = selectItem.id;
        } else {
            //处理单个商品
            const goods = this.data.goodsContent;
            goods.selected = true;
            goods.number = this.data.number;
        }
        wx.setStorageSync("goods", goods);
        wx.navigateTo({
            url: "/pages/submitOrder/submitOrder?id=" + this.data.goodId,
        });
    },

    // 打开选择商品属性的按钮框
    openAttributes(goods) {
        // console.log(goods);
        if (goods.is_opened === 1) {
            var minPrice = 0.0;
            var maxPrice = 0.0;
            var item_list = goods.commodity_item;
            var one = [];
            var two = [];
            for (let i = 0; i < item_list.length; i++) {
                var isFound = false;
                item_list[i].isEnable1 = true;
                item_list[i].isEnable2 = true;
                for (let j = 0; j < one.length; j++) {
                    if (one[j].style === item_list[i].style) {
                        isFound = true;
                        break;
                    }
                }
                if (!isFound) {
                    if (
                        minPrice > item_list[i].actual_price ||
                        minPrice === 0.0
                    ) {
                        minPrice = item_list[i].actual_price;
                    }

                    if (maxPrice < item_list[i].actual_price) {
                        maxPrice = item_list[i].actual_price;
                    }

                    one.push(item_list[i]);
                }

                // console.log(item_list);
                isFound = false;
                for (let j = 0; j < two.length; j++) {
                    if (two[j].specification === item_list[i].specification) {
                        isFound = true;
                        break;
                    }
                }
                if (!isFound) {
                    if (
                        minPrice > item_list[i].actual_price ||
                        minPrice === 0.0
                    ) {
                        minPrice = item_list[i].actual_price;
                    }

                    if (maxPrice < item_list[i].actual_price) {
                        maxPrice = item_list[i].actual_price;
                    }
                    two.push(item_list[i]);
                }
            }
            goods.one = one;
            goods.two = two;
            // console.log(goods);
        }

        this.setData({
            goodsContent: goods,
            isopen: goods.is_opened >= 1,
            oneName: goods.name1,
            towName: goods.name2,
            number: 1,
            showPrice: "" + minPrice + " - " + maxPrice,
            showImage: goods.image,
            sizeMessage: goods.commodity_item,
        });
    },

    //加入购物车
    joinCart() {
        const carts = wx.getStorageSync("carts") || [];
        if (this.data.isopen) {
            // 处理带多个商品
            const goods = this.data.goodsContent;
            // console.log(goods);
            if (this.data.specActive === -1 || this.data.specActive2 === -1) {
                this.showToast("请先选定一个商品");
                return;
            }
            let found = false;
            const selectItem = goods.commodity_item.find(
                (item) =>
                    item.style ===
                        goods.commodity_item[this.data.specActive].style &&
                    item.specification ===
                        goods.commodity_item[this.data.specActive2]
                            .specification
            );

            carts.forEach((item) => {
                if (
                    item.id === goods.id &&
                    item.commodityItemId === selectItem.id
                ) {
                    item.number += this.data.number;
                    found = true;
                }
            });
            console.log(selectItem);
            if (!found) {
                goods.selected = true;
                goods.number = this.data.number;
                goods.commodityItemId = selectItem.id;
                goods.actual_price = selectItem.actual_price;
                delete goods.commodity_item;
                delete goods.one;
                delete goods.two;
                carts.push(goods);
                console.log(goods);
            }
        } else {
            //处理单个商品
            const goods = this.data.goodsContent;
            let found = false;
            carts.forEach((item) => {
                if (item.id === goods.id) {
                    item.number += this.data.number;
                    found = true;
                }
            });
            if (!found) {
                goods.selected = true;
                goods.number = this.data.number;
                carts.push(goods);
            }
        }
        wx.setStorageSync("carts", carts);
        this.showToast("加入购物车成功");

        wx.navigateBack({ delta: 1 });
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
