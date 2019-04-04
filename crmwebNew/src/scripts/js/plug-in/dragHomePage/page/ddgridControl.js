

(function () {
    //removeItem、trim函数均来自于UEditor控件，由于EventBase需要用到 ，故引入
   var removeItem=function (array, item) {
        for (var i = 0, l = array.length; i < l; i++) {
            if (array[i] === item) {
                array.splice(i, 1);
                i--;
            }
        }
    } 
   var  trim=function (str) {
        return str.replace(/(^[ \t\n\r]+)|([ \t\n\r]+$)/g, '');
    }
    
//增加EventBase 来源于UEditor控件，使ddgridControl支持自定义事件
var EventBase  = function () {};

EventBase.prototype = {

    /**
     * 注册事件监听器
     * @method addListener
     * @param { String } types 监听的事件名称，同时监听多个事件使用空格分隔
     * @param { Function } fn 监听的事件被触发时，会执行该回调函数
     * @waining 事件被触发时，监听的函数假如返回的值恒等于true，回调函数的队列中后面的函数将不执行
     * @example
     * ```javascript
     * editor.addListener('selectionchange',function(){
     *      console.log("选区已经变化！");
     * })
     * editor.addListener('beforegetcontent aftergetcontent',function(type){
     *         if(type == 'beforegetcontent'){
     *             //do something
     *         }else{
     *             //do something
     *         }
     *         console.log(this.getContent) // this是注册的事件的编辑器实例
     * })
     * ```
     * @see UE.EventBase:fireEvent(String)
     */
    addListener:function (types, listener) {
        types = trim(types).split(/\s+/);
        for (var i = 0, ti; ti = types[i++];) {
            getListener(this, ti, true).push(listener);
        }
    },

    on : function(types, listener){
      return this.addListener(types,listener);
    },
    off : function(types, listener){
        return this.removeListener(types, listener)
    },
    trigger:function(){
        return this.fireEvent.apply(this,arguments);
    },
    /**
     * 移除事件监听器
     * @method removeListener
     * @param { String } types 移除的事件名称，同时移除多个事件使用空格分隔
     * @param { Function } fn 移除监听事件的函数引用
     * @example
     * ```javascript
     * //changeCallback为方法体
     * editor.removeListener("selectionchange",changeCallback);
     * ```
     */
    removeListener:function (types, listener) {
        types = trim(types).split(/\s+/);
        for (var i = 0, ti; ti = types[i++];) {
            removeItem(getListener(this, ti) || [], listener);
        }
    },
    
    /**
     * 触发事件
     * @method fireEvent
     * @param { String } types 触发的事件名称，同时触发多个事件使用空格分隔
     * @remind 该方法会触发addListener
     * @return { * } 返回触发事件的队列中，最后执行的回调函数的返回值
     * @example
     * ```javascript
     * editor.fireEvent("selectionchange");
     * ```
     */

    /**
     * 触发事件
     * @method fireEvent
     * @param { String } types 触发的事件名称，同时触发多个事件使用空格分隔
     * @param { *... } options 可选参数，可以传入一个或多个参数，会传给事件触发的回调函数
     * @return { * } 返回触发事件的队列中，最后执行的回调函数的返回值
     * @example
     * ```javascript
     *
     * editor.addListener( "selectionchange", function ( type, arg1, arg2 ) {
     *
     *     console.log( arg1 + " " + arg2 );
     *
     * } );
     *
     * //触发selectionchange事件， 会执行上面的事件监听器
     * //output: Hello World
     * editor.fireEvent("selectionchange", "Hello", "World");
     * ```
     */
    fireEvent:function () {
        var types = arguments[0];
        types = trim(types).split(' ');
        for (var i = 0, ti; ti = types[i++];) {
            var listeners = getListener(this, ti),
                r, t, k;
            if (listeners) {
                k = listeners.length;
                while (k--) {
                    if(!listeners[k])continue;
                    t = listeners[k].apply(this, arguments);
                    if(t === true){
                        return t;
                    }
                    if (t !== undefined) {
                        r = t;
                    }
                }
            }
            if (t = this['on' + ti.toLowerCase()]) {
                r = t.apply(this, arguments);
            }
        }
        return r;
    }
};
/**
 * 获得对象所拥有监听类型的所有监听器
 * @unfile
 * @module UE
 * @since 1.2.6.1
 * @method getListener
 * @public
 * @param { Object } obj  查询监听器的对象
 * @param { String } type 事件类型
 * @param { Boolean } force  为true且当前所有type类型的侦听器不存在时，创建一个空监听器数组
 * @return { Array } 监听器数组
 */
var getListener =function (obj, type, force) {
    var allListeners;
    type = type.toLowerCase();
    return ( ( allListeners = ( obj.__allListeners || force && ( obj.__allListeners = {} ) ) )
        && ( allListeners[type] || force && ( allListeners[type] = [] ) ) );
};
  
  
//ddgridControl为暴露给外部调用的接口

var ddControl =  function () {
    var me=this;
    me.$vmobj=null;   
    me.isReady=false;    
    EventBase.apply(me);
    }
    ddControl.prototype=new EventBase();
    ddControl.prototype.ready= function (fn) {
        var me = this;
        if (fn) {
            me.isReady ? fn.apply(me) : me.addListener('ready', fn);
        }
    },
    
    ddControl.prototype.setOption=function(irow,icol,rowHeight){
        var me=this;
        if (me.isReady&&me.$vmobj){
            var oldRow=me.$vmobj.layout.rows;            
            me.$vmobj.layout.rows=irow;
            me.$vmobj.layout.cols=icol;  
            me.$vmobj.layout.rowHeight=rowHeight 
            if (irow>oldRow){
                //如果新增了行 需要初始化新增的表格区
                me.$vmobj.$refs.designer.$refs.layoutComp.calc(irow,oldRow,'rows')  
              

            } else {
                me.$vmobj.$refs.designer.$refs.layoutComp.calc() 
            }
            
        }       
    };
    //items 指的是组件列表，包含显示在右侧的列表，与显示在主界面的区域
    //data 是数据域，可以传入一个任意的对象，将转化为json字符串存在div的data属性里面,需要包含ID属性
    // items数据示例 {
	// 				id: 1,//ID
	// 				x: 0,  //格子横坐标
	// 				y: 0,//格子纵坐标
	// 				w: 2,//横向占用格子数
	// 				h: 1,//纵向占用格子数
	// 				text: 'Hoi',//显示文本
    // 				available: true //为true时显示在右侧列表， 为false时显示在左侧绘制区
    //              data : object对象  为附加的数据 将转为json字符串作为属性放在div中
    // 			 }
    
    ddControl.prototype.loadItemData=function(items){
        var me=this;
        if (me.isReady&&me.$vmobj){
            me.$vmobj.chachelis=items
			var maxHeight=0;
			for(var i=0;i<items.length;i++){
				if((items[i].y+items[i].h)>maxHeight){
					maxHeight=items[i].y+items[i].h
				}
   
			}
			var oldRow=me.$vmobj.layout.rows; 
			if (maxHeight>oldRow){
				//如果新增了行 需要初始化新增的表格区
				me.$vmobj.$refs.designer.$refs.layoutComp.calc(maxHeight,oldRow,'rows') 
			}
			me.$vmobj.layout.rows=maxHeight
        } 

    },
    ddControl.prototype.getItems=function(){
        var me=this;
        if (me.isReady&&me.$vmobj){
           return  me.$vmobj.chachelis
        } 

    },
    ddControl.prototype.getDesignResult=function(){
        var me=this;
        if (me.isReady&&me.$vmobj){
           return  me.$vmobj.$refs.resultPanel.$el.outerHTML
        } 

    }
    window.ddgridControl=new ddControl();



    
}())
