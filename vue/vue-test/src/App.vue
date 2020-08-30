<template>
  <div id="app">
    <nav v-on:click.prevent>
      <router-link id="home" to="/" exact-active-class="active"
        >HOME</router-link
      >
      <router-link id="page1" to="/page1" exact-active-class="active"
        >PAGE1</router-link
      >
      <router-link id="page2" to="/page2" exact-active-class="active"
        >PAGE2</router-link
      >
      <router-link id="page3" to="/page3" exact-active-class="active"
        >PAGE3</router-link
      >
      <router-link to="/test" exact-active-class="active">TEST</router-link>
    </nav>

    <!-- 路由出口 -->
    <!-- 路由匹配到的组件将渲染在这里 -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {};
  },
  methods: {}
};
</script>

<!-- 样式代码 -->
<style>
body {
  color: #5e5b64;
  text-align: center;
}

nav {
  display: inline-block;
  margin: 50px auto 30px;
  background-color: #00a2ff;
  border-radius: 2px;
}
a {
  display: inline-block;
  padding: 18px 30px;
  text-decoration: none;
  color: black;
}
.active {
  color: #fff;
}
</style>
