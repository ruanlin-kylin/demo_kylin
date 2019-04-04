
var openWindowMarker=false;
var isUserAdmin=false;


function tableContextHandler(text){
    if(!text)
        text="";
    if(text.indexOf("http://")!=-1){
        try{
            var fileList=JSON.parse(text);
            if(fileList && fileList.length>0){
                return tableContextHandlerFile(fileList);
            }else if(fileList.value && fileList.value.length>0){
                var urlList = JSON.parse(fileList.value);
                return tableContextHandlerFile(urlList);
            }
        }catch(e){
        }
    }
    return text;
}

function tableContextHandlerFile(fileList){
    var text='';
    $.each(fileList,function(i,obj){
        text+='<a tar href="'+obj.url+'" target="_blank" >'+obj.name+'</a>';
    });
    return text;
}


// $.ajaxSetup({
        //     contentType: 'application/x-www-form-urlencoded;charset=utf-8',
        //     complete: function(xhr, status) {
        //         var sessionStatus = xhr.getResponseHeader('sessionstatus'); // 通过XMLHttpRequest取得响应头，sessionstatus，
        //         if (sessionStatus == "timeout") {
        //             location.href = ctx+'/common/logincloud.jsp';
        //         }
        //     }
        // });
        
        function openWindow(url,bakFun){
            openWindowMarker=true;
            window.openWindowBanFun=bakFun;
            $("#config_btn_panel").css({"width":"1100px","right":"0px"});
            $("#config_btn_panel").html('<div class="clearfix head-line"><em class="back-btn" onclick="javascript:cloudOpenWindow();"></em></div><iframe width="100%" height="100%" scrolling="no" frameborder="0" src="'+url+'"></iframe>');
            $('#config_btn_panel').addClass('right-wrap-show animated fadeInRight');
        }
        function cloudOpenWindow(isSuccess){
            openWindowMarker=false;
            $("#config_btn_panel").removeClass("right-wrap-show fadeInRight");
            $("#config_btn_panel").animate({"right":"-1100px","opacity":"0.7"},600);
            $("#config_btn_panel").empty();
            if(isSuccess){
                if(window.openWindowBanFun){
                    window.openWindowBanFun();
                }
            }
        }
        function Notify(msg){
            tipsMsg(msg,"FAIL");
        }



