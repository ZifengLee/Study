const app = getApp();

Page({
    data: {
        imgBaseUrl: app.data.imgbaseUrl, //图片基础路径
        shop: {},//店铺信息
        number: "", //会员数
        pageNum: 1,
        cashCoupons: "",//当前现金券
        time: "",//当日抽奖次数
        showMask: false, //抽奖规则弹窗
        rule: "", //抽奖规则
        couponList:[],//活动列表
        winnerList: [], //中奖名单
        lotteryList: [],//抽奖奖品列表
        random: '',//各类奖品抽到的随机数
        trasn: 22.5,//旋转角度
        prise: '',// 奖品
        index: "",//奖品的序号
        name: '',//
    },

    onLoad() {
        this.getLottery();
        this.lunbochoujiang();
        this.getLocation();
    },

    onShow() {
        // this.getCouponList();
    },

    //获取用户位置信息
    getLocation: function () {
        var that = this;
        wx.getLocation({
            type: "wgs84",
            success(res) {
                // console.log(res)
                const latitude = res.latitude;
                const longitude = res.longitude;
                app.request(
                    "/customMerchant.do",
                    "SELECT",
                    {
                        "lon": latitude,
                        "lat": longitude,
                    },
                    (data) => {
                        // console.log(data.data);
                        that.setData({
                            shop: data.data.list,//店铺信息
                            number:data.data.number,//店铺会员数
                        });

                        //活动专区列表
                        app.request(
                            "/event.do",
                            "LIST",
                            {
                                "merchant_id": that.data.shop.id,
                            },
                            (data) => {
                                // console.log(data);
                                that.setData({
                                    couponList:data.data.list,
                                });
                            }
                        );
                    }
                );
            },
            fail: err => {
                wx.getSetting({
                    success: function (res) {
                        if (!res.authSetting['scope.userLocation']) {
                            wx.showModal({
                                content: '请允许获取您的定位,不然将无法使用',
                                confirmText: '授权',
                                success: function (res) {
                                    if (res.confirm) {
                                        that.openSetting();
                                    } else {
                                        that.getLocation();
                                    }
                                }
                            })
                        } else {
                            //用户已授权，但是获取地理位置失败，提示用户去系统设置中打开定位
                            wx.showModal({
                                title: '',
                                content: '请在系统设置中打开定位服务',
                                confirmText: '确定',
                                success: function (res) { }
                            })
                        }
                    }
                })
            }
        });
    },

    // 打开小程序设置获取授权
    openSetting: function () {
        wx.openSetting({
            success: res => {
                if (res.authSetting) {
                    this.getLocation()
                    this.setData({
                        main: true
                    })
                }
            }
        })
    },


 // 去支付
 goToPay: function (e) {
    app.request(
			"/custom/orderForm.do",
			"ADD", {
				mothod: 1,
				merchant_id: this.data.merchant_id,
				type: this.data.type,
        red_packet_id:this.data.redData.red_packet_id,
        commodityAmount: this.data.value,
			},
			(data, code) => {
				// console.log(data)
				if (code === 200) {
					let carts = wx.getStorageSync(this.data.merchant_id);
					console.log(carts)
					let newCarts = this.oneArrDeleteOtherOneArr(carts, this.data.orderData.commodity);
					console.log(newCarts)
					wx.setStorageSync(this.data.merchant_id, newCarts);
					var order_id = data.data.id
					wx.showModal({
						content: "您将支付" + data.data.actually_amount + "元",
						success: (result) => {
							if (result.confirm) {
								wx.showLoading({
									title: "支付中",
									icon: "none",
									mask: true,
								});
								app.request(
									"/custom/orderForm.do",
									"PAYMENT", {
										id: data.data.id,
									},
									(data, code) => {
										if (data.code === 200) {
											wx.hideLoading();
											wx.requestPayment({
												timeStamp: data.data.pay_info.timeStamp,
												nonceStr: data.data.pay_info.nonceStr,
												package: data.data.pay_info.package,
												signType: 'MD5',
												paySign: data.data.pay_info.paySign,
												success(res) {
													wx.showToast({
														title: "微信支付成功",
														icon: "none",
														duration: 1000,
														mask: true,
													});
													setTimeout(() => {
														wx.switchTab({
															url: "/pages/index/index",
														});
													}, 1000);
												},
												fail(err) {
													wx.hideLoading();
													wx.showToast({
														title: '支付失败',
														icon: 'none',
														duration: 1000,
														mask: true,
													});
													setTimeout(() => {
														wx.switchTab({
															url: '/pages/index/index',
														});
													}, 1000);
												}
											});
										} else {
											wx.hideLoading();
											wx.showToast({
												title: '支付失败',
												icon: 'none',
												duration: 1000,
												mask: true,
											});
											setTimeout(() => {
												wx.switchTab({
													url: "/pages/index/index",
												});
											}, 1000);
										}
									}
								);
							} else {
								wx.showToast({
									title: "支付失败",
									icon: "none",
									duration: 1000,
									mask: true,
								});
								setTimeout(() => {
									wx.switchTab({
										url: "/pages/index/index",
									});
								}, 1000);
							}
						},
					});
				}
			}
		)
  },


    // 抽奖奖品列表
    getLottery() {
        app.request(
            "/prizeSet.do",
            "LIST", {},
            (data) => {
                this.setData({
                    cashCoupons: data.data.details.money,//当前现金券
                    time: data.data.details.max_number,//当日抽奖次数
                    rule: data.data.details.rule,//抽奖规则
                    lotteryList: data.data.list,//抽奖奖品列表
                });
                // console.log(data.data);
            }
        );
    },

    //点击转盘旋转
    zhuanin: function () {
        app.request(
            "/prizeSet.do",
            "LOTTERY", {},
            (data) => {
                // console.log(data);
                this.setData({
                    prise: data.data.commodity.id,
                });
                for (let i = 0; i < this.data.lotteryList.length; i++) {
                    if (this.data.lotteryList[i].id === this.data.prise) {
                        this.data.index = i;
                        console.log(i);
                    }
                }
            }
        );

        let num = 0 //转盘旋转圈数
        let a = setInterval(() => {
            this.setData({
                trasn: this.data.trasn + 5
            })
            if (360 <= this.data.trasn) {
                this.data.trasn = 0
                num = num + 1
            }
            if (num == 5) {
                this.currinl()
                clearInterval(a)
            }
        }, 7)
    },

    //随机整数[min,max]
    random: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    //开始抽奖
    currinl: function () {
        switch (this.data.index) {
            case 0:

                this.data.random = this.random(2, 43);
                this.setData({
                    name: this.data.lotteryList[this.data.index].prize_name,
                })
                // this.data.name = this.data.lotteryList[0].prize_name;
                console.log(this.data.name);
                break;

            case 7:
                this.data.random = this.random(47, 88);
                this.setData({
                    name: this.data.lotteryList[this.data.index].prize_name,
                })
                // this.data.name = this.data.lotteryList[7].prize_name;
                break;

            case 6:
                this.data.random = this.random(92, 133);
                this.setData({
                    name: this.data.lotteryList[this.data.index].prize_name,
                })
                // this.data.name = this.data.lotteryList[6].prize_name;
                break;

            case 5:
                this.data.random = this.random(137, 178);
                this.setData({
                    name: this.data.lotteryList[this.data.index].prize_name,
                })
                // this.data.name = '六等奖';
                break;

            case 4:
                this.data.random = this.random(182, 223);
                this.setData({
                    name: this.data.lotteryList[this.data.index].prize_name,
                })
                // this.data.name = '五等奖';
                break;

            case 3:
                this.data.random = this.random(227, 268);
                this.setData({
                    name: this.data.lotteryList[this.data.index].prize_name,
                })
                // this.data.name = '四等奖';
                break;

            case 2:
                this.data.random = this.random(272, 313);
                this.setData({
                    name: this.data.lotteryList[this.data.index].prize_name,
                })
                // this.data.name = '三等奖';
                break;

            case 1:
                this.data.random = this.random(317, 358);
                this.setData({
                    name: this.data.lotteryList[this.data.index].prize_name,
                })
                break;
            default:
                break;
        }

        let b = setInterval(() => {
            this.setData({
                trasn: this.data.trasn + 2
            })
            if (this.data.random <= this.data.trasn) {
                console.log(this.data.random);
                console.log(this.data.name);
                wx.showToast({
                    title: "恭喜您中得" + this.data.name,
                    icon: 'none',
                    duration: 2000
                })
                clearInterval(b)
            }
        }, 14)
    },

    //轮播中抽奖名单
    lunbochoujiang: function () {
        app.request(
            "/prizeSet.do",
            "SELECT", {
            "page_number": 1,
            "page_count": 30
        },
            (data) => {
                // console.log(data);
                this.setData({
                    winnerList: data.data.list,
                });
            }
        );
    },

    // 打开活动规则
    openActivityRule() {
        this.setData({
            showMask: true
        })
    },

    // 关闭活动规则
    colseActivityRule() {
        this.setData({
            showMask: false,
            showMMyMask: false
        })
    },
});