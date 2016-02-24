/**
 * @file transitionEnd事件兼容处理
 * @author tingkl(dingguoliang01@baidu.com)
 **/
/* global Util */
// 当前文件依赖加载: Util.js
/* define Status */

/**
 * transitionEnd事件兼容
 *
 * @class
 */
function Status() {
    this.init();
    this.size = 0;
    this.store = [];
}

// 分隔符
Status.sep = '|';

/**
 * 初始化
 */
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
    var sep = Status.sep;
    if (once) {
        this.once[all] = sep + once.join(sep + sep) + sep;
    }
    if (!isReset) {
        this.store.push({all: all, once: once});
        this.size++;
    }
};

/**
 * 重置所有添加的状态
 */
Status.prototype.reset = function () {
    this.init();
    Util.each(this.store, function (item) {
        this.add(item.all, item.once, true);
    }, this);
};

/**
 * 是否完成所有子事件
 *
 * @return {boolean} 是否完成了所有子事件
 */
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
    var sep = Status.sep;
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
