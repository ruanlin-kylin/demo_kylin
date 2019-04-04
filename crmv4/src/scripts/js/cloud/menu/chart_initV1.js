{ /*<script src="${ctx}/lib/js/echarts-2.2.7/echarts.js"></script>*/ }
// require.config({
// 	paths: {
// 		echarts: '${ctx}/lib/js/echarts-2.2.7'
// 	}
// });
require.config({
    paths: {
        // echarts: '/crmweb/lib/js/echarts-2.2.7'
        echarts: '../../../../src/scripts/js/plug-in/echarts-2.2.7'
    }
});
var isReload = false;
var echart;

function chartInit(divId, config) {
    this.config = config;
    this.titleObj = config.name;
    this.divId = divId;
    this.dataList = [];
    this.fieldList = [];
    this.tableFilterObj = {};
    this.parentDivObj = $("#" + divId).parent();
    this.getOption = function (dataList, config) {
        if (config.comType == "LINE" || config.comType == "BAR") {
            if (config.comType == "LINE") {
                return this.getLinAndBarOption(dataList, config, "line");
            } else {
                return this.getLinAndBarOption(dataList, config, "bar");
            }
        } else {
            return this.getPieOption(dataList, config);
        }
    };
    this.initEvent = function () {
        var me = this;
        var groupField = me.config.groupField;
        var groupFieldObj = this.getFieldByFieldKey(groupField);
        if (groupFieldObj && (groupFieldObj.fieldType == "DATE" || groupFieldObj.fieldType == "DATETIME")) {
            me.parentDivObj.find(".chart-nav-list").html(
                '<li key="DAY">按天查看</li>' +
                '<li key="MONTH">按月查看</li>' +
                '<li key="YEAR">按年查看</li>'
            );
            if (me.config.groupMode) {
                me.parentDivObj.find(".chart-nav-list").find("li[key=" + me.config.groupMode + "]").addClass("selected");
            }
            me.parentDivObj.find(".chart-nav-list li").bind("click", function () {
                me.parentDivObj.find(".chart-nav-list li").removeClass('selected');
                $(this).addClass("selected");
                me.initChat();
            });
        }
        me.parentDivObj.find("span[key=filter_btn]").bind("click", function () {
            $(me.parentDivObj.find("div[name=addConditionModal]")[0]).modal('show');
        });
        me.parentDivObj.find("span[key=setting_btn]").bind("click", function () {
            var url = ctx + '/new/menu/setting.jsp?tableId=' + me.config.dataSource + '&menuId=' + me.config.pageId + "&type=HOMEPAGE";
            me.config.openWindow(url, function () {
                me.init();
            });
        });
    }
    this.getFieldByFieldKey = function (fieldKey) {
        var me = this;
        if (me.fieldList && me.fieldList.length > 0) {
            for (var i = 0; i < me.fieldList.length; i++) {
                var fobj = me.fieldList[i];
                if (fobj.columnName == fieldKey) {
                    return fobj;
                }
            }
        }
    };
    this.filterInit = function (fieldList) {
        var me = this;
        var divObj = this.parentDivObj.find(".filterDiv");
        this.parentDivObj.find(".filterDiv").html("");
        $.post(ctx + "/cloud/behind/stableListConfig/getFieldType", function (json) {
            if (json.result == "Success" || json.result == "SUCCESS") {
                var fieldTypeList = json.list;
                me.tableFilterObj = new tableFilter(divObj, "", fieldList, fieldTypeList, "");
                me.tableFilterObj.init();
                divObj.find("div[name=addConditionModal]").find("span[key=ft]").remove();
                divObj.find("div[name=addConditionModal]").find("span[key=backToPre]").remove();
                divObj.find("div[name=addConditionModal]").find("textarea[name=sqlExpression]").parent().remove();
                divObj.find("div[name=addConditionModal]").find("button[key=addConditionModal_save_btn]").remove();
                divObj.find("div[name=addConditionModal]").find("div[key=flname_div]").remove();
                divObj.find("div[name=addConditionModal]").find("h5[name=addConditionModalLabel]").html('<span class="middle">条件过滤</span>');
                divObj.find("div[name=addConditionModal]").find("span[key=addFieldSearch]").find(".middle").html("添加条件");
                divObj.find("div[name=addConditionModal]").find(".modal-footer").prepend('<button type="button" key="filter_query_btn" class="btn btn-primary">查询</button>');
                divObj.find("div[name=addConditionModal]").find("button[key=filter_query_btn]").bind("click", function () {
                    me.initChat();
                    divObj.find("div[name=addConditionModal]").find(".modal-footer").find(".btn-default").click();
                });
            } else {
                tipsMsg(json.resultMsg, "FAIL");
            }
        });
    }
    this.getFilterDbConfig = function () {
        var me = this;
        var divObj = me.parentDivObj.find(".filterDiv");
        var trList = divObj.find("div[name=addConditionModal]").find("[name=addConditionTable] tr");
        if (me.tableFilterObj && me.tableFilterObj.getDbConfig) {
            var conObj = me.tableFilterObj.getDbConfig(trList);
            if (conObj) {
                return conObj;
            }
        }
    }
    this.getPieOption = function (dataList, config) {
        var xData = [];
        var yData = [];
        for (var i = 0; i < dataList.length; i++) {
            var db = dataList[i];
            var groupFile = "空";
            if (db['groupfield']) {
                groupFile = db['groupfield'];
            }
            xData.push(groupFile);
            yData.push({
                value: db['countfiled'],
                name: groupFile
            });
        }
        this.titleObj.x = "center";
        return {
            title: {},
            backgroundColor: "#fbfbfb",
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data: xData
            },
            calculable: true,
            series: [{
                name: config.name,
                type: 'pie',
                radius: '60%',
                center: ['50%', '60%'],
                data: yData
            }]
        };
    };
    this.getLinAndBarOption = function (dataList, config, type) {
        var objList = [];
        var legend = [];
        var gfDB = {};
        var childGroupList;
        for (var i = 0; i < dataList.length; i++) {
            var db = dataList[i];
            if (db['groupfield']) {
                var fdb = gfDB[db['groupfield']];
                if (!fdb) {
                    fdb = {};
                }
                if (config.childGroupField) {
                    if (!childGroupList) {
                        childGroupList = {};
                    }
                    var childGroupField = "空";
                    if (db['childgroupfield']) {
                        childGroupField = db['childgroupfield'];
                    }
                    fdb[childGroupField] = {
                        "value": db['countfiled']
                    };
                    if (!childGroupList[childGroupField]) {
                        childGroupList[childGroupField] = 1;
                    }
                } else {
                    fdb['value'] = db['countfiled'];
                }
                gfDB[db['groupfield']] = fdb;
            }
        }
        var series = [];
        var xData = [];
        if (childGroupList) {
            for (var i in childGroupList) {
                legend.push(i);
                var data = [];
                for (var z in gfDB) {
                    var zobj = gfDB[z];
                    if (zobj[i] && zobj[i].value) {
                        data.push(zobj[i].value);
                    } else {
                        data.push(0);
                    }
                }
                series.push({
                    name: i,
                    type: type,
                    data: data
                });
            }
            var data = [];
            for (var i in gfDB) {
                xData.push(i);
                var zobj = gfDB[i];
                var value = 0;
                for (var z in zobj) {
                    if (zobj[z] && zobj[z].value) {
                        value += (zobj[z].value * 1);
                    }
                }
                data.push(value);
            }
            console.log(data);
            series.unshift({
                name: "总" + config.countFiled_desc,
                type: type,
                data: data
            });
            legend.unshift("总" + config.countFiled_desc);
        } else {
            var data = [];
            for (var i in gfDB) {
                xData.push(i);
                var zobj = gfDB[i];
                data.push(zobj.value);
            }
            series.unshift({
                name: config.countFiled_desc,
                type: type,
                data: data
            });
            legend.push(config.countFiled_desc);
        }
        this.titleObj.x = "left";
        return {
            backgroundColor: "#fbfbfb",
            title: {},
            tooltip: {
                trigger: 'axis'
            },
            smooth: true,
            legend: {
                data: legend,
                x: 'center'
            },
            calculable: true,
            xAxis: [{
                type: 'category',
                data: xData
            }],
            yAxis: [{
                type: 'value'
            }],
            series: series
        };
    };
    this.refursh = function () {
        this.init();
    }
    this.init = function () {
        var me = this;
        $.post(ctx + "/cloud/userUiConfig/postGet", {
            module: me.config.dataSource,
            menuId: me.config.pageId,
            type: "HOMEPAGE"
        }, function (json) {
            if (json.result == "Success" || json.result == "SUCCESS") {
                var jsonMap = json.map;
                me.fieldList = jsonMap.fieldList;
                me.filterInit(me.fieldList);
                me.initEvent();
                me.initChat();
            } else {
                tipsMsg(json.resultMsg, "FAIL");
            }
        });
    }
    this.initChat = function () {
        var me = this;
        var dataSource = me.config.dataSource;
        var groupField = me.config.groupField;
        var childGroupField = me.config.childGroupField;
        var countFiled = me.config.countFiled;
        var groupOrder = me.config.group_order;
        var groupMode = me.config.groupMode;
        if (me.parentDivObj.find(".chart-nav-list").find(".selected").length > 0) {
            groupMode = $(me.parentDivObj.find(".chart-nav-list").find(".selected")[0]).attr("key");
        }
        var conObj = [];
        if (me.config.filterCondition && me.config.filterCondition) {
            var filterConditionObj = JSON.parse(me.config.filterCondition);
            if (filterConditionObj && filterConditionObj.conObj && filterConditionObj.conObj.length > 0) {
                conObj = filterConditionObj.conObj;
            }
        }
        var filterDbCon = me.getFilterDbConfig();
        if (filterDbCon && filterDbCon.length > 0) {
            for (var i = 0; i < filterDbCon.length; i++) {
                var cobj = filterDbCon[i];
                conObj.push(cobj);
            }
        }
        var groupCondition = {
            groupField: groupField,
            childGroupField: childGroupField,
            countFiled: countFiled,
            groupMode: groupMode,
            groupOrder: groupOrder
        };
        $.post(ctx + "/cloud/table/list/reader/list", {
            tableId: dataSource,
            rows: 100,
            groupCondition: JSON.stringify(groupCondition),
            conObj: JSON.stringify(conObj)
        }, function (json) {
            if (json && json.rows) {
                me.dataList = json.rows;
            }
            var option = me.getOption(me.dataList, config);
            if (me.config.comType == "PIE") {
                if (isReload) {
                    var myChart = echart.init(document.getElementById(me.divId), 'macarons');
                    window.onresize = myChart.resize;
                    myChart.setOption(option);
                    window.onresize = myChart.resize;
                    return;
                }
                require(
                    [
                        'echarts',
                        'echarts/chart/line', // 按需加载所需图表，如需动态类型切换功能，别忘了同时加载相应图表
                        'echarts/chart/bar',
                        'echarts/chart/pie'
                    ],
                    function (ec) {
                        isReload = true;
                        echart = ec;
                        var myChart = echart.init(document.getElementById(me.divId), 'macarons');
                        window.onresize = myChart.resize;
                        myChart.setOption(option);
                        window.onresize = myChart.resize;
                    }
                );
            } else {
                if (isReload) {
                    var myChart = echart.init(document.getElementById(me.divId), 'macarons');
                    window.onresize = myChart.resize;
                    myChart.setOption(option);
                    window.onresize = myChart.resize;
                    return;
                }
                require(
                    [
                        'echarts',
                        'echarts/chart/line', // 按需加载所需图表，如需动态类型切换功能，别忘了同时加载相应图表
                        'echarts/chart/bar',
                        'echarts/chart/pie'
                    ],
                    function (ec) {
                        isReload = true;
                        echart = ec;
                        var myChart = echart.init(document.getElementById(me.divId), 'macarons');
                        window.onresize = myChart.resize;
                        myChart.setOption(option);
                        window.onresize = myChart.resize;
                    }
                );
            }
        });

        /*
        			$.get(ctx+"/cloud/db/statistic/chart/"+me.chartId,me.formDB,function(json){
        				if (json.result == "SUCCESS") {
        					var map = json.map;
        					if(map.tableList && map.tableList.length>0){
        						var chart = map.chart;
        						if(chart){
        							if(chart.chartType=='pie'){
        								console.log("div id:"+me.divId+"\t"+chart.chartType);
        								var option=me.getPieOption(chart,map.tableList,map);
        								if(option){
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
        									Notify("生成图表配置失败", 'top-right','5000', 'danger','fa-bolt', true);
        								}
        							}else{
        								console.log("div id:"+me.divId+"\t"+chart.chartType);
        								var option=me.getLinAndBarOption(chart,map.tableList,map);
        								if(option){
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
        									Notify("生成图表配置失败", 'top-right','5000', 'danger','fa-bolt', true);
        								}
        							}
        							if(me.isShowTable==true && me.tableDivId){
        								showTable(map.tableList,map,me.tableDivId,me.chartId);
        							}
        						}else{
        							Notify("图表不存在", 'top-right','5000', 'danger','fa-bolt', true);
        						}
        					}else{
        						Notify("没有给图表配置统计表", 'top-right','5000', 'danger','fa-bolt', true);
        					}
        				}else{
        					Notify(json.resultMsg, 'top-right','5000', 'danger','fa-bolt', true);
        				}
        			});

        			*/
    }
};

function showTable(tableList, valueMap, divId, chartId) {
    var tableIdList = "";
    if (tableList && tableList.length > 0) {
        var tableContent = $("#" + divId);
        tableContent.html("");
        for (var i = 0; i < tableList.length; i++) {
            var table = tableList[i];
            var tableId = table.id;
            var dbList = valueMap[tableId];
            var tableName = table.name;
            var fieldList = table.fieldList;
            if (tableIdList.indexOf("," + tableId + ",") == -1) {
                tableIdList += "," + tableId + ",";
            } else {
                continue;
            }
            if (fieldList && fieldList.length > 0) {
                var heandHtml = "";
                var bodyTrHtml = "";
                for (var j = 0; j < fieldList.length; j++) {
                    heandHtml += "<th>" + fieldList[j].fieldName + "</th>";
                }
                for (var j = 0; j < dbList.length; j++) {
                    bodyTrHtml += "<tr>";
                    var rowDB = dbList[j];
                    for (var z = 0; z < fieldList.length; z++) {
                        var value = rowDB[fieldList[z].fieldKey];
                        if (!value) {
                            value = "";
                        }
                        bodyTrHtml += "<td>" + value + "</td>";
                    }
                    bodyTrHtml += "</tr>";
                }
                var tableHtml =
                    "<div class='col-xs-12 col-md-12'>" +
                    "<div class='well with-header  with-footer'>" +
                    "<div class='header bg-blue'>" + tableName +
                    '<a href="javascript:;" style="float: right;"  onclick="javascript:cleanCache(this);" url="' + ctx + '/cloud/sys/chart/init/' + chartId + '?cleanCatch=cleanCatch"><i class="fa fa-refresh"></i></a>' +
                    "</div>" +
                    "<table class='table table-hover'>" +
                    "<thead class='bordered-darkorange'>" +
                    "<tr>" + heandHtml + "</tr>" +
                    "</thead>" +
                    "<tbody>" +
                    bodyTrHtml +
                    "</tbody>" +
                    "</table>" +
                    "</div>" +
                    "</div>";
                tableContent.append($(tableHtml));
            }
        }
    }
}