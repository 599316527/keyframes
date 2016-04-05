(function (root, factory) {
if (typeof define === 'function' && define.amd) {
    define(['Checker', 'Util', 'Compiler'], factory);
} else {
    root.FrameProxy = factory(root.Checker, root.Util, root.Compiler);
}
}(this, function (Checker, Util, Compiler) {
	function FrameProxy(frame, metaData, clazz) {
	    this._clazz = clazz;
	    this._define(frame, metaData);
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
	    var map = {'@': 'function', '#': 'count', '_': 'delay', '~': 'duration', '>': 'direction'};
	    var option = {};
	    var dom = domFnIt.replace(/([@#~>_])([^@#~>_]*)/g, function ($0, $1, $2) {
	            option[$1] = $2;
	            return '';
	        }).trim();
	    var attr;
	    Util.forIn(option, function (key, item) {
	        attr = map[key];
	        if (!(attr in this._config)) {
	            this._config[attr] = item;
	        }
	    }, this);
	    if (dom[0] === '.') {
	        dom = document.getElementsByClassName(dom.substr(1));
	        this._keyframes = [];
	        Util.each(dom, function(dom) {
	            this._keyframes.push(new this._clazz(dom, this._configs));
	        }, this);
	    }
	    else {
	        dom = document.getElementById(dom);
	        this._keyframes = [new this._clazz(dom, this._configs)];
	    }
	    return this._keyframes;
	};
	FrameProxy.prototype.combine = function (frameProxy) {
	    var configs = frameProxy.getConfigs();
	    if (configs) {
	        this._configs = this._configs.concat(configs);
	    }
	    return this;
	};
	return FrameProxy;}));