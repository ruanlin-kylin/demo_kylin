require.config({
    paths: {
        // echarts: '/crmweb/lib/js/echarts-2.2.7'
        echarts: '../../../../src/scripts/js/plug-in/echarts-2.2.7'
    }
});
var isReload =false;
var echart;
function chartInit(divId,config){
    this.config = config;
    this.titleObj=config.name;
    this.divId = divId;
    this.dataList ;
    this.fieldList=[];
    this.tableFilterObj={};
    this.parentDivObj = $("#"+divId).parent();
    this.getOption=function(dataList,config){
        if(config.comType=="LINE" || config.comType=="BAR"){
            if(config.comType=="LINE"){
                return this.getLinAndBarOption(dataList,config,"line");
            }else{
                return this.getLinAndBarOption(dataList,config,"bar");
            }
        }else{
            return this.getPieOption(dataList,config);
        }
    };
    this.initEvent=function(){
        var me = this;
        var groupField=me.config.groupField;
        var groupFieldObj = this.getFieldByFieldKey(groupField);
        if(groupFieldObj.fieldType=="DATE" ||groupFieldObj.fieldType=="DATETIME"){
            me.parentDivObj.find(".chart-nav-list").html(
                    '<li key="DAY">按天查看</li>'+
                    '<li key="MONTH">按月查看</li>'+
                    '<li key="YEAR">按年查看</li>'
            );
            if(me.config.groupMode){
                me.parentDivObj.find(".chart-nav-list").find("li[key="+me.config.groupMode+"]").addClass("selected");
            }
            me.parentDivObj.find(".chart-nav-list li").bind("click",function(){
                me.parentDivObj.find(".chart-nav-list li").removeClass('selected');
                $(this).addClass("selected");
                me.initChat();
            });
        }
        me.parentDivObj.find("span[key=filter_btn]").bind("click",function(){
            $(me.parentDivObj.find("div[name=addConditionModal]")[0]).modal('show');
        });
        me.parentDivObj.find("span[key=setting_btn]").bind("click",function(){
            var url = './setting.html?tableId='+me.config.dataSource+'&menuId='+me.config.pageId+"&type=HOMEPAGE";
            me.config.openWindow(url,function(){
                me.init();
            });
        });
    }
    this.getFieldByFieldKey=function (fieldKey){
        var me = this;
        if(me.fieldList && me.fieldList.length>0){
            for(var i=0;i<me.fieldList.length;i++){
                var fobj = me.fieldList[i];
                if(fobj.columnName == fieldKey){
                    return fobj;
                }
            }
        }
    };
    this.filterInit=function(fieldList){
        var me = this;
        var divObj=this.parentDivObj.find(".filterDiv");
        this.parentDivObj.find(".filterDiv").html("");
        $.post(ctx+"/cloud/behind/stableListConfig/getFieldType",function(json){
            if(json.result=="Success" || json.result=="SUCCESS"){
                var fieldTypeList=json.list;
                me.tableFilterObj=new tableFilter(divObj,"",fieldList,fieldTypeList,"");
                me.tableFilterObj.init();
                divObj.find("div[name=addConditionModal]").find("span[key=ft]").remove();
                divObj.find("div[name=addConditionModal]").find("textarea[name=sqlExpression]").parent().remove();
                divObj.find("div[name=addConditionModal]").find("button[key=addConditionModal_save_btn]").remove();
                divObj.find("div[name=addConditionModal]").find("div[key=flname_div]").remove();
                divObj.find("div[name=addConditionModal]").find("h5[name=addConditionModalLabel]").html('<span class="middle">条件过滤</span>');
                divObj.find("div[name=addConditionModal]").find("span[key=addFieldSearch]").find(".middle").html("添加条件");
                divObj.find("div[name=addConditionModal]").find(".modal-footer").prepend('<button type="button" key="filter_query_btn" class="btn btn-primary">查询</button>');
                divObj.find("div[name=addConditionModal]").find("button[key=filter_query_btn]").bind("click",function(){
                    me.initChat();
                    divObj.find("div[name=addConditionModal]").find(".modal-footer").find(".btn-default").click();
                });
            }else{
                tipsMsg(json.resultMsg,"FAIL");
            }
        });
    }
    this.getFilterDbConfig=function(){
        var me = this;
        var divObj=me.parentDivObj.find(".filterDiv");
        var trList =divObj.find("div[name=addConditionModal]").find("[name=addConditionTable] tr");
        if(me.tableFilterObj && me.tableFilterObj.getDbConfig){
            var conObj=me.tableFilterObj.getDbConfig(trList);
            if(conObj){
                return conObj;
            }
        }
    }
    this.getPieOption=function(dataList,config){
        var xData = [];
        var yData=[];
        for(var i=0;i<dataList.length;i++){
            var db = dataList[i];
            var groupFile = "空";
            if(db['groupfield']){
                groupFile = db['groupfield'];
            }
            xData.push(groupFile);
            yData.push({value:db['countfiled'],name:groupFile});
        }
        this.titleObj.x="center";
        return {
            title :{},
            backgroundColor:"#fbfbfb",
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient : 'vertical',
                x : 'left',
                data:xData
            },
            calculable : true,
            series : [
                {
                    name:config.name,
                    type:'pie',
                    radius : '60%',
                    center: ['50%', '60%'],
                    data:yData
                }
            ]
        };
    };
    this.getLinAndBarOption=function(dataList,config,type){
        var objList=[];
        var legend=[];
        var gfDB={};
        var childGroupList;
        for(var i=0;i<dataList.length;i++){
            var db = dataList[i];
            if(db['groupfield']){
                var fdb = gfDB[db['groupfield']];
                if(!fdb){
                    fdb={};
                }
                if(config.childGroupField){
                    if(!childGroupList){
                        childGroupList={};
                    }
                    var childGroupField="空";
                    if(db['childgroupfield']){
                        childGroupField=db['childgroupfield'];
                    }
                    fdb[childGroupField]={"value":db['countfiled']};
                    if(!childGroupList[childGroupField]){
                        childGroupList[childGroupField]=1;
                    }
                }else{
                    fdb['value']=db['countfiled'];
                }
                gfDB[db['groupfield']]=fdb;
            }
        }
        var series=[];
        var xData=[];
        if(childGroupList){
            for(var i in childGroupList){
                legend.push(i);
                var data=[];
                for(var z in gfDB){
                    var zobj = gfDB[z];
                    if(zobj[i] && zobj[i].value){
                        data.push(zobj[i].value);
                    }else{
                        data.push(0);
                    }
                }
                series.push({name:i,type:type,data:data});
            }
            var data=[];
            for(var i in gfDB){
                xData.push(i);
                var zobj = gfDB[i];
                var value = 0;
                for(var z in zobj){
                    if(zobj[z] && zobj[z].value){
                        value+=(zobj[z].value*1);
                    }
                }
                data.push(value);
            }
            series.unshift({name:"总"+config.countFiled_desc,type:type,data:data});
            legend.unshift("总"+config.countFiled_desc);
        }else{
            var data=[];
            for(var i in gfDB) {
                xData.push(i);
                var zobj = gfDB[i];
                data.push(zobj.value);
            }
            series.unshift({name:config.countFiled_desc,type:type,data:data});
            legend.push(config.countFiled_desc);
        }
        this.titleObj.x="left";
        return {
            backgroundColor:"#fbfbfb",
            title :{},
            tooltip : {trigger: 'axis'},
            smooth:true,
            legend: {
                data:legend,
                x: 'center'
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    data :xData
                }
            ],
            yAxis : [
                {type : 'value'}
            ],
            series : series
        };
    };
    this.refursh=function(){
        this.init();
    }
    this.init=function(){
        var me= this;
        $.post(ctx+"/cloud/userUiConfig/postGet",{module:me.config.dataSource,menuId:me.config.pageId,type:"HOMEPAGE"},function(json){
            if(json.result=="Success" || json.result=="SUCCESS"){
                var jsonMap=json.map;
                me.fieldList = jsonMap.fieldList;
                me.filterInit(me.fieldList);
                me.initEvent();
                me.initChat();
            }else{
                tipsMsg(json.resultMsg,"FAIL");
            }
        });
    }
    this.initChat=function(){
        var me = this;
        var dataSource=me.config.dataSource;
        var groupField=me.config.groupField;
        var childGroupField=me.config.childGroupField;
        var countFiled = me.config.countFiled;
        var groupOrder=me.config.group_order;
        var groupMode = me.config.groupMode;
        if(me.parentDivObj.find(".chart-nav-list").find(".selected").length>0){
            groupMode=$(me.parentDivObj.find(".chart-nav-list").find(".selected")[0]).attr("key");
        }
        var conObj=[];
        if(me.config.filterCondition && me.config.filterCondition){
            var filterConditionObj = JSON.parse(me.config.filterCondition);
            if(filterConditionObj && filterConditionObj.conObj && filterConditionObj.conObj.length>0){
                conObj =  filterConditionObj.conObj;
            }
        }
        var filterDbCon=me.getFilterDbConfig();
        if(filterDbCon && filterDbCon.length>0){
            for(var i=0;i<filterDbCon.length;i++){
                var cobj = filterDbCon[i];
                conObj.push(cobj);
            }
        }
        var groupCondition={groupField:groupField,childGroupField:childGroupField,countFiled:countFiled,groupMode:groupMode,groupOrder:groupOrder};
        $.post(ctx+"/cloud/table/list/reader/list",{tableId:dataSource,rows:100,groupCondition:JSON.stringify(groupCondition),conObj:JSON.stringify(conObj)},function(json){
            me.dataList=json.rows;
            var option = me.getOption(json.rows,config);
            if(me.config.comType=="PIE"){
                if(isReload){
                    var myChart = echart.init(document.getElementById(me.divId),'macarons');
                    window.onresize = myChart.resize;
                    myChart.setOption(option);
                    window.onresize = myChart.resize;
                    return;
                }
                require(
                        [
                            'echarts',
                            'echarts/chart/line',   // 按需加载所需图表，如需动态类型切换功能，别忘了同时加载相应图表
                            'echarts/chart/bar',
                            'echarts/chart/pie'
                        ],
                        function (ec) {
                            isReload=true;
                            echart=ec;
                            var myChart = echart.init(document.getElementById(me.divId),'macarons');
                            window.onresize = myChart.resize;
                            myChart.setOption(option);
                            window.onresize = myChart.resize;
                        }
                );
            }else{
                if(isReload){
                    var myChart = echart.init(document.getElementById(me.divId),'macarons');
                    window.onresize = myChart.resize;
                    myChart.setOption(option);
                    window.onresize = myChart.resize;
                    return;
                }
                require(
                        [
                            'echarts',
                            'echarts/chart/line',   // 按需加载所需图表，如需动态类型切换功能，别忘了同时加载相应图表
                            'echarts/chart/bar',
                            'echarts/chart/pie'
                        ],
                        function (ec) {
                            isReload=true;
                            echart=ec;
                            var myChart = echart.init(document.getElementById(me.divId),'macarons');
                            window.onresize = myChart.resize;
                            myChart.setOption(option);
                            window.onresize = myChart.resize;
                        }
                );
            }
        });
    }
};
function showTable(tableList,valueMap,divId,chartId){
    var tableIdList="";
    if(tableList && tableList.length>0){
        var tableContent =$("#"+divId);
        tableContent.html("");
        for(var i=0;i<tableList.length;i++){
            var table = tableList[i];
            var tableId = table.id;
            var dbList=valueMap[tableId];
            var tableName =table.name;
            var fieldList=table.fieldList;
            if(tableIdList.indexOf(","+tableId+",")==-1){
                tableIdList+=","+tableId+",";
            }else{
                continue;
            }
            if(fieldList && fieldList.length>0){
                var heandHtml = "";
                var bodyTrHtml = "";
                for(var j=0;j<fieldList.length;j++){
                    heandHtml+="<th>"+fieldList[j].fieldName+"</th>";
                }
                for(var j=0;j<dbList.length;j++){
                    bodyTrHtml+="<tr>";
                    var rowDB=dbList[j];
                    for(var z=0;z<fieldList.length;z++){
                        var value=rowDB[fieldList[z].fieldKey];
                        if(!value){
                            value="";
                        }
                        bodyTrHtml+="<td>"+value+"</td>";
                    }
                    bodyTrHtml+="</tr>";
                }
                var tableHtml =
                        "<div class='col-xs-12 col-md-12'>" +
                        "<div class='well with-header  with-footer'>" +
                        "<div class='header bg-blue'>"+tableName+
                        '<a href="javascript:;" style="float: right;"  onclick="javascript:cleanCache(this);" url="'+ctx+'/cloud/sys/chart/init/'+chartId+'?cleanCatch=cleanCatch"><i class="fa fa-refresh"></i></a>'
                        +"</div>" +
                        "<table class='table table-hover'>" +
                        "<thead class='bordered-darkorange'>" +
                        "<tr>"+heandHtml+"</tr>" +
                        "</thead>" +
                        "<tbody>" +
                        bodyTrHtml+
                        "</tbody>" +
                        "</table>" +
                        "</div>" +
                        "</div>";
                tableContent.append($(tableHtml));
            }
        }
    }
}


var allPageList=[];
    $(function(){
        var pageConfig;
        $.get(ctx+"/cloud/defined/page/getPageList",function(json){
            if(json.result=="SUCCESS"){
                var defaultDb;
                if(json.map && json.map.isAdmin && json.map.isAdmin=="1"){
                    isUserAdmin=true;
                }
                if(json.list && json.list.length>0){
                    allPageList=json.list;
                    var dataList = initShowPage(json.list);
                    for(var i=0;i<dataList.length;i++){
                        var db = dataList[i];
                        if(db.default==1){
                            defaultDb=db;
                        }
                        $("#homePageTable").find("tbody").append('<tr class="ui-sortable-handle"><td>'+db.name+'</td>' +
                        '<td><input type="hidden" name="id" value="'+db.id+'">' +
                        '<div class="div1 '+((db.isHide && db.isHide==1)?"open1":"close1")+'">'+
                        '<span class="left"></span>'+
                        '<span class="right"></span>'+
                        '<div class="div2 '+((db.isHide && db.isHide==1)?"open2":"close2")+'"></div>'+
                        '</div>'+
                        '</td>' +
                        '<td>' +
                        '<span class="checkboxContent" style="position: relative;">'+
                        '<input type="checkbox" name="default" '+((db.default && db.default=="1")?"checked":"")+'  id="'+db.id+'"/>'+
                        '<label for="'+db.id+'"></label>'+
                        '</span>'+
                        '</td><td class="handler_td">'+
                        '<span class="pointer pl12">'+
                        '<img class="middle"  onclick="javascript:$(this).parent().parent().parent().remove();" src="../../../../src/images/searchFilter/delete-selete.png" alt="删除"/>'+
                        '</span>'+
                        '<span class="pointer pl12">'+
                        '<a href="/page/cloud/menu/definedPageEdit.html?id='+db.id+'"><img class="middle" src="../../../../src/images/searchFilter/pencil-selete.png" alt="编辑" title="编辑" data-toggle="modal" data-target="#addConditionModal" key_id="'+db.id+'">'+
                        '</span>'+
                        '</td></tr>');
                        if(!(db.isHide && db.isHide==1)){
                            $(".selectPanel").append(
                                    '<li role="presentation" key_id="'+db.id+'" key_title="'+db.name+'">' +
                                    '<a class="panel-item" role="menuitem" tabindex="-1" href="#">'+
                                    db.name+
//                                    '<i class="operate-entrance" style="position: absolute; top:0;left:120px;font-size:16px;display: none;">' +
//                                    '<i class="fa fa-angle-right"  style="margin-left:15px"></i>' +
//                                    '</i>'+
                                    '</a>'+
                                    '</li>'
                            );
                        }
                    }

                };

                $("#homePageTable").find("tbody").find("tr").each(function(i,obj){
                    obj = $(obj);
                    if(obj.find(".div1").hasClass("open1")){
                        obj.find("input[name=default]").attr("disabled","disabled");
                    }
                });
                $("#homePageTable").on('click','.div1',function() {
                    $(this).toggleClass('close1');
                    $(this).toggleClass('open1');
                    $(this).find(".div2").toggleClass('close2');
                    $(this).find(".div2").toggleClass('open2');
                    if($(this).hasClass("open1")){
                        if($(this).parent().parent().find("input[name=default]").prop("checked")){
                            $(this).parent().parent().find("input[name=default]").attr("checked",false);
                        }
                        $(this).parent().parent().find("input[name=default]").attr("disabled","disabled");
                    }else{
                        $(this).parent().parent().find("input[name=default]").removeAttr("disabled");
                    }
                });
                $("#homePageTable").on("click","input[name=default]",function(){
                    if($(this).prop("checked")){
                        $("#homePageTable").find("input[name=default]").not(this).prop("checked",false);
                    }
                });
                $("#homePageTable").sortable({
                    cursor:"pointer",
                    items:"tr",
                    opacity:0.6,
                    delay:300,
                    sort:true,
                    disabled:false,
                    revert:false,
                    stop:function(event,ui){
                    }
                });
                if($(".selectPanel").find("li").length>0){
                    if(!defaultDb){
                        for(var i=0;i<json.list.length;i++){
                            if(!json.list[i].isHide){
                                defaultDb=json.list[i];
                                break;
                            }
                        }
                    }
                    $("#selectedPanel").attr("title",defaultDb.name);
                    $("#selectedPanel").attr("key_id",defaultDb.id);
                    $("#selectedPanel").text(defaultDb.name);
                    initPage(defaultDb.id);
                }
                $(document).on("click",".dropdown-menu li",function(){
                    $("#selectedPanel").attr("title",$(this).attr("key_title"));
                    $("#selectedPanel").attr("key_id",$(this).attr("key_id"));
                    $("#selectedPanel").text($(this).attr("key_title"));
                    $(".panelContent").hide();  //选择li后 隐藏ul并刷新界面
                    initPage($(this).attr("key_id"));
                })



                $(".dropdown-menu li").hover(function(){
                    $(this).find(".operate-entrance").show();
                },function(){
                    $(this).find(".operate-entrance").hide();
                    $(this).find(".operate-panel").remove(); //鼠标移出时去掉编辑面板功能
                });
                $("#managerPanel").bind("click",function(){
                    $("#managerHomePage").modal();
                });
                if(!isUserAdmin){
                    $("#newPanel").remove();
                    $("#homePageTable").find(".handler_td").remove();

                }
            }else{
                Notify(json.resultMsg, 'top-right', '5000', 'success', 'fa-list', true);
            }
        });


        $(document).on("click",".dropdown-menu li",function(){
            $("#selectedPanel").attr("title",$(this).attr("key_title"));
            $("#selectedPanel").attr("key_id",$(this).attr("key_id"));
            $("#selectedPanel").text($(this).attr("key_title"));
            initPage($(this).attr("key_id"));
        })
        function initShowPage(pageList){
            getSetting();
            var settingPageList = pageConfig;
            for(var i=0;i<pageList.length;i++){
                var page=pageList[i];
                var index = 0;
                var defaultMark =0;
                var isHide=0;
                if(settingPageList && settingPageList[page.id]){
                    index = (settingPageList[page.id].index && settingPageList[page.id].index>0)?(settingPageList[page.id].index):0;
                    defaultMark = (settingPageList[page.id].default)?settingPageList[page.id].default:0;
                    isHide = (settingPageList[page.id].isHide)?settingPageList[page.id].isHide:0;
                }
                page['index']=index;
                page['default']=defaultMark;
                page['isHide']=isHide;
            }
            pageList.sort(function(o1,o2){
                return o1.index - o2.index;
            });
            return pageList;
        }

        function getSetting(){
            $.ajax({
                url:ctx+"/cloud/userUiConfig/getConfig",
                dataType:"json",
                async:false,
                type:"get",
                data:{tableId:"10001",type:"HOMEPAGE"},
                success:function (json) {
                    if(json.result=="SUCCESS"){
                        if(json.map && json.map.setting){
                            var jsonObj = JSON.parse(json.map.setting);
                            if(jsonObj && jsonObj.pageConfig && jsonObj.pageConfig){
                                pageConfig= jsonObj.pageConfig;
                            }
                        }
                    }else{
                        Notify(json.resultMsg, 'top-right', '5000', 'success', 'fa-list', true);
                    }
                },
                error:function () {
                    tipsMsg("删除失败","FAIL");
                }
            });
        }


        function initPage(id){
            $.get(ctx+"/cloud/defined/page/getPageById/"+id,function(json){
                if(json.result=="SUCCESS"){
                    var oldItems = [];
                    if(json.map && json.map.page){
                        var page = json.map.page;
                        var htmlText=page.htmlText;
                        $("#parentContext").html(htmlText);
                        extractConfig(id);
                    }
                }else{
                    Notify(json.resultMsg, 'top-right', '5000', 'success', 'fa-list', true);
                }
            });
        }
    });

    function extractConfig(pageId){
        $(".config").each(function(i,obj){
            var obj =$(obj);
            var html= $.trim(obj.html());
            var divObj = obj.parent();
            if(html){
                var config =JSON.parse(html);
                config['pageId']=pageId;
                config.openWindow=openWindow;
                initobj = new initConfig(divObj,config,(pageId+"-"+i));
                initobj.init();
            }
        });
    }

    function submit(){
        var data={};
        $("#homePageTable .ui-sortable-handle").each(function(i,obj){
            obj = $(obj);
            var id = obj.find("input[name=id]").val();
            var index = i;
            var isDefault =$(obj).find("input[name=default]").prop("checked")?1:0;
            var isHidden=$(obj).find(".div1").hasClass("open1")?1:0;
            data[id]={id:id,index:index,default:isDefault,isHide:isHidden};
        });
        if(isUserAdmin){
            var delIds = [];
            for(var i=0;i<allPageList.length;i++){
                var db = allPageList[i];
                if(!(data[db.id] && data[db.id].id)){
                    delIds.push(db.id);
                }
            }
            $.post(ctx+"/cloud/defined/page/saveSetting",{setting:JSON.stringify({"pageConfig":data}),tableId:10001,type:"HOMEPAGE",delIds:delIds.join(",")},function(json){
                if(json.result=="SUCCESS"){
//                    tipsMsg("保存成功","SUCCESS");
                    window.location.reload();
                }else{
                    Notify(json.resultMsg, 'top-right', '5000', 'success', 'fa-list', true);
                }
            });
        }else{
            $.post(ctx+"/cloud/userUiConfig/saveConfig",{setting:JSON.stringify({"pageConfig":data}),tableId:10001,type:"HOMEPAGE"},function(json){
                if(json.result=="SUCCESS"){
                    tipsMsg("保存成功","SUCCESS");
                    window.location.reload();
                }else{
                    Notify(json.resultMsg, 'top-right', '5000', 'success', 'fa-list', true);
                }
            });
        }
    }






    //悬浮在选择面板附近时，显示添加面板等入口
    $(document).on("mouseenter", ".showLink", function () {
        $(".show-panel-operate").show();
    });
    $(document).on("mouseleave", ".showLink", function () {
        $(".show-panel-operate").hide();
    });



    $(".operate-entrance").click(function(){
        $("#oprate-panle").show();
    });

    //点击图标 按天查看等
    $(".chart-nav-list li").click(function(){
        $(this).addClass("selected").siblings().removeClass("selected");
    });
    //点击筛选
    $(".filter").click(function(){
        $("#queryModal").modal();
    });

    //点击设置
    $(".setting").click(function(){
        $("#config").modal();
    });

    $(".select-panel").click(function(){
        $(".selectPanel").toggle();
    })