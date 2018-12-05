# vue-cli3多页面应用配置

* 新建`vue.config.js`文件，使用其自带配置项`pages`，具体查看[vue.config配置](https://cli.vuejs.org/zh/config/#pages).

```javascript
    pages: {
        page1: {
          // page 的入口
          entry: "src/pages/page1/main.js",
          // 模板来源
          template: "public/page1.html",
          // 在 dist/index.html 的输出
          filename: "page1/index.html",
          // 当使用 title 选项时，
          // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
          title: "page1"
        },
        page2: {
          // page 的入口
          entry: "src/pages/page2/main.js",
          // 模板来源
          template: "public/page2.html",
          // 在 dist/index.html 的输出
          filename: "page2/index.html",
          // 当使用 title 选项时，
          // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
          title: "page2 title"
       }
    } 
```
* 需要注意的是`filename`的值对应项目访问URL，如代码中例子，在本地启动的时候，可能你需要 `localhost:8080/page1#/`来进行访问
* 每一个`page`页里的`vuex`都是独立的，例如`page1`中你添加的状态管理`vuex`，此时`page1`中的`vuex`数据能直接与`page2`或者`page3`通信
* 实现多页面应用中不同页面的数据通讯，请使用传统的`storage`,`queryString`,不建议使用`cookie`

# vuecli3-mutli-pages

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
