/**
 * @file Transform.js ~ 2015/08/13 11:47:13
 * @author tingkl(dingguoliang01@baidu.com)
 **/
/* global EventEmitter Util TFCompatible Event */
/* define Transform */
function Transform(dom, executeInTime) {
    Transform.superClass.call(this);
    this._dom = dom;
    this._executeInTime = executeInTime;
    this._steps = [];
    this._store = {};
    this._index = 0;
    this._compatible = TFCompatible.instance();
    this._listen();
    return this;
}
Util.inherit(Transform, EventEmitter);

/**
 * @private
 * 动画事件监听逻辑
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
                Util.on(me._dom, cpt.parseEvent(eventName), me._monitorEnd);
            }
        }
    });
    // transition仅仅有这一个事件
    this.on(Event.end, function (end, evt) {
        if (me._index < me._steps.length) {
            var step = me._steps[me._index];
            console.log(new Date().getSeconds());
            var propertyName = evt.propertyName.replace(cpt.prefix, '');
            if (propertyName in step.status) {
                step.status[propertyName] = true;
                var status = step.status;
                var isEnd = Util.forIn(status, function (key, value) {
                    if (!value) {
                        return false;
                    }
                });
                if (isEnd) {
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
        }
        Util.stopPropagation(evt);
    });
};

Transform.prototype._combineTransform = function (val, transform) {
    var current = Util.css(this._dom, transform);
    if (current && current !== 'none') {
        return current + ' ' + val.join(' ');
    }
    return val.join(' ');
};

Transform.prototype.setExecuteInTime = function (flag) {
    this._executeInTime = flag;
};
Transform.prototype.moveBy = function (config) {
    var apiMap = Transform._apiMap.moveBy;
    this._transform(config, apiMap);
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
Transform.prototype._step = function (transition, generator, status) {
    console.log(transition);
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
                Util.css(me._dom, cpt.parseCSS('transition'), transition);
                Util.css(me._dom, generator());
            };
            if (me._index === me._steps.length) {
                Util.css(me._dom, cpt.parseCSS('transition'), transition);
                Util.css(me._dom, generator());
            }
        }
        else {
            front.next = function () {
                Util.css(me._dom, cpt.parseCSS('transition'), transition);
                Util.css(me._dom, generator());
            };
            if (me._index === me._steps.length) {
                front.next();
            }
        }
    }
    else {
        step.execute = function () {
            Util.css(me._dom, cpt.parseCSS('transition'), transition);
            Util.css(me._dom, generator());
        };
        if (this._executeInTime) {
            step.execute();
        }
    }
    step.status = status;
    step.next = false;
    this._steps.push(step);
};
/* jshint ignore:start */
Transform.prototype.reStore = function () {
    Util.css(this._dom, this._store);
    var status;
    while (this._index > 0) {
        this._index--;
        status = this._steps[this._index].status;
        Util.forKey(status, function (key) {
            status[key] = false;
        });
    }
    return this;
};
/* jshint ignore:end */
Transform.prototype._reflow = function () {
    // -> triggering reflow /* The actual magic */
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
            firstStep.execute();
        }
    }
    return this;
};
Transform.prototype._transform = function (config, apiMap) {
    var me = this;
    var cpt = me._compatible;
    var $transform = cpt.cssMap('transform');
    var val = [];
    config = this._fillTransformParams(config, apiMap, val);
    var status = {};
    status.transform = false;
    config.property = $transform;
    this._step(cpt.parseTransition(config), function () {
        // 应当计算上一个动画结束时的transform，所以需要用回调
        var css = {};
        var transform = cpt.parseCSS('transform');
        css[transform] = me._combineTransform(val, transform);
        console.log(css);
        return css;
    }, status);
    return this;
};
Transform.prototype._fillTransformParams = function (config, apiMap, val) {
    var cpt = this._compatible;
    var transform = cpt.parseCSS('transform');
    var transition = cpt.parseCSS('transition');
    config = cpt.clone(config, apiMap);
    /* jshint ignore:start */
    var api = config.api;
    if (api) {
        Util.forIn(api, function (key, value) {
            val.push(key + '(' + value + ')');
        });
    }
    else {
        throw new Error('不健全的配置项！');
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
    var apiMap = Transform._apiMap.scaleBy;
    this._transform(config, apiMap);
    return this;
};
Transform._apiMap = {
    changeTo: {
        c: 'color',
        bc: 'backgroundColor',
        fs: 'fontSize',
        br: 'borderRadius',
        o: 'opacity',
        l: 'left',
        r: 'right',
        t: 'top',
        b: 'bottom',
        w: 'width',
        h: 'height'
    },
    moveTo: {
        't': 'top', 'l': 'left', 'b': 'bottom', 'r': 'right'
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
    },
    perspective: {
        p: 'perspective'
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
    var apiMap = Transform._apiMap.perspective;
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

Transform.prototype.mix = function (config) {
    var mould = this._compatible.peelMould(config);
    var part;
    var transition = [];
    var css = {};
    var status = {};
    var val = [];
    var transformCount = 0;
    Util.forIn(Transform._apiMap, function (key, $apiMap) {
        if (key in config) {
            part = config[key];
            if (key === 'moveTo' || key === 'changeTo') {
                if (!(part instanceof Array)) {
                    part = [part];
                }
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
        status.transform = false;
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
Transform.prototype.moveTo = function (configs) {
    var apiMap = Transform._apiMap.moveTo;
    this._css(configs, apiMap);
    return this;
};
Transform.prototype.changeTo = function (configs) {
    var apiMap = Transform._apiMap.changeTo;
    this._css(configs, apiMap);
    return this;
};
Transform.prototype._addStatus = function (status, key) {
    var keyT = this._compatible.cssMap(key);
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
    var keyT;
    var me = this;
    var $transition = me._compatible.parseCSS('transition');
    configs = me._compatible.clone(configs, apiMap);
    if (!(configs instanceof Array)) {
        configs = [configs];
    }
    Util.each(configs, function (config) {
        console.log(config.api);
        if (config.api) {
            Util.forIn(config.api, function (key, item) {
                keyT = this._addStatus(status, key);
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
 * off
 *
 * @param {string} name 动画事件名称
 * @param {Function} callback 事件回调函数
 * @return {Transform}
 */
Transform.prototype._off = function (name, callback) {
    Util.off(this._dom, name, callback);
    return this;
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
        Util.css(parentNode, cpt.parseCSS('transformStyle'), 'flat');
    }
    else {
        Util.css(parentNode, cpt.parseCSS('transformStyle'), 'preserve-3d');
        Util.css(parentNode, cpt.parseCSS('perspective'), perspective);
    }
    return this;
};
