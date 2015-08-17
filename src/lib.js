/**
 * @file util.js ~ 2015/08/13 11:47:13
 * @author tingkl(dingguoliang01@baidu.com)
 **/

var Util = {
    inherit: function (Child, Parent) {
        /* jshint ignore:start */
        var Clz = new Function();
        Clz.prototype = Parent.prototype;
        Child.prototype = new Clz();
        Child.prototype.constructor = Child;
        Child.superClass = Parent;
        /* jshint ignore:end */
    },
    arg2Ary: function (arg) {
        return Array.prototype.slice.call(arg, 0);
    },
    each: function (ary, iterator) {
        for (var i = 0; i < ary.length; i++) {
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
    css: function (dom, key, value) {
        if (typeof window.getComputedStyle !== 'undefined')// W3C
        {
            Util.css = function (dom, key, value) {
                if (value !== undefined) {
                    dom.style[key] = value;
                    return value;
                }
                else {
                    var tmp = window.getComputedStyle(dom, null)[key];
                    return tmp === '' ? dom.style[key] : tmp;
                }
            };
        }
        else if (typeof dom.currentStyle !== 'undefined') {
            Util.css = function (dom, key, value) {
                if (value !== undefined) {
                    dom.style[key] = value;
                    return value;
                }
                else {
                    var tmp = dom.currentStyle[key];
                    return tmp === '' ? dom.style[key] : tmp;
                }
            };
        }
        return this.css(dom, key, value);
    }
};

function EventEmitter() {
    this._routes = {};
}

EventEmitter.event = {
    once: 'once',
    all: 'all'
};

EventEmitter.prototype.on = function(eventName, fn, option) {
    if (eventName in this._routes) {
        this._routes[eventName].push({fn:fn, option:option});
    } else {
        this._routes[eventName] = [{fn:fn, option:option}];
    }
};

EventEmitter.prototype.once = function(eventName, fn, option) {
    if (!option) {
        option = {};
    }
    option.type = EventEmitter.event.once;
    this.on(eventName, fn, option);
};

EventEmitter.prototype.callWithScope = function(fn, option, params) {
    params = params || [];
    if(option && ('scope' in option)) {
        /* jshint ignore:start */
        fn.apply(option['scope'], params);
        /* jshint ignore:end */
    }
    else
    {
        fn.apply(this, params);
    }
};

EventEmitter.prototype.all = function(dependency, fn, option) {
    var record = {},
        results = [],
        eventName,
        index,
        length = dependency.length;
    if (length === 0) {

        this.callWithScope(fn, option);
        return;
    }
    for (index = 0; index < length ; index++) {
        eventName = dependency[index];
        record[eventName] = false;
    }
    var that = this;
    var proxyCallback = function(index) {
        return  function(eventName, result) {
            if (eventName in record) {
                record[eventName] = true;
                results[index] = result;
            }
            var trigger = true;
            for (var item in record) {
                if (record[item] === false) {
                    trigger = false;
                    break;
                }
            }
            if (trigger) {
                that.callWithScope(fn, option, results);
            }
        };
    };
    for (index = 0; index < length ; index++) {
        eventName = dependency[index];
        this.on(eventName, proxyCallback(index), {type:EventEmitter.event.all});
    }
};

EventEmitter.prototype.emit = function(eventName) {
    var fns = this._routes[eventName],
        itemFn, scope, type, fn, option,
        offs = [], itemOff;
    if (fns) {
        for (var i = 0, l = fns.length; i < l; i++) {
            itemFn = fns[i];
            fn = itemFn.fn;
            option = itemFn.option;
            if (option) {
                scope = option.scope;
                type = option.type;
            } else {
                scope = false;
                type = false;
            }

            if (scope) {
                fn.apply(scope, Util.arg2Ary(arguments));
            } else {
                fn.apply(this, Util.arg2Ary(arguments));
            }

            if (!type) {
                continue;
            } else if (type === EventEmitter.event.once) {
                offs.push(itemFn);
            } else if (type === EventEmitter.event.all) {
                offs.push(itemFn);
            }
        }

        if (offs.length > 0) {
            var newFns = [];
            var fnsIndex = 0, offIndex = 0,
                sizeFns = fns.length,
                sizeOffs = offs.length;
            itemOff = offs[offIndex];
            while(fnsIndex < sizeFns) {
                itemFn = fns[fnsIndex];
                if (itemFn === itemOff) {
                    offIndex ++;
                    if (offIndex <sizeOffs) {
                        itemOff = offs[offIndex];
                    } else {
                        itemOff = -1;
                    }
                } else {
                    newFns.push(itemFn);
                }
                fnsIndex ++;
            }
            if(newFns.length === 0) {
                delete this._routes[eventName];
            } else {
                this._routes[eventName] = newFns;
            }
        }
    }
};
/**
 * Created by dingguoliang01 on 2015/8/13.
 */
var Event = {
    style: '0',
    beforeStart: '1',
    start: '',
    afterStart: '2',
    iteration: '',
    end: ''
};

/**
 * @file checker.js ~ 2015/08/13 11:47:13
 * @author tingkl(dingguoliang01@baidu.com)
 **/

/* global Util */
function Checker() {
    this._list = Util.arg2Ary(arguments);
}

Checker.prototype.check = function (arg) {
    var me = this;
    if (arg.length !== me._list.length) {
        return false;
    }
    var _type;
    var _typeof;
    var match = Util.each(arg, function (item, i) {
        _type = me._list[i];
        _typeof = typeof _type;
        if (_typeof === 'string') {
            if (typeof item !== _type) {
                return false;
            }
        }
        else if (_typeof === 'function') {
            if (!(item instanceof _type)) {
                return false;
            }
        }
    });
    return match;
};

Checker.stringObject = new Checker('string', 'object');
Checker.object = new Checker('object');
Checker.ssFunction = new Checker('string', 'string', 'function');
Checker.array = new Checker(Array);
/**
 * @file pitch.js ~ 2015/08/13 11:47:13
 * @author tingkl(dingguoliang01@baidu.com)
 **/

/**
 * 构造函数
 *
 * @param {string} keys 补丁属性集合.
 * @param {Function} handler 补丁函数.
 */
function Pitch(name, keys, handler) {
    this._router = [];
    if (Checker.ssFunction.check(arguments)) {
        this.use(name, keys, handler);
    }
}

Pitch.prototype.use = function (name, keys, handler) {
    this._router.push({name:name, keys: keys + ' ', handler: handler});
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
 * @file compatible.js ~ 2015/08/13 11:47:13
 * @author tingkl(dingguoliang01@baidu.com)
 **/

/* global Pitch*/
function Compatible() {
    var pitch = new Pitch();
    var me = this;
    /* jshint ignore:start */
    pitch.use('prefixOnly', 'text-shadow transition transition-timing-function '
        + 'animation-timing-function transform-origin',
        function (key, value) {
            return me.prefix + key + ':' + value + ';';
        });
    /* jshint ignore:end */
    pitch.use('needAll', 'box-shadow border-radius',
        function (key, value) {
            return me.prefix + key + ':' + value + ';' + key + ':' + value + ';';
        });
    /* jshint ignore:start */
    pitch.use('extend', 'translateX translateY translateZ translate translate3d '
        + 'rotateX rotateY rotateZ rotate rotate3d '
        + 'skewX skewY skewZ skew '
        + 'scaleZ scaleX scaleY scale3d scale '
        + 'perspective',
        function (key, value, opt) {
            if ('transform' in opt) {
                opt['transform'] += ' ' + key + '(' + value + ')';
            }
            else {
                opt['transform'] = key + '(' + value + ')';
            }
            return '';
        });

    pitch.use('transform', 'transform',
        function (key, value, opt) {
            if ('transform' in opt) {
                opt['transform'] += ' ' + value;
            }
            else {
                opt['transform'] = value;
            }
            return '';
        });
    pitch.use('animation', 'animation', function (key, value) {
        return me.prefix + key + ':' + me.parseAnimation(value) + ';';
    });
    /* jshint ignore:end */
    pitch.use('special', 'background-gradient',
        function (key, value) {
            return '!!!';
        });
    pitch.use('rest', '*',
        function (key, value) {
            return key + ':' + value + ';';
        });
    this._pitch = pitch;
    this._combine = new Pitch('combine', 'transform',
        function (key, value) {
            return me.prefix + key + ':' + value + ';';
        });
}

Compatible.prototype.prefix = (function () {
    var userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf('Opera') > -1; // 判断是否Opera
    var isMaxthon = userAgent.indexOf('Maxthon') > -1; // 判断是否傲游3.0
    /* jshint ignore:start */
    var isIE = (!isOpera && userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1)
        || (userAgent.indexOf('Trident') > -1); // 判断是否IE
    /* jshint ignore:end */
    var isFF = userAgent.indexOf('Firefox') > -1; // 判断是否Firefox
    var isSafari = userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') < 1; // 判断是否Safari
    var isChrome = userAgent.indexOf('Chrome') > -1; // 判断是否Chrome
    var isWebKit = userAgent.indexOf('WebKit') > -1;
    if (isIE) {
        return '-ms-';
    }
    return (isWebKit || isSafari || isChrome || isMaxthon) ?
        '-webkit-' : (isOpera ? '-o-' : (isFF ? '-moz-' : ''));
})();
Compatible._keyMap = {
    'name': 'animationName',
    'duration': ['animationDuration', '1s'],
    'function': ['animationTimingFunction', 'linear'],
    'delay': ['animationDelay', '0s'],
    'count': ['animationIterationCount', 1],
    'direction': ['animationDirection', 'normal'],
    'state': ['animationPlayState', 'running'],
    'mode': ['animationFillMode', 'forwards']
};
Compatible.prototype.parseAnimation = function (animations) {
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
        else {
            return Compatible._keyMap[$1][1];
        }
    }
    console.log(animations);
    Util.each(animations, function (animation) {
        css = animation;
        console.log(animation);
        csses.push(tpl.replace(/<(.*?)>/g, regReplace));
    });
    return csses.join(',');
};
Compatible.prototype.animationTpl = function () {
    if (!this._animationTpl) {
        if (this.prefix === '-moz-') {
            this._animationTpl = '<duration> <function> <delay> ' +
            '<direction> <mode> <count> <state> <name>';
            this._closeReg = {start: '\\s', end: '(?:\\s*)$'};
        }
        else {
            this._animationTpl = '<name> <duration> <function> <delay> ' +
            '<count> <direction> <mode>';
            this._closeReg = {start: '^(?:\\s*)', end: '\\s'};
        }
    }
    return this._animationTpl;
};
Compatible.prototype.keyframe = function (keyframe) {
    return '@' + this.prefix + 'keyframes ' + keyframe;
};
Compatible.prototype.percent = function (percent) {
    percent = (percent + '').trim();
    var percents = percent.split(/\s+/);
    return percents.join('%, ') + '%';
};
Compatible.prototype.patchCombine = function (key, value) {
    return this._combine.do(key + ' ', value);
};
Compatible.prototype.patch = function (key, value, opt) {
    return this._pitch.do(key + ' ', value, opt);
};
Compatible.instance = function () {
    if (!Compatible._compatible) {
        Compatible._compatible = new Compatible();
    }
    return Compatible._compatible;
};

Compatible.prototype.addAnimation = function (dom, css) {
    var key = this.parseCSS('animation');
    var current = Util.css(dom, key);
    if (current && current !== '') {
        css = current + ',' + css;
    }
    Util.css(dom, key, css);
};
Compatible.prototype.parseCSS = function (key) {
    var p = this.prefix.replace(/-/g, '');
    if (p === 'moz') {
        Compatible.prototype.parseCSS = function (key) {
            if (key in Compatible._keyMap) {
                return Compatible._keyMap[key];
            }
            else {
                return key;
            }
        };
    }
    else {
        Compatible.prototype.parseCSS = function (key) {
            if (key in Compatible._keyMap) {
                key = Compatible._keyMap[key];
            }
            return p + key[0].toUpperCase() + key.substr(1);
        };
    }
    return this.parseCSS(key);
};
/**
 * @file compiler.js ~ 2015/08/13 11:47:13
 * @author tingkl(dingguoliang01@baidu.com)
 **/

/* global Checker Compatible Util */
function Compiler() {
    Compiler.superClass.call(this);
    this._classStore = {};
    this._classMap = {};
    this._keyframeMap = {};
    this._keyframeStore = {};
    var compatible = Compatible.instance();
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
        return compatible.keyframe(keyframe) + body;
    };
}
Util.inherit(Compiler, EventEmitter);

Compiler.prototype.defineClass = function (className, metaData) {
    if (Checker.object.check(arguments)) {
        metaData = arguments[0];
        className = Util.random.name(8);
    }
    else if (!Checker.stringObject.check(arguments)) {
        throw new Error('incorrect parameter, metaData is required！');
    }
    this._classMap[className] = metaData;
    return className;
};
Compiler.prototype.defineKeyframe = function (keyframe, metaData) {
    if (Checker.object.check(arguments)) {
        metaData = arguments[0];
        keyframe = Util.random.name(8);
    }
    else if (!Checker.stringObject.check(arguments)) {
        throw new Error('incorrect parameter, metaData is required！');
    }
    this._keyframeMap[keyframe] = metaData;
    return keyframe;
};

Compiler.prototype.compile = function () {
    var classes = {};
    var keyframes = {};
    var metaData;
    for (var className in this._classMap) {
        metaData = this._classMap[className];
        classes[className] = this._compileClass(metaData);
        delete this._classMap[className];
    }
    for (var keyframe in this._keyframeMap) {
        metaData = this._keyframeMap[keyframe];
        keyframes[keyframe] = this._compileKeyframe(metaData);
        delete this._keyframeMap[keyframe];
    }
    this._effect(classes, keyframes);
};

Compiler.prototype._absorb = function (obj, idG, textG, store, frag) {
    var id;
    var cssText;
    for (var key in obj) {
        id = idG(key);
        cssText = textG(key, obj[key]);
        if (key in store) {
            this._refreshSheet(cssText, id);
        }
        else {
            frag.appendChild(this._styleSheet(cssText, id));
        }
        store[key] = obj[key];
        delete obj[key];
    }
};

Compiler.prototype._effect = function (classes, keyframes) {
    var frag = this._fragment();
    this._absorb(classes, this._classId, this._classText, this._classStore, frag);
    this._absorb(keyframes, this._keyframeId, this._keyframeText, this._keyframeStore, frag);
    frag.effect();
};
Compiler.prototype._fragment = function () {
    var fragment = document.createDocumentFragment();
    fragment.effect = function() {
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
Compiler.prototype._refreshSheet = function (cssText, id) {
    document.getElementById(id).innerHTML = cssText;
    this.emit(Event.style, id, cssText);
};
Compiler.prototype._compileClass = function (metaData) {
    var body = '{';
    var opt = {};
    var key;
    for (key in metaData) {
        body += this._compatible.patch(key, metaData[key], opt);
    }
    for (key in opt) {
        body += this._compatible.patchCombine(key, opt[key]);
    }
    body += '}';
    return body;
};
Compiler.prototype._compileKeyframe = function (metaData) {
    var body = '{';
    for (var percent in metaData) {
        body += this._compileFrame(percent, metaData[percent]);
    }
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
 * Created by dingguoliang01 on 2015/8/14.
 */
function Keyframe(dom, animations) {
    Keyframe.superClass.call(this);
    this._compiler = Compiler.instance();
    this._compatible = Compatible.instance();
    this._init(dom);
    if (!Checker.array.check([animations])) {
        this._animations = [animations];
        this._animationStatus[animations['name']] = false;
    }
    else {
        var me = this;
        Util.each(animations, function (animation) {
            me._animationStatus[animation['name']] = false;
        });
        this._animations = animations;
    }
    return this;
}

Util.inherit(Keyframe, EventEmitter);
Keyframe.prototype._init = function (dom) {
    this._dom = dom;
    this._animationStatus = {};
};
Keyframe.prototype.start = function () {
    var css = this._compatible.parseAnimation(this._animations);
    this.emit(Event.start);
    this._compatible.addAnimation(this._dom, css);
    return this;
};
Keyframe.prototype.css = function (key, value) {
    return Util.css(this._dom, key, value);
};
Keyframe.prototype.addClass = function (className) {
    Util.addClass(this._dom, className);
    return this;
};
Keyframe.prototype.removeClass = function (className) {
    Util.removeClass(this._dom, className);
    return this;
};

Keyframe.defineKeyframe = function (keyframe, metaData) {
    Compiler.instance().defineKeyframe(keyframe, metaData);
};
Keyframe.defineClass = function (className, metaData) {
    Compiler.instance().defineClass(className, metaData);
};
Keyframe.compile = function () {
    Compiler.instance().compile();
};