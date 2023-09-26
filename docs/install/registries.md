---
outline: "deep"
---

# Scopes and registries

默认注册表是 `registry.npmjs.org`。可以在 `bunfig.toml` 中进行全局配置：

```toml
[install]
# 将默认注册表设置为字符串
registry = "https://registry.npmjs.org"
# 设置令牌
registry = { url = "https://registry.npmjs.org", token = "123456" }
# 设置用户名/密码
registry = "https://username:password@registry.npmjs.org"
```

要配置私有注册表并将其限定到特定组织：

```toml
[install.scopes]
# 注册表作为字符串
"@myorg1" = "https://username:password@registry.myorg.com/"

# 注册表与用户名/密码
# 您可以引用环境变量
"@myorg2" = { username = "myusername", password = "$NPM_PASS", url = "https://registry.myorg.com/" }

# 注册表与令牌
"@myorg3" = { token = "$npm_token", url = "https://registry.myorg.com/" }
```

### `.npmrc`

Bun 目前不读取 `.npmrc` 文件。对于私有注册表，请按照上述文档将您的注册表配置迁移到 `bunfig.toml`。
