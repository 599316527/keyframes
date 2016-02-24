/**
 * @file 参数检查类定义
 * @author tingkl(dingguoliang01@baidu.com)
 **/
/* global Util */
// 当前文件依赖加载: Util.js
/* define Checker */
/**
 * 参数类型匹配
 *
 * @class
 * @param {...(string|Function)} arg 类型字符串或者类
 */
function Checker() {
    this._list = Util.arg2Ary(arguments);
}

/**
 * 参数检查
 *
 * @param {Arguments.<(string|Function)>|Array.<(string|Function)>} arg 参数集合
 * @return {boolean} 是否满足检查规则
 */
Checker.prototype.check = function (arg) {
    var me = this;
    if (arg.length !== me._list.length) {
        return false;
    }
    var type;
    var typeOf;
    var match = Util.each(arg, function (item, i) {
        type = me._list[i];
        // type有可能为字符串或者类，例如：new Checker(Array);
        typeOf = typeof type;
        // 对于字符串使用typeof判断
        if (typeOf === 'string') {
            if (typeof item !== type) {
                return false;
            }
        }
        // 对于类使用instance判断是否为类的实例
        else if (typeOf === 'function') {
            if (!(item instanceof type)) {
                return false;
            }
        }
    });
    return match;
};
// 参数1为string类型，参数2为JSON对象
Checker.stringObject = new Checker('string', 'object');
// 参数1为JSON对象，参数1为string类型
Checker.objectString = new Checker('object', 'string');
// 参数1为JSON类型
Checker.object = new Checker('object');
// 参数1为string类型
Checker.string = new Checker('string');
// 参数1为string类型，参数2为string类型，参数3为函数
Checker.ssFunction = new Checker('string', 'string', 'function');
// 参数1为string类型，参数2为函数
Checker.sFunction = new Checker('string', 'function');
// 参数1为Array类型
Checker.array = new Checker(Array);
