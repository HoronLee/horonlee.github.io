---
title: Java学习-String
businesscard: true
date: 2022-11-10 19:28:15
updated:
tags:
    - Java
categories: 
    - 编程笔记
keywords:
description: 学习笔记
top_img:
comments:
cover: https://tse2-mm.cn.bing.net/th/id/OIP-C.pxF-tUepOPC8xJ0qz1mkzQHaD2?pid=ImgDet&rs=1
toc:
toc_number:
toc_style_simple:
copyright:
copyright_author:
copyright_author_href:
copyright_url:
copyright_info:
mathjax:
katex:
aplayer:
highlight_shrink:
aside:
swiper_index: 
---
# String类
## 比较两个字符串的两种方法
- 直接使用“==”进行运算,这样是比较两个字符串对象在内存中的位置,而不是实际上看到的内容。
- 使用String类中的equals()方法进行比较,就是比较实际上我们看到的字面内容了。
### 避免NullPointerException的比较操作。
> 实际上在要求用户输入某一个字符串后续要与一个现有字符串进行比较,但是用户不输入消息的时候处理不当就会报`NullPointerException`错,假设输入就是null,代码如下:
```java
public class test {
    public static void main(String args[]) {
        String input = null;
        if (input.equals("hello")) {
            System.out.println("Hello World!!!");
        }
    }
}
```
直接运行会报以下错误:
```java
Exception in thread "main" java.lang.NullPointerException: Cannot invoke "String.equals(Object)" because "input" is null
        at top.horon.string.test.main(test.java:6)
```
如何回避这个NullPointerException问题呢?
```java
public class test {
    public static void main(String args[]) {
        String input = null;
        if ("hello".equals(input)) {
            System.out.println("Hello World!!!");
        }
    }
}
```
此时的程序直接利用了字符串常量来调用了equals()方法,因为字符串常量是一个String类的匿名对象,所以该对象永远不可能是null,所以将不会出现NullPointerException。其中,需要注意的是,在equals()方法中也有检查参数是否为空的代码,可以自己去底层源码里看看。
## 实例化字符串的两个方法
- 直接赋值的方法`String str1 = "hello";`
  - 实际上就是把一个在堆中开辟好的堆内存空间的使用权给str1这个对象,对一对指向的
  - 这种赋值方法有一个好处就是,当一个完全相同的字符串再次被声明时,java不会重新开辟内存空间,而是在将在栈内存中新建的对象指向堆内存中的同一个值,这样就不容易造成内存浪费。
- 使用new关键词来实例化String对象`String str = new String("hello");`
  - 使用这一类方法来实例化String对象时,会开辟两个堆内存空间,一个是String的参数hello,一个是str对象指向的hello字符串,其中,参数hello会暂时存在并且进入垃圾空间等待被jvm回收
***所以说,日后开发中,String对象的实例化永远都采用通过直接复制的方法完成。***
- 技术穿越:String类所采用的设计模式为共享设计模式。在JVM的底层实际上会存在有一个对象池(不一定只保存String对象),当代码之中使用了直接赋值的方式定义了一个String类对象时,会将此字符串对象所使用的匿名对象入池保存,而后如果后续还有其他String类对象也采用了直接赋值的方式,并且设置了同样内容的时候,那么将不会开辟新的堆内存空间,而是使用已有的对象进行引用的分配,从而继续使用。————摘自《Java开发实战经典(第二版)》
## 字符串的内容不可改变
> String类操作中有一个特性,就是字符串内容一旦声明了,就不能被更改,下面用一个实例来“更改”一个字符串。
```java
public class test {
    public static void main(String args[]) {
        String str = "hello";
        str = str + "world!";
        System.out.println("Str = " + str);
    }
}

Java> Str = helloworld!
```
在我们看来,字符串确实改变了,我们通过连接的方式更改了一个现有字符串
但是实际上在堆内存中,`"hello"`有一个内存空间。`"world!"`也会开辟一个,最后java会合成一个`str + "world!"`的内存空间,然后最后将对象str在栈中指向到`str + "world!"`的内存中,完成了所谓的“字符串的改变”。
> 所以在实际开发中,要尽量避免以下代码的出现
```java
public class test {
    public static void main(String args[]) {
        String str1 = "HoronLee";
        for(int i = 0; i < 100; i++){
            str1 += i;
        }
        System.out.println(str1);
    }
}

Java> HoronLee01234567891011121314151617181920212223242526272829303132333435
\3637383940414243444546474849505152535455565758596061626364656667686970
\71727374757677787980818283848586878889 90919293949596979899
```
最后确实时完成了“字符串的连接”,但是实际上这样的代码的执行效率时很低的,字符串指向的内存对象断开和连接了一百多,造成了内存和CPU性能的浪费。我们可以采用 SreingBuffer类[^1]来完成。

[^1]:这个工具类后续会讲到
