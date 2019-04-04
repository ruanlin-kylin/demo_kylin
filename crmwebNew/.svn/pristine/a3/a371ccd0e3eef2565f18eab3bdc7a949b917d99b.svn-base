

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
        this.contentType=config.comType;
        this.objectId=config.dataSource;
        this.configDiv=configDiv;
        this.orderMark=orderMark;
        this.idKey =  'from_table_field_mark_'+(this.objectId+'_'+this.orderMark);
		this.members={};
        var me = this;
        this.init=function(){
            if(this.contentType && this.objectId) {
                if("TABLE_TEAM"==this.contentType){
                    initTableTeam(this.config.dataSource,this.config.name,this.configDiv);
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
                    var config={
						id:this.config.dataSource,
						name:this.config.name,
						params:getParamsObj(this.config.paramsValue),
						markId:(this.orderMark+"-"+this.config.dataSource),
						filterCondition:this.config.filterCondition,
						w:this.config.w,
						h:this.config.h
					};
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
                    var data = getParamsObj(this.config.paramsValue);
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
		
		/*初始化表格组*/
		function initTableTeam(tableTeamId,name,configDiv){
			$.get(ctx+'/cloud/menu_v1/tableTeam/'+tableTeamId,function(json){
				if(json.result=="SUCCESS"){
					if(json.map && json.map.tableTeam){
						var tableTeam=json.map.tableTeam;
						if(tableTeam.type=="3"){		//页签模式
							configDiv.html(
								'<div class="col-lg-12 col-sm-12 col-xs-12">'+
									'<div class="tabbable">'+
										'<div class="list-title"></div>'+
										'<div class="tab-content" name="tab-content"></div>'+
									'</div>'+
								'</div>'
							);
							initTableTeamTab(this.objectId,me.configDiv,JSON.parse(tableTeam.members)); 
						}else if(tableTeam.leaderId){	//普通表格组
							configDiv.html('<div class="list_component"></div>');
							var config={
								id:tableTeam.leaderId,
								name:name,
								params:getParamsObj(me.config.paramsValue),
								markId:(me.orderMark+"-"+me.config.dataSource),
								filterCondition:me.config.filterCondition,
								w:me.config.w,
								h:me.config.h
							};
							config['tableTeam']=tableTeam;
							config['openWindow']=openWindow;
							config['cloudOpenWindow']=cloudOpenWindow;
							var list = new tableList($(configDiv.find('.list_component')[0]),config);
							list.init();
						}
					}
				}
			});
		}

		/*初始化数字组件*/
        function initDigital(config,configDiv){
			var tempConfig={
				id:config.dataSource,
				name:config.name,
				params:getParamsObj(config.paramsValue),
				markId:(this.orderMark+"-"+config.dataSource-"digital"),
				filterCondition:config.filterCondition,
				w:4,
				h:5.8
			};
			tempConfig['openWindow']=openWindow;
			tempConfig['cloudOpenWindow']=cloudOpenWindow;
			
        	configDiv.find("[name=digital]").bind("click",function(me){
				var layerWin=layer.open({
					 zIndex:1048,
					 type: 1,
					 title:'',
					 content: $("#digitalModal"),
					 area: [$(window).width()+'px', $(window).height()+'px']
				});
				layer.full(layerWin);
				var list = new tableList($("#digitalModal"),tempConfig);
				list.init();
				//window.parent.openUrl('${ctx}/cloud/menu/tablelist/'+config.dataSource+"?"+config.paramsValue,"1",configDiv.find("[name=title]").text(),config.dataSource);
            });
			var data=getParamsObj(config.paramsValue);
			data.tableId=config.dataSource;
			data.field=("count(*)"==config.countFiled)?"":config.countFiled;
			if(config && config.filterCondition){	//后台设置的过滤条件
				var filterConditionObj = JSON.parse(config.filterCondition);
				if(filterConditionObj && filterConditionObj.conObj && filterConditionObj.conObj.length>0){
					data.conObj =  JSON.stringify(filterConditionObj.conObj);
				}
			}
            //var  data={tableId:config.dataSource,field:("count(*)"==config.countFiled)?"":config.countFiled};
			$.post(ctx+'/cloud/table/list/reader/digital',data,function(data){
					configDiv.find("[name=digital]").text(data.total);
			});
        };

        /*初始化表单*/
        function initForm(){

        };
		
		/*初始化页签模式*/
		function initTableTeamTab(objectId,configDiv,members){
			if(members && members.length>0){
				for(var i=0;i<members.length;i++){
					//TODO 校验附表权限
					/* if(!gvFB(i)){
						continue;
					} */
					var memberObj = members[i];
					if(memberObj.obj_type){
						me.members[objectId+"_"+i]=memberObj;
						var labelKey =i;
						var context_id = i+"_context";
						//fb_config_obj[i]=memberObj;
						configDiv.find(".list-title").append(
							'<span index="'+i+'">'+memberObj.name+'</span>'
						);
						//$("#tab-content").append('<div id="'+context_id+'" class="tab-pane '+(i==current_mark_val?" active":"")+'" style="width:100%;">' +'</div>');
						/* if(i==0){
							cur_fb_config_mark=i;
						}
						if(memberObj.obj_type =="REPORT"){
							if(memberObj.obj_id && memberObj.setting){
								$("#"+context_id).html( '' +
										'<div class="input-wrap"style="width: 200px;height:32px;">' +
										'<input class="input" style="width: 200px;height: 32px;" type="text" name="fb_keyword" value="">' +
										'<span class="search-input" onclick="javascript:search();" style="height: 32px;"></span>' +
										'</div>' +
										'<div class="btn-wrap fb_button_content"></div>'+
										'<div style="position: relative;">' +
										'<span class="set-table-btn" style="position: absolute;"></span>'+
										'<table class="tableObj">'+'</table></div>'+
										'<div name="mainTable_gridPager" class="jqGridPager"></div>'
								);
							}else{
								$("#"+context_id).html("报表配置为空");
							}
						} */
					}
				}
				configDiv.find(".list-title").on("click","span",function(){
					$(this).siblings().removeClass("def");
					$(this).addClass("def");
					var index=$(this).attr("index");
					if(me.members && me.members[objectId+"_"+index]){
						var mObj=me.members[objectId+"_"+index];
						if(mObj.obj_type){
							var setting = mObj.setting;
							var urlParams=getUrlParams();
							var pmData={form:getParamsObj(me.config.paramsValue),sys:{}};
							var pdata=btf.button.setParamsValue(setting.params,pmData);
							$.extend(pdata, urlParams);
							var pmStr = (btf.getParamsStr(pdata));
							if(mObj.obj_type =="REPORT"){
								configDiv.find("div[name=tab-content]").html('<div class="list_component"></div>');
								var config={
									id:mObj.obj_id,
									name:'',
									params:pdata,
									markId:(me.orderMark+"-"+me.config.dataSource),
									filterCondition:me.config.filterCondition,
									w:me.config.w,
									h:me.config.h,
									hs:30	//页签模式表格高度减去30px
								};
								config['openWindow']=openWindow;
								config['cloudOpenWindow']=cloudOpenWindow;
								var list = new tableList($(configDiv.find("div[name=tab-content]").find('.list_component')[0]),config);
								list.init();
							}else if(mObj.obj_type =="FORM"){
								if(mObj.obj_id){
									putStorageValue("to_params_value",JSON.stringify(pdata));
									var url  =ctx+'/new/menu/form.jsp?formId='+mObj.obj_id;
									configDiv.find("div[name=tab-content]").html('<iframe width="100%" scrolling="no" frameborder="0"  src="'+url+'" height="100%"></iframe>');
								}
							}else if(mObj.obj_type =="PAGE_LAYOUT"){
								if(mObj.obj_id){
									var url  =ctx+'/cloud/menu/pageLayout/'+mObj.obj_id+"?"+pmStr;
									configDiv.find("div[name=tab-content]").html('<iframe width="100%" scrolling="no" frameborder="0"  src="'+url+'" height="100%"></iframe>');
								}
							}else if(mObj.obj_type =="LINK_ADDRESS"){
								var url =mObj.link_address;
								if(url.indexOf("?")!=-1){
									url+="&params="+pmStr;
								}else{
									url+="?params="+pmStr;
								}
								configDiv.find("div[name=tab-content]").html('<iframe width="100%" id="'+curFbMark+'_iframe"   frameborder="0"  src="'+url+'" height="100%"></iframe>');
							}else if(mObj.obj_type =="TABLE_TEAM"){
								initTableTeam(mObj.obj_id,"",configDiv.find("div[name=tab-content]"));
							}
						}
					}
				});
				configDiv.find(".list-title").find("span:first").click();
			}
		}
		
        /*初始化报表*/
        function initReport(me,tableId,idKey,configDiv,paramsValue){
            configDiv.find(".set-table-btn").bind("click",function(me){
                // openWindow('${ctx}/new/menu/setting.jsp?tableId='+tableId+'&type='+table_setting_type+"&hinedHeight=true&showHidePage=true");
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
            var url = "${ctx}/cloud/patient/customerDetail1?"+con;
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
