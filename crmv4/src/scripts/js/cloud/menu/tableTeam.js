"use strict";

var form_pm_obj = {};
var form_db;
var sys_db = {};
var cur_menuId = "";
var fBili = "";
var mBiLi = "";
var isDesc = "";

var filterConfigObj = {};
var fieldListObjAll = {};
var fromTableWidth = $("#from_table").width();   //附表的宽度
var markIframeWidth = $("#frame_mark0").width();   //iframe的宽度
var open_window_width;
var open_window_default_width = 900;
var crmPermissionTableTeam;
var curLeaderSetting;
var windowWidht = $(window).width();
var mianWidth = windowWidht;
var fbWidth = windowWidht;

var urlData = getUrlParams();
var currentHref = window.location.href;
var menuId = urlStr(currentHref, "id");  //获取菜单对象的id
// alert("tableId:"+tableId)
var tableId = urlStr(currentHref,"menuId");
// alert(menuId);
var cur_menuId = menuId;
var tableTeamId = "";  //表格组id
var tableTeamSid = "";
var tableTeamName = "";  //表格组名称

var params_form_db = {};
var params_sys_db = {};
var params_form_pm = {};

/**
* 全局变量
**/
var fieldList, buttonList, tableSetting, configId;
var fieldTypeList;
var conditionList = {};
var buttonConfigList = {};
var multflag = false;	//是否显示多选(批量操作)
var colList = [];			//列表字段显示信息
var editDelButtonList = [];
/* var filterList=[];var filterConfigObj={}; */

/**
 * 列表全局变量
 **/
var gridObj; var current_db_rows; var current_select_data;

var tableDataSumObj = {}; var tableObjectList = {}; var current_table_select_data; var fb_config_obj = {}; var cur_fb_config_mark; var conditionList = {}; var fieldTypeList; var main_field_list; var main_button_list; var main_table_obj; var main_TableId; var buttonConfigList = {}; var tableTeamlConfigObj; var fb_window_switch = false;

$(function () {

    $.ajaxSetup({
        contentType: 'application/x-www-form-urlencoded;charset=utf-8',
        complete: function (xhr, status) {
            var sessionStatus = xhr.getResponseHeader('sessionstatus'); // 通过XMLHttpRequest取得响应头，sessionstatus，
            if (sessionStatus == "timeout") {
                location.href = 'login.html';
            }
        }
    });

    setWaterMark("body", [$.cookie("loginName"), "", ""], "rgba(0, 0, 0, 0.1)", 100, 60, -30);
    initTabelTeam(tableId);


    function gvFB(j) {
        if (crmPermissionTableTeam) {
            var cpObj = crmPermissionTableTeam;
            if (cpObj && cpObj.length > 0) {
                for (var i = 0; i < cpObj.length; i++) {
                    if (cpObj[i] == ("副表:" + j)) {
                        return true;
                    }
                }
            }
        }
    }
    $(".float_window_pop").on("click", ".conditin_classification", function (e) {
        var evt = e || window.event;
        evt.stopPropagation();//阻止自身冒泡事件
        $(".float_pop_list").css({ "transform": "translate(-10px,0px)", "transition-duration": ".5s" });
        $("body").on("click", function (e) {
            e.stopPropagation();
            e.preventDefault();
            $(".float_pop_list").css({ "transform": "translate(-110px,0px)", "transition-duration": ".5s" });
            $("body").unbind("click");
        });
    });

    $(".float_pop_list").on("click", ".pop_list_item", function (e) {
        $(".float_pop_list .pop_list_item").css({ "background": "#48a0dc", "color": "#ffffff" });
        $(this).css({ "background": "#f6ff8c", "color": "#000" });
        e.stopPropagation();
        e.preventDefault();
        return false;
    });
    $("#from_table").height(window.innerHeight - 88);
    $("#tab-content").height(jqgridHeight + 22);
})


function initTabelTeam(tableId) {
    $.ajax({
        type: "GET",
        url: ctx + "/cloud/menu_v1/tableTeam/" + tableId,
        async: true,
        dataType: "json",
        success: function (data) {
            console.log("表格组接口:" + JSON.stringify(data));
            if (data.result == "SUCCESS") {
                fBili = data.map.fBili;
                form_db = data.map.form_db;
                mBiLi = data.map.mBiLi;
                sys_db = data.map.sys_db;
                isDesc = data.map.isDesc;
                tableTeamId = data.map.tableTeam.leaderId;
                tableTeamSid = data.map.tableTeam.sid;
                // tableTeamStr = data.map.tableTeamStr;
                $("#tableTeamStr").html(data.map.tableTeamStr);
                if (form_db != null) {
                    params_form_db = form_db;
                }
                if (sys_db != null) {
                    params_sys_db = sys_db;
                }
                tableTeamData(data.map.tableTeam);
            }
        },
        error: function (data) {
            console.log("加载首页接口的 失败：" + data);
        }
    })

}

function tableTeamData(tableTeam) {
    $(window).resize(function () {
        if (main_table_obj) {
            var windowSumWidth = $(window).width();
            if (tableTeam != null && tableTeam.type == '1' || (tableTeam.type == '2' && isDesc == '2')) {
                main_table_obj.setGridWidth(windowSumWidth - 10);
            } else {
                main_table_obj.setGridWidth((mBiLi / 12) * windowSumWidth - 10);
            }
        }
    });

    if (tableTeam != null && tableTeam.type == '1' || (tableTeam.type == '2' && isDesc == '2')) {
        mianWidth = windowWidht;
        fbWidth = 0;
    } else {
        mianWidth = windowWidht * (mBiLi / 12);
        fbWidth = windowWidht * (fBiLi / 12);
    }

    if (form_db.open_window_width && (form_db.open_window_width * 1) > 0) {
        open_window_width = form_db.open_window_width * 1;
    } else if (form_pm_obj.open_window_width && (form_pm_obj.open_window_width * 1) > 0) {
        open_window_width = form_pm_obj.open_window_width * 1;
    }
    if (open_window_width && open_window_width > 0) {
        fbWidth = open_window_width;
    } else {
        fbWidth = 900;
    }
    if ($("#yb_template").val() == "1") {
        fb_window_switch = true;
    };

    // var urlData = getUrlParams();
    if (urlData) {
        form_db = JSON.parse(form_db);
        for (var ud in urlData) {
            if (!form_db[ud]) {
                form_db[ud] = urlData[ud];
            }
            if (!form_pm_obj[ud]) {
                form_pm_obj[ud] = urlData[ud];
            }
        }
    }
    
    initTableTeamData(tableTeam.leaderId);
}

function initMainTableOther(tableTeamId) {
    $.post(ctx + "/cloud/sbehaviourConfig/use/getConfig/TABLE_CONDITION", { id: tableTeamId }, function (json) {
        if (json.result == "Success" || json.result == "SUCCESS") {
            var conList = json.list;
            if (conList != null && conList.length > 0) {
                $.each(conList, function (i, con) {
                    var setting = con.setting;
                    if (setting) {
                        conditionList[con.sid] = con;
                        var setObj = JSON.parse(setting);
                        $("#condition_div").append(
                            '<div class="btn-wrap" key_id="' + con.sid + '" onclick="javascript:clickCondtion(this);">' +
                            '<label class="close-label close-label-gray">' +
                            setObj.name +
                            '<em key_id="' + con.sid + '" onclick="javascript:removeOther(this);"></em>' +
                            '</label>' +
                            '</div>'
                        );
                    }
                });
            }
        } else {
            tipsMsg(json.resultMsg, "FAIL");
        }
    });

        /**
		 * 展示用户保存的搜索分类（公共分类 + 自己创建的分类
		 **/
		// $.post(ctx+"/cloud/sbehaviourConfig/use/getConfig/TABLE_CONDITION",{id:tableTeamId},function(json){
		// 	if(json.result=="Success" || json.result=="SUCCESS"){
		// 		var conList=json.list;
		// 		var hasShow=[];
		// 		if(conList!=null && conList.length>0){
		// 			$.post(ctx+"/cloud/sbehaviourConfig/use/getConfig/TABLE_CONDITION_SETTING",{id:tableTeamId},function(result){	//获取分类用户设置信息
		// 				if((json.result=="Success" || json.result=="SUCCESS") && result.list!=null && result.list.length>0){
		// 					var tableConditionSettingId=result.list[0].sid;
		// 					if(tableConditionSettingId && tableConditionSettingId.indexOf("10000")==-1){
		// 						$("#tableConditionSettingId").val(result.list[0].sid);
		// 					}
		// 					var setting = JSON.parse(result.list[0].setting);
		// 					for(var i=0;i<setting.length;i++){
		// 						var userSet=setting[i];					//用户设置信息
		// 						$.each(conList,function(j,con){	
		// 							if(userSet.classifyId==con.sid){
		// 								conditionList[con.sid]=con;
		// 								var conSet=JSON.parse(con.setting);	//搜索分类设置信息
		// 								showClassify({classifyId:con.sid,name:conSet.name,type:conSet.type,isShow:userSet.isShow,isDefault:userSet.isDefault});
		// 								conList.splice(j,1);			//移除已经添加过的分类
		// 								return false;
		// 							}
		// 						});
		// 					}
		// 				}
		// 				//没有搜索字段用户设置信息或者一些分类设置后没有保存用户设置
		// 				$.each(conList,function(i,con){
		// 					var setting=con.setting;
		// 					if(setting){
		// 						conditionList[con.sid]=con;
		// 						var setObj = JSON.parse(setting);
		// 						showClassify({classifyId:con.sid,name:setObj.name,type:setObj.type});
		// 					}
		// 				});
		// 			});
		// 		}
		// 	}else{
		// 		tipsMsg(json.resultMsg,"FAIL");
		// 	}
		// 	/******加载列表******/
		// 	var postData={module:tableId,menuId:cur_menuId};
		// 	if(tableTeamId){
		// 		postData["type"]="TABLE_TEAM_TABLE";
		// 		postData["tableTeamId"]=tableTeamId;
		// 		postData["tableTeamMark"]="主表";
        //     }
            
			// $.post(ctx+"/cloud/userUiConfig/postGet",postData,function(json){
			// 	if(json.result=="Success" || json.result=="SUCCESS"){
			// 		var jsonMap=json.map;
			// 		fieldList = jsonMap.fieldList;
			// 		buttonList = jsonMap.buttonList;
			// 		configId=jsonMap.configId;
			// 		tableSetting=jsonMap.tableSetting;
			// 		colList = initColList(jsonMap);

			// 		if(idKey && pIdKey){	//zTree
			// 			initTree();
			// 		}else{					//jqGird
			// 			initTable();
			// 		}
			// 		//初始化快速检索表单
			// 		initQuickQuery(fieldList);
			// 	}else{
			// 		tipsMsg(json.resultMsg,"FAIL");
			// 	}
			// }); 
		// });
}


function initTableTeamData(tableTeamId){
    var buttonConfigList = {};
    var tableTeamObj = JSON.parse($("#tableTeamStr").html());
    // var tableTeamObj = $("#tableTeamStr").html();
    tableTeamlConfigObj = tableTeamObj;
    if (tableTeamObj != null && tableTeamObj.leaderId && tableTeamObj.leaderSetting) {
        var leaderId = tableTeamObj.leaderId;
        var leaderSetting = JSON.parse(tableTeamObj.leaderSetting);
        curLeaderSetting = leaderSetting;
        // var tableTeamId = tableTeamObj.id;
        addTableTeam(leaderId, leaderSetting, $("#main_table"), true);
    }
    $.post(ctx + "/cloud/behind/stableListConfig/getFieldType", function (json) {
        if (json.result == "Success" || json.result == "SUCCESS") {
            fieldTypeList = json.list;
            //平铺高级搜索字段
            if (tableSetting && tableSetting.isShowAllSearchField && tableSetting.isShowAllSearchField == 1) {
                $.each(fieldList, function (i, field) {
                    if (field.isSearch == "1") {
                        $(".addConnection").click();
                        var lastSeniorSearch = $(".addConnection").parent().parent().find(".senior-search").last();
                        lastSeniorSearch.find("select[name=field]").val(field.columnName).change();
                        //lastSeniorSearch.find("select[name=condtion] option").filter(function(){return $(this).text()=="等于";}).prop("selected",true).change();
                    }
                });
            }
        } else {
            tipsMsg(json.resultMsg, "FAIL");
        }
    }); 
}



function setCurrentFBLabelMARK(mark) {
    currentFB_Label_MARK = mark;
}
function getCurrentFBLabelMARK() {
    return currentFB_Label_MARK;
}

function getUrlParams() {
    var href_url = window.location.href;
    var data = {};
    if (href_url && href_url.split("?").length == 2) {
        var pmStr = $.trim(href_url.split("?")[1]);
        var cur_id;
        for (var i = 0; i < pmStr.split("&").length; i++) {
            var str_val = pmStr.split("&")[i];
            if (str_val && str_val.split("=") != -1) {
                data[str_val.split("=")[0]] = str_val.split("=")[1];
            }
        }
    }
    return data;
}

function openFBWindow(me) {
    var rowId = $(me).attr("rowId");
    var text = $(me).html();
    if (rowId) {
        main_table_obj.jqGrid('setSelection', rowId);
        if (current_table_select_data && curLeaderSetting && curLeaderSetting.primaryKey) {
            var primaryKey = curLeaderSetting.primaryKey;
            openFBWindowNew(text, primaryKey, form_pm_obj);
        } else {
            tipsMsg("表格组主键id不能为空", "FAIL");
        };
    } else {
        tipsMsg("获取行号失败", "FAIL");
    }
}

function openFBWindowNew(text, primaryKey, formDB) {
    fb_window_switch = true;
    if (primaryKey) {
        if (current_table_select_data) {
            if (current_table_select_data[primaryKey]) {
                var dataId = current_table_select_data[primaryKey];
                var data = { data_id: dataId, menuId: cur_menuId + "" };
                if (formDB) {
                    for (var pd in formDB) {
                        if (formDB[pd]) {
                            data[pd] = formDB[pd];
                        }
                    }
                }
                var pmStr = (btf.getParamsStr(data));
                var url = ctx + '/cloud/menu/tableTeam/detail/' + tableTeamId + "?" + pmStr;
                var windowWidth = window.innerWidth;
                var windowHeight = window.innerHeight;
                if ($("#yb_template").val() == "1") {
                    $("#table_block").html('<iframe name="content_iframe" class="content_iframe_s" src="' + url + '" width="100%" height="100%" frameborder="0"></iframe>');
                } else {
                    if (openMenuMark) {
                        createDiv("detail" + dataId, text, "iframe_src_" + dataId, url, (windowWidth * 0.8), (windowHeight * 0.90));
                    } else {
                        $("#table_block").html('<iframe  name="content_iframe" class="content_iframe_s" src="' + url + '" width="100%" height="100%" frameborder="0"></iframe>');
                        fb_window_switch = true;
                        if (open_window_width && open_window_width > 0 && open_window_width > open_window_default_width) {
                            showRightPopGetWidth("fb_btn_panel", open_window_width + "px");
                        } else {
                            showRightPopGetWidth("fb_btn_panel", open_window_default_width + "px");
                        }
                    }
                }
            } else {
                tipsMsg("主键idkey不能为空", "FAIL");
            }
        } else {
            tipsMsg("主表选择行数据不能为空", "FAIL");
        }
    } else {
        tipsMsg("主键idkey不能为空", "FAIL");
    }
}

function closeFBWindow(isSuccess, isNew) {
    fb_window_switch = false;
    if (isNew) {
        main_table_cur_select_row = "";
    }
    if (openMenuMark) {
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        createDiv("test" + mark_i, "test", "iframe_src_" + mark_i, url, (windowWidth * 0.8), (windowHeight * 0.8));
        mark_i++;
    } else {
        fb_window_switch = false;
        if (open_window_width && (open_window_width * 1) > 0) {
            hideRightPopGetWidth("fb_btn_panel", open_window_width + "px");
        } else {
            hideRightPopGetWidth("fb_btn_panel", open_window_default_width + "px");
        }
        if (isOk) {
            main_table_obj.jqGrid('setGridParam', { page: main_table_obj.getGridParam('page') }).trigger("reloadGrid");
        }
    }
    if (isSuccess) {
        if (window.openWindowBanFun) {
            window.openWindowBanFun();
        }
    }
}

function removeOther(me) {
    event.stopPropagation();
    me = $(me);
    var key_id = me.attr("key_id");
    confirmMsg("你确定要删除吗", function () {
        $.post(ctx + "/cloud/sbehaviourConfig/use/remove/config", { id: key_id }, function (json) {
            if (json.result == "Success" || json.result == "SUCCESS") {
                me.parent().parent().remove();
            } else {
                tipsMsg(json.resultMsg, "FAIL");
            }
        });
    },
        function () {

        })

}

function search(isMain, conObj) {
    if (isMain) {
        var fieldKeys = [];
        if (!conObj) {
            conObj = [];
        }
        var fieldSearchData = getFieldSearchData();
        if (fieldSearchData && fieldSearchData.length > 0) {
            $.each(fieldSearchData, function (i, fobj) {
                conObj.push(fobj);
            });
        }
        if (curFilterValue && curFilterValue.length > 0) {
            for (var i = 0; i < curFilterValue.length; i++) {
                conObj.push(curFilterValue[i]);
            }
        }
        if (main_field_list && main_field_list.length > 0) {
            $.each(main_field_list, function (i, obj) {
                if (obj.isSearch && obj.isSearch == 1) {
                    fieldKeys.push(obj.columnName);
                }
            });
        }
        var data = { keyword: $($("input[name=keyword]")[0]).val(), fieldKeys: JSON.stringify(fieldKeys), conObj: JSON.stringify(conObj) };
        cleanFBTableData();
        main_table_obj.jqGrid('setGridParam', { datatype: 'json', postData: data, page: 1 }).trigger("reloadGrid"); //重新载入
    } else {
        var config = fb_config_obj[cur_fb_config_mark];
        if (config) {
            var markKey = config.obj_id + "_" + cur_fb_config_mark;
            if (config.obj_type && config.obj_type == "REPORT" && config.obj_id && tableObjectList[markKey]) {
                var fieldKeys = [];
                $.each(fieldListObjAll[config.obj_id], function (i, obj) { fieldKeys.push(obj.columnName); });
                var data = { keyword: $("#" + cur_fb_config_mark + "_context").find("input[name=fb_keyword]").val(), fieldKeys: JSON.stringify(fieldKeys) };
                tableObjectList[markKey].jqGrid('setGridParam', { datatype: 'json', postData: data, page: 1 }).trigger("reloadGrid");
            }
        }
    }
}

function clickButton(me) {
    var key_mian = $(me).attr("key_mian");
    var data = {};
    var rowId = $(me).attr("rowId");
    var btType = $(me).attr("bt_type");
    var buttonText = $(me).text();
    if (key_mian == "0") {
        data['form'] = current_table_select_data;
        var config = fb_config_obj[cur_fb_config_mark];
        if (rowId && (rowId * 1) >= 0) {
            if ((cur_fb_config_mark || cur_fb_config_mark == 0) && fb_config_obj[cur_fb_config_mark]) {
                if (config.obj_type == "REPORT") {
                    if (config.obj_id) {
                        var markKey = config.obj_id + "_" + cur_fb_config_mark;
                        if (tableObjectList[markKey]) {
                            data['table'] = getTableRowDb(rowId, false, markKey);
                        }
                    }
                }
            }
        }
        if (!data['form']) {
            data['form'] = {};
        }
        if (config && config.setting) {
            if (config.setting.params) {
                var pmData = { table: current_table_select_data, form: {}, sys: {} };
                var pdata = btf.button.setParamsValue(config.setting.params, pmData);
                if (pdata) {
                    for (var pd in pdata) {
                        if (pdata[pd]) {
                            data['form'][pd] = pdata[pd];
                        }
                    }
                }
            }
        }
    } else if (key_mian == "1" && rowId) {
        data['table'] = getTableRowDb(rowId, true, markKey);
    }
    if (!data['form']) {
        data['form'] = {};
    }
    data['sys'] = sys_db;
    if (params_form_db) {
        for (var pd in params_form_db) {
            if (params_form_db[pd] && !data['form'][pd]) {
                data['form'][pd] = params_form_db[pd];
            }
        }
    }
    if (params_form_pm) {
        for (var pd in params_form_pm) {
            if (params_form_pm[pd] && !data['form'][pd]) {
                data['form'][pd] = params_form_pm[pd];
            }
        }
    }
    if (btType == "ADD") {
        var selectRowData = getSelectRowObj(key_mian);
        if (selectRowData && selectRowData.length > 0) {
            data['form']['selectRows'] = JSON.stringify(selectRowData);
            var ids = "";
            $.each(selectRowData, function (i, sobj) {
                if (sobj.id) {
                    if (ids) {
                        ids += "," + sobj.id;
                    } else {
                        ids += sobj.id;
                    }
                }
            });
            data['form']['selectIds'] = ids;
        } else {
            if (buttonText && buttonText.indexOf("批量") != -1) {
                tipsMsg("请勾选需要" + buttonText + "的数据", "FAIL");
                return;
            }
        }
    }
    var bakfn = function () {
        //search(true);
        main_table_obj.trigger("reloadGrid");
    };
    if (btType && btType == "DELETE") {
        confirmMsg("是否确认" + buttonText, function () {
            btf.button.clickButton(me, buttonConfigList, data, bakfn);
        });
    } else {
        btf.button.clickButton(me, buttonConfigList, data, bakfn);
    }
}

function clickCondtion(me) {
    me = $(me);
    var key_id = me.attr("key_id");
    if (key_id) {
        if (conditionList[key_id]) {
            var configObj;
            $("input[name=keyword]").val("");
            if (me.find("label").hasClass("close-label-gray")) {
                var conObj = conditionList[key_id];
                if (conObj.setting) {
                    configObj = JSON.parse(conObj.setting).conObj;
                }
                $("#condition_div").find("label").addClass("close-label-gray");
                me.find("label").removeClass("close-label-gray");
            } else {
                $("#condition_div").find("label").addClass("close-label-gray");
            }
            search(true, configObj);
            openHeightSearchSetting(true);
        } else {
            tipsMsg("条件不存在，请刷新页面", "FAIL");
        }
    } else {
        tipsMsg("条件不存在，请刷新页面", "FAIL");
    }
}

function cleanFBTableData() {
    var config = fb_config_obj[cur_fb_config_mark];
    if (config) {
        if (config.obj_type && config.obj_type == "REPORT" && config.obj_id && tableObjectList[config.obj_id]) {
            $("#" + cur_fb_config_mark + "_context").find(".tableObj").find("tr").remove();
        }
    }
}

function openHeightSearchSetting(hideMark) {
    //清空分类name、id属性
    $('.save_classify').find('input[name=classify_name]').val("");
    $('.save_classify').find('input[name=classify_id]').val("");
    //修改分类
    var label = $("#condition_div").find("label").not(".close-label-gray").first();
    if (!hideMark) {
        $('.height_search_setting_form').show();
    }
    if (label) {
        var key_id = label.parent().attr("key_id");
        var conObj = conditionList[key_id];
        if (conObj && conObj.setting) {
            $('.save_classify').find('input[name=classify_name]').val(label.text());
            $('.save_classify').find('input[name=classify_id]').val(key_id);
            $('.height_search_setting_form').find("div[key=search_field]").empty();
            var configObj = JSON.parse(conObj.setting).conObj;
            //回显当前选中分类搜索条件
            $.each(configObj, function (i, seniorSearch) {
                $('.height_search_setting_form').find(".addConnection").click();
                var lastSeniorSearch = $('.height_search_setting_form').find("div[key=search_field]").find(".senior-search").last();
                lastSeniorSearch.find("select[name=field]").val(seniorSearch.field_key).change();
                lastSeniorSearch.find("select[name=condtion]").val(seniorSearch.con).change();
                delete seniorSearch.field_key;
                delete seniorSearch.con;
                for (var key in seniorSearch) {
                    lastSeniorSearch.find("[name^=" + key + "]").val(seniorSearch[key]);
                }
            });
        }
    }
}

function yes_search(me) {
    event.stopPropagation();
    me = $(me);
    var conObj = getDbConfig(me.parent().parent().find(".senior-search"));
    $("#condition_div").find("label").addClass("close-label-gray");
    search(true, conObj);
    $(".height_search_setting_form").hide();
}

function getDbConfig(divList) {
    var conObj = [];
    divList.each(function (i, obj) {
        obj = $(obj);
        var field = obj.find("select[name=field]").val();
        var condtion = obj.find("select[name=condtion]").val();
        var value = obj.find("input[name=value]").val();
        var convert = obj.find("select[name=convert]").val();
        var end_val = obj.find("input[name=end_value]").val();
        var start_val = obj.find("input[name=start_value]").val();
        var unit = obj.find("select[name=unit]").val();
        conObj.push({ field_key: field, con: condtion, value: value, convert: convert, end_val: end_val, start_val: start_val, unit: unit });
    });
    return conObj;
}


function selectLabelClick(me, isStatus) {
    var me = $(me);
    if (me.attr("lable_key")) {
        if (isStatus) {
            me.removeClass("complete");
            me.addClass("active").siblings().removeClass("active");
            me.prevAll().addClass("complete");
            $(".status_mark").eq(me.index()).addClass("active").siblings().removeClass("active");
        }
        cur_fb_config_mark = me.attr("lable_key");
        $("#" + cur_fb_config_mark + "_context").addClass("active");
        reloadFB();
    }
}

function saveClassify(me) {
    var conObj = getDbConfig($(".height_search_setting_form").find(".senior-search"));
    var classify_name = $(".save_classify").find("input[name=classify_name]").val();
    var classify_id = $(".save_classify").find("input[name=classify_id]").val();
    if (conObj && conObj.length > 0) {
        var setting = { name: classify_name, conObj: conObj };
        if (classify_id && classify_id.indexOf("10000") != -1) {
            tipsMsg("公共该条件不能修改", "FAIL");
            return;
        }
        $.post(ctx + "/cloud/sbehaviourConfig/use/saveConfig/TABLE_CONDITION", { setting: JSON.stringify(setting), tableId: main_TableId, id: classify_id }, function (json) {
            if (json.result == "Success" || json.result == "SUCCESS") {
                if (!classify_id) {
                    $("#condition_div").append(
                        '<div class="btn-wrap" key_id="' + json.map.obj.sid + '" onclick="javascript:clickCondtion(this);">' +
                        '<label class="close-label close-label-gray">' +
                        classify_name +
                        '<em key_id="' + json.map.obj.sid + '" onclick="javascript:removeOther(this);"></em>' +
                        '</label>' +
                        '</div>'
                    );
                } else {
                    $("#condition_div").find("label").not(".close-label-gray").first().html(classify_name + '<em key_id="' + json.map.obj.sid + '" onclick="javascript:removeOther(this);"></em>');
                }
                var obj = json.map.obj;
                conditionList[obj.sid] = obj;
                $(".height_search_setting_form").find(".click_height_search").click();
                $("#condition_div").find("em[key_id=" + json.map.obj.sid + "]").parent().removeClass("close-label-gray");
                $(".save_classify").hide();
                $(".height_search_setting_form").hide();
            } else {
                tipsMsg(json.resultMsg, "FAIL");
            }
        })
    } else {
        tipsMsg("请设置搜索条件", "FAIL");
    }
}

function addFieldSearch(me) {
    me = $(me);
    var fieldStr = '';
    if (main_field_list && main_field_list.length > 0) {
        $.each(main_field_list, function (i, field) {
            if (field.isSearch == "1") {
                fieldStr += '<option key_type="' + field.fieldType + '" ';
                //存在字段引用/字段转换
                if (field.setting) {
                    var setting = JSON.parse(field.setting);
                    if (!jQuery.isEmptyObject(setting.wordbook)) {
                        fieldStr += 'quote=\'' + JSON.stringify(setting.wordbook) + '\' ';
                    }
                    if (setting.showSetting && setting.showSetting.length > 0) {
                        fieldStr += 'convert=\'' + JSON.stringify(setting.showSetting) + '\' ';
                    }
                }
                fieldStr += 'value="' + field.columnName + '">' + field.title + '</option>';
            }
        });
    }
    $(me.parent().parent().find("div[key=search_field]")[0]).append(
        '<div class="senior-search" style="padding: 10px;">' +
        '<div class="custom-select-box"style="width:125px;">' +
        '<select class="custom-select" style="width:120px;" name="field" onchange="javascript:changeField(this);">' +
        fieldStr +
        '</select>' +
        '</div>' +
        '<div class="custom-select-box"style="width:125px;">' +
        '<select class="custom-select" style="width:120px;" name="condtion" onchange="javascript:changeCondition(this);">' +
        '</select>' +
        '</div>' +
        '<div class="custom-select-box"style="width:180px;">' +
        '<input type="text" style="width: 100px;" name="value" class="input" >' +
        '<div class="time-before" style="width: 100px;">' +
        '<select class="custom-select" name="unit" style="text-indent: 8px;width: 50px;">' +
        '<option  value="DAY">天</option>' +
        '<option value="WEEK">周</option>' +
        '<option value="MONTH">月</option>' +
        '<option value="QUARTER">季度</option>' +
        '<option value="YEAR">年</option>' +
        '</select>' +
        '</div>' +
        '<div class="time-date" style="width: 100px;">' +
        '<input type="text" style="width: 100px;" name="start_value"  class="input" />' +
        '<input type="text" style="width: 100px;" name="end_value" class="input" />' +
        '</div>' +
        '<select class="custom-select" style="text-indent:8px;width:120px;" name="convert">' +
        '</select>' +
        '<div class="del-tj-w" style="vertical-align:top;">' +
        '<em class="del-tj" onclick="javascript:$(this).parent().parent().parent().remove();"></em>' +
        '</div>' +
        '</div>' +
        '</div>'
    );
    var searchFileArray = me.parent().parent().find("select[name=field]");
    changeField(searchFileArray[searchFileArray.length - 1]);
    $(".time-date input").each(function (i, obj) {
        laydate.render({
            elem: obj //指定元素
            , done: function (value, date, endDate) {
                countAge("app_doc", value);
            }
        });
    });
    var searchFileArray = me.parent().parent().find(".senior-search");
    $(searchFileArray[searchFileArray.length - 1]).find("select[name=field]").change();
}

function changeField(me) {
    me = $(me);
    var value = me.val();
    var type = $(me.parent().find('option[value="' + value + '"]')[0]).attr("key_type");
    if (type) {
        type = type.toLocaleUpperCase();
    }
    var quote = $(me.parent().find('option[value="' + value + '"]')[0]).attr("quote");
    var convert = $(me.parent().find('option[value="' + value + '"]')[0]).attr("convert");
    var fieldTypeStr = '<option value="">请选择</option>';
    if (fieldTypeList && fieldTypeList.length > 0) {
        for (var i = 0; i < fieldTypeList.length; i++) {
            if (fieldTypeList[i].name == type) {
                if (fieldTypeList[i].conList && fieldTypeList[i].conList.length > 0) {
                    $.each(fieldTypeList[i].conList, function (i, obj) {
                        if (obj.name == "QUOTE") {
                            if (quote) {
                                var showText = obj.desc;
                                if (showText == "引用") {
                                    showText = "下拉";
                                }
                                fieldTypeStr += '<option value="' + obj.name + '">' + showText + '</option>';
                            }
                        } else if (obj.name == "CONVERT") {
                            if (convert) {
                                fieldTypeStr += '<option value="' + obj.name + '">' + obj.desc + '</option>';
                            }
                        } else {
                            fieldTypeStr += '<option value="' + obj.name + '">' + obj.desc + '</option>';
                        }
                    });
                }
            }
        }
    }
    $(me.parent().parent().find("select[name=condtion]")[0]).html(fieldTypeStr);
    $(me.parent().parent().find("select[name=condtion]")[0]).change();
}

function changeCondition(me) {
    me = $(me);
    me.parent().parent().find(".time-date").hide()
    me.parent().parent().find(".time-before").hide()
    me.parent().parent().find("input[name=value]").hide();
    me.parent().parent().find("select[name=convert]").hide();
    me.parent().parent().find("div .ms-ctn").remove();
    var value = me.val();
    if (value == "TODAY" || value == "THIS_WEEK" || value == "THIS_MONTH" || value == "THIS_SEASON" || value == "THIS_YEAR" || value == "NULL" || value == "NOT_NULL" || value == "TOMORROW" || value == "YESTERDAY" || value == "NEXT_WEEK" || value == "UP_WEEK" || value == "NEXT_MONTH" || value == "UP_MONTH" || value == "NEXT_SEASON" || value == "UP_SEASON" || value == "NEXT_YEAR" || value == "UP_YEAR"
    ) {
        me.parent().parent().find("input[name=value]").hide();
    } else if (value == "L_" || value == "N_") {
        me.parent().parent().find(".time-before").css("display", "inline-block")
        me.parent().parent().find("input[name=value]").show();
    } else if (value == "IN") {
        me.parent().parent().find(".time-date").css("display", "inline-block")
    } else if (value == "QUOTE") {
        me.parent().parent().find("input[name=value]").after('<input type="text" style="width: 160px;float:left" name="quote">');
        var value = me.parent().parent().find("[name='field']").val();
        var quoteStr = $(me.parent().parent().find("[name='field']").find('option[value="' + value + '"]')[0]).attr("quote");
        if (quoteStr) {
            var quote = JSON.parse(quoteStr);
            var wordbookId = quote.id;
            var fieldKey = quote.field_key;
            var strPM = "";
            if (quote.params && quote.params.length > 0) {
                for (var i = 0; i < quote.params.length; i++) {
                    var pmObj = quote.params[i];
                    if (pmObj.p_name && pmObj.p_value) {
                        strPM += "&" + (pmObj.p_name) + "=" + (pmObj.p_value);
                    }
                }
            }
            if (wordbookId && fieldKey) {
                var quoteObj = me.parent().parent().find("input[name=quote]").magicSuggest({
                    data: ctx + "/cloud/table/list/reader/wordbook/" + wordbookId + "?" + strPM,
                    allowFreeEntries: false,
                    autoSelect: true,
                    value: [],
                    valueField: fieldKey,
                    //							maxSelection:1,//设置选择个数
                    placeholder: "请选择",
                    displayField: fieldKey,//定义显示的字段
                    maxSelectionRenderer: function () {
                        return "";
                    },
                    selectionRenderer: function (data) {
                        var value = data[fieldKey];
                        return value;
                    }
                });
                $(quoteObj).on('selectionchange', function (e, m) {
                    var objValues = this.getValue();
                    if (objValues && objValues.length > 0) {
                        me.parent().parent().find("input[name=value]").val(objValues.join("|#|"))
                    }
                });
            }
        }
    } else if (value == "CONVERT") {
        me.parent().parent().find("select[name=convert]").empty();
        var value = me.parent().parent().find("[name='field']").val();
        var convertStr = $(me.parent().parent().find("[name='field']").find('option[value="' + value + '"]')[0]).attr("convert");
        if (convertStr) {
            var optionStr = "";
            var convertArr = JSON.parse(convertStr);
            for (var i = 0; i < convertArr.length; i++) {
                optionStr += "<option value='" + JSON.stringify(convertArr[i].filter) + "'>" + convertArr[i].change_text + "</option>";
            }
            me.parent().parent().find("select[name=convert]").html(optionStr);
        }
        me.parent().parent().find("select[name=convert]").show();
    } else {
        me.parent().parent().find("input[name=value]").show();
    }
}

function addTableTeam(tableId, settingObj, tableObj, isMain, tableMark) {
    // alert("tableTeamData");
    if (!settingObj) {
        settingObj = {};
    }
    // alert(tableTeamSid+" "+tableId+" "+cur_menuId+" "+tableTeamId);
    // var postData = { tableTeamId: tableTeamSid, module: tableId, type: "TABLE_TEAM_TABLE", menuId: cur_menuId };
    var postData = { tableTeamId: tableTeamSid, module: tableId, type: "TABLE_TEAM_TABLE", menuId: cur_menuId };
    if (isMain) {
        postData["tableTeamMark"] = "主表";
    } else {
        postData["tableTeamMark"] = "副表:" + cur_fb_config_mark;
    }
    $.ajax({
        type: "post",
        url: ctx + "/cloud/userUiConfig/postGet",
        data: postData,
        async: false,
        success: function (json) {
            if (json.result == "Success" || json.result == "SUCCESS") {
                var jsonMap = json.map;
                fieldListObjAll[tableId] = jsonMap.fieldList;
                fieldList = jsonMap.fieldList;
                buttonList = jsonMap.buttonList;
                configId = jsonMap.configId;
                tableSetting = jsonMap.tableSetting;
                if (isMain) {
                    main_field_list = fieldList;
                    main_button_list = buttonList;
                    main_TableId = tableId;
                    initMainTableOther(tableId);
                }
                initTable(tableId, jsonMap, tableObj, isMain, settingObj, tableMark);
            } else {
                tipsMsg(json.resultMsg, "FAIL");
            }
        }
    });

}

function textBZ(text, fieldKey, rowId, isMain, buttonList, data) {
    if (text || text == 0) {
        if (typeof text == "object") {
            text = JSON.stringify(text);
        }
        text = text + "";
        if (text.indexOf("###") != -1) {
            text = text.replace("###", "");
            text = JSON.parse($.trim(text));
            var iconStr = "";
            if (text.icon) {
                iconStr = "<label class='" + text.icon + "'></label>";
            }
            var styleStr = "";
            if (text.background && text.background.toLowerCase() != "#ffffff") {
                styleStr = "style='color:" + text.background + ";'";
            }
            if (text.change_text) {
                return iconStr + '<label key_change="1" rowId="' + rowId + '" key_value="' + text.value + '" ' + styleStr + '>' + text.change_text + "</label>"
            }
        }
    }
    //处理超链接
    if (buttonList && buttonList.length > 0) {
        $.each(buttonList, function (i, obj) {
            if (obj.type == "LINK" && obj.name == fieldKey) {
                if (data.SHOW_BUTTON_IDS && data.SHOW_BUTTON_IDS.length > 0) {
                    for (var mk in data.SHOW_BUTTON_IDS) {
                        if (data.SHOW_BUTTON_IDS[mk] == obj.sid) {
                            text = '<a key_id="' + obj.sid + '"  key_mian="' + (isMain ? "1" : "0") + '" onclick="javascript:clickButton(this);"  type="button" row_id="' + rowId + '"  rowId="' + rowId + '">' + text + '</span>'
                        }
                    }
                }
            }
        });
    }
    if (isMain) {
        if ($("#tableTeamType").val() == "1" || $("#tableTeamType").val() == "2") {
            if (tableTeamlConfigObj && tableTeamlConfigObj.leaderSetting) {
                var leaderSetting = JSON.parse(tableTeamlConfigObj.leaderSetting);
                if (leaderSetting.detail && leaderSetting.detail.click_field_key) {
                    if (fieldKey == leaderSetting.detail.click_field_key) {
                        return '<a href="javascript:;" key_change="1" rowId="' + rowId + '" key_value="' + text + '" onclick="javasript:openFBWindow(this);">' + text + "</a>"
                    }
                }
            }
        }
    }
    if (!text)
        text = "";
    text = tableContextHandler(text);
    return '<label style="display:inline-flex;height:30px;">' + text + '</label>';
}

//设置表格宽度到缓存中
function setTableWidthToCatch(mark, isMain) {
    var colModelList;
    if (isMain) {
        colModelList = main_table_obj.jqGrid('getGridParam', 'colModel');
    } else {
        colModelList = tableObjectList[mark].jqGrid('getGridParam', 'colModel');
    }
    if (colModelList && colModelList.length > 0) {
        var widthData = {};
        for (var i = 0; i < colModelList.length; i++) {
            var wobj = colModelList[i];
            var index = wobj.index;
            var width = wobj.width;
            if (index && width) {
                widthData[index] = width;
            }
        }

        putStorageValue("cur_table_width_data", JSON.stringify(widthData));

    }
}

function downLoadDB(me) {
    me = $(me);
    var isMain = me.attr("isMain");
    var tableId = me.attr("tableId");
    var configId = me.attr("configId");
    var conObj = getDbConfig(me.parent().parent().parent().find(".senior-search"));
    var fieldKeys = [];
    if (!conObj) {
        conObj = [];
    }
    var fieldSearchData = getFieldSearchData();
    if (fieldSearchData && fieldSearchData.length > 0) {
        $.each(fieldSearchData, function (i, fobj) {
            conObj.push(fobj);
        });
    }
    if (curFilterValue && curFilterValue.length > 0) {
        for (var i = 0; i < curFilterValue.length; i++) {
            conObj.push(curFilterValue[i]);
        }
    }
    if (main_field_list && main_field_list.length > 0) {
        $.each(main_field_list, function (i, obj) { fieldKeys.push(obj.columnName); });
    }
    var data = { keyword: $($("input[name=keyword]")[0]).val(), fieldKeys: JSON.stringify(fieldKeys), conObj: JSON.stringify(conObj) };
    var url = ctx + "/cloud/export/table/" + tableId;
    var form = $("<form></form>").attr("action", url).attr("method", "get");

    if (form_pm_obj) {
        for (var pd in form_pm_obj) {
            if (form_pm_obj[pd]) {
                form.append($("<input></input>").attr("type", "hidden").attr("name", pd).attr("value", form_pm_obj[pd]));
                data[pd] = form_pm_obj[pd];
            }
        }
    }
    form.append($("<input></input>").attr("type", "hidden").attr("name", "fieldKeys").attr("value", JSON.stringify(fieldKeys)));
    form.append($("<input></input>").attr("type", "hidden").attr("name", "conObj").attr("value", JSON.stringify(conObj)));
    form.append($("<input></input>").attr("type", "hidden").attr("name", "keyword").attr("value", $($("input[name=keyword]")[0]).val()));
    form.append($("<input></input>").attr("type", "hidden").attr("name", "configId").attr("value", configId));
    form.appendTo('body').submit().remove();

}


var main_table_cur_select_row;
function initTable(tableId, jsonObj, tableDivObj, isMian, settingObj, tableMark) {
    var me = this;
    var rowid;
    var tableObjId = tableMark ? ("table_" + tableMark) : ("table_" + tableId);
    tableDivObj.find(".tableObj").attr("id", tableObjId);
    var fieldList = jsonObj.fieldList;
    var buttonList = jsonObj.buttonList;
    var configId = jsonObj.configId;
    var tableSetting = jsonObj.tableSetting;
    var operatorColWidth = jsonObj.operatorColWidth;
    var tableDivObj = tableDivObj;
    var isMain = isMain;
    tableDivObj.find("div[name=mainTable_gridPager]").attr("id", tableId + (isMian ? "true" : "false") + "_gridPager");
    tableDivObj.find(".set-table-btn").bind("click", function () {
        //获取表格key
        setTableWidthToCatch(tableMark, isMian);
        var urlParams = "menuId=" + cur_menuId + "&tableTeamMark=" + (isMian ? "主表" : ("副表:" + cur_fb_config_mark)) + "&tableTeamId=${tableTeam.id}";
        var url = './setting.html?tableId=' + tableId + '&type=TABLE_TEAM_TABLE&hinedSearch=true&hinedHeight=true&' + urlParams;
        if (!isMian) {
            url += '&hinedFilter=true';
            url += '&hinedFilter=true';
        }
        openWindow(url, function () {
            window.location.reload();
        });
    });
    if (isMian) {
        initFieldSearch(fieldList);
        if (jsonObj.tableSetting && jsonObj.tableSetting.isShowFilter && jsonObj.tableSetting.isShowFilter == 1) {
            $(".search_filter").show();
        }
        var filterList = jsonObj.filterList;
        if (filterList && filterList.length > 0) {
            var filterConfig = jsonObj.filterConfig;
            var filterSettingObj;
            if (filterConfig && filterConfig.setting) {
                filterSettingObj = JSON.parse(filterConfig.setting);
            }
            $(".condition_filter_div").append('<div class="pop_list_item"  onclick="javascript:clickFilterQuery(this);">全部数据</div>');
            for (var i = 0; i < filterList.length; i++) {
                var filter = filterList[i];
                filterConfigObj[filter.sid] = filter;
                if (filterSettingObj && filterSettingObj.length > 0) {
                    $.each(filterSettingObj, function (i, id) {
                        if (id == filter.sid) {
                            $(".condition_filter_div").append('<div class="pop_list_item" key_id="' + filter.sid + '" onclick="javascript:clickFilterQuery(this);">' + filter.name + '</div>');
                        }
                    });
                } else {
                    $(".condition_filter_div").append('<div class="pop_list_item" key_id="' + filter.sid + '" onclick="javascript:clickFilterQuery(this);">' + filter.name + '</div>');
                }
            }
        }
        if (jsonObj.isDownload != null) {
            $(".button_content").append(
                '<span bt_type="download" ><a target="_blank" class="btn btn-xs default-btn-img default-btn" isMain="1" tableId=' + jsonObj.tableId + ' configId=' + configId + ' onclick="javascript:downLoadDB(this);" key="donwLoad"><i class="fa fa fa-download"></i>下载</a></span>'
            );
        }
    }
    var editDelButtonList = [];
    var multflag = false;  //
    if (buttonList != null && buttonList.length > 0) {
        $.each(buttonList, function (i, button) {
            buttonConfigList[button.sid] = button;
            if (button.isShow && button.isShow == "1") {
                if (button.type == "ADD") {
                    if (button.name.indexOf("批量") >= 0) {
                        multflag = true;
                    }
                    var class_val = JsonButton.commonButton.default_btn + " " + JsonButton.commonButton.btn_add;
                    if (isMian) {
                        $(".button_content").append('<button id="add_entry" key_id="' + button.sid + '" bt_type="ADD" key_mian="' + (isMian ? "1" : "0") + '" onclick="javascript:clickButton(this);" class="default-btn-img  ' + class_val + '" type="button" >' + button.name + '</button>');
                    } else {
                        tableDivObj.find(".fb_button_content").append('<button id="add_entry" key_id="' + button.sid + '"   bt_type="' + button.type + '"  key_mian="' + (isMian ? "1" : "0") + '" onclick="javascript:clickButton(this);" class="default-btn-img  ' + class_val + '" type="button" >' + button.name + '</button>');
                    }
                } else {
                    editDelButtonList.push(button);
                }
            }
        });
    }
    var colList = [];
    var showColCount = 0;
    if (multflag) {
        colList.push({
            frozen: true, label: "<input type='checkbox' class='all_select_comp' onclick='javascript:allSelect(this);'>", index: "allselect_compontent", name: "全选2", width: 30, sortable: false, formatter: function (dbValue, x, n) {
                return '<input type="checkbox" key="select_checkbox" rowid="' + x.rowId + '">';
            }
        });
    }
    var handlerWidth = 0;
    $.each(fieldList, function (i, field) {
        var title = field.title;
        if (field.alias && field.alias.length > 0) {
            title = field.alias;
        }
        var colObj = { label: title, index: field.columnName, name: field.columnName };
        if ((!field.isShow && field.isShow == 0) || (field.columnFullName && field.columnFullName.indexOf("ft_table") != -1)) {
            colObj['hidden'] = true;
        } else {
            showColCount++;
        }
        if (field.isFixed && field.isFixed == 1) {
            colObj['frozen'] = true;
        }
        if (field.colWidth && (field.colWidth * 1) > 0) {
            colObj['width'] = (field.colWidth * 1);
        }
        if (field.primaryKey && field.primaryKey == 1) {
            colObj['key'] = true;
        }
        if (field.fieldType == "DATE" || field.fieldType == "DATETIME" || field.fieldType == "TIME") {
            var format = "yyyy-MM-dd";
            if (field.fieldType == "DATETIME") {
                format = "yyyy-MM-dd HH:mm:ss";
            } else if (field.fieldType == "TIME") {
                format = "HH:mm:ss";
            }
            colObj['formatter'] = function (v, x, n) {
                if (v) {
                    var date = new Date(v);
                    return textBZ(date.format(format), field.columnName, x.rowId, isMian, buttonList, n);
                }
                return textBZ(v, field.columnName, x.rowId, isMian, buttonList, n);
            }
        } else {
            if (field.options && field.options.length > 0) {
                colObj['formatter'] = function (dbValue, x, n) {
                    for (var i = 0; i < field.options.length; i++) {
                        if (field.options[i].format == dbValue) {
                            return textBZ(field.options[i].valueName, field.columnName, x.rowId, isMian, buttonList, n);
                        }
                    }
                    return textBZ(dbValue, field.columnName, x.rowId, isMian, buttonList, n);
                }
            } else {
                colObj['formatter'] = function (dbValue, x, n) {
                    return textBZ(dbValue, field.columnName, x.rowId, isMian, buttonList, n);
                }
            }
        }
        colList.push(colObj);
    });
    if (editDelButtonList.length > 0) {
        showColCount++;
        colList.push({
            label: "操作",
            index: "操作",
            name: "操作",
            width: operatorColWidth ? operatorColWidth : 150,
            formatter: function (dbValue, x, n) {
                var buttonStr = '';
                var count = 0;
                $.each(editDelButtonList, function (i, button) {
                    if (n.SHOW_BUTTON_IDS && existString(n.SHOW_BUTTON_IDS, button.sid)) {
                        if (button.type == "EDIT" || button.type == "DELETE") {
                            count++;
                            var class_val = JsonButton.spanButton.default_btn_select;
                            if (button.style) {
                                var mesg = ctx + "/assetsv1/img/list/" + button.style + "_white.png";
                            }
                            //每一行的操作按钮
                            buttonStr += '<span id="add_entry" key_id="' + button.sid + '" rowId="' + x.rowId + '" key_mian="' + (isMian ? "1" : "0") + '" bt_type="' + button.type + '" onclick="javascript:clickButton(this);" class="default-btn ' + class_val + '" type="button"  style="margin: 0px 5px;background:rgba(72, 160, 220, 1) url(' + mesg + ') no-repeat 10px center" >' + button.name + '</span>'
                        }
                    }
                });
                if ((count * 100) > handlerWidth) {
                    handlerWidth = (count * 100);
                }
                return "<div style='display: inline-flex'>" + buttonStr + "</div>";
            }
        });
        showColCount++;
    }
    colList = handlerColWidth(colList, showColCount, isMian);
    var height = jqgridHeight;
    if (!isMian) {
        height = height - 75;
    } else {
        height = height + 13;
    }
    var table_mark_val = tableMark ? tableMark : tableId;
    var tableSetting = {
        url: ctx + '/cloud/table/list/reader/list',
        mtype: "POST",
        styleUI: 'Bootstrap',
        datatype: "json",
        paramsFun: function () {
            var data = {};
            if (settingObj) {
                var pmData = { table: current_table_select_data, form: {}, sys: {} };
                if (!isMian) {
                    if (settingObj.params) {
                        var pdata = btf.button.setParamsValue(settingObj.params, pmData);
                        var conObj = [];
                        if (pdata) {
                            for (var pd in pdata) {
                                if (pdata[pd]) {
                                    conObj.push({ field_key: pd, con: "compare", value: pdata[pd] });
                                    data[pd] = pdata[pd];
                                }
                            }
                        }
                        if (conObj.length > 0) {
                            data['conObj'] = JSON.stringify(conObj);
                        }
                    }
                } else {
                    var default_order_field;
                    var order_field_setting = [];
                    if (fieldList && fieldList.length > 0) {
                        $.each(fieldList, function (i, obj) {
                            if (obj.isOrder) {
                                default_order_field = obj.columnName;
                                if (obj.isOrder == 1) {
                                    default_order = "desc";
                                } else {
                                    default_order = obj.isOrder;
                                }
                                order_field_setting.push({ field: default_order_field, order: default_order });
                            }
                        });
                    }
                    if (order_field_setting && order_field_setting.length > 0) {
                        data['order_field_setting'] = JSON.stringify(order_field_setting);
                    }
                }
            }
            if (form_pm_obj) {
                for (var pd in form_pm_obj) {
                    if (form_pm_obj[pd]) {
                        data[pd] = form_pm_obj[pd];
                    }
                }
            }
            return data;
        },
        scrollrows: true,//行可见,
        postData: { tableId: tableId },
        gridComplete: function () {
            $("#jqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x": "hidden" });
        },
        loadComplete: function (data) {
            if (data.records == 0 && data.page > 1) {
                setTimeout(function () {
                    searchTable();
                }, 100);
            }
            var rows = data.rows;
            if (isMian) {
                tableDataSumObj["main_db"] = rows;
                var s = main_table_obj.jqGrid('getDataIDs');
                if (s != null && s.length > 0) {
                    if (main_table_cur_select_row) {
                        var rowIndex;
                        for (var j = 0; j < s.length; j++) {
                            if (s[j] == main_table_cur_select_row) {
                                rowIndex = j;
                                break;
                            }
                        }
                        if (rowIndex || rowIndex == 0) {
                            main_table_obj.jqGrid('setSelection', s[rowIndex]);
                        } else {
                            main_table_obj.jqGrid('setSelection', s[0]);
                        }
                    } else {
                        main_table_obj.jqGrid('setSelection', s[0]);
                    }
                }
            } else {
                tableDataSumObj[table_mark_val] = rows;
            }
        },
        colModel: colList,
        viewrecords: true,
        height: height,
        rowNum: (jsonObj && jsonObj.tableSetting && jsonObj.tableSetting.pageSize) ? jsonObj.tableSetting.pageSize : 20,
        pager: tableId + (isMian ? "true" : "false") + "_gridPager",
        rownumbers: true,
        autowidth: true,
        shrinkToFit: false
        // <c:if test="${CURMODELSETTINGOBJ!=null && CURMODELSETTINGOBJ.pageLeft!=null && CURMODELSETTINGOBJ.pageLeft=='1'}">
        // ,pagerpos: 'left',
        // 	recordpos: 'center',
        // </c:if>
    };
    tableSetting["onSelectRow"] = function (rowid, status) {
        rowid = rowid;
        if (isMian) {
            main_table_cur_select_row = rowid;
            current_table_select_data = getTableRowDb(rowid, true, "");
            var primaryKey = curLeaderSetting.primaryKey;
            if (fb_window_switch && !openMenuMark) {
                openFBWindowNew(null, primaryKey, form_pm_obj);
            }
        }
    };
    window.mianTableId = tableObjId;
    var gridObj = $("#" + tableObjId).jqGrid(tableSetting).jqGrid('setFrozenColumns');
    if (isMian) {
        main_table_obj = gridObj;
    } else {
        tableObjectList[table_mark_val] = gridObj;
    }
}

function getTableRowDb(rowId, isMain, key) {
    var tableObj;
    if (isMain) {
        key = "main_db";
        tableObj = main_table_obj;
    } else {
        tableObj = tableObjectList[key];
    }
    if (tableObj && rowId && tableDataSumObj[key] && tableDataSumObj[key].length > 0) {
        var rowIndex;
        var s = tableObj.jqGrid('getDataIDs');
        for (var i = 0; i < s.length; i++) {
            if (s[i] == rowId) {
                rowIndex = i + 1;
                break;
            }
        }
        var rowData = {};
        if (rowIndex && rowIndex > 0) {
            rowData = tableDataSumObj[key][rowIndex - 1];
            for (var i in rowData) {
                rowData[i] = getBakValue(rowData[i]);
            }
            return rowData;
        }
    }
    return {};
}


function getBakValue(value) {
    if (value && typeof value == "string") {
        if (value.indexOf("###") != -1) {
            value = value.replace("###", "");
            var tempJson = JSON.parse(value);
            return tempJson.value;
        }
    }
    return value;
}

function allSelect(me) {
    event.stopPropagation();
    me = $(me);
    if (me.attr("mark_val") == "1") {
        $("input[key=select_checkbox]").each(function (i, obj) {
            obj.checked = false;
        });
        me.attr("mark_val", "0");
    } else {
        $("input[key=select_checkbox]").each(function (i, obj) {
            obj.checked = true;
        });
        me.attr("mark_val", "1");
    }
}

function existString(idList, id) {
    if (idList && idList.length > 0) {
        for (var i = 0; i < idList.length; i++) {
            if (idList[i] == id) {
                return true;
            }
        }
    }
}

$(".jqGridPager td").css({ "padding": "0px 3px" });
$("#tab-content").height(jqGridHeight(164));


function handlerColWidth(colList, showColCount, isMian, handlerWidth) {
    var showColCount = 0;
    var isAllSelect = 0;
    var existSumWidth = 0;
    $.each(colList, function (i, obj) {
        obj.height = 10;
        if (!obj.hidden) {
            showColCount++;
            if (obj.width && obj.width > 0) {
                existSumWidth += (obj.width * 1);
            } else {
                existSumWidth += 150;
            }
        }
        if (obj.index == "allselect_compontent") {
            isAllSelect = 1;
        }
    });
    var sumCount = mianWidth;
    if (isAllSelect) {
        sumCount += -30;
        showColCount--;
    }
    var sxWidth = 0;
    if (existSumWidth < sumCount) {
        sxWidth = ((sumCount - existSumWidth) / showColCount);
    }
    $.each(colList, function (i, obj) {
        if (!obj.hidden) {
            var curWidth = 150;
            if (obj.width && obj.width > 0) {
                curWidth = (obj.width) * 1;
            }
            if (obj.index != "allselect_compontent") {
                obj.width = (curWidth + sxWidth);
            }
        }
    });
    return colList;
}


//控制显示隐藏
function showTableTitle() {
    var cur_mark = cur_fb_config_mark;
    var cur_mark = true;
    var firstShowKey;
    $("#myTab5").find("li").each(function (i, objLi) {
        objLi = $(objLi);
        var obj_key = objLi.attr("lable_key");
        var memberObj = fb_config_obj[obj_key];
        if (memberObj.setting && memberObj.setting.params && memberObj.setting.params.length > 0) {
            var isTF = false;
            var isYes = false;
            var data = { table: current_table_select_data, form: {}, sys: {} };
            $.each(memberObj.setting.params, function (i, obj) {
                if (obj.p_name && obj.p_name.indexOf("title_") != -1) {
                    isTF = true;
                    var pname = obj.p_name.replace("title_", "");
                    var pk = pname.split(".")[0];
                    var pv = pname.split(".")[1];
                    if (data[pk] && data[pk][pv] && data[pk][pv] == obj.p_value) {
                        isYes = true;
                    } else {
                        isYes = false;
                    }
                }
            });
            if (isTF) {
                if (isYes) {
                    objLi.show();
                    if (!firstShowKey) {
                        firstShowKey = obj_key
                    }
                } else {
                    if ((obj_key * 1) == cur_mark) {
                        cur_mark = false;
                    }
                    objLi.hide();
                    objLi.removeClass("active");
                    $("#" + obj_key + "_context").removeClass("active");
                }
            } else {
                objLi.show();
                objLi.removeClass("active");
                $("#" + obj_key + "_context").removeClass("active");
                if (!firstShowKey) {
                    firstShowKey = obj_key
                }
            }
        } else {
            objLi.show();
            if (!firstShowKey) {
                firstShowKey = obj_key
            }
        }
    });
    if (!cur_mark) {
        cur_fb_config_mark = firstShowKey;
    }
    $("#myTab5").find("li").removeClass("active");
    $("#myTab5").find("li[lable_key=" + cur_fb_config_mark + "]").addClass("active");
    $($("#myTab5").find("li[lable_key=" + cur_fb_config_mark + "]")[0]).click();
}

function reloadFB() {
    if (current_table_select_data && curLeaderSetting) {
    };
}
var mark_i = 0;
function openWindow(url, bakFun) {
    window.openWindowBanFun = bakFun;
    if (openMenuMark) {
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        createDiv("test" + mark_i, "test", "iframe_src_" + mark_i, url, (windowWidth * 0.8), (windowHeight * 0.95));
        mark_i++;
    } else {
        if (fb_window_switch && (!($("#yb_template").val() == "1"))) {
            //关闭附表窗口
            if (open_window_width && (open_window_width * 1) > 0) {
                hideRightPopGetWidth("fb_btn_panel", open_window_width + "px");
            } else {
                hideRightPopGetWidth("fb_btn_panel", open_window_default_width + "px");
            }
        }
        $("#config_btn_panel").html('<div class="clearfix head-line"><em class="back-btn" onclick="javascript:cloudOpenWindow();"></em></div><iframe width="100%" height="100%" scrolling="no" frameborder="0" src="' + url + '"></iframe>');
        showRightPop("config_btn_panel");
        if (open_window_width && (open_window_width * 1) > 0) {
            showRightPopGetWidth("config_btn_panel", open_window_width + "px");
        } else {
            showRightPopGetWidth("config_btn_panel", open_window_default_width + "px");
        }
        $("#config_btn_panel").show();
        if (url.indexOf("hideWindow") != -1) {
            $("#config_btn_panel").hide();
        }
    }
}

function cloudOpenWindow(isSuccess, isNow) {
    if (isNow) {
        main_table_cur_select_row = "";
    }
    if (openMenuMark) {
        var selectDiv = document.getElementById(selectDivId);
        $(selectDiv).remove();
    } else {
        if (open_window_width && (open_window_width * 1) > 0) {
            hideRightPopGetWidth("config_btn_panel", open_window_width + "px");
        } else {
            hideRightPopGetWidth("config_btn_panel", open_window_default_width + "px");
        }
        if (fb_window_switch && (!($("#yb_template").val() == "1"))) {
            if (open_window_width && (open_window_width * 1) > 0) {
                showRightPopGetWidth("fb_btn_panel", open_window_width + "px");
            } else {
                showRightPopGetWidth("fb_btn_panel", open_window_default_width + "px");
            }
        }
    }
    if (isSuccess) {
        if (window.openWindowBanFun) {
            window.openWindowBanFun();
        }
    }
}


var curFilterValue;
function clickFilterQuery(me) {
    me = $(me);
    var key_id = me.attr("key_id");
    var conlistObj;
    if (key_id && filterConfigObj[key_id]) {
        var filterObj = filterConfigObj[key_id];
        if (filterObj.setting) {
            var fobj = JSON.parse(filterObj.setting);
            var conList = fobj.conList;
            if (conList && conList.length > 0) {
                conlistObj = conList;
            }
        }
    }
    curFilterValue = conlistObj;
    $(".all_reservation").html(me.text());
    search(true)
}


function initFieldSearch(fieldList) {
    var divObj = $(".search_head_div");
    if (fieldList && fieldList.length > 0) {
        var inputStr = '';
        for (var i = 0; i < fieldList.length; i++) {
            var field = fieldList[i];
            if (field.isShowSearch && field.isShowSearch == 1) {
                var title = field.title;
                if (field.alias && field.alias.length > 0) {
                    title = field.alias;
                }
                var isSelect = false;
                if (field.setting) {
                    var setting = JSON.parse(field.setting);
                    if (setting && setting.showSetting && setting.showSetting.length > 0) {
                        var strHtml = '<select db_type="select" class="search_field_comp" name="' + field.columnName + '"><option value="">请选择' + title + "</option>";
                        for (var z = 0; z < setting.showSetting.length; z++) {
                            var ss = setting.showSetting[z];
                            if (ss.change_text) {
                                strHtml += "<option value='" + JSON.stringify(ss.filter) + "'>" + ss.change_text + '</option>';
                            }
                        }
                        strHtml += '</select>';
                        isSelect = true;
                        inputStr += strHtml;
                    } else if (setting && setting.wordbook && setting.wordbook.id && setting.wordbook.field_key) {
                        var strHtml = '<input type="hidden" class="search_field_comp" db_type="input" name="' + field.columnName + '" />';
                        strHtml += '<input type="text" style="width:158px;display:inline-block;margin:0px 10px;height:35px;padding:0px 5px;border-radius:5px;border:1px solid #ccc;" db_type="quote" target_name="' + field.columnName + '" quote=\'' + JSON.stringify(setting.wordbook) + '\' />';
                        isSelect = true;
                        inputStr += strHtml;
                    }
                }
                if (!isSelect) {
                    if (field.fieldType == "DATE" || field.fieldType == "DATETIME" || field.fieldType == "TIME") {
                        var format = "yyyy-MM-dd";
                        inputStr += '<input type="text" class="search_field_comp" db_type="date" format="' + format + '"  name="' + field.columnName + '" placeholder="' + title + '">';
                    } else {
                        inputStr += '<input type="text" class="search_field_comp"  db_type="input" name="' + field.columnName + '" placeholder="' + title + '">';
                    }
                }
            }
        }
        if (inputStr) {
            divObj.prepend(inputStr);
            divObj.find("input[db_type=date]").each(function (i, obj) {
                laydate.render({
                    elem: obj,
                    range: "~",
                    choose: function () {
                        validateObj($("#pe_time"));
                    }
                });
            });

            divObj.find("input[db_type=quote]").each(function (i, obj) {
                var me = $(obj);
                var targetName = me.attr("target_name");
                var quoteStr = me.attr("quote");
                if (quoteStr) {
                    var quote = JSON.parse(quoteStr);
                    var wordbookId = quote.id;
                    var fieldKey = quote.field_key;
                    if (wordbookId && fieldKey) {
                        var magicObj = me.magicSuggest({
                            data: ctx + "/cloud/table/list/reader/wordbook/" + wordbookId,
                            allowFreeEntries: false,
                            autoSelect: false,
                            value: [],
                            valueField: fieldKey,
                            //maxSelection:1,//设置选择个数
                            placeholder: "请选择",
                            displayField: fieldKey,//定义显示的字段
                            maxSelectionRenderer: function () {
                                return "";
                            },
                            selectionRenderer: function (data) {
                                var value = data[fieldKey];
                                return value;
                            }
                        });

                        $(magicObj).on('selectionchange', function (e, m) {
                            var objValues = this.getValue();
                            if (objValues && objValues.length > 0) {
                                var obj = divObj.find("input[name=" + targetName + "]");
                                obj.val(objValues.join("|#|"));
                            }
                        });


                    }
                }

            });
        }
    }
}

function getFieldSearchData() {
    var searchDiv = $('.search_head_div');
    var fieldCompList = searchDiv.find(".search_field_comp");
    var data = [];
    if (fieldCompList && fieldCompList.length > 0) {
        $.each(fieldCompList, function (i, obj) {
            obj = $(obj);
            var fieldName = obj.attr("name");
            var db_type = obj.attr("db_type");
            var value = $.trim(obj.val());
            if (value) {
                if (db_type == "date") {
                    if (value.indexOf("~") != -1 && value.split("~").length == 2) {
                        data.push({
                            field_key: fieldName,
                            con: "IN",
                            end_val: value.split("~")[1],
                            start_val: value.split("~")[0]
                        });
                    }
                } else if (db_type == "select") {
                    data.push({ field_key: fieldName, con: "CONVERT", value: "", convert: value });
                } else {
                    data.push({ field_key: fieldName, con: "compare", value: value, mk: "like" });
                }
            }
        });
    }
    return data;
}


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
                                          +'<span><img class="middle" src="${ctx}/assetsv1/js/searchFilter/img/pencil-selete.png" alt="编辑" title="编辑" data-toggle="modal" data-target="#addLine" onclick="editLine(this)"/></span>'
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
          var editStr='<span><img class="middle" src="${ctx}/assetsv1/js/searchFilter/img/pencil-selete.png" alt="编辑" title="编辑"  data-toggle="modal" data-target="#addConditionModal" onclick="editClassify(this, false)"/></span>';
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
                      '<span class="copyTr pl6"><img class="middle" src="${ctx}/assetsv1/js/searchFilter/img/copy.png" alt="复制"  title="复制" data-toggle="modal" data-target="#addConditionModal" onclick="editClassify(this, true)"/></span>'+
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