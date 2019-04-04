/**
	    	* 列表搜索功能
	    	*/
	    	function searchTable(){
				if(idKey && pIdKey){	//ztree
					initTree();
				}else{					//jqGrid
					var data=getSearchCondition();
					gridObj=$("#list_grid").jqGrid('setGridParam',{datatype:'json',postData:data,page:1}).trigger("reloadGrid"); //重新载入
				}
			}
			
			/**
			* 获取查询条件
			*/
			function getSearchCondition(){
	    		//参与搜索的字段
				var fieldKeys=[];
				if(fieldList && fieldList.length>0){
					$.each(fieldList,function(i,obj){
						if(obj.isSearch && obj.isSearch==1){
							fieldKeys.push(obj.columnName);
						}
					});
				}
				//搜索分类的条件
				var configObj=[];
				var sqlExpression="";
				var key_id=$("#dropdownTitle").attr("key_id");
				if(key_id && conditionList[key_id]){
					var condition = conditionList[key_id];
					if(condition.setting){
						configObj=JSON.parse(condition.setting).conObj;
						sqlExpression=JSON.parse(condition.setting).sqlExpression;
					}
				}
				//快速检索的条件
				var qqConObj=getQuickQueryConfig();
				//搜索栏关键字
				var keyword=$($("input[name=keyword]")[0]).val();
				return data={keyword:keyword,fieldKeys:JSON.stringify(fieldKeys),conObj:JSON.stringify(configObj),sqlExpression:sqlExpression,qqConObj:JSON.stringify(qqConObj)};
			}
	    	
			/**
		    * 切换一级搜索分类
		    */
		    $(".dropdown-content").on("click","li",function(){
		    	if($(this).attr("key_id")){
					//切换一级分类时清空搜索框及快速检索表单
					$("#clearQueryData").click();
					$($("input[name=keyword]")[0]).val("");
		            $("#dropdownTitle").text($(this).text()).attr("key_id",$(this).attr("key_id"));
		            searchTable();
		    	}
		    })
			
	    
	  		/**
		    * 显示搜索分类(快速选择下拉项、编辑界面)
		    */
			function showClassify(userSetting){
	  			var defaultSetting={classifyId:"",name:"",isShow:true,isDefault:false,type:""};
	  			$.extend(defaultSetting, userSetting);	//以传入参数覆盖默认设置信息
	  			
	  			var name=defaultSetting.name;
	  			var classifyId=defaultSetting.classifyId;
	  			var isShow=defaultSetting.isShow;
	  			var isDefault=defaultSetting.isDefault;
	  			
				  if(defaultSetting.type && defaultSetting.type=="line"){	//分线栏
					// alert(123)
	  				var size=name.length>8?14:(name.length*1.5);
	  				$("#addClassTable tbody").append('<tr key_id="'+classifyId+'" class="newPartingLine">'
						  		                +'<td colspan="3">'
						  		                +'<div>'
						  		                +'<input type="text" size="'+size+'" value="'+name+'" readonly/>'
						  		                + '</div>'
						  		                +'</td>'
												+'<td>'
												// +'<span><img class="middle" src="${ctx}/assetsv1/js/searchFilter/img/pencil-selete.png" alt="编辑" data-toggle="modal" data-target="#addLine" onclick="editLine(this)"/></span>'
												+'<span><img class="middle" src="../../../../../src/images/searchFilter/pencil-selete.png" alt="编辑" data-toggle="modal" data-target="#addLine" onclick="editLine(this)"/></span>'
												+'</td>'
						  		                +'</tr>');
	  				$(".dropdown-content").find("li:last").before('<li>'
												+'<div class="newPartingLine" style="height:40px;">'
	  											+'<div>'
		                						+'<label>'+name+'</label>'
												+'</div>'
		  		                				+'</div></li>');
	  				return;
	  			}
				// var editStr='<span><img class="middle" src="${ctx}/assetsv1/js/searchFilter/img/pencil-selete.png" alt="编辑" data-toggle="modal" data-target="#addConditionModal" onclick="editClassify(this, false)"/></span>';
				var editStr='<span><img class="middle" src="../../../../../src/images/searchFilter/pencil-selete.png" alt="编辑" data-toggle="modal" data-target="#addConditionModal" onclick="editClassify(this, false)"/></span>';
				if(classifyId && classifyId.indexOf("10000")!=-1){	//普通用户不能修改公共条件
					editStr="";
					name += "(公共)";
				}
				$("#addClassTable tbody").append(
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
							// '<span class="copyTr pl6"><img class="middle" src="${ctx}/assetsv1/js/searchFilter/img/copy.png" alt="复制" data-toggle="modal" data-target="#addConditionModal" onclick="editClassify(this, true)"/></span>'+
							'<span class="copyTr pl6"><img class="middle" src="../../../../../src/images/searchFilter/copy.png" alt="复制" data-toggle="modal" data-target="#addConditionModal" onclick="editClassify(this, true)"/></span>'+
						'</td>'+
					'</tr>'
				);
				if(defaultSetting.isShow){
					$(".dropdown-content").find("li:last").before('<li key_id="'+classifyId+'"><span>'+name+'</span></li>');
				}
				if(defaultSetting.isDefault){
					$("#dropdownTitle").text(name).attr("key_id",classifyId);
				}
			}
	  		
			/**
		    * 添加搜索字段
		    */
			function addFieldSearch(){
				var fieldStr='';
				if(fieldList && fieldList.length>0){
					$.each(fieldList,function(i,field){
						if(field.isSearch=="1" || field.isShowSearch=="1"){
							fieldStr+='<option key_type="'+field.fieldType+'" ';
							//存在字段引用/字段转换
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
				$("#addConditionTable").append(
					'<tr>'+
						'<td width="5%" class="td">'+($("#addConditionTable tr").length+1)+'</td>'+
						'<td width="25%">'+
							'<select class="custom-select" style="width:130px;" name="field" onchange="changeField(this);">' +
								fieldStr+
							'</select>'+
						'</td>'+
						'<td width="25%">'+
							'<select class="custom-select" style="width:130px;" name="condition" onchange="changeCondition(this);">' +
							'</select>'+
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
							'<span class="delRow pointer pl12" onclick="removeFieldSearch(this)">'+
								'<img class="middle" src="${ctx}/assetsv1/js/searchFilter/img/delete-selete.png" alt="删除"/>'+
							'</span>'+
						'</td>'+
					'</tr>'
				);
				var lastTr = $("#addConditionTable").find("tr").last();
				changeField(lastTr.find("select[name=field]").last());
				lastTr.find(".time-date input").each(function(i,obj){
					laydate.render({
						elem:obj //指定元素
					});
				});
			}
			
			/**
		    * 移除搜索字段
		    */
			function removeFieldSearch(me){
				$(me).parents("tr").remove();
				$("#addConditionTable tr").each(function(i,obj){
					$(obj).find("td").first().html(i+1);
				});
			}
			
			/**
		    * 切换搜索字段
		    */
			function changeField(me){
				me = $(me);
				var value = me.val();
				var type=$(me.parent().find('option[value="'+value+'"]')[0]).attr("key_type");
				if(type){
					type=type.toLocaleUpperCase();
				}
				var quote=$(me.parent().find('option[value="'+value+'"]')[0]).attr("quote");
				var convert=$(me.parent().find('option[value="'+value+'"]')[0]).attr("convert");
				var fieldTypeStr = '<option value="">请选择</option>';
				if(fieldTypeList && fieldTypeList.length>0){
					for(var i=0;i<fieldTypeList.length;i++){
						if(fieldTypeList[i].name==type){
							if(fieldTypeList[i].conList && fieldTypeList[i].conList.length>0){
								$.each(fieldTypeList[i].conList,function(i,obj){
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
				$(me.parent().parent().find("select[name=condition]")[0]).html(fieldTypeStr);
				$(me.parent().parent().find("select[name=condition]")[0]).change();
			}

			/**
		    * 切换搜索字段类型
		    */
			function changeCondition(me){
				me = $(me);
				me.parent().parent().find(".time-date").hide()
				me.parent().parent().find(".time-before").hide()
				me.parent().parent().find("input[name=value]").hide();
				me.parent().parent().find("div.ms-ctn").remove();

				var value= me.val();
				if(value=="TODAY" || value=="THIS_WEEK" || value=="THIS_MONTH" || value=="THIS_SEASON" ||value=="THIS_YEAR" || value=="NULL"  || value=="NOT_NULL" || value=="TOMORROW" || value =="YESTERDAY" || value =="NEXT_WEEK" || value =="UP_WEEK" || value =="NEXT_MONTH" || value =="UP_MONTH" || value =="NEXT_SEASON"  || value =="UP_SEASON" || value =="NEXT_YEAR" || value =="UP_YEAR"
				){
					me.parent().parent().find("input[name=value]").hide();
				} else if(value == "L_" || value=="N_") {
					me.parent().parent().find(".time-before").css("display","inline-block")
					me.parent().parent().find("input[name=value]").show();
				} else if(value == "IN"){
					me.parent().parent().find(".time-date").css("display","inline-block")
				} else if(value == "QUOTE"){	//引用
					me.parent().parent().find("input[name=value]").after('<input type="text" style="width: 130px;float:left" name="temp">');
					var quoteStr=me.parent().parent().find("[name='field']").find('option:selected').attr("quote");
					if(quoteStr){
						var defaultValue=[];	//修改时显示原来的值
						var oldValue=me.parent().parent().find("input[name=value]").val();
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
							me.parent().parent().find("input[name=temp]").magicSuggest({
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
									//me.parent().parent().find("input[name=value]").val(value);
									return value;
								}
							});
						}
					}
				} else if(value == "CONVERT"){	//转换
					me.parent().parent().find("input[name=value]").after('<input type="text" style="width: 130px;float:left" name="temp">');
					var convertStr=me.parent().parent().find("[name='field']").find('option:selected').attr("convert");
					if(convertStr){
						var defaultValue=[];	//修改时显示原来的值
						var oldValue=me.parent().parent().find("input[name=value]").val();
						var optionArr=[];
						var convertArr=JSON.parse(convertStr);
						
						for(var i=0;i<convertArr.length;i++){
							var temp = {"value":JSON.stringify(convertArr[i].filter),"name":convertArr[i].change_text};
							optionArr.push(temp);
							if(oldValue && oldValue.indexOf(JSON.stringify(convertArr[i].filter))!=-1){
								defaultValue.push(temp);
							}
						}
						me.parent().parent().find("input[name=temp]").magicSuggest({
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
					me.parent().parent().find("input[name=value]").show();
				}
			}
			
			/**
		    * 重置搜索分类编辑弹窗
		    */
			function resetConditionModal(){
				$("#addConditionTable").parent().find("input[name=classify_id]").val("");
				$("#addConditionTable").parent().find("input[name=classify_name]").val("");
				$("#addConditionTable").parent().find("textarea[name=sqlExpression]").val("");
				$("#addConditionTable").empty();
			}
			
			/**
		    * 将搜索分类编辑弹窗的字段解析位json字段
		    */
			function getDbConfig(trList){
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
			
	  		/**
		    * 修改搜索分类
		    */
			function editClassify(me, isCopy){
				resetConditionModal();
				//设置分类name、id属性
				var key_id=$(me).parents("tr").attr("key_id");
				var conObj = conditionList[key_id];
				if(conObj && conObj.setting){
					var setting = JSON.parse(conObj.setting);
					if(!isCopy){
						$("#addConditionTable").parent().find("input[name=classify_id]").val(key_id);
						$("#addConditionTable").parent().find("input[name=classify_name]").val(setting.name);
					}
					$("#addConditionTable").parent().find("textarea[name=sqlExpression]").val(setting.sqlExpression);
					
					var configObj=setting.conObj;
					//回显当前选中分类搜索条件
					$.each(configObj,function(i,field){
						addFieldSearch();
						var lastFieldTr=$("#addConditionTable tr").last();
						for(var key in field){
							lastFieldTr.find("[name^="+key+"]").val(field[key]);
						}
						lastFieldTr.find("select[name=field]").val(field.field_key).change();
						lastFieldTr.find("[name=condition]").val(field["con"]);
					});
				}
			}
			
			/**
		    * 保存搜索分类
		    */
			function saveClassify(me){
				var classify_name=$("#addConditionTable").parent().find("input[name=classify_name]").val();
				var classify_id=$("#addConditionTable").parent().find("input[name=classify_id]").val();
				if(!classify_name){
					$("#addConditionTable").parent().find("input[name=classify_name]").focus();
					tipsMsg("请输入分类名称","FAIL");
					return;
				}
				if(classify_id && classify_id.indexOf("10000")!=-1){
					tipsMsg("公共条件不能修改","FAIL");
					return;
				}
				var conObj=getDbConfig($("#addConditionTable tr"));
				var sqlExpression=$("#addConditionTable").parent().find("textarea[name=sqlExpression]").val();
				if(conObj && conObj.length>0){
					var setting={name:classify_name,sqlExpression:sqlExpression,conObj:conObj};
					$.post(ctx+"/cloud/sbehaviourConfig/use/saveConfig/TABLE_CONDITION",{setting:JSON.stringify(setting),tableId:tableId,id:classify_id},function(json){
						if(json.result=="Success" || json.result=="SUCCESS"){
							if(classify_id){	//修改分类
								$("#addClassTable tbody").find("tr[key_id="+classify_id+"]").find("td:first").text(classify_name);
								//$(".dropdown-content").find("span[key_id="+classify_id+"]").text(classify_name);
							}else{	//新增分类
								showClassify({classifyId:json.map.obj.sid,name:classify_name});
							}
							var obj=json.map.obj;
							conditionList[obj.sid]=obj;
							$("#addConditionModal").modal("hide");
							saveClassifySetting();
						}else{
							tipsMsg(json.resultMsg,"FAIL");
						}
					})
				}else{
					tipsMsg("请设置搜索条件","FAIL");

				}
			}

			/**
		    * 编辑分线栏
		    */
			function editLine(obj){
				var classify_id=$(obj).parents("tr").attr("key_id");
				var classify_name=$(obj).parents("tr").find("input[type=text]").val();
				$("#addLine").find("input[name=classify_id]").val(classify_id);
				$("#addLine").find("input[name=classify_name]").val(classify_name);
			}
			
			/**
		    * 保存分线栏
		    */
		    function addLine(){
				var classify_id=$("#addLine").find("input[name=classify_id]").val();
		    	var classify_name=$("#addLine").find("input[name=classify_name]").val();
		    	if(!classify_name){
					tipsMsg("请输入分线栏名称","FAIL");
					return;
				}
				var setting={name:classify_name,type:"line"};
				$.post(ctx+"/cloud/sbehaviourConfig/use/saveConfig/TABLE_CONDITION",{setting:JSON.stringify(setting),tableId:tableId,id:classify_id},function(json){
					$("#addLine").modal("hide");
					if(json.result=="Success" || json.result=="SUCCESS"){
						if(classify_id){	//修改
							var size=classify_name.length>8?14:(classify_name.length*1.5);
							$("#addClassTable tbody").find("tr[key_id="+classify_id+"]").find("input[type=text]").val(classify_name).attr("size",size);
						}else{	//新增
							showClassify({classifyId:json.map.obj.sid,name:classify_name,type:"line"});
						}
						var obj=json.map.obj;
						//conditionList[obj.sid]=obj;
						//showClassify({classifyId:obj.sid,name:classify_name,type:'line'});
						saveClassifySetting();
					}else{
						tipsMsg(json.resultMsg,"FAIL");
					}
				})
		    }
			
			/**
		    *保存搜索分类排序及是否默认设置
		    */
			function saveClassifySetting(closeModel){
				var classifyList = $("#addClassTable tbody").find("tr");
				var setting=[];
				$(".dropdown-content").find("li").not(":last,:first").remove();	//刷新搜索分类下拉选择列表
				if(classifyList && classifyList.length>0){
					classifyList.each(function(i,obj){
						if($(obj).attr("key_id")){
							var classify={};
							classify.classifyId=$(obj).attr("key_id");
							classify.type=$(obj).hasClass("newPartingLine")?"line":"";
							if(classify.type){
								classify.name=$.trim($(obj).find("input[type=text]").val());
								$(".dropdown-content").find("li:last").before('<li>'
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
									$(".dropdown-content").find("li:last").before('<li key_id="'+classify.classifyId+'"><span>'+classify.name+'</span></li>');
								}
							}
							setting.push(classify);
						}
					});
				}
				var tableConditionSettingId=$("#tableConditionSettingId").val();
				$.post(ctx+"/cloud/sbehaviourConfig/use/saveConfig/TABLE_CONDITION_SETTING",{setting:JSON.stringify(setting),tableId:tableId,id:tableConditionSettingId},function(json){
					if(json.result=="Success" || json.result=="SUCCESS"){
						$("#tableConditionSettingId").val(json.map.obj.sid);
						if(closeModel){
							$("#addClassModal").modal("hide");
						}
					}else{
						tipsMsg(json.resultMsg,"FAIL");
					}
				})
			}
			
		    /**
		    *删除搜索分类
		    */
		    function removeClassify(){
				var classifyId=$("#addClassTable").find(".rowSelected").attr("key_id");
				if(classifyId){
					if(classifyId.indexOf("10000")!=-1){	//公共分类不能删除
						tipsMsg("公共分类不能删除","FAIL");
						return;
					}
					confirmMsg("确定要删除该分类吗",function () {
						$.post(ctx+"/cloud/sbehaviourConfig/use/remove/config",{id:classifyId},function(json){
							if(json.result=="Success" || json.result=="SUCCESS"){
								$("#addClassTable").find(".rowSelected").remove();
								delete conditionList[classifyId];
								//删除的分类为当前选中的分类，切换为全部数据
								var currClassify=$("#dropdownTitle").attr("key_id");
								if(currClassify && currClassify==classifyId){
									$(".dropdown-content").find("li:first").click();
								}
								saveClassifySetting();
							}else{
								tipsMsg(json.resultMsg,"FAIL");
							}
						});
					});
				}
		    }
		    
		    
		    /****************************快速检索栏****************************/
		    /**
		    *初始化快速检索表单
		    */
		    function initQuickQuery(fieldList){
		    	$("#queryForm").empty();
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
							/*var datetype="date";
							var width="85";
							if(field.fieldType=="DATETIME"){
								datetype="datetime";
								width="145";
							}*/
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
							$("#queryForm").append('<div class="form-group field-warp" field="'+field.columnName+'" condition="'+condition+'">'+
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
		    	$("#queryForm").find("div[condition=QUOTE] input[name=temp]").each(function(){
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
						}
					}
		    	});
		    	//初始化日期输入框
		    	$("#queryForm").find(".time-date").each(function(i,obj){
					laydate.render({
						elem:obj //指定元素
					});
				});
		    }
		    
		    /**
		    * 获取快速检索条件
		    */
		    function getQuickQueryConfig(){
		    	var configObj=[];
		    	$.each($("#queryForm").find(".form-group"),function(){
					me=$(this);
		    		var field=me.attr("field");
		    		var condition=me.attr("condition");
		    		var con={field_key:field,con:condition};//value:value,end_val:end_val,start_val:start_val,unit:unit});
		    		if(!condition){	//日期类型
		    			condition = me.find(".queryTitle.selected:first").attr("condition");;
		    			if(!condition){	//自定义
							var startVal=me.find("input[name=start_val]").val();
							var endVal=me.find("input[name=end_val]").val();
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
		    			me.find(".queryTitle.selected").each(function() {
							convert.push(JSON.parse($(this).attr("convert")));
						});
						if(convert.length==0){
							return true;
						}
		    			con["value"]=JSON.stringify(convert);
		    		}else if(condition=="QUOTE"){
		    			var value=me.find("input[name='temp[]']").map(function() {
										return $(this).val();
									}).get().join("|#|");
						if(!value){
							return true;
						}
						con["value"]=value;
		    		}else{
						var value = me.find("input[name=value]").val();
						if(!value){
							return true;
						}
		    			con["value"]=value;
		    		}
		    		configObj.push(con);
		    	});
		    	return configObj;
		    }

			/**
			* 保存快速检索到分类
			*/
			function saveQuickQuery(){
				var classify_name=$("#saveQueryDataToClass").find("input[name=classify_name]").val();
				if(!classify_name){
					tipsMsg("请输入分类名称","FAIL");
					return;
				}
				var conObj=getQuickQueryConfig();
				if(conObj && conObj.length>0){
					var setting={name:classify_name,conObj:conObj};
					$.post(ctx+"/cloud/sbehaviourConfig/use/saveConfig/TABLE_CONDITION",{setting:JSON.stringify(setting),tableId:tableId},function(json){
						if(json.result=="Success" || json.result=="SUCCESS"){
							showClassify({classifyId:json.map.obj.sid,name:classify_name});
							var obj=json.map.obj;
							conditionList[obj.sid]=obj;
							saveClassifySetting();
						}else{
							tipsMsg(json.resultMsg,"FAIL");
						}
					})
				}else{
					tipsMsg("没有任何搜索条件","FAIL");
				}
				$("#saveQueryDataToClass").modal("hide");
			}