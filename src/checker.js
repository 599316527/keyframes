/**
 * @file checker.js ~ 2015/08/13 11:47:13
 * @author tingkl(dingguoliang01@baidu.com)
 **/

/* global Util */
function Checker() {
    this.list = Util.arg2Ary(arguments);
}

Checker.prototype.check = function (arg) {
    var me = this;
    if (arg.length !== me.list.length) {
        return false;
    }
    var match = Util.each(arg, function (item, i) {
        if (typeof item !== me.list[i]) {
            return false;
        }
    });
    return match;
};
