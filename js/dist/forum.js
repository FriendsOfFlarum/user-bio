module.exports=function(t){var e={};function o(r){if(e[r])return e[r].exports;var n=e[r]={i:r,l:!1,exports:{}};return t[r].call(n.exports,n,n.exports,o),n.l=!0,n.exports}return o.m=t,o.c=e,o.d=function(t,e,r){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(o.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)o.d(r,n,function(e){return t[e]}.bind(null,n));return r},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="",o(o.s=10)}([function(t,e){t.exports=flarum.core.compat["models/User"]},function(t,e){t.exports=flarum.core.compat.extend},function(t,e){t.exports=flarum.core.compat["utils/computed"]},function(t,e){t.exports=flarum.core.compat["components/UserCard"]},function(t,e){t.exports=flarum.core.compat.Model},function(t,e){t.exports=flarum.core.compat.Component},function(t,e){t.exports=flarum.core.compat["components/LoadingIndicator"]},function(t,e){t.exports=flarum.core.compat["utils/classList"]},function(t,e){t.exports=flarum.core.compat["utils/extractText"]},function(t,e){(function(){var t=[].slice;String.prototype.autoLink=function(){var e,o,r,n,i,a;return i=/(^|[\s\n]|<[A-Za-z]*\/?>)((?:https?|ftp):\/\/[\-A-Z0-9+\u0026\u2019@#\/%?=()~_|!:,.;]*[\-A-Z0-9+\u0026@#\/%=~()_|])/gi,0<(n=1<=arguments.length?t.call(arguments,0):[]).length?(r=n[0],o=function(){var t;for(e in t=[],r)a=r[e],"callback"!==e&&t.push(" "+e+"='"+a+"'");return t}().join(""),this.replace(i,function(t,e,n){return""+e+(("function"==typeof r.callback?r.callback(n):void 0)||"<a href='"+n+"'"+o+">"+n+"</a>")})):this.replace(i,"$1<a href='$2'>$2</a>")}}).call(this)},function(t,e,o){"use strict";o.r(e);var r=o(1),n=(o(9),o(2)),i=o.n(n),a=o(3),s=o.n(a),u=o(0),c=o.n(u),l=o(4),p=o.n(l);var f=o(5),d=o.n(f),b=o(6),h=o.n(b),v=o(7),y=o.n(v),g=o(8),x=o.n(g),_=function(t){var e,o;function r(){return t.apply(this,arguments)||this}o=t,(e=r).prototype=Object.create(o.prototype),e.prototype.constructor=e,e.__proto__=o;var n=r.prototype;return n.init=function(){this.editing=!1,this.loading=!1},n.view=function(){var t,e=this.props.user;if(this.editing)t=m("textarea",{className:"FormControl",placeholder:x()(app.translator.trans("fof-userbio.forum.userbioPlaceholder")),rows:"3",value:e.bio()});else{var o;if(this.loading)o=m("p",{className:"UserBio-placeholder"},h.a.component({size:"tiny"}));else{var r=e.bioHtml();r?o=m.trust(r):this.props.editable&&(o=m("p",{className:"UserBio-placeholder"},app.translator.trans("fof-userbio.forum.userbioPlaceholder")))}t=m("div",{className:"UserBio-content",onclick:this.edit.bind(this)},o)}return m("div",{className:"UserBio "+y()({editable:this.props.editable,editing:this.editing})},t)},n.edit=function(){if(this.props.editable){this.editing=!0,m.redraw();var t=this,e=function(e){e.shiftKey||(e.preventDefault(),t.save($(this).val()))};this.$("textarea").focus().bind("blur",e).bind("keydown","return",e)}},n.save=function(t){var e=this,o=this.props.user;o.bio()!==t&&(this.loading=!0,o.save({bio:t}).catch(function(){}).then(function(){e.loading=!1,m.redraw()})),this.editing=!1,m.redraw()},r}(d.a);app.initializers.add("fof-user-bio",function(){c.a.prototype.bio=p.a.attribute("bio"),c.a.prototype.bioHtml=i()("bio",function(t){return t?"<p>"+$("<div/>").text(t).html().replace(/\n/g,"<br>").autoLink({rel:"nofollow"})+"</p>":""}),Object(r.extend)(s.a.prototype,"infoItems",function(t){var e=this.props.user;t.add("bio",_.component({user:e,editable:this.props.editable}),-100)})})}]);
//# sourceMappingURL=forum.js.map