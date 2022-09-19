import {defineUserConfig} from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
    lang: "zh-CN",
    title: "AndroidGuide",
    description: "「Android学习之路」一份涵盖大部分 Android 程序员所需要掌握的核心知识(包括：Java， FrameWork，Kotlin， 音视频， Flutter等)。",
    //指定 vuepress build 的输出目录
    dest: "./dist",

    base: "/",

    head: [
        // meta
        ["meta", {name: "robots", content: "all"}],
        ["meta", {name: "author", content: "Guide"}],
        [
            "meta",
            {
                "http-equiv": "Cache-Control",
                content: "no-cache, no-store, must-revalidate",
            },
        ],
        ["meta", {"http-equiv": "Pragma", content: "no-cache"}],
        ["meta", {"http-equiv": "Expires", content: "0"}],
        [
            "meta",
            {
                name: "keywords",
                content:
                    "NDK",
            },
        ],
        [
            "link",
            {
                rel: "stylesheet",
                href: "/iconfont/iconfont.css",
            },
        ],
    ],


    theme,
    // 是否开启默认预加载 js
    shouldPrefetch: false,
});
