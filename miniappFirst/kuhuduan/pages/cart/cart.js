const app = getApp();
Page({
    data: {
        imgBaseUrl: app.data.imgbaseUrl, //图片基础路径
        carts: [], //购物车数组
        selectedAllStatus: true,
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

    onShow: function () {
        this.getCart();
        app.data.orderInfo = {};
        this.sum();
    },

    //获取购物车数据
    getCart() {
        this.setData({
            carts: wx.getStorageSync("carts"),
        });
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
        app.showToast("删除成功");
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

    //立即购买
    submitOrder() {
        if (this.data.carts.length != 0) {
            wx.navigateTo({
                url: "/pages/submitOrder/submitOrder",
            });
        } else {
            app.showToast("请先加购商品哦~");
        }
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
                totalNumber += 1;
            }
        });
        // 写回经点击修改后的数组
        this.setData({
            carts: carts,
            totalMoney: totalMoney.toFixed(2),
            totalNumber: totalNumber,
        });
        wx.setStorage({ key: "carts", data: carts });
    },

    //触摸开始
    touchstart: function (e) {
        //判断是否只有一个触摸点
        if (e.touches.length == 1) {
            this.setData({
                //记录触摸起始位置的X坐标
                startX: e.touches[0].clientX,
            });
        }
    },

    // 触摸过程中
    touchmove: function (e) {
        // console.log(e);
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

    //触摸结束
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

    //下拉加载
    onPullDownRefresh: function () {
        this.getCart();
        app.data.orderInfo = {};
        this.sum();
        setTimeout(function () {
            wx.hideNavigationBarLoading(); //完成停止加载
            wx.stopPullDownRefresh(); //停止下拉刷新
        }, 1500);
    },
});
