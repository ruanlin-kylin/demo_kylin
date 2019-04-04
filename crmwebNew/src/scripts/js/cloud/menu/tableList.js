var tableId = "";
var idKey; //列表层级关系字段
var pIdKey;
var cur_menuId;
var form_db = {};
var form_pm = {};
var sys_db = {};
var windowWidht = $(window).width;
var mBiLi = 12;
var fBiLi = "";
var fBili = "";
var isDesc = "";
var preConObj = sessionStorage.getItem("preConObj"); //先决过滤条件
var preSqlExpression = sessionStorage.getItem("preSqlExpression"); //先决过滤条件表达式
sessionStorage.removeItem("preConObj"); //清理缓存
sessionStorage.removeItem("preSqlExpression"); //清理缓存
/**
 * 全局变量
 **/
var fieldList, buttonList, tableSetting, configId;
var fieldTypeList;
var conditionList = {};
var buttonConfigList = {};
var multflag = false; //是否显示多选(批量操作)
var colList = []; //列表字段显示信息
var editDelButtonList = [];
var clickTimes = 0; //记录行点击次数，区分单击双击
/* 
/**
 * 列表全局变量
 **/
var gridObj;
var current_db_rows;
var current_select_data;
/**
 * 表格组的相关信息
 */
var tableTeam;
var tableTeamMembers;
var tableTeamId; //表格组id
var tableTeamType; //表格组类型 0一般模式  1详情模式 	2状态模式(暂时没使用)
var leaderSetting = {}; //表格组设置信息
var fb_window_switch = false; //附表弹窗是否已经打开
var tableTeamId = ""; //表格组id
var tableTeamSid = "";
var tableTeamName = ""; //表格组名称
var openMenuMark;
var open_window_width;
var open_window_default_width = 900;
var currentHref = window.location.href; //获取跳转链接
tableId = urlStr(currentHref, "id"); //获取菜单对象sid,也就是左侧菜单的menu_id属性
var tableName = urlStr(currentHref, "name"); //
var titlePage = urlStr(currentHref, "title"); //
if (localStorage.getItem("form_db")) {
    form_db = localStorage.getItem("form_db");
    form_db = JSON.parse(form_db);
}
if (localStorage.getItem("form_pm")) {
    form_pm = localStorage.getItem("form_pm");
    form_pm = JSON.parse(form_pm);
}
if (form_pm) {
    form_pm_obj = form_pm
}
var urlData = getUrlParams();
var urlData = {
    title_page: titlePage
};
var currentHref = window.location.href;
tableId = urlStr(currentHref, "id"); //获取菜单对象sid,也就是左侧菜单的menu_id属性;
var tableName = urlStr(currentHref, "name"); //
var titlePage = urlStr(currentHref, "title"); //
var urlData = {
    title_page: titlePage
};
var currentHref = window.location.href;
tableId = urlStr(currentHref, "id"); //获取菜单对象sid,也就是左侧菜单的menu_id属性
var tableName = urlStr(currentHref, "name"); //
var titlePage = urlStr(currentHref, "title"); //
var tabId = "";
var menuId = urlStr(currentHref, "menuId"); // 菜单triggerId-tableTeamId
if (menuId) {
    cur_menuId = menuId;
}
tableListDataInfo(tableId, menuId);
judgeTableTeam();
(function () {
    var urlData = getUrlParams();

    if (urlData) {
        for (ud in urlData) {
            console.log("form_db:" + form_db);
            if (!form_db[ud]) {
                form_db[ud] = urlData[ud];
            }
            if (!form_pm_obj[ud]) {
                form_pm_obj[ud] = urlData[ud];
            }
        }
    }
})();

var open_window_width;
var open_window_default_width = 900;
if (form_db.open_window_width && (form_db.open_window_width * 1) > 0) {
    open_window_width = form_db.open_window_width * 1;
} else if (form_pm_obj.open_window_width && (form_pm_obj.open_window_width * 1) > 0) {
    open_window_width = form_pm_obj.open_window_width * 1;
}


$(function () {
    if (window.location.href.indexOf("mark_child=1") != -1) {
        open_window_width = open_window_width - 100;
        open_window_default_width = open_window_default_width - 100;
    }

    setWaterMark("body", [$.cookie("loginName"), "", ""], "rgba(0, 0, 0, 0.1)", 100, 60, -30);

    $(".float_window_pop").on("click", ".conditin_classification", function (e) {
        var evt = e || window.event;
        evt.stopPropagation(); //阻止自身冒泡事件
        $(".float_pop_list").css({
            "transform": "translate(-10px,0px)",
            "transition-duration": ".5s"
        });
    });

    $(".float_pop_list").on("click", ".pop_list_item", function () {
        $(".float_pop_list .pop_list_item").css({
            "background": "#48a0dc",
            "color": "#ffffff"
        });
        $(this).css({
            "background": "#f6ff8c",
            "color": "#000"
        });
        e.stopPropagation();
        e.preventDefault();
        return false;
    });
    $('html').on("click", function (e) {
        if ($(e.srcElement || e.target).closest('.float_pop_list').length != 0) {
            $(".float_pop_list").css({
                "transform": "translate(-110px,0px)",
                "transition-duration": ".5s"
            });
        }
    })
})

/**
 * 列表信息接口
 * @param {}
 */
function tableListDataInfo(id, tId) {
    var url = ctx + "/cloud/menu_v1/tablelist/" + id;
    if (tableName && tableName == "tableTeam") {
        url = ctx + "/cloud/menu_v1/tableTeam/" + tId;
    }
    $.ajax({
        type: "GET",
        url: url, //
        async: true,
        dataType: "json",
        success: function (data) {
            console.log("列表信息接口:" + JSON.stringify(data));
            if (data.result == "SUCCESS") {
                if (data.map) {

                    sys_db = data.map.sys_db;
                    if (data.map.tableObj) {
                        fieldList = data.map.tableObj.fieldList;
                        buttonList = data.map.tableObj.buttonList;
                        colList = initColList(data.map.tableObj);
                        var settingObj = JSON.parse(data.map.tableObj.setting);
                        if (settingObj) {
                            idKey = settingObj.primaryKey;
                            pIdKey = settingObj.levelKey;
                        }
                    }
                    if (data.map.tableTeam) {
                        var tableTeam = data.map.tableTeam;
                        tableTeamMembers = JSON.parse(tableTeam.members);
                        tableTeamType = tableTeam.type;
                        console.log("tableTeamType", tableTeamType);
                        if (tableTeamType == "3") { //页签
                            var url = "./cloud/menu/tableTeamTab.html?id=" + cur_menuId + "&title_page=" + tableTeam.name + "&menuId=" + tableId;
                            $(".index-content").html("");
                            var iFrameItem = parent.document.getElementsByTagName("iframe");
                            $(iFrameItem[0]).attr("src", url);
                            $(".index-content").append('<iframe id="f_' + tableId + '" name="content_iframe" class="content_iframe_s" src="' + url + '" width="100%" height="100%" frameborder="0"></iframe>');
                            return;
                        }
                        leaderSetting = JSON.parse(tableTeam.leaderSetting);

                        mBiLi = data.map.mBiLi;
                        fBiLi = data.map.fBiLi;
                        sys_db = data.map.sys_db;
                        isDesc = data.map.isDesc;
                        tableTeamId = data.map.tableTeam.leaderId;
                        tableTeamSid = data.map.tableTeam.sid;

                        $("#tableTeamStr").html(data.map.tableTeamStr);

                        if (tableTeam == null || (tableTeamType != null && tableTeamType == '1')) {
                            var collg12 = "col-lg-12 col-sm-12 col-xs-12";
                            $("#tab-main").addClass(collg12);
                        } else {
                            var collgMBiLi = "col-lg-" + mBiLi + " col-sm-" + mBiLi + " col-xs-12";
                            $("#tab-main").addClass(collgMBiLi);
                        }

                        if (tableTeam != null) {
                            if (tableTeamType != null && tableTeamType == '0') { //表格组一般模式
                                fb_window_switch = true;


                                var fuTableTeam = '<div class="fuTableTeam col-lg-' + fBiLi + ' col-sm-' + fBiLi + ' col-xs-12" style="padding:0px 2px; 0px;">' +
                                    '<input type="hidden" value="1" id="yb_template">' +
                                    '<div style="border-left: 1px solid #dedede;">' +
                                    '<div class="tabbable" id="table_block_yb">' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>';
                                $(".list-content").append(fuTableTeam);
                            }
                        }
                    }
                    var fbBtnWrap = '<div class="right-wraps new-right-wrap before-right-wrap fb_btn_panel_wrap" id="fb_btn_panel" style="z-index: 101;">' +
                        '<div class="clearfix head-line"><em class="back-btn" onclick="javascript:closeFBWindow();"></em></div>' +
                        '<div class="col-lg-12 col-sm-12 col-xs-12" style="padding:0px 2px;" height="100%">' +
                        '<div class="tabbable" id="table_block">' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                    $(".list-content").append(fbBtnWrap);

                    if (form_db != null) {
                        params_form_db = form_db;
                    }
                    if (sys_db != null) {
                        params_sys_db = sys_db;
                    }

                    if (tableName == "tableTeam") {
                        tabId = tableTeamId;
                    } else {

                        tabId = tableId;
                    }

                    if (form_db.open_window_width && (form_db.open_window_width * 1) > 0) {
                        open_window_width = form_db.open_window_width * 1;
                    } else if (form_pm_obj.open_window_width && (form_pm_obj.open_window_width * 1) > 0) {
                        open_window_width = form_pm_obj.open_window_width * 1;
                    }
                    initTableConfition();
                }
            }
        },
        error: function (data) {
            console.log("加载首页接口的 失败：" + data);
        }
    })
}

/**
 * 初始化列表
 */
function initTableList(myId) {

    var myTabId = "list_grid";

    $("#list_grid,#list_gridPager").show();

    gridObj = $("#" + myTabId).jqGrid({
        url: ctx + "/cloud/table/list/reader/list",
        mtype: "POST",
        styleUI: 'Bootstrap',
        datatype: "json",
        scrollrows: true, //行可见,
        postData: {
            tableId: myId,
        },
        paramsFun: function () {
            return getSearchParams(); //搜索参数 
        },
        gridComplete: function (a, b, c) {
            // $("#"+myTabId).closest(".ui-jqgrid-bdiv").css({ "overflow-x": "hidden" });  //list_grid
        },
        colModel: colList,
        viewrecords: true,
        width: "100%",
        height: jqgridHeight + 45,
        rowNum: (tableSetting && tableSetting.pageSize) ? tableSetting.pageSize : 20,
        pager: "#list_gridPager",
        rownumbers: true,
        autowidth: true,
        shrinkToFit: false,
        // pagerpos: 'left',
        // recordpos: 'center',
        loadComplete: function (data, a, b, c) {
            if (data.records == 0 && data.page > 1) {
                setTimeout(function () {
                    searchTable();
                }, 100);
            }
            current_db_rows = data.rows;
            //if(tableTeamId && tableTeamType=='0'){	//表格组一般模式默认选中第一行
            var ids = gridObj.jqGrid('getDataIDs');
            if (ids != null && ids.length > 0) {
                gridObj.jqGrid('setSelection', ids[0]);
            }
            //}
        },
        beforeSelectRow: function (rowid, e) {

        },
        onSelectRow: function (rowid, status) {
            clickTimes++; //记录点击次数
            refreshShowButtonTop(rowid); //刷新置顶按钮
            setTimeout(function () {
                if (clickTimes == 1) {
                    clickTimes = 0;
                    refreshFbWindowBySelectRow(rowid); //表格组单击行刷新附表
                }
            }, 250);
        },
        ondblClickRow: function (rowid, iRow, iCol, e) {
            refreshAboutItem(rowid); //双击打开相关项,
        },
        onSelectAll: function (rowids, status) {

        }
    }).jqGrid('setFrozenColumns');

    $(window).resize(function () {
        if (gridObj) {
            gridObj.setGridWidth($(window).width() * (mBiLi / 12) - 5);
        }
    });
    $("#list_gridPager td").css({
        "padding": "0px 3px"
    });
}






/**
 * 表格组打开附表后，单击行时同步刷新附表
 **/
function refreshFbWindowBySelectRow(rowid) {

    getTableRowDb(rowid, true);
    if (tableTeamId) { //表格组
        var primaryKey = leaderSetting.primaryKey;
        if (fb_window_switch && !openMenuMark) {
            openFBWindowNew(null, primaryKey, form_pm_obj);
        }
    }
}

/**
 * 列表双击打开相关项
 **/
function refreshAboutItem(rowid) {
    getTableRowDb(rowid, true);
    openFBWindowNew(null, idKey, form_pm_obj);
}


/**
 * 获取当前行
 **/
function getTableRowDb(rowId, notSelect) {
    if (rowId) {
        var rowData = {};
        current_select_data = rowData;

        if (idKey && pIdKey) { //zTree
            var treeObj = $.fn.zTree.getZTreeObj("list_tree");
            rowData = treeObj.getNodeByTId(rowId);
            for (var i in rowData) {
                rowData[i] = getBakValue(rowData[i]);
            }
            current_select_data = rowData;
        } else { //jqGird
            if (!notSelect) {
                gridObj.jqGrid('setSelection', rowId);
            }
            var rowIndex;
            var s = gridObj.jqGrid('getDataIDs');
            for (var i = 0; i < s.length; i++) {
                if (s[i] == rowId) {
                    rowIndex = i + 1;
                    break;
                }
            }
            if (rowIndex && rowIndex > 0) {
                rowData = current_db_rows[rowIndex - 1];
                for (var i in rowData) {
                    if (i == "created_time" || i == "updated_time") {
                        rowData[i] = dateFormat(getBakValue(rowData[i]));
                    } else {
                        rowData[i] = getBakValue(rowData[i]);
                    }

                }
                current_select_data = rowData;
            }
        }
        var selectRow = {};
        for (var i in current_select_data) {
            if (current_select_data[i]) {
                selectRow[i] = current_select_data[i];
            }
        }
        return selectRow;
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

/**
 * 列表搜索功能
 */
function searchTable() {
    if (idKey && pIdKey) { //ztree
        initTree();
    } else { //jqGrid
        var data = getSearchCondition();
        gridObj = $("#list_grid").jqGrid('setGridParam', {
            datatype: 'json',
            postData: data,
            page: 1
        }).trigger("reloadGrid"); //重新载入
    }
}

//判断表格组
function judgeTableTeam() {
    if (tableTeam != null && tableTeam.type != null && tableTeam.type == "0") {
        mBiLi = mBiLi;
        windowWidth = windowWidth * (mBiLi / 12);
    }
    if (tableTeam != null) {
        tableTeamId = tableTeam.id;
        tableTeamType = tableTeam.type;
        leaderSetting = tableTeam.leaderSetting;
        if (tableTeam.type != null && tableTeam.type == '0') {
            fb_window_switch = true;
        }
    }
}


function loadJgGrid(mesg, id) {
    var tableId = "tableUl"; //table_list
    $('.table_list').resize(function () {
        $('#' + tableId).setGridWidth($('.table_list').width() * 1);
    });

    var dataStr = {
        id: id
    }

    $("#" + tableId).jqGrid({
        url: mesg,
        mtype: "post",
        datatype: "json",
        postData: dataStr,
        // prmNames:dataStr,
        styleUI: 'Bootstrap',
        colNames: ['按钮名称', '按钮类型', '按钮样式', '创建时间', '更新时间', '操作', 'sid'],
    })
}


/**
 * 计算列宽
 **/
function handlerColWidth(colList, showColCount) {
    var sumCount = windowWidht - 50;
    var showColCount = 0;
    var isAllSelect = 0;
    var existSumWidth = 0;
    $.each(colList, function (i, obj) {
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

/**
 * 处理列表字段
 **/
function textBZ(text, fieldKey, rowId, data, buttonList) {
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
                text = iconStr + '<label key_change="1" rowId="' + rowId + '" key_value="' + text.value + '" ' + styleStr + '>' + text.change_text + "</label>"
            }
        }
        //处理表格组触发字段
        if (tableTeamId && tableTeamType && (tableTeamType == "1" || tableTeamType == "2")) {
            if (leaderSetting.detail && leaderSetting.detail.click_field_key) {
                if (fieldKey == leaderSetting.detail.click_field_key) {
                    return '<a href="javascript:;" key_change="1" style="width:100%;text-align: left;"  rowId="' + rowId + '" key_value="' + text + '" onclick="javasript:openFBWindow(this);">' + text + "</a>"
                }
            }
        }
        //处理超链接
        if (buttonList && buttonList.length > 0) {
            $.each(buttonList, function (i, obj) {
                if (obj.type == "LINK" && obj.name == fieldKey && obj.isShow && obj.isShow == "1") {
                    if (data.SHOW_BUTTON_IDS && data.SHOW_BUTTON_IDS.length > 0) {
                        for (var mk in data.SHOW_BUTTON_IDS) {
                            if (data.SHOW_BUTTON_IDS[mk] == obj.sid) {
                                text = '<a key_id="' + obj.sid + '" onclick="javascript:clickButton(this);" style="width:100%;text-align: left;" bt_type="LINK" type="button" row_id="' + rowId + '">' + text + '</a>'
                            }
                        }
                    }
                }
            });
        }
    }
    if (typeof text != "number") {
        if (!text)
            text = "";
        text = tableContextHandler(text);
    }
    return '<label style="display:inline-flex;width:100%;text-align: left;height:25px;">' + text + '</label>';
}


/**
 * 获取查询条件
 */
function getSearchCondition() {
    //参与搜索的字段
    var fieldKeys = [];
    if (fieldList && fieldList.length > 0) {
        $.each(fieldList, function (i, obj) {
            if (obj.isSearch && obj.isSearch == 1) {
                fieldKeys.push(obj.columnName);
            }
        });
    }
    //搜索分类的条件
    var configObj = [];
    var sqlExpression = "";
    var key_id = $("#dropdownTitle").attr("key_id");
    if (key_id && conditionList[key_id]) {
        var condition = conditionList[key_id];
        if (condition.setting) {
            configObj = JSON.parse(condition.setting).conObj;
            sqlExpression = JSON.parse(condition.setting).sqlExpression;
        }
    }
    //快速检索的条件
    var qqConObj = getQuickQueryConfig();
    //搜索栏关键字
    var keyword = $($("input[name=keyword]")[0]).val();
    return data = {
        preConObj: preConObj,
        preSqlExpression: preSqlExpression,
        keyword: keyword,
        fieldKeys: JSON.stringify(fieldKeys),
        conObj: JSON.stringify(configObj),
        sqlExpression: sqlExpression,
        qqConObj: JSON.stringify(qqConObj)
    };
}


/**
 * 获取快速检索条件
 */
function getQuickQueryConfig() {
    var configObj = [];
    $.each($("#queryForm").find(".form-group"), function () {
        me = $(this);
        var field = me.attr("field");
        var condition = me.attr("condition");
        var con = {
            field_key: field,
            con: condition
        };
        if (!condition) { //日期类型
            condition = me.find(".queryTitle.selected:first").attr("condition");
            if (!condition) { //自定义
                var startVal = me.find("input[name=start_val]").val();
                var endVal = me.find("input[name=end_val]").val();
                if (!startVal && !endVal) {
                    return true;
                }
                con["con"] = "IN";
                con["start_val"] = startVal;
                con["end_val"] = endVal;
            } else {
                con["con"] = condition;
            }
        } else if (condition == "CONVERT") {
            var convert = [];
            me.find(".queryTitle.selected").each(function () {
                convert.push(JSON.parse($(this).attr("convert")));
            });
            if (convert.length == 0) {
                return true;
            }
            con["value"] = JSON.stringify(convert);
        } else if (condition == "QUOTE") {
            var value = me.find("input[name='temp[]']").map(function () {
                return $(this).val();
            }).get().join("|#|");
            if (!value) {
                return true;
            }
            con["value"] = value;
        } else {
            var value = me.find("input[name=value]").val();
            if (!value) {
                return true;
            }
            con["value"] = value;
        }
        configObj.push(con);
    });
    return configObj;
}

/****************************快速检索栏****************************/
var quickQueryMagicSuggestList; //记录当前快速检索中的magicSuggest，用于快速检索清空功能


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


$(function () {
    if (window.location.href.indexOf("mark_child=1") != -1) {
        open_window_width = open_window_width - 100;
        open_window_default_width = open_window_default_width - 100;
    }
    $(".float_window_pop").on("click", ".conditin_classification", function (e) {
        var evt = e || window.event;
        evt.stopPropagation(); //阻止自身冒泡事件
        $(".float_pop_list").css({
            "transform": "translate(-10px,0px)",
            "transition-duration": ".5s"
        });
    });

    $(".float_pop_list").on("click", ".pop_list_item", function () {
        $(".float_pop_list .pop_list_item").css({
            "background": "#48a0dc",
            "color": "#ffffff"
        });
        $(this).css({
            "background": "#f6ff8c",
            "color": "#000"
        });
        e.stopPropagation();
        e.preventDefault();
        return false;
    });


    $('html').on("click", function (e) {
        if ($(e.srcElement || e.target).closest('.float_pop_list').length != 0) {
            $(".float_pop_list").css({
                "transform": "translate(-110px,0px)",
                "transition-duration": ".5s"
            });
        }
    })

});

/**
 * 全局变量
 **/
var fieldList, buttonList, tableSetting, configId;
var fieldTypeList;
var conditionList = {};
var buttonConfigList = {};
var multflag = false; //是否显示多选(批量操作)
var colList = []; //列表字段显示信息
var editDelButtonList = [];
/* var filterList=[];var filterConfigObj={}; */

/**
 * 列表全局变量
 **/
var gridObj;
var current_db_rows;
var current_select_data;

/**
 * 获取列表字段类型，用于搜索页面字段类型判断
 **/
$.post(ctx + "/cloud/behind/stableListConfig/getFieldType", function (json) {
    if (json.result == "Success" || json.result == "SUCCESS") {
        fieldTypeList = json.list;
    } else {
        tipsMsg(json.resultMsg, "FAIL");
    }
});

/**
 * 设置表格宽度到缓存中
 **/
function setTableWidthToCatch() {
    var colModelList = $("#list_grid").jqGrid('getGridParam', 'colModel');
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

    }
}


/**
 * 展示用户保存的搜索分类（公共分类 + 自己创建的分类）
 **/

function initTableConfition() {
    $.post(ctx + "/cloud/sbehaviourConfig/use/getConfig/TABLE_CONDITION", {
        id: tabId
    }, function (json) {
        if (json.result == "Success" || json.result == "SUCCESS") {
            var conList = json.list;
            var hasShow = [];
            if (conList != null && conList.length > 0) {
                $.post(ctx + "/cloud/sbehaviourConfig/use/getConfig/TABLE_CONDITION_SETTING", {
                    id: tabId
                }, function (result) { //获取分类用户设置信息
                    if ((json.result == "Success" || json.result == "SUCCESS") && result.list != null && result.list.length > 0) {
                        var tableConditionSettingId = result.list[0].sid;
                        if (tableConditionSettingId && tableConditionSettingId.indexOf("10000") == -1) {
                            $("#tableConditionSettingId").val(result.list[0].sid);
                        }
                        var setting = JSON.parse(result.list[0].setting);
                        for (var i = 0; i < setting.length; i++) {
                            var userSet = setting[i]; //用户设置信息
                            $.each(conList, function (j, con) {
                                if (userSet.classifyId == con.sid) {
                                    conditionList[con.sid] = con;
                                    var conSet = JSON.parse(con.setting); //搜索分类设置信息
                                    showClassify({
                                        classifyId: con.sid,
                                        name: conSet.name,
                                        type: conSet.type,
                                        isShow: userSet.isShow,
                                        isDefault: userSet.isDefault
                                    });
                                    conList.splice(j, 1); //移除已经添加过的分类
                                    return false;
                                }
                            });
                        }
                    }
                    //没有搜索字段用户设置信息或者一些分类设置后没有保存用户设置
                    $.each(conList, function (i, con) {
                        var setting = con.setting;
                        if (setting) {
                            conditionList[con.sid] = con;
                            var setObj = JSON.parse(setting);
                            showClassify({
                                classifyId: con.sid,
                                name: setObj.name,
                                type: setObj.type
                            });
                        }
                    });
                });
            }
        } else {
            tipsMsg(json.resultMsg, "FAIL");
        }
        /******加载列表******/

        var postData;

        if (tableName == "tableList") {
            postData = {
                module: tableId,
                menuId: cur_menuId
            };
        } else {
            postData = {
                module: tabId,
                menuId: tableId
            };
        }
        if (tableTeamId) {
            postData["type"] = "TABLE_TEAM_TABLE";
            postData["tableTeamId"] = cur_menuId;
            postData["tableTeamMark"] = "主表";
        }
        $.post(ctx + "/cloud/userUiConfig/postGet", postData, function (json) { //
            if (json.result == "Success" || json.result == "SUCCESS") {
                var jsonMap = json.map;
                fieldList = jsonMap.fieldList;
                buttonList = jsonMap.buttonList;
                configId = jsonMap.configId;
                tableSetting = jsonMap.tableSetting;
                colList = initColList(jsonMap);

                if (idKey && pIdKey) { //zTree
                    initTree();
                } else {

                    initTableList(tabId);
                }
                //初始化快速检索表单
                initQuickQuery(fieldList);
            } else {
                tipsMsg(json.resultMsg, "FAIL");
            }
        });
    });
}


/**
 * 单击按钮  就是这里了
 **/
function clickButton(me) {
    me = $(me);
    var data = {};
    var selectRowData = getSelectRowObj(me);
    var buttonText = me.text();
    if (selectRowData && selectRowData.length > 0) {
        data['form'] = {
            "selectRows": JSON.stringify(selectRowData)
        };
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
    if (!data['form']) {
        data['form'] = {};
    }
    if (form_db) {
        for (var pd in form_db) {
            if (form_db[pd] && !data['form'][pd]) {
                data['form'][pd] = form_db[pd];
            }
        }
    }
    if (form_pm_obj) {
        for (var pd in form_pm_obj) {
            if (form_pm_obj[pd]) {
                data['form'][pd] = form_pm_obj[pd];
            }
        }
    }
    data['sys'] = sys_db;
    var btType = me.attr("bt_type");
    var row_id = me.attr("row_id");
    if ((btType == "EDIT" || btType == "DELETE" || btType == "LINK") && row_id) {
        data['table'] = getTableRowDb(row_id);
    }
    if (btType == "DELETE" || (buttonText && buttonText.indexOf("批量") != -1)) {
        confirmMsg("是否确认" + buttonText, function () {
            btf.button.clickButton(me, buttonConfigList, data, function () {
                if (idKey && pIdKey) { //zTree
                    initTree();
                } else { //jqGird
                    gridObj.trigger("reloadGrid");
                };
            });
        });
    } else {
        // alert(JSON.stringify(buttonConfigList))
        btf.button.clickButton(me, buttonConfigList, data, function () {
            if (idKey && pIdKey) { //zTree
                initTree();
            } else { //jqGird
                gridObj.trigger("reloadGrid");
            };
        });
    }
}

/**
 * 获取选中的行
 **/
function getSelectRowObj(me) {
    var data = [];
    if (idKey && pIdKey) { //zTree
        var treeObj = $.fn.zTree.getZTreeObj("list_tree");
        if (treeObj) {
            //var rowId=$(me).parents("li").attr("id");
            var rowId = $(me).attr("row_id");
            if (rowId) { //单击行或者修改删除按钮
                data.push(treeObj.getNodeByTId(rowId));
            } else { //批量按钮
                data = treeObj.getCheckedNodes(true);
            }
        }
    } else { //jqGird
        $("#list_grid_frozen").find("input[key=select_checkbox]").each(function (i, obj) {
            if (obj.checked == true) {
                var rowid = $(obj).attr("rowid");
                data.push(getTableRowDb(rowid));
            }
        });
    }
    return data;
}

/**
 * jqGird全选
 **/
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

/**
 * 按钮置顶显示时单击行刷新置顶按钮
 **/
function refreshShowButtonTop(rowId) {
    if (tableSetting && tableSetting.showButtonTop) {
        getTableRowDb(rowId, true);
        if (current_select_data) {
            var buttonStr = '';
            $.each(editDelButtonList, function (i, button) {
                if (existString(current_select_data.SHOW_BUTTON_IDS, button.sid)) {
                    var class_val = JsonButton.spanButton.default_btn_select;
                    if (button.style) {
                        // var mesg = ctx + "/src/images/list/" + button.style + "_white.png";
                        var mesg = "../../../src/images/list/" + button.style + "_white.png";
                    }
                    buttonStr += '<span key_id="' + button.sid + '" row_id="' + rowId + '" bt_type="' + button.type + '" onclick="javascript:clickButton(this);" class="default-btn ' + class_val + '" type="button"  style="margin: 0px 5px;background:rgba(72, 160, 220, 1) url(' + mesg + ') no-repeat 10px center" >' + button.name + '</span>'
                }
            });
            $(".show_button_top").html(buttonStr);
        }
    }
}

/**
 * 获取搜索参数
 **/
function getSearchParams() {
    var data = getSearchCondition();
    // alert("查看data:"+JSON.stringify(data));
    var default_order_field;
    var default_order;
    var fieldKeys = [];
    if (fieldList && fieldList.length > 0) {
        var order_field_setting = [];
        $.each(fieldList, function (i, obj) {
            if (obj.isOrder) {
                default_order_field = obj.columnName;
                if (obj.isOrder == 1) {
                    default_order = "desc";
                } else {
                    default_order = obj.isOrder;
                }
                order_field_setting.push({
                    field: default_order_field,
                    order: default_order
                });
            }
            if (obj.isSearch && obj.isSearch == 1) {
                fieldKeys.push(obj.columnName);
            }
        });
        if (order_field_setting && order_field_setting.length > 0) {
            data['order_field_setting'] = JSON.stringify(order_field_setting);
        }
        data['fieldKeys'] = JSON.stringify(fieldKeys);
    }


    if (form_pm_obj) {
        for (var pd in form_pm_obj) {
            if (form_pm_obj[pd]) {
                data[pd] = form_pm_obj[pd];
            }
        }
    }


    if (form_db) {
        for (var pd in form_db) {
            if (form_db[pd]) {
                data[pd] = form_db[pd];
            }
        }
    }

    return data;
}

/**
 * 初始化列表数据
 **/
function initColList(jsonMap) {
    var operatorColWidth = jsonMap.operatorColWidth;
    var isDownload = jsonMap.isDownload;
    var colList = [];
    if (isDownload) {
        $(".button_content").append(
            '<span bt_type="download" ><a target="_blank" class="btn btn-xs default-btn-img default-btn" isMain="1" onclick="javascript:downLoadDB();" key="donwLoad"><i class="fa fa fa-download"></i>下载</a></span>'
        );
    }
    if (buttonList != null && buttonList.length > 0) {
        $.each(buttonList, function (i, button) {
            buttonConfigList[button.sid] = button;
            if (button.isShow && button.isShow == "1") {
                if (button.type == "ADD") {
                    if (button.name.indexOf("批量") >= 0) {
                        multflag = true;
                    }
                    var class_val = JsonButton.commonButton.default_btn + " " + JsonButton.commonButton.btn_add;
                    if (button.style) {

                        var mesg = "../../../src/images/list/" + button.style + "_white.png";
                    } //就是这里了
                    $(".button_content").append('<button name="aaaaa" key_id="' + button.sid + '" bt_type="ADD" onclick="javascript:clickButton(this);" class="default-btn-img  ' + class_val + '" type="button" >' + button.name + '</button>');
                } else {
                    if (button.type != "LINK") {
                        editDelButtonList.push(button);
                    }
                }
            }
        });
    }

    var showColCount = 0;
    if (multflag && !idKey && !pIdKey) { //jqTable
        colList.push({
            frozen: true,
            label: "<input type='checkbox' class='all_select_comp' onclick='javascript:allSelect(this);'>",
            index: "allselect_compontent",
            name: "全选2",
            width: 30,
            sortable: false,
            formatter: function (dbValue, x, n) {
                return '<input type="checkbox" key="select_checkbox" rowid="' + x.rowId + '" style="margin:12px 0 0 3px;">';
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
            name: field.columnName,
            align: 'left'
        };
        if (!field.isShow && field.isShow == 0) {
            colObj['hidden'] = true;
        } else {
            showColCount++;
        }
        if (field.colWidth && (field.colWidth * 1) > 0) {
            colObj['width'] = (field.colWidth * 1);
        }
        if (field.isFixed && field.isFixed == 1) {
            colObj['frozen'] = true;
        }
        if (field.primaryKey && field.primaryKey == 1) {
            colObj['key'] = true;
        }
        // alert("field:"+JSON.stringify(field));
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
                    return textBZ(date.format(format), field.columnName, x.rowId, n, buttonList);
                }
                return textBZ(v, field.columnName, x.rowId, n, buttonList);
            }
        } else {
            colObj['formatter'] = function (dbValue, x, n) {
                return textBZ(dbValue, field.columnName, x.rowId, n, buttonList);
            }
        }
        colList.push(colObj);
    });
    if (editDelButtonList.length > 0) {
        if (!tableSetting || !tableSetting.showButtonTop) {
            colList.push({
                label: "操作",
                index: "操作",
                name: "操作",
                align: "left",
                width: operatorColWidth ? operatorColWidth : 150,
                formatter: function (dbValue, x, n) {
                    var buttonStr = '';
                    $.each(editDelButtonList, function (i, button) {
                        if (n.SHOW_BUTTON_IDS && existString(n.SHOW_BUTTON_IDS, button.sid)) {
                            var class_val = JsonButton.spanButton.default_btn_select;
                            if (button.style) {

                                var mesg = "../../../src/images/list/" + button.style + "_white.png";
                            }

                            buttonStr += '<span id="add_entry" key_id="' + button.sid + '" row_id="' + x.rowId + '" bt_type="' + button.type + '" onclick="javascript:clickButton(this);" class="default-btn ' + class_val + '" type="button"  style="margin: 0px 5px;background:rgba(72, 160, 220, 1) url(' + mesg + ') no-repeat 10px center" >' + button.name + '</span>'
                        }
                    });
                    return "<div style='display: inline-flex'>" + buttonStr + "</div>";
                }
            });
            showColCount++;
        }
    }
    return handlerColWidth(colList, showColCount);
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

/**
 * 计算列宽
 **/
function handlerColWidth(colList, showColCount) {
    var sumCount = windowWidht - 50;
    var showColCount = 0;
    var isAllSelect = 0;
    var existSumWidth = 0;
    $.each(colList, function (i, obj) {
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


/**
 * 初始化ztree
 **/
function initTree() {
    $("#list_tree").empty().show();
    var setting = {
        view: {
            dblClickExpand: true, //双击节点时，是否自动展开父节点的标识
            showLine: true, //是否显示节点之间的连线
            fontCss: {
                'color': 'black',
                'font-weight': 'bold'
            }, //字体样式函数
            selectedMulti: false, //设置是否允许同时选中多个节点
            txtSelectedEnable: true, //可以选择字段文本
            addDiyDom: addDiyDom //自定义显示字段及样式
        },
        check: {
            //chkboxType: { "Y": "ps", "N": "ps" },	//父级选中时子级联动效果
            chkboxType: {
                "Y": "",
                "N": ""
            },
            chkStyle: "checkbox", //复选框类型
            enable: multflag //每个节点上是否显示 CheckBox
        },
        data: {
            simpleData: { //简单数据模式
                enable: true,
                idKey: idKey,
                pIdKey: pIdKey,
                rootPId: null
            }
        },
        callback: {
            onClick: zTreeOnClick
        }
    };

    var data = getSearchParams();
    data["tableId"] = tableId;
    data["page"] = 1;
    data["rows"] = (tableSetting && tableSetting.pageSize) ? tableSetting.pageSize : 10000;
    $.post(ctx + "/cloud/table/list/reader/list", data, function (json) {
        if (json && json.rows) {
            if (json.rows.length > 0) {
                $.fn.zTree.init($("#list_tree"), setting, json.rows);
                //if(tableTeamId && tableTeamType=='0'){	//表格组一般模式默认选中第一行
                $("#list_tree_1_a").click();
                //}
            } else {
                $("#list_tree").append('<li ><div style="text-align: center;line-height: 30px;" >无符合条件数据</div></li>');
            }
        }
        initTitle(); //初始化标题
    });
}

/**
 * ztree初始化标题
 */
function initTitle() {
    var title = '<li class="head"><a>';
    for (var i = 0; i < colList.length; i++) {
        if (!colList[i].hidden) {
            title += '<div class="divTd" style="width:' + colList[i].width + 'px;">' + colList[i].label + '</div>';
        }
    }
    title += '</a></li>';
    $("#list_tree").prepend(title);
}

/**
 * ztree自定义DOM节点
 */
function addDiyDom(treeId, treeNode) {
    var spaceWidth = 15;
    var liObj = $("#" + treeNode.tId);
    var aObj = $("#" + treeNode.tId + "_a");
    var checkObj = $("#" + treeNode.tId + "_check");
    var switchObj = $("#" + treeNode.tId + "_switch");
    var spanObj = $("#" + treeNode.tId + "_span");
    var icoObj = $("#" + treeNode.tId + "_ico");
    checkObj.remove();
    switchObj.remove();
    spanObj.remove();
    icoObj.remove();

    aObj.attr('title', '');
    aObj.append('<div class="divTd swich fnt" ></div>');
    var div = $(liObj).find('div').eq(0); //从默认的位置移除


    div.append(switchObj);
    switchObj.before("<span style='height:1px;display: inline-block;width:" + (spaceWidth * treeNode.level) + "px'></span>"); //图标垂直居中
    switchObj.after(checkObj);
    checkObj.after(icoObj);
    icoObj.css("margin-top", "9px");
    div.append(spanObj);



    var editStr = ''; //宽度需要和表头保持一致
    var firstCell = false;
    for (var i = 0; i < colList.length; i++) {
        var currCell = colList[i];
        if (!currCell.hidden) {
            var name = currCell.name;
            var value = treeNode[name];
            var resultText = currCell.formatter(value, {
                rowId: treeNode.tId
            }, treeNode);

            if (!firstCell) {
                firstCell = true;
                div.css("width", currCell.width);
                spanObj.html(resultText);
            } else {
                editStr += '<div class="divTd" style="width:' + currCell.width + 'px;">' + resultText + '</div>';
            }
        }
    }
    aObj.append(editStr);
}

/**
 * ztree单击行事件
 */
function zTreeOnClick(event, treeId, treeNode) {
    refreshShowButtonTop(treeNode.tId);
    refreshFbWindowBySelectRow(treeNode.tId);
}

/**
 * 下载功能
 */
function downLoadDB() {
    var data = getSearchCondition();
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
    form.append($("<input></input>").attr("type", "hidden").attr("name", "fieldKeys").attr("value", data["fieldKeys"]));
    form.append($("<input></input>").attr("type", "hidden").attr("name", "conObj").attr("value", data["conObj"]));
    form.append($("<input></input>").attr("type", "hidden").attr("name", "sqlExpression").attr("value", data["sqlExpression"]));
    form.append($("<input></input>").attr("type", "hidden").attr("name", "qqConObj").attr("value", data["qqConObj"]));
    form.append($("<input></input>").attr("type", "hidden").attr("name", "keyword").attr("value", data["keyword"]));
    form.append($("<input></input>").attr("type", "hidden").attr("name", "configId").attr("value", configId));
    form.appendTo('body').submit().remove();
}

/**
 * 打开弹窗
 */
function openWindow(url, bakFun) {
    window.openWindowBanFun = bakFun;
    if (open_window_width && (open_window_width * 1) > 0) {
        showRightPopGetWidth("config_btn_panel", open_window_width + "px");
    } else {
        if (open_window_default_width == 900) {
            open_window_default_width = 1100;
        }
        showRightPopGetWidth("config_btn_panel", open_window_default_width + "px");
    }

    $("#config_btn_panel").html('<div class="clearfix head-line" style="display: block;"><em class="back-btn" onclick="javascript:cloudOpenWindow();"></em></div><iframe width="100%" height="' + ($(window).height() - 50) + '" scrolling="no" frameborder="0" src="' + url + '"></iframe>');
    $("#config_btn_panel").show();
    if (url.indexOf("hideWindow") != -1) {
        $("#config_btn_panel").hide();
    }
}

function cloudOpenWindow(isSuccess) {
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
}

/**
 * 打开表格组附表
 */
function openFBWindow(me) {
    var rowId = $(me).attr("rowId");
    var text = $(me).html();
    if (rowId) {
        getTableRowDb(rowId);
        if (current_select_data && leaderSetting && leaderSetting.primaryKey) {
            var primaryKey = leaderSetting.primaryKey;
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
    var iframeHeight = $(window).height() - 56;
    if (primaryKey) {
        if (current_select_data) {
            if (current_select_data[primaryKey]) {
                var dataId = current_select_data[primaryKey];
                var data;
                if (tableName == "tableTeam") {
                    data = {
                        data_id: dataId,
                        menuId: tableId + ""
                    }
                } else {
                    data = {
                        data_id: dataId,
                        menuId: cur_menuId + ""
                    };
                }
                if (formDB) {
                    for (var pd in formDB) {
                        if (formDB[pd]) {
                            data[pd] = formDB[pd];
                        }
                    }
                }
                var pmStr = (btf.getParamsStr(data));
                var url = './tableTeamDetail.html?tableTeamId=' + menuId + pmStr;
                if (!tableTeamId) { //列表时打开相关项
                    url = './tableListAboutItem.html?tableId=' + tableId + pmStr;
                }
                if ($("#yb_template").val() == "1") {
                    $("#table_block_yb").html('<iframe name="content_iframe" class="content_iframe_s" src="' + url + '" width="100%" height="' + iframeHeight + 'px" frameborder="0"></iframe>');
                } else {
                    var windowWidth = window.innerWidth;
                    var windowHeight = window.innerHeight;
                    if (openMenuMark) {
                        createDiv("detail" + dataId, text, "iframe_src_" + dataId, url, (windowWidth * 0.8), (windowHeight * 0.95));
                    } else {
                        $("#table_block").html('<iframe name="content_iframe" class="content_iframe_s" src="' + url + '" width="100%" height="' + iframeHeight + 'px" frameborder="0"></iframe>');
                        fb_window_switch = true;
                        if (open_window_width && open_window_width > 0 && open_window_width > open_window_default_width) {
                            showRightPopGetWidth("fb_btn_panel", open_window_width + "px");
                        } else {
                            if (open_window_default_width == 900) {
                                open_window_default_width = 1100;
                            }
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
    if (!tableTeamType || tableTeamType != "0") {
        fb_window_switch = false;
    }
    if (isNew) {
        current_select_data = "";
    }
    if (openMenuMark) {
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        createDiv("test" + mark_i, "test", "iframe_src_" + mark_i, url, (windowWidth * 0.8), (windowHeight * 0.8));
        mark_i++;
    } else {
        if (open_window_width && (open_window_width * 1) > 0) {
            hideRightPopGetWidth("fb_btn_panel", open_window_width + "px");
        } else {
            hideRightPopGetWidth("fb_btn_panel", open_window_default_width + "px");
        }
        if (isSuccess) {
            gridObj.jqGrid('setGridParam', {
                page: gridObj.getGridParam('page')
            }).trigger("reloadGrid");
        }
    }
    if (isSuccess) {
        if (window.openWindowBanFun) {
            window.openWindowBanFun();
        }
    }
}

/**
 * 打开用户设置界面
 */
function openTableSetting() {
    setTableWidthToCatch();
    var url = './setting.html?tableId=' + tableId + '&menuId=' + cur_menuId;
    if (tableTeamId) { //表格
        url = './setting.html?tableId=' + tableTeamId + '&menuId=' + tableId + '&type=TABLE_TEAM_TABLE&tableTeamMark=主表&tableTeamId=' + cur_menuId;
    }
    openWindow(url, function () {
        window.location.reload();
    });
}

/**
 * 获取地址栏参数
 */
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
var currentFB_Label_MARK;

function setCurrentFBLabelMARK(mark) {
    currentFB_Label_MARK = mark;
}

function getCurrentFBLabelMARK() {
    return currentFB_Label_MARK;
}

/**
 * 显示搜索分类(快速选择下拉项、编辑界面)
 */
function showClassify(userSetting) {
    var defaultSetting = {
        classifyId: "",
        name: "",
        isShow: true,
        isDefault: false,
        type: ""
    };
    $.extend(defaultSetting, userSetting); //以传入参数覆盖默认设置信息

    var name = defaultSetting.name;
    var classifyId = defaultSetting.classifyId;
    var isShow = defaultSetting.isShow;
    var isDefault = defaultSetting.isDefault;

    if (defaultSetting.type && defaultSetting.type == "line") { //分线栏
        var size = name.length > 8 ? 14 : (name.length * 1.5);
        $("#addClassTable tbody").append('<tr key_id="' + classifyId + '" class="newPartingLine">' +
            '<td colspan="3">' +
            '<div>' +
            '<input type="text" size="' + size + '" value="' + name + '" readonly/>' +
            '</div>' +
            '</td>' +
            '<td>' +
            '<span><img class="middle" src="../../../src/images/searchFilter/pencil-selete.png" alt="编辑" title="编辑" data-toggle="modal" data-target="#addLine" onclick="editLine(this)"/></span>' +
            '</td>' +
            '</tr>');
        $(".dropdown-content").find("li:last").before('<li>' +
            '<div class="newPartingLine" style="height:40px;">' +
            '<div>' +
            '<label>' + name + '</label>' +
            '</div>' +
            '</div></li>');
        return;
    }
    var editStr = '<span><img class="middle" src="../../../src/images/searchFilter/pencil-selete.png" alt="编辑" title="编辑"  data-toggle="modal" data-target="#addConditionModal" onclick="editClassify(this, false)"/></span>';
    if (classifyId && classifyId.indexOf("10000") != -1) { //普通用户不能修改公共条件
        editStr = "";
        name += "(公共)";
    }
    $("#addClassTable tbody").append(
        '<tr key_id="' + classifyId + '">' +
        '<td>' + name + '</td>' +
        '<td>' +
        '<div class="div1 ' + (isShow ? "close1" : "open1") + '">' +
        '<span class="left"></span>' +
        '<span class="right"></span>' +
        '<div class="div2 ' + (isShow ? "close2" : "open2") + '"></div>' +
        '</div>' +
        '</td>' +
        '<td>' +
        '<span class="checkboxContent" style="position: relative;">' +
        '<input type="checkbox" name="default" ' + (isDefault ? "checked" : "") + ' id="' + classifyId + '"/>' +
        '<label for="' + classifyId + '"></label>' +
        '</span>' +
        '</td>' +
        '<td>' +
        editStr +
        '<span class="copyTr pl6"><img class="middle" src="../../../src/images/searchFilter/copy.png" alt="复制"  title="复制" data-toggle="modal" data-target="#addConditionModal" onclick="editClassify(this, true)"/></span>' +
        '</td>' +
        '</tr>'
    );
    if (defaultSetting.isShow) {
        $(".dropdown-content").find("li:last").before('<li key_id="' + classifyId + '"><span>' + name + '</span></li>');
    }
    if (defaultSetting.isDefault) {
        $("#dropdownTitle").text(name).attr("key_id", classifyId);
    }
}