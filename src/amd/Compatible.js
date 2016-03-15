define(['Util', 'Event'], function (Util, Event) {
	/**
	 * @namespace
	 */
	var Compatible = {
	    // 当前浏览器前缀
	    prefix: (function () {
	        var userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
	        var prefix = '';
	        if (/WebKit|Chrome|Safari|Maxthon/.test(userAgent)) {
	            prefix = '-webkit-';
	        }
	        else if (userAgent.indexOf('Opera') > -1) {
	            prefix = '-o-';
	        }
	        else if (userAgent.indexOf('Firefox') > -1) {
	            prefix = '-moz-';
	        }
	        else if ((userAgent.indexOf('compatible') > -1
	            && userAgent.indexOf('MSIE') > -1)
	            || userAgent.indexOf('Trident') > -1) {
	            prefix = '-ms-';
	        }
	        return prefix;
	    })(),
	
	    /**
	     * 兼容性绘制函数
	     *
	     * @param {Function} fn 回调函数
	     */
	    requestAnimationFrame: (function () {
	        var vendors = ['ms', 'moz', 'webkit', 'o'];
	        for (var x = 0, xx = vendors.length; x < xx && !window.requestAnimationFrame; ++x) {
	            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
	        }
	        if (!window.requestAnimationFrame) {
	            var lastTime = 0;
	            return function (callback) {
	                var currTime = new Date().getTime();
	                var timeToCall = Math.max(0, (16 - (currTime - lastTime)) % 16);
	                var id = window.setTimeout(function () {
	                    callback();
	                }, timeToCall);
	                lastTime = currTime + timeToCall;
	                return id;
	            };
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
	     * @param {Function=} callback 回调函数
	     * @return {string} 样式值
	     */
	    css: function (dom, key, css, callback) {
	        if (css || css === '') {
	            Compatible.requestAnimationFrame(function () {
	                Util.css(dom, key, css);
	                if (callback) {
	                    callback(dom, key, css);
	                }
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