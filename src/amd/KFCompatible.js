define(['Pitch', 'Util', 'Checker', 'Event', 'EventEmitter', 'Compatible'], function (Pitch, Util, Checker, Event, EventEmitter, Compatible) {
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
	return KFCompatible;});