/**
 * @file util.js ~ 2015/08/13 11:47:13
 * @author tingkl(dingguoliang01@baidu.com)
 **/

var Util = {
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
    }
};

/**
 * @file checker.js ~ 2015/08/13 11:47:13
 * @author tingkl(dingguoliang01@baidu.com)
 **/

/* global Util */
function Checker() {
    this.list = Util.arg2Ary(arguments);
}

Checker.prototype.check = function (arg) {
    var me = this;
    if (arg.length !== me.list.length) {
        return false;
    }
    var match = Util.each(arg, function (item, i) {
        if (typeof item !== me.list[i]) {
            return false;
        }
    });
    return match;
};

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
function Pitch(keys, handler) {
    this._keys = keys + ' ';
    this._handler = handler;
}

Pitch.prototype.do = function (key, value, opt) {
    if (this._keys.trim() === '*') {
        return this._handler(key.trim(), value);
    }
    if (this._keys.indexOf(key) > -1) {
        return this._handler(key.trim(), value, opt);
    }
    if (this._next) {
        return this._next.do(key, value, opt);
    }
    return false;
};

Pitch.prototype.next = function (pitch) {
    this._next = pitch;
    return pitch;
};

/**
 * @file compatible.js ~ 2015/08/13 11:47:13
 * @author tingkl(dingguoliang01@baidu.com)
 **/

/* global Pitch*/
function Compatible() {
    var me = this;
    var prefixOnly = new Pitch('text-shadow transition transition-timing-function '
        + 'animation-timing-function transform-origin',
        function (key, value) {
            return me.prefix + key + ':' + value + ';';
        });
    var needAll = new Pitch('box-shadow border-radius',
        function (key, value) {
            return me.prefix + key + ':' + value + ';' + key + ':' + value + ';';
        });
    var extend = new Pitch('translateX translateY translateZ translate translate3d '
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
    var transform = new Pitch('transform',
        function (key, value, opt) {
            if ('transform' in opt) {
                opt['transform'] += ' ' + value;
            }
            else {
                opt['transform'] = value;
            }
            return '';
        });
    var special = new Pitch('background-gradient',
        function (key, value) {
            return '!!!';
        });
    var rest = new Pitch('*',
        function (key, value) {
            return key + ':' + value + ';';
        });
    var combine = new Pitch('transform',
        function (key, value) {
            return me.prefix + key + ':' + value + ';';
        });
    prefixOnly.next(needAll).next(special).next(extend).next(transform).next(rest);
    this._pitch = prefixOnly;
    this._combine = combine;
}

Compatible.prototype.prefix = (function () {
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

})();
Compatible.prototype.keyframe = function (keyframe) {
    return '@' + this.prefix + 'keyframes ' + keyframe;
};
Compatible.prototype.patchCombine = function (key, value) {
    return this._combine.do(key + ' ', value);
};
Compatible.prototype.patch = function (key, value, opt) {
    return this._pitch.do(key + ' ', value, opt);
};

/**
 * @file compiler.js ~ 2015/08/13 11:47:13
 * @author tingkl(dingguoliang01@baidu.com)
 **/

/* global Checker Compatible Util */
function Compiler() {
    this._stringObject = new Checker('string', 'object');
    this._object = new Checker('object');
    this._classStore = {};
    this._classMap = {};
    this._keyframeMap = {};
    this._keyframeStore = {};
    var compatible = new Compatible();
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

Compiler.prototype.defineClass = function (className, metaData) {
    if (this._object.check(arguments)) {
        metaData = arguments[0];
        className = Util.random.name(8);
    }
    else if (!this._stringObject.check(arguments)) {
        throw new Error('incorrect parameter, metaData is required！');
    }
    this._classMap[className] = metaData;
    return className;
};
Compiler.prototype.defineKeyframe = function (keyframe, metaData) {
    if (this._object.check(arguments)) {
        metaData = arguments[0];
        keyframe = Util.random.name(8);
    }
    else if (!this._stringObject.check(arguments)) {
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
            this._refreshStyleSheet(cssText, id);
        }
        else {
            frag.appendChild(this._styleSheet(cssText, id));
        }
        store[key] = obj[key];
        delete obj[key];
    }
};

Compiler.prototype._effect = function (classes, keyframes) {
    var frag = document.createDocumentFragment();
    this._absorb(classes, this._classId, this._classText, this._classStore, frag);
    this._absorb(keyframes, this._keyframeId, this._keyframeText, this._keyframeStore, frag);
    document.querySelector('head').appendChild(frag);
};

Compiler.prototype._styleSheet = function (cssText, id) {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.id = id;
    style.innerHTML = cssText;
    return style;
};
Compiler.prototype._refreshStyleSheet = function (cssText, id) {
    document.getElementById(id).innerHTML = cssText;
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
    return percent + '%' + this._compileClass(metaData);
};
