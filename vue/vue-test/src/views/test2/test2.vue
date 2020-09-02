<template>
    <div>
        <input v-model.lazy="hangNum" placeholder="请输入行" />
        <input v-model.lazy="lieNum" placeholder="请输入列" />
        <button v-on:click="creatGeZi">确认</button>
        <div v-for="(item,index) in hangNum" :key="index" class="contain">
            <div v-for="(item,index) in lieNum" :key="index">
                <div :id="hangNum.index" class="gezi" @click="changecolor"></div>
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
            hangNum: 0,
            lieNum: 0,
            idN: 0,
        };
    },

    methods: {
        creatGeZi() {
            this.hangNum = parseInt(this.hangNum);
            this.lieNum = parseInt(this.lieNum);
            for (let i = 0; i < this.hangNum; i++) {
                for (let j = 0; j < this.lieNum; j++) {
                    this.idN = String(i) + String(j);
                }
            }
        },

        changecolor: function (event) {
            // `this` 在方法里指当前 Vue 实例
            // `event` 是原生 DOM 事件
            if (event) {
                console.log(event);
                let id = parseInt(event.target.id);
                if (this.shuzu[id] == 1) {
                    alert("该格子已点击");
                } else {
                    if (this.geziColor) {
                        // console.log(event);
                        event.target.style.backgroundColor = "red";
                        this.geziColor = !this.geziColor;
                    } else {
                        event.target.style.backgroundColor = "black";
                        this.geziColor = !this.geziColor;
                    }

                    this.shuzu[id] = 1;
                }
            }
        },

    }
};
</script>

<style lang="scss" scoped>
input {
    width: 100px;
    height: 40px;
}

button {
    width: 50px;
    height: 40px;
}

.contain {
    display: flex;
}

.gezi {
    width: 60px;
    height: 60px;
    border: 1px solid black;
}
</style>
