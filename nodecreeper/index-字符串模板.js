const ejs = require('ejs')
const fs = require('fs')

// 异步读取文件内容
fs.readFile('./template.html','utf8',(err,data)=>{
  if(err) throw err
  // 生成模板渲染函数
  const template = ejs.compile(data)

  // 调用渲染函数，注入替换参数
  const result = template({
    message:'world'
  })

  console.log(result)
})


