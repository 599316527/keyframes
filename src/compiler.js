/**
 * @file compiler.js ~ 2015/08/13 11:47:13
 * @author tingkl(dingguoliang01@baidu.com)
 **/

/* global Checker Compatible Util */
function Compiler() {
    Compiler.superClass.call(this);
    this._classStore = {};
    this._classMap = {};
    this._keyframeMap = {};
    this._keyframeStore = {};
    var compatible = Compatible.instance();
    this._compatible = compatible;
    this._classId = function (className) {
        return 'class(' + className + ')';
    };
    this._keyframeId = function (keyframe) {
        return 'keyframe(' + keyframe + ')';
    };
    this._classText = function (className, body) {
        return '.' + className + ' ' + body;
    };
    this._keyframeText = function (keyframe, body) {
        return compatible.keyframe(keyframe) + body;
    };
}
Util.inherit(Compiler, EventEmitter);

Compiler.prototype.defineClass = function (className, metaData) {
    this._classMap[className] = metaData;
    return className;
};
Compiler.prototype.defineKeyframe = function (keyframe, metaData) {
    this._keyframeMap[keyframe] = metaData;
    return keyframe;
};

Compiler.prototype.compile = function () {
    var classes = {};
    var keyframes = {};
    var metaData;
    for (var className in this._classMap) {
        metaData = this._classMap[className];
        classes[className] = this._compileClass(metaData);
        delete this._classMap[className];
    }
    for (var keyframe in this._keyframeMap) {
        metaData = this._keyframeMap[keyframe];
        keyframes[keyframe] = this._compileKeyframe(metaData);
        delete this._keyframeMap[keyframe];
    }
    this._effect(classes, keyframes);
};

Compiler.prototype._absorb = function (obj, idG, textG, store, frag) {
    var id;
    var cssText;
    for (var key in obj) {
        id = idG(key);
        cssText = textG(key, obj[key]);
        if (key in store) {
            this._refreshSheet(cssText, id);
        }
        else {
            frag.appendChild(this._styleSheet(cssText, id));
        }
        store[key] = obj[key];
        delete obj[key];
    }
};

Compiler.prototype._effect = function (classes, keyframes) {
    var frag = this._fragment();
    this._absorb(classes, this._classId, this._classText, this._classStore, frag);
    this._absorb(keyframes, this._keyframeId, this._keyframeText, this._keyframeStore, frag);
    frag.effect();
};
Compiler.prototype._fragment = function () {
    var fragment = document.createDocumentFragment();
    fragment.effect = function() {
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
Compiler.prototype._refreshSheet = function (cssText, id) {
    document.getElementById(id).innerHTML = cssText;
    this.emit(Event.style, id, cssText);
};
Compiler.prototype._compileClass = function (metaData) {
    var body = '{';
    var opt = {};
    var key;
    for (key in metaData) {
        body += this._compatible.patch(key, metaData[key], opt);
    }
    for (key in opt) {
        body += this._compatible.patchCombine(key, opt[key]);
    }
    body += '}';
    return body;
};
Compiler.prototype._compileKeyframe = function (metaData) {
    var body = '{';
    for (var percent in metaData) {
        body += this._compileFrame(percent, metaData[percent]);
    }
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