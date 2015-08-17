/**
 * Created by dingguoliang01 on 2015/8/17.
 */
/**
 * Created by dingguoliang01 on 2015/8/17.
 */
function FrameProxy(frame, metaData) {
    return this._define(frame, metaData);
}
FrameProxy.prototype._define = function (frame, metaData) {
    this._frame = Compiler.instance().defineKeyframe(frame, metaData);
    return this;
};
FrameProxy.prototype.rewrite = function (metaData) {
    if (Checker.object.check(arguments)) {
        this._define(this._frame, metaData);
    }
    else {
        throw new Error('incorrect parameter！');
    }
    return this;
};

