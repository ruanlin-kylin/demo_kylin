// var cur_menuId < c: if test = "${menuObj!=null}" >= "${menuObj.id}" < /c:if>;

var tableDataSumObj = {};
var tableObjectList = {};
var current_table_select_data;
var fb_config_obj = {};
var cur_fb_config_mark;
var buttonConfigList = {};
var tableTeamlConfigObj;
var fb_window_switch = false;
var filterConfigObj = {};
var fieldListObjAll = {};
var cur_menuId = "";
var tableId = "";
var windowWidth = $(window).width();
var fbWidth = windowWidth;
var currentHref = window.location.href;
tableId = urlStr(currentHref,"id");  //获取菜单对象的id
var menuId = urlStr(currentHref,"menuId");
var titlePage = urlStr(currentHref, "title_page");  //获取菜单对象的id
var urlParams = {title_page:titlePage};
// alert("tableId:"+tableId+" menuId:"+menuId);
// var crmPermissionTableTeam = ["主表","副表:0","副表:1"];
var crmPermissionTableTeam;

var open_window_width;
var open_window_default_width = 900;
if (open_window_width && open_window_width > 0) {
    fbWidth = open_window_width;
} else {
    fbWidth = 900;
}
var menu = menuId;

initTableTeamTab(tableId,menuId);

function selectLabelClick(me, isStatus) {
    var me = $(me);
    if (me.attr("lable_key")) {
        setCurrentFBLabelMARK(me.attr("lable_key"));
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

function initTableTeamTab(tableId,menuId){
    var url=ctx + "/cloud/menu_v1/tableTeam/" + tableId;
    $.ajax({
        type: "GET",
		url: url,   //
        async: true,
        data:{menuId:menuId},
        dataType: "json",
        success:function(data){
            console.log("页签信息接口:" + JSON.stringify(data));
            // crmPermissionTableTeam = data.map.crmPermissionTableTeam;
            crmPermissionTableTeam = JSON.parse(data.map.crmPermissionTableTeam);
            $("#tableTeamStr").html(data.map.tableTeamStr);
            tableTeamObjData();
        }
    })
}

function gvFB(j) { 
    if (menu) {
        if (crmPermissionTableTeam) {
            var cpObj = crmPermissionTableTeam;
            // alert(cpObj);
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
}


function tableTeamObjData(){
    var buttonConfigList = {};
    var tableTeamObj = JSON.parse($("#tableTeamStr").html());
    // alert(JSON.stringify(tableTeamObj));
    if (tableTeamObj != null) {
        if (tableTeamObj.members) {
            var members = JSON.parse(tableTeamObj.members);
            if (members && members.length > 0) {
                var currentKey = getCurrentFBLabelMARK();
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
                        $("#myTab5").append(
                            '<li class="tab-green ' + (i == current_mark_val ? " active" : "") + '" onclick="javascript:selectLabelClick(this);"  lable_key="' + labelKey + '"><a data-toggle="tab" href="#' + context_id + '" aria-expanded="false">' + memberObj.name + '</a></li>'
                        );
                        $("#tab-content").append('<div id="' + context_id + '" class="tab-pane ' + (i == current_mark_val ? " active" : "") + '" style="width:100%;">' + '</div>');
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
                cur_fb_config_mark = current_mark_val;
            }
        }
    }

     //控制附表显示隐藏
     showTableTitle();

}

var currentFB_Label_MARK;

function setCurrentFBLabelMARK(mark) {
    currentFB_Label_MARK = mark;
}

function getCurrentFBLabelMARK() {
    return currentFB_Label_MARK;
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
    $("#myTab5").find("li[lable_key=" + cur_fb_config_mark + "]").addClass("active");
    $($("#myTab5").find("li[lable_key=" + cur_fb_config_mark + "]")[0]).click();
}

function reloadFB() {
    var curFbMark = cur_fb_config_mark;
    var config = fb_config_obj[curFbMark];
    var iframeHeight = $(window).height() - 40;
    if (config.obj_type) {
        var setting = config.setting;
        var tableMark = config.obj_id + "_" + curFbMark;
        // var urlParams=getUrlParams();
        if (config.obj_type == "REPORT") {
            if (config.obj_id) {
                var pmData = {
                    table: current_table_select_data,
                    form: {},
                    sys: {}
                };
                var pdata = btf.button.setParamsValue(setting.params, pmData);
                var pmStr = (btf.getParamsStr(pdata));
                // var url = ctx + '/cloud/menu/tablelist/' + config.obj_id + "?" + pmStr;
                var url = "./tableList.html?id="+config.obj_id+"&"+pmStr+"&name=tableList"; 
                $("#" + curFbMark + "_context").html('<iframe width="100%" scrolling="no" frameborder="0"  src="' + url + '" height="' + iframeHeight + 'px"></iframe>');
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
                var url = './form.html?formId=' + config.obj_id;
                $("#" + curFbMark + "_context").html('<iframe width="100%" scrolling="no" frameborder="0"  src="' + url + '" height="' + iframeHeight + 'px"></iframe>');
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
                // var url = ctx + '/cloud/menu/pageLayout/' + config.obj_id + "?" + pmStr;
                var url = './pageLayout.html?pageLayoutId=' + config.obj_id + "?" + pmStr;
                $("#" + curFbMark + "_context").html('<iframe width="100%" scrolling="no" frameborder="0"  src="' + url + '" height="' + iframeHeight + 'px"></iframe>');
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
            $("#" + curFbMark + "_context").html('<iframe width="100%" id="' + curFbMark + '_iframe"   frameborder="0"  src="' + url + '" height="' + iframeHeight + 'px"></iframe>');
        } else if (config.obj_type == "TABLE_TEAM") {
            if (config.obj_id) {
                var pmData = {
                    table: current_table_select_data,
                    form: {},
                    sys: {}
                };
                var pdata = btf.button.setParamsValue(setting.params, pmData);
                $.extend(pdata, urlParams);
                var pmStr = (btf.getParamsStr(pdata));
                // var url = ctx + '/cloud/menu/tableTeamById/' + config.obj_id + "?" + pmStr;
                var url = "./tableList.html?id="+config.obj_id+"&menuId="+config.obj_id+"&"+pmStr+"&name=tableTeam";
                $("#" + curFbMark + "_context").html('<iframe width="100%" scrolling="no" frameborder="0"  src="' + url + '" height="' + iframeHeight + 'px"></iframe>');
            }
        }
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