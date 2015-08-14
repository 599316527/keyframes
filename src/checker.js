/**
 * @file checker.js ~ 2015/08/13 11:47:13
 * @author tingkl(dingguoliang01@baidu.com)
 **/

/* global Util */
function Checker() {
    this._list = Util.arg2Ary(arguments);
}

Checker.prototype.check = function (arg) {
    var me = this;
    if (arg.length !== me._list.length) {
        return false;
    }
    var _type;
    var _typeof;
    var match = Util.each(arg, function (item, i) {
        _type = me._list[i];
        _typeof = typeof _type;
        if (_typeof === 'string') {
            if (typeof item !== _type) {
                return false;
            }
        }
        else if (_typeof === 'function') {
            if (!(item instanceof _type)) {
                return false;
            }
        }
    });
    return match;
};

Checker.stringObject = new Checker('string', 'object');
Checker.object = new Checker('object');
Checker.ssFunction = new Checker('string', 'string', 'function');
Checker.array = new Checker(Array);