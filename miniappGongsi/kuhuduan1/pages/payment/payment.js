const app = getApp();

Page({
    data: {
        merchantName: "", //扫描得到的商家名称
        inputValue: "", //输入框输入的内容
        flag: false,
        time: 3, //倒计时开始时间
        number: "0000",//提现数量
        carWidth: "90rpx",
        cardState: "first",//卡片状态
        // change:"",
        showClass: false,//是否翻转
        cardData: [],//翻牌后内容 后台中奖的金额数量及随机产生的金额数量
        n: 9, // 后台抽中的金额
        randomIndex: -1,
        nengChou: true
    },

    //通过options获得上个页面携带过来的数据
    onLoad: function (options) {
        this.setData({
            merchantName: options.merchantName,
        });
    },

    //随机整数[min,max]
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    ,

    onShow() {
        this.data.n = 9;
        this.data.nengChou = true;

        //
        const randomIndex = this.randomInt(0, 7)

        this.data.randomIndex = randomIndex

        const cardData = []
        const amounts = [this.data.n]

        // amounts[0] == 9

        const getRandomAmount = () => {
            let amount = this.randomInt(1, 20)
            while (amounts.indexOf(amount) > -1) {
                amount = this.randomInt(1, 20)
            }
            return amount
        }

        for (let i = 0; i < 8; i++) {
            let amount;
            if (i !== randomIndex) {
                amount = getRandomAmount()
                amounts.push(amount)
            }

            cardData.push(
                {
                    id: i,
                    money: i == randomIndex ? this.data.n : amount,
                    status: 2, // 1,背面 2,正面 3，选择的
                    ani: true
                }
            )
        }

        this.setData({
            cardData
        })

        setTimeout(() => {
            this.allTurn()
        }, 2000)
    },

    // 全部翻转
    allTurn() {
        const animation = wx.createAnimation({
            duration: 500
        })

        animation.rotateY(90).step()
        this.setData({ animation: animation.export() })

        setTimeout(() => {
            const { cardData } = this.data;
            cardData.map((item) => {
                item.status = 1
            })

            animation.rotateY(0).step()
            this.setData({
                animation: animation.export(),
                cardData: cardData,
            })
        }, 500)
    },

    // 抽奖
    choujiang(e) {
        if (!this.data.nengChou) {
            return
        }
        this.data.nengChou = false

        // console.log(e);
        const cardId = e.currentTarget.id;

        const { cardData } = this.data;
        cardData.map((item) => {
            if (item.id != cardId) {
                item.ani = false
            }
        })

        const animation = wx.createAnimation({
            duration: 500
        })

        animation.rotateY(90).step()
        this.setData({
            animation: animation.export(),
            cardData: cardData,
        })
        setTimeout(
            () => {
                const { cardData } = this.data;
                cardData[cardId].status = 3

                const amounts = []
                cardData.map(item=>{
                    amounts.push(item.money)
                })

                amounts.splice(this.data.randomIndex,1)

                cardData.map(item=>{
                    if (item.id == cardId) {
                        item.money = this.data.n
                    } else {
                        const i = this.randomInt(0, amounts.length-1)
                        item.money = amounts[i]
                        amounts.splice(i,1)
                    }
                })

                animation.rotateY(0).step()
                this.setData({
                    animation: animation.export(),
                    cardData: cardData
                })

                setTimeout(
                    ()=>{
                        const {cardData} = this.data
                        cardData.map(item=>{
                            item.ani = item.id != cardId
                        })

                        animation.rotateY(90).step()
                        this.setData({
                            animation:animation.export(),
                            cardData:cardData
                        })

                        setTimeout(
                            ()=>{
                                const {cardData} = this.data
                                cardData.map(item=>{
                                    if (item.id != cardId) {
                                    item.status = 2
                                    }
                                })
                                animation.rotateY(0).step()
                                this.setData({
                                    animation:animation.export(),
                                    cardData:cardData
                                })
                            },500
                        )
                    },2000
                )
            }, 500
        )

    },

    //获得输入框的内容
    setInput(e) {
        this.setData({
            inputValue: e.detail.value,
        });
    },

    //显示遮罩层
    showMask() {
        var that = this;
        if (Number(this.data.inputValue * 10000) > 0) {
            if (Number(this.data.inputValue * 10000) > Number(this.data.unWithdraw)) {
                wx.showToast({
                    title: "积分数量不足~",
                    icon: "none",
                    duration: 2000,
                });
                return;
            }
            //商家提现
            app.request(
                "/merchantCustom.do",
                "UPDATE",
                {
                    integral: this.data.inputValue * 10000,
                },
                (data, code) => {
                    if (code === 644) {
                        wx.showToast({
                            title: "提现数量不能少于400",
                            icon: "none",
                            duration: 2000,
                        });
                        return;
                    }
                    if (code === 623) {
                        wx.showToast({
                            title: "提现数量需为整数",
                            icon: "none",
                            duration: 2000,
                        });
                        return;
                    }
                    this.setData({ flag: false });
                    //设置倒计时
                    let time = 2;
                    var timer = setInterval(function () {
                        if (time === 0) {
                            clearInterval(timer); //变量为0停止定时器，
                            wx.switchTab({
                                url: "/pages/my/my",
                            });
                        } else {
                            that.setData({
                                time: time--,
                            });
                        }
                    }, 1000);
                }
            );
        } else {
            wx.showToast({
                title: "请正确输入提现数量！",
                icon: "none",
                duration: 2000,
            });
            return;
        }
    },

    // 关闭遮罩层
    closeMask() {
        this.setData({ flag: true });
    },

    // 跳转到支付成功页面
    goToWithdraw() {
        wx.navigateTo({
            url: "/pages/withdraw/withdraw",
        });
    },

    //卡片翻转
    turnCard1() {
        this.setData({
            cardState: "after",
            showClass: "true"
        })
        console.log(this.data.cardState);

    },

    turnCard2() {
        this.setData({
            cardState: "first",
            showClass: "false"
        })
    },
});
