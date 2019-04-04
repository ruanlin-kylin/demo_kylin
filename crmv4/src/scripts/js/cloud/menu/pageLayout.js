try {
    window.parent.addIndexTitle($("#index_menue"), document.title, window.location.href);
} catch (e) {}
if ($.trim($("#index_menue").html())) {
    $("#index_menue").show();
}

// setWaterMark("body",["${sessionInfo.loginName}","",""],"rgba(0, 0, 0, 0.1)",100,60,-30);
/*定义布局参数*/
var saveFormBackFunList = [];
var sqlSavnSaveAfterHander = [];
var fieldList, buttonList, tableSetting, configId;
var fieldTypeList;
var conditionList = {};
var buttonConfigList = {};
var tableConfigObj = {};
var tableDbRows = {};
var form_pm_obj = {};
var form_db = {};
var sys_db = {};
var table_setting_type;
// if (form_pm != null) {
//     form_pm_obj = form_pm
// }

require.config({
    paths: {
        // echarts: '/crmweb/lib/js/echarts-2.2.7'
        echarts: '../../../../src/scripts/js/plug-in/echarts-2.2.7'
    }
});




$.ajaxSetup({
    contentType: 'application/x-www-form-urlencoded;charset=utf-8',
    complete: function (xhr, status) {
        var sessionStatus = xhr.getResponseHeader('sessionstatus'); // 通过XMLHttpRequest取得响应头，sessionstatus，
        if (sessionStatus == "timeout") {
            // location.href = ctx + '/common/logincloud.jsp';
        }
    }
});

/*自定义的逻辑*/
var params = getUrlParams();
var pageLayoutId = params.pageLayoutId;
// alert("pageLayoutId",pageLayoutId);
// alert(JSON.stringify(params))
$.ajax({
    type: "GET",
    url: ctx + "/cloud/menu_v1/pageLayout/" + pageLayoutId,
    dataType: "json",
    success: function (data) {
        // alert(1);
        // console.log("自定义布局接口1:" + JSON.stringify(data));
        if (data.result == "SUCCESS") {
            var htmlText = data.map.htmlText;
            sys_db = JSON.parse(data.map.sys_db);
            console.log("sys_db", sys_db);
            if (data.map.form_db) {
                form_db = data.map.form_db
            }
            if (data.map.form_pm) {
                form_pm_obj = data.map.form_pm
            }
            if (data.map.page.id) {
                table_setting_type = data.map.page.id
            }
            console.log("htmlText",htmlText);
            var currentHtmlText = interceptionScriptSrc(htmlText);
            // alert(currentHtmlText)
            console.log("查看截取之后的数据：" + currentHtmlText);
            $(".pageLayout-content").html("");
            $(".pageLayout-content").html(currentHtmlText);
            $(".defined_page_config").each(function (i, obj) {
                var obj = $(obj);
                var html = $.trim(obj.html());
                var divObj = obj.parent();
                if (html) {
                    html = html.replace(/&amp;/g, "&");
                    var config = JSON.parse(html);
                    console.log("config", config)
                    var initobj = new initConfig(config.paramsValue, config.objectId, config.contentType, i, divObj, config.isDigital, config.digitalTitle, config.digitalField);
                    initobj.init();
                }
            });
        }
    },
    error: function (data) {
        console.log("加载首页接口的 失败：" + data);
    }
})










// var pageId = "${page.id}";


function openWindow(url, bakFun) {
    window.openWindowBanFun = bakFun;
    $("#config_btn_panel").css({
        "width": "1100px",
        "right": "0px"
    });
    $("#config_btn_panel").html('<div class="clearfix head-line"><em class="back-btn" onclick="javascript:cloudOpenWindow();"></em></div><iframe width="100%" height="100%" scrolling="no" frameborder="0" src="' + url + '"></iframe>');
    $('#config_btn_panel').addClass('right-wrap-show animated fadeInRight');
}

function cloudOpenWindow(isSuccess) {
    $("#config_btn_panel").removeClass("right-wrap-show fadeInRight");
    $("#config_btn_panel").animate({
        "right": "-1100px",
        "opacity": "0.7"
    }, 600);
    if (isSuccess) {
        if (window.openWindowBanFun) {
            window.openWindowBanFun();
        }
    }
}

function Notify(msg) {
    tipsMsg(msg, "FAIL");
}

/**
 * 动态加载CSS
 * @param {string} url 样式地址
 */
function dynamicLoadCss(url) {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = url;
    head.appendChild(link);
}

/**
 * 动态加载JS
 * @param {string} url 脚本地址
 * @param {function} callback  回调函数
 */
function dynamicLoadJs(url, callback) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    if (typeof (callback) == 'function') {
        script.onload = script.onreadystatechange = function () {
            if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                callback();
                script.onload = script.onreadystatechange = null;
            }
        };
    }
    head.appendChild(script);
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

function parseEnum(str) {
    if (!str) {
        return null;
    }
    if (str.indexOf("###") > -1) {
        str = str.replace("###", "");
        return JSON.parse(str);
    }
    return JSON.parse(str);
}
//判断是否为空
function validateObj(obj) {
    var isnull = obj.attr("isnull");
    var regexp = obj.attr("regexp");
    var value = obj.val();
    if (isnull == "true") {
        if (!value) {
            console.debug("====");
            tipsMsg(obj.attr("isnull_text"), "FAIL");
            return false;
        }
    }
    return true;
}
//判断是否为空
function isValidate() {
    var isYes = true
    $("input").each(function (i, obj) {
        if (!validateObj($(obj))) {
            isYes = false;
            return false;
        }
    });
    if (!isYes) {
        return false;
    }
    $("textarea").each(function (i, obj) {
        if (!validateObj($(obj))) {
            isYes = false;
            return false;
        }
    });
    return isYes;
}

function getSysParams() {
    var sysParams = {};
    // <c:if test="${sys_db!=null}">
    // sysParams=${sys_db};
    // </c:if>
    if (sys_db) {
        sysParams = sys_db;
    }
    return sysParams;
}

function dateInputKeyUp(me) {
    me = $(me)
    var value = $.trim(me.val());
    var format = me.attr("format");
    if (!format) {
        format = "yyyy-MM-dd";
    }
    if ("yyyy-MM-dd HH:mm:ss" == format) {
        if (/^[0-9]{8}\s[0-9]{2}:[0-9]{2}:[0-9]{2}$/.test(value) || /^[0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}:[0-9]{2}$/.test(value)) {
            if (/^[0-9]{8}\s[0-9]{2}:[0-9]{2}:[0-9]{2}$/.test(value)) {
                var year = value.substring(0, 4) + "-" + value.substring(4, 6) + "-" + value.substring(6, 8);
                me.val(year + " " + $.trim(value.replace(value.substring(0, 8), "")));
            }
            $(me).blur();
        }
    } else {
        if (/^[0-9]{8}$/.test(value) || /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value)) {
            if (/^[0-9]{8}$/.test(value)) {
                me.val(value.substring(0, 4) + "-" + value.substring(4, 6) + "-" + value.substring(6, 8));
            }
            $(me).blur();
        }
    }
}

function dateInputBlur(me, bakUp) {
    $(".layui-laydate").hide();
    if (bakUp) {
        bakUp();
    }
}

var windowHeight = $(window).height();
$("body >.container-fluid").each(function (i, z) { //
    z = $(z);
    z.find(">.set_height_mark").each(function (i, obj) {
        obj = $(obj);
        var mark_height = obj.attr("mark_height");
        if (obj.attr("name") == "set_height" && (mark_height * 1) > 0) {
            obj.height(((windowHeight * (mark_height * 1)) / 100) - 5);
            setChildHeight(obj);
        }
    });
});

function setChildHeight(parentObj) {
    var parentHeight = parentObj.height();
    parentObj.find(".set_height_mark").each(function (i, obj) {
        obj = $(obj);
        var mark_height = obj.attr("mark_height");
        if (obj.attr("name") == "set_height" && (mark_height * 1) > 0) {
            obj.height((parentHeight * (mark_height * 1)) / 100);
            setChildHeight(obj);
        }
    });
}
$(".defined_page_config").hide();


$(function () {
    $("#btn_submit").bind("click", function () {
        defined_form.submit("myModal1", "content_div", function () {
            var openFormMark = $("#content_div").find("input[name=openFormMark]").val();
            if (openFormMark == "1") {
                openFormBack();
            } else {
                if (cuurent_key_id) {
                    var tcobj = tableConfigObj[cuurent_key_id];
                    if (tcobj) {
                        tcobj.table.fnClearTable(0);
                        tcobj.table.DataTable().draw(false);
                    }
                }
            }
            if (saveFormBackFunList.length > 0) {
                for (var j = 0; j < saveFormBackFunList.length; j++) {
                    var fun = saveFormBackFunList[j];
                    if (typeof fun == "function") {
                        try {
                            fun();
                        } catch (e) {}
                    }
                }
            }
        });
    });

    // $(".defined_page_config").each(function (i, obj) {
    //     var obj = $(obj);
    //     var html = $.trim(obj.html());
    //     var divObj = obj.parent();
    //     if (html) {
    //         html = html.replace(/&amp;/g, "&");
    //         var config = JSON.parse(html);
    //         initobj = new initConfig(config.paramsValue, config.objectId, config.contentType, i, divObj, config.isDigital, config.digitalTitle, config.digitalField);
    //         initobj.init();
    //     }
    // });
});

//pageLayout布局页面初始化
function initConfig(paramsValue, objectId, contentType, orderMark, configDiv, isDigital, digitalTitle, digitalField) {
    this.paramsValue = paramsValue;
    this.objectId = objectId;
    this.contentType = contentType;
    this.configDiv = configDiv;
    this.orderMark = orderMark;
    this.idKey = 'from_table_field_mark_' + (objectId + '_' + orderMark);
    this.isDigital = isDigital;
    this.digitalTitle = digitalTitle;
    this.digitalField = digitalField;
    var me = this;
    this.init = function () {
        if (this.contentType && this.objectId) {
            if ("FORM" == this.contentType) {
                console.log("FORM");
            } else if ("TABLE_TEAM" == this.contentType) {
                var url = ctx + "/cloud/menu/tableTeam/" + this.objectId;
                configDiv.html('<iframe width="100%" scrolling="no" frameborder="0"  src="' + url + '" height="100%"></iframe>');
            } else if ("REPORT" == this.contentType) {
                if (this.isDigital && this.isDigital == "1") { //数字组件
                    configDiv.html(
                        '<div class="col-xs-12" id="digital_' + this.idKey + '" id_key="' + this.idKey + '" style="border:1px solid #d2d8e8;border-radius:8px;">' +
                        '<div class="col-xs-12" style="text-align:center;font-size:20px;margin-top:5px;" name="title">' + this.digitalTitle + '</div>' +
                        '<div class="col-xs-12" style="text-align:center;font-size: 25px;color: #2076f7;margin-top: 10px;"><label name="digital" style="cursor:pointer;">0</label></div>' +
                        '</div>'
                    );
                    initDigital(this.objectId, this.digitalField, this.configDiv, this.paramsValue);
                } else {
                    configDiv.html(
                        '<div class=""  id="searcher_' + this.idKey + '" id_key="' + this.idKey + '">' +
                        '<div class="input-wrap"style="width: 200px;height:32px;">' +
                        '<input class="input" style="width: 200px;height: 32px;" type="text" name="fb_keyword" value="">' +
                        '<span class="search-input" key_mark="' + this.idKey + '" onclick="javascript:searchTable(this);" style="height: 32px;"></span>' +
                        '</div>' +
                        '<div class="btn-wrap button_content"></div>' +
                        '<div style="position: relative;">' +
                        '<span class="set-table-btn" style="position: absolute;"></span>' +
                        '<table class="tableObj">' + '</table>' +
                        '</div>' +
                        '<div name="mainTable_gridPager" id="' + this.idKey + '_pager" class="jqGridPager"></div>' +
                        '</div>'
                    );
                    // initReport(me, objectId, this.idKey, this.configDiv, this.paramsValue);
                }
            } else if ("CHART" == this.contentType) {
                // alert("369");
                var chartHeight = 300;
                var height = configDiv.parent().height();
                if (height > 100) {
                    chartHeight = height;
                }
                configDiv.html("<div id='" + this.idKey + "' class='chart'  style='height: " + chartHeight + "px;'></div>");
                var refere = encodeURIComponent(window.location.href);
                var chart = new chartInit(objectId, this.idKey, false, null, {}, {
                    title: {
                        link: "${ctx}/cloud/sys/statistic/chart/show/" + objectId + "?parent_text=工作台&refere=" + refere,
                        target: "self"
                    }
                }, {});
                chart.init();
            }
        } else {
            if ("ASSESS" == this.contentType) {
                var tempHtml = this.configDiv.find(".freemarkerTemplate").html();
                if (tempHtml) {
                    tempHtml = decodeURIComponent(tempHtml);
                }
                var data = getParamsObj(paramsValue);
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

    /*初始化数字组件*/
    function initDigital(tableId, field, configDiv, paramsValue) {
        configDiv.find("[name=digital]").bind("click", function (me) {
            // window.parent.openUrl('${ctx}/cloud/menu/tablelist/' + tableId + "?" + paramsValue, "1", configDiv.find("[name=title]").text(), tableId);
            window.parent.openUrl('./tableList.html?id=' + tableId + "&" + paramsValue, "1", configDiv.find("[name=title]").text(), tableId);
        });
        var data = getParamsObj(paramsValue);
        data.tableId = tableId;
        data.field = field;
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
        $.post(ctx + '/cloud/table/list/reader/digital', data, function (data) {
            if (data.total && data.total > 10) {
                setTimeout(function () {
                    configDiv.find("[name=digital]").text(parseInt(data.total / 5 * 1))
                }, 80);
                setTimeout(function () {
                    configDiv.find("[name=digital]").text(parseInt(data.total / 5 * 2))
                }, 160);
                setTimeout(function () {
                    configDiv.find("[name=digital]").text(parseInt(data.total / 5 * 3))
                }, 240);
                setTimeout(function () {
                    configDiv.find("[name=digital]").text(parseInt(data.total / 5 * 4))
                }, 320);
                setTimeout(function () {
                    configDiv.find("[name=digital]").text(parseInt(data.total))
                }, 400);
            } else {
                configDiv.find("[name=digital]").text(data.total);
            }
        });
    };

    /*初始化表单*/
    function initForm() {

    };
    /*初始化报表*/
    function getParamsObj(pmStr) {
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
    }

    function initReport(me, tableId, idKey, configDiv, paramsValue) {
        configDiv.find(".set-table-btn").bind("click", function (me) {
            openWindow('${ctx}/new/menu/setting.jsp?tableId=' + tableId + '&type=' + table_setting_type + "&hinedHeight=true&showHidePage=true");
        });
        $.ajax({
            type: "post",
            url: ctx + "/cloud/userUiConfig/postGet",
            data: {
                module: tableId,
                type: table_setting_type
            },
            async: false,
            success: function (json) { 
                if (json.result == "Success" || json.result == "SUCCESS") {
                    var jsonMap = json.map;
                    fieldList = jsonMap.fieldList;
                    buttonList = jsonMap.buttonList;
                    configId = jsonMap.configId;
                    tableSetting = jsonMap.tableSetting;
                    var fieldList = jsonMap.fieldList;
                    var buttonList = jsonMap.buttonList;
                    var colList = [];
                    var editDelButtonList = [];
                    if (buttonList != null && buttonList.length > 0) {
                        $.each(buttonList, function (i, button) {
                            buttonConfigList[button.sid] = button;
                            if (button.type == "ADD") {
                                var class_val = JsonButton.spanButton.default_btn_select;
                                if (button.style) {
                                    var mesg = ctx + "/assetsv1/img/list/" + button.style + "_white.png";
                                }
                                configDiv.find(".button_content").append(
                                    '<span id="add_entry" key_id="' + button.sid + '" onclick="javascript:clickButton(this,\'' + idKey + '\');" class="default-btn ' + class_val + '" type="button"  style="margin: 0px 5px;background:rgba(72, 160, 220, 1) url(' + mesg + ') no-repeat 10px center" >' + button.name + '</span>'
                                );
                            } else {
                                if (button.type != "LINK") {
                                    editDelButtonList.push(button);
                                }
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
                                    return textBZ(idKey, date.format(format), field.columnName, x.rowId, n, buttonList);
                                }
                                return textBZ(idKey, v, field.columnName, x.rowId, n, buttonList);;
                            }
                        } else {
                            colObj['formatter'] = function (dbValue, x, n) {
                                return textBZ(idKey, dbValue, field.columnName, x.rowId, n, buttonList);
                            }
                        }
                        colList.push(colObj);
                    });
                    if (editDelButtonList.length > 0) {
                        colList.push({
                            label: "操作",
                            index: "操作",
                            name: "操作",
                            formatter: function (dbValue, x, n) {
                                var buttonStr = '';
                                $.each(editDelButtonList, function (i, button) {
                                    if (n.SHOW_BUTTON_IDS && existString(n.SHOW_BUTTON_IDS, button.sid)) {
                                        var class_val = JsonButton.spanButton.default_btn_select;
                                        if (button.style) {
                                            var mesg = ctx + "/assetsv1/img/list/" + button.style + "_white.png";
                                        }
                                        buttonStr += '<span id="add_entry" key_id="' + button.sid + '" row_id="' + x.rowId + '" bt_type="' + button.type + '" onclick="javascript:clickButton(this,\'' + idKey + '\');" class="default-btn ' + class_val + '" type="button"  style="margin: 0px 5px;background:rgba(72, 160, 220, 1) url(' + mesg + ') no-repeat 10px center" >' + button.name + '</span>'
                                    }
                                });
                                return buttonStr;
                            }
                        });
                        //showColCount++;
                    }
                    var parentObj = configDiv.closest(".set_height_mark");
                    var mark_height;
                    if (parentObj) {
                        var height = parentObj.height() - 110;
                        if (height > 0) {
                            mark_height = height;
                        }
                    }
                    var pager_mark;
                    if (!(tableSetting && tableSetting.isShowPage == 0)) {
                        pager_mark = "#" + me.idKey + "_pager";
                    } else {
                        if (height > 0) {
                            height = height + 35;
                        }
                    }
                    gridObj = configDiv.find(".tableObj").jqGrid({
                        url: ctx + '/cloud/table/list/reader/list',
                        mtype: "POST",
                        styleUI: 'Bootstrap',
                        datatype: "json",
                        scrollrows: true, //行可见,
                        postData: {
                            tableId: tableId
                        },
                        gridComplete: function () {},
                        colModel: colList,
                        viewrecords: true,
                        height: mark_height,
                        rowNum: 20,
                        pager: pager_mark,
                        rownumbers: true,
                        autowidth: true,
                        scroll: false,
                        paramsFun: function () {
                            var data = getParamsObj(paramsValue);
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
                        },
                        loadComplete: function (data) {
                            tableDbRows[idKey] = data.rows;
                        }
                    });
                    tableConfigObj[idKey] = gridObj;
                    tableConfigObj[idKey + "_fieldList"] = fieldList;

                    function textBZ(idKey, text, fieldKey, rowId, data, buttonList) {
                        if (text) {
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
                            //处理超链接
                            if (buttonList && buttonList.length > 0) {
                                $.each(buttonList, function (i, obj) {
                                    if (obj.type == "LINK" && obj.name == fieldKey) {
                                        if (data.SHOW_BUTTON_IDS && data.SHOW_BUTTON_IDS.length > 0) {
                                            for (var mk in data.SHOW_BUTTON_IDS) {
                                                if (data.SHOW_BUTTON_IDS[mk] == obj.sid) {
                                                    text = '<a key_id="' + obj.sid + '" onclick="javascript:clickButton(this,\'' + idKey + '\');" bt_type="LINK" type="button" row_id="' + rowId + '">' + text + '</span>'
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                        }
                        return tableContextHandler(text);
                    }
                } else {
                    tipsMsg(json.resultMsg, "FAIL");
                }
            }
        });

        /*$.get("${ctx}/cloud/userUiConfig/getByTableId",{tableId:me.objectId,mark:0,queryButton:"1"},function(data){
            if(data.result=="Success"){
                var json=data.map;
                var  columnList = columnSet(json,json.buttonList,me.idKey);
                initButton(1,json.showAddButtonIds,$("#searcher_"+me.idKey),json.buttonList,me.idKey);
                $("#searcher_"+me.idKey).find("[complate_key='button']").bind("click",function(json){
                    button_click(this,null,pm);
                });
                var tcobj = {json:json,params:pm};
                tableConfigObj[me.idKey]=tcobj;
                var oTable = $('#'+me.idKey).dataTable({
                    ajax: {
                        url:"${ctx}/cloud/defined/list/report/list",
                        type:"POST",
                    },
                    columns: columnList,
                    "aaSorting": [],
                    "dom": 'rt<"clearfix custom-data-length"lifp>',
                    "lengthMenu": [ 10, 50, 100, 500, 1000 ],
                    fnDrawCallback: function () {
                        initOpenForm(me.configDiv);
                        tableLoadingAfter(oTable);
                        $("[key='more_button_event']").each(function (i,obj){
                            var me = $(obj);
                            var btnStr = $(me.parent().find("[key='more_button']")[0]).html();
                            me.popover({
                                html : true,
                                placement:"bottom",
                                title: function() {
                                    return "功能按钮组";
                                },
                                content: function() {
                                    return btnStr;
                                }
                            });
                        });
                        $('.show_fj_click_1').bind("click",function(){
                            var obj=$(this);
                            var mark=obj.attr("mark");
                            if(mark=="1"){
                                $(obj.find("div")[0]).hide();
                                obj.attr("mark","0");
                            }else{
                                $(obj.find("div")[0]).show();
                                obj.attr("mark","1");
                            }
                        });
                        titlePopover();
                    }
                });
                var tcobj = {json:json,table:oTable,params:pm};
                tableConfigObj[me.idKey]=tcobj;
            }else{
                Notify(data.resultMsg, 'top-right', '5000', 'danger', 'fa-bolt', true);
            }
        },"json");*/
    };
    /*初始化图标*/
    function initChart() {};

    function columnSet(options, buttonList, idKey) {
        if (options.items == undefined || options.items == null || options.items == "" || options.items.length == 0) {
            alert("请添加items设置项");
            return;
        }
        db_items = options.items;
        var col_attr = [];
        var columns = [];
        for (var i = 0; i < db_items.length; i++) {
            var item = db_items[i];
            if (item.propcn === "表头互选字段root_field_id") {
                columns[columns.length] = {
                    "sTitle": "<input title='全选' type='checkbox' class='group-checkable' value='0' name='bootstarp_data_table_checkbox'>",
                    "sClass": "left selected",
                    "bVisible": true,
                    "sWidth": "2%",
                    "bSortable": false,
                    "bSearchable": false,
                    "mData": item.prop,
                    "mRender": function (value) {
                        return "<input title='选择' type='checkbox' key='root_checkbox' class='checkboxes' name='bootstarp_data_table_checkbox' value='" + value + "'>";
                    }
                }
                col_attr.push({});
                break;
            }
        }
        $.each(options.items, function (i, v) {
            if (v.isShow) {
                if (v.propcn != "表头互选字段root_field_id") {
                    col_attr.push({
                        format: v.format,
                        v: v
                    });
                    columns[columns.length] = {
                        data: v.prop,
                        sTitle: v.propcn,
                        bSortable: v.isSort,
                        "mRender": function (dbValue, a, b, c) {
                            var vobj = col_attr[c.col].v;
                            var html = fieldMRender(dbValue, vobj);
                            var isHtml = (html && (html + "").indexOf("<div") != -1) ? true : false;
                            html = getLinkText(vobj.prop, html, c.row, buttonList);
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
        if (buttonList && buttonList.length > 0) {
            var buttonCount = 0;
            for (var i = 0; i < buttonList.length; i++) {
                var button = buttonList[i];
                if (button.buttonType != "ADD") {
                    buttonCount++;
                }
            }
            if (buttonCount > 0) {
                columns[columns.length] = {
                    data: function (item, a, b, c, d) {
                        var row = c.row;
                        var tempDiv = $("<div/>");
                        initButton("2", item.judge_show_button_ids, tempDiv, buttonList, idKey);
                        var html = tempDiv.html();
                        html = html.replace(/11=\"11\"/g, "onclick='javascript:button_click(this," + row + ");'");
                        if (tempDiv.find("[complate_key='button']").length > 3) {
                            return '<a href="javascript:void(0);" key="more_button_event" class="btn btn-default opt" ><i class="fa fa-edit"></i></a><div style="display:none;" key="more_button">' + html + '</div>';
                        } else {
                            return html;
                        }
                    },
                    bSortable: false,
                    bSearchable: false,
                    title: "操作"
                };
            }
        }
        columns[columns.length] = {
            data: idKey,
            sTitle: idKey,
            visible: false
        };
        return columns;
    }

    function initButton(type, showIds, divObj, buttonListJson, idKey) {
        if (buttonListJson && buttonListJson.length > 0) {
            for (var i = 0; i < buttonListJson.length; i++) {
                var bojb = buttonListJson[i];
                if (bojb.buttonType == "LINK") {
                    continue;
                }
                if ((type == "1" && bojb.buttonType == "ADD") || (type == "2" && bojb.buttonType != "ADD")) {
                    if (showIds && showIds.length > 0) {
                        var showIdsValue = showIds.split(",");
                        var isShow = false;
                        for (var j = 0; j < showIdsValue.length; j++) {
                            if (bojb.definedListButtonId == showIdsValue[j]) {
                                isShow = true;
                                break;
                            }
                        }
                        if (!isShow)
                            continue;
                    }
                    var buttonObj = getButton(bojb.definedListButtonId, bojb, idKey);
                    if (buttonObj) {
                        if (type == "1") {
                            divObj.prepend(buttonObj);
                        } else {
                            divObj.append(buttonObj);
                        }
                    }
                }
            }
        }
    }
};



// require.config({
//     paths: {
//         echarts: '${ctx}/lib/js/echarts-2.2.7'
//     }
// });
var isReload = false;
var echart;

// function chartInit(chartId, divId, isShowTable, tableDivId, config, formDB) {
//     this.chartId = chartId;
//     this.divId = divId;
//     this.isShowTable = isShowTable;
//     this.tableDivId = tableDivId;
//     this.formDB = formDB;
//     this.config = config;
//     this.titleObj = {};
//     if (config && config.title) {
//         this.titleObj = config.title;
//     }
//     this.getPieOption = function (chart, tableList, valueMap) {
//         var table = tableList[0];
//         var tableId = table.id;
//         var dbList = valueMap[tableId];
//         var config = getConfigById(valueMap.chartConfigList, tableId);
//         if (dbList && config) {
//             var dbConfig = getObjValue(dbList, config)
//             var xData = [];
//             var yData = [];
//             var dataArray = dbConfig.data;
//             for (var p in dataArray) {
//                 xData.push(p);
//                 yData.push({
//                     value: dataArray[p],
//                     name: p
//                 });
//             }
//             this.titleObj.x = "center";
//             if (!this.titleObj.text) {
//                 this.titleObj.text = chart.name;
//             }
//             return {
//                 title: this.titleObj,
//                 backgroundColor: "#fbfbfb",
//                 tooltip: {
//                     trigger: 'item',
//                     formatter: "{a} <br/>{b} : {c} ({d}%)"
//                 },
//                 legend: {
//                     orient: 'vertical',
//                     x: 'left',
//                     data: xData
//                 },
//                 calculable: true,
//                 series: [{
//                     name: name,
//                     type: 'pie',
//                     radius: '60%',
//                     center: ['50%', '60%'],
//                     data: yData
//                 }]
//             };
//         }
//     };
//     this.getLinAndBarOption = function (chart, tableList, valueMap) {
//         var objList = [];
//         var legend = [];
//         var configList = valueMap.chartConfigList;
//         for (var i = 0; i < configList.length; i++) {
//             var config = configList[i];
//             var tableId = config.tableId;
//             var dbList = valueMap[tableId];
//             if (dbList && config) {
//                 legend.push(config.label);
//                 objList.push(getObjValue(dbList, config));
//             }
//         };
//         var configDB = getConfigDb(objList);
//         var series = [];
//         var colorS = [];
//         for (var i = 0; i < configDB.yData.length; i++) {
//             var config = configDB.yData[i];
//             var label = config.label;
//             var data = config.data;
//             var showType = (config.showType == "LINE" ? "line" : "bar");
//             series.push({
//                 name: label,
//                 type: showType,
//                 data: data
//             });
//             colorS.push(config.color);
//         }
//         if (!this.titleObj.text) {
//             this.titleObj.text = chart.name;
//         }
//         this.titleObj.x = "left";
//         return {
//             color: colorS,
//             backgroundColor: "#fbfbfb",
//             title: this.titleObj,
//             tooltip: {
//                 trigger: 'axis'
//             },
//             smooth: true,
//             legend: {
//                 data: legend,
//                 x: 'center'
//             },
//             calculable: true,
//             xAxis: [{
//                 type: 'category',
//                 data: configDB.xData
//             }],
//             yAxis: [{
//                 type: 'value'
//             }],
//             series: series
//         };
//     };

//     function getObjValue(dbList, config) {
//         if (dbList && config) {
//             var xValue = config.xValue;
//             var yValue = config.yValue;
//             var ob_value = {
//                 xValue: xValue,
//                 yValue: yValue,
//                 color: config.color,
//                 label: config.label,
//                 showType: config.showType
//             };
//             var da = {};
//             for (var z = 0; z < dbList.length; z++) {
//                 var db = dbList[z];
//                 var xv = db[xValue];
//                 if (xv) {
//                     var yv = db[yValue];
//                     if (!yv) yv = 0;
//                     da[xv] = yv;
//                 }
//             }
//             ob_value['data'] = da;
//             return ob_value;
//         }
//     }

//     function getConfigDb(db_config) {
//         if (db_config.length > 0) {
//             var title_config = {};
//             var xData = [];
//             var yData = [];
//             for (var i = 0; i < db_config.length; i++) {
//                 var config = db_config[i].data;;
//                 for (var p in config) {
//                     if (!title_config[p]) {
//                         title_config[p] = xData.length + 1;
//                         xData.push(p);
//                     }
//                 }
//             }
//             for (var i = 0; i < db_config.length; i++) {
//                 var config = db_config[i].data;
//                 var data = [];
//                 for (var t in title_config) {
//                     var value = config[t];
//                     if (value) {
//                         data.push(value);
//                     } else {
//                         data.push(0);
//                     }
//                 }
//                 db_config[i].data = data;
//             }
//             return {
//                 xData: xData,
//                 yData: db_config
//             };
//         }
//     }

//     function getConfigById(configList, tableId) {
//         if (configList && configList.length > 0) {
//             for (var i = 0; i < configList.length; i++) {
//                 if (configList[i].tableId == tableId) {
//                     return configList[i];
//                 }
//             }
//         }
//     }
//     this.refursh = function () {
//         this.init();
//     }
//     this.init = function () {
//         var me = this;
//         $.get(ctx + "/cloud/db/statistic/chart/" + me.chartId, me.formDB, function (json) {
//             if (json.result == "SUCCESS") {
//                 var map = json.map;
//                 if (map.tableList && map.tableList.length > 0) {
//                     var chart = map.chart;
//                     if (chart) {
//                         if (chart.chartType == 'pie') {
//                             console.log("div id:" + me.divId + "\t" + chart.chartType);
//                             var option = me.getPieOption(chart, map.tableList, map);
//                             if (option) {
//                                 if (isReload) {
//                                     var myChart = echart.init(document.getElementById(me.divId), 'macarons');
//                                     window.onresize = myChart.resize;
//                                     myChart.setOption(option);
//                                     window.onresize = myChart.resize;
//                                     return;
//                                 }
//                                 // require(
//                                 //     [
//                                 //         'echarts',
//                                 //         'echarts/chart/line', // 按需加载所需图表，如需动态类型切换功能，别忘了同时加载相应图表
//                                 //         'echarts/chart/bar',
//                                 //         'echarts/chart/pie'
//                                 //     ],
//                                 //     function (ec) {
//                                 //         isReload = true;
//                                 //         echart = ec;
//                                 //         var myChart = echart.init(document.getElementById(me.divId), 'macarons');
//                                 //         window.onresize = myChart.resize;
//                                 //         myChart.setOption(option);
//                                 //         window.onresize = myChart.resize;
//                                 //     }
//                                 // );
//                             } else {
//                                 Notify("生成图表配置失败", 'top-right', '5000', 'danger', 'fa-bolt', true);
//                             }
//                         } else {
//                             console.log("div id:" + me.divId + "\t" + chart.chartType);
//                             var option = me.getLinAndBarOption(chart, map.tableList, map);
//                             if (option) {
//                                 if (isReload) {
//                                     var myChart = echart.init(document.getElementById(me.divId), 'macarons');
//                                     window.onresize = myChart.resize;
//                                     myChart.setOption(option);
//                                     window.onresize = myChart.resize;
//                                     return;
//                                 }
//                                 // require(
//                                 //     [
//                                 //         'echarts',
//                                 //         'echarts/chart/line', // 按需加载所需图表，如需动态类型切换功能，别忘了同时加载相应图表
//                                 //         'echarts/chart/bar',
//                                 //         'echarts/chart/pie'
//                                 //     ],
//                                 //     function (ec) {
//                                 //         isReload = true;
//                                 //         echart = ec;
//                                 //         var myChart = echart.init(document.getElementById(me.divId), 'macarons');
//                                 //         window.onresize = myChart.resize;
//                                 //         myChart.setOption(option);
//                                 //         window.onresize = myChart.resize;
//                                 //     }
//                                 // );
//                             } else {
//                                 Notify("生成图表配置失败", 'top-right', '5000', 'danger', 'fa-bolt', true);
//                             }
//                         }
//                         if (me.isShowTable == true && me.tableDivId) {
//                             showTable(map.tableList, map, me.tableDivId, me.chartId);
//                         }
//                     } else {
//                         Notify("图表不存在", 'top-right', '5000', 'danger', 'fa-bolt', true);
//                     }
//                 } else {
//                     Notify("没有给图表配置统计表", 'top-right', '5000', 'danger', 'fa-bolt', true);
//                 }
//             } else {
//                 Notify(json.resultMsg, 'top-right', '5000', 'danger', 'fa-bolt', true);
//             }
//         });
//     }
// };

function showTable(tableList, valueMap, divId, chartId) {
    var tableIdList = "";
    if (tableList && tableList.length > 0) {
        var tableContent = $("#" + divId);
        tableContent.html("");
        for (var i = 0; i < tableList.length; i++) {
            var table = tableList[i];
            var tableId = table.id;
            var dbList = valueMap[tableId];
            var tableName = table.name;
            var fieldList = table.fieldList;
            if (tableIdList.indexOf("," + tableId + ",") == -1) {
                tableIdList += "," + tableId + ",";
            } else {
                continue;
            }
            if (fieldList && fieldList.length > 0) {
                var heandHtml = "";
                var bodyTrHtml = "";
                for (var j = 0; j < fieldList.length; j++) {
                    heandHtml += "<th>" + fieldList[j].fieldName + "</th>";
                }
                for (var j = 0; j < dbList.length; j++) {
                    bodyTrHtml += "<tr>";
                    var rowDB = dbList[j];
                    for (var z = 0; z < fieldList.length; z++) {
                        var value = rowDB[fieldList[z].fieldKey];
                        if (!value) {
                            value = "";
                        }
                        bodyTrHtml += "<td>" + value + "</td>";
                    }
                    bodyTrHtml += "</tr>";
                }
                var tableHtml =
                    "<div class='col-xs-12 col-md-12'>" +
                    "<div class='well with-header  with-footer'>" +
                    "<div class='header bg-blue'>" + tableName +
                    '<a href="javascript:;" style="float: right;"  onclick="javascript:cleanCache(this);" url="' + ctx + '/cloud/sys/chart/init/' + chartId + '?cleanCatch=cleanCatch"><i class="fa fa-refresh"></i></a>' +
                    "</div>" +
                    "<table class='table table-hover'>" +
                    "<thead class='bordered-darkorange'>" +
                    "<tr>" + heandHtml + "</tr>" +
                    "</thead>" +
                    "<tbody>" +
                    bodyTrHtml +
                    "</tbody>" +
                    "</table>" +
                    "</div>" +
                    "</div>";
                tableContent.append($(tableHtml));
            }
        }
    }
}

var JsonButton = {
    "commonButton": { //常用按钮
        "default_btn": "default-btn", //默认按钮  白色边框
        "default_white_btn": "default-white-btn", //白色背景 配合default-btn一起使用 因为没设置宽和高
        "btn_field": "btn-field", //按钮选中的时候 配合default-btn一起使用
        "btn_add": "btn-add", //新增
        "query_btn_check": "query-btn-check", //确认按钮
        "btn_cancle_gray": "btn-cancle-gray" //取消按钮 配合default-btn使用
    },
    "button_btn": { //位置按钮
        "default_btn_img": "default-btn-img", //默认位置按钮
        "copy_btn_check": "copy-btn-check", //复制按钮 (未选中)
        "pencil_btn_check": "pencil-btn-check", //编辑按钮 (未选中)
        "delete_btn_check": "delete-btn-check", //删除按钮
        "add_btn_check": "add-btn-check", //添加按钮 (未选中)
        "download_btn_check": "download-btn-check", //下载按钮 (未选中)
        "label_btn_check": "label-btn-check", //(未选中)
        "queding_btn_check": "queding-btn-check", //确定按钮 (未选中)
        "del_btn_check": "del-btn-check", //关闭按钮 (未选中)

        //已选中
        "copy_btn_check_select": "copy-btn-check-select", //复制按钮
        "pencil_btn_check_select": "pencil-btn-check-select", //编辑按钮
        "delete_btn_check_select": "delete-btn-check-select", //删除按钮
        "add_btn_check_select": "add-btn-check-select", //添加按钮
        "download_btn_check_select": "download-btn-check-select", //下载按钮
        "label_btn_check_select": "label-btn-check-select", //
        "queding_btn_check_select": "queding-btn-check-select", //确定按钮
        "del_btn_check_select": "del-btn-check-select" //关闭按钮
    },
    "spanButton": { //span定义的按钮
        "default_btn": "default-btn", //默认按钮  宽度一样 白色背景
        "btn_ok": "btn-ok", //配合default-btn使用 确认按钮
        "default_btn_select": "default-btn-select"
    },
    "iconDotColor": {
        "icon_dot_red": "icon-dot-red", //红色
        "icon_dot_blue": "icon-dot-blue", //蓝色
        "icon_dot_green": "icon-dot-green", //绿色
        "icon_dot_gray": "icon-dot-gray", //灰色
        "icon_dot_yellow": "icon-dot-yellow", //黄色
        "icon_dot_resolved": "icon-dot-resolved", //已解决
        "icon_dot_huifu": "icon-dot-huifu", //已恢复
        "icon_dot_close": "icon-dot-close", //已关闭
        "icon_dot_audit": "icon-dot-audit", //待审核图标
        "icon_dot_design": "icon-dot-design", //设计中
        "icon_dot_develop": "icon-dot-develop", //开发中
        "icon_dot_develop_complete": "icon-dot-develop-complete" //开发完成
    },
    "bgColorBtn": {
        "bg_red": "red",
        "bg_green": "green",
        "bg_green2": "#31be91",
        "bg_blue": "blue",
        "bg_black": "black",
        "bg_transparent": "transparent",
        "bg_ccc": "#ccc",
        "bg_666": "#666",
        "bg_999": "#999",
        "bg_f6f6f6": "#f6f6f6",
        "bg_FFF68F": "#FFF68F",
        "bg_DB7093": "#DB7093",
        "bg_B0C4DE": "#B0C4DE",
        "bg_66CDAA": "#66CDAA",
        "bg_0000EE": "#0000EE", ///FF0000

        "bg_FF0000": "#FF0000",
        "bg_FFFF00": "#FFFF00",
        "bg_00FF00": "#00FF00",
        "bg_00FFFF": "#00FFFF",
        "bg_0000FF": "#0000FF",
        "bg_802A2A": "#802A2A",
        "bg_000000": "#000000",
        "bg_FFFFFF": "#FFFFFF",
        "bg_CCCCCC": "#CCCCCC",
        "bg_D2B48C": "#D2B48C",
        "bg_191970": "#191970",
        "bg_31be91": "#31be91", //绿色
        "bg_fd6a03": "#fd6a03", //橙色
        "bg_57a3f1": "#57a3f1", //深蓝色
        "bg_f6f6f6": "#f6f6f6",
        "bg_CCC": "#CCC",
        "bg_FFC0CB": "#FFC0CB"
    }
}

var littleToolFun = {
    labelBlur: function (me) {},
    labelSelect: function (me) {
        var me = $(this);
        if (me.attr("label_id") && me.attr("label_name")) {
            if (me.attr("mark") == 0) {
                me.addClass("label_input_selected");
                me.attr("mark", "1");
            } else {
                me.removeClass("label_input_selected");
                me.attr("mark", "0");
            }
        }
    },
    getSelectLabel: function () {
        var data = {
            labelStr: "",
            labels: []
        };
        $("#chooseLabelModal").find(".modal-body").find("input[key=label]").each(function (i, obj) {
            var obj = $(obj);
            if (obj.attr("mark") == "1") {
                data.labelStr = data.labelStr ? (data.labelStr += ',' + obj.val()) : obj.val();
                data.labels.push({
                    labelId: obj.attr("label_id"),
                    labelName: obj.attr("label_name"),
                    typeId: obj.attr("type_id"),
                    typeName: obj.attr("type_name")
                });
            }
        });
        return data;
    }
};
var littleTool = function (config) {
    var me = this;
    me.config = config;
    me.dataLabel;
    me.openModal = function () {
        var thisObj = this;
        $("#chooseLabelModal").find(".modal-footer").html('<button type="button" class="btn btn-primary label_submit" onclick="">保存</button> <button type="button" class="btn btn-default label_close">关闭</button>');
        $("#chooseLabelModal").find(".modal-footer").find(".label_submit").bind("click", function () {
            var obj = config.obj;
            var data = littleToolFun.getSelectLabel();
            obj.parent().find(".showLable").html("");
            if (data.labels && data.labels.length > 0) {
                $.each(data.labels, function (i, lab) {
                    obj.parent().find(".showLable").append('<span class="label label_input_selected">' + lab.labelName + '</span>');
                });
            }
            obj.val(JSON.stringify(data));
            thisObj.closeModal();
            if (config.backFun) {
                try {
                    config.backFun();
                } catch (e) {};
            }
        });
        $("#chooseLabelModal").find(".modal-footer").find(".label_close").bind("click", function () {
            me.closeModal();
        });
        $("#chooseLabelModal").modal();
    };
    me.removeLabelDb = function (labelObj) {
        var me = this;
        if (labelObj && labelObj.labelId && labelObj.labelName && labelObj.typeId && labelObj.typeName) {
            if (me.dataLabel && me.dataLabel[labelObj.typeId]) {
                var childs = me.dataLabel[labelObj.typeId].childs;
                var newChilds = [];
                for (var j = 0; j < childs.length; j++) {
                    if (childs[j].labelId != labelObj.labelId) {
                        newChilds.push(childs[j]);
                    }
                }
                me.dataLabel[labelObj.typeId].childs = newChilds;
            }
        }
    };
    me.addLabelDb = function (labelObj) {
        var me = this;
        if (labelObj && labelObj.labelId && labelObj.labelName && labelObj.typeId && labelObj.typeName) {
            if (me.dataLabel && me.dataLabel[labelObj.typeId]) {
                me.dataLabel[labelObj.typeId].childs.push(labelObj);
            }
        }
    }
    me.closeModal = function () {
        $("#chooseLabelModal").modal("hide");
    };
    me.loadLabel = function () { //加载
        if (me.dataLabel) {
            showLabel();
        } else {
            $.get(ctx + "/cloud/hoLabel/findLabelList", {
                type: me.config.idKey
            }, function (json) {
                if (json.result == "Success" || json.result == "SUCCESS") {
                    var rows = json.rows;
                    me.dataLabel = {};
                    for (var i = 0; i < rows.length; i++) {
                        var row = rows[i];
                        if (row.typeId && row.typeName && row.labelId && row.labelName) {
                            if (!me.dataLabel[row.typeId]) {
                                me.dataLabel[row.typeId] = {
                                    typeId: row.typeId,
                                    typeName: row.typeName,
                                    childs: []
                                };
                            }
                            me.dataLabel[row.typeId]["childs"].push({
                                labelId: row.labelId,
                                labelName: row.labelName,
                                isPublic: row.isPublic
                            });
                        }
                    }
                    showLabel();
                } else {
                    tipsMsg(json.resultMsg, "FAIL");
                }
            });
        }

        function showLabel() {
            function existLabel(labelId, typeId) {
                var obj = me.config.obj;
                var defaultValue = $.trim(obj.val());
                var defaultData = [];
                if (defaultValue) {
                    try {
                        defaultData = JSON.parse(defaultValue)
                    } catch (e) {}
                    if (defaultData && defaultData.labels && defaultData.labels.length > 0) {
                        for (var i = 0; i < defaultData.labels.length; i++) {
                            var label = defaultData.labels[i];
                            if (label.labelId == labelId && label.typeId == typeId) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            }
            if (me.dataLabel) {
                var html = "";
                var existLabelIds = {};
                for (var i in me.dataLabel) {
                    var ltObj = me.dataLabel[i];
                    if (ltObj.typeId && ltObj.typeName) {
                        html += '<div class="labelContainer"><div class="verticalTop" style="width: 70px;float: left;text-align: right;">' + ltObj.typeName + ':</div><div class="chooseLabelArea" type_key_id="' + ltObj.typeId + '" style="position: relative">';
                        if (ltObj.childs && ltObj.childs.length > 0) {
                            for (var j = 0; j < ltObj.childs.length; j++) {
                                var label = ltObj.childs[j];
                                var selectText = existLabel(label.labelId, ltObj.typeId) ? " mark='1' class='label_input_selected' " : "mark='0'";
                                if (selectText != "mark='0'") {
                                    existLabelIds[label.labelId] = "1";
                                }
                                html += '<span style="position: relative;"><input type="text" key="label"  onmouseover="this.style.cursor=\'hand\'"  ' + selectText + ' type_name="' + ltObj.typeName + '" type_id="' + ltObj.typeId + '" label_id="' + label.labelId + '" label_name="' + label.labelName + '" value="' + label.labelName + '" onkeydown="this.onkeyup();" onkeyup="this.size=(this.value.length>3 ?this.value.length:3);" size="7" maxlength="15" readonly="" style="width: auto;">';
                                if (!(label.isPublic && label.isPublic == "1")) {
                                    html += '<span class="deleteLabel" style="position: absolute;top: -4px;right: 16px;width:8px;border: none;border-radius: 50%;cursor: pointer;"><img src="../../../src/images/common/delete_04.png" width="8" height="8"/></span>';
                                }
                                html += '</span>';
                            }
                        }
                        html += '<span class="addLabel pointer"  type_id="' + ltObj.typeId + '" type_name="' + ltObj.typeName + '" style="position: absolute;right:-25px;bottom:-5px;width: 55px;height: 30px;color: #48a1dd;Z-INDEX: 100; "><img class="middle label_add_img" src="../../../src/images/common/add-selete.png" alt="新增"/></span>';
                        html += '</div></div>';
                    }
                }
                var defaultValue = $.trim(me.config.obj.val());
                if (defaultValue) {
                    var defData = JSON.parse(defaultValue);
                    if (defData && defData.labels && defData.labels.length > 0) {
                        for (var i = 0; i < defData.labels.length; i++) {
                            var lobj = defData.labels[i];
                            if (!(existLabelIds[lobj.labelId] && existLabelIds[lobj.labelId] == "1")) {
                                var html = '<span style="position: relative;"><input type="text" key="label"  onmouseover="this.style.cursor=\'hand\'"  mark="0" type_name="' + lobj.typeName + '" type_id="' + lobj.typeId + '" label_id="' + lobj.labelId + '" label_name="' + lobj.labelName + '" value="' + lobj.labelName + '" onkeydown="this.onkeyup();" onkeyup="this.size=(this.value.length>3 ?this.value.length:3);" size="7" maxlength="15" readonly="" style="width: auto;"></span>';
                                $($("div[type_key_id='" + lobj.typeId + "']")[0]).append(html);
                            }
                        }
                    }
                }
                $("#chooseLabelModal").find(".modal-body").html(html);
                $("#chooseLabelModal").find(".modal-body").find("input[key=label]").each(function (i, obj) {
                    obj = $(obj);
                    if (!(obj.attr("event_mark") == "1")) {
                        obj.bind("click", littleToolFun.labelSelect);
                        obj.attr("event_mark", "1");
                    }
                });
                $("#chooseLabelModal").find(".modal-body").find(".deleteLabel").bind("click", function () {
                    var obj = $(this);
                    var labelInput = $(obj.parent().find("input[key=label]")[0]);
                    var labelId = labelInput.attr("label_id");
                    var labelName = labelInput.attr("label_name");
                    var typeId = labelInput.attr("type_id");
                    var typeName = labelInput.attr("type_name");
                    if (labelId) {
                        $.post(ctx + "/cloud/hoLabel/remove", {
                            id: labelId
                        }, function (json) {
                            if (json.isOk) {
                                var labelObj = {
                                    labelId: labelId,
                                    labelName: labelName,
                                    typeId: typeId,
                                    typeName: typeName
                                };
                                me.removeLabelDb(labelObj);
                                obj.parent().remove();
                            } else {
                                alert(json.msg);
                            }
                        })
                    }
                });
                $("#chooseLabelModal").find(".modal-body").find("input[key=label]").attr("")
                $("#chooseLabelModal").find(".modal-body").find(".addLabel").bind("click", function () {
                    var labelInputObj = $(this);
                    var typeId = labelInputObj.attr("type_id");
                    var typeName = labelInputObj.attr("type_name");
                    labelInputObj.parent().append('<input type="text" key="label" new_mark="1" type_id="' + typeId + '" type_name="' + typeName + '" onmouseover="this.style.cursor=\'hand\'" onkeydown="this.onkeyup();" onkeyup="this.size=(this.value.length>3 ?this.value.length:3);" size="3" maxlength="15"/>');
                    $("#chooseLabelModal").find(".modal-body").find("input[key=label]").each(function (i, obj) {
                        obj = $(obj);
                        if (!(obj.attr("event_mark") == "1")) {
                            obj.bind("click", littleToolFun.labelSelect);
                            obj.attr("event_mark", "1");
                        }
                    });

                    $("#chooseLabelModal").find(".modal-body").find("input[new_mark=1]").bind("blur", function () {
                        var obj = $(this);
                        obj.attr("new_mark", "0");
                        var value = $.trim(obj.val());
                        var typeId = obj.attr("type_id");
                        if (value && typeId && !(obj.attr("sendMark") == "1")) {
                            var etObj;
                            obj.parent().find("input[key=label]").each(function (i, o) {
                                var o = $(o);
                                if (o.attr("label_id")) {
                                    if (value == o.val()) {
                                        etObj = o;
                                    }
                                }
                            });
                            obj.attr("readOnly", "true");
                            obj.css("width", "auto");
                            obj.attr("sendMark", "1");
                            if (etObj) {
                                obj.attr("label_id", etObj.attr("label_id"));
                                obj.attr("label_name", etObj.attr("label_name"));
                                obj.attr("type_name", etObj.attr("type_name"));
                                return;
                            }
                            $.get(ctx + "/cloud/hoLabel/saveLabel", {
                                "type": typeId,
                                "labelName": value
                            }, function (json) {
                                if (json.result == "Success" || json.result == "SUCCESS") {
                                    var label = json.map.label;
                                    obj.attr("label_id", label.id);
                                    obj.attr("label_name", label.name);
                                    var labelObj = {
                                        labelId: obj.attr("label_id"),
                                        labelName: obj.attr("label_name"),
                                        typeId: obj.attr("type_id"),
                                        typeName: obj.attr("type_name")
                                    };
                                    me.addLabelDb(labelObj);
                                } else {
                                    tipsMsg(json.resultMsg, "FAIL");
                                }
                            });
                        }
                    });
                });
                me.openModal();
            }
        }
    };
    me.initConfig = function () {
        if (config.type && config.obj && config.idKey) {
            if ("label" == config.type) {
                config.obj.hide();
                var defautValue = config.obj.val();
                var defStr = '';
                if (defautValue) {
                    try {
                        var jsonValue = JSON.parse(defautValue);
                        if (jsonValue.labels && jsonValue.labels.length > 0) {
                            $.each(jsonValue.labels, function (i, label) {
                                defStr += '<span class="label label_input_selected">' + label.labelName + '</span>';
                            });
                        }
                    } catch (e) {};
                }
                config.obj.parent().append("<span class='showLable' style='padding-left: 10px;'>" + defStr + "</span><img class='middle selectLabelButton' src='../../../src/images/common/add-selete.png' alt='新增'/>");
                config.obj.parent().find(".selectLabelButton").bind("click", function () {
                    me.loadLabel();
                });
            }
        }
    }
};
function initUPPic(fileObj,img,selectFileBakFun,successBakFun,buttonText){
		var displayTxt="";
		if(selectFileBakFun || successBakFun){
			displayTxt="display:none;";
		}
		var initImg = getInitImg(img);
		var div =$(fileObj.parent().find("div[key=upload]")[0]);
		var createHtml='<div class="picture-wrap"><div class="col click_button"><input id="fileImage" style="display: none;" type="file" size="30" name="fileselect[]"  multiple><div class="img-box btn-img-box click_picture"><a href="javascript:void(0);" class="btn btn-warning  btn-circle btn-lg"><i class="glyphicon glyphicon-camera"></i></a></div></div></div>';
		div.zyUpload({
			url              :    '${ctx}/cloud/upload/hospital/hospital', //上传的地址
			initUrl:initImg,
			multiple         :   true,                    // 是否可以多个文件上传
			suffix:"jpg,png,gif,jpeg",
			createHtml:createHtml,
			clickClass:"click_picture",
			/* 外部获得的回调接口 */
			onSelect: function(files, allFiles,boj,ZYFILE){
				var i = 0;
				var html = '', i = 0;
				// 组织预览html
				var funDealtPreviewHtml = function(fList) {
					for(var z=0;z<fList.length;z++){
						var file = fList[z];
						var reader = new FileReader();
						reader.onload = function(e) {
							html+=  '<div class="col" style="'+displayTxt+'" key="'+file.index+'">'+
									'<div class="img-box">'+
									'<div class="shadow-bg">'+
									'<i class="fa fa-spinner fa-spin"></i>'+
									'</div>'+
									'<img src="'+e.target.result+'" alt=""/><em class="removePic" index="'+file.index+'" mark="1" title="删除"><i class="glyphicon glyphicon-remove"></i></em><input type="hidden" key="url">' +
									'</div>' +
									'</div>';
							i++;
							$(boj).find(".click_button").before(html);
							$(boj).find(".removePic").bind("click",function(){
								var obj = $(this);
								if(obj.attr("mark")=="1"){
									var index = $(this).attr("index");
									$(this).parent().parent().remove();
									ZYFILE.funDeleteFile(index,false);
									obj.attr("mark","0");
								}
							});
							if(selectFileBakFun){
								selectFileBakFun(file,e.target.result,fileObj);
							}
						}
						reader.readAsDataURL(file);
					}
				};
				function funAppendPreviewHtml(){
					for(var z=0;z<files.length;z++){
						try{
							ZYFILE.funUploadFile(files[z]);
						}catch(e){console.log("error:\t"+e);}
					}
					funDealtPreviewHtml(files);
				}
				funAppendPreviewHtml();
			},
			onDelete: function(file, surplusFiles){                     // 删除一个文件的回调方法
				console.info("当前删除了此文件：");
				console.info(file);
				console.info("当前剩余的文件：");
				console.info(surplusFiles);
			},
			initImg:function(files,boj){
				if(!files || files.length==0)
					return;
				var html = "";
				for(var i=0;i<files.length;i++){
					var file = files[i];
					html+=  '<div class="col" key="'+file.index+'">'+
							'<div class="img-box">'+
							'<div class="shadow-bg" style="display: none">'+
							'<i class="fa fa-spinner fa-spin"></i>'+
							'</div>'+
							'<img src="'+file.url+'" alt=""/><em onclick="javascript:$(this).parent().parent().remove();"><i class="glyphicon glyphicon-trash"></i></em><input type="hidden" key="url" value="'+file.url+'">' +
							'</div>' +
							'</div>';
				}
				$(boj).find(".click_button").before(html);
			},
			onSuccess: function(file, response,obj){                    // 文件上传成功的回调方法
				var obj = $(obj);
				var index=file.index;
				if(response){
					response=eval('('+response+')');
				}
				if(response.status==true){
					var divObj=$(obj.find("div[key='"+index+"']")[0]);
					divObj.find("img").attr("src",response.url);
					divObj.find("input").val(response.url);
					divObj.find(".shadow-bg").hide();
					if(successBakFun){
						successBakFun(file,response,fileObj);
					}
				}else{
					alert("上传失败");
				}
			},
			onFailure: function(file){                    // 文件上传失败的回调方法
				console.info("此文件上传失败：");
				console.info(file);
			},
			onComplete: function(responseInfo){           // 上传完成的回调方法
				console.info("文件上传完成");
				console.info(responseInfo);
			}
		});

		function getInitImg(img){
			var initImg=[];
			if(img){
				img = $.trim(img);
				if(img.length>0){
					var img_array = img.split(",");
					for(var i=0;i<img_array.length;i++){
						var url = $.trim(img_array[i]);
						if(url){
							initImg.push({index:"init_"+i,url:url});
						}
					}
				}
			}
			return initImg;
		}
	}
	/**
	 * 文件上传  新增回调方法
	 * selectFileBakFun 选择文件后回调  入参 fiel={id,name,size文件信息}
	 * successBakFun 上传成功后回调   入参  file ,response={url：上传后的文件地址}
	 * **/
	function initUPFile(fileObj,fileStr,selectFileBakFun,successBakFun,buttonText){
		var files = getInitFile(fileStr);
		var div =$(fileObj.parent().find("div[key=upload]")[0]);
		var btxt = "添加附件";
		if(buttonText){
			btxt=buttonText;
		}
		var createHtml='<div class="container-fluid fujian-wrap">'+
				'<input  style="display: none;" type="file" size="30" name="fileselect[]"  multiple>'+
				'<span class="icon-right add-fj click_up_file">'+
				'<a class="btn btn-link" href="javascript:void(0);"><i class="glyphicon glyphicon-paperclip"></i>'+btxt+'</a>'+
				'</span>'+
				'</div>'
		div.zyUpload({
			url              :    '${ctx}/cloud/upload/hospital/uploadFile', //上传的地址
			initUrl:files,
			clickClass:"click_up_file",
			multiple         :   true,                    // 是否可以多个文件上传
			createHtml:createHtml,
			/* 外部获得的回调接口 */
			onSelect: function(files, allFiles,boj,ZYFILE){
				var html = '';
				var displayTxt="";
				if(selectFileBakFun || successBakFun){
					displayTxt="display:none;";
				}
				if(files && files.length>0){
					for(var i=0;i<files.length;i++){
						var file = files[i];
						var index = file.index;
						var name = file.name;
						var size = getSize(file.size);
						html+=  '<span class="icon-right" style="'+displayTxt+'" key="'+index+'">'+
								'<a class="btn btn-link" href="javascript:void(0);"><i class="glyphicon glyphicon-paperclip"></i> '+name+'('+size+')</a>' +
								'<i class="fa fa-spinner fa-spin"></i>'+
								'<i class="fa fa-close removeFile" mark="1" index="'+index+'" onclick="javascript:$(this).parent().remove();">删除</i>'+
								'<input type="hidden" name="'+name+'" size="'+size+'" key="url">'+
								'</span>'

					}
				}
				$(boj).find(".fujian-wrap").append(html);
				$(boj).find(".removeFile").each(function(i,obj){
					obj = $(obj);
					if(obj.attr("mark")=="1"){
						obj.bind("click",function(){
							var index = $(this).attr("index");
							$(this).parent().remove();
							ZYFILE.funDeleteFile(index,false);
						}) ;
						obj.attr("mark","0");
					}
				});
				for(var i=0;i<files.length;i++) {
					var file = files[i];
					if(selectFileBakFun){
						selectFileBakFun(file,fileObj);
					}
					try{
						ZYFILE.funUploadFile(file);
					}catch(e){console.log("error:\t"+e);}
				}
			},
			onDelete: function(file, surplusFiles){                     // 删除一个文件的回调方法
				console.info("当前删除了此文件：");
				console.info(file);
				console.info("当前剩余的文件：");
				console.info(surplusFiles);
			},
			initImg:function(files,boj){
				if(files && files.length>0){
					var html ="";
					for(var i=0;i<files.length;i++){
						var file = files[i];
						var name = file.name;
						var size = file.size;
						var url = file.url;
						var index="init_"+i;;
						html+=  '<span class="icon-right" key="'+index+'">'+
								'<a class="btn btn-link" href="javascript:void(0);"><i class="glyphicon glyphicon-paperclip"></i> '+name+'('+size+')</a>' +
								'<i class="fa fa-spinner fa-spin" style="display:none;"></i>'+
								'<i class="fa fa-close removeFile" mark="1" index="'+index+'" onclick="javascript:$(this).parent().remove();">删除</i>'+
								'<input type="hidden" value="'+url+'"  name="'+name+'" size="'+size+'" key="url">'+
								'</span>'
					}
					$(boj).find(".fujian-wrap").append(html);
				}
			},
			onSuccess: function(file, response,obj){                    // 文件上传成功的回调方法
				var obj = $(obj);
				var index=file.index;
				if(response){
					response=eval('('+response+')');
				}
				if(response.status==true){
					if(successBakFun){
						successBakFun(file,response,fileObj);
					}else{
						var divObj=$(obj.find("span[key='"+index+"']")[0]);
						divObj.find(".fa-spin").hide();
						$(divObj.find("input")[0]).val(response.url);
					}
				}else{
					alert("上传失败");
				}
			},
			onFailure: function(file){                    // 文件上传失败的回调方法
				console.info("此文件上传失败：");
				console.info(file);
			},
			onComplete: function(responseInfo){           // 上传完成的回调方法
				console.info("文件上传完成");
				console.info(responseInfo);
			}
		});

		function getInitFile(fileStr){
			if(fileStr){
				var files = eval('('+fileStr+')');
				return files;
			}
		}
	}

	function getSize(size){
		if(size && size>0){
			if (size > 1024 * 1024) {
				size = (Math.round(size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
			} else {
				size = (Math.round(size * 100 / 1024) / 100).toString() + 'KB';
			}
		}
		return size;
	}

$(function () {
    var config = {
        "type": "label",
        "idKey": "客户",
        "obj": $("#selectLabel")
    };
    var toolObj = new littleTool(config);
    toolObj.initConfig();


    var config2 = {
        "type": "label",
        "idKey": "客户",
        "obj": $("#testLabel")
    };
    var toolObj2 = new littleTool(config2);
    toolObj2.initConfig();


});