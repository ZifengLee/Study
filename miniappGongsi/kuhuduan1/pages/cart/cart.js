const app = getApp();
Page({
    data: {
        imgBaseUrl: app.data.imgbaseUrl, //图片基础路径
        carts: [],
        selectedAllStatus: true,
        toastStr: "",
        totalMoney: "", //所选商品的总金额
        totalNumber: "", //所选商品的总数量
        editIndex: 0,
        delBtnWidth: 140, //删除按钮宽度单位（rpx）
        startX: "", //触摸起始位置的X坐标
        showDel: false,
        zindex: -1,
        delIndex: -1,
        delNumber: -1,
    },

    onLoad() {
        this.getCart();
        // console.log(wx.getStorageSync("carts"));
        app.data.orderInfo = {};
        this.sum();
    },

    //获取购物车数据
    getCart() {
        this.setData({
            carts: wx.getStorageSync("carts"),
        });
        // console.log(this.data.carts);
    },

    //删除商品
    del(e) {
        var index = parseInt(e.currentTarget.dataset.index);
        var carts = this.data.carts;
        this.setData({
            delIndex: -1,
        });
        carts.splice(index, 1);
        this.sum();
        wx.showToast({
            title: "删除成功",
            icon: "none",
            duration: 1500,
            mask: false,
        });
    },

    bindMinus(e) {
        var index = parseInt(e.currentTarget.dataset.index);
        var number = this.data.carts[index].number;
        // 如果只有1件了，就不允许再减了
        if (number > 1) {
            number--;
        }
        // 购物车数据
        this.data.carts[index].number = number;
        this.sum();
    },

    bindPlus(e) {
        var index = parseInt(e.currentTarget.dataset.index);
        var number = this.data.carts[index].number + 1;
        // 购物车数据
        this.data.carts[index].number = number;
        this.sum();
    },

    bindCheckbox(e) {
        /*绑定点击事件，将checkbox样式改变为选中与非选中*/
        //拿到下标值，以在carts作遍历指示用
        var xuanzhong = true;
        var index = parseInt(e.currentTarget.dataset.index);
        //原始的icon状态
        var selected = this.data.carts[index].selected;
        var carts = this.data.carts;
        // 对勾选状态取反
        carts[index].selected = !selected;
        for (var i = 0; i < carts.length; i++) {
            if (!carts[i].selected) {
                xuanzhong = false;
            }
        }
        // 写回经点击修改后的数组
        this.setData({
            selectedAllStatus: xuanzhong,
        });
        this.sum();
    },

    bindSelectAll() {
        // 环境中目前已选状态
        var selectedAllStatus = this.data.selectedAllStatus;
        // 取反操作
        selectedAllStatus = !selectedAllStatus;
        // 购物车数据，关键是处理selected值
        var carts = this.data.carts;
        // 遍历
        for (var i = 0; i < carts.length; i++) {
            carts[i].selected = selectedAllStatus;
        }
        this.setData({
            selectedAllStatus: selectedAllStatus,
        });
        this.sum();
    },

    //立即下单
    bindCheckout() {
        wx.navigateTo({
            url: "/pages/submitOrder/submitOrder",
        });
        // // 初始化toastStr字符串
        // var toastStr = "cid:";
        // // 遍历取出已勾选的cid
        // for (var i = 0; i < this.data.carts.length; i++) {
        //     if (this.data.carts[i].selected) {
        //         toastStr += this.data.carts[i].cid;
        //         toastStr += " ";
        //     }
        // }
        // let carts = wx.getStorageSync("carts") || [];
        // const req = carts.filter((it) => it.selected);
        // console.log(req);
        // app.request(
        //     "/customOrderForm.do",
        //     "SHOPING",
        //     { commodity: req },
        //     (data) => {
        //         if (data.code === 200) {
        //             console.log("提交成功");
        //             app.data.orderInfo = data.data;
        //             carts = carts.filter((it) => !it.selected);
        //             wx.setStorage({ key: "carts", data: carts });
        //             wx.navigateTo({
        //                 url: "/pages/submitOrder/submitOrder",
        //             });
        //             //TODO 显示成功,并跳转订单确认
        //         } else {
        //             wx.showToast({
        //                 title: data.message,
        //                 icon: "none",
        //                 duration: 1000,
        //                 mask: true,
        //             });
        //             //TODO 显示失败
        //         }
        //     }
        // );
    },

    //计算总金额
    sum() {
        const carts = this.data.carts;
        // 计算总金额
        let totalMoney = 0;
        let totalNumber = 0;
        carts.forEach((item) => {
            if (item.selected) {
                totalMoney += item.number * item.actual_price;
                totalNumber += item.number;
            }
        });
        // console.log(totalMoney);
        // 写回经点击修改后的数组
        this.setData({
            carts: carts,
            totalMoney: totalMoney.toFixed(2),
            totalNumber: totalNumber,
        });
        wx.setStorage({ key: "carts", data: carts });
    },

    //向左向右滑动删除
    touchstart: function (e) {
        // console.log(e);
        //判断是否只有一个触摸点
        if (e.touches.length == 1) {
            this.setData({
                //记录触摸起始位置的X坐标
                startX: e.touches[0].clientX,
            });
        }
    },

    touchmove: function (e) {
        console.log(e);
        var that = this;
        if (e.touches.length == 1) {
            //记录触摸点位置的X坐标
            var moveX = e.touches[0].clientX;
            //计算手指起始点的X坐标与当前触摸点的X坐标的差值
            var disX = that.data.startX - moveX;
            //delBtnWidth 为右侧按钮区域的宽度
            var delBtnWidth = that.data.delBtnWidth;
            var txtStyle = "";
            if (that.data.showDel) {
                console.log(33333);
                if (disX < 0) {
                    txtStyle = "left:-" + (delBtnWidth + disX) + "rpx";
                    if (-disX >= delBtnWidth) {
                        txtStyle = "left:0rpx";
                        that.setData({
                            delIndex: -1,
                        });
                    }
                } else {
                    return;
                }
            } else {
                if (disX > 0) {
                    txtStyle = "left:-" + disX + "rpx";
                    if (disX >= delBtnWidth) {
                        txtStyle = "left:-" + delBtnWidth + "rpx";
                        that.setData({
                            delIndex: e.currentTarget.dataset.index,
                        });
                        console.log(22222);
                    }
                } else {
                    return;
                }
            }

            //获取手指触摸的是哪一个item
            var index = e.currentTarget.dataset.index;
            var list = that.data.carts;
            //将拼接好的样式设置到当前item中
            list[index].txtStyle = txtStyle;
            //更新列表的状态
            this.setData({
                carts: list,
            });
        }
    },

    touchend: function (e) {
        var that = this;
        if (e.changedTouches.length == 1) {
            //手指移动结束后触摸点位置的X坐标
            var endX = e.changedTouches[0].clientX;
            //触摸开始与结束，手指移动的距离
            var disX = that.data.startX - endX;
            var delBtnWidth = that.data.delBtnWidth;
            //如果距离小于删除按钮的1/2，不显示删除按钮
            var txtStyle;
            if (that.data.showDel) {
                console.log(111111);
                if (-disX > delBtnWidth / 2) {
                    txtStyle = "left:0";
                    that.setData({
                        delIndex: -1,
                    });
                    that.data.showDel = false;
                } else {
                    txtStyle = "left:-" + delBtnWidth + "rpx";
                }
            } else {
                if (disX > delBtnWidth / 2) {
                    txtStyle = "left:-" + delBtnWidth + "rpx";
                    that.data.showDel = true;
                } else {
                    txtStyle = "left:0";
                    that.setData({
                        delIndex: -1,
                    });
                }
            }

            //获取手指触摸的是哪一项
            var index = e.currentTarget.dataset.index;
            var list = that.data.carts;
            list[index].txtStyle = txtStyle;
            //更新列表的状态
            that.setData({
                carts: list,
            });
        }
    },
});
