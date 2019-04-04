
	function tableList(divObj,config){
		var me = this;
		me.tableId = config.id;
		me.params = config.params;
		me.form_pm_obj=config.params;
		me.divObj = divObj;
		me.config=config;
		me.fastSearchxx;
		me.tableFilterxx;
		me.buttonConfigObj={};
		me.editDelButtonList=[];
		me.divWidth=divObj.width();
		me.divHeight =(me.config.h*1*150);
		if(me.config.hs){
			me.divHeight=me.divHeight-me.config.hs;
		}
		me.gridObj={};
		me.fieldList=[];
		me.buttonList=[];
		me.fieldTypeList=[];
		me.conditionList={};
		me.configId;
		me.tableSetting={};
		me.current_select_data;
		me.current_db_rows=[];
		me.tableTeam=config.tableTeam;
		me.leaderSetting={};
		if(config.tableTeam && config.tableTeam.leaderSetting){
			me.leaderSetting=JSON.parse(config.tableTeam.leaderSetting);
		}
		me.reloadInit=function(){
			me.init();
		};
		me.initEvent=function(){
			me.divObj.find(".table_search_btn").bind("click",function(){
				me.search();
			});
			me.divObj.find(".searchText").bind("keydown",function(event){
				if(event.keyCode==13){
					me.search();
				}
			});
			me.divObj.find(".set-table-btn").bind("click",function(event){
				me.setTableWidthToCatch();
				var url = './setting.html?tableId='+me.tableId+'&menuId='+me.config.menuId;
				me.config.openWindow(url,me.reloadInit);
			});
			me.divObj.find(".search_head_div").on("click","button[bt_type=ADD]",function(){//新增类按钮
				var obj = this;
				me.clickButton(obj);
			});
			me.divObj.find(".search_head_div").on("click","a[key=downLoad]",function(){//下载
				me.downLoadDB();
			});
			me.divObj.find("span[name=quickQueryBtn]").bind("click",function(){
				$(me.divObj.find("div[name=queryModal]")[0]).modal('show');
			});
			me.divObj.find("li[key=openAddClassModalBtn]").bind("click",function(){
				$(me.divObj.find("div[name=addClassModal]")[0]).modal('show');
			});
			me.divObj.find("table").on("click","a[key=open_fb_btn]",function(){		//表格组触发字段
				if(me.tableTeam){
					var rowData=me.getTableRowDb($(this).attr("rowid"));
					var primaryKey=me.leaderSetting.primaryKey;
					if(rowData && rowData[primaryKey]){
						var dataId=rowData[primaryKey];
						openFBWindow(me.tableTeam.sid,dataId,$(this).html(),me.form_pm_obj,function(){
							me.gridObj.jqGrid('setGridParam', {page: me.gridObj.getGridParam('page')}).trigger("reloadGrid");
						});
					}
				}
			});
		};
		me.loadingEvent=function (){
			me.divObj.find("span[bt_mark=editOrDel],a[bt_type=LINK]").bind("click",function(){
				var obj = this;
				me.clickButton(obj);
			});
			me.divObj.find("[key=select_all_btn]").on("click",function(){		//全选按钮
				me.allSelect(this);
			});
		};
		me.init=function(){
			me.initHtml();
			var data={module:me.tableId,menuId:me.config.menuId};
			$.post(ctx+"/cloud/userUiConfig/postGet",data,function(json){
				if(json.result=="Success" || json.result=="SUCCESS"){
					var jsonMap=json.map;
					me.configId=jsonMap.configId;
					me.tableSetting=jsonMap.tableSetting;
					me.fastSearchxx=new fastSearch($(me.divObj.find(".search_head_div")[0]),me,jsonMap.fieldList);
					me.fastSearchxx.init();
					me.initEvent();
					//【设置$.post,$.get为同步请求】
					$.ajaxSettings.async = false;
					$.post(ctx+"/cloud/behind/stableListConfig/getFieldType",function(json){
						if(json.result=="Success" || json.result=="SUCCESS"){
							me.fieldTypeList=json.list;
							me.tableFilterxx=new tableFilter($(me.divObj.find(".search_head_div")[0]),me,jsonMap.fieldList,me.fieldTypeList,me.fastSearchxx);
							me.tableFilterxx.init();
							me.initConditionList(me.tableFilterxx);
							//暂时不支持条件表达式
							me.divObj.find("div[name=addConditionModal]").find("div[key=sqlExp_div]").remove();
						}else{
							tipsMsg(json.resultMsg,"FAIL");
						}
					});
					//【设置$.post,$.get为异步请求】
					$.ajaxSettings.async = true;
					//【表单需在搜索分类设置加载之后初始化，以使默认搜索分类生效】
					initTable(jsonMap);
				}else{
					tipsMsg(json.resultMsg,"FAIL");
				}
			});
			function initTable(jsonMap){
				var columns = createColList(jsonMap);
				me.gridObj=$("#"+me.config.markId).jqGrid({
					url: ctx+'/cloud/table/list/reader/list',
					mtype: "POST",
					styleUI : 'Bootstrap',
					datatype: "json",
					scrollrows: true,//行可见,
					postData:{tableId:me.tableId},
					paramsFun:function(){
						return me.getSearchParams();//搜索参数
					},
					gridComplete:function(a,b,c){},
					colModel: columns,
					viewrecords: true,
					height: (me.divHeight-86-38),
					rowNum: (me.tableSetting && me.tableSetting.pageSize)? me.tableSetting.pageSize : 20,
					pager: "#"+(me.config.markId)+"_gridPager",
					rownumbers: true,
					autowidth: true,
					shrinkToFit:false,
					loadComplete:function(data,a,b,c) {
						me.loadingEvent();
						if(data.records==0 && data.page>1){
							setTimeout(function(){me.search();},100);
						}
						me.current_db_rows=data.rows;
						var ids = me.gridObj.jqGrid('getDataIDs');
						if(ids!=null && ids.length>0){
							me.gridObj.jqGrid('setSelection',ids[0]);
						}
					},
					beforeSelectRow: function (rowid,e){
					},
					onSelectRow:function(rowid,status){
						setSelectRowObjBakFun(function(){return me.getSelectRowObj()});
						//refreshShowButtonTop(rowid);
						//表格组单击行刷新附表
						if(me.tableTeam && fb_window_switch){
							var rowData=me.getTableRowDb(rowid,true);
							var primaryKey=me.leaderSetting.primaryKey;
							if(rowData && rowData[primaryKey]){
								var dataId=rowData[primaryKey];
								openFBWindow(me.tableTeam.sid,dataId,$(this).html(),me.form_pm_obj,function(){
									me.gridObj.jqGrid('setGridParam', {page: me.gridObj.getGridParam('page')}).trigger("reloadGrid");
								});
							}
						}
					},
					onSelectAll:function(rowids,status){
					},
				}).jqGrid('setFrozenColumns');
				/*
				$(window).resize(function(){
					if(gridObj){
						gridObj.setGridWidth($(window).width()*(mBiLi/12)-5);
					}
				});
				$("#list_gridPager td").css({"padding":"0px 3px"});
				*/
			}

			function createColList(jsonMap){
				me.buttonList= jsonMap.buttonList;
				me.fieldList= jsonMap.fieldList;
				var buttonList =me.buttonList;
				var fieldList =me.fieldList;
				var operatorColWidth=jsonMap.operatorColWidth;
				var isDownload=jsonMap.isDownload;
				var colList=[];
				if(isDownload){
					me.divObj.find(".button_content").append('<span bt_type="download" ><a target="_blank" class="btn btn-xs default-btn-img default-btn" key="downLoad"><i class="fa fa fa-download"></i>下载</a></span>');
				}
				var multflag=false;
				if(buttonList!=null && buttonList.length>0){
					$.each(buttonList,function(i,button){
						me.buttonConfigObj[button.sid]=button;
						if(button.isShow &&  button.isShow=="1"){
							if(button.type=="ADD"){
								if(button.name.indexOf("批量") >= 0){
									multflag=true;
								}
								var class_val = JsonButton.commonButton.default_btn+" "+JsonButton.commonButton.btn_add;
								if(button.style){
									var mesg = ctx+"/assetsv1/img/list/"+button.style+"_white.png";
								}
								me.divObj.find(".button_content").append('<button style="margin-right:2px;" key_id="'+button.sid+'" bt_type="ADD"  class="default-btn-img  '+class_val+'" type="button" >'+button.name+'</button>'
								);
							}else{
								if(button.type!="LINK") {
									me.editDelButtonList.push(button);
								}
							}
						}
					});
				}
				var showColCount=0;
				if(multflag){	//jqTable
					colList.push({frozen:true,label:"<input type='checkbox' class='all_select_comp' key='select_all_btn'>",index:"allselect_compontent",name:"全选2",width:30,sortable:false,formatter:function(dbValue,x,n){
						return '<input type="checkbox" key="select_checkbox" rowid="'+ x.rowId+'" style="margin:12px 0 0 3px;">';
					}});
				}
				$.each(fieldList,function(i,field){
					var title=field.title;
					if(field.alias && field.alias.length>0){
						title=field.alias;
					}
					var colObj = {label:title,index:field.columnName,name:field.columnName,align:'left'};
					if(!field.isShow && field.isShow==0){
						colObj['hidden']=true;
					}else{
						showColCount++;
					}
					if(field.colWidth && (field.colWidth*1)>0){
						colObj['width']=(field.colWidth*1);
					}
					if(field.isFixed && field.isFixed==1){
						colObj['frozen']=true;
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
								return me.textBZ(date.format(format),field.columnName, x.rowId,n,buttonList);
							}
							return me.textBZ(v,field.columnName, x.rowId,n,buttonList);
						}
					}else{
						colObj['formatter']=function(dbValue,x,n){
							return me.textBZ(dbValue,field.columnName, x.rowId,n,buttonList);
						}
					}
					colList.push(colObj);
				});
				if(me.editDelButtonList.length>0){
					if(!me.tableSetting || !me.tableSetting.showButtonTop){
						colList.push({
							label:"操作",
							index:"操作",
							name:"操作",
							align:"left",
							width:operatorColWidth?operatorColWidth:150,
							formatter:function(dbValue,x,n){
								var buttonStr='';
								$.each(me.editDelButtonList,function(i,button){
									if(n.SHOW_BUTTON_IDS && me.existString(n.SHOW_BUTTON_IDS,button.sid)){
										var class_val = JsonButton.spanButton.default_btn_select;
										if(button.style){
											var mesg = ctx+"/assetsv1/img/list/"+button.style+"_white.png";
										}
										buttonStr+='<span  key_id="'+button.sid+'" row_id="'+ x.rowId+'" bt_type="'+button.type+'" bt_mark="editOrDel" class="default-btn '+class_val+'" type="button"  style="margin: 0px 5px;background:rgba(72, 160, 220, 1) url('+mesg+') no-repeat 10px center" >'+button.name+'</span>'
									}
								});
								return "<div style='display: inline-flex'>"+buttonStr+"</div>";
							}
						});
						showColCount++;
					}
				}
				return handlerColWidth(colList,showColCount);
			};
			me.existString=function(idList,id){
				if(idList && idList.length>0){
					for(var i=0;i<idList.length;i++){
						if(idList[i] == id){
							return true;
						}
					}
				}
			}
			me.initConditionList=function(filterObj){
				$.post(ctx+"/cloud/sbehaviourConfig/use/getConfig/TABLE_CONDITION",{id:me.tableId},function(json) {
					if (json.result == "Success" || json.result == "SUCCESS") {
						var conList = json.list;
						var hasShow = [];
						if (conList != null && conList.length > 0) {
							$.post(ctx + "/cloud/sbehaviourConfig/use/getConfig/TABLE_CONDITION_SETTING", {id: me.tableId}, function (result) {	//获取分类用户设置信息
								if ((json.result == "Success" || json.result == "SUCCESS") && result.list != null && result.list.length > 0) {
									var tableConditionSettingId = result.list[0].sid;
									if (tableConditionSettingId && tableConditionSettingId.indexOf("10000") == -1) {
										me.divObj.find("input[name=tableConditionSettingId]").val(result.list[0].sid);
									}
									var setting = JSON.parse(result.list[0].setting);
									for (var i = 0; i < setting.length; i++) {
										var userSet = setting[i];					//用户设置信息
										$.each(conList, function (j, con) {
											if (userSet.classifyId == con.sid) {
												me.conditionList[con.sid] = con;
												var conSet = JSON.parse(con.setting);	//搜索分类设置信息
												filterObj.showClassify({classifyId: con.sid,name: conSet.name,type: conSet.type,isShow: userSet.isShow,isDefault: userSet.isDefault});
												conList.splice(j, 1);			//移除已经添加过的分类
												return false;
											}
										});
									}
								}
								//没有搜索字段用户设置信息或者一些分类设置后没有保存用户设置
								$.each(conList, function (i, con) {
									var setting = con.setting;
									if (setting) {
										me.conditionList[con.sid] = con;
										var setObj = JSON.parse(setting);
										filterObj.showClassify({classifyId: con.sid, name: setObj.name, type: setObj.type});
									}
								});
							});
						}
					} else {
						tipsMsg(json.resultMsg, "FAIL");
					}
				});
			}
			/**
			 * 计算列宽
			 **/
			function handlerColWidth(colList,showColCount){
				var sumCount=me.divWidth-50;
				var showColCount = 0 ;
				var isAllSelect=0;
				var existSumWidth=0;
				$.each(colList,function(i,obj){
					if(!obj.hidden){
						showColCount ++ ;
						if(obj.width && obj.width>0){
							existSumWidth+=(obj.width*1);
						}else{
							existSumWidth+=150;
						}
					}
					if(obj.index=="allselect_compontent" ){
						isAllSelect=1;
					}
				});
				if(isAllSelect){
					sumCount+=-30;
					showColCount--;
				}
				var sxWidth=0;
				if(existSumWidth<sumCount){
					sxWidth = ((sumCount-existSumWidth)/showColCount);
				}
				$.each(colList,function(i,obj){
					if(!obj.hidden){
						var curWidth = 150;
						if(obj.width && obj.width>0){
							curWidth=(obj.width)*1;
						}
						if(obj.index!="allselect_compontent"){
							obj.width=(curWidth+sxWidth);
						}
					}
				});
				return colList;
			}
		};
		me.search=function(){
			var data=me.getSearchCondition();
			me.gridObj=$("#"+me.config.markId).jqGrid('setGridParam',{datatype:'json',postData:data,page:1}).trigger("reloadGrid"); //重新载入
			
		}; 
		me.downLoadDB=function(){
			var data=me.getSearchCondition();
			var url = ctx+"/cloud/export/table/"+me.tableId;
			var form = $("<form></form>").attr("action", url).attr("method", "get");
			
			if(me.form_pm_obj){
				for (var pd in me.form_pm_obj) {
					if (me.form_pm_obj[pd]) {
						form.append($("<input></input>").attr("type", "hidden").attr("name", pd).attr("value", me.form_pm_obj[pd]));
						data[pd]=me.form_pm_obj[pd];
					}
				}
			}
			form.append($("<input></input>").attr("type", "hidden").attr("name", "fieldKeys").attr("value", data["fieldKeys"]));
			form.append($("<input></input>").attr("type", "hidden").attr("name", "conObj").attr("value", data["conObj"]));
			form.append($("<input></input>").attr("type", "hidden").attr("name", "sqlExpression").attr("value", data["sqlExpression"]));
			form.append($("<input></input>").attr("type", "hidden").attr("name", "qqConObj").attr("value", data["qqConObj"]));
			form.append($("<input></input>").attr("type", "hidden").attr("name", "keyword").attr("value", data["keyword"]));
		    form.append($("<input></input>").attr("type", "hidden").attr("name", "configId").attr("value", me.configId));
		    form.appendTo(divObj).submit().remove(); 
		}
		me.getSearchParams=function(){
			var data=me.getSearchCondition();
			var default_order_field;
			var default_order;
			var fieldKeys=[];
			if(me.fieldList && me.fieldList.length>0){
				var order_field_setting=[];
				$.each(me.fieldList,function(i,obj){
					if(obj.isOrder){
						default_order_field=obj.columnName;
						if(obj.isOrder==1){
							default_order="desc";
						}else{
							default_order=obj.isOrder;
						}
						order_field_setting.push({field:default_order_field,order:default_order});
					}
					if(obj.isSearch && obj.isSearch==1){
						fieldKeys.push(obj.columnName);
					}
				});
				if(order_field_setting && order_field_setting.length>0){
					data['order_field_setting']=JSON.stringify(order_field_setting);
				}
				data['fieldKeys']=JSON.stringify(fieldKeys);
			}

			if(me.form_pm_obj){
				for (var pd in me.form_pm_obj) {
					if (me.form_pm_obj[pd]) {
						data[pd]=me.form_pm_obj[pd];
					}
				}
			}
			return data;
		};
		
		me.getSearchCondition=function(){
			var fieldKeys=[];
			if(me.fieldList && me.fieldList.length>0){
				$.each(me.fieldList,function(i,obj){
					if(obj.isSearch && obj.isSearch==1){
						fieldKeys.push(obj.columnName);
					}
				});
			}
			//搜索分类的条件
			var configObj=[];
			var sqlExpression="";
			//后台设置的过滤条件
			if(me.config && me.config.filterCondition){
				var filterConditionObj = JSON.parse(me.config.filterCondition);
				if(filterConditionObj && filterConditionObj.conObj && filterConditionObj.conObj.length>0){
					configObj =  filterConditionObj.conObj;
				}
			}
			var key_id=me.divObj.find(".dropdownTitle").attr("key_id");
			if(key_id && me.conditionList[key_id]){
				var condition = me.conditionList[key_id];
				if(condition.setting){
					var conObj=JSON.parse(condition.setting).conObj;
					
					if(configObj && configObj.length==0){	//如果后台设置了搜索条件，则不能支持条件表达式
						//条件表达式
						sqlExpression=JSON.parse(condition.setting).sqlExpression;
					}
					//合并后台和前台的过滤条件
					configObj=configObj.concat(conObj);
				}
			}
			//快速检索的条件
			var qqConObj=me.fastSearchxx.getQuickQueryConfig();
			//搜索栏关键字
			var keyword=$(me.divObj.find("input[name=keyword]")[0]).val();
			return data={keyword:keyword,fieldKeys:JSON.stringify(fieldKeys),conObj:JSON.stringify(configObj),sqlExpression:sqlExpression,qqConObj:JSON.stringify(qqConObj)};
		}
		me.allSelect=function(obj){
			event.stopPropagation();
			var obj = $(obj);
			if(obj.attr("mark_val")=="1"){
				me.divObj.find("input[key=select_checkbox]").each(function(i,o){
					o.checked=false;
				});
				obj.attr("mark_val","0");
			}else{
				me.divObj.find("input[key=select_checkbox]").each(function(i,o){
					o.checked=true;
				});
				obj.attr("mark_val","1");
			}
		}
		me.initHtml=function(){
			me.divObj.css({"margin":"5px 0","border":"1px solid #EEE"});
			var searchDiv=
					'<div class="search_head_div">'+
						'<div class="search">'+
							'<span style="padding-left: 25px;font-size: 16px;display:inline-block;height:30px;">'+me.config.name+'&nbsp;</span>'+
							'<div class="dropdown">'+
								'<span class="pointer" style="position:relative;">' +'<span class="dropdownTitle">全部数据</span>' +'<span class="pl6" style="position:relative;"><img src="../../../../src/images/searchFilter/dropdown.png" style="height: auto"></span></span>'+
								'<ul class="dropdown-content"><li key_id="0">全部数据</li><li data-toggle="modal" key="openAddClassModalBtn"><span><span><img class="middle" src="../../../../src/images/searchFilter/set_icon.png" alt="设置"/><span>设置</span></span></span></li></ul>'+
							'</div>'+
							'<!-- 搜索框-->'+
							'<div class="form searchContent inlineBlock">'+
								'<span style="position: relative;"><input type="text" class="searchText" name="keyword" /><span class="table_search_btn" style="position: absolute;right: 20px;top: 0;color: #48a1dd;cursor: pointer"><img src="../../../../src/images/searchFilter/search_icon.png" alt=""/><span>搜索</span></span></span><span name="quickQueryBtn" class="pointer" data-toggle="modal" style="margin:0 5px;"><img src="../../../../src/images/searchFilter/quick_search.png" alt="" style="height: 30px;width: 30px;"/></span>'+
							'</div>'+
							'<div class="btn-wrap button_content" style="padding-top: 8px;"></div>'+
							'<div class="btn-wrap show_button_top" style="padding-top: 8px;"></div>'+
						'</div>'+
			'</div>';
			me.divObj.html(searchDiv);
			me.divObj.append('<div id="tab-main" style="padding-left:0px;padding-right:0;" class="col-lg-12 col-sm-12 col-xs-12">'+
			'<span class="set-table-btn" style="position: absolute;" ></span>'+
			'<table id="'+me.config.markId+'" ></table>'+
			'<div id="'+(me.config.markId)+'_gridPager"  style="height:30px;"></div>'+
			'</div>');
			
		};
		me.textBZ=function(text,fieldKey,rowId,data,buttonList){
			if(text || text==0){
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
						text = iconStr + '<label key_change="1" rowId="'+rowId+'" key_value="'+text.value+'" '+styleStr+'>'+text.change_text+"</label>"
					}
				}
				//处理表格组触发字段
			    if(me.leaderSetting){
					var leaderSetting=me.leaderSetting;
			    	if(leaderSetting.detail && leaderSetting.detail.click_field_key){
						if(fieldKey==leaderSetting.detail.click_field_key){
							return '<a href="javascript:;" key="open_fb_btn" key_change="1" style="width:100%;text-align: left;"  rowId="'+rowId+'" key_value="'+text+'">'+text+"</a>"
						}
			    	}
				}
				//处理超链接
				if(buttonList && buttonList.length>0){
					$.each(buttonList,function(i,obj){
						if(obj.type=="LINK" && obj.name==fieldKey && obj.isShow && obj.isShow=="1"){
							if(data.SHOW_BUTTON_IDS && data.SHOW_BUTTON_IDS.length>0){
								for(var mk in data.SHOW_BUTTON_IDS){
									if(data.SHOW_BUTTON_IDS[mk]==obj.sid){
										text='<a key_id="'+obj.sid+'" style="width:100%;text-align: left;" bt_type="LINK" type="button" row_id="'+rowId+'">'+text+'</a>'
									}
								}
							}
						}
					});
				}
			}
			if(typeof  text!="number"){
				if(!text)
					text="";
				text=tableContextHandler(text);
			}
			return '<label style="display:inline-flex;width:100%;text-align: left;height:25px;">'+text+'</label>';
		};
		/**
		 * 设置表格宽度到缓存中
		 **/
		me.setTableWidthToCatch=function(){
			var colModelList=me.gridObj.jqGrid('getGridParam','colModel');
			if(colModelList && colModelList.length>0){
				var widthData={};
				for(var i=0;i<colModelList.length;i++){
					var wobj = colModelList[i];
					var index=wobj.index;
					var width=wobj.width;
					if(index && width){
						widthData[index]=width;
					}
				}
				putStorageValue("cur_table_width_data",JSON.stringify(widthData));
			}
		}
		/**
		 * 单击按钮
		 **/
		me.clickButton=function(obj){
			obj =  $(obj);
			var data={};
			var selectRowData = me.getSelectRowObj();
			var btType=obj.attr("bt_type");
			var buttonText = obj.text();
			if(selectRowData && selectRowData.length>0){
				data['form']={"selectRows":JSON.stringify(selectRowData)};
				var ids="";
				$.each(selectRowData,function(i,sobj){
					if(sobj.id){
						if(ids){
							ids+=","+sobj.id;
						}else{
							ids+=sobj.id;
						}
					}
				});
				data['form']['selectIds']=ids;
			}else{
				if(btType=="ADD" && buttonText && buttonText.indexOf("批量")!=-1){
					tipsMsg("请勾选需要"+buttonText+"的数据","FAIL");
					return;
				}
			}
			if(!data['form']){
				data['form']={};
			}
			if(me.form_db){
				for (var pd in me.form_db) {
					if (form_db[pd] && !data['form'][pd]) {
						data['form'][pd] = form_db[pd];
					}
				}
			}
			if(me.form_pm_obj){
				for (var pd in me.form_pm_obj) {
					if (me.form_pm_obj[pd]) {
						data['form'][pd]=me.form_pm_obj[pd];
					}
				}
			}
			data['sys']=me.sys_db;
			var row_id = obj.attr("row_id");
			if((btType=="EDIT" || btType=="DELETE" || btType=="LINK") && row_id){
				data['table']=me.getTableRowDb(row_id);
			}
			setSelectRowObjBakFun(function(){return me.getSelectRowObj()});
			if(btType=="DELETE" || (btType=="ADD" && buttonText && buttonText.indexOf("批量")!=-1)){
				popMsgTip("是否确认"+buttonText,function(){
					btf.button.clickButton(obj,me.buttonConfigObj,data,function(){
//						if(idKey && pIdKey){	//zTree
//							initTree();
//						}else{
							me.gridObj.trigger("reloadGrid");
//						};
					});
				});
			}else{
				btf.button.clickButton(obj,me.buttonConfigObj,data,function(){
//					if(idKey && pIdKey){	//zTree
//						initTree();
//					}else{					//jqGird
						me.gridObj.trigger("reloadGrid");
//					};
				});
			}
		};
		/**
		 * 获取选中的行
		 **/
		me.getSelectRowObj=function(){
			var data=[];
//			if(idKey && pIdKey){//zTree
//				var treeObj = $.fn.zTree.getZTreeObj("list_tree");
//				if(treeObj){
//					//var rowId=$(me).parents("li").attr("id");
//					var rowId = $(me).attr("row_id");
//					if(rowId){			//单击行或者修改删除按钮
//						data.push(treeObj.getNodeByTId(rowId));
//					}else{				//批量按钮
//						data = treeObj.getCheckedNodes(true);
//					}
//				}
//			}else{				//jqGird
			me.divObj.find("input[key=select_checkbox]").each(function(i,obj){
				if(obj.checked==true){
					var rowid = $(obj).attr("rowid");
					data.push(me.getTableRowDb(rowid,true));
				}
			});
//			}
			return data;
		};
		/**
		 * 获取当前行
		 **/
		me.getTableRowDb=function(rowId,notSelect){
			function getBakValue(value){
				if(value && typeof value=="string"){
					if(value.indexOf("###")!=-1){
						value=value.replace("###","");
						var tempJson=JSON.parse(value);
						return tempJson.value;
					}
				}
				return value;
			}
			if(rowId){
				var rowData ={};
				me.current_select_data=rowData;
				/*if(idKey && pIdKey){	//zTree
					var treeObj = $.fn.zTree.getZTreeObj("list_tree");
					rowData=treeObj.getNodeByTId(rowId);
					for(var i in rowData){
						rowData[i]=getBakValue(rowData[i]);
					}
					current_select_data=rowData;
				}else{	*/				//jqGird
					if(!notSelect){
						me.gridObj.jqGrid('setSelection',rowId);
					}
					var rowIndex;
					var s = me.gridObj.jqGrid('getDataIDs');
					for(var i=0;i< s.length;i++){
						if(s[i]==rowId){
							rowIndex=i+1;
							break;
						}
					}
					if(rowIndex && rowIndex>0){
						rowData =me.current_db_rows[rowIndex-1];
						for(var i in rowData){
							rowData[i]=getBakValue(rowData[i]);
						}
						me.current_select_data=rowData;
					}
//				}
				var selectRow={};
				for(var i in me.current_select_data){
					if(me.current_select_data[i]){
						selectRow[i]=me.current_select_data[i];
					}
				}
				return selectRow;
			}
			return {};
		}
	};


	/**
	 * 表格过滤器
	 * */
	function tableFilter(divObj,tableObj,fieldList,fieldTypeList,fastSearchObj){
		var me = this;
		me.divObj = divObj;
		me.tableObj=tableObj;
		me.fieldList=fieldList;
		me.fastSearchObj = fastSearchObj;
		me.conditionList=tableObj.conditionList;
		me.fieldStr="";
		me.allFieldSearch=false;
		me.fieldTypeList=fieldTypeList;
		me.initEvent=function(){
			//实现模态框拖拽
			me.divObj.find(".modal").draggable({
				handle: ".modal-header", // 只能点击头部拖动
				cursor: "pointer"
			});
			$(me.divObj.find("div[name=addConditionModal]")[0]).css("overflow", "hidden");//禁止模态对话框的半透明背景滚动
			//table 排序和拖拽
			me.divObj.find("table[name=addClassTable]").sortable({
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
			//是否显示 控制开关
			me.divObj.find("table[name=addClassTable]").on('click','.div1',function() {
				$(this).toggleClass('close1');
				$(this).toggleClass('open1');
				$(this).find(".div2").toggleClass('close2');
				$(this).find(".div2").toggleClass('open2');
			});
			//只能选择一个默认分类
			me.divObj.find("table[name=addClassTable]").on("click","input[name=default]",function(){
				if($(this).prop("checked")){
					me.divObj.find("table[name=addClassTable]").find("input[name=default]").not(this).prop("checked",false);
				}
			});
			//选中分类的一行进行选中 只能选中一行
			me.divObj.find("table[name=addClassTable]").on("click","tr",function(){
				if($(this).hasClass("rowSelected")){
					$(this).removeClass("rowSelected")
				}else{
					$(this).addClass("rowSelected");
					$(this).siblings().removeClass("rowSelected")
				}
			});
			//删除选中的搜索分类
			me.divObj.find("span[key=delete_classify_btn]").on("click",function(){
				me.removeClassify();
			});
			//新增搜索分类
			me.divObj.find("span[key=open_addConditionModal_btn]").bind("click",function(){
				me.resetConditionModal();
				$(me.divObj.find("div[name=addConditionModal]")[0]).modal('show');
			});
			//编辑搜索分类
			me.divObj.find("table[name=addClassTable]").on("click","img[key=edit_classify_btn]",function(){
				var obj = this;
				$(me.divObj.find("div[name=addConditionModal]")[0]).modal('show');
				me.editClassify(obj);
			});
			//新增分线栏
			me.divObj.find("span[key=open_addLineModal_btn]").on("click",function(){
				me.divObj.find("div[name=addLineModal]").find("input[name=classify_id]").val("");
				me.divObj.find("div[name=addLineModal]").find("input[name=classify_name]").val("");
				$(me.divObj.find("div[name=addLineModal]")[0]).modal('show');
			});
			//编辑分线栏
			me.divObj.find("table[name=addClassTable]").on("click","img[key=edit_line_btn]",function(){
				var obj = this;
				var classify_id=$(obj).parents("tr").attr("key_id");
				var classify_name=$(obj).parents("tr").find("input[type=text]").val();
				me.divObj.find("div[name=addLineModal]").find("input[name=classify_id]").val(classify_id);
				me.divObj.find("div[name=addLineModal]").find("input[name=classify_name]").val(classify_name);
				$(me.divObj.find("div[name=addLineModal]")[0]).modal('show');
			});
			//保存分线栏
			me.divObj.find("button[key=addLineModal_save_btn]").bind("click",function(){
				me.addLine();
			});
			
			//保存搜索分类设置信息(排序，启用，默认)
			me.divObj.find("div[name=addClassModal]").on("click","button[key=save_classify_setting_btn]",function(){
				me.fastSearchObj.saveClassifySetting(true);
			});
			
			
			//点击回退,返回上一层模态框
			me.divObj.find("div[name=addConditionModal]").on("click","span[key=backToPre]",function(){
				$(me.divObj.find("div[name=addConditionModal]")[0]).modal('hide');
			});
			//保存搜索分类
			me.divObj.find("button[key=addConditionModal_save_btn]").bind("click",function(){
				me.saveClassify();
			});
			//新增搜索字段
			me.divObj.find("span[key=addFieldSearch]").bind("click",function(){
				me.addFieldSearch();
			});
			//切换一级搜索分类
			me.divObj.find(".dropdown-content").on("click","li",function(){
				if($(this).attr("key_id")){
					//切换一级分类时清空搜索框及快速检索表单
					//$("#clearQueryData").click();
					me.divObj.find(".fastSearch_clean").click();
					$(me.divObj.find("input[name=keyword]")[0]).val("");

					me.divObj.find(".dropdownTitle").text($(this).text()).attr("key_id",$(this).attr("key_id"));
					me.tableObj.search();
				}
			})
		};
		me.addFieldSearch=function(){
			var me = this;
			var tr = $('<tr>'+
			'<td width="5%" class="td">'+(me.divObj.find("table[name=addConditionTable] tr").length+1)+'</td>'+
			'<td width="25%">'+
			'<select class="custom-select select_field_com" style="width:130px;" name="field">' +
			me.fieldStr+
			'</select>'+
			'</td>'+
			'<td width="25%">'+
			'<select class="custom-select select_con_com" style="width:130px;" name="condition" ></select>'+
			'</td>'+
			'<td width="40%">'+
			'<input type="text" style="width: 100px;" name="value" class="input" >'+
			'<div class="time-before">'+
			'<select class="custom-select" name="unit" style="text-indent:8px;width:60px;margin-left:5px;">'+
			'<option  value="DAY">天</option>'+
			'<option value="WEEK">周</option>'+
			'<option value="MONTH">月</option>'+
			'<option value="QUARTER">季度</option>'+
			'<option value="YEAR">年</option>'+
			'</select>'+
			'</div>'+
			'<div class="time-date">'+
			'<input type="text" style="width: 100px;" name="start_value"  class="input" />'+
			'<input type="text" style="width: 100px;margin-left:5px;" name="end_value" class="input" />'+
			'</div>'+
			'</td>'+
			'<td width="5%">'+
			'<span class="delRow pointer pl12" >'+
			'<img class="middle" src="'+ctx+'/assetsv1/js/searchFilter/img/delete-selete.png" alt="删除"/>'+
			'</span>'+
			'</td>'+
			'</tr>');
			
			tr.find(".select_field_com").bind("change",function(){
				var obj = this;
				me.changeField(obj);
			});
			tr.find(".select_con_com").bind("change",function(){
				var obj = this;
				me.changeCondition(obj);
			});
			tr.find(".delRow").bind("click",function(){
				var obj = this;
				me.removeFieldSearch(obj);
			});
			me.divObj.find("table[name=addConditionTable]").append(tr);
			var lastTr = me.divObj.find("table[name=addConditionTable]").find("tr").last();
			me.changeField(lastTr.find("select[name=field]").last());
			lastTr.find(".time-date input").each(function(i,obj){
				laydate.render({
					elem:obj //指定元素
				});
			});
		};

		/**
		 * 切换搜索字段
		 */
		me.changeField=function(obj){
			obj = $(obj);
			var value = obj.val();
			var type=$(obj.parent().find('option[value="'+value+'"]')[0]).attr("key_type");
			if(type){
				type=type.toLocaleUpperCase();
			}
			var quote=$(obj.parent().find('option[value="'+value+'"]')[0]).attr("quote");
			var convert=$(obj.parent().find('option[value="'+value+'"]')[0]).attr("convert");
			var fieldTypeStr = '<option value="">请选择</option>';
			if(me.fieldTypeList && me.fieldTypeList.length>0){
				for(var i=0;i<me.fieldTypeList.length;i++){
					if(me.fieldTypeList[i].name==type){
						if(me.fieldTypeList[i].conList && me.fieldTypeList[i].conList.length>0){
							$.each(me.fieldTypeList[i].conList,function(i,obj){
								if(obj.name=="QUOTE"){
									if(quote){
										fieldTypeStr ='<option value="'+obj.name+'">'+obj.desc+'</option>';
										return;
									}
								}else if(obj.name=="CONVERT"){
									if(convert){
										fieldTypeStr ='<option value="'+obj.name+'">'+obj.desc+'</option>';
										return;
									}
								}else{
									fieldTypeStr +='<option value="'+obj.name+'">'+obj.desc+'</option>';
								}
							});
						}
					}
				}
			}
			$(obj.parent().parent().find("select[name=condition]")[0]).html(fieldTypeStr);
			$(obj.parent().parent().find("select[name=condition]")[0]).change();
		}

		/**
		 * 切换搜索字段类型
		 */
		me.changeCondition=function(obj){
			obj = $(obj);
			obj.parent().parent().find(".time-date").hide()
			obj.parent().parent().find(".time-before").hide()
			obj.parent().parent().find("input[name=value]").hide();
			obj.parent().parent().find("div.ms-ctn").remove();
			var value= obj.val();
			if(value=="TODAY" || value=="THIS_WEEK" || value=="THIS_MONTH" || value=="THIS_SEASON" ||value=="THIS_YEAR" || value=="NULL"  || value=="NOT_NULL" || value=="TOMORROW" || value =="YESTERDAY" || value =="NEXT_WEEK" || value =="UP_WEEK" || value =="NEXT_MONTH" || value =="UP_MONTH" || value =="NEXT_SEASON"  || value =="UP_SEASON" || value =="NEXT_YEAR" || value =="UP_YEAR"
			){
				obj.parent().parent().find("input[name=value]").hide();
			} else if(value == "L_" || value=="N_") {
				obj.parent().parent().find(".time-before").css("display","inline-block")
				obj.parent().parent().find("input[name=value]").show();
			} else if(value == "IN"){
				obj.parent().parent().find(".time-date").css("display","inline-block")
			} else if(value == "QUOTE"){	//引用
				obj.parent().parent().find("input[name=value]").after('<input type="text" style="width: 130px;float:left" name="temp">');
				var quoteStr=obj.parent().parent().find("[name='field']").find('option:selected').attr("quote");
				if(quoteStr){
					var defaultValue=[];	//修改时显示原来的值
					var oldValue=obj.parent().parent().find("input[name=value]").val();
					if(oldValue){
						defaultValue=oldValue.split("|#|");
					}
					var quote=JSON.parse(quoteStr);
					var wordbookId=quote.id;
					var fieldKey=quote.field_key;
					var params={};
					if(quote.params){
						for(var i=0;i<quote.params.length;i++){
							var p = quote.params[i];
							if(p.p_name && p.p_value){
								params[p.p_name]=p.p_value;
							}
						}
					}
					if(wordbookId && fieldKey){
						obj.parent().parent().find("input[name=temp]").magicSuggest({
							data: ctx+"/cloud/table/list/reader/wordbook/"+wordbookId,
							allowFreeEntries: false,
							autoSelect:true,
							dataUrlParams:params,
							value:defaultValue,
							valueField:fieldKey,
							maxSelection:1000,//设置选择个数
							placeholder: "请选择",
							displayField:fieldKey,//定义显示的字段
							maxSelectionRenderer:function(){
								return "";
							},
							selectionRenderer:function(data){
								var value=data[fieldKey];
								return value;
							}
						});
					}
				}
			} else if(value == "CONVERT"){	//转换
				obj.parent().parent().find("input[name=value]").after('<input type="text" style="width: 130px;float:left" name="temp">');
				var convertStr=obj.parent().parent().find("[name='field']").find('option:selected').attr("convert");
				if(convertStr){
					var defaultValue=[];	//修改时显示原来的值
					var oldValue=obj.parent().parent().find("input[name=value]").val();
					var optionArr=[];
					var convertArr=JSON.parse(convertStr);
					for(var i=0;i<convertArr.length;i++){
						var temp = {"value":JSON.stringify(convertArr[i].filter),"name":convertArr[i].change_text};
						optionArr.push(temp);
						if(oldValue && oldValue.indexOf(JSON.stringify(convertArr[i].filter))!=-1){
							defaultValue.push(temp);
						}
					}
					obj.parent().parent().find("input[name=temp]").magicSuggest({
						data: optionArr,
						allowFreeEntries: false,
						autoSelect:true,
						value:defaultValue,
						valueField:"value",
						maxSelection:1000,//设置选择个数
						placeholder: "请选择",
						displayField:"name",//定义显示的字段
						maxSelectionRenderer:function(){
							return "";
						},
						selectionRenderer:function(data){
							var value=data[fieldKey];
							return data["name"];
						}
					});
				}
			} else{
				obj.parent().parent().find("input[name=value]").show();
			}
		}
		
		/**
		 * 初始化搜索条件
		 */
		me.initConditionModal=function(json){
			me.resetConditionModal();
			if(json.id){
				me.divObj.find("[name=addConditionTable]").parent().find("input[name=classify_id]").val(json.id);
			}
			if(json.name){
				me.divObj.find("[name=addConditionTable]").parent().find("input[name=classify_name]").val(json.name);
			}
			me.setConditionFields(json.conObj,json.sqlExpression);
		}

		/**
		 * 保存搜索分类
		 */
		me.saveClassify=function(){
			var me = this;
			var classify_name=me.divObj.find("div[name=addConditionModal]").find("input[name=classify_name]").val();
			var classify_id=me.divObj.find("div[name=addConditionModal]").find("input[name=classify_id]").val();
			if(!classify_name){
				me.divObj.find("div[name=addConditionModal]").find("input[name=classify_name]").focus();
				tipsMsg("请输入分类名称","FAIL");
				return;
			}
			if(classify_id && classify_id.indexOf("10000")!=-1){
				tipsMsg("公共条件不能修改","FAIL");
				return;
			}
			var conObj=me.getDbConfig(me.divObj.find("div[name=addConditionModal]").find("[name=addConditionTable] tr"));
			var sqlExpression=me.divObj.find("div[name=addConditionModal]").find("textarea[name=sqlExpression]").val();
			if(conObj && conObj.length>0){
				var setting={name:classify_name,sqlExpression:sqlExpression,conObj:conObj};
				$.post(ctx+"/cloud/sbehaviourConfig/use/saveConfig/TABLE_CONDITION",{setting:JSON.stringify(setting),tableId:me.tableObj.tableId,id:classify_id},function(json){
					if(json.result=="Success" || json.result=="SUCCESS"){
						if(classify_id){	//修改分类
							me.divObj.find("div[name=addConditionModal] tbody").find("tr[key_id="+classify_id+"]").find("td:first").text(classify_name);
						}else{	//新增分类
							me.showClassify({classifyId:json.map.obj.sid,name:classify_name});
						}
						var obj=json.map.obj;
						me.conditionList[obj.sid]=obj;
						me.divObj.find("div[name=addConditionModal]").modal("hide");
						me.fastSearchObj.saveClassifySetting();
					}else{
						tipsMsg(json.resultMsg,"FAIL");
					}
				})
			}else{
				tipsMsg("请设置搜索条件","FAIL");
			}
		}
		
		/**
		* 修改搜索分类
		*/
		me.editClassify=function(obj){
			var me = this;
			me.resetConditionModal();
			//设置分类name、id属性
			var key_id=$(obj).parents("tr").attr("key_id");
			var isCopy=$(obj).attr("is-copy");
			var conObj = me.conditionList[key_id];
			if(conObj && conObj.setting){
				var setting = JSON.parse(conObj.setting);
				if(isCopy && isCopy=="0"){
					me.divObj.find("[name=addConditionTable]").parent().find("input[name=classify_id]").val(key_id);
					me.divObj.find("[name=addConditionTable]").parent().find("input[name=classify_name]").val(setting.name);
				}
				me.setConditionFields(setting.conObj,setting.sqlExpression);
			}
		}
		
		/**
		*删除搜索分类
		*/
		me.removeClassify=function(){
			var classifyId=me.divObj.find("table[name=addClassTable]").find(".rowSelected").attr("key_id");
			if(classifyId){
				if(classifyId.indexOf("10000")!=-1){	//公共分类不能删除
					tipsMsg("公共分类不能删除","FAIL");
					return;
				}
				confirmMsg("确定要删除该分类吗",function () {
					$.post(ctx+"/cloud/sbehaviourConfig/use/remove/config",{id:classifyId},function(json){
						if(json.result=="Success" || json.result=="SUCCESS"){
							me.divObj.find("table[name=addClassTable]").find(".rowSelected").remove();
							delete me.conditionList[classifyId];
							//删除的分类为当前选中的分类，切换为全部数据
							var currClassify=me.divObj.find(".dropdownTitle").attr("key_id");
							if(currClassify && currClassify==classifyId){
								me.divObj.find(".dropdown-content").find("li:first").click();
							}
							me.fastSearchObj.saveClassifySetting();
						}else{
							tipsMsg(json.resultMsg,"FAIL");
						}
					});
				});
			}
		}
		
		/**
		* 移除搜索字段
		*/
		me.removeFieldSearch=function(obj){
			obj = $(obj);
			var tableObj=obj.parents("table");
			obj.parents("tr").remove();
			tableObj.find("tr").each(function(i,o){
				$(o).find("td").first().html(i+1);
			});
		}
		
		/**
		* 保存分线栏
		*/
		me.addLine=function(){
			var classify_id=me.divObj.find("div[name=addLineModal]").find("input[name=classify_id]").val();
			var classify_name=me.divObj.find("div[name=addLineModal]").find("input[name=classify_name]").val();
			if(!classify_name){
				tipsMsg("请输入分线栏名称","FAIL");
				return;
			}
			var setting={name:classify_name,type:"line"};
			$.post(ctx+"/cloud/sbehaviourConfig/use/saveConfig/TABLE_CONDITION",{setting:JSON.stringify(setting),tableId:me.tableObj.tableId,id:classify_id},function(json){
				me.divObj.find("div[name=addLineModal]").modal("hide");
				if(json.result=="Success" || json.result=="SUCCESS"){
					if(classify_id){	//修改
						var size=classify_name.length>8?14:(classify_name.length*1.5);
						me.divObj.find("table[name=addClassTable] tbody").find("tr[key_id="+classify_id+"]").find("input[type=text]").val(classify_name).attr("size",size);
					}else{	//新增
						me.showClassify({classifyId:json.map.obj.sid,name:classify_name,type:"line"});
					}
					var obj=json.map.obj;
					//conditionList[obj.sid]=obj;
					//showClassify({classifyId:obj.sid,name:classify_name,type:'line'});
					me.saveClassifySetting();
				}else{
					tipsMsg(json.resultMsg,"FAIL");
				}
			})
		}


		/**
		 * 重置搜索分类编辑弹窗
		 */
		me.resetConditionModal=function(){
			me.divObj.find("[name=addConditionTable]").parent().find("input[name=classify_id]").val("");
			me.divObj.find("[name=addConditionTable]").parent().find("input[name=classify_name]").val("");
			me.divObj.find("[name=addConditionTable]").parent().find("textarea[name=sqlExpression]").val("");
			me.divObj.find("[name=addConditionTable]").empty();
		}

		/**
		 * 回显查询条件
		 **/
		me.setConditionFields=function(configObj,sqlExpression){
			if(configObj && configObj.length>0){
				//回显当前选中分类搜索条件
				$.each(configObj,function(i,field){
					me.addFieldSearch();
					var lastFieldTr=me.divObj.find("[name=addConditionTable] tr").last();
					for(var key in field){
						lastFieldTr.find("[name^="+key+"]").val(field[key]);
					}
					lastFieldTr.find("select[name=field]").val(field.field_key).change();
					lastFieldTr.find("[name=condition]").val(field["con"]).change();
				});
			}
			if(sqlExpression){
				me.divObj.find("[name=addConditionTable]").parent().find("textarea[name=sqlExpression]").val(sqlExpression);
			}
		}
		/**
		 * 显示搜索分类(快速选择下拉项、编辑界面)
		 */
		me.showClassify=function(userSetting){
			var defaultSetting={classifyId:"",name:"",isShow:true,isDefault:false,type:""};
			$.extend(defaultSetting, userSetting);	//以传入参数覆盖默认设置信息
			var name=defaultSetting.name;
			var classifyId=defaultSetting.classifyId;
			var isShow=defaultSetting.isShow;
			var isDefault=defaultSetting.isDefault;
			if(defaultSetting.type && defaultSetting.type=="line"){	//分线栏
				var size=name.length>8?14:(name.length*1.5);
				me.divObj.find("table[name=addClassTable] tbody").append('<tr key_id="'+classifyId+'" class="newPartingLine">'
						+'<td colspan="3">'
						+'<div>'
						+'<input type="text" size="'+size+'" value="'+name+'" readonly/>'
						+ '</div>'
						+'</td>'
						+'<td>'
						+'<span><img class="middle" src="'+ctx+'/assetsv1/js/searchFilter/img/pencil-selete.png" alt="编辑" title="编辑" key="edit_line_btn"/></span>'
						+'</td>'
						+'</tr>');
				me.divObj.find(".dropdown-content").find("li:last").before('<li>'
						+'<div class="newPartingLine" style="height:40px;">'
						+'<div>'
						+'<label>'+name+'</label>'
						+'</div>'
						+'</div></li>');
				return;
			}
			var editStr='<span><img class="middle" src="'+ctx+'/assetsv1/js/searchFilter/img/pencil-selete.png" alt="编辑" title="编辑" key="edit_classify_btn" is-copy="0"/></span>';
			if(classifyId && classifyId.indexOf("10000")!=-1){	//普通用户不能修改公共条件
				editStr="";
				name += "(公共)";
			}
			me.tableObj.divObj.find("table[name=addClassTable]").find("tbody").append(
					'<tr key_id="'+classifyId+'">'+
					'<td>'+name+'</td>'+
					'<td>'+
					'<div class="div1 '+(isShow?"close1":"open1")+'">'+
					'<span class="left"></span>'+
					'<span class="right"></span>'+
					'<div class="div2 '+(isShow?"close2":"open2")+'"></div>'+
					'</div>'+
					'</td>'+
					'<td>'+
					'<span class="checkboxContent" style="position: relative;">'+
					'<input type="checkbox" name="default" '+(isDefault?"checked":"")+' id="'+classifyId+'"/>'+
					'<label for="'+classifyId+'"></label>'+
					'</span>'+
					'</td>'+
					'<td>'+
					editStr+
					'<span class="copyTr pl6"><img class="middle" src="'+ctx+'/assetsv1/js/searchFilter/img/copy.png" alt="复制"  title="复制" key="edit_classify_btn" is-copy="1"/></span>'+
					'</td>'+
					'</tr>'
			);
			if(defaultSetting.isShow){
				me.divObj.find(".dropdown-content").find("li:last").before('<li key_id="'+classifyId+'"><span>'+name+'</span></li>');
			}
			if(defaultSetting.isDefault){
				me.divObj.find(".dropdownTitle").text(name).attr("key_id",classifyId);
			}
		}



		/**
		 * 将搜索分类编辑弹窗的字段解析位json字段
		 */
		me.getDbConfig=function(trList){
			var conObj=[];
			trList.each(function(i,obj){
				obj = $(obj);
				var field=obj.find("select[name=field]").val();
				var condition=obj.find("select[name=condition]").val();
				var value=obj.find("input[name=value]").val();
				if(condition=="CONVERT"){
					var convert=[];
					obj.find("input[name='temp[]']").each(function() {
						convert.push(JSON.parse($(this).val()));
					});
					value=JSON.stringify(convert);
				}else if(condition=="QUOTE"){
					value=obj.find("input[name='temp[]']").map(function() {
						return $(this).val();
					}).get().join("|#|");
				}
				var end_val=obj.find("input[name=end_value]").val();
				var start_val=obj.find("input[name=start_value]").val();
				var unit=obj.find("select[name=unit]").val();
				conObj.push({field_key:field,con:condition,value:value,end_val:end_val,start_val:start_val,unit:unit});
			});
			return conObj;
		}

		me.init=function(){
			var me = this;
			initHtml();
			me.initEvent();
			var fieldStr="";
			if(me.fieldList && me.fieldList.length>0){
				$.each(me.fieldList,function(i,field){
					if(me.allFieldSearch || field.isSearch=="1" || field.isShowSearch=="1"){
						fieldStr+='<option key_type="'+field.fieldType+'" ';
						if(field.setting){
							var setting = JSON.parse(field.setting);
							if(!jQuery.isEmptyObject(setting.wordbook)){
								fieldStr+='quote=\''+JSON.stringify(setting.wordbook)+'\' ';
							}
							if(setting.showSetting && setting.showSetting.length>0){
								fieldStr+='convert=\''+JSON.stringify(setting.showSetting)+'\' ';
							}
						}
						fieldStr+='value="'+field.columnName+'">'+field.title+'</option>';
					}
				});
			}
			me.fieldStr=fieldStr;
			function initHtml(){
				me.divObj.append(
						'<!---表单--->'+
						'<div  class="modal fade"  name="addClassModal" tabindex="-1" role="dialog" aria-labelledby="addClassModalLabel" data-backdrop="static">'+
						'<div class="modal-dialog" role="document">'+
						'<div class="modal-content">'+
						'<div class="modal-header modalColor">'+
						'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
						'<h5 class="modal-title" name="addClassModalLabel"><span><img class="middle" src="../../../../src/images/searchFilter/set_icon.png" alt="设置分类"/><span class="middle">设置分类</span></span></h5>'+
						'</div>'+
						'<div class="modal-body">'+
						'<div class="action" style="padding-top: 0;height: 40px;">'+
						'<span class="pointer pl6" key="open_addConditionModal_btn"><span><img class="middle" src="../../../../src/images/searchFilter/add-selete.png" alt="添加分类"/><span class="middle">添加分类</span></span></span>'+
						'<span class="pointer pl12" key="open_addLineModal_btn" ><img class="middle" src="../../../../src/images/searchFilter/add-selete.png" alt="添加分线栏"/><span class="middle">添加分线栏</span></span>'+
						'<span class="pointer pl12" key="delete_classify_btn"><img class="middle" src="../../../../src/images/searchFilter/delete-selete.png" alt="删除"/><span class="middle">删除</span></span>'+
						'</div>'+
						'<input type="hidden" name="tableConditionSettingId">'+
						'<table name="addClassTable" class="connectedSortable" style="width: 100%" border="0" cellspacing="0" cellpadding="0"><thead><tr bgcolor="#e4e8ec"><td>名称</td><td>是否显示</td><td>设置为默认</td><td>操作</td></tr></thead><tbody></tbody></table>'+
						'</div>'+
						'<div class="modal-footer textCenter"><button type="button" key="save_classify_setting_btn"  class="btn btn-primary">保存</button><button type="button" class="btn btn-default" data-dismiss="modal">关闭</button></div>'+
						'</div>'+
						'</div>'+
						'</div>'+
						'<!--分割线--->'+
						'<div  class="modal fade"  name="addConditionModal" tabindex="-1" role="dialog" aria-labelledby="addConditionModalLabel" data-backdrop="static">'+
						'<div id="modalDialog" class="modal-dialog" role="document">'+
						'<div class="modal-content">'+
						'<div class="modal-header modalColor">'+
						'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
						'<h5 class="modal-title" name="addConditionModalLabel"><span><img class="middle" src="../../../../src/images/searchFilter/set_icon.png" alt="设置分类"/></span><span class="middle">设置分类</span></h5>'+
						'</div>'+
						'<div class="modal-body">'+
						'<div class="action operation">'+
						'<span key="backToPre" key="ft">回退</span>'+
						'<span class="right pointer" key="addFieldSearch"><span><img class="middle" src="../../../../src/images/searchFilter/addCondition.png" alt="添加操作"/><span class="middle">添加操作</span></span></span>'+
						'</div>'+
						'<div key="flname_div"><input type="hidden" name="classify_id">分类名称：<input type="text" style="width: 350px;" name="classify_name" class="input" placeholder="请输入分类名称"  maxlength="10"></div>'+
						'<table name="addConditionTable" class="connectedSortable" style="width: 100%;margin-top:10px;" border="0" cellspacing="0" cellpadding="0"></table>'+
						'<div key="sqlExp_div"><h5 class="pl6" style="margin:5px 0px;">筛选器逻辑编辑，不设置默认为AND例子 (1 AND 2) OR 3</h5><textarea class="form-control" name="sqlExpression"></textarea></div>'+
						'</div>'+
						'<div class="modal-footer textCenter"><button type="button" key="addConditionModal_save_btn" class="btn btn-primary">保存</button><button type="button" class="btn btn-default" data-dismiss="modal">关闭</button></div>'+
						'</div>'+
						'</div>'+
						'</div>'+
						'<!-- 模态框（Modal）保存分线栏 -->'+
						'<div class="modal fade" name="addLineModal" tabindex="-1" role="dialog" aria-labelledby="addLineModalLabel" aria-hidden="true" data-backdrop="static">'+
						'<div class="modal-dialog">'+
						'<div class="modal-content">'+
						'<div class="modal-header modalColor" style="padding: 10px"><button type="button" class="close" data-miss="modal" aria-hidden="true">&times;</button><h5 class="modal-title" id="addLineModalLabel">分线栏</h5></div>'+
						'<div class="modal-body">'+
						'<form role="form" name="addLineForm" style="margin:20px 0 0 50px;">'+
						'<div class="form-group"><label class="queryLabel"><span>分线栏名称</span><span class="pl3">:</span></label><span class="pl9"><input type="hidden" name="classify_id"><input type="text" name="classify_name"></span></div>'+
						'</form>'+
						'</div>'+
						'<div class="modal-footer textCenter"><button type="button" key="addLineModal_save_btn" class="btn btn-primary">确定</button><button type="button" class="btn btn-default" data-dismiss="modal">取消</button></div>'+
						'</div>'+
						'</div>'+
						'</div>'

						);
			}
		}
	}

	function fastSearch(divObj,tableObj,fieldList){
		var me = this;
		me.divObj = divObj;
		me.tableObj=tableObj;
		me.fieldList=fieldList;
		me.quickQueryMagicSuggestList=[];
		me.saveClassifySetting=function(closeModel){
			var classifyList = me.tableObj.divObj.find("table[name=addClassTable]").find("tr");
			var setting=[];
			me.tableObj.divObj.find(".dropdown-content").find("li").not(":last,:first").remove();	//刷新搜索分类下拉选择列表
			if(classifyList && classifyList.length>0){
				classifyList.each(function(i,obj){
					if($(obj).attr("key_id")){
						var classify={};
						classify.classifyId=$(obj).attr("key_id");
						classify.type=$(obj).hasClass("newPartingLine")?"line":"";
						if(classify.type){
							classify.name=$.trim($(obj).find("input[type=text]").val());
							me.tableObj.divObj.find(".dropdown-content").find("li:last").before('<li>'
									+'<div class="newPartingLine" style="height:40px;">'
									+'<div>'
									+'<label>'+classify.name+'</label>'
									+'</div>'
									+'</div></li>');
						}else{
							classify.name=$.trim($(obj).find("td:first").text());
							classify.isShow = $(obj).find(".div1").hasClass("close1");
							classify.isDefault = $(obj).find("input[name=default]").prop("checked");
							if(classify.isShow){
								me.tableObj.divObj.find(".dropdown-content").find("li:last").before('<li key_id="'+classify.classifyId+'"><span>'+classify.name+'</span></li>');
							}
						}
						setting.push(classify);
					}
				});
			}
			var tableConditionSettingId=me.tableObj.divObj.find("input[name=tableConditionSettingId]").val();
			$.post(ctx+"/cloud/sbehaviourConfig/use/saveConfig/TABLE_CONDITION_SETTING",{setting:JSON.stringify(setting),tableId:me.tableObj.tableId,id:tableConditionSettingId},function(json){
				if(json.result=="Success" || json.result=="SUCCESS"){
					me.tableObj.divObj.find("input[name=tableConditionSettingId]").val(json.map.obj.sid);
					if(closeModel){
						me.tableObj.divObj.find("div[name=addClassModal]").modal("hide");
						me.tableObj.divObj.find("div[name=addConditionModal]").modal("hide");
					}
				}else{
					tipsMsg(json.resultMsg,"FAIL");
				}
			})
		};
		me.init=function(){
			initHtml();
			initEvent();
			initQuickQuery(me.fieldList);

			function initEvent(){
				me.divObj.find(".fastSearch_save_type").bind("click",function(){
					me.divObj.find("input[name=classify_name]").val('');
					$(me.divObj.find("div[name=saveQueryDataToClass]")[0]).modal('show');
				});
				me.divObj.find(".fastSearch_query").bind("click",function(){
					me.tableObj.search();
				});
				me.divObj.find(".fastSearch_clean").bind("click",function(){
					me.divObj.find(".queryForm")[0].reset();
					me.divObj.find(".queryForm").find(".selected").removeClass("selected");
					if(me.quickQueryMagicSuggestList && me.quickQueryMagicSuggestList.length>0){
						for(var i=0;i<me.quickQueryMagicSuggestList.length;i++){
							me.quickQueryMagicSuggestList[i].clear();
						}
					}
				});
				me.divObj.find(".queryForm").on("click",".queryTitle",function(){
					if(!$(this).parents(".form-group").attr("condition")){	//日期类型只能单选
						$(this).siblings(".queryTitle").removeClass("selected");
					}
					$(this).toggleClass("selected");
				});
				me.divObj.find(".queryForm").on("click",".customTimeBtn",function(){
					$(this).siblings(".queryTitle").removeClass("selected");
					$(this).siblings().toggleClass("hide")
				})
				me.divObj.find(".fastSearch_save_type_submit_btn").bind("click",function(){
					saveQuickQuery();
				});
			};

			function initQuickQuery(fieldList){
				divObj.find(".queryForm").empty();
				$.each(fieldList,function(i,field){
					if(field.isShowSearch=="1"){
						var fieldHtml="";
						var condition="";
						if(field.setting){	//存在字段引用/字段转换
							var setting = JSON.parse(field.setting);
							if(!jQuery.isEmptyObject(setting.wordbook)){
								condition="QUOTE";
								fieldHtml+='<input type="text" name="temp" quote=\''+JSON.stringify(setting.wordbook)+'\' style="width:60%"/>';
							}else if(setting.showSetting && setting.showSetting.length>0){
								condition="CONVERT";
								for(var i=0;i<setting.showSetting.length;i++){
									fieldHtml+='<span class="queryTitle" convert=\''+JSON.stringify(setting.showSetting[i].filter)+'\'>'+setting.showSetting[i].change_text+'</span>';
								}
							}
						}else if("DATE,DATETIME".indexOf(field.fieldType)!=-1){
							fieldHtml+='<span class="queryTitle" condition="TODAY">今天</span>';
							fieldHtml+='<span class="queryTitle" condition="TOMORROW">明天</span>';
							fieldHtml+='<span class="queryTitle" condition="YESTERDAY">昨天</span>';
							fieldHtml+='<span class="queryTitle" condition="THIS_WEEK">本周</span>';
							fieldHtml+='<span class="queryTitle" condition="NEXT_WEEK">下周</span>';
							fieldHtml+='<span class="queryTitle" condition="UP_WEEK">上周</span>';
							fieldHtml+='<span class="queryTitle" condition="THIS_MONTH">本月</span>';
							fieldHtml+='<span class="queryTitle" condition="NEXT_MONTH">下月</span>';
							fieldHtml+='<span class="queryTitle" condition="UP_MONTH">上月</span>';
							fieldHtml+='<span class="queryTitle" condition="THIS_SEASON">本季度</span>';
							fieldHtml+='<span class="queryTitle" condition="NEXT_SEASON">下季度</span>';
							fieldHtml+='<span class="queryTitle" condition="UP_SEASON">上季度</span>';
							fieldHtml+='<span class="queryTitle" condition="THIS_YEAR">本年</span>';
							fieldHtml+='<span class="queryTitle" condition="NEXT_YEAR">下年</span>';
							fieldHtml+='<span class="queryTitle" condition="UP_YEAR">上年</span>';
							fieldHtml+='<span class="customTimeBtn customTime" style="background: #ddd;cursor: pointer;">选择时间</span>';
							fieldHtml+='<span class="customTime hide"><input type="text" name="start_val" class="time-date" style="width:105px;height:30px;" placeholder="开始时间"/></span>';
							fieldHtml+='<span class="customTime hide"><input type="text" name="end_val" class="time-date" style="width:105px;height:30px;" placeholder="截至时间"/></span>';
						}else if(field.fieldType=="TEXT"){
							condition="CL";
							fieldHtml+='<input type="text" name="value">';
						}else if(field.fieldType=="NUMBER"){
							condition="EQ";
							fieldHtml+='<input type="text" name="value">';
						}
						if(fieldHtml){
							divObj.find(".queryForm").append('<div class="form-group field-warp" field="'+field.columnName+'" condition="'+condition+'">'+
									'<label class="col-xs-3 queryLabel">'+
									'<span>'+field.title+'</span>'+
									'</label>'+
									'<div class="col-xs-9">'+
									fieldHtml+
									'</div>'+
									'</div>');
						}
					}
				});
				//字段引用使用多选搜索框
				divObj.find(".queryForm").find("div[condition=QUOTE] input[name=temp]").each(function(){
					var quoteStr=$(this).attr("quote");
					if(quoteStr){
						var quote=JSON.parse(quoteStr);
						var wordbookId=quote.id;
						var fieldKey=quote.field_key;
						var params={};
						if(quote.params){
							for(var i=0;i<quote.params.length;i++){
								var p = quote.params[i];
								if(p.p_name && p.p_value){
									params[p.p_name]=p.p_value;
								}
							}
						}
						if(wordbookId && fieldKey){
							var tempMagicSuggest=
									$(this).magicSuggest({
										data: ctx+"/cloud/table/list/reader/wordbook/"+wordbookId,
										allowFreeEntries: false,
										autoSelect:true,
										dataUrlParams:params,
										value:[],
										valueField:fieldKey,
										maxSelection:1000,//设置选择个数
										placeholder: "请选择",
										displayField:fieldKey,//定义显示的字段
										maxSelectionRenderer:function(){
											return "";
										},
										selectionRenderer:function(data){
											var value=data[fieldKey];
											return value;
										}
									});
							me.quickQueryMagicSuggestList.push(tempMagicSuggest);
						}
					}
				});
				//初始化日期输入框
				divObj.find(".queryForm").find(".time-date").each(function(i,obj){
					laydate.render({
						elem:obj //指定元素
					});
				});
			}

			function saveQuickQuery(){
				var classify_name=me.divObj.find("div[name=saveQueryDataToClass]").find("input[name=classify_name]").val();
				if(!classify_name){
					tipsMsg("请输入分类名称","FAIL");
					return;
				}
				var conObj=me.getQuickQueryConfig();
				if(conObj && conObj.length>0){
					var setting={name:classify_name,conObj:conObj};
					$.post(ctx+"/cloud/sbehaviourConfig/use/saveConfig/TABLE_CONDITION",{setting:JSON.stringify(setting),tableId:me.tableObj.tableId},function(json){
						if(json.result=="Success" || json.result=="SUCCESS"){
							me.tableObj.tableFilterxx.showClassify({classifyId:json.map.obj.sid,name:classify_name});
							var obj=json.map.obj;
							me.tableObj.conditionList[obj.sid]=obj;
							me.saveClassifySetting();
						}else{
							tipsMsg(json.resultMsg,"FAIL");
						}
					})
				}else{
					tipsMsg("没有任何搜索条件","FAIL");
				}
				me.divObj.find("div[name=saveQueryDataToClass]").modal("hide");
			}

			function initHtml(){
				me.divObj.append(
						'<div class="modal fade" name="queryModal" tabindex="-1" role="dialog" aria-labelledby="queryModalLabel" aria-hidden="true" data-backdrop="static">'+
						'<div class="modal-dialog">'+
						'<div class="modal-content">'+
						'<div class="modal-header modalColor" style="padding: 10px">'+
						'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
						'<h5 class="modal-title" id="queryModalLabel">快速查询</h5>'+
						'</div>'+
						'<div class="modal-body" style="min-height: 300px">'+
						'<form role="form" class="form-horizontal queryForm"></form>'+
						'</div>'+
						'<div class="modal-footer">'+
						'<button type="button" class="btn btn-primary fastSearch_save_type" data-toggle="modal" >保存到分类</button>'+
						'<button type="button" class="btn btn-primary fastSearch_query" data-dismiss="modal">查询</button>'+
						'<button type="button" class="btn btn-default fastSearch_clean" >清空</button>'+
						'</div>'+
						'</div>'+
						'</div>'+
						'</div>'+
						'<!-- 模态框（Modal）保存查询到分类 -->'+
						'<div class="modal fade" name="saveQueryDataToClass" tabindex="-1" role="dialog" aria-labelledby="saveQueryDataToClassLabel" aria-hidden="true" data-backdrop="static">'+
						'<div class="modal-dialog">'+
						'<div class="modal-content">'+
						'<div class="modal-header modalColor" style="padding: 10px">'+
						'<button type="button" class="close" data-miss="modal" aria-hidden="true">&times;</button>'+
						'<h5 class="modal-title" id="saveQueryDataToClassLabel">快速查询</h5>'+
						'</div>'+
						'<div class="modal-body">'+
						'<form role="form" id="saveClass" style="margin:20px 0 0 50px;">'+
						'<div class="form-group">'+
						'<label class="queryLabel">'+
						'<span>分类名称</span>'+
						'</label>'+
						'<span class="pl9">'+
						'<input type="text" name="classify_name" class="form-control" maxlength="10">'+
						'</span>'+
						'</div>'+
						'</form>'+
						'</div>'+
						'<div class="modal-footer textCenter">'+
						'<button type="button"  class="btn btn-primary fastSearch_save_type_submit_btn">确定</button>'+
						'<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>'+
						'</div>'+
						'</div>'+
						'</div>'+
						'</div>'
				);
			}
		};
		me.getQuickQueryConfig=function (){
			var configObj=[];
			$.each(divObj.find(".queryForm").find(".form-group"),function(){
				obj=$(this);
				var field=obj.attr("field");
				var condition=obj.attr("condition");
				var con={field_key:field,con:condition};//value:value,end_val:end_val,start_val:start_val,unit:unit});
				if(!condition){	//日期类型
					condition = obj.find(".queryTitle.selected:first").attr("condition");;
					if(!condition){	//自定义
						var startVal=obj.find("input[name=start_val]").val();
						var endVal=obj.find("input[name=end_val]").val();
						if(!startVal && !endVal){
							return true;
						}
						con["con"]="IN";
						con["start_val"]=startVal;
						con["end_val"]=endVal;
					}else{
						con["con"]=condition;
					}
				}else if(condition=="CONVERT"){
					var convert=[];
					obj.find(".queryTitle.selected").each(function() {
						convert.push(JSON.parse($(this).attr("convert")));
					});
					if(convert.length==0){
						return true;
					}
					con["value"]=JSON.stringify(convert);
				}else if(condition=="QUOTE"){
					var value=obj.find("input[name='temp[]']").map(function() {
						return $(this).val();
					}).get().join("|#|");
					if(!value){
						return true;
					}
					con["value"]=value;
				}else{
					var value = obj.find("input[name=value]").val();
					if(!value){
						return true;
					}
					con["value"]=value;
				}
				configObj.push(con);
			});
			return configObj;
		}
	}


    /*******************************************************************************/
	var openWindowMarker=false;
    function openWindow(url,bakFun){
		openWindowMarker=true;
        window.openWindowBanFun=bakFun;
        $("#config_btn_panel").css({"width":"1100px","right":"0px"});
        $("#config_btn_panel").html('<div class="clearfix head-line"><em class="back-btn" onclick="javascript:cloudOpenWindow();"></em></div><iframe width="100%" height="100%" scrolling="no" frameborder="0" src="'+url+'"></iframe>');
        $('#config_btn_panel').addClass('right-wrap-show animated fadeInRight');
    }
    function cloudOpenWindow(isSuccess){
		openWindowMarker=false;
        $("#config_btn_panel").removeClass("right-wrap-show fadeInRight");
        $("#config_btn_panel").animate({"right":"-1100px","opacity":"0.7"},600);
		$("#config_btn_panel").empty();
        if(isSuccess){
            if(window.openWindowBanFun){
                window.openWindowBanFun();
            }
        }
    }
	
	
	/**
	 * 打开表格组附表相关方法
	 */
	var fb_window_switch=false;
	function openFBWindow(tableTeamId,dataId,text,formDB,bakFun){
		window.openWindowBanFun=bakFun;
		openFBWindowNew(tableTeamId,dataId,text,formDB);
	}
	function openFBWindowNew(tableTeamId,dataId,text,formDB){
		fb_window_switch=true;
		var iframeHeight=$(window).height()-56;
		if(dataId){
			var data={data_id:dataId/* ,menuId:cur_menuId+"" */};
			if(formDB){
				for (var pd in formDB) {
					if (formDB[pd]) {
						data[pd]=formDB[pd];
					}
				}
			}
			var pmStr = (btf.getParamsStr(data));
			// var url = ctx+'/cloud/menu/tableTeam/detail/'+tableTeamId+"?"+pmStr;
             var url = './tableTeamDetail.html?tableTeamId=' + tableTeamId + pmStr;
			$("#table_block").html('<iframe  name="content_iframe" class="content_iframe_s" src="'+url+'" width="100%" height="'+iframeHeight+'px" frameborder="0"></iframe>');
			showRightPopGetWidth("fb_btn_panel","1100px");
		}else{
			tipsMsg("主键不能为空","FAIL");
		}
	}
	function closeFBWindow(isSuccess,isNew){
		fb_window_switch=false;
		hideRightPopGetWidth("fb_btn_panel", "1100px");
		if(isSuccess){
			if(window.openWindowBanFun){
				window.openWindowBanFun();
			}
		}
	}
	//单击行刷新附表时，保持当前打开的附表页签
    var currentFB_Label_MARK;
	function setCurrentFBLabelMARK(mark){
		currentFB_Label_MARK=mark;
	}
	function getCurrentFBLabelMARK(){
		return currentFB_Label_MARK;
	}
	//获取选中行数据，预留给iframe中调用
	function setSelectRowObjBakFun(bakFun){
		window.getSelectRowBakFun=bakFun;
	}
	function getSelectRowObj(){
		if(window.getSelectRowBakFun){
			return window.getSelectRowBakFun();
		}
		return [];
	}

