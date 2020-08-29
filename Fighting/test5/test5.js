var Result;
function shiBie() {
    let Number = document.getElementById("Num").value;
    let shuzi = parseInt(Number);

    if (shuzi <= 999 && shuzi >= 100) {
        let ge, shi, bai, Sum;
        ge = Math.floor(shuzi % 10);
        bai = Math.floor(shuzi / 100);
        shi = Math.floor((shuzi / 10) % 10);
        // console.log(ge);
        // console.log(shi);
        // console.log(bai);
        Sum = Math.pow(ge, 3) + Math.pow(shi, 3) + Math.pow(bai, 3);
        if (Sum === shuzi) {
            document.getElementById("result").innerHTML =
                shuzi + "是水仙花数！";
        } else {
            document.getElementById("result").innerHTML =
                shuzi + "不是水仙花数！";
        }
    } else {
        alert("请输入一个三位数！！！");
    }
}

document.getElementById("btn").addEventListener("click", shiBie);
