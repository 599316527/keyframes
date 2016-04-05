define(['Checker', 'Util', 'Compiler', 'Group', 'ClassProxy', 'FrameProxy', 'Event', 'EventEmitter', 'Compatible', 'KFCompatible'], function (Checker, Util, Compiler, Group, ClassProxy, FrameProxy, Event, EventEmitter, Compatible, KFCompatible) {
	/**
	 * css属性转cssText过滤器
	 *
	 * @param {Dom} dom  dom元素.
	 * @param {(Object|Array)} animations 动画集合.
	 * @param {Object=} cf 默认配置，只用于animations不为数组的情况.
	 * @class
	 */
	function Keyframe(dom, animations, cf) {
	    Keyframe.superClass.call(this);
	    this._compiler = Compiler.instance();
	    this._compatible = KFCompatible.instance();
	    this._dom = dom;
	    this._animationStatus = {};
	    var me = this;
	    animations = Util.extend(animations, cf);
	    if (!animations) {
	        this._animations = [];
	    }
	    else {
	        if (!Checker.array.check([animations])) {
	            this._animations = [animations];
	            this._animationStatus[animations.name] = {ko: false, count: animations.count, record: 0};
	        }
	        else {
	            Util.each(animations, function (animation) {
	                me._animationStatus[animation.name] = {ko: false, count: animation.count, record: 0};
	            });
	            this._animations = animations;
	        }
	    }
	    this._listen();
	}
	Util.inherit(Keyframe, EventEmitter);
	
	Keyframe.prototype._listen = function () {
	    var me = this;
	    function wrap(eventName) {
	        return function (evt) {
	            me.emit(eventName, evt);
	        };
	    }
	    // 只有在绑定start end iteration监听时才真正的在dom元素上监听
	    this.on(Event.on, function (on, eventName) {
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
	    this.on(Event.end, function (end, evt) {
	        if (evt.animationName in me._animationStatus) {
	            me._animationStatus[evt.animationName].ko = true;
	            var isEnd = Util.forIn(me._animationStatus, function (key) {
	                if (!me._animationStatus[key].ko) {
	                    return false;
	                }
	            });
	            if (isEnd) {
	                // 所有keyframe都执行完了触发
	                me.emit(Event.over, me._animationStatus);
	            }
	        }
	    });
	    this.on(Event.iteration, function (end, evt) {
	        if (evt.animationName in me._animationStatus) {
	            var tmp = me._animationStatus[evt.animationName];
	            tmp.record++;
	            if (tmp.count === 'infinite' && !tmp.ko) {
	                tmp.ko = true;
	                var isEnd = Util.forIn(me._animationStatus, function (key) {
	                    if (!me._animationStatus[key].ko) {
	                        return false;
	                    }
	                });
	                if (isEnd) {
	                    // 对于无限执行的keyframe执行完一次即可
	                    me.emit(Event.over, me._animationStatus);
	                }
	            }
	        }
	    });
	};
	Keyframe.prototype.start = function () {
	    var cpt = this._compatible;
	    var css = cpt.parseAnimation(this._animations);
	    var old = this._filter(this._animations);
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
	Keyframe.prototype.pause = function (optName) {
	    this._playState('paused', optName);
	    this.emit(Event.pause);
	    return this;
	};
	Keyframe.prototype._filter = function (animations) {
	    var animation = this._compatible.css(this._dom, 'animation');
	    var $animation = [];
	    if (animation) {
	        animation = animation.split(',');
	        var tmp = ['(?:none)'];
	        Util.each(animations, function (animation) {
	            tmp.push('(?:' + animation.name + ')');
	        });
	        var reg = this._compatible.regExp(tmp.join('|'));
	        Util.each(animation, function (ceil) {
	            if (!reg.test(ceil)) {
	                $animation.push(ceil);
	            }
	        });
	    }
	    return $animation.join(',').trim();
	};
	Keyframe.prototype.reflow = function () {
	    Compatible.reflow(this._dom);
	    return this;
	};
	Keyframe.prototype.restart = function () {
	    this.clear().reflow().start();
	};
	Keyframe.prototype.clear = function () {
	    var cpt = this._compatible;
	    cpt.css(this._dom, 'animation', this._filter(this._animations));
	    Util.forIn(this._animationStatus, function (key) {
	        this._animationStatus[key].ko = false;
	        this._animationStatus[key].record = 0;
	    }, this);
	    return this;
	};
	Keyframe.prototype.stop = function () {
	    this.clear();
	    var cpt = this._compatible;
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
	Keyframe.prototype.goon = function (optName) {
	    this._playState('running', optName);
	    this.emit(Event.goon);
	    return this;
	};
	Keyframe.prototype._c2A = function (key) {
	    var css = Util.css(this._dom, this._compatible.parseCSS(key));
	    return css.split(/,\s?/);
	};
	// 根据animationName 和 animationState 来过滤,避免破坏当前状态
	Keyframe.prototype._playState = function (state, optName) {
	    var namesAry = this._c2A('name');
	    var statesAry = this._c2A('state');
	    var index;
	    if (optName) {
	        index = Util.xInA(optName, namesAry);
	        if (index > -1) {
	            statesAry[index] = state;
	        }
	    }
	    else {
	        var aniName;
	        Util.each(this._animations, function (animation) {
	            aniName = animation.name;
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
	        return new FrameProxy(frame, metaData, Keyframe);
	    }
	    else if (Checker.stringObject.check(arguments)) {
	        return new FrameProxy(frame, metaData, Keyframe);
	    }
	    throw new Error('incorrect parameters!');
	};
	Keyframe.defineClass = function (className, metaData) {
	    if (Checker.stringObject.check(arguments)) {
	        return new ClassProxy(className, metaData);
	    }
	    else if (Checker.string.check(arguments)) {
	        return new ClassProxy(className);
	    }
	    else if (Checker.object.check(arguments)) {
	        return new ClassProxy(Util.random.name(8), className);
	    }
	    throw new Error('incorrect parameters!');
	};
	Keyframe.pack = function (clz) {
	    Util.inherit(clz, Keyframe);
	    var clazz = clz.cf.class;
	    var frame = clz.cf.frame;
	    Util.forIn(clazz, function (className, item) {
	        Keyframe.defineClass(className, item);
	    });
	    Util.forIn(frame, function (frameName, item) {
	        Keyframe.defineKeyframe(frameName, item);
	    });
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
	Keyframe.group = function (group) {
	    var frames = [];
	    var frameProxy;
	    if ('class' in group) {
	        Util.forIn(group['class'], function (className, cssText) {
	            Keyframe.defineClass(className, cssText);
	        });
	        delete group['class'];
	    }
	    Util.forIn(group, function (dom, item) {
	        if (typeof item === 'string') {
	            frameProxy = new FrameProxy(item, null, Keyframe);
	            frameProxy.setConfig({});
	        }
	        else {
	            frameProxy = Keyframe.timeLine(item);
	        }
	        frames = frames.concat(frameProxy.keyframe(dom));
	    });
	    Keyframe.compile();
	    return new Group(frames);
	};
	Keyframe.timeLine = function (timeLine) {
	    var times = [];
	    var map = {};
	    var adjust = {};
	    var float;
	    if ('_name' in timeLine) {
	        var name = timeLine['_name'];
	        delete timeLine['_name'];
	    }
	    Util.forIn(timeLine, function (time) {
	        Util.each(time.split(/\s+/), function (data) {
	            float = parseFloat(data);
	            map[data] = float;
	            times.push(float);
	        });
	    });
	    times.sort(function(a,b){return a>b?1:-1});
	    var min = times[0];
	    var max = times[times.length - 1];
	    var duration = parseFloat(max - min).toFixed(3);
	    var percent;
	    Util.forIn(map, function (time, item) {
	        percent = ((item - min) * 100 / duration).toFixed(2);
	        while (percent in adjust) {
	            percent = percent + 0.01;
	        }
	        adjust[percent] = true;
	        map[time] = String(percent).replace(/\.?0+$/, '');
	    });
	    var percentLine = {};
	    Util.forIn(timeLine, function (time, item) {
	        percent = [];
	        Util.each(time.split(/\s+/), function (data) {
	            percent.push(map[data]);
	        });
	        percentLine[percent.join(' ')] = item;
	    });
	    var frameProxy;
	    if (name) {
	        timeLine['_name'] = name;
	        frameProxy = Keyframe.defineKeyframe(name, percentLine);
	    }
	    else {
	        frameProxy = Keyframe.defineKeyframe(percentLine);
	    }
	    frameProxy.setConfig({duration: duration + 's', delay: min + 's'});
	    return frameProxy;
	};
	return Keyframe;});