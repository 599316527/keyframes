/**
 * Created by dingguoliang01 on 2015/8/14.
 */
function Keyframe(dom, animations) {
    this._compiler = Compiler.instance();
    this._compatible = Compatible.instance();
    this._init(dom);
    if (!Checker.array.check(animations)) {
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

Keyframe.prototype._init = function (dom) {
    this._dom = dom;
    this._animationStatus = {};
};
Keyframe.prototype.start = function () {
    var css = this._compiler.parseAnimation(this._animations);
    this._compatible.addAnimation(this._dom, css);
    return this;
};
