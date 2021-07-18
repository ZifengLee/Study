<template>
    <div id="all">
        <div>欢迎来到</div>
        <div>欢乐五子棋</div>
        <button @click="tradition">经典模式</button>
        <button @click="doItYouself">自定义棋盘</button>
        <div id="payBtn">
            <button type="text" id="button" @click="tradition">开始游戏</button>
        </div>
    </div>
</template>

<script>
export default {
    name: "test1",
    data() {
        return {
            geziColor: true,
            shuzu: []
        };
    },
    created() {
        this.first();
    },
    methods: {
        // 跳转到传统的页面
        tradition() {
            this.$router.push({
                path: '/test3'
            })
        },
        //跳转到自定义页面
        doItYouself() {
            this.$router.push({
                path: '/test2'
            })
        },
        changecolor: function (event) {
            // `this` 在方法里指当前 Vue 实例
            // `event` 是原生 DOM 事件
            if (event) {
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
        first: function () {
            let that = this;
            function fun() {
                for (let i = 1; i <= 5; i++) {
                    that.shuzu[i] = 0;
                }
            }
            fun();
        }
    }
};
</script>
<style lang="scss" scoped>
#all {
    max-width: 480px;
    font-size: 18px;
    margin: 0px auto;
    justify-content: center;
}
.gezi {
    width: 60px;
    height: 60px;
    border: 1px solid red;
}
#payBtn {
    display: flex;
    justify-content: center;
}
#button {
    border: 0;
    outline: none;
    width: 220px;
    height: 42px;
    text-align: center;
    line-height: 42px;
    border-radius: 4px;
    margin-top: 24px;
    color: #fff;
    background-color: #845e01;
}
</style>
