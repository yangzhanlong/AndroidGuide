export const android = [
    {
        text: "Framework",
        prefix: "framework/",
        icon: "android",
        collapsable: true,
        children: [
            {
                text: "Handler",
                collapsable: true,
                children: [
                    "handler",
                ]
            },
            {
                text: "Jetpack",
                prefix: "jetpack/",
                collapsable: true,
                children: [
                    "databinding", "viewModel", "liveData", "lifeCycle"
                ]
            },
        ],
    },
    {
        text: "Kotlin",
        prefix: "kotlin/",
        icon: "kotlin",
        collapsable: true,
        children: [
            "Kotlin基础",
        ],
    },
    {
        text: "NDK",
        prefix: "ndk/",
        icon: "android",
        collapsable: true,
        children: [
            {
                text: "C++",
                collapsable: true,
                children: [
                    "C++基础",
                ],
            },
            {
                text: "Jni",
                collapsable: true,
                children: [
                    "Jni基础", "Jni数组排序",
                    "Jni导入c库开放流程", "Jni静态注册与动态注册",
                    "Jni线程", "Jni静态缓存", "Jni异常处理", "Jni执行原理", "Jni之分析Parcel源码",
                ],
            },
        ],
    },
];