var chess: HTMLCanvasElement = <HTMLCanvasElement>document.getElementsByClassName("myCanvas")[0];
var chessBorder = chess.getContext("2d");
chessBorder.strokeStyle = "#000000";

window.onload = function () {
    drawChessBoard();
    start();
};

//绘制棋盘的方法
function drawChessBoard() {
    for (let i = 0; i < 16; i++) {
        chessBorder.moveTo(15, 15 + i * 30);
        chessBorder.lineTo(465, 15 + i * 30);
        chessBorder.stroke();

        chessBorder.moveTo(15 + i * 30, 15);
        chessBorder.lineTo(15 + i * 30, 465);
        chessBorder.stroke();
    }
}
var me: boolean = true;
var over: boolean = false;
var position = [];


// 棋盘初始化,初始值为0
function start() {
    for (let i = 0; i < 16; i++) {
        position[i] = []
        for (let j = 0; j < 16; j++) {
            position[i][j] = 0
        }
    }
}

//画布点击
chess.onclick = function (e) {
    var x = e.offsetX;
    var y = e.offsetY;
    var i = Math.floor(x / 30);
    var j = Math.floor(y / 30);

    myStep(i, j, me);
    me = !me;
};

//下棋的方法
function myStep(i, j, me) {
    chessBorder.beginPath();
    chessBorder.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
    chessBorder.closePath();

    var color;
    if (me) {
        color = "#ffffff";
        position[i][j] = 1;
        let number1 = 1
        success(i, j, number1)
    } else {
        color = "#000000";
        position[i][j] = 2;
        let number2 = 2
        success(i, j, number2)
    }
    chessBorder.fillStyle = color;
    chessBorder.fill();
};

// 判断是否赢了
function success(i, j, number) {
    let count: number = 0
    for (let x = 0; x < 5; x++) {
        // 横向赢法
        if (i > x && position[i - x][j] == number) {
            console.log(count);
            count++;
            if (count == 5) {
                if (number == 1) {
                    alert("白棋获胜")

                } else {
                    alert("黑棋获胜")
                }
            }
        } else {
            count = 0
        }
        if (i + x < 16 && position[i + x][j] == number) {
            console.log(count);
            count++;
            if (count == 5) {
                console.log(count);
                if (number == 1) {
                    alert("白棋获胜")
                } else {
                    alert("黑棋获胜")
                }
            }
        } else {
            count = 0
        }
    }
    for (let x = 0; x < 5; x++) {
        // 竖向赢法
        if (j > x && position[i][j - x] == number) {
            console.log(count);
            count++;
            if (count == 5) {
                console.log(count);
                if (number == 1) {
                    alert("白棋获胜")
                } else {
                    alert("黑棋获胜")
                }
            }
        } else {
            count = 0
        }
        if (j + x < 16 && position[i][j + x] == number) {
            console.log(count);
            count++;
            if (count == 5) {
                if (number == 1) {
                    alert("白棋获胜")
                } else {
                    alert("黑棋获胜")
                }
            }
        } else {
            count = 0
        }
    }
    for (let x = 0; x < 5; x++) {
        // 正斜线赢法
        if (i > x && j > x && position[i - x][j - x] == number) {
            console.log(count);
            count++;
            if (count == 5) {
                console.log(count);
                if (number == 1) {
                    alert("白棋获胜")
                } else {
                    alert("黑棋获胜")
                }
            }
        } else {
            count = 0
        }
        if (i + x < 16 && j + x < 16 && position[i + x][j + x] == number) {
            console.log(count);
            count++;
            if (count == 5) {
                if (number == 1) {
                    alert("白棋获胜")
                } else {
                    alert("黑棋获胜")
                }
            }
        } else {
            count = 0
        }
    }
    for (let x = 0; x < 5; x++) {
        //反斜线赢法
        if (i + x < 16 && j > x && position[i + x][j - x] == number) {
            console.log(count);
            count++;
            if (count == 5) {
                console.log(count);
                if (number == 1) {
                    alert("白棋获胜")
                } else {
                    alert("黑棋获胜")
                }
            }
        } else {
            count = 0
        }
        if (i > x && j + x < 16 && position[i - x][j + x] == number) {
            console.log(count);
            count++;
            if (count == 5) {
                if (number == 1) {
                    alert("白棋获胜")
                } else {
                    alert("黑棋获胜")
                }
            }
        } else {
            count = 0
        }
    }

}
