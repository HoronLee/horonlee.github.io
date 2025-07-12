---
layout: post
title: Gorm笔记
date: 2024-04-25 16:19:23
tags:
    - Go
categories: 
    - 开发
    - 编程笔记
cover: https://files.codingninjas.in/article_images/gin-getting-started-with-gorm-golang-s-orm-library-1-1672754782.webp
password: 
hide:  
---

# xxxxxxxxxx package main​import "fmt"​func findprimes(number int) bool {    // 质数本身就能被1和本身整除，所以可以直接筛选2~n-1的数字    for i := 2; i < number; i++ {        if number%i == 0 {            return false        }    }    // 筛选出来的也就只要判断是不是大于1就可以，如果是1就False如果不是就True    if number > 1 {        return true    } else {        return false    }}​func main() {    fmt.Println("Prime numbers less than 20:")​    for number := 1; number <= 20; number++ {        if findprimes(number) {            fmt.Printf("%v ", number)        }    }}go

> 暂且当做用于连接并且快速操作数据库的库

## 如何开始

导入所需的库

```go
import (
    "gorm.io/gorm"
	"gorm.io/driver/mysql"	//由于需要连接到mysql，所以使用mysql驱动器
)
```

与数据库建立连接

```go
// dsn是与数据库的连接信息，是必需的，其中vdc指的是连接到的数据库(需要已经存在)
dsn = "root:PaSsWoRd@tcp(127.0.0.1:3306)/test?charset=utf8mb4&parseTime=True&loc=Local"
// 使用mysql的方法来连接到数据库
db , err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
if err != nil {
		panic(err)
}
```

# 如何开始？

GORM 通过将 Go 结构体（Go structs） 映射到数据库表来简化数据库交互。 了解如何在GORM中定义模型，是充分利用GORM全部功能的基础。

```go
type User struct {
  ID           uint           // Standard field for the primary key
  Name         string         // 一个常规字符串字段
  Email        *string        // 一个指向字符串的指针, allowing for null values
  Age          uint8          // 一个未签名的8位整数
  Birthday     *time.Time     // A pointer to time.Time, can be null
  MemberNumber sql.NullString // Uses sql.NullString to handle nullable strings
  ActivatedAt  sql.NullTime   // Uses sql.NullTime for nullable time fields
  CreatedAt    time.Time      // 创建时间（由GORM自动管理）
  UpdatedAt    time.Time      // 最后一次更新时间（由GORM自动管理）
}
```

> 最好遵守以下规范

1. **主键**：GORM 使用一个名为`ID` 的字段作为每个模型的默认主键。
2. **表名**：默认情况下，GORM 将结构体名称转换为 `snake_case` 并为表名加上复数形式。 例如，一个 `User` 结构体在数据库中的表名变为 `users` 。
3. **列名**：GORM 自动将结构体字段名称转换为 `snake_case` 作为数据库中的列名。
4. **时间戳字段**：GORM使用字段 `CreatedAt` 和 `UpdatedAt` 来自动跟踪记录的创建和更新时间。

## 浅尝建表

首先定义一个结构体作为一张表的字段来源

```go
type Product struct {
	gorm.Model	// 这个的含义请看gorm.Model一节
	Code  string
	Price uint
}
```

我们已经有了表的对象，接下来同步一下数据表`db.AutoMigrate(&Product{})`，这个操作会将`Product`的所有成员变量都设定为mysql当前数据表中的字段，并且表名会变为结构体的小写并且成为复数，也就是`products`，但是目前里面是没有任何记录值的。

## 添加记录

你可以以如下代码来添加一条记录，值得注意的是，你传入的必需是一个结构体的指针！

```go
db.Create(&Product{Code: "D42", Price: 100})
```

当然你也可以在外部先实例化一个结构体对象`myProdect := Product{Code: "D42", Price: 100}`，然后再这里使用`&myProdect`来添加记录。

## 删除记录

首先需要实例化一个结构体对象用来承担你所要删除记录的数据，有点类似传统数据库操作里的游标。

`var Product`⚠️此对象的结构体必须是你要操作的表所对应的

```go
db.Delete(&product, 1)
```

这里的1指的就是主键序号，参考gorm.Model这一节即可明白其含义

这段代码就是删除了gorm规定的序号为1的记录

## 更改记录

同样基于上面的结构体对象。使用`db.Model(&product).Updates()`来更新

```go
db.Model(&product).Updates(Product{Price: 200, Code: "F42"}) // 仅更新非零值字段
db.Model(&product).Updates(map[string]interface{}{"Price": 200, "Code": "F42"})
```

## 查询记录

以下是两种简单的查找方式

```go
db.First(&product, 1) // 根据整型主键查找
db.First(&product, "code = ?", "D42") // 查找 code 字段值为 D42 的记录
```

查找的结果自然是存在了变量product 中，这里也需要强调，因为Go语言主打值拷贝传递，所以这里仍旧需要传递变量的指针！

---

## gorm.Model

GORM提供了一个预定义的结构体，名为`gorm.Model`，其中包含常用字段：

```go
// gorm.Model 的定义
type Model struct {
  ID        uint           `gorm:"primaryKey"`
  CreatedAt time.Time
  UpdatedAt time.Time
  DeletedAt gorm.DeletedAt `gorm:"index"`
}
```

- **将其嵌入在您的结构体中**: 您可以直接在您的结构体中嵌入 `gorm.Model` ，以便自动包含这些字段。 这对于在不同模型之间保持一致性并利用GORM内置的约定非常有用，请参考[嵌入结构](https://gorm.io/zh_CN/docs/models.html#embedded_struct)。
- **包含的字段**：
  - `ID` ：每个记录的唯一标识符（主键）。
  - `CreatedAt` ：在创建记录时自动设置为当前时间。
  - `UpdatedAt`：每当记录更新时，自动更新为当前时间。
  - `DeletedAt`：用于软删除（将记录标记为已删除，而实际上并未从数据库中删除）。

## 嵌入结构体

对于匿名字段，GORM 会将其字段包含在父结构体中，例如：

```go
type User struct {
  gorm.Model
  Name string
}
// 等效于
type User struct {
  ID        uint           `gorm:"primaryKey"`
  CreatedAt time.Time
  UpdatedAt time.Time
  DeletedAt gorm.DeletedAt `gorm:"index"`
  Name string
}
```

对于正常的结构体字段，你也可以通过标签 `embedded` 将其嵌入，例如：

```go
type Author struct {
    Name  string
    Email string
}

type Blog struct {
  ID      int
  Author  Author `gorm:"embedded"`
  Upvotes int32
}
// 等效于
type Blog struct {
  ID    int64
  Name  string
  Email string
  Upvotes  int32
}
```

并且，您可以使用标签 `embeddedPrefix` 来为 db 中的字段名添加前缀，例如：

```go
type Blog struct {
  ID      int
  Author  Author `gorm:"embedded;embeddedPrefix:author_"`
  Upvotes int32
}
// 等效于
type Blog struct {
  ID          int64
  AuthorName string
  AuthorEmail string
  Upvotes     int32
}
```
