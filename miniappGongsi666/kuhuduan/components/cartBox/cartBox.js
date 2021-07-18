// 获取应用实例
const app = getApp();

Component({
    data: {
        imgbaseUrl: app.data.imgbaseUrl, // 图片基本路径
        specActive: 1, // 当前选择的规格
        goodsNumber: 1 // 默认选择商品数量
    },
    properties: {
        cartBox: {
            type: 'Boolean',
            default: true
        },
        goodsoattributes: {
            type: 'Object',
            default: []
        },
        danguige: {
            type: 'Boolean',
            default: false
        },
        duoguige: {
            type: 'Boolean',
            default: false
        },
        guigelist: {
            type: 'Array',
            default: []
        },
    },
    pageLifetimes: {
        // 组件所在页面的生命周期函数
        hide() {
            this.setData({
                cartBox: true
            });
            wx.removeStorageSync('goodsoattributes');
        },
    },
    methods: {
        //点击遮罩层隐藏弹窗
        hideAllBox() {
            this.setData({
                cartBox: true,
            })
        },

        // 控制右上角
        showCart() {
            this.setData({
                //购物车弹窗隐藏,遮罩层隐藏
                cartBox: true,
            })
        },

        // 选择规格
        // OneSelectSpec(e) {
        //     console.log(e)
        //     this.setData({
        //         specActive: e.currentTarget.dataset.index,
        //     })
        //     console.log('我已经选择规格了啦啦啦啦' + this.data.specActive)
        // },

        // 数量减少
        reduceNumber(e) {
            var num = this.data.goodsNumber;
            // 如果大于1时，才可以减  
            if (num > 1) {
                num--;
            } else {
                wx.showToast({
                    title: '该商品不能再减少了哟~',
                    icon: 'none',
                    duration: 1500,
                    mask: false,
                });
            }
            // 将数值与状态写回  
            this.setData({
                goodsNumber: num,
            });
        },

        // 数量增加
        addNumber(e) {
            var num = this.data.goodsNumber;
            // 不作过多考虑自增1  
            if (num < this.data.goodsoattributes.max_number) {
                num++;
            } else {
                wx.showToast({
                    title: '该商品限购' + this.data.goodsoattributes.max_number + '件哦~',
                    icon: 'none',
                    duration: 1500,
                });
            }
            // 将数值与状态写回  
            this.setData({
                goodsNumber: num,
            });
        },

        // 获取的数量
        inputValueChange(e) {
            let goodsNumber = e.detail.value
            if (goodsNumber > this.data.goodsoattributes.max_number) {
                goodsNumber = this.data.goodsoattributes.max_number
            }
            this.setData({
                goodsNumber: goodsNumber
            })
        },

        // 点击确定按钮,加入购物车
        JoinCart(e) {
            // console.log(e);
                //将购物车数据添加到缓存
            var that = this
                //获取缓存中的已添加购物车信息,没有数据的话添加空数组
            var carts = wx.getStorageSync('carts') || []
                // wx.clearStorageSync('carts')
                //判断购物车缓存中是否已存在该货品
            var exist = carts.find(function(ele) {
                return ele.id == that.data.goodsoattributes.id && ele.group_buy == that.data.goodsoattributes.group_buy
            })
            if (exist) {
                //如果存在，则增加该货品的购买数量
                if (exist.num < that.data.goodsoattributes.max_number) {
                    exist.num = parseInt(exist.num) + that.data.goodsNumber
                    this.setData({
                        cartBox: true,
                    })
                    wx.showToast({
                        title: "已为您该商品数量加1~",
                        icon: "success",
                        durantion: 2000
                    })
                    wx.setStorageSync('carts', carts);
                } else {
                    wx.showToast({
                        title: '该商品限购' + that.data.goodsoattributes.max_number + '件',
                        icon: 'none',
                        duration: 1500,
                    });
                }
            } else {
                //如果不存在，传入该货品信息
                e.currentTarget.dataset.goodsoattributes.selected = true;
                e.currentTarget.dataset.goodsoattributes.num = this.data.goodsNumber;
                // goodsPicsInfo: that.data.guigelist[that.data.specActive - 1].guige
                if (e.currentTarget.dataset.goodsoattributes.group_buy == 0) {
                    // 判断加入购物车的商品是否是含有 "id" 的团购商品
                    carts.push(e.currentTarget.dataset.goodsoattributes)
                } else {
                    carts.push(e.currentTarget.dataset.goodsoattributes)
                }
                // 对购物车内物品进行排序
                carts.sort((a, b) => {
                    return a.id - b.id
                })
                // console.log(carts)
                try {
                    // 设置新的购物车缓存
                    wx.setStorageSync('carts', carts);
                    //添加购物车的消息提示框
                    wx.showToast({
                        title: "添加购物车",
                        icon: "success",
                        durantion: 2000
                    })
                    this.triggerEvent("success");
                } catch (error) {
                    // console.log(error);
                }
                this.setData({
                    cartBox: true,
                    goodsNumber: 1
                })
            }
        },
    }
})