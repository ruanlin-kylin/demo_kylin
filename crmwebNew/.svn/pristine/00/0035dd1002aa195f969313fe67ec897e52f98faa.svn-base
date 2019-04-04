   function tableContextHandler(text) {
       if (!text)
           text = "";
       if (text.indexOf("http://") != -1) {
           try {
               var fileList = JSON.parse(text);
               if (fileList && fileList.length > 0) {
                   return tableContextHandlerFile(fileList);
               } else if (fileList.value && fileList.value.length > 0) {
                   var urlList = JSON.parse(fileList.value);
                   return tableContextHandlerFile(urlList);
               }
           } catch (e) {}
       }
       return text;
   }

   function tableContextHandlerFile(fileList) {
       var text = '';
       $.each(fileList, function (i, obj) {
           text += '<a tar href="' + obj.url + '" target="_blank" >' + obj.name + '</a>';
       });
       return text;
   }

   function getUrlParams() {
       var href_url = window.location.href;
       var data = {};
       if (href_url && href_url.split("?").length == 2) {
           pmStr = $.trim(href_url.split("?")[1]);
           var cur_id;
           for (var i = 0; i < pmStr.split("&").length; i++) {
               var str_val = pmStr.split("&")[i];
               if (str_val && str_val.split("=") != -1) {
                   data[str_val.split("=")[0]] = str_val.split("=")[1];
               }
           }
       }
       return data;
   }

   ///解析条件表达式
   function parseCondition(conList, data) {
       return true;
   }