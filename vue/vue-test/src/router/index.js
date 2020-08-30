import Vue from "vue";
import Router from "vue-router";
import home from "../views/home";
import page1 from "../views/page1";
import page2 from "../views/page2/page2.vue";
import page3 from "../views/page3/page3.vue";
import test from "../views/test/test.vue";

Vue.use(Router);

const routes = [
  {
    path: "/", //这个是主页 网站的默认目录要有一个page；
    name: "home",
    component: home
  },
  {
    path: "/page1",
    name: "page1",
    component: page1
  },
  {
    path: "/page2",
    name: "page2",
    component: page2
  },
  {
    path: "/test",
    name: "test",
    component: test
  },
  {
    path: "/page3",
    name: "page3",
    component: page3
  }
];

export default new Router({
  base: "./",
  routes: routes
});
