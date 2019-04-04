
var formId = "";   //formId
var params = ""    //参数
// putStorageValue("to_params_value",JSON.stringify(params));
// var params=getStorgeValue("to_params_value");
var y_params_value = localStorage.getItem("y_params_value");
var to_params_value = localStorage.getItem("to_params_value");
if(to_params_value){
    params=JSON.parse(to_params_value);
}
if(y_params_value){
    y_params_value=JSON.parse(y_params_value);
}

$(function(){
    var href_url=window.location.href;
    if(href_url && href_url.split("html?").length==2) {
        pmStr = $.trim(href_url.split("html?")[1]);
        var cur_id;
        for (var i = 0; i < pmStr.split("&").length; i++) {
            var str_val = pmStr.split("&")[i];
            if (str_val && str_val.split("=") != -1) {
                if (str_val.split("=")[0] == "formId") {
                    formId=$.trim(str_val.split("=")[1]);
                }
            }
        }
    }
    if(formId){
        $.ajax({
            type : "post",
            url : ctx+"/cloud/form/handler/getForm/obj",
            data :{formId:formId},
            success : function(json){
                if(json.result=="Success" || json.result=="SUCCESS"){
                    var formObj=json.map.obj;
                    var setting = JSON.parse(formObj.setting);
                    var sqlSaveId=setting.sqlSaveId;
                    var formFieldList = setting.formFieldList;
                    var fieldConfigObj={};
                    if(formFieldList && formFieldList.length>0){
                        $.each(formFieldList,function(i,obj){
                            fieldConfigObj[obj.name]=obj;
                            var html = createdFormHtml(obj,params,y_params_value);
                            $("#field_content").append(html);
                        });
                        $("#field_content").append("<div style='display:none;'><input name='mark'></div>")
                        $('#field_content').bootstrapValidator();
                        $('#field_content').find(".bv-hidden-submit").remove();
                        initEvent(fieldConfigObj);
                    }
                }else{
                    tipsMsg(json.resultMsg,"FAIL");
                }
            },
            error: function(xhr, type){
                alert('Ajax error!'+xhr+"\t\t"+type)
            }
        });
    }else{
        tipsMsg("表单id不能为空","FAIL");
    }
});

function submitForm(){
    var bootstrapValidator = $("#field_content").data('bootstrapValidator');
    bootstrapValidator.validate();
    if(bootstrapValidator.isValid() && createHtml.definedValidate("field_content")){
        submit();
    }
}
function initEvent(fieldConfigObj){
    var content_div=$("#field_content");
    content_div.find("input[type=file]").each(function(i,obj){
        var obj = $(obj);
        var value = obj.attr("url_value");
        if(obj.attr("upType")=="file"){
            initUPFile(obj,value);
        }else{
            initUPPic(obj,value);
        }
    });
    content_div.find("input[db_type=date]").each(function(i,obj){
        createHtml.init_obj.initDate(obj);
    });
    content_div.find("input[htmlType=SEARCH_MORE]").each(function(i,obj){
        obj = $(obj);
        var name=obj.attr("key_name");
        var valueKey = obj.attr("valueKey");
        if(name && fieldConfigObj[name] && fieldConfigObj[name].wordbook && fieldConfigObj[name].wordbook.id &&  fieldConfigObj[name].wordbook.value_key){
            var wordbook = fieldConfigObj[name].wordbook;
            var id = wordbook.id;
            var value_key=wordbook.value_key;
            var valueList=[];
            if(valueKey){
                var defObj={};
                defObj[value_key]=valueKey;
                valueList=[defObj];
            }
            obj.parent().append('<input class="form-control" key="extend_element"  type="hidden" key_name="'+name+'" name="'+obj.attr("key_id")+'" htmlType="SEARCH_MORE">');
            var obEv=obj.magicSuggest({
                data: ctx+"/cloud/table/list/reader/wordbook/"+id,
                value:valueList,
                allowFreeEntries: false,
                valueField:value_key,
                placeholder: "请选择",
                displayField:value_key,//定义显示的字段
                maxSelectionRenderer: function(){
                    return "";
                },
                selectionRenderer:function(data){
                    var newData={};
                    for(var da in data){
                        newData[da]=data[da];
                    }
                    return "<label style='display:none;'>"+JSON.stringify(newData)+"</label>"+data[value_key];
                },renderer:function(data){
                    var text = data[value_key];
                    return text;
                }
            });
        }
    });
    content_div.find("input[htmlType=SEARCH_SELECT]").each(function(i,obj){
        obj = $(obj);
        var name=obj.attr("key_name");
        var valueKey = obj.attr("valueKey");
        if(name && fieldConfigObj[name] && fieldConfigObj[name].wordbook && fieldConfigObj[name].wordbook.id &&  fieldConfigObj[name].wordbook.value_key){
            var wordbook = fieldConfigObj[name].wordbook;
            var id = wordbook.id;
            var value_key=wordbook.value_key;
            var valueList=[];
            if(valueKey){
                var defObj={};
                defObj[value_key]=valueKey;
                valueList=[defObj];
            }
            obj.parent().append('<input class="form-control" key="extend_element"  type="hidden" key_name="'+name+'" name="'+obj.attr("key_id")+'" htmlType="SEARCH_SELECT">');
            var obEv=obj.magicSuggest({
                data: ctx+"/cloud/table/list/reader/wordbook/"+id,
                value:valueList,
                allowFreeEntries: false,
                valueField:value_key,
                maxSelection:1,//设置选择个数
                placeholder: "请选择",
                displayField:value_key,//定义显示的字段
                maxSelectionRenderer: function(){
                    return "";
                },
                selectionRenderer:function(data){
                    createHtml.jlChangBak(wordbook,data);
                    var value=data[value_key];
                    $("input[key_name='"+name+"']").val(value);
                    createHtml.validateSelect($($("input[key_name='"+name+"']")[0]));
                    return value;
                },renderer:function(data){
                    var text = data[value_key];
                    return text;
                }
            });
            $(obEv).on('selectionchange', function(e,m){
                if(!this.getValue() || this.getValue().length==0){
                    $("input[key_name='"+name+"']").val("");
                    createHtml.validateSelect($($("input[key_name='"+name+"']")[0]));
                    createHtml.jlChangClean(wordbook);
                }
            });
        }
    });
}
function createdFormHtml(ffobj,params,y_params_value){
    var html_type=ffobj.html_type;
    var name = ffobj.name;
    var is_show=ffobj.is_show;
    var is_null=ffobj.is_null;
    var is_edit=ffobj.is_edit;
    var val_key =ffobj.val_key;
    var elem_width=ffobj.elem_width;
    var disabled_str = "";
    var isbt="Y";
    var options =getOptions(ffobj);
    var validateObj = getValidateObj(ffobj);
    if(is_show && is_show=="0"){
        disabled_str="style='display:none;'";
    }
    if(is_edit && is_edit=="0"){
        disabled_str+=" disabled "
    }
    if(is_null && is_null=="1"){
        isbt="N";
    }
    if(!val_key){
        val_key="";
    }
    if(!elem_width){
        elem_width=12;
    }
    var defaultValue = params[name];
    if(!defaultValue){
        defaultValue="";
    }
    if("INPUT"==html_type){
        return createHtml.input(name,val_key,defaultValue,elem_width,disabled_str,validateObj,isbt);
    }else if("TEXTAREA"==html_type ){
        return createHtml.textArea(name,val_key,defaultValue,elem_width,disabled_str,validateObj,isbt);
    }else if("DATE-INPUT"==html_type ){
        return createHtml.date_input(name,val_key,defaultValue,elem_width,disabled_str,validateObj,isbt,y_params_value);
    }else if("DATETIME-INPUT"==html_type ){
        return createHtml.datetime_input(name,val_key,defaultValue,elem_width,disabled_str,validateObj,isbt,y_params_value);
    }else if("TIME-INPUT"==html_type ){
        return createHtml.time_input(name,val_key,defaultValue,elem_width,disabled_str,validateObj,isbt,y_params_value);
    }else if("SELECT"==html_type ){
        return createHtml.select(name,val_key,defaultValue,elem_width,disabled_str,options,isbt);
    }else if("CHECKBOX"==html_type ){
        return createHtml.checkbox(name,val_key,defaultValue,elem_width,disabled_str,options,isbt);
    }else if("CHECKBOX_BLOCK"==html_type ){
        return createHtml.checkboxBlock(name,val_key,defaultValue,elem_width,disabled_str,options,isbt);
    }else if("RADIO"==html_type ){
        return createHtml.redio(name,val_key,defaultValue,elem_width,disabled_str,options,isbt);
    }else if("RADIO_BLOCK"==html_type ){
        return createHtml.redioBlock(name,val_key,defaultValue,elem_width,disabled_str,options,isbt);
    }else if("SEARCH"==html_type && ffobj.wordbook){
        return createHtml.searchSelect(name,val_key,defaultValue,elem_width,disabled_str,isbt);
    }else if("SEARCH_MORE"==html_type && ffobj.wordbook ){
        return createHtml.searchMore(name,val_key,defaultValue,elem_width,disabled_str,isbt);
    }else if("UPPICTURE"==html_type ){
        return createHtml.uppicture(name,val_key,defaultValue,elem_width,disabled_str);
    }else if("UPFILE"==html_type ){
        return createHtml.upfile(name,val_key,defaultValue,elem_width,disabled_str);
    }
}

function getOptions(ffObj){
    var options=[];
    if(ffObj.option){
        for(var o in ffObj.option){
            options.push({valueName:o,format:ffObj.option[o]});
        }
    }
    return options;
}
function getValidateObj(ffObj){
    if(ffObj.validate){
        var vO={};
        if(ffObj.vali_obj){
            vO.validate=ffObj.vali_obj;
        }
        if(ffObj.validate.min_length){vO.minlength=ffObj.validate.min_length;}
        if(ffObj.validate.max_length){vO.maxlength=ffObj.validate.max_length;}
        if(ffObj.validate.min_date){vO.minDate=ffObj.validate.min_date;}
        if(ffObj.validate.max_date){vO.maxDate=ffObj.validate.max_date;}
        return vO;
    }
}

function submit(){
    var divObj = $("#field_content");
    function getVlaueByName(divOjb,name){
        var nameArray=divOjb.find("[name='"+name+"']");
        var data=[];
        for(var i=0;i<nameArray.length;i++){
            if(nameArray[i].checked==true){
                data.push($.trim($(nameArray[i]).val()));
            }
        }
        return data;
    }
    var eea=divObj.find("[key='extend_element']");
    var names="";
    var db={};
    for(var i=0;i<eea.length;i++){
        var io =$(eea[i]);
        var name = $.trim(io.attr("name"));
        if(name){
            var type=$.trim(io.attr("type"));
            if("radio"==type || "checkbox"==type){
                if(!(names.indexOf(name)!=-1)){
                    names=names+"|"+name;
                    var objVal= getVlaueByName(divObj,name);
                    if(objVal.length>0){
                        objVal=objVal.join(",");
                    }
                    db[name]=objVal;
                }
            }else if("file"==type) {
                var keyName=io.attr("key_name");
                if(io.attr("upType")=="file"){
                    var imgDiv=io.parent();
                    var fileList=[];
                    imgDiv.find("input[key='url']").each(function(i,obj){
                        obj=$(obj);
                        var value = obj.val();
                        if(value){
                            var fn = obj.attr("name");
                            var fsize = obj.attr("size");
                            fileList.push({url:value,name:fn,size:fsize});
                        }
                    });
                    if(fileList.length>0){
                        db[keyName]=JSON.stringify(fileList);
                    }
                }else{
                    var imgDiv=io.parent();
                    var urls="";
                    imgDiv.find("input[key='url']").each(function(i,obj){
                        obj=$(obj);
                        var url = $.trim(obj.val());
                        if(url){
                            if(urls){
                                urls+=","+url;
                            }else{
                                urls=url;
                            }
                        }
                    });
                    db[keyName]=urls;
                }
            }else{
                if(io.attr("htmlType")=="SEARCH_MORE") {
                    var moreObj = [];
                    io.parent().find(".ms-sel-item label").each(function (i, obj) {
                        var htmlStr = $.trim($(obj).html());
                        moreObj.push(JSON.parse(htmlStr));
                    });
                    db[name] = JSON.stringify(moreObj);
                }else{
                    var value =$.trim(io.val());
                    if(value && (value.indexOf("<div>")!=-1 || value.indexOf("<#if")!=-1)){
                        value=encodeURIComponent(value);
                    }
                    db[name]=value;
                }
            }
            //表单验证
            if(io.siblings(".redRequired").length !=0 && io.attr("type") != "hidden"
                    && (db[name]==""||db[name]==null)){
                Notify(io.attr("placeholder")+":不能空或null值.", 'top-right', '500', 'danger', 'fa-bolt', true);
                return;
            }
        }
    }
    db['formId']=formId;
//			alert(JSON.stringify(db));
    var loadMsg = layer.msg("正在加载...",{icon:16,shade:[0.1,'#393D49'],time:60000});
    var saveUrl = ctx+"/cloud/form/handler/saveForm";
    $.post(saveUrl,db,function(json){
        layer.close(loadMsg);
        if(json.result=="SUCCESS"){
            var resultObj;
            if(json.map && json.map.result){
                if(json.map.result.indexOf("[[")!=-1){
                    resultObj=json.map.result.replace("[[","{").replace("]]","}");
                    resultObj = JSON.parse(resultObj);
                }
            }
            if(resultObj && resultObj.message){
                window.parent.tipsMsg(resultObj.message,"SUCCESS");
            }else{
                window.parent.tipsMsg("保存成功","SUCCESS");
            }
            window.parent.cloudOpenWindow(true);
        }else{
            tipsMsg(json.resultMsg,"FAIL");
        }
    });
};


/**
 * 打开表单设置界面
 */
function openFormSetting() {
    //setTableWidthToCatch();
    var url = './viewSetting.html?id=' + formId ;
    openWindow(url, function () {
        window.location.reload();
    });
}

var open_window_width;
var open_window_default_width = 900;
/**
 * 打开弹窗
 */
function openWindow(url, bakFun) {
    window.openWindowBanFun = bakFun;
    if (open_window_width && (open_window_width * 1) > 0) {
        showRightPopGetWidth("config_btn_panel", open_window_width + "px");
    } else {
        if (open_window_default_width == 900) {
            open_window_default_width = 1000;
        }
        showRightPopGetWidth("config_btn_panel", open_window_default_width + "px");
    }

    $("#config_btn_panel").html('<div class="clearfix head-line" style="display: block;"><em class="back-btn" onclick="javascript:cloudOpenWindow();"></em></div><iframe width="100%" height="' + ($(window).height() - 50) + '" scrolling="no" frameborder="0" src="' + url + '"></iframe>');
    $("#config_btn_panel").show();
    if (url.indexOf("hideWindow") != -1) {
        $("#config_btn_panel").hide();
    }
}

function cloudOpenWindow(isSuccess) {
    if (open_window_width && (open_window_width * 1) > 0) {
        hideRightPopGetWidth("config_btn_panel", open_window_width + "px");
    } else {
        hideRightPopGetWidth("config_btn_panel", open_window_default_width + "px");
    }
    if (isSuccess) {
        if (window.openWindowBanFun) {
            window.openWindowBanFun();
        }
    }
}
