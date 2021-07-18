Page({
    data: {
        random: '',//各类奖品抽到的随机数
        trasn: 22.5,//旋转角度
        prise: 7,// 奖品
        name:'',
    },
    zhuanin: function (e) {
        // let that = this
        let num = 0 //转盘旋转圈数
        this.setData({
            prise: 7,
            // random:Math.floor(Math.random() * 360),
            trasn: 22.5,
        })

        let a = setInterval(()=> {
            this.setData({
                trasn: this.data.trasn + 5
            })
            if (360 <= this.data.trasn) {
                this.data.trasn = 0
                num = num + 1
            }
            if (num == 3) {
                this.currinl()
                clearInterval(a)
            }
        }, 5)
    },

    //随机整数[min,max]
    random: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    currinl: function (e) {
        // let that = this
        // let name = ''
        //   if(this.data.random == 30 || this.data.random == 90 || this.data.random == 150 || this.data.random == 210 || this.data.random == 330){
        //     this.setData({
        //       random:this.data.random + 3
        //     })
        //   }
        //   if(this.data.random < 30 || 330 < this.data.random){
        //     name = '一等奖'
        //   }else if(this.data.random > 30 && this.data.random < 90){
        //     name = '二等奖'
        //   }else if(this.data.random > 90 && this.data.random < 150){
        //     name = '三等奖'
        //   }else if(this.data.random > 150 && this.data.random < 210){
        //     name = '四等奖'
        //   }else if(this.data.random > 210 && this.data.random < 270){
        //     name = "五等奖"
        //   }else{
        //     name = "六等奖"
        //   }

        switch (this.data.prise) {
            case 1:
                // if (this.random(0, 100) > 50) {
                //     this.data.random = this.random(0, 20);
                // } else {
                //     this.data.random = this.random(340, 360);
                // }
                this.data.random = this.random(2, 43);
                this.data.name = '一等奖';
                break;

            case 8:
                this.data.random = this.random(47, 88);
                this.data.name = '八等奖';
                break;

            case 7:
                this.data.random = this.random(92, 133);
                this.data.name = '七等奖';
                break;

            case 6:
                this.data.random = this.random(137, 178);
                this.data.name = '六等奖';
                break;

            case 5:
                this.data.random = this.random(182, 223);
                this.data.name = '五等奖';
                break;

            case 4:
                this.data.random = this.random(227, 268);
                this.data.name = '四等奖';
                break;

            case 3:
                this.data.random = this.random(272, 313);
                this.data.name = '三等奖';
                break;

            case 2:
                this.data.random = this.random(317, 358);
                this.data.name = '二等奖';
                console.log( this.data.random);

                break;

            default:
                break;
        }

        let b = setInterval(() => {
            this.setData({
                trasn: this.data.trasn + 2
            })
            if (this.data.random <= this.data.trasn) {
                wx.showToast({
                    title: this.data.name,
                    icon: 'none',
                    duration: 2000
                })
                clearInterval(b)
            }
        }, 10)
    },
})