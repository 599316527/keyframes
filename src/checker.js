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
    var type;
    var typeOf;
    var match = Util.each(arg, function (item, i) {
        type = me._list[i];
        typeOf = typeof type;
        if (typeOf === 'string') {
            if (typeof item !== type) {
                return false;
            }
        }
        else if (typeOf === 'function') {
            if (!(item instanceof type)) {
                return false;
            }
        }
    });
    return match;
};

Checker.stringObject = new Checker('string', 'object');
Checker.objectString = new Checker('object', 'string');
Checker.object = new Checker('object');
Checker.string = new Checker('string');
Checker.ssFunction = new Checker('string', 'string', 'function');
Checker.sFunction = new Checker('string', 'function');
Checker.array = new Checker(Array);
