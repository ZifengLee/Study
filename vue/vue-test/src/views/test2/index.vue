<template>
  <div id="contain">
    <input type="number" :model="hangNum" placeholder="请输入行" />
    <input type="number" :model="lieNum" placeholder="请输入列" />
    <button v-on:click="creatGezi">确认</button>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      hangNum: "",
      lieNum: ""
    };
  },
  methods: {}
};
</script>
<style lang="scss">
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
}
</style>
