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

测试不同路径的 `ctx.Path()` 返回值：

| 请求路径 | `ctx.Path()` | 说明 |
|---------|-------------|------|
| `/api/no-route` | `""` (空) | 不在 v1 组下，无匹配 |
| `/api/v1/notexist` | `/api/v1/*` | 匹配到兜底通配符 |
| `/api/v1/user` | `/api/v1/user` | 匹配到具体路由 |

## 解决方案

### 最终方案：精确匹配兜底通配符

在 JWT 中间件中检查 `ctx.Path()` 是否为兜底通配符路径，如果是则跳过认证：

```go
func JwtAuth() echo.MiddlewareFunc {
    return func(next echo.HandlerFunc) echo.HandlerFunc {
        return func(ctx echo.Context) error {
            // 如果匹配到 /api/v1/* 兜底通配符，说明没有具体路由匹配
            // 跳过认证，让框架返回 404
            // 注意：这里精确匹配，不影响真正的通配符路由（如 /api/v1/files/*）
            path := ctx.Path()
            if path == "" || path == "/api/v1/*" {
                return next(ctx)
            }

            // ... JWT 认证逻辑
        }
    }
}
```

### 为什么用精确匹配而非后缀匹配？

最初尝试使用 `strings.HasSuffix(path, "/*")` 来检测所有通配符路由，但这会影响真正的业务通配符路由（如 `/api/v1/files/*`）。

精确匹配 `/api/v1/*` 的优势：
- 只跳过 Echo 自动生成的兜底通配符
- 不影响业务中真正注册的通配符路由

### 关于通配符路由的影响

| 路由类型 | 示例 | 是否受影响 |
|---------|------|-----------|
| 兜底通配符 | `/api/v1/*` | ✓ 跳过认证，返回 404 |
| 业务通配符 | `/api/v1/files/*` | ✗ 正常认证 |
| 业务通配符 | `/api/v1/static/*` | ✗ 正常认证 |

**结论**：`/api/v1/*` 这种直接挂在版本根路径的通配符在实际业务中几乎不会使用，因为它会匹配所有请求，太宽泛了。业务中的通配符路由一般用于特定资源路径。

## 单元测试

添加了单元测试验证方案的正确性：

```go
// TestJwtAuth_NotFoundRoute 测试访问不存在的路由时返回404而非401
func TestJwtAuth_NotFoundRoute(t *testing.T) {
    // 测试用例：
    // 1. 不存在的路由应返回 404
    // 2. 存在的路由无 token 应返回 401
    // 3. 不在 v1 下的路由应返回 404
}

// TestJwtAuth_WildcardRoute 测试真正的通配符路由仍需认证
func TestJwtAuth_WildcardRoute(t *testing.T) {
    // 测试用例：
    // 1. 通配符路由无 token 应返回 401
    // 2. 通配符路由根路径无 token 应返回 401
}
```

测试文件：`internal/middleware/auth_test.go`

## 其他尝试过的方案

### 方案一：使用不同的路由前缀

```go
private := v1Group.Group("/protected")
```

缺点：改变了 API URL 结构。

### 方案二：在路由级别单独应用中间件

```go
routerGroup.PrivateRouter.DELETE("/user", h.UserHandler.DeleteUser(), middleware.JwtAuth())
```

缺点：需要在每个私有路由上手动添加中间件，容易遗漏。

### 方案三：检查 `ctx.Path() == ""`

根据网上文章建议，检查 `ctx.Path()` 是否为空。

结果：无效。Echo 在这种情况下返回的是通配符路径 `/api/v1/*`，而不是空字符串。

## 注意事项

1. **多版本 API**：如果添加了 `/api/v2` 版本，需要在中间件里也加上 `/api/v2/*` 的判断

2. **中间件错误响应**：建议返回 `echo.NewHTTPError()` 而非直接 `ctx.JSON()`，以便统一错误处理

3. **适用范围**：只有应用在路由组级别的中间件需要这个处理，应用在具体路由上的中间件不需要

## 修改文件清单

1. `internal/middleware/auth.go` - 添加兜底通配符检测逻辑
2. `internal/middleware/auth_test.go` - 添加单元测试
3. `internal/router/router.go` - 路由组配置（保持原有结构）

## 参考资料

- [Echo 框架官方文档 - 中间件](https://echo.labstack.com/middleware)
- [Echo 框架路由匹配机制](https://echo.labstack.com/guide/routing)
