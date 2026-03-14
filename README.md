> 特别说明：源码、JDK、数据库、Redis等安装或存放路径禁止包含中文、空格、特殊字符等

## 一 环境要求

### 1.1 开发环境

- 操作系统：`Windows 10/11`，`MacOS`；
- `Node 20.15.0` 及以上版本(某些情况下可能需要安装 `Python3` 环境)；
- `pnpm v9.12.0`及以上版本；
- `Visual Studio Code` (简称 VSCode)

### 1.2 运行环境

`Nginx` 建议使用 `1.18.0` 及以上版本、兼容 `OpenResty` 或 `TongHttpServer` 6.0(国产信创)

## 二 浏览器支持

> 支持现代浏览器，不支持 IE

| IE          | Edge            | Firefox         | Chrome          | Safari          |
| ----------- | --------------- | --------------- | --------------- | --------------- |
| not support | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## 三 关联项目

> 需要使用下表中的对应分支

| 项目                     | 分支          | 说明                   |
| ------------------------ | ------------- | ---------------------- |
| jnpf-web-apps-main |  v6.1.x-stable | 前端主项目源码，不同销售版本交付有所差异，以实际交付为准 |
| jnpf-web-apps-main-npm |  v6.1.x-stable | 前端主项目源码(集成流程设计器、Univer报表设计器npm包)，不同销售版本交付有所差异，以实际交付为准 |
| jnpf-bpmn | v1.1.x-stable | 前端流程设计器源代码 |
| jnpf-univer | v1.0.x-stable | 前端Univer报表设计器源代码 |

## 四 使用说明
> 此项目为前端核心项目，需要与关联项目配套使用，需按如下步骤操作，否则项目无法运行

### 4.1拉取项目

分别拉取如下项目源码(注意对应版本号)：
- jnpf-bpmn：前端流程设计器源代码(非专业版)
- jnpf-univer：前端Univer报表设计器源代码(非专业版)
- jnpf-web-monorepo-framework：前端核心项目源码(非专业版)
- jnpf-web-apps-main：前端主项目源码(非专业版)
- jnpf-web-apps-main-npm：前端主项目源码(集成流程设计器、Univer报表设计器npm包)

### 4.2 复制项目

#### 4.2.1 专业版用户
> 含License授权用户

- 将 `jnpf-web-apps-main-npm` 项目重命名为 `jnpf-web-apps-main` 后复制至 `jnpf-web-monorepo-framework` 项目的 `apps/` 目录下

最终核心结构如下：
> 注意：下述结构中，涉及的文件夹目录不可修改

```txt
├── jnpf-web-monorepo-framework 
│   ├── apps
│   ├──   ├── jnpf-web-apps-main  注意：此处文件夹名称不可修改
```

#### 4.2.2 非专业版用户

- 将 `jnpf-bpmn` 项目复制至 `jnpf-web-monorepo-framework` 项目的 `packages/jnpf/plugins/` 目录下
- 将 `jnpf-univer` 项目复制至 `jnpf-web-monorepo-framework` 项目的 `packages/jnpf/plugins/` 目录下
- 将 `jnpf-web-apps-main` 项目复制至 `jnpf-web-monorepo-framework` 项目的 `apps/` 目录下

最终核心结构如下：
> 注意：下述结构中，涉及的文件夹目录不可修改

```txt
├── jnpf-web-monorepo-framework 
│   ├── apps
│   ├──   ├── jnpf-web-apps-main  注意：此处文件夹名称不可修改
│   ├── packages
│   ├──   ├── jnpf
│   ├──   ├──   ├── plugins
│   ├──   ├──   ├──   ├── jnpf-bpmn 注意：此处文件夹名称不可修改
│   ├──   ├──   ├──   ├── jnpf-univer 注意：此处文件夹名称不可修改
```

## 五 其他

其他请参考关联项目根目录下的 `READE.md` 文件说明