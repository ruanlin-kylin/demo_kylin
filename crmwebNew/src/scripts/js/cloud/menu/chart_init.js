	// require.config({
	// 	paths: {
	// 		// echarts: '/crmweb/lib/js/echarts-2.2.7'
	// 		echarts: '../../../../src/scripts/js/plug-in/echarts-2.2.7'
	// 	}
	// });
    
	var isReload =false;
	var echart;
	function chartInit(chartId,divId,isShowTable,tableDivId,config,formDB){
		this.chartId=chartId;
		this.divId=divId;
		this.isShowTable = isShowTable;
		this.tableDivId= tableDivId;
		this.formDB = formDB;
		this.config=config;
		this.titleObj={};
		if(config && config.title){
			this.titleObj=config.title;
		}
		this.getPieOption=function(chart,tableList,valueMap){
			var table = tableList[0];
			var tableId = table.id;
			var dbList = valueMap[tableId];
			var config = getConfigById(valueMap.chartConfigList,tableId);
			if(dbList && config){
				var dbConfig=getObjValue(dbList,config)
				var xData = [];
				var yData=[];
				var dataArray =dbConfig.data;
				for(var p in dataArray){
					xData.push(p);
					yData.push({value:dataArray[p],name:p});
				}
				this.titleObj.x="center";
				if(!this.titleObj.text){
					this.titleObj.text=chart.name;
				}
				return {
					title :this.titleObj,
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
							name:name,
							type:'pie',
							radius : '60%',
							center: ['50%', '60%'],
							data:yData
						}
					]
				};
			}
		};
		this.getLinAndBarOption=function(chart,tableList,valueMap){
			var objList=[];
			var legend=[];
			var configList =valueMap.chartConfigList;
			for(var i=0;i<configList.length;i++){
				var config = configList[i];
				var tableId = config.tableId;
				var dbList = valueMap[tableId];
				if(dbList && config){
					legend.push(config.label);
					objList.push(getObjValue(dbList,config));
				}
			};
			var configDB = getConfigDb(objList);
			var series=[];
			var colorS=[];
			for(var i=0;i<configDB.yData.length;i++){
				var config=configDB.yData[i];
				var label = config.label;
				var data=config.data;
				var showType = (config.showType=="LINE"?"line":"bar");
				series.push({name:label,type:showType,data:data});
				colorS.push(config.color);
			}
			if(!this.titleObj.text){
				this.titleObj.text=chart.name;
			}
			this.titleObj.x="left";
			return {
				color:colorS,
				backgroundColor:"#fbfbfb",
				title :this.titleObj,
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
						data :configDB.xData
					}
				],
				yAxis : [
					{type : 'value'
					}
				],
				series : series
			};
		};

		function getObjValue(dbList , config){
			if(dbList && config){
				var xValue =config.xValue;
				var yValue = config.yValue;
				var ob_value = {xValue:xValue,yValue:yValue,color:config.color,label:config.label,showType:config.showType};
				var da={};
				for(var z=0;z<dbList.length;z++){
					var db=dbList[z];
					var xv = db[xValue];
					if(xv){
						var yv = db[yValue];
						if(!yv)yv=0;
						da[xv]=yv;
					}
				}
				ob_value['data']=da;
				return ob_value;
			}
		}

		function getConfigDb(db_config){
			if(db_config.length>0){
				var title_config={};
				var xData=[];
				var yData=[];
				for(var i=0;i<db_config.length;i++){
					var config = db_config[i].data;;
					for(var p in config){
						if(!title_config[p]){
							title_config[p]=xData.length+1;
							xData.push(p);
						}
					}
				}
				for(var i=0;i<db_config.length;i++){
					var config=db_config[i].data;
					var data=[];
					for(var t in title_config){
						var value =config[t];
						if(value){
							data.push(value);
						}else{
							data.push(0);
						}
					}
					db_config[i].data=data;
				}
				return {xData:xData,yData:db_config};
			}
		}

		function getConfigById(configList,tableId){
			if(configList && configList.length>0){
				for(var i=0;i<configList.length;i++){
					if(configList[i].tableId==tableId){
						return configList[i];
					}
				}
			}
		}
		this.refursh=function(){
			this.init();
		}
		this.init=function(){
			var me = this;
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