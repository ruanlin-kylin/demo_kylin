/**
 * 
 * @param {} text 
 */

function definedDecodeURIComponent(text) {
	try {
		return decodeURIComponent(text);
	} catch (e) {
		console.log(e);
		return text;
	}
}

var btf = {
	button: {
		/**
		 * 
		 * @param {按钮自己对象} thisObj 
		 * @param {按钮集合} buttonListObj 
		 * @param {数据对象} dbData 
		 * @param {按钮操作后的回调函数} bak 
		 */
		clickButton: function (thisObj, buttonListObj, dbData, bak) {
			var me = this;
			var id = $(thisObj).attr("key_id");
			if (buttonListObj[id]) {
				var button = buttonListObj[id];
				if (button.setting) {
					var setting = JSON.parse(button.setting);
					if (setting.trigger_type) {
						var display = setting.display;
						var trigger_type = setting.trigger_type;
						var trigger_id = setting.trigger_id;
						var params = setting.params;
						params = me.setParamsValue(params, dbData);
						if (!params) {
							params = {};
						}
						putStorageValue("to_params_value", JSON.stringify(params));
						putStorageValue("y_params_value", JSON.stringify(dbData));
						//FORM等于REPORT
						if ("FORM" == trigger_type) {
							me.openForm(trigger_id, params, bak, display);
						} else if ("TABLE_LIST" == trigger_type || "REPORT" == trigger_type) {
							me.openTableList(trigger_id, params, display, bak, display);
						} else if ("SQLSAVE" == trigger_type) {
							me.openSqlSave(trigger_id, params, bak, display);
						} else if ("TABLE_TEAM" == trigger_type) {
							me.openTableTeam(trigger_id, params, bak, display);
						} else if ("ABOUT_ITEM" == trigger_type) {
							me.openAboutItem(trigger_id, params, bak, display);
						} else if ("PAGE_LAYOUT" == trigger_type) {
							me.openPageLayout(trigger_id, params, bak, display);
						} else if ("LINK_ADDRESS" == trigger_type) {
							me.openAddress(setting.trigger_name, params, bak, display);
						}
					} else {
						tipsMsg("按钮触发对象类型为空", "FAIL");
					}
				} else {
					tipsMsg("按钮没有设置触发对象", "FAIL");
				}
			} else {
				tipsMsg("按钮不存在", "FAIL");
			}
		},
		setParamsValue: function (paramsList, dbData) {
			var pmDB = {};
			if (paramsList && paramsList.length > 0) {
				for (var i = 0; i < paramsList.length; i++) {
					var pm = paramsList[i];
					if (pm.p_value) {
						var p_name = pm.p_name;
						var p_value = pm.p_value;
						var value = p_value;
						pmDB[p_name] = p_value;
						if (p_value.indexOf(".") != -1 && p_value.split(".").length == 2) {
							var p_key = $.trim(p_value.split(".")[0]);
							var c_key = $.trim(p_value.split(".")[1]);
							if (dbData[p_key] && dbData[p_key][c_key]) {
								value = dbData[p_key][c_key];
							} else {
								value = "";
							}
							pmDB[p_name] = value;
						}
					}
				}
			}
			return pmDB;
		},
		openForm: function (trigger_id, params, bak, display) {
			if (display && display == "skipPage") {
				window.open('./form.html?formId=' + trigger_id, '_blank');
			} else {
				openWindow('./form.html?formId=' + trigger_id, bak);
			}
		},
		openTableList: function (trigger_id, params, bak, display) {
			var pmStr = (btf.getParamsStr(params));
			if (display && display == "skipPage") {
				window.open('./tableList.html?id=' + trigger_id + '&' + pmStr + '&name=tableList', '_blank');
			} else {
				//这里添加弹框
				openWindow('./tableList.html?id=' + trigger_id + '&mark_child=1&' + pmStr + '&name=tableList', bak);
				// openWindow(ctx+'/cloud/menu/tablelist/'+trigger_id+'?mark_child=1&'+pmStr,bak);
			}
		},
		openSqlSave: function (trigger_id, params, bak, display) {
			$.post(ctx + "/cloud/form/handler/saveSqlSave/" + trigger_id, params, function (json) {
				if (json.result == "SUCCESS") {
					tipsMsg("操作成功", "SUCCESS");
					if (bak) {
						bak();
					}
				} else {
					tipsMsg(json.resultMsg, "FAIL");
				}
			});
		},
		openTableTeam: function (trigger_id, params, bak, display) {
			var pmStr = (btf.getParamsStr(params));
			if (display && display == "skipPage") {
				// window.open(ctx+'/cloud/menu/tableTeam/detail/'+trigger_id+'?'+pmStr,'_blank');
				window.open('./tableTeamDetail.html?tableTeamId=' + trigger_id + '&' + pmStr, '_blank');
			} else {
				openWindow('./tableTeamDetail.html?tableTeamId=' + trigger_id + '&' + pmStr, bak);
				// openWindow(ctx+'/cloud/menu/tableTeam/detail/'+trigger_id+'?'+pmStr,bak);
			}
		},
		openAboutItem: function (trigger_id, params, bak, display) {
			var pmStr = (btf.getParamsStr(params));
			if (display && display == "skipPage") {
				window.open('./tableListAboutItem.html?tableId=' + trigger_id + '&' + pmStr, '_blank');
			} else {
				openWindow('./tableListAboutItem.html?tableId=' + trigger_id + '&' + pmStr, bak);
			}
		},
		openPageLayout: function (trigger_id, params, bak, display) {
			var pmStr = (btf.getParamsStr(params));
			if (display && display == "skipPage") {
				window.open('./pageLayout.html?pageLayoutId=' + trigger_id + pmStr, '_blank');
				// window.open(ctx+'/cloud/menu/pageLayout/'+trigger_id+'?'+pmStr,'_blank');
			} else {
				openWindow('./pageLayout.html?pageLayoutId=' + trigger_id + pmStr, bak);
				// openWindow(ctx+'/cloud/menu/pageLayout/'+trigger_id+'?'+pmStr,bak);
			}
		},
		openAddress: function (url, params, bak, display) {
			url = url.replace("{ctx}", ctx);
			var pmStr = (btf.getParamsStr(params));
			if (url.indexOf("?") == -1) {
				url += '?';
			}
			url += pmStr;
			if (display && display == "skipPage") {
				window.open(url, '_blank');
			} else {
				openWindow(url, bak);
			}
		}

	},
	form: {

	},
	getParamsStr: function (params) {
		var str = "";
		if (params) {
			for (var p in params) {
				if (p && params[p]) {
					str += "&" + p + "=" + params[p];
				}
			}
		}
		return str;
	},
	getParamsObj: function (pmStr) { //get请求方式拼接的参数转json
		var pm = {};
		if (pmStr && pmStr.length > 0) {
			for (var i = 0; i < pmStr.length; i++) {
				var pms = pmStr.split("&");
				if (pms && pms.length > 0) {
					for (var z = 0; z < pms.length; z++) {
						var pobj = pms[z];
						if (pobj && pobj.indexOf("=") != -1) {
							var pobjS = pobj.split("=");
							if (pobjS && pobjS.length == 2) {
								var key = $.trim(pobjS[0]);
								var value = $.trim(pobjS[1]);
								if (key && value) {
									pm[key] = value;
								}
							}
						}
					}
				}
			}
		}
		return pm;
	},
	parseTFSParams: function (targetStr, pmData) { //替换字符串中的${table.xxx} ${form.xxx} ${sys.xxx} 
		if (targetStr && !$.isEmptyObject(pmData)) {
			if (!$.isEmptyObject(pmData.table)) {
				var tableData = pmData.table;
				targetStr = targetStr.replace(/\\${table.(\w+)}/g, function () {
					return tableData[arguments[1]]
				});
			}
			if (!$.isEmptyObject(pmData.form)) {
				var formData = pmData.form;
				targetStr = targetStr.replace(/\\${form.(\w+)}/g, function () {
					return formData[arguments[1]]
				});
			}
			if (!$.isEmptyObject(pmData.sys)) {
				var sysData = pmData.sys;
				targetStr = targetStr.replace(/\\${sys.(\w+)}/g, function () {
					return sysData[arguments[1]]
				});
			}
		}
		return targetStr;
	}

};

function dataList() {
	var dataStr = {}
	var mesg = ctx + "/cloud/form/handler/saveSqlSave/1073814223194165248";
	var tableId = "purchase_table_team";
	$("#" + tableId).jqGrid({
		url: mesg, //url请求地址
		mtype: "post", //请求方式
		datatype: "json", //格式
		postData: dataStr, //传递的参数
		//prmNames:dataStr,
		styleUI: 'Bootstrap', //样式风格引用bootStrap
		colNames: ['列表主键Id', '序号', '过滤器名称', '创建时间', '更新时间', '操作', 'sid'], //表头
		colModel: [ //列  name和index要和接口字段对应
			{
				name: 'id',
				index: 'id'
			}
		],
		viewrecords: true, //定义是否要显示总记录
		forceFit: true,
		shrinkToFit: true,
		autowidth: true, //自动适应宽度
		//            pager: "#scriptListQdPage",   //分页显示
		loadComplete: function () { //完成之后

		}
	})
}
//-------------------------------分割线--------------------------------------------
function date_fun_dateDubbo(me) {
	// alert("dateDubbo:"+JSON.stringify(me));
	if (event.keyCode == 13) {
		$(me).blur();
		$(".layui-laydate").hide();
	}
}

function date_fun_dateBlur(me) {
	// alert("dateBlur:"+JSON.stringify(me));
	me = $(me);
	var value = $.trim(me.val());
	var reg = /^[0-9]+$/;
	if (value.length == 8 && reg.test(value)) {
		me.val(value.substring(0, 4) + "-" + value.substring(4, 6) + "-" + value.substring(6, 8))
	}
}

function date_fun_dateTimeBlur(me) {
	// alert("dateTimeBlur:"+JSON.stringify(me));
	var me = $(me);
	var value = $.trim(me.val());
	var vals = value.split(" ");
	var data = "";
	var time = "";
	if (vals.length == 2) {
		var dv = $.trim(vals[0]);
		var time = $.trim(vals[1]);
		var reg = /^[0-9]+$/;
		if (dv.length == 8 && reg.test(dv)) {
			data = value.substring(0, 4) + "-" + value.substring(4, 6) + "-" + value.substring(6, 8);
		}
	} else if (vals.length == 1) {
		var dv = $.trim(vals[0]);
		var reg = /^[0-9]+$/;
		if (dv.length == 8 && reg.test(dv)) {
			data = value.substring(0, 4) + "-" + value.substring(4, 6) + "-" + value.substring(6, 8);
		}
		time = "00:00:00";
	}
	if (data && time) {
		me.val(data + " " + time);
	}
}


//拖拽表单解析
var createHtml = {
	search: function (fieldName, alias, fieldKey, defaultVal, fieldWidth, disabled_str, isbt, validateObj) {
		var html = '<div class="form-group component col-xs-' + fieldWidth + '"  ' + disabled_str + '>' +
			'<label class="col-lg-2 control-label">' + alias + ("Y" == isbt ? '<font class="redRequired" color="red">*</font>' : '') + '</label>' +
			'<div class="col-lg-10"><div class="input-group">' +
			'<input  ' + disabled_str + ' type="text" ' + disabled_str + '  key="extend_element"  ' + this.getValidateHtml(validateObj, isbt, alias) + ' key_id="' + fieldKey + 'Text" placeholder="' + (alias ? alias : "") + '"  value="' + defaultVal + '"   class="form-control" name="' + fieldKey + 'Text"/>' +
			'<input type="hidden" key="extend_element"  key_id="' + fieldKey + '" value="' + defaultVal + '"  class="form-control" name="' + fieldKey + '"/>' +
			'<div class="input-group-btn">' +
			'<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">' +
			'<span class="caret"></span>' +
			' </button>' +
			' <ul class="dropdown-menu dropdown-menu-right" role="menu"></ul>' +
			' </div>' +
			'</div></div>' +
			'</div>';
		return html;
	},
	searchMore: function (fieldName, alias, fieldKey, defaultVal, fieldWidth, disabled_str, isbt) {
		var html = '<div class="form-group component col-xs-' + fieldWidth + '"  ' + disabled_str + '>' +
			'<label class="col-lg-2 control-label">' + alias + ("Y" == isbt ? '<font class="redRequired" color="red">*</font>' : '') + '</label>' +
			'<div class="col-lg-10">' +
			'<input type="text" class="form-control"  ' + disabled_str + ' key="extend_element"  isnull="' + isbt + '" ' + this.getValidateHtml(null, isbt, alias) + ' ' + disabled_str + ' key_name="' + fieldName + '" htmlType="SEARCH_MORE"  key_id="' + fieldKey + '" ' +
			"valueKey='" + defaultVal + "'" +
			'  name="' + fieldKey + '" placeholder="' + (alias ? alias : "") + '"/>' +
			'<small class="help-block isnull_text" data-bv-validator="notEmpty" data-bv-for="name" data-bv-result="INVALID" style="display: none;">' + alias + '不能为空</small>' +
			'</div>' +
			'</div>';
		return html;
	},
	searchSelect: function (fieldName, alias, fieldKey, defaultVal, fieldWidth, disabled_str, isbt) {
		var html = '<div class="form-group component col-xs-' + fieldWidth + '"  ' + disabled_str + '>' +
			'<label class="col-lg-2 control-label">' + alias + ("Y" == isbt ? '<font class="redRequired" color="red">*</font>' : '') + '</label>' +
			'<div class="col-lg-10">' +
			'<input type="text" class="form-control"  ' + disabled_str + '  key="extend_element"  isnull="' + isbt + '" ' + this.getValidateHtml(null, isbt, alias) + ' ' + disabled_str + ' key_name="' + fieldName + '" htmlType="SEARCH_SELECT"  key_id="' + fieldKey + '" ' +
			"valueKey='" + defaultVal + "'" +
			'  name="' + fieldKey + '" placeholder="' + (alias ? alias : "") + '"/>' +
			'<small class="help-block isnull_text" data-bv-validator="notEmpty" data-bv-for="name" data-bv-result="INVALID" style="display: none;">' + alias + '不能为空</small>' +
			'</div>' +
			'</div>';
		return html;
	},
	select: function (fieldName, alias, fieldKey, defaultVal, fieldWidth, disabled_str, options, validateObj, isbt) {
		var selectHtml = '<select  ' + disabled_str + '  isnull="' + isbt + '"   ' +
			this.getValidateHtml(validateObj, 'N', alias) + '  onkeydown="javascript:date_fun_dateDubbo(this);"   onchange="javascript:createHtml.validateSelect($(this));" key_name="' + fieldName + '"  class="form-control" key="extend_element"  key_id="' + fieldKey + '"  name="' + fieldKey + '">';
		if (options && options.length > 0) {
			for (var j = 0; j < options.length; j++) {
				var text = options[j].valueName;
				var value = options[j].format;
				var selected = "";
				if (defaultVal && ((defaultVal + "").indexOf(value) != -1)) {
					selected = "selected";
				}
				selectHtml += '<option ' + selected + ' value="' + value + '">' + text + '</option>';
			}
		}
		selectHtml += '</select>';
		var html = '<div class="form-group component col-xs-' + fieldWidth + ' has-feedback"  ' + disabled_str + '>' +
			'<label class="col-lg-2 control-label">' + alias + ("Y" == isbt ? '<font class="redRequired" color="red">*</font>' : '') + '</label>' +
			'<div class="col-lg-10">' +
			selectHtml +
			'<i class="form-control-feedback glyphicon glyphicon-remove" data-bv-icon-for="name" style="display: none"></i>' +
			'<i class="form-control-feedback glyphicon glyphicon-ok" data-bv-icon-for="name" style="display: none;"></i>' +
			'<small class="help-block isnull_text" data-bv-validator="notEmpty" data-bv-for="name" data-bv-result="INVALID" style="display: none;">' + alias + '不能为空</small>' +
			'</div>' +
			'</div>';
		return html;
	},
	checkbox: function (fieldName, alias, fieldKey, defaultVal, fieldWidth, disabled_str, options, isbt) {
		var boxHtml = '';
		if (options && options.length > 0) {
			for (var j = 0; j < options.length; j++) {
				var text = options[j].valueName;
				var value = options[j].format;
				var check = "";
				if (defaultVal && ((defaultVal + "").indexOf(value) != -1)) {
					check = "checked='checked'";
				}
				boxHtml += '<div class="checkbox inline"><label><input type="checkbox" key_name="' + fieldName + '"    onclick="javascript: createHtml.validateCheckAndRadio($(this).parents(&quot;.form-group&quot;));"   ' + disabled_str + '  key="extend_element" name="' + fieldKey + '" ' + check + ' value="' + value + '"><span class="text">' + text + '</span></label></div>';
			}
		}
		var html = '<div class="form-group component col-xs-' + fieldWidth + '  has-feedback"  ' + disabled_str + ' key="extend_element" key_type="checkbox"  isnull="' + isbt + '" key_name="' + fieldKey + '">' +
			'<label class="col-lg-2 control-label">' + alias + ("Y" == isbt ? '<font class="redRequired" color="red">*</font>' : '') + '</label>' +
			'<div class="col-lg-10"><div class="col-lg-12 component-border" >' +
			boxHtml +
			'</div>' +
			'<i class="form-control-feedback glyphicon glyphicon-remove" data-bv-icon-for="name" style="display: none"></i>' +
			'<i class="form-control-feedback glyphicon glyphicon-ok" data-bv-icon-for="name" style="display: none;"></i>' +
			'<small class="help-block isnull_text" data-bv-validator="notEmpty" data-bv-for="name" data-bv-result="INVALID" style="display: none;">' + alias + '不能为空</small>' +
			'</div>' +
			'</div>';
		return html;
	},
	checkboxBlock: function (fieldName, alias, fieldKey, defaultVal, fieldWidth, disabled_str, options, isbt) {
		var boxHtml = '';
		if (options && options.length > 0) {
			for (var j = 0; j < options.length; j++) {
				var text = options[j].valueName;
				var value = options[j].format;
				var check = "";
				if (defaultVal && ((defaultVal + "").indexOf(value) != -1)) {
					check = "checked='checked'";
				}
				boxHtml += '<div class="checkbox"><label><input type="checkbox" key_name="' + fieldName + '"   onclick="javascript: createHtml.validateCheckAndRadio($(this).parents(&quot;.form-group&quot;));"   ' + disabled_str + '  key="extend_element" name="' + fieldKey + '" ' + check + ' value="' + value + '"><span class="text">' + text + '</span></label></div>';
			}
		}
		var html = '<div class="form-group component col-xs-' + fieldWidth + '  has-feedback"  ' + disabled_str + ' key="extend_element" key_type="checkbox"  isnull="' + isbt + '" key_name="' + fieldKey + '">' +
			'<label class="col-lg-2 control-label">' + alias + ("Y" == isbt ? '<font class="redRequired" color="red">*</font>' : '') + '</label>' +
			'<div class="col-lg-10"><div class="col-lg-12 component-border" >' +
			boxHtml +
			'</div>' +
			'<i class="form-control-feedback glyphicon glyphicon-remove" data-bv-icon-for="name" style="display: none"></i>' +
			'<i class="form-control-feedback glyphicon glyphicon-ok" data-bv-icon-for="name" style="display: none;"></i>' +
			'<small class="help-block isnull_text" data-bv-validator="notEmpty" data-bv-for="name" data-bv-result="INVALID" style="display: none;">' + alias + '不能为空</small>' +
			'</div>' +
			'</div>';
		return html;
	},
	redio: function (fieldName, alias, fieldKey, defaultVal, fieldWidth, disabled_str, options, validateObj, isbt) {
		var boxHtml = '';
		if (options && options.length > 0) {
			for (var j = 0; j < options.length; j++) {
				var text = options[j].valueName;
				var value = options[j].format;
				var check = "";
				if (defaultVal && ((defaultVal + "").indexOf(value) != -1)) {
					check = "checked='checked'";
				}
				boxHtml += '<div class="radio inline"><label><input type="radio"   ' +
					this.getValidateHtml(validateObj, 'N', alias) + '  key_name="' + fieldName + '"  onclick="javascript: createHtml.validateCheckAndRadio($(this).parents(&quot;.form-group&quot;));"  ' + disabled_str + '  key="extend_element" name="' + fieldKey + '" ' + check + ' value="' + value + '"><span class="text">' + text + '</span></label></div>';
			}
		}
		var html = '<div class="form-group component col-xs-' + fieldWidth + '  has-feedback"  ' + disabled_str + '  key="extend_element" key_type="checkbox"  isnull="' + isbt + '" key_name="' + fieldKey + '">' +
			'<label class="col-lg-2 control-label">' + alias + ("Y" == isbt ? '<font class="redRequired" color="red">*</font>' : '') + '</label>' +
			'<div class="col-lg-10"><div class="col-lg-12 component-border" >' +
			boxHtml +
			'</div>' +
			'<i class="form-control-feedback glyphicon glyphicon-remove" data-bv-icon-for="name" style="display: none"></i>' +
			'<i class="form-control-feedback glyphicon glyphicon-ok" data-bv-icon-for="name" style="display: none;"></i>' +
			'<small class="help-block isnull_text" data-bv-validator="notEmpty" data-bv-for="name" data-bv-result="INVALID" style="display: none;">' + alias + '不能为空</small>' +

			'</div>' +
			'</div>';
		return html;
	},
	redioBlock: function (fieldName, alias, fieldKey, defaultVal, fieldWidth, disabled_str, options, validateObj, isbt) {
		var boxHtml = '';
		if (options && options.length > 0) {
			for (var j = 0; j < options.length; j++) {
				var text = options[j].valueName;
				var value = options[j].format;
				var check = "";
				if (defaultVal && ((defaultVal + "").indexOf(value) != -1)) {
					check = "checked='checked'";
				}
				boxHtml += '<div class="radio"><label><input type="radio"   ' +
					this.getValidateHtml(validateObj, 'N', alias) + '   key_name="' + fieldName + '"  onclick="javascript: createHtml.validateCheckAndRadio($(this).parents(&quot;.form-group&quot;));"  ' + disabled_str + '  key="extend_element" name="' + fieldKey + '" ' + check + ' value="' + value + '"><span class="text">' + text + '</span></label></div>';
			}
		}
		var html = '<div class="form-group component col-xs-' + fieldWidth + '  has-feedback"  ' + disabled_str + '  key="extend_element" key_type="checkbox"  isnull="' + isbt + '" key_name="' + fieldKey + '">' +
			'<label class="col-lg-2 control-label">' + alias + ("Y" == isbt ? '<font class="redRequired" color="red">*</font>' : '') + '</label>' +
			'<div class="col-lg-10"><div class="col-lg-12 component-border" >' +
			boxHtml +
			'</div>' +
			'<i class="form-control-feedback glyphicon glyphicon-remove" data-bv-icon-for="name" style="display: none"></i>' +
			'<i class="form-control-feedback glyphicon glyphicon-ok" data-bv-icon-for="name" style="display: none;"></i>' +
			'<small class="help-block isnull_text" data-bv-validator="notEmpty" data-bv-for="name" data-bv-result="INVALID" style="display: none;">' + alias + '不能为空</small>' +

			'</div>' +
			'</div>';
		return html;
	},
	textArea: function (fieldName, alias, fieldKey, defaultVal, fieldWidth, disabled_str, validateObj, isbt) {
		/* var length_text = "";
		if(validateObj){
			if(validateObj.maxlength || validateObj.minlength){
				if(validateObj.maxlength && validateObj.minlength){
					length_text= '<small class="help-block length_text" data-bv-validator="notEmpty" data-bv-for="name" data-bv-result="INVALID" style="display: none;">'+alias+'内容字数必须在'+validateObj.minlength+"~"+validateObj.maxlength+'字符之间</small>';
				}else{
					if(validateObj.maxlength){
						length_text= '<small class="help-block length_text" data-bv-validator="notEmpty" data-bv-for="name" data-bv-result="INVALID" style="display: none;">'+alias+'内容字数不能大于'+validateObj.maxlength+'个字符</small>';
					}else{
						length_text= '<small class="help-block length_text" data-bv-validator="notEmpty" data-bv-for="name" data-bv-result="INVALID" style="display: none;">'+alias+'内容字数不能小于'+validateObj.minlength+'个字符</small>';
					}
				}
			}
		} */
		var html = '<div class="form-group component col-xs-' + fieldWidth + '"  ' + disabled_str + '>' +
			'<label class="col-lg-2 control-label">' + alias + ("Y" == isbt ? '<font class="redRequired" color="red">*</font>' : '') + '</label>' +
			'<div class="col-lg-10">' +
			'<textarea class="form-control"   onkeydown="javascript:date_fun_dateDubbo(this);"  ' + disabled_str + '   isnull="' + isbt + '"   ' +
			this.getValidateHtml(validateObj, isbt, alias) +
			' key="extend_element" value="' + defaultVal + '" key_name="' + fieldName + '"  key_id="' + fieldKey + '" type="text" name="' + fieldKey + '" placeholder="' + (alias ? alias : "") + '">' + definedDecodeURIComponent(defaultVal) + '</textarea>' +
			'</div>' +
			'</div>';
		return html;
	},
	date_input: function (fieldName, alias, fieldKey, defaultVal, fieldWidth, disabled_str, validateObj, isbt, dbPM) {
		defaultVal = getValueConversionDate(defaultVal, "yyyy-MM-dd");
		var minDate = "";
		var maxDate = "";
		if (validateObj) {
			if (validateObj.minDate) {
				minDate = getParamsValue(validateObj.minDate, dbPM);
			}
			if (validateObj.maxDate) {
				maxDate = getParamsValue(validateObj.maxDate, dbPM);
			}
		}
		var html = '<div class="form-group component col-xs-' + fieldWidth + '"  ' + disabled_str + '>' +
			'<label class="col-lg-2 control-label">' + alias + ("Y" == isbt ? '<font class="redRequired" color="red">*</font>' : '') + '</label>' +
			'<div class="col-lg-10">' +
			'<input class="form-control date-picker" autocomplete="off"   minDate="' + minDate + '" maxDate="' + maxDate + '"    ' + disabled_str + ' onkeydown="javascript:date_fun_dateDubbo(this);"  onblur="javascript:date_fun_dateBlur(this);"   ' + this.getValidateHtml(validateObj, isbt, alias) + ' key_name="' + fieldName + '"   key="extend_element" value="' + defaultVal + '" key_id="' + fieldKey + '" type="text" name="' + fieldKey + '" placeholder="' + (alias ? alias : "") + '"' +
			'db_type="date" format="yyyy-MM-dd">' +
			'</div>' +
			'</div>';
		return html;
	},
	datetime_input: function (fieldName, alias, fieldKey, defaultVal, fieldWidth, disabled_str, validateObj, isbt, dbPM) {
		defaultVal = getValueConversionDate(defaultVal, "yyyy-MM-dd HH:mm:ss");
		var minDate = "";
		var maxDate = "";
		if (validateObj) {
			if (validateObj.minDate) {
				minDate = getParamsValue(validateObj.minDate, dbPM);
			}
			if (validateObj.maxDate) {
				maxDate = getParamsValue(validateObj.maxDate, dbPM);
			}
		}
		var html = '<div class="form-group component col-xs-' + fieldWidth + '"  ' + disabled_str + '>' +
			'<label class="col-lg-2 control-label">' + alias + ("Y" == isbt ? '<font class="redRequired" color="red">*</font>' : '') + '</label>' +
			'<div class="col-lg-10">' +
			'<input class="form-control date-picker" autocomplete="off"  minDate="' + minDate + '" maxDate="' + maxDate + '"  ' + disabled_str + ' ' + this.getValidateHtml(validateObj, isbt, alias) + '  onkeydown="javascript:date_fun_dateDubbo(this);"  onblur="javascript:date_fun_dateTimeBlur(this);"   key="extend_element"  key_name="' + fieldName + '"  value="' + defaultVal + '" key_id="' + fieldKey + '" type="text" name="' + fieldKey + '" placeholder="' + (alias ? alias : "") + '"' +
			'db_type="date" format="yyyy-MM-dd HH:mm:ss"' +
			'</div>' +
			'</div>';
		return html;
	},
	time_input: function (fieldName, alias, fieldKey, defaultVal, fieldWidth, disabled_str, validateObj, isbt, dbPM) {
		defaultVal = getValueConversionDate(defaultVal, "HH:mm:ss");
		var minDate = "";
		var maxDate = "";
		if (validateObj) {
			if (validateObj.minDate) {
				minDate = getParamsValue(validateObj.minDate, dbPM);
			}
			if (validateObj.maxDate) {
				maxDate = getParamsValue(validateObj.maxDate, dbPM);
			}
		}
		var html = '<div class="form-group component col-xs-' + fieldWidth + '"  ' + disabled_str + '>' +
			'<label class="col-lg-2 control-label">' + alias + ("Y" == isbt ? '<font class="redRequired" color="red">*</font>' : '') + '</label>' +
			'<div class="col-lg-10">' +
			'<input class="form-control date-picker"  autocomplete="off" minDate="' + minDate + '" maxDate="' + maxDate + '"   ' + disabled_str + '  key="extend_element" key_name="' + fieldName + '" onkeydown="javascript:date_fun_dateDubbo(this);"  value="' + defaultVal + '" key_id="' + fieldKey + '" ' + this.getValidateHtml(validateObj, isbt, alias) + ' type="text" name="' + fieldKey + '" placeholder="' + (alias ? alias : "") + '"' +
			'db_type="date" format="HH:mm:ss">' +
			'<i class="fa fa-clendar" style="left: 122px"></i>' +
			'</div>' +
			'</div>';
		return html;
	},
	date: function (fieldName, alias, fieldKey, defaultVal, fieldWidth, disabled_str, validateObj, isbt, dbPM, date_format) {
		defaultVal = getValueConversionDate(defaultVal, "HH:mm:ss");
		var minDate = "";
		var maxDate = "";
		if (validateObj) {
			if (validateObj.minDate) {
				minDate = getParamsValue(validateObj.minDate, dbPM);
			}
			if (validateObj.maxDate) {
				maxDate = getParamsValue(validateObj.maxDate, dbPM);
			}
		}
		var html = '<div class="form-group component col-xs-' + fieldWidth + '"  ' + disabled_str + '>' +
			'<label class="col-lg-2 control-label">' + alias + ("Y" == isbt ? '<font class="redRequired" color="red">*</font>' : '') + '</label>' +
			'<div class="col-lg-10">' +
			'<input class="form-control date-picker" autocomplete="off"  minDate="' + minDate + '" maxDate="' + maxDate + '"   ' + disabled_str + '  key="extend_element" key_name="' + fieldName + '" onkeydown="javascript:date_fun_dateDubbo(this);"  value="' + defaultVal + '" key_id="' + fieldKey + '" ' + this.getValidateHtml(validateObj, isbt, alias) + ' type="text" name="' + fieldKey + '" placeholder="' + (alias ? alias : "") + '"' +
			'db_type="date" format="' + date_format + '">' +
			'<i class="fa fa-calendar" style="position:absolute;right:25px;top:10px;"></i>' +
			'</div>' +
			'</div>';
		return html;
	},
	upfile: function (fieldName, alias, fieldKey, defaultVal, fieldWidth, disabled_str) {
		defaultVal = defaultVal ? defaultVal.value : '';
		var html = '<div class="form-group component col-xs-' + fieldWidth + '"  ' + disabled_str + '>' +
			'<label class="col-lg-2 control-label">' + alias + '</label>' +
			'<div class="col-lg-10">' +
			'<input class="form-control" upType="file" style="display:none;"  ' + disabled_str + ' key="extend_element"' +
			"value='" + defaultVal + "' url_value='" + defaultVal + "'" +
			'key_id="' + fieldName + '" class="file" type="file" multiple  data-show-upload="false" data-show-caption="true" key_name="' + fieldKey + '" name="file_data" placeholder="' + (alias ? alias : "") + '"><div key="upload"></div>' +
			'</div>' +
			'</div>';
		return html;
	},
	uppicture: function (fieldName, alias, fieldKey, defaultVal, fieldWidth, disabled_str) {
		/* var html ='<div class="form-group component col-xs-'+fieldWidth+'">'+
				'<div style="width:100%">'+
				'<label style="line-height: 24px;">'+alias+'</label>'+
				'<input class="form-control" upType="pic" style="display:none;"  '+disabled_str+' key="extend_element" value="'+defaultVal+'" url_value="'+defaultVal+'" key_id="'+fieldName+'" class="file" type="file" multiple  data-show-upload="false" data-show-caption="true" key_name="'+fieldKey+'" name="file_data" placeholder="'+(alias?alias:"")+'"><div key="upload"></div>'+
				'</div></div>'; */

		var html = '<div class="form-group component col-xs-' + fieldWidth + '"  ' + disabled_str + '>' +
			'<label class="col-lg-2 control-label">' + alias + '</label>' +
			'<div class="col-lg-10">' +
			'<input class="form-control" upType="pic" style="display:none;"  ' + disabled_str + ' key="extend_element" value="' + defaultVal + '" url_value="' + defaultVal + '" key_id="' + fieldName + '" class="file" type="file" multiple  data-show-upload="false" data-show-caption="true" key_name="' + fieldKey + '" name="file_data" placeholder="' + (alias ? alias : "") + '"><div key="upload"></div>' +
			'</div>' +
			'</div>';
		return html;
	},
	input: function (fieldName, alias, fieldKey, defaultVal, fieldWidth, disabled_str, validateObj, isbt) {
		var html = '<div class="form-group component col-xs-' + fieldWidth + '"  ' + disabled_str + '>' +
			'<label class="col-lg-2 control-label">' + alias + ("Y" == isbt ? '<font class="redRequired" color="red">*</font>' : '') + '</label>' +
			'<div class="col-lg-10">' +
			'<input class="form-control"  ' + disabled_str + ' autocomplete="off" onkeydown="javascript:date_fun_dateDubbo(this);"    key="extend_element" key_name="' + fieldName + '" value="' + defaultVal + '" key_id="' + fieldName + '" ' + this.getValidateHtml(validateObj, isbt, alias) + ' name="' + fieldKey + '" placeholder="' + (alias ? alias : "") + '">' +
			'</div>' +
			'</div>';
		return html;
	},
	digital: function (fieldName, alias, fieldKey, defaultVal, fieldWidth, disabled_str, validateObj, isbt) {
		var html = '<div class="form-group component col-xs-' + fieldWidth + '"  ' + disabled_str + '>' +
			'<label class="col-lg-2 control-label">' + alias + ("Y" == isbt ? '<font class="redRequired" color="red">*</font>' : '') + '</label>' +
			'<div class="col-lg-10">' +
			'<input class="form-control"  ' + disabled_str + ' autocomplete="off" onkeydown="javascript:date_fun_dateDubbo(this);"    key="extend_element" key_name="' + fieldName + '" value="' + defaultVal + '" key_id="' + fieldName + '" ' + this.getValidateHtml(validateObj, isbt, alias) + ' name="' + fieldKey + '" placeholder="' + (alias ? alias : "") + '">' +
			'</div>' +
			'</div>';
		return html;
	},
	lineBar: function (fieldName, alias, disabled_str) {
			var faClass = "fa-caret-down";
			if (disabled_str.indexOf("display:none") != -1) {
				faClass = "fa-caret-right";
			}
			var html = '<div class="form-group component col-xs-12" style="min-height:30px;">' +
				'<div class="item-title">' +
				'<span class="item-title-info">' +
				'<i class="fa ' + faClass + '"></i>' +
				'<span style="padding-left:3px;" onselectstart="return false">' + alias + '</span>' +
				'</span>' +
				'</div>' +
				'</div>' +
				'<div class="item-content-info" ' + disabled_str + '></div>';
			return html;
		}
		/* ,div:function(defaultVal,fieldWidth,fieldHeight){
					var html ='<div class="form-group row current_row col-xs-'+fieldWidth+'" style="height:'+fieldHeight+'">'+
								defaultVal +
							'</div>';
					return html;
				} */
		,
	getValidateHtml: function (validateObj, isbt, fieldName) {
		var html = '';
		if ("Y" == isbt) {
			html += ' data-bv-notempty="true"';
			html += ' data-bv-notempty-message="' + fieldName + '不能为空"';
		}
		if (validateObj) {
			if (validateObj && validateObj.validate) {
				if (validateObj.validate == "id_card") {
					html += ' pattern="^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$|^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}([0-9]|X)$"  data-bv-regexp-message="' + fieldName + '格式不正确"';
				} else if (validateObj.validate == "mobile") {
					html += ' pattern="^(1\\d{10})$"  data-bv-regexp-message="' + fieldName + '格式不正确"';
				} else if (validateObj.validate == "age") {
					html += ' min="0"  data-bv-greaterthan-inclusive="false"  data-bv-greaterthan-message="' + fieldName + '不能小于0"';
					html += ' max="120"  data-bv-lessthan-inclusive="false"   data-bv-lessthan-message="' + fieldName + '不能大于120"';
				} else if (validateObj.validate == "email") {
					html += ' type="email" data-bv-emailaddress-message="' + fieldName + '不是邮箱格式"';
				} else if (validateObj.validate == "integer") {
					html += ' pattern="^-?[0-9]+$"  data-bv-regexp-message="' + fieldName + '只能输入数字"';
				} else if (validateObj.validate == "number") { //^((-?[0-9]+|0)\\.([0-9]+)$)|^(-?[0-9]+|0)$
					html += ' pattern="^(-?[0-9]+)(\\.[0-9]+)?$"  data-bv-regexp-message="' + fieldName + '只能输入数字和小数"';
				} else if (validateObj.validate == "digital") { //数字
					if (validateObj.decimalLength && validateObj.decimalLength != "0") {
						html += ' pattern="^(-?[0-9]+)(\\.[0-9]{1,' + validateObj.decimalLength + '})?$"  data-bv-regexp-message="' + fieldName + '只能输入数字(' + validateObj.decimalLength + '位小数)"';
					} else {
						html += ' pattern="^-?[0-9]+$"  data-bv-regexp-message="' + fieldName + '只能输入数字"';
					}
					if (validateObj.maxValue) {
						html += ' max="' + validateObj.maxValue + '" data-bv-lessthan-message="' + fieldName + '不能超过' + validateObj.maxValue + '"';
					}
					if (validateObj.minValue) {
						html += ' min="' + validateObj.minValue + '" data-bv-greaterthan-message="' + fieldName + '不能小于' + validateObj.minValue + '"';
					}
				}
			}
			if (validateObj.minlength || validateObj.maxlength) {
				html += ' data-bv-stringlength="true"';
				if (validateObj.minlength && validateObj.maxlength) {
					html += ' data-bv-stringlength-min="' + validateObj.minlength + '" data-bv-stringlength-max="' + validateObj.maxlength + '"  data-bv-stringlength-message="' + fieldName + '长度在' + validateObj.minlength + '~' + validateObj.maxlength + '个字符之间"';
				} else {
					if (validateObj.minlength) {
						html += ' data-bv-stringlength-min="' + validateObj.minlength + '" data-bv-stringlength-message="' + fieldName + '长度不能小于' + validateObj.minlength + '字符"';
					}
					if (validateObj.maxlength) {
						html += ' data-bv-stringlength-max="' + validateObj.maxlength + '" data-bv-stringlength-message="' + fieldName + '长度不能大于' + validateObj.maxlength + '字符"';
					}
				}
			}
			//事件
			if (validateObj.eventObj) {
				html += ' event_obj="' + validateObj.eventObj + '"';
			}
			//对象
			if (validateObj.objType) {
				html += ' obj_type="' + validateObj.objType + '"';
			}
		}
		return html;
	},
	definedValidate: function (formDiv) {
		var divObj = $("#" + formDiv);
		var isyes = true;
		divObj.find("select[key=extend_element]").each(function (i, obj) {
			obj = $(obj);
			if (!createHtml.validateSelect(obj)) {
				isyes = false;
			}
		});
		divObj.find("div[key=extend_element]").each(function (i, obj) {
			obj = $(obj);
			if (!createHtml.validateCheckAndRadio(obj)) {
				isyes = false;
			}
		});
		divObj.find("textarea[key=extend_element]").each(function (i, obj) {
			obj = $(obj);
			if (!createHtml.validateTextarea(obj)) {
				isyes = false;
			}
		});
		divObj.find("input[htmlType=SEARCH_SELECT]").each(function (i, obj) {
			obj = $(obj);
			if (!createHtml.validateSelect(obj)) {
				isyes = false;
			}
		});
		return isyes;
	},
	validateSelect: function (obj) {
		var thisYes = true;
		var parentObj = obj.parents(".form-group");
		var value = obj.val();
		if ("Y" == obj.attr("isnull")) {
			if (!value) {
				thisYes = false;
				parentObj.removeClass("has-error");
				parentObj.removeClass("has-success");
				parentObj.addClass("has-error");
				parentObj.find(".glyphicon-remove").show();
				parentObj.find(".isnull_text").show();
				parentObj.find(".glyphicon-ok").hide();
			} else {
				parentObj.removeClass("has-error");
				parentObj.removeClass("has-success");
				parentObj.addClass("has-success");
				parentObj.find(".glyphicon-remove").hide();
				parentObj.find(".isnull_text").hide();
				parentObj.find(".glyphicon-ok").show();
			}
		}
		return thisYes;
	},
	validateInput: function (obj) {
		var thisYes = true;
		var parentObj = obj.parents(".form-group");
		var value = obj.val();
		if ("Y" == obj.attr("isnull")) {
			if (!value) {
				thisYes = false;
				parentObj.removeClass("has-error");
				parentObj.removeClass("has-success");
				parentObj.addClass("has-error");
				parentObj.find(".glyphicon-remove").show();
				parentObj.find(".isnull_text").show();
				parentObj.find(".glyphicon-ok").hide();
			} else {
				parentObj.removeClass("has-error");
				parentObj.removeClass("has-success");
				parentObj.addClass("has-success");
				parentObj.find(".glyphicon-remove").hide();
				parentObj.find(".isnull_text").hide();
				parentObj.find(".glyphicon-ok").show();
			}
		}
		return thisYes;
	},
	validateCheckAndRadio: function (obj) {
		var thisYes = true;
		var keyType = obj.attr("key_type")
		if ("checkbox" == keyType || "radio" == keyType) {
			var isnull = obj.attr("isnull");
			if ("Y" == isnull) {
				var parentObj = obj;
				var yesSelect = false;
				obj.find("input").each(function (i, obj) {
					if (obj.checked) {
						yesSelect = true;
					}
				});
				if (yesSelect) {
					parentObj.removeClass("has-error");
					parentObj.removeClass("has-success");
					parentObj.addClass("has-success");
					parentObj.find(".glyphicon-remove").hide();
					parentObj.find(".isnull_text").hide();
					parentObj.find(".glyphicon-ok").show();
				} else {
					thisYes = false;
					parentObj.removeClass("has-error");
					parentObj.removeClass("has-success");
					parentObj.addClass("has-error");
					parentObj.find(".glyphicon-remove").show();
					parentObj.find(".isnull_text").show();
					parentObj.find(".glyphicon-ok").hide();
				}
			}
		}
		return thisYes;
	},
	validateTextarea: function (obj) {
		var thisYes = true;
		var minlength = obj.attr("minlength");
		var maxlength = obj.attr("maxlength");
		var isnull = obj.attr("isnull");
		if (minlength || maxlength || isnull) {
			var value = obj.val();
			var parentObj = obj.parents(".form-group");
			if ("Y" == obj.attr("isnull")) {
				if (!value) {
					thisYes = false;
					parentObj.removeClass("has-error");
					parentObj.removeClass("has-success");
					parentObj.addClass("has-error");
					parentObj.find(".glyphicon-remove").show();
					parentObj.find(".isnull_text").show();
					parentObj.find(".length_text").hide();
					parentObj.find(".glyphicon-ok").hide();
				}
			}
			if (thisYes) {
				if (minlength && (value.length) < (minlength * 1)) {
					thisYes = false;
					parentObj.removeClass("has-error");
					parentObj.removeClass("has-success");
					parentObj.addClass("has-error");
					parentObj.find(".glyphicon-remove").show();
					parentObj.find(".isnull_text").hide();
					parentObj.find(".length_text").show();
					parentObj.find(".glyphicon-ok").hide();
				}
			}
			if (thisYes) {
				if (maxlength && (value.length) > (maxlength * 1)) {
					thisYes = false;
					parentObj.removeClass("has-error");
					parentObj.removeClass("has-success");
					parentObj.addClass("has-error");
					parentObj.find(".glyphicon-remove").show();
					parentObj.find(".isnull_text").hide();
					parentObj.find(".length_text").show();
					parentObj.find(".glyphicon-ok").hide();
				}
			}
			if (thisYes) {
				parentObj.removeClass("has-error");
				parentObj.removeClass("has-success");
				parentObj.addClass("has-success");
				parentObj.find(".glyphicon-remove").hide();
				parentObj.find(".isnull_text").hide();
				parentObj.find(".length_text").hide();
				parentObj.find(".glyphicon-ok").show();
			}
		}
		return thisYes;
	},
	jlChangClean: function (wordbook) { //搜索框清空级联字段
		var s
		if (wordbook && wordbook.setting && wordbook.setting.cascading && wordbook.setting.cascading.length > 0) {
			for (var i = 0; i < wordbook.setting.cascading.length; i++) {
				var asobj = wordbook.setting.cascading[i];
				if (asobj["form.name"] && asobj['value']) {
					$($("[key_name='" + asobj["form.name"] + "']")[0]).val("");
				}
			}
		}
	},
	jlChangBak: function (wordbook, data) { //搜索框设置级联字段
		if (wordbook && wordbook.setting && wordbook.setting.cascading && wordbook.setting.cascading.length > 0) {
			for (var i = 0; i < wordbook.setting.cascading.length; i++) {
				var asobj = wordbook.setting.cascading[i];
				if (asobj["form.name"] && asobj['value'] && data[asobj['value']]) {
					$($("[key_name='" + asobj["form.name"] + "']")[0]).val(data[asobj['value']]);
				}
			}
		}
	},
	init_obj: {
		initDate: function (q, isTwo) {
			var format = $(q).attr("format");
			if (!format) {
				format = "yyyy-MM-dd HH:mm:ss";
			}
			var type = "datetime";
			if (format == "yyyy-MM-dd") {
				type = "date";
			} else if (format == "yyyy-MM") {
				type = "month";
			} else if (format == "HH:mm:ss") {
				type = "time";
			}
			var min = $(q).attr("minDate");
			var max = $(q).attr("maxDate");
			var setting = {
				elem: q,
				format: format,
				type: type,
				done: function (value, date, endDate) {
					$(q).val(value);
					//$(q).focus();
					setTimeout(function () {
						$(q).blur();
					}, 100);
				}
			};
			if (min) { //最小日期
				if (min == "currTime") { //当前时间
					min = dateFormat(new Date() + "");
				}
				setting['min'] = min;
			}
			if (max) { //最大日期
				if (max == "currTime") { //当前时间
					max = dateFormat(new Date() + "");
				}
				setting['max'] = max;
			}

			laydate.render(setting);
		}
	},
	fieldToggle: function (fieldToggleSetting, sysParams, tableData) { //字段显示隐藏
		if (fieldToggleSetting && fieldToggleSetting.length > 0) {
			for (var i = 0; i < fieldToggleSetting.length; i++) {
				var expression = "";
				var fieldToggle = fieldToggleSetting[i];
				var pmData = {
					form: tableData,
					sys: sysParams
				};
				var conObjStr = btf.parseTFSParams(JSON.stringify(fieldToggle.conObj), pmData);
				var conObjList = JSON.parse(conObjStr);
				if (conObjList && conObjList.length > 0) {
					for (var j = 0; j < conObjList.length; j++) {
						var conObj = conObjList[j];
						var formVal = "'" + tableData[conObj.field_key] + "'";
						var targetVal = "'" + conObj.value + "'";
						expression += formVal + (conObj.con == "EQ" ? "==" : "!=") + targetVal;
						if (j < conObjList.length - 1) {
							expression += " && ";
						}
					}
					if (eval(expression)) {
						if (fieldToggle.showField && fieldToggle.showField.length > 0) {
							for (var j = 0; j < fieldToggle.showField.length; j++) {
								$($("[name='" + fieldToggle.showField[j] + "']")[0]).show().parents("div.component").show();
							}
						}
						if (fieldToggle.hideField && fieldToggle.hideField.length > 0) {
							for (var j = 0; j < fieldToggle.hideField.length; j++) {
								$($("[name='" + fieldToggle.hideField[j] + "']")[0]).hide().parents("div.component").hide();
							}
						}
					}
				}
			}
		}
	},
	uniqueCheck: function (uniqueCheckSetting, tableData) { //去重校验
		var checkResult = "ERROR";
		if (uniqueCheckSetting && uniqueCheckSetting.tableListId) {
			var loadMsg = layer.msg("去重校验中...", {
				icon: 16,
				shade: [0.1, '#393D49'],
				time: 60000
			});
			var params = tableData;
			params["tableId"] = uniqueCheckSetting.tableListId;
			params["conObj"] = JSON.stringify(uniqueCheckSetting.conObj);
			params["sqlExpression"] = uniqueCheckSetting.sqlExpression;
			params["page"] = 1;
			params["rows"] = 10;
			$.ajax({
				url: ctx + "/cloud/table/list/reader/list",
				async: false,
				type: "POST",
				data: params,
				success: function (result) {
					layer.close(loadMsg);
					if (result && result.rows) {
						if (result.rows.length > 0) {
							if (uniqueCheckSetting.failMsg) {
								tipsMsg(uniqueCheckSetting.failMsg, "FAIL");
							} else {
								tipsMsg("去重校验不通过，存在重复数据", "FAIL");
							}
						} else {
							checkResult = "SUCCESS";
						}
					} else {
						tipsMsg("去重校验查询错误", "FAIL");
					}
				}
			});
		} else {
			tipsMsg("去重校验设置错误", "FAIL");
		}
		return checkResult;
	}
};

function getValueConversionDate(value, format) {
	if (value && /^[0-9]+$/.test(value)) {
		try {
			var date = new Date(value);
			return date.format(format);
		} catch (e) {}
	}
	return value;
}

function getParamsValue(keys, dbPM) {
	if (keys && keys.indexOf(".") != -1) {
		var key = keys.split(".")[0];
		var key2 = keys.split(".")[1];
		if (dbPM[key] && dbPM[key][key2]) {
			return dbPM[key][key2];
		}
	}
	return keys;
}

function initUPPic(fileObj, img, selectFileBakFun, successBakFun, buttonText) {
	var displayTxt = "";
	if (selectFileBakFun || successBakFun) {
		displayTxt = "display:none;";
	}
	var initImg = getInitImg(img);
	var div = $(fileObj.parent().find("div[key=upload]")[0]);
	var createHtml = '<div class="picture-wrap"><div class="col click_button"><input id="fileImage" style="display: none;" type="file" size="30" name="fileselect[]"  multiple><div class="img-box btn-img-box click_picture"><a href="javascript:void(0);" class="btn btn-warning  btn-circle btn-lg"><i class="glyphicon glyphicon-camera"></i></a></div></div></div>';
	div.zyUpload({
		url: '${ctx}/cloud/upload/hospital/hospital', //上传的地址
		initUrl: initImg,
		multiple: true, // 是否可以多个文件上传
		suffix: "jpg,png,gif,jpeg",
		createHtml: createHtml,
		clickClass: "click_picture",
		/* 外部获得的回调接口 */
		onSelect: function (files, allFiles, boj, ZYFILE) {
			var i = 0;
			var html = '',
				i = 0;
			// 组织预览html
			var funDealtPreviewHtml = function (fList) {
				for (var z = 0; z < fList.length; z++) {
					var file = fList[z];
					var reader = new FileReader();
					reader.onload = function (e) {
						html += '<div class="col" style="' + displayTxt + '" key="' + file.index + '">' +
							'<div class="img-box">' +
							'<div class="shadow-bg">' +
							'<i class="fa fa-spinner fa-spin"></i>' +
							'</div>' +
							'<img src="' + e.target.result + '" alt=""/><em class="removePic" index="' + file.index + '" mark="1" title="删除"><i class="glyphicon glyphicon-remove"></i></em><input type="hidden" key="url">' +
							'</div>' +
							'</div>';
						i++;
						$(boj).find(".click_button").before(html);
						$(boj).find(".removePic").bind("click", function () {
							var obj = $(this);
							if (obj.attr("mark") == "1") {
								var index = $(this).attr("index");
								$(this).parent().parent().remove();
								ZYFILE.funDeleteFile(index, false);
								obj.attr("mark", "0");
							}
						});
						if (selectFileBakFun) {
							selectFileBakFun(file, e.target.result, fileObj);
						}
					}
					reader.readAsDataURL(file);
				}
			};

			function funAppendPreviewHtml() {
				for (var z = 0; z < files.length; z++) {
					try {
						ZYFILE.funUploadFile(files[z]);
					} catch (e) {
						console.log("error:\t" + e);
					}
				}
				funDealtPreviewHtml(files);
			}
			funAppendPreviewHtml();
		},
		onDelete: function (file, surplusFiles) { // 删除一个文件的回调方法
			console.info("当前删除了此文件：");
			console.info(file);
			console.info("当前剩余的文件：");
			console.info(surplusFiles);
		},
		initImg: function (files, boj) {
			if (!files || files.length == 0)
				return;
			var html = "";
			for (var i = 0; i < files.length; i++) {
				var file = files[i];
				html += '<div class="col" key="' + file.index + '">' +
					'<div class="img-box">' +
					'<div class="shadow-bg" style="display: none">' +
					'<i class="fa fa-spinner fa-spin"></i>' +
					'</div>' +
					'<img src="' + file.url + '" alt=""/><em onclick="javascript:$(this).parent().parent().remove();"><i class="glyphicon glyphicon-trash"></i></em><input type="hidden" key="url" value="' + file.url + '">' +
					'</div>' +
					'</div>';
			}
			$(boj).find(".click_button").before(html);
		},
		onSuccess: function (file, response, obj) {
			var obj = $(obj);
			var index = file.index;
			if (response) {
				response = eval('(' + response + ')');
			}
			if (response.status == true) {
				var divObj = $(obj.find("div[key='" + index + "']")[0]);
				divObj.find("img").attr("src", response.url);
				divObj.find("input").val(response.url);
				divObj.find(".shadow-bg").hide();
				if (successBakFun) {
					successBakFun(file, response, fileObj);
				}
			} else {
				alert("上传失败");
			}
		},
		onFailure: function (file) { // 文件上传失败的回调方法
			console.info("此文件上传失败：");
			console.info(file);
		},
		onComplete: function (responseInfo) { // 上传完成的回调方法
			console.info("文件上传完成");
			console.info(responseInfo);
		}
	});

	function getInitImg(img) {
		var initImg = [];
		if (img) {
			img = $.trim(img);
			if (img.length > 0) {
				var img_array = img.split(",");
				for (var i = 0; i < img_array.length; i++) {
					var url = $.trim(img_array[i]);
					if (url) {
						initImg.push({
							index: "init_" + i,
							url: url
						});
					}
				}
			}
		}
		return initImg;
	}
}


function initUPFile(fileObj, fileStr, selectFileBakFun, successBakFun, buttonText) {
	var files = getInitFile(fileStr);
	var div = $(fileObj.parent().find("div[key=upload]")[0]);
	var btxt = "添加附件";
	if (buttonText) {
		btxt = buttonText;
	}
	var createHtml = '<div class="container-fluid fujian-wrap">' +
		'<input  style="display: none;" type="file" size="30" name="fileselect[]"  multiple>' +
		'<span class="icon-right add-fj click_up_file">' +
		'<a class="btn btn-link" href="javascript:void(0);"><i class="glyphicon glyphicon-paperclip"></i>' + btxt + '</a>' +
		'</span>' +
		'</div>';
	div.zyUpload({
		url: '${ctx}/cloud/upload/hospital/uploadFile', //上传地址
		initUrl: files,
		clickClass: "click_up_file",
		multiple: true, // 是否可以多个文件上传
		createHtml: createHtml,
		/* 外部获得的回调接口 */
		onSelect: function (files, allFiles, boj, ZYFILE) {
			var html = '';
			var displayTxt = "";
			if (selectFileBakFun || successBakFun) {
				displayTxt = "display:none;";
			}
			if (files && files.length > 0) {
				for (var i = 0; i < files.length; i++) {
					var file = files[i];
					var index = file.index;
					var name = file.name;
					var size = getSize(file.size);
					html += '<span class="icon-right" style="' + displayTxt + '" key="' + index + '">' +
						'<a class="btn btn-link" href="javascript:void(0);"><i class="glyphicon glyphicon-paperclip"></i> ' + name + '(' + size + ')</a>' +
						'<i class="fa fa-spinner fa-spin"></i>' +
						'<i class="fa fa-close removeFile" mark="1" index="' + index + '" onclick="javascript:$(this).parent().remove();">删除</i>' +
						'<input type="hidden" name="' + name + '" size="' + size + '" key="url">' +
						'</span>'

				}
			}
			$(boj).find(".fujian-wrap").append(html);
			$(boj).find(".removeFile").each(function (i, obj) {
				obj = $(obj);
				if (obj.attr("mark") == "1") {
					obj.bind("click", function () {
						var index = $(this).attr("index");
						$(this).parent().remove();
						ZYFILE.funDeleteFile(index, false);
					});
					obj.attr("mark", "0");
				}
			});
			for (var i = 0; i < files.length; i++) {
				var file = files[i];
				if (selectFileBakFun) {
					selectFileBakFun(file, fileObj);
				}
				try {
					ZYFILE.funUploadFile(file);
				} catch (e) {
					console.log("error:\t" + e);
				}
			}
		},
		onDelete: function (file, surplusFiles) {
			console.info("当前删除了此文件：");
			console.info(file);
			console.info("当前剩余的文件：");
			console.info(surplusFiles);
		},
		initImg: function (files, boj) {
			if (files && files.length > 0) {
				var html = "";
				for (var i = 0; i < files.length; i++) {
					var file = files[i];
					var name = file.name;
					var size = file.size;
					var url = file.url;
					var index = "init_" + i;;
					html += '<span class="icon-right" key="' + index + '">' +
						'<a class="btn btn-link" href="javascript:void(0);"><i class="glyphicon glyphicon-paperclip"></i> ' + name + '(' + size + ')</a>' +
						'<i class="fa fa-spinner fa-spin" style="display:none;"></i>' +
						'<i class="fa fa-close removeFile" mark="1" index="' + index + '" onclick="javascript:$(this).parent().remove();">删除</i>' +
						'<input type="hidden" value="' + url + '"  name="' + name + '" size="' + size + '" key="url">' +
						'</span>'
				}
				$(boj).find(".fujian-wrap").append(html);
			}
		},
		onSuccess: function (file, response, obj) {
			var obj = $(obj);
			var index = file.index;
			if (response) {
				response = eval('(' + response + ')');
			}
			if (response.status == true) {
				if (successBakFun) {
					successBakFun(file, response, fileObj);
				} else {
					var divObj = $(obj.find("span[key='" + index + "']")[0]);
					divObj.find(".fa-spin").hide();
					$(divObj.find("input")[0]).val(response.url);
				}
			} else {
				alert("上传失败");
			}
		},
		onFailure: function (file) {
			console.info("此文件上传失败：");
			console.info(file);
		},
		onComplete: function (responseInfo) {
			console.info("文件上传完成");
			console.info(responseInfo);
		}
	});

	function getInitFile(fileStr) {
		if (fileStr) {
			var files = eval('(' + fileStr + ')');
			return files;
		}
	}
}


function getSize(size) {
	if (size && size > 0) {
		if (size > 1024 * 1024) {
			size = (Math.round(size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
		} else {
			size = (Math.round(size * 100 / 1024) / 100).toString() + 'KB';
		}
	}
	return size;
}