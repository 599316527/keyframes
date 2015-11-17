define(["EventEmitter","Util","Compatible","TFCompatible","Event"],function(t,o,e,s,r){function i(t,o){i.superClass.call(this),this._dom=t,this._executeInTime=o,this._steps=[],this._store={},this._index=0,this._compatible=s.instance(),this._listen()}return o.inherit(i,t),i.prototype._listen=function(){function t(t){return function(o){e.emit(t,o)}}var e=this,s=e._compatible;this.on(r.on,function(o,i){i===r.end&&(e._monitorEnd||(e._monitorEnd=t(i),e._on(s.parseEvent(i),e._monitorEnd)))}),this.on(r.end,function(t,i){if(e._index<e._steps.length){var n=e._steps[e._index],a=i.propertyName.replace(s.prefix,"");if(a in n.status){n.status[a]=!0;var p=n.status,c=o.forIn(p,function(t,o){return o?void 0:!1});c&&(e._index++,n.next?(e.emit(r.next,n),n.next()):e.emit(r.over,n))}}o.stopPropagation(i)})},i.prototype.setExecuteInTime=function(t){return this._executeInTime=t,this},i.prototype.reStore=function(){e.css(this._dom,this._store,"",this);for(var t;this._index>0;)this._index--,t=this._steps[this._index].status,o.forKey(t,function(o){t[o]=!1});return this},i.prototype.reflow=function(){return e.reflow(this._dom),this},i.prototype.reExecute=function(){return this.reStore().reflow(),this.execute()},i.prototype.execute=function(){if(this._index<this._steps.length){var t=this._steps[this._index];"execute"in t&&t.execute()}return this},i._apiMap={changeTo:{c:"color",bc:"backgroundColor",fs:"fontSize",br:"borderRadius",o:"opacity",l:"left",r:"right",t:"top",b:"bottom",w:"width",h:"height"},moveTo:{t:"top",l:"left",b:"bottom",r:"right"},moveBy:{x:"translateX",y:"translateY",z:"translateZ","2d":"translate","3d":"translate3d"},scaleBy:{x:"scaleX",y:"scaleY",z:"scaleZ","2d":"scale","3d":"scale3d"},rotateBy:{x:"rotateX",y:"rotateY",z:"rotateZ","3d":"rotate3d"},skewBy:{x:"skewX",y:"skewY","2d":"skew"}},i.prototype._step=function(t,o,s){var r=this,i=r._compatible,n={},a=r._steps.length;if(a>0){var p=r._steps[a-1],c=p.next;c?(p.next=function(){c(),e.css(r._dom,i.parseCSS("transition"),t,r),e.css(r._dom,o(),"",r)},r._index===r._steps.length&&(e.css(r._dom,i.parseCSS("transition"),t,r),e.css(r._dom,o(),"",r))):(p.next=function(){e.css(r._dom,i.parseCSS("transition"),t,r),e.css(r._dom,o(),"",r)},r._index===r._steps.length&&p.next())}else n.execute=function(){e.css(r._dom,i.parseCSS("transition"),t,r),e.css(r._dom,o(),"",r)},this._executeInTime&&n.execute();n.status=s,n.next=!1,this._steps.push(n)},i.prototype._combineTransform=function(t,e){var s=o.css(this._dom,e);return s&&"none"!==s?s+" "+t.join(" "):t.join(" ")},i.prototype._fillTransformParams=function(t,e,s){var r=this._compatible,i=r.parseCSS("transform"),n=r.parseCSS("transition");t=r.clone(t,e);var a=t.api;if(!a)throw new Error("不健全的配置项！");o.forIn(a,function(t,o){s.push(t+"("+o+")")}),i in this._store||(this._store[i]=o.css(this._dom,i)),n in this._store||(this._store[n]=o.css(this._dom,n))},i.prototype._transform=function(t,o){var e=this,s=e._compatible,r=s.cssMap("transform"),i=[];this._fillTransformParams(t,o,i);var n={};n.transform=!1,t.property=r,this._step(s.parseTransition(t),function(){var t={},o=s.parseCSS("transform");return t[o]=e._combineTransform(i,o),t},n)},i.prototype._addStatus=function(t,o){var e=this._compatible.cssMap(o);return"border-radius"===e?(t["border-bottom-left-radius"]=!1,t["border-top-left-radius"]=!1,t["border-bottom-right-radius"]=!1,t["border-top-right-radius"]=!1):t[e]=!1,e},i.prototype._fillCSSParams=function(t,e,s,r,i){var n,a=this,p=a._compatible.parseCSS("transition");return t=a._compatible.clone(t,e),t instanceof Array||(t=[t]),o.each(t,function(t){if(!t.api)throw new Error("不健全的配置！");o.forIn(t.api,function(e,c){n=this._addStatus(i,e),r[e]=c,e in this._store||(this._store[e]=o.css(this._dom,e)),p in this._store||(this._store[p]=o.css(this._dom,p)),t.property=n,s.push(a._compatible.parseTransition(t))},a)}),t},i.prototype._css=function(t,o){var e=[],s={},r={};this._fillCSSParams(t,o,e,s,r),this._step(e.join(","),function(){return s},r)},i.prototype.moveTo=function(t){var o=i._apiMap.moveTo;return t=this._patchMoveTo(t,o),this._css(t,o),this},i.prototype._patchMoveTo=function(t,e){t instanceof Array||(t=[t]);var s,r,i=this._dom,n={};return o.each(t,function(t){o.forKey(t,function(t){t in e&&(r=e[t],s=o.css(i,r),s&&"auto"!==s||(n[r]=0))})}),o.forIn(n,function(t,e){o.css(i,t,e)}),t},i.prototype.changeTo=function(t){var o=i._apiMap.changeTo;return t=this._patchMoveTo(t,i._apiMap.moveTo),this._css(t,o),this},i.prototype.moveBy=function(t){var o=i._apiMap.moveBy;return this._transform(t,o),this},i.prototype.scaleBy=function(t){var o=i._apiMap.scaleBy;return this._transform(t,o),this},i.prototype.skewBy=function(t){var o=i._apiMap.skewBy;return this._transform(t,o),this},i.prototype.rotateBy=function(t){var o=i._apiMap.rotateBy;return this._transform(t,o),this},i.prototype.mock=function(t,e){var s=i._apiMap[t],r={},n={},a=[];if("moveTo changeTo".indexOf(t)>-1)return this._fillCSSParams(e,s,a,r,n),[a.join(","),r,n];var p=this._compatible,c=p.parseCSS("transform"),h=[],_=p.cssMap("transform");if("mix"===t){var f,u=this._compatible.peelMould(e),m=0;return o.forIn(i._apiMap,function(t,s){t in e&&(f=e[t],"moveTo"===t||"changeTo"===t?(f=this._patchMoveTo(f,i._apiMap.moveTo),o.each(f,function(t){o.extend(t,u)}),this._fillCSSParams(f,s,a,r,n)):(this._fillTransformParams(f,s,h),m++))},this),m>0&&(n.transform=!1,e.property=_,a.push(p.parseTransition(e))),m>0&&(c=p.parseCSS("transform"),r[c]="old+, "+h.join(" ")),[a.join(","),r,n]}return this._fillTransformParams(e,s,h),n.transform=!1,e.property=_,r[c]="old+, "+h.join(" "),[p.parseTransition(e),r,n]},i.prototype.mix=function(t){var e,s=this._compatible.peelMould(t),r=[],n={},a={},p=[],c=0;o.forIn(i._apiMap,function(h,_){h in t&&(e=t[h],"moveTo"===h||"changeTo"===h?(e=this._patchMoveTo(e,i._apiMap.moveTo),o.each(e,function(t){o.extend(t,s)}),this._fillCSSParams(e,_,r,n,a)):(this._fillTransformParams(e,_,p),c++))},this);var h=this,_=h._compatible;if(c>0){var f=_.cssMap("transform");a.transform=!1,t.property=f,r.push(_.parseTransition(t))}return this._step(r.join(","),function(){if(c>0){var t=_.parseCSS("transform");n[t]=h._combineTransform(p,t)}return n},a),this},i.prototype.then=function(t){var o=this._steps.length;if(o>0){var e=this._steps[o-1],s=e.next;e.next=s?function(){s(),t()}:t}else t();return this},i.prototype._on=function(t,e){o.on(this._dom,t,e)},i.prototype._off=function(t,e){o.off(this._dom,t,e)},i.prototype._unListen=function(){this._monitorStart&&this._off(this._compatible.parseEvent(r.start),this._monitorStart),this._monitorEnd&&this._off(this._compatible.parseEvent(r.end),this._monitorEnd)},i.prototype.perspective=function(t){var o=this._compatible,s=this._dom.parentNode;return t===!1?e.css(s,o.parseCSS("transformStyle"),"flat",this):(e.css(s,o.parseCSS("transformStyle"),"preserve-3d",this),e.css(s,o.parseCSS("perspective"),t,this)),this},i});