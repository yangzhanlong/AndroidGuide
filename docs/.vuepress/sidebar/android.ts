export const android = [
    {
        text: "Android虚拟机",

        icon:"jichu",
        collapsable: true,
        children: [
            {
                text: "指令",
                prefix: "android_vm/",
                icon:"jichu",
                collapsable: true,
                children: [
                    "指令集解读","深入Android内存管理","类加载与动态字节替换"
                ],
            },
            {
                text: "垃圾回收",
                prefix: "android_vm/",
                icon:"jichu",
                collapsable: true,
                children: [

                ],
            },
            {
                text: "类与对象结构",
                prefix: "android_vm/",
                icon:"jichu",
                collapsable: true,
                children: [

                ],
            },

        ],
    },
    {
        text: "Framework",
        prefix: "framework/",
        icon:"jichu",
        collapsable: true,
        children: [
           "handler",
        ],
    },
    {
        text: "Jetpack",
        collapsable: true,
        icon:"jichu",
        prefix: "framework/jetpack/",
        children: [
            "databinding",
            "viewModel",
            "liveData",
            "lifeCycle",
        ],
    },
    {
        text: "Kotlin",
        prefix: "kotlin/",
        collapsable: true,
        icon: "kotlin",
        children: [
            "kotlin-base",
        ],
    },
    {
        text: "NDK",
        prefix: "ndk/",
        icon:"jichu",
        collapsable: true,
        children: [
            "C++-base",
            {
                text: "Jni",
                collapsable: true,
                children: [
                    "Jni-base", "Jni-sort",
                    "Jni-c-dev", "Jni-register",
                    "Jni-thread", "Jni-cache", "Jni-exception", "Jni-run", "Jni-Parcel",
                ],
            },
        ],
    },
];