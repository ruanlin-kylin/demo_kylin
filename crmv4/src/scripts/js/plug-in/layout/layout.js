$(function() {

  // 选择模式
  $("#select_ms .btn-field").click(function() {
    $("#select_ms .btn-field").addClass("btn-field-null");
    $(this).removeClass("btn-field-null")
    var key = $(this).attr("key")
    if(key == "detail") {
      $(".edictor4").show()
    } else {
      $(".edictor4").hide()
    }
  })




  // 添加附表
  $("#add_fb").click(function() {
    var titLen = $(".fb-twrap .tit").length + 1
    var newKey = "fb_" + titLen;
    var txt = '<span key='+ newKey +' class="tit">副表'+ titLen +'<em></em></span>'
    $(".fb-twrap").append(txt)
    var fb_clone = $("#fb_content").clone()
    fb_clone.removeAttr("id");
    var b = fb_clone.attr("key",newKey)
    $(".fb-content-wrap").append(fb_clone);

  })
  // 切换附表
  $(".fb-twrap").on("click",".tit",function() {
    var currenKey = $(this).attr("key");
    $(".fb-content").removeClass("fb-conten-s");
    $(".fb-content").each(function() {
      var that = $(this);
      var keyStr = that.attr("key")
      if(keyStr == currenKey) { //与标题key一致方可显示
        that.addClass("fb-conten-s");
      }
    })
  })
  // 删除附表
  $(".fb-twrap").on("click","em",function() {
    // 删除标题
    var that = $(this).parent(".tit")
    var delKey = that.attr("key");
    that.remove();
    // 删除对应内容
    $(".fb-content").each(function() {
      var that_ = $(this);
      var keyStr = that_.attr("key")
      if(keyStr == delKey) {
        that_.remove();
      }
    })
  })

  // 添加条件设置
  $(".add-fb-tj").click(function() {
    var str = '<div class="tj-set-child"><div class="custom-select">'
      str +=  '<input type="text" readonly placeholder="ID" class="input" name="" value="">'
      str +=   '<ul class="select-ul">'
      str +=     '<li>1</li><li>2</li></ul>'
      str +=   '<em class="slide" a="0"></em></div>'
      str += '<div class="custom-select">'
      str +=   '<input type="text" placeholder="" class="input" name="" value="默认值">'
      str +=   '<ul class="select-ul">'
      str +=   '</ul><em class="slide" a="0"></em></div>'
      str += '<div class="del-tj-w">'
      str +=   '<em class="del-tj"></em></div></div>'

      $(".tj-set").append(str)
  })

  //删除当前条件
  $("body").on("click",".del-tj",function() {
    $(this).parents(".tj-set-child").remove();
  })
})
