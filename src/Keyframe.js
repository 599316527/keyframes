/**
 * Created by dingguoliang01 on 2015/8/14.
 */
function Keyframe(dom, animations) {
    Keyframe.superClass.call(this);
    this._compiler = Compiler.instance();
    this._compatible = Compatible.instance();
    this._init(dom);
    if (!animations) {
        this._animations = [];
    }
    else {
        if (!Checker.array.check([animations])) {
            this._animations = [animations];
            this._animationStatus[animations['name']] = false;
        }
        else {
            var me = this;
            Util.each(animations, function (animation) {
                me._animationStatus[animation['name']] = false;
            });
            this._animations = animations;
        }
    }

    function wrap(eventName) {
        return function () {
            me.emit(eventName, arguments);
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
    var cpt = this._compatible;
    cpt.css(this._dom, 'animation', this._filter());
    /* jshint ignore:start */
    for (var key in this._animationStatus) {
        this._animationStatus[key] = false;
    }
    this.reflow();
    this.start();
};
Keyframe.prototype.stop = function () {
    var cpt = this._compatible;
    cpt.css(this._dom, 'animation', this._filter());
    /* jshint ignore:start */
    for (var key in this._animationStatus) {
        this._animationStatus[key] = false;
    }
    /* jshint ignore:end */
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
    }
    if (Checker.stringObject.check(arguments)) {
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
Keyframe.compile = function () {
    Compiler.instance().compile();
};