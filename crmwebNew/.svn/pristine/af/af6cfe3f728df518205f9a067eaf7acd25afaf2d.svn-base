"use strict";

var path = {path:'/'};
$.cookie('orgId', 0,path); //部门编号

$(function(){
   try{
     localStorage.clear();
    //  logo_url.initlogo("login");
   }catch(e){

   }
   var loginFailCount = $.cookie('loginFailCount');
   if(loginFailCount==null){
       $.cookie('loginFailCount',0);
   }else{
       if(loginFailCount>2){
           $(".yzm").show();
       }
   }

   refreshCheckCode();
   var loginName = $("#loginName");
   var password = $("#password");
   var code = $("#code");
   //自动登录
   $("#code").bind('keyup', function () {
        if ($("#code").val().length == 4) {
            return login();
        }
    });

    // var anization_message ="${anization_message}";
	// 	if(anization_message){
	// 		bootbox.alert({
	// 			buttons: {
	// 				ok: {
	// 					label: '确认',
	// 					className: 'btn-myStyle'
	// 				}
	// 			},
	// 			message:anization_message,
	// 			callback: function() {
	// 			}
	// 		});
	// 	}

   $(".loginBtn").on("click",function(){
      loginData();
   })

})

//登录
function loginData(){
    $(".load").show();
    var userName = $("#loginName").val();
    var userPwd = $("#password").val();
    var code = $("#code");
    var sendData = {
        loginName:userName,
        password:userPwd,
        loginFailCount:0,
        code:code.val(),
        randomcode:$('#randomcode').val(),
        loginFailCount:$.cookie('loginFailCount')
     };
     // alert(JSON.stringify(sendData));
    // showLoadingContent("正在加载...",true);
    $.ajax({
         type : "GET",
         url : ctx+"/cloud/sysUser/cloudlogin",
         data:sendData,
         dataType : "json",
         success:function(data){
             console.log("登录后的结果："+JSON.stringify(data));
            //  hideLoadingContent();
             var data = data[0];
             if(data.result=="SUCCESS"){
                 $.cookie('loginFailCount',0);
                 //将用户信息保存在cookie中
                 $.cookie('userId', data.id,path); //用户Id 
                 $.cookie('loginName', data.code,path); //用户名称 loginName
                 $.cookie('trueName', data.fullName,path); //用户名称
                 $.cookie('orgId', 0,path); //部门编号
                 $.cookie('loginPwd', data.loginPwd,path); //用户密码
                 $.cookie('ip', data.ip,path);//用户本机ip
                 $.cookie('loginTime', new Date().getTime(), path);
                 $.cookie('language', 'zh-CN', path);//默认中文
                 $.cookie('userType', data.userType, path);//用户类型
                 localStorage.setItem("srcUrl","");	//设置登录标志  如果srcUrl="",则默认跳转到首页界面
                 var menuDirection = $.cookie("menuDirection");
                 if(menuDirection){
                     $.cookie("menuDirection",menuDirection);
                 }else{
                     localStorage.setItem("menuDirection","vertical");	//  设置菜单方向   1. vertical 竖向，显示左侧菜单    2.across 横向，显示头部菜单
                 }
                 var url=window.location.href;
                 var greenlight="";
                 var to_url = "";
                 if(url.indexOf("greenlight=1")!=-1){
                     greenlight="1";
                     // to_url=encodeURIComponent(window.location.href);
                 }
                 var parentWindow=window;
                 for(var i=0;i<5;i++){//最多网上寻找无极
                     if(parentWindow.parent && parentWindow.parent.window){
                         parentWindow=parentWindow.parent.window;
                     }else{
                         break;
                     }
                 }
                 if(url.indexOf("his_skip.jsp")!=-1){
                     parentWindow.location.href=url; //主页面
                 }else{
                     localStorage.setItem("is_login","login");	//设置登录标志
                     //parentWindow.location.href="${ctx}/cloud/index?greenlight="+greenlight+"&to_url="+to_url; //主页面
                     parentWindow.location.href ='./index.html';
                 }
             }else{
                 var loginFailCount = parseInt($.cookie('loginFailCount'));
                 if(loginFailCount>2){
                     $(".yzm").show();
                 }
                 $.cookie('loginFailCount',(parseInt($.cookie('loginFailCount'))+1));
                 showTopMsg(data.result, 4000, 'error');
             }
         },
         error:function(data){
             console.log("登录后的结果 失败："+JSON.stringify(data));
         }
    })
}

//刷新验证码
function refreshCheckCode() {
    $.ajax({
        type : "GET",
        url : "/crmweb/cloud/sysUser/randomVerification",
        dataType : "text",
        async: false,
        success : function(data) {
             var imageUrl = "/crmweb/cloud/sysUser/getVerification?randomcode="+data+"&"+ Math.random();
             $('#Verify_codeImag').attr('src', imageUrl);
             $('#randomcode').val(data);
        }
    });
}

//回车键
document.onkeydown = function(e) {
    if (!e) {
        e = window.event;
    }// window.event
    if ((e.keyCode || e.which) == 13) {
        loginData();
    }
};