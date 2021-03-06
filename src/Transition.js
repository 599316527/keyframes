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
