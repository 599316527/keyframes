/**
 * @file TFCompatible.js ~ 2015/08/13 11:47:13
 * @author tingkl(dingguoliang01@baidu.com)
 **/
/* global Pitch Util Checker Event EventEmitter Compatible*/
/* define TFCompatible */

/**
 *  浏览器兼容处理
 *
 * @class
 * @extend EventEmitter
 */
function TFCompatible() {
    TFCompatible.superClass.call(this);
}
Util.inherit(TFCompatible, EventEmitter);
TFCompatible.prototype.prefix = Compatible.prefix;
TFCompatible._keyMap = {
    'transform': ['transform'],
    'transition': ['transition'],
    'duration': ['transitionDuration', '1s'],
    'function': ['transitionTimingFunction', 'linear'],
    'delay': ['transitionDelay', '0s']
};
// 如果为duration function delay，简称转全称
// 其他加入兼容性前缀：transition -->webkitTransition
TFCompatible.prototype.parseCSS = function (key) {
    var p = this.prefix.replace(/-/g, '');
    if (p === 'moz') {
        TFCompatible.prototype.parseCSS = function (key) {
            if (key in TFCompatible._keyMap) {
                return TFCompatible._keyMap[key][0];
            }
            return key;
        };
    }
    else {
        TFCompatible.prototype.parseCSS = function (key) {
            if (key in TFCompatible._keyMap) {
                key = TFCompatible._keyMap[key][0];
                return p + key[0].toUpperCase() + key.substr(1);
            }
            return key;
        };
    }
    return this.parseCSS(key);
};
TFCompatible.prototype.cssMap = function (propertyName) {
    var tmp;
    switch (propertyName) {
        case 'transform':
            if (this.prefix === '-webkit-') {
                tmp =  this.prefix + propertyName;
            }
            else {
                tmp = propertyName;
            }
            break;
        case 'backgroundColor': tmp = 'background-color'; break;
        case 'borderRadius': tmp = 'border-radius'; break;
        case 'fontSize': tmp = 'font-size'; break;
        case 'color':
        case 'top':
        case 'bottom':
        case 'left':
        case 'width':
        case 'height':
        case 'opacity':
        case 'right': tmp = propertyName; break;
        default: throw new Error(propertyName + ' not supported!');
    }
    return tmp;
};
TFCompatible.prototype.peelMould = function (config) {
    var mould = {};
    Util.forKey(TFCompatible._keyMap, function (key) {
        if (key in config) {
            mould[key] = config[key];
        }
    });
    return mould;
};
TFCompatible.prototype.clone = function (obj, apiMap) {
    var clone;
    var keyMap = TFCompatible._keyMap;
    if (obj instanceof Array) {
        clone = [];
        Util.each(obj, function (item) {
            clone.push(this.clone(item, apiMap));
        }, this);
    }
    else if (typeof obj === 'object') {
        clone = {};
        Util.forIn(obj, function (key, value) {
            if (key in keyMap) {
                clone[key] = this.clone(value, apiMap);
            }
            else if (key in apiMap) {
                if (!('api' in clone)) {
                    clone.api = {};
                }
                clone.api[apiMap[key]] = this.clone(value, apiMap);
            }
        }, this);
    }
    else {
        clone = obj;
    }
    return clone;
};
TFCompatible.prototype.parseTransition = function (transition) {
    function regReplace($0, $1) {
        if ($1 in transition) {
            return transition[$1];
        }
        return TFCompatible._keyMap[$1][1];
    }
    return '<property> <duration> <function> <delay>'.replace(/<(.*?)>/g, regReplace);
};

TFCompatible.instance = function () {
    if (!TFCompatible._compatible) {
        TFCompatible._compatible = new TFCompatible();
    }
    return TFCompatible._compatible;
};
TFCompatible.prototype.parseEvent = Compatible.parseEvent('transition', 'Transition');
