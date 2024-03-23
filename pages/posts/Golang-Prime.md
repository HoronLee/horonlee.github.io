---
title: Golang判断质数
businesscard: true
date: 2023-05-23 16:50:36
updated:
tags:
    - Golang
categories:
    - 编程笔记
keywords:
description:
top_img:
comments:
cover: https://tse2-mm.cn.bing.net/th/id/OIP-C.SHJ4OBNuU-lbftY1hxypvAHaFz?pid=ImgDet&rs=1
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
```go
package main

import "fmt"

func findprimes(number int) bool {
    // 质数本身就能被1和本身整除，所以可以直接筛选2~n-1的数字
	for i := 2; i < number; i++ {
		if number%i == 0 {
			return false
		}
	}
    // 筛选出来的也就只要判断是不是大于1就可以，如果是1就False如果不是就True
	if number > 1 {
		return true
	} else {
		return false
	}
}

func main() {
	fmt.Println("Prime numbers less than 20:")

	for number := 1; number <= 20; number++ {
		if findprimes(number) {
			fmt.Printf("%v ", number)
		}
	}
}
```