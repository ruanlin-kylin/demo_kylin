var selectDivId = "";
var selectDivName = "";
var clearanceWidth = 4;
var clearanceHeight = 10;
var bottomHeight = 28;
var minDivCount = 0;
var cWidth = 0;
var cHeight = 0;
var popStyle = {
    "popDiv":{
        "backgroundColor":"#ffffff",
        "width":"600px",
        "height":"600px",
        "position":"absolute",
        "zIndex":1000,
        "border":"2px solid #9aa8b5",
        "boxShadow":"rgba(62, 62, 62, 0.25) 2px 1px 9.5px 2px",
        "left":"0px",
        "right":"0px",
        "top":"0px",
        "bottom":"0px",
        "margin":"auto"
    },
    "headPop":{
        "backgroundColor":"#aecae6",
        "width":"100%",
        "height":"25px",
        "position":"relative",
        "zIndex":0,
        "border":"0px solid #9aa8b5",
        "borderBottom":"1px solid #9aa8b5",
        "boxShadow":"0",
        "left":"0px",
        "right":"0px",
        "top":"0px",
        "bottom":"0px",
        "margin":"0 auto"
    },
    "contentPop":{
        "width":"100%",
        "height":"100%",
        "padding":"5px",
        "border":"0px",
        "position":"absolute",
        "top":"26px",
        "bottom":"2px",
        "left":"0px",
        "right":"0px"
    },
    "headTitle":{
        "backgroundColor":"transparent",
        "position":"absolute",
        "width":"120px",
        "height":"25px",
        "border":"0px solid",
        "right":"auto",
        "left":"10px",
        "zIndex":0,
        "color":"#ffffff",
        "lineHeight":"25px"
    },
    "headIcon":{
        "backgroundColor":"transparent",
        "position":"absolute",
        "width":"80px",
        "height":"25px",
        "border":"0px solid",
        "right":"0px",
        "zIndex":0,
    }

};


//窗口改变时 重新定义位置
window.onresize = function(){
    var customWS = document.getElementsByClassName("popDiv");
    var iFrame = document.getElementById("iframe_src");
    if(customWS.length>0){
        for(var i = 0;i<customWS.length;i++){
            //为popDiv添加样式  重新定义样式
            if(customWS[i].getAttribute("d_name")=="w"){
                /*var windowWidth = window.innerWidth;
                var windowHeight = window.innerHeight;
                popStyle.popDiv.width = windowWidth * 0.8;
                popStyle.popDiv.height = windowHeight * 0.8;*/
                setPopAttrStyle(customWS[i],popStyle.popDiv,cWidth,cHeight);
            }
        }
    }
}

window.onload = function(){
    //为popDiv添加拖动效果
    var customW = document.getElementsByClassName("custom_w");
    var iFrame = document.getElementById("iframe_src");
    for(var i = 0;i<customW.length;i++){
        customW[i].onclick = function(){
            var name = this.getAttribute("name");
            var iName = this.getAttribute("iName");
            if(parseInt(iName)==0){
                var value = this.innerHTML;
                createDiv(name,value,iFrame,"http://www.baidu.com");
                this.setAttribute("iName",1);
            }else{
                alert("已经打开过当前的窗口");
                return;
            }
        }
    }
}

/**
 * 创建div
 * @param popName 当前div的id的标识符
 * @param myVal 标题
 *
 */
function createDiv(popName,myVal,iFrameId,childFrameUrl,width,height){
    // var iFrame = document.getElementById(iFrameId);
    //创建div
    var popDiv = document.createElement("div");
    var popIdName = "popDiv"+popName;
    selectDivId = popIdName;
    selectDivName = popName;
    //为div创建属性class = "popDiv";
    var popDivAttr = document.createAttribute("class");
    var popDivId = document.createAttribute("id");
    var popDivName = document.createAttribute("name");
    var popDName = document.createAttribute("d_name");
    popDivAttr.value = "popDiv resizeMe";
    popDivId.value = popIdName;
    popDivName.value = popName;
    popDName.value = "w";  //此属性用来判断是外面还是底下里面那个的div
    //把属性class = "popDiv"添加到popDiv
    popDiv.setAttributeNode(popDivAttr);
    popDiv.setAttributeNode(popDivId);
    popDiv.setAttributeNode(popDivName);
    popDiv.setAttributeNode(popDName);  //
    popDiv.id = popIdName;
    //为popDiv添加样式
    cWidth = width;
    cHeight = height;
    popStyle.popDiv.width = cWidth + "px";
    popStyle.popDiv.height = cHeight + "px";
    setPopAttrStyle(popDiv,popStyle.popDiv,cWidth,cHeight);
    popDiv.onmouseover = function () {  //鼠标移上去改变鼠标样式
        this.style.cursor = "default";
        selectDivId = this.getAttribute("id");
        selectDivName = this.getAttribute("name");
    }
    popDiv.onclick = function () {
        var popDivs = document.getElementsByClassName("popDiv");  //获取当前frame里的所有popDiv
        for(var i = 0;i<popDivs.length;i++){
            popDivs[i].style.zIndex = i + 1;
        }
        this.style.zIndex = 1000;
        selectDivId = this.getAttribute("id");
        selectDivName = this.getAttribute("name");
    }

    var containerDiv = document.createElement("div");
    var containerAttr = document.createAttribute("id");
    containerAttr.value = "container_id";  //设置属性id的值
    containerDiv.setAttributeNode(containerAttr);
    containerDiv.style.width = "99%";
    containerDiv.style.minHeight = "1px";
    // containerDiv.style.border = "1px solid";
    containerDiv.style.position = "fixed";
    containerDiv.style.top = "auto";
    containerDiv.style.bottom = "2px";

    //header头部
    var headIdName = "headPop"+popName;
    var headPop = document.createElement("div");
    var headAttr = document.createAttribute("class");
    var headDivId = document.createAttribute("id");
    headAttr.value = "headPop";
    headDivId.value = headIdName;
    headPop.title = "双击放大或拖动";
    headPop.setAttributeNode(headAttr);
    headPop.setAttributeNode(headDivId);
    setHeadAttrStyle(headPop,popStyle.headPop);
    headPop.onclick = function () {
        var popDivs = document.getElementsByClassName("popDiv");  //获取当前frame里的所有popDiv
        for(var i = 0;i<popDivs.length;i++){
            popDivs[i].style.zIndex = i + 1;
        }
        this.parentNode.style.zIndex = 1000;
        selectDivId = this.parentNode.getAttribute("id");
        selectDivName = popName;
    }
    /*headPop.ondblclick = function () {   //双击放大
        var maxImg = headPop.getElementsByClassName("max_img")[0];
        var name = maxImg.getAttribute("name");
        if(parseInt(name)==0){  //缩小
            headPop.title = "双击缩小";
            maxImg.title = "还原";
            maxImg.name = 1;
            headIconDiv.style.width = "80px";
            updatePopDiv(popDiv);
        }else{  //放大
            headPop.title = "双击放大或拖动";
            maxImg.title = "最大化";
            maxImg.name = 0;
            popDiv.style.position = "absolute";
            popDiv.style.float = "none";
            popDiv.setAttribute("d_name","w");
            headIconDiv.style.width = "80px";
            setPopAttrStyle(popDiv,popStyle.popDiv,cWidth,cHeight);
            againIframe(document);
        }
    }*/


    //内容
    var contentDiv = document.createElement("div");
    var contentClass = document.createAttribute("class");
    contentClass.value = "con_frame_pop";
    contentDiv.setAttributeNode(contentClass);
    setContentAttrStyle(contentDiv,popStyle.contentPop);

    //iframe
    var sIframe = document.createElement("iframe");
    //sIframe.src = '<iframe id="siframe_src" name="content_iframe" width="100%" height="100%" frameborder="0" src="http://www.baidu.com"></iframe>';
    sIframe.src = childFrameUrl;  //iframe的url地址
    sIframe.id = "frame_src"+popName; //iframe的id
    sIframe.name = "content_iframe_"+popName;
    sIframe.width = (parseInt(popDiv.style.width)-clearanceWidth) + "px";
    sIframe.height = (parseInt(popDiv.style.height)-bottomHeight) + "px";
    sIframe.hspace="0";
    sIframe.vspace="0";
    sIframe.style.border = "0px";
    sIframe.frameborder="0";
    contentDiv.appendChild(sIframe);

    //头部标题
    var headTitleDiv = document.createElement("div");
    var headTitleIcon = document.createAttribute("class");
    headTitleIcon.value = "headTitleIcon";
    headTitleDiv.setAttributeNode(headTitleIcon);
    headTitleDiv.innerHTML = myVal;
    setHeadAttrStyle(headTitleDiv,popStyle.headTitle);

    //头部图标的操作 (右侧)
    var headIconDiv = document.createElement("div");
    var headIcon = document.createAttribute("class");
    headIcon.value = "headIcon";
    // headIcon.title = "拖动";
    headIconDiv.setAttributeNode(headIcon);
    setHeadAttrStyle(headIconDiv,popStyle.headIcon);

    //最小图标
    var minIcon = document.createElement("span");
    minIcon.style.float = "left";
    minIcon.style.margin = "2px";
    var minIconSpan = document.createAttribute("class");
    var minSpanImg = document.createElement("img");
    minSpanImg.src = ctx + "/assetsv1/img/minIcon.png";
    minSpanImg.style.cursor = "pointer";
    minSpanImg.style.margin = "2px";
    minSpanImg.title = "最小化";
    minSpanImg.name = 1;
    minIconSpan.value = "minSpan";
    minIcon.appendChild(minSpanImg);
    minSpanImg.onclick = function(){
        var containerBottom = document.getElementById("container_id");
        var currentHead = document.getElementById(headIdName);
        var name = this.name;
        if(minDivCount<0){
            minDivCount=0;
        }
        // if(name==1){
        // popDiv.style.bottom = "55px";
        this.title = "最小化";
        currentHead.title = "禁止拖动";
        popDiv.style.width = "150px";
        popDiv.style.height = "25px";
        popDiv.style.position = "relative";
        popDiv.style.float = "left";
        popDiv.style.top = "0px";
        popDiv.setAttribute("d_name","l");
        currentHead.onmousedown = null;
        // popDiv.style.top = "auto";
        // popDiv.style.left =  (minDivCount*parseInt(popDiv.style.width)+(minDivCount+1)*10) + "px";
        popDiv.style.left = "20px";
        headIconDiv.style.width = "60px";
        this.name = 0;
        sIframe.width = "0px";
        sIframe.height = "0px";
        sIframe.style.display = "none";
        this.style.display = "none";
        minDivCount++;
        containerBottom.appendChild(popDiv);
        // }else{
        //     minDivCount--;
        //     this.title = "最小化";
        //     this.name = 1;
        //     sIframe.style.display = "block";
        //     sIframe.width = (parseInt(popDiv.style.width-clearanceWidth))+"px";
        //     sIframe.height = (parseInt(popDiv.style.width-clearanceHeight))+"px";
        //     setPopAttrStyle(popDiv,popStyle.popDiv,iFrame);
        // }
    }

    //最大图标
    var maxIcon = document.createElement("span");
    maxIcon.style.float = "left";
    maxIcon.style.margin = "2px";
    var maxIconSpan = document.createAttribute("class");
    var maxSpanImg = document.createElement("img");
    var maxImgClass = document.createAttribute("class");
    // maxSpanImg.src = "../../img/maxIcon.png";
    maxIconSpan.value = "maxImgSpan";
    maxSpanImg.src = ctx + "/assetsv1/img/maxIcon.png";
    maxSpanImg.title = "最大化";
    maxSpanImg.name = 0;
    maxSpanImg.style.cursor = "pointer";
    maxSpanImg.style.margin = "2px";
    maxImgClass.value = "max_img";
    maxSpanImg.setAttributeNode(maxImgClass);
    maxIcon.setAttributeNode(maxIconSpan);
    maxIcon.appendChild(maxSpanImg);
    maxSpanImg.onclick = function(){
        var name = this.name;
        minDivCount--;
        setPopDivDrag(sIframe,iFrameId,popIdName,headIdName);
        if(name==0){
            document.body.appendChild(popDiv);
            this.title = "还原";
            headIconDiv.style.width = "80px";
            this.name = 1;
            minSpanImg.style.display = "inline-block";
            updatePopDiv(popDiv);
        }else{
            document.body.appendChild(popDiv);
            this.title = "最大化";
            this.name = 0;
            popDiv.style.position = "absolute";
            popDiv.style.float = "none";
            popDiv.setAttribute("d_name","w");
            headIconDiv.style.width = "80px";
            setPopAttrStyle(popDiv,popStyle.popDiv,cWidth,cHeight);
            againIframe(document);
        }
    }

    //关闭图标
    var closeIcon = document.createElement("span"); //508784312
    closeIcon.style.float = "left";
    closeIcon.style.margin = "2px";
    var closeIconSpan = document.createAttribute("class");
    var closeSpanImg = document.createElement("img");
    closeSpanImg.src = ctx + "/assetsv1/img/closeIcon.png";
    closeSpanImg.title = "关闭";
    closeSpanImg.style.cursor = "pointer";
    closeSpanImg.style.margin = "2px";
    closeIconSpan.value = "closeSpan";
    closeIcon.appendChild(closeSpanImg);
    closeSpanImg.onclick = function(){
        popDiv.parentNode.removeChild(popDiv);
        updateIName(popName);
    }

    //添加div和span
    headIconDiv.appendChild(minIcon);
    headIconDiv.appendChild(maxIcon);
    headIconDiv.appendChild(closeIcon);
    headPop.appendChild(headTitleDiv);
    headPop.appendChild(headIconDiv);
    popDiv.appendChild(headPop);
    popDiv.appendChild(contentDiv);

    document.body.appendChild(popDiv);   //在iframe中添加div窗口

    //放大和缩小的事件 闭包 堆栈
    document.onmousedown = doDown;
    document.onmouseup = doUp;
    document.onmousemove = doMove;

    setPopDivDrag(sIframe,iFrameId,popIdName,headIdName);

    var currentContainer = document.getElementById("container_id");
    if(document.body.contains(currentContainer)){  //如果存在
        return;
    }else{
        document.body.appendChild(containerDiv);
    }
}


function setPopDivDrag(sIframe,iFrameId,popDivId,headId){
    // var oDiv = document.getElementById(popDivId);
    // var headDiv=document.getElementById(headId);
    var oDiv =document.getElementById(popDivId);
    var headDiv = document.getElementById(headId);
    var iFrameWidth = document.body.clientWidth;
    var iFrameHeight = document.body.clientHeight;

    var disX=0;
    var disY=0;
    headDiv.onmousedown = function(ev){  //按下拖动
        var oEvent=ev||window.event;
        disX=oEvent.clientX-oDiv.offsetLeft;
        disY=oEvent.clientY-oDiv.offsetTop;
        setCurrentDivIndex(oDiv);   //按下时 当前的div显示在最上面
        sIframe.style.display = "none";
        document.onmousemove=function (ev){
            var oEvent2=ev||window.event;
            var l=oEvent2.clientX-disX;
            var t=oEvent2.clientY-disY;
            if(l<0)
            {
                l=0;
            }
            else if(l>iFrameWidth-oDiv.offsetWidth)
            {
//				l=$(window).width()-oDiv.offsetWidth;
                l=iFrameWidth-oDiv.offsetWidth;
            }

            if(t<0)
            {
                t=0;
            }
            else if(t>iFrameHeight-oDiv.offsetHeight)
            {
                t=iFrameHeight-oDiv.offsetHeight;
            }
            oDiv.style.left=l+'px';
            oDiv.style.top=t+'px';
    };

        document.onmouseup=function () {
            sIframe.style.display = "block";

            document.onmousemove=null;
            document.onmouseup=null;

            document.onmousedown = doDown;
            document.onmouseup = doUp;
            document.onmousemove = doMove;
        };
        return false;
    }
}
function setPopAttrStyle(popDiv,styleObj,cWidth,cHeight){
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var popDivStyle = document.createAttribute("style");
    popDiv.setAttributeNode(popDivStyle);
    popDiv.style.backgroundColor = styleObj.backgroundColor;
    popDiv.style.width = styleObj.width;
    popDiv.style.height = styleObj.height;
    popDiv.style.position = styleObj.position;
    popDiv.style.zIndex = styleObj.zIndex;
    popDiv.style.border = styleObj.border;
    popDiv.style.boxShadow = styleObj.boxShadow;
    popDiv.style.left = (windowWidth - cWidth)/2+"px";
    popDiv.style.top = (windowHeight - cHeight)/2+"px";
}

function setHeadAttrStyle(headDiv,styleObj){
    var headDivStyle = document.createAttribute("style");
    headDiv.setAttributeNode(headDivStyle);
    headDiv.style.backgroundColor = styleObj.backgroundColor;
    headDiv.style.width = styleObj.width;
    headDiv.style.height = styleObj.height;
    headDiv.style.position = styleObj.position;
    headDiv.style.zIndex = styleObj.zIndex;
    headDiv.style.border = styleObj.border;
    headDiv.style.borderBottom = styleObj.borderBottom;
    headDiv.style.boxShadow = styleObj.boxShadow;
    headDiv.style.top = styleObj.top;
    headDiv.style.left = styleObj.left;
    headDiv.style.right = styleObj.right;
    headDiv.style.color = styleObj.color;
    headDiv.style.lineHeight = styleObj.lineHeight;
    headDiv.style.bottom = styleObj.bottom;
    headDiv.style.margin = styleObj.margin;
    // headDiv.title = "拖动";
}

function setContentAttrStyle(conDiv,styleObj) {
    conDiv.style.position = styleObj.position;
    conDiv.style.left = styleObj.left;
    conDiv.style.right = styleObj.right;
    conDiv.style.bottom = styleObj.bottom;
    conDiv.style.top = styleObj.top;
    conDiv.style.border = styleObj.border;
}

function setCurrentDivIndex(popDiv){
    var popDivs = document.getElementsByClassName("popDiv");
    for(var i = 0;i<popDivs.length;i++){
        popDivs[i].style.zIndex = 10+i;
    }
    popDiv.style.zIndex = 10000;  //
}

//关闭的时候重新更新iName 
function updateIName(name){
    var customWs = document.getElementsByClassName("custom_w");
    for(var i = 0;i<customWs.length;i++){
        var cName = customWs[i].getAttribute("name");
        if(cName==name){
            customWs[i].setAttribute("iName",0)
        }
    }
}

//放大时 展示的div
function updatePopDiv(popDiv) {
    popDiv.style.position = "absolute";
    popDiv.style.left = "0px";
    popDiv.style.top = "0px";
    popDiv.style.float = "none";
    popDiv.setAttribute("d_name","w");
    // popDiv.style.width = "99.9%";
    popDiv.style.width = (document.body.clientWidth-clearanceWidth)+"px";
    // popDiv.style.height = "100%";
    // popDiv.style.height = (iFrame.contentDocument.body.clientHeight-bottomHeight) + "px";
    popDiv.style.height = (document.body.clientHeight) + "px";
    popDiv.style.padding = "0px";
    popDiv.style.margin = "0px";
    popDiv.style.border = "2px solid rgb(154, 168, 181)";
    againIframe(document);
}
