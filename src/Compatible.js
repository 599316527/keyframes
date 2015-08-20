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
    pitch.use('special', 'background',
        function (key, value) {
            return key + ':' + value.replace(/linear-gradient/g, me.prefix + 'linear-gradient') + ';';
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