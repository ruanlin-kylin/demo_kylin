/*************************视图显示部分js****************************/
var formFieldList={};
var hideFieldList=[];		//右侧备选字段数据
var showFieldList=[];		//左侧显示字段数据

var selectedField;    	//视图显示，选择修改的字段的li
var selectedLineBar;    //视图显示，选择修改的分线栏

var urlParams=getUrlParams();
$(function(){
    if(!urlParams.id){
        tipsMsg("参数错误","FAIL");
        return;
    }
    getFieldData();
    initField();


    //点击左侧标题，收起ul
    /* $(document).on("click",".item-title-info",function(){
     $(this).parent().parent().find("ul.item-content").toggle();
     }); */
});

//获取表单字段及用户设置信息【表单字段-左侧显示字段=右侧备选字段】
function getFieldData(){
    $.ajax({
        url : ctx+"/cloud/form/handler/getForm/obj",
        type : "post",
        async:false,
        data :{formId:urlParams.id},
        success : function(json){
            if(json.result=="Success" || json.result=="SUCCESS"){
                var formObj=json.map.obj;
                $(".show-content-header-title").text(formObj.name);
                var setting = JSON.parse(formObj.setting);
                var allFieldList = setting.formFieldList;
                if(allFieldList && allFieldList.length>0){
                    $.each(allFieldList,function(i,obj){
                        var field={html_type:obj.html_type,name:obj.name,val_key:obj.val_key,is_show:obj.is_show,is_null:obj.is_null,elem_width:obj.elem_width,is_drag:obj.is_null};
                        formFieldList[obj.val_key]=field;
                    });
                }
            }else{
                tipsMsg(json.resultMsg,"FAIL");
            }
        }
    });
    $.ajax({
        url:ctx+"/cloud/userUiConfig/getConfig",
        type : "get",
        async:false,
        data:{tableId:urlParams.id,type:"FORM_VIEW_SETTING"},
        success:function(json){
            if(json.result=="Success" || json.result=="SUCCESS"){
                if(json.map){	//用户保存过设置信息
                    $("#id").val(json.map.id);
                    if(json.map.setting){
                        var setting=JSON.parse(json.map.setting);
                        showFieldList=setting.showFields;
                        $.each(showFieldList,function(i,obj){
                            delete formFieldList[obj.val_key];		//从所有表单字段中移除显示的字段，剩下的为备选字段
                        });
                        $.each(formFieldList,function(i,obj){
                            if(obj.html_type!="LINEBAR"){
                                hideFieldList.push(obj);
                            }
                        });
                    }
                }else{				//首次设置，没有保存过设置信息
                    $.each(formFieldList,function(i,obj){
                        showFieldList.push(obj);
                    });
                }
            }else{
                tipsMsg(json.resultMsg,"FAIL");
            }
        }
    });
}

//初始化html
function initField(){
    if(hideFieldList && hideFieldList.length>0){	//初始化备选字段
        for(var i=0;i<hideFieldList.length;i++){
            var classStr=""
            var requireNode="";
            if(hideFieldList[i].is_show=="0"){
                classStr += " field-hide";
            }
            if(hideFieldList[i].is_null=="0"){
                requireNode = "<font class='red'>*</font>"
            }
            $("#left").append("<li class='right-style "+classStr+"' key='halfLine' val_key='"+hideFieldList[i].val_key+"' name='"+hideFieldList[i].name+"' elem_width='12' is_null='"+hideFieldList[i].is_null+"' is_show='"+hideFieldList[i].is_show+"' is_drag='"+hideFieldList[i].is_drag+"'>"+
            "<div class='left-content'>"+
            requireNode+
            "<span class='flied-name'>"+
            hideFieldList[i].name+
            "</span>"+
            "</div>"+
            "</li>");
        }
    }
    if(showFieldList && showFieldList.length>0){	//初始化视图显示字段
        for(var i=0;i<showFieldList.length;i++){
            if(showFieldList[i].html_type=="LINEBAR"){
                $("#right").append("<li class='left-style col-12' html_type='LINEBAR' name='"+showFieldList[i].name+"' is_show='"+showFieldList[i].is_show+"' key='halfLine' draggable='false'>"+
                "<div class='item-title'>"+
                "<span class='item-title-info'>"+
                "<i class='fa fa-caret-down' aria-hidden='true'></i>"+
                "<span class='lineBarName'>"+showFieldList[i].name+"</span>"+
                "</span>"+
                "</div>"+
                "</li>");
            }else{
                var classStr="col-12";
                var elem_width="12";
                var requireNode="";
                if(showFieldList[i].elem_width){
                    classStr=" col-"+showFieldList[i].elem_width;
                    var elem_width=showFieldList[i].elem_width;
                }
                if(showFieldList[i].is_show=="0"){
                    classStr += " field-hide";
                }
                if(showFieldList[i].is_null=="0"){
                    requireNode = "<font class='red'>*</font>"
                }
                $("#right").append("<li class='left-style "+classStr+"' key='halfLine' val_key='"+showFieldList[i].val_key+"' name='"+showFieldList[i].name+"' elem_width='"+elem_width+"' is_null='"+showFieldList[i].is_null+"' is_show='"+showFieldList[i].is_show+"' is_drag='"+showFieldList[i].is_drag+"'>"+
                "<div class='left-content'>"+
                requireNode+
                "<span class='flied-name'>"+
                showFieldList[i].name+
                "</span>"+
                "</div>"+
                "</li>");
            }
        }
    }
}



//鼠标移入字段显示操作按钮
$(document).on("mouseenter",".left-style",function(){
    var elem_width=$(this).attr("elem_width");
    var is_drag=$(this).attr("is_drag");
    var operateContent =
        "<div class='btn-group btn-group-xs pull-right' style='position:absolute;top: 7px;right: 20px; display: block;'>"+
        (is_drag=="1"?"<button class='btn btn-default' onclick='fieldRequire(this)'>必填</button>":"")+
        '<select class="btn btn-default" onchange="editfieldWidth(this)" style="height:22px;width:47px;padding:0;">'+
        '<option value="12" '+(elem_width=="12"?"selected":"")+'>整行</option>'+
        '<option value="6" '+(elem_width=="6"?"selected":"")+'>半行</option>'+
        '<option value="4" '+(elem_width=="4"?"selected":"")+'>1/3</option>'+
        '<option value="3" '+(elem_width=="3"?"selected":"")+'>1/4</option>'+
        '</select>'+
        "<button class='btn btn-default' onclick='editFiledName(this)'>修改</button>"+
        (is_drag=="1"?"<button class='btn btn-default' onclick='removeFieldContent(this)'>移除</button>":"")+
            //"<button class='btn btn-default' onclick='editProperty(this)'>属性</button>"+
        "</div>";
    if($(this).attr("html_type")=="LINEBAR"){
        operateContent =
            "<div class='btn-group btn-group-xs pull-right' style='position:absolute;top: 8px;right: 20px; display: block;'>"+
            "<button class='btn btn-default editLineBarBtn'>修改</button>"+
            "<button class='btn btn-default deleteLineBarBtn'>移除</button>"+
            "</div>";
    }
    $(this).append(operateContent);
});
//鼠标移出字段隐藏操作按钮
$(document).on("mouseleave",".left-style",function(){
    $(this).find(".btn-group").remove();
});


//字段是否必填
function fieldRequire(_this){
    //通过给li添加属性 require来判断是否是必填项
    var li = $(_this).parents("li");
    var content = li.find(".left-content");
    var requireNode = "<font class='red'>*</font>";
    if(li.attr("is_null")=="0"){
        content.find(".red").remove();
        li.attr("is_null","1");
    }else{
        content.prepend(requireNode);
        li.attr("is_null","0");
    }
}

//字段显示宽度
function editfieldWidth(_this){
    var elem_width=$(_this).val();
    var li = $(_this).parents("li");
    li.attr("elem_width",elem_width);
    li.removeClass("col-12 col-6 col-4 col-3").addClass("col-"+elem_width);
}

//打开字段名称、宽度修改弹窗
function editFiledName(_this){
    selectedField = $(_this).parents("li");
    $("#editFieldModal").find("[name=name]").val(selectedField.find(".flied-name").text());
    $("#editFieldModal").find("[name=elem_width]").val(selectedField.attr("elem_width")?selectedField.attr("elem_width"):"12");
    $("#editFieldModal").modal();
}
//保存字段名称、宽度
$("#editFieldModal").on("click",".btn-primary",function(){
    var name=$("#editFieldModal").find("[name=name]").val();
    var elem_width=$("#editFieldModal").find("[name=elem_width]").val();
    if(selectedField && selectedField.length>0){
        selectedField.attr("name",name);
        selectedField.attr("elem_width",elem_width);
        selectedField.find(".flied-name").text(name);
        selectedField.removeClass("col-12 col-6 col-4 col-3").addClass("col-"+elem_width);
    }
    $("#editFieldModal").modal('hide');
});
//移除字段
function removeFieldContent(_this){
    // if($(_this).parents("li").attr("is_null")=="0"){	//去除必填样式
    // fieldRequire(_this);
    // }
    var li = $(_this).parents("li");
    li.find(".btn-group").remove();						//去除操作按钮
    li.removeClass("left-style col-12 col-6 col-4 col-3").addClass("right-style");
    li.find(".left-content").css("border","1px solid rgba(0,0,0,.125)");
    $("#left").append(li);
}

//修改字段属性
/* function editProperty(_this){
 $("#fieldAttrModal").modal();
 } */

//打开分线栏修改弹窗
$(document).on("click",".editLineBarBtn",function(){
    selectedLineBar = $(this).parents("li");
    $("#editLineBarModal").find("[name=name]").val("");
    $("#editLineBarModal").find("[name=is_show]").prop("checked",false);
    if(selectedLineBar && selectedLineBar.length>0){
        $("#editLineBarModal").find("[name=name]").val(selectedLineBar.attr("name"));
        $("#editLineBarModal").find("[name=is_show]").prop("checked",selectedLineBar.attr("is_show")=="0");
    }
    $("#editLineBarModal").modal();
});

//保存分线栏
$("#editLineBarModal").on("click",".btn-primary",function(){
    var name=$.trim($("#editLineBarModal").find("[name=name]").val());
    if(!name){
        name="分线栏";
    }
    var is_show=$("#editLineBarModal").find("[name='is_show']:checked").val()=="0"?"0":"1";;
    if(selectedLineBar && selectedLineBar.length>0){	//修改
        selectedLineBar.attr("name",name).attr("is_show",is_show);
        selectedLineBar.find(".lineBarName").text(name);
    }else{		//新增
        $("#right").append('<li class="left-style col-12" html_type="LINEBAR" name="'+name+'" is_show="'+is_show+'" key="halfLine" draggable="false">'+
        '<div class="item-title">'+
        '<span class="item-title-info">'+
        '<i class="fa fa-caret-down" aria-hidden="true"></i>'+
        '<span class="lineBarName">'+name+'</span>'+
        '</span>'+
        '</div>'+
        '</li>');
    }
    $("#editLineBarModal").modal('hide');
});

//删除分线栏
$(document).on("click",".deleteLineBarBtn",function(){
    $(this).parents("li").remove();
});


/**
 * 保存设置信息
 */
function saveFormViewSetting(){
    var showFields=[];
    var hideFields=[];
    $.each($("#right").find(".left-style"),function(){
        var field={"name":$(this).attr("name"),"is_show":$(this).attr("is_show")};
        if($(this).attr("html_type")=="LINEBAR"){
            field.html_type="LINEBAR";
        }else{
            field.val_key=$(this).attr("val_key");
            field.is_null=$(this).attr("is_null");
            field.elem_width=$(this).attr("elem_width");
            field.is_drag=$(this).attr("is_drag");
        }
        showFields.push(field);
    });
    var setting={"showFields":showFields};
    var loadMsg = layer.msg("正在保存...",{icon:16,shade:[0.1,'#393D49'],time:60000});
    $.post(ctx+"/cloud/userUiConfig/saveConfigAdmin",{"id":$("#id").val(),"type":"FORM_VIEW_SETTING","tableId":urlParams.id,"setting":JSON.stringify(setting)},function(json){
        layer.close(loadMsg);
        if(json.result=="SUCCESS"){
            window.parent.tipsMsg("保存成功","SUCCESS");
            window.parent.cloudOpenWindow(true);
            window.parent.location.reload();//刷新父页面
        }else{
            tipsMsg(json.resultMsg,"FAIL");
        }
    });
}

/***************************初始化拖拽效果*************************/
var left = document.getElementById('left');
var right = document.getElementById('right');

//  Shared lists
new Sortable(left, {
    group: 'shared', // set both lists to same group
    animation: 150,
    ghostClass : 'left-style'
});

new Sortable(right, {
    group: {
        name:"shared",
        pull:false,  //则可以拖拽到其他列表 否则反之
        put:true  //则可以从其他列表中放数据到该列表，false则反之
    },
    animation: 150,
    ghostClass : 'right-style'
});

Sortable.create(document.getElementById('right'), {   //从右边往左边拖动  right=>left       右往左
    animation: 150, //动画参数
    onAdd: function (evt){ //拖拽时候添加有新的节点的时候发生该事件
        console.log('onAdd.foo:', [evt.item, evt.from]);
        var element = $(evt.item);
        console.log(evt.item);
        $(evt.item).removeClass("right-style").addClass("left-style col-12").attr("elem_width","12");    //从右侧拖入左侧时，移除右侧的样式，添加左侧的样
        //$(evt.item).attr({"widhtpercent":"半行","value":"6"});    //拖入左侧时默认宽度为半行
        highBorderLight($(evt.item).find(".left-content"));

        //增加按钮编辑功能
    },
    onUpdate: function (evt){ //拖拽更新节点位置发生该事件
        console.log('onUpdate.foo:', [evt.item, evt.from]);
    },
    onRemove: function (evt){ //删除拖拽节点的时候促发该事件
        console.log('onRemove.foo:', [evt.item, evt.from]);
    },
    onStart:function(evt){ //开始拖拽出发该函数
        console.log('onStart.foo:', [evt.item, evt.from]);
    },
    onSort:function(evt){ //发生排序发生该事件
        console.log('onSort.foo:', [evt.item, evt.from]);
    },
    onEnd: function(evt){ //拖拽完毕之后发生该事件
        console.log('onEnd.foo:', [evt.item, evt.from]);
    }
})

function highBorderLight(e){
    var border='1px dashed rgb(205, 197, 211)';
    var num=0;
    var i=self.setInterval(function(){
        e.css('border',num%2==0?'1px dashed red':border);
        num++;
        if(num>9)
            window.clearInterval(i);
    },100);
    return $(this);
}
