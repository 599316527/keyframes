define(['Util', 'Event'], function (Util, Event) {
	/**
	 * @namespace
	 */
	var Compatible = {
	    // 当前浏览器前缀
	    prefix: (function () {
	        var userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
	        var isOpera = userAgent.indexOf('Opera') > -1; // 判断是否Opera
	        var isMaxthon = userAgent.indexOf('Maxthon') > -1; // 判断是否傲游3.0
	        var isIE = (!isOpera && userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1)
	            || (userAgent.indexOf('Trident') > -1); // 判断是否IE
	        var isFF = userAgent.indexOf('Firefox') > -1; // 判断是否Firefox
	        var isSafari = userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') < 1; // 判断是否Safari
	        var isChrome = userAgent.indexOf('Chrome') > -1; // 判断是否Chrome
	        var isWebKit = userAgent.indexOf('WebKit') > -1;
	        if (isIE) {
	            return '-ms-';
	        }
	        return (isWebKit || isSafari || isChrome || isMaxthon) ?
	            '-webkit-' : (isOpera ? '-o-' : (isFF ? '-moz-' : ''));
	    })(),
	
	    /**
	     * 兼容性绘制函数
	     *
	     * @param {Function} fn 回调函数
	     */
	    requestAnimationFrame: (function () {
	        window.requestAnimationFrame = window.requestAnimationFrame
	        || window.webkitRequestAnimationFrame
	        || window.mozRequestAnimationFrame;
	        if (!window.requestAnimationFrame) {
	            var timer;
	            var queue = [];
	            var digestQueue = function () {
	                Util.each(
	                    queue,
	                    function (cb) {
	                        cb();
	                    }
	                );
	                clearTimeout(timer);
	                timer = false;
	                queue = [];
	            };
	            var mock = function (callback) {
	                queue.push(callback);
	                if (!timer) {
	                    timer = window.setTimeout(
	                        digestQueue,
	                        16
	                    );
	                }
	            };
	            window.requestAnimationFrame = mock;
	        }
	        return function (fn) {
	            // 原生requestAnimationFrame执行的scope必须为window
	            window.requestAnimationFrame(fn);
	        };
	    })(),
	
	    /**
	     * 绘制函数中设置样式属性或者直接设置样式属性值
	     *
	     * @param {Node} dom 要操作的节点
	     * @param {string} key 样式属性名
	     * @param {string=} css 样式属性值
	     * @param {Object=} me 函数调用者
	     * @return {string} 样式值
	     */
	    css: function (dom, key, css, me) {
	        if (css || css === '') {
	            Compatible.requestAnimationFrame(function () {
	                Util.css(dom, key, css);
	                me.emit(Event.css, dom, key, css);
	            });
	        }
	        else {
	            return Util.css(dom, key);
	        }
	    },
	
	    /**
	     * 绘制函数中触发重排
	     *
	     * @param {Node} dom 要操作的节点
	     */
	    reflow: function (dom) {
	        Compatible.requestAnimationFrame(function () {
	            dom.offsetWidth = dom.offsetWidth;
	        });
	    },
	
	    /**
	     * 兼容性事件转换函数
	     *
	     * @param {string} lower 小写值
	     * @param {string} upper 首字母大写值
	     * @return {Function} 兼容性事件函数
	     */
	    parseEvent: function (lower, upper) {
	        // animationstart webkitAnimationStart
	        var p = Compatible.prefix.replace(/-/g, '');
	        if ('moz ms'.indexOf(p) > -1) {
	            return function (key) {
	                return lower + key.toLowerCase();
	            };
	        }
	        return function (key) {
	            return p + upper + key;
	        };
	    }
	};
	return Compatible;});