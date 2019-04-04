//是这个页面

var params = getUrlParams();
var menuId = params.tableTeamId; //此处menu_id是左侧菜单的triggerId
var dataId = params.data_id; //获取data_id
var menuId_left = params.menuId; //获取当前左侧菜单的menu_id属性
var cur_menuId;
// alert(JSON.stringify(params));
var customer_id; //当前患者id
var tableTeamSid = "";
var currentWuPinList = []; //当前物品列表
$.ajaxSetup({
    contentType: 'application/x-www-form-urlencoded;charset=utf-8',
    complete: function (xhr, status) {
        var sessionStatus = xhr.getResponseHeader('sessionstatus'); // 通过XMLHttpRequest取得响应头，sessionstatus，
        if (sessionStatus == "timeout") {
            location.href = ctx + '/common/logincloud.jsp';
        }
    }
});
setWaterMark("body", [$.cookie("loginName"), "", ""], "rgba(0, 0, 0, 0.1)", 100, 60, -30);
if (menuId) {
    cur_menuId = menuId;
}
var tableDataSumObj = {};
var tableObjectList = {};
var current_table_select_data;
var fb_config_obj = {};
var cur_fb_config_mark;
var buttonConfigList = {};
var tableTeamlConfigObj;
var fb_window_switch = false;
var filterConfigObj = {};
var fieldListObjAll = {}; //
var crmPermissionTableTeam;
var open_window_width;
var open_window_default_width = 900;
if (open_window_width && open_window_width > 0) {
    fbWidth = open_window_width;
} else {
    fbWidth = 900;
}
var currentFB_Label_MARK;

function setCurrentFBLabelMARK(mark) {
    currentFB_Label_MARK = mark;
}

function getCurrentFBLabelMARK() {
    return currentFB_Label_MARK;
}

function search() {
    var config = fb_config_obj[cur_fb_config_mark];
    if (config) {
        var markKey = config.obj_id + "_" + cur_fb_config_mark;
        if (config.obj_type && config.obj_type == "REPORT" && config.obj_id && tableObjectList[markKey]) {
            var fieldKeys = [];
            $.each(fieldListObjAll[config.obj_id], function (i, obj) {
                fieldKeys.push(obj.columnName);
            });
            var data = {
                keyword: $("#" + cur_fb_config_mark + "_context").find("input[name=fb_keyword]").val(),
                fieldKeys: JSON.stringify(fieldKeys)
            };
            tableObjectList[markKey].jqGrid('setGridParam', {
                datatype: 'json',
                postData: data,
                page: 1
            }).trigger("reloadGrid");
        }
    }
}

function getSelectRowObj() {
    var data = [];
    var inputArray = [];
    if (cur_fb_config_mark) {
        inputArray = $("#" + cur_fb_config_mark + "_context").find("input[key=select_checkbox]");
    }
    var config = fb_config_obj[cur_fb_config_mark];
    var markKey = config.obj_id + "_" + cur_fb_config_mark;
    inputArray.each(function (i, obj) {
        if (obj.checked == true) {
            var rowid = $(obj).attr("rowid");
            data.push(getTableRowDb(rowid, markKey));
        }
    });
    return data;
}

function clickButton(me) { //不是发送供应商  添加物品
    var data = {};
    var rowId = $(me).attr("rowId");
    var btType = $(me).attr("bt_type");

    var buttonText = $(me).text();
    /*if(btType=="ADD"&&buttonText=="添加物品"){
        $(".table_pop_window").show();
        return;
    }*/
    data['form'] = current_table_select_data;
    var config = fb_config_obj[cur_fb_config_mark];
    var markKey;
    if ((cur_fb_config_mark || cur_fb_config_mark == 0) && fb_config_obj[cur_fb_config_mark]) {
        if (config.obj_type == "REPORT") {
            if (config.obj_id) {
                markKey = config.obj_id + "_" + cur_fb_config_mark;
                if (rowId && tableObjectList[markKey]) {
                    data['table'] = getTableRowDb(rowId, markKey);
                }
            }
        }
    }
    if (!data['form']) {
        data['form'] = {};
    }
    if (config && config.setting) {
        if (config.setting.params) {
            var pmData = {
                table: current_table_select_data,
                form: {},
                sys: {}
            };
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
    if (!data['form']) {
        data['form'] = {};
    }
    if (btType == "ADD") {
        var selectRowData = getSelectRowObj();
        if (selectRowData && selectRowData.length > 0) {
            data['form']['selectRows'] = JSON.stringify(selectRowData);
        } else {
            if (buttonText && buttonText.indexOf("批量") != -1) {
                tipsMsg("请勾选需要" + buttonText + "的数据", "FAIL");
                return;
            }
        }
    }
    var bakfn = function () {
        //search();
        if (markKey && tableObjectList[markKey]) {
            tableObjectList[markKey].trigger("reloadGrid");
        }
    };
    if (btType && btType == "DELETE") {
        confirmMsg("是否确认" + buttonText, function () {
            btf.button.clickButton(me, buttonConfigList, data, bakfn);
        });
    } else { //弹框
        btf.button.clickButton(me, buttonConfigList, data, bakfn);
    }
}

function selectLabelClick(me, isStatus) {
    var me = $(me);
    if (me.attr("lable_key")) {
        if (window.parent && window.parent.setCurrentFBLabelMARK) {
            var coll = me.attr("lable_key");
            console.log("coll", coll)
            window.parent.setCurrentFBLabelMARK(me.attr("lable_key"));
        }
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

//取消
$(".closeFormInfo").on("click", function () {
    $(".table_pop_window").hide();
});
//确定



$(function () {
    var menu = menuId_left;

    function gvFB(j) {
        if (menu) {
            if (crmPermissionTableTeam) {
                var cpObj = JSON.parse(crmPermissionTableTeam);
                if (cpObj && cpObj.length > 0) {
                    for (var i = 0; i < cpObj.length; i++) {
                        if (cpObj[i] == ("副表:" + j)) {
                            return true;
                        }
                    }
                }
            }
        } else {
            return true;
        }
        //return true;
    }
    var buttonConfigList = {};
    var tableTeamObj;
    // alert( menuId_left);
    $.ajax({
        type: "GET",
        url: ctx + "/cloud/menu_v1/tableTeam/" + menuId,
        data: {
            "menuId": menuId_left
            // "menuId": "1036182398888316928"
        },
        async: false,
        dataType: "json",
        success: function (data) {
            if (data.result == "SUCCESS") {
                tableTeamObj = data.map.tableTeam;
                crmPermissionTableTeam = data.map.crmPermissionTableTeam;
                // alert(JSON.stringify(crmPermissionTableTeam))
                console.log(" crmPermissionTableTeam", typeof (crmPermissionTableTeam))
                console.log("tableTeamObj" + JSON.stringify(tableTeamObj));
                if (tableTeamObj && tableTeamObj.leaderId && tableTeamObj.leaderSetting) {
                    var leaderSetting = JSON.parse(tableTeamObj.leaderSetting);
                    var primaryKey = leaderSetting["primaryKey"];
                    if (!primaryKey) {
                        tipsMsg("主表未设置id主键", "FAIL");
                        return;
                    }
                    if (!dataId) {
                        tipsMsg("主键ID不能为空", "FAIL");
                        return;
                    }
                    var tableLeaderId = tableTeamObj.leaderId;
                    tableTeamSid = tableTeamObj.sid;
                    $("#tableTeamType").val(tableTeamObj.type);
                    params["tableId"] = tableTeamObj.leaderId;
                    params["page"] = 1;
                    params["rows"] = 10;
                    params["conObj"] = "[{'field_key':'" + primaryKey + "','con':'EQ','value':'" + dataId + "'}]";
                    // console.log(params);
                    //获取主表选中记录信息
                    var getMainDataError = false;
                    $.ajax({
                        url: ctx + "/cloud/table/list/reader/list",
                        async: false,
                        type: "POST",
                        data: params,
                        success: function (result) {
                            console.log("获取主表选中记录信息：" + JSON.stringify(result));
                            customer_id = result.rows[0].customer_id;
                            if (result) {
                                if (result.total == 0) {
                                    getMainDataError = true;
                                    //alert("未获取到记录");
                                } else if (result.total > 1) {
                                    getMainDataError = true;
                                    //alert("根据id主键获取到多条记录");
                                } else {
                                    current_table_select_data = result.rows[0];
                                    for (var i in current_table_select_data) {
                                        current_table_select_data[i] = getBakValue(
                                            current_table_select_data[i]);
                                    }
                                }
                            }
                        }
                    });
                    //				if(getMainDataError){
                    //					return;
                    //				}

                    function getULLiWidth() {
                        var width = 0;
                        $("#myTab5").find("li").each(function (i, obj) {
                            obj = $(obj);
                            width += obj.width();
                        });
                        return width;
                    }
                    if (tableTeamObj.members) {
                        var members = JSON.parse(tableTeamObj.members);
                        console.log("members", members);
                        if (members && members.length > 0) {
                            var ulWidth = $("#myTab5").width();
                            $("#myTab5").append(
                                '<li class="dropdown"><a data-toggle="dropdown" class="dropdown-toggle" href="#">更多<b class="caret"></b></a><ul class="dropdown-menu dropdown-info"></ul></li>'
                            );
                            var currentKey;
                            if (window.parent && window.parent.getCurrentFBLabelMARK) {
                                currentKey = window.parent.getCurrentFBLabelMARK();
                            }
                            var current_mark_val = 0;
                            if (currentKey) {
                                for (var i = 0; i < members.length; i++) {
                                    if (!gvFB(i)) {
                                        continue;
                                    }
                                    if (i == (currentKey * 1)) {
                                        current_mark_val = currentKey;
                                    }
                                }
                            }

                            for (var i = 0; i < members.length; i++) {
                                if (!gvFB(i)) {
                                    continue;
                                }
                                var memberObj = members[i];
                                if (memberObj.obj_type) {
                                    var labelKey = i;
                                    var context_id = i + "_context";
                                    fb_config_obj[i] = memberObj;
                                    var liObj = $('<li class="tab-green" onclick="javascript:selectLabelClick(this);"  lable_key="' + labelKey + '"><a data-toggle="tab" href="#' + context_id + '" aria-expanded="false">' + memberObj.name + '</a></li>');
                                    //$("#myTab5").prepend(liObj);
                                    $("#myTab5").find(".dropdown").before(liObj);
                                    if (getULLiWidth() >= ulWidth) {
                                        $("#myTab5").find(".dropdown-info").append(liObj);
                                    }
                                    $("#tab-content").prepend('<div id="' + context_id + '" class="tab-pane" style="width:100%;height:100%;">' + '</div>');
                                    if (i == 0) {
                                        cur_fb_config_mark = i;
                                    }
                                    if (memberObj.obj_type == "REPORT") {
                                        if (memberObj.obj_id && memberObj.setting) {
                                            $("#" + context_id).html('' +
                                                '<div class="input-wrap"style="width: 200px;height:32px;">' +
                                                '<input class="input" style="width: 200px;height: 32px;" type="text" name="fb_keyword" value="">' +
                                                '<span class="search-input" onclick="javascript:search();" style="height: 32px;"></span>' +
                                                '</div>' +
                                                '<div class="btn-wrap fb_button_content"></div>' +
                                                '<div style="position: relative;">' +
                                                '<span class="set-table-btn" style="position: absolute;"></span>' +
                                                '<table class="tableObj">' + '</table></div>' +
                                                '<div name="mainTable_gridPager" class="jqGridPager"></div>'
                                            );
                                        } else {
                                            $("#" + context_id).html("报表配置为空");
                                        }
                                    }
                                }
                            }


                        }
                    }
                }
            }
        }
    });
    // var tableTeamObj = JSON.parse($("#tableTeamStr").html());

    //控制附表显示隐藏
    showTableTitle();
    //控制更多按钮隐藏
    if ($(".dropdown-info").find("li").length == 0) {
        $(".dropdown-info").parents(".dropdown").hide();
    }
});

function addTable(tableId, settingObj, tableObj, tableMark) {
    if (!settingObj) {
        settingObj = {};
    }
    var postData = {
        // tableTeamId: "${tableTeam.id}",
        tableTeamId: tableTeamSid,
        module: tableId,
        type: "TABLE_TEAM_TABLE",
        tableTeamSetting: JSON.stringify(settingObj),
        menuId: cur_menuId
    };
    postData["tableTeamMark"] = "副表:" + cur_fb_config_mark;
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
                initTable(tableId, jsonMap, tableObj, settingObj, tableMark);
            } else {
                tipsMsg(json.resultMsg, "FAIL");
            }
        }
    });
}

function textBZ(text, fieldKey, rowId, buttonList, data) {
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
                return iconStr + '<label key_change="1" rowId="' + rowId + '" key_value="' + text.value + '" ' +
                    styleStr + '>' + text.change_text + "</label>"
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
                            text = '<a key_id="' + obj.sid +
                                '" onclick="javascript:clickButton(this);"  style="width:100%;text-align: left;" type="button" row_id="' +
                                rowId + '"  rowId="' + rowId + '">' + text + '</a>'
                        }
                    }
                }
            }
        });
    }
    if (!text)
        text = "";
    text = tableContextHandler(text);
    return '<label style="display:inline-flex;height:25px;width:100%;text-align: left;">' + text + '</label>';
}

function tableContextHandler(text) {
    if (!text)
        text = "";
    if (text.indexOf("http://") != -1) {
        try {
            var fileList = JSON.parse(text);
            if (fileList && fileList.length > 0) {
                return tableContextHandlerFile(fileList);
            } else if (fileList.value && fileList.value.length > 0) {
                var urlList = JSON.parse(fileList.value);
                return tableContextHandlerFile(urlList);
            }
        } catch (e) {}
    }
    return text;
}

function tableContextHandlerFile(fileList) {
    var text = '';
    $.each(fileList, function (i, obj) {
        text += '<a tar href="' + obj.url + '" target="_blank" >' + obj.name + '</a>';
    });
    return text;
}

//设置表格宽度到缓存中
function setTableWidthToCatch(mark) {
    var colModelList = tableObjectList[mark].jqGrid('getGridParam', 'colModel');
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


var main_table_cur_select_row;

function initTable(tableId, jsonObj, tableDivObj, settingObj, tableMark) { //这个表格
    console.log("settingObj:" + JSON.stringify(settingObj));
    console.log("jsonObj:" + JSON.stringify(jsonObj));
    var me = this;
    var rowid;
    var tableObjId = tableMark ? ("table_" + tableMark) : ("table_" + tableId);
    tableDivObj.find(".tableObj").attr("id", tableObjId);
    var fieldList = jsonObj.fieldList;
    var buttonList = jsonObj.buttonList;
    var configId = jsonObj.configId;
    var operatorColWidth = jsonObj.operatorColWidth;
    var tableSetting = jsonObj.tableSetting;
    var tableDivObj = tableDivObj;
    tableDivObj.find("div[name=mainTable_gridPager]").attr("id", tableId + "false_gridPager");
    tableDivObj.find(".set-table-btn").bind("click", function () {
        //获取表格key
        setTableWidthToCatch(tableMark);
        // var urlParams = "menuId=" + cur_menuId + "&tableTeamMark=副表:" + cur_fb_config_mark +
        //     "&tableTeamId=${tableTeam.id}";
        // var url = '${ctx}/new/menu/setting.jsp?tableId=' + tableId +
        //     '&type=TABLE_TEAM_TABLE&hinedSearch=true&hinedHeight=true&' + urlParams;
        var urlParams = "menuId=" + cur_menuId + "&tableTeamMark=副表:" + cur_fb_config_mark +
            "&tableTeamId=" + tableTeamSid;
        var url = './setting.html?tableId=' + tableId +
            '&type=TABLE_TEAM_TABLE&hinedSearch=true&hinedHeight=true&' + urlParams;
        url += '&hinedFilter=true';
        openWindow(url, function () {
            window.location.reload();
        });
    });

    var editDelButtonList = [];
    var multflag = false;
    if (buttonList != null && buttonList.length > 0) {
        $.each(buttonList, function (i, button) {
            buttonConfigList[button.sid] = button;
            if (button.isShow && button.isShow == "1") {
                if (button.type == "ADD") {
                    if (button.name.indexOf("批量") >= 0) {
                        multflag = true;
                    }
                    // alert("aaa")
                    var class_val = JsonButton.commonButton.default_btn + " " + JsonButton.commonButton.btn_add;
                    tableDivObj.find(".fb_button_content").append('<button id="add_entry" key_id="' +
                        button.sid + '"  bt_type="' + button.type +
                        '"  onclick="javascript:clickButton(this);" class="default-btn-img  ' +
                        class_val + '" type="button" >' + button.name + '</button>');
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
            label: "<input type='checkbox' class='all_select_comp' onclick='javascript:allSelect(this);'>",
            index: "allselect_compontent",
            name: "全选2",
            width: 30,
            sortable: false,
            formatter: function (dbValue, x, n) {
                return '<input type="checkbox" key="select_checkbox" rowid="' + x.rowId + '">';
            }
        });
    }

    $.each(fieldList, function (i, field) {
        var title = field.title;
        if (field.alias && field.alias.length > 0) {
            title = field.alias;
        }
        var colObj = {
            label: title,
            index: field.columnName,
            name: field.columnName
        };
        if (!field.isShow && field.isShow == 0) {
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
                    return textBZ(date.format(format), field.columnName, x.rowId, buttonList, n);
                }
                return textBZ(v, field.columnName, x.rowId, buttonList, n);
            }
        } else {
            if (field.options && field.options.length > 0) {
                colObj['formatter'] = function (dbValue, x, n) {
                    for (var i = 0; i < field.options.length; i++) {
                        if (field.options[i].format == dbValue) {
                            return textBZ(field.options[i].valueName, field.columnName, x.rowId,
                                buttonList, n);
                        }
                    }
                    return textBZ(dbValue, field.columnName, x.rowId, buttonList, n);
                }
            } else {
                colObj['formatter'] = function (dbValue, x, n) {
                    return textBZ(dbValue, field.columnName, x.rowId, buttonList, n);
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
            width: operatorColWidth,
            formatter: function (dbValue, x, n) {
                var buttonStr = '';
                // alert("bbb")
                $.each(editDelButtonList, function (i, button) {
                    if (n.SHOW_BUTTON_IDS && existString(n.SHOW_BUTTON_IDS, button.sid)) {
                        if (button.type == "EDIT" || button.type == "DELETE") {
                            var class_val = JsonButton.spanButton.default_btn_select;
                            if (button.style) {
                                var mesg = ctx + "/assetsv1/img/list/" + button.style +
                                    "_white.png";
                            }
                            buttonStr += '<span id="add_entry" key_id="' + button.sid +
                                '" rowId="' + x.rowId + '" bt_type="' + button.type +
                                '" onclick="javascript:clickButton(this);" class="default-btn ' +
                                class_val +
                                '" type="button"  style="margin: 0px 5px;background:rgba(72, 160, 220, 1) url(' +
                                mesg + ') no-repeat 10px center" >' + button.name + '</span>'
                        }
                    }
                });
                return buttonStr;
            }
        });
        showColCount++;
    }

    colList = handlerColWidth(colList, showColCount);
    var height = jqgridHeight + 10;
    //window.innerHeight-75;
    var table_mark_val = tableMark ? tableMark : tableId;
    var tableSetting = {
        url: ctx + '/cloud/table/list/reader/list',
        mtype: "POST",
        styleUI: 'Bootstrap',
        datatype: "json",
        paramsFun: function () {
            var data = {};
            if (settingObj) {
                var pmData = {
                    table: current_table_select_data,
                    form: {},
                    sys: {}
                };
                if (settingObj.params) {
                    var pdata = btf.button.setParamsValue(settingObj.params, pmData);
                    var conObj = [];
                    if (pdata) {
                        for (var pd in pdata) {
                            if (pdata[pd]) {
                                conObj.push({
                                    field_key: pd,
                                    con: "compare",
                                    value: pdata[pd]
                                });
                                data[pd] = pdata[pd];
                            }
                        }
                    }
                    if (conObj.length > 0) {
                        data['conObj'] = JSON.stringify(conObj);
                    }
                }
            }
            return data;
        },
        scrollrows: true, //行可见,
        postData: {
            tableId: tableId
        },
        gridComplete: function () {
            $("#jqGrid").closest(".ui-jqgrid-bdiv").css({
                "overflow-x": "hidden"
            });
        },
        loadComplete: function (data) {
            var rows = data.rows;
            currentWuPinList = rows;
            console.log("查看这里的数据：" + JSON.stringify(rows)); //物品列表
            tableDataSumObj[table_mark_val] = rows;
        },
        colModel: colList,
        viewrecords: true,
        height: height,
        rowNum: (jsonObj && jsonObj.tableSetting && jsonObj.tableSetting.pageSize) ? jsonObj.tableSetting.pageSize : 20,
        pager: tableId + "false_gridPager",
        rownumbers: true,
        autowidth: true,
        shrinkToFit: false
    };
    tableSetting["onSelectRow"] = function (rowid, status) {
        rowid = rowid;
    };
    var gridObj = $("#" + tableObjId).jqGrid(tableSetting).jqGrid('setFrozenColumns');
    tableObjectList[table_mark_val] = gridObj;
}

function getTableRowDb(rowId, key) {
    var tableObj = tableObjectList[key];
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

$(".jqGridPager td").css({
    "padding": "0px 3px"
});
$("#tab-content").height(window.innerHeight - 75);


function handlerColWidth(colList, showColCount) {
    var showColCount = 0;
    var isAllSelect = 0;
    $.each(colList, function (i, obj) {
        if (!obj.hidden) {
            showColCount++;
        }
        if (obj.index == "allselect_compontent") {
            isAllSelect = 1;
        }
    });
    var sumCount = fbWidth;
    if (isAllSelect) {
        sumCount += -30;
        showColCount--;
    }
    if ((showColCount * 150) >= (sumCount - 60)) {
        return colList;
    } else {
        var width = (sumCount - 60) / showColCount;
        $.each(colList, function (i, obj) {
            if (obj.index != "allselect_compontent" && !(obj.width && obj.width > 0)) {
                obj.width = width;
            }
        });
        return colList;
    }
}


//控制显示隐藏
function showTableTitle() {
    if (window.parent && window.parent.getCurrentFBLabelMARK) {
        cur_fb_config_mark = window.parent.getCurrentFBLabelMARK();
    }
    var cur_mark = cur_fb_config_mark;
    var cur_mark = true;
    var firstShowKey;
    $("#myTab5").find("li").each(function (i, objLi) {
        objLi = $(objLi);
        var obj_key = objLi.attr("lable_key");
        var memberObj = fb_config_obj[obj_key];
        if (memberObj && memberObj.setting && memberObj.setting.params && memberObj.setting.params.length > 0) {
            var isTF = false;
            var isYes = false;
            var data = {
                table: current_table_select_data,
                form: {},
                sys: {}
            };
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
    var labelObj = $("#myTab5").find('li[lable_key="' + cur_fb_config_mark + '"]');
    if (labelObj.length > 0 && labelObj.is(":visible")) {
        $(labelObj[0]).addClass("active").click();
    } else {
        $($("#myTab5").find("li")[0]).addClass("active").click();
    }
    //$("#myTab5").find("li[lable_key="+cur_fb_config_mark+"]").addClass("active");
    //$($("#myTab5").find("li[lable_key="+cur_fb_config_mark+"]")[0]).click();
}

function reloadFB() {
    var curFbMark = cur_fb_config_mark;
    var config = fb_config_obj[curFbMark];
    if (config.obj_type) {
        var setting = config.setting;
        var tableMark = config.obj_id + "_" + curFbMark;
        $("#" + curFbMark + "_context").show().siblings(".tab-pane").hide();
        if (config.obj_type == "REPORT") {
            // alert(config.obj_id)
            if (config.obj_id) {
                if (tableObjectList[tableMark]) {
                    tableObjectList[tableMark].trigger("reloadGrid");
                } else {
                    addTable(config.obj_id, config.setting, $("#" + curFbMark + "_context"), tableMark);
                }
            }
        } else if (config.obj_type == "FORM") {
            if (config.obj_id) {
                var pmData = {
                    table: current_table_select_data,
                    form: {},
                    sys: {}
                };
                var pdata = btf.button.setParamsValue(setting.params, pmData);
                putStorageValue("to_params_value", JSON.stringify(pdata));
                // var url = ctx + '/new/menu/form.jsp?formId=' + config.obj_id;
                var url = "./form.html?formId=" + config.obj_id;
                $("#" + curFbMark + "_context").html('<iframe width="100%" scrolling="no" frameborder="0"  src="' +
                    url + '" height="100%"></iframe>');
            }
        } else if (config.obj_type == "PAGE_LAYOUT") {
            if (config.obj_id) {
                var pmData = {
                    table: current_table_select_data,
                    form: {},
                    sys: {}
                };
                var pdata = btf.button.setParamsValue(setting.params, pmData);
                var pmStr = (btf.getParamsStr(pdata));
                console.log("config", config);
                console.log("pmStr", pmStr);
                console.log("pdata", pdata);
                // pageLayoutData(menuId,triggerId,triggerName); 
                //var url = ctx + '/cloud/menu/pageLayout/' + config.obj_id + "?" + pmStr;
                // url = "/crmweb/cloud/menu/pageLayout/1021683609263673344?&customer_id=411094",
                // srcUrl = './cloud/menu/pageLayout.html?id=' + tableId + '&title=' + triggerName + '&menuId=' + menuId + '&name=tableList';
                // alert(1);
                // var url = './pageLayout.html?id=' + config.obj_id + '&customer_id=' + customer_id;
                var url = './pageLayout.html?pageLayoutId=' + config.obj_id + pmStr;
                $("#" + curFbMark + "_context").html('<iframe width="100%" scrolling="no" frameborder="0"  src="' +
                    url + '" height="100%"></iframe>');

            }
        } else if (config.obj_type == "LINK_ADDRESS") {
            var pmData = {
                table: current_table_select_data,
                form: {},
                sys: {}
            };
            var pdata = btf.button.setParamsValue(setting.params, pmData);
            var url = config.link_address;
            if (url.indexOf("?") != -1) {
                url += "&params=" + btf.getParamsStr(pdata);
            } else {
                url += "?params=" + btf.getParamsStr(pdata);
            }
            $("#" + curFbMark + "_context").html('<iframe width="100%" id="' + curFbMark +
                '_iframe"   frameborder="0"  src="' + url + '" height="100%"></iframe>');
        }
    }
}


var isOpenWidow = false;

function openWindow(url, bakFun) {
    // alert(123);
    isOpenWidow = true;
    window.openWindowBanFun = bakFun;
    $("#config_btn_panel").html(
        '<div class="clearfix head-line"><em class="back-btn" onclick="javascript:cloudOpenWindow();"></em></div><iframe width="100%" height="100%" scrolling="no" frameborder="0" src="' +
        url + '"></iframe>');
    showRightPop("config_btn_panel");
    if (open_window_width && (open_window_width * 1) > 0) {
        showRightPopGetWidth("config_btn_panel", (open_window_width - 10) + "px");
    } else { //进到这里来了
        if (open_window_default_width < 1100) {
            open_window_default_width = 1100
        }
        if (open_window_default_width > $(window).width()) {
            open_window_default_width = $(window).width();
        }
        showRightPopGetWidth("config_btn_panel", (open_window_default_width - 10) + "px");
    }
}

function closeFBWindow(isOk, isNew) {
    window.parent.closeFBWindow(isOk, isNew);
}

function cloudOpenWindow(isSuccess) {
    if (isOpenWidow) {
        isOpenWidow = false;
        if (open_window_width && (open_window_width * 1) > 0) {
            hideRightPopGetWidth("config_btn_panel", open_window_width + "px");
        } else {
            hideRightPopGetWidth("config_btn_panel", open_window_default_width + "px");
        }
        if (isSuccess) {
            if (window.openWindowBanFun) {
                window.openWindowBanFun();
            }
        }
    } else {
        closeFBWindow(isSuccess);
    }
}

function getUrlParams() {
    var href_url = window.location.href;
    var data = {};
    if (href_url && href_url.split("?").length == 2) {
        pmStr = $.trim(href_url.split("?")[1]);
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
/**
 * 在附表中设置的当前附表标志字段
 */
//自定义接口
function pageLayoutData(menuId, tableId, triggerName) {
    $(".index-content").html("");
    srcUrl = './pageLayout.html?pageLayoutId=' + tableId + '&title=' + triggerName + '&menuId=' + menuId + '&name=tableList';
    $(".index-content").append('<iframe id="f_' + tableId + '" name="content_iframe" class="content_iframe_s" src="' + srcUrl + '" width="100%" height="100%" frameborder="0"></iframe>');
    // hideLoadingContent();
}
var btf = {
    button: {
        /**
         *
         * @param me 按钮对象
         * @param bak 按钮操作后的回调函数
         * @param buttonListObj 为按钮集合
         * @param dbData 数据对象 {table:{},form:{},sys:{}}  row 一般编辑按钮所在的 哪行数据 ，form 打开当前报表所传入的参数,sys 系统变量
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
                        //FFORM等于REPORT
                        if ("FORM" == trigger_type) {
                            me.openForm(trigger_id, params, bak, display);
                        } else if ("TABLE_LIST" == trigger_type || "REPORT" == trigger_type) {
                            me.openTableList(trigger_id, params, display, bak, display);
                        } else if ("SQLSAVE" == trigger_type) {
                            me.openSqlSave(trigger_id, params, bak, display);
                        } else if ("TABLE_TEAM" == trigger_type) {
                            me.openTableTeam(trigger_id, params, bak, display);
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
                // window.open(ctx + '/new/menu/form.jsp?formId=' + trigger_id, '_blank');
            } else {
                openWindow('./form.html?formId=' + trigger_id, bak);
                // openWindow(ctx + '/new/menu/form.jsp?formId=' + trigger_id, bak);
            }
        },
        openTableList: function (trigger_id, params, bak, display) {
            var pmStr = (btf.getParamsStr(params));
            if (display && display == "skipPage") {
                // window.open(ctx + '/cloud/menu/tablelist/' + trigger_id + '?' + pmStr, '_blank');
                window.open('./tableList.html?id=' + trigger_id + '&' + pmStr, '_blank');
            } else {
                //$(".table_pop_window").show();
                //这里添加弹框
                // openWindow(ctx + '/cloud/menu/tablelist/' + trigger_id + '?mark_child=1&' + pmStr, bak);
                openWindow('./tableList.html?id=' + trigger_id + '&mark_child=1&' + pmStr, bak);
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
                window.open('./tableTeamDetail.html?tableTeamId=' + trigger_id + "?" + pmStr, "_blank");
                // window.open(ctx + '/cloud/menu/tableTeam/detail/' + trigger_id + '?' + pmStr, '_blank');
            } else {
                openWindow('./tableTeamDetail.html?tableTeamId=' + trigger_id + '?' + pmStr, bak);
                // openWindow(ctx + '/cloud/menu/tableTeam/detail/' + trigger_id + '?' + pmStr, bak);
            }
        },
        openPageLayout: function (trigger_id, params, bak, display) {
            var pmStr = (btf.getParamsStr(params));
            if (display && display == "skipPage") {
                window.open('./pageLayout.html?pageLayoutId=' + trigger_id + pmStr, '_blank');
                // window.open(ctx + '/cloud/menu/pageLayout/' + trigger_id + '?' + pmStr, '_blank');
            } else {
                // openWindow(ctx + '/cloud/menu/pageLayout/' + trigger_id + '?' + pmStr, bak);
                openWindow('./pageLayout.html?pageLayoutId=' + trigger_id + pmStr, bak);
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
    form: {},
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
    }
};