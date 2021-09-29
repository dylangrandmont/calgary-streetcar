var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function o(t){t.forEach(e)}function r(t){return"function"==typeof t}function i(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function a(t,e){t.appendChild(e)}function s(t,e,n){t.insertBefore(e,n||null)}function c(t){t.parentNode.removeChild(t)}function l(t){return document.createElement(t)}function d(t){return document.createTextNode(t)}function u(){return d(" ")}function S(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function p(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function f(t){return""===t?null:+t}function m(t,e){t.value=null==e?"":e}let h;function g(t){h=t}function v(t){(function(){if(!h)throw new Error("Function called outside component initialization");return h})().$$.on_mount.push(t)}const $=[],y=[],A=[],W=[],w=Promise.resolve();let b=!1;function N(t){A.push(t)}function k(t){W.push(t)}let x=!1;const E=new Set;function C(){if(!x){x=!0;do{for(let t=0;t<$.length;t+=1){const e=$[t];g(e),L(e.$$)}for(g(null),$.length=0;y.length;)y.pop()();for(let t=0;t<A.length;t+=1){const e=A[t];E.has(e)||(E.add(e),e())}A.length=0}while($.length);for(;W.length;)W.pop()();b=!1,x=!1,E.clear()}}function L(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(N)}}const T=new Set;let _;function R(){_={r:0,c:[],p:_}}function I(){_.r||o(_.c),_=_.p}function q(t,e){t&&t.i&&(T.delete(t),t.i(e))}function K(t,e,n,o){if(t&&t.o){if(T.has(t))return;T.add(t),_.c.push((()=>{T.delete(t),o&&(n&&t.d(1),o())})),t.o(e)}}function M(t,e,n){const o=t.$$.props[e];void 0!==o&&(t.$$.bound[o]=n,n(t.$$.ctx[o]))}function j(t){t&&t.c()}function B(t,n,i,a){const{fragment:s,on_mount:c,on_destroy:l,after_update:d}=t.$$;s&&s.m(n,i),a||N((()=>{const n=c.map(e).filter(r);l?l.push(...n):o(n),t.$$.on_mount=[]})),d.forEach(N)}function P(t,e){const n=t.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function z(t,e){-1===t.$$.dirty[0]&&($.push(t),b||(b=!0,w.then(C)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function F(e,r,i,a,s,l,d,u=[-1]){const S=h;g(e);const p=e.$$={fragment:null,ctx:null,props:l,update:t,not_equal:s,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(r.context||(S?S.$$.context:[])),callbacks:n(),dirty:u,skip_bound:!1,root:r.target||S.$$.root};d&&d(p.root);let f=!1;if(p.ctx=i?i(e,r.props||{},((t,n,...o)=>{const r=o.length?o[0]:n;return p.ctx&&s(p.ctx[t],p.ctx[t]=r)&&(!p.skip_bound&&p.bound[t]&&p.bound[t](r),f&&z(e,t)),n})):[],p.update(),f=!0,o(p.before_update),p.fragment=!!a&&a(p.ctx),r.target){if(r.hydrate){const t=function(t){return Array.from(t.childNodes)}(r.target);p.fragment&&p.fragment.l(t),t.forEach(c)}else p.fragment&&p.fragment.c();r.intro&&q(e.$$.fragment),B(e,r.target,r.anchor,r.customElement),C()}g(S)}class H{$destroy(){P(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function O(e){let n,r,i,f,h,g,v,$,y,A,W,w,b,N,k;return{c(){n=l("div"),r=l("b"),r.textContent="Controls",i=u(),f=l("p"),h=l("div"),g=d("Adjust Speed\n            "),v=l("input"),$=d("\n            Car Icon Size\n            "),y=l("input"),A=d("\n            Show Legend\n            "),W=l("input"),w=d("\n            Allow Sound\n            "),b=l("input"),p(v,"type","range"),p(v,"min","0"),p(v,"max","0.000005"),p(v,"step","0.0000001"),p(y,"type","range"),p(y,"min","10"),p(y,"max","100"),p(W,"type","checkbox"),p(b,"type","checkbox"),p(h,"class","grid svelte-1v00eo1"),p(n,"class","panel-container root svelte-1v00eo1")},m(t,o){s(t,n,o),a(n,r),a(n,i),a(n,f),a(n,h),a(h,g),a(h,v),m(v,e[0]),a(h,$),a(h,y),m(y,e[3]),a(h,A),a(h,W),W.checked=e[1],a(h,w),a(h,b),b.checked=e[2],N||(k=[S(v,"change",e[4]),S(v,"input",e[4]),S(y,"change",e[5]),S(y,"input",e[5]),S(W,"change",e[6]),S(b,"change",e[7])],N=!0)},p(t,[e]){1&e&&m(v,t[0]),8&e&&m(y,t[3]),2&e&&(W.checked=t[1]),4&e&&(b.checked=t[2])},i:t,o:t,d(t){t&&c(n),N=!1,o(k)}}}function D(t,e,n){let{speed:o}=e,{showLegend:r}=e,{allowSound:i}=e,a=50;return t.$$set=t=>{"speed"in t&&n(0,o=t.speed),"showLegend"in t&&n(1,r=t.showLegend),"allowSound"in t&&n(2,i=t.allowSound)},t.$$.update=()=>{8&t.$$.dirty&&document.documentElement.style.setProperty("--car-icon-size",`${a}px`)},[o,r,i,a,function(){o=f(this.value),n(0,o)},function(){a=f(this.value),n(3,a)},function(){r=this.checked,n(1,r)},function(){i=this.checked,n(2,i)}]}class Z extends H{constructor(t){super(),F(this,t,D,O,i,{speed:0,showLegend:1,allowSound:2})}}const J={"20 Av N":{"7 St NW":[-114.07893964039631,51.07054169892371],"Center St":[-114.06257393380261,51.070609731750714]},"16 Av N":{"10 St NW":[-114.08489350460921,51.066904001348],"Edmonton Trail":[-114.05618395994925,51.06693626186497]},"8 Av N":{"14 St NW":[-114.09475415944235,51.0574984522886]},"7 Av N":{"24 St NW":[-114.11806377866809,51.05914040581638]},"5 Av N":{"14 St NW":[-114.094731781486,51.05709687083791],"10 St NW":[-114.08599386788937,51.05712357695188]},"Kensington Rd":{"10 St NW":[-114.08592990014981,51.05253712700806],"14 St NW":[-114.0947245349653,51.052520631762604],"24 St NW":[-114.11796612252739,51.052485028711544]},"Memorial Dr":{"10 St NW":[-114.08569923100222,51.0518089710593]},"4 Av S":{"9 St SW":[-114.08352065905363,51.049901659316184],"4 St SW":[-114.07157412631952,51.049578034093955]},"8 Av S":{"9 St SW":[-114.0837042074354,51.0461550109985],"8 St SW":[-114.0812599513191,51.04605708217247],"4 St SW":[-114.07148474434986,51.045764491004334],"1 St SW":[-114.06548890682399,51.04560095291732],"Center St":[-114.06298135443159,51.045518122829684],"2 St SE":[-114.0581207853938,51.045354064328095],"4 St SE":[-114.05320870960337,51.04526820411377],"6 St SE":[-114.04834008539397,51.04513188716467]},"9 Av S":{"6 St E":[-114.0483529394385,51.04411080434035]},"12 Av S":{"18 St SW":[-114.1042183736658,51.0425847226566],"14 St SW":[-114.09467317597523,51.042302050146354],"8 St SW":[-114.08154153696147,51.04194719189309],"1 St SW":[-114.06580161010373,51.041488891337764],"2 St SE":[-114.05843117123706,51.041277794230425]},"17 Av S":{"29 St SW":[-114.1237226937469,51.033190262669265],"26 St SW":[-114.12371714702843,51.03784613000478],"14 St SW":[-114.09472267063069,51.03781458725867],"2 St SE":[-114.05865238987491,51.03783086571737],"1 St SW":[-114.06605539761398,51.03781793732603]},"23 Av S":{"29 St SW":[-114.12956914789937,51.033161877914324],"26 St SW":[-114.12959468827377,51.03780459079984]},"26 Av S":{"14 St SW":[-114.09474547223127,51.0304330356334],"20 St SW":[-114.10944297855941,51.030420176040515]},"34 Av S":{"20 St SW":[-114.10930326307387,51.02316898218637],"14 St SW":[-114.09472699485453,51.0232217172826]}};function Y(t){return{type:"Feature",properties:{},geometry:{type:"LineString",coordinates:t}}}const G=Y([J["Kensington Rd"]["10 St NW"],J["Kensington Rd"]["14 St NW"],J["5 Av N"]["14 St NW"],J["5 Av N"]["10 St NW"],J["Kensington Rd"]["10 St NW"],J["Memorial Dr"]["10 St NW"],J["4 Av S"]["9 St SW"],J["8 Av S"]["9 St SW"],J["8 Av S"]["6 St SE"],J["9 Av S"]["6 St E"],[-114.04317766836698,51.04372702045797],[-114.0372805028625,51.0422846914819],[-114.03682431075224,51.04219493204588],[-114.01802378219071,51.03451108917668],[-114.01917322421849,51.03349617324513],[-114.01918637603683,51.02713982395138]]),Q=Y([[-114.07438791506914,51.059249914924834],[-114.07439302541748,51.058954415693634],[-114.07397908720161,51.05894718878665],[-114.0738134921497,51.059023623559156],[-114.07378617155163,51.059099756583784],[-114.07391265267314,51.05922502239929],[-114.07395225787279,51.0592523238782],[-114.07598880340164,51.05926055903463],[-114.07619997133722,51.059205465868125],[-114.08450858528214,51.05419424511214],[-114.08593936152991,51.054067658980074],[-114.08593093455498,51.05254113041264],[-114.08577077297342,51.051922371373465],[-114.08369765853143,51.05011674810018],[-114.07157412631952,51.049578034093955],[-114.07148474434986,51.045764491004334],[-114.05813966180291,51.04537576453928],[-114.05844021989171,51.04127328181791],[-114.04684772767578,51.04094865694908],[-114.04503824021275,51.04147175374527],[-114.04402950308892,51.041157896379644],[-114.04194443293214,51.04122328349537],[-114.04119794256063,51.036274899551046],[-114.03680515732096,51.03620362085858],[-114.03678306341874,51.03456621220615],[-114.04279105525517,51.03463817661564],[-114.04119794256063,51.036274899551046]]),V=Y([[-114.03245254193595,51.0532361007371],[-114.05027216576363,51.05327391988086],[-114.05037125129785,51.050621738210474],[-114.05154533464692,51.04891295247008],[-114.05294643069912,51.04800145363462],[-114.0530456818646,51.04758695979581],J["8 Av S"]["4 St SE"],J["8 Av S"]["1 St SW"],J["12 Av S"]["1 St SW"],J["12 Av S"]["2 St SE"],J["17 Av S"]["2 St SE"],[-114.05891505161102,51.0350793399651],[-114.05947295099163,51.03361864160707],[-114.05956748319745,51.028709978619666],[-114.0593027589476,51.027660134295886],[-114.05892634373404,51.02510608380651],[-114.05932343005291,51.023279104890236],[-114.06782981960919,51.008736940208166],[-114.06791129417206,51.00860654344027],[-114.06779864140104,51.00859304219302],[-114.06771817513604,51.008680800229925],[-114.06776913710388,51.008873192268275]]),U=Y([J["26 Av S"]["14 St SW"],J["26 Av S"]["20 St SW"],J["34 Av S"]["20 St SW"],J["34 Av S"]["14 St SW"],J["26 Av S"]["14 St SW"],J["17 Av S"]["14 St SW"],J["17 Av S"]["1 St SW"],J["8 Av S"]["1 St SW"],J["8 Av S"]["8 St SW"],J["12 Av S"]["8 St SW"],J["12 Av S"]["14 St SW"],J["17 Av S"]["14 St SW"]]),X=1e-4,tt=Y([J["17 Av S"]["26 St SW"],J["17 Av S"]["29 St SW"],J["23 Av S"]["29 St SW"],J["23 Av S"]["26 St SW"],J["17 Av S"]["26 St SW"],J["17 Av S"]["14 St SW"],J["17 Av S"]["1 St SW"],J["8 Av S"]["1 St SW"],J["8 Av S"]["8 St SW"],J["12 Av S"]["8 St SW"],J["12 Av S"]["14 St SW"],J["17 Av S"]["14 St SW"]]),et=Y([J["16 Av N"]["10 St NW"],J["16 Av N"]["Edmonton Trail"],[-114.05624889447328,51.064177528209555],[-114.05617332900455,51.06366447705205],[-114.055130964576,51.060773093744004],[-114.05441634348082,51.059737261561885],[-114.0543247069982,51.05940321266864],[-114.0543155433623,51.057306712815574],[-114.05419641589222,51.057053283320336],[-114.05091582965353,51.05462259367253],[-114.0505461201982,51.054277121167935],[-114.05031132244514,51.05379827082477],[-114.05026958062238,51.053542444639504],[-114.05027216576363,51.05327391988086],[-114.05037125129785,51.050621738210474],[-114.05154533464692,51.04891295247008],[-114.05294643069912,51.04800145363462],[-114.0530456818646,51.04758695979581],J["8 Av S"]["4 St SE"],J["8 Av S"]["1 St SW"],J["8 Av S"]["4 St SW"],J["4 Av S"]["4 St SW"],J["4 Av S"]["9 St SW"],[-114.08577077297342,51.051922371373465],[-114.08593093455498,51.05254113041264],J["Kensington Rd"]["10 St NW"],J["5 Av N"]["10 St NW"],[-114.08600802217786,51.060942096287185],[-114.08531548906264,51.06224265404931],[-114.08458173372296,51.06297582091535],[-114.08442921154641,51.0635328127249],[-114.08489350460921,51.066904001348]]),nt=Y([J["20 Av N"]["7 St NW"],J["20 Av N"]["Center St"],J["8 Av S"]["Center St"],J["8 Av S"]["1 St SW"],J["12 Av S"]["1 St SW"],[-114.07156268197173,51.041667315481085],[-114.07151627155552,51.02970016087958],[-114.07314144774193,51.02963947142243],[-114.0755837013509,51.02889675928498],[-114.0781177043355,51.02739885277752],[-114.07846226790436,51.02707203118832],[-114.07883916075279,51.02612382969992],[-114.07791852502602,51.023378286034514],[-114.0778335229034,51.01850581066723]]),ot=Y([[-114.0625666284332,51.08051761717556],[-114.06249866849501,51.07331231657526],[-114.05634463964452,51.07333567547062],[-114.05610152100759,51.07065978671271],J["16 Av N"]["Edmonton Trail"],[-114.06257210372549,51.06691570029229],[-114.06249866849501,51.07331231657526],[-114.06257393380261,51.070609731750714],J["20 Av N"]["Center St"],J["8 Av S"]["Center St"],J["8 Av S"]["1 St SW"],J["12 Av S"]["1 St SW"],[-114.07156268197173,51.041667315481085],[-114.07151627155552,51.02970016087958],[-114.07314144774193,51.02963947142243],[-114.0755837013509,51.02889675928498],[-114.0781177043355,51.02739885277752],[-114.07846226790436,51.02707203118832],[-114.07883916075279,51.02612382969992],[-114.07791852502602,51.023378286034514],[-114.0778335229034,51.01850581066723]]),rt=Y([[-113.99880112307753,50.983248488266135],[-113.99880112307753,50.987371763615506],[-113.99888670668788,50.987545713885496],[-114.00005187171867,50.98878996323262],[-114.00159999561538,50.990490665877374],[-114.00166551550875,50.9906080452611],[-114.00172095541853,50.99114100737745],[-114.0017864753119,50.99130914296567],[-114.01110138901603,51.00105099313635],[-114.01172122501146,51.001818058317504],[-114.01230252185889,51.003199148246],[-114.01234337044255,51.00500831623873],[-114.01191629520771,51.006180298382226],[-114.01058666914153,51.0100959143063],[-114.01058666914994,51.010828735644054],[-114.0109922438028,51.011594259836336],[-114.01142901650589,51.01201954559441],[-114.01180339320818,51.01231397195058],[-114.01423684112537,51.01387112894279],[-114.01454882176026,51.01425713882235],[-114.01788701336052,51.01798622084238],[-114.01891949877961,51.01852163349035],[-114.01975743774038,51.018580202515885],[-114.02820685105861,51.01862211037978],[-114.02906393494493,51.01869751785368],[-114.02948348649765,51.019025538938045],[-114.03073148263177,51.02138176798409],[-114.03082952608338,51.02189981247443],[-114.03092064513434,51.028443729037924],[-114.03100045091638,51.02887663830172],[-114.03176858158336,51.0298177314818],[-114.0307610335851,51.03031964001304],[-114.02702472821282,51.03300216008723],[-114.02584759269875,51.03359186156952],[-114.02220645389316,51.033472667201714],[-114.02206782333698,51.03636936360178],[-114.03682431075224,51.04219493204588],[-114.0372805028625,51.0422846914819],[-114.04317766836698,51.04372702045797],J["9 Av S"]["6 St E"],J["8 Av S"]["6 St SE"],J["8 Av S"]["Center St"]]),it=Y([[-114.09721714004105,51.0705377462257],[-114.0849017998016,51.07053755601367],J["16 Av N"]["10 St NW"],[-114.0849017998016,51.07053755601367],[-114.09721714004105,51.0705377462257]]),at=Y([J["7 Av N"]["24 St NW"],[-114.11749161875599,51.05912442302438],[-114.10647790194818,51.059137846330714],[-114.10588883907864,51.05925817306614],[-114.10568580828625,51.059485094360774],[-114.10541778468061,51.059603569029434],[-114.10520277673322,51.05964614578945],[-114.09474606923256,51.05970225119184],J["8 Av N"]["14 St NW"],J["Kensington Rd"]["14 St NW"],J["Kensington Rd"]["10 St NW"],J["4 Av S"]["9 St SW"],J["8 Av S"]["9 St SW"],J["8 Av S"]["Center St"],J["8 Av S"]["9 St SW"],J["4 Av S"]["9 St SW"],J["Kensington Rd"]["10 St NW"],J["Kensington Rd"]["14 St NW"],J["Kensington Rd"]["24 St NW"],J["7 Av N"]["24 St NW"]]),st=Y([J["Kensington Rd"]["14 St NW"],J["Kensington Rd"]["10 St NW"],J["4 Av S"]["9 St SW"],J["8 Av S"]["9 St SW"],J["8 Av S"]["Center St"],J["8 Av S"]["9 St SW"],J["4 Av S"]["9 St SW"],J["Kensington Rd"]["10 St NW"],J["Kensington Rd"]["14 St NW"],[-114.11796612252739,51.052485028711544],[-114.12133858712923,51.05248009534121],[-114.12190382103606,51.05260445393406],[-114.12583617050362,51.05429131835533],[-114.12638789806529,51.05447084161884],[-114.13370519322709,51.05643249447681],[-114.13444515725314,51.056738485476366],[-114.14068499379347,51.05985019419703],[-114.14132759415365,51.060139844346935],[-114.14912764908298,51.06346210971278],[-114.15054294822237,51.06405123585141],[-114.15113894412244,51.065417418079356],[-114.15148177301391,51.06584750392453],[-114.1526520281249,51.06671232422135],[-114.16348115846756,51.074816814789145],[-114.16423454167781,51.07523967616143],[-114.16574130792006,51.075416393199546],[-114.16574130792006,51.07541323754493],[-114.16693165330277,51.07529963380956],[-114.16763262787953,51.075361873392566],[-114.16840107868614,51.07567743822706],[-114.17077740996558,51.07739588174196],[-114.17126962026164,51.07768303320474],[-114.1720129582852,51.07833621726261],[-114.17316207239337,51.07984729297398]]),ct=Y([J["17 Av S"]["1 St SW"],J["8 Av S"]["1 St SW"],J["8 Av S"]["8 St SW"],J["12 Av S"]["8 St SW"],J["12 Av S"]["14 St SW"],J["17 Av S"]["14 St SW"],J["17 Av S"]["2 St SE"],J["8 Av S"]["2 St SE"],J["8 Av S"]["1 St SW"]]),lt=Y([J["12 Av S"]["18 St SW"],J["12 Av S"]["2 St SE"],J["8 Av S"]["2 St SE"],J["8 Av S"]["Center St"]]);function dt(t){return{...t,geometry:{...t.geometry,coordinates:t.geometry.coordinates.map((t=>[t[0]+X,t[1]+X]))}}}const ut=[{data:G,id:"hillhurst-inglewood-route",color:"#e7067d",name:"No. 1 Hillhurst - E Calgary"},{data:Q,id:"sunnyside-ramsay-route",color:"#fee300",name:"No. 8 Burns Avenue-Sunnyside"},{data:V,id:"riverside-manchester-route",color:"black",name:"No. 9 Manchester-Riverside"},{data:U,id:"southcalgary-route",color:"#f29517",name:"No. 7 South Calgary"},{data:dt(tt),id:"killarney-route",color:"#2f71bc",name:"No. 6 Killarney"},{data:dt(et),id:"crescent-height-route",color:"#00aaef",name:"No. 4 Crescent Heights"},{data:nt,id:"mount-pleasant-route",color:"#e82326",name:"No. 2 Mount Pleasant"},{data:dt(ot),id:"tuxedo-park-route",color:"#4a4ca5",name:"No. 3 Tuxedo Park"},{data:dt(rt),id:"ogden-route",color:"#835A39",name:"No. O Ogden - Downtown"},{data:it,id:"capitol-hill-route",color:"#b20168",name:"No. C Capitol Hill - Rosedale"},{data:dt(at),id:"grand-trunk-route",color:"#74cabe",name:"No. A Grand Trunk"},{data:dt(dt(st)),id:"bowness-route",color:"#b6449f",name:"No. B Bowness"},{data:dt(dt(ct)),id:"beltline-route",color:"#3aba72",name:"No. 5 Beltline"},{data:lt,id:"sunalta-route",color:"#d7e34d",name:"No. S Sunalta"}].sort((function(t,e){return t.name<e.name?-1:1}));function St(t){let e,n;return{c(){e=l("div"),p(e,"class","line svelte-nu6ips"),p(e,"style",n=`background-color: ${t[0].color}`)},m(t,n){s(t,e,n)},p(t,o){1&o&&n!==(n=`background-color: ${t[0].color}`)&&p(e,"style",n)},d(t){t&&c(e)}}}function pt(t){let e,n;return{c(){e=l("div"),p(e,"class","line svelte-nu6ips"),p(e,"style",n=`background: repeating-linear-gradient(\n        to right,\n        ${t[0].color},\n        ${t[0].color} 2px,\n        white 4px,\n        white 6px\n              )`)},m(t,n){s(t,e,n)},p(t,o){1&o&&n!==(n=`background: repeating-linear-gradient(\n        to right,\n        ${t[0].color},\n        ${t[0].color} 2px,\n        white 4px,\n        white 6px\n              )`)&&p(e,"style",n)},d(t){t&&c(e)}}}function ft(e){let n,o,r,i=e[0].name+"";function S(t,e){return t[1]?pt:St}let f=S(e),m=f(e);return{c(){n=l("div"),m.c(),o=u(),r=d(i),p(n,"class","flex row svelte-nu6ips")},m(t,e){s(t,n,e),m.m(n,null),a(n,o),a(n,r)},p(t,[e]){f===(f=S(t))&&m?m.p(t,e):(m.d(1),m=f(t),m&&(m.c(),m.m(n,o))),1&e&&i!==(i=t[0].name+"")&&function(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}(r,i)},i:t,o:t,d(t){t&&c(n),m.d()}}}function mt(t,e,n){let{route:o}=e,{dashed:r=!1}=e;return t.$$set=t=>{"route"in t&&n(0,o=t.route),"dashed"in t&&n(1,r=t.dashed)},[o,r]}class ht extends H{constructor(t){super(),F(this,t,mt,ft,i,{route:0,dashed:1})}}function gt(t){let e,n,o,i,d,f,m,h;return o=new ht({props:{route:t[1]}}),{c(){e=l("div"),n=l("div"),j(o.$$.fragment),i=u(),d=l("button"),d.textContent="Stop Tracking",p(n,"class","flex header"),p(d,"class","svelte-706qqo"),p(e,"class","panel-container")},m(c,l){s(c,e,l),a(e,n),B(o,n,null),a(e,i),a(e,d),f=!0,m||(h=S(d,"click",(function(){r(t[0])&&t[0].apply(this,arguments)})),m=!0)},p(e,[n]){t=e},i(t){f||(q(o.$$.fragment,t),f=!0)},o(t){K(o.$$.fragment,t),f=!1},d(t){t&&c(e),P(o),m=!1,h()}}}function vt(t,e,n){let{selectedId:o}=e,{stopTracking:r}=e;const i=ut.find((({id:t})=>t===o));return t.$$set=t=>{"selectedId"in t&&n(2,o=t.selectedId),"stopTracking"in t&&n(0,r=t.stopTracking)},[r,i,o]}class $t extends H{constructor(t){super(),F(this,t,vt,gt,i,{selectedId:2,stopTracking:0})}}function yt(e){let n;return{c(){n=l("div"),n.innerHTML='<b>A Brief History</b> \n    <p>Prior to WWII, streetcar networks were very common throughout North America.\n      These networks had frequent service, were well connected,\n      and enabled people to live beyond walking distance from their employment. These networks enabled the first boom of\n      suburbanization, well before the widespread use of private automobiles.</p> \n    <p>Calgary&#39;s network was first constructed in 1909 and continued operation for over four decades.\n      The map shown here represents the network as it existed in 1945.</p> \n    <p>Access to these networks was an important contributor to land value. Developers would often petition city governments to construct\n      these lines to support new neighbourhoods. In Calgary, the Municipal Railway operated a network connecting residents to commercial districts in the city center,\n      industrial sectors in Inglewood, Riverside, Manchester, and the CPR rail yards at the sourthern edge of the city. One line of the\n      network went to the natural parks at Bowness.</p> \n    <p>In the 1940s and 1950s, these networks were frequently dismantled in favour of bus service, and more importantly, the use of private\n      automobiles. Calgary&#39;s system was retired in 1950. Traces of the network, such as the 5th Street loop in Sunnyside, can still be seen to this day.\n      Explore the map to learn more about this network. Click on a car to track its route.</p> \n    <p>This visualization was inspired by <a href="https://saadiqm.com/2019/04/13/calgary-historic-streetcar-map.html">Saadiq Mohiuddin&#39;s blog post of the Municipal Railway</a>.</p> \n    <p>If you have feedback or want to make a contribution, you can reach me by <a href="https://github.com/dylangrandmont/calgary-streetcar/issues">leaving an issue or pull request on github</a> or by <a href="https://twitter.com/dylan_grandmont">tweeting at me</a>.</p>',p(n,"class","panel-container root svelte-1s3mh19")},m(t,e){s(t,n,e)},p:t,i:t,o:t,d(t){t&&c(n)}}}class At extends H{constructor(t){super(),F(this,t,null,yt,i,{})}}function Wt(t,e,n){const o=t.slice();return o[0]=e[n],o}function wt(e){let n,o;return n=new ht({props:{route:e[0]}}),{c(){j(n.$$.fragment)},m(t,e){B(n,t,e),o=!0},p:t,i(t){o||(q(n.$$.fragment,t),o=!0)},o(t){K(n.$$.fragment,t),o=!1},d(t){P(n,t)}}}function bt(t){let e,n,o,r,i,d,S,f=ut,m=[];for(let e=0;e<f.length;e+=1)m[e]=wt(Wt(t,f,e));const h=t=>K(m[t],1,1,(()=>{m[t]=null}));return d=new ht({props:{route:{color:"black",name:"City Boundary (1923- 1950)"},dashed:!0}}),{c(){e=l("div"),n=l("b"),n.textContent="Legend",o=u(),r=l("div");for(let t=0;t<m.length;t+=1)m[t].c();i=u(),j(d.$$.fragment),p(r,"class","content svelte-2d210l"),p(e,"class","panel-container")},m(t,c){s(t,e,c),a(e,n),a(e,o),a(e,r);for(let t=0;t<m.length;t+=1)m[t].m(r,null);a(r,i),B(d,r,null),S=!0},p(t,[e]){if(0&e){let n;for(f=ut,n=0;n<f.length;n+=1){const o=Wt(t,f,n);m[n]?(m[n].p(o,e),q(m[n],1)):(m[n]=wt(o),m[n].c(),q(m[n],1),m[n].m(r,i))}for(R(),n=f.length;n<m.length;n+=1)h(n);I()}},i(t){if(!S){for(let t=0;t<f.length;t+=1)q(m[t]);q(d.$$.fragment,t),S=!0}},o(t){m=m.filter(Boolean);for(let t=0;t<m.length;t+=1)K(m[t]);K(d.$$.fragment,t),S=!1},d(t){t&&c(e),function(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}(m,t),P(d)}}}class Nt extends H{constructor(t){super(),F(this,t,null,bt,i,{})}}function kt(e){let n,o,r;return{c(){n=l("div"),p(n,"class","transition hidden svelte-1j3hj1m"),p(n,"title","Expand/Collapse")},m(t,i){s(t,n,i),o||(r=S(n,"click",e[0]),o=!0)},p:t,i:t,o:t,d(t){t&&c(n),o=!1,r()}}}function xt(){const t=document.querySelector(".transition");t.classList.contains("hidden")?t.classList.remove("hidden"):t.classList.add("hidden")}function Et(t,e,n){let{onToggle:o}=e;return v((()=>xt())),t.$$set=t=>{"onToggle"in t&&n(1,o=t.onToggle)},[function(){o(),xt()},o]}class Ct extends H{constructor(t){super(),F(this,t,Et,kt,i,{onToggle:1})}}const Lt={type:"FeatureCollection",features:[{type:"Feature",properties:{},geometry:{type:"LineString",coordinates:[[-114.001825531986,51.0959608454447],[-114.001787621148,51.0814846626122],[-114.001749216331,51.0668991397779],[-114.001784428778,51.0523624006093],[-114.001816575512,51.0377630349266],[-114.001817055732,51.0311203098387],[-114.001775610509,51.0310751639305],[-114.001675689646,51.0309861317789],[-114.00161559232,51.0308792947881],[-114.001527258154,51.0307852406689],[-114.0014208237,51.0306642489027],[-114.001415029714,51.0306569438982],[-114.001363622947,51.0305615209581],[-114.001320180257,51.0304775121962],[-114.001288322935,51.0303638263097],[-114.001241985571,51.0302428354919],[-114.001173202219,51.0301245831602],[-114.001129037308,51.030032812573],[-114.001106592841,51.0299282583311],[-114.0010769094,51.0298300958665],[-114.001059533279,51.0297305641419],[-114.001037812972,51.0296104863634],[-114.001022610647,51.0294926919197],[-114.001018267985,51.0293488738295],[-114.001004514212,51.0292319918258],[-114.00100958407,51.0291224156328],[-114.001011756311,51.0291064363206],[-114.00102334132,51.029009643503],[-114.001029135606,51.0289137640931],[-114.001017551647,51.0287964271813],[-114.001008142088,51.028695068643],[-114.000993663008,51.0285822958495],[-114.000937915413,51.0284722634689],[-114.000893028,51.0283622309772],[-114.000881446104,51.0282531115791],[-114.000895204024,51.0281722989385],[-114.000911132653,51.0280732235834],[-114.000927062585,51.0279714090448],[-114.000928513221,51.0278714204383],[-114.000932134649,51.0277563658751],[-114.000952408314,51.0276677914105],[-114.000953132375,51.0276623130452],[-114.000980646218,51.0275719117958],[-114.001031327752,51.0274828821738],[-114.001121104291,51.0273947655194],[-114.001210880869,51.0273212589527],[-114.00122536171,51.0272253794149],[-114.001249253827,51.027130870712],[-114.001297761811,51.0270906931466],[-114.001366542422,51.0270637563436],[-114.001503376612,51.0270167310247],[-114.001597495785,51.0269957296956],[-114.001664103315,51.0269610309875],[-114.001792247783,51.0268614998568],[-114.001925461715,51.0267491841616],[-114.002024647573,51.026656501646],[-114.00203478372,51.0266418913104],[-114.00211948772,51.026555600684],[-114.002236048329,51.0264355231697],[-114.002352608043,51.0263378174573],[-114.002465547353,51.0262291540829],[-114.002586448957,51.0261209471012],[-114.002478577683,51.0261734532437],[-114.002331611942,51.0262538094552],[-114.002183919428,51.026319555334],[-114.002121658655,51.0263346215233],[-114.002175231334,51.0262958135358],[-114.002301926948,51.026186693382],[-114.002419209407,51.0261040544256],[-114.002554592202,51.0260195891354],[-114.002642915511,51.0259451681231],[-114.002624814051,51.0259086431275],[-114.002438028541,51.0258556812926],[-114.002378662507,51.0258488332161],[-114.002269343202,51.0258693787948],[-114.002102830988,51.02593192818],[-114.001951520511,51.0260131973548],[-114.001814688893,51.0261118154501],[-114.001756046534,51.0262118031733],[-114.001718400681,51.0263282283375],[-114.001656139601,51.0264592630998],[-114.001593875664,51.0265587941071],[-114.001564916627,51.0266039941184],[-114.001538128707,51.0266099295143],[-114.001502654431,51.0265930364168],[-114.001444011715,51.0265391606186],[-114.001426636167,51.0264903077726],[-114.001403469311,51.0263624682527],[-114.001462112302,51.0262524364483],[-114.001529443001,51.0261305326196],[-114.001584464396,51.0260127390362],[-114.001662653947,51.0258958575581],[-114.001817515493,51.0257799196821],[-114.001817682483,51.0232337406371],[-114.001817361258,51.0085998120488],[-113.981792903956,51.0086284776163],[-113.981778835486,50.9941624359752],[-113.981766750758,50.9795193478919],[-114.001813022404,50.9794650332375],[-114.025346612035,50.9794692629232],[-114.025311416874,50.9941366780563],[-114.025294756287,51.0086114710789],[-114.04848617884,51.0086181876503],[-114.048498476697,51.0013789225358],[-114.060097974873,51.0013767090212],[-114.071663724395,51.0013825585285],[-114.071658072275,51.008626819162],[-114.081532070606,51.0086274836085],[-114.083258000154,51.0086261829614],[-114.094857930423,51.0086244311422],[-114.118198568936,51.0086185206989],[-114.141277175019,51.0086070720332],[-114.1413111588,51.0557310106128],[-114.141320721704,51.0814764038869],[-114.118027781734,51.0815044015757],[-114.11806057408,51.095954677059],[-114.001825531986,51.0959608454447]]}}]};function Tt(e){let n,o;return n=new At({}),{c(){j(n.$$.fragment)},m(t,e){B(n,t,e),o=!0},p:t,i(t){o||(q(n.$$.fragment,t),o=!0)},o(t){K(n.$$.fragment,t),o=!1},d(t){P(n,t)}}}function _t(t){let e,n;return e=new $t({props:{selectedId:t[0],stopTracking:t[4]}}),{c(){j(e.$$.fragment)},m(t,o){B(e,t,o),n=!0},p(t,n){const o={};1&n&&(o.selectedId=t[0]),e.$set(o)},i(t){n||(q(e.$$.fragment,t),n=!0)},o(t){K(e.$$.fragment,t),n=!1},d(t){P(e,t)}}}function Rt(t){let e,n;return e=new Nt({}),{c(){j(e.$$.fragment)},m(t,o){B(e,t,o),n=!0},i(t){n||(q(e.$$.fragment,t),n=!0)},o(t){K(e.$$.fragment,t),n=!1},d(t){P(e,t)}}}function It(t){let e,n,o,r,i,d,S,f,m,h,g,v,$,A;function W(e){t[7](e)}function w(e){t[8](e)}function b(e){t[9](e)}n=new Ct({props:{onToggle:qt}});let N={};void 0!==t[3]&&(N.showLegend=t[3]),void 0!==t[2]&&(N.speed=t[2]),void 0!==t[1]&&(N.allowSound=t[1]),d=new Z({props:N}),y.push((()=>M(d,"showLegend",W))),y.push((()=>M(d,"speed",w))),y.push((()=>M(d,"allowSound",b)));const x=[_t,Tt],E=[];function C(t,e){return t[0]?0:1}g=C(t),v=E[g]=x[g](t);let L=t[3]&&Rt();return{c(){e=l("div"),j(n.$$.fragment),o=u(),r=l("b"),r.textContent="Calgary's Streetcars (1909-1950)",i=u(),j(d.$$.fragment),h=u(),v.c(),$=u(),L&&L.c(),p(r,"class","title svelte-qmh8x9"),p(e,"class","root hidden svelte-qmh8x9")},m(t,c){s(t,e,c),B(n,e,null),a(e,o),a(e,r),a(e,i),B(d,e,null),a(e,h),E[g].m(e,null),a(e,$),L&&L.m(e,null),A=!0},p(t,[n]){const o={};!S&&8&n&&(S=!0,o.showLegend=t[3],k((()=>S=!1))),!f&&4&n&&(f=!0,o.speed=t[2],k((()=>f=!1))),!m&&2&n&&(m=!0,o.allowSound=t[1],k((()=>m=!1))),d.$set(o);let r=g;g=C(t),g===r?E[g].p(t,n):(R(),K(E[r],1,1,(()=>{E[r]=null})),I(),v=E[g],v?v.p(t,n):(v=E[g]=x[g](t),v.c()),q(v,1),v.m(e,$)),t[3]?L?8&n&&q(L,1):(L=Rt(),L.c(),q(L,1),L.m(e,null)):L&&(R(),K(L,1,1,(()=>{L=null})),I())},i(t){A||(q(n.$$.fragment,t),q(d.$$.fragment,t),q(v),q(L),A=!0)},o(t){K(n.$$.fragment,t),K(d.$$.fragment,t),K(v),K(L),A=!1},d(t){t&&c(e),P(n),P(d),E[g].d(),L&&L.d()}}}function qt(){const t=document.querySelector(".root");t.classList.contains("hidden")?t.classList.remove("hidden"):t.classList.add("hidden")}function Kt(t,e,n){let o,r,i,a=2e-6,s=!0,c=!1;const l=[-114.06,51.05];mapboxgl.accessToken="pk.eyJ1IjoiZHlsYW5ncmFuZG1vbnQiLCJhIjoiY2t0eDV1cmdkMnBxbzJ3bzI5dm1wbHZ4MCJ9.19ogLLAZwVYbKNoy-E_S5Q";const d=new mapboxgl.Map({container:"map",style:"mapbox://styles/mapbox/streets-v11",center:l,zoom:12,logoPosition:"top-left"}),u={type:"FeatureCollection",features:ut.map((({data:t})=>({type:"Feature",geometry:{type:"Point",coordinates:t.geometry.coordinates[0]}})))}.features.map((({geometry:t},e)=>{const{id:r,color:i}=ut[e],a=document.createElement("div");return a.className="marker",a.style.color=i,a.id=`marker-${r}`,a.addEventListener("click",(function(t){t.stopPropagation(),n(0,o=o===r?"":r)})),new mapboxgl.Marker(a).setLngLat(t.coordinates).addTo(d)}));return ut.forEach((({data:t},e)=>{!function(t,e,n){let o=0,i=t[o];requestAnimationFrame((function s(){const c=t[(o+1)%t.length],l=t[o%t.length],u=Math.sqrt((c[0]-l[0])**2+(c[1]-l[1])**2),S=1*a;if(S>Math.sqrt((c[0]-i[0])**2+(c[1]-i[1])**2))i=c,o++;else{const t=S/u*(c[0]-l[0])+i[0],e=S/u*(c[1]-l[1])+i[1];i=[t,e]}r===n&&d.setCenter(i),e.setLngLat(i),requestAnimationFrame(s)}))}(t.geometry.coordinates,u[e],e)})),d.on("load",(()=>{ut.forEach((({data:t,id:e,color:n})=>{!function(t,e,n){d.addSource(t,{type:"geojson",data:e}),d.addLayer({id:t,type:"line",source:t,layout:{"line-join":"round","line-cap":"round"},paint:{"line-color":n,"line-width":8}})}(e,t,n)})),d.addSource("boundary",{type:"geojson",data:Lt}),d.addLayer({id:"boundary",type:"line",source:"boundary",layout:{"line-join":"round","line-cap":"round"},paint:{"line-color":"black","line-width":4,"line-dasharray":[1,2]}})})),ut.forEach((({id:t})=>{d.on("click",t,(t=>{const e=t.features[0]?.layer.id;n(0,o=o===e?"":e)}))})),v((()=>qt())),t.$$.update=()=>{if(1&t.$$.dirty&&n(5,r=ut.findIndex((({id:t})=>t===o))),3&t.$$.dirty&&o&&c){const t=new Audio("./Tram-bell-sound-effect.mp3");t.volume=.05,t.play()}32&t.$$.dirty&&n(6,i=r>-1),64&t.$$.dirty&&(i?(d.setPitch(45),d.setZoom(18)):d.flyTo({pitch:0,center:l,zoom:13}))},[o,c,a,s,function(){n(0,o="")},r,i,function(t){s=t,n(3,s)},function(t){a=t,n(2,a)},function(t){c=t,n(1,c)}]}return new class extends H{constructor(t){super(),F(this,t,Kt,It,i,{})}}({target:document.body,props:{}})}();
//# sourceMappingURL=main-1ac7daac.js.map
