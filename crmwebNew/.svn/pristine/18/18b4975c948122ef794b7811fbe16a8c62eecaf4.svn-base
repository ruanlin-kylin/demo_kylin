
    var saveFormBackFunList = [];
    var sqlSavnSaveAfterHander=[];
    var fieldList,buttonList,tableSetting,configId;var fieldTypeList;var conditionList={};var buttonConfigList={};
    var tableConfigObj={};
    var tableDbRows={};
    var form_pm_obj={};
    var form_db={};
    var sys_db={};
    function searchTable(me){
        me=$(me);
        var idKey=me.attr("key_mark");
        var fieldKeys=[];
        var fieldList=tableConfigObj[idKey+"_fieldList"];
        if(fieldList && fieldList.length>0){
            $.each(fieldList,function(i,obj){
                if(obj.isSearch && obj.isSearch==1){
                    fieldKeys.push(obj.columnName);
                }
            });
        }
        var keyword=me.parent().find("input[name=fb_keyword]").val();
        var data={keyword:keyword,fieldKeys:JSON.stringify(fieldKeys)};
        if(tableConfigObj[idKey]){
            tableConfigObj[idKey].jqGrid('setGridParam',{datatype:'json',postData:data,page:1}).trigger("reloadGrid"); //重新载入  
        }
    }

    function initConfig(configDiv,config,orderMark){
        this.config = config;
        this.paramsValue=config.paramsValue;
        this.contentType=config.comType;
        this.objectId=config.dataSource;
        this.pageId = config.pageId;
        this.configDiv=configDiv;
        this.orderMark=orderMark;
        this.idKey =  'from_table_field_mark_'+(this.objectId+'_'+this.orderMark);
        var me = this;
        this.init=function(){
            if(this.contentType && this.objectId) {
                if("TABLE_TEAM"==this.contentType){
                    var url = './tableList.html?menuId='+this.objectId+'&id='+this.pageId+'&name=tableTeam';
                    configDiv.html('<iframe width="100%" scrolling="no" frameborder="0"  src="'+url+'" height="100%"></iframe>');
                }else if("NUMBER"==this.contentType){
                    configDiv.html(
                            '<div class="chart bg-6fa7f5">'+
                            '<div class="chart-title">'+(this.config.name)+'</div>'+
                            '<div class="chart-number" name="digital">0</div>'+
                            '</div>'
                    );
                    initDigital(this.config,this.configDiv);
                }else if("LIST"==this.contentType){
                    configDiv.html('<div class="list_component"></div>');
                    var config={id:this.config.dataSource,params:this.config.params,markId:(this.orderMark+"-"+this.config.dataSource),w:this.config.w,h:this.config.h};
                    config['openWindow']=openWindow;
                    config['cloudOpenWindow']=cloudOpenWindow;
                    var list = new tableList($(configDiv.find('.list_component')[0]),config);
                    list.init();
                }else if("PIE"==this.contentType || "BAR"==this.contentType || "LINE"==this.contentType){
                    var chartHeight=150*(this.config.h*1);
                    var html ='<div class="chart bg-fff">'+
                            '<div class="chart-nav">'+
                            '<div class="chart-operate">'+
                            '<span class="filter" key="filter_btn">'+
                            '<a class="fa fa-filter" href="javascript:void(0);" style="margin-left:15px"></a>'+
                            '<span style="padding-left: 6px;">筛选</span>'+
                            '</span>'+
                            '<span class="setting"  key="setting_btn" style="padding-left: 10px;">'+
                            '<a class="fa fa-cog" href="javascript:void(0);" style="margin-left:15px"></a>'+
                            '</span>'+
                            '</div>'+
                            '<span class="chart-nav-title">'+(this.config.name)+'</span>'+
                            '<ul class="chart-nav-list">'+
                            '</ul>'+
                            '</div>'+
                            '<div class="filterDiv"></div>'+
                            '<div class="chart-container" id="'+(this.idKey)+'" style="height:'+(chartHeight-60)+'px;">'+
                            '</div>'+
                            '</div>';
                    configDiv.html(html);
                    var refere=encodeURIComponent(window.location.href);
                    var chart = new chartInit(this.idKey,this.config);
                    chart.init();
                }
            }else {
                if ("ASSESS" == this.contentType) {
                    var tempHtml = this.configDiv.find(".freemarkerTemplate").html();
                    if (tempHtml) {
                        tempHtml = decodeURIComponent(tempHtml);
                    }
                    var data = getParamsObj(paramsValue);
                    data['html'] = tempHtml;
                    $.post(ctx + "/cloud/sys/assess/getHtml", data, function (json) {
                        if (json.ret == "0") {
                            me.configDiv.html(json.html);
                            initOpenForm(me.configDiv);
                        } else {
                            me.configDiv.html(json.msg);
                        }
                    });
                }
            }
        };

        /*初始化数字组件*/
        function initDigital(config,configDiv){
            var tableId = config.dataSource;
            // var tableId = config.pageId;
            var paramsValue = config.paramsValue;
            configDiv.find("[name=digital]").bind("click",function(me){
                if(paramsValue==""||paramsValue==null){
                    window.parent.openUrl('./cloud/menu/tableList.html?id='+tableId,"1",configDiv.find("[name=title]").text(),tableId);
                }else{
                    window.parent.openUrl('./cloud/menu/tableList.html?id='+tableId+"&"+paramsValue,"1",configDiv.find("[name=title]").text(),tableId);
                }
                // window.parent.openUrl('/crmweb/cloud/menu/tablelist/'+tableId+"?"+paramsValue,"1",configDiv.find("[name=title]").text(),tableId);
            });
            var  data={tableId:config.dataSource,field:("count(*)"==config.countFiled)?"":config.countFiled};
            $.post(ctx+'/cloud/table/list/reader/digital',data,function(data){
                configDiv.find("[name=digital]").text(data.total);
            });
        };

        /*初始化表单*/
        function initForm(){

        };
        /*初始化报表*/
        function initReport(me,tableId,idKey,configDiv,paramsValue){
            configDiv.find(".set-table-btn").bind("click",function(me){
                openWindow('./setting.html?tableId='+tableId+'&type='+table_setting_type+"&hinedHeight=true&showHidePage=true");
            });
            $.ajax({
                type : "post",
                url : ctx+"/cloud/userUiConfig/postGet",
                data :{module:tableId,type:table_setting_type},
                async : false,
                success : function(json){
                    if(json.result=="Success" || json.result=="SUCCESS"){
                        var jsonMap=json.map;
                        fieldList = jsonMap.fieldList;
                        buttonList = jsonMap.buttonList;
                        configId=jsonMap.configId;
                        tableSetting=jsonMap.tableSetting;
                        var fieldList = jsonMap.fieldList;
                        var buttonList = jsonMap.buttonList;
                        var colList=[];
                        var editDelButtonList = [];
                        if(buttonList!=null && buttonList.length>0){
                            $.each(buttonList,function(i,button){
                                buttonConfigList[button.sid]=button;
                                if(button.type=="ADD"){
                                    var class_val = JsonButton.spanButton.default_btn_select;
                                    if(button.style){
                                        var mesg = ctx+"/assetsv1/img/list/"+button.style+"_white.png";
                                    }
                                    configDiv.find(".button_content").append(
                                            '<span id="add_entry" key_id="'+button.sid+'" onclick="javascript:clickButton(this,\''+idKey+'\');" class="default-btn '+class_val+'" type="button"  style="margin: 0px 5px;background:rgba(72, 160, 220, 1) url('+mesg+') no-repeat 10px center" >'+button.name+'</span>'
                                    );
                                }else{
                                    if(button.type!="LINK") {
                                        editDelButtonList.push(button);
                                    }
                                }
                            });
                        }
                        $.each(fieldList,function(i,field){
                            var title=field.title;
                            if(field.alias && field.alias.length>0){
                                title=field.alias;
                            }
                            var colObj = {label:title,index:field.columnName,name:field.columnName};
                            if(!field.isShow && field.isShow==0){
                                colObj['hidden']=true;
                            }
                            if(field.primaryKey && field.primaryKey==1){
                                colObj['key']=true;
                            }
                            if(field.fieldType=="DATE" || field.fieldType=="DATETIME" || field.fieldType=="TIME"){
                                var format="yyyy-MM-dd";
                                if(field.fieldType=="DATETIME"){
                                    format="yyyy-MM-dd HH:mm:ss";
                                }else if(field.fieldType=="TIME"){
                                    format="HH:mm:ss";
                                }
                                colObj['formatter']=function(v,x,n){
                                    if(v){
                                        var date=new Date(v);
                                        return textBZ(idKey,date.format(format),field.columnName, x.rowId,n,buttonList);
                                    }
                                    return textBZ(idKey,v,field.columnName, x.rowId,n,buttonList);;
                                }
                            }else{
                                colObj['formatter']=function(dbValue,x,n){
                                    return textBZ(idKey,dbValue,field.columnName, x.rowId,n,buttonList);
                                }
                            }
                            colList.push(colObj);
                        });
                        if(editDelButtonList.length>0){
                            colList.push({
                                label:"操作",
                                index:"操作",
                                name:"操作",
                                formatter:function(dbValue,x,n){
                                    var buttonStr='';
                                    $.each(editDelButtonList,function(i,button){
                                        if(n.SHOW_BUTTON_IDS && existString(n.SHOW_BUTTON_IDS,button.sid)){
                                            var class_val = JsonButton.spanButton.default_btn_select;
                                            if(button.style){
                                                var mesg = ctx+"/assetsv1/img/list/"+button.style+"_white.png";
                                            }
                                            buttonStr+='<span id="add_entry" key_id="'+button.sid+'" row_id="'+ x.rowId+'" bt_type="'+button.type+'" onclick="javascript:clickButton(this,\''+idKey+'\');" class="default-btn '+class_val+'" type="button"  style="margin: 0px 5px;background:rgba(72, 160, 220, 1) url('+mesg+') no-repeat 10px center" >'+button.name+'</span>'
                                        }
                                    });
                                    return buttonStr;
                                }
                            });
                            //showColCount++;
                        }
                        var parentObj=configDiv.closest(".set_height_mark");
                        var mark_height;
                        if(parentObj){
                            var  height=parentObj.height()-110;
                            if(height>0){
                                mark_height = height;
                            }
                        }
                        var pager_mark;
                        if(!(tableSetting && tableSetting.isShowPage==0)){
                            pager_mark="#"+me.idKey+"_pager";
                        }else{
                            if(height>0){
                                height=height+35;
                            }
                        }
                        gridObj=configDiv.find(".tableObj").jqGrid({
                            url: ctx+'/cloud/table/list/reader/list',
                            mtype: "POST",
                            styleUI : 'Bootstrap',
                            datatype: "json",
                            scrollrows: true,//行可见,
                            postData:{tableId:tableId},
                            gridComplete:function(){
                            },
                            colModel: colList,
                            viewrecords: true,
                            height:mark_height,
                            rowNum: 20,
                            pager:pager_mark,
                            rownumbers: true,
                            autowidth: true,
                            scroll: false,
                            paramsFun:function(){
                                var data=getParamsObj(paramsValue);
                                if(form_pm_obj){
                                    for (var pd in form_pm_obj) {
                                        if (form_pm_obj[pd]) {
                                            data[pd]=form_pm_obj[pd];
                                        }
                                    }
                                }
                                if(form_db){
                                    for (var pd in form_db) {
                                        if (form_db[pd]) {
                                            data[pd]=form_db[pd];
                                        }
                                    }
                                }
                                return data;
                            },
                            loadComplete:function(data) {
                                tableDbRows[idKey]=data.rows;
                            }
                        });
                        tableConfigObj[idKey]=gridObj;
                        tableConfigObj[idKey+"_fieldList"]=fieldList;

                        function textBZ(idKey,text,fieldKey,rowId,data,buttonList){
                            if(text){
                                if(typeof text=="object"){
                                    text=JSON.stringify(text);
                                }
                                text=text+"";
                                if(text.indexOf("###")!=-1){
                                    text=text.replace("###","");
                                    text = JSON.parse($.trim(text));
                                    var iconStr="";
                                    if(text.icon){
                                        iconStr="<label class='"+text.icon+"'></label>";
                                    }
                                    var styleStr="";
                                    if(text.background && text.background.toLowerCase()!="#ffffff"){
                                        styleStr="style='color:"+text.background+";'";
                                    }
                                    if(text.change_text){
                                        return  iconStr + '<label key_change="1" rowId="'+rowId+'" key_value="'+text.value+'" '+styleStr+'>'+text.change_text+"</label>"
                                    }
                                }
                                //处理超链接
                                if(buttonList && buttonList.length>0){
                                    $.each(buttonList,function(i,obj){
                                        if(obj.type=="LINK" && obj.name==fieldKey){
                                            if(data.SHOW_BUTTON_IDS && data.SHOW_BUTTON_IDS.length>0){
                                                for(var mk in data.SHOW_BUTTON_IDS){
                                                    if(data.SHOW_BUTTON_IDS[mk]==obj.sid){
                                                        text='<a key_id="'+obj.sid+'" onclick="javascript:clickButton(this,\''+idKey+'\');" bt_type="LINK" type="button" row_id="'+rowId+'">'+text+'</span>'
                                                    }
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                            return tableContextHandler(text);
                        }
                    }else{
                        tipsMsg(json.resultMsg,"FAIL");
                    }
                }
            });
        };
        /*初始化图标*/
        function initChart(){
        };
        function columnSet(options,buttonList,idKey){
            if(options.items==undefined || options.items==null || options.items=="" || options.items.length==0){
                alert("请添加items设置项");
                return ;
            }
            db_items=options.items;
            var col_attr=[];
            var columns=[];
            for(var i=0;i<db_items.length;i++){
                var item = db_items[i];
                if(item.propcn==="表头互选字段root_field_id"){
                    columns[columns.length]={
                        "sTitle": "<input title='全选' type='checkbox' class='group-checkable' value='0' name='bootstarp_data_table_checkbox'>",
                        "sClass": "left selected",
                        "bVisible": true,
                        "sWidth": "2%",
                        "bSortable": false,
                        "bSearchable": false,
                        "mData":item.prop,
                        "mRender": function(value) {
                            return "<input title='选择' type='checkbox' key='root_checkbox' class='checkboxes' name='bootstarp_data_table_checkbox' value='"+value+"'>";
                        }
                    }
                    col_attr.push({});
                    break;
                }
            }
            $.each(options.items,function(i,v) {
                if (v.isShow) {
                    if (v.propcn != "表头互选字段root_field_id") {
                        col_attr.push({format: v.format, v: v});
                        columns[columns.length] = {
                            data: v.prop,
                            sTitle: v.propcn,
                            bSortable: v.isSort,
                            "mRender": function (dbValue, a, b, c) {
                                var vobj = col_attr[c.col].v;
                                var html = fieldMRender(dbValue, vobj);
                                var isHtml =(html && (html+"").indexOf("<div")!=-1)?true:false;
                                html = getLinkText(vobj.prop, html, c.row,buttonList);
                                if (vobj.htmlType == "UPPICTURE" || vobj.htmlType == "UPFILE" || isHtml) {
                                    return html;
                                } else {
                                    return dataTableTitle(html);
                                }
                            }
                        };
                    }
                }
            });
            if(buttonList && buttonList.length>0){
                var buttonCount = 0;
                for(var i=0;i<buttonList.length;i++){
                    var button=buttonList[i];
                    if(button.buttonType!="ADD"){
                        buttonCount++;
                    }
                }
                if(buttonCount>0){
                    columns[columns.length]={
                        data: function (item,a,b,c,d) {
                            var row = c.row;
                            var tempDiv = $("<div/>");
                            initButton("2",item.judge_show_button_ids,tempDiv,buttonList,idKey);
                            var html = tempDiv.html();
                            html=html.replace(/11=\"11\"/g,"onclick='javascript:button_click(this,"+row+");'");
                            if(tempDiv.find("[complate_key='button']").length>3){
                                return '<a href="javascript:void(0);" key="more_button_event" class="btn btn-default opt" ><i class="fa fa-edit"></i></a><div style="display:none;" key="more_button">'+html+'</div>';
                            }else{
                                return html;
                            }
                        },
                        bSortable: false,
                        bSearchable: false,
                        title:"操作"
                    };
                }
            }
            columns[columns.length]={data:idKey,sTitle:idKey,visible:false};
            return columns;
        }
        function initButton(type,showIds,divObj,buttonListJson,idKey){
            if(buttonListJson && buttonListJson.length>0){
                for(var i=0;i<buttonListJson.length;i++){
                    var bojb = buttonListJson[i];
                    if(bojb.buttonType=="LINK"){
                        continue;
                    }
                    if((type=="1" && bojb.buttonType=="ADD") || (type=="2" && bojb.buttonType!="ADD")){
                        if(showIds && showIds.length>0){
                            var showIdsValue= showIds.split(",");
                            var isShow=false;
                            for(var j=0;j<showIdsValue.length;j++){
                                if(bojb.definedListButtonId==showIdsValue[j]){
                                    isShow=true;
                                    break;
                                }
                            }
                            if(!isShow)
                                continue;
                        }
                        var buttonObj = getButton(bojb.definedListButtonId,bojb,idKey);
                        if(buttonObj){
                            if(type=="1"){
                                divObj.prepend(buttonObj);
                            }else{
                                divObj.append(buttonObj);
                            }
                        }
                    }
                }
            }
        }
    };


    function getButton(id,button,idKey){
        var buttonTemplate = '';
        if(button && button.buttonCssTemplate){
            buttonTemplate=$(button.buttonCssTemplate);
        }else{
            buttonTemplate=$('<button  complate_key="button"  class="btn btn-darkorange btn-sm"  11="11" button_template_id="'+button.definedListButtonId+'"><i class="fa fa-plus"></i> '+button.buttonText+'</button>');
        }
        buttonTemplate.attr("complate_key","button");
        buttonTemplate.attr("button_type",button.buttonType);
        buttonTemplate.attr("link_address",button.linkAddress);
        buttonTemplate.attr("params_keys",button.paramsFieldList);
        buttonTemplate.attr("touchObject",button.touchObject);
        buttonTemplate.attr("buttonPopType",button.buttonPopType);
        buttonTemplate.attr("touchObjectId",button.touchObjectId);
        buttonTemplate.attr("tableId",button.extendConfigTableId);
        buttonTemplate.attr("buttonText",button.buttonText);
        buttonTemplate.attr("keyId",idKey);
        return buttonTemplate;
    }

    var cuurent_key_id;
    function button_click(thisObj,row,pm){
        var me = $(thisObj);
        var buttonType = me.attr("button_type");
        var touchObject=me.attr("touchObject");
        var params_keys=me.attr("params_keys");
        var tableId=me.attr("tableId");
        var button_text = me.attr("buttonText");
        var keyId = me.attr("keyId");
        var rowData,extend_field_extend_table_id;
        var data={};
        cuurent_key_id=keyId;
        if(keyId){
            var tableObj=tableConfigObj[keyId].table;
            if(tableObj && (row || row==0)){
                var nTrs = tableObj.fnGetNodes();//fnGetNodes获取表格所有行，nTrs[i]表示第i行tr对象
                rowData= tableObj.fnGetData(nTrs[row]);
                if(rowData && rowData['extend_field_extend_table_id']){
                    extend_field_extend_table_id=rowData['extend_field_extend_table_id'];
                }
            }
            if(tableConfigObj[keyId].params){
                valueToCopay(tableConfigObj[keyId].params,data);
            }
            data["rfs_value"]=getRootFieldSelectValue(keyId);
            data['extend_field_extend_table_id']=extend_field_extend_table_id;
        }
        if(params_keys){
            params_keys= $.trim(params_keys);
            var keys =params_keys.split(",");
            if(rowData){
                for(var i=0;i<keys.length;i++){
                    var key = $.trim(keys[i]);
                    var name=key;
                    var field_key=key;
                    if(key.split("=").length>1){
                        name=key.split("=")[0];
                        field_key=key.split("=")[1];
                    };
                    if(key){
                        data[name]=rowData[field_key];
                    };
                };
            }
            console.log('[获取数据]' +rowData);//fnGetData获取一行的数据
        }
        if("FORM"==me.attr("touchObject")){
            var formId=me.attr("touchObjectId");
            if(me.attr("buttonPopType")==0){
                defined_form.handlerDefined("content_div",formId,tableId,data,function(){
                    $('#myModal1').modal();
                    $('#myModal1').find(".modal-title").html(button_text);
                    if(extend_field_extend_table_id){
                        $("#content_div").append($("<input type='hidden'  key='extend_element' value='"+extend_field_extend_table_id+"' type='text' name='extend_field_extend_table_id'>"));
                    }
                });
            }else{
                var url = ctx+"/cloud/defined/from/db/toForm?formId="+formId+"&formDB="+JSON.stringify(data)+"&title_page="+button_text;
                window.parent.openSecondPage(url,document.title);
            }
        }else if("SQLSAVE"==me.attr("touchObject")){
            if(buttonType=="DELETED"){
                bootbox.confirm({
                    buttons: {
                        confirm: {label: '确定',className: 'btn-primary'},
                        cancel: {label: '取消',className: 'btn-default'}
                    },
                    message: '是否确认'+button_text,
                    callback: function(result) {
                        if(result) {
                            var sqlSaveEnterId=me.attr("touchObjectId");
                            $(".loading").show();
                            $.post(ctx+"/cloud/defined/from/db/sqlsave/"+sqlSaveEnterId,data,function(json){
                                $(".loading").hide();
                                if(json.result=="SUCCESS"){
                                    Notify(button_text+'成功', 'top-right', '5000', 'success', 'fa-check', true);
                                    $('#myModal1').modal("hide");
                                    oTable.fnClearTable(0);
                                    oTable.fnDraw();
                                }else{
                                    Notify(json.resultMsg, 'top-right', '5000', 'danger', 'fa-bolt', true);
                                }
                            });
                        }
                    }
                });
            }else{
                var sqlSaveEnterId=me.attr("touchObjectId");
                $(".loading").show();
                $.post(ctx+"/cloud/defined/from/db/sqlsave/"+sqlSaveEnterId,data,function(json){
                    $(".loading").hide();
                    if(json.result=="SUCCESS"){
                        Notify(button_text+'成功', 'top-right', '5000', 'success', 'fa-check', true);
                        $('#myModal1').modal("hide");
                        oTable.fnClearTable(0);
                        oTable.fnDraw();
                    }else{
                        Notify(json.resultMsg, 'top-right', '5000', 'danger', 'fa-bolt', true);
                    }
                });
            }
        }else if("EXTENTTABLE"==me.attr("touchObject") || "REPORT"==me.attr("touchObject")){
            var touchObjectId=me.attr("touchObjectId");
            config.menuId=touchObjectId;
            config.type="TABLELIST";
            var con="";
            var contentId="";
            if(data){
                for(var p in data){
                    contentId=contentId+data[p];
                    if(con){
                        con=con+"&"+p+"="+data[p];
                    }else{
                        con=p+"="+data[p];
                    }
                }
            }
            var url = ctx+"/cloud/defined/extendtable/list/"+touchObjectId+"?showSearch=true&showButton=true&"+con;
            if("REPORT"==me.attr("touchObject")){
                url =  ctx+"/cloud/defined/report/list/"+touchObjectId+"?showSearch=true&showButton=true&"+con;
            }
            var title = button_text;
            if(me.attr("button_type")!='LINK'){
                title=title+"-"+(contentId.length>6?contentId.substring(0,6)+"...":contentId);
            }
            url = url +"&title_page="+title;
            window.parent.openSecondPage(url,document.title);
        }else if("CUSTOMERSECONDPAGE"==me.attr("touchObject")){
            var title =me.html();
            var con="";
            var contentId="";
            if(data){
                for(var p in data){
                    contentId=contentId+data[p];
                    if(con){
                        con=con+"&"+p+"="+data[p];
                    }else{
                        con=p+"="+data[p];
                    }
                }
            }
            var url = "/crmweb/cloud/patient/customerDetail1?"+con;
            url = url +"&title_page="+title;
            var rowDbJson=getRowData(rowData);
            if(rowDbJson && rowDbJson.length>0){
                localStorage.setItem("rowDatas",rowDbJson);
            }
            window.parent.openSecondPage(url,document.title);
        }else if( "ADDRESS"==me.attr("touchObject")){
            var title =me.html();
            var con="";
            var contentId="";
            if(data){
                for(var p in data){
                    contentId=contentId+data[p];
                    if(con){
                        con=con+"&"+p+"="+data[p];
                    }else{
                        con=p+"="+data[p];
                    }
                }
            }
            var buttonPopType=me.attr("buttonPopType");
            var link_address=me.attr("link_address")+"?"+con;
            url = link_address;
            url=url.replace("{ctx}",ctx);
            if(me.attr("buttonPopType")==0){
                $('#openAddress').modal();
                $('#openAddress').find(".modal-title").html(title);
                $("#openAddress").find("[key=content_div]").html("<iframe width='100%' height='100%' src='"+url+"'>");
            }else{
                url = url +"&title_page="+title;
                window.parent.openSecondPage(url,document.title);
            }
        }
    }

    function existString(idList,id){
        if(idList && idList.length>0){
            for(var i=0;i<idList.length;i++){
                if(idList[i] == id){
                    return true;
                }
            }
        }
    }

    function getParamsObj(pmStr){
        var pm = {};
        if(pmStr && pmStr.length>0){
            for(var i=0;i<pmStr.length;i++){
                var pms = pmStr.split("&");
                if(pms && pms.length>0){
                    for(var z=0;z<pms.length;z++){
                        var pobj=pms[z];
                        if(pobj && pobj.indexOf("=")!=-1){
                            var pobjS = pobj.split("=");
                            if(pobjS && pobjS.length==2){
                                var key = $.trim(pobjS[0]);
                                var value = $.trim(pobjS[1]);
                                if(key && value){
                                    pm[key]=value;
                                }
                            }
                        }
                    }
                }
            }
        }
        return pm;
    }
    var currentOpenObj = {};
    function openFormBack(){
        if(currentOpenObj.formId){
            if(currentOpenObj.after_save_html && currentOpenObj.divObj){
                var nameS = currentOpenObj.after_save_html.split(",");
                var htmlValue = "";
                for(var i=0;i<nameS.length;i++){
                    var name = $.trim(nameS[i]);
                    if(name){
                        var value = $($("#content_div").find("[name="+name+"]")[0]).val();
                        if(value){
                            htmlValue+=value;
                        }
                    }
                }
                if(currentOpenObj.divObj.find("input").length==1){
                    $(currentOpenObj.divObj.find("input")[0]).val(htmlValue);
                }else{
                    currentOpenObj.divObj.html(htmlValue);
                }
            }
            if(currentOpenObj.after_save_refursh_table){
                if(tableConfigObj){
                    var tableObj ;
                    for(var cobj in tableConfigObj){
                        if(cobj.indexOf("from_table_field_mark_"+currentOpenObj.after_save_refursh_table)!="-1"){
                            tableObj=tableConfigObj[cobj];
                            break;
                        }
                    }
                    if(tableObj){
                        tableObj.table.fnClearTable(0);
                        tableObj.table.DataTable().draw(false);
                    }
                }
            }
        }
    }


    function initOpenForm(divObj){
        divObj.find("[key_type='openForm']").each(
                function(i,obj){
                    $(obj).bind("click",function(){
                        var obj = $(this);
                        var formId =obj.attr("key_form_id");
                        var pm = obj.attr("key_pm");
                        var formTitle = obj.attr("key_form_title");
                        var after_save_html=obj.attr("after_save_html");
                        var after_save_refursh_table=obj.attr("after_save_refursh_table");
                        currentOpenObj={formId:formId,pm:pm,formTitle:formTitle,after_save_html:after_save_html,after_save_refursh_table:after_save_refursh_table,divObj:obj};
                        if(formId){
                            var pmObj=getParamsObj(pm);
                            if(obj.find("input").length==1){
                                pmObj['htmlValue'] = $.trim($(obj.find("input")[0]).val());
                            }else{
                                pmObj['htmlValue'] = $.trim(obj.html());
                            }
                            defined_form.handlerDefined("content_div",formId,0,pmObj,function(){
                                $('#myModal1').modal();
                                $('#myModal1').find(".modal-title").html(formTitle);
                                $("#content_div").append($("<input type='hidden'  key='extend_element' value='1' type='text' name='openFormMark'>"));
                            });
                        }
                    });
                }
        );
    }

    var currentFB_Label_MARK;
    function setCurrentFBLabelMARK(mark){
        currentFB_Label_MARK=mark;
    }
    function getCurrentFBLabelMARK(){
        return currentFB_Label_MARK;
    }


    function submitScoreV1(me){
        var me = $(me);
        var sqlsave_id = me.attr("sqlsave_id");
        var parentDivId = me.attr("parent_div_id");
        var pm = me.attr("key_pm");
        var data=[];
        $("#"+parentDivId).find("input[key_type='blurSqlSave']").each(function(i,obj){
            obj = $(obj);
            var report_id=obj.attr("report_id");
            var item_id=obj.attr("item_id");
            var val= $.trim(obj.val());
            if(!val || !(/^[0-9]+$/.test(val))){
                val=0;
            }
            data.push(report_id+"|"+item_id+"|"+val);
        });
        var pmObj=getParamsObj(pm);
        pmObj['data']=data.join(",");
        $.post(ctx+"/cloud/defined/from/db/sqlsave/"+sqlsave_id,pmObj,function(json){
            if(json.result=="SUCCESS"){
                alert("保存成功");
            }else{
                Notify(json.resultMsg, 'top-right', '5000', 'danger', 'fa-bolt', true);
            }
        });
    }


    function definedDecodeURIComponent(text){
        try{
            return decodeURIComponent(text);
        }catch(e){
            console.log(e);
            return text;
        }
    }

    function  dataList() {
        var dataStr = {
        }
        var mesg = ctx + "/cloud/form/handler/saveSqlSave/1073814223194165248";
        var tableId = "purchase_table_team";
        $("#"+tableId).jqGrid({
            url:mesg,  //url请求地址
            mtype:"post",  //请求方式
            datatype: "json",   //格式
            postData:dataStr,   //传递的参数
            //prmNames:dataStr,
            styleUI : 'Bootstrap',  //样式风格引用bootStrap
            colNames: ['列表主键Id','序号','过滤器名称','创建时间','更新时间','操作','sid'],   //表头
            colModel:[   //列  name和index要和接口字段对应
                {name:'id',index:'id'}
            ],
            viewrecords:true,  //定义是否要显示总记录
            forceFit:true,
            shrinkToFit:true,
            autowidth: true,  //自动适应宽度
//            pager: "#scriptListQdPage",   //分页显示
            loadComplete:function(){  //完成之后

            }
        })
    }



    function date_fun_dateDubbo(me){
        if(event.keyCode==13){
            $(me).blur();
            $(".layui-laydate").hide();
        }
    }
    function date_fun_dateBlur(me){
        /*me = $(me);
         var value=$.trim(me.val());
         var reg = /^[0-9]+$/;
         if(value.length==8 && reg.test(value)){
         me.val(value.substring(0,4)+"-"+value.substring(4,6)+"-"+value.substring(6,8))
         }*/
    }
    function date_fun_dateTimeBlur(me){
        var me = $(me);
        var value=$.trim(me.val());
        var vals=value.split(" ");
        var data="";
        var time="";
        if(vals.length==2){
            var dv=$.trim(vals[0]);
            var time = $.trim(vals[1]);
            var reg = /^[0-9]+$/;
            if(dv.length==8 && reg.test(dv)){
                data=value.substring(0,4)+"-"+value.substring(4,6)+"-"+value.substring(6,8);
            }
        }else if(vals.length==1){
            var dv=$.trim(vals[0]);
            var reg = /^[0-9]+$/;
            if(dv.length==8 && reg.test(dv)){
                data=value.substring(0,4)+"-"+value.substring(4,6)+"-"+value.substring(6,8);
            }
            time="00:00:00";
        }
        if(data && time){
            me.val(data+" "+time);
        }
    }


    //拖拽表单解析
    var createHtml={
        search:function(fieldName,fieldKey,defaultVal,fieldWidth,disabled_str,isbt,validateObj){
            var html ='<div class="form-group component col-xs-'+fieldWidth+'"  '+disabled_str+'>'+
                    '<label class="col-lg-2 control-label">'+fieldName+("Y"==isbt?'<font class="redRequired" color="red">*</font>':'')+'</label>'+
                    '<div class="col-lg-10"><div class="input-group">'+
                    '<input  '+disabled_str+' type="text" '+disabled_str+'  key="extend_element"  '+this.getValidateHtml(validateObj,isbt,fieldName)+' key_id="'+fieldKey+'Text" placeholder="'+(fieldName?fieldName:"")+'"  value="'+defaultVal+'"   class="form-control" name="'+fieldKey+'Text"/>'+
                    '<input type="hidden" key="extend_element"  key_id="'+fieldKey+'" value="'+defaultVal+'"  class="form-control" name="'+fieldKey+'"/>'+
                    '<div class="input-group-btn">'+
                    '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">'+
                    '<span class="caret"></span>'+
                    ' </button>'+
                    ' <ul class="dropdown-menu dropdown-menu-right" role="menu"></ul>'+
                    ' </div>'+
                    '</div></div>'+
                    '</div>';
            return html;
        },
        searchMore:function(fieldName,fieldKey,defaultVal,fieldWidth,disabled_str,isbt){
            var html ='<div class="form-group component col-xs-'+fieldWidth+'"  '+disabled_str+'>'+
                    '<label class="col-lg-2 control-label">'+fieldName+("Y"==isbt?'<font class="redRequired" color="red">*</font>':'')+'</label>'+
                    '<div class="col-lg-10">'+
                    '<input type="text" class="form-control"  '+disabled_str+' key="extend_element"  isnull="'+isbt+'" '+this.getValidateHtml(null,isbt,fieldName)+' '+disabled_str+' key_name="'+fieldName+'" htmlType="SEARCH_MORE"  key_id="'+fieldKey+'" ' +
                    "valueKey='"+defaultVal+"'"+
                    '  name="'+fieldKey+'" placeholder="'+(fieldName?fieldName:"")+'"/>'+
                    '<small class="help-block isnull_text" data-bv-validator="notEmpty" data-bv-for="name" data-bv-result="INVALID" style="display: none;">'+fieldName+'不能为空</small>'+
                    '</div>'+
                    '</div>';
            return html;
        },searchSelect:function(fieldName,fieldKey,defaultVal,fieldWidth,disabled_str,isbt){
            var html ='<div class="form-group component col-xs-'+fieldWidth+'"  '+disabled_str+'>'+
                    '<label class="col-lg-2 control-label">'+fieldName+("Y"==isbt?'<font class="redRequired" color="red">*</font>':'')+'</label>'+
                    '<div class="col-lg-10">'+
                    '<input type="text" class="form-control"  '+disabled_str+'  key="extend_element"  isnull="'+isbt+'" '+this.getValidateHtml(null,isbt,fieldName)+' '+disabled_str+' key_name="'+fieldName+'" htmlType="SEARCH_SELECT"  key_id="'+fieldKey+'" ' +
                    "valueKey='"+defaultVal+"'"+
                    '  name="'+fieldKey+'" placeholder="'+(fieldName?fieldName:"")+'"/>'+
                    '<small class="help-block isnull_text" data-bv-validator="notEmpty" data-bv-for="name" data-bv-result="INVALID" style="display: none;">'+fieldName+'不能为空</small>'+
                    '</div>'+
                    '</div>';
            return html;
        },select:function(fieldName,fieldKey,defaultVal,fieldWidth,disabled_str,options,isbt){
            var selectHtml ='<select  '+disabled_str+'  isnull="'+isbt+'"   onkeydown="javascript:date_fun_dateDubbo(this);"   onchange="javascript:createHtml.validateSelect($(this));" key_name="'+fieldName+'"  class="form-control" key="extend_element"  key_id="'+fieldKey+'"  name="'+fieldKey+'">';
            if(options && options.length>0){
                for(var j=0;j<options.length;j++){
                    var text=options[j].valueName;
                    var value=options[j].format;
                    var selected ="";
                    if(defaultVal && ((defaultVal+"").indexOf(value)!=-1)){
                        selected="selected";
                    }
                    selectHtml+='<option '+selected+' value="'+value+'">'+text+'</option>';
                }
            }
            selectHtml+='</select>';
            var html ='<div class="form-group component col-xs-'+fieldWidth+' has-feedback"  '+disabled_str+'>'+
                    '<label class="col-lg-2 control-label">'+fieldName+("Y"==isbt?'<font class="redRequired" color="red">*</font>':'')+'</label>'+
                    '<div class="col-lg-10">'+
                    selectHtml+
                    '<i class="form-control-feedback glyphicon glyphicon-remove" data-bv-icon-for="name" style="display: none"></i>' +
                    '<i class="form-control-feedback glyphicon glyphicon-ok" data-bv-icon-for="name" style="display: none;"></i>'+
                    '<small class="help-block isnull_text" data-bv-validator="notEmpty" data-bv-for="name" data-bv-result="INVALID" style="display: none;">'+fieldName+'不能为空</small>'+
                    '</div>'+
                    '</div>';
            return html;
        },checkbox:function(fieldName,fieldKey,defaultVal,fieldWidth,disabled_str,options,isbt){
            var boxHtml ='';
            if(options && options.length>0){
                for(var j=0;j<options.length;j++){
                    var text=options[j].valueName;
                    var value=options[j].format;
                    var check="";
                    if(defaultVal && ((defaultVal+"").indexOf(value)!=-1)){
                        check="checked='checked'";
                    }
                    boxHtml+='<div class="checkbox inline"><label><input type="checkbox" key_name="'+fieldName+'"    onclick="javascript: createHtml.validateCheckAndRadio($(this).parents(&quot;.form-group&quot;));"   '+disabled_str+'  key="extend_element" name="'+fieldKey+'" '+check+' value="'+value+'"><span class="text">'+text+'</span></label></div>';
                }
            }
            var html ='<div class="form-group component col-xs-'+fieldWidth+'  has-feedback"  '+disabled_str+' key="extend_element" key_type="checkbox"  isnull="'+isbt+'" key_name="'+fieldKey+'">'+
                    '<label class="col-lg-2 control-label">'+fieldName+("Y"==isbt?'<font class="redRequired" color="red">*</font>':'')+'</label>'+
                    '<div class="col-lg-10"><div class="col-lg-12 component-border" >'+
                    boxHtml+
                    '</div>' +
                    '<i class="form-control-feedback glyphicon glyphicon-remove" data-bv-icon-for="name" style="display: none"></i>' +
                    '<i class="form-control-feedback glyphicon glyphicon-ok" data-bv-icon-for="name" style="display: none;"></i>'+
                    '<small class="help-block isnull_text" data-bv-validator="notEmpty" data-bv-for="name" data-bv-result="INVALID" style="display: none;">'+fieldName+'不能为空</small>'+
                    '</div>'+
                    '</div>';
            return html;
        },checkboxBlock:function(fieldName,fieldKey,defaultVal,fieldWidth,disabled_str,options,isbt){
            var boxHtml ='';
            if(options && options.length>0){
                for(var j=0;j<options.length;j++){
                    var text=options[j].valueName;
                    var value=options[j].format;
                    var check="";
                    if(defaultVal && ((defaultVal+"").indexOf(value)!=-1)){
                        check="checked='checked'";
                    }
                    boxHtml+='<div class="checkbox"><label><input type="checkbox" key_name="'+fieldName+'"   onclick="javascript: createHtml.validateCheckAndRadio($(this).parents(&quot;.form-group&quot;));"   '+disabled_str+'  key="extend_element" name="'+fieldKey+'" '+check+' value="'+value+'"><span class="text">'+text+'</span></label></div>';
                }
            }
            var html ='<div class="form-group component col-xs-'+fieldWidth+'  has-feedback"  '+disabled_str+' key="extend_element" key_type="checkbox"  isnull="'+isbt+'" key_name="'+fieldKey+'">'+
                    '<label class="col-lg-2 control-label">'+fieldName+("Y"==isbt?'<font class="redRequired" color="red">*</font>':'')+'</label>'+
                    '<div class="col-lg-10"><div class="col-lg-12 component-border" >'+
                    boxHtml+
                    '</div>' +
                    '<i class="form-control-feedback glyphicon glyphicon-remove" data-bv-icon-for="name" style="display: none"></i>' +
                    '<i class="form-control-feedback glyphicon glyphicon-ok" data-bv-icon-for="name" style="display: none;"></i>'+
                    '<small class="help-block isnull_text" data-bv-validator="notEmpty" data-bv-for="name" data-bv-result="INVALID" style="display: none;">'+fieldName+'不能为空</small>'+
                    '</div>'+
                    '</div>';
            return html;
        },redio:function(fieldName,fieldKey,defaultVal,fieldWidth,disabled_str,options,isbt){
            var boxHtml ='';
            if(options && options.length>0){
                for(var j=0;j<options.length;j++){
                    var text=options[j].valueName;
                    var value=options[j].format;
                    var check="";
                    if(defaultVal && ((defaultVal+"").indexOf(value)!=-1)){
                        check="checked='checked'";
                    }
                    boxHtml+='<div class="radio inline"><label><input type="radio" key_name="'+fieldName+'"  onclick="javascript: createHtml.validateCheckAndRadio($(this).parents(&quot;.form-group&quot;));"  '+disabled_str+'  key="extend_element" name="'+fieldKey+'" '+check+' value="'+value+'"><span class="text">'+text+'</span></label></div>';
                }
            }
            var html ='<div class="form-group component col-xs-'+fieldWidth+'  has-feedback"  '+disabled_str+'  key="extend_element" key_type="checkbox"  isnull="'+isbt+'" key_name="'+fieldKey+'">'+
                    '<label class="col-lg-2 control-label">'+fieldName+("Y"==isbt?'<font class="redRequired" color="red">*</font>':'')+'</label>'+
                    '<div class="col-lg-10"><div class="col-lg-12 component-border" >'+
                    boxHtml+
                    '</div>' +
                    '<i class="form-control-feedback glyphicon glyphicon-remove" data-bv-icon-for="name" style="display: none"></i>' +
                    '<i class="form-control-feedback glyphicon glyphicon-ok" data-bv-icon-for="name" style="display: none;"></i>'+
                    '<small class="help-block isnull_text" data-bv-validator="notEmpty" data-bv-for="name" data-bv-result="INVALID" style="display: none;">'+fieldName+'不能为空</small>'+

                    '</div>'+
                    '</div>';
            return html;
        },redioBlock:function(fieldName,fieldKey,defaultVal,fieldWidth,disabled_str,options,isbt){
            var boxHtml ='';
            if(options && options.length>0){
                for(var j=0;j<options.length;j++){
                    var text=options[j].valueName;
                    var value=options[j].format;
                    var check="";
                    if(defaultVal && ((defaultVal+"").indexOf(value)!=-1)){
                        check="checked='checked'";
                    }
                    boxHtml+='<div class="radio"><label><input type="radio" key_name="'+fieldName+'"  onclick="javascript: createHtml.validateCheckAndRadio($(this).parents(&quot;.form-group&quot;));"  '+disabled_str+'  key="extend_element" name="'+fieldKey+'" '+check+' value="'+value+'"><span class="text">'+text+'</span></label></div>';
                }
            }
            var html ='<div class="form-group component col-xs-'+fieldWidth+'  has-feedback"  '+disabled_str+'  key="extend_element" key_type="checkbox"  isnull="'+isbt+'" key_name="'+fieldKey+'">'+
                    '<label class="col-lg-2 control-label">'+fieldName+("Y"==isbt?'<font class="redRequired" color="red">*</font>':'')+'</label>'+
                    '<div class="col-lg-10"><div class="col-lg-12 component-border" >'+
                    boxHtml+
                    '</div>' +
                    '<i class="form-control-feedback glyphicon glyphicon-remove" data-bv-icon-for="name" style="display: none"></i>' +
                    '<i class="form-control-feedback glyphicon glyphicon-ok" data-bv-icon-for="name" style="display: none;"></i>'+
                    '<small class="help-block isnull_text" data-bv-validator="notEmpty" data-bv-for="name" data-bv-result="INVALID" style="display: none;">'+fieldName+'不能为空</small>'+

                    '</div>'+
                    '</div>';
            return html;
        },textArea:function(fieldName,fieldKey,defaultVal,fieldWidth,disabled_str,validateObj,isbt){
            var length_text = "";
            if(validateObj){
                if(validateObj.maxlength || validateObj.minlength){
                    if(validateObj.maxlength && validateObj.minlength){
                        length_text= '<small class="help-block length_text" data-bv-validator="notEmpty" data-bv-for="name" data-bv-result="INVALID" style="display: none;">'+fieldName+'内容字数必须在'+validateObj.minlength+"~"+validateObj.maxlength+'字符之间</small>';
                    }else{
                        if(validateObj.maxlength){
                            length_text= '<small class="help-block length_text" data-bv-validator="notEmpty" data-bv-for="name" data-bv-result="INVALID" style="display: none;">'+fieldName+'内容字数不能大于'+validateObj.maxlength+'个字符</small>';
                        }else{
                            length_text= '<small class="help-block length_text" data-bv-validator="notEmpty" data-bv-for="name" data-bv-result="INVALID" style="display: none;">'+fieldName+'内容字数不能小于'+validateObj.minlength+'个字符</small>';
                        }
                    }
                }
            }
            var html ='<div class="form-group component col-xs-'+fieldWidth+'"  '+disabled_str+'>'+
                    '<label class="col-lg-2 control-label">'+fieldName+("Y"==isbt?'<font class="redRequired" color="red">*</font>':'')+'</label>'+
                    '<div class="col-lg-10">'+
                    '<textarea class="form-control"   onkeydown="javascript:date_fun_dateDubbo(this);"  '+disabled_str+'   isnull="'+isbt+'"   ' +
                    this.getValidateHtml(validateObj,isbt,fieldName)+
                    ' key="extend_element" value="'+defaultVal+'" key_name="'+fieldName+'"  key_id="'+fieldKey+'" type="text" name="'+fieldKey+'" placeholder="'+(fieldName?fieldName:"")+'">'+definedDecodeURIComponent(defaultVal)+'</textarea>'+
                    '</div>'+
                    '</div>';
            return html;
        },date_input:function(fieldName,fieldKey,defaultVal,fieldWidth,disabled_str,validateObj,isbt,dbPM){
            defaultVal=getValueConversionDate(defaultVal,"yyyy-MM-dd");
            var minDate ="";
            var maxDate = "";
            if(validateObj){
                if(validateObj.minDate){
                    minDate=getParamsValue(validateObj.minDate,dbPM);
                }
                if(validateObj.maxDate){
                    maxDate=getParamsValue(validateObj.maxDate,dbPM);
                }
            }
            var html ='<div class="form-group component col-xs-'+fieldWidth+'"  '+disabled_str+'>'+
                    '<label class="col-lg-2 control-label">'+fieldName+("Y"==isbt?'<font class="redRequired" color="red">*</font>':'')+'</label>'+
                    '<div class="col-lg-10">'+
                    '<input class="form-control date-picker" autocomplete="off"   minDate="'+minDate+'" maxDate="'+maxDate+'"    '+disabled_str+' onkeydown="javascript:date_fun_dateDubbo(this);"  onblur="javascript:date_fun_dateBlur(this);"   '+this.getValidateHtml(validateObj,isbt,fieldName)+' key_name="'+fieldName+'"   key="extend_element" value="'+defaultVal+'" key_id="'+fieldKey+'" type="text" name="'+fieldKey+'" placeholder="'+(fieldName?fieldName:"")+'"' +
                    'db_type="date" format="yyyy-MM-dd">'+
                    '</div>'+
                    '</div>';
            return html;
        },datetime_input:function(fieldName,fieldKey,defaultVal,fieldWidth,disabled_str,validateObj,isbt,dbPM){
            defaultVal=getValueConversionDate(defaultVal,"yyyy-MM-dd HH:mm:ss");
            var minDate ="";
            var maxDate = "";
            if(validateObj){
                if(validateObj.minDate){
                    minDate=getParamsValue(validateObj.minDate,dbPM);
                }
                if(validateObj.maxDate){
                    maxDate=getParamsValue(validateObj.maxDate,dbPM);
                }
            }
            var html ='<div class="form-group component col-xs-'+fieldWidth+'"  '+disabled_str+'>'+
                    '<label class="col-lg-2 control-label">'+fieldName+("Y"==isbt?'<font class="redRequired" color="red">*</font>':'')+'</label>'+
                    '<div class="col-lg-10">'+
                    '<input class="form-control date-picker" autocomplete="off"  minDate="'+minDate+'" maxDate="'+maxDate+'"  '+disabled_str+' '+this.getValidateHtml(validateObj,isbt,fieldName)+'  onkeydown="javascript:date_fun_dateDubbo(this);"  onblur="javascript:date_fun_dateTimeBlur(this);"   key="extend_element"  key_name="'+fieldName+'"  value="'+defaultVal+'" key_id="'+fieldKey+'" type="text" name="'+fieldKey+'" placeholder="'+(fieldName?fieldName:"")+'"' +
                    'db_type="date" format="yyyy-MM-dd HH:mm:ss"'+
                    '</div>'+
                    '</div>';
            return html;
        },time_input:function(fieldName,fieldKey,defaultVal,fieldWidth,disabled_str,validateObj,isbt,dbPM){
            defaultVal=getValueConversionDate(defaultVal,"HH:mm:ss");
            var minDate ="";
            var maxDate = "";
            if(validateObj){
                if(validateObj.minDate){
                    minDate=getParamsValue(validateObj.minDate,dbPM);
                }F
                if(validateObj.maxDate){
                    maxDate=getParamsValue(validateObj.maxDate,dbPM);
                }
            }
            var html ='<div class="form-group component col-xs-'+fieldWidth+'"  '+disabled_str+'>'+
                    '<label class="col-lg-2 control-label">'+fieldName+("Y"==isbt?'<font class="redRequired" color="red">*</font>':'')+'</label>'+
                    '<div class="col-lg-10">'+
                    '<input class="form-control date-picker"  autocomplete="off" minDate="'+minDate+'" maxDate="'+maxDate+'"   '+disabled_str+'  key="extend_element" key_name="'+fieldName+'" onkeydown="javascript:date_fun_dateDubbo(this);"  value="'+defaultVal+'" key_id="'+fieldKey+'" '+this.getValidateHtml(validateObj,isbt,fieldName)+' type="text" name="'+fieldKey+'" placeholder="'+(fieldName?fieldName:"")+'"' +
                    'db_type="date" format="HH:mm:ss">'+
                    '<i class="fa fa-clendar" style="left: 122px"></i>'+
                    '</div>'+
                    '</div>';
            return html;
        },date:function(fieldName,fieldKey,defaultVal,fieldWidth,disabled_str,validateObj,isbt,dbPM,date_format){
            defaultVal=getValueConversionDate(defaultVal,"HH:mm:ss");
            var minDate ="";
            var maxDate = "";
            if(validateObj){
                if(validateObj.minDate){
                    minDate=getParamsValue(validateObj.minDate,dbPM);
                }
                if(validateObj.maxDate){
                    maxDate=getParamsValue(validateObj.maxDate,dbPM);
                }
            }
            var html ='<div class="form-group component col-xs-'+fieldWidth+'"  '+disabled_str+'>'+
                    '<label class="col-lg-2 control-label">'+fieldName+("Y"==isbt?'<font class="redRequired" color="red">*</font>':'')+'</label>'+
                    '<div class="col-lg-10">'+
                    '<input class="form-control date-picker" autocomplete="off"  minDate="'+minDate+'" maxDate="'+maxDate+'"   '+disabled_str+'  key="extend_element" key_name="'+fieldName+'" onkeydown="javascript:date_fun_dateDubbo(this);"  value="'+defaultVal+'" key_id="'+fieldKey+'" '+this.getValidateHtml(validateObj,isbt,fieldName)+' type="text" name="'+fieldKey+'" placeholder="'+(fieldName?fieldName:"")+'"' +
                    'db_type="date" format="'+date_format+'">'+
                    '<i class="fa fa-calendar" style="left: 122px"></i>'+
                    '</div>'+
                    '</div>';
            return html;
        },upfile:function(fieldName,fieldKey,defaultVal,fieldWidth,disabled_str){
            var html ='<div class="form-group component col-xs-'+fieldWidth+'"  '+disabled_str+'>'+
                    '<label class="col-lg-2 control-label">'+fieldName+'</label>'+
                    '<div class="col-lg-10">'+
                    '<input class="form-control" upType="file" style="display:none;"  '+disabled_str+' key="extend_element"' +
                    "value='"+defaultVal+"' url_value='"+defaultVal+"'"+
                    'key_id="'+fieldName+'" class="file" type="file" multiple  data-show-upload="false" data-show-caption="true" key_name="'+fieldKey+'" name="file_data" placeholder="'+(fieldName?fieldName:"")+'"><div key="upload"></div>'+
                    '</div>'+
                    '</div>';
            return html;
        },uppicture:function(fieldName,fieldKey,defaultVal,fieldWidth,disabled_str){
            var html ='<div class="form-group component col-xs-'+fieldWidth+'">'+
                    '<div style="width:100%">'+
                    '<label style="line-height: 24px;">'+fieldName+'</label>'+
                    '<input class="form-control" upType="pic" style="display:none;"  '+disabled_str+' key="extend_element" value="'+defaultVal+'" url_value="'+defaultVal+'" key_id="'+fieldName+'" class="file" type="file" multiple  data-show-upload="false" data-show-caption="true" key_name="'+fieldKey+'" name="file_data" placeholder="'+(fieldName?fieldName:"")+'"><div key="upload"></div>'+
                    '</div></div>';

            var html ='<div class="form-group component col-xs-'+fieldWidth+'"  '+disabled_str+'>'+
                    '<label class="col-lg-2 control-label">'+fieldName+'</label>'+
                    '<div class="col-lg-10">'+
                    '<input class="form-control" upType="pic" style="display:none;"  '+disabled_str+' key="extend_element" value="'+defaultVal+'" url_value="'+defaultVal+'" key_id="'+fieldName+'" class="file" type="file" multiple  data-show-upload="false" data-show-caption="true" key_name="'+fieldKey+'" name="file_data" placeholder="'+(fieldName?fieldName:"")+'"><div key="upload"></div>'+
                    '</div>'+
                    '</div>';
            return html;
        },input:function(fieldName,fieldKey,defaultVal,fieldWidth,disabled_str,validateObj,isbt){
            var html ='<div class="form-group component col-xs-'+fieldWidth+'"  '+disabled_str+'>'+
                    '<label class="col-lg-2 control-label">'+fieldName+("Y"==isbt?'<font class="redRequired" color="red">*</font>':'')+'</label>'+
                    '<div class="col-lg-10">'+
                    '<input class="form-control"  '+disabled_str+'  onkeydown="javascript:date_fun_dateDubbo(this);"    key="extend_element" key_name="'+fieldName+'" value="'+defaultVal+'" key_id="'+fieldName+'" '+this.getValidateHtml(validateObj,isbt,fieldName)+' name="'+fieldKey+'" placeholder="'+(fieldName?fieldName:"")+'">' +
                    '</div>'+
                    '</div>';
            return html;
        },getValidateHtml:function(validateObj,isbt,fieldName){
            var html = '';
            if("Y"==isbt){
                html+=' data-bv-notempty="true"';
                html+=' data-bv-notempty-message="'+fieldName+'不能为空"';
            }
            if(validateObj){
                if(validateObj && validateObj.validate){
                    if(validateObj.validate=="id_card"){
                        html+=' pattern="^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$|^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}([0-9]|X)$"  data-bv-regexp-message="'+fieldName+'格式不正确"';
                    }else if(validateObj.validate=="mobile"){
                        html+=' pattern="^(1\\d{10})$"  data-bv-regexp-message="'+fieldName+'格式不正确"';
                    }else if(validateObj.validate=="age"){
                        html+=' min="0"  data-bv-greaterthan-inclusive="false"  data-bv-greaterthan-message="'+fieldName+'不能小于0"';
                        html+=' max="120"  data-bv-lessthan-inclusive="false"   data-bv-lessthan-message="'+fieldName+'不能大于120"';
                    }else if(validateObj.validate=="email"){
                        html+=' type="email" data-bv-emailaddress-message="'+fieldName+'不是邮箱格式"';
                    }else if(validateObj.validate=="integer"){
                        html+=' pattern="^[0-9]+$"  data-bv-regexp-message="'+fieldName+'只能输入数字"';
                    }else if(validateObj.validate=="number"){
                        html+=' pattern="^((-?[0-9]+|0)\\.([0-9]+)$)|^(-?[0-9]+|0)$"  data-bv-regexp-message="'+fieldName+'只能输入数字和小数"';
                    }
                }
                if(validateObj.minlength || validateObj.maxlength ){
                    html+=' data-bv-stringlength="true"';
                    if(validateObj.minlength && validateObj.maxlength){
                        html+=' data-bv-stringlength-min="'+validateObj.minlength+'" data-bv-stringlength-max="'+validateObj.maxlength+'"  data-bv-stringlength-message="'+fieldName+'长度在'+validateObj.minlength+'~'+validateObj.maxlength+'个字符之间"';
                    }else{
                        if(validateObj.minlength){
                            html+=' data-bv-stringlength-min="'+validateObj.minlength+'" data-bv-stringlength-message="'+fieldName+'长度不能小于'+validateObj.minlength+'字符"';
                        }
                        if(validateObj.maxlength){
                            html+=' data-bv-stringlength-max="'+validateObj.maxlength+'" data-bv-stringlength-message="'+fieldName+'长度不能大于'+validateObj.maxlength+'字符"';
                        }
                    }
                }
            }
            return html;
        },
        definedValidate:function(formDiv){
            var divObj = $("#"+formDiv);
            var isyes = true;
            divObj.find("select[key=extend_element]").each(function(i,obj){
                obj = $(obj);
                if(!createHtml.validateSelect(obj)){
                    isyes=false;
                }
            });
            divObj.find("div[key=extend_element]").each(function(i,obj){
                obj = $(obj);
                if(!createHtml.validateCheckAndRadio(obj)){
                    isyes=false;
                }
            });
            divObj.find("textarea[key=extend_element]").each(function(i,obj){
                obj = $(obj);
                if(!createHtml.validateTextarea(obj)){
                    isyes=false;
                }
            });
            divObj.find("input[htmlType=SEARCH_SELECT]").each(function(i,obj){
                obj = $(obj);
                if(!createHtml.validateSelect(obj)){
                    isyes=false;
                }
            });
            return isyes;
        },validateSelect:function(obj){
            var thisYes =true;
            var parentObj = obj.parents(".form-group");
            var value = obj.val();
            if("Y"==obj.attr("isnull")){
                if(!value){
                    thisYes=false;
                    parentObj.removeClass("has-error");
                    parentObj.removeClass("has-success");
                    parentObj .addClass("has-error");
                    parentObj.find(".glyphicon-remove").show();
                    parentObj.find(".isnull_text").show();
                    parentObj.find(".glyphicon-ok").hide();
                }else{
                    parentObj.removeClass("has-error");
                    parentObj.removeClass("has-success");
                    parentObj.addClass("has-success");
                    parentObj.find(".glyphicon-remove").hide();
                    parentObj.find(".isnull_text").hide();
                    parentObj.find(".glyphicon-ok").show();
                }
            }
            return thisYes;
        },validateInput:function(obj){
            var thisYes =true;
            var parentObj = obj.parents(".form-group");
            var value = obj.val();
            if("Y"==obj.attr("isnull")){
                if(!value){
                    thisYes=false;
                    parentObj.removeClass("has-error");
                    parentObj.removeClass("has-success");
                    parentObj .addClass("has-error");
                    parentObj.find(".glyphicon-remove").show();
                    parentObj.find(".isnull_text").show();
                    parentObj.find(".glyphicon-ok").hide();
                }else{
                    parentObj.removeClass("has-error");
                    parentObj.removeClass("has-success");
                    parentObj.addClass("has-success");
                    parentObj.find(".glyphicon-remove").hide();
                    parentObj.find(".isnull_text").hide();
                    parentObj.find(".glyphicon-ok").show();
                }
            }
            return thisYes;
        },validateCheckAndRadio:function(obj){
            var thisYes =true;
            var keyType=obj.attr("key_type")
            if("checkbox"==keyType || "radio"==keyType){
                var isnull=obj.attr("isnull");
                if("Y"==isnull){
                    var parentObj=obj;
                    var yesSelect=false;
                    obj.find("input").each(function(i,obj){
                        if(obj.checked){
                            yesSelect=true;
                        }
                    });
                    if(yesSelect){
                        parentObj.removeClass("has-error");
                        parentObj.removeClass("has-success");
                        parentObj.addClass("has-success");
                        parentObj.find(".glyphicon-remove").hide();
                        parentObj.find(".isnull_text").hide();
                        parentObj.find(".glyphicon-ok").show();
                    }else{
                        thisYes=false;
                        parentObj.removeClass("has-error");
                        parentObj.removeClass("has-success");
                        parentObj .addClass("has-error");
                        parentObj.find(".glyphicon-remove").show();
                        parentObj.find(".isnull_text").show();
                        parentObj.find(".glyphicon-ok").hide();
                    }
                }
            }
            return thisYes;
        },validateTextarea:function(obj){
            var thisYes=true;
            var minlength=obj.attr("minlength");
            var maxlength=obj.attr("maxlength");
            var isnull = obj.attr("isnull");
            if(minlength || maxlength || isnull){
                var value = obj.val();
                var parentObj = obj.parents(".form-group");
                if("Y"==obj.attr("isnull")){
                    if(!value){
                        thisYes=false;
                        parentObj .removeClass("has-error");
                        parentObj .removeClass("has-success");
                        parentObj .addClass("has-error");
                        parentObj.find(".glyphicon-remove").show();
                        parentObj.find(".isnull_text").show();
                        parentObj.find(".length_text").hide();
                        parentObj.find(".glyphicon-ok").hide();
                    }
                }
                if(thisYes){
                    if(minlength && (value.length)<(minlength*1)){
                        thisYes=false;
                        parentObj .removeClass("has-error");
                        parentObj .removeClass("has-success");
                        parentObj .addClass("has-error");
                        parentObj.find(".glyphicon-remove").show();
                        parentObj.find(".isnull_text").hide();
                        parentObj.find(".length_text").show();
                        parentObj.find(".glyphicon-ok").hide();
                    }
                }
                if(thisYes){
                    if(maxlength && (value.length)>(maxlength*1)){
                        thisYes=false;
                        parentObj .removeClass("has-error");
                        parentObj .removeClass("has-success");
                        parentObj .addClass("has-error");
                        parentObj.find(".glyphicon-remove").show();
                        parentObj.find(".isnull_text").hide();
                        parentObj.find(".length_text").show();
                        parentObj.find(".glyphicon-ok").hide();
                    }
                }
                if(thisYes){
                    parentObj.removeClass("has-error");
                    parentObj .removeClass("has-success");
                    parentObj.addClass("has-success");
                    parentObj.find(".glyphicon-remove").hide();
                    parentObj.find(".isnull_text").hide();
                    parentObj.find(".length_text").hide();
                    parentObj.find(".glyphicon-ok").show();
                }
            }
            return thisYes;
        },
        jlChangClean:function(wordbook){
            var s
            if(wordbook && wordbook.setting && wordbook.setting.cascading &&  wordbook.setting.cascading.length>0){
                for(var i=0;i< wordbook.setting.cascading.length;i++){
                    var asobj = wordbook.setting.cascading[i];
                    if(asobj["form.name"] && asobj['value']){
                        $($("[key_name='"+asobj["form.name"]+"']")[0]).val("");
                    }
                }
            }
        },
        jlChangBak:function(wordbook,data){
            if(wordbook && wordbook.setting &&  wordbook.setting.cascading &&  wordbook.setting.cascading.length>0){
                for(var i=0;i< wordbook.setting.cascading.length;i++){
                    var asobj = wordbook.setting.cascading[i];
                    if(asobj["form.name"] && asobj['value'] && data[ asobj['value']]){
                        $($("[key_name='"+asobj["form.name"]+"']")[0]).val(data[ asobj['value']]);
                    }
                }
            }
        },init_obj:{
            initDate:function(q,isTwo){
                var format=$(q).attr("format");
                if(!format){
                    format="yyyy-MM-dd HH:mm:ss";
                }
                var type="datetime";
                if(format=="yyyy-MM-dd"){
                    type="date";
                }else if(format=="yyyy-MM"){
                    type="month";
                }else if(format=="HH:mm:ss"){
                    type="time";
                }
                var min = $(q).attr("minDate");
                var max = $(q).attr("maxDate");
                var setting={
                    elem:q,
                    format:format,
                    type:type,
                    done: function(value, date, endDate){
                        $(q).val(value);
                        //$(q).focus();
                        setTimeout(function(){$(q).blur();},100);
                    }
                };
                if(min){	//最小日期
                    if(min=="currTime"){	//当前时间
                        min = dateFormat(new Date()+"");
                    }
                    setting['min']=min;
                }
                if(max){	//最大日期
                    if(max=="currTime"){	//当前时间
                        max = dateFormat(new Date()+"");
                    }
                    setting['max']=max;
                }

                laydate.render(setting);
            }
        }
    };

    function getValueConversionDate(value,format){
        if(value && /^[0-9]+$/.test(value)){
            try{
                var date=new Date(value);
                return date.format(format);
            }catch(e){}
        }
        return value;
    }
    function  getParamsValue(keys,dbPM){
        if(keys && keys.indexOf(".")!=-1){
            var key = keys.split(".")[0];
            var key2 =keys.split(".")[1];
            if(dbPM[key] && dbPM[key][key2]){
                return dbPM[key][key2];
            }
        }
        return keys;
    }

    function initUPPic(fileObj,img,selectFileBakFun,successBakFun,buttonText){
        var displayTxt="";
        if(selectFileBakFun || successBakFun){
            displayTxt="display:none;";
        }
        var initImg = getInitImg(img);
        var div =$(fileObj.parent().find("div[key=upload]")[0]);
        var createHtml='<div class="picture-wrap"><div class="col click_button"><input id="fileImage" style="display: none;" type="file" size="30" name="fileselect[]"  multiple><div class="img-box btn-img-box click_picture"><a href="javascript:void(0);" class="btn btn-warning  btn-circle btn-lg"><i class="glyphicon glyphicon-camera"></i></a></div></div></div>';
        div.zyUpload({
            url              :    '/crmweb/cloud/upload/hospital/hospital', //上传的地址
            initUrl:initImg,
            multiple         :   true,                    // 是否可以多个文件上传
            suffix:"jpg,png,gif,jpeg",
            createHtml:createHtml,
            clickClass:"click_picture",
            /* 外部获得的回调接口 */
            onSelect: function(files, allFiles,boj,ZYFILE){
                var i = 0;
                var html = '', i = 0;
                // 组织预览html
                var funDealtPreviewHtml = function(fList) {
                    for(var z=0;z<fList.length;z++){
                        var file = fList[z];
                        var reader = new FileReader();
                        reader.onload = function(e) {
                            html+=  '<div class="col" style="'+displayTxt+'" key="'+file.index+'">'+
                            '<div class="img-box">'+
                            '<div class="shadow-bg">'+
                            '<i class="fa fa-spinner fa-spin"></i>'+
                            '</div>'+
                            '<img src="'+e.target.result+'" alt=""/><em class="removePic" index="'+file.index+'" mark="1" title="删除"><i class="glyphicon glyphicon-remove"></i></em><input type="hidden" key="url">' +
                            '</div>' +
                            '</div>';
                            i++;
                            $(boj).find(".click_button").before(html);
                            $(boj).find(".removePic").bind("click",function(){
                                var obj = $(this);
                                if(obj.attr("mark")=="1"){
                                    var index = $(this).attr("index");
                                    $(this).parent().parent().remove();
                                    ZYFILE.funDeleteFile(index,false);
                                    obj.attr("mark","0");
                                }
                            });
                            if(selectFileBakFun){
                                selectFileBakFun(file,e.target.result,fileObj);
                            }
                        }
                        reader.readAsDataURL(file);
                    }
                };
                function funAppendPreviewHtml(){
                    for(var z=0;z<files.length;z++){
                        try{
                            ZYFILE.funUploadFile(files[z]);
                        }catch(e){console.log("error:\t"+e);}
                    }
                    funDealtPreviewHtml(files);
                }
                funAppendPreviewHtml();
            },
            onDelete: function(file, surplusFiles){                     // 删除一个文件的回调方法
                console.info("当前删除了此文件：");
                console.info(file);
                console.info("当前剩余的文件：");
                console.info(surplusFiles);
            },
            initImg:function(files,boj){
                if(!files || files.length==0)
                    return;
                var html = "";
                for(var i=0;i<files.length;i++){
                    var file = files[i];
                    html+=  '<div class="col" key="'+file.index+'">'+
                    '<div class="img-box">'+
                    '<div class="shadow-bg" style="display: none">'+
                    '<i class="fa fa-spinner fa-spin"></i>'+
                    '</div>'+
                    '<img src="'+file.url+'" alt=""/><em onclick="javascript:$(this).parent().parent().remove();"><i class="glyphicon glyphicon-trash"></i></em><input type="hidden" key="url" value="'+file.url+'">' +
                    '</div>' +
                    '</div>';
                }
                $(boj).find(".click_button").before(html);
            },
            onSuccess: function(file, response,obj){                    // 文件上传成功的回调方法
                var obj = $(obj);
                var index=file.index;
                if(response){
                    response=eval('('+response+')');
                }
                if(response.status==true){
                    var divObj=$(obj.find("div[key='"+index+"']")[0]);
                    divObj.find("img").attr("src",response.url);
                    divObj.find("input").val(response.url);
                    divObj.find(".shadow-bg").hide();
                    if(successBakFun){
                        successBakFun(file,response,fileObj);
                    }
                }else{
                    alert("上传失败");
                }
            },
            onFailure: function(file){                    // 文件上传失败的回调方法
                console.info("此文件上传失败：");
                console.info(file);
            },
            onComplete: function(responseInfo){           // 上传完成的回调方法
                console.info("文件上传完成");
                console.info(responseInfo);
            }
        });

        function getInitImg(img){
            var initImg=[];
            if(img){
                img = $.trim(img);
                if(img.length>0){
                    var img_array = img.split(",");
                    for(var i=0;i<img_array.length;i++){
                        var url = $.trim(img_array[i]);
                        if(url){
                            initImg.push({index:"init_"+i,url:url});
                        }
                    }
                }
            }
            return initImg;
        }
    }
    /**
     * 文件上传  新增回调方法
     * selectFileBakFun 选择文件后回调  入参 fiel={id,name,size文件信息}
     * successBakFun 上传成功后回调   入参  file ,response={url：上传后的文件地址}
     * **/
    function initUPFile(fileObj,fileStr,selectFileBakFun,successBakFun,buttonText){
        var files = getInitFile(fileStr);
        var div =$(fileObj.parent().find("div[key=upload]")[0]);
        var btxt = "添加附件";
        if(buttonText){
            btxt=buttonText;
        }
        var createHtml='<div class="container-fluid fujian-wrap">'+
                '<input  style="display: none;" type="file" size="30" name="fileselect[]"  multiple>'+
                '<span class="icon-right add-fj click_up_file">'+
                '<a class="btn btn-link" href="javascript:void(0);"><i class="glyphicon glyphicon-paperclip"></i>'+btxt+'</a>'+
                '</span>'+
                '</div>'
        div.zyUpload({
            url              :    '/crmweb/cloud/upload/hospital/uploadFile', //上传的地址
            initUrl:files,
            clickClass:"click_up_file",
            multiple         :   true,                    // 是否可以多个文件上传
            createHtml:createHtml,
            /* 外部获得的回调接口 */
            onSelect: function(files, allFiles,boj,ZYFILE){
                var html = '';
                var displayTxt="";
                if(selectFileBakFun || successBakFun){
                    displayTxt="display:none;";
                }
                if(files && files.length>0){
                    for(var i=0;i<files.length;i++){
                        var file = files[i];
                        var index = file.index;
                        var name = file.name;
                        var size = getSize(file.size);
                        html+=  '<span class="icon-right" style="'+displayTxt+'" key="'+index+'">'+
                        '<a class="btn btn-link" href="javascript:void(0);"><i class="glyphicon glyphicon-paperclip"></i> '+name+'('+size+')</a>' +
                        '<i class="fa fa-spinner fa-spin"></i>'+
                        '<i class="fa fa-close removeFile" mark="1" index="'+index+'" onclick="javascript:$(this).parent().remove();">删除</i>'+
                        '<input type="hidden" name="'+name+'" size="'+size+'" key="url">'+
                        '</span>'

                    }
                }
                $(boj).find(".fujian-wrap").append(html);
                $(boj).find(".removeFile").each(function(i,obj){
                    obj = $(obj);
                    if(obj.attr("mark")=="1"){
                        obj.bind("click",function(){
                            var index = $(this).attr("index");
                            $(this).parent().remove();
                            ZYFILE.funDeleteFile(index,false);
                        }) ;
                        obj.attr("mark","0");
                    }
                });
                for(var i=0;i<files.length;i++) {
                    var file = files[i];
                    if(selectFileBakFun){
                        selectFileBakFun(file,fileObj);
                    }
                    try{
                        ZYFILE.funUploadFile(file);
                    }catch(e){console.log("error:\t"+e);}
                }
            },
            onDelete: function(file, surplusFiles){                     // 删除一个文件的回调方法
                console.info("当前删除了此文件：");
                console.info(file);
                console.info("当前剩余的文件：");
                console.info(surplusFiles);
            },
            initImg:function(files,boj){
                if(files && files.length>0){
                    var html ="";
                    for(var i=0;i<files.length;i++){
                        var file = files[i];
                        var name = file.name;
                        var size = file.size;
                        var url = file.url;
                        var index="init_"+i;;
                        html+=  '<span class="icon-right" key="'+index+'">'+
                        '<a class="btn btn-link" href="javascript:void(0);"><i class="glyphicon glyphicon-paperclip"></i> '+name+'('+size+')</a>' +
                        '<i class="fa fa-spinner fa-spin" style="display:none;"></i>'+
                        '<i class="fa fa-close removeFile" mark="1" index="'+index+'" onclick="javascript:$(this).parent().remove();">删除</i>'+
                        '<input type="hidden" value="'+url+'"  name="'+name+'" size="'+size+'" key="url">'+
                        '</span>'
                    }
                    $(boj).find(".fujian-wrap").append(html);
                }
            },
            onSuccess: function(file, response,obj){                    // 文件上传成功的回调方法
                var obj = $(obj);
                var index=file.index;
                if(response){
                    response=eval('('+response+')');
                }
                if(response.status==true){
                    if(successBakFun){
                        successBakFun(file,response,fileObj);
                    }else{
                        var divObj=$(obj.find("span[key='"+index+"']")[0]);
                        divObj.find(".fa-spin").hide();
                        $(divObj.find("input")[0]).val(response.url);
                    }
                }else{
                    alert("上传失败");
                }
            },
            onFailure: function(file){                    // 文件上传失败的回调方法
                console.info("此文件上传失败：");
                console.info(file);
            },
            onComplete: function(responseInfo){           // 上传完成的回调方法
                console.info("文件上传完成");
                console.info(responseInfo);
            }
        });

        function getInitFile(fileStr){
            if(fileStr){
                var files = eval('('+fileStr+')');
                return files;
            }
        }
    }

    function getSize(size){
        if(size && size>0){
            if (size > 1024 * 1024) {
                size = (Math.round(size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
            } else {
                size = (Math.round(size * 100 / 1024) / 100).toString() + 'KB';
            }
        }
        return size;
    }



   