---
title: 使用Jni排序
category:

- NDK

---

# JNI 数组排序

* MainActivity.kt
```kt
val arr = intArrayOf(5, 6, 8, 9, 0, 1, 2)
Log.i("Yang", "排序前：")
print(arr)
sort(arr)
Log.i("Yang", "排序后:")
print(arr)
```

* native-lib.cpp
```cpp
extern "C"
JNIEXPORT void JNICALL
Java_com_multi_jnistudy_MainActivity_sort(JNIEnv *env, jobject thiz, jintArray list) {
    // list 进行排序
    // 1. 获取list集合, 使用jint* 接收
    jint * arr = env->GetIntArrayElements(list, nullptr);

    // 2. 获取数组的长度
    int length = env->GetArrayLength(list);

    /**
     * 3. 调用排序函数
     *   参数1： void* 数组的首地址
     *   参数2： 数组的大小长度
     *   参数3： 数组元素数据类型的大小
     *   参数4： 数组的一个比较方法指针(Comparable)
     */
    qsort(arr, length, sizeof(int), reinterpret_cast<int (*)(const void *, const void *)>(compare));

    /**
     * 4. 执行ReleaseIntArrayElements，同步到java进行数据更新
     *  参数3：mode说明
     *  0->既要同步数据给 arr ,又要释放 intArray，会排序
     *  JNI_COMMIT->会同步数据给 arr ，但是不会释放 intArray，会排序
     *  JNI_ABORT->不同步数据给 arr ，但是会释放 intArray，所以上层看到就并不会排序
     */
     env->ReleaseIntArrayElements(list, arr, 0);

}
```

```
I/Yang: 排序前：
I/Yang: 5
I/Yang: 6
I/Yang: 8
I/Yang: 9
I/Yang: 0
I/Yang: 1
I/Yang: 2
I/Yang: 排序后:
I/Yang: 0
I/Yang: 1
I/Yang: 2
I/Yang: 5
I/Yang: 6
I/Yang: 8
I/Yang: 9
```