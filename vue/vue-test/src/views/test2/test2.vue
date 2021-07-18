<template>
    <div>
        <input v-model.lazy="rowNum" placeholder="请输入行" />
        <input v-model.lazy="columnNum" placeholder="请输入列" />
        <button v-on:click="creatGeZi">确认</button>
        <div
            :id="index"
            v-for="(item, index) in rowNum"
            :key="index"
            class="contain"
        >
            <div :id="index2" v-for="(item, index2) in columnNum" :key="index2">
                <div
                    :id="index + '' + index2"
                    :row="index"
                    :column="index2"
                    class="gezi"
                    @click="changecolor"
                ></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "test1",

    data() {
        return {
            geziColor: true,
            shuzu: [],
            rowNum: "",
            columnNum: "",
            idN: 0,
        };
    },

    methods: {
        // 生成格子
        creatGeZi() {
            this.rowNum = parseInt(this.rowNum);
            this.columnNum = parseInt(this.columnNum);
            for (let i = 0; i < this.rowNum; i++) {
                for (let j = 0; j < this.columnNum; j++) {
                    // this.idN = String(i) + String(j);
                    this.idN = i + '' + j;
                }
            }
        },

        // 下棋
        changecolor: function (event) {
            // `this` 在方法里指当前 Vue 实例
            // `event` 是原生 DOM 事件
            if (event) {
                console.log(event);
                let id = parseInt(event.target.id);
                let row = parseInt(event.target.row);
                let column = parseInt(event.target.column);
                console.log(event.target.id);
                console.log(event.target.row);
                if (this.shuzu[id] == 1) {
                    alert("该格子已点击");
                } else {
                    if (this.geziColor) {
                        event.target.style.backgroundColor = "red";
                        console.log(event.target.id);
                        console.log(row);
                        console.log(column);
                        this.success(row, column),

                            this.geziColor = !this.geziColor;
                    } else {
                        event.target.style.backgroundColor = "black";
                        console.log(event.target.id);
                        this.geziColor = !this.geziColor;
                    }

                    this.shuzu[id] = 1;
                }
            }
        },

        // 成功判断
        success: function (i, j) {
            console.log(i);
            console.log(j);
        },

        //行成功
        rowSuccess: function (row, column) {

        }


    }
};
</script>

<style lang="scss" scoped>
input {
    width: 60px;
    height: 20px;
}

button {
    width: 44px;
    height: 24px;
    line-height: 20px;
}

.contain {
    display: flex;
}

.gezi {
    width: 20px;
    height: 20px;
    border: 1px solid black;
}
</style>
