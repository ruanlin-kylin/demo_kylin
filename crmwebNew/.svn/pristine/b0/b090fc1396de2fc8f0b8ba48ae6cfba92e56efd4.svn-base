
/**
 * Created by lirun on 2018/11/20.
 */
$(document).ready(function(){
    //实现模态框拖拽
    $(".modal").draggable({
        handle: ".modal-header", // 只能点击头部拖动
        cursor: "pointer"
    });
    $("#addConditionModal").css("overflow", "hidden");//禁止模态对话框的半透明背景滚动
    
    //点击回退,返回上一层模态框
    $("#backToPre").click(function(){
        $("#addConditionModal").modal("hide");
        $("#addClassModal").modal("show");
    });

    //点击添加分栏线
    /*$("#addLine").click(function(){
        $("#addClassTable").append('<tr class="newPartingLine">'
					                +'<td colspan="4">'
					                +'<div>'
					                +'<input class="text" value="分割线" oldValue="分割线" readonly size="4" maxlength="8"/>'
					                + '</div>'
					                +'</td>'
					                +'</tr>');
    });*/

    //是否显示 控制开关
    $("#addClassTable").on('click','.div1',function() {
        $(this).toggleClass('close1');
        $(this).toggleClass('open1');
        $(this).find(".div2").toggleClass('close2');
        $(this).find(".div2").toggleClass('open2');
    });

    //table 排序和拖拽
    $("#addClassTable").sortable({
        //connectWith: ".connectedSortable",
        cursor:"pointer",
        items:"tr",
        opacity:0.6,
        delay:300,
        sort:true,
        disabled:false,
        revert:false,
        stop:function(event,ui){

        }
    });

  //点击搜索弹出快速查询模态框
    $("#searchBtn").click(function(){
        $("#queryForm")[0].reset();
    })

    //快速查询模态框 点击清空
    $("#clearQueryData").click(function(){
            $("#queryForm")[0].reset();
            $("#queryForm").find(".selected").removeClass("selected");
    });

    //快速查询，选择标签事件
    $("#queryForm").on("click",".queryTitle",function(){
    	if(!$(this).parents(".form-group").attr("condition")){	//日期类型只能单选
    		$(this).siblings(".queryTitle").removeClass("selected");
    	}
    	$(this).toggleClass("selected");
    });
    
    $("#queryForm").on("click",".customTimeBtn",function(){
        $(this).siblings(".queryTitle").removeClass("selected");
        $(this).siblings().toggleClass("hide")

    })

    //选中分类的一行进行选中 只能选中一行
    $("#addClassTable").on("click","tr",function(){
        if($(this).hasClass("rowSelected")){
            $(this).removeClass("rowSelected")
        }else{
            $(this).addClass("rowSelected");
            $(this).siblings().removeClass("rowSelected")
        }
    });

	//只能选择一个默认分类
    $("#addClassTable").on("click","input[name=default]",function(){
		if($(this).prop("checked")){
			$("#addClassTable").find("input[name=default]").not(this).prop("checked",false);
		}
    });

});


