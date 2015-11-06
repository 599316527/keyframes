/**
 * @file classproxy.js ~ 2015/08/13 11:47:13
 * @author tingkl(dingguoliang01@baidu.com)
 **/

/* global Checker Compiler */

/**
 * 样式代理,提供简便调用
 *
 * @param {string} className 样式名
 * @param {Object} metaData  定义样式的json数据
 * @class
 */
function ClassProxy(className, metaData) {
    if (metaData) {
        this._define(className, metaData);
    }
    else {
        this._className = className;
    }
    return this;
}
ClassProxy.prototype._define = function (className, metaData) {
    this._className = Compiler.instance().defineClass(className, metaData);
};
ClassProxy.prototype.hover = function (metaData) {
    return this._pseudo('hover', metaData);
};
ClassProxy.prototype.before = function (metaData) {
    return this._pseudo('before', metaData);
};
ClassProxy.prototype.after = function (metaData) {
    return this._pseudo('after', metaData);
};
ClassProxy.prototype.focus = function (metaData) {
    return this._pseudo('focus', metaData);
};
ClassProxy.prototype._name = function (pseudo) {
    return this._className + ':' + pseudo;
};
ClassProxy.prototype._pseudo = function (pseudo, metaData) {
    if (metaData) {
        Compiler.instance().defineClass(this._name(pseudo), metaData);
    }
    else {
        throw new Error('incorrect parameter, metaData is required!');
    }
    return this;
};
ClassProxy.prototype.rewrite = function (metaData, pseudo) {
    if (Checker.objectString.check(arguments)) {
        this._pseudo(pseudo, metaData);
    }
    else if (Checker.object.check(arguments)) {
        this._define(this._className, metaData);
    }
    else {
        throw new Error('incorrect parameter!');
    }
    return this;
};
