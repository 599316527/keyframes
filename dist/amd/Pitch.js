define(["Checker"],function(t){function e(e,n,r){this._router=[],t.ssFunction.check(arguments)&&this.use(e,n,r)}return e.prototype.use=function(t,e,n){return this._router.push({name:t,keys:e+" ",handler:n}),this},e.prototype.next=function(t,e,n,r){var i=this._router[t];return i?"*"===i.keys.trim()?i.handler(e.trim(),n,r):i.keys.indexOf(e)>-1?i.handler(e.trim(),n,r):this.next(t+1,e,n,r):""},e.prototype["do"]=function(t,e,n){return this.next(0,t,e,n)},e});