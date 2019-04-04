/**
 * setting页面
 */

// 自定义CHECKBOX复选框
$("body").on("click", ".checkbox-mine", function () {
    var a = $(this).attr("a")
    if (a == "0") {
        $(this).addClass("checkbox-mine-ed")
        $(this).attr("a", "1")
    } else {
        $(this).removeClass("checkbox-mine-ed")
        $(this).attr("a", "0")
    }
})
var fieldList, buttonList, tableSetting, configId, operatorColWidth;
var showLayout, aboutItem;
$(".role_setting").on("click", ".btn-field", function () {
    var that = $(this)
    var id = $(that.find("input")[0]).val();
    that.parents(".fb-type").find(".btn-field").addClass("btn-field-null");
    that.removeClass("btn-field-null");
    var txt = that.text();
    $("#select_tit").text("选择" + txt);
    var key = that.attr("key");
    if (key == "report_form") {
        $(".report-form-box").show();
    } else {
        $(".report-form-box").hide();
    }
    showSettingDiv(id);
})
var settingType;
var setting_table_id;
showHidePage = false;
var filterList; /* var hinedHeight=false; var hinedSearch=false;var hinedFilter=false; */
var hideSearchAll = false;

var href_url = window.location.href;
if (href_url && href_url.split("html?").length == 2) {
    pmStr = $.trim(href_url.split("html?")[1]);
    var cur_id;
    for (var i = 0; i < pmStr.split("&").length; i++) {
        var str_val = pmStr.split("&")[i];
        if (str_val && str_val.split("=") != -1) {
            if (str_val.split("=")[0] == "tableId") {
                setting_table_id = $.trim(str_val.split("=")[1]);
            } else if (str_val.split("=")[0] == "showHidePage") {
                showHidePage = $.trim(str_val.split("=")[1]);
            } else if (str_val.split("=")[0] == "hideSearchAll") {
                hideSearchAll = $.trim(str_val.split("=")[1]);
            } else if (str_val.split("=")[0] == "type") {
                settingType = $.trim(str_val.split("=")[1]);
            }
        }
    }
}




function tableId() {
    return setting_table_id;
}
var postData = {
    module: setting_table_id,
    type: settingType,
    is_setting: "1"
};
var urlParams = getUrlParams();
for (var p in urlParams) {
    if (!postData[p]) {
        postData[p] = urlParams[p];
    }
}

$.ajax({
    url: ctx + "/cloud/userUiConfig/postGet",
    data: postData,
    type: "post",
    async: false,
    success: function (json) {
        if (json.result == "Success" || json.result == "SUCCESS") {
            var jsonMap = json.map;
            if (jsonMap.isAdmin) {
                $(".list-title").find("span[key=showLayout],span[key=aboutItem]").show();
            }
            fieldList = jsonMap.fieldList;
            buttonList = jsonMap.buttonList;
            filterList = jsonMap.filterList;
           
            operatorColWidth = jsonMap.operatorColWidth;

            if (jsonMap.configId && jsonMap.configId > 0) {
                configId = jsonMap.configId;
            }
            if (jsonMap.showLayout) {
                showLayout = JSON.parse(jsonMap.showLayout);
            }
            if (jsonMap.aboutItem) {
                aboutItem = JSON.parse(jsonMap.aboutItem);
            }
            tableSetting = jsonMap.tableSetting;
            initFieldSetting();
        } else {
            tipsMsg(json.resultMsg, "FAIL");
        }
    }
});

function onClickRadio(me) {
    me = $(me);
    var a = me.attr("a");
    $("em[key=isOrder]").removeClass("select");
    $("em[key=isOrder]").attr("a", "0");
    me.addClass("select");
    me.attr("a", "1");
}

function orderChange(me) {
    me = $(me);
    /*var value =me.val();
    if(value){
        $("select[name=isOrder]").val("");
        me.val(value);
    }*/
}

function initFieldSetting() {
    if (fieldList && fieldList.length > 0) {
        var widthData = getStorgeValue("cur_table_width_data");
        if (widthData) {
            widthData = JSON.parse(widthData);
        }
        putStorageValue("cur_table_width_data", "");
        $.each(fieldList, function (i, obj) {
            var width = "";
            if (widthData && widthData[obj.columnName]) {
                width = widthData[obj.columnName];
            }
            $("#field_show_setting").append(
                '<div class="form-set-c">' +
                '<span style="width: 15%;padding-top:8px;line-height:15px;" class="fs-t">' + obj.title + '<input type="hidden" name="sid" value="' + obj.sid + '"></span>' +
                '<span style="width: 10%;"><em ' + (((!obj.isShow && obj.isShow != 0) || obj.isShow == 1) ? 'a="1" class="checkbox-mine checkbox-mine-ed"' : 'a="0" class="checkbox-mine"') + ' key="isShow"></em></span>' +
                '<span style="width: 10%;"><em ' + (((!obj.isSearch && obj.isSearch != 0) || obj.isSearch == 1) ? 'a="1" class="checkbox-mine checkbox-mine-ed"' : 'a="0" class="checkbox-mine"') + ' key="isSearch"></em></span>' +
                '<span style="width: 10%;"><em ' + (((!obj.isSort && obj.isSort != 0) || obj.isSort == 1) ? 'a="1" class="checkbox-mine checkbox-mine-ed"' : 'a="0" class="checkbox-mine"') + ' key="isSort"></em></span>' +
                '<span style="width: 10%;"><em ' + ((obj.isFixed && obj.isFixed == 1) ? 'a="1" class="checkbox-mine checkbox-mine-ed"' : 'a="0" class="checkbox-mine"') + ' key="isFixed"></em></span>' +
                '<span style="width: 15%;padding-top: 0;">' +
                '<input name="alias" type="text" class="input" style="width: 80%;margin: 0 auto;" name="" value="' + (obj.alias ? obj.alias : "") + '">' +
                '</span>' +
                '<span style="width: 10%;"><select class="select" name="isOrder" onchange="javascript:orderChange(this);"  key="isOrder"><option value="">设置排序</option><option ' + ((obj.isOrder && (obj.isOrder == 1 || obj.isOrder == "desc")) ? 'selected' : '') + ' value="desc">降序</option><option ' + ((obj.isOrder && (obj.isOrder == "asc")) ? 'selected' : '') + ' value="asc">升序</option></select></span>' +
                '<span style="width: 10%;">' +
                '<input name="colWidth" type="text" class="input" style="width: 80%;margin: 0 auto;" value="' + (width ? width : (obj.colWidth ? obj.colWidth : "")) + '">' +
                '</span>' +
                '<span style="width: 8%;"><em ' + ((obj.isShowSearch && obj.isShowSearch == 1) ? 'a="1" class="checkbox-mine checkbox-mine-ed"' : 'a="0" class="checkbox-mine"') + ' key="isShowSearch"></em></span>' +
                '</div>'
            );
        });

        var width = "";
        if (widthData && widthData['操作']) {
            width = widthData['操作'];
        }
        $("#field_show_setting").append(
            '<div class="form-set-c">' +
            '<span style="width: 15%;" class="fs-t">操作<input type="hidden" name="sid" value="0001"></span>' +
            '<span style="width: 10%;"></span>' +
            '<span style="width: 10%;"></span>' +
            '<span style="width: 10%;"></span>' +
            '<span style="width: 10%;"></span>' +
            '<span style="width: 15%;padding-top: 0;">' +
            '</span>' +
            '<span style="width: 10%;"></span>' +
            '<span style="width: 10%;">' +
            '<input name="colWidth" type="text" class="input" style="width: 80%;margin: 0 auto;" value="' + (width ? width : (operatorColWidth ? operatorColWidth : "")) + '">' +
            '</span>' +
            '<span style="width: 8%;"></span>' +
            '</div>'
        );

    }
    var showButtonTop = 0;
    var isShowPage = 1;
    if (tableSetting && tableSetting.showButtonTop && tableSetting.showButtonTop == 1) {
        showButtonTop = 1;
    }
    if (tableSetting && (!tableSetting.isShowPage || tableSetting.isShowPage == 0)) {
        isShowPage = 0;
    }
    $(".table_setting_show").html(
        '<span><em ' + ((showButtonTop == 1) ? 'a="1" class="checkbox-mine checkbox-mine-ed" ' : 'a="0" class="checkbox-mine" ') + ' key="showButtonTop" a="0" class="checkbox-mine"></em>按钮置顶显示</span>' +
        /* '<span '+(hinedFilter?"style='display:none;'":"")+'><em '+((isShowFilter==1)?'a="1"  class="checkbox-mine checkbox-mine-ed" ':' a="0" class="checkbox-mine" ')+'key="isShowFilter" ></em>显示检索栏数据</span>'+
        '<span '+(hinedSearch?"style='display:none;'":"")+'><em '+((isShowSearchInput==1)?'a="1" class="checkbox-mine checkbox-mine-ed" ':' a="0" class="checkbox-mine" ')+' key="isShowSearchInput" ></em>显示搜索框</span>'+
        '<span '+(hinedHeight?"style='display:none;'":"")+'><em '+((isShowHeightButton==1)?'a="1" class="checkbox-mine checkbox-mine-ed" ':' a="0" class="checkbox-mine" ')+' key="isShowHeightButton"></em>高级搜索是否显示</span>'+ */
        '<span ' + (!showHidePage ? "style='display:none;'" : "") + '><em ' + ((isShowPage == 1) ? 'a="1" class="checkbox-mine checkbox-mine-ed" ' : ' a="0" class="checkbox-mine" ') + ' key="isShowPage"></em>是否显示分页</span>'
        /* +'<span><em '+((isShowAllSearchField==1)?'a="1" class="checkbox-mine checkbox-mine-ed" ':' a="0" class="checkbox-mine" ')+' key="isShowAllSearchField"></em>平铺高级搜索字段</span>' */
    );
    if (hideSearchAll) {
        $(".table_setting_show").hide();
        $(".table_setting_show_title").hide();
    }
    if (buttonList && buttonList.length > 0) {
        $.each(buttonList, function (i, btn) {
            var isShowBtn = 1;
            if (btn && btn.isShow == 0) {
                isShowBtn = 0;
            }
            $(".table_button_setting_show").append(
                '<span><em key_id="' + btn.sid + '" ' + ((isShowBtn == 1) ? 'a="1"   class="checkbox-mine checkbox-mine-ed" ' : ' a="0" class="checkbox-mine" ') + ' ></em>' + btn.name + '</span>'
            );
        });
    } else {
        $(".table_button_setting_show").hide();
        $(".table_button_setting_show_title").hide();
    }
    //分页大小
    if (tableSetting && tableSetting.pageSize) {
        $("input[name=pageSize]").val(tableSetting.pageSize);
    }
    //拖动
    $("#field_show_setting").sortable({
        cursor: "pointer", //鼠标样式
        items: ".form-set-c", //要拖动的元素
        opacity: 0.6, //透明度
        delay: 10, //时长
        sort: true, //是否排序
        disabled: false,
        revert: false, //释放时，增加动画
        stop: function (event, ui) { //鼠标停止拖动的时候
        }
    });
    $("#field_show_setting").disableSelection();
}
function configSubmit(isClose) {
    var setting = {};
    $("#field_show_setting").find(".form-set-c").each(function (i, obj) {
        obj = $(obj);
        var id = obj.find("input[name=sid]").val();
        if (id) {
            var title = obj.find("input[name=title]").val();
            var sequence = i;
            var isSearch = 0;
            var isSort = 0;
            var isShow = 0;
            var isFixed = 0;
            var isOrder = 0;
            var colWidth;
            var isShowSearch = 0;
            var alias = obj.find("input[name=alias]").val();
            if ($(obj.find("em[key=isSearch]")[0]).attr("a") == "1") {
                isSearch = 1;
            }
            if ($(obj.find("em[key=isSort]")[0]).attr("a") == "1") {
                isSort = 1;
            }
            if ($(obj.find("em[key=isShow]")[0]).attr("a") == "1") {
                isShow = 1;
            }
            if ($(obj.find("em[key=isFixed]")[0]).attr("a") == "1") {
                isFixed = 1;
            }
            if ($(obj.find("select[name=isOrder]")[0]).val()) {
                isOrder = $(obj.find("select[name=isOrder]")[0]).val();
            }

            if ($(obj.find("input[name=colWidth]")[0]).val()) {
                colWidth = $(obj.find("input[name=colWidth]")[0]).val();
            }
            if ($(obj.find("em[key=isShowSearch]")[0]).attr("a") == "1") {
                isShowSearch = 1;
            }
            setting[id] = {
                id: id,
                title: title,
                sequence: sequence,
                isSearch: isSearch,
                isSort: isSort,
                isShow: isShow,
                alias: alias,
                isFixed: isFixed,
                isOrder: isOrder,
                colWidth: colWidth,
                isShowSearch: isShowSearch
            };
        }
    });
    var showButtonIds = [];
    $(".table_button_setting_show em").each(function (i, obj) {
        obj = $(obj);
        var key_id = obj.attr("key_id");
        if (obj.attr("a") == "1" && key_id) {
            showButtonIds.push(key_id);
        }
    });
    var isShowPage = 0;
    var showButtonTop = 0; /*  var isShowFilter=0;var isShowSearchInput=0;var isShowHeightButton=0; var isShowAllSearchField=0; */

    if ($($("em[key=isShowPage]")[0]).attr("a") == "1") {
        isShowPage = 1;
    }
    if ($($("em[key=showButtonTop]")[0]).attr("a") == "1") {
        showButtonTop = 1;
    }
    /* 
    if($($("em[key=isShowFilter]")[0]).attr("a")=="1"){
    	isShowFilter=1;
    }
    if($($("em[key=isShowSearchInput]")[0]).attr("a")=="1"){
    	isShowSearchInput=1;
    }
    if($($("em[key=isShowHeightButton]")[0]).attr("a")=="1"){
    	isShowHeightButton=1;
    }
    if($($("em[key=isShowAllSearchField]")[0]).attr("a")=="1"){
    	isShowAllSearchField=1;
    } */
    var numPatrn = /^[0-9]{1,6}$/;
    var pageSize = $.trim($("input[name=pageSize]").val());
    if (!numPatrn.test(pageSize)) {
        pageSize = 20;
    }
    setting[tableId()] = {
        isShowPage: isShowPage,
        showButtonTop: showButtonTop,
        /* isShowFilter:isShowFilter,isShowSearchInput:isShowSearchInput,isShowHeightButton:isShowHeightButton,isShowAllSearchField:isShowAllSearchField, */
        showButtonIds: showButtonIds,
        pageSize: pageSize
    };
    $.post(ctx + "/cloud/userUiConfig/saveConfig", {
        setting: JSON.stringify(setting),
        tableId: tableId(),
        id: configId,
        type: settingType
    }, function (data) {
        if (data.result = "Success") {
            tipsMsg("保存成功", "SUCCESS");
            if (isClose) {
                window.setTimeout(function () {
                    window.parent.cloudOpenWindow(true);
                }, 1000);
            }
        } else {
            configSubmit.removeAttr("disabled"); //移除disabled属性
        }
    });
}

function initRoleFun() {
    $.get(ctx + "/cloud/roleuser/about/queryAllRole", function (json) {
        if (json && json.length > 0) {
            initRole = true;
            var html_str = '';
            $.each(json, function (i, obj) {
                html_str += '<span class="default-btn btn-field  btn-field-null"><input type="hidden" value="' + obj.roleId + '">' + obj.roleName + '<em></em></span>';
            });
            $(".role_setting").html(html_str);
        }
    });
}

function exists(target, team) {
    if (team && team.length > 0 && target) {
        for (var i = 0; i < team.length; i++) {
            if (team[i] == target) {
                return true;
            }
        }
    }
    return false;
}

function showSettingDiv(id) {
    var targetDiv = $(".setting_content").find("div[name='" + id + "']");
    if (!targetDiv || targetDiv.length == 0) {
        var selectIds = [];
        $.ajax({
            type: "get",
            url: ctx + "/cloud/roleuser/about/queryRoleSelectId/query",
            data: {
                roleId: id,
                ids: JSON.stringify(getAllId())
            },
            async: false,
            success: function (json) {
                if (json.result = "SUCCESS") {
                    if (json.map.ids && json.map.ids.length > 0) {
                        selectIds = json.map.ids;
                    };
                } else {
                    tipsMsg(json.resultMsg, "FAIL");
                }
            }
        });
        var setting_div = $("#setting_templage .setting_div").clone();
        setting_div.attr("name", id);
        var button_html_str = '';
        if (buttonList && buttonList.length > 0) {
            $.each(buttonList, function (i, obj) {
                button_html_str += '<span class="default-btn btn-field  ' + (exists(obj.sid, selectIds) ? '' : 'btn-field-null') + '"><input type="hidden" value="' + obj.sid + '">' + obj.name + '<em></em></span>';
            });
            setting_div.find(".button_setting").html(button_html_str);
        }
        var field_html_str = '';
        if (fieldList && fieldList.length > 0) {
            $.each(fieldList, function (i, obj) {
                field_html_str += '<span class="default-btn btn-field  ' + (exists(obj.sid, selectIds) ? '' : 'btn-field-null') + '"><input type="hidden" value="' + obj.sid + '">' + obj.title + '<em></em></span>';
            });
            setting_div.find(".field_setting").html(field_html_str);
        }
        setting_div.find("span").on("click", function () {
            var that = $(this)
            var id = $(that.find("input")[0]).val();
            if (that.attr("class").indexOf("btn-field-null") != -1) {
                that.removeClass("btn-field-null");
            } else {
                that.addClass("btn-field-null");
            }
            var key = that.attr("key")
            $(".report-form-box").hide()
        })
        $(".setting_content").append(setting_div);
    }
    $(".setting_content").find(".setting_div").hide();
    $(".setting_content").find("div[name='" + id + "']").show();
}

//--------------------------------------------------------------------------------------------------
function getStorgeValue(key) {
    if (window.localStorage && key) {
        var ls = localStorage;
        return ls.getItem(key);
    }
}

function putStorageValue(key, value) {
    if (window.localStorage && key) {
        var ls = localStorage;
        ls.setItem(key, value);
    }
}
//-------------------------------------------
function getAllId() {
    var ids = [];
    if (fieldList && fieldList.length > 0) {
        $.each(fieldList, function (i, field) {
            ids.push(field.sid);
        });
    }
    if (buttonList && buttonList.length > 0) {
        $.each(buttonList, function (i, button) {
            ids.push(button.sid);
        });
    }
    return ids;
}

function saveRoleSetting(isClose) {
    var ids = getAllId();
    var roleObj = {};
    $(".setting_content").find(".setting_div").each(function (i, obj) {
        obj = $(obj);
        var id = obj.attr("name");
        var selectIds = [];
        if (id) {
            obj.find("span").each(function (i, me) {
                me = $(me);
                if (me.attr("class").indexOf("btn-field-null") == -1) {
                    if (me.find("input").length > 0) {
                        selectIds.push($(me.find("input")[0]).val());
                    }
                }
            });
            roleObj[id] = selectIds;
        }
    });
    $.post(ctx + "/cloud/roleuser/about/saveRoleSetting", {
        ids: JSON.stringify(ids),
        roleObj: JSON.stringify(roleObj)
    }, function (json) {
        if (json.result == "Success" || json.result == "SUCCESS") {
            tipsMsg("保存成功", "SUCCESS");
            if (isClose) {
                window.setTimeout(function () {
                    window.parent.cloudOpenWindow(true);
                }, 1000);
            }
        } else {
            tipsMsg(json.resultMsg, "FAIL");
        }
    });
}

// **********************************************************视图显示********************************************************** -->
//初始化显示视图html
function initLayout() {
    var hideFieldList = []; //备选字段
    var showFieldList = showLayout; //显示字段
    var allFieldList = {};
    if (fieldList && fieldList.length > 0) {
        $.each(fieldList, function (i, obj) {
            var field = {
                name: (obj.alias ? obj.alias : obj.title),
                column_name: obj.columnName
            };
            allFieldList[obj.columnName] = field;
        });
    }
    $.ajax({
        url: ctx + "/cloud/userUiConfig/getConfig",
        type: "get",
        async: false,
        data: {
            tableId: urlParams.tableId,
            type: "TABLE_LIST_VIEW_SETTING"
        },
        success: function (json) {
            if (json.result == "Success" || json.result == "SUCCESS") {
                if (json.map) { //用户保存过设置信息
                    $("#table_list_view_id").val(json.map.id);
                    if (json.map.setting) {
                        var setting = JSON.parse(json.map.setting);
                        showFieldList = setting.showFields;
                    }
                }
            } else {
                tipsMsg(json.resultMsg, "FAIL");
            }
        }
    });
    if (showFieldList && showFieldList.length > 0) {
        $.each(showFieldList, function (i, obj) {
            delete allFieldList[obj.column_name]; //从所有表单字段中移除显示的字段，剩下的为备选字段
            //html
            if (obj.html_type == "LINEBAR") {
                $("#right").append("<li class='left-style col-12' html_type='LINEBAR' name='" + obj.name + "' is_show='" + obj.is_show + "' key='halfLine' draggable='false'>" +
                    "<div class='item-title'>" +
                    "<span class='item-title-info'>" +
                    "<i class='fa fa-caret-down' aria-hidden='true'></i>" +
                    "<span class='lineBarName'>" + obj.name + "</span>" +
                    "</span>" +
                    "</div>" +
                    "</li>");
            } else {
                var classStr = "col-12";
                var elem_width = "12";
                if (obj.elem_width) {
                    classStr = " col-" + obj.elem_width;
                    elem_width = obj.elem_width;
                }
                $("#right").append("<li class='left-style " + classStr + "' key='halfLine' column_name='" + obj.column_name + "' name='" + obj.name + "' elem_width='" + elem_width + "'>" +
                    "<div class='left-content'>" +
                    "<span class='flied-name'>" +
                    obj.name +
                    "</span>" +
                    "</div>" +
                    "</li>");
            }
        });
    }
    $.each(allFieldList, function (i, obj) {
        $("#left").append("<li class='right-style' key='halfLine' column_name='" + obj.column_name + "' name='" + obj.name + "' elem_width='12'>" +
            "<div class='left-content'>" +
            "<span class='flied-name'>" +
            obj.name +
            "</span>" +
            "</div>" +
            "</li>");
    });
}

(function () {
    initLayout();

    var selectedField; //视图显示，选择修改的字段的li
    var selectedLineBar; //视图显示，选择修改的分线栏

    //保存布局
    $("#saveLayout").bind("click", function () {
        var layoutDB = [];
        $.each($("#right").find(".left-style"), function () {
            var field = {
                "name": $(this).attr("name")
            };
            if ($(this).attr("html_type") == "LINEBAR") {
                field.html_type = "LINEBAR";
                field.is_show = $(this).attr("is_show");
            } else {
                field.column_name = $(this).attr("column_name");
                field.elem_width = $(this).attr("elem_width");
            }
            layoutDB.push(field);
        });
        var setting = {
            showFields: layoutDB
        };
        var loadMsg = layer.msg("正在保存...", {
            icon: 16,
            shade: [0.1, '#393D49'],
            time: 60000
        });
        $.post(ctx + "/cloud/userUiConfig/saveConfigAdmin", {
            "id": $("#table_list_view_id").val(),
            "type": "TABLE_LIST_VIEW_SETTING",
            "tableId": urlParams.tableId,
            "setting": JSON.stringify(setting)
        }, function (json) {
            layer.close(loadMsg);
            if (json.result == "SUCCESS") {
                window.parent.tipsMsg("保存成功", "SUCCESS");
                //window.parent.cloudOpenWindow();
            } else {
                tipsMsg(json.resultMsg, "FAIL");
            }
        });
    });

    //鼠标移入字段显示操作按钮
    $(document).on("mouseenter", ".left-style", function () {
        var elem_width = $(this).attr("elem_width");
        var operateContent =
            "<div class='btn-group btn-group-xs pull-right' style='position:absolute;top: 7px;right: 20px; display: block;'>" +
            //"<button class='btn btn-default' onclick='fieldRequire(this)'>必填</button>"+
            '<select class="btn btn-default editfieldWidthBtn" style="height:22px;width:47px;padding:0;">' +
            '<option value="12" ' + (elem_width == "12" ? "selected" : "") + '>整行</option>' +
            '<option value="6" ' + (elem_width == "6" ? "selected" : "") + '>半行</option>' +
            '<option value="4" ' + (elem_width == "4" ? "selected" : "") + '>1/3</option>' +
            '<option value="3" ' + (elem_width == "3" ? "selected" : "") + '>1/4</option>' +
            '</select>' +
            //"<button class='btn btn-default' onclick='editFiledName(this)'>修改</button>"+
            "<button class='btn btn-default deleteFieldBtn' onclick='removeFieldContent(this)'>移除</button>" +
            //"<button class='btn btn-default' onclick='editProperty(this)'>属性</button>"+
            "</div>";
        if ($(this).attr("html_type") == "LINEBAR") {
            operateContent =
                "<div class='btn-group btn-group-xs pull-right' style='position:absolute;top: 8px;right: 20px; display: block;'>" +
                "<button class='btn btn-default editLineBarBtn'>修改</button>" +
                "<button class='btn btn-default deleteLineBarBtn'>移除</button>" +
                "</div>";
        }
        $(this).append(operateContent);
    });
    //鼠标移出字段隐藏操作按钮
    $(document).on("mouseleave", ".left-style", function () {
        $(this).find(".btn-group").remove();
    });

    //字段显示宽度
    $(document).on("change", ".editfieldWidthBtn", function () {
        var elem_width = $(this).val();
        var li = $(this).parents("li");
        li.attr("elem_width", elem_width);
        li.removeClass("col-12 col-6 col-4 col-3").addClass("col-" + elem_width);
    });

    //移除字段
    $(document).on("click", ".deleteFieldBtn", function () {
        var li = $(this).parents("li");
        li.find(".btn-group").remove(); //去除操作按钮
        li.removeClass("left-style col-12 col-6 col-4 col-3").addClass("right-style");
        li.find(".left-content").css("border", "1px solid rgba(0,0,0,.125)");
        $("#left").append(li);
    });
    //打开分线栏修改弹窗
    $(document).on("click", ".editLineBarBtn", function () {
        selectedLineBar = $(this).parents("li");
        $("#editLineBarModal").find("[name=name]").val("");
        $("#editLineBarModal").find("[name=is_show]").prop("checked", false);
        if (selectedLineBar && selectedLineBar.length > 0) {
            $("#editLineBarModal").find("[name=name]").val(selectedLineBar.attr("name"));
            $("#editLineBarModal").find("[name=is_show]").prop("checked", selectedLineBar.attr("is_show") == "0");
        }
        $("#editLineBarModal").modal();
    });

    //保存分线栏
    $("#editLineBarModal").on("click", ".btn-primary", function () {
        var name = $.trim($("#editLineBarModal").find("[name=name]").val());
        if (!name) {
            name = "分线栏";
        }
        var is_show = $("#editLineBarModal").find("[name='is_show']:checked").val() == "0" ? "0" : "1";;
        if (selectedLineBar && selectedLineBar.length > 0) { //修改
            selectedLineBar.attr("name", name).attr("is_show", is_show);
            selectedLineBar.find(".lineBarName").text(name);
        } else { //新增
            $("#right").append('<li class="left-style col-12" html_type="LINEBAR" name="' + name + '" is_show="' + is_show + '" key="halfLine" draggable="false">' +
                '<div class="item-title">' +
                '<span class="item-title-info">' +
                '<i class="fa fa-caret-down" aria-hidden="true"></i>' +
                '<span class="lineBarName">' + name + '</span>' +
                '</span>' +
                '</div>' +
                '</li>');
        }
        $("#editLineBarModal").modal('hide');
    });

    //删除分线栏
    $(document).on("click", ".deleteLineBarBtn", function () {
        $(this).parents("li").remove();
    });
    /***************************初始化拖拽效果*************************/
    var left = document.getElementById('left');
    var right = document.getElementById('right');

    //  Shared lists
    new Sortable(left, {
        group: 'shared', // set both lists to same group
        animation: 150,
        ghostClass: 'left-style'
    });

    new Sortable(right, {
        group: {
            name: "shared",
            pull: false, //则可以拖拽到其他列表 否则反之
            put: true //则可以从其他列表中放数据到该列表，false则反之
        },
        animation: 150,
        ghostClass: 'right-style'
    });

    Sortable.create(document.getElementById('right'), { //从右边往左边拖动  right=>left       右往左
        animation: 150, //动画参数
        onAdd: function (evt) { //拖拽时候添加有新的节点的时候发生该事件
            //console.log('onAdd.foo:', [evt.item, evt.from]);
            var element = $(evt.item);
            //console.log(evt.item);
            $(evt.item).removeClass("right-style").addClass("left-style col-12").attr("elem_width", "12"); //从右侧拖入左侧时，移除右侧的样式，添加左侧的样
            //$(evt.item).attr({"widhtpercent":"半行","value":"6"});    //拖入左侧时默认宽度为半行
            highBorderLight($(evt.item).find(".left-content"));

            //增加按钮编辑功能
        },
        onUpdate: function (evt) { //拖拽更新节点位置发生该事件
            //console.log('onUpdate.foo:', [evt.item, evt.from]);
        },
        onRemove: function (evt) { //删除拖拽节点的时候促发该事件
            //console.log('onRemove.foo:', [evt.item, evt.from]);
        },
        onStart: function (evt) { //开始拖拽出发该函数
            //console.log('onStart.foo:', [evt.item, evt.from]);
        },
        onSort: function (evt) { //发生排序发生该事件
            //console.log('onSort.foo:', [evt.item, evt.from]);
        },
        onEnd: function (evt) { //拖拽完毕之后发生该事件
            //console.log('onEnd.foo:', [evt.item, evt.from]);
        }
    })

    function highBorderLight(e) {
        var border = '1px dashed rgb(205, 197, 211)';
        var num = 0;
        var i = self.setInterval(function () {
            e.css('border', num % 2 == 0 ? '1px dashed red' : border);
            num++;
            if (num > 9)
                window.clearInterval(i);
        }, 100);
        return $(this);
    }
})();
//------------------------------------------------------------------------------------------------------------------------
//**********************************************************相关项*******************
var clickTimes = 0; //记录点击次数
var selectedField; //视图显示，选择修改的字段的li
var selectedOption; //相关项 选择的标签
//<li class="settingBtn bg-selected ui-sortable-handle">文件</li>

function initAboutItem() {
    var showItemList = [] //已显示相关项
    var allItemList = {};
    if (aboutItem && aboutItem.length > 0) {
        $.each(aboutItem, function (i, obj) {
            var item = {
                name: obj.name,
                id: obj.id
            };
            showItemList.push(item);
            allItemList[obj.id] = item;
        });
    }
    $.ajax({
        url: ctx + "/cloud/userUiConfig/getConfig",
        type: "get",
        async: false,
        data: {
            tableId: urlParams.tableId,
            type: "TABLE_LIST_ABOUT_ITEM"
        },
        success: function (json) {
            if (json.result == "Success" || json.result == "SUCCESS") {
                if (json.map) { //用户保存过设置信息
                    $("#table_list_about_item_id").val(json.map.id);
                    if (json.map.setting) {
                        var setting = JSON.parse(json.map.setting);
                        showItemList = setting.showItems;
                    }
                }
            } else {
                tipsMsg(json.resultMsg, "FAIL");
            }
        }
    });
    if (showItemList && showItemList.length > 0) {
        $.each(showItemList, function (i, obj) {
            delete allItemList[obj.id]; //从所有相关项中移除已显示的，剩余则是未显示的
            $("#selectedList").append('<li class="settingBtn bg-selected ui-sortable-handle" item_id="' + obj.id + '">' + obj.name + '</li>');
        });
    }
    $.each(allItemList, function (i, obj) {
        $("#optinalList").append('<li class="settingBtn bg-optinal ui-sortable-handle" item_id="' + obj.id + '">' + obj.name + '</li>');
    });
}

$(function ($) {
    initAboutItem();

    //保存相关项
    $("#saveAboutItem").bind("click", function () {
        var showItems = [];
        $.each($("#selectedList").find("li"), function () {
            showItems.push({
                id: $(this).attr("item_id"),
                name: $.trim($(this).text())
            });
        });
        var setting = {
            showItems: showItems
        };
        var loadMsg = layer.msg("正在保存...", {
            icon: 16,
            shade: [0.1, '#393D49'],
            time: 60000
        });
        $.post(ctx + "/cloud/userUiConfig/saveConfigAdmin", {
            "id": $("#table_list_about_item_id").val(),
            "type": "TABLE_LIST_ABOUT_ITEM",
            "tableId": urlParams.tableId,
            "setting": JSON.stringify(setting)
        }, function (json) {
            layer.close(loadMsg);
            if (json.result == "SUCCESS") {
                window.parent.tipsMsg("保存成功", "SUCCESS");
                //window.parent.cloudOpenWindow();
            } else {
                tipsMsg(json.resultMsg, "FAIL");
            }
        });
    });

    //排序
    $("#selectedList").sortable({
        connectWith: "#selectedList.connectedSortable",
        helper: "clone",
        cursor: "move",
        tolerance: 'pointer',
        dropOnEmpty: true,
        start: function (event, ui) {},

        receive: function (event, ui) {
            var item = ui.item;
            highLight(item);
            item.removeClass('bg-optinal').addClass('bg-selected');
        },
        stop: function (event, ui) {}
    });
    var selectedList = $("#selectedList"); //已选
    var optinalList = $("#optinalList"); //未选
    //点击 显示/隐藏
    $('#selectedList').on('click', '.bg-selected', function () {
        clickTimes++; //记录点击次数
        var select = $(this);
        if (clickTimes == 2) { //当点击次数为2   双击事件
            selectedOption = $(this);
            $("#editAboutItemModal").find("input[name=name]").val($(this).text());
            $("#editAboutItemModal").modal();
            clickTimes = 0; //清零
        }
        //设置一个延时事件
        setTimeout(function () {
            if (clickTimes == 1) { //单击事件
                var clone = select.clone();
                select.remove();
                clone.removeClass('bg-selected').addClass('bg-optinal');
                optinalList.append(clone);
                highLight(clone);
                clickTimes = 0; //清零
            }
        }, 250);
    });

    $('#optinalList').on('click', '.bg-optinal', function () {
        clickTimes++; //记录点击次数
        var optinal = $(this);
        if (clickTimes == 2) { //当点击次数为2    //双击事件
            selectedOption = $(this);
            $("#editAboutItemModal").find("input[name=name]").val($(this).text());
            $("#editAboutItemModal").modal();
            clickTimes = 0; //清零
        }
        //设置一个延时事件
        setTimeout(function () {
            if (clickTimes == 1) { //单击事件
                var clone = optinal.clone();
                optinal.remove();
                clone.removeClass('bg-optinal').addClass('bg-selected');
                selectedList.append(clone);
                highLight(clone);
                clickTimes = 0; //清零
            }
        }, 250);
    });

    //点击修改名称的保存按钮
    $("#editAboutItemModal").on("click", ".btn-primary", function () {
        var newName = $.trim($("#editAboutItemModal").find("input[name=name]").val());
        if (newName) {
            selectedOption.text(newName);
        }
        $("#editAboutItemModal").modal('hide');
    })
});

function highLight(e) {
    var border = 'thin solid #999';
    var num = 0;
    var i = self.setInterval(function () {
        e.css('border', num % 2 == 0 ? '1px dashed red' : border);
        num++;
        if (num > 9)
            window.clearInterval(i);
    }, 100);
    return $(this);
}

/*滚动到 最下端-新添加的位置*/
/* function scrollDown(e) {
	e.stop(true);
	e.animate({scrollTop: e[0].scrollHeight}, 500);	//子菜单移动
	return $(this);
} */

//-----------------------------------------------------------------------------------------------------------------------------------------------------
var initRole = false;
//列表过滤器主键
var table_list_filter_id = "";
//列表过滤器setting值
var table_list_filter_setting = [];
//字段转换主键
var table_list_field_change_id = "";
$(function () {
    var windowHeight = $(window).height();
    $("#field_show_setting").height(windowHeight - 450);
    //如果是管理员,显示所有菜单
    $.ajax({
        type: "post",
        async: false, // 异步加载
        url: ctx + "/cloud/roleuser/about/isAdmin",
        dataType: "json",
        success: function (json) {
            if (json == '1') {
                //$(".list-title").append('<span  key="showRole" >权限设置</span><span key="fieldFilter">列表过滤器</span>');
            }
            $(".list-title span").click(function () {
                var index = $(this).index()
                var key = $(this).attr("key");
                $(".list-title span").removeClass("def");
                $(this).addClass("def")
                $(".config-content .cbox").hide().eq(index).show()
                if ("showRole" == key && !initRole) {
                    initRoleFun();
                } else if ("fieldFilter" == key) {
                    initFilterFun();
                } else if ("fieldChange" == key) {
                    initFieldChange();
                }

            });
        }
    });
    // 加载列表过滤器数据
    $.ajax({
        type: "post",
        url: ctx + "/cloud/sbehaviourConfig/use/getConfig/TABLE_LIST_FIELD_CHANGE",
        data: {
            id: tableId()
        },
        dataType: "json",
        success: function (json) {
            if (json && json.result == 'SUCCESS') {
                if (json.list && json.list.length > 0) {
                    var list = json.list;
                    table_list_field_change_id = list[0].sid;
                }
            }
        }
    });

    // 加载列表过滤器数据
    $.ajax({
        type: "post",
        url: ctx + "/cloud/sbehaviourConfig/use/getConfig/TABLE_LIST_FILTER",
        data: {
            id: tableId()
        },
        dataType: "json",
        success: function (json) {
            if (json && json.result == 'SUCCESS') {
                if (json.list && json.list.length > 0) {
                    var list = json.list;
                    table_list_filter_id = list[0].sid;
                    table_list_filter_setting = JSON.parse(list[0].setting);
                }
            }
        }
    });

});


//点击列表过滤器加载数据
function initFilterFun() {
    if (filterList && filterList.length > 0) {
        var filter_html_str = "";
        for (var i = 0; i < filterList.length; i++) {
            var obj = filterList[i];
            var classStr = "";
            if (table_list_filter_setting.indexOf(obj.sid) == -1) {
                classStr = "btn-field-null";
            }
            filter_html_str += '<span class="default-btn btn-field ' + classStr + '"><input type="hidden" value="' + obj.sid + '">' + obj.name + '<em></em></span>';
        }
        $('.filter_setting').html(filter_html_str);
        $('.filter_setting').find("span").on("click", function () {
            var that = $(this)
            if (that.attr("class").indexOf("btn-field-null") != -1) {
                that.removeClass("btn-field-null");
            } else {
                that.addClass("btn-field-null");
            }
        })
    }
}
// 列表过滤器提交
function filterSubmit() {
    var setting = [];
    $(".filter_setting span:not(.btn-field-null)").each(function () {
        setting.push($(this).find("input").val());
    });
    $.post(ctx + "/cloud/sbehaviourConfig/use/saveConfig/TABLE_LIST_FILTER", {
        setting: JSON.stringify(setting),
        tableId: tableId(),
        id: table_list_filter_id
    }, function (data) {
        if (data.result = "SUCCESS") {
            table_list_filter_setting = setting;
            tipsMsg("保存成功", "SUCCESS");
        } else {
            tipsMsg(data.resultMsg, "SUCCESS");
        }
    });
}

// 加载字段转换树
function initFieldChange() {
    var setting = {
        async: {
            enable: true,
            url: ctx + "/cloud/sbehaviourConfig/use/getFieldChangeTreeByTableId",
            dataType: "json",
            type: "get",
            otherParam: {
                id: tableId()
            }
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        check: {
            enable: true
        }
    };
    $.fn.zTree.init($("#menu"), setting);
}

// 字段转换提交
function fieldChangeSubmit() {
    var setting = getZTreeValue("menu");
    $.post(ctx + "/cloud/sbehaviourConfig/use/saveConfig/TABLE_LIST_FIELD_CHANGE", {
        setting: JSON.stringify(setting),
        tableId: tableId(),
        id: table_list_field_change_id
    }, function (data) {
        if (data.result = "SUCCESS") {
            table_list_filter_setting = setting;
            tipsMsg("保存成功", "SUCCESS");
        } else {
            tipsMsg(data.resultMsg, "SUCCESS");
        }
    });
}


function getZTreeValue(treeId) {
    var menuTree = $.fn.zTree.getZTreeObj(treeId);
    if (!menuTree) {
        return "";
    }
    var nodes = menuTree.getCheckedNodes(true);
    if (!nodes || nodes.length == 0) {
        return "";
    }
    var ids = [];
    for (var i = 0; i < nodes.length; i++) {
        var id = nodes[i].id;
        if (ids.indexOf(id) == -1) {
            ids.push(id);
        }
    }
    return ids;
}