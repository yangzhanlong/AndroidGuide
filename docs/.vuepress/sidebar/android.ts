export const android = [
    {
        text: "Framework",
        prefix: "framework/",
        collapsable: true,
        children: [
           "handler",
        ],
    },
    {
        text: "Jetpack",
        collapsable: true,
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
        icon: "kotlin",
        children: [
            "kotlin-base",
        ],
    },
    {
        text: "NDK",
        prefix: "ndk/",
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