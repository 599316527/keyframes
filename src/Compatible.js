/**
 * @file compatible.js ~ 2015/08/13 11:47:13
 * @author tingkl(dingguoliang01@baidu.com)
 **/

/* global Pitch*/
function Compatible() {
    var pitch = new Pitch();
    /* jshint ignore:start */
    pitch.use('prefixOnly', 'text-shadow transition transition-timing-function '
        + 'animation-timing-function transform-origin',
        function (key, value) {
            return Compatible.prefix + key + ':' + value + ';';
        });
    /* jshint ignore:end */
    pitch.use('needAll', 'box-shadow border-radius',
        function (key, value) {
            return Compatible.prefix + key + ':' + value + ';' + key + ':' + value + ';';
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
            return Compatible.prefix + key + ':' + value + ';';
        });
}

Compatible.prefix = (function () {
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
    'duration': ['animationDuration', '0s'],
    'function': ['animationTimingFunction', 'linear'],
    'delay': ['animationDelay', '0s'],
    'count': ['animationIterationCount', 1],
    'direction': ['animationDirection', 'normal'],
    'state': ['animationPlayState', 'running'],
    'mode': ['animationFillMode', 'forwards']
};
Compatible.prototype.parseAnimation = function (animations) {
    if (!Checker.array.check(animations)) {
        animations = [animations];
    }
    var css;
    var csses = [];
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
        csses.push(this.animationTpl().replace(/<(.*?)>/g, regReplace));
    });
    return csses.join(',');
};
Compatible.prototype.animationTpl = function () {
    if (!this._animationTpl) {
        if (Compatible.prefix === '-moz-') {
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
    return '@' + Compatible.prefix + 'keyframes ' + keyframe;
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
Compatible.prototype.parseCSS = (function () {
    var fixer;
    var p = Compatible.prefix.replace(/-/g, '');
    if (p === 'moz') {
        fixer = function (key) {
            if (key in Compatible._keyMap) {
                return Compatible._keyMap[key];
            }
            else {
                return key;
            }
        };
    }
    else {
        fixer = function (key) {
            if (key in Compatible._keyMap) {
                key = Compatible._keyMap[key];
            }
            return p + key[0].toUpperCase() + key.substr(1);
        };
    }
    return fixer;
})();
Compatible.prototype.addAnimation = function (dom, css) {
    var key = this.parseCSS('animation');
    var current = this.css(dom, key);
    if (current && current !== '') {
        css = current + ',' + css;
    }
    this.css(dom, key, css);
};
Compatible.prototype.css = function (dom, key, value) {
    if (typeof window.getComputedStyle !== 'undefined')// W3C
    {
        Compatible.prototype.css = function (dom, key, value) {
            if (value !== undefined) {
                dom.style[key] = value;
                return value;
            }
            else {
                var tmp = window.getComputedStyle(dom, null)[key];
                if (tmp === '') throw new Error('去掉吧');
                return tmp === '' ? base.style[key] : tmp;
            }
        };
    }
    else if (typeof dom.currentStyle !== 'undefined') {
         Compatible.prototype.css = function (dom, key, value) {
            if (value !== undefined) {
                dom.style[key] = value;
                return value;
            }
            else {
                var tmp = dom.currentStyle[key];
                if (tmp === '') throw new Error('去掉吧');
                return tmp === '' ? dom.style[key] : tmp;
            }
        };
    }
    return this.css(dom, key, value);
};