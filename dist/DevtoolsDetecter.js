!function(e,o){"object"==typeof exports&&"undefined"!=typeof module?module.exports=o():"function"==typeof define&&define.amd?define(o):(e="undefined"!=typeof globalThis?globalThis:e||self).DevtoolsDetecter=o()}(this,(function(){"use strict";return function(){let e=!1,o=!1,t=!1,r=7e6,n=1e3,c=500,a=null,_=null;const i=()=>e||o,l=[],s=()=>{for(const o of l)try{o(i())}catch(e){}},d=e=>{if(t){const o=document.createElement("div");o.innerHTML=`${e}<br>`,document.body.append(o)}},u=()=>{try{const e=[Object,Array,Set,Map,RegExp,String,""];for(const o of e)if(o&&o.__proto__&&o.__proto__.__proto__&&o.__proto__.__proto__.constructor&&"Object"==o.__proto__.__proto__.constructor.name)return o;for(const o of Object.keys(window))if(window[o]&&window[o].__proto__&&window[o].__proto__.__proto__&&window[o].__proto__.__proto__.constructor&&"Object"==window[o].__proto__.__proto__.constructor.name)return window[o]}catch(e){}},m=(e,o,t,r)=>{const n=u().__proto__.__proto__;void 0===n[e]&&(n[e]={}),n[e][o]=t.bind(r)},p=()=>{try{return S.random().toString(36).substring(2)}catch(e){return Math.random().toString(36).substring(2)}},f=e=>window[e]||document[e]||u()[e],w=(e,o)=>{const t=p();return((e,o,t)=>{u().__proto__.__proto__[e]=o.bind(t)})(t,e,o),f(t)},g=p();["log","clear"].forEach((function(e){m(g,e,console[e],console)}));const h=w(setInterval,window),v=w(performance.now,performance),y=w(Int8Array,window),b=p();["pow","min","max","random"].forEach((function(e){m(b,e,Math[e],Math)}));const S=f(b),$=f(g),T=console,x=document.createElement("div");Object.defineProperty(x,"id",{get:()=>{o=!0,d("**** !!!!!! [Getter Hack] DevTools detected !!!!! ****"),s()}});const j=()=>{o=!1,T.log(x),T.clear(x)},M=e=>{let o=0;for(let t=0;t<e.length;t++)o+=e[t];return o/e.length},k=(e,o)=>{e.push(o),e.length>5&&e.shift()};let E=()=>{const e=v(),o=r,t=new y(o+1);for(var n=2;n<=o;++n)if(0===t[n])for(var c=n*n;c<=o;c+=n)t[c]=1;return v()-e};const H=[],A=[],D=[];let L=-1;const O=E();let C=O,I=O;const z=()=>{L++;const o=v();for(let e=0;e<n;e++)$.log||alert("Hacked!"),$.log(e),$.clear();const t=v()-o;if(k(H,t),d(H),L&&L%5==0){const o=M(H),t=(e=>{let o=M(e),t=0;for(let r=0;r<e.length;r++)t+=S.pow(e[r]-o,2);return t/e.length})(H);k(A,o),k(D,t),d(`=== Average: ${o} Variance: ${t} === `),o>C||o>.85*C&&t>I&&M([H[0],H[1],H[2]])<M([H[1],H[2],H[3]])&&M([H[1],H[2],H[3]])<M([H[2],H[3],H[4]])?(e=!0,d("**** !!!!!! DevTools detected !!!!! ****")):(e=!1,L>=25&&(C=M([S.min(S.max(...A),C),O]),I=M([S.min(S.max(...D),I),O]),d(`=== AverageCriticalLevel: ${C} VarianceCriticalLevel: ${I} ===`)))}B(),s()},B=()=>{var o;e||"undefined"!=typeof eruda&&(!0===(null==(o=null==eruda?void 0:eruda._devTools)?void 0:o._isShow)?(e=!0,d("**** !!!!!! [Eruda] DevTools detected !!!!! ****")):e=!1)};return new class{debug(){t=!0,d(`ua: ${navigator.userAgent}`),d(`hardwareConcurrency: ${navigator.hardwareConcurrency}`),performance&&performance.memory&&(d(`memory used: ${performance.memory.usedJSHeapSize}`),d(`memory total: ${performance.memory.totalJSHeapSize}`),d(`memory limit: ${performance.memory.jsHeapSizeLimit}`)),d(`Benchmark: ${O}`)}getStatus(){return i()}setBenchmarkMaxN(e){r=e}setTimingSamplingMaxN(e){n=e}setBenchmark(e){E=e}setTimer(e){c=e}addListener(e){l.push(e)}launch(){a=h(z,c),_=h(j,c)}stop(){clearInterval(a),clearInterval(_)}}}()}));
//# sourceMappingURL=DevtoolsDetecter.js.map
