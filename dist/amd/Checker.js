define(["Util"],function(n){function t(){this._list=n.arg2Ary(arguments)}return t.prototype.check=function(t){var e=this;if(t.length!==e._list.length)return!1;var i,r,s=n.each(t,function(n,t){if(i=e._list[t],r=typeof i,"string"===r){if(typeof n!==i)return!1}else if("function"===r&&!(n instanceof i))return!1});return s},t.stringObject=new t("string","object"),t.objectString=new t("object","string"),t.object=new t("object"),t.string=new t("string"),t.ssFunction=new t("string","string","function"),t.sFunction=new t("string","function"),t.array=new t(Array),t});