

   /* 封装ajax函数(javascript原生)  方法一
   * @param {string}opt.type http连接的方式，包括POST和GET两种方式
   * @param {string}opt.url 发送请求的url
   * @param {boolean}opt.async 是否为异步请求，true为异步的，false为同步的
   * @param {object}opt.data 发送的参数，格式为对象类型
   * @param {function}opt.success ajax发送并接收成功调用的回调函数
   */
   function ajax(opt){
       opt = opt || {};
       opt.method = opt.method.toUpperCase() || 'POST';
       opt.url = opt.url || '';
       opt.async = opt.async || true;
       opt.data = opt.data || null;
       opt.success = opt.succss || function(){};
       var xmlHttp = null;
       if(XMLHttpRequest){
           xmlHttp = new XMLHttpRequest();
       }else{
           xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
       }
       var params = [];
       for(var key in opt.data){
            params.push(key + '=' + opt.data[key]);
       }
       var postData = params.join('&');
       if (opt.method.toUpperCase() === 'POST') {
           xmlHttp.open(opt.method, opt.url, opt.async);
           xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
           xmlHttp.send(postData);
        }
        else if (opt.method.toUpperCase() === 'GET') {
            xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
            xmlHttp.send(null);
        }
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                opt.success(xmlHttp.responseText);
            }
        };
   }

//    测试调用 方法一
   /*ajax({
      method: 'POST',
      url: 'test.php',
      data: {
          name1: 'value1',
          name2: 'value2'
      },
      success: function (response) {
          console.log(response);
      }
    });*/


   /**
    * 封装ajax函数(javascript原生)  方法二
    * 
    */
   function Ajax(type, url, data, success, failed){
    // 创建ajax对象
    var xhr = null;
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP')
    }
 
    var type = type.toUpperCase();
    // 用于清除缓存
    var random = Math.random();
 
    if(typeof data == 'object'){
        var str = '';
        for(var key in data){
            str += key+'='+data[key]+'&';
        }
        data = str.replace(/&$/, '');
    }
 
    if(type == 'GET'){
        if(data){
            xhr.open('GET', url + '?' + data, true);
        } else {
            xhr.open('GET', url + '?t=' + random, true);
        }
        xhr.send();
 
    } else if(type == 'POST'){
        xhr.open('POST', url, true);
        // 如果需要像 html 表单那样 POST 数据，请使用 setRequestHeader() 来添加 http 头。
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(data);
    }
 
    // 处理返回数据
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            if(xhr.status == 200){
                success(xhr.responseText);
            } else {
                if(failed){
                    failed(xhr.status);
                }
            }
        }
    }
}

    // 测试调用 方法二
    /*var sendData = {name:'asher',sex:'male'};
    Ajax('get', 'data/data.html', sendData, function(data){
        console.log(data);
    }, function(error){
        console.log(error);
    });
    }*/
