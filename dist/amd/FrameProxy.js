define(["Checker","Util","Compiler"],function(t,e,n){function i(t,e,n){this._clazz=n,this._define(t,e)}return i.prototype._define=function(t,e){return this._frame=n.instance().defineKeyframe(t,e),this},i.prototype.getName=function(){return this._frame},i.prototype.rewrite=function(e){if(!t.object.check(arguments))throw new Error("incorrect parameter!");return this._define(this._frame,e),this},i.prototype.setConfig=function(t){return t.name=this._frame,this._config=t,this._configs=[t],this},i.prototype.getConfigs=function(){return this._configs},i.prototype.keyframe=function(t){var n={"@":"function","#":"count"},i={},r=t.replace(/([@#])([^@#]*)/g,function(t,e,n){return i[e]=n,""});return e.forIn(i,function(t,e){this._config[n[t]]=e},this),this._keyframe=new this._clazz(document.getElementById(r),this._configs),this._keyframe},i.prototype.combine=function(t){var e=t.getConfigs();return e&&(this._configs=this._configs.concat(e)),this},i});