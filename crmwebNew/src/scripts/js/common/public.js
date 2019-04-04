var ctx = "/crmweb";

var baseUrl = "http://localhost:8085/src"

var currentMenuObj = "";
var fromPm;
var formDb;
var sysDb;
var tableTeam;
var ssStr = "这是ss";

var jqgridHeight = $(window).height() - 174;

function clearLocalStory() {
    if (window.localStorage) {
        var ls = localStorage;
        ls.setItem("url", "");
        ls.setItem("obj", "");
    }
}

//获取中间的高度
function jqGridHeight(num) {
    return $(window).height() - num;
}


function parseCondition(conList, data) {
    return true;
}
// function clearAllCookie() {
//     var date = new Date();
//     date.setTime(date.getTime() - 10000);
//     var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
//     if (keys) {
//         for (var i = keys.length; i--;)
//             document.cookie = keys[i] + "=0; expire=" + date.toGMTString() + "; path=/";
//     }
// }

function clearAllCookie() {
    delCookie("JSESSIONID");
    delCookie("cur_orgId");
    delCookie("cur_orgName");
    delCookie("cur_sessionId");
    delCookie("cur_userId");
    delCookie("fullName");
    delCookie("ip");
    delCookie("trueName");
    delCookie("userId");
    delCookie("userType");
    delCookie("loginName");
    delCookie("loginFailCount");
    delCookie("orgId");
    delCookie("loginPwd");
    delCookie("orgId");
    delCookie("loginTime");
    delCookie("language");
}



//85515925887
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

/**
 * title：标题
 * isIcon：是否显示图标
 */
// function loadingContent(title,isIcon){
//     $(".loading-content").remove();
//     var loadingContent = "<div class='loading-content'>"+
//          "<div class='load-wrapp'>"+
//             "<div class='load-1'>"+
//                 "<div class='line'></div>"+
//                 "<div class='line'></div>"+
//                 "<div class='line'></div>"+
//                 // "<div class='line'></div>"+
//                 // "<div class='line'></div>"+
//             "</div>"+
//             "<p class=''>"+title+"</p>"+
//          "</div>"+
//     "</div>";
//     $("body").append(loadingContent);
// }

function showLoadingContent(title, isIcon) {
    $(".loading-content").remove();
    var currentIcon = "";
    var titleIconStr = "";
    if (isIcon) {
        currentIcon = "block";
        titleIconStr = "";
    } else {
        currentIcon = "none;";
        titleIconStr = "bottom:0px;top:0px;height:20px;";
    }
    var loadingContent = "<div class='loading-content'>" +
        "<div class='loading-pop'>" +
        "<div class='loading-spinner' style='display:" + currentIcon + "'>" +
        "<div class='rect1'></div>" +
        "<div class='rect2'></div>" +
        "<div class='rect3'></div>" +
        "<div class='rect4'></div>" +
        "<div class='rect5'></div>" +
        "</div>" +
        "<div class='loading-title' style='" + titleIconStr + "'>" + title + "</div>" +
        "</div>" +

        "</div>";
    $("body").append(loadingContent);
}

function hideLoadingContent() {
    $(".loading-content").remove();
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


function tipsMsg(msg, type) {
    if (type && type == "FAIL") {
        failAlert(msg);
    } else if (type && type == "SUCCESS") {
        successAlert(msg);
    } else {
        emtpyAlert(msg);
    }
}

function putStorageValue(key, value) {
    if (window.localStorage && key) {
        var ls = localStorage;
        ls.setItem(key, value);
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

// 保存失败 及原因
function failAlert(reson) {
    $("#prompt_fail").remove();
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

function urlStr(urlStr, name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = urlStr.substr(urlStr.indexOf("\?") + 1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

/**
 *  获取地址栏参数
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


/**
 * 扩展日期格式化 例：new Date().format("yyyy-MM-dd HH:mm:ss")
 *
 * "M+" :月份
 * "d+" : 天
 * "h+" : 小时
 * "m+" : 分钟
 * "s+" : 秒钟
 * "q+" : 季度
 * "S" : 毫秒数
 * "X": 星期 如星期一
 * "Z": 返回周 如周二
 * "F":英文星期全称，返回如 Saturday
 * "L": 三位英文星期，返回如 Sat
 * @param format 格式化字符串
 * @returns {*}
 */
Date.prototype.format = function (format) {
    if (!isValidDate(this)) {
        return '';
    }
    var week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var week_cn = ['日', '一', '二', '三', '四', '五', '六'];
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //天
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分钟
        "s+": this.getSeconds(), //秒钟
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds(), //毫秒数
        "X": "星期" + week_cn[this.getDay()], //星期
        "Z": "周" + week_cn[this.getDay()], //返回如 周二
        "F": week[this.getDay()], //英文星期全称，返回如 Saturday
        "L": week[this.getDay()].slice(0, 3) //三位英文星期，返回如 Sat
    }
    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (this.getFullYear() + "")
            .substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}


function isValidDate(d) {
    if (Object.prototype.toString.call(d) !== "[object Date]")
        return false;
    return !isNaN(d.getTime());
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
    if (m < 10) {
        m = "0" + m;
    }
    if (d < 10) {
        d = "0" + d;
    }
    if (h < 10) {
        h = "0" + h;
    }
    if (mm < 10) {
        mm = "0" + mm;
    }
    if (s < 10) {
        s = "0" + s;
    }

    var currentDate = y + "-" + m + "-" + d + " " + h + ":" + mm + ":" + s;
    return currentDate;
}

//截取script里面的src替换成当前的
function interceptionScriptSrc(scriptStr) {
    var currentStr = replaceString(scriptStr, "${ctx}/assetsv1/", "../../../../src/");
    var currentStr2 = replaceString(currentStr, "/crmweb/assetsv1", "../../../../src");
    if (currentStr2.indexOf("form.jsp") != -1 && currentStr2.indexOf("客人id") != -1) {
        var formFirstIndex = currentStr2.indexOf("客人id");
        var formLastIndex = currentStr2.indexOf("?formId"); //form.jsp
        var currentStr3 = currentStr2.substring(formFirstIndex, formLastIndex);
        var currentStr4 = currentStr3.substr(88);
        return replaceString(currentStr2, currentStr4, "openWindow(\"./form.html");
    } else {
        return currentStr2;
    }
}

function replaceString(currentStr, targetStr, newStr) {
    var sourceStr = currentStr.valueOf();
    while (sourceStr.indexOf(targetStr) !== -1) {
        sourceStr = sourceStr.replace(targetStr, newStr);
    }
    return sourceStr;
};

// String.prototype.urlStr = function (urlParam,name) {
//     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
//     var r = urlParam.substr(urlParam.indexOf("\?") + 1).match(reg);
//     if (r != null) return unescape(r[2]);
//     return null;   
// }

/*{ <div class="loading-content">
  <div class="load-wrapp">
      <div class="load-1">
          <p>Loading 1</p> 
          <div class="line"></div>
          <div class="line"></div>
          <div class="line"></div>
          <div class="line"></div>
      </div>
  </div> 
</div> }*/


// export default{
//     showLoadingContent,hideLoadingContent,clearAllCookie
// }