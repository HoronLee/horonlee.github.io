---
title: 关于Echo框架路由匹配与中间件的坑
date: 2025-12-25 23:32:32
tags:
  - Go
  - Echo
categories:
  - 编程笔记
cover:
dg-publish: false
---
## 问题描述

在基于 Echo 框架的 Web 应用中，当访问一个不存在的路由时，返回的是 `{"code": 401, "msg": "Token not found"}` 而不是预期的 `404 Not Found`。

  ## 问题背景

项目采用了公开路由（Public）和私有路由（Private）分组的架构：

```go
func setupV1RouterGroup(e *echo.Echo) *VersionedRouterGroup {
    apiGroup := e.Group("/api")
    v1Group := apiGroup.Group("/v1")

    public := v1Group.Group("")
    private := v1Group.Group("")
    private.Use(middleware.JwtAuth()) // JWT认证中间件

    return &VersionedRouterGroup{
        PublicRouter:  public,
        PrivateRouter: private,
    }
}
```

两个路由组共享相同的前缀 `/api/v1`，其中 `private` 组应用了 JWT 认证中间件。

## 问题分析

### 根本原因

Echo 框架的路由匹配机制导致了这个问题：

1. 当 `public` 和 `private` 两个路由组注册在同一前缀下时，Echo 内部会创建一个通配符路由 `/api/v1/*` 来处理该前缀下的所有请求
2. 访问不存在的路由（如 `/api/v1/notexist`）时，请求会被通配符路由捕获
3. 由于 `private` 组的 JWT 中间件也注册在这个前缀下，请求会先经过 JWT 中间件
4. JWT 中间件检测到没有 Token，直接返回 401，而不是让框架返回 404

### 调试验证

通过在 JWT 中间件中添加调试日志：

```go
fmt.Printf("DEBUG - Path: %q, RequestURI: %s\n", ctx.Path(), ctx.Request().RequestURI)
```

访问 `/api/v1/helloworld1`（不存在的路由）时，输出：

```
DEBUG - Path: "/api/v1/*", RequestURI: /api/v1/helloworld1
```

这证实了 Echo 将不存在的路由匹配到了通配符路由 `/api/v1/*`。

## 解决方案

### 最终方案：在 JWT 中间件中检测通配符路由

在 JWT 中间件中检查 `ctx.Path()` 是否以 `/*` 结尾，如果是则跳过认证：

```go
func JwtAuth() echo.MiddlewareFunc {
    return func(next echo.HandlerFunc) echo.HandlerFunc {
        return func(ctx echo.Context) error {
            // 如果匹配到通配符路由（如 /api/v1/*），说明没有具体路由匹配
            // 跳过认证，让框架返回 404
            path := ctx.Path()
            if path == "" || strings.HasSuffix(path, "/*") {
                return next(ctx)
            }

            // ... JWT 认证逻辑
        }
    }
}
```

### 其他尝试过的方案

#### 方案一：使用不同的路由前缀（不推荐）

将私有路由放到独立前缀下：

```go
private := v1Group.Group("/protected")
```

缺点：改变了 API URL 结构，如 `DELETE /api/v1/user` 变成 `DELETE /api/v1/protected/user`。

#### 方案二：在路由级别单独应用中间件（不推荐）

```go
routerGroup.PrivateRouter.DELETE("/user", h.UserHandler.DeleteUser(), middleware.JwtAuth())
```

缺点：需要在每个私有路由上手动添加中间件，容易遗漏。

#### 方案三：检查 `ctx.Path() == ""`（无效）

根据网上文章建议，检查 `ctx.Path()` 是否为空来判断路由是否存在。

结果：无效。Echo 在这种情况下返回的是通配符路径 `/api/v1/*`，而不是空字符串。

## 关键知识点

### Echo 中间件类型

1. **Pre 中间件**：在路由匹配前执行，使用 `e.Pre()` 注册
2. **普通中间件**：在路由匹配后执行，使用 `e.Use()` 或 `group.Use()` 注册

### `ctx.Path()` 的行为

- 返回匹配到的路由模板路径，而非实际请求路径
- 对于不存在的路由，可能返回通配符路径（如 `/api/v1/*`）而非空字符串
- 具体行为取决于路由注册方式和 Echo 版本

### 最佳实践

1. 中间件应返回 `echo.NewHTTPError()` 而非直接 `ctx.JSON()`，以便统一错误处理
2. 认证中间件应考虑路由不存在的情况，避免泄露不必要的信息
3. 使用 `CustomHTTPErrorHandler` 统一处理所有 HTTP 错误

## 修改文件清单

1. `internal/middleware/auth.go` - 添加通配符路由检测逻辑
2. `internal/router/router.go` - 路由组配置（保持原有结构）
3. `internal/router/user.go` - 用户路由配置

## 参考资料

- [Echo 框架官方文档 - 中间件](https://echo.labstack.com/middleware)
- [Echo 框架路由匹配机制](https://echo.labstack.com/guide/routing)
