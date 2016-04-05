/**
 * @file 通用工具
 * @author tingkl(dingguoliang01@baidu.com)
 **/
/* define Util */
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

/**
 * @file ͨ���¼�ö��
 * @author tingkl(dingguoliang01@baidu.com)
 **/
/* define Event */
/**
 * @namespace
 */
var Event = {
    style: 'Style',
    css: 'CSS',
    clear: 'Clear',
    beforeStart: 'BeforeStart',
    pause: 'Pause',
    start: 'Start',
    iteration: 'Iteration',
    end: 'End',
    next: 'Next',
    over: 'Over',
    on: 'On',
    off: 'Off',
    stop: 'Stop',
    goon: 'Goon',
    once: 'Once',
    all: 'All',
    emit: 'Emit'
};

/**
 * @file 参数检查类定义
 * @author tingkl(dingguoliang01@baidu.com)
 **/
/* global Util */
// 当前文件依赖加载: Util.js
/* define Checker */
/**
 * 参数类型匹配
 *
 * @class
 * @param {...(string|Function)} arg 类型字符串或者类
 */
function Checker() {
    this._list = Util.arg2Ary(arguments);
}

/**
 * 参数检查
 *
 * @param {Arguments.<(string|Function)>|Array.<(string|Function)>} arg 参数集合
 * @return {boolean} 是否满足检查规则
 */
Checker.prototype.check = function (arg) {
    var me = this;
    if (arg.length !== me._list.length) {
        return false;
    }
    var type;
    var typeOf;
    var match = Util.each(arg, function (item, i) {
        type = me._list[i];
        // type有可能为字符串或者类，例如：new Checker(Array);
        typeOf = typeof type;
        // 对于字符串使用typeof判断
        if (typeOf === 'string') {
            if (typeof item !== type) {
                return false;
            }
        }
        // 对于类使用instance判断是否为类的实例
        else if (typeOf === 'function') {
            if (!(item instanceof type)) {
                return false;
            }
        }
    });
    return match;
};
// 参数1为string类型，参数2为JSON对象
Checker.stringObject = new Checker('string', 'object');
// 参数1为JSON对象，参数1为string类型
Checker.objectString = new Checker('object', 'string');
// 参数1为JSON类型
Checker.object = new Checker('object');
// 参数1为string类型
Checker.string = new Checker('string');
// 参数1为string类型，参数2为string类型，参数3为函数
Checker.ssFunction = new Checker('string', 'string', 'function');
// 参数1为string类型，参数2为函数
Checker.sFunction = new Checker('string', 'function');
// 参数1为Array类型
Checker.array = new Checker(Array);

/**
 * @file �¼��ַ��ඨ��
 * @author tingkl(dingguoliang01@baidu.com)
 **/
/* eslint-disable brace-style */
/* global Util Event Checker */
// ��ǰ�ļ���������: Util.js Event.js Checker.js
/* define EventEmitter */

/**
 *  �¼��ַ���
 *
 * @class
 */
function EventEmitter() {
    this._triggers = {};
}

/**
 *  �¼�����
 */
EventEmitter.type = {
    once: 'once',
    all: 'all'
};

/**
 * ע���¼����Ļص�����
 *
 * @param {string} eventName �¼���
 * @param {Function} fn �ص�����
 * @param {Object=} option ��ѡ����
 */
EventEmitter.prototype.on = function (eventName, fn, option) {
    if (eventName) {
        if (eventName in this._triggers) {
            this._triggers[eventName].push({fn: fn, option: option});
        }
        else {
            this._triggers[eventName] = [{fn: fn, option: option}];
        }
        this.emit(Event.on, eventName, option);
    }
    else {
        throw new Error('undefined event!');
    }
};

/**
 * ע���¼����Ļص�����
 *
 * @param {string} eventName �¼���
 * @param {Function} fn �ص�����
 */
EventEmitter.prototype.off = function (eventName, fn) {
    if (Checker.string.check(arguments)) {
        if (eventName in this._triggers) {
            this._triggers[eventName] = [];
            this.emit(Event.off, eventName);
        }
    }
    else if (Checker.sFunction.check(arguments)) {
        if (eventName in this._triggers) {
            var index = -1;
            Util.each(this._triggers[eventName], function (item, i) {
                if (item.fn === fn) {
                    index = i;
                    return false;
                }
            });
            if (index > -1) {
                this._triggers[eventName].splice(index, 1);
                this.emit(Event.off, eventName);
            }
        }
    }
    else {
        throw new Error('incorrect parameter!');
    }
};

/**
 * ע���¼����ĵ��λص�����
 *
 * @param {string} eventName �¼���
 * @param {Function} fn �ص�����
 * @param {Object=} option ��ѡ����
 */
EventEmitter.prototype.once = function (eventName, fn, option) {
    if (!option) {
        option = {};
    }
    option.type = EventEmitter.type.once;
    this.emit(Event.once, eventName, option);
    this.on(eventName, fn, option);
};

/**
 * ע���¼����ĵ��λص�����
 *
 * @param {Function} fn �ص�����
 * @param {Object} option ���ò���
 * @param {Object} params �������
 */
EventEmitter.prototype.callWithScope = function (fn, option, params) {
    params = params || [];
    if (option && option.hasOwnProperty('scope')) {
        fn.apply(option.scope, params);
    }
    else
    {
        fn.apply(this, params);
    }
};

/**
 * ע���¼����ϵĻص�����
 *
 * @param {Array.<string>} dependency �¼�����
 * @param {Function} fn �ص�����
 * @param {Object} option ���ò���
 */
EventEmitter.prototype.all = function (dependency, fn, option) {
    var record = {};
    var results = [];
    if (dependency.length === 0) {
        this.callWithScope(fn, option);
        return;
    }
    var me = this;
    var proxyCallback = function (index) {
        return  function (eventName, result) {
            if (eventName in record) {
                record[eventName] = true;
                results[index] = result;
            }
            var trigger = Util.forIn(record, function (key, item) {
                if (item === false) {
                    return false;
                }
            });
            if (trigger) {
                me.callWithScope(fn, option, results);
            }
        };
    };
    Util.each(dependency, function (eventName, i) {
        record[eventName] = false;
        this.on(eventName, proxyCallback(i), {type: EventEmitter.type.all});
    }, me);
    this.emit(Event.all, dependency, option);
};

/**
 * �¼���������
 *
 * @param {string} eventName �¼���
 */
EventEmitter.prototype.emit = function (eventName) {
    var fns = this._triggers[eventName];
    var scope;
    var type;
    var fn;
    var option;
    var offs = [];
    var args = arguments;
    if (fns) {
        var me = this;
        Util.each(fns, function (itemFn) {
            fn = itemFn.fn;
            option = itemFn.option;
            if (option) {
                scope = option.scope;
                type = option.type;
            }
            else {
                scope = false;
                type = false;
            }
            if (scope) {
                fn.apply(scope, Util.arg2Ary(args));
            }
            else {
                fn.apply(me, Util.arg2Ary(args));
            }
            if (type) {
                // type === EventEmitter.type.once or type === EventEmitter.type.all
                offs.push(itemFn);
            }
        });
        if (offs.length > 0) {
            var newFns = [];
            var fnsIndex = 0;
            var offIndex = 0;
            var sizeFns = fns.length;
            var sizeOffs = offs.length;
            var itemOff;
            var itemFn;
            itemOff = offs[offIndex];
            while (fnsIndex < sizeFns) {
                itemFn = fns[fnsIndex];
                if (itemFn === itemOff) {
                    offIndex++;
                    if (offIndex < sizeOffs) {
                        itemOff = offs[offIndex];
                    }
                    else {
                        itemOff = -1;
                    }
                }
                else {
                    newFns.push(itemFn);
                }
                fnsIndex++;
            }
            if (newFns.length === 0) {
                delete this._triggers[eventName];
            }
            else {
                this._triggers[eventName] = newFns;
            }
        }
    }
};

/**
 * @file 浏览器兼容性处理工具
 * @author tingkl(dingguoliang01@baidu.com)
 **/
/* global Util Event */
// 当前文件依赖加载: Util.js Event.js
/* define Compatible */
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

/**
 * @file transform相关浏览器兼容性处理
 * @author tingkl(dingguoliang01@baidu.com)
 **/
/* global Util Event EventEmitter Compatible*/
// 当前文件依赖加载: Util.js Event.js EventEmitter.js Compatible.js
/* define TFCompatible */

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
    if (typeof document.body.style[key] !== 'undefined') {
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
        var standardName = propertyName.replace(/[A-Z]/g, function ($0) {
            return '-' + $0.toLowerCase();
        });
        if (typeof document.body.style[propertyName] === 'undefined') {
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

/**
 * @file transitionEnd事件兼容处理
 * @author tingkl(dingguoliang01@baidu.com)
 **/
/* global Util */
// 当前文件依赖加载: Util.js
/* define Status */

/**
 * transitionEnd事件兼容
 *
 * @class
 */
function Status() {
    this.init();
    this.size = 0;
    this.store = [];
}

// 分隔符
Status.sep = '|';

/**
 * 初始化
 */
Status.prototype.init = function () {
    this.all = {};
    this.once = {};
    this.addUp = 0;
};

/**
 * 添加要监听的属性
 *
 * @param {string} all 属性名
 * @param {Array.<string>} once all可拆分的成的所有属性名
 * @param {?boolean} isReset 标识是否为reset调用
 */
Status.prototype.add = function (all, once, isReset) {
    this.all[all] = false;
    var sep = Status.sep;
    if (once) {
        this.once[all] = sep + once.join(sep + sep) + sep;
    }
    if (!isReset) {
        this.store.push({all: all, once: once});
        this.size++;
    }
};

/**
 * 重置所有添加的状态
 */
Status.prototype.reset = function () {
    this.init();
    Util.each(this.store, function (item) {
        this.add(item.all, item.once, true);
    }, this);
};

/**
 * 是否完成所有子事件
 *
 * @return {boolean} 是否完成了所有子事件
 */
Status.prototype.isDone = function () {
    return this.size === this.addUp;
};

/**
 * 消化监听的属性
 *
 * @param {string} pName 属性名
 */
Status.prototype.digest = function (pName) {
    var all = this.all;
    var once = this.once;
    var sep = Status.sep;
    if (pName in all) {
        all[pName] = true;
        delete once[pName];
        this.addUp++;
    }
    else {
        Util.forIn(once, function (key, val) {
            val = val.replace(sep + pName + sep, '');
            once[key] = val;
            if (val === '') {
                all[pName] = true;
                this.addUp++;
                delete once[pName];
                return false;
            }
        }, this);
    }
};

/**
 * @file 基于事件监听变换逻辑处理
 * @author tingkl(dingguoliang01@baidu.com)
 **/
/* eslint-disable no-loop-func */
/* global Util Event EventEmitter Compatible TFCompatible Status */
// 当前文件依赖加载: Util.js Event.js EventEmitter.js Compatible.js TFCompatible.js Status.js
/* define Transition */

/**
 * 使用transform + transition进行变换
 *
 * @param {Node} dom 进行动画变换的元素
 * @param {boolean} executeInTime 是否为即使变换
 * @class
 * @extends EventEmitter
 */
function Transition(dom, executeInTime) {
    Transition.superClass.call(this);
    this._dom = dom;
    this._executeInTime = executeInTime;
    this._steps = [];
    this._store = {};
    this._index = 0;
    this._transformRecord = '';
    this._firstRun = true;
    this._compatible = TFCompatible.instance();
    this._listen();
}
Util.inherit(Transition, EventEmitter);

/**
 * 动画事件监听逻辑
 *
 * @private
 */
Transition.prototype._listen = function () {
    var me = this;
    var cpt = me._compatible;
    function wrap(eventName) {
        return function (evt) {
            me.emit(eventName, evt);
        };
    }
    // 只有在绑定end监听时才真正的在dom元素上监听
    this.on(Event.on, function (on, eventName) {
        if (eventName  === Event.end) {
            if (!me._monitorEnd) {
                me._monitor = wrap(eventName);
                me._on(cpt.parseEvent(eventName), me._monitor);
            }
        }
    });
    // transition仅仅有这一个事件
    this.on(Event.end, function (end, evt) {
        if (me._index < me._steps.length) {
            var step = me._steps[me._index];
            var propertyName = evt.propertyName.replace(cpt.prefix, '');
            step.status.digest(propertyName);
            if (step.status.isDone()) {
                me._index++;
                if (step.next) {
                    me.emit(Event.next, step);
                    step.next();
                }
                else {
                    me.emit(Event.over, step);
                }
            }
        }
        Util.stopPropagation(evt);
    });
};

/**
 * 合并当前transform与变换transform，不破坏之前的状态
 *
 * @param {boolean} flag 是否为即刻执行模式
 * @return {Transition} 对象本身
 */
Transition.prototype.setExecuteInTime = function (flag) {
    this._executeInTime = flag;
    return this;
};

/**
 * 恢复到变换之前的状态
 *
 * @return {Transition} 对象本身
 */
Transition.prototype.reStore = function () {
    Compatible.css(this._dom, this._store, '', this);
    var status;
    while (this._index > 0) {
        this._index--;
        status = this._steps[this._index].status;
        status.reset();
    }
    this._transformRecord = '';
    return this;
};

/**
 * 触发重绘
 *
 * @return {Transition} 对象本身
 */
Transition.prototype.reflow = function () {
    Compatible.reflow(this._dom);
    return this;
};

/**
 * 当executeInTime为false，即非即刻执行模式下，调用此函数触发变换
 *
 * @return {Transition} 对象本身
 */
Transition.prototype.execute = function () {
    if (!this._firstRun) {
        this.reStore().reflow();
        this._firstRun = false;
    }
    if (this._index < this._steps.length) {
        var firstStep = this._steps[this._index];
        if ('execute' in firstStep) {
            firstStep.execute();
        }
    }
    return this;
};

/**
 * 目前支持的变换已经简写对照表
 *
 * @private
 */
Transition._apiMap = {
    changeTo: {
        c: 'color',
        bc: 'backgroundColor',
        fs: 'fontSize',
        br: 'borderRadius',
        bo: 'border',
        o: 'opacity',
        l: 'left',
        r: 'right',
        t: 'top',
        b: 'bottom',
        w: 'width',
        h: 'height'
    },
    // 不具有实用性，去掉
    /* perspective: {
        p: 'perspective'
    },*/
    moveTo: {
        t: 'top', l: 'left', b: 'bottom', r: 'right'
    },
    moveBy: {
        'x': 'translateX', 'y': 'translateY', 'z': 'translateZ', '2d': 'translate', '3d': 'translate3d'
    },
    scaleBy: {
        'x': 'scaleX', 'y': 'scaleY', 'z': 'scaleZ', '2d': 'scale', '3d': 'scale3d'
    },
    rotateBy: {
        // rotate === rotateZ
        'x': 'rotateX', 'y': 'rotateY', 'z': 'rotateZ', '3d': 'rotate3d'
    },
    skewBy: {
        // skew没有3d
        'x': 'skewX', 'y': 'skewY', '2d': 'skew'
    }
};
// 不具有实用性，暂时去掉
/* Transition.prototype.perspectiveTo = function (config) {
    var apiMap = Transition._apiMap.perspective;
    this._transform(config, apiMap);
    return this;
};*/

/**
 * 新状态
 *
 * @private
 * @param {Object} transition transition键值对象
 * @param {Function} generator css键值对象，包括transform
 * @param {Status} status 需要监听的属性变化对象，包括transform以及其他css属性
 */
Transition.prototype._step = function (transition, generator, status) {
    var me = this;
    var cpt = me._compatible;
    var step = {};
    var length = me._steps.length;
    var handler = function (dom, key, css) {
        me.emit(Event.css, dom, key, css);
    };
    if (length > 0) {
        var front = me._steps[length - 1];
        var next = front.next;
        if (next) {
            front.next = function () {
                next();
                Compatible.css(me._dom, cpt.parseCSS('transition'), transition, handler);
                Compatible.css(me._dom, generator(), '', handler);
            };
            if (me._index === me._steps.length) {
                Compatible.css(me._dom, cpt.parseCSS('transition'), transition, handler);
                Compatible.css(me._dom, generator(), '', handler);
            }
        }
        else {
            front.next = function () {
                Compatible.css(me._dom, cpt.parseCSS('transition'), transition, handler);
                Compatible.css(me._dom, generator(), '', handler);
            };
            if (me._index === me._steps.length) {
                front.next();
            }
        }
    }
    else {
        step.execute = function () {
            Compatible.css(me._dom, cpt.parseCSS('transition'), transition, handler);
            Compatible.css(me._dom, generator(), '', handler);
        };
        if (this._executeInTime) {
            step.execute();
        }
    }
    step.status = status;
    step.next = false;
    this._steps.push(step);
};

/**
 * 合并当前transform与变换transform，不破坏之前的状态
 *
 * @private
 * @param {Array.<string>} val 要新设置的transform值
 * @return {string} 合并后的transform值
 */
//  * @param {string} transform transform的css属性名，例如webkitTransform
Transition.prototype._combineTransform = function (val) {
    // 如果加入z轴变换，发现 matrix3d(...,offsetX, offsetY, offsetZ, 1) + translateZ(-offsetZ)在z方向不为0
    /* var current = Util.css(this._dom, transform);
    if (current && current !== 'none') {
        return current + ' ' + val.join(' ');
    }
    return val.join(' ');*/
    this._transformRecord += val.join(' ');
    return this._transformRecord;
};

/**
 * 只在transform相关时才会调用，根据apiMap填充config配置以及要进行的transform变换
 *
 * @private
 * @param {Object} config 变换配置
 * @param {Object} apiMap 所支持的相应变化
 * @param {Array.<string>} val 根据config生成的transform变换值
 */
Transition.prototype._fillTransformParams = function (config, apiMap, val) {
    var cpt = this._compatible;
    var transform = cpt.parseCSS('transform');
    var transition = cpt.parseCSS('transition');
    config = cpt.clone(config, apiMap);
    var api = config.api;
    if (api) {
        Util.forIn(api, function (key, value) {
            val.push(key + '(' + value + ')');
        });
    }
    else {
        throw new Error('不健全的配置项！');
    }
    if (!(transform in this._store)) {
        this._store[transform] = Util.css(this._dom, transform);
    }
    if (!(transition in this._store)) {
        this._store[transition] = Util.css(this._dom, transition);
    }
};

/**
 * transform相关变化的css，status，transition生成逻辑
 *
 * @private
 * @param {Object}  config 变换配置对象
 * @param {Object} apiMap  所支持的相应变化
 */
Transition.prototype._transform = function (config, apiMap) {
    var me = this;
    var cpt = me._compatible;
    var $transform = cpt.cssMap('transform');
    var val = [];
    this._fillTransformParams(config, apiMap, val);
    var status = new Status();
    status.add('transform');
    config.property = $transform;
    this._step(cpt.parseTransition(config), function () {
        // 应当计算上一个动画结束时的transform，所以需要用回调
        var css = {};
        var transform = cpt.parseCSS('transform');
        css[transform] = me._combineTransform(val);
        return css;
    }, status);
};

/**
 * 只在非相关时才会调用，根据apiMap填充configs配置以及要进行的css变换
 *
 * @private
 * @param {(Object|Array.<Object>)} configs 由于为非transform变换，所以不共享transform，可以有多个配置
 * @param {Object} apiMap 所支持的相应变化
 * @param {Array.<string>} transition css属性transition集合
 * @param {Object} css css变换键值对
 * @param {Status} status 状态监听对象
 * @return {Object} 返回添加过api的配置对象，用于产出transition值，用不到api，只是方便调用
 */
Transition.prototype._fillCSSParams = function (configs, apiMap, transition, css, status) {
    var keyT;
    var me = this;
    var $transition = me._compatible.parseCSS('transition');
    configs = me._compatible.clone(configs, apiMap);
    if (!(configs instanceof Array)) {
        configs = [configs];
    }
    Util.each(configs, function (config) {
        if (config.api) {
            Util.forIn(config.api, function (key, item) {
                keyT = this._compatible.addStatus(status, key);
                css[key] = item;
                if (!(key in this._store)) {
                    this._store[key] = Util.css(this._dom, key);
                }
                if (!($transition in this._store)) {
                    this._store[$transition] = Util.css(this._dom, $transition);
                }
                config.property = keyT;
                transition.push(me._compatible.parseTransition(config));
            }, me);
        }
        else {
            throw new Error('不健全的配置！');
        }
    });
    return configs;
};

/**
 * 只在非相关时才会调用，根据apiMap填充configs配置以及要进行的css变换
 *
 * @private
 * @param {(Object|Array.<Object>)} configs 由于为非transform变换，所以不共享transform，可以有多个配置
 * @param {Object} apiMap 所支持的相应变化
 */
Transition.prototype._css = function (configs, apiMap) {
    var transition = [];
    var css = {};
    var status = new Status();
    this._fillCSSParams(configs, apiMap, transition, css, status);
    this._step(transition.join(','), function () {
        return css;
    }, status);
};

/**
 * 位移变换
 *
 * @param {Object|Array.<Object>} configs 配置对象
 * @return {Transition} 对象本身
 */
Transition.prototype.moveTo = function (configs) {
    var apiMap = Transition._apiMap.moveTo;
    configs = this._patchMoveTo(configs, apiMap);
    this._css(configs, apiMap);
    return this;
};

/**
 * left top bottom right 必须有初始值，auto值不触发变换
 *
 * @private
 * @param {(Object|Array.<Object>)} configs 由于为非transform变换，所以不共享transform，可以有多个配置
 * @param {Object} apiMap 所支持的相应变化
 * @return {Array.<Object>} 设置初始值后，返回数组configs
 */
Transition.prototype._patchMoveTo = function (configs, apiMap) {
    if (!(configs instanceof Array)) {
        configs = [configs];
    }
    var dom = this._dom;
    var val;
    var atr;
    var patch = {};
    Util.each(configs, function (config) {
        Util.forIn(config, function (key) {
            if (key in apiMap) {
                atr = apiMap[key];
                val = Util.css(dom, atr);
                if (!val || val === 'auto') {
                    patch[atr] = 0;
                }
            }
        });
    });
    // 极低可能下在同一个requestAnimationFrame下，不起作用，需要reflow，这里先不做处理
    Util.forIn(patch, function (key, val) {
        Util.css(dom, key, val);
    });
    return configs;
};

/**
 * 变换
 *
 * @param {Object|Array.<Object>} configs 配置对象
 * @return {Transition} 对象本身
 */
Transition.prototype.changeTo = function (configs) {
    var apiMap = Transition._apiMap.changeTo;
    configs = this._patchMoveTo(configs, Transition._apiMap.moveTo);
    this._css(configs, apiMap);
    return this;
};

/**
 * 移动变换
 *
 * @param {Object} config 配置对象
 * @return {Transition} 对象本身
 */
Transition.prototype.moveBy = function (config) {
    var apiMap = Transition._apiMap.moveBy;
    this._transform(config, apiMap);
    return this;
};

/**
 * 缩放变换
 *
 * @param {Object} config 配置对象
 * @return {Transition} 对象本身
 */
Transition.prototype.scaleBy = function (config) {
    var apiMap = Transition._apiMap.scaleBy;
    this._transform(config, apiMap);
    return this;
};

/**
 * 扭转变换
 *
 * @param {Object} config 配置对象
 * @return {Transition} 对象本身
 */
Transition.prototype.skewBy = function (config) {
    var apiMap = Transition._apiMap.skewBy;
    this._transform(config, apiMap);
    return this;
};

/**
 * 旋转变换
 *
 * @param {Object} config 配置对象
 * @return {Transition} 对象本身
 */
Transition.prototype.rotateBy = function (config) {
    var apiMap = Transition._apiMap.rotateBy;
    this._transform(config, apiMap);
    return this;
};

/**
 * 模拟运行环境
 *
 * @param {string} method 要模拟的函数
 * @param {Object} config 配置对象
 * @return {Array} 模拟得到的返回数据
 */
Transition.prototype.mock = function (method, config) {
    var apiMap = Transition._apiMap[method];
    var css = {};
    var status = new Status();
    var transition = [];
    if ('moveTo changeTo'.indexOf(method) > -1) {
        this._fillCSSParams(config, apiMap, transition, css, status);
        return [transition.join(','), css, status];
    }
    var cpt = this._compatible;
    var transform = cpt.parseCSS('transform');
    var val = [];
    var $transform = cpt.cssMap('transform');
    if (method === 'mix') {
        var mould = this._compatible.peelMould(config);
        var part;
        var transformCount = 0;
        Util.forIn(Transition._apiMap, function (key, $apiMap) {
            if (key in config) {
                part = config[key];
                if (key === 'moveTo' || key === 'changeTo') {
                    part = this._patchMoveTo(part, Transition._apiMap.moveTo);
                    Util.each(part, function (item) {
                        Util.extend(item, mould);
                    });
                    this._fillCSSParams(part, $apiMap, transition, css, status);
                }
                else {
                    this._fillTransformParams(part, $apiMap, val);
                    transformCount++;
                }
            }
        }, this);
        if (transformCount > 0) {
            status.add('transform');
            config.property = $transform;
            transition.push(cpt.parseTransition(config));
        }
        if (transformCount > 0) {
            transform = cpt.parseCSS('transform');
            css[transform] = 'old+; ' + val.join(' ');
        }
        return [transition.join(','), css, status];
    }
    this._fillTransformParams(config, apiMap, val);
    status.add('transform');
    config.property = $transform;
    css[transform] = 'old+; ' + val.join(' ');
    return [cpt.parseTransition(config), css, status];
};

/**
 * 混合变换
 *
 * @param {Object} config 配置对象
 * @return {Transition} 对象本身
 */
Transition.prototype.mix = function (config) {
    var mould = this._compatible.peelMould(config);
    var part;
    var transition = [];
    var css = {};
    var status = new Status();
    var val = [];
    var transformCount = 0;
    Util.forIn(Transition._apiMap, function (key, $apiMap) {
        if (key in config) {
            part = config[key];
            if (key === 'moveTo' || key === 'changeTo') {
                part = this._patchMoveTo(part, Transition._apiMap.moveTo);
                Util.each(part, function (item) {
                    Util.extend(item, mould);
                });
                this._fillCSSParams(part, $apiMap, transition, css, status);
            }
            else {
                this._fillTransformParams(part, $apiMap, val);
                transformCount++;
            }
        }
    }, this);
    var me = this;
    var cpt = me._compatible;
    if (transformCount > 0) {
        var $transform = cpt.cssMap('transform');
        status.add('transform');
        config.property = $transform;
        transition.push(cpt.parseTransition(config));
    }
    this._step(transition.join(','), function () {
        if (transformCount > 0) {
            var transform = cpt.parseCSS('transform');
            css[transform] = me._combineTransform(val, transform);
        }
        return css;
    }, status);
    return this;
};

/**
 * 插入变换队列
 *
 * @param {Function} callback 回调函数
 * @return {Transition} 对象本身
 */
Transition.prototype.then = function (callback) {
    var length = this._steps.length;
    if (length > 0) {
        var front = this._steps[length - 1];
        var next = front.next;
        if (next) {
            front.next = function () {
                next();
                callback();
            };
        }
        else {
            front.next = callback;
        }
    }
    else {
        callback();
    }
    return this;
};

/**
 * 注册事件监听函数
 *
 * @private
 * @param {string} name 动画事件名称
 * @param {Function} callback 事件回调函数
 */
Transition.prototype._on = function (name, callback) {
    Util.on(this._dom, name, callback);
};

/**
 * 注销事件监听函数
 *
 * @private
 * @param {string} name 动画事件名称
 * @param {Function} callback 事件回调函数
 */
Transition.prototype._off = function (name, callback) {
    Util.off(this._dom, name, callback);
};

Transition.prototype._unListen = function () {
    if (this._monitorEnd) {
        this._off(this._compatible.parseEvent(Event.end), this._monitorEnd);
    }
};

/**
 * 设置视点位置
 *
 * @param {string|boolean} perspective 视点距离
 * @return {Transition} 对象本身
 */
Transition.prototype.perspective = function (perspective) {
    var cpt = this._compatible;
    var parentNode = this._dom.parentNode;
    if (perspective === false) {
        Compatible.css(parentNode, cpt.parseCSS('transformStyle'), 'flat', this);
    }
    else {
        Compatible.css(parentNode, cpt.parseCSS('transformStyle'), 'preserve-3d', this);
        Compatible.css(parentNode, cpt.parseCSS('perspective'), perspective, this);
    }
    return this;
};
