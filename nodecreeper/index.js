const express = require('express');
const app = express();
app.set('view engine','html');
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/views');   

app.get('/',(req,res)=>{
   res.render('template',{
      'message':'你的优乐美，你是我的OK绷'
   })
})

app.listen(5000,()=>console.log('Serve running'))