(function($,undefined){
	$.fn.zyUpload = function(options,param){
		var otherArgs = Array.prototype.slice.call(arguments, 1);
		if (typeof options == 'string') {
			var fn = this[0][options];
			if($.isFunction(fn)){
				return fn.apply(this, otherArgs);
			}else{
				throw ("zyUpload - No such method: " + options);
			}
		}

		return this.each(function(){
			var para = {};    // 保留参数
			var self = this;  // 保存组件对象
			this.selfObj = this;
			var defaults = {
				width            : "700px",  					// 宽度
				height           : "400px",  					// 宽度
				itemWidth        : "140px",                     // 文件项的宽度
				itemHeight       : "120px",                     // 文件项的高度
				url              : "/upload/UploadAction",  	// 上传文件的路径
				multiple         : true,  						// 是否可以多个文件上传
				dragDrop         : true,  						// 是否可以拖动上传文件
				del              : true,  						// 是否可以删除文件
				finishDel        : false,  						// 是否在上传文件完成后删除预览
				/* 提供给外部的接口方法 */
				onSelect         : function(selectFiles, files){},// 选择文件的回调方法  selectFile:当前选中的文件  allFiles:还没上传的全部文件
				onDelete		 : function(file, files){},     // 删除一个文件的回调方法 file:当前删除的文件  files:删除之后的文件
				onSuccess		 : function(file){},            // 文件上传成功的回调方法
				onFailure		 : function(file){},            // 文件上传失败的回调方法
				onComplete		 : function(responseInfo){},    // 上传完成的回调方法
				initImg:function(files,obj){},
			};

			para = $.extend(defaults,options);

			this.init = function(){
				this.createHtml();  // 创建组件html
				this.createCorePlug();  // 调用核心js
				para.initImg(para.initUrl,this.selfObj);
			};

			/**
			 * 功能：创建上传所使用的html
			 * 参数: 无
			 * 返回: 无
			 */
			this.createHtml = function(){
				var multiple = "";  // 设置多选的参数
				para.multiple ? multiple = "multiple" : multiple = "";
				var html= options.createHtml;
				$(self).append(html);
				// 初始化html之后绑定按钮的点击事件
				this.addEvent();
			};

			this.funFilterEligibleFile = function(files){
				var arrFiles = [];  // 替换的文件数组
				for (var i = 0, file; file = files[i]; i++) {
					if (file.size >= 209715200) {
						alert('您这个"'+ file.name +'"文件大小过大');
					} else {
						// 在这里需要判断当前所有文件中
						if(para.suffix){
							var fileName=file.name;
							if(fileName.indexOf(".")!=-1){
								var fs=fileName.split(".");
								fileName=fs[fs.length-1];
								fileName=fileName.toLowerCase();
								var ss = para.suffix.split(",");
								var yes=false;
								for(var j=0;j<ss.length;j++){
									if(fileName==(ss[j].toLowerCase())){
										yes=true;
										break;
									}
								}
								if(yes){
									arrFiles.push(file);
								}
							}
						}else{
							arrFiles.push(file);
						}
					}
				}
				return arrFiles;
			};

			/**
			 * 功能：调用核心插件
			 * 参数: 无
			 * 返回: 无
			 */
			this.createCorePlug = function(){
				var me = this;
				var params = {
					fileInput: $(self).find("input[type=file]")[0],
					url: defaults.url,
					filterFile: function(files) {
						// 过滤合格的文件
						return self.funFilterEligibleFile(files);
					},
					onSelect: function(selectFiles, allFiles) {
						para.onSelect(selectFiles, allFiles,me.selfObj,me.ZYFILE);  // 回调方法
					},
					onDelete: function(file, files) {
					},
					onProgress: function(file, loaded, total) {
					},
					onSuccess: function(file, response) {
						para.onSuccess(file, response,me);  // 回调方法
					},
					onFailure: function(file) {
						para.onFailure(file,me);
					},
					onComplete: function(response){
					},
					onDragOver: function() {
						$(this).addClass("upload_drag_hover");
					},
					onDragLeave: function() {
						$(this).removeClass("upload_drag_hover");
					}
				};
				var ZYFILE=new zyfileFun().getConfig();
				this.ZYFILE = $.extend(ZYFILE, params);
				this.ZYFILE.init();
			};

			/**
			 * 功能：绑定事件
			 * 参数: 无
			 * 返回: 无
			 */
			this.addEvent = function(){
				$(self).find("."+para.clickClass).bind("click",function(){
					$($(self).find("input[type=file]")[0]).click();
				});
			};
			// 初始化上传控制层插件
			this.init();
		});
	};
})(jQuery);