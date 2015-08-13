/**
 * @file pitch.js ~ 2015/08/13 11:47:13
 * @author tingkl(dingguoliang01@baidu.com)
 **/

/**
 * 构造函数
 *
 * @param {string} keys 补丁属性集合.
 * @param {Function} handler 补丁函数.
 */
function Pitch(name, keys, handler) {
    this._router = [];
    if (new Checker('string', 'string', 'function').check(arguments)) {
        this.use(name, keys, handler);
    }
}

Pitch.prototype.use = function (name, keys, handler) {
    this._router.push({name:name, keys: keys + ' ', handler: handler});
    return this;
};
Pitch.prototype.next = function (index, key, value, opt) {
    var middleware = this._router[index];
    if (middleware) {
        if (middleware.keys.trim() === '*') {
            return middleware.handler(key.trim(), value, opt);
        }
        if (middleware.keys.indexOf(key) > -1) {
            return middleware.handler(key.trim(), value, opt);
        }
        return this.next(index + 1, key, value, opt);
    }
    return '';
};
Pitch.prototype.do = function (key, value, opt) {
    return this.next(0, key, value, opt);
};
