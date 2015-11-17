define(['EventEmitter', 'Util', 'Compatible', 'TFCompatible', 'Event'], function (EventEmitter, Util, Compatible, TFCompatible, Event) {
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
	        Util.forKey(status, function (key) {
	            status[key] = false;
	        });
	    }
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
	 * @param {Object} status 需要监听的属性变化对象，包括transform以及其他css属性
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
	    var status = {};
	    status.transform = false;
	    config.property = $transform;
	    this._step(cpt.parseTransition(config), function () {
	        // 应当计算上一个动画结束时的transform，所以需要用回调
	        var css = {};
	        var transform = cpt.parseCSS('transform');
	        css[transform] = me._combineTransform(val);
	        return css;
	    }, status);
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
	
	/**
	 * 只在非相关时才会调用，根据apiMap填充configs配置以及要进行的css变换
	 *
	 * @private
	 * @param {(Object|Array.<Object>)} configs 由于为非transform变换，所以不共享transform，可以有多个配置
	 * @param {Object} apiMap 所支持的相应变化
	 * @param {Array.<string>} transition css属性transition集合
	 * @param {Object} css css变换键值对
	 * @param {Object} status 状态监听对象
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
	    var status = {};
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
	    var status = {};
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
	            status.transform = false;
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
	    status.transform = false;
	    config.property = $transform;
	    css[transform] = 'old+; ' + val.join(' ');
	    return [cpt.parseTransition(config), css, status];
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
	return Transform;});