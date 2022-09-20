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
            collapsable: false,
            children: [
                {
                    text: "多线程",
                    prefix: "java/concurrent/",
                    collapsable: true,
                    children: [
                        "thread",
                    ],
                },
                {
                    text: "JVM",
                    prefix: "java/jvm/",
                    collapsable: true,
                    children: [
                        "jmm",
                    ],
                },
            ],
        },
    ],
});