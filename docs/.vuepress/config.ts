import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  lang: "zh-CN",
  title: "AndroidGuide",
  description: "「Android学习之路」一份涵盖大部分 Android 程序员所需要掌握的核心知识。",
  //指定 vuepress build 的输出目录
  dest: "./dist",
  // 是否开启默认预加载 js
  shouldPrefetch: (file, type) => false,

  base: "/",

  theme,
});
