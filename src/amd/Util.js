define(function () {
	/**
	 * @file util.js ~ 2015/08/13 11:47:13
	 * @author tingkl(dingguoliang01@baidu.com)
	 **/
	
	var Util = {
	    forIn: function (obj, handler, scope) {
	        for (var key in obj) {
	            if (handler.call(scope, key, obj[key]) === false) {
	                return false;
	            }
	        }
	        return true;
	    },
	    rewrite: function (init, replace) {
	        if (!replace) {
	            return init;
	        }
	        Util.forIn(replace, function (key, item) {
	            init[key] = item;
	        });
	        return init;
	    },
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
	    // extend 只是拓展没有的属性 rewrite则是重写
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
	    inherit: function (Child, Parent) {
	        var Clz = new Function();
	        Clz.prototype = Parent.prototype;
	        Child.prototype = new Clz();
	        Child.prototype.constructor = Child;
	        Child.superClass = Parent;
	    },
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
	    arg2Ary: function (arg) {
	        return Array.prototype.slice.call(arg, 0);
	    },
	    each: function (ary, iterator) {
	        for (var i = 0, l = ary.length; i < l; i++) {
	            if (iterator(ary[i], i, ary) === false) {
	                break;
	            }
	        }
	        return i === ary.length;
	    },
	    random: {
	        generator: [
	            function () {
	                return String.fromCharCode(48 + Math.round(9 * Math.random()));
	            },
	            function () {
	                return String.fromCharCode(65 + Math.round(25 * Math.random()));
	            },
	            function () {
	                return String.fromCharCode(97 + Math.round(25 * Math.random()));
	            }],
	        word: function (index) {
	            var range;
	            if (index === 0) {
	                range = Math.floor(Math.random() * 2) + 1;
	            }
	            else {
	                range = Math.floor(Math.random() * 3);
	            }
	            return Util.random.generator[range]();
	        },
	        name: function (length) {
	            length = length || 6;
	            var name = '';
	            for (var i = 0; i < length; i++) {
	                name += Util.random.word(i);
	            }
	            return name;
	        }
	    },
	    addClass: function (dom, className) {
	        if (!dom.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))) {
	            dom.className = (dom.className + ' ' + className).trim();
	        }
	    },
	    removeClass: function (dom, className) {
	        dom.className = dom.className.replace(new RegExp('(\\s|^)' + className + '(\\s|$)'), ' ').trim();
	    },
	    css: function (dom, attr, value) {
	        if (typeof attr === 'string') {
	            return Util.$css(dom, attr, value);
	        }
	        Util.forIn(attr, function (key, item) {
	            Util.$css(dom, key, item);
	        });
	    },
	    stopPropagation: function (event) {
	        if (event.stopPropagation) {
	            Util.stopPropagation = function (event) {
	                event.stopPropagation();
	            };
	        }
	        else {
	            Util.stopPropagation = function (event) {
	                event.cancelBubble = true;
	            };
	        }
	        return Util.stopPropagation(event);
	    },
	    $css: function (dom, key, value) {
	        if (typeof window.getComputedStyle !== 'undefined') { // W3C
	            Util.$css = function (dom, key, value) {
	                if (value !== undefined) {
	                    dom.style[key] = value;
	                    return value;
	                }
	                var tmp = window.getComputedStyle(dom, null)[key];
	                return !tmp ? dom.style[key] : tmp;
	            };
	        }
	        else if (typeof dom.currentStyle !== 'undefined') {
	            Util.$css = function (dom, key, value) {
	                if (value !== undefined) {
	                    dom.style[key] = value;
	                    return value;
	                }
	                var tmp = dom.currentStyle[key];
	                return !tmp ? dom.style[key] : tmp;
	            };
	        }
	        return this.$css(dom, key, value);
	    },
	    on: function (dom, name, fn) {
	        if ('addEventListener' in window) {
	            Util.on = function (dom, name, fn) {
	                dom.addEventListener(name, fn, false);
	            };
	        }
	        else if ('attachEvent' in window) {
	            Util.on = function (dom, name, fn) {
	                dom.attachEvent('on' + name, fn);
	            };
	        }
	        return this.on(dom, name, fn);
	    },
	    off: function (dom, name, fn) {
	        if ('removeEventListener' in window) {
	            Util.off = function (dom, name, fn) {
	                dom.removeEventListener(name, fn, false);
	            };
	        }
	        else if ('detachEvent' in window) {
	            Util.off = function (dom, name, fn) {
	                dom.detachEvent('on' + name, fn);
	            };
	        }
	        this.off(dom, name, fn);
	    }
	};
	return Util;