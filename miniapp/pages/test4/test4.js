Page({
    data: {
        deg: 0, // 初始化角度
        singleAngle: 60, // 每片扇形的角度
        awardNumer: 1, // 中奖区域 从1开始
        isStart: false,
        animationData: {},
    },

    onLoad(options) {
        const animation = wx.createAnimation({
            duration: 2000,
            timingFunction: "ease-in-out",
        });
        this.animation = animation;
        // console.log(this);
    },

    start() {
        // console.log(this);
        // console.log(this.data.isStart);
        if (this.data.isStart) return;
        console.log(2222222);
        let tmpnum = Math.random();
        tmpnum = tmpnum < 0.5 ? tmpnum + 0.1 : tmpnum - 0.1;
        const endAddAngle =
            (this.data.awardNumer - 1 + tmpnum) * this.data.singleAngle + 360; // 中奖角度
        const rangeAngle = (Math.floor(Math.random() * 4) + 4) * 360; // 随机旋转几圈再停止
        this.animation.rotate(this.data.deg + endAddAngle + rangeAngle).step();
        // console.log(this.data.deg);
        this.setData({
            animationData: this.animation.export(),
            deg: this.data.deg + rangeAngle,
        });
        // console.log(this.data.deg);

        // this.$apply(this);
    },

    closeWin() {
        // console.log(111111);
        // console.log(this);
        this.animation.rotate(0).step();
        this.setData({
            animationData: this.animation.export(),
            deg: 0,
        });
        // this.$apply(this);
    },
});
