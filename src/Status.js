/**
 * @file Transform.js ~ 2015/08/13 11:47:13
 * @author tingkl(dingguoliang01@baidu.com)
 **/
/* global Util */
/* define Status */

/**
 * 使用transitionEnd事件兼容
 *
 * @class
 */
function Status() {
    this.init();
    this.sep = '|';
    this.size = 0;
    this.store = [];
}
Status.prototype.init = function () {
    this.all = {};
    this.once = {};
    this.addUp = 0;
};

/**
 * 添加要监听的属性
 *
 * @param {string} all 属性名
 * @param {Array.<string>} once all可拆分的成的所有属性名
 * @param {?boolean} isReset 标识是否为reset调用
 */
Status.prototype.add = function (all, once, isReset) {
    this.all[all] = false;
    var sep = this.sep;
    if (once) {
        this.once[all] = sep + once.join(sep + sep) + sep;
    }
    if (!isReset) {
        this.store.push({all: all, once: once});
        this.size++;
    }
};
Status.prototype.reset = function () {
    this.init();
    Util.each(this.store, function (item) {
        this.add(item.all, item.once, true);
    }, this);
};
Status.prototype.isDone = function () {
    return this.size === this.addUp;
};

/**
 * 消化监听的属性
 *
 * @param {string} pName 属性名
 */
Status.prototype.digest = function (pName) {
    var all = this.all;
    var once = this.once;
    var sep = this.sep;
    if (pName in all) {
        all[pName] = true;
        delete once[pName];
        this.addUp++;
    }
    else {
        Util.forIn(once, function (key, val) {
            val = val.replace(sep + pName + sep, '');
            once[key] = val;
            if (val === '') {
                all[pName] = true;
                this.addUp++;
                delete  once[pName];
                return false;
            }
        }, this);
    }
};
