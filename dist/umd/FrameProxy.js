!function(t,e){"function"==typeof define&&define.amd?define(["Checker","Util","Compiler"],e):t.FrameProxy=e(t.Checker,t.Util,t.Compiler)}(this,function(t,e,i){function n(t,e,i){this._clazz=i,this._define(t,e)}return n.prototype._define=function(t,e){return this._frame=i.instance().defineKeyframe(t,e),this},n.prototype.getName=function(){return this._frame},n.prototype.rewrite=function(e){if(!t.object.check(arguments))throw new Error("incorrect parameter!");return this._define(this._frame,e),this},n.prototype.setConfig=function(t){return t.name=this._frame,this._config=t,this._configs=[t],this},n.prototype.getConfigs=function(){return this._configs},n.prototype.keyframe=function(t){var i,n={"@":"function","#":"count",_:"delay","~":"duration",">":"direction"},r={},o=t.replace(/([@#~>_])([^@#~>_]*)/g,function(t,e,i){return r[e]=i,""}).trim();return e.forIn(r,function(t,e){i=n[t],i in this._config||(this._config[i]=e)},this),"."===o[0]?(o=document.getElementsByClassName(o.substr(1)),this._keyframes=[],e.each(o,function(t){this._keyframes.push(new this._clazz(t,this._configs))},this)):(o=document.getElementById(o),this._keyframes=[new this._clazz(o,this._configs)]),this._keyframes},n.prototype.combine=function(t){var e=t.getConfigs();return e&&(this._configs=this._configs.concat(e)),this},n});