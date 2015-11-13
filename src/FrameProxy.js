/**
 * @file frameproxy.js ~ 2015/08/13 11:47:13
 * @author tingkl(dingguoliang01@baidu.com)
 **/
/* global Checker Util Compiler*/
/* define FrameProxy */
function FrameProxy(frame, metaData, clazz) {
    this._clazz = clazz;
    return this._define(frame, metaData);
}
FrameProxy.prototype._define = function (frame, metaData) {
    this._frame = Compiler.instance().defineKeyframe(frame, metaData);
    return this;
};
FrameProxy.prototype.getName = function () {
    return this._frame;
};
FrameProxy.prototype.rewrite = function (metaData) {
    if (Checker.object.check(arguments)) {
        this._define(this._frame, metaData);
    }
    else {
        throw new Error('incorrect parameter!');
    }
    return this;
};
FrameProxy.prototype.setConfig = function (config) {
    config.name = this._frame;
    this._config = config;
    this._configs = [config];
    return this;
};
FrameProxy.prototype.getConfigs = function () {
    return this._configs;
};
// FrameProxy只针对一个keyframes
FrameProxy.prototype.keyframe = function (domFnIt) {
    var map = {'@': 'function', '#': 'count'};
    var option = {};
    var dom = domFnIt.replace(/([@#])([^@#]*)/g, function ($0, $1, $2) {
            option[$1] = $2;
            return '';
        });
    Util.forIn(option, function (key, item) {
        this._config[map[key]] = item;
    }, this);
    this._keyframe = new this._clazz(document.getElementById(dom), this._configs);
    return this._keyframe;
};
FrameProxy.prototype.combine = function (frameProxy) {
    var configs = frameProxy.getConfigs();
    if (configs) {
        this._configs = this._configs.concat(configs);
    }
    return this;
};
