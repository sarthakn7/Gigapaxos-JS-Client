var gpClient=function(t){var e={};function n(i){if(e[i])return e[i].exports;var o=e[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:i})},n.r=function(t){Object.defineProperty(t,"__esModule",{value:!0})},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){"use strict";n.r(e);const i={REQUEST:"REQUEST",REPLICABLE_REQUEST:"REPLICABLE_REQUEST",CLIENT_REQUEST:"CLIENT_REQUEST",ECHO_REQUEST:"ECHO_REQUEST",REPLICABLE_CLIENT_REQUEST:"REPLICABLE_CLIENT_REQUEST",ACTIVE_REPLICA_ERROR:"ACTIVE_REPLICA_ERROR",CLIENT_RECONFIGURATION_PACKET:"CLIENT_RECONFIGURATION_PACKET",DELETE_SERVICE_NAME:"DELETE_SERVICE_NAME",REQUEST_ACTIVE_REPLICAS:236,CREATE_SERVICE_NAME:234,SERVER_RECONFIGURATION_PACKET:"SERVER_RECONFIGURATION_PACKET"};const o=100;let E=[];function r(){let t;do{e=1e4,n=1e16,t=Math.floor(Math.random()*(n-e+1))+e}while(E.includes(t));var e,n;return function(t){for(;E.length>=o;)E.shift();E.push(t)}(t),t}function u(t){if(t<=0)throw"Invalid number of items provided";return{capacity:t,items:new Map,get:function(t){c(t);let e=this.items.get(t);return this.items.delete(t),this.items.set(t,e),e},set:function(e,n){for(c(e),this.delete(e);this.items.size>=t;){let t=this.items.keys().next().value;this.delete(t)}this.items.set(e,n)},delete:function(t){c(t),this.items.delete(t)},hasKey:function(t){return!!l(t)&&this.items.has(t)}}}function c(t){if(!l(t))throw"Invalid key"}function l(t){return!(void 0===t||null===t||t!=t)}const s=.05,f=1e4,a=1/8;let R=u(256),_=u(256);function d(t){let e=null,n=null,i=Math.random()<s;return function(t){for(let e=t.length-1;e>0;e--){const n=Math.floor(Math.random()*(e+1));[t[e],t[n]]=[t[n],t[e]]}}(t),t.forEach(function(t){if(i&&!function(t){let e=_.get(t);return void 0!==e&&Date.now()-e>f}(t))return _.set(t,Date.now()),t;null===e&&(e=t,n=R.get(e));let o=R.get(t);void 0!==o&&void 0!==n&&o<n&&(e=t,n=o)}),e}function C(t,e){let n=R.get(t);void 0===n?R.set(t,e):R.set(t,(1-a)*n+a*e)}n.d(e,"initialize",function(){return P}),n.d(e,"createService",function(){return L}),n.d(e,"sendDispersibleRequest",function(){return M}),n.d(e,"sendAppRequest",function(){return Q});const I=6e4,T=300;let h,A=null,S=!1,p=[],N=function(t){let e=Date.now(),n=[];for(let e of t.ACTIVE_REPLICAS)n.push(U(e));for(A=new class{constructor(t,e){this.actives=t,this.lastUpdated=e}}(n,e),S=!1;p.length>0;){let t=p.shift();D(t.request,t.callback)}};function P(t){h=t}function U(t){let e=t.split(":"),n=parseInt(e[1])+T;return`http:/${e[0]}:${n}`}function v(t,e,n){fetch(e,{body:JSON.stringify(t),cache:"no-cache",headers:{"content-type":"application/json"},method:"POST",mode:"cors",redirect:"follow",referrer:"no-referrer"}).then(function(t){return t.json()}).then(function(t){null!==n&&void 0!==n&&n(t)}).catch(function(t){console.log("Error : "+t)})}function L(t,e,n){w(),v({IS_QUERY:!0,EPOCH:0,RECURSIVE_REDIRECT:!0,CREATE_TIME:Date.now(),TYPE:i.CREATE_SERVICE_NAME,RECONFIGURE_UPON_ACTIVES_CHANGE:"REPLICATE_ALL",serviceName:t,initialState:e,QID:r(),NAME:"**"},h,n)}function O(t){S=!0,function(t,e){v({IS_QUERY:!0,RECURSIVE_REDIRECT:!0,CREATE_TIME:Date.now(),TYPE:i.REQUEST_ACTIVE_REPLICAS,QID:r(),NAME:t},h,e)}(t,N)}const m=2e3;function M(t,e,n){var i;Q(t,m,{APP_REQUEST:e},(i=n,function(t){let e=JSON.parse(t.APP_RESPONSE);i(e)}))}function Q(t,e,n,i){w();let o={REQUEST_ID:r(),SERVICE_NAME:t,type:e};for(let t in n){if(void 0!==o[t])throw"Key : {key} cannot be added to content as it is reserved for internal function";o[t]=n[t]}D(o,function(t,e){let n=Date.now();return function(i){e(i);let o=Date.now()-n;C(t,o)}}(o,i))}function w(){if(void 0===h)throw"Client not initialized"}function D(t,e){if(S)V(t,e);else if(null!==A&&A.actives.length>0&&null!==A&&null!==A.lastUpdated&&Date.now()-A.lastUpdated<I){v(t,d(A.actives),e)}else V(t,e),O(t.SERVICE_NAME)}function V(t,e){p.push({request:t,callback:e})}}]);