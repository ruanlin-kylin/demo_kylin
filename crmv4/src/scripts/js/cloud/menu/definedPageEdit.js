var curDate;
    var initImage={
        // 'PIE':'/crmweb/lib/drag/page/example/images/pie-chart.png',			//饼图
        // 'BAR':'/crmweb/lib/drag/page/example/images/rectangle-chart.png',	//柱状图
        // 'LINE':'/crmweb/lib/drag/page/example/images/line-chart.png',		//折线图
        // 'NUMBER':'/crmweb/lib/drag/page/example/images/digit-chart.png',	//数字组件
        // 'LIST':'/crmweb/lib/drag/page/example/images/list-chart.png'		//列表
        'PIE':'/crmweb/lib/drag/page/example/images/pie-chart.png',			//饼图
        'BAR':'../../../../src/scripts/js/plug-in/dragHomePage/page/example/images/rectangle-chart.png',	//柱状图
        'LINE':'/crmweb/lib/drag/page/example/images/line-chart.png',		//折线图
        'NUMBER':'/crmweb/lib/drag/page/example/images/digit-chart.png',	//数字组件
        'LIST':'/crmweb/lib/drag/page/example/images/list-chart.png'		//列表
    };
    var initData=[
        {
            id: 1,
            x: 0,
            y: 0,
            w: 1,
            h: 1,
            text: '折线图',
            image:initImage.LINE,
            available: true,
            // fixed:true,
            data: {'name':'折线图','comType':'LINE'}
        },
        {
            id: 2,
            x: 0,
            y: 0,
            w: 1,
            h: 1,
            text: '柱状图',
            image:initImage.BAR,
            available: true,
            // fixed:true,
            comp: 'dummy-blue',
            data: {'name':'柱状图','comType':'BAR'}
        },
        {
            id: 3,
            x: 0,
            y: 0,
            w: 1,
            h: 1,
            text: '饼状图',
            image:initImage.PIE,
            available: true,
            // fixed:true,
            comp: 'dummy-blue',
            data: {'name':'饼状图','comType':'PIE'}
        },
        {
            id: 5,
            x: 0,
            y: 0,
            w: 1,
            h: 1,
            text: '列表',
            image:initImage.LIST,
            available: true,
            // fixed:true,
            comp: 'dummy-red',
            data: {'name':'列表','comType':'LIST'}
        },
        {
            id: 6,
            x: 0,
            y: 0,
            w: 1,
            h: 1,
            text: '数字',
            image:initImage.NUMBER,
            available: true,
            // fixed:true,
            comp: 'dummy-red',
            data: {'name':'数字','comType':'NUMBER'}
        }
    ];
    ddgridControl.ready(function(){
        ddgridControl.setOption(5,4,150);
        ddgridControl.addListener('areaSettingClick',function(event,obj,data){
            curDate=data;
            showForm(data);
        });
        //ddgridControl.loadItemData(initData);		//初始化右侧菜单
        reloadItem(ddgridControl,getUrlParams());	//初始化
    });
    function reloadItem(ddgridControl,urlParams){
        var urlParams = getUrlParams();
        var id;
        if(urlParams && urlParams.id){
            id=urlParams.id;
            $("#id").val(id);
        }
        if(id){
            $.get(ctx+"/cloud/defined/page/getPageById/"+id,function(json){
                if(json.result=="SUCCESS"){
                    var oldItems = [];
                    if(json.map && json.map.page){
                        var page = json.map.page;
                        var sourceText=page.sourceText;
                        $("#pageName").val(page.name);
                        if(sourceText){
                            oldItems = JSON.parse(sourceText);
                        }
                    }
                    /* for(var i=0;i<10;i++){
                     var id = i+1;
                     var isOk = 0;
                     if(oldItems && oldItems.length>0){
                     for(var z=0;z<oldItems.length;z++){
                     if(oldItems[z].id==id){
                     isOk=1;
                     }
                     }
                     }
                     if(!isOk){
                     oldItems.push({id: id,x: 0,y: 0,w: 2,h: 1,text: '',available: true,data: { content: '' }});
                     }
                     } */
                    initData.push.apply(initData,oldItems);
                    ddgridControl.loadItemData(initData);
                }else{
                    Notify(json.resultMsg, 'top-right', '5000', 'danger', 'fa-list', true);
                }
            });
        }else{
            ddgridControl.loadItemData(initData);
        }
    }
    function getUrlParams(){
        var href_url=window.location.href;
        var data={};
        if(href_url && href_url.split("?").length==2) {
            pmStr = $.trim(href_url.split("?")[1]);
            var cur_id;
            for (var i = 0; i < pmStr.split("&").length; i++) {
                var str_val = pmStr.split("&")[i];
                if (str_val && str_val.split("=") != -1) {
                    data[str_val.split("=")[0]]=str_val.split("=")[1];
                }
            }
        }
        return data;
    }
    function submit(){
        var itemsAll=ddgridControl.getItems();
        var items=[];
        for(var i=0;i<itemsAll.length;i++){
            var item = itemsAll[i];
            if(!item.available){
                items.push(item);
            }
        }
        var htmlText = getHtml(items);
        var id = $("#id").val();
        var pageName = $("#pageName").val();
        if(!pageName){
            Notify('首页名称不能为空', 'top-right', '5000', 'danger', 'fa-list', true);
            return;
        }
        $.post(ctx+"/cloud/defined/page/save",{id:id,name:pageName,sourceText:JSON.stringify(items),htmlText:htmlText},function(json){
            if(json.result=="SUCCESS"){
                $("#id").val(json.map.page.id);
                Notify('保存成功', 'top-right', '5000', 'success', 'fa-list', true);
            }else{
                Notify(json.resultMsg, 'top-right', '5000', 'danger', 'fa-list', true);
            }
        });
    }

    function getHtml(items){
        var html = '';
        for(var i=0;i<items.length;i++){
            var item = items[i];
            if(!item.available){
                item.data['w']=item.w;
                item.data['h']=item.h;
                var top = (item.y*150)+"px";
                var left = (item.x*25)+"%";
                var width = (item.w*25)+"%";
                var height = (item.h*150)+"px";
                html+='<div class="chacheli" style="top: '+top+'; left:'+left+'; width: '+width+'; height: '+height+';position: absolute;">'+item.text+'<div class="config" style="display: none;">'+JSON.stringify(item.data)+'</div></div>';
            }
        }
        return '<div class="chacheli-layout" style="position: relative;">'+html+"</div>";
    }
    function showForm(data){
        document.getElementById("formObj").reset();
        $("#groupField").html('<option value="">分类依据</option>');
        $("#childGroupField").html('<option value="">子分类依据</option>');
        $("#countFiled").html('<option value="">统计数据</option>');
        if(data && data.data){
            for(var i in data.data){
                if(data.data[i]){
                    $("#"+i).val(data.data[i]);
                    if("dataSource"==i){
                        $("#dataSource").change();
                    }
                }
            }
            $("#comType").change();
            $("#groupType").change();
        }
        $("#addFormModal").modal();
    }

    //条件过滤器全局变量
    var fieldList,fieldTypeList;
    allFieldSearch=true;	//所有字段都可以作为过滤条件，覆盖filter.js中的默认值
    $(function(){
        //获取字段类型列表
        $.post(ctx+"/cloud/behind/stableListConfig/getFieldType",function(json){
            if(json.result=="Success" || json.result=="SUCCESS"){
                fieldTypeList=json.list;
            }else{
                tipsMsg(json.resultMsg,"FAIL");
            }
        });

        $("#comType").bind("change",function(){
            var me = $(this);
            var value=me.val();
            if(value){
                if("LIST"==value){
                    $("div[key=groupType]").hide();
                    $("div[key=groupField]").hide();
                    $("div[key=childGroupField]").hide();
                    $("div[key=countFiled]").hide();
                }else{
                    $("div[key=groupType]").show();
                    $("div[key=groupField]").show();
                    $("div[key=childGroupField]").show();
                    $("div[key=countFiled]").show();
                    if("NUMBER"==value){
                        $("div[key=groupType]").hide();
                        $("div[key=groupField]").hide();
                        $("div[key=childGroupField]").hide();
                        $("div[key=countFiled]").show();
                    }else if("PIE"==value){
                        $("div[key=groupType]").hide();
                        $("div[key=groupField]").show();
                        $("div[key=childGroupField]").hide();
                        $("div[key=countFiled]").show();
                    }else{
                        $("div[key=groupType]").show();
                        $("div[key=groupField]").show();
                        $("div[key=childGroupField]").hide();
                        $("div[key=countFiled]").show();
                    }
                }
            }
        });
        $("#groupType").bind("change",function(){
            var me = $(this);
            var value=me.val();
            if(value){
                if("1"==value){
                    $("div[key=childGroupField]").hide();
                }else{
                    $("div[key=childGroupField]").show();
                }
            }
        });

        $("#dataSource").bind("change",function(){
            var me = $(this);
            var value=me.val();
            $("#groupField").html('<option value="">分类依据</option>');
            $("#childGroupField").html('<option value="">子分类依据</option>');
            $("#countFiled").html('<option value="count(*)" title="数量">数量</option>');
            $("#filterCondition").val("");	//清空过滤条件
            if(value){
                $.post(ctx+'/cloud/table/list/reader/getConfigDetail/'+value,function(json){
                    if(json.result=="SUCCESS"){
                        if(json.map && json.map.config){
                            var config= json.map.config;
                            fieldList = config.fieldList;
                            if(fieldList && fieldList.length>0){
                                for(var i=0;i<fieldList.length;i++){
                                    var fobj = fieldList[i];
                                    var columnName = fobj.columnName;
                                    var title = fobj.title;
                                    var type =fobj.fieldType;
                                    var groupFieldSelect=(curDate && curDate.data && curDate.data.groupField && curDate.data.groupField==columnName)?"selected":"";
                                    var childGroupFieldSelect=(curDate && curDate.data && curDate.data.childGroupField && curDate.data.childGroupField==columnName)?"selected":"";
                                    var countFiledSelect=(curDate && curDate.data && curDate.data.countFiled && curDate.data.countFiled==columnName)?"selected":"";
                                    $("#groupField").append('<option type="'+fobj.fieldType+'" '+groupFieldSelect+' value="'+columnName+'">'+columnName+"("+title+")</option>");
                                    $("#childGroupField").append('<option  '+childGroupFieldSelect+' value="'+columnName+'" >'+columnName+"("+title+")</option>");
                                    if("NUMBER"==type){
                                        $("#countFiled").append('<option '+countFiledSelect+' value="'+columnName+'" title="'+(title)+'">'+columnName+"("+title+")</option>");
                                    }
                                }
                            }
                            $("#groupField").change();
                        }
                    }
                });
            }
        });
        $("#groupField").bind("change",function(){
            var me = $(this);
            var type=me.find("option:selected").attr("type");
            if("DATE"==type || "DATETIME"==type) {
                $("div[key=groupField_setting]").show();
            }else{
                $("div[key=groupField_setting]").hide();
            }
        });


        $.post(ctx+'/cloud/table/list/reader/getAllConfig',function(json){
            if(json.result=="SUCCESS"){
                var list=json.list;
                if(list && list.length>0){
                    for(var i=0;i<list.length;i++){
                        var obj = list[i];
                        $("#dataSource").append('<option value="'+obj.id+'">'+obj.name+'</option>');
                    }
                }
            }
        });

        $(".btn-submit-setting").bind("click",function(){
            var comType = $("#comType").val();
            var dataSource = $("#dataSource").val();
            var filterCondition = $("#filterCondition").val();
            var groupType = $("#groupType").val();
            var groupField = $("#groupField").val();
            var childGroupField = $("#childGroupField").val();
            var countFiled = $("#countFiled").val();
            if(!comType){
                Notify('选择组件类型', 'top-right', '5000', 'danger', 'fa-list', true);
                return ;
            }
            if(!dataSource){
                Notify('选择数据源', 'top-right', '5000', 'danger', 'fa-list', true);
                return ;
            }
            if("NUMBER"==comType){
                if(!countFiled){
                    Notify('选择统计数据', 'top-right', '5000', 'danger', 'fa-list', true);
                    return ;
                }
            }else{
                if("LIST"!=comType){
                    if(!groupType){
                        Notify('选择分类层级', 'top-right', '5000', 'danger', 'fa-list', true);
                        return ;
                    }
                    if(!groupField){
                        Notify('选择分类依据', 'top-right', '5000', 'danger', 'fa-list', true);
                        return ;
                    }
                    if(!countFiled){
                        Notify('选择统计数据', 'top-right', '5000', 'danger', 'fa-list', true);
                        return ;
                    }
                    if("2"==groupType && !childGroupField){
                        Notify('选择子分类依据', 'top-right', '5000', 'danger', 'fa-list', true);
                        return ;
                    }else{
                        if("1"==groupType){
                            childGroupField="";
                        }
                    }
                }
            }
            var data = {group_order:$("#group_order").val(),groupMode:$("#groupMode").val(),name:$("#name").val(),content:$("#name").val(),comType:comType,dataSource:dataSource,groupType:groupType,groupField:groupField,childGroupField:childGroupField,countFiled:countFiled,filterCondition:filterCondition};
            data['countFiled_desc']= $("#countFiled").find("option:selected").attr("title");
            curDate.data=data;
            curDate.image=initImage[comType];
            curDate.text=$("#name").val();
            $("#addFormModal").modal("hide");
        });

        //单击过滤条件设置按钮
        $(".btn-set-condition").bind("click",function(){
            var dataSource = $("#dataSource").val();
            if(!dataSource){
                Notify('选择数据源', 'top-right', '5000', 'danger', 'fa-list', true);
                return ;
            }
            resetConditionModal();	//重置设置弹窗
            var settingStr=$("#filterCondition").val();
            if(settingStr){
                var setting = JSON.parse(settingStr);
                setConditionFields(setting.conObj,"");
            }
            $("#addConditionModal").modal();
        });


        //设置过滤条件
        $(".btn-save-condition").on("click",function(){
            var setting={};
            setting.conObj=getDbConfig($("[name=addConditionTable] tr"));
            //setting.sqlExpression=$("[name=addConditionTable]").parent().find("textarea[name=sqlExpression]").val();
            $("#filterCondition").val(JSON.stringify(setting));
            $("#addConditionModal").modal("hide");
        });
    });