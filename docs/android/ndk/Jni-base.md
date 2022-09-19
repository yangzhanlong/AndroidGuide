---
title: Jni基础
category:

- NDK

---

# Jni基础

### JNI概述

- 定义：`Java Native Interface` ，即Java本地接口
- 作用：使得Java与本地其他语言(c,c++)交互
- JNI是属于Java的，与Android没有关系
- 实际中的驱动都是c,c开放的，通过JNI.Java可以调用c/c实现的驱动，从而扩展java虚拟机的能力

### 为什么要有JNI

- Java需要与本地代码进行交互，因为java具备跨平台的特点，所以java与本地代码交互的能力非常弱，采用jni特效增强java与本地代码交互的能力

### JNI与NDK的关系

- jni属于java jvm虚拟机的技术，ndk是工具集,是属于Android，NDK集成了jni,c++,gcc 等各种工具

### 第一个NDK项目

1. 选择Native C++新建项目
2. 创建完成后，会在main目录下有一个cpp的目录，里面包含`CMakeLists.txt`和`native-lib.cpp`

#### 头文件解释

1.  使用`javah` 命令生成头文件 
```shell
javah -classpath . -jni -d /Users/yang/Study/Ndk/Jni/JniStudy/app/src/main/java com.multi.jnistudy.TestActivity
```

2. 得到的头文件 `com_multi_jnistudy_TestActivity.h` 

```cpp
#include <jni.h>

// 解决循环依赖的问题，第二次进不来
#ifndef _Included_com_multi_jnistudy_TestActivity // 如果没有这个宏
#define _Included_com_multi_jnistudy_TestActivity // 就定义这个宏
#ifdef __cplusplus // 如果是c++环境
extern "C" { // 全部采用c的方式,不允许你函数重载，函数名一样的问题
    #endif
    #undef com_multi_jnistudy_TestActivity_A
    #define com_multi_jnistudy_TestActivity_A 100L
    /*
    * 函数的声明
    * Class:     com_multi_jnistudy_TestActivity
    * Method:    getStringPwd
    * Signature: ()Ljava/lang/String;
    */
    JNIEXPORT jstring JNICALL Java_com_multi_jnistudy_TestActivity_getStringPwd
        (JNIEnv *, jobject);
    
    /*
    * Class:     com_multi_jnistudy_TestActivity
    * Method:    getStringPwd2
    * Signature: ()Ljava/lang/String;
    */
    JNIEXPORT jstring JNICALL Java_com_multi_jnistudy_TestActivity_getStringPwd2
        (JNIEnv *, jclass);
    
    #ifdef __cplusplus
}
#endif
#endif
```

#### cpp文件解释

1.  extern "C" 
> extern "C"： 必须采用C的编译方式，为什么，请看JNIEnv内部源码
> 无论是C还是C++ 最终是调用到 C的JNINativeInterface，所以必须采用C的方式 extern "C" 函数的实现

2. JNIEXPORT
> 标记该方法可以被外部调用（VS上不加入 运行会报错， AS上不加入运行没有问题）
> Linux运行不加入，不报错, Win 你必须加入 否则运行报错, MacOS 还不知道

3. jstring 
> Java <---> native 转换用的

4. JNICALL 
> 代表是 JNI标记，可以少

5. Java_com_multi_jnistudy_MainActivity_getStringPwd
> Java_包名_类名_方法名 注意：我们的包名  native_1

6. JNIEnv* 
> JNIEnv * env  JNI：的桥梁环境    300多个函数，所以的JNI操作，必须靠他

7.  jobject 
> jobject jobj  谁调用，就是谁的实例  MainActivity this

8.  jclass
> jclass clazz 谁调用，就是谁的class MainActivity.class 静态方法

```cpp
#include <jni.h>
#include <string>

// NDK工具链里面的 log 库 引入过来
#include <android/log.h>

#define TAG "Yang"
// ... 我都不知道传入什么  借助JNI里面的宏来自动帮我填充
#define LOGD(...) __android_log_print(ANDROID_LOG_DEBUG, TAG, __VA_ARGS__)
#define LOGE(...) __android_log_print(ANDROID_LOG_ERROR, TAG, __VA_ARGS__)
#define LOGI(...) __android_log_print(ANDROID_LOG_INFO, TAG, __VA_ARGS__)

// extern "C"： 必须采用C的编译方式，为什么，请看JNIEnv内部源码
// 无论是C还是C++ 最终是调用到 C的JNINativeInterface，所以必须采用C的方式 extern "C"
// 函数的实现
extern "C"

//标记该方法可以被外部调用（VS上不加入 运行会报错， AS上不加入运行没有问题）
//Linux运行不加入，不报错,  Win 你必须加入 否则运行报错,   MacOS 还不知道
JNIEXPORT

// Java <---> native 转换用的
jstring

// 代表是 JNI标记，可以少
JNICALL

// Java_包名_类名_方法名  ，注意：我们的包名 _     native _1

// JNIEnv * env  JNI：的桥梁环境    300多个函数，所以的JNI操作，必须靠他

// jobject jobj  谁调用，就是谁的实例  MainActivity this
// jclass clazz 谁调用，就是谁的class MainActivity.class 静态方法
Java_com_multi_jnistudy_MainActivity_getStringPwd(JNIEnv *env, jobject thiz) {

}
extern "C"
JNIEXPORT jstring JNICALL
Java_com_multi_jnistudy_MainActivity_getStringPwd2(JNIEnv *env, jobject thiz) {

}
extern "C"
JNIEXPORT jstring JNICALL
Java_com_multi_jnistudy_MainActivity_getMyName(JNIEnv *env, jclass clazz) {

    /**
    *  class _jarray : public _jobject {};
       class _jobjectArray : public _jarray {};
       typedef _jobjectArray*  jobjectArray;
       typedef _jarray*        jarray;

       jobjectArray 继承 jarray
    */
}
```

```kotlin
// 生成头文件：javah com.multi.jnistudy.MainActivity
class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    val A = 100
    var name = "Yang" // 签名：Ljava/lang/String;
    var age = 29 // 签名：I


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
    }

    // Java 本地方法  实现：native层
    external fun getStringPwd(): String
    external fun getStringPwd2(): String


    companion object {
        // Used to load the 'jnistudy' library on application startup.
        init {
            System.loadLibrary("jnistudy")
        }

        @JvmStatic
        external fun getMyName():String // 静态方法
    }
}
```

### 签名规则

* javap -s -p MainActivity     必须是.class
* javap -s -p xxx.class    -s 输出xxxx.class的所有属性和方法的签名，   -p 忽略私有公开的所有属性方法全部输出

```
Java的boolean  --- Z  注意点
Java的byte  --- B
Java的char  --- C
Java的short  --- S
Java的int  --- I
Java的long  --- J     注意点
Java的float  --- F
Java的double  --- D
Java的void  --- V
Java的引用类型  --- Lxxx/xxx/xx/类名;
Java的String  --- Ljava/lang/String;
Java的array  int[]  --- [I         double[][][][]  --- [[[D
int add(char c1, char c2) ---- (CC)I
void a()     ===  ()V
```

### JNI简单例子

```kt
class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    var name = "Yang" // 签名：Ljava/lang/String;
    //var age = 29 // 签名：I

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        changeName()
        Log.i("Yang", "修改后的name:$name")
        changeAge()
        Log.i("Yang", "修改后的age:$age")
        callAddMethod()
    }

    external fun changeName()
    external fun callAddMethod()

    // 专门写一个函数，给native成调用
    fun add(number1: Int, number2: Int): Int {
        return number1 + number2 + 8
    }

    companion object {
        // System.load(); 这种是可以绝对路径的加载动态链接库文件
        // System.loadLibrary 这种是从库目录遍历层级目录，去自动的寻找
        init {
            System.loadLibrary("jnistudy")
        }

        @JvmStatic
        external fun changeAge()
        val age = 29
    }
}
```

```cpp
extern "C"
JNIEXPORT void JNICALL
Java_com_multi_jnistudy_MainActivity_changeName(JNIEnv *env, jobject thiz) {
    // 获取class
    jclass j_cls = env->GetObjectClass(thiz);

    // 获取属性 L对象类型 都需要L
    // jfieldID GetFieldID(MainActivity.class, 属性名, 属性的签名)
    jfieldID j_fid = env->GetFieldID(j_cls, "name", "Ljava/lang/String;");
    // 从class获取jfieldID的属性值 static_cast:强转
    jstring j_str = static_cast<jstring>(env->GetObjectField(thiz, j_fid));
    // jni字符串转成c++字符串
    char * c_str = const_cast<char *>(env->GetStringUTFChars(j_str, NULL));
    LOGD("native: %s\n", c_str);

    jstring name = env->NewStringUTF("Yangmi");
    //void SetObjectField(jobject obj, jfieldID fieldID, jobject value)
    env->SetObjectField(thiz, j_fid, name);
}

extern "C"
JNIEXPORT void JNICALL
Java_com_multi_jnistudy_MainActivity_changeAge(JNIEnv *env, jclass clazz) {
    // 修改静态值

    const char * sig = "I";
    //  jfieldID GetStaticFieldID(jclass clazz, const char* name, const char* sig)
    jfieldID  j_fid = env->GetStaticFieldID(clazz, "age", sig);
    // jint GetStaticIntField(jclass clazz, jfieldID fieldID)
    jint age = env->GetStaticIntField(clazz, j_fid);
    LOGD("native: %d\n", age);
    age+=10;
    env->SetStaticIntField(clazz, j_fid, age);
}

extern "C"
JNIEXPORT void JNICALL
Java_com_multi_jnistudy_MainActivity_callAddMethod(JNIEnv *env, jobject thiz) {
    // 自己得到 MainActivity.class
    jclass  mainActivityClass = env->GetObjectClass(thiz);

    // GetMethodID(MainActivity.class, 方法名, 方法的签名)
    jmethodID j_mid = env->GetMethodID(mainActivityClass, "add", "(II)I");

    // 调用 Java的方法
    jint sum = env->CallIntMethod(thiz, j_mid, 3, 3);
    LOGE("sum result:%d", sum);
}
```

### JNI操作

```kt
class MainActivity : AppCompatActivity() {

     private val TAG = MainActivity::class.java.simpleName

    static {
        // System.load(); 这种是可以绝对路径的加载动态链接库文件
        System.loadLibrary("native-lib"); // 这种是从库目录遍历层级目录，去自动的寻找
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
    }

    /**
     * 下面是 native 区域
     */

    external fun testArrayAction(
        count: Int,
        textInfo: String,
        ints: IntArray,
        strs: Array<String>
    ) // String引用类型，玩数组


    external fun putObject(student: Student, str: String) // 传递引用类型，传递对象


    external fun insertObject() // 凭空创建Java对象


    external fun testQuote() // 测试引用

    external fun delQuote() // 释放全局引用

    external fun textExternal()


    /**
     * 下面是 点击事件区域
     */
     // 点击事件：操作testArrayAction函数
     fun test01(view: View) {
        val ints = intArrayOf(1, 2, 3, 4, 5, 6)
        val strs = arrayOf("李小龙", "李连杰", "李元霸")
        testArrayAction(99, "你好", ints, strs);

        for (anInt in ints) {
            Log.d(TAG, "test01: anInt:$anInt")
        }
    }
    
    // 点击事件：操作putObject函数 
    fun test02(view: View) {
        val student = Student()
        student.name = "史泰龙"
        student.age = 88
        putObject(student, "九阳神功")
    }
    
    // 点击事件：操作insertObject函数
    fun test03(view: View) {
        insertObject()
    }
    
    // 点击事件：两个函数是一起的，操作引用 与 释放引用
    fun test04(view: View) {
        testQuote()
    }
    fun test05(view: View) {
        delQuote()
    }

    fun test06(view: View) {
        textExternal()
    }
}
```

#### 数组操作
`GetIntArrayElements` `GetArrayLength` `GetObjectArrayElement`

```cpp
/**
 *  jint == int
    jstring == String
    jintArray == int[]
    jobjectArray == 引用类型对象，例如 String[]   Test[]   Student[]  Person[]
 */
extern "C"
JNIEXPORT void JNICALL
Java_com_multi_jnistudy_MainActivity_testArrayAction(JNIEnv *env, jobject thiz, jint count,
                                                     jstring text_info, jintArray ints,
                                                     jobjectArray strs) {
    // ① 基本数据类型  jint count， jstring text_info， 最简单的
    int countInt = count;
    LOGI("参数1：%d\n", countInt);

    // const char* GetStringUTFChars(jstring string, jboolean* isCopy)
    const char * textInfo = env->GetStringUTFChars(text_info, NULL);
    LOGI("参数二 textInfo:%s\n", textInfo);

    // ② 把int[] 转成 int*
    // jint* GetIntArrayElements(jintArray array, jboolean* isCopy)
    int* jintArray = env->GetIntArrayElements(ints, NULL);
    // Java层数组的长度
    // 目前无法控制Java的数组 变化 +100
    // jsize GetArrayLength(jarray array) // jintArray ints 可以放入到 jarray的参数中去
    jsize size = env->GetArrayLength(ints);
    for (int i = 0; i < size; ++i) {
        *(jintArray+i) += 100; // C++的修改，影响不了Java层
        LOGI("参数三 int[]:%d\n", *jintArray+i);
    }

    /**
     * 0:           刷新Java数组，并 释放C++层数组
     * JNI_COMMIT:  只提交 只刷新Java数组，不释放C++层数组
     * JNI_ABORT:   只释放C++层数组
     */
    env->ReleaseIntArrayElements(ints, jintArray, 0);

    // ③：jobjectArray 代表是Java的引用类型数组，不一样
    jsize  strssize = env->GetArrayLength(strs);
    for (int i = 0; i < strssize; ++i) {

        jstring jobj = static_cast<jstring>(env->GetObjectArrayElement(strs, i));

        // 模糊：isCopy内部启动的机制
        // const char* GetStringUTFChars(jstring string, jboolean* isCopy)
        const char * jobjCharp = env->GetStringUTFChars(jobj, NULL);

        LOGI("参数四 引用类型String 具体的：%s\n", jobjCharp);

        // 释放jstring
        env->ReleaseStringUTFChars(jobj, jobjCharp);
    }
}
```

#### 对象操作

```cpp
// jobject student == Student
// jstring str  == String
extern "C"
JNIEXPORT void JNICALL
Java_com_derry_as_1jni_1project_MainActivity_putObject(JNIEnv *env,
                                                       jobject thiz,
                                                       jobject student,
                                                       jstring str) {
    const char * strChar = env->GetStringUTFChars(str, NULL);
    LOGI("strChar：%s\n", strChar);
    env->ReleaseStringUTFChars(str, strChar);

    // --------------
    // 1.寻找类 Student
    // jclass studentClass = env->FindClass("com/derry/as_jni_project/Student"); // 第一种
    jclass studentClass =  env->GetObjectClass(student); // 第二种

    // 2.Student类里面的函数规则  签名
    jmethodID setName = env->GetMethodID(studentClass, "setName", "(Ljava/lang/String;)V");
    jmethodID getName = env->GetMethodID(studentClass, "getName", "()Ljava/lang/String;");
    jmethodID showInfo = env->GetStaticMethodID(studentClass, "showInfo", "(Ljava/lang/String;)V");

    // 3.调用 setName
    jstring value = env->NewStringUTF("AAAA");
    env->CallVoidMethod(student, setName, value);

    // 4.调用 getName
    jstring getNameResult = static_cast<jstring>(env->CallObjectMethod(student, getName));
    const char * getNameValue = env->GetStringUTFChars(getNameResult, NULL);
    LOGE("调用到getName方法，值是:%s\n", getNameValue);

    // 5.调用静态showInfo
    jstring  jstringValue = env->NewStringUTF("静态方法你好，我是C++");
    env->CallStaticVoidMethod(studentClass, showInfo, jstringValue);
}
```

#### 对象操作进阶

```cpp
extern "C"
JNIEXPORT void JNICALL
Java_com_derry_as_1jni_1project_MainActivity_insertObject(JNIEnv *env, jobject thiz) {
    // 1.通过包名+类名的方式 拿到 Student class  凭空拿class
    const char *studentstr = "com/derry/as_jni_project/Student";
    jclass studentClass = env->FindClass(studentstr);

    // 2.通过student的class  实例化此Student对象   C++ new Student
    jobject studentObj = env->AllocObject(studentClass); // AllocObject 只实例化对象，不会调用对象的构造函数

    // 方法签名的规则
    jmethodID setName = env->GetMethodID(studentClass, "setName", "(Ljava/lang/String;)V");
    jmethodID setAge = env->GetMethodID(studentClass, "setAge", "(I)V");

    // 调用方法
    jstring strValue = env->NewStringUTF("Derry");
    env->CallVoidMethod(studentObj, setName, strValue);
    env->CallVoidMethod(studentObj, setAge, 99);


    // env->NewObject() // NewObject 实例化对象，会调用对象的构造函数


    // ====================  下面是 Person对象  调用person对象的  setStudent 函数等

    // 4.通过包名+类名的方式 拿到 Student class  凭空拿class
    const char *personstr = "com/derry/as_jni_project/Person";
    jclass personClass = env->FindClass(personstr);

    jobject personObj = env->AllocObject(personClass); // AllocObject 只实例化对象，不会调用对象的构造函数

    // setStudent 此函数的 签名 规则
    jmethodID setStudent = env->GetMethodID(personClass, "setStudent",
            "(Lcom/derry/as_jni_project/Student;)V");

    env->CallVoidMethod(personObj, setStudent, studentObj);
}
```

#### 全局引用 局部引用理解

```cpp
jclass dogClass; // 你以为这个是全局引用，实际上他还是局部引用

extern "C"
JNIEXPORT void JNICALL
Java_com_derry_as_1jni_1project_MainActivity_testQuote(JNIEnv *env, jobject thiz) {
    if (NULL == dogClass) {
        /*const char * dogStr = "com/derry/as_jni_project/Dog";
        dogClass = env->FindClass(dogStr);*/

        // 升级全局引用： JNI函数结束也不释放，反正就是不释放，必须手动释放   ----- 相当于： C++ 对象 new、手动delete
        const char * dogStr = "com/derry/as_jni_project/Dog";
        jclass temp = env->FindClass(dogStr);
        dogClass = static_cast<jclass>(env->NewGlobalRef(temp)); // 提升全局引用
        // 记住：用完了，如果不用了，马上释放，C C++ 工程师的赞美
        env->DeleteLocalRef(temp);
    }

    // <init> V  是不会变的

    // 构造函数一
    jmethodID init = env->GetMethodID(dogClass, "<init>", "()V");
    jobject dog = env->NewObject(dogClass, init);

    // 构造函数2
    init = env->GetMethodID(dogClass, "<init>", "(I)V");
    dog = env->NewObject(dogClass, init, 100);


    // 构造函数3
    init = env->GetMethodID(dogClass, "<init>", "(II)V");
    dog = env->NewObject(dogClass, init, 200, 300);

    // 构造函数4
    init = env->GetMethodID(dogClass, "<init>", "(III)V");
    dog = env->NewObject(dogClass, init, 400, 500, 600);

    env->DeleteLocalRef(dog); // 释放
}

// JNI函数结束，会释放局部引用   dogClass虽然被释放，但是还不等于NULL，只是一个悬空指针而已，所以第二次进不来IF，会奔溃

// 手动释放全局引用
extern "C"
JNIEXPORT void JNICALL
Java_com_derry_as_1jni_1project_MainActivity_delQuote(JNIEnv *env, jobject thiz) {
   if (dogClass != NULL) {
       LOGE("全局引用释放完毕，上面的按钮已经失去全局引用，再次点击会报错");
       env->DeleteGlobalRef(dogClass);
       dogClass = NULL; // 最好给一个NULL，指向NULL的地址，不要去成为悬空指针
   }
}
```

#### extern

```cpp
#include <iostream>

// 日志输出
#include <android/log.h>

#define TAG "JNISTUDY"
// __VA_ARGS__ 代表 ...的可变参数
#define LOGD(...) __android_log_print(ANDROID_LOG_DEBUG, TAG,  __VA_ARGS__);
#define LOGE(...) __android_log_print(ANDROID_LOG_ERROR, TAG,  __VA_ARGS__);
#define LOGI(...) __android_log_print(ANDROID_LOG_INFO, TAG,  __VA_ARGS__);

int age = 99; // 实现

void show() { // 实现
    // 5000行代码
    // ...

    LOGI("show run age:%d\n", age);
}
```

```cpp
// 非常方便，可以使用了
extern int age; // 声明age
extern void show(); // 声明show函数

extern "C"
JNIEXPORT void JNICALL
Java_com_multi_jnistudy_MainActivity_textExternal(JNIEnv *env, jobject thiz) {
    show();
}
```