---
title: C++基础
category:

- NDK

---

### C++基础

### C++函数适配器

- `find_if` 的`equal_to`无法直接查找指定字符串

- 使用`bind2nd`函数适配器进行包裹`equal_to`，会把字符串放到`equal_to`里面进行比较


```cpp
// 1.C++的函数适配器。  第一版本
#include <iostream>
#include <set> // stl包
#include <algorithm> // 算法包
using namespace std;

int main() {
  // std::cout << "算法包" << std::endl;

  set<string, less<string>> setVar;
  setVar.insert("AAAA");
  setVar.insert("BBBB");
  setVar.insert("CCCC");

  for (set<string>::iterator iteratorVar = setVar.begin(); iteratorVar != setVar.end() ; iteratorVar++) {
      cout << *iteratorVar << endl;
  }

  // find_if
  // equal_to 比较用的
  set<string, less<string>>::iterator iteratorResult =

          // 解决尴尬的问题  equal_to 需要比较的 内容没有 使用 函数适配器 解决
          // 现在的问题是： 没有办法把 CCCC 传递给 const _Tp& __y，就没法去比较
          // find_if(setVar.begin(), setVar.end(), equal_to<string>("CCCC"), "CCCC");

          // 使用函数适配器后，就能够 CCCC 传递给了  const _Tp& __y，
          // setVar.begin(), setVar.end() 会把这些元素取出来 const _Tp& __x
          // x == y 的比较
          find_if(setVar.begin(), setVar.end(), bind2nd(equal_to<string>(), "CCCC"));

  if (iteratorResult != setVar.end()) {
      cout << "查找到了" << endl;
  } else {
      cout << "没有查找到" << endl;
  }

  return 0;
}
```

```c
template <class _InputIterator, class _Predicate>
find_if(_InputIterator __first, _InputIterator __last, _Predicate __pred) {
  for (; __first != __last; ++__first)
    if (__pred(*__first))
      break;
  return __first;
}
```

```c
template <class __Operation>
class binder2nd : public unary_function<typename __Operation::first_argument_type,
                            typename __Operation::result_type>
{
protected:
    __Operation                                op;
    typename __Operation::second_argument_type value;
public:
    binder2nd(const __Operation& __x, const typename __Operation::second_argument_type __y)
        : op(__x), value(__y) {}
                                
    // 使用仿函数
    typename __Operation::result_type operator()(typename __Operation::first_argument_type& __x) const
            {
        		return op(__x, value); // 这里的op 就是 equal_to
            }
};


template <class __Operation, class _Tp>
binder2nd<__Operation>
bind2nd(const __Operation& __op, const _Tp& __x)
    {return binder2nd<__Operation>(__op, __x);}
```

### 引用进阶

1. 引用的本质就是指针

2. 左值->获取，右值->修改

3. 例子：

    - `string getInfo()`是值传递，使用右值无法修改
    - `string & getInfo_front()`是引用传递，使用右值可以修改


```cpp
// 1.引用进阶。

#include <iostream>
#include <vector>
using namespace std;


// ============================ [左值 右值 引用]
class Student {
private:
    string  info = "AAA"; // 旧变量

    // TODO 第一种情况【getInfo函数的info 与 main函数的result 是旧与新的两个变量而已，他们是值传递，所以右值修改时，影响不了里面的旧变量】
public:
    string getInfo() {
        return this->info;
    }

    // TODO 第二种情况【getInfo函数的info 与 main函数的result 是引用关系，一块内存空间 有多个别名而已，所以右值修改时，直接影响旧变量】
public:
    string & getInfo_front() {
        return this->info;
    }
};

int main() {
    /*vector<int> v;
    int r = v.front(); // 左值 获取
    v.front() = 88; // 右值 修改*/

    Student student;

    // TODO 第一种情况
    student.getInfo() = "九阳神功";
    string result = student.getInfo();
    cout << "第一种情况:" << result << endl;

    // TODO 第二种情况
    student.getInfo_front() = "三分归元气"; // 右值 修改内容
    result = student.getInfo_front(); // 左值 获取内容
    cout << "第二种情况:" << result << endl;
}
```

### 线程

1. 创建线程`pthread_create(&pthreadID, 0, customPthreadTask, &number);`
2. 参数说明:

```c
int pthread_create (pthread_t *,  // 参数一：线程ID
                  	const pthread_attr_t *, // 参数二：线程属性
                  	void *(*)(void *), // 参数三：函数指针的规则
                  	void *); // 参数四：给函数指针传递的内容，void * 可以传递任何内容
```

3. 线程阻塞：`pthread_join(pthreadID, 0);`
4. 分离线程：main函数不等待线程继续执行
5. 非分离线程：main函数等待异步线程执行完再继续执行，使用`pthread_join`
6. 应用场景:
    - 多线程，使用分离线程，线程间互不影响
    - 协作，使用非分离线程，需要阻塞
7. 线程案例:
   
> 创建一个线程，把参数4的值带到参数3的函数去执行， 因为函数指针接受的是`void *`，表示任何类型的地址，所以需要使用`static_cast`来转换类型，然后进行取值

> **注意：参数3的函数必须返回0，不然会报错**

```c
// pthreads 我们必须掌握的内容

// pthreads 最简单的案例

#include <iostream>
#include <pthread.h> // Derry Cygwin 有 pthreads支持
using namespace std;

// void *(*)(void *)
void * customPthreadTask(void * pVoid) { // 异步线程  相当于Java的Thread.run函数一样
    // C++转换static_cast  转换指针操作的
    int * number = static_cast<int *>(pVoid); // pVoid==number int的地址，所以我用int*接收，很合理
    cout << "异步线程执行了:" << *number << endl;

    return 0; // 坑 坑 坑，必须返回，否则有错误，不好查询
}

int main() {
    int number = 9527;

    /**
      int pthread_create (pthread_t *,  // 参数一：线程ID
                        const pthread_attr_t *, // 参数二：线程属性
		                void *(*)(void *), // 参数三：函数指针的规则
		                void *); // 参数四：给函数指针传递的内容，void * 可以传递任何内容
     */
    pthread_t pthreadID; // 线程ID，每个线程都需要有的线程ID

    pthread_create(&pthreadID, 0, customPthreadTask, &number);

    // 阻塞线程，等线程执行完继续执行
    pthread_join(pthreadID, 0);
    cout << "main函数即将弹栈..." << endl;
    return 0;
}
```

### 互斥锁

1. C++ 互斥锁(`pthread_mutex_t`) == Java版本（`synchronize`） 多线程操作的安全  持有内置锁

2. 使用步骤：

    - 定义互斥锁-> `pthread_mutex_t mutex;`  必须是全局的

    - 初始化互斥锁->`pthread_mutex_lock(&mutex)`

    - 获取锁->`pthread_mutex_lock(&mutex);`

    - 释放锁->`pthread_mutex_unlock(&mutex);`

    - 销毁锁->`pthread_mutex_destroy(&mutex);`

3. 使用案例：
```c
// TODO  C++ 互斥锁 == Java版本（synchronize） 多线程操作的安全  持有内置锁
#include <iostream>
#include <pthread.h>
#include <queue>
#include <unistd.h> // sleep（秒）

using namespace std;

queue<int> queueData; // 定义一个全局的队列，用于 存储/获取

pthread_mutex_t mutex; // 定义一个互斥锁，注意：（Cygwin平台 此互斥锁，不能有野指针，坑）

// void *(*)(void *)
void * task(void * pVoid) {

    /*synchronize(锁) {
        // code
    }*/

    pthread_mutex_lock(&mutex); // 锁住

    cout << "异步线程-当前线程的标记是:" << *static_cast<int *>(pVoid) << "异步线程" << endl;

    if (!queueData.empty()) { // 有元素
        printf("异步线程-获取队列的数据:%d\n", queueData.front());
        queueData.pop(); // 把数据弹出去，删除的意思
    } else { // 没有元素
        printf("异步线程-队列中没有数据了\n");
    }

    // sleep(0.2);

    pthread_mutex_unlock(&mutex); // 解锁

    return 0;
}

int main()
{
    // 初始化 互斥锁
    pthread_mutex_init(&mutex, NULL);

    // 给队列 初始化数据 手动增加数据进去
    for (int i = 10001; i < 10011; ++i) {
        queueData.push(i);
    }

    // 一次性定义10个线程
    pthread_t pthreadIDArray[10];
    for (int i = 0; i < 10; ++i) {
        pthread_create(&pthreadIDArray[i], 0, task, &i);

        // 不能使用 join，如果使用（就变成顺序的方式，就没有多线程的意义了，所以不能写join）
        // pthread_join(pthreadIDArray[i], 0);
    }

    // main函数等 异步线程
    sleep(12);

    // 销毁 互斥锁
    pthread_mutex_destroy(&mutex);
    cout << "main函数即将弹栈..." << endl;

    // 每次运行 效果都不同：1，8，9，10，3，2，5，8
    // 每次运行 效果都是错乱

    return 0;
}
```

### 条件变量

1. C++ 条件变量(`pthread_cond_t`)+互斥锁(`pthread_mutex_t`) == Java版本的（`notify` 与 `wait` 操作）

2. 条件变量，为了实现 等待 读取 等功能

3. 使用步骤：

    1. 初始化

        - 定义条件变量->`pthread_cond_t cond;`
        - 定义互斥锁-> `pthread_mutex_t mutex;`
        - 初始化条件变量->`pthread_cond_init(&cond, 0);`
        - 初始化互斥锁->`pthread_mutex_init(&mutex, 0);`
    2. add加入队列中

        - 使用锁->`pthread_mutex_lock(&mutex);`
        - 通知条件变量->`pthread_cond_signal(&cond)` 等同Java notify 单个的
        - 或者->`pthread_cond_broadcast(&cond);`等同Java notifyAll 所有的
        - 释放锁->`pthread_mutex_unlock(&mutex);`
    3. get从队列中获取

        - 使用锁->`pthread_mutex_lock(&mutex);`
        - 等待->`pthread_cond_wait(&cond, &mutex);`等同相当于 Java的 wait 等待了[有可能被系统唤醒]
        - 释放锁->`pthread_mutex_unlock(&mutex);`
    4. 回收锁和条件变量

        - 回收锁`pthread_mutex_destroy(&mutex);`
        - 回收条件变量`pthread_cond_destroy(&cond);`
4. 使用案例：
```c
// 生产者 消费者 工具类   播放器 有用

#ifndef CPPCLIONPROJECT_SAFE_QUEUE_TOO_H
#define CPPCLIONPROJECT_SAFE_QUEUE_TOO_H

#endif //CPPCLIONPROJECT_SAFE_QUEUE_TOO_H

#pragma once // 防止重复写 include 的控制

#include <iostream>
#include <string>
#include <pthread.h>
#include <string>
#include <queue>

using namespace std;

// 定义模版函数 int double float == Java的泛型
template<typename T>

class SafeQueueClass {
private:
    queue<T> queue; // 定义队列
    pthread_mutex_t  mutex; // 定义互斥锁（不允许有野指针）
    pthread_cond_t cond; // 条件变量，为了实现 等待 读取 等功能 （不允许有野指针）

public:
    SafeQueueClass() {
        // 初始化 互斥锁
        pthread_mutex_init(&mutex, 0);

        // 初始化 条件变量
        pthread_cond_init(&cond, 0);
    }
    ~SafeQueueClass() {
        // 回收 互斥锁
        pthread_mutex_destroy(&mutex);

        // 回收 条件变量
        pthread_cond_destroy(&cond);
    }

    // TODO 加入到队列中（进行生成）
    void add(T t) {
        // 为了安全 加锁
        pthread_mutex_lock(&mutex);

        queue.push(t); // 把数据加入到队列中

        // 告诉消费者，我已经生产好了
        // pthread_cond_signal(&cond) // Java notify 单个的
        pthread_cond_broadcast(&cond); // Java notifyAll 所有的的

        cout << "add queue.push 我已经notifyAll所有等待线程了" << endl;

        // 解锁
        pthread_mutex_unlock(&mutex);
    }

    // TODO 从队列中获取（进行消费） 外面的人消费 你可以直接返回，你也可以采用引用
    void get(T & t) {
        // 为了安全 加锁
        pthread_mutex_lock(&mutex);

        while (queue.empty()) {
            cout << "get empty 我已经乖乖等待中.." << endl;
            pthread_cond_wait(&cond, &mutex); // 相当于 Java的 wait 等待了[有可能被系统唤醒]
        }

        // 证明被唤醒了
        t = queue.front(); // 得到 队列中的元素数据 仅此而已
        queue.pop(); // 删除元素

        // 解锁
        pthread_mutex_unlock(&mutex);
    }
};
```

```cpp
// TODO C++ 条件变量+互斥锁 == Java版本的（notify 与 wait 操作）

#pragma once

#include <iostream>

#include "safe_queue_too.h"
using namespace std;
SafeQueueClass<int> sq;

// TODO 模拟演示 消费者
void * getMethod(void *) {
    while (true) {
        printf("getMethod\n");

        int  value;
        sq.get(value);
        printf("消费者get 得到的数据:%d\n", value);

        // 你只要传入 -1 就结束当前循环
        if (-1 == value) {
            printf("消费者get 全部执行完毕\n");
            break;
        }
    }
    return 0;
}

// TODO 模拟演示 生产者
void * setMethod(void *) {
    while (true) {
        printf("setMethod\n");

        int value;
        printf("请输入你要生成的信息:\n");
        cin >> value;

        // 你只要传入 -1 就结束当前循环
        if (-1 == value) {
            sq.add(value); // 为了让消费者 可以结束循环
            printf("消费者get 全部执行完毕\n");
            break;
        }

        sq.add(value);
    }
    return 0;
}

int main() {
    pthread_t pthreadGet;
    pthread_create(&pthreadGet, 0, getMethod, 0);
    // pthread_join(pthreadGet, 0); 不能这样写，否则，下面的代码，可能无法有机会执行

    pthread_t pthreadSet;
    pthread_create(&pthreadSet, 0, setMethod, 0);


    pthread_join(pthreadGet, 0);

    pthread_join(pthreadSet, 0);


    return 0;
}
```

### 智能指针

1. 智能指针自动释放堆区的对象，无需开发者写`delete`
2. 智能指针的类型：`shared_ptr`,`weak_ptr`,`unique_ptr`

#### 智能指针的使用

- `shared_ptr`

```cpp
// TODO 智能指针初探 内部机制原理

// 在真实开发过程中，才能体系智能指针的用途，否则写demo无法体现，为什么？
// 因为真实开发过程中，很很多的代码，可能会导致你忘记写 delete 对象；
// new 对象  我就马上 加入到 智能指针  我就不会忘记了

#include <iostream>
#include <memory> // 智能指针的头文件引入
using namespace std;

class Person {
public:
    ~Person() {
        cout << "Person 析构函数" << endl;
    }
};

int main() {
    std::cout << "C++最后一节课" << std::endl;

    Person * person1 = new Person(); // 堆区开辟
    Person * person2 = new Person(); // 堆区开辟

    // 以前：
    // delete person1; 忘记写了，怎么办，非常严重的问题，没法释放

    // 现在：
    // shared_ptr<Person> sharedPtr1(person1); // 智能指针帮你释放堆区开辟的 --> Person 析构函数

    /*
     *
     *
     *   10000行代码
     *
     *
     *
     */
    // 最后，就忘记给人家 delete person1
    // 如果 加入到 智能指针，我就不用管了

    shared_ptr<Person> sharedPtr1(person1); // 栈区开辟sharedPtr1， 加1 等于1 引用计数
    shared_ptr<Person> sharedPtr2(person2); // 栈区开辟sharedPtr2  加1 等于1 引用计数

    return 0;
}
// main函数弹栈，会释放 所有的栈成员 sharedPtr1 调用 sharedPtr1析构函数 减1 等于0  直接释放person1
// main函数弹栈，会释放 所有的栈成员 sharedPtr2 调用 sharedPtr2析构函数 减1 等于0  直接释放person2
```

- `shared_ptr`相互依赖的问题

- 解决相互依赖的问题，使用`weak_ptr` 智能指针

```cpp
// TODO 智能指针 使用频率高不高  1  2
// 智能指针 有循环依赖的问题，你要用就用好，不要用的复杂，循环依赖的问题
// TODO 智能指针 循环依赖问题，故意制作

#include <iostream>
#include <memory> // 智能指针的头文件引入
using namespace std;

class Person2; // 先声明 Person2 让我们的Person1 直接找到

class Person1 {
public:
    shared_ptr<Person2> person2; // Person2智能指针  shared_ptr 引用计数+1
    ~Person1() {
        cout << "Person1 析构函数" << endl;
    }
};

class Person2 {
public:
    shared_ptr<Person1> person1;  // Person1智能指针  shared_ptr 引用计数+1
    ~Person2() {
        cout << "Person2 析构函数" << endl;
    }
};


int main() {
    Person1 * person1 = new Person1(); // 堆区开辟
    Person2 * person2 = new Person2(); // 堆区开辟

    shared_ptr<Person1> sharedPtr1(person1); // +1 = 1
    shared_ptr<Person2> sharedPtr2(person2); // +1 = 1

    cout << "前 sharedPtr1的引用计数是:" << sharedPtr1.use_count() << endl;
    cout << "前 sharedPtr2的引用计数是:" << sharedPtr2.use_count() << endl;

    // 给Person2智能指针赋值
    person1->person2 = sharedPtr2;
    // 给Person1智能指针赋值
    person2->person1 = sharedPtr1;

    cout << "后 sharedPtr1的引用计数是:" << sharedPtr1.use_count() << endl;
    cout << "后 sharedPtr2的引用计数是:" << sharedPtr2.use_count() << endl;

    return 0;
} // 减1 = 0 释放对象
```

* `weak_ptr`的使用
```cpp
// TODO 智能指针 解决循环依赖的问题  weak 智能指针 没有引用计数

// C++ 11后 推出智能指针，为什么要推出？  JVM非常厉害，完全不用管对象的回收的问题

#include <iostream>
#include <memory> // 智能指针的头文件引入
using namespace std;

class Person2; // 先声明 Person2 让我们的Person1 直接找到

class Person1 {
public:
    weak_ptr<Person2> person2; // Person2智能指针  没有引用计数 无法+1
    ~Person1() {
        cout << "Person1 析构函数" << endl;
    }
};

class Person2 {
public:
    weak_ptr<Person1> person1;  // Person1智能指针  没有引用计数 无法+1
    ~Person2() {
        cout << "Person2 析构函数" << endl;
    }
};


int main() {
    Person1 * person1 = new Person1(); // 堆区开辟
    Person2 * person2 = new Person2(); // 堆区开辟

    shared_ptr<Person1> sharedPtr1(person1); // +1 = 1
    shared_ptr<Person2> sharedPtr2(person2); // +1 = 1

    cout << "前 sharedPtr1的引用计数是:" << sharedPtr1.use_count() << endl;
    cout << "前 sharedPtr2的引用计数是:" << sharedPtr2.use_count() << endl;

    // 给Person2智能指针赋值
    person1->person2 = sharedPtr2;
    // 给Person1智能指针赋值
    person2->person1 = sharedPtr1;

    cout << "后 sharedPtr1的引用计数是:" << sharedPtr1.use_count() << endl;
    cout << "后 sharedPtr2的引用计数是:" << sharedPtr2.use_count() << endl;

    return 0;
} // 减1 = 0 释放对象
```

* `unique`的使用
```cpp
// TODO unique 智能指针  设计的够简单，每一那么多功能  [独占式智能指针]

#include <iostream>
#include <memory> // 智能指针的头文件引入

class Person {};

int main() {
    Person * person1 = new Person();
    Person * person2 = new Person();

    std::unique_ptr<Person> uniquePtr1(person1);

    // 严格禁止
    // std::unique_ptr<Person> uniquePtr2 = uniquePtr1;  unique不允许，因为是独占的

    // shared_ptr 是可以的，会造成隐患问题

    return 0;
}
```

### 手写智能指针

```cpp
// TODO  手写智能指针

#include <iostream>
#include <memory> // 智能指针的头文件引入

using namespace std;

class Person {};

int main() {
    Person * person1 = new Person();
    // Person * person2 = new Person();

    // shared_ptr<Person> sharedPtr0;

    shared_ptr<Person> sharedPtr1(person1); // +1 引用计数

    // 第一种情况 会调用拷贝构造函数
    // shard_ptr智能指针的特性
    // shared_ptr<Person> sharedPtr2 = sharedPtr1;  // +1 再引用计数  不会调用构造函数，只能执行拷贝构造函数

    // 第二种情况 不会调用拷贝构造函数
    shared_ptr<Person> sharedPtr2;  // +1 再引用计数   先构造函数 开辟sharedPtr2对象

    // 给sharedPtr2对象 从新赋值
    sharedPtr2 = sharedPtr1; // 自定义 =号运算符重载


    return 0;
}
// main函数弹栈 sharedPtr1栈成员  ---> 析构函数 --等于0 就释放对象
```

```cpp
#ifndef CPPCLIONPROJECT_CUSTOMPTR_H
#define CPPCLIONPROJECT_CUSTOMPTR_H

#pragma once
#include <iostream>
#include <memory> // 智能指针的
using namespace std;

template<typename T>
class Ptr {
private:
    T * object; // 用于智能指针指向管理的对象  Person Student
    int * count; // 引用计数

public:
    Ptr() {
        count = new int (1); // new 的对象 必须 *指针   【new只是为了后面操作方便】
        object = 0; // 因为你没有给他对象呀，人家也没有对象呀，没办法
    }

    // t = Person Student
    Ptr(T * t) :object(t) {
        // 只有你存入对象，那么引用计数为1，这个是很合理的
        count = new int (1);
    }

    // 析构函数
    ~Ptr() {
        // 引用计数减1，为0标识可以释放object了
        if (--(*count) ==0) {
            if (object) {
                delete object;
            }
            // 归零
            delete count;
            object = 0;
            count = 0;
        }
    }

    // 拷贝构造函数
    Ptr(const Ptr<T> & p) {
        cout << "拷贝构造函数" << endl;

        // sharedPtr1 == p 的引用计数 +1  = 2
        ++(*p.count);

        object = p.object;
        count = p.count; // 最终是不是 p.count==2 给 count==2
    }

    // 自定义 =号运算符重载
    Ptr<T> & operator = (const Ptr<T> & p) {
        cout << "=号运算符重载" << endl;

        ++(*p.count);

        // 这个点非常绕  跳过  看不懂没有关系，后面专门解释 (配合代码)
        if (--(*count) == 0) {
            if (object) {
                delete object;
            }
            delete count;
        }

        object = p.object;
        count = p.count;
        return *this; // 运算符重载的返回
    }

    // 返回引用计数的数值
    int use_count() {
        return *this->count;
    }
};


#endif //CPPCLIONPROJECT_CUSTOMPTR_H
```

### 手写智能指针2

```cpp
// TODO  手写智能指针 2

#include "CustomPtr.h"

class Student {
public:
    ~Student() {
        cout << "析构函数 释放Student" << endl;
    }
};

// TODO 智能指针内置的
void action() {
    Student *student1 = new Student();
    Student *student2 = new Student();

    // TODO 第一种情况
    /*shared_ptr<Student> sharedPtr1(student1);
    shared_ptr<Student> sharedPtr2(student2);*/

    // TODO 第二种情况
    /*shared_ptr<Student> sharedPtr1 (student1);
    shared_ptr<Student> sharedPtr2 = sharedPtr1;*/

    // TODO 通用的打印
    /*cout << "智能指针内置的 sharedPtr1:" << sharedPtr1.use_count() << endl;
    cout << "智能指针内置的 sharedPtr2:" << sharedPtr2.use_count() << endl;*/
}

// TODO  手写的智能指针
void action2() {
    Student *student1 = new Student();
    Student *student2 = new Student();

    // TODO 第一种情况
    /*Ptr<Student> sharedPtr1(student1);
    Ptr<Student> sharedPtr2(student2);*/

    // TODO 第二种情况
    /*Ptr<Student> sharedPtr1 (student1);
    Ptr<Student> sharedPtr2 = sharedPtr1;*/

    // TODO 第二种情况
    // TODO 情况一
    /*Ptr<Student> sharedPtr1 (student1); // sharedPtr1构建对象
    Ptr<Student> sharedPtr2; // sharedPtr2也会构建对象， 此对象指向了object 与 count，必须释放

    // 在你写下面这个之前，我必须是发 sharedPtr2 的所有 object count 全部释放
    // sharedPtr2完全释放干净后，我才放心然你赋值 sharedPtr2 = sharedPtr1
    sharedPtr2 = sharedPtr1;*/


    // TODO 情况二
    Ptr<Student> sharedPtr1 (student1); // sharedPtr1构建对象
    // student2 成为野对象（每一被智能指针管理的对象 称为 野对象）
    Ptr<Student> sharedPtr2 (student2);

    // 在你写下面这个之前，我必须是发 sharedPtr2 的 的 student2 全部释放成功
    // sharedPtr2完全释放干净后,才放心然你赋值 sharedPtr2 = sharedPtr1

    sharedPtr2 = sharedPtr1;

    // delete student2; // 如果--哪些逻辑不写，就必须手动是否 student2

    // TODO 通用的打印
    cout << "手写的智能指针 sharedPtr1:" << sharedPtr1.use_count() << endl;
    cout << "手写的智能指针 sharedPtr2:" << sharedPtr2.use_count() << endl;
}


int main() {
    cout << "下面是 C++内置智能指针 ===========" << endl;
    // action();
    cout << endl;

    cout << "下面是 自定义的智能指针 ===========" << endl;
    action2();
}
```

### 类型转换

#### const_cast

```cpp
// 3.四种类型转换。 const_cast     const修饰的 都可以去转换

#include <iostream>

using namespace std;

class Person {
public:
    string name = "default";
};

int main() {
    const Person * p1 = new Person();
    // p1->name = "Derry"; // 报错：常量指针，不写修改值

    Person * p2 = const_cast<Person *>(p1); // 转成 非常量指针
    p2->name = "Derry";

    cout << p1->name << endl; // Derry

    return 0;
}
```

#### static_cast

```cpp
// 3.四种类型转换。 static_cast   指针相关的操作 可以用 static_cast

#include <iostream>
using namespace std;

class FuClass {
public:
    void show() {
        cout << "fu show" << endl;
    }
};

class ZiClass  : public FuClass {
public:
    void show() {
        cout << "zi show" << endl;
    }
};

int main() {
    int n = 88;
    void * pVoid = &n;
    int * number = static_cast<int *>(pVoid);
    cout << *number << endl;

    // ====================

    FuClass * fuClass = new FuClass;
    // fuClass->show();

    // static_cast(编译期) 看左边 ZiClass *
    ZiClass * ziClass = static_cast<ZiClass *>(fuClass);
    ziClass->show();

    delete fuClass; // 回收规则：一定是谁new了，我就delete谁

    return 0;
}
```

#### dynamic_cast

```cpp
// 3.四种类型转换。 dynamic 字符类多态 运行期 转换

#include <iostream>
using namespace std;

class FuClass {
public:
    // 动态转换必须让父类成为虚函数
    virtual void show() {
        cout << "fu show" << endl;
    }
};

class ZiClass  : public FuClass {
public:
    void show() {
        cout << "zi show" << endl;
    }
};

int main() {
    // 动态类型转换的时候，在运行期 由于fuClass 是new 父类的，已成定局，就不能转换子类
    // FuClass * fuClass = new FuClass(); // 失败

    FuClass * fuClass = new ZiClass; // 已成定局 是子类
    ZiClass * ziClass = dynamic_cast<ZiClass *>(fuClass);

    // TODO 子类转父类不行的，同学们自己去试一试

    // 动态转换是有返回值， null 转换失败
    if (ziClass) { // ziClass != null
        cout << "恭喜，转换成功 " ;
        ziClass->show();
    } else {
        cout << "不恭喜 转换失败" << endl ;
    }



    return 0;
}
```
#### reinterpret_cast

```cpp
// 3.四种类型转换。 reinterpret_cast 强制转换 比 static_cast要强大， static_cast能够做的事情，
// reinterpret_cast强制转换都可以，同时并且附加 新功能

#pragma once
#include <iostream>
#include <iostream>
#include <iostream>
#include <iostream>
#include <iostream>
#include <iostream>

using namespace std;

class DerryPlayer {
public:
    void show() {
        cout << "DerryPlayer" << endl;
    }
};

int main() {
    DerryPlayer * derryPlayer = new DerryPlayer();
    long playerValue = reinterpret_cast<long>(derryPlayer); // 把对象变成数值

    // 通过数值 变成对象
    DerryPlayer * derryPlayer2 = reinterpret_cast<DerryPlayer *>(playerValue);
    derryPlayer2->show();

    printf("derryPlayer:%p\n", derryPlayer);
    printf("derryPlayer2:%p\n", derryPlayer2);

    // 前面的只是：为什么不一样：因为指针存放地址，同时指针有自己的地址，而你打印了自己的的地址，能一样？
    printf("derryPlayer:%p\n", &derryPlayer);
    printf("derryPlayer2:%p\n", &derryPlayer2);

}
```

#### nullptr

```cpp
#include <iostream>
using namespace std;

void show(int * i) {
    cout << " show(int * i) " << endl;
}

void show(int  i) {
    cout << " show(int  i) " << endl;
}

int main() {
    show(9);

    show(nullptr); // C++11 后的特性： 原本本意代替NULL，除了代替NULL，还有此功能

    return 0;
}
```

### 预处理器

#### `#if` `#elif` `#endif`

```cpp
// TODO 预处理器不是编译器，预处理器主要完成文本替换的操作（文本替换，以后专门在Linux中去讲），预处理器都是用 #xxx 的写法，并不是注释哦

/*
                                #include  导入头文件
                                #if       if判断操作  【if的范畴 必须endif】
                                #elif     else if
                                #else     else
                                #endif    结束if
          #define   定义一个宏
          #ifdef    如果定义了这个宏 【if的范畴 必须endif】
          #ifndef   如果没有定义这个宏 【if的范畴 必须endif】
          #undef    取消宏定义
          #pragma   设定编译器的状态
 */

#include <iostream>
using namespace std;

int main() {
    // std::cout << "宏" << std::endl;

#if 1 // if
    cout <<  "真" << endl;

#elif 0 // else if
    cout <<  "假" << endl;

#else
    cout << "都不满足" << endl;

#endif // 结束if
    cout << "结束if" << endl;

    return 0;
}
```

`#ifndef` `#define`

```cpp
#ifndef CLIONCPPPROJECT_T2_H // 如果没有定义这个宏  解决循环拷贝的问题
#define CLIONCPPPROJECT_T2_H // 我就定义这个宏

// 100 行代码
// 第一次能够进来
// 第二次  第n此进不来    直接 解决循环拷贝的问题了

// ---------------
#ifndef isRelease // 如果没有isRelease这个宏
#define isRelease 1 // 是否是正式环境下 【我就定义isRelease这个宏】

#if isRelease == true
#define RELEASE // 正式环境下 定义RELEASE宏

#elif isRelease == false
#define DEBUG // 测试环境下  定义DEBUG宏

#endif // 结束里面的if
#endif // 结束里面的if

#endif //CLIONCPPPROJECT_T2_H // 结束外面的if
```

```cpp
#include <iostream>
#include "T2.h"
using namespace std;

int main() {

    // if 条件判断
    // ifdef xxx 是否定义了xxx这个宏

#ifdef DEBUG // 是否定义了DEBUG这个宏
    cout << "在测试环境下，迭代功能" << endl;
    // 省略 500行 ...

#else RELEASE
    cout << "在正式环境下，功能上下中" << endl;
    // 省略 500行 ...

#endif // 结束IF

}
```

`#undef`

```cpp
// 宏的取消 #undef 宏

#include <iostream>
using namespace std;

int main() {
    int i = 1

#ifndef DERRY // 如果没有定义这个宏
#define DERRY // 我就定义宏
#ifdef DERRY // 是否定义了这个宏
    for (int i = 0; i < 6; ++i) {
        cout << "Derry 1" << endl;
    }
    // 省略 500行 ...

#ifdef DERRY // 是否定义了这个宏
    for (int i = 0; i < 6; ++i) {
        cout << "Derry 2" << endl;
    }
    // 省略 500行 ...

#undef DERRY // 取消宏的定义，下面的代码，就没法用这个宏了，相当于：没有定义过DERRY宏

#ifdef DERRY
    cout << "你定义了Derry宏" << endl;
#else
    cout << "你没有定义了Derry宏" << endl;

#endif
#endif
#endif
#endif

    return 0;
}
```

### 编辑过程

* 预处理(宏展开，宏替换)->预编译，检查代码->汇编阶段->链接阶段(.a, .so)->生成.exe

### 宏变量

```cpp
// 宏函数 真实开发中：宏函数都是大写
#include <iostream>
using namespace std;

#define SHOW(V) cout << V << endl; // 参数列表 无需类型  返回值 看不到
#define ADD(n1, n2) n1 + n2
#define CHE(n1, n2) n1 * n2 // 故意制作问题 ，宏函数的注意事项

// 复杂的宏函数
#define LOGIN(V) if(V==1) {                         \
    cout << "满足 你个货输入的是:" << V << endl;        \
} else {                                             \
    cout << "不满足 你个货输入的是:" << V << endl;       \
} // 这个是结尾，不需要加 \

void show() {}

int main() {
    SHOW(8);
    SHOW(8.8f);
    SHOW(8.99);

    int r = ADD(1, 2);
    cout << r << endl;

    r = ADD(1+1, 2+2);
    cout << r << endl;

    // r = CHE(1+1, 2+2);
    r = 1+1 * 2+2; // 文本替换：1+1 * 2+2  先算乘法  最终等于 5
    cout << r << endl; // 我们认为的是8，   但是打印5

    LOGIN(0);
    LOGIN(0);
    LOGIN(0);
    LOGIN(0);
    LOGIN(0);
    LOGIN(0);
    // 会导致代码体积增大

    show();
    show();
    show();
    show();
    show();
    // 普通函数，每次都会进栈 弹栈 ，不会导致代码体积增大

    return 0;
}

// 宏函数
/*
 * 优点：
 *   1.文本替换，不会造成函数的调用开销(开辟栈空间，形参压栈，函数弹栈释放 ..)
 *
 * 缺点：
 *   1.会导致代码体积增大
 *
 */
```

### C++异常

* c++异常必须是根据类型来抛出异常

```cpp
#include <iostream>
#include <string>
using namespace std;

void exceptionMethod01() {
    throw "我报废了"; // const char *
}

class Student {
public:
    char * getInfo() {
        return "自定义";
    }
};

void exceptionMethod02() {
    Student student;
    throw student;
}

int main() {
    try {
        exceptionMethod01();
    } catch ( const char * & msg) {
        cout << "捕获到异常1：" << msg << endl;
    }

    try {
        exceptionMethod02();
    } catch (Student & msg) {
        cout << "捕获到异常2：" << msg.getInfo() << endl;
    }
    return 0;
}

```