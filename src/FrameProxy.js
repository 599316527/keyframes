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
FrameProxy.prototype.getName = function() {
    return this._frame;
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
FrameProxy.prototype.setConfig = function (config) {
    config['name'] = this._frame;
    this._config = config;
    this._configs = [config];
    return this;
};
FrameProxy.prototype.getConfigs = function () {
    return this._configs;
};
//FrameProxy只针对一个keyframes
FrameProxy.prototype.keyframe = function (domFnIt) {
    var map = {'@': 'function', '#': 'count'};
    var option = {};
    var dom = domFnIt.replace(/([@#])([^@#]*)/g, function($0,$1,$2){
        option[$1] = $2;
        return '';});
    for (var key in option) {
        this._config[map[key]] = option[key];
    }
    this._keyframe = new Keyframe(document.getElementById(dom), this._configs);
    return this._keyframe;
};
FrameProxy.prototype.combine = function (frameProxy) {
    var configs = frameProxy.getConfigs();
    if (configs) {
        this._configs = this._configs.concat(configs);
    }
    return this;
};
