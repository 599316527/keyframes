define(["Util","Event","EventEmitter","Compatible","TFCompatible","Status"],function(t,s,o,e,r,i){function n(t,s){n.superClass.call(this),this._dom=t,this._executeInTime=s,this._steps=[],this._store={},this._index=0,this._transformRecord="",this._firstRun=!0,this._compatible=r.instance(),this._listen()}return t.inherit(n,o),n.prototype._listen=function(){function o(t){return function(s){e.emit(t,s)}}var e=this,r=e._compatible;this.on(s.on,function(t,i){i===s.end&&(e._monitorEnd||(e._monitor=o(i),e._on(r.parseEvent(i),e._monitor)))}),this.on(s.end,function(o,i){if(e._index<e._steps.length){var n=e._steps[e._index],a=i.propertyName.replace(r.prefix,"");n.status.digest(a),n.status.isDone()&&(e._index++,n.next?(e.emit(s.next,n),n.next()):e.emit(s.over,n))}t.stopPropagation(i)})},n.prototype.setExecuteInTime=function(t){return this._executeInTime=t,this},n.prototype.reStore=function(){e.css(this._dom,this._store,"",this);for(var t;this._index>0;)this._index--,t=this._steps[this._index].status,t.reset();return this._transformRecord="",this},n.prototype.reflow=function(){return e.reflow(this._dom),this},n.prototype.execute=function(){if(this._firstRun||(this.reStore().reflow(),this._firstRun=!1),this._index<this._steps.length){var t=this._steps[this._index];"execute"in t&&t.execute()}return this},n._apiMap={changeTo:{c:"color",bc:"backgroundColor",fs:"fontSize",br:"borderRadius",bo:"border",o:"opacity",l:"left",r:"right",t:"top",b:"bottom",w:"width",h:"height"},moveTo:{t:"top",l:"left",b:"bottom",r:"right"},moveBy:{x:"translateX",y:"translateY",z:"translateZ","2d":"translate","3d":"translate3d"},scaleBy:{x:"scaleX",y:"scaleY",z:"scaleZ","2d":"scale","3d":"scale3d"},rotateBy:{x:"rotateX",y:"rotateY",z:"rotateZ","3d":"rotate3d"},skewBy:{x:"skewX",y:"skewY","2d":"skew"}},n.prototype._step=function(t,o,r){var i=this,n=i._compatible,a={},p=i._steps.length,c=function(t,o,e){i.emit(s.css,t,o,e)};if(p>0){var h=i._steps[p-1],_=h.next;_?(h.next=function(){_(),e.css(i._dom,n.parseCSS("transition"),t,c),e.css(i._dom,o(),"",c)},i._index===i._steps.length&&(e.css(i._dom,n.parseCSS("transition"),t,c),e.css(i._dom,o(),"",c))):(h.next=function(){e.css(i._dom,n.parseCSS("transition"),t,c),e.css(i._dom,o(),"",c)},i._index===i._steps.length&&h.next())}else a.execute=function(){e.css(i._dom,n.parseCSS("transition"),t,c),e.css(i._dom,o(),"",c)},this._executeInTime&&a.execute();a.status=r,a.next=!1,this._steps.push(a)},n.prototype._combineTransform=function(t){return this._transformRecord+=t.join(" "),this._transformRecord},n.prototype._fillTransformParams=function(s,o,e){var r=this._compatible,i=r.parseCSS("transform"),n=r.parseCSS("transition");s=r.clone(s,o);var a=s.api;if(!a)throw new Error("不健全的配置项！");t.forIn(a,function(t,s){e.push(t+"("+s+")")}),i in this._store||(this._store[i]=t.css(this._dom,i)),n in this._store||(this._store[n]=t.css(this._dom,n))},n.prototype._transform=function(t,s){var o=this,e=o._compatible,r=e.cssMap("transform"),n=[];this._fillTransformParams(t,s,n);var a=new i;a.add("transform"),t.property=r,this._step(e.parseTransition(t),function(){var t={},s=e.parseCSS("transform");return t[s]=o._combineTransform(n),t},a)},n.prototype._fillCSSParams=function(s,o,e,r,i){var n,a=this,p=a._compatible.parseCSS("transition");return s=a._compatible.clone(s,o),s instanceof Array||(s=[s]),t.each(s,function(s){if(!s.api)throw new Error("不健全的配置！");t.forIn(s.api,function(o,c){n=this._compatible.addStatus(i,o),r[o]=c,o in this._store||(this._store[o]=t.css(this._dom,o)),p in this._store||(this._store[p]=t.css(this._dom,p)),s.property=n,e.push(a._compatible.parseTransition(s))},a)}),s},n.prototype._css=function(t,s){var o=[],e={},r=new i;this._fillCSSParams(t,s,o,e,r),this._step(o.join(","),function(){return e},r)},n.prototype.moveTo=function(t){var s=n._apiMap.moveTo;return t=this._patchMoveTo(t,s),this._css(t,s),this},n.prototype._patchMoveTo=function(s,o){s instanceof Array||(s=[s]);var e,r,i=this._dom,n={};return t.each(s,function(s){t.forIn(s,function(s){s in o&&(r=o[s],e=t.css(i,r),e&&"auto"!==e||(n[r]=0))})}),t.forIn(n,function(s,o){t.css(i,s,o)}),s},n.prototype.changeTo=function(t){var s=n._apiMap.changeTo;return t=this._patchMoveTo(t,n._apiMap.moveTo),this._css(t,s),this},n.prototype.moveBy=function(t){var s=n._apiMap.moveBy;return this._transform(t,s),this},n.prototype.scaleBy=function(t){var s=n._apiMap.scaleBy;return this._transform(t,s),this},n.prototype.skewBy=function(t){var s=n._apiMap.skewBy;return this._transform(t,s),this},n.prototype.rotateBy=function(t){var s=n._apiMap.rotateBy;return this._transform(t,s),this},n.prototype.mock=function(s,o){var e=n._apiMap[s],r={},a=new i,p=[];if("moveTo changeTo".indexOf(s)>-1)return this._fillCSSParams(o,e,p,r,a),[p.join(","),r,a];var c=this._compatible,h=c.parseCSS("transform"),_=[],f=c.cssMap("transform");if("mix"===s){var m,u=this._compatible.peelMould(o),l=0;return t.forIn(n._apiMap,function(s,e){s in o&&(m=o[s],"moveTo"===s||"changeTo"===s?(m=this._patchMoveTo(m,n._apiMap.moveTo),t.each(m,function(s){t.extend(s,u)}),this._fillCSSParams(m,e,p,r,a)):(this._fillTransformParams(m,e,_),l++))},this),l>0&&(a.add("transform"),o.property=f,p.push(c.parseTransition(o))),l>0&&(h=c.parseCSS("transform"),r[h]="old+; "+_.join(" ")),[p.join(","),r,a]}return this._fillTransformParams(o,e,_),a.add("transform"),o.property=f,r[h]="old+; "+_.join(" "),[c.parseTransition(o),r,a]},n.prototype.mix=function(s){var o,e=this._compatible.peelMould(s),r=[],a={},p=new i,c=[],h=0;t.forIn(n._apiMap,function(i,_){i in s&&(o=s[i],"moveTo"===i||"changeTo"===i?(o=this._patchMoveTo(o,n._apiMap.moveTo),t.each(o,function(s){t.extend(s,e)}),this._fillCSSParams(o,_,r,a,p)):(this._fillTransformParams(o,_,c),h++))},this);var _=this,f=_._compatible;if(h>0){var m=f.cssMap("transform");p.add("transform"),s.property=m,r.push(f.parseTransition(s))}return this._step(r.join(","),function(){if(h>0){var t=f.parseCSS("transform");a[t]=_._combineTransform(c,t)}return a},p),this},n.prototype.then=function(t){var s=this._steps.length;if(s>0){var o=this._steps[s-1],e=o.next;o.next=e?function(){e(),t()}:t}else t();return this},n.prototype._on=function(s,o){t.on(this._dom,s,o)},n.prototype._off=function(s,o){t.off(this._dom,s,o)},n.prototype._unListen=function(){this._monitorEnd&&this._off(this._compatible.parseEvent(s.end),this._monitorEnd)},n.prototype.perspective=function(t){var s=this._compatible,o=this._dom.parentNode;return t===!1?e.css(o,s.parseCSS("transformStyle"),"flat",this):(e.css(o,s.parseCSS("transformStyle"),"preserve-3d",this),e.css(o,s.parseCSS("perspective"),t,this)),this},n});