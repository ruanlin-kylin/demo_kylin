/**
 * jQuery方法扩展
 * 
 * @author 尔演@Eryan eryanwcp@gmail.com
 * 
 * @version 2013-05-26
 */

/**
 * 
 * 将form表单元素的值序列化成对象
 * 
 * @returns object
 */
$.serializeObject = function(form) {
	var o = {};
	$.each(form.serializeArray(), function(index) {
		if (o[this['name']]) {
			o[this['name']] = o[this['name']] + "," + this['value'];
		} else {
			o[this['name']] = this['value'];
		}
	});
	return o;
};

function isValidDate(d) {
    if ( Object.prototype.toString.call(d) !== "[object Date]" )
        return false;
    return !isNaN(d.getTime());
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
Date.prototype.format = function(format) {
    if(!isValidDate(this)){
        return '';
    }
    var week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var week_cn = [ '日', '一', '二', '三', '四', '五', '六'];
    var o = {
		"M+" : this.getMonth() + 1, //月份
		"d+" : this.getDate(), //天
		"H+" : this.getHours(), //小时
		"m+" : this.getMinutes(), //分钟
		"s+" : this.getSeconds(), //秒钟
		"q+" : Math.floor((this.getMonth() + 3) / 3), //季度
		"S" : this.getMilliseconds(),//毫秒数
        "X": "星期" + week_cn[this.getDay() ], //星期
        "Z": "周" + week_cn[this.getDay() ],  //返回如 周二
        "F": week[this.getDay()],  //英文星期全称，返回如 Saturday
        "L": week[this.getDay()].slice(0, 3)//三位英文星期，返回如 Sat
	}
	if (/(y+)/.test(format))
		format = format.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(format))
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
					: ("00" + o[k]).substr(("" + o[k]).length));
	return format;
}

/**
 * 日期格式化.
 * @param value 日期
 * @param format 格式化字符串 例如："yyyy-MM-dd"、"yyyy-MM-dd HH:mm:ss"
 * @returns 格式化后的字符串
 */
 $.formatDate = function(value,format) {
	if (value == null || value == '' || value == 'null' ) {
		return '';
	}
	var dt;
	if (value instanceof Date) {
		dt = value;
	} else {
		dt = new Date(value);
		if (isNaN(dt)) {
			//将那个长字符串的日期值转换成正常的JS日期格式
			value = value.replace(/\/Date\((-?\d+)\)\//, '$1'); 
			dt = new Date();
			dt.setTime(value);
		}
	}
	return dt.format(format);
}
/**
 * 
 * 增加formatString功能
 * 
 * 使用方法：$.formatString('字符串{0}字符串{1}字符串','第一个变量','第二个变量');
 * 
 * @returns 格式化后的字符串
 */
$.formatString = function(str) {
	for ( var i = 0; i < arguments.length - 1; i++) {
		str = str.replace("{" + i + "}", arguments[i + 1]);
	}
	return str;
};

/**
 * 根据长度截取先使用字符串，超长部分追加...
 * @param str 对象字符串
 * @param len 目标字节长度
 * @return 处理结果字符串
 */
$.cutString = function(str, len) {
	//length属性读出来的汉字长度为1
	if(str.length*2 <= len) {
		return str;
	}
	var strlen = 0;
	var s = "";
	for(var i = 0;i < str.length; i++) {
		s = s + str.charAt(i);
		if (str.charCodeAt(i) > 128) {
			strlen = strlen + 2;
			if(strlen >= len){
				return s.substring(0,s.length-1) + "...";
			}
		} else {
			strlen = strlen + 1;
			if(strlen >= len){
				return s.substring(0,s.length-2) + "...";
			}
		}
	}
	return s;
}
/**
 * Object to String
 * 不通用,因为拼成的JSON串格式不对.
 */
$.objToStr = function(o) {
	var r = [];
	if (typeof o == "string" || o == null) {
		return "@" + o + "@";
	}
	if (typeof o == "object") {
		if (!o.sort) {
			r[0] = "{";
			for ( var i in o) {
				r[r.length] = "@" + i + "@";
				r[r.length] = ":";
				r[r.length] = obj2str(o[i]);
				r[r.length] = ",";
			}
			r[r.length - 1] = "}";
		} else {
			r[0] = "[";
			for ( var i = 0; i < o.length; i++) {
				r[r.length] = obj2str(o[i]);
				r[r.length] = ",";
			}
			r[r.length - 1] = "]";
		}
		return r.join("");
	}
	return o.toString();
}

/**
 * json字符串转换为Object对象.
 * @param json json字符串
 * @returns Object
 */
$.jsonToObj = function(json){ 
    return eval("("+json+")"); 
}
/**
 * json对象转换为String字符串对象.
 * @param o Json Object
 * @returns   Object对象
 */
$.jsonToString = function(o) {
	var r = [];
	if (typeof o == "string")
		return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
	if (typeof o == "object") {
		if (!o.sort) {
			for ( var i in o)
				r.push(i + ":" + obj2str(o[i]));
			if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
				r.push("toString:" + o.toString.toString());
			}
			r = "{" + r.join() + "}";
		} else {
			for ( var i = 0; i < o.length; i++)
				r.push(obj2str(o[i]));
			r = "[" + r.join() + "]";
		}
		return r;
	}
	return o.toString();
};


/**
 * 获得URL参数
 * 
 * @returns 对应名称的值
 */
$.getUrlParam = function(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
};

/**
 * 接收一个以逗号分割的字符串，返回List，list里每一项都是一个字符串
 * 
 * @returns list
 */
$.getList = function(value) {
	if (value != undefined && value != '') {
		var values = [];
		var t = value.split(',');
		for ( var i = 0; i < t.length; i++) {
			values.push('' + t[i]);/* 避免他将ID当成数字 */
		}
		return values;
	} else {
		return [];
	}
};

/**
 * 获得项目根路径
 * 
 * 使用方法：$.bp();
 * 
 * @returns 项目根路径
 */
$.bp = function() {
	var curWwwPath = window.document.location.href;
	var pathName = window.document.location.pathname;
	var pos = curWwwPath.indexOf(pathName);
	var localhostPaht = curWwwPath.substring(0, pos);
	var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
	return (localhostPaht + projectName);
};

/**
 * 
 * 使用方法:$.pn();
 * 
 * @returns 项目名称(/base)
 */
$.pn = function() {
	return window.document.location.pathname.substring(0, window.document.location.pathname.indexOf('\/', 1));
};


/**
 * 
 * 生成UUID
 * 
 * @returns UUID字符串
 */
$.random4 = function() {
	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};
$.UUID = function() {
	return (eu.random4() + eu.random4() + "-" + eu.random4() + "-" + eu.random4() + "-" + eu.random4() + "-" + eu.random4() + eu.random4() + eu.random4());
};

/**
 * 扩展js 去字符串空格
 */
String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, '');
};
String.prototype.ltrim = function() {
	return this.replace(/(^\s*)/g, '');
};
String.prototype.rtrim = function() {
	return this.replace(/(\s*$)/g, '');
};

/**
 * 1）扩展jquery easyui tree的节点检索方法。使用方法如下：
 * $("#treeId").tree("search", searchText);	 
 * 其中，treeId为easyui tree的根UL元素的ID，searchText为检索的文本。
 * 如果searchText为空或""，将恢复展示所有节点为正常状态
 */
(function($) {	
	
	/*$.extend($.fn.tree.methods, {
		unselect:function(jq,target){
			return jq.each(function(){
				var opts = $(this).tree('options');
				$(target).removeClass('tree-node-selected');
				if (opts.onUnselect){
					opts.onUnselect.call(this, $(this).tree('getNode',target));
				}
			});
		},
		/!**
		 * 扩展easyui tree的搜索方法
		 * @param tree easyui tree的根DOM节点(UL节点)的jQuery对象
		 * @param searchText 检索的文本
		 * @param this-context easyui tree的tree对象
		 *!/
		search: function(jqTree, searchText) {
			//easyui tree的tree对象。可以通过tree.methodName(jqTree)方式调用easyui tree的方法
			var tree = this;
			
			//获取所有的树节点
			var nodeList = getAllNodes(jqTree, tree);
			
	  		//如果没有搜索条件，则展示所有树节点
			searchText = $.trim(searchText);
	  		if (searchText == "") {
	  			for (var i=0; i<nodeList.length; i++) {
	  				$(".tree-node-targeted", nodeList[i].target).removeClass("tree-node-targeted");
	  	  			$(nodeList[i].target).show();
	  	  		}
	  			//展开已选择的节点（如果之前选择了）
	  			var selectedNode = tree.getSelected(jqTree);
	  			if (selectedNode) {
	  				tree.expandTo(jqTree, selectedNode.target);
	  			}
	  			return;
	  		}
	  		
	  		//搜索匹配的节点并高亮显示
	  		var matchedNodeList = [];
	  		if (nodeList && nodeList.length>0) {
	  			var node = null;
	  			for (var i=0; i<nodeList.length; i++) {
	  				node = nodeList[i];
	  				if (isMatch(searchText, node.text)) {
	  					matchedNodeList.push(node);
	  				}
	  			}
	  			
	  			//隐藏所有节点
	  	  		for (var i=0; i<nodeList.length; i++) {
	  	  			$(".tree-node-targeted", nodeList[i].target).removeClass("tree-node-targeted");
	  	  			$(nodeList[i].target).hide();
	  	  		}  			
	  			
	  			//折叠所有节点
	  	  		tree.collapseAll(jqTree);
	  			
	  			//展示所有匹配的节点以及父节点  			
	  			for (var i=0; i<matchedNodeList.length; i++) {
	  				showMatchedNode(jqTree, tree, matchedNodeList[i]);
	  			}
	  		} 	 
		},
		
		/!**
		 * 展示节点的子节点（子节点有可能在搜索的过程中被隐藏了）
		 * @param node easyui tree节点
		 *!/
		showChildren: function(jqTree, node) {
			//easyui tree的tree对象。可以通过tree.methodName(jqTree)方式调用easyui tree的方法
			var tree = this;
			
			//展示子节点
			if (!tree.isLeaf(jqTree, node.target)) {
				var children = tree.getChildren(jqTree, node.target);
				if (children && children.length>0) {
					for (var i=0; i<children.length; i++) {
						if ($(children[i].target).is(":hidden")) {
							$(children[i].target).show();
						}
					}
				}
			}  	
		},
		
		/!**
		 * 将滚动条滚动到指定的节点位置，使该节点可见（如果有滚动条才滚动，没有滚动条就不滚动）
		 * @param param {
		 * 	  treeContainer: easyui tree的容器（即存在滚动条的树容器）。如果为null，则取easyui tree的根UL节点的父节点。
		 *    targetNode:  将要滚动到的easyui tree节点。如果targetNode为空，则默认滚动到当前已选中的节点，如果没有选中的节点，则不滚动
		 * } 
		 *!/
		scrollTo: function(jqTree, param) {
			//easyui tree的tree对象。可以通过tree.methodName(jqTree)方式调用easyui tree的方法
			var tree = this;
			
			//如果node为空，则获取当前选中的node
			var targetNode = param && param.targetNode ? param.targetNode : tree.getSelected(jqTree);
			
			if (targetNode != null) {
				//判断节点是否在可视区域				
				var root = tree.getRoot(jqTree);
				var $targetNode = $(targetNode.target);
				var container = param && param.treeContainer ? param.treeContainer : jqTree.parent();
				var containerH = container.height();
				var nodeOffsetHeight = $targetNode.offset().top - container.offset().top;
				if (nodeOffsetHeight > (containerH - 30)) {
					var scrollHeight = container.scrollTop() + nodeOffsetHeight - containerH + 30;
					container.scrollTop(scrollHeight);
				}							
			}
		}
	});
	
	
	*/
	
	/**
	 * 展示搜索匹配的节点
	 */
	function showMatchedNode(jqTree, tree, node) {
  		//展示所有父节点
  		$(node.target).show();
  		$(".tree-title", node.target).addClass("tree-node-targeted");
  		var pNode = node;
  		while ((pNode = tree.getParent(jqTree, pNode.target))) {
  			$(pNode.target).show();  			
  		}
  		//展开到该节点
  		tree.expandTo(jqTree, node.target);
  		//如果是非叶子节点，需折叠该节点的所有子节点
  		if (!tree.isLeaf(jqTree, node.target)) {
  			tree.collapse(jqTree, node.target);
  		}
  	}  	 
	
	/**
	 * 判断searchText是否与targetText匹配
	 * @param searchText 检索的文本
	 * @param targetText 目标文本
	 * @return true-检索的文本与目标文本匹配；否则为false.
	 */
	function isMatch(searchText, targetText) {
  		return $.trim(targetText)!="" && targetText.indexOf(searchText)!=-1;
  	}
	
	/**
	 * 获取easyui tree的所有node节点
	 */
	function getAllNodes(jqTree, tree) {
		var allNodeList = jqTree.data("allNodeList");
		if (!allNodeList) {
			var roots = tree.getRoots(jqTree);
  			allNodeList = getChildNodeList(jqTree, tree, roots);
  			jqTree.data("allNodeList", allNodeList);
		}
  		return allNodeList;
  	}
  	
	/**
	 * 定义获取easyui tree的子节点的递归算法
	 */
  	function getChildNodeList(jqTree, tree, nodes) {
  		var childNodeList = [];
  		if (nodes && nodes.length>0) {  			
  			var node = null;
  			for (var i=0; i<nodes.length; i++) {
  				node = nodes[i];
  				childNodeList.push(node);
  				if (!tree.isLeaf(jqTree, node.target)) {
  					var children = tree.getChildren(jqTree, node.target);
  					childNodeList = childNodeList.concat(getChildNodeList(jqTree, tree, children));
  				}
  			}
  		}
  		return childNodeList;
  	}
})(jQuery);