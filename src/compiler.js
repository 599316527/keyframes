/**
 * @file Compiler.js ~ 2015/08/13 11:47:13
 * @author tingkl(dingguoliang01@baidu.com)
 **/
/* global Checker KFCompatible Util Event EventEmitter*/
/* define Compiler */

/**
 * 编译类，根据metaData生成class或者keyframes
 *
 * @class
 * @extend EventEmitter
 */
function Compiler() {
    Compiler.superClass.call(this);
    // define时cache到map中，map存keyframeName + json
    // compile时清空map，cache到store中，store中存keyframeName + css
    this._classStore = {};
    this._classMap = {};
    this._keyframeMap = {};
    this._keyframeStore = {};
    var compatible = KFCompatible.instance();
    this._compatible = compatible;
    this._classId = function (className) {
        return 'class(' + className + ')';
    };
    this._keyframeId = function (keyframe) {
        return 'keyframe(' + keyframe + ')';
    };
    this._classText = function (className, body) {
        return '.' + className.replace(/\s+/g, ' .') + ' ' + body;
    };
    this._keyframeText = function (keyframe, body) {
        // @-webkit-keyframes xxx
        return compatible.keyframe(keyframe) + body;
    };
}
Util.inherit(Compiler, EventEmitter);
Compiler.prototype.defineClass = function (className, metaData) {
    className = className.trim();
    this._classMap[className] = metaData;
    return className;
};
Compiler.prototype.defineKeyframe = function (keyframe, metaData) {
    if (Checker.object.check(arguments)) {
        metaData = arguments[0];
        keyframe = Util.random.name(8);
    }
    this._keyframeMap[keyframe] = metaData;
    return keyframe;
};
Compiler.prototype.compile = function () {
    var classes = {};
    var keyframes = {};
    Util.forIn(this._classMap, function (className, item) {
        classes[className] = this._compileClass(item);
    }, this);
    Util.forIn(this._keyframeMap, function (keyframe, item) {
        keyframes[keyframe] = this._compileKeyframe(item);
    }, this);
    this._classMap = {};
    this._keyframeMap = {};
    // classes cache className：cssTextBody
    // keyframes cache frameName： frameTextBody
    this._effect(classes, keyframes);
};
Compiler.prototype._absorb = function (obj, idG, textG, store, frag) {
    var id;
    var cssText;
    Util.forIn(obj, function (key, item) {
        // class & keyframe 的id
        id = idG(key);
        // 完整的cssText
        // className + {}  --> .className{}
        // frameName + {} --> @-webkit-keyframes frameName{}
        cssText = textG(key, item);
        if (key in store) {
            this._refreshSheet(cssText, id);
        }
        else {
            frag.appendChild(this._styleSheet(cssText, id));
        }
        store[key] = item;
    }, this);
    obj = null;
};
Compiler.prototype._effect = function (classes, keyframes) {
    var frag = this._fragment();
    this._absorb(classes, this._classId, this._classText, this._classStore, frag);
    this._absorb(keyframes, this._keyframeId, this._keyframeText, this._keyframeStore, frag);
    frag.effect();
};
Compiler.prototype._fragment = function () {
    var fragment = document.createDocumentFragment();
    fragment.effect = function () {
        document.querySelector('head').appendChild(fragment);
    };
    return fragment;
};
Compiler.prototype._styleSheet = function (cssText, id) {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.id = id;
    style.innerHTML = cssText;
    this.emit(Event.style, id, cssText);
    return style;
};
Compiler.prototype.clear = function () {
    Util.forIn(this._classStore, function (className) {
        this._clearSheet(this._classId(className));
    }, this);
    Util.forIn(this._keyframeStore, function (frameName) {
        this._clearSheet(this._keyframeId(frameName));
    }, this);
    this._classStore = {};
    this._keyframeStore = {};
    this._classMap = {};
    this._keyframeMap = {};
};
Compiler.prototype._refreshSheet = function (cssText, id) {
    document.getElementById(id).innerHTML = cssText;
    this.emit(Event.style, id, cssText);
};
Compiler.prototype._clearSheet = function (id) {
    document.querySelector('head').removeChild(document.getElementById(id));
};
// 编译生成cssTextBody {}
Compiler.prototype._compileClass = function (metaData) {
    return '{' + this._compileContent(metaData) + '}';
};
Compiler.prototype._compileContent = function (metaData) {
    var opt = {};
    var content = [];
    Util.forIn(metaData, function (key, item) {
        content.push(this._compatible.patch(key, item, opt));
    }, this);
    Util.forIn(opt, function (key, item) {
        content.push(this._compatible.patchCombine(key, item));
    }, this);
    return content.join('');
};
// 编译生成keyframesTextBody {}
Compiler.prototype._compileKeyframe = function (metaData) {
    var body = '{';
    Util.forIn(metaData, function (percent, item) {
        body += this._compileFrame(percent, item);
    }, this);
    body += '}';
    return body;
};
Compiler.prototype._compileFrame = function (percent, metaData) {
    return this._compatible.percent(percent) + this._compileClass(metaData);
};
Compiler.instance = function () {
    if (!Compiler._compiler) {
        Compiler._compiler = new Compiler();
    }
    return Compiler._compiler;
};
