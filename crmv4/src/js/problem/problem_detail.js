$(function () {

    // "use strict";

    //点击移除当前的按钮
    $(".select-lable-del").on("click",".delete-form-field",function () {
        removeCurrentLable(this);
    })

    //点击返回
    $("#problem_back").on("click",function () {
        var name = $(this).attr("name");
        if(parseInt(name)==0){
            showRightPop("showRightPop");
            $(".problem-trajectory").css("width","500px");
            $("#problem_back").removeClass("reg-back-btn").addClass("return-back-btn");
            $(this).attr("name",1);
            $(".record .dateCon .datetime .statusDone").hide();
        }else{
            hideRightPop("showRightPop");
            $(".problem-trajectory").css("width","85px");
            $("#problem_back").removeClass("return-back-btn").addClass("reg-back-btn");
            $(this).attr("name",0);
            $(".record .dateCon .datetime .statusDone").show();
        }
    })

    //点击转产品的 添加
    $(".turn-product").on("click",".add_row_icon",function () {
         var trunProductSelect = $("#trun-product-select");
         var val = trunProductSelect.find(".paramValue").val();
         if(val==""){
             alert("请选择人")
             return;
         }
         var label = "<label class='select-lable-del'>"+val+"<em class='delete-form-field' onclick='removeCurrentLable(this)'></em></label>";
         $(".trun-add-pepole").append(label);
    })
})

function removeCurrentLable(_this) {
    $(_this).parent().remove();
}

function moreContentClick(_this) {
    var name = $(_this).attr("name");
    if(parseInt(name)==0){
        $(_this).parent().parent().find(".itemContent").removeClass("default_con_height");
        $(_this).find(".moreItem").attr("src",ctx+"/assetsv1/img/select-up-arrow.png");
        $(_this).find(".more").text("收起");
        $(_this).attr("name","1");
    }else{
        $(_this).parent().parent().find(".itemContent").addClass("default_con_height");
        $(_this).find(".moreItem").attr("src",ctx+"/assetsv1/img/select-down-arrow.png");
        $(_this).find(".more").text("更多");
        $(_this).attr("name","0");
    }
}