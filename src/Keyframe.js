/**
 * Created by dingguoliang01 on 2015/8/14.
 */
function Keyframe(dom, animations) {
    Keyframe.superClass.call(this);
    this._compiler = Compiler.instance();
    this._compatible = Compatible.instance();
    this._init(dom);
    var me = this;
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
    function wrap(eventName) {
        return function () {
            me.emit(eventName, arguments);
        }
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
    var css = this._compatible.parseAnimation(this._animations);
    this.emit(Event.beforeStart);
    this._compatible.addAnimation(this._dom, css);
    return this;
};
Keyframe.prototype.css = function (key, value) {
    return Util.css(this._dom, key, value);
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