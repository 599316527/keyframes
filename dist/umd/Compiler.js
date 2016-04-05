!function(e,t){"function"==typeof define&&define.amd?define(["Checker","KFCompatible","Util","Event","EventEmitter"],t):e.Compiler=t(e.Checker,e.KFCompatible,e.Util,e.Event,e.EventEmitter)}(this,function(e,t,i,n,r){function o(){o.superClass.call(this),this._classStore={},this._classMap={},this._keyframeMap={},this._keyframeStore={};var e=t.instance();this._compatible=e,this._classId=function(e){return"class("+e+")"},this._keyframeId=function(e){return"keyframe("+e+")"},this._classText=function(e,t){return"."+e.replace(/\s+/g," .")+" "+t},this._keyframeText=function(t,i){return e.keyframe(t)+i}}return i.inherit(o,r),o.prototype.defineClass=function(e,t){return e=e.trim(),this._classMap[e]=t,e},o.prototype.defineKeyframe=function(t,n){return null!==n&&(e.object.check(arguments)&&(n=arguments[0],t=i.random.name(8)),this._keyframeMap[t]=n),t},o.prototype.compile=function(){var e={},t={};i.forIn(this._classMap,function(t,i){e[t]=this._compileClass(i)},this),i.forIn(this._keyframeMap,function(e,i){t[e]=this._compileKeyframe(i)},this),this._classMap={},this._keyframeMap={},this._effect(e,t)},o.prototype._absorb=function(e,t,n,r,o){var s,c;i.forIn(e,function(e,i){s=t(e),c=n(e,i),e in r?this._refreshSheet(c,s):o.appendChild(this._styleSheet(c,s)),r[e]=i},this),e=null},o.prototype._effect=function(e,t){var i=this._fragment();this._absorb(e,this._classId,this._classText,this._classStore,i),this._absorb(t,this._keyframeId,this._keyframeText,this._keyframeStore,i),i.effect()},o.prototype._fragment=function(){var e=document.createDocumentFragment();return e.effect=function(){document.querySelector("head").appendChild(e)},e},o.prototype._styleSheet=function(e,t){var i=document.createElement("style");return i.type="text/css",i.id=t,i.appendChild(document.createTextNode(e)),this.emit(n.style,t,e),i},o.prototype.clear=function(){i.forIn(this._classStore,function(e){this._clearSheet(this._classId(e))},this),i.forIn(this._keyframeStore,function(e){this._clearSheet(this._keyframeId(e))},this),this._classStore={},this._keyframeStore={},this._classMap={},this._keyframeMap={}},o.prototype._refreshSheet=function(e,t){document.getElementById(t).innerHTML=e,this.emit(n.style,t,e)},o.prototype._clearSheet=function(e){document.querySelector("head").removeChild(document.getElementById(e))},o.prototype._compileClass=function(e){return"{"+this._compileContent(e)+"}"},o.prototype._compileContent=function(e){var t={},n=[];return i.forIn(e,function(e,i){n.push(this._compatible.patch(e,i,t))},this),i.forIn(t,function(e,t){n.push(this._compatible.patchCombine(e,t))},this),n.join("")},o.prototype._compileKeyframe=function(e){var t="{";return i.forIn(e,function(e,i){t+=this._compileFrame(e,i)},this),t+="}"},o.prototype._compileFrame=function(e,t){return this._compatible.percent(e)+this._compileClass(t)},o.instance=function(){return o._compiler||(o._compiler=new o),o._compiler},o});