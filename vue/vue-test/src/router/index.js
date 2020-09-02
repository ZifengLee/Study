// import Vue from "vue";
// import Router from "vue-router";
// import test1 from "../views/test1";
// import test2 from "../views/test2";
// import page2 from "../views/page2/page2.vue";
// import page3 from "../views/page3/page3.vue";
// import test from "../views/test/test.vue";

// Vue.use(Router);

// const routes = [
//   {
//     path: "/", //这个是主页 网站的默认目录要有一个page；
//     name: "test1",
//     component: test1
//   },
//   {
//     path: "/test2",
//     name: "test2",
//     component: test2
//   },
//   {
//     path: "/page2",
//     name: "page2",
//     component: page2
//   },
//   {
//     path: "/test",
//     name: "test",
//     component: test
//   },
//   {
//     path: "/page3",
//     name: "page3",
//     component: page3
//   }
// ];

// export default new Router({
//   base: "./",
//   routes: routes
// });

import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const routes = [
  {
    path: "/",
    name: "test1",
    component: () => import("@/views/test1/test1.vue")
  },
  {
    path: "/test2", //这个是主页 网站的默认目录要有一个page；
    name: "test2",
    component: () => import("@/views/test2/test2.vue")
  },
  {
    path: "/test3",
    name: "test3",
    component: () => import("@/views/test3/test3.vue")
  },
  {
    path: "/page2",
    name: "page2",
    component: () => import("@/views/page2/page2.vue")
  },
  {
    path: "/page3",
    name: "page3",
    component: () => import("@/views/page3/page3.vue")
  }
];

export default new Router({
  base: "./",
  routes: routes
});
