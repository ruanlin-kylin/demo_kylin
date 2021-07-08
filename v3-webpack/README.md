## 前端说明文档

本模板采用的是，vue3 + webpack 的结构模式。建议 v3 开发，使用全新的 composition API 的方式。

注意：V3 已经官宣不支持 IE，只支持现代浏览器，新项目开发请慎用。

## 已使用的技术

- [vue3](https://v3.cn.vuejs.org/community/partners.html)
- [axios（ajax 请求）](https://www.kancloud.cn/yunye/axios/234845)
- [antd（蚂蚁金服 vue 组件库）](https://2x.antdv.com/components/dropdown-cn/)
- [xe-utils 函数库](https://x-extends.github.io/xe-utils/#/)

## 本项目 git Commit message 统一规范(优雅的提交 Commit 信息)

使用[Angular 团队提交规范](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines)

主要有以下组成

- 标题行: 必填, 描述主要修改类型和内容
- 主题内容: 描述为什么修改, 做了什么样的修改, 以及开发的思路等等
- 页脚注释: 放 Breaking Changes 或 Closed Issues

常用的修改项

- type: commit 的类型
- feat: 新特性
- fix: 修改问题
- refactor: 重构（即不是新增功能，也不是修改 bug 的代码变动）
- docs: 文档修改
- style: 格式（不影响代码运行的变动）
- test: 测试用例修改
- chore: 构建过程或辅助工具的变动
- scope: commit 影响的范围, 比如: route, component, utils, build...
- subject: commit 的概述
- body: commit 具体修改内容, 可以分为多行
- footer: 一些备注, 通常是 BREAKING CHANGE 或修复的 bug 的链接.

### 使用`Commitizen`代替 git commit

可以使用[cz-cli](https://github.com/commitizen/cz-cli)工具代替 `git commit`

本工程已安装

使用 `git cz` 代替 `git commit`就可以了

**[⬆ 返回顶部](#前端说明文档)**
