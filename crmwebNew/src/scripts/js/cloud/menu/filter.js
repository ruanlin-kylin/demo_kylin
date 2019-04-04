/**
* 添加搜索字段
*/
var allFieldSearch=false;	//是否所有的字段都可以作为过滤条件，留给引用覆盖
function addFieldSearch(){
	var fieldStr='';
	console.log("fieldList",fieldList);
	if(fieldList && fieldList.length>0){
		$.each(fieldList,function(i,field){
			if(allFieldSearch || field.isSearch=="1" || field.isShowSearch=="1"){
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
	$("[name=addConditionTable]").append(
		'<tr>'+
			'<td width="5%" class="td">'+($("[name=addConditionTable] tr").length+1)+'</td>'+
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
						'<option value="DAY">天</option>'+
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
					'<img class="middle" src="'+ctx+'/assetsv1/js/searchFilter/img/delete-selete.png" alt="删除"/>'+
				'</span>'+
			'</td>'+
		'</tr>'
	);
	var lastTr = $("[name=addConditionTable]").find("tr").last();
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
	var tableObj=$(me).parents("table");
	$(me).parents("tr").remove();
	tableObj.find("tr").each(function(i,obj){
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
	$("[name=addConditionTable]").parent().find("input[name=classify_id]").val("");
	$("[name=addConditionTable]").parent().find("input[name=classify_name]").val("");
	$("[name=addConditionTable]").parent().find("textarea[name=sqlExpression]").val("");
	$("[name=addConditionTable]").empty();
}

/**
* 回显查询条件
**/
function setConditionFields(configObj,sqlExpression){
	if(configObj && configObj.length>0){
		//回显当前选中分类搜索条件
		$.each(configObj,function(i,field){
			addFieldSearch();
			var lastFieldTr=$("[name=addConditionTable] tr").last();
			for(var key in field){
				lastFieldTr.find("[name^="+key+"]").val(field[key]);
			}
			lastFieldTr.find("select[name=field]").val(field.field_key).change();
			lastFieldTr.find("[name=condition]").val(field["con"]).change();
		});
	}
	if(sqlExpression){
		$("[name=addConditionTable]").parent().find("textarea[name=sqlExpression]").val(sqlExpression);
	}
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