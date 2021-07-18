var a = 1;
var b = 1;
var pos = [];
pos[1] = [];
var result = [];
result[1] = [];

function tiShi() {
    let ID = "tishi";
    document.getElementById(ID).innerHTML =
        "请输入数组第" + a + "行第" + b + "列的值";
}

function huoqu() {
    var szvalue = document.getElementById("sValue");
    if (a <= 3) {
        if (b <= 4) {
            pos[a][b] = parseInt(szvalue.value);
            b++;
            if (b > 4) {
                a++;
                if (a > 3) {
                    // a=4 b=5
                    return;
                }
                pos[a] = [];
                b = 1;
            }
            tiShi();
        }
    }
    // console.log(pos);
    console.log(pos[1]);
    console.log(pos[2]);
    console.log(pos[3]);
}

function yunSuan() {
    for (a = 1; a <= 3; a++) {
        result[a] = [];
        result[a][1] = 0;
        result[a][2] = 0;
        for (b = 1; b <= 4; b++) {
            if (pos[a][b] < 0) {
                result[a][1] += pos[a][b];
            } else {
                result[a][2] += pos[a][b];
            }
        }
    }
    console.log(pos);
    console.log(result);
    xianshires();
}

function xianshires() {
    for (a = 1; a <= 3; a++) {
        let res = "result" + a;
        document.getElementById(res).innerHTML =
            "第" +
            a +
            "行：正数和：" +
            result[a][2] +
            ",负数和：" +
            result[a][1];
    }
}

tiShi();

document.getElementById("btn1").addEventListener("click", huoqu);

document.getElementById("btn2").addEventListener("click", yunSuan);
