import {sidebar} from "vuepress-theme-hope";
import {android} from "./sidebar/android";
import {video} from "./sidebar/video"
import {flutter} from "./sidebar/flutter"

export default sidebar({
    "/android/": android,
    "/video/": video,
    "/flutter/": flutter,
    "/": [
        {
            text: "Java",
            icon: "java",
            collapsable: true,
            children: [
                {
                    text: "注解与泛型",
                    prefix: "java/base/",
                    collapsable: true,
                    children: [
                        "自定义注解","注解的使用","APT实现原理","泛型"
                    ],
                },
                {
                    text: "动态编程技术",
                    prefix: "java/base/",
                    collapsable: true,
                    children: [
                        "动态代理","反射","编译时处理"
                    ],
                },
                {
                    text: "并发编程",
                    prefix: "java/concurrent/",
                    collapsable: true,
                    children: [
                        "jmm","cas","aqs","synchronize","thread","线程池"
                    ],
                },
                {
                    text: "IO",
                    prefix: "java/io/",
                    collapsable: true,
                    children: [
                        "nio","okio","序列化"
                    ],
                },
            ],
        },
    ],
});