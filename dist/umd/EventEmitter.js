!function(t,e){"function"==typeof define&&define.amd?define(["Util","Event","Checker"],e):t.EventEmitter=e(t.Util,t.Event,t.Checker)}(this,function(t,e,i){function n(){this._triggers={}}return n.type={once:"once",all:"all"},n.prototype.on=function(t,i,n){if(!t)throw new Error("undefined event!");t in this._triggers?this._triggers[t].push({fn:i,option:n}):this._triggers[t]=[{fn:i,option:n}],this.emit(e.on,t,n)},n.prototype.off=function(n,r){if(i.string.check(arguments))n in this._triggers&&(this._triggers[n]=[],this.emit(e.off,n));else{if(!i.sFunction.check(arguments))throw new Error("incorrect parameter!");if(n in this._triggers){var o=-1;t.each(this._triggers[n],function(t,e){return t.fn===r?(o=e,!1):void 0}),o>-1&&(this._triggers[n].splice(o,1),this.emit(e.off,n))}}},n.prototype.once=function(t,i,r){r||(r={}),r.type=n.type.once,this.emit(e.once,t,r),this.on(t,i,r)},n.prototype.callWithScope=function(t,e,i){i=i||[],e&&e.hasOwnProperty("scope")?t.apply(e.scope,i):t.apply(this,i)},n.prototype.all=function(i,r,o){var s={},h=[];if(0===i.length)return void this.callWithScope(r,o);var c=this,p=function(e){return function(i,n){i in s&&(s[i]=!0,h[e]=n);var p=t.forIn(s,function(t,e){return e===!1?!1:void 0});p&&c.callWithScope(r,o,h)}};t.each(i,function(t,e){s[t]=!1,this.on(t,p(e),{type:n.type.all})},c),this.emit(e.all,i,o)},n.prototype.emit=function(e){var i,n,r,o,s=this._triggers[e],h=[],c=arguments;if(s){var p=this;if(t.each(s,function(e){r=e.fn,o=e.option,o?(i=o.scope,n=o.type):(i=!1,n=!1),i?r.apply(i,t.arg2Ary(c)):r.apply(p,t.arg2Ary(c)),n&&h.push(e)}),h.length>0){var f,g,a=[],l=0,u=0,y=s.length,v=h.length;for(f=h[u];y>l;)g=s[l],g===f?(u++,f=v>u?h[u]:-1):a.push(g),l++;0===a.length?delete this._triggers[e]:this._triggers[e]=a}}},n});