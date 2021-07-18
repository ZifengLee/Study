var app = new Vue({
    el: "#app",
    data: {
        pieceMapArr: [], //记录棋盘落子情况
        pieceColor: ["black", "white"], //棋子颜色
        step: 0, //记录当前步数
        checkMode: [
            //输赢检查方向模式
            [1, 0], //水平
            [0, 1], //竖直
            [1, 1], //左斜线
            [1, -1], //右斜线
        ],
        flag: false,
        victory: "",
        history: [], //历史记录位置
        historyVal: [], //历史记录不被删除数组
        stepHistory: 0,
        domPiece: [], //
        toggle: true, //true为canvas,false为dom
    },
    mounted() {
        const myCanvas = document.getElementById("myCanvas");
        if (!myCanvas.getContext) {
            alert("当前浏览器不支持Canvas.");
            this.toggle = false;
            this.drawpieceBoardDom();
        } else {
            console.log("当前浏览器支持Canvas", this.toggle);
            this.drawpieceBoard();
            const canvas = this.$refs.canvas;
            // 添加点击监听事件
            canvas.addEventListener("click", (e) => {
                if (this.flag) {
                    alert("游戏结束,请重新开始~");
                    return;
                }
                //判断点击范围是否越出棋盘
                if (
                    e.offsetX < 25 ||
                    e.offsetX > 450 ||
                    e.offsetY < 25 ||
                    e.offsetY > 450
                ) {
                    return;
                }
                let dx = Math.floor((e.offsetX + 15) / 30) * 30;
                let dy = Math.floor((e.offsetY + 15) / 30) * 30;
                console.log("this.pieceMapArr 数组", this.pieceMapArr);
                if (this.pieceMapArr[dx / 30 - 1][dy / 30 - 1] == 0) {
                    console.log(
                        "落下棋子",
                        dx,
                        dy,
                        this.pieceColor[this.step % 2]
                    );
                    this.drawPiece(dx, dy, this.pieceColor[this.step % 2]); //落下棋子
                    this.pieceMapArr[dx / 30 - 1][
                        dy / 30 - 1
                    ] = this.pieceColor[this.step % 2];

                    //历史记录位置
                    this.history.length = this.step;
                    this.history.push({
                        dx,
                        dy,
                        color: this.pieceColor[this.step % 2],
                    });
                    this.historyVal.push({
                        dx,
                        dy,
                        color: this.pieceColor[this.step % 2],
                    });
                    this.stepHistory++;
                    console.log("this.history", this.history);
                    //检查当前玩家是否赢了游戏
                    for (var i = 0; i < 4; i++) {
                        this.checkWin(
                            dx / 30 - 1,
                            dy / 30 - 1,
                            this.pieceColor[this.step % 2],
                            this.checkMode[i]
                        );
                    }
                    this.step++;
                } else {
                    alert("不能落在有棋子的地方！");
                }
            });
        }
    },
    methods: {
        toggleF() {
            this.toggle = !this.toggle;
            if (!this.toggle) {
                // console.log("当前---------------1")
                // let elem = document.getElementById('box01');
                // if (elem !== null) {
                // elem.parentNode.removeChild(elem);
                // let elem02 = document.getElementById('box02');
                // elem02.parentNode.removeChild(elem02);
                // }
                // this.drawpieceBoardDom();
                this.restartInit();
            } else {
                this.restartInit();
                // this.drawpieceBoard();
            }
        },
        //初始化棋盘数组
        pieceArr() {
            for (let i = 0; i < 15; i++) {
                this.pieceMapArr[i] = [];
                for (let j = 0; j < 15; j++) {
                    this.pieceMapArr[i][j] = 0;
                }
            }
        },
        //重新开始
        restartInit() {
            if (!this.toggle) {
                // console.log("-----dom-------")
                var elem = document.querySelector("#box01");
                // console.log("elem",elem)
                if (elem != null) {
                    elem.parentNode.removeChild(elem);
                    let elem02 = document.querySelector("#box02");
                    elem02.parentNode.removeChild(elem02);
                }
                this.drawpieceBoardDom();
                this.flag = false;
                this.step = 0;
                this.stepHistory = 0;
                this.historyVal = [];
                this.history = [];
            } else {
                //重画
                this.repaint();
                // 绘制棋盘
                this.drawpieceBoard();
                this.flag = false;
                this.step = 0;
                this.stepHistory = 0;
                this.historyVal = [];
                this.history = [];
            }
        },
        //---------canvas----------
        // 绘制棋盘
        drawpieceBoard() {
            //初始化棋盘数组
            this.pieceArr();
            //canvas 绘制
            let canvas = this.$refs.canvas;
            // 调用canvas元素的getContext 方法访问获取2d渲染的上下文
            let context = canvas.getContext("2d");
            context.strokeStyle = "#666";
            for (let i = 0; i < 15; i++) {
                //落在方格(canvas 的宽高是450)
                // context.moveTo(15 + i * 30, 15)
                // context.lineTo(15 + i * 30, 435)
                // context.stroke()
                // context.moveTo(15, 15 + i * 30)
                // context.lineTo(435, 15 + i * 30)
                // context.stroke()
                //落在交叉点(480)

                // beginPath() 方法开始一条路径，或重置当前的路径。
                // y轴坐标固定，横坐标改变，画竖线
                context.beginPath();
                // 设置竖线起始点的坐标，
                context.moveTo((i + 1) * 30, 30);
                // 设置竖线结束点的坐标
                context.lineTo((i + 1) * 30, canvas.height - 30);
                context.closePath();
                // 连接两点
                context.stroke();
                // x轴坐标固定，纵坐标改变，画横线
                context.beginPath();
                context.moveTo(30, (i + 1) * 30);
                context.lineTo(canvas.width - 30, (i + 1) * 30);
                context.closePath();
                context.stroke();
            }
        },
        //绘制棋子
        drawPiece(x, y, color) {
            let canvas = this.$refs.canvas;
            let context = canvas.getContext("2d");
            context.beginPath(); //开始一条路径或重置当前的路径
            context.arc(x, y, 15, 0, Math.PI * 2, false);
            context.closePath();
            context.fillStyle = color;
            context.fill();
        },
        //胜负判断函数
        checkWin(x, y, color, mode) {
            let count = 1; //记录
            for (let i = 1; i < 5; i++) {
                if (this.pieceMapArr[x + i * mode[0]]) {
                    if (
                        this.pieceMapArr[x + i * mode[0]][y + i * mode[1]] ==
                        color
                    ) {
                        count++;
                    } else {
                        break;
                    }
                }
            }
            for (let j = 1; j < 5; j++) {
                if (this.pieceMapArr[x - j * mode[0]]) {
                    if (
                        this.pieceMapArr[x - j * mode[0]][y - j * mode[1]] ==
                        color
                    ) {
                        count++;
                    } else {
                        break;
                    }
                }
            }
            // console.log('胜负判断函数', count)
            // console.log('color', color)
            if (count >= 5) {
                if (color == "black") {
                    this.victory = "恭喜黑棋胜利！";
                } else {
                    this.victory = "恭喜白棋胜利！";
                }
                // 游戏结束
                // console.log('游戏结束')
                this.flag = true;
            }
        },
        //重画函数
        repaint() {
            //重画
            let canvas = this.$refs.canvas;
            let context = canvas.getContext("2d");
            context.fillStyle = "bisque";
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.beginPath();
            context.closePath();
        },

        //悔棋:
        // canvas 创建一个二维数组，下棋或者悔棋都操作这个数组。操作完数据，把画布全清，重新用数据画一个棋盘。
        // dom 二维数组删除数组最后一项, 先清空棋子的填充颜色,在渲染上颜色
        regret() {
            if (!this.toggle) {
                // console.log("-----dom------this.domPiece",this.domPiece)
                if (this.history.length && !this.flag) {
                    this.history.pop(); //删除数组最后一项
                    console.log("-----dom------this.history", this.history);
                    //重画
                    this.pieceArr();
                    // let elem = document.getElementById('box01');
                    // if (elem !== null) {
                    // elem.parentNode.removeChild(elem);
                    // let elem02 = document.getElementById('box02');
                    // elem02.parentNode.removeChild(elem02);
                    // } //这个太耗性能了
                    // this.drawpieceBoardDom();
                    // 清空棋子的填充颜色
                    this.domPiece.forEach((e) => {
                        e.forEach((qz) => {
                            qz.style.backgroundColor = "";
                        });
                    });
                    // 渲染棋子颜色
                    this.history.forEach((e) => {
                        this.domPiece[e.m][e.n].style.backgroundColor = e.color;
                        this.pieceMapArr[e.m][e.n] = e.color;
                    });
                    this.step--;
                } else {
                    alert("已经不能悔棋了~");
                }
            } else {
                if (this.history.length && !this.flag) {
                    this.history.pop(); //删除数组最后一项
                    //重画
                    this.repaint();
                    // 绘制棋盘
                    this.drawpieceBoard();
                    //绘制棋子
                    this.history.forEach((e) => {
                        this.drawPiece(e.dx, e.dy, e.color);
                        this.pieceMapArr[e.dx / 30 - 1][e.dy / 30 - 1] =
                            e.color;
                    });
                    this.step--;
                } else {
                    alert("已经不能悔棋了~");
                }
            }
        },
        //撤销悔棋
        undo() {
            if (!this.toggle) {
                // console.log("-----dom------this.domPiece",this.domPiece)
                if (
                    this.historyVal.length > this.history.length &&
                    !this.flag
                ) {
                    this.history.push(this.historyVal[this.step]);
                    console.log("-----dom------this.history", this.history);
                    // 清空棋子的填充颜色
                    this.domPiece.forEach((e) => {
                        e.forEach((qz) => {
                            qz.style.backgroundColor = "";
                        });
                    });
                    // 渲染棋子颜色
                    this.history.forEach((e) => {
                        this.domPiece[e.m][e.n].style.backgroundColor = e.color;
                        this.pieceMapArr[e.m][e.n] = e.color;
                    });
                    this.step++;
                } else {
                    alert("不能撤销悔棋了~");
                }
            } else {
                if (
                    this.historyVal.length > this.history.length &&
                    !this.flag
                ) {
                    this.history.push(this.historyVal[this.step]);
                    //重画
                    this.repaint();
                    // 绘制棋盘
                    this.drawpieceBoard();
                    this.history.forEach((e) => {
                        this.drawPiece(e.dx, e.dy, e.color);
                        this.pieceMapArr[e.dx / 30 - 1][e.dy / 30 - 1] =
                            e.color;
                    });
                    this.step++;
                } else {
                    alert("不能撤销悔棋了~");
                }
            }
        },

        // -----------dom-----------
        drawpieceBoardDom() {
            // console.log("this", this)
            let that = this;
            //调用初始化棋盘数组函数
            that.pieceArr();
            //创建一个容器
            const box = document.querySelector("#chess");
            const box01 = document.createElement("div");
            box01.setAttribute("id", "box01");
            box.appendChild(box01);
            //画棋盘
            const chess01 = document.querySelector("#box01");
            const box02 = document.createElement("div");
            box02.setAttribute("id", "box02");
            box.appendChild(box02);
            let arr = new Array();
            for (let i = 0; i < 14; i++) {
                arr[i] = new Array();
                for (let j = 0; j < 14; j++) {
                    arr[i][j] = document.createElement("div");
                    arr[i][j].setAttribute("class", "squre");
                    box02.appendChild(arr[i][j]);
                }
            }
            //画棋子
            let arr01 = this.domPiece;
            for (let i = 0; i < 15; i++) {
                arr01[i] = new Array();
                for (let j = 0; j < 15; j++) {
                    arr01[i][j] = document.createElement("div");
                    arr01[i][j].setAttribute("class", "qz");
                    chess01.appendChild(arr01[i][j]);
                }
            }
            // console.log("this.domPiece",this.domPiece)
            // 填充颜色和判断
            for (let m = 0; m < 15; m++) {
                for (let n = 0; n < 15; n++) {
                    arr01[m][n].onclick = function () {
                        //判断游戏是否结束
                        if (!that.flag) {
                            if (that.pieceMapArr[m][n] == 0) {
                                //黑白交换下棋
                                // console.log(this);
                                // console.log('落下棋子', that.pieceColor[that.step % 2])
                                //确保填充颜色正确进行了判断
                                if (
                                    this.className == "qz" &&
                                    that.step % 2 == 0 &&
                                    this.style.backgroundColor == ""
                                ) {
                                    //下棋填充黑颜色
                                    this.style.backgroundColor =
                                        that.pieceColor[that.step % 2];
                                    //写入棋盘数组
                                    that.pieceMapArr[m][n] =
                                        that.pieceColor[that.step % 2];
                                    //历史记录位置
                                    that.history.length = that.step;
                                    that.history.push({
                                        m,
                                        n,
                                        color: that.pieceColor[that.step % 2],
                                    });
                                    that.historyVal.push({
                                        m,
                                        n,
                                        color: that.pieceColor[that.step % 2],
                                    });
                                    that.stepHistory++;
                                    console.log("this.history", that.history);
                                } else if (
                                    this.className == "qz" &&
                                    that.step % 2 != 0 &&
                                    this.style.backgroundColor == ""
                                ) {
                                    //下棋填充白颜色
                                    this.style.backgroundColor =
                                        that.pieceColor[that.step % 2];
                                    //写入棋盘数组
                                    that.pieceMapArr[m][n] =
                                        that.pieceColor[that.step % 2];
                                    //历史记录位置
                                    that.history.length = that.step;
                                    that.history.push({
                                        m,
                                        n,
                                        color: that.pieceColor[that.step % 2],
                                    });
                                    that.historyVal.push({
                                        m,
                                        n,
                                        color: that.pieceColor[that.step % 2],
                                    });
                                    that.stepHistory++;
                                    console.log("this.history", that.history);
                                }
                                //检查当前是否赢了
                                for (var i = 0; i < 4; i++) {
                                    that.checkWin(
                                        m,
                                        n,
                                        that.pieceColor[that.step % 2],
                                        that.checkMode[i]
                                    );
                                }
                                that.step++;
                                // console.log('that.step', that.step);
                            } else {
                                alert("不能落在有棋子的地方！");
                                return;
                            }
                        } else {
                            // that.flag = true;
                            alert("游戏结束,请重新开始~");
                            return;
                        }
                    };
                }
            }
        },
    },
});
