var a = 1;
var b = 1;
var pos = [];

document.getElementById("btn").addEventListener("click", huoqu);
function cunfang() {
    let szvalue = document.getElementById("sValue");

    if (a <= 3) {
        pos[a] = [];
        if (b <= 4) {
            pos[a][b] = szvalue.value;
            b++;
        }
        a++;
    }
}

function huoqu() {
    document.getElementById("demo").innerHTML = Date();
}
