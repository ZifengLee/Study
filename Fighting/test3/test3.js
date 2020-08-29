var Chengyu;
function piPei() {
    let Number = document.getElementById("Num").value;
    switch (parseInt(Number)) {
        case 1:
            Chengyu = "一生一世";
            break;
        case 2:
            Chengyu = "双喜临门";
            break;
        case 3:
            Chengyu = "三阳开泰";
            break;
        case 4:
            Chengyu = "四季安康";
            break;
        case 5:
            Chengyu = "五福临门";
            break;
        case 6:
            Chengyu = "六六大顺";
            break;
        case 7:
            Chengyu = "七星高照";
            break;
        default:
            Chengyu = "请输入1~7的数字!!!";
    }
    document.getElementById("result").innerHTML = Chengyu;
}

document.getElementById("btn").addEventListener("click", piPei);
