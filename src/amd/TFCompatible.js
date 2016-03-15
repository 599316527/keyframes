define(['Util', 'Event', 'EventEmitter', 'Compatible'], function (Util, Event, EventEmitter, Compatible) {
	/**
	 *  浏览器兼容处理
	 *
	 * @class
	 * @extend EventEmitter
	 */
	function TFCompatible() {
	    TFCompatible.superClass.call(this);
	    this.convertMap = {};
	}
	Util.inherit(TFCompatible, EventEmitter);
	
	// 引用浏览器前缀
	TFCompatible.prototype.prefix = Compatible.prefix;
	
	/**
	 * 变换和过渡的简写以及默认值对照表
	 *
	 * @private
	 */
	TFCompatible._keyMap = {
	    'transform': ['transform'],
	    'transition': ['transition'],
	    'duration': ['transitionDuration', '1s'],
	    'function': ['transitionTimingFunction', 'linear'],
	    'delay': ['transitionDelay', '0s']
	};
	
	/**
	 * 如果为duration function delay，简称转全称,
	 * 其他加入兼容性前缀：transition -->webkitTransition
	 *
	 * @param {string} key 要转换的属性名
	 * @return {string} 转换后的属性名
	 */
	TFCompatible.prototype.parseCSS = function (key) {
	    if (key in TFCompatible._keyMap) {
	        key =  TFCompatible._keyMap[key][0];
	    }
	    var body = document.getElementsByTagName('body')[0];
	    if (typeof body.style[key] !== 'undefined') {
	        return key;
	    }
	    var p = this.prefix.replace(/-/g, '');
	    return p + key[0].toUpperCase() + key.substr(1);
	};
	
	/**
	 * 设置transition的值时进行转换, css属性名转js标准属性名
	 * 例如transition： -webkit-transform 1s, border-radius 2s;
	 * transform --> -webkit-transform
	 * backgroundColor --> background-color
	 *
	 * @param {string} propertyName 要转换的属性名
	 * @return {string} 转换后的属性名
	 */
	TFCompatible.prototype.cssMap = function (propertyName) {
	    if (!(propertyName in this.convertMap)) {
	        var body = document.getElementsByTagName('body')[0];
	        var standardName = propertyName.replace(/[A-Z]/g, function ($0) {
	            return '-' + $0.toLowerCase();
	        });
	        if (typeof body.style[propertyName] === 'undefined') {
	            standardName = this.prefix + standardName;
	        }
	        this.convertMap[propertyName] = standardName;
	    }
	    return this.convertMap[propertyName];
	};
	
	/**
	 * 浏览器兼容性事件对照表
	 */
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
	
	/**
	 * 想状态对象添加事件状态
	 *
	 * @param {Status} status 状态对象
	 * @param {string} key 要映射的事件名称
	 * @return {string} 映射后的事件名称
	 */
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
	    Util.forIn(TFCompatible._keyMap, function (key) {
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
	            if (key in keyMap) {
	                clone[key] = this.clone(value, apiMap);
	            }
	            else if (key in apiMap) {
	                if (!('api' in clone)) {
	                    clone.api = {};
	                }
	                clone.api[apiMap[key]] = this.clone(value, apiMap);
	            }
	        }, this);
	    }
	    else {
	        clone = obj;
	    }
	    return clone;
	};
	
	/**
	 * 生成transition属性值
	 *
	 * @param {Object} transition 配置对象
	 * @return {string} 生成的transition值
	 */
	TFCompatible.prototype.parseTransition = function (transition) {
	    function regReplace($0, $1) {
	        if ($1 in transition) {
	            return transition[$1];
	        }
	        return TFCompatible._keyMap[$1][1];
	    }
	    return '<property> <duration> <function> <delay>'.replace(/<(.*?)>/g, regReplace);
	};
	
	/**
	 * 获取TFCompatible单例
	 *
	 * @return {TFCompatible} 单例
	 */
	TFCompatible.instance = function () {
	    if (!TFCompatible._compatible) {
	        TFCompatible._compatible = new TFCompatible();
	    }
	    return TFCompatible._compatible;
	};
	
	// 兼容性事件转换函数
	TFCompatible.prototype.parseEvent = Compatible.parseEvent('transition', 'Transition');
	return TFCompatible;});