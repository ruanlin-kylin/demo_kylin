"use strict";

$(function () {

    queryMenu();

    function queryMenu() {
        //查询首页 返回的信息
        $.ajax({
            type: "GET",
            url: "/crmweb/cloud/index/index_v1",   //加载首页接口
            dataType: "json",
            success: function (data) {
                if (data.result == "SUCCESS") {
                    alert(12);
                    returnResult = data;
                    console.log("加载首页接口的返回值：" + JSON.stringify(returnResult));
                    var menuConfigListResult = data.obj.menuConfigList;
                    $.cookie('cur_orgId', data.cur_orgId); //医院id
                    $.cookie('cur_orgName', data.cur_orgName); //医院名称
                    $.cookie('fullName', data.fullName); //用户名称
                    $.cookie('cur_userId', data.cur_userId); //用户ID
                    $.cookie('cur_sessionId', data.cur_sessionId); //当前sessionId
                    userType = data.userType;
                    getMenu(menuConfigListResult);
                }
                if (data.result == "Failure") {
                    window.location.href = 'login.html';
                }
            },
            error: function (data) {
                console.log("加载首页接口的 失败：" + data);
            }
        })
    }

    //首页加载接口返回值 生成菜单栏
    function getMenu(menuConfigList) {
        var menuListHtml = "";
        var menuList = menuConfigList;
        //查询一级菜单
        for (var i = 0; i < menuConfigList.length; i++) {
            var name = menuList[i].name;
            var sid = menuList[i].sid;
            menuListHtml += "<div class='nav-list' key_menu_id='"+sid+"'>" +
                "<span class='nav-title'>" +
                "<i class='icons icon-sp'></i>" +
                "<span class='txt'>" + name + "</span>" +
                " </span>" +
                "<ul class='nav-child-list' id='" + "childList_" + i + "'>" + "</ul>" +
                " </div>";
        }
        $("#sidebar").append(menuListHtml); //生成一级菜单列表

        //查询二级菜单    生成二级菜单列表
        for (var l = 0; l < menuConfigList.length; l++) {
            var name = menuList[l].name;
            var childListHtml = "";
            if (menuList[l].childList && menuList[l].childList.length > 0) {
                for (var j = 0; j < menuList[l].childList.length; j++) {
                    var childName = menuList[l].childList[j].name;
                    var childId = menuList[l].childList[j].id;
                    var sid = menuList[l].childList[j].sid;
                    var classify = menuList[l].childList[j].classify;
                    childListHtml += "<li><a key_menu_id='"+sid+"' classify='"+classify+"' href='' id='" + childId + "' onclick='queryMenuInfo(_this)'>" + childName +
                        "</a></li>";
                }
                var childListId = "childList_" + l;
                $("#" + childListId).append(childListHtml);
            }
        }
    }
})