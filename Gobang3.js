var bIsBlack = true;
var all;
// 位置数据
var pos;

var aInp = document.getElementsByTagName("input");


// 初始化数据
function InitData(hangnum, lienum) {
	pos = new Array(); //先声明一维
	for (var i = 0; i < hangnum; i++) {
		pos[i] = new Array(); //再声明二维
		for (var j = 0; j < lienum; j++) {
			pos[i][j] = 0; // 赋值，每个数组元素的初始值为0
		}
	}
}


// 高亮格子 将高亮的格子边框变成蓝色
function Hightlight(gezi) {
	if (bIsBlack) {
		if (gezi.style.backgroundColor == "red") {
			gezi.style.borderColor = "blue";
		} else {
			gezi.style.borderColor = "brown";
		}
	} else {
		if (gezi.style.backgroundColor == "black") {
			gezi.style.borderColor = "blue";
		} else {
			gezi.style.borderColor = "brown";
		}
	}
}


// 点击格子
function OnClickGezi(i, j, gezi) {
	if (pos[i][j] != 0) {
		alert("坐标[" + j + "," + i + "]已经有棋子啦！！!");
		return;
	}

	// var lieColor = document.getElementById("lie");
	if (!bIsBlack) {
		// if (lieColor.style.backgroundColor == "red") {
		//     lieColor.style.bordercolor = "blue";
		// }

		gezi.style.backgroundColor = "red";
		pos[i][j] = 1;
	} else {
		// if (lieColor.style.backgroundColor == "black") {
		//     lieColor.style.bordercolor = "blue";
		// }
		gezi.style.backgroundColor = "black";
		pos[i][j] = 2;
	}
	// console.log(lieColor.style.bordercolor);
	bIsBlack = !bIsBlack;

	// lie.style.backgroundColor = !bIsBlack ? "red" : "black";
	// bIsBlack = !bIsBlack;
	// pos[i][j] = 1;

	console.log(lie);
}


// 点击确认
function OnClickCibfirm() {
	let hangnum = aInp[0].value;
	let lienum = aInp[1].value;

	var color = {}; //存放格子颜色

	InitData(hangnum, lienum);

	if (all != null) {
		document.body.removeChild(all);
	}

	all = document.createElement("div");
	all.id = "all";
	for (let i = 0; i < hangnum; i++) {
		let hang = document.createElement("div");
		hang.id = "hang";
		for (let j = 0; j < lienum; j++) {
			let lie = document.createElement("div");
			lie.id = "lie";
			hang.appendChild(lie); //增加格子

			var gezi = document.getElementById("lie");
			Hightlight(gezi);

			lie.addEventListener("click", function () {
				OnClickGezi(i, j, lie);
			});
		}
		all.appendChild(hang);
	}

	document.body.appendChild(all);

	// for (let i = 0; i < hangnum; i++) {
	//     // let hang = document.createElement("div");
	//     // hang.id = "hang";
	//     for (let j = 0; j < lienum; j++) {
	//         var borderColor = document.getElementById("lie");
	//         if (bIsBlack) {
	//             if (borderColor.style.backgroundColor == "red") {
	//                 borderColor.style.borderColor = "blue";
	//             } else {
	//                 borderColor.style.borderColor = "brown";
	//             }
	//         } else {
	//             if (borderColor.style.backgroundColor == "black") {
	//                 borderColor.style.borderColor = "blue";
	//             } else {
	//                 borderColor.style.borderColor = "brown";
	//             }
	//         }

	//     }
	// }
}


aInp[2].onclick = OnClickCibfirm;
