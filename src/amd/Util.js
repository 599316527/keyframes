define(function () {
	/**
	 * @namespace
	 */
	
	// transform ie 9
	// transition keyframe ie 10, 所以不需要考虑ie9之下
	var Util = {
	
	    /**
	     * JSON对象遍历函数
	     *
	     * @param {Object} obj 要进行遍历的对象
	     * @param {Function} handler 遍历的处理函数
	     * @param {?Object} scope 作用域对象
	     * @return {boolean} 是否完全遍历完了obj对象
	     */
	    forIn: function (obj, handler, scope) {
	        for (var key in obj) {
	            if (handler.call(scope, key, obj[key]) === false) {
	                return false;
	            }
	        }
	        return true;
	    },
	
	    /**
	     * 重写函数
	     *
	     * @param {Object} init 需要重写的对象
	     * @param {?Object} replace 从replace拿数据重写init
	     * @return {Object} 重写后的对象
	     */
	    rewrite: function (init, replace) {
	        if (!replace) {
	            return init;
	        }
	        Util.forIn(replace, function (key, item) {
	            init[key] = item;
	        });
	        return init;
	    },
	
	    /**
	     * 命名空间初始化
	     *
	     * @param {string} namespace 命名空间
	     */
	    define: function (namespace) {
	        namespace = namespace.split('.');
	        var domain;
	        var module = window;
	        while ((domain = namespace.shift())) {
	            if (!(domain in module)) {
	                module[domain] = {};
	            }
	            module = module[domain];
	        }
	    },
	
	    /**
	     * 拓展函数，extend 只是拓展没有的属性 rewrite则是重写
	     *
	     * @param {Object} src 需要拓展的对象
	     * @param {Object=} init 从init拿数据拓展src
	     * @return {Object} 拓展后的对象
	     */
	    extend: function (src, init) {
	        if (!src) {
	            return init;
	        }
	        if (init) {
	            Util.forIn(init, function (key, item) {
	                if (!(key in src)) {
	                    src[key] = item;
	                }
	            });
	        }
	        return src;
	    },
	
	    /**
	     * 继承
	     *
	     * @param {Function} Child 子类
	     * @param {Function} Parent 父类
	     */
	    inherit: function (Child, Parent) {
	        var Clz = new Function();
	        Clz.prototype = Parent.prototype;
	        Child.prototype = new Clz();
	        Child.prototype.constructor = Child;
	        Child.superClass = Parent;
	    },
	
	    /**
	     * 查找val在ary中的索引
	     *
	     * @param {(number|string)} val 要查找的值
	     * @param {Array} ary 要查找的数组
	     * @return {number} 查找到的索引，没找到为-1
	     */
	    xInA: function (val, ary) {
	        var index = -1;
	        Util.each(ary, function (item, i) {
	            if (item === val) {
	                index = i;
	                return false;
	            }
	        });
	        return index;
	    },
	
	    /**
	     * Arguments对象转化为Array对象
	     *
	     * @param {Arguments} arg 需要转化的对象
	     * @return {Array} 转化为的对象
	     */
	    arg2Ary: function (arg) {
	        return Array.prototype.slice.call(arg, 0);
	    },
	
	    /**
	     * 数组遍历函数
	     *
	     * @param {Array} ary 要进行遍历的数组
	     * @param {Function} iterator 遍历的处理函数
	     * @param {?Object} scope 作用域对象
	     * @return {boolean} 是否完全遍历完了数组
	     */
	    each: function (ary, iterator, scope) {
	        for (var i = 0, l = ary.length; i < l; i++) {
	            if (iterator.call(scope, ary[i], i, ary) === false) {
	                break;
	            }
	        }
	        return i === ary.length;
	    },
	    // 随机相关函数及变量
	    random: {
	        // 随机种子
	        seed: [[48, 9], [65, 25], [97, 25]],
	
	        /**
	         * 根据种子生成随机字符
	         *
	         * @param {Array.<number>} seed 种子数组
	         * @return {string} 随机字符
	         */
	        generator: function (seed) {
	            return String.fromCharCode(seed[0] + Math.round(seed[1] * Math.random()));
	        },
	
	        /**
	         * 指定种子生成随机字符
	         *
	         * @param {number} index 种子索引
	         * @return {string} 随机字符
	         */
	        word: function (index) {
	            var range;
	            if (index === 0) {
	                range = Math.floor(Math.random() * 2) + 1;
	            }
	            else {
	                range = Math.floor(Math.random() * 3);
	            }
	            return this.generator(this.seed[range]);
	        },
	
	        /**
	         * 生成指定长度随机字符串
	         *
	         * @param {number=} length 长度
	         * @return {string} 随机字符串
	         */
	        name: function (length) {
	            length = length || 6;
	            var name = '';
	            for (var i = 0; i < length; i++) {
	                name += this.word(i);
	            }
	            return name;
	        }
	    },
	
	    /**
	     * 添加样式
	     *
	     * @param {Node} dom 要进操作的节点
	     * @param {string} className 样式名
	     */
	    addClass: function (dom, className) {
	        if (!dom.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))) {
	            dom.className = (dom.className + ' ' + className).trim();
	        }
	    },
	
	    /**
	     * 删除样式
	     *
	     * @param {Node} dom 要进操作的节点
	     * @param {string} className 样式名
	     */
	    removeClass: function (dom, className) {
	        dom.className = dom.className.replace(new RegExp('(\\s|^)' + className + '(\\s|$)'), ' ').trim();
	    },
	
	    /**
	     * 设置或者获取样式属性
	     *
	     * @param {Node} dom 要进操作的节点
	     * @param {Object|string} attr 样式属性名
	     * @param {string=} value 样式属性值
	     * @return {string} 属性值
	     */
	    css: function (dom, attr, value) {
	        if (typeof attr === 'string') {
	            return Util.$css(dom, attr, value);
	        }
	        Util.forIn(attr, function (key, item) {
	            Util.$css(dom, key, item);
	        });
	    },
	
	    /**
	     * 阻值冒泡，stopPropagation ie 9 support
	     *
	     * @param {Event} event 事件对象
	     */
	    stopPropagation: function (event) {
	        // stopPropagation ie 9 support
	        event.stopPropagation();
	    },
	
	    /**
	     * 设置或获取样式属性，ie 9 support
	     *
	     * @param {Node} dom 要进操作的节点
	     * @param {string} key 样式属性名
	     * @param {string=} value 样式属性值
	     * @return {string} 属性值
	     */
	    $css: function (dom, key, value) {
	        if (value !== undefined) {
	            dom.style[key] = value;
	            return value;
	        }
	        return dom.style[key];
	    },
	
	    /**
	     * 注册事件监听函数，ie 9 support
	     *
	     * @param {Node} dom 要进操作的节点
	     * @param {string} name 事件名
	     * @param {Function} fn 回调函数
	     */
	    on: function (dom, name, fn) {
	        dom.addEventListener(name, fn, false);
	    },
	
	    /**
	     * 注销事件监听函数，ie 9 support
	     *
	     * @param {Node} dom 要进操作的节点
	     * @param {string} name 事件名
	     * @param {Function} fn 回调函数
	     */
	    off: function (dom, name, fn) {
	        dom.removeEventListener(name, fn, false);
	    }
	};
	return Util;});