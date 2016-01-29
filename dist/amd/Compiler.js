define(["Checker","KFCompatible","Util","Event","EventEmitter"],function(t,e,i,n,r){function s(){s.superClass.call(this),this._classStore={},this._classMap={},this._keyframeMap={},this._keyframeStore={};var t=e.instance();this._compatible=t,this._classId=function(t){return"class("+t+")"},this._keyframeId=function(t){return"keyframe("+t+")"},this._classText=function(t,e){return"."+t.replace(/\s+/g," .")+" "+e},this._keyframeText=function(e,i){return t.keyframe(e)+i}}return i.inherit(s,r),s.prototype.defineClass=function(t,e){return t=t.trim(),this._classMap[t]=e,t},s.prototype.defineKeyframe=function(e,n){return t.object.check(arguments)&&(n=arguments[0],e=i.random.name(8)),this._keyframeMap[e]=n,e},s.prototype.compile=function(){var t={},e={};i.forIn(this._classMap,function(e,i){t[e]=this._compileClass(i)},this),i.forIn(this._keyframeMap,function(t,i){e[t]=this._compileKeyframe(i)},this),this._classMap={},this._keyframeMap={},this._effect(t,e)},s.prototype._absorb=function(t,e,n,r,s){var o,c;i.forIn(t,function(t,i){o=e(t),c=n(t,i),t in r?this._refreshSheet(c,o):s.appendChild(this._styleSheet(c,o)),r[t]=i},this),t=null},s.prototype._effect=function(t,e){var i=this._fragment();this._absorb(t,this._classId,this._classText,this._classStore,i),this._absorb(e,this._keyframeId,this._keyframeText,this._keyframeStore,i),i.effect()},s.prototype._fragment=function(){var t=document.createDocumentFragment();return t.effect=function(){document.querySelector("head").appendChild(t)},t},s.prototype._styleSheet=function(t,e){var i=document.createElement("style");return i.type="text/css",i.id=e,i.innerHTML=t,this.emit(n.style,e,t),i},s.prototype.clear=function(){i.forIn(this._classStore,function(t){this._clearSheet(this._classId(t))},this),i.forIn(this._keyframeStore,function(t){this._clearSheet(this._keyframeId(t))},this),this._classStore={},this._keyframeStore={},this._classMap={},this._keyframeMap={}},s.prototype._refreshSheet=function(t,e){document.getElementById(e).innerHTML=t,this.emit(n.style,e,t)},s.prototype._clearSheet=function(t){document.querySelector("head").removeChild(document.getElementById(t))},s.prototype._compileClass=function(t){return"{"+this._compileContent(t)+"}"},s.prototype._compileContent=function(t){var e={},n=[];return i.forIn(t,function(t,i){n.push(this._compatible.patch(t,i,e))},this),i.forIn(e,function(t,e){n.push(this._compatible.patchCombine(t,e))},this),n.join("")},s.prototype._compileKeyframe=function(t){var e="{";return i.forIn(t,function(t,i){e+=this._compileFrame(t,i)},this),e+="}"},s.prototype._compileFrame=function(t,e){return this._compatible.percent(t)+this._compileClass(e)},s.instance=function(){return s._compiler||(s._compiler=new s),s._compiler},s});