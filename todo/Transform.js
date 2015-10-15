
function Transform(dom, executeInTime) {
    Transform.superClass.call(this);
    this._dom = dom;
    this._executeInTime = executeInTime;
    this._steps = [];
    this._store = {};
    this._index = 0;
    this._listen();
    return this;
};
Util.inherit(Transform, EventEmitter);
Transform.prototype._combineTransform = function (val, transform) {
    var current = Util.css(this._dom, transform);
    if (current && current !== 'none') {
        return current + ' ' + val.join(' ');
    }
    return val.join(' ');
};
Transform._keyMap = {
    'duration': 'transitionDuration',
    'function': 'transitionTimingFunction',
    'delay': 'transitionDelay'
};


Transform.prototype.setExecuteInTime = function (flag) {
    this._executeInTime = flag;
};
Transform.prototype.moveBy = function (config) {
    var apiMap = Transform._apiMap['moveBy'];
    this._transform(config, apiMap);
    return this;
};

Transform.prototype.then = function (callback) {
    var length = this._steps.length;
    if (length > 0) {
        var front = this._steps[length - 1];
        var next = front['next'];
        if (next) {
            front['next'] = function () {
                next();
                callback();
            };
        }
        else {
            front['next'] = callback;
        }
    }
    else {
        callback();
    }
    return this;
};
Transform.prototype._step = function (transition, generator, status) {
    var it = Transform;
    var me = this;
    var step = {};
    var length = me._steps.length;
    if (length > 0) {
        var front = me._steps[length - 1];
        var next = front['next'];
        if (next) {
            front['next'] = function () {
                next();
                Util.css(me._dom, it._theCore.css['transition'], transition);
                Util.css(me._dom, generator());
            };
            if (me._index === me._steps.length) {
                Util.css(me._dom, it._theCore.css['transition'], transition);
                Util.css(me._dom, generator());
            }
        }
        else {
            front['next'] = function () {
                Util.css(me._dom, it._theCore.css['transition'], transition);
                Util.css(me._dom, generator());
            };
            if (me._index === me._steps.length) {
                front['next']();
            }
        }
    }
    else {
        step['execute'] = function () {
            Util.css(me._dom, it._theCore.css['transition'], transition);
            Util.css(me._dom, generator());
        };
        if (this._executeInTime) {
            step['execute']();
        }
    }
    step['status'] = status;
    step['next'] = false;
    this._steps.push(step);
};
/* jshint ignore:start */
Transform.prototype.reStore = function () {
    Util.css(this._dom, this._store);
    var status;
    while (this._index > 0) {
        this._index--;
        status = this._steps[this._index].status;
        for (var key in status) {
            status[key] = false;
        }
    }
    return this;
};
/* jshint ignore:end */
Transform.prototype._reflow = function () {
    // -> triggering reflow /* The actual magic */
    // without this it wouldn't work. Try uncommenting the line and the transition won't be retriggered.
    this._dom.offsetWidth = this._dom.offsetWidth;
    return this;
};
Transform.prototype.reExecute = function () {
    this.reStore()._reflow();
    return this.execute();
};
Transform.prototype.execute = function () {
    if (this._index < this._steps.length) {
        var firstStep = this._steps[this._index];
        if ('execute' in firstStep) {
            firstStep['execute']();
        }
    }
    return this;
};
Transform.prototype._transform = function (config, apiMap) {
    var me = this;
    var it = Transform;
    var $transform = me._cssMap('transform');
    var val = [];
    config = this._fillTransformParams(config, apiMap, val);
    var status = {};
    status['transform'] = false;
    config.transitionProperty = $transform;
    this._step(it._parseTransition(config), function () {
        // 应当计算上一个动画结束时的transform，所以需要用回调
        var css = {};
        var transform = it._theCore.css['transform'];
        css[transform] = me._combineTransform(val, transform);
        return css;
    }, status);
    return this;
};
Transform._clone = function (obj, apiMap) {
    var me = Transform;
    var clone;
    if (obj instanceof Array) {
        clone = [];
        for (var i = 0; i < obj.length; i++) {
            clone.push(me._clone(obj[i], apiMap));
        }
    }
    else if (typeof obj === 'object') {
        clone = {};
        for (var key in obj) {
            if (key in me._keyMap) {
                clone[me._keyMap[key]] = me._clone(obj[key], apiMap);
            }
            else if (key in apiMap) {
                if (!('api' in clone)) {
                    clone['api'] = {};
                }
                clone['api'][apiMap[key]] = me._clone(obj[key], apiMap);
            }
        }
    }
    else {
        clone = obj;
    }
    return clone;
};
Transform.prototype._fillTransformParams = function (config, apiMap, val) {
    var it = Transform;
    var transform = it._theCore.css['transform'];
    var transition = it._theCore.css['transition'];
    config = it._clone(config, apiMap);
    /* jshint ignore:start */
    var api = config.api;
    if (api) {
        for (var key in api) {
            val.push(key + '(' + api[key] + ')');
        }
    }
    /* jshint ignore:end */
    if (!(transform in this._store)) {
        this._store[transform] = Util.css(this._dom, transform);
    }
    if (!(transition in this._store)) {
        this._store[transition] = Util.css(this._dom, transition);
    }
    return config;
};
Transform.prototype.scaleBy = function (config) {
    var apiMap = Transform._apiMap['scaleBy'];
    this._transform(config, apiMap);
    return this;
};
Transform.prototype._cssMap = function (propertyName) {
    var prefix = Transform['_prefix'];
    var tmp;
    switch (propertyName) {
        case 'transform':
            if (prefix === '-webkit-') {
                tmp =  prefix + propertyName;
            }
            else {
                tmp = propertyName;
            }
            break;
        case 'backgroundColor': tmp = 'background-color';break;
        case 'borderRadius': tmp = 'border-radius';break;
        case 'fontSize': tmp = 'font-size';break;
        case 'color':
        case 'top':
        case 'bottom':
        case 'left':
        case 'width':
        case 'height':
        case 'opacity':
        case 'right': tmp = propertyName;break;
        default: throw new Error(propertyName + ' not supported!');
    }
    return tmp;
};
Transform._apiMap = {
    'changeTo': {
        'c': 'color',
        'bc': 'backgroundColor',
        'fs': 'fontSize',
        'br': 'borderRadius',
        'o': 'opacity',
        'l': 'left',
        'r': 'right',
        't': 'top',
        'b': 'bottom',
        'w': 'width',
        'h': 'height'
    },
    'moveTo': {
        't': 'top', 'l': 'left', 'b': 'bottom', 'r': 'right'
    },
    'moveBy': {
        'x': 'translateX', 'y': 'translateY', 'z': 'translateZ', '2d': 'translate', '3d': 'translate3d'
    },
    'scaleBy': {
        'x': 'scaleX', 'y': 'scaleY', 'z': 'scaleZ', '2d': 'scale', '3d': 'scale3d'
    },
    'rotateBy': {
        'x': 'rotateX', 'y': 'rotateY', 'z': 'rotateZ', '3d': 'rotate3d', '2d': 'rotate'
    },
    'skewBy': {
        // skew没有3d
        'x': 'skewX', 'y': 'skewY', '2d': 'skew'
    },
    'perspective': {
        'p': 'perspective'
    }
};

Transform.prototype._css = function (configs, apiMap) {
    var transition = [];
    var css = {};
    var status = {};
    this._fillCSSParams(configs, apiMap, transition, css, status);
    this._step(transition.join(','), function () {
        return css;
    }, status);
    return this;
};
Transform.prototype.perspectiveTo = function (config) {
    var apiMap = Transform._apiMap['perspective'];
    this._transform(config, apiMap);
    return this;
};
Transform.prototype.skewBy = function (config) {
    var apiMap = Transform._apiMap['skewBy'];
    this._transform(config, apiMap);
    return this;
};
Transform.prototype.rotateBy = function (config) {
    var apiMap = Transform._apiMap['rotateBy'];
    this._transform(config, apiMap);
    return this;
};
Transform._extend = function (src, dest) {
    for (var key in dest) {
        if (!(key in src)) {
            src[key] = dest[key];
        }
    }
};
Transform.prototype.mix = function (config) {
    var it = Transform;
    var keyMap = it._keyMap;
    var mould = {};
    var part;
    for (var key in keyMap) {
        if (key in config) {
            mould[key] = config[key];
            config[keyMap[key]] = config[key];
        }
    }
    var transition = [];
    var css = {};
    var status = {};
    var apiMap = it._apiMap;
    var _apiMap;
    var val = [];
    var transformCount = 0;
    for (var key in apiMap) {
        if (key in config) {
            part = config[key];
            _apiMap = apiMap[key];
            if (key === 'moveTo' || key === 'changeTo') {
                if (!(part instanceof Array)) {
                    part = [part];
                }

                for (var i = 0, l = part.length; i < l; i++) {
                    it._extend(part[i], mould);
                }
                this._fillCSSParams(part, _apiMap, transition, css, status);
            }
            else {
                this._fillTransformParams(part, _apiMap, val);
                transformCount++;
            }
        }
    }

    var me;
    if (transformCount > 0) {
        me = this;
        var $transform = me._cssMap('transform');
        status['transform'] = false;
        config.transitionProperty = $transform;
        transition.push(it._parseTransition(config));
    }

    this._step(transition.join(','), function () {
        if (transformCount > 0) {
            var transform = it._theCore.css['transform'];
            css[transform] = me._combineTransform(val, transform);
        }
        return css;
    }, status);
    return this;
};
Transform.prototype.moveTo = function (configs) {
    var apiMap = Transform._apiMap['moveTo'];
    this._css(configs, apiMap);
    return this;
};
Transform.prototype.changeTo = function (configs) {
    var apiMap = Transform._apiMap['changeTo'];
    this._css(configs, apiMap);
    return this;
};
Transform.prototype._addStatus = function (status, key) {
    var keyT = this._cssMap(key);
    if (keyT === 'border-radius') {
        status['border-bottom-left-radius'] = false;
        status['border-top-left-radius'] = false;
        status['border-bottom-right-radius'] = false;
        status['border-top-right-radius'] = false;
    }
    else {
        status[keyT] = false;
    }
    return keyT;
};
/* jshint ignore:start */
Transform.prototype._fillCSSParams = function (configs, apiMap, transition, css, status) {
    var it = Transform;
    var config;
    var api;
    var keyT;
    var _transition = it._theCore.css['transition'];
    configs = it._clone(configs, apiMap);
    if (!(configs instanceof Array)) {
        configs = [configs];
    }
    for (var m = 0, n = configs.length; m < n; m++) {
        config = configs[m];
        api = config.api || {};
        for (var key in api) {
            keyT = this._addStatus(status, key);
            css[key] = api[key];
            if (!(key in this._store)) {
                this._store[key] = Util.css(this._dom, key);
            }
            if (!(_transition in this._store)) {
                this._store[_transition] = Util.css(this._dom, _transition);
            }
            config.transitionProperty = keyT;
            transition.push(it._parseTransition(config));
        }
    }
};
/* jshint ignore:end */
Transform._parseTransition = function (transition) {
    function regReplace($0, $1) {
        if ($1 in transition) {
            return transition[$1];
        }
        else {
            var value;
            switch ($1) {
                case 'transitionDuration':
                    value = '1s';
                    break;
                case 'transitionTimingFunction':
                    value = 'linear';
                    break;
                case 'transitionDelay':
                    value = '0s';
                    break;
            }
            return value;
        }
    }
    return Transform._transitionTpl.replace(/<(.*?)>/g, regReplace);
};
/**
 * 当前动画状态
 */
Transform._status = {
    'ED': 0,
    'ING': 1
};

/**
 * 当前浏览器内核的兼容映射
 */
Transform._theCore = null;
Transform._prefix = '';

/**
 * 判断当前浏览器内核
 */
Transform.getCore = function () {
    var me = Transform;
    if (!me._theCore) {
        me['_prefix'] = Compatible.instance().prefix;
        me._transitionTpl = '<transitionProperty> <transitionDuration> <transitionTimingFunction> <transitionDelay>';
        var p = me['_prefix'].replace(/-/g, '');
        me._theCore = {
            event: (function () {
                if (p === 'moz') {
                    return {
                        'transitionEnd': 'transitionend',
                        'transitionStart': 'transitionstart'
                    };
                }
                else {
                    return {
                        'transitionEnd': p + 'TransitionEnd',
                        'transitionStart': p + 'TransitionStart'
                    };
                }
            })(),
            css: (function () {
                var fixer;
                if (p === 'moz') {
                    fixer = function (key) {
                        return key;
                    };
                }
                else {
                    fixer = function (key) {
                        return p + key[0].toUpperCase() + key.substr(1);
                    };
                }
                return {
                    'transition': fixer('transition'),
                    'transform': fixer('transform'),
                    'perspective': fixer('perspective'),
                    'transformStyle': fixer('transformStyle'),
                    'transformOrigin': fixer('transformOrigin'),
                    'backfaceVisibility': fixer('backfaceVisibility')
                };
            })()
        };
    }
    return me._theCore;
};
Transform.getCore();


/**
 * @param {Object} css css配置的json对象
 */
/* jshint ignore:start */
Transform.prototype.compatible = function (css) {
    var core = Transform.getCore();
    var wrapCss = {};
    for (var key in css) {
        wrapCss[core.css[key]] = css[key];
    }
    return wrapCss;
};
/* jshint ignore:end */

/**
 * @param {string} name 动画事件名称
 * @param {Function} callback 事件回调函数
 */
Transform.prototype._on = function (name, callback) {
    Util.on(this._dom, name, callback);
    return this;
};

/**
 * @param {string} name 动画事件名称
 * @param {Function} callback 事件回调函数
 */
Transform.prototype._off = function (name, callback) {
    Util.off(this._dom, name, callback);
    return this;
};

Transform.prototype._unListen = function () {
    var me = this;
    var it = Transform;
    if (me._monitorStart) {
        this._off(it._theCore.event['transitionStart'], me._monitorStart);
    }
    if (me._monitorEnd) {
        this._off(it._theCore.event['transitionEnd'], me._monitorEnd);
    }
};
/**
 * @private
 * 动画事件监听逻辑
 */
Transform.prototype._listen = function () {
    var me = this;
    var it = Transform;
    if (!me._monitorStart) {
        me._monitorStart = function () {
            me._status = it._status.ING;
        };
        this._on(it._theCore.event['transitionStart'], me._monitorStart);
    }
    if (!me._monitorEnd) {
        me._monitorEnd = function (evt) {
            if (me._index < me._steps.length) {
                var step = me._steps[me._index];
                var propertyName = evt.propertyName.replace(Transform.prefix, '');
                if (propertyName in step.status) {
                    step.status[propertyName] = true;
                    var isEnd = true;
                    var status = step.status;
                    for (var key in status) {
                        if (!status[key]) {
                            isEnd = false;
                            break;
                        }
                    }
                    if (isEnd) {
                        me._status = it._status.ED;
                        me.emit(Event.end, step);
                        me._index++;
                        if (step['next']) {
                            step['next']();
                        }
                        else {
                            me.emit(Event.done, step);
                        }
                    }
                }
            }
            Util.stopPropagation(evt);
        };
        this._on(it._theCore.event['transitionEnd'], this._monitorEnd);
    }
};


Transform.prototype.perspective = function (perspective) {
    var it = Transform;
    var parentNode = this._dom.parentNode;
    if (perspective === false) {
        Util.css(parentNode, it._theCore.css['transformStyle'], 'flat');
    }
    else {
        Util.css(parentNode, it._theCore.css['transformStyle'], 'preserve-3d');
        Util.css(parentNode, it._theCore.css['perspective'], perspective);
    }
    return this;
};
