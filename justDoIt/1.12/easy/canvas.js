var chess = document.getElementsByClassName("chess")[0];
var title = document.getElementsByClassName("title")[0];
var context = chess.getContext("2d");
context.strokeStyle = "#b9b9b9";

window.onload = function () {
    drawChessBoard();
};

// 绘制棋盘方法
function drawChessBoard() {
    for (var i = 0; i < 15; i++) {
        // 设置横线起始点的坐标
        context.moveTo(15, 15 + i * 30);
        // 设置横线结束点的坐标
        context.lineTo(435, 15 + i * 30);
        // 连接两点
        context.stroke();

        // 设置竖线起始点的坐标
        context.moveTo(15 + i * 30, 15);
        // 设置竖线结束点的坐标
        context.lineTo(15 + i * 30, 435);
        // 连接两点
        context.stroke();
    }
}

// 设置赢法数组
/**第一种赢法
 *0,0,0
 *1,0,0
 *2,0,0
 *3,0,0
 *4,0,0
 *5,0,0
 *第二种赢法
 *0,0,1
 *1,1,1
 *2,2,1
 *3,3,1
 *4,4,1
 *5,5,1
 */
var wins = [];
for (var i = 0; i < 15; i++) {
    wins[i] = [];
    for (var j = 0; j < 15; j++) {
        wins[i][j] = [];
    }
}

// 赢法的编号
var count = 0;
// 统计横线赢法
for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[j + k][i][count] = true;
        }
        count++;
    }
}

// 统计竖线赢法
for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i][j + k][count] = true;
        }
        count++;
    }
}

// 统计正斜线赢法
for (var i = 0; i < 11; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j + k][count] = true;
        }
        count++;
    }
}

// 统计反斜线赢法
for (var i = 0; i < 11; i++) {
    for (var j = 14; j > 3; j--) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j - k][count] = true;
        }
        count++;
    }
}

// 定义二维数组，标记棋盘上的每个坐标是否已经下了棋子
var chessboard = [];
for (var i = 0; i < 15; i++) {
    chessboard[i] = [];
    for (var j = 0; j < 15; j++) {
        chessboard[i][j] = 0;
    }
}

// 下棋
// 标记人是否可以下棋
var me = true;
// 标记游戏是否结束
var over = false;
// 记录用户在赢法上的分值
var myWin = [];
// 记录计算机在赢法上的分值
var computerWin = [];
// 初始化
for (var i = 0; i < count; i++) {
    myWin[i] = 0;
    computerWin[i] = 0;
}

chess.onclick = function (e) {
    // 如果游戏结束不可以下棋
    if (over) {
        return;
    }

    // 判断人是否可以下棋，不能同时下多次
    if (!me) {
        return;
    }

    // 获取X轴坐标
    var x = e.offsetX;
    // 获取Y轴坐标
    var y = e.offsetY;

    var i = Math.floor(x / 30);
    var j = Math.floor(y / 30);

    if (chessboard[i][j] == 0) {
        // 下一个子
        oneStep(i, j, me);
        // 标记已经落子
        chessboard[i][j] = 1;

        for (var k = 0; k < count; k++) {
            if (wins[i][j][k]) {
                myWin[k]++;
                if (myWin[k] == 5) {
                    title.innerHTML = "恭喜你获胜啦~~~";
                    over = true;
                }
            }
        }
        if (!over) {
            me = !me;
            //计算机下棋
            computerAI();
        }
    }
};

// 计算机落子
function computerAI() {
    // 空白棋子在用户所占用赢法的分值
    var myScore = [];
    // 空白棋子在计算机所占用赢法的分值
    var computerScore = [];
    for (var i = 0; i < 15; i++) {
        myScore[i] = [];
        computerScore[i] = [];

        for (var j = 0; j < 15; j++) {
            myScore[i][j] = 0;
            computerScore[i][j] = 0;
        }
    }

    // 标记空白棋子的最大分值
    var max = 0;
    // 最大分值空白棋子所在的坐标
    var x = 0;
    y = 0;

    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 15; j++) {
            // 判断是否是空白棋子
            if (chessboard[i][j] == 0) {
                // 判断一个空白子的分值
                for (var k = 0; k < count; k++) {
                    if (wins[i][j][k]) {
                        //计算自己在每个空白子的分值
                        if (myWin[k] == 1) {
                            myScore[i][j] += 200;
                        } else if (myWin[k] == 2) {
                            myScore[i][j] += 400;
                        } else if (myWin[k] == 3) {
                            myScore[i][j] += 2000;
                        } else if (myWin[k] == 4) {
                            myScore[i][j] += 10000;
                        }

                        // 计算计算机在每个空白子的分值
                        if (computerWin[k] == 1) {
                            computerScore[i][j] += 220;
                        } else if (computerWin[k] == 2) {
                            computerScore[i][j] += 420;
                        } else if (computerWin[k] == 3) {
                            computerScore[i][j] += 2200;
                        } else if (computerWin[k] == 4) {
                            computerScore[i][j] += 20000;
                        }
                    }
                }

                if (myScore[i][j] > max) {
                    max = myScore[i][j];
                    x = i;
                    y = j;
                } else if (myScore[i][j] == max) {
                    if (computerScore[i][j] > max) {
                        max = computerScore[i][j];
                        x = i;
                        y = j;
                    }
                }

                if (computerScore[i][j] > max) {
                    max = computerScore[i][j];
                    x = i;
                    y = j;
                } else if (computerScore[i][j] == max) {
                    if (myScore[i][j] > max) {
                        max = myScore[i][j];
                        x = i;
                        y = j;
                    }
                }
            }
        }
    }

    //开始下棋
    oneStep(x, y, me);
    chessboard[x][y] = 1;

    //判断计算机有没有赢
    for (var k = 0; k < count; k++) {
        if (wins[i][j][k]) {
            computerWin[k] += 1;
            if (computerWin[k] == 5) {
                title.innerHTML = "抱歉，计算机获胜啦~~~";
                over = true;
            }
        }
    }

    if (!over) {
        me = !me;
    }
}

// 自己落子的方法
function oneStep(i, j, me) {
    // 起笔
    context.beginPath();
    //画圆
    context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
    // 落笔
    context.closePath();

    var color;
    if (me) {
        color = "#ff9911";
    } else {
        color = "#1133ff";
    }
    context.fillStyle = color;
    context.fill();
}
