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
            this._animationStatus[animations['name']] = {ko: false, count: animations['count'], record: 0};
        }
        else {
            var me = this;
            Util.each(animations, function (animation) {
                me._animationStatus[animation['name']] = {ko:false, count: animation['count'], record: 0};
            });
            this._animations = animations;
        }
    }

    function wrap(eventName) {
        return function (evt) {
            me.emit(eventName, evt);
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
    this.on(Event.end, function(end, evt) {
        if (evt.animationName in me._animationStatus) {
            me._animationStatus[evt.animationName].ko = true;
            var isEnd = true;
            for (var key in me._animationStatus) {
                if (!me._animationStatus[key].ko) {
                    isEnd = false;
                    break;
                }
            }
            if (isEnd) {
                me.emit(Event.over, me._animationStatus);
            }
        }
    });
    this.on(Event.iteration, function(end, evt) {
        if (evt.animationName in me._animationStatus) {
            var tmp = me._animationStatus[evt.animationName];
            tmp.record++;
            if (tmp.count === 'infinite' && !tmp.ko) {
                tmp.ko = true;
                var isEnd = true;
                for (var key in me._animationStatus) {
                    if (!me._animationStatus[key].ko) {
                        isEnd = false;
                        break;
                    }
                }
                if (isEnd) {
                    me.emit(Event.over, me._animationStatus);
                }
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
    this.clear().reflow().start();
};
Keyframe.prototype.clear = function () {
    var cpt = this._compatible;
    cpt.css(this._dom, 'animation', this._filter());
    /* jshint ignore:start */
    for (var key in this._animationStatus) {
        this._animationStatus[key].ko = false;
        this._animationStatus[key].record = 0;
    }
    /* jshint ignore:end */
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
        return new FrameProxy(frame, metaData);
    }
    else if (Checker.stringObject.check(arguments)) {
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
Keyframe.group = function(group) {
    var frames = [];
    var frameProxy;
    for (var dom in group) {
        frameProxy = Keyframe.timeLine(group[dom]);
        frames.push(frameProxy.keyframe(dom));
    }
    Keyframe.compile();
    return new Group(frames);
};
Keyframe.timeLine = function (timeLine) {
    var times = [];
    var map = {};
    var tmp;
    var time;
    var adjust = {};
    for (time in timeLine) {
        tmp = time.split(/\s+/);
        Util.each(tmp, function(data) {
            map[data] = parseFloat(data);
        });
    }
    for (time in map) {
        times.push(map[time]);
    }
    times.sort();
    var min = times[0];
    var max = times[times.length - 1];
    var duration = parseFloat(max - min).toFixed(3);
    var percent = -1;
    for (time in map) {
        percent = parseInt(Math.round((map[time] - min) * 100 / duration), 10);
        while (percent in adjust) {
            percent = percent + 1;
        }
        adjust[percent] = true;
        map[time] = percent;
    }
    var percentLine = {};

    for (time in timeLine) {
        tmp = time.split(/\s+/);
        percent = time;
        Util.each(tmp, function(data) {
            percent = percent.replace(data, map[data]);
        });
        percentLine[percent] = timeLine[time];
    }
    var frameProxy = Keyframe.defineKeyframe(percentLine);
    frameProxy.setConfig({'duration': duration + 's', 'delay': min + 's'});
    return frameProxy;
};

