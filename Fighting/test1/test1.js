var a = 1;
var b = 1;
var pos = [];
pos[a] = [];
var result = [];
result[a] = [];

document.getElementById("tishi").innerHTML =
    "请输入数组第" + a + "行第" + b + "列的值";

document.getElementById("btn1").addEventListener("click", huoqu);

document.getElementById("btn2").addEventListener("click", yunSuan);

function huoqu() {
    let szvalue = document.getElementById("sValue");
    if (a <= 3) {
        if (b <= 4) {
            pos[a][b] = szvalue.value;
            console.log(szvalue.value);
            b++;
        } else {
            a++;
            b = 1;
            pos[a][b] = szvalue.value;
            b++;
        }
        console.log(pos);
        console.log(a);
        console.log(b);
    } else {
        return;
    }
    tiShi();
}

function tiShi() {
    document.getElementById("tishi").innerHTML =
        "请输入数组第" + a + "行第" + b + "列的值";
}

function yunSuan() {
    for (a = 1; a <= 3; a++) {
        for (b = 1; b <= 4; b++) {
            if (pos[a][b] < 0) {
                result[a][1] += pos[a][b];
            } else {
                result[a][2] += pos[a][b];
            }
        }
    }
    xianshires();
}

function xianshires() {
    document.getElementById("result1").innerHTML =
        "第一行：正数和：" + result[1][2] + ",负数和：" + result[1][1];
    document.getElementById("result2").innerHTML =
        "第二行：正数和：" + result[2][2] + ",负数和：" + result[2][1];
    document.getElementById("result3").innerHTML =
        "第三行：正数和：" + result[3][2] + ",负数和：" + result[3][1];
}
