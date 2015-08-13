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
function Pitch(keys, handler) {
    this._keys = keys + ' ';
    this._handler = handler;
}

Pitch.prototype.do = function (key, value, opt) {
    if (this._keys.trim() === '*') {
        return this._handler(key.trim(), value);
    }
    if (this._keys.indexOf(key) > -1) {
        return this._handler(key.trim(), value, opt);
    }
    if (this._next) {
        return this._next.do(key, value, opt);
    }
    return false;
};

Pitch.prototype.next = function (pitch) {
    this._next = pitch;
    return pitch;
};
