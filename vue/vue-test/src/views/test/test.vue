<template>
  <div id="all">
    <div id="1" class="gezi" v-on:click="changecolor"></div>
    <div id="2" class="gezi" v-on:click="changecolor"></div>
    <div id="3" class="gezi" v-on:click="changecolor"></div>
    <div id="4" class="gezi" v-on:click="changecolor"></div>
    <div id="5" class="gezi" v-on:click="changecolor"></div>
  </div>
</template>

<script>
export default {
  name: "home",
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
    changecolor: function(event) {
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
    first: function() {
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
<style scoped>
#all {
  margin: 0px auto;
  display: flex;
  justify-content: center;
  width: 600px;
  height: 600px;
  /* border: 1px solid black; */
}
.gezi {
  width: 60px;
  height: 60px;
  border: 1px solid red;
}
</style>
