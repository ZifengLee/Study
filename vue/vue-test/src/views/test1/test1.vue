<template>
  <div id="contain">
    <input type="number" v-bind="hangNum" placeholder="请输入行" />
    <input type="number" v-bind="lieNum" placeholder="请输入列" />
    <button v-on:click="creatGeZi">确认</button>
    <div></div>
  </div>
</template>

<script>
export default {
  name: "test1",

  data() {
    return {
      hangNum: "",
      lieNum: "",
      // geziColor: true,
      // 位置数据
      pos: [[]],
      all: "",
      divList: [
          {"codeType": "", "gitUrl": ""}
        ],


    };
  },
  created() {},
  methods: {
    // 初始化数据
    InitData: function() {
      for (var i = 0; i < parseInt(this.hangNum); i++) {
        this.pos[i] = [];
        for (var j = 0; j < parseInt(this.lieNum); j++) {
          this.pos[i][j] = 0;
          // console.log(pos);
        }
      }
    },

    // 点击格子
    OnClickGeZi: function(i, j, gezi) {
      if (pos[i][j] != 0) {
        alert("坐标[" + j + "," + i + "]已经有棋子啦！！!");
        return;
      }
      if (!bIsBlack) {
        gezi.style.backgroundColor = "red";
        pos[i][j] = 1;
      } else {
        gezi.style.backgroundColor = "black";
        pos[i][j] = 2;
      }
      bIsBlack = !bIsBlack;
      // console.log(lie);
    },

    // 生成格子
    creatGeZi: function() {
       //添加标本div
      addNode() {
        this.divList.push({"codeType": "", "gitUrl": ""});
      },
      //删除样本div
      deleteNode(i) {
        this.divList.splice(i, 1);  //删除index为i,位置的数组元素
      },

      this.InitData();

      if (this.all != null) {
        document.body.removeChild(this.all);
      }
      this.all = document.createElement("div");
      this.all.id = "all";
      for (let i = 0; i < parseInt(this.hangnum); i++) {
        let hang = document.createElement("div");
        hang.id = "hang";
        for (let j = 0; j < parseInt(this.lienum); j++) {
          let lie = document.createElement("div");
          lie.id = "lie";
          hang.appendChild(lie); //增加格子
          lie.addEventListener("click", function() {
            OnClickGeZi(i, j, lie);
          });
        }
        this.all.appendChild(this.hang);
      }

      document.body.appendChild(this.all);
    }
  }
};
</script>
<style lang="scss" scoped>
#contain {
  margin: 0px auto;
  display: flex;
  justify-content: center;
  // width: 600px;
  // height: 600px;
  /* border: 1px solid black; */
}
#all {
  width: 800px;
  height: 800px;
}

#gezi {
  width: 60px;
  height: 60px;
  border: 1px solid red;
}
</style>
