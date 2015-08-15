/**
 * Created by dingguoliang01 on 2015/8/14.
 */
function Keyframe(dom, animations) {
    Keyframe.superClass.call(this);
    this._compiler = Compiler.instance();
    this._compatible = Compatible.instance();
    this._init(dom);
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
    return this;
}

Util.inherit(Keyframe, EventEmitter);
Keyframe.prototype._init = function (dom) {
    this._dom = dom;
    this._animationStatus = {};
};
Keyframe.prototype.start = function () {
    var css = this._compatible.parseAnimation(this._animations);
    this.emit(Event.start);
    this._compatible.addAnimation(this._dom, css);
    return this;
};
Keyframe.prototype.css = function (key, value) {
    return this._compatible.css(this._dom, key, value);
};
Keyframe.prototype.addClass = function (className) {
    this._compatible.addClass(this._dom, className);
    return this;
};
Keyframe.prototype.removeClass = function (className) {
    this._compatible.removeClass(this._dom, className);
    return this;
};

Keyframe.defineKeyframe = function (keyframe, metaData) {
    Compiler.instance().defineKeyframe(keyframe, metaData);
};
Keyframe.defineClass = function (className, metaData) {
    Compiler.instance().defineClass(className, metaData);
};
Keyframe.compile = function () {
    Compiler.instance().compile();
};