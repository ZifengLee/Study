// pages/details/details.js
const app = getApp();
Page({
    data: {
        goodsContent: {}, //商品数据
        isShow: false, //显示遮罩层和购物车弹窗
        isopen: false, //显示多品类选择
        number: 1, //数量
        imgBaseUrl: app.data.imgbaseUrl, //图片基础路径
        specActive: -1, // 当前选择的规格
        specActive2: -1, //二级选择规格
        goodsNumber: 1, // 默认选择商品数量
        oneName: "", //一级名字
        twoName: "", //二级名字
        showImage: "", //显示的图片
        showPrice: "0.0", //显示的价格,
    },
    onLoad: function (options) {
        // 页面加载根据id发送请求
        this.getList(options.id);
    },
    // 一次点击事件
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
            let itemList = this.data.goodsContent.details;
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
            let itemList = this.data.goodsContent.details;
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
    // 获取详情页的数据
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
    // 控制加入购物车的弹窗显示隐藏
    buy() {
        this.setData({
            isShow: true,
        });
    },
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
    buyHalf() {
        wx.showModal({
            content:
                "您将支付" + this.data.goodsContent.actual_price / 2 + "元",
            success: (res) => {
                if (!res.confirm) {
                    return;
                }

                wx.showLoading({
                    title: "支付中",
                    icon: "none",
                    mask: true,
                });

                let merchantId = -1;
                app.getMerchantInfo((merchant) => {
                    merchantId = merchant.id;
                });

                app.request(
                    "/customOrderForm.do",
                    "ADDHALF",
                    {
                        merchant_id: merchantId,
                        commodity: [
                            { id: this.data.goodsContent.id, number: 1 },
                        ],
                    },
                    (data) => {
                        if (data.code === 200) {
                            wx.requestPayment({
                                timeStamp: data.data.pay_info.timeStamp,
                                nonceStr: data.data.pay_info.nonceStr,
                                package: data.data.pay_info.package,
                                signType: "MD5",
                                paySign: data.data.pay_info.paySign,
                                success: () => {
                                    wx.hideLoading();
                                    wx.showToast({
                                        title: "支付成功",
                                        icon: "none",
                                        duration: 1000,
                                        mask: true,
                                    });
                                    setTimeout(() => {
                                        wx.navigateBack({
                                            delta: 1,
                                        });
                                    }, 1000);
                                },
                                fail: () => {
                                    wx.hideLoading();
                                    wx.showToast({
                                        title: "支付失败",
                                        icon: "none",
                                        duration: 1000,
                                        mask: true,
                                    });
                                },
                            });
                        } else {
                            console.log("支付失败:", data);
                            wx.hideLoading();
                            wx.showToast({
                                title: "支付失败",
                                icon: "none",
                                duration: 1000,
                                mask: true,
                            });
                        }
                    }
                );
            },
        });
    },

    // 打开选择商品属性的按钮框
    openAttributes(goods) {
        if (goods.is_opened === 1) {
            var minPrice = 0.0;
            var maxPrice = 0.0;
            var item_list = goods.details;
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
        }

        this.setData({
            goodsContent: goods,
            isopen: goods.is_opened >= 1,
            oneName: goods.name1,
            towName: goods.name2,
            number: 1,
            showPrice: "" + minPrice + " - " + maxPrice,
            showImage: goods.image,
        });
    },

    //加入购物车
    joinCart() {
        const carts = wx.getStorageSync("carts") || [];

        if (this.data.isopen) {
            // 处理带多个商品
            const goods = this.data.goodsContent;
            if (this.data.specActive === -1 || this.data.specActive2 === -1) {
                wx.showToast({
                    title: "请先选定一个商品",
                });
                return;
            }
            let found = false;
            const selectItem = goods.details.find(
                (item) =>
                    item.style === goods.details[this.data.specActive].style &&
                    item.specification ===
                        goods.details[this.data.specActive2].specification
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

            if (!found) {
                goods.selected = true;
                goods.number = this.data.number;
                goods.commodityItemId = selectItem.id;
                delete goods.details;
                delete goods.one;
                delete goods.two;

                carts.push(goods);
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
        wx.showToast({
            title: "加入购物车成功",
        });

        wx.navigateBack({ delta: 1 });
    },
});
