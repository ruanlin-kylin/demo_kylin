/**
 * Created by lirun on 2019/3/20.
 */

//    点击左侧菜单li
$(".message-list .list-item").click(function(){
    $(this).parent().find(".list-item").removeClass("list-item-active");
    $(this).addClass("list-item-active");//同时查询查询界面的相应内容
});

//    点击右侧菜单栏li
$(".message-info-item").click(function(){
    $(this).parent().find(".message-info-item").removeClass("info-time-active");
    $(this).addClass("info-time-active");//同时查询查询界面的相应内容
});

//    点击右侧消息结果的信息，弹出详情
$(document).on("click",".result-info",function(){
    $(this).parent().find(".result-detail").toggle();
})