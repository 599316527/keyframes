/**
 * @file Util.js ~ 2015/08/13 11:47:13
 * @author tingkl(dingguoliang01@baidu.com)
 **/
/* define Util */
/**
 * @namespace
 */
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
    forKey: function (obj, handler, scope) {
        for (var key in obj) {
            if (handler.call(scope, key) === false) {
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

/**
 * @file Checker.js ~ 2015/08/13 11:47:13
 * @author tingkl(dingguoliang01@baidu.com)
 **/
/* global Util */
/* define Checker */

/**
 * 参数类型匹配
 *
 * @class
 */
function Checker() {
    this._list = Util.arg2Ary(arguments);
}
Checker.prototype.check = function (arg) {
    var me = this;
    if (arg.length !== me._list.length) {
        return false;
    }
    var type;
    var typeOf;
    var match = Util.each(arg, function (item, i) {
        type = me._list[i];
        typeOf = typeof type;
        if (typeOf === 'string') {
            if (typeof item !== type) {
                return false;
            }
        }
        else if (typeOf === 'function') {
            if (!(item instanceof type)) {
                return false;
            }
        }
    });
    return match;
};
Checker.stringObject = new Checker('string', 'object');
Checker.objectString = new Checker('object', 'string');
Checker.object = new Checker('object');
Checker.string = new Checker('string');
Checker.ssFunction = new Checker('string', 'string', 'function');
Checker.sFunction = new Checker('string', 'function');
Checker.array = new Checker(Array);

/**
 * @file Pitch.js ~ 2015/08/13 11:47:13
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
 * @file Event.js ~ 2015/08/13 11:47:13
 * @author tingkl(dingguoliang01@baidu.com)
 **/
/* define Event */
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
 * @file Eventemitter.js ~ 2015/08/13 11:47:13
 * @author tingkl(dingguoliang01@baidu.com)
 **/
/* eslint-disable brace-style */
/* global Checker Event Util*/
/* define EventEmitter */
function EventEmitter() {
    this._triggers = {};
}
EventEmitter.type = {
    once: 'once',
    all: 'all'
};
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
EventEmitter.prototype.once = function (eventName, fn, option) {
    if (!option) {
        option = {};
    }
    option.type = EventEmitter.type.once;
    this.emit(Event.once, eventName, option);
    this.on(eventName, fn, option);
};
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
    });
    this.emit(Event.all, dependency, option);
};
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
 * @file Compatible.js ~ 2015/08/13 11:47:13
 * @author tingkl(dingguoliang01@baidu.com)
 **/
/* global Util Event */
/* define Compatible */
/**
 * @namespace
 */
var Compatible = {
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
    requestAnimationFrame: (function () {
        var timer;
        var queue = [];
        window.requestAnimationFrame = window.requestAnimationFrame
        || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame
        || function (callback) {
            queue.push(callback);
            if (!timer) {
                timer = window.setTimeout(function () {
                    Util.each(queue, function (cb) {
                        cb();
                    });
                    clearTimeout(timer);
                    timer = false;
                    queue = [];
                }, 1000 / 60);
            }
        };
        return function (fn) {
            // 原生requestAnimationFrame执行的scope必须为window
            window.requestAnimationFrame(fn);
        };
    })(),
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
    // -> triggering reflow /* The actual magic */
    reflow: function (dom) {
        Compatible.requestAnimationFrame(function () {
            dom.offsetWidth = dom.offsetWidth;
        });
    },
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
 * @file KFCompatible.js ~ 2015/08/13 11:47:13
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
    pitch.use('specialA', 'background',
        function (key, value) {
            return key + ':' + value.replace(/linear-gradient/g, me.prefix + 'linear-gradient') + ';';
        });
    pitch.use('specialB', 'mask-image',
        function (key, value) {
            return me.prefix + key + ':' + value.replace(/linear-gradient/g, me.prefix + 'linear-gradient') + ';';
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
    key = this.parseCSS(key);
    return Compatible.css(dom, key, css, this);
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
 * @file Compiler.js ~ 2015/08/13 11:47:13
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
        return '.' + className + ' ' + body;
    };
    this._keyframeText = function (keyframe, body) {
        // @-webkit-keyframes xxx
        return compatible.keyframe(keyframe) + body;
    };
}
Util.inherit(Compiler, EventEmitter);
Compiler.prototype.defineClass = function (className, metaData) {
    this._classMap[className] = metaData;
    return className;
};
Compiler.prototype.defineKeyframe = function (keyframe, metaData) {
    this._keyframeMap[keyframe] = metaData;
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
    style.innerHTML = cssText;
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
 * @file group.js ~ 2015/08/13 11:47:13
 * @author tingkl(dingguoliang01@baidu.com)
 **/
/* global Util Event EventEmitter*/
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
Group.prototype.clear = function () {
    Util.each(this._frames, function (frame) {
        frame.stop();
    });
    return this;
};

/**
 * @file Classproxy.js ~ 2015/08/13 11:47:13
 * @author tingkl(dingguoliang01@baidu.com)
 **/
/* global Checker Compiler */
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
 * @file frameproxy.js ~ 2015/08/13 11:47:13
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
    var map = {'@': 'function', '#': 'count'};
    var option = {};
    var dom = domFnIt.replace(/([@#])([^@#]*)/g, function ($0, $1, $2) {
            option[$1] = $2;
            return '';
        });
    Util.forIn(option, function (key, item) {
        this._config[map[key]] = item;
    }, this);
    this._keyframe = new this._clazz(document.getElementById(dom), this._configs);
    return this._keyframe;
};
FrameProxy.prototype.combine = function (frameProxy) {
    var configs = frameProxy.getConfigs();
    if (configs) {
        this._configs = this._configs.concat(configs);
    }
    return this;
};

/**
 * @file keyframe.js ~ 2015/08/13 11:47:13
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
    var old = this._filter();
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
Keyframe.prototype._filter = function () {
    var animation = this._compatible.css(this._dom, 'animation');
    var $animation = [];
    if (animation) {
        animation = animation.split(',');
        var tmp = ['(?:none)'];
        Util.each(this._animations, function (animation) {
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
    cpt.css(this._dom, 'animation', this._filter());
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
    if (Checker.object.check(arguments)) {
        metaData = arguments[0];
        className = Util.random.name(8);
    }
    if (Checker.stringObject.check(arguments)) {
        return new ClassProxy(className, metaData);
    }
    else if (Checker.string.check(arguments)) {
        return new ClassProxy(className);
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
    Util.forIn(group, function (dom, item) {
        frameProxy = Keyframe.timeLine(item);
        frames.push(frameProxy.keyframe(dom));
    });
    Keyframe.compile();
    return new Group(frames);
};
Keyframe.timeLine = function (timeLine) {
    var times = [];
    var map = {};
    var adjust = {};
    Util.forIn(timeLine, function (time) {
        Util.each(time.split(/\s+/), function (data) {
            map[data] = parseFloat(data);
        });
    });
    Util.forIn(map, function (time, item) {
        times.push(item);
    });
    times.sort();
    var min = times[0];
    var max = times[times.length - 1];
    var duration = parseFloat(max - min).toFixed(3);
    var percent = -1;
    Util.forIn(map, function (time, item) {
        percent = parseInt(Math.round((item - min) * 100 / duration), 10);
        while (percent in adjust) {
            percent = percent + 1;
        }
        adjust[percent] = true;
        map[time] = percent;
    });
    var percentLine = {};
    Util.forIn(timeLine, function (time, item) {
        percent = time;
        Util.each(time.split(/\s+/), function (data) {
            percent = percent.replace(data, map[data]);
        });
        percentLine[percent] = item;
    });
    var frameProxy = Keyframe.defineKeyframe(percentLine);
    frameProxy.setConfig({duration: duration + 's', delay: min + 's'});
    return frameProxy;
};

/**
 * @file TFCompatible.js ~ 2015/08/13 11:47:13
 * @author tingkl(dingguoliang01@baidu.com)
 **/
/* global Util Event EventEmitter Compatible*/
/* define TFCompatible */

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

/**
 * @file Transform.js ~ 2015/08/13 11:47:13
 * @author tingkl(dingguoliang01@baidu.com)
 **/
/* global Util */
/* define Status */

/**
 * 使用transitionEnd事件兼容
 *
 * @class
 */
function Status() {
    this.init();
    this.size = 0;
    this.store = [];
}
Status.sep = '|';
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
Status.prototype.reset = function () {
    this.init();
    Util.each(this.store, function (item) {
        this.add(item.all, item.once, true);
    }, this);
};
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
                delete  once[pName];
                return false;
            }
        }, this);
    }
};

/**
 * @file Transform.js ~ 2015/08/13 11:47:13
 * @author tingkl(dingguoliang01@baidu.com)
 **/
/* eslint-disable no-loop-func */
/* global EventEmitter Util Compatible TFCompatible Event Status */
/* define Transform */

/**
 * 使用transform + transition进行变换
 *
 * @param {Node} dom 进行动画变换的元素
 * @param {boolean} executeInTime 是否为即使变换
 * @class
 * @extends EventEmitter
 */
function Transform(dom, executeInTime) {
    Transform.superClass.call(this);
    this._dom = dom;
    this._executeInTime = executeInTime;
    this._steps = [];
    this._store = {};
    this._index = 0;
    this._transformRecord = '';
    this._compatible = TFCompatible.instance();
    this._listen();
}
Util.inherit(Transform, EventEmitter);

/**
 * 动画事件监听逻辑
 *
 * @private
 */
Transform.prototype._listen = function () {
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
                me._monitorEnd = wrap(eventName);
                me._on(cpt.parseEvent(eventName), me._monitorEnd);
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
 * @return {Transform} 对象本身
 */
Transform.prototype.setExecuteInTime = function (flag) {
    this._executeInTime = flag;
    return this;
};
Transform.prototype.reStore = function () {
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
Transform.prototype.reflow = function () {
    Compatible.reflow(this._dom);
    return this;
};
Transform.prototype.reExecute = function () {
    this.reStore().reflow();
    return this.execute();
};

/**
 * 当executeInTime为false，即非即刻执行模式下，调用此函数触发变换
 *
 * @return {Transform} 对象本身
 */
Transform.prototype.execute = function () {
    if (this._index < this._steps.length) {
        var firstStep = this._steps[this._index];
        if ('execute' in firstStep) {
            firstStep.execute();
        }
    }
    return this;
};
Transform._apiMap = {
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
/* Transform.prototype.perspectiveTo = function (config) {
    var apiMap = Transform._apiMap.perspective;
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
Transform.prototype._step = function (transition, generator, status) {
    var me = this;
    var cpt = me._compatible;
    var step = {};
    var length = me._steps.length;
    if (length > 0) {
        var front = me._steps[length - 1];
        var next = front.next;
        if (next) {
            front.next = function () {
                next();
                Compatible.css(me._dom, cpt.parseCSS('transition'), transition, me);
                Compatible.css(me._dom, generator(), '', me);
            };
            if (me._index === me._steps.length) {
                Compatible.css(me._dom, cpt.parseCSS('transition'), transition, me);
                Compatible.css(me._dom, generator(), '', me);
            }
        }
        else {
            front.next = function () {
                Compatible.css(me._dom, cpt.parseCSS('transition'), transition, me);
                Compatible.css(me._dom, generator(), '', me);
            };
            if (me._index === me._steps.length) {
                front.next();
            }
        }
    }
    else {
        step.execute = function () {
            Compatible.css(me._dom, cpt.parseCSS('transition'), transition, me);
            Compatible.css(me._dom, generator(), '', me);
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
Transform.prototype._combineTransform = function (val) {
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
Transform.prototype._fillTransformParams = function (config, apiMap, val) {
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
Transform.prototype._transform = function (config, apiMap) {
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
Transform.prototype._fillCSSParams = function (configs, apiMap, transition, css, status) {
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
Transform.prototype._css = function (configs, apiMap) {
    var transition = [];
    var css = {};
    var status = new Status();
    this._fillCSSParams(configs, apiMap, transition, css, status);
    this._step(transition.join(','), function () {
        return css;
    }, status);
};
Transform.prototype.moveTo = function (configs) {
    var apiMap = Transform._apiMap.moveTo;
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
Transform.prototype._patchMoveTo = function (configs, apiMap) {
    if (!(configs instanceof Array)) {
        configs = [configs];
    }
    var dom = this._dom;
    var val;
    var atr;
    var patch = {};
    Util.each(configs, function (config) {
        Util.forKey(config, function (key) {
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
Transform.prototype.changeTo = function (configs) {
    var apiMap = Transform._apiMap.changeTo;
    configs = this._patchMoveTo(configs, Transform._apiMap.moveTo);
    this._css(configs, apiMap);
    return this;
};
Transform.prototype.moveBy = function (config) {
    var apiMap = Transform._apiMap.moveBy;
    this._transform(config, apiMap);
    return this;
};
Transform.prototype.scaleBy = function (config) {
    var apiMap = Transform._apiMap.scaleBy;
    this._transform(config, apiMap);
    return this;
};
Transform.prototype.skewBy = function (config) {
    var apiMap = Transform._apiMap.skewBy;
    this._transform(config, apiMap);
    return this;
};

Transform.prototype.rotateBy = function (config) {
    var apiMap = Transform._apiMap.rotateBy;
    this._transform(config, apiMap);
    return this;
};
Transform.prototype.mock = function (method, config) {
    var apiMap = Transform._apiMap[method];
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
        Util.forIn(Transform._apiMap, function (key, $apiMap) {
            if (key in config) {
                part = config[key];
                if (key === 'moveTo' || key === 'changeTo') {
                    part = this._patchMoveTo(part, Transform._apiMap.moveTo);
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
Transform.prototype.mix = function (config) {
    var mould = this._compatible.peelMould(config);
    var part;
    var transition = [];
    var css = {};
    var status = new Status();
    var val = [];
    var transformCount = 0;
    Util.forIn(Transform._apiMap, function (key, $apiMap) {
        if (key in config) {
            part = config[key];
            if (key === 'moveTo' || key === 'changeTo') {
                part = this._patchMoveTo(part, Transform._apiMap.moveTo);
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
Transform.prototype.then = function (callback) {
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
Transform.prototype._on = function (name, callback) {
    Util.on(this._dom, name, callback);
};

/**
 * 注销事件监听函数
 *
 * @private
 * @param {string} name 动画事件名称
 * @param {Function} callback 事件回调函数
 */
Transform.prototype._off = function (name, callback) {
    Util.off(this._dom, name, callback);
};
Transform.prototype._unListen = function () {
    if (this._monitorStart) {
        this._off(this._compatible.parseEvent(Event.start), this._monitorStart);
    }
    if (this._monitorEnd) {
        this._off(this._compatible.parseEvent(Event.end), this._monitorEnd);
    }
};
Transform.prototype.perspective = function (perspective) {
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
