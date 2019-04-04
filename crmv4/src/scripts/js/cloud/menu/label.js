
    var littleToolFun={
        labelBlur:function(me){
        },
        labelSelect:function(me){
            var me = $(this);
            if(me.attr("label_id") && me.attr("label_name")){
                if(me.attr("mark")==0){
                    me.addClass("label_input_selected");
                    me.attr("mark","1");
                }else{
                    me.removeClass("label_input_selected");
                    me.attr("mark","0");
                }
            }
        },getSelectLabel:function(){
            var data={labelStr:"",labels:[]};
            $("#chooseLabelModal").find(".modal-body").find("input[key=label]").each(function(i,obj){
                var obj = $(obj);
                if(obj.attr("mark")=="1"){
                    data.labelStr=data.labelStr?(data.labelStr+=','+obj.val()):obj.val();
                    data.labels.push({labelId:obj.attr("label_id"),labelName:obj.attr("label_name"),typeId:obj.attr("type_id"),typeName:obj.attr("type_name")});
                }
            });
            return data;
        }
    };
    var littleTool=function(config){
        var me= this;
        me.config=config;
        me.dataLabel;
        me.openModal=function(){
            var thisObj = this;
            $("#chooseLabelModal").find(".modal-footer").html('<button type="button" class="btn btn-primary label_submit" onclick="">保存</button> <button type="button" class="btn btn-default label_close">关闭</button>');
            $("#chooseLabelModal").find(".modal-footer").find(".label_submit").bind("click",function(){
                var obj=config.obj;
                var data=littleToolFun.getSelectLabel();
                obj.parent().find(".showLable").html("");
                if(data.labels && data.labels.length>0){
                    $.each(data.labels,function(i,lab){
                        obj.parent().find(".showLable").append('<span class="label label_input_selected">'+lab.labelName+'</span>');
                    });
                }
                obj.val(JSON.stringify(data));
                thisObj.closeModal();
                if(config.backFun){
                    try{
                        config.backFun();
                    }catch(e){};
                }
            });
            $("#chooseLabelModal").find(".modal-footer").find(".label_close").bind("click",function(){
                me.closeModal();
            });
            $("#chooseLabelModal").modal();
        };
        me.removeLabelDb=function(labelObj){
            var me = this;
            if(labelObj  && labelObj.labelId && labelObj.labelName && labelObj.typeId && labelObj.typeName){
                if(me.dataLabel && me.dataLabel[labelObj.typeId]){
                    var childs=me.dataLabel[labelObj.typeId].childs;
                    var newChilds=[];
                    for(var j=0;j<childs.length;j++){
                        if(childs[j].labelId!=labelObj.labelId){
                            newChilds.push(childs[j]);
                        }
                    }
                    me.dataLabel[labelObj.typeId].childs=newChilds;
                }
            }
        };
        me.addLabelDb=function(labelObj){
            var me = this;
            if(labelObj  && labelObj.labelId && labelObj.labelName && labelObj.typeId && labelObj.typeName){
                if(me.dataLabel && me.dataLabel[labelObj.typeId]){
                    me.dataLabel[labelObj.typeId].childs.push(labelObj);
                }
            }
        }
        me.closeModal=function(){
            $("#chooseLabelModal").modal("hide");
        };
        me.loadLabel=function() {//加载
            if (me.dataLabel) {
                showLabel();
            } else {
                $.get(ctx + "/cloud/hoLabel/findLabelList", {type: me.config.idKey}, function (json) {
                    if (json.result == "Success" || json.result == "SUCCESS") {
                        var rows = json.rows;
                        me.dataLabel = {};
                        for (var i = 0; i < rows.length; i++) {
                            var row = rows[i];
                            if (row.typeId && row.typeName && row.labelId && row.labelName) {
                                if (!me.dataLabel[row.typeId]) {
                                    me.dataLabel[row.typeId] = {typeId: row.typeId, typeName: row.typeName, childs: []};
                                }
                                me.dataLabel[row.typeId]["childs"].push({labelId: row.labelId, labelName: row.labelName,isPublic:row.isPublic});
                            }
                        }
                        showLabel();
                    } else {
                        tipsMsg(json.resultMsg, "FAIL");
                    }
                });
            }
            function showLabel() {
                function existLabel(labelId,typeId){
                    var obj=me.config.obj;
                    var defaultValue= $.trim(obj.val());
                    var defaultData=[];
                    if(defaultValue){
                        try{
                            defaultData=JSON.parse(defaultValue)
                        }catch(e){}
                        if(defaultData && defaultData.labels && defaultData.labels.length>0){
                            for(var i=0;i<defaultData.labels.length;i++) {
                                var label = defaultData.labels[i];
                                if(label.labelId==labelId && label.typeId==typeId){
                                    return true;
                                }
                            }
                        }
                    }
                    return false;
                }
                if (me.dataLabel) {
                    var html = "";
                    var existLabelIds={};
                    for (var i in me.dataLabel) {
                        var ltObj = me.dataLabel[i];
                        if (ltObj.typeId && ltObj.typeName) {
                            html += '<div class="labelContainer"><div class="verticalTop" style="width: 70px;float: left;text-align: right;">' + ltObj.typeName + ':</div><div class="chooseLabelArea" type_key_id="'+ltObj.typeId+'" style="position: relative">';
                            if (ltObj.childs && ltObj.childs.length > 0) {
                                for (var j = 0; j < ltObj.childs.length; j++) {
                                    var label = ltObj.childs[j];
                                    var selectText =existLabel(label.labelId,ltObj.typeId)?" mark='1' class='label_input_selected' ":"mark='0'";
                                    if(selectText!="mark='0'"){
                                        existLabelIds[label.labelId]="1";
                                    }
                                    html += '<span style="position: relative;"><input type="text" key="label"  onmouseover="this.style.cursor=\'hand\'"  '+selectText+' type_name="'+ltObj.typeName+'" type_id="'+ltObj.typeId+'" label_id="'+label.labelId+'" label_name="'+label.labelName+'" value="'+label.labelName+'" onkeydown="this.onkeyup();" onkeyup="this.size=(this.value.length>3 ?this.value.length:3);" size="7" maxlength="15" readonly="" style="width: auto;">';
                                    if(!(label.isPublic && label.isPublic=="1")){
                                        html+='<span class="deleteLabel" style="position: absolute;top: -4px;right: 16px;width:8px;border: none;border-radius: 50%;cursor: pointer;"><img src="../../../src/images/commons/delete_04.png" width="8" height="8"/></span>';
                                    }
                                    html+='</span>';
                                }
                            }
                            html+='<span class="addLabel pointer"  type_id="'+ltObj.typeId+'" type_name="'+ltObj.typeName+'" style="position: absolute;right:-25px;bottom:-5px;width: 55px;height: 30px;color: #48a1dd;Z-INDEX: 100; "><img class="middle label_add_img" src="${ctx}/assets/images/add-selete.png" alt="新增"/></span>';
                            html += '</div></div>';
                        }
                    }
                    var defaultValue= $.trim(me.config.obj.val());
                    if(defaultValue){
                        var defData=JSON.parse(defaultValue);
                        if(defData && defData.labels && defData.labels.length>0){
                            for(var i=0;i<defData.labels.length;i++){
                                var lobj = defData.labels[i];
                                if(!(existLabelIds[lobj.labelId] && existLabelIds[lobj.labelId]=="1")){
                                    var html = '<span style="position: relative;"><input type="text" key="label"  onmouseover="this.style.cursor=\'hand\'"  mark="0" type_name="'+lobj.typeName+'" type_id="'+lobj.typeId+'" label_id="'+lobj.labelId+'" label_name="'+lobj.labelName+'" value="'+lobj.labelName+'" onkeydown="this.onkeyup();" onkeyup="this.size=(this.value.length>3 ?this.value.length:3);" size="7" maxlength="15" readonly="" style="width: auto;"></span>';
                                 
                                    $($("div[type_key_id='"+lobj.typeId+"']")[0]).append(html);
                                }
                            }
                        }
                    }
                        
                    $("#chooseLabelModal").find(".modal-body").html(html);

                    $("#chooseLabelModal").find(".modal-body").find("input[key=label]").each(function(i,obj){
                        obj = $(obj);
                        if(!(obj.attr("event_mark")=="1")){
                            obj.bind("click",littleToolFun.labelSelect);
                            obj.attr("event_mark","1");
                        }
                    });
                    $("#chooseLabelModal").find(".modal-body").find(".deleteLabel").bind("click",function(){
                        var obj = $(this);
                        var labelInput=$(obj.parent().find("input[key=label]")[0]);
                        var labelId = labelInput.attr("label_id");
                        var labelName=labelInput.attr("label_name");
                        var typeId =  labelInput.attr("type_id");
                        var typeName= labelInput.attr("type_name");
                        if(labelId){
                            $.post(ctx+"/cloud/hoLabel/remove",{id:labelId},function(json){
                                if(json.isOk){
                                    var labelObj = {labelId:labelId,labelName:labelName,typeId:typeId,typeName:typeName};
                                    me.removeLabelDb(labelObj);
                                    obj.parent().remove();
                                }else{
                                    alert(json.msg);
                                }
                            })
                        }
                    });
                    $("#chooseLabelModal").find(".modal-body").find("input[key=label]").attr("")
                    $("#chooseLabelModal").find(".modal-body").find(".addLabel").bind("click",function(){
                       var labelInputObj = $(this);
                        var typeId=labelInputObj.attr("type_id");
                        var typeName = labelInputObj.attr("type_name");
                        labelInputObj.parent().append('<input type="text" key="label" new_mark="1" type_id="'+typeId+'" type_name="'+typeName+'" onmouseover="this.style.cursor=\'hand\'" onkeydown="this.onkeyup();" onkeyup="this.size=(this.value.length>3 ?this.value.length:3);" size="3" maxlength="15"/>');
                        $("#chooseLabelModal").find(".modal-body").find("input[key=label]").each(function(i,obj){
                            obj = $(obj);
                            if(!(obj.attr("event_mark")=="1")){
                                obj.bind("click",littleToolFun.labelSelect);
                                obj.attr("event_mark","1");
                            }
                        });

                        $("#chooseLabelModal").find(".modal-body").find("input[new_mark=1]").bind("blur",function(){
                            var obj = $(this);
                            obj.attr("new_mark","0");
                            var value = $.trim(obj.val());
                            var typeId = obj.attr("type_id");
                            if(value && typeId && !(obj.attr("sendMark")=="1")){
                                var etObj;
                                obj.parent().find("input[key=label]").each(function(i,o){
                                    var o = $(o);
                                    if(o.attr("label_id")){
                                        if(value== o.val()){
                                            etObj=o;
                                        }
                                    }
                                });
                                obj.attr("readOnly","true");
                                obj.css("width","auto");
                                obj.attr("sendMark","1");
                                if(etObj){
                                    obj.attr("label_id",etObj.attr("label_id"));
                                    obj.attr("label_name",etObj.attr("label_name"));
                                    obj.attr("type_name",etObj.attr("type_name"));
                                    return;
                                }
                                $.get(ctx+"/cloud/hoLabel/saveLabel",{"type":typeId,"labelName":value},function(json){
                                    if (json.result == "Success" || json.result == "SUCCESS") {
                                        var label=json.map.label;
                                        obj.attr("label_id",label.id);
                                        obj.attr("label_name",label.name);
                                        var labelObj={labelId:obj.attr("label_id"),labelName:obj.attr("label_name"),typeId:obj.attr("type_id"),typeName:obj.attr("type_name")};
                                        me.addLabelDb(labelObj);
                                    } else {
                                        tipsMsg(json.resultMsg, "FAIL");
                                    }
                                });
                            }
                        });
                    });
                    me.openModal();
                }
            }
        };
        me.initConfig=function(){
            if(config.type && config.obj && config.idKey){
                if("label"==config.type){
                    config.obj.hide();
                    var defautValue=config.obj.val();
                    var defStr = '';
                    if(defautValue){
                        try{
                            var jsonValue=JSON.parse(defautValue);
                            if(jsonValue.labels && jsonValue.labels.length>0){
                                $.each(jsonValue.labels,function(i,label){
                                    defStr+='<span class="label label_input_selected">'+label.labelName+'</span>';
                                });
                            }
                        }catch(e){};
                    }
                    config.obj.parent().append("<span class='showLable' style='padding-left: 10px;'>"+defStr+"</span><img class='middle selectLabelButton' src='${ctx}/assets/images/add-selete.png' alt='新增'/>");
                    config.obj.parent().find(".selectLabelButton").bind("click",function(){
                        me.loadLabel();
                    });
                }
            }
        }
    };


$(function(){
    var config={"type":"label","idKey":"客户","obj":$("#selectLabel")};
    var toolObj = new littleTool(config);
    toolObj.initConfig();
    var config2={"type":"label","idKey":"客户","obj":$("#testLabel")};
    var toolObj2 = new littleTool(config2);
    toolObj2.initConfig();
});



//实现模态框拖拽
// $(".modal").draggable({
//     handle: ".modal-header", // 只能点击头部拖动
//     cursor: "pointer"
// });

//失去焦距，input标签不可再编辑，长度随文字长度决定
// function switchToSpan(selector){
//     selector.readOnly = true;
//     $(selector).css("width","auto");
// }