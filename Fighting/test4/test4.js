var Scores;
function piPei() {
    let Number = document.getElementById("Score").value;
    let dengji = parseInt(Number / 10);
    // 方法一switch1
    switch (dengji) {
        case 10:
        case 9:
            Scores = "等级A";
            break;
        case 8:
            Scores = "等级B";
            break;
        case 7:
            Scores = "等级C";
            break;
        case 6:
            Scores = "等级D";
            break;
        case 5:
        case 4:
        case 3:
        case 2:
        case 1:
        case 0:
            Scores = "等级E";
            break;
        default:
            alert("您输入的分数不在正确范围内，请重新输入!!!");
    }

    // 方法二if
    // let dengji = parseInt(Number);

    // if (dengji <= 100 && dengji >= 90) {
    //     Scores = "等级A";
    // } else if (dengji < 90 && dengji >= 80) {
    //     Scores = "等级B";
    // } else if (dengji < 80 && dengji >= 70) {
    //     Scores = "等级C";
    // } else if (dengji < 70 && dengji >= 60) {
    //     Scores = "等级D";
    // } else if (dengji < 60 && dengji >= 0) {
    //     Scores = "等级E";
    // } else {
    //     alert("您输入的分数不在正确范围内，请重新输入!!!");
    // }

    document.getElementById("result").innerHTML = Scores;
}

document.getElementById("btn").addEventListener("click", piPei);
