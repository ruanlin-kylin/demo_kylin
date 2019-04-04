var jqgridHeight;
var allTableWidthListKey = "allTableWidthList"; //key  用来获取和存储所有的表格列的数组
$(function () {

    console.log($(window).height());
    jqgridHeight = $(window).height() - 174;


    // 模态框居中
    var wid = ($(window).width() - $(".modal-mine .modal-dialog").width()) / 2 + "px"
    $(".modal-mine .modal-dialog").css("margin-left", wid);
})

//获取中间的高度
function jqGridHeight(num) {
    return $(window).height() - num;
}

//通过Key获取所有列字符串
function getStorageTableInfo(key) {
    var str = window.localStorage.getItem(key); //通过Key获取字符串
    var arr = [];
    if (str == null || str == "") {
        return arr;
    } else {
        return JSON.parse(str);
    }
}

//通过Key保存所有列字符串
//storage输出存储 主要是存储表格每一列的信息
function setStorageTableInfo(allTableWidthList) {
    if (!window.localStorage) {
        alert("浏览器支持localStorage");
    } else {
        //主逻辑业务
        var storage = window.localStorage;
        //写入字段
        storage.setItem(allTableWidthListKey, JSON.stringify(allTableWidthList));
        // console.log(storage.allTableWidthList);
    }
}

/*按照属性值，查找对象*/
function findElem(arrayToSearch, attr, val) {
    for (var i = 0; i < arrayToSearch.length; i++) {
        if (arrayToSearch[i][attr] == val) {
            return i;
        }
    }
    return -1;
}

//把JSON字符串转换成对象
function jsonConverObj(jsonStr) {
    var obj;
    if (jsonStr != "") {
        obj = JSON.parse(jsonStr);
    } else {
        obj = null;
    }
    return obj;
}

//把对象转换成JSON字符串
function objConverJson(obj) {
    var jsonStr;
    if (obj == null) {
        jsonStr = "";
    } else {
        jsonStr = JSON.stringify(obj);
    }
    return jsonStr;
}

//每次拖动表格 判断有没有这个表格(用tableId判断)  如之前有这个表格就更新表格列的宽度 没有这个表格就新增这个表格
function updateAllTableWidth(tableId, index, newwidth) {
    var allTabWidthArray = getStorageTableInfo(allTableWidthListKey);
    var tableTdLength = $("#" + tableId).find(".jqgfirstrow").find("td"); //ui-jqgrid-hbox
    var tabObj = Object();
    tabObj.tableId = tableId;
    tabObj.tableWidthArray = [];
    var obj = new Object();
    obj.colIndex = index + 1;
    obj.colWidth = newwidth;
    tabObj.tableWidthArray.push(obj);
    tableTdLength.each(function (i) {
        if (i != index + 1) {
            var objs = new Object();
            objs.colIndex = i;
            objs.colWidth = $(tableTdLength[i]).width();
            tabObj.tableWidthArray.push(objs);
        }
    });
    //数组对象根据列colIndex进行排序
    tabObj.tableWidthArray.sort(compare("colIndex"));

    if (allTabWidthArray.length > 0) {
        var isTabWidthArray = false;
        $.each(allTabWidthArray, function (n, data) {
            if (allTabWidthArray[n].tableId == tableId) {
                allTabWidthArray[n].tableWidthArray = tabObj.tableWidthArray;
                isTabWidthArray = true;
            }
        })
        if (isTabWidthArray == false) {
            allTabWidthArray.push(tabObj);
        }
    } else {
        allTabWidthArray.push(tabObj);
    }
    setStorageTableInfo(allTabWidthArray);
    // window.localStorage.setItem(allTableWidthListKey,JSON.stringify(allTabWidthArray));
    console.log("查看每一列的宽度:" + window.localStorage.getItem(allTableWidthListKey));
}

function setbgColor(tableClass) {
    var tr = $("." + tableClass).find("tr");
    for (var i = 0; i < tr.length; i++) { // 从第二行开始遍历，i初始为1，递增
        if (i % 2 == 0) {
            $(tr[i]).addClass("select-row-bg");
        } else {
            $(tr[i]).removeClass("select-row-bg");
        }
        //          tr[i].style.backgroundColor = "red";
    }
}

//判断有没有之前表格的宽度
function judgeTableWidthArray(tableId, colLen) {
    var currentTabWidthArray = getStorageTableInfo(allTableWidthListKey);
    var currentTabWidthList = [];
    $.each(currentTabWidthArray, function (i, data) {
        if (currentTabWidthArray[i].tableId == tableId) {
            currentTabWidthList = currentTabWidthArray[i].tableWidthArray;
        }
    })
    if (currentTabWidthList.length == 0) {
        /*var tableTdObj = $("#"+tableId).find(".jqgfirstrow").find("td");  //ui-jqgrid-hbox
        tableTdObj.each(function (j) {
            var tabObj = new Object();
            tabObj.colIndex = i;
            tabObj.colWidth = $(tableTdObj[j]).width();
            currentTabWidthList.push(tabObj);
        })*/
        for (var j = 0; j < colLen; j++) {
            var tabObj = new Object();
            tabObj.colIndex = j;
            tabObj.colWidth = "";
            currentTabWidthList.push(tabObj);
        }
    }
    return currentTabWidthList;
}

//数组对象 根据index数字字段进行排序
function compare(prop) {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
        }
        if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
        }
    }
}

//判断一个字符串是否是数字
function isNumber(val) {
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if (regPos.test(val) || regNeg.test(val)) {
        return true;
    } else {
        return false;
    }
}

//左侧菜单移入移出
function menuCompact() {
    $(".nav-title").hover(
        function () {
            $(".nav-title").removeClass("nav-title-slide")
            $(this).addClass("nav-title-slide")
        },
        function () {

        }
    )
}

/**
 * 水印文字
 * @param containerId 容器的id
 * @param textArray  水印的文字 数组
 * @param textColor 字体的颜色
 * @param horizontal_spacing 水印文字的水平间距
 * @param height_spacing 水印文字的高度间距
 * @param textRotate 文字水印的倾斜度
 */
function setWaterMark(containerId, textArray, textColor, horizontal_spacing, height_spacing, textRotate) {
    /*$("#list_grid").watermark({
        texts : ["林俊杰", "喜欢打Dota", "这里是水印","水印文字"], //水印文字
        textColor : "#d2d2d2", //文字颜色
        textFont : '14px 微软雅黑', //字体
        width : 100, //水印文字的水平间距
        height : 100,  //水印文字的高度间距（低于文字高度会被替代）
        textRotate : -30 //-90到0， 负数值，不包含-90
    });*/
    //设置默认值
    var wTextArray = [];
    var wTextColor = "#d2d2d2";
    var wHorizontal_spacing = 100;
    var wHeight_spacing = 100;
    var wTextRotate = -30;
    if (containerId == "") {
        return;
    }
    if (textArray != "" && textArray.length > 0) {
        wTextArray = textArray;
    }
    if (textColor != "") {
        wTextColor = textColor;
    }
    if (horizontal_spacing != 0) {
        wHorizontal_spacing = horizontal_spacing;
    }
    if (height_spacing != 0) {
        wHeight_spacing = height_spacing;
    }
    if (textRotate && textRotate != 0) {
        wTextRotate = textRotate;
    }
    $("#" + containerId).watermark({
        texts: wTextArray, //水印文字
        textColor: wTextColor, //文字颜色
        textFont: '14px 微软雅黑', //字体
        width: wHorizontal_spacing, //水印文字的水平间距
        height: wHeight_spacing, //水印文字的高度间距（低于文字高度会被替代）
        textRotate: wTextRotate //-90到0， 负数值，不包含-90
    });
}


// 前台更多菜单下拉
$(".index-menu .more").click(function () {
    var boo = $(this).attr("a")
    $(".child-menu-panel").css("display", "none")
    if (boo == "0") {
        $(".menu-slide").slideDown("fast");
        $(this).attr("a", "1")
    } else {
        $(".menu-slide").slideUp("fast");
        $(this).attr("a", "0")
    }
    masonryFun()
})

// 前台-单个菜单下拉
$(".index-menu").on("click", ".menu-item", function () {
    $(".menu-slide").slideUp("fast");
    $(".index-menu .more").attr("a", "0")
    $(".child-menu-panel").css("display", "none")
    var that = $(this);
    var childPanel = that.find(".child-menu-panel")
    var len = childPanel.length
    console.log(len)
    if (len != 0) {
        childPanel.slideDown("fast");

    }
})

$(".index-menu").on("click", ".child-menu-panel li", function (e) {
    $(".menu-item").removeClass("def");
    e.stopPropagation();
    var that = $(this);
    //var currentTxt = that.text();
    that.css("background", "#1268a2").siblings("li").css("background", "rgba(17, 64, 96, 0.9)");
    //that.css("color", "#fff").siblings("li").css("color", "rgba(17, 64, 96, 0.9)");
    //that.closest(".menu-item").find(".txt").text(currentTxt)
    that.closest(".menu-item").addClass("def");
    that.closest(".menu-item").siblings().children("ul").children("li").css("background", "rgba(17, 64, 96, 0.9)");
    that.closest(".child-menu-panel").slideUp("fast");
})

// 自定义RADIO单选按钮

$(".btn-a-href").on("click", "em", function () {
    var that = $(this);
    var a = that.attr("a")
    that.parents(".btn-a-href").find("em").removeClass("select")
    that.addClass("select")
})

function setJqGridWidth(grid, newWidth) {
    $(grid).jqGrid('setGridWidth', newWidth)
}

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

// 自定义按钮选择标签--带打钩
/*$(".fb-type").on("click",".btn-field",function() {
  var that = $(this)
  that.parents(".fb-type").find(".btn-field").addClass("btn-field-null");
  that.removeClass("btn-field-null");
  var txt = that.text();
  $("#select_tit").text("选择" + txt)
  var key = that.attr("key")
  if(key == "report_form") {
    $(".report-form-box").show()
  } else {
    $(".report-form-box").hide()
  }
})*/


// 确定删除---隐藏modal的时候，需同时删除当前modal。remove prompt_success
function deleteAlert(okFun, cancelFun, txt) {
    var title = "确定删除？";
    if (txt) {
        title = txt;
    }
    var flag = true;
    $("#prompt_delate").remove();
    var txt = '<div id="prompt_delate"   class="modal fade modal-statu" tabindex="-1" role="dialog">'
    txt += '<div class="prompt-dialog" role="document">'
    txt += '<div class="prompt-txt">' + title + '</div>'
    txt += '<div class="prompt-set">'
    txt += '<span class="ok">确定</span>'
    txt += '<span class="cancle" data-dismiss="modal" aria-label="Close">取消</span>'
    txt += '</div></div></div>'
    $("body").append(txt)
    $("#prompt_delate").modal();
    // 确定删除-确定
    $("body").on("click", "#prompt_delate .ok", function () {
        if (flag) {
            okFun()
            $("#prompt_delate").modal("hide");
            flag = false;
        }

        //$("#prompt_delate").remove();
        //$(".modal-backdrop").remove();
        $(this).attr("data-dismiss", "modal");
    })
    // 确定删除-取消
    $("body").on("click", "#prompt_delate .cancle", function () {
        if (flag) {
            // cancelFun();
            flag = false;
        }
    })
}

function deleteAlert2(okFun, cancelFun, txt) {
    var title = "确定删除？";
    if (txt) {
        title = txt;
    }
    var flag = true;
    $("#prompt_delate").remove(); //prompt-txt
    var txt = '<div id="prompt_delate"   class="modal fade modal-statu" tabindex="-1" role="dialog">'
    txt += '<div class="prompt-dialog" role="document">'
    txt += '<div class="prompt-txt2">' + title + '</div>'
    txt += '<div class="prompt-set">'
    txt += '<span class="ok">确定</span>'
    txt += '<span class="cancle" data-dismiss="modal" aria-label="Close">取消</span>'
    txt += '</div></div></div>'
    $("body").append(txt)
    $("#prompt_delate").modal();
    // 确定删除-确定
    $("body").on("click", "#prompt_delate .ok", function () {
        if (flag) {
            okFun()
            $("#prompt_delate").modal("hide");
            flag = false;
        }

        //$("#prompt_delate").remove();
        //$(".modal-backdrop").remove();
        $(this).attr("data-dismiss", "modal");
    })
    // 确定删除-取消
    $("body").on("click", "#prompt_delate .cancle", function () {
        if (flag) {
            // cancelFun();
            flag = false;
        }
    })
}

function confirmMsg(msg, okFun, cancelFun) {
    deleteAlert(okFun, cancelFun, msg);
    //$("#prompt_delate").modal("hide");
}

function popMsgTip(msg, okFun, cancelFun) {
    deleteAlert2(okFun, cancelFun, msg);
}

function tipsMsg(msg, type) {
    if (type && type == "FAIL") {
        failAlert(msg);
    } else if (type && type == "SUCCESS") {
        successAlert(msg);
    } else {
        emtpyAlert(msg);
    }
}

// 保存成功
function successAlert(text) {
    $("#prompt_success").remove()
    var txt = '<div id="prompt_success"   class="modal fade modal-statu" tabindex="-1" role="dialog">'
    txt += '<div class="prompt-dialog" role="document">'
    txt += '<div class="prompt-txt prompt-txt-ok">' + text + '</div>'
    txt += '</div></div>'
    $("body").append(txt)
    $("#prompt_success").modal();
    setTimeout(function () {
        $("#prompt_success").modal("hide");
        //$("#prompt_success").remove();
        //$(".modal-backdrop").remove();
    }, 1500)
}

//飞入
function showRightPop(tableId) {
    $("#" + tableId).removeClass("right-wrap-show animated fadeOutRight")
    $("#" + tableId).addClass("right-wrap-show animated fadeInRight")
}
//飞出
function hideRightPop(tableId) {
    $("#" + tableId).removeClass("right-wrap-show animated fadeInRight")
    $("#" + tableId).addClass("right-wrap-show animated fadeOutRight")
}
//进来 根据width设置
function showRightPopGetWidth(divId, divWidth) {
    $("#" + divId).removeClass("right-wrap-show animated fadeOutRight")
    $("#" + divId).css({
        width: divWidth,
        right: -(divWidth)
    });
    $("#" + divId).addClass("right-wrap-show animated fadeInRight")
}
//出去
function hideRightPopGetWidth(divId, divWidth) {
    $("#" + divId).removeClass("right-wrap-show animated fadeInRight")
    $("#" + divId).css({
        width: divWidth,
        right: -(divWidth)
    });
    $("#" + divId).addClass("right-wrap-show animated fadeOutRight")
}
// 保存失败 及原因
function failAlert(reson) {
    $("#prompt_fail").remove()
    var txt = '<div id="prompt_fail" class="modal fade modal-statu" tabindex="-1" role="dialog">'
    txt += '<div class="prompt-dialog" role="document">'
    txt += '<div class="prompt-txt prompt-txt-fail">' + reson + '</div>'
    txt += '</div></div>'
    $("body").append(txt)
    $("#prompt_fail").modal();
    setTimeout(function () {
        $("#prompt_fail").modal("hide");
        $(".modal-backdrop").remove();
    }, 1500)
}

//加载提示框
function loadingTip(isTip) {
    if (isTip) {
        var loadingDiv = '<div id="loadWindow" class="load_pop">' +
            '<div class="loader">' +
            '<div class="loading-3"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>' +
            '</div>' +
            '</div>';
        $("body").append(loadingDiv);
    } else {
        $(".load_pop").remove();
    }
}


//验证是否为空
function emtpyAlert(msg) {
    $("#prompt_empty").remove()
    var txt = '<div id="prompt_empty"   class="modal fade modal-statu" tabindex="-1" role="dialog">'
    txt += '<div class="prompt-dialog2" role="document">'
    txt += '<div class="prompt-txt2 prompt-txt-fail">' + msg + '</div>'
    txt += '</div></div>'
    $("body").append(txt)
    $("#prompt_empty").modal();
    setTimeout(function () {
        $("#prompt_empty").modal("hide");
    }, 1500)
}

//时间戳格式化
function dateFormat(dateStr) {
    var time = new Date(dateStr);
    var y = time.getFullYear(); //年
    var m = time.getMonth() + 1; //月
    var d = time.getDate(); //日
    var h = time.getHours(); //时
    var mm = time.getMinutes(); //分
    var s = time.getSeconds(); //秒
    var currentDate = y + "-" + m + "-" + d + " " + h + ":" + mm + ":" + s;
    return currentDate;
}

//浮点型相加
function accAdd(arg1, arg2) {
    var r1, r2, m;
    try {
        r1 = arg1.toString().split(".")[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = arg2.toString().split(".")[1].length
    } catch (e) {
        r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (arg1 * m + arg2 * m) / m
}

//浮点型乘法
function accMul(arg1, arg2) {
    var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length
    } catch (e) {}
    try {
        m += s2.split(".")[1].length
    } catch (e) {}
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}

//浮点型除法
function accDiv(arg1, arg2) {
    var t1 = 0,
        t2 = 0,
        r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length
    } catch (e) {}
    try {
        t2 = arg2.toString().split(".")[1].length
    } catch (e) {}
    // with(Math) {
    //     r1 = Number(arg1.toString().replace(".", ""))
    //     r2 = Number(arg2.toString().replace(".", ""))
    //     return (r1 / r2) * pow(10, t2 - t1);
    // }
}

//浮点型减法
function accSub(arg1, arg2) {
    return accAdd(arg1, -arg2);
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}


$(function () {
    // 伸缩左侧菜单
    $("body").on("click", ".slide-nav", function () {
        menuCompact()
        var that = $(this)
        var slideStr = that.attr("a");

        if (slideStr == "0") {
            $(".common-container .content").addClass("content-compact").css({
                "left": navWidth + "px"
            });
            $(".logo").addClass("logo-compact");
            $(".logo .new_logo").css({
                "width": "60px"
            });
            $("#sidebar").addClass("menu-compact");
            var navWidth = $("#sidebar").width();
            $(".common-container .content").css({
                "left": navWidth + "px"
            });
            $(".common-container .menu-slide").css({
                "left": navWidth + "px"
            });
            that.attr("a", "1");
        } else {
            $(".common-container .content").removeClass("content-compact").css({
                "left": navWidth + "px"
            });
            $(".logo").removeClass("logo-compact");
            $(".logo .new_logo").css({
                "width": "auto"
            });
            $("#sidebar").removeClass("menu-compact");
            var navWidth = $("#sidebar").width();
            $(".common-container .content").css({
                "left": navWidth + "px"
            });
            $(".common-container .menu-slide").css({
                "left": navWidth + "px"
            });
            that.attr("a", "0");
        }

        if (typeof jqgridParent != "undefined") {
            if (jqgridParent) {
                var newWidth = $(jqgridParent).width();
                setJqGridWidth(jqgridObj, newWidth);
            }
        }
    })

    // 首页伸缩左侧菜单
    $("body").on("click", ".index-slide-nav", function () {
        menuCompact()
        var that = $(this)
        var slideStr = that.attr("a");
        var oldNavWidth = 168;
        var newNavWidth = 70;
        if (slideStr == "0") {
            var navWidth = $(".index-nav").width();
            $(".common-container .content").addClass("content-compact");
            $(".index-logo").addClass("logo-compact").css({
                "width": newNavWidth + "px"
            });
            $(".index-logo .new_logo").css({
                "width": "60px"
            });
            $(".index-nav .nav-list .nav-title .txt").addClass("nav_scale_style").removeClass("nav_default_style");
            $(".index-sidebar").addClass("menu-compact");
            $(".index-nav").addClass("menu-compact").css({
                "top": "40px",
                "bottom": "0px"
            });
            $(".common-container .content").css({
                "left": newNavWidth + "px"
            });
            $(".common-container .menu-slide").css({
                "left": newNavWidth + "px"
            });
            $(".common-container .index-nav").css({
                "overflow": "visible"
            });
            that.attr("a", "1");
            var navList = $(".index-sidebar div");
            if (typeof navList != "undefined") {
                var isMoveNav = false;
                navList.each(function (i) {
                    if ($(navList[i]).hasClass("nav-move-img")) {
                        isMoveNav = true;
                    }
                });
                if (isMoveNav) {
                    return;
                }
                return;
                if (navList.length > 20) {
                    var downMoveImg = '<div class="nav-move-img" style="bottom:0px;"><span class="nav-title" title="向下移动" onclick="downMoveClick(this)"><img src="' + ctx + '/assetsv1/img/down_move_icon.png"></span></div>';
                    var upMoveImg = '<div class="nav-move-img" style="top: 0px;"><span class="nav-title" title="向上移动" onclick="upMoveClick(this)"><img src="' + ctx + '/assetsv1/img/up_move_icon.png"></span></div>';
                    $(".index-sidebar").prepend(upMoveImg);
                    $(".index-sidebar").append(downMoveImg);
                }
            }
        } else {
            var navWidth = $(".index-nav").width();
            $(".common-container .content").removeClass("content-compact");
            $(".index-logo").removeClass("logo-compact").css({
                "width": oldNavWidth + "px"
            });
            $(".index-logo .new_logo").css({
                "width": "auto"
            });
            $(".index-nav .nav-list .nav-title .txt").addClass("nav_default_style").removeClass("nav_scale_style");
            $(".index-nav").removeClass("menu-compact").css({
                "top": "40px",
                "bottom": "0px"
            });
            $(".index-sidebar").removeClass("menu-compact");
            $(".common-container .content").css({
                "left": oldNavWidth + "px"
            });
            $(".common-container .menu-slide").css({
                "left": oldNavWidth + "px"
            });
            $(".common-container .index-nav").css({
                "overflow": "auto"
            });
            that.attr("a", "0");
            var navList = $(".index-nav .nav-list");
            navList.each(function (i) {
                if ($(navList[i]).hasClass("nav-move-img")) {
                    navList[i].remove();
                }
            })

        }

        /*if(typeof jqgridParent != "undefined"){s
            if(jqgridParent) {
                var newWidth = $(jqgridParent).width();
                setJqGridWidth(jqgridObj, newWidth);
            }
        }*/
    })

    // 菜单伸缩
    $(".nav-title").click(function () {
        var that = $(this);
        var a = that.attr("a");
        var slide_obj = that.siblings(".nav-child-list");
        debounce(navSlide(slide_obj, a, that), 1000);
    })

    //select下拉组件
    $("body").on("click", ".custom-select .slide", function () {
        $(this).siblings(".select-ul").slideDown("fast");
    })

    //选择select
    $("body").on("click", ".select-ul li", function () {
        var selVal = $(this).text();
        if ($(this).attr("value_txt")) {
            selVal = $(this).attr("value_txt");
        }
        //显示文本，另存id
        if ($(this).attr("id")) {
            var selId = $(this).attr("id");
        }

        $(this).parent(".select-ul").siblings("input").val(selVal);
        $(this).parent(".select-ul").siblings("input").attr("val", selId);
    })

    // 右侧面板隐藏
    $(".back-btn").click(function () {
        rightPanelAnimateS()
    })

    //根据currentPage停当前所在页面
    $(".nav-list").find("li").each(function () {
        var that = $(this);
        var keyStr = that.attr("key");
        if (keyStr == currentPage) {
            var parent = that.parents(".nav-list");
            parent.addClass("current-nav")
            parent.find(".nav-child-list").slideDown();
            that.find("a").addClass("def");
            parent.find(".nav-title").attr("a", "1");
            parent.find(".nav-title").addClass("nav-title-slide");
            return
        }
    });
    /*
        $(".nav-list").find("li").on("click",function () {
            var that = $(this);
            $(".nav-list").find("li").each(function (i) {
                $(".nav-list").find("li").eq(i).attr("key","index");
                $(".nav-list").find("li").eq(i).find("a").removeClass("def");
            });
            that.attr("key","index_nav");
            var keyStr = that.attr("key");
            if(keyStr==currentPage){
                that.parent().find("a").removeClass("def");
                that.find("a").addClass("def");
                var liTxt = that.parent().parent().find(".nav-title").find(".txt").html();
                var aTxt = that.find("a").html();
                var menu_id=that.find("a").attr("menu_id");
                var menu_name = that.find("a").attr("menu_name");
                var classify = that.find("a").attr("classify");
                var link_address = that.find("a").attr("link_address");
                var indexNavItem = "<span class='index-nav-item lab_btn_default' menu_id='"+menu_id+"' menu_name='"+menu_name+"' classify='"+classify+"' link_address='"+link_address+"' onclick='indexNavItem(this)'>"+aTxt+"<i class='head_nav_tab' onclick='headNavTab(this)'></i></span>";
                $(".index-nav-tab").append(indexNavItem);
            }
        })*/

    // content-wrao内的标题切换
    $(".list-title").on("click", "span", function () {
        var index = $(this).index();
        $(".list-title span").removeClass("def").eq(index).addClass("def");
        $(".cc-wrap-add").removeClass("def").eq(index).addClass("def");
    })

})



function navSlide(slide_obj, a, that) {
    if (slide_obj) {
        if (a == "0") {
            slide_obj.slideDown("fast");
            that.attr("a", "1");
            that.addClass("nav-title-slide")
        } else {
            slide_obj.slideUp("fast");
            that.attr("a", "0");
            that.removeClass("nav-title-slide")
        }
    }
}

/**
 * @截留函数
 */

function debounce(callback, delay) {
    var timeout;
    return (function () {
        window.clearTimeout(timeout);
        timeout = window.setTimeout(callback, delay);
    })
}

function rightPanelAnimate() {

    $(".right-wrap").addClass("right-wrap-animate");
}

function rightPanelAnimateS() {
    $(".right-wrap").removeClass("right-wrap-animate");
    // $(".right-wrap").addClass("right-wrap-animateS");
}


// 隐藏框
$(document).click(function (event) {
    var _con = $('.custom-select .slide'); // 设置目标区域
    if (!_con.is(event.target) && _con.has(event.target).length === 0) { // Mark 1
        $(".custom-select").find(".select-ul").slideUp("fast");
    }
});

function parseCondition(conList, data) {
    return true;
}
// $(document).click(function (event) {
//   alert(2);
//   var _con = $('.index-menu li'); // 设置目标区域
//   if (!_con.is(event.target) && _con.has(event.target).length === 0) { // Mark 1
//     // $(".custom-select").find(".select-ul").slideUp("fast");
//     console.log(222);
//     $(".child-menu-panel").slideUp("fast");
//   }
// });
/*
 * 获取地址栏信息
 */

// String.prototype.urlStr = function (name) {
//     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
//     var r = this.substr(this.indexOf("\?") + 1).match(reg);
//     if (r != null) return unescape(r[2]);
//     return null;
// }