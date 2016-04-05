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
            return String.fromCharCode(seed[0] + Math.floor(seed[1] * Math.random()));
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
 * @file 属性扫描处理
 * @author tingkl(dingguoliang01@baidu.com)
 **/

/* global Checker */
/* define Pitch */

/**
 * css属性转cssText过滤器
 *
 * @param {string} name  pitch的别名.
 * @param {string} keys 补丁属性集合.
 * @param {Function} handler 补丁函数.
 * @class
 */
function Pitch(name, keys, handler) {
    this._router = [];
    if (Checker.ssFunction.check(arguments)) {
        this.use(name, keys, handler);
    }
}
Pitch.prototype.use = function (name, keys, handler) {
    this._router.push({name: name, keys: keys + ' ', handler: handler});
    return this;
};
Pitch.prototype.next = function (index, key, value, opt) {
    var middleware = this._router[index];
    if (middleware) {
        if (middleware.keys.trim() === '*') {
            return middleware.handler(key.trim(), value, opt);
        }
        if (middleware.keys.indexOf(key) > -1) {
            return middleware.handler(key.trim(), value, opt);
        }
        return this.next(index + 1, key, value, opt);
    }
    return '';
};
Pitch.prototype.do = function (key, value, opt) {
    return this.next(0, key, value, opt);
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
 * @file 事件分发类定义
 * @author tingkl(dingguoliang01@baidu.com)
 **/
/* eslint-disable brace-style */
/* global Util Event Checker */
// 当前文件依赖加载: Util.js Event.js Checker.js
/* define EventEmitter */

/**
 *  事件分发器
 *
 * @class
 */
function EventEmitter() {
    this._triggers = {};
}

/**
 *  事件种类
 */
EventEmitter.type = {
    once: 'once',
    all: 'all'
};

/**
 * 注册事件名的回调函数
 *
 * @param {string} eventName 事件名
 * @param {Function} fn 回调函数
 * @param {Object=} option 可选参数
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
 * 注销事件名的回调函数
 *
 * @param {string} eventName 事件名
 * @param {Function} fn 回调函数
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
 * 注册事件名的单次回调函数
 *
 * @param {string} eventName 事件名
 * @param {Function} fn 回调函数
 * @param {Object=} option 可选参数
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
 * 注册事件名的单次回调函数
 *
 * @param {Function} fn 回调函数
 * @param {Object} option 配置参数
 * @param {Object} params 结果参数
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
 * 注册事件集合的回调函数
 *
 * @param {Array.<string>} dependency 事件集合
 * @param {Function} fn 回调函数
 * @param {Object} option 配置参数
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
 * 事件触发函数
 *
 * @param {string} eventName 事件名
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
/* global Util */
// 当前文件依赖加载: Util.js
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
 * @file 动画帧相关兼容处理
 * @author tingkl(dingguoliang01@baidu.com)
 **/
/* global Pitch Util Checker Event EventEmitter Compatible*/
/* define KFCompatible */

/**
 *  浏览器兼容处理
 *
 * @class
 * @extend EventEmitter
 */
function KFCompatible() {
    KFCompatible.superClass.call(this);
    var pitch = new Pitch();
    var me = this;
    pitch.use('prefixOnly', 'text-shadow backface-visibility transition transition-timing-function '
        + 'animation-timing-function transform-origin transform-style perspective-origin perspective '
        + 'background-clip background-origin',
        function (key, value) {
            if (value === 'transform') {
                value = me.prefix + value;
            }
            return me.prefix + key + ':' + value + ';';
        }
    );
    pitch.use('needAll', 'box-shadow border-radius',
        function (key, value) {
            return me.prefix + key + ':' + value + ';' + key + ':' + value + ';';
        }
    );
    // 需要整合到transform中的值，暂存如opt中
    pitch.use('extend', 'translateX translateY translateZ translate translate3d '
        + 'rotateX rotateY rotateZ rotate rotate3d '
        + 'skewX skewY skewZ skew '
        // perspective-origin 只对设置了perspective属性的起作用，对于transform: perspective(700px)不起作用
        // + 'perspective',
        + 'scaleZ scaleX scaleY scale3d scale ',
        function (key, value, opt) {
            if ('transform' in opt) {
                opt.transform += ' ' + key + '(' + value + ')';
            }
            else {
                opt.transform = key + '(' + value + ')';
            }
            return '';
        }
    );
    // 直接的transform，需要拼接到opt.transform
    pitch.use('transform', 'transform',
        function (key, value, opt) {
            if ('transform' in opt) {
                opt.transform += ' ' + value;
            }
            else {
                opt.transform = value;
            }
            return '';
        });
    // class的定义中可能出现
    pitch.use('animation', 'animation', function (key, value) {
        return me.prefix + key + ':' + me.parseAnimation(value) + ';';
    });
    pitch.use('specialA', 'background background-image ',
        function (key, value) {
            return key + ':' + value.replace(/(linear|radial)-gradient/g, me.prefix + '$1-gradient') + ';';
        });
    pitch.use('specialB', 'mask-image',
        function (key, value) {
            return me.prefix + key + ':' + value.replace(/(linear|radial)-gradient/g, me.prefix + '$1-gradient') + ';';
        });
    pitch.use('rest', '*',
        function (key, value) {
            return key + ':' + value + ';';
        });
    this._pitch = pitch;
    // 经过_pitch处理，transform聚合到opt中，由_combine处理
    this._combine = new Pitch('combine', 'transform',
        function (key, value) {
            return me.prefix + key + ':' + value + ';';
        }
    );
}
Util.inherit(KFCompatible, EventEmitter);
KFCompatible.prototype.prefix = Compatible.prefix;
KFCompatible._keyMap = {
    'animation': ['animation'],
    'name': ['animationName'],
    'duration': ['animationDuration', '1s'],
    'function': ['animationTimingFunction', 'linear'],
    'delay': ['animationDelay', '0s'],
    'count': ['animationIterationCount', 1],
    'direction': ['animationDirection', 'normal'],
    'state': ['animationPlayState', 'running'],
    'mode': ['animationFillMode', 'forwards']
};
KFCompatible.prototype.parseAnimation = function (animations) {
    if (!Checker.array.check(arguments)) {
        animations = [animations];
    }
    var css;
    var csses = [];
    var tpl = this.animationTpl();
    function regReplace($0, $1) {
        if ($1 in css) {
            return css[$1];
        }
        return KFCompatible._keyMap[$1][1];
    }
    Util.each(animations, function (animation) {
        css = animation;
        csses.push(tpl.replace(/<(.*?)>/g, regReplace));
    });
    return csses.join(',');
};
KFCompatible.prototype.animationTpl = function () {
    if (!this._animationTpl) {
        if (this.prefix === '-moz-') {
            this._animationTpl = '<duration> <function> <delay> <direction> <mode> <count> <state> <name>';
            this._closeReg = {start: '\\s', end: '(?:\\s*)$'};
        }
        else {
            this._animationTpl = '<name> <duration> <function> <delay> <count> <direction> <mode>';
            this._closeReg = {start: '^(?:\\s*)', end: '\\s'};
        }
    }
    return this._animationTpl;
};
KFCompatible.prototype.regExp = function (middle) {
    return new RegExp(this._closeReg.start + middle + this._closeReg.end);
};
KFCompatible.prototype.keyframe = function (keyframe) {
    return '@' + this.prefix + 'keyframes ' + keyframe;
};
KFCompatible.prototype.percent = function (percent) {
    percent = (percent + '').trim();
    var percents = percent.split(/\s+/);
    return percents.join('%, ') + '%';
};
KFCompatible.prototype.patchCombine = function (key, value) {
    return this._combine.do(key + ' ', value);
};
KFCompatible.prototype.patch = function (key, value, opt) {
    return this._pitch.do(key + ' ', value, opt);
};
KFCompatible.instance = function () {
    if (!KFCompatible._compatible) {
        KFCompatible._compatible = new KFCompatible();
    }
    return KFCompatible._compatible;
};
KFCompatible.prototype.css = function (dom, key, css) {
    var me = this;
    key = this.parseCSS(key);
    return Compatible.css(dom, key, css, function (dom, key, css) {
        me.emit(Event.css, dom, key, css);
    });
};
// 只针对animation相关，简称转全称，并且加入兼容性前缀：name-->animationName-->webkitAnimationName
KFCompatible.prototype.parseCSS = function (key) {
    var p = this.prefix.replace(/-/g, '');
    if (p === 'moz') {
        KFCompatible.prototype.parseCSS = function (key) {
            if (key in KFCompatible._keyMap) {
                return KFCompatible._keyMap[key][0];
            }
            return key;
        };
    }
    else {
        KFCompatible.prototype.parseCSS = function (key) {
            if (key in KFCompatible._keyMap) {
                key = KFCompatible._keyMap[key][0];
                return p + key[0].toUpperCase() + key.substr(1);
            }
            return key;
        };
    }
    return this.parseCSS(key);
};
KFCompatible.prototype.parseEvent = Compatible.parseEvent('animation', 'Animation');

/**
 * @file 元数据到样式转换
 * @author tingkl(dingguoliang01@baidu.com)
 **/
/* global Checker KFCompatible Util Event EventEmitter*/
/* define Compiler */

/**
 * 编译类，根据metaData生成class或者keyframes
 *
 * @class
 * @extend EventEmitter
 */
function Compiler() {
    Compiler.superClass.call(this);
    // define时cache到map中，map存keyframeName + json
    // compile时清空map，cache到store中，store中存keyframeName + css
    this._classStore = {};
    this._classMap = {};
    this._keyframeMap = {};
    this._keyframeStore = {};
    var compatible = KFCompatible.instance();
    this._compatible = compatible;
    this._classId = function (className) {
        return 'class(' + className + ')';
    };
    this._keyframeId = function (keyframe) {
        return 'keyframe(' + keyframe + ')';
    };
    this._classText = function (className, body) {
        return '.' + className.replace(/\s+/g, ' .') + ' ' + body;
    };
    this._keyframeText = function (keyframe, body) {
        // @-webkit-keyframes xxx
        return compatible.keyframe(keyframe) + body;
    };
}
Util.inherit(Compiler, EventEmitter);

Compiler.prototype.defineClass = function (className, metaData) {
    className = className.trim();
    this._classMap[className] = metaData;
    return className;
};

Compiler.prototype.defineKeyframe = function (keyframe, metaData) {
    if (metaData !== null) {
        if (Checker.object.check(arguments)) {
            metaData = arguments[0];
            keyframe = Util.random.name(8);
        }
        this._keyframeMap[keyframe] = metaData;
    }
    return keyframe;
};

Compiler.prototype.compile = function () {
    var classes = {};
    var keyframes = {};
    Util.forIn(this._classMap, function (className, item) {
        classes[className] = this._compileClass(item);
    }, this);
    Util.forIn(this._keyframeMap, function (keyframe, item) {
        keyframes[keyframe] = this._compileKeyframe(item);
    }, this);
    this._classMap = {};
    this._keyframeMap = {};
    // classes cache className：cssTextBody
    // keyframes cache frameName： frameTextBody
    this._effect(classes, keyframes);
};

Compiler.prototype._absorb = function (obj, idG, textG, store, frag) {
    var id;
    var cssText;
    Util.forIn(obj, function (key, item) {
        // class & keyframe 的id
        id = idG(key);
        // 完整的cssText
        // className + {}  --> .className{}
        // frameName + {} --> @-webkit-keyframes frameName{}
        cssText = textG(key, item);
        if (key in store) {
            this._refreshSheet(cssText, id);
        }
        else {
            frag.appendChild(this._styleSheet(cssText, id));
        }
        store[key] = item;
    }, this);
    obj = null;
};

Compiler.prototype._effect = function (classes, keyframes) {
    var frag = this._fragment();
    this._absorb(classes, this._classId, this._classText, this._classStore, frag);
    this._absorb(keyframes, this._keyframeId, this._keyframeText, this._keyframeStore, frag);
    frag.effect();
};

Compiler.prototype._fragment = function () {
    var fragment = document.createDocumentFragment();
    fragment.effect = function () {
        document.querySelector('head').appendChild(fragment);
    };
    return fragment;
};

Compiler.prototype._styleSheet = function (cssText, id) {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.id = id;
    style.appendChild(document.createTextNode(cssText));
    this.emit(Event.style, id, cssText);
    return style;
};

Compiler.prototype.clear = function () {
    Util.forIn(this._classStore, function (className) {
        this._clearSheet(this._classId(className));
    }, this);
    Util.forIn(this._keyframeStore, function (frameName) {
        this._clearSheet(this._keyframeId(frameName));
    }, this);
    this._classStore = {};
    this._keyframeStore = {};
    this._classMap = {};
    this._keyframeMap = {};
};

Compiler.prototype._refreshSheet = function (cssText, id) {
    document.getElementById(id).innerHTML = cssText;
    this.emit(Event.style, id, cssText);
};

Compiler.prototype._clearSheet = function (id) {
    document.querySelector('head').removeChild(document.getElementById(id));
};

// 编译生成cssTextBody {}
Compiler.prototype._compileClass = function (metaData) {
    return '{' + this._compileContent(metaData) + '}';
};

Compiler.prototype._compileContent = function (metaData) {
    var opt = {};
    var content = [];
    Util.forIn(metaData, function (key, item) {
        content.push(this._compatible.patch(key, item, opt));
    }, this);
    Util.forIn(opt, function (key, item) {
        content.push(this._compatible.patchCombine(key, item));
    }, this);
    return content.join('');
};

// 编译生成keyframesTextBody {}
Compiler.prototype._compileKeyframe = function (metaData) {
    var body = '{';
    Util.forIn(metaData, function (percent, item) {
        body += this._compileFrame(percent, item);
    }, this);
    body += '}';
    return body;
};

Compiler.prototype._compileFrame = function (percent, metaData) {
    return this._compatible.percent(percent) + this._compileClass(metaData);
};

Compiler.instance = function () {
    if (!Compiler._compiler) {
        Compiler._compiler = new Compiler();
    }
    return Compiler._compiler;
};

/**
 * @file 组管理类
 * @author tingkl(dingguoliang01@baidu.com)
 **/
/* global Util Event EventEmitter Compiler*/
/* define Group */
function Group(frames) {
    Group.superClass.call(this);
    this._frames = frames;
}
Util.inherit(Group, EventEmitter);
Group.prototype.onEnd = function (fn, option) {
    this.on(Event.end, fn, option);
    return this;
};
Group.prototype.start = function () {
    var status = [];
    var me = this;
    function over(evt, st) {
        status.push(st);
        if (status.length === me._frames.length) {
            me.emit(Event.end, status);
        }
    }
    Util.each(this._frames, function (frame) {
        frame.start();
        frame.on(Event.over, over);
    });
    return this;
};
Group.prototype.clear = function (clearCSS) {
    Util.each(this._frames, function (frame) {
        frame.stop();
    });
    if (clearCSS) {
        Compiler.instance().clear();
    }
    return this;
};

/**
 * @file 样式代理
 * @author tingkl(dingguoliang01@baidu.com)
 **/
/* global Util Checker Compiler*/
/* define ClassProxy */

/**
 * 样式代理,提供简便调用
 *
 * @param {string} className 样式名
 * @param {Object} metaData  定义样式的json数据
 * @class
 */
function ClassProxy(className, metaData) {
    if (metaData) {
        this._define(className, metaData);
    }
    else {
        this._className = className;
    }
}
ClassProxy.prototype._define = function (className, metaData) {
    this._className = Compiler.instance().defineClass(className, metaData);
};
ClassProxy.prototype.hover = function (metaData) {
    return this._pseudo('hover', metaData);
};
ClassProxy.prototype.before = function (metaData) {
    return this._pseudo('before', metaData);
};
ClassProxy.prototype.after = function (metaData) {
    return this._pseudo('after', metaData);
};
ClassProxy.prototype.focus = function (metaData) {
    return this._pseudo('focus', metaData);
};
ClassProxy.prototype.selector = function (name, metaData) {
    Compiler.instance().defineClass(this._className + ' ' + name, metaData);
    return this;
};
ClassProxy.prototype.selectors = function (metaData) {
    Util.forIn(metaData, function (name, metaData) {
        this.selector(name, metaData);
    }, this);
    return this;
};
ClassProxy.prototype._name = function (pseudo) {
    return this._className + ':' + pseudo;
};
ClassProxy.prototype._pseudo = function (pseudo, metaData) {
    if (metaData) {
        Compiler.instance().defineClass(this._name(pseudo), metaData);
    }
    else {
        throw new Error('incorrect parameter, metaData is required!');
    }
    return this;
};
ClassProxy.prototype.rewrite = function (metaData, pseudo) {
    if (Checker.objectString.check(arguments)) {
        this._pseudo(pseudo, metaData);
    }
    else if (Checker.object.check(arguments)) {
        this._define(this._className, metaData);
    }
    else {
        throw new Error('incorrect parameter!');
    }
    return this;
};

/**
 * @file 动画帧代理
 * @author tingkl(dingguoliang01@baidu.com)
 **/
/* global Checker Util Compiler*/
/* define FrameProxy */
function FrameProxy(frame, metaData, clazz) {
    this._clazz = clazz;
    this._define(frame, metaData);
}
FrameProxy.prototype._define = function (frame, metaData) {
    this._frame = Compiler.instance().defineKeyframe(frame, metaData);
    return this;
};
FrameProxy.prototype.getName = function () {
    return this._frame;
};
FrameProxy.prototype.rewrite = function (metaData) {
    if (Checker.object.check(arguments)) {
        this._define(this._frame, metaData);
    }
    else {
        throw new Error('incorrect parameter!');
    }
    return this;
};
FrameProxy.prototype.setConfig = function (config) {
    config.name = this._frame;
    this._config = config;
    this._configs = [config];
    return this;
};
FrameProxy.prototype.getConfigs = function () {
    return this._configs;
};
// FrameProxy只针对一个keyframes
FrameProxy.prototype.keyframe = function (domFnIt) {
    var map = {'@': 'function', '#': 'count', '_': 'delay', '~': 'duration', '>': 'direction'};
    var option = {};
    var dom = domFnIt.replace(/([@#~>_])([^@#~>_]*)/g, function ($0, $1, $2) {
            option[$1] = $2;
            return '';
        }).trim();
    var attr;
    Util.forIn(option, function (key, item) {
        attr = map[key];
        if (!(attr in this._config)) {
            this._config[attr] = item;
        }
    }, this);
    if (dom[0] === '.') {
        dom = document.getElementsByClassName(dom.substr(1));
        this._keyframes = [];
        Util.each(dom, function(dom) {
            this._keyframes.push(new this._clazz(dom, this._configs));
        }, this);
    }
    else {
        dom = document.getElementById(dom);
        this._keyframes = [new this._clazz(dom, this._configs)];
    }
    return this._keyframes;
};
FrameProxy.prototype.combine = function (frameProxy) {
    var configs = frameProxy.getConfigs();
    if (configs) {
        this._configs = this._configs.concat(configs);
    }
    return this;
};

/**
 * @file 动画帧控制
 * @author tingkl(dingguoliang01@baidu.com)
 **/
/* global Checker Util Compiler Group ClassProxy FrameProxy Event EventEmitter Compatible KFCompatible*/
/* define Keyframe */

/**
 * css属性转cssText过滤器
 *
 * @param {Dom} dom  dom元素.
 * @param {(Object|Array)} animations 动画集合.
 * @param {Object=} cf 默认配置，只用于animations不为数组的情况.
 * @class
 */
function Keyframe(dom, animations, cf) {
    Keyframe.superClass.call(this);
    this._compiler = Compiler.instance();
    this._compatible = KFCompatible.instance();
    this._dom = dom;
    this._animationStatus = {};
    var me = this;
    animations = Util.extend(animations, cf);
    if (!animations) {
        this._animations = [];
    }
    else {
        if (!Checker.array.check([animations])) {
            this._animations = [animations];
            this._animationStatus[animations.name] = {ko: false, count: animations.count, record: 0};
        }
        else {
            Util.each(animations, function (animation) {
                me._animationStatus[animation.name] = {ko: false, count: animation.count, record: 0};
            });
            this._animations = animations;
        }
    }
    this._listen();
}
Util.inherit(Keyframe, EventEmitter);

Keyframe.prototype._listen = function () {
    var me = this;
    function wrap(eventName) {
        return function (evt) {
            me.emit(eventName, evt);
        };
    }
    // 只有在绑定start end iteration监听时才真正的在dom元素上监听
    this.on(Event.on, function (on, eventName) {
        if (eventName  === Event.start) {
            if (!me._monitorStart) {
                me._monitorStart = wrap(eventName);
                Util.on(me._dom, me._compatible.parseEvent(eventName), me._monitorStart);
            }
        }
        else if (eventName  === Event.end) {
            if (!me._monitorEnd) {
                me._monitorEnd = wrap(eventName);
                Util.on(me._dom, me._compatible.parseEvent(eventName), me._monitorEnd);
            }
        }
        else if (eventName  === Event.iteration) {
            if (!me._monitorIteration) {
                me._monitorIteration = wrap(eventName);
                Util.on(me._dom, me._compatible.parseEvent(eventName), me._monitorIteration);
            }
        }
    });
    this.on(Event.end, function (end, evt) {
        if (evt.animationName in me._animationStatus) {
            me._animationStatus[evt.animationName].ko = true;
            var isEnd = Util.forIn(me._animationStatus, function (key) {
                if (!me._animationStatus[key].ko) {
                    return false;
                }
            });
            if (isEnd) {
                // 所有keyframe都执行完了触发
                me.emit(Event.over, me._animationStatus);
            }
        }
    });
    this.on(Event.iteration, function (end, evt) {
        if (evt.animationName in me._animationStatus) {
            var tmp = me._animationStatus[evt.animationName];
            tmp.record++;
            if (tmp.count === 'infinite' && !tmp.ko) {
                tmp.ko = true;
                var isEnd = Util.forIn(me._animationStatus, function (key) {
                    if (!me._animationStatus[key].ko) {
                        return false;
                    }
                });
                if (isEnd) {
                    // 对于无限执行的keyframe执行完一次即可
                    me.emit(Event.over, me._animationStatus);
                }
            }
        }
    });
};
Keyframe.prototype.start = function () {
    var cpt = this._compatible;
    var css = cpt.parseAnimation(this._animations);
    var old = this._filter(this._animations);
    this.emit(Event.beforeStart);
    if (old !== '') {
        if (css.trim() !== '') {
            cpt.css(this._dom, 'animation', old + ', ' + css);
        }
        else {
            cpt.css(this._dom, 'animation', css);
        }
    }
    else {
        if (css.trim() !== '') {
            cpt.css(this._dom, 'animation', css);
        }
    }
    return this;
};
Keyframe.prototype.pause = function (optName) {
    this._playState('paused', optName);
    this.emit(Event.pause);
    return this;
};
Keyframe.prototype._filter = function (animations) {
    var animation = this._compatible.css(this._dom, 'animation');
    var $animation = [];
    if (animation) {
        animation = animation.split(',');
        var tmp = ['(?:none)'];
        Util.each(animations, function (animation) {
            tmp.push('(?:' + animation.name + ')');
        });
        var reg = this._compatible.regExp(tmp.join('|'));
        Util.each(animation, function (ceil) {
            if (!reg.test(ceil)) {
                $animation.push(ceil);
            }
        });
    }
    return $animation.join(',').trim();
};
Keyframe.prototype.reflow = function () {
    Compatible.reflow(this._dom);
    return this;
};
Keyframe.prototype.restart = function () {
    this.clear().reflow().start();
};
Keyframe.prototype.clear = function () {
    var cpt = this._compatible;
    cpt.css(this._dom, 'animation', this._filter(this._animations));
    Util.forIn(this._animationStatus, function (key) {
        this._animationStatus[key].ko = false;
        this._animationStatus[key].record = 0;
    }, this);
    return this;
};
Keyframe.prototype.stop = function () {
    this.clear();
    var cpt = this._compatible;
    if (this._monitorStart) {
        Util.off(this._dom, cpt.parseEvent(Event.start), this._monitorStart);
        this._monitorStart = false;
    }
    if (this._monitorEnd) {
        Util.off(this._dom, cpt.parseEvent(Event.end), this._monitorEnd);
        this._monitorEnd = false;
    }
    if (this._monitorIteration) {
        Util.off(this._dom, cpt.parseEvent(Event.iteration), this._monitorIteration);
        this._monitorIteration = false;
    }
    this.emit(Event.stop);
    return this;
};
Keyframe.prototype.goon = function (optName) {
    this._playState('running', optName);
    this.emit(Event.goon);
    return this;
};
Keyframe.prototype._c2A = function (key) {
    var css = Util.css(this._dom, this._compatible.parseCSS(key));
    return css.split(/,\s?/);
};
// 根据animationName 和 animationState 来过滤,避免破坏当前状态
Keyframe.prototype._playState = function (state, optName) {
    var namesAry = this._c2A('name');
    var statesAry = this._c2A('state');
    var index;
    if (optName) {
        index = Util.xInA(optName, namesAry);
        if (index > -1) {
            statesAry[index] = state;
        }
    }
    else {
        var aniName;
        Util.each(this._animations, function (animation) {
            aniName = animation.name;
            index = Util.xInA(aniName, namesAry);
            if (index > -1) {
                statesAry[index] = state;
            }
        });
    }
    this._compatible.css(this._dom, 'state', statesAry.join(', '));
    return this;
};
Keyframe.prototype.addClass = function (className) {
    Util.addClass(this._dom, className);
    return this;
};
Keyframe.prototype.removeClass = function (className) {
    Util.removeClass(this._dom, className);
    return this;
};
Keyframe.defineKeyframe = function (frame, metaData) {
    if (Checker.object.check(arguments)) {
        metaData = arguments[0];
        frame = Util.random.name(8);
        return new FrameProxy(frame, metaData, Keyframe);
    }
    else if (Checker.stringObject.check(arguments)) {
        return new FrameProxy(frame, metaData, Keyframe);
    }
    throw new Error('incorrect parameters!');
};
Keyframe.defineClass = function (className, metaData) {
    if (Checker.stringObject.check(arguments)) {
        return new ClassProxy(className, metaData);
    }
    else if (Checker.string.check(arguments)) {
        return new ClassProxy(className);
    }
    else if (Checker.object.check(arguments)) {
        return new ClassProxy(Util.random.name(8), className);
    }
    throw new Error('incorrect parameters!');
};
Keyframe.pack = function (clz) {
    Util.inherit(clz, Keyframe);
    var clazz = clz.cf.class;
    var frame = clz.cf.frame;
    Util.forIn(clazz, function (className, item) {
        Keyframe.defineClass(className, item);
    });
    Util.forIn(frame, function (frameName, item) {
        Keyframe.defineKeyframe(frameName, item);
    });
    clz.rewriteClass = function (part, config) {
        if (!clazz) {
            clazz = clz.cf.class = {};
        }
        if (part in clazz) {
            Util.rewrite(clazz[part], config);
        }
        else {
            clazz[part] = config;
        }
    };
    clz.rewriteFrame = function (part, config) {
        if (!frame) {
            frame = clz.cf.frame = {};
        }
        if (part in frame) {
            Util.rewrite(frame[part], config);
        }
        else {
            frame[part] = config;
        }
    };
};
Keyframe.compile = function () {
    Compiler.instance().compile();
};
Keyframe.group = function (group) {
    var frames = [];
    var frameProxy;
    if ('class' in group) {
        Util.forIn(group['class'], function (className, cssText) {
            Keyframe.defineClass(className, cssText);
        });
        delete group['class'];
    }
    Util.forIn(group, function (dom, item) {
        if (typeof item === 'string') {
            frameProxy = new FrameProxy(item, null, Keyframe);
            frameProxy.setConfig({});
        }
        else {
            frameProxy = Keyframe.timeLine(item);
        }
        frames = frames.concat(frameProxy.keyframe(dom));
    });
    Keyframe.compile();
    return new Group(frames);
};
Keyframe.timeLine = function (timeLine) {
    var times = [];
    var map = {};
    var adjust = {};
    var float;
    if ('_name' in timeLine) {
        var name = timeLine['_name'];
        delete timeLine['_name'];
    }
    Util.forIn(timeLine, function (time) {
        Util.each(time.split(/\s+/), function (data) {
            float = parseFloat(data);
            map[data] = float;
            times.push(float);
        });
    });
    times.sort(function(a,b){return a>b?1:-1});
    var min = times[0];
    var max = times[times.length - 1];
    var duration = parseFloat(max - min).toFixed(3);
    var percent;
    Util.forIn(map, function (time, item) {
        percent = ((item - min) * 100 / duration).toFixed(2);
        while (percent in adjust) {
            percent = percent + 0.01;
        }
        adjust[percent] = true;
        map[time] = String(percent).replace(/\.?0+$/, '');
    });
    var percentLine = {};
    Util.forIn(timeLine, function (time, item) {
        percent = [];
        Util.each(time.split(/\s+/), function (data) {
            percent.push(map[data]);
        });
        percentLine[percent.join(' ')] = item;
    });
    var frameProxy;
    if (name) {
        timeLine['_name'] = name;
        frameProxy = Keyframe.defineKeyframe(name, percentLine);
    }
    else {
        frameProxy = Keyframe.defineKeyframe(percentLine);
    }
    frameProxy.setConfig({duration: duration + 's', delay: min + 's'});
    return frameProxy;
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
