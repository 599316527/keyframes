define(['Util', 'Event', 'EventEmitter', 'Compatible'], function (Util, Event, EventEmitter, Compatible) {
	/**
	 *  浏览器兼容处理
	 *
	 * @class
	 * @extend EventEmitter
	 */
	function TFCompatible() {
	    TFCompatible.superClass.call(this);
	}
	Util.inherit(TFCompatible, EventEmitter);
	TFCompatible.prototype.prefix = Compatible.prefix;
	TFCompatible._keyMap = {
	    'transform': ['transform'],
	    'transition': ['transition'],
	    'duration': ['transitionDuration', '1s'],
	    'function': ['transitionTimingFunction', 'linear'],
	    'delay': ['transitionDelay', '0s']
	};
	// 如果为duration function delay，简称转全称
	// 其他加入兼容性前缀：transition -->webkitTransition
	TFCompatible.prototype.parseCSS = function (key) {
	    var p = this.prefix.replace(/-/g, '');
	    if ('moz ms'.indexOf(p) > -1) {
	        TFCompatible.prototype.parseCSS = function (key) {
	            if (key in TFCompatible._keyMap) {
	                return TFCompatible._keyMap[key][0];
	            }
	            return key;
	        };
	    }
	    else {
	        TFCompatible.prototype.parseCSS = function (key) {
	            if (key in TFCompatible._keyMap) {
	                key = TFCompatible._keyMap[key][0];
	                return p + key[0].toUpperCase() + key.substr(1);
	            }
	            return key;
	        };
	    }
	    return this.parseCSS(key);
	};
	TFCompatible.prototype.cssMap = function (propertyName) {
	    var tmp;
	    switch (propertyName) {
	        case 'transform':
	            if (this.prefix === '-webkit-') {
	                tmp =  this.prefix + propertyName;
	            }
	            else {
	                tmp = propertyName;
	            }
	            break;
	        case 'backgroundColor': tmp = 'background-color'; break;
	        case 'borderRadius': tmp = 'border-radius'; break;
	        case 'fontSize': tmp = 'font-size'; break;
	        case 'color':
	        case 'top':
	        case 'bottom':
	        case 'left':
	        case 'width':
	        case 'height':
	        case 'opacity':
	        case 'border':
	        case 'right': tmp = propertyName; break;
	        default: throw new Error(propertyName + ' not supported!');
	    }
	    return tmp;
	};
	TFCompatible.prototype.eventMap = {
	    'border-radius': [
	        'border-bottom-left-radius',
	        'border-top-left-radius',
	        'border-bottom-right-radius',
	        'border-top-right-radius'
	    ],
	    'border': [
	        'border-left-width',
	        'border-top-width',
	        'border-right-width',
	        'border-bottom-width',
	        'border-left-color',
	        'border-top-color',
	        'border-right-color',
	        'border-bottom-color'
	    ]
	};
	TFCompatible.prototype.addStatus = function (status, key) {
	    var keyT = this.cssMap(key);
	    if (keyT in this.eventMap) {
	        status.add(keyT, this.eventMap[keyT]);
	    }
	    else {
	        status.add(keyT);
	    }
	    return keyT;
	};
	
	/**
	 * 对于Transform的mix方法，抽取顶层transform的延迟和变换函数等配置
	 *
	 * @param {Object} config mix配置
	 * @return {Object} 顶层的延迟和变换函数等配置，可用于mix子项
	 */
	TFCompatible.prototype.peelMould = function (config) {
	    var mould = {};
	    Util.forKey(TFCompatible._keyMap, function (key) {
	        if (key in config) {
	            mould[key] = config[key];
	        }
	    });
	    return mould;
	};
	
	/**
	 * 深拷贝obj对象，并根据apiMap生成api配置项
	 *
	 * @param {Object} obj 变换配置
	 * @param {Object} apiMap 所支持的apiMap
	 * @return {Object} 顶层的延迟和变换函数等配置，可用于mix子项
	 */
	TFCompatible.prototype.clone = function (obj, apiMap) {
	    var clone;
	    var keyMap = TFCompatible._keyMap;
	    if (obj instanceof Array) {
	        clone = [];
	        Util.each(obj, function (item) {
	            clone.push(this.clone(item, apiMap));
	        }, this);
	    }
	    else if (typeof obj === 'object') {
	        clone = {};
	        Util.forIn(obj, function (key, value) {
	            if (value) {
	                if (key in keyMap) {
	                    clone[key] = this.clone(value, apiMap);
	                }
	                else if (key in apiMap) {
	                    if (!('api' in clone)) {
	                        clone.api = {};
	                    }
	                    clone.api[apiMap[key]] = this.clone(value, apiMap);
	                }
	            }
	        }, this);
	    }
	    else {
	        clone = obj;
	    }
	    return clone;
	};
	TFCompatible.prototype.parseTransition = function (transition) {
	    function regReplace($0, $1) {
	        if ($1 in transition) {
	            return transition[$1];
	        }
	        return TFCompatible._keyMap[$1][1];
	    }
	    return '<property> <duration> <function> <delay>'.replace(/<(.*?)>/g, regReplace);
	};
	TFCompatible.instance = function () {
	    if (!TFCompatible._compatible) {
	        TFCompatible._compatible = new TFCompatible();
	    }
	    return TFCompatible._compatible;
	};
	TFCompatible.prototype.parseEvent = Compatible.parseEvent('transition', 'Transition');
	return TFCompatible;});