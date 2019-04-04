$(document).ready(function(){
  $("form").delegate(".component", "mousedown", function(md){
    $(".popover").remove();

    md.preventDefault();
    var tops = [];
    var mouseX = md.pageX;
    var mouseY = md.pageY;
    var $temp;
    var timeout;
    var $this = $(this);
    var delays = {
      main: 120,
      form: 300
    }
    var type;

    if($this.parents("form").attr("id") === "components"){
      type = "main";
    } else {
      type = "form";
    }

    var delayed = setTimeout(function(){
//      if(type === "main"){
        $temp = $("<form class='form-horizontal span6' id='temp'></form>").append($this.clone());
        if(type=="form"){
        	$this.css({"opacity"  : "0.3"});
        }
//      } else {
//        if($this.attr("id") !== "legend"){
//          $temp = $("<form class='form-horizontal span6' id='temp'></form>").append($this);
//        }
//      }

      $("body").append($temp);

      $temp.css({"border-color":"red",
    	  		 "position" : "absolute",
                 "top"      : mouseY - ($this.height()/2) + "px",
                 "left"     : mouseX - ($temp.width()/2) + "px",
                 "opacity"  : "0.9"}).show();

      var half_box_height = ($temp.height()/2);
      var half_box_width = ($temp.width()/2);
      var $target = $("#target");
      var tar_pos = $target.position();
      var $target_component = $("#target .component");
      var $bottom;

      $(document).delegate("body", "mousemove", function(mm){

        var mm_mouseX = mm.pageX;
        var mm_mouseY = mm.pageY;

        $temp.css({"top"      : mm_mouseY - half_box_height + "px",
          "left"      : mm_mouseX - half_box_width  + "px"});

        if ( mm_mouseX > tar_pos.left &&
          mm_mouseX < tar_pos.left + $target.width() + $temp.width()/2 &&
          mm_mouseY > tar_pos.top &&
          mm_mouseY < tar_pos.top + $target.height() + $temp.height()/2
          ){
            $("#target").css("background-color", "#fafdff");
            $target_component.css({"border-top" : "1px solid white", "border-bottom" : "none"});
            tops = $.grep($target_component, function(e){
              return ($(e).position().top -  mm_mouseY + half_box_height > 0 && $(e).attr("id") !== "legend");
            });
            if (tops.length > 0){
              $(tops[0]).css("border-top", "1px solid #22aaff");
            } else{
              if($target_component.length > 0){
                $($target_component[$target_component.length - 1]).css("border-bottom", "1px solid #22aaff");
                $bottom=$target_component[$target_component.length - 1];
              }
            }
          } else{
            $("#target").css("background-color", "#fff");
            $target_component.css({"border-top" : "1px solid white", "border-bottom" : "none"});
            $target.css("background-color", "#fff");
          }
      });

      $("body").delegate("#temp", "mouseup", function(mu){
        mu.preventDefault();

        var mu_mouseX = mu.pageX;
        var mu_mouseY = mu.pageY;
        var tar_pos = $target.position();

        $("#target .component").css({"border-top" : "1px solid white", "border-bottom" : "none"});

        // acting only if mouse is in right place
        if (mu_mouseX + half_box_width > tar_pos.left &&
          mu_mouseX - half_box_width < tar_pos.left + $target.width() &&
          mu_mouseY + half_box_height > tar_pos.top &&
          mu_mouseY - half_box_height < tar_pos.top + $target.height()
          ){
            $temp.attr("style", null);
            // where to add
            if(tops.length > 0){
            	$($temp.html()).insertBefore(tops[0]);
            } else if($bottom){
            	$($temp.html()).insertAfter($bottom);
            } else if($target_component.length == 0){
            	$("#target fieldset").append($temp.append("\n\n\ \ \ \ ").html());
            } else {
            	$this.css("opacity","1");
            }
            if(type=="form" && $this.css("opacity")!=1){
            	$this.remove();
            }
          } else {
            // no add
        	if(type=="form" && $this.css("opacity")!=1){
              	$this.remove();
            }
            $("#target .component").css({"border-top" : "1px solid white", "border-bottom" : "none"});
            tops = [];
          }

        //clean up & add popover
        $target.css("background-color", "#fff");
        $(document).undelegate("body", "mousemove");
        $("body").undelegate("#temp","mouseup");
        $("#target .component").popover({trigger: "manual"});
        $temp.remove();
        genSource();
      });
    }, delays[type]);

    $(document).mouseup(function () {
      clearInterval(delayed);
      return false;
    });
    $(this).mouseout(function () {
      clearInterval(delayed);
      return false;
    });
  });

  var genSource = function(){
    var $temptxt = $("<div>").html($("#build").html());
    $($temptxt).find(".component").attr({"title": null,
      "data-original-title":null,
      "data-type": null,
      "data-content": null,
      "rel": null,
      "trigger":null});
    $($temptxt).find(".valtype").attr("data-valtype", null).removeClass("valtype");
    $($temptxt).find(".component").removeClass("component");
    $($temptxt).find("form").attr({"id":  null, "style": null});
    $("#source").val($temptxt.html().replace(/\n\ \ \ \ \ \ \ \ \ \ \ \ /g,"\n"));
  }

  //activate legend popover
  $("#target .component").popover({trigger: "manual"});
  
  
  
  
  
  
  
  
  
  
  
  
  
  //popover on click event####################################################################################################################################
  $("#target").delegate(".component", "click", function(e){
    e.preventDefault();
    $(".popover").hide();
    var $active_component = $(this);
    $active_component.popover("show");
    
    //##########填充编辑界面表单
    var html_type=$active_component.attr("html_type");
    var formFieldStr=$active_component.attr("formField");
    var formField={};
    var validate={};
    if(formFieldStr){
    	formField=JSON.parse(formFieldStr);
    	validate=formField["validate"];
    	
    }
    $(".popover [name='name']").val($active_component.find("[name='name']").text().replace("*","").trim());	//标题
    $(".popover [name='val_key']").val(formField["val_key"]);								//参数名
    $(".popover .key-form-entry").html($("#valKeyOptions").html());
    if(formField["elem_width"]){
    	$(".popover [name='elem_width']").val(formField["elem_width"]);						//宽度
    }
    $(".popover [name='is_show']").attr("checked",formField["is_show"]=="0");				//是否显示
    $(".popover [name='is_null']").attr("checked",formField["is_null"]=="0");				//是否为空
    $(".popover [name='is_edit']").attr("checked",formField["is_edit"]=="0");				//能否编辑
    
    if(html_type=="INPUT" || html_type=="TEXTAREA"){
        $(".popover [name='default_val']").val(formField["default_val"]);
        $(".popover [name='min_length']").val(validate["min_length"]);
        $(".popover [name='max_length']").val(validate["max_length"]);
        $(".popover [name='vali_obj']").val(validate["vali_obj"]);
  	}else if(html_type=="DATETIME-INPUT" || html_type=="DATE-INPUT" || html_type=="TIME-INPUT"){
  		$(".popover [name='default_val']").val(formField["default_val"]);
        $(".popover [name='min_date']").val(validate["min_date"]);
        $(".popover [name='max_date']").val(validate["max_date"]);
  	}else if(html_type=="SELECT"){
  		$(".popover [name='default_val']").val(formField["default_val"]);
  		var options=$.map($active_component.find("[name='element']").find("option"), function(e,i){
            return $(e).val()+"/"+$(e).text().trim();
          });
  		$(".popover [name='option']").val(options.join("\n"));
  	}else if(html_type=="CHECKBOX" || html_type=="RADIO" || html_type=="CHECKBOX_BLOCK" || html_type=="RADIO_BLOCK"){
  		$(".popover [name='default_val']").val(formField["default_val"]);
  		var options=$.map($active_component.find("[name='element']").find("label"), function(e,i){
            return $(e).find("input").val()+"/"+$(e).text().trim()
  		});
  		$(".popover [name='option']").val(options.join("\n"));
  	}else if(html_type=="UPPICTURE" || html_type=="UPFILE"){
        $(".popover [name='min_length']").val(validate["min_length"]);
        $(".popover [name='max_length']").val(validate["max_length"]);
        $(".popover [name='vali_obj']").val(validate["vali_obj"]);
  	}else if(html_type=="SEARCH" || html_type=="SEARCH_MORE"){
        $(".popover [name='default_val']").val(formField["default_val"]);
        var wordbook=formField["wordbook"];
        if(wordbook){
        	$(".popover [name='wordbook-id']").val(wordbook["id"]);
        	$(".popover [name='wordbook-value']").val(wordbook["name"]);
        	$(".popover [name='value_key']").val(wordbook["value_key"]);
        	var setting=wordbook["setting"];
        	if(setting){
        		var cascading=setting["cascading"];
        		if(cascading){
	        		for(var i=0;i<cascading.length;i++){
	        			$(".popover").find(".cascade-fields").append("<label values='"+cascading[i]["value"]+"' name='"+cascading[i]["form.name"]+"'>"
	        					+cascading[i]["form.name"]+"("+cascading[i]["value"]+")<em class='delete-form-field cascade-delete'></em></label>");
	        		}
        		}
        	}
        }
        
        //搜索框——初始化级联字段下拉菜单及搜索框
  		var liStr=$.map($("#target").find(".component").not($active_component).find("label[name='name']"), function(e,i){
            return "<li form_id='"+$(e).text().replace("*","").trim()+"'>"+$(e).text().replace("*","").trim()+"</li>";
  		});
  		$(".popover [name='cascade-elem']").siblings("ul").empty().html(liStr);
  		searchWord($(".popover-content"));
  	}
      
    //##########编辑界面点击确认按钮
    $(".popover").delegate(".btn-info", "click", function(e){
    	e.preventDefault();
    	
    	var formField={};
    	var validate={};
    	formField["html_type"]=html_type;
    	formField["name"]=$(".popover [name='name']").val();						//标题
    	formField["val_key"]=$(".popover [name='val_key']").val();					//name属性
    	formField["elem_width"]=$(".popover [name='elem_width']").val();			//宽度
    	formField["is_show"]=$(".popover [name='is_show']:checked").val()=="0"?"0":"1";	//是否显示
    	formField["is_null"]=$(".popover [name='is_null']:checked").val()=="0"?"0":"1";	//是否为空
    	formField["is_edit"]=$(".popover [name='is_edit']:checked").val()=="0"?"0":"1";	//能否编辑
    	
    	if(html_type=="INPUT" || html_type=="TEXTAREA"){
        	formField["default_val"]=$(".popover [name='default_val']").val();
        	validate["vali_obj"]=$(".popover [name='vali_obj']").val();
        	validate["min_length"]=$(".popover [name='min_length']").val();
        	validate["max_length"]=$(".popover [name='max_length']").val();
        	formField["validate"]=validate;
      	}else if(html_type=="DATETIME-INPUT" || html_type=="DATE-INPUT" || html_type=="TIME-INPUT"){
      		formField["default_val"]=$(".popover [name='default_val']").val();
        	validate["min_date"]=$(".popover [name='min_date']").val();
        	validate["max_date"]=$(".popover [name='max_date']").val();
        	formField["validate"]=validate;
      	}else if(html_type=="SELECT"){
      		var element = $active_component.find("[name='element']");
      		$(element).empty();
      		formField["default_val"]=$(".popover [name='default_val']").val();
      		var options = $(".popover [name='option']").val().split("\n");
            var option = {};
            $.each(options, function(i,e){
                var text = e;
                var val = e;
                var array = e.split("/");
                if(array.length==2){
                  val=array[0];
                  text=array[1];
                }
                option[text]=val;
                $(element).append("\n      ");
                $(element).append($("<option value='"+val+"'>"+text+"</option>"));
            });
            formField["option"]=option;
      	}else if(html_type=="CHECKBOX" || html_type=="RADIO" || html_type=="CHECKBOX_BLOCK" || html_type=="RADIO_BLOCK"){
      		var element = $active_component.find("[name='element']");
      		$(element).empty();
      		formField["default_val"]=$(".popover [name='default_val']").val();
      		var options = $(".popover [name='option']").val().split("\n");
            var option = {};
            $.each(options, function(i,e){
                var text = e;
                var val = e;
                var array = e.split("/");
                if(array.length==2){
                  val=array[0];
                  text=array[1];
                }
                option[text]=val;
                $(element).append("\n");
                if(html_type=="CHECKBOX"){
                	$(element).append("<label class='inline'><input type='checkbox' value='"+val+"'>"+text+"</label>");
                }else if(html_type=="RADIO"){
                	$(element).append("<label class='inline'><input type='radio' value='"+val+"'>"+text+"</label>");
                }else if(html_type=="CHECKBOX_BLOCK"){
                	$(element).append("<label class='block'><input type='checkbox' value='"+val+"'>"+text+"</label>");
                }else if(html_type=="RADIO_BLOCK"){
                	$(element).append("<label class='block'><input type='radio' value='"+val+"'>"+text+"</label>");
                }
            });
            formField["option"]=option;
      	}else if(html_type=="UPPICTURE" || html_type=="UPFILE"){
        	validate["min_length"]=$(".popover [name='min_length']").val();
        	validate["max_length"]=$(".popover [name='max_length']").val();
        	formField["validate"]=validate;
      	}else if(html_type=="SEARCH" || html_type=="SEARCH_MORE"){
      		formField["default_val"]=$(".popover [name='default_val']").val();
      		var wordbook={};
      		wordbook["id"]=$(".popover [name='wordbook-id']").val();
      		wordbook["name"]=$(".popover [name='wordbook-value']").val();
      		wordbook["value_key"]=$(".popover [name='value_key']").val();
      		var setting={};
      		var cascading=[];
      		$(".popover .cascade-fields").find("label").each(function(){
      			cascading.push({"form.name":$(this).attr("name"),"value":$(this).attr("values")});
      		});
      		setting["cascading"]=cascading;
      		wordbook["setting"]=setting;
      		formField["wordbook"]=wordbook;
      	}
    	$active_component.attr("formField",JSON.stringify(formField));
  
    	$active_component.popover("hide");
    	var nameHtml=$(".popover [name='name']").val();
    	if($(".popover [name='is_null']:checked").val()==0){
    		nameHtml+='<font class="redRequired" color="red">*</font>';
    	}
    	$active_component.find("[name='name']").html(nameHtml);
    	$active_component.removeClass("col-xs-12 col-xs-6 col-xs-4 col-xs-3").addClass("col-xs-"+$(".popover [name='elem_width']").val());
    });

    //##########编辑界面点击取消按钮
    $(".popover").delegate(".btn-danger", "click", function(e){
        e.preventDefault();
        $active_component.popover("hide");
    });
    
    //搜索框——级联字段新增、删除
    $(".popover").undelegate(".cascade-add", "click"); 	//解除之前弹窗时绑定的click事件，防止多次添加
    $(".popover").delegate(".cascade-add", "click", function(e){
    	var cascadeElem=$(".popover [name='cascade-elem']").val();//姓名
    	var cascadeField=$(".popover [name='cascad-field']").val();//name
    	$(".popover").find(".cascade-fields").append("<label values='"+cascadeField+"' name='"+cascadeElem+"'>"+cascadeElem+"("+cascadeField+")<em class='delete-form-field cascade-delete'></em></label>");
    });
    $(".popover").delegate(".cascade-delete", "click", function(e){
    	$(this).parent().remove();
    });
  });
  
  $("#navtab").delegate("#sourcetab", "click", function(e){
    genSource();
  });
});
