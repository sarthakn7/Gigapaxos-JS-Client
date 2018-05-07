var gpClient=function(t){var e={};function n(o){if(e[o])return e[o].exports;var E=e[o]={i:o,l:!1,exports:{}};return t[o].call(E.exports,E,E.exports,n),E.l=!0,E.exports}return n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:o})},n.r=function(t){Object.defineProperty(t,"__esModule",{value:!0})},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){"use strict";n.r(e);const o={REQUEST:"REQUEST",REPLICABLE_REQUEST:"REPLICABLE_REQUEST",CLIENT_REQUEST:"CLIENT_REQUEST",ECHO_REQUEST:"ECHO_REQUEST",REPLICABLE_CLIENT_REQUEST:"REPLICABLE_CLIENT_REQUEST",ACTIVE_REPLICA_ERROR:"ACTIVE_REPLICA_ERROR",CLIENT_RECONFIGURATION_PACKET:"CLIENT_RECONFIGURATION_PACKET",DELETE_SERVICE_NAME:"DELETE_SERVICE_NAME",REQUEST_ACTIVE_REPLICAS:236,CREATE_SERVICE_NAME:234,SERVER_RECONFIGURATION_PACKET:"SERVER_RECONFIGURATION_PACKET"};const E=100;let i=[];function r(){let t;do{e=1e4,n=1e16,t=Math.floor(Math.random()*(n-e+1))+e}while(i.includes(t));var e,n;return function(t){for(;i.length>=E;)i.shift();i.push(t)}(t),t}function u(t){if(t<=0)throw"Invalid number of items provided";return{capacity:t,items:new Map,get:function(t){l(t);let e=this.items.get(t);return this.items.delete(t),this.items.set(t,e),e},set:function(e,n){for(l(e),this.delete(e);this.items.size>=t;){let t=this.items.keys().next().value;this.delete(t)}this.items.set(e,n)},delete:function(t){l(t),this.items.delete(t)},hasKey:function(t){return!!c(t)&&this.items.has(t)}}}function l(t){if(!c(t))throw"Invalid key"}function c(t){return!(void 0===t||null===t||t!=t)}const s=.05,f=1e4,a=1/8;let R=u(256),_=u(256);function C(t){let e=null,n=null,o=Math.random()<s;return function(t){for(let e=t.length-1;e>0;e--){const n=Math.floor(Math.random()*(e+1));[t[e],t[n]]=[t[n],t[e]]}}(t),t.forEach(function(t){if(o&&!function(t){let e=_.get(t);return void 0!==e&&Date.now()-e>f}(t))return _.set(t,Date.now()),t;null===e&&(e=t,n=R.get(e));let E=R.get(t);void 0!==E&&void 0!==n&&E<n&&(e=t,n=E)}),e}function I(t,e){let n=R.get(t);void 0===n?R.set(t,e):R.set(t,(1-a)*n+a*e)}n.d(e,"initialize",function(){return U}),n.d(e,"createService",function(){return P}),n.d(e,"sendAppRequest",function(){return m});const d=6e4,T=300;let h,A=null,S=!1,p=[],N=function(t){let e=Date.now(),n=[];for(let e of t.ACTIVE_REPLICAS)n.push(v(e));for(A=new class{constructor(t,e){this.actives=t,this.lastUpdated=e}}(n,e),S=!1;p.length>0;){let t=p.shift();w(t.request,t.callback)}};function U(t){h=t}function v(t){let e=t.split(":"),n=parseInt(e[1])+T;return`http:/${e[0]}:${n}`}function L(t,e,n){fetch(e,{body:JSON.stringify(t),cache:"no-cache",headers:{"content-type":"application/json"},method:"POST",mode:"cors",redirect:"follow",referrer:"no-referrer"}).then(function(t){return t.json()}).then(function(t){null!==n&&void 0!==n&&n(t)}).catch(function(t){console.log("Error : "+t)})}function P(t,e,n){M(),L({IS_QUERY:!0,EPOCH:0,RECURSIVE_REDIRECT:!0,CREATE_TIME:Date.now(),TYPE:o.CREATE_SERVICE_NAME,RECONFIGURE_UPON_ACTIVES_CHANGE:"REPLICATE_ALL",serviceName:t,initialState:e,QID:r(),NAME:"**"},h,n)}function O(t,e){L({IS_QUERY:!0,RECURSIVE_REDIRECT:!0,CREATE_TIME:Date.now(),TYPE:o.REQUEST_ACTIVE_REPLICAS,QID:r(),NAME:t},h,e)}function m(t,e,n,o){M();let E={REQUEST_ID:r(),SERVICE_NAME:t,type:e};for(let t in n){if(void 0!==E[t])throw"Key : {key} cannot be added to content as it is reserved for internal function";E[t]=n[t]}w(E,function(t,e){let n=Date.now();return function(o){e(o);let E=Date.now()-n;I(t,E)}}(E,o))}function M(){if(void 0===h)throw"Client not initialized"}function w(t,e){if(S)Q(t,e);else if(null!==A&&A.actives.length>0&&null!==A&&null!==A.lastUpdated&&Date.now()-A.lastUpdated<d){L(t,C(A.actives),e)}else Q(t,e),n=t.SERVICE_NAME,S=!0,O(n,N);var n}function Q(t,e){p.push({request:t,callback:e})}}]);