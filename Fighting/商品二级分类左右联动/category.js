var app = getApp();
let proListToTop = [],
    menuToTop = [],
    MENU = 0,
    windowHeight, timeoutId;
// MENU ==> 是否为点击左侧进行滚动的，如果是，则不需要再次设置左侧的激活状态
Page({
    data: {
        imgbaseUrl: app.data.imgbaseUrl, // 图片基本路径
        currentActiveIndex: 0, // 改变当前点击项
        refresher: false, // 是否开启下拉刷新
        goodsList: [], // 接口返回的商品数组
        goodsNumber:1,//加入购物车数量
        receiptTime: '', // 到货时间
        //遮罩层显示状态,购物车弹窗显示隐藏
        cartBox: true,
        //单规格
        danguige: true,
        //多规格
        duoguige: false,
        specActive: 1,
        goodsoattributes: [],
        guigelist: [{
                index: 1,
                id: 1,
                guige: '白色'
            },
            {
                index: 2,
                id: 2,
                guige: '红色'
            },
            {
                index: 3,
                id: 3,
                guige: '黑色'
            }
        ]
    },
    onLoad: function(e) {
        this.getGoodsList();
        // 确保页面数据已经刷新完毕~
        // 数据过多时请自行调试并修改延迟时间,可以自行查看效果
        // 因为微信小程序的'boundingClientRect'方法存在bug,需要延迟执行获取准确的高度
        // 推测原因,图片数据量过大导致的高度加载出现问题,请留意
        // 后给图片设置style,直接固定宽高,不适用widthFix,不需要程序自己计算图片
        // 猜测原因:未给定高度时,程序需要先获取网络图片,注:图片在第一次开发未进行二次维护时是网络图片,
        // 遍历完图片后才会再次获取每个图片的高度。
        // 可自行测试:
        // 方法:把定义宽高去除,给mode定义上widthFix,然后打印方法内的top
        // 记住此时的top
        // 然后再给此方法设置上setTimeout延迟执行查看效果
        // console.log(proListToTop)
        this.getAllRects();

    },
    // 获取商品数据列表
    getGoodsList() {
        app.request(
            "/bigCustom/bigCustomCommodity.do",
            "FIND_LIST", {
                "page_number": 1,
                "page_count": 10,
            },
            (data, code) => {
                if (data.code == 200) {
                    // 过滤返回数据中数组为空的数据
                    let goodsList = data.data.list.filter(item => {
                        return item.list != null
                    });
                    // 返回数据中的create_time有T,有的是有(.),需要进行分割
                    let date = new Date();
                    let year = date.getFullYear()
                    let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
                    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
                    let create_time = year + '-' + month + '-' + day
                    for (let i = 0; i < goodsList.length; i++) {
                        for (let j = 0; j < goodsList[i].list.length; j++) {
                            goodsList[i].list[j].bid_price = parseFloat(goodsList[i].list[j].bid_price).toFixed(2);
                            goodsList[i].list[j].actual_price = parseFloat(goodsList[i].list[j].actual_price).toFixed(2);
                        }
                    }
                    this.setData({
                        goodsList: goodsList,
                        refresher: false,
                        receiptTime: data.data.receiptTime,
                        create_time: create_time
                    })
                    console.log(this.data.goodsList)
                    this.getAllRects();
                } else {
                    this.getAllRects();
                }
            }
        );
    },

    // 刷新分类列表
    refresherrefresh() {
        this.setData({
            refresher: true
        })
        if (this.data.refresher) {
            this.getGoodsList();
        } else {
            return;
        }
    },
    // 搜索商品名称
    searchGoodsName() {
        wx.navigateTo({
            url: '../search/search'
        })
    },
    // 跳转至商品详情页
    goToGoodsDetail(e) {
        wx.navigateTo({
                url: '../goodsDetail/goodsDetail?id='+e.currentTarget.dataset.item.id
            })
           
    },
    // 打开选择商品属性的按钮框
    openAttributes(e) {
        this.setData({
            //购物车弹窗隐藏,遮罩层隐藏
            goodsoattributes: e.currentTarget.dataset.item,
            cartBox: false,
            goodsNumber:1
        })
    },
    // 左边侧边栏事件
    changeMenu(e) {
        // 改变左侧tab栏操作
        if (Number(e.target.id) === this.data.currentActiveIndex) return
        MENU = 1
        this.setData({
            currentActiveIndex: Number(e.target.id),
            rightProTop: proListToTop[Number(e.target.id)]
        })
        this.setMenuAnimation(Number(e.target.id))
    },
    // 右侧滑动事件
    scroll(e) {
        let CheckI = 0;
        for (let i = 0; i < proListToTop.length; i++) {
            // if (e.detail.scrollTop < proListToTop[i] && i !== 0 && e.detail.scrollTop > proListToTop[i - 1]) {
            if (e.detail.scrollTop >= proListToTop[i]) {
                CheckI = i;
            } else {
                break;
            }
        }
        return this.setDis(CheckI);
    },

    setDis(i) {
        // 设置左侧menu栏的选中状态
        if ((i !== this.data.currentActiveIndex) && !MENU) {
            this.setData({
                currentActiveIndex: i
            })
        }
        MENU = 0
        this.setMenuAnimation(i)
    },

    setMenuAnimation(i) {
        // 设置动画，使menu滚动到指定位置。
        let self = this
        if (menuToTop[i].animate !== undefined) {
            // 节流操作
            if (timeoutId) {
                clearTimeout(timeoutId)
            }
            timeoutId = setTimeout(() => {
                self.setData({
                    leftMenuTop: (menuToTop[i].top - windowHeight)
                })
            }, 50)
        } else {
            if (this.data.leftMenuTop === 0) return
            this.setData({
                leftMenuTop: 0
            })
        }
    },

    getActiveReacts() {
        wx.createSelectorQuery().in(this).selectAll('.menu-active').boundingClientRect(function(rects) {
            return rects[0].top
        }).exec()
    },
    getAllRects() {
        let realSearchHeight = 0
            // 获取当前适应环境下的搜索框的高度
        wx.createSelectorQuery().select('.search').fields({
                size: true,
            }, function(res) {
                realSearchHeight = res.height
            }).exec()
            // 获取商品数组的位置信息
        wx.createSelectorQuery().in(this).selectAll('.pro-item').boundingClientRect(function(rects) {
            rects.forEach(function(rect) {
                // 这里减是根据你的滚动区域距离头部的高度，如果没有高度，可以将其删去
                proListToTop.push(parseInt(rect.top - realSearchHeight))
            })
        }).exec()

        // 获取menu数组的位置信息
        wx.createSelectorQuery().selectAll('.menu-item').boundingClientRect(function(rects) {
            // 获取系统的高度信息
            wx.getSystemInfo({
                success: function(res) {
                    windowHeight = res.windowHeight / 2
                    rects.forEach(function(rect) {
                        menuToTop.push({
                            top: rect.top,
                            animate: rect.top > windowHeight
                        })
                    })
                }
            })
        }).exec()
    },
})