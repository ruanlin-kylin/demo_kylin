/**
 * Created by lirun on 2019/3/21.
 */
/*************************相关项设置部分js****************************/
/**************高亮显示某元素*****************/
function highLight(e){
    var border='thin solid #999';
    var num=0;
    var i=self.setInterval(function(){
        e.css('border',num%2==0?'1px dashed red':border);
        num++;
        if(num>9)
            window.clearInterval(i);
    },100);
    return $(this);
}

/*滚动到 最下端-新添加的位置*/
function scrollDown(e) {
    e.stop(true);
    e.animate({scrollTop: e[0].scrollHeight}, 500);	//子菜单移动
    return $(this);
}

//将选择的栏目保存为JSON对象
function buildSelMenuJson(){
    var json_=new Array();
    $.each($('#selectedList li'),function(i,e){
        e=$(e);
        var j=new Object;
        j.menuName=e.attr('field-name');
        j.menuLabel=$.trim(e.html());
        j.menuURL=e.attr('menuURL');
        json_.push(j);
    });
    return json_;
}

$(function($) {
    //排序
    $( "#selectedList" ).sortable({
        connectWith: "#selectedList.connectedSortable",
        helper: "clone",
        cursor: "move",
        tolerance :'pointer',
        dropOnEmpty: true,
        start: function(event, ui) {
        },

        receive: function(event, ui){
            var item = ui.item;
            highLight(item);
            item.removeClass('bg-optinal').addClass('bg-selected');
        },
        stop: function(event, ui) {
        }
    });

    $( "#optinalList" ).sortable({
        connectWith: "#optinalLis.connectedSortable",
        helper: "clone",
        cursor: "move",
        tolerance :'pointer',
        start: function(event, ui) {
        },
        receive: function(event, ui){
            var item = ui.item;
            highLight(item);
            item.removeClass('bg-selected').addClass('bg-optinal');
        },
        stop: function(event, ui) {
        }
    });


    var selectedList = $("#selectedList");	//已选
    var optinalList = $("#optinalList");	//未选
    //点击 显示/隐藏
    $('#selectedList').on('click', '.bg-selected', function(){
        clickTimes++;        //记录点击次数
        var select = $(this);
        if(clickTimes==2){      //当点击次数为2   双击事件
            selectedOption = $(this);
            $("#itemName").val($(this).text());
            $("#editName").modal();
            clickTimes=0;   //清零
        }
        //设置一个延时事件
        setTimeout(function(){
            if(clickTimes==1) {//单击事件
                var clone = select.clone();
                select.remove();
                clone.removeClass('bg-selected').addClass('bg-optinal');
                optinalList.append(clone);
                //滚动到新添加位置
                var container = $("#optinalList");		//滚动到新添加位置
                scrollDown(container);

                highLight(clone);
                clickTimes=0;   //清零
            }
        },250);
    });


    $('#optinalList').on('click', '.bg-optinal', function(){
        clickTimes++;        //记录点击次数
        var optinal = $(this);
        if(clickTimes==2){      //当点击次数为2    //双击事件
            selectedOption = $(this);
            $("#itemName").val($(this).text());
            $("#editName").modal();
            clickTimes=0;   //清零
        }
        //设置一个延时事件
        setTimeout(function(){
            if(clickTimes==1) {//单击事件
                var clone = optinal.clone();
                optinal.remove();
                clone.removeClass('bg-optinal').addClass('bg-selected');
                selectedList.append(clone);

                var container = $("#selectedList");		//滚动到新添加位置
                scrollDown(container);
                highLight(clone);
                clickTimes=0;   //清零
            }
        },250);

    });


    //点击修改名称的保存按钮
    $("#saveItemName").click(function(){
        $("#editName").modal('hide');
        selectedOption.text( $("#itemName").val());
    })
});