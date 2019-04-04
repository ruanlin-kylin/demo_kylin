
/**
 * Created by lirun on 2018/11/20.
 */
$(document).ready(function(){
    //实现模态框拖拽
    $(".modal").draggable({
        handle: ".modal-header", // 只能点击头部拖动
        cursor: "pointer"
    });
    $("#addConditionModal").css("overflow", "hidden");//禁止模态对话框的半透明背景滚动
    
    //点击回退,返回上一层模态框
    $("#backToPre").click(function(){
        $("#addConditionModal").modal("hide");
        $("#addClassModal").modal("show");
    });

    //点击添加分栏线
    /*$("#addLine").click(function(){
        $("#addClassTable").append('<tr class="newPartingLine">'
					                +'<td colspan="4">'
					                +'<div>'
					                +'<input class="text" value="分割线" oldValue="分割线" readonly size="4" maxlength="8"/>'
					                + '</div>'
					                +'</td>'
					                +'</tr>');
    });*/

    //是否显示 控制开关
    $("#addClassTable").on('click','.div1',function() {
        $(this).toggleClass('close1');
        $(this).toggleClass('open1');
        $(this).find(".div2").toggleClass('close2');
        $(this).find(".div2").toggleClass('open2');
    });

    //table 排序和拖拽
    $("#addClassTable").sortable({
        //connectWith: ".connectedSortable",
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

  //点击搜索弹出快速查询模态框
    $("#searchBtn").click(function(){
        $("#queryForm")[0].reset();
    })

    //快速查询模态框 点击清空
    $("#clearQueryData").click(function(){
            $("#queryForm")[0].reset();
            $("#queryForm").find(".selected").removeClass("selected");
			if(quickQueryMagicSuggestList && quickQueryMagicSuggestList.length>0){
				for(var i=0;i<quickQueryMagicSuggestList.length;i++){
					quickQueryMagicSuggestList[i].clear();
				}
			}
    });

    //快速查询，选择标签事件
    $("#queryForm").on("click",".queryTitle",function(){
		console.log(111);
    	if(!$(this).parents(".form-group").attr("condition")){	//日期类型只能单选
    		$(this).siblings(".queryTitle").removeClass("selected");
    	}
		if($(this).hasClass("selected")){
			$(this).removeClass("selected")
		}else {
			$(this).addClass("selected")
		}
    	// $(this).toggleClass("selected");
    });
    
    $("#queryForm").on("click",".customTimeBtn",function(){
		console.log(222);
        $(this).siblings(".queryTitle").removeClass("selected");
        $(this).siblings().toggleClass("hide")

    })

    //选中分类的一行进行选中 只能选中一行
    $("#addClassTable").on("click","tr",function(){
        if($(this).hasClass("rowSelected")){
            $(this).removeClass("rowSelected")
        }else{
            $(this).addClass("rowSelected");
            $(this).siblings().removeClass("rowSelected")
        }
    });

	//只能选择一个默认分类
    $("#addClassTable").on("click","input[name=default]",function(){
		if($(this).prop("checked")){
			$("#addClassTable").find("input[name=default]").not(this).prop("checked",false);
		}
    });

});


/***************************************************************************************************************************************/

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
		var size=name.length>8?14:(name.length*1.5);
		$("#addClassTable tbody").append('<tr key_id="'+classifyId+'" class="newPartingLine">'
									+'<td colspan="3">'
									+'<div>'
									+'<input type="text" size="'+size+'" value="'+name+'" readonly/>'
									+ '</div>'
									+'</td>'
									+'<td>'
									+'<span><img class="middle" src="'+ctx+'/assetsv1/js/searchFilter/img/pencil-selete.png" alt="编辑" title="编辑" data-toggle="modal" data-target="#addLine" onclick="editLine(this)"/></span>'
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
	var editStr='<span><img class="middle" src="'+ctx+'/assetsv1/js/searchFilter/img/pencil-selete.png" alt="编辑" title="编辑"  data-toggle="modal" data-target="#addConditionModal" onclick="editClassify(this, false)"/></span>';
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
				'<span class="copyTr pl6"><img class="middle" src="'+ctx+'/assetsv1/js/searchFilter/img/copy.png" alt="复制"  title="复制" data-toggle="modal" data-target="#addConditionModal" onclick="editClassify(this, true)"/></span>'+
			'</td>'+
		'</tr>'
	);
	if(defaultSetting.isShow){
		$(".dropdown-content").find("li:last").before('<li key_id="'+classifyId+'" name="abc"><span>'+name+'</span></li>');
	}
	if(defaultSetting.isDefault){
		$("#dropdownTitle").text(name).attr("key_id",classifyId);
	}
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
			$("[name=addConditionTable]").parent().find("input[name=classify_id]").val(key_id);
			$("[name=addConditionTable]").parent().find("input[name=classify_name]").val(setting.name);
		}
		setConditionFields(setting.conObj,setting.sqlExpression);
	}
}


/**
* 保存搜索分类
*/
function saveClassify(me){
	var classify_name=$("[name=addConditionTable]").parent().find("input[name=classify_name]").val();
	var classify_id=$("[name=addConditionTable]").parent().find("input[name=classify_id]").val();
	if(!classify_name){
		$("[name=addConditionTable]").parent().find("input[name=classify_name]").focus();
		tipsMsg("请输入分类名称","FAIL");
		return;
	}
	if(classify_id && classify_id.indexOf("10000")!=-1){
		tipsMsg("公共条件不能修改","FAIL");
		return;
	}
	var conObj=getDbConfig($("[name=addConditionTable] tr"));
	var sqlExpression=$("[name=addConditionTable]").parent().find("textarea[name=sqlExpression]").val();
	if(conObj && conObj.length>0){
		var setting={name:classify_name,sqlExpression:sqlExpression,conObj:conObj};
		$.post(ctx+"/cloud/sbehaviourConfig/use/saveConfig/TABLE_CONDITION",{setting:JSON.stringify(setting),tableId:tabId,id:classify_id},function(json){
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
var quickQueryMagicSuggestList;		//记录当前快速检索中的magicSuggest，用于快速检索清空功能
/**
*初始化快速检索表单
*/
function initQuickQuery(fieldList){
	quickQueryMagicSuggestList=[];
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
				quickQueryMagicSuggestList.push(tempMagicSuggest);
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


