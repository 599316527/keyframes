/**
 * @file util.js ~ 2015/08/13 11:47:13
 * @author tingkl(dingguoliang01@baidu.com)
 **/

var Util = {
    rewrite: function (init, replace) {
        if(!replace) {
            return init;
        }
        for (var key in replace) {
            init[key] = replace[key];
        }
        return init;
    },
    define: function (namespace) {
        namespace = namespace.split('.');
        var domain;
        var module = window;
        while (domain = namespace.shift()) {
            if (!(domain in module)) {
                module[domain] = {};
            }
            module = module[domain];
        }
    },
    extend: function (src, init) {
        if(!src) {
            return init;
        }
        if (init) {
            for (var key in init) {
                if (!(key in src)) {
                    src[key] = init[key];
                }
            }
        }
        return src;
    },
    inherit: function (Child, Parent) {
        /* jshint ignore:start */
        var Clz = new Function();
        Clz.prototype = Parent.prototype;
        Child.prototype = new Clz();
        Child.prototype.constructor = Child;
        Child.superClass = Parent;
        /* jshint ignore:end */
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
                    return !tmp ? dom.style[key] : tmp;
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
                    return !tmp ? dom.style[key] : tmp;
                }
            };
        }
        return this.css(dom, key, value);
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

function EventEmitter() {
    this._routes = {};
}

EventEmitter.type = {
    once: 'once',
    all: 'all'
};

EventEmitter.prototype.on = function(eventName, fn, option) {
    if (eventName) {
        if (eventName in this._routes) {
            this._routes[eventName].push({fn:fn, option:option});
        } else {
            this._routes[eventName] = [{fn:fn, option:option}];
        }
        this.emit(Event.on, eventName, option);
    }
    else {
        throw new Error('undefined event！');
    }
};
EventEmitter.prototype.off = function(eventName, fn) {
    if (Checker.string.check(arguments)) {
        if (eventName in this._routes) {
            this._routes[eventName] = [];
            this.emit(Event.off, eventName);
        }
    }
    else if (Checker.sFunction.check(arguments)) {
        if (eventName in this._routes) {
            var index = -1;
            Util.each(this._routes[eventName], function (item, i) {
                if (item.fn === fn) {
                    index = i;
                    return false;
                }
            });
            if (index > -1) {
                this._routes[eventName].splice(index, 1);
                this.emit(Event.off, eventName);
            }
        }
    }
    else {
        throw new Error('incorrect parameter!');
    }
};
EventEmitter.prototype.once = function(eventName, fn, option) {
    if (!option) {
        option = {};
    }
    option.type = EventEmitter.type.once;
    this.emit(Event.once, eventName, option);
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
        results = [];
    if (dependency.length === 0) {
        this.callWithScope(fn, option);
        return;
    }
    var me = this;
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
                me.callWithScope(fn, option, results);
            }
        };
    };
    Util.each(dependency, function (eventName, i) {
        record[eventName] = false;
        this.on(eventName, proxyCallback(i), {type:EventEmitter.type.all});
    });
    this.emit(Event.all, dependency, option);
};

EventEmitter.prototype.emit = function(eventName) {
    var fns = this._routes[eventName],
        itemFn, scope, type, fn, option,
        offs = [], itemOff;
    var args = arguments;
    if (fns) {
        var me = this;
        Util.each(fns, function(itemFn) {
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
                fn.apply(scope, Util.arg2Ary(args));
            } else {
                fn.apply(me, Util.arg2Ary(args));
            }

            if (type) {
                //type === EventEmitter.type.once or type === EventEmitter.type.all
                offs.push(itemFn);
            }
        });
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
    style: 'Style',
    beforeStart: 'BeforeStart',
    pause: 'Pause',
    start: 'Start',
    iteration: 'Iteration',
    end: 'End',
    on: 'On',
    off: 'Off',
    stop: 'stop',
    goon: 'goon',
    once: 'Once',
    all: 'All',
    emit: 'Emit'
};

function Promise() {
    Promise.superClass.call(this);
}
Promise.event = {
    success: 'success',
    error: 'error',
    progress: 'progress'
};
Util.inherit(Promise, EventEmitter);
Promise.prototype.then = function (fulfilledHandler, errorHandler, progressHandler) {
    if (fulfilledHandler) {
        this.on(Promise.event.success, fulfilledHandler);
    }
    if (errorHandler) {
        this.on(Promise.event.error, errorHandler);
    }
    if (progressHandler) {
        this.on(Promise.event.progress, progressHandler);
    }
    return this;
};
function Deferred() {
    this.state = Deferred.state.unfulfilled;
    this.promise = new Promise();
}
Deferred.state = {
    unfulfilled: 'unfulfilled',
    fulfilled: 'fulfilled',
    failed: 'failed'
};
Deferred.prototype.resolve = function() {
    //console.log("resolve", arguments);
    this.state = Deferred.state.fulfilled;
    var args =  Util.arg2Ary(arguments);
    args.splice(0, 0, Promise.event.success);
    this.promise.emit.apply(this.promise, args);
};
Deferred.prototype.reject = function() {
    this.state = Deferred.state.failed;
    var args =  Util.arg2Ary(arguments);
    args.splice(0, 0, Promise.event.error);
    this.promise.emit.apply(this.promise, args);
};
Deferred.prototype.progress = function() {
    var args =  Util.arg2Ary(arguments);
    args.splice(0, 0, Promise.event.progress);
    this.promise.emit.apply(this.promise, args);
};
Deferred.prototype.all = function(promises) {
    var count = promises.length;
    var that = this;
    var results = [];
    Util.each(promises,function(promise, index) {
        promise.then(function(data) {
            count --;
            results[index] = data;
            if (count === 0) {
                that.resolve(results);
            }
        }, function(err) {
            that.reject(err);
        });
    });
    return this.promise;
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
Checker.objectString = new Checker('object', 'string');
Checker.object = new Checker('object');
Checker.string = new Checker('string');
Checker.ssFunction = new Checker('string', 'string', 'function');
Checker.sFunction = new Checker('string', 'function');
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
    Util.each(animations, function (animation) {
        css = animation;
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
Compatible.prototype.regExp = function (middle) {
    return new RegExp(this._closeReg.start + middle + this._closeReg.end);
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
Compatible.prototype.css = function (dom, key, css) {
    key = this.parseCSS(key);
    if (css || css === '') {
        this.requestAnimationFrame(function() {
            Util.css(dom, key, css);
        });
    }
    else {
        return Util.css(dom, key);
    }
};

//简称转全称,并且加入兼容性前缀  name --> animationName --> webkitAnimationName
Compatible.prototype.parseCSS = function (key) {
    var p = this.prefix.replace(/-/g, '');
    if (p === 'moz') {
        Compatible.prototype.parseCSS = function (key) {
            if (key in Compatible._keyMap) {
                return Compatible._keyMap[key][0];
            }
            else {
                return key;
            }
        };
    }
    else {
        Compatible.prototype.parseCSS = function (key) {
            if (key in Compatible._keyMap) {
                key = Compatible._keyMap[key][0];
                return p + key[0].toUpperCase() + key.substr(1);
            }
            return key;
        };
    }
    return this.parseCSS(key);
};
Compatible.prototype.parseEvent = function (key) {
    var p = this.prefix.replace(/-/g, '');
    if (p === 'moz') {
        Compatible.prototype.parseEvent = function (key) {
            return 'animation' + key.toLowerCase();
        };
    }
    else {
        Compatible.prototype.parseEvent = function (key) {
            return p + 'Animation' + key;
        };
    }
    return this.parseEvent(key);
};
Compatible.prototype.requestAnimationFrame = (function () {
    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
                window.setTimeout(callback, 1000 / 60);
            };
    })();
    return function (fn) {
        window.requestAnimationFrame(fn);
    };
})();
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
 * Created by dingguoliang01 on 2015/8/17.
 */
function ClassProxy(className, metaData) {
    if (metaData) {
        this._define(className, metaData);
    }
    else {
        this._className = className;
    }
    return this;
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
        throw new Error('incorrect parameter, metaData is required！');
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
        throw new Error('incorrect parameter！');
    }
    return this;
};

/**
 * Created by dingguoliang01 on 2015/8/17.
 */
/**
 * Created by dingguoliang01 on 2015/8/17.
 */
function FrameProxy(frame, metaData) {
    return this._define(frame, metaData);
}
FrameProxy.prototype._define = function (frame, metaData) {
    this._frame = Compiler.instance().defineKeyframe(frame, metaData);
    return this;
};
FrameProxy.prototype.rewrite = function (metaData) {
    if (Checker.object.check(arguments)) {
        this._define(this._frame, metaData);
    }
    else {
        throw new Error('incorrect parameter！');
    }
    return this;
};


/**
 * Created by dingguoliang01 on 2015/8/14.
 */
function Keyframe(dom, animations, cf) {
    Keyframe.superClass.call(this);
    this._compiler = Compiler.instance();
    this._compatible = Compatible.instance();
    this._init(dom);
    animations = Util.extend(animations, cf);
    if (!animations) {
        this._animations = [];
    }
    else {
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
    }

    function wrap(eventName) {
        return function () {
            me.emit(eventName, arguments);
        };
    }
    this.on(Event.on, function(on, eventName) {
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
    return this;
}

Util.inherit(Keyframe, EventEmitter);
Keyframe.prototype._init = function (dom) {
    this._dom = dom;
    this._animationStatus = {};
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
Keyframe.prototype.pause = function (opt_name) {
    this._playState('paused', opt_name);
    this.emit(Event.pause);
    return this;
};
Keyframe.prototype._filter = function () {
    var animation = this._compatible.css(this._dom, 'animation');
    var _animation = [];
    if (animation) {
        animation = animation.split(',');
        var tmp = ['(?:none)'];
        Util.each(this._animations, function (animation) {
            tmp.push('(?:' + animation['name'] + ')');
        });
        var reg = this._compatible.regExp(tmp.join('|'));
        Util.each(animation, function (ceil) {
            if (!reg.test(ceil)) {
                _animation.push(ceil);
            }
        });
    }
    return _animation.join(',').trim();
};
Keyframe.prototype.reflow = function () {
    // -> triggering reflow /* The actual magic */
    // without this it wouldn't work. Try uncommenting the line and the transition won't be retriggered.
    var dom = this._dom;
    this._compatible.requestAnimationFrame(function() {
        dom.offsetWidth = dom.offsetWidth;
    });
    return this;
};
Keyframe.prototype.restart = function () {
    var cpt = this._compatible;
    cpt.css(this._dom, 'animation', this._filter());
    /* jshint ignore:start */
    for (var key in this._animationStatus) {
        this._animationStatus[key] = false;
    }
    this.reflow();
    this.start();
};
Keyframe.prototype.stop = function () {
    var cpt = this._compatible;
    cpt.css(this._dom, 'animation', this._filter());
    /* jshint ignore:start */
    for (var key in this._animationStatus) {
        this._animationStatus[key] = false;
    }
    /* jshint ignore:end */
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
Keyframe.prototype.goon = function (opt_name) {
    this._playState('running', opt_name);
    this.emit(Event.goon);
    return this;
};
Keyframe.prototype._c2A = function (key) {
    var css = Util.css(this._dom, this._compatible.parseCSS(key));
    return css.split(/,\s?/);
};
// 根据animationName 和 animationState 来过滤,避免破坏当前状态
Keyframe.prototype._playState = function (state, opt_name) {
    var namesAry = this._c2A('name');
    var statesAry = this._c2A('state');
    var index;
    if (opt_name) {
        index = Util.xInA(opt_name, namesAry);
        if (index > -1) {
            statesAry[index] = state;
        }
    }
    else {
        var aniName;
        Util.each(this._animations, function (animation) {
            aniName = animation['name'];
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
    }
    if (Checker.stringObject.check(arguments)) {
        return new FrameProxy(frame, metaData);
    }
    else {
        throw new Error('incorrect parameters!');
    }
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
    else {
        throw new Error('incorrect parameters!');
    }
};
Keyframe.pack = function (clz) {
    Util.inherit(clz, Keyframe);
    var clazz = clz.cf.class;
    var frame = clz.cf.frame;
    for (var className in clazz) {
        Keyframe.defineClass(className, clazz[className]);
    }
    for (var frameName in frame) {
        Keyframe.defineKeyframe(frameName, frame[frameName]);
    }
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