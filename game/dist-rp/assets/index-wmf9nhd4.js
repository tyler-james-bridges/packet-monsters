(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function t(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(r){if(r.ep)return;r.ep=!0;const a=t(r);fetch(r.href,a)}})();/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Co="181",Vu=0,ac=1,Gu=2,Po=1,Wu=2,vn=3,En=0,Gt=1,un=2,Sn=0,Ji=1,Lr=2,sc=3,oc=4,Xu=5,hi=100,qu=101,Yu=102,ju=103,Ku=104,$u=200,Zu=201,Ju=202,Qu=203,Ns=204,Os=205,ef=206,tf=207,nf=208,rf=209,af=210,sf=211,of=212,cf=213,lf=214,ks=0,Bs=1,zs=2,ir=3,Hs=4,Vs=5,Gs=6,Ws=7,Vl=0,uf=1,ff=2,Fn=0,hf=1,df=2,pf=3,mf=4,xf=5,gf=6,vf=7,Gl=300,rr=301,ar=302,Xs=303,qs=304,za=306,pn=1e3,It=1001,Ys=1002,gt=1003,_f=1004,jr=1005,xt=1006,ja=1007,dn=1008,bt=1009,Wl=1010,Xl=1011,Fr=1012,Do=1013,Zn=1014,sn=1015,Lt=1016,Uo=1017,Io=1018,Nr=1020,ql=35902,Yl=35899,jl=1021,Kl=1022,Vt=1023,sr=1026,Or=1027,Gr=1028,Lo=1029,Fo=1030,No=1031,Oo=1033,ya=33776,Sa=33777,Ea=33778,wa=33779,js=35840,Ks=35841,$s=35842,Zs=35843,Js=36196,Qs=37492,eo=37496,to=37808,no=37809,io=37810,ro=37811,ao=37812,so=37813,oo=37814,co=37815,lo=37816,uo=37817,fo=37818,ho=37819,po=37820,mo=37821,xo=36492,go=36494,vo=36495,_o=36283,bo=36284,Mo=36285,yo=36286,bf=3200,Mf=3201,$l=0,yf=1,Ht="",Ut="srgb",gi="srgb-linear",Ca="linear",at="srgb",Mi=7680,cc=519,Sf=512,Ef=513,wf=514,Zl=515,Tf=516,Af=517,Rf=518,Cf=519,lc=35044,So="300 es",Mn=2e3,Pa=2001;function Jl(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Da(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Pf(){const i=Da("canvas");return i.style.display="block",i}const uc={};function fc(...i){const e="THREE."+i.shift();console.log(e,...i)}function Ve(...i){const e="THREE."+i.shift();console.warn(e,...i)}function pt(...i){const e="THREE."+i.shift();console.error(e,...i)}function kr(...i){const e=i.join(" ");e in uc||(uc[e]=!0,Ve(...i))}function Df(i,e,t){return new Promise(function(n,r){function a(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(a,t);break;default:n()}}setTimeout(a,t)})}class ur{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const r=n[e];if(r!==void 0){const a=r.indexOf(t);a!==-1&&r.splice(a,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const r=n.slice(0);for(let a=0,s=r.length;a<s;a++)r[a].call(this,e);e.target=null}}}const Ct=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let hc=1234567;const Pr=Math.PI/180,or=180/Math.PI;function fr(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ct[i&255]+Ct[i>>8&255]+Ct[i>>16&255]+Ct[i>>24&255]+"-"+Ct[e&255]+Ct[e>>8&255]+"-"+Ct[e>>16&15|64]+Ct[e>>24&255]+"-"+Ct[t&63|128]+Ct[t>>8&255]+"-"+Ct[t>>16&255]+Ct[t>>24&255]+Ct[n&255]+Ct[n>>8&255]+Ct[n>>16&255]+Ct[n>>24&255]).toLowerCase()}function qe(i,e,t){return Math.max(e,Math.min(t,i))}function ko(i,e){return(i%e+e)%e}function Uf(i,e,t,n,r){return n+(i-e)*(r-n)/(t-e)}function If(i,e,t){return i!==e?(t-i)/(e-i):0}function Dr(i,e,t){return(1-t)*i+t*e}function Lf(i,e,t,n){return Dr(i,e,1-Math.exp(-t*n))}function Ff(i,e=1){return e-Math.abs(ko(i,e*2)-e)}function Nf(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Of(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function kf(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Bf(i,e){return i+Math.random()*(e-i)}function zf(i){return i*(.5-Math.random())}function Hf(i){i!==void 0&&(hc=i);let e=hc+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Vf(i){return i*Pr}function Gf(i){return i*or}function Wf(i){return(i&i-1)===0&&i!==0}function Xf(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function qf(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Yf(i,e,t,n,r){const a=Math.cos,s=Math.sin,o=a(t/2),c=s(t/2),l=a((e+n)/2),u=s((e+n)/2),h=a((e-n)/2),d=s((e-n)/2),p=a((n-e)/2),x=s((n-e)/2);switch(r){case"XYX":i.set(o*u,c*h,c*d,o*l);break;case"YZY":i.set(c*d,o*u,c*h,o*l);break;case"ZXZ":i.set(c*h,c*d,o*u,o*l);break;case"XZX":i.set(o*u,c*x,c*p,o*l);break;case"YXY":i.set(c*p,o*u,c*x,o*l);break;case"ZYZ":i.set(c*x,c*p,o*u,o*l);break;default:Ve("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function Yi(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function kt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const jf={DEG2RAD:Pr,RAD2DEG:or,generateUUID:fr,clamp:qe,euclideanModulo:ko,mapLinear:Uf,inverseLerp:If,lerp:Dr,damp:Lf,pingpong:Ff,smoothstep:Nf,smootherstep:Of,randInt:kf,randFloat:Bf,randFloatSpread:zf,seededRandom:Hf,degToRad:Vf,radToDeg:Gf,isPowerOfTwo:Wf,ceilPowerOfTwo:Xf,floorPowerOfTwo:qf,setQuaternionFromProperEuler:Yf,normalize:kt,denormalize:Yi};class ye{constructor(e=0,t=0){ye.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=qe(this.x,e.x,t.x),this.y=qe(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=qe(this.x,e,t),this.y=qe(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),r=Math.sin(t),a=this.x-e.x,s=this.y-e.y;return this.x=a*n-s*r+e.x,this.y=a*r+s*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class At{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,a,s,o){let c=n[r+0],l=n[r+1],u=n[r+2],h=n[r+3],d=a[s+0],p=a[s+1],x=a[s+2],g=a[s+3];if(o<=0){e[t+0]=c,e[t+1]=l,e[t+2]=u,e[t+3]=h;return}if(o>=1){e[t+0]=d,e[t+1]=p,e[t+2]=x,e[t+3]=g;return}if(h!==g||c!==d||l!==p||u!==x){let m=c*d+l*p+u*x+h*g;m<0&&(d=-d,p=-p,x=-x,g=-g,m=-m);let f=1-o;if(m<.9995){const M=Math.acos(m),y=Math.sin(M);f=Math.sin(f*M)/y,o=Math.sin(o*M)/y,c=c*f+d*o,l=l*f+p*o,u=u*f+x*o,h=h*f+g*o}else{c=c*f+d*o,l=l*f+p*o,u=u*f+x*o,h=h*f+g*o;const M=1/Math.sqrt(c*c+l*l+u*u+h*h);c*=M,l*=M,u*=M,h*=M}}e[t]=c,e[t+1]=l,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,r,a,s){const o=n[r],c=n[r+1],l=n[r+2],u=n[r+3],h=a[s],d=a[s+1],p=a[s+2],x=a[s+3];return e[t]=o*x+u*h+c*p-l*d,e[t+1]=c*x+u*d+l*h-o*p,e[t+2]=l*x+u*p+o*d-c*h,e[t+3]=u*x-o*h-c*d-l*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,r=e._y,a=e._z,s=e._order,o=Math.cos,c=Math.sin,l=o(n/2),u=o(r/2),h=o(a/2),d=c(n/2),p=c(r/2),x=c(a/2);switch(s){case"XYZ":this._x=d*u*h+l*p*x,this._y=l*p*h-d*u*x,this._z=l*u*x+d*p*h,this._w=l*u*h-d*p*x;break;case"YXZ":this._x=d*u*h+l*p*x,this._y=l*p*h-d*u*x,this._z=l*u*x-d*p*h,this._w=l*u*h+d*p*x;break;case"ZXY":this._x=d*u*h-l*p*x,this._y=l*p*h+d*u*x,this._z=l*u*x+d*p*h,this._w=l*u*h-d*p*x;break;case"ZYX":this._x=d*u*h-l*p*x,this._y=l*p*h+d*u*x,this._z=l*u*x-d*p*h,this._w=l*u*h+d*p*x;break;case"YZX":this._x=d*u*h+l*p*x,this._y=l*p*h+d*u*x,this._z=l*u*x-d*p*h,this._w=l*u*h-d*p*x;break;case"XZY":this._x=d*u*h-l*p*x,this._y=l*p*h-d*u*x,this._z=l*u*x+d*p*h,this._w=l*u*h+d*p*x;break;default:Ve("Quaternion: .setFromEuler() encountered an unknown order: "+s)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],r=t[4],a=t[8],s=t[1],o=t[5],c=t[9],l=t[2],u=t[6],h=t[10],d=n+o+h;if(d>0){const p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(u-c)*p,this._y=(a-l)*p,this._z=(s-r)*p}else if(n>o&&n>h){const p=2*Math.sqrt(1+n-o-h);this._w=(u-c)/p,this._x=.25*p,this._y=(r+s)/p,this._z=(a+l)/p}else if(o>h){const p=2*Math.sqrt(1+o-n-h);this._w=(a-l)/p,this._x=(r+s)/p,this._y=.25*p,this._z=(c+u)/p}else{const p=2*Math.sqrt(1+h-n-o);this._w=(s-r)/p,this._x=(a+l)/p,this._y=(c+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(qe(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,r=e._y,a=e._z,s=e._w,o=t._x,c=t._y,l=t._z,u=t._w;return this._x=n*u+s*o+r*l-a*c,this._y=r*u+s*c+a*o-n*l,this._z=a*u+s*l+n*c-r*o,this._w=s*u-n*o-r*c-a*l,this._onChangeCallback(),this}slerp(e,t){if(t<=0)return this;if(t>=1)return this.copy(e);let n=e._x,r=e._y,a=e._z,s=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,a=-a,s=-s,o=-o);let c=1-t;if(o<.9995){const l=Math.acos(o),u=Math.sin(l);c=Math.sin(c*l)/u,t=Math.sin(t*l)/u,this._x=this._x*c+n*t,this._y=this._y*c+r*t,this._z=this._z*c+a*t,this._w=this._w*c+s*t,this._onChangeCallback()}else this._x=this._x*c+n*t,this._y=this._y*c+r*t,this._z=this._z*c+a*t,this._w=this._w*c+s*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),a=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),a*Math.sin(t),a*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class C{constructor(e=0,t=0,n=0){C.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(dc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(dc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,r=this.z,a=e.elements;return this.x=a[0]*t+a[3]*n+a[6]*r,this.y=a[1]*t+a[4]*n+a[7]*r,this.z=a[2]*t+a[5]*n+a[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,a=e.elements,s=1/(a[3]*t+a[7]*n+a[11]*r+a[15]);return this.x=(a[0]*t+a[4]*n+a[8]*r+a[12])*s,this.y=(a[1]*t+a[5]*n+a[9]*r+a[13])*s,this.z=(a[2]*t+a[6]*n+a[10]*r+a[14])*s,this}applyQuaternion(e){const t=this.x,n=this.y,r=this.z,a=e.x,s=e.y,o=e.z,c=e.w,l=2*(s*r-o*n),u=2*(o*t-a*r),h=2*(a*n-s*t);return this.x=t+c*l+s*h-o*u,this.y=n+c*u+o*l-a*h,this.z=r+c*h+a*u-s*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,r=this.z,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r,this.y=a[1]*t+a[5]*n+a[9]*r,this.z=a[2]*t+a[6]*n+a[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=qe(this.x,e.x,t.x),this.y=qe(this.y,e.y,t.y),this.z=qe(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=qe(this.x,e,t),this.y=qe(this.y,e,t),this.z=qe(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,r=e.y,a=e.z,s=t.x,o=t.y,c=t.z;return this.x=r*c-a*o,this.y=a*s-n*c,this.z=n*o-r*s,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Ka.copy(this).projectOnVector(e),this.sub(Ka)}reflect(e){return this.sub(Ka.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ka=new C,dc=new At;class We{constructor(e,t,n,r,a,s,o,c,l){We.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,a,s,o,c,l)}set(e,t,n,r,a,s,o,c,l){const u=this.elements;return u[0]=e,u[1]=r,u[2]=o,u[3]=t,u[4]=a,u[5]=c,u[6]=n,u[7]=s,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,a=this.elements,s=n[0],o=n[3],c=n[6],l=n[1],u=n[4],h=n[7],d=n[2],p=n[5],x=n[8],g=r[0],m=r[3],f=r[6],M=r[1],y=r[4],w=r[7],A=r[2],b=r[5],R=r[8];return a[0]=s*g+o*M+c*A,a[3]=s*m+o*y+c*b,a[6]=s*f+o*w+c*R,a[1]=l*g+u*M+h*A,a[4]=l*m+u*y+h*b,a[7]=l*f+u*w+h*R,a[2]=d*g+p*M+x*A,a[5]=d*m+p*y+x*b,a[8]=d*f+p*w+x*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],r=e[2],a=e[3],s=e[4],o=e[5],c=e[6],l=e[7],u=e[8];return t*s*u-t*o*l-n*a*u+n*o*c+r*a*l-r*s*c}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],a=e[3],s=e[4],o=e[5],c=e[6],l=e[7],u=e[8],h=u*s-o*l,d=o*c-u*a,p=l*a-s*c,x=t*h+n*d+r*p;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/x;return e[0]=h*g,e[1]=(r*l-u*n)*g,e[2]=(o*n-r*s)*g,e[3]=d*g,e[4]=(u*t-r*c)*g,e[5]=(r*a-o*t)*g,e[6]=p*g,e[7]=(n*c-l*t)*g,e[8]=(s*t-n*a)*g,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,a,s,o){const c=Math.cos(a),l=Math.sin(a);return this.set(n*c,n*l,-n*(c*s+l*o)+s+e,-r*l,r*c,-r*(-l*s+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply($a.makeScale(e,t)),this}rotate(e){return this.premultiply($a.makeRotation(-e)),this}translate(e,t){return this.premultiply($a.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<9;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const $a=new We,pc=new We().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),mc=new We().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Kf(){const i={enabled:!0,workingColorSpace:gi,spaces:{},convert:function(r,a,s){return this.enabled===!1||a===s||!a||!s||(this.spaces[a].transfer===at&&(r.r=Nn(r.r),r.g=Nn(r.g),r.b=Nn(r.b)),this.spaces[a].primaries!==this.spaces[s].primaries&&(r.applyMatrix3(this.spaces[a].toXYZ),r.applyMatrix3(this.spaces[s].fromXYZ)),this.spaces[s].transfer===at&&(r.r=Qi(r.r),r.g=Qi(r.g),r.b=Qi(r.b))),r},workingToColorSpace:function(r,a){return this.convert(r,this.workingColorSpace,a)},colorSpaceToWorking:function(r,a){return this.convert(r,a,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===Ht?Ca:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,a=this.workingColorSpace){return r.fromArray(this.spaces[a].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,a,s){return r.copy(this.spaces[a].toXYZ).multiply(this.spaces[s].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,a){return kr("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(r,a)},toWorkingColorSpace:function(r,a){return kr("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(r,a)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[gi]:{primaries:e,whitePoint:n,transfer:Ca,toXYZ:pc,fromXYZ:mc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Ut},outputColorSpaceConfig:{drawingBufferColorSpace:Ut}},[Ut]:{primaries:e,whitePoint:n,transfer:at,toXYZ:pc,fromXYZ:mc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Ut}}}),i}const tt=Kf();function Nn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Qi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let yi;class $f{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{yi===void 0&&(yi=Da("canvas")),yi.width=e.width,yi.height=e.height;const r=yi.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),n=yi}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Da("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const r=n.getImageData(0,0,e.width,e.height),a=r.data;for(let s=0;s<a.length;s++)a[s]=Nn(a[s]/255)*255;return n.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Nn(t[n]/255)*255):t[n]=Nn(t[n]);return{data:t,width:e.width,height:e.height}}else return Ve("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Zf=0;class Bo{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Zf++}),this.uuid=fr(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let a;if(Array.isArray(r)){a=[];for(let s=0,o=r.length;s<o;s++)r[s].isDataTexture?a.push(Za(r[s].image)):a.push(Za(r[s]))}else a=Za(r);n.url=a}return t||(e.images[this.uuid]=n),n}}function Za(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?$f.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Ve("Texture: Unable to serialize Texture."),{})}let Jf=0;const Ja=new C;class Wt extends ur{constructor(e=Wt.DEFAULT_IMAGE,t=Wt.DEFAULT_MAPPING,n=It,r=It,a=xt,s=dn,o=Vt,c=bt,l=Wt.DEFAULT_ANISOTROPY,u=Ht){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Jf++}),this.uuid=fr(),this.name="",this.source=new Bo(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=a,this.minFilter=s,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new ye(0,0),this.repeat=new ye(1,1),this.center=new ye(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new We,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Ja).x}get height(){return this.source.getSize(Ja).y}get depth(){return this.source.getSize(Ja).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){Ve(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){Ve(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Gl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case pn:e.x=e.x-Math.floor(e.x);break;case It:e.x=e.x<0?0:1;break;case Ys:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case pn:e.y=e.y-Math.floor(e.y);break;case It:e.y=e.y<0?0:1;break;case Ys:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Wt.DEFAULT_IMAGE=null;Wt.DEFAULT_MAPPING=Gl;Wt.DEFAULT_ANISOTROPY=1;class nt{constructor(e=0,t=0,n=0,r=1){nt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,a=this.w,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*r+s[12]*a,this.y=s[1]*t+s[5]*n+s[9]*r+s[13]*a,this.z=s[2]*t+s[6]*n+s[10]*r+s[14]*a,this.w=s[3]*t+s[7]*n+s[11]*r+s[15]*a,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,a;const c=e.elements,l=c[0],u=c[4],h=c[8],d=c[1],p=c[5],x=c[9],g=c[2],m=c[6],f=c[10];if(Math.abs(u-d)<.01&&Math.abs(h-g)<.01&&Math.abs(x-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+g)<.1&&Math.abs(x+m)<.1&&Math.abs(l+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const y=(l+1)/2,w=(p+1)/2,A=(f+1)/2,b=(u+d)/4,R=(h+g)/4,F=(x+m)/4;return y>w&&y>A?y<.01?(n=0,r=.707106781,a=.707106781):(n=Math.sqrt(y),r=b/n,a=R/n):w>A?w<.01?(n=.707106781,r=0,a=.707106781):(r=Math.sqrt(w),n=b/r,a=F/r):A<.01?(n=.707106781,r=.707106781,a=0):(a=Math.sqrt(A),n=R/a,r=F/a),this.set(n,r,a,t),this}let M=Math.sqrt((m-x)*(m-x)+(h-g)*(h-g)+(d-u)*(d-u));return Math.abs(M)<.001&&(M=1),this.x=(m-x)/M,this.y=(h-g)/M,this.z=(d-u)/M,this.w=Math.acos((l+p+f-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=qe(this.x,e.x,t.x),this.y=qe(this.y,e.y,t.y),this.z=qe(this.z,e.z,t.z),this.w=qe(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=qe(this.x,e,t),this.y=qe(this.y,e,t),this.z=qe(this.z,e,t),this.w=qe(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Qf extends ur{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:xt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new nt(0,0,e,t),this.scissorTest=!1,this.viewport=new nt(0,0,e,t);const r={width:e,height:t,depth:n.depth},a=new Wt(r);this.textures=[];const s=n.count;for(let o=0;o<s;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:xt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,a=this.textures.length;r<a;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const r=Object.assign({},e.textures[t].image);this.textures[t].source=new Bo(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class On extends Qf{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Ql extends Wt{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=gt,this.minFilter=gt,this.wrapR=It,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class zo extends Wt{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=gt,this.minFilter=gt,this.wrapR=It,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class _i{constructor(e=new C(1/0,1/0,1/0),t=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(on.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(on.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=on.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const a=n.getAttribute("position");if(t===!0&&a!==void 0&&e.isInstancedMesh!==!0)for(let s=0,o=a.count;s<o;s++)e.isMesh===!0?e.getVertexPosition(s,on):on.fromBufferAttribute(a,s),on.applyMatrix4(e.matrixWorld),this.expandByPoint(on);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Kr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Kr.copy(n.boundingBox)),Kr.applyMatrix4(e.matrixWorld),this.union(Kr)}const r=e.children;for(let a=0,s=r.length;a<s;a++)this.expandByObject(r[a],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,on),on.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(xr),$r.subVectors(this.max,xr),Si.subVectors(e.a,xr),Ei.subVectors(e.b,xr),wi.subVectors(e.c,xr),Bn.subVectors(Ei,Si),zn.subVectors(wi,Ei),ei.subVectors(Si,wi);let t=[0,-Bn.z,Bn.y,0,-zn.z,zn.y,0,-ei.z,ei.y,Bn.z,0,-Bn.x,zn.z,0,-zn.x,ei.z,0,-ei.x,-Bn.y,Bn.x,0,-zn.y,zn.x,0,-ei.y,ei.x,0];return!Qa(t,Si,Ei,wi,$r)||(t=[1,0,0,0,1,0,0,0,1],!Qa(t,Si,Ei,wi,$r))?!1:(Zr.crossVectors(Bn,zn),t=[Zr.x,Zr.y,Zr.z],Qa(t,Si,Ei,wi,$r))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,on).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(on).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(wn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),wn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),wn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),wn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),wn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),wn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),wn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),wn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(wn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const wn=[new C,new C,new C,new C,new C,new C,new C,new C],on=new C,Kr=new _i,Si=new C,Ei=new C,wi=new C,Bn=new C,zn=new C,ei=new C,xr=new C,$r=new C,Zr=new C,ti=new C;function Qa(i,e,t,n,r){for(let a=0,s=i.length-3;a<=s;a+=3){ti.fromArray(i,a);const o=r.x*Math.abs(ti.x)+r.y*Math.abs(ti.y)+r.z*Math.abs(ti.z),c=e.dot(ti),l=t.dot(ti),u=n.dot(ti);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>o)return!1}return!0}const eh=new _i,gr=new C,es=new C;class hr{constructor(e=new C,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):eh.setFromPoints(e).getCenter(n);let r=0;for(let a=0,s=e.length;a<s;a++)r=Math.max(r,n.distanceToSquared(e[a]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;gr.subVectors(e,this.center);const t=gr.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),r=(n-this.radius)*.5;this.center.addScaledVector(gr,r/n),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(es.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(gr.copy(e.center).add(es)),this.expandByPoint(gr.copy(e.center).sub(es))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const Tn=new C,ts=new C,Jr=new C,Hn=new C,ns=new C,Qr=new C,is=new C;class eu{constructor(e=new C,t=new C(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Tn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Tn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Tn.copy(this.origin).addScaledVector(this.direction,t),Tn.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){ts.copy(e).add(t).multiplyScalar(.5),Jr.copy(t).sub(e).normalize(),Hn.copy(this.origin).sub(ts);const a=e.distanceTo(t)*.5,s=-this.direction.dot(Jr),o=Hn.dot(this.direction),c=-Hn.dot(Jr),l=Hn.lengthSq(),u=Math.abs(1-s*s);let h,d,p,x;if(u>0)if(h=s*c-o,d=s*o-c,x=a*u,h>=0)if(d>=-x)if(d<=x){const g=1/u;h*=g,d*=g,p=h*(h+s*d+2*o)+d*(s*h+d+2*c)+l}else d=a,h=Math.max(0,-(s*d+o)),p=-h*h+d*(d+2*c)+l;else d=-a,h=Math.max(0,-(s*d+o)),p=-h*h+d*(d+2*c)+l;else d<=-x?(h=Math.max(0,-(-s*a+o)),d=h>0?-a:Math.min(Math.max(-a,-c),a),p=-h*h+d*(d+2*c)+l):d<=x?(h=0,d=Math.min(Math.max(-a,-c),a),p=d*(d+2*c)+l):(h=Math.max(0,-(s*a+o)),d=h>0?a:Math.min(Math.max(-a,-c),a),p=-h*h+d*(d+2*c)+l);else d=s>0?-a:a,h=Math.max(0,-(s*d+o)),p=-h*h+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(ts).addScaledVector(Jr,d),p}intersectSphere(e,t){Tn.subVectors(e.center,this.origin);const n=Tn.dot(this.direction),r=Tn.dot(Tn)-n*n,a=e.radius*e.radius;if(r>a)return null;const s=Math.sqrt(a-r),o=n-s,c=n+s;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,a,s,o,c;const l=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return l>=0?(n=(e.min.x-d.x)*l,r=(e.max.x-d.x)*l):(n=(e.max.x-d.x)*l,r=(e.min.x-d.x)*l),u>=0?(a=(e.min.y-d.y)*u,s=(e.max.y-d.y)*u):(a=(e.max.y-d.y)*u,s=(e.min.y-d.y)*u),n>s||a>r||((a>n||isNaN(n))&&(n=a),(s<r||isNaN(r))&&(r=s),h>=0?(o=(e.min.z-d.z)*h,c=(e.max.z-d.z)*h):(o=(e.max.z-d.z)*h,c=(e.min.z-d.z)*h),n>c||o>r)||((o>n||n!==n)&&(n=o),(c<r||r!==r)&&(r=c),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,Tn)!==null}intersectTriangle(e,t,n,r,a){ns.subVectors(t,e),Qr.subVectors(n,e),is.crossVectors(ns,Qr);let s=this.direction.dot(is),o;if(s>0){if(r)return null;o=1}else if(s<0)o=-1,s=-s;else return null;Hn.subVectors(this.origin,e);const c=o*this.direction.dot(Qr.crossVectors(Hn,Qr));if(c<0)return null;const l=o*this.direction.dot(ns.cross(Hn));if(l<0||c+l>s)return null;const u=-o*Hn.dot(is);return u<0?null:this.at(u/s,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class je{constructor(e,t,n,r,a,s,o,c,l,u,h,d,p,x,g,m){je.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,a,s,o,c,l,u,h,d,p,x,g,m)}set(e,t,n,r,a,s,o,c,l,u,h,d,p,x,g,m){const f=this.elements;return f[0]=e,f[4]=t,f[8]=n,f[12]=r,f[1]=a,f[5]=s,f[9]=o,f[13]=c,f[2]=l,f[6]=u,f[10]=h,f[14]=d,f[3]=p,f[7]=x,f[11]=g,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new je().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,r=1/Ti.setFromMatrixColumn(e,0).length(),a=1/Ti.setFromMatrixColumn(e,1).length(),s=1/Ti.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*a,t[5]=n[5]*a,t[6]=n[6]*a,t[7]=0,t[8]=n[8]*s,t[9]=n[9]*s,t[10]=n[10]*s,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,r=e.y,a=e.z,s=Math.cos(n),o=Math.sin(n),c=Math.cos(r),l=Math.sin(r),u=Math.cos(a),h=Math.sin(a);if(e.order==="XYZ"){const d=s*u,p=s*h,x=o*u,g=o*h;t[0]=c*u,t[4]=-c*h,t[8]=l,t[1]=p+x*l,t[5]=d-g*l,t[9]=-o*c,t[2]=g-d*l,t[6]=x+p*l,t[10]=s*c}else if(e.order==="YXZ"){const d=c*u,p=c*h,x=l*u,g=l*h;t[0]=d+g*o,t[4]=x*o-p,t[8]=s*l,t[1]=s*h,t[5]=s*u,t[9]=-o,t[2]=p*o-x,t[6]=g+d*o,t[10]=s*c}else if(e.order==="ZXY"){const d=c*u,p=c*h,x=l*u,g=l*h;t[0]=d-g*o,t[4]=-s*h,t[8]=x+p*o,t[1]=p+x*o,t[5]=s*u,t[9]=g-d*o,t[2]=-s*l,t[6]=o,t[10]=s*c}else if(e.order==="ZYX"){const d=s*u,p=s*h,x=o*u,g=o*h;t[0]=c*u,t[4]=x*l-p,t[8]=d*l+g,t[1]=c*h,t[5]=g*l+d,t[9]=p*l-x,t[2]=-l,t[6]=o*c,t[10]=s*c}else if(e.order==="YZX"){const d=s*c,p=s*l,x=o*c,g=o*l;t[0]=c*u,t[4]=g-d*h,t[8]=x*h+p,t[1]=h,t[5]=s*u,t[9]=-o*u,t[2]=-l*u,t[6]=p*h+x,t[10]=d-g*h}else if(e.order==="XZY"){const d=s*c,p=s*l,x=o*c,g=o*l;t[0]=c*u,t[4]=-h,t[8]=l*u,t[1]=d*h+g,t[5]=s*u,t[9]=p*h-x,t[2]=x*h-p,t[6]=o*u,t[10]=g*h+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(th,e,nh)}lookAt(e,t,n){const r=this.elements;return Qt.subVectors(e,t),Qt.lengthSq()===0&&(Qt.z=1),Qt.normalize(),Vn.crossVectors(n,Qt),Vn.lengthSq()===0&&(Math.abs(n.z)===1?Qt.x+=1e-4:Qt.z+=1e-4,Qt.normalize(),Vn.crossVectors(n,Qt)),Vn.normalize(),ea.crossVectors(Qt,Vn),r[0]=Vn.x,r[4]=ea.x,r[8]=Qt.x,r[1]=Vn.y,r[5]=ea.y,r[9]=Qt.y,r[2]=Vn.z,r[6]=ea.z,r[10]=Qt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,a=this.elements,s=n[0],o=n[4],c=n[8],l=n[12],u=n[1],h=n[5],d=n[9],p=n[13],x=n[2],g=n[6],m=n[10],f=n[14],M=n[3],y=n[7],w=n[11],A=n[15],b=r[0],R=r[4],F=r[8],S=r[12],v=r[1],P=r[5],O=r[9],L=r[13],q=r[2],H=r[6],G=r[10],$=r[14],V=r[3],ee=r[7],te=r[11],me=r[15];return a[0]=s*b+o*v+c*q+l*V,a[4]=s*R+o*P+c*H+l*ee,a[8]=s*F+o*O+c*G+l*te,a[12]=s*S+o*L+c*$+l*me,a[1]=u*b+h*v+d*q+p*V,a[5]=u*R+h*P+d*H+p*ee,a[9]=u*F+h*O+d*G+p*te,a[13]=u*S+h*L+d*$+p*me,a[2]=x*b+g*v+m*q+f*V,a[6]=x*R+g*P+m*H+f*ee,a[10]=x*F+g*O+m*G+f*te,a[14]=x*S+g*L+m*$+f*me,a[3]=M*b+y*v+w*q+A*V,a[7]=M*R+y*P+w*H+A*ee,a[11]=M*F+y*O+w*G+A*te,a[15]=M*S+y*L+w*$+A*me,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],r=e[8],a=e[12],s=e[1],o=e[5],c=e[9],l=e[13],u=e[2],h=e[6],d=e[10],p=e[14],x=e[3],g=e[7],m=e[11],f=e[15];return x*(+a*c*h-r*l*h-a*o*d+n*l*d+r*o*p-n*c*p)+g*(+t*c*p-t*l*d+a*s*d-r*s*p+r*l*u-a*c*u)+m*(+t*l*h-t*o*p-a*s*h+n*s*p+a*o*u-n*l*u)+f*(-r*o*u-t*c*h+t*o*d+r*s*h-n*s*d+n*c*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],a=e[3],s=e[4],o=e[5],c=e[6],l=e[7],u=e[8],h=e[9],d=e[10],p=e[11],x=e[12],g=e[13],m=e[14],f=e[15],M=h*m*l-g*d*l+g*c*p-o*m*p-h*c*f+o*d*f,y=x*d*l-u*m*l-x*c*p+s*m*p+u*c*f-s*d*f,w=u*g*l-x*h*l+x*o*p-s*g*p-u*o*f+s*h*f,A=x*h*c-u*g*c-x*o*d+s*g*d+u*o*m-s*h*m,b=t*M+n*y+r*w+a*A;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/b;return e[0]=M*R,e[1]=(g*d*a-h*m*a-g*r*p+n*m*p+h*r*f-n*d*f)*R,e[2]=(o*m*a-g*c*a+g*r*l-n*m*l-o*r*f+n*c*f)*R,e[3]=(h*c*a-o*d*a-h*r*l+n*d*l+o*r*p-n*c*p)*R,e[4]=y*R,e[5]=(u*m*a-x*d*a+x*r*p-t*m*p-u*r*f+t*d*f)*R,e[6]=(x*c*a-s*m*a-x*r*l+t*m*l+s*r*f-t*c*f)*R,e[7]=(s*d*a-u*c*a+u*r*l-t*d*l-s*r*p+t*c*p)*R,e[8]=w*R,e[9]=(x*h*a-u*g*a-x*n*p+t*g*p+u*n*f-t*h*f)*R,e[10]=(s*g*a-x*o*a+x*n*l-t*g*l-s*n*f+t*o*f)*R,e[11]=(u*o*a-s*h*a-u*n*l+t*h*l+s*n*p-t*o*p)*R,e[12]=A*R,e[13]=(u*g*r-x*h*r+x*n*d-t*g*d-u*n*m+t*h*m)*R,e[14]=(x*o*r-s*g*r-x*n*c+t*g*c+s*n*m-t*o*m)*R,e[15]=(s*h*r-u*o*r+u*n*c-t*h*c-s*n*d+t*o*d)*R,this}scale(e){const t=this.elements,n=e.x,r=e.y,a=e.z;return t[0]*=n,t[4]*=r,t[8]*=a,t[1]*=n,t[5]*=r,t[9]*=a,t[2]*=n,t[6]*=r,t[10]*=a,t[3]*=n,t[7]*=r,t[11]*=a,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),r=Math.sin(t),a=1-n,s=e.x,o=e.y,c=e.z,l=a*s,u=a*o;return this.set(l*s+n,l*o-r*c,l*c+r*o,0,l*o+r*c,u*o+n,u*c-r*s,0,l*c-r*o,u*c+r*s,a*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,a,s){return this.set(1,n,a,0,e,1,s,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){const r=this.elements,a=t._x,s=t._y,o=t._z,c=t._w,l=a+a,u=s+s,h=o+o,d=a*l,p=a*u,x=a*h,g=s*u,m=s*h,f=o*h,M=c*l,y=c*u,w=c*h,A=n.x,b=n.y,R=n.z;return r[0]=(1-(g+f))*A,r[1]=(p+w)*A,r[2]=(x-y)*A,r[3]=0,r[4]=(p-w)*b,r[5]=(1-(d+f))*b,r[6]=(m+M)*b,r[7]=0,r[8]=(x+y)*R,r[9]=(m-M)*R,r[10]=(1-(d+g))*R,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){const r=this.elements;let a=Ti.set(r[0],r[1],r[2]).length();const s=Ti.set(r[4],r[5],r[6]).length(),o=Ti.set(r[8],r[9],r[10]).length();this.determinant()<0&&(a=-a),e.x=r[12],e.y=r[13],e.z=r[14],cn.copy(this);const l=1/a,u=1/s,h=1/o;return cn.elements[0]*=l,cn.elements[1]*=l,cn.elements[2]*=l,cn.elements[4]*=u,cn.elements[5]*=u,cn.elements[6]*=u,cn.elements[8]*=h,cn.elements[9]*=h,cn.elements[10]*=h,t.setFromRotationMatrix(cn),n.x=a,n.y=s,n.z=o,this}makePerspective(e,t,n,r,a,s,o=Mn,c=!1){const l=this.elements,u=2*a/(t-e),h=2*a/(n-r),d=(t+e)/(t-e),p=(n+r)/(n-r);let x,g;if(c)x=a/(s-a),g=s*a/(s-a);else if(o===Mn)x=-(s+a)/(s-a),g=-2*s*a/(s-a);else if(o===Pa)x=-s/(s-a),g=-s*a/(s-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=u,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=p,l[13]=0,l[2]=0,l[6]=0,l[10]=x,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,r,a,s,o=Mn,c=!1){const l=this.elements,u=2/(t-e),h=2/(n-r),d=-(t+e)/(t-e),p=-(n+r)/(n-r);let x,g;if(c)x=1/(s-a),g=s/(s-a);else if(o===Mn)x=-2/(s-a),g=-(s+a)/(s-a);else if(o===Pa)x=-1/(s-a),g=-a/(s-a);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=u,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=h,l[9]=0,l[13]=p,l[2]=0,l[6]=0,l[10]=x,l[14]=g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<16;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Ti=new C,cn=new je,th=new C(0,0,0),nh=new C(1,1,1),Vn=new C,ea=new C,Qt=new C,xc=new je,gc=new At;class tn{constructor(e=0,t=0,n=0,r=tn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const r=e.elements,a=r[0],s=r[4],o=r[8],c=r[1],l=r[5],u=r[9],h=r[2],d=r[6],p=r[10];switch(t){case"XYZ":this._y=Math.asin(qe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-s,a)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-qe(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-h,a),this._z=0);break;case"ZXY":this._x=Math.asin(qe(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,p),this._z=Math.atan2(-s,l)):(this._y=0,this._z=Math.atan2(c,a));break;case"ZYX":this._y=Math.asin(-qe(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(c,a)):(this._x=0,this._z=Math.atan2(-s,l));break;case"YZX":this._z=Math.asin(qe(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-h,a)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-qe(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-u,p),this._y=0);break;default:Ve("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return xc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(xc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return gc.setFromEuler(this),this.setFromQuaternion(gc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}tn.DEFAULT_ORDER="XYZ";class tu{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let ih=0;const vc=new C,Ai=new At,An=new je,ta=new C,vr=new C,rh=new C,ah=new At,_c=new C(1,0,0),bc=new C(0,1,0),Mc=new C(0,0,1),yc={type:"added"},sh={type:"removed"},Ri={type:"childadded",child:null},rs={type:"childremoved",child:null};class vt extends ur{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ih++}),this.uuid=fr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=vt.DEFAULT_UP.clone();const e=new C,t=new tn,n=new At,r=new C(1,1,1);function a(){n.setFromEuler(t,!1)}function s(){t.setFromQuaternion(n,void 0,!1)}t._onChange(a),n._onChange(s),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new je},normalMatrix:{value:new We}}),this.matrix=new je,this.matrixWorld=new je,this.matrixAutoUpdate=vt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=vt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new tu,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ai.setFromAxisAngle(e,t),this.quaternion.multiply(Ai),this}rotateOnWorldAxis(e,t){return Ai.setFromAxisAngle(e,t),this.quaternion.premultiply(Ai),this}rotateX(e){return this.rotateOnAxis(_c,e)}rotateY(e){return this.rotateOnAxis(bc,e)}rotateZ(e){return this.rotateOnAxis(Mc,e)}translateOnAxis(e,t){return vc.copy(e).applyQuaternion(this.quaternion),this.position.add(vc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(_c,e)}translateY(e){return this.translateOnAxis(bc,e)}translateZ(e){return this.translateOnAxis(Mc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(An.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ta.copy(e):ta.set(e,t,n);const r=this.parent;this.updateWorldMatrix(!0,!1),vr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?An.lookAt(vr,ta,this.up):An.lookAt(ta,vr,this.up),this.quaternion.setFromRotationMatrix(An),r&&(An.extractRotation(r.matrixWorld),Ai.setFromRotationMatrix(An),this.quaternion.premultiply(Ai.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(pt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(yc),Ri.child=e,this.dispatchEvent(Ri),Ri.child=null):pt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(sh),rs.child=e,this.dispatchEvent(rs),rs.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),An.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),An.multiply(e.parent.matrixWorld)),e.applyMatrix4(An),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(yc),Ri.child=e,this.dispatchEvent(Ri),Ri.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){const s=this.children[n].getObjectByProperty(e,t);if(s!==void 0)return s}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const r=this.children;for(let a=0,s=r.length;a<s;a++)r[a].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(vr,e,rh),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(vr,ah,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let a=0,s=r.length;a<s;a++)r[a].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(o=>({...o})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function a(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=a(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){const h=c[l];a(e.shapes,h)}else a(e.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(a(e.materials,this.material[c]));r.material=o}else r.material=a(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];r.animations.push(a(e.animations,c))}}if(t){const o=s(e.geometries),c=s(e.materials),l=s(e.textures),u=s(e.images),h=s(e.shapes),d=s(e.skeletons),p=s(e.animations),x=s(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),d.length>0&&(n.skeletons=d),p.length>0&&(n.animations=p),x.length>0&&(n.nodes=x)}return n.object=r,n;function s(o){const c=[];for(const l in o){const u=o[l];delete u.metadata,c.push(u)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const r=e.children[n];this.add(r.clone())}return this}}vt.DEFAULT_UP=new C(0,1,0);vt.DEFAULT_MATRIX_AUTO_UPDATE=!0;vt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const ln=new C,Rn=new C,as=new C,Cn=new C,Ci=new C,Pi=new C,Sc=new C,ss=new C,os=new C,cs=new C,ls=new nt,us=new nt,fs=new nt;class fn{constructor(e=new C,t=new C,n=new C){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),ln.subVectors(e,t),r.cross(ln);const a=r.lengthSq();return a>0?r.multiplyScalar(1/Math.sqrt(a)):r.set(0,0,0)}static getBarycoord(e,t,n,r,a){ln.subVectors(r,t),Rn.subVectors(n,t),as.subVectors(e,t);const s=ln.dot(ln),o=ln.dot(Rn),c=ln.dot(as),l=Rn.dot(Rn),u=Rn.dot(as),h=s*l-o*o;if(h===0)return a.set(0,0,0),null;const d=1/h,p=(l*c-o*u)*d,x=(s*u-o*c)*d;return a.set(1-p-x,x,p)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Cn)===null?!1:Cn.x>=0&&Cn.y>=0&&Cn.x+Cn.y<=1}static getInterpolation(e,t,n,r,a,s,o,c){return this.getBarycoord(e,t,n,r,Cn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(a,Cn.x),c.addScaledVector(s,Cn.y),c.addScaledVector(o,Cn.z),c)}static getInterpolatedAttribute(e,t,n,r,a,s){return ls.setScalar(0),us.setScalar(0),fs.setScalar(0),ls.fromBufferAttribute(e,t),us.fromBufferAttribute(e,n),fs.fromBufferAttribute(e,r),s.setScalar(0),s.addScaledVector(ls,a.x),s.addScaledVector(us,a.y),s.addScaledVector(fs,a.z),s}static isFrontFacing(e,t,n,r){return ln.subVectors(n,t),Rn.subVectors(e,t),ln.cross(Rn).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ln.subVectors(this.c,this.b),Rn.subVectors(this.a,this.b),ln.cross(Rn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return fn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return fn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,r,a){return fn.getInterpolation(e,this.a,this.b,this.c,t,n,r,a)}containsPoint(e){return fn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return fn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,r=this.b,a=this.c;let s,o;Ci.subVectors(r,n),Pi.subVectors(a,n),ss.subVectors(e,n);const c=Ci.dot(ss),l=Pi.dot(ss);if(c<=0&&l<=0)return t.copy(n);os.subVectors(e,r);const u=Ci.dot(os),h=Pi.dot(os);if(u>=0&&h<=u)return t.copy(r);const d=c*h-u*l;if(d<=0&&c>=0&&u<=0)return s=c/(c-u),t.copy(n).addScaledVector(Ci,s);cs.subVectors(e,a);const p=Ci.dot(cs),x=Pi.dot(cs);if(x>=0&&p<=x)return t.copy(a);const g=p*l-c*x;if(g<=0&&l>=0&&x<=0)return o=l/(l-x),t.copy(n).addScaledVector(Pi,o);const m=u*x-p*h;if(m<=0&&h-u>=0&&p-x>=0)return Sc.subVectors(a,r),o=(h-u)/(h-u+(p-x)),t.copy(r).addScaledVector(Sc,o);const f=1/(m+g+d);return s=g*f,o=d*f,t.copy(n).addScaledVector(Ci,s).addScaledVector(Pi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const nu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Gn={h:0,s:0,l:0},na={h:0,s:0,l:0};function hs(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Ee{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ut){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,tt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=tt.workingColorSpace){return this.r=e,this.g=t,this.b=n,tt.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=tt.workingColorSpace){if(e=ko(e,1),t=qe(t,0,1),n=qe(n,0,1),t===0)this.r=this.g=this.b=n;else{const a=n<=.5?n*(1+t):n+t-n*t,s=2*n-a;this.r=hs(s,a,e+1/3),this.g=hs(s,a,e),this.b=hs(s,a,e-1/3)}return tt.colorSpaceToWorking(this,r),this}setStyle(e,t=Ut){function n(a){a!==void 0&&parseFloat(a)<1&&Ve("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let a;const s=r[1],o=r[2];switch(s){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,t);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,t);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,t);break;default:Ve("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const a=r[1],s=a.length;if(s===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,t);if(s===6)return this.setHex(parseInt(a,16),t);Ve("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ut){const n=nu[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Ve("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Nn(e.r),this.g=Nn(e.g),this.b=Nn(e.b),this}copyLinearToSRGB(e){return this.r=Qi(e.r),this.g=Qi(e.g),this.b=Qi(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ut){return tt.workingToColorSpace(Pt.copy(this),e),Math.round(qe(Pt.r*255,0,255))*65536+Math.round(qe(Pt.g*255,0,255))*256+Math.round(qe(Pt.b*255,0,255))}getHexString(e=Ut){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=tt.workingColorSpace){tt.workingToColorSpace(Pt.copy(this),t);const n=Pt.r,r=Pt.g,a=Pt.b,s=Math.max(n,r,a),o=Math.min(n,r,a);let c,l;const u=(o+s)/2;if(o===s)c=0,l=0;else{const h=s-o;switch(l=u<=.5?h/(s+o):h/(2-s-o),s){case n:c=(r-a)/h+(r<a?6:0);break;case r:c=(a-n)/h+2;break;case a:c=(n-r)/h+4;break}c/=6}return e.h=c,e.s=l,e.l=u,e}getRGB(e,t=tt.workingColorSpace){return tt.workingToColorSpace(Pt.copy(this),t),e.r=Pt.r,e.g=Pt.g,e.b=Pt.b,e}getStyle(e=Ut){tt.workingToColorSpace(Pt.copy(this),e);const t=Pt.r,n=Pt.g,r=Pt.b;return e!==Ut?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(e,t,n){return this.getHSL(Gn),this.setHSL(Gn.h+e,Gn.s+t,Gn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Gn),e.getHSL(na);const n=Dr(Gn.h,na.h,t),r=Dr(Gn.s,na.s,t),a=Dr(Gn.l,na.l,t);return this.setHSL(n,r,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,r=this.b,a=e.elements;return this.r=a[0]*t+a[3]*n+a[6]*r,this.g=a[1]*t+a[4]*n+a[7]*r,this.b=a[2]*t+a[5]*n+a[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Pt=new Ee;Ee.NAMES=nu;let oh=0;class dr extends ur{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:oh++}),this.uuid=fr(),this.name="",this.type="Material",this.blending=Ji,this.side=En,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ns,this.blendDst=Os,this.blendEquation=hi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ee(0,0,0),this.blendAlpha=0,this.depthFunc=ir,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=cc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Mi,this.stencilZFail=Mi,this.stencilZPass=Mi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){Ve(`Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){Ve(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ji&&(n.blending=this.blending),this.side!==En&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ns&&(n.blendSrc=this.blendSrc),this.blendDst!==Os&&(n.blendDst=this.blendDst),this.blendEquation!==hi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ir&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==cc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Mi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Mi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Mi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(a){const s=[];for(const o in a){const c=a[o];delete c.metadata,s.push(c)}return s}if(t){const a=r(e.textures),s=r(e.images);a.length>0&&(n.textures=a),s.length>0&&(n.images=s)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const r=t.length;n=new Array(r);for(let a=0;a!==r;++a)n[a]=t[a].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Wr extends dr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ee(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new tn,this.combine=Vl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const mt=new C,ia=new ye;let ch=0;class Ft{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:ch++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=lc,this.updateRanges=[],this.gpuType=sn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,a=this.itemSize;r<a;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ia.fromBufferAttribute(this,t),ia.applyMatrix3(e),this.setXY(t,ia.x,ia.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)mt.fromBufferAttribute(this,t),mt.applyMatrix3(e),this.setXYZ(t,mt.x,mt.y,mt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)mt.fromBufferAttribute(this,t),mt.applyMatrix4(e),this.setXYZ(t,mt.x,mt.y,mt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)mt.fromBufferAttribute(this,t),mt.applyNormalMatrix(e),this.setXYZ(t,mt.x,mt.y,mt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)mt.fromBufferAttribute(this,t),mt.transformDirection(e),this.setXYZ(t,mt.x,mt.y,mt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Yi(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=kt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Yi(t,this.array)),t}setX(e,t){return this.normalized&&(t=kt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Yi(t,this.array)),t}setY(e,t){return this.normalized&&(t=kt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Yi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=kt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Yi(t,this.array)),t}setW(e,t){return this.normalized&&(t=kt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=kt(t,this.array),n=kt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=kt(t,this.array),n=kt(n,this.array),r=kt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,a){return e*=this.itemSize,this.normalized&&(t=kt(t,this.array),n=kt(n,this.array),r=kt(r,this.array),a=kt(a,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==lc&&(e.usage=this.usage),e}}class iu extends Ft{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class ru extends Ft{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class _t extends Ft{constructor(e,t,n){super(new Float32Array(e),t,n)}}let lh=0;const rn=new je,ds=new vt,Di=new C,en=new _i,_r=new _i,St=new C;class Nt extends ur{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:lh++}),this.uuid=fr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Jl(e)?ru:iu)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const a=new We().getNormalMatrix(e);n.applyNormalMatrix(a),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return rn.makeRotationFromQuaternion(e),this.applyMatrix4(rn),this}rotateX(e){return rn.makeRotationX(e),this.applyMatrix4(rn),this}rotateY(e){return rn.makeRotationY(e),this.applyMatrix4(rn),this}rotateZ(e){return rn.makeRotationZ(e),this.applyMatrix4(rn),this}translate(e,t,n){return rn.makeTranslation(e,t,n),this.applyMatrix4(rn),this}scale(e,t,n){return rn.makeScale(e,t,n),this.applyMatrix4(rn),this}lookAt(e){return ds.lookAt(e),ds.updateMatrix(),this.applyMatrix4(ds.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Di).negate(),this.translate(Di.x,Di.y,Di.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let r=0,a=e.length;r<a;r++){const s=e[r];n.push(s.x,s.y,s.z||0)}this.setAttribute("position",new _t(n,3))}else{const n=Math.min(e.length,t.count);for(let r=0;r<n;r++){const a=e[r];t.setXYZ(r,a.x,a.y,a.z||0)}e.length>t.count&&Ve("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new _i);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){pt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,r=t.length;n<r;n++){const a=t[n];en.setFromBufferAttribute(a),this.morphTargetsRelative?(St.addVectors(this.boundingBox.min,en.min),this.boundingBox.expandByPoint(St),St.addVectors(this.boundingBox.max,en.max),this.boundingBox.expandByPoint(St)):(this.boundingBox.expandByPoint(en.min),this.boundingBox.expandByPoint(en.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&pt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new hr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){pt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(e){const n=this.boundingSphere.center;if(en.setFromBufferAttribute(e),t)for(let a=0,s=t.length;a<s;a++){const o=t[a];_r.setFromBufferAttribute(o),this.morphTargetsRelative?(St.addVectors(en.min,_r.min),en.expandByPoint(St),St.addVectors(en.max,_r.max),en.expandByPoint(St)):(en.expandByPoint(_r.min),en.expandByPoint(_r.max))}en.getCenter(n);let r=0;for(let a=0,s=e.count;a<s;a++)St.fromBufferAttribute(e,a),r=Math.max(r,n.distanceToSquared(St));if(t)for(let a=0,s=t.length;a<s;a++){const o=t[a],c=this.morphTargetsRelative;for(let l=0,u=o.count;l<u;l++)St.fromBufferAttribute(o,l),c&&(Di.fromBufferAttribute(e,l),St.add(Di)),r=Math.max(r,n.distanceToSquared(St))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&pt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){pt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,r=t.normal,a=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ft(new Float32Array(4*n.count),4));const s=this.getAttribute("tangent"),o=[],c=[];for(let F=0;F<n.count;F++)o[F]=new C,c[F]=new C;const l=new C,u=new C,h=new C,d=new ye,p=new ye,x=new ye,g=new C,m=new C;function f(F,S,v){l.fromBufferAttribute(n,F),u.fromBufferAttribute(n,S),h.fromBufferAttribute(n,v),d.fromBufferAttribute(a,F),p.fromBufferAttribute(a,S),x.fromBufferAttribute(a,v),u.sub(l),h.sub(l),p.sub(d),x.sub(d);const P=1/(p.x*x.y-x.x*p.y);isFinite(P)&&(g.copy(u).multiplyScalar(x.y).addScaledVector(h,-p.y).multiplyScalar(P),m.copy(h).multiplyScalar(p.x).addScaledVector(u,-x.x).multiplyScalar(P),o[F].add(g),o[S].add(g),o[v].add(g),c[F].add(m),c[S].add(m),c[v].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let F=0,S=M.length;F<S;++F){const v=M[F],P=v.start,O=v.count;for(let L=P,q=P+O;L<q;L+=3)f(e.getX(L+0),e.getX(L+1),e.getX(L+2))}const y=new C,w=new C,A=new C,b=new C;function R(F){A.fromBufferAttribute(r,F),b.copy(A);const S=o[F];y.copy(S),y.sub(A.multiplyScalar(A.dot(S))).normalize(),w.crossVectors(b,S);const P=w.dot(c[F])<0?-1:1;s.setXYZW(F,y.x,y.y,y.z,P)}for(let F=0,S=M.length;F<S;++F){const v=M[F],P=v.start,O=v.count;for(let L=P,q=P+O;L<q;L+=3)R(e.getX(L+0)),R(e.getX(L+1)),R(e.getX(L+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ft(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,p=n.count;d<p;d++)n.setXYZ(d,0,0,0);const r=new C,a=new C,s=new C,o=new C,c=new C,l=new C,u=new C,h=new C;if(e)for(let d=0,p=e.count;d<p;d+=3){const x=e.getX(d+0),g=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,x),a.fromBufferAttribute(t,g),s.fromBufferAttribute(t,m),u.subVectors(s,a),h.subVectors(r,a),u.cross(h),o.fromBufferAttribute(n,x),c.fromBufferAttribute(n,g),l.fromBufferAttribute(n,m),o.add(u),c.add(u),l.add(u),n.setXYZ(x,o.x,o.y,o.z),n.setXYZ(g,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,p=t.count;d<p;d+=3)r.fromBufferAttribute(t,d+0),a.fromBufferAttribute(t,d+1),s.fromBufferAttribute(t,d+2),u.subVectors(s,a),h.subVectors(r,a),u.cross(h),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)St.fromBufferAttribute(e,t),St.normalize(),e.setXYZ(t,St.x,St.y,St.z)}toNonIndexed(){function e(o,c){const l=o.array,u=o.itemSize,h=o.normalized,d=new l.constructor(c.length*u);let p=0,x=0;for(let g=0,m=c.length;g<m;g++){o.isInterleavedBufferAttribute?p=c[g]*o.data.stride+o.offset:p=c[g]*u;for(let f=0;f<u;f++)d[x++]=l[p++]}return new Ft(d,u,h)}if(this.index===null)return Ve("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Nt,n=this.index.array,r=this.attributes;for(const o in r){const c=r[o],l=e(c,n);t.setAttribute(o,l)}const a=this.morphAttributes;for(const o in a){const c=[],l=a[o];for(let u=0,h=l.length;u<h;u++){const d=l[u],p=e(d,n);c.push(p)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const s=this.groups;for(let o=0,c=s.length;o<c;o++){const l=s[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const r={};let a=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],u=[];for(let h=0,d=l.length;h<d;h++){const p=l[h];u.push(p.toJSON(e.data))}u.length>0&&(r[c]=u,a=!0)}a&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const s=this.groups;s.length>0&&(e.data.groups=JSON.parse(JSON.stringify(s)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const r=e.attributes;for(const l in r){const u=r[l];this.setAttribute(l,u.clone(t))}const a=e.morphAttributes;for(const l in a){const u=[],h=a[l];for(let d=0,p=h.length;d<p;d++)u.push(h[d].clone(t));this.morphAttributes[l]=u}this.morphTargetsRelative=e.morphTargetsRelative;const s=e.groups;for(let l=0,u=s.length;l<u;l++){const h=s[l];this.addGroup(h.start,h.count,h.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ec=new je,ni=new eu,ra=new hr,wc=new C,aa=new C,sa=new C,oa=new C,ps=new C,ca=new C,Tc=new C,la=new C;class Ye extends vt{constructor(e=new Nt,t=new Wr){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,s=r.length;a<s;a++){const o=r[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(e,t){const n=this.geometry,r=n.attributes.position,a=n.morphAttributes.position,s=n.morphTargetsRelative;t.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(a&&o){ca.set(0,0,0);for(let c=0,l=a.length;c<l;c++){const u=o[c],h=a[c];u!==0&&(ps.fromBufferAttribute(h,e),s?ca.addScaledVector(ps,u):ca.addScaledVector(ps.sub(t),u))}t.add(ca)}return t}raycast(e,t){const n=this.geometry,r=this.material,a=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ra.copy(n.boundingSphere),ra.applyMatrix4(a),ni.copy(e.ray).recast(e.near),!(ra.containsPoint(ni.origin)===!1&&(ni.intersectSphere(ra,wc)===null||ni.origin.distanceToSquared(wc)>(e.far-e.near)**2))&&(Ec.copy(a).invert(),ni.copy(e.ray).applyMatrix4(Ec),!(n.boundingBox!==null&&ni.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,ni)))}_computeIntersections(e,t,n){let r;const a=this.geometry,s=this.material,o=a.index,c=a.attributes.position,l=a.attributes.uv,u=a.attributes.uv1,h=a.attributes.normal,d=a.groups,p=a.drawRange;if(o!==null)if(Array.isArray(s))for(let x=0,g=d.length;x<g;x++){const m=d[x],f=s[m.materialIndex],M=Math.max(m.start,p.start),y=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let w=M,A=y;w<A;w+=3){const b=o.getX(w),R=o.getX(w+1),F=o.getX(w+2);r=ua(this,f,e,n,l,u,h,b,R,F),r&&(r.faceIndex=Math.floor(w/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const x=Math.max(0,p.start),g=Math.min(o.count,p.start+p.count);for(let m=x,f=g;m<f;m+=3){const M=o.getX(m),y=o.getX(m+1),w=o.getX(m+2);r=ua(this,s,e,n,l,u,h,M,y,w),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(c!==void 0)if(Array.isArray(s))for(let x=0,g=d.length;x<g;x++){const m=d[x],f=s[m.materialIndex],M=Math.max(m.start,p.start),y=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let w=M,A=y;w<A;w+=3){const b=w,R=w+1,F=w+2;r=ua(this,f,e,n,l,u,h,b,R,F),r&&(r.faceIndex=Math.floor(w/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const x=Math.max(0,p.start),g=Math.min(c.count,p.start+p.count);for(let m=x,f=g;m<f;m+=3){const M=m,y=m+1,w=m+2;r=ua(this,s,e,n,l,u,h,M,y,w),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}}function uh(i,e,t,n,r,a,s,o){let c;if(e.side===Gt?c=n.intersectTriangle(s,a,r,!0,o):c=n.intersectTriangle(r,a,s,e.side===En,o),c===null)return null;la.copy(o),la.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(la);return l<t.near||l>t.far?null:{distance:l,point:la.clone(),object:i}}function ua(i,e,t,n,r,a,s,o,c,l){i.getVertexPosition(o,aa),i.getVertexPosition(c,sa),i.getVertexPosition(l,oa);const u=uh(i,e,t,n,aa,sa,oa,Tc);if(u){const h=new C;fn.getBarycoord(Tc,aa,sa,oa,h),r&&(u.uv=fn.getInterpolatedAttribute(r,o,c,l,h,new ye)),a&&(u.uv1=fn.getInterpolatedAttribute(a,o,c,l,h,new ye)),s&&(u.normal=fn.getInterpolatedAttribute(s,o,c,l,h,new C),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const d={a:o,b:c,c:l,normal:new C,materialIndex:0};fn.getNormal(aa,sa,oa,d.normal),u.face=d,u.barycoord=h}return u}class hn extends Nt{constructor(e=1,t=1,n=1,r=1,a=1,s=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:a,depthSegments:s};const o=this;r=Math.floor(r),a=Math.floor(a),s=Math.floor(s);const c=[],l=[],u=[],h=[];let d=0,p=0;x("z","y","x",-1,-1,n,t,e,s,a,0),x("z","y","x",1,-1,n,t,-e,s,a,1),x("x","z","y",1,1,e,n,t,r,s,2),x("x","z","y",1,-1,e,n,-t,r,s,3),x("x","y","z",1,-1,e,t,n,r,a,4),x("x","y","z",-1,-1,e,t,-n,r,a,5),this.setIndex(c),this.setAttribute("position",new _t(l,3)),this.setAttribute("normal",new _t(u,3)),this.setAttribute("uv",new _t(h,2));function x(g,m,f,M,y,w,A,b,R,F,S){const v=w/R,P=A/F,O=w/2,L=A/2,q=b/2,H=R+1,G=F+1;let $=0,V=0;const ee=new C;for(let te=0;te<G;te++){const me=te*P-L;for(let ue=0;ue<H;ue++){const Le=ue*v-O;ee[g]=Le*M,ee[m]=me*y,ee[f]=q,l.push(ee.x,ee.y,ee.z),ee[g]=0,ee[m]=0,ee[f]=b>0?1:-1,u.push(ee.x,ee.y,ee.z),h.push(ue/R),h.push(1-te/F),$+=1}}for(let te=0;te<F;te++)for(let me=0;me<R;me++){const ue=d+me+H*te,Le=d+me+H*(te+1),Ge=d+(me+1)+H*(te+1),$e=d+(me+1)+H*te;c.push(ue,Le,$e),c.push(Le,Ge,$e),V+=6}o.addGroup(p,V,S),p+=V,d+=$}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new hn(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function cr(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const r=i[t][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(Ve("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=r.clone():Array.isArray(r)?e[t][n]=r.slice():e[t][n]=r}}return e}function Bt(i){const e={};for(let t=0;t<i.length;t++){const n=cr(i[t]);for(const r in n)e[r]=n[r]}return e}function fh(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function au(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:tt.workingColorSpace}const hh={clone:cr,merge:Bt};var dh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ph=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class xn extends dr{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=dh,this.fragmentShader=ph,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=cr(e.uniforms),this.uniformsGroups=fh(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const s=this.uniforms[r].value;s&&s.isTexture?t.uniforms[r]={type:"t",value:s.toJSON(e).uuid}:s&&s.isColor?t.uniforms[r]={type:"c",value:s.getHex()}:s&&s.isVector2?t.uniforms[r]={type:"v2",value:s.toArray()}:s&&s.isVector3?t.uniforms[r]={type:"v3",value:s.toArray()}:s&&s.isVector4?t.uniforms[r]={type:"v4",value:s.toArray()}:s&&s.isMatrix3?t.uniforms[r]={type:"m3",value:s.toArray()}:s&&s.isMatrix4?t.uniforms[r]={type:"m4",value:s.toArray()}:t.uniforms[r]={value:s}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class su extends vt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new je,this.projectionMatrix=new je,this.projectionMatrixInverse=new je,this.coordinateSystem=Mn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Wn=new C,Ac=new ye,Rc=new ye;class zt extends su{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=or*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Pr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return or*2*Math.atan(Math.tan(Pr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Wn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Wn.x,Wn.y).multiplyScalar(-e/Wn.z),Wn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Wn.x,Wn.y).multiplyScalar(-e/Wn.z)}getViewSize(e,t){return this.getViewBounds(e,Ac,Rc),t.subVectors(Rc,Ac)}setViewOffset(e,t,n,r,a,s){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=a,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Pr*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,a=-.5*r;const s=this.view;if(this.view!==null&&this.view.enabled){const c=s.fullWidth,l=s.fullHeight;a+=s.offsetX*r/c,t-=s.offsetY*n/l,r*=s.width/c,n*=s.height/l}const o=this.filmOffset;o!==0&&(a+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Ui=-90,Ii=1;class mh extends vt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new zt(Ui,Ii,e,t);r.layers=this.layers,this.add(r);const a=new zt(Ui,Ii,e,t);a.layers=this.layers,this.add(a);const s=new zt(Ui,Ii,e,t);s.layers=this.layers,this.add(s);const o=new zt(Ui,Ii,e,t);o.layers=this.layers,this.add(o);const c=new zt(Ui,Ii,e,t);c.layers=this.layers,this.add(c);const l=new zt(Ui,Ii,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,r,a,s,o,c]=t;for(const l of t)this.remove(l);if(e===Mn)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),s.up.set(0,0,1),s.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Pa)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),s.up.set(0,0,-1),s.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[a,s,o,c,l,u]=this.children,h=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;const g=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,r),e.render(t,a),e.setRenderTarget(n,1,r),e.render(t,s),e.setRenderTarget(n,2,r),e.render(t,o),e.setRenderTarget(n,3,r),e.render(t,c),e.setRenderTarget(n,4,r),e.render(t,l),n.texture.generateMipmaps=g,e.setRenderTarget(n,5,r),e.render(t,u),e.setRenderTarget(h,d,p),e.xr.enabled=x,n.texture.needsPMREMUpdate=!0}}class ou extends Wt{constructor(e=[],t=rr,n,r,a,s,o,c,l,u){super(e,t,n,r,a,s,o,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class xh extends On{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new ou(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new hn(5,5,5),a=new xn({name:"CubemapFromEquirect",uniforms:cr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Gt,blending:Sn});a.uniforms.tEquirect.value=t;const s=new Ye(r,a),o=t.minFilter;return t.minFilter===dn&&(t.minFilter=xt),new mh(1,10,this).update(e,s),t.minFilter=o,s.geometry.dispose(),s.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){const a=e.getRenderTarget();for(let s=0;s<6;s++)e.setRenderTarget(this,s),e.clear(t,n,r);e.setRenderTarget(a)}}class Kn extends vt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const gh={type:"move"};class ms{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Kn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Kn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Kn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,a=null,s=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){s=!0;for(const g of e.hand.values()){const m=t.getJointPose(g,n),f=this._getHandJoint(l,g);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const u=l.joints["index-finger-tip"],h=l.joints["thumb-tip"],d=u.position.distanceTo(h.position),p=.02,x=.005;l.inputState.pinching&&d>p+x?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&d<=p-x&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(a=t.getPose(e.gripSpace,n),a!==null&&(c.matrix.fromArray(a.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,a.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(a.linearVelocity)):c.hasLinearVelocity=!1,a.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(a.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&a!==null&&(r=a),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(gh)))}return o!==null&&(o.visible=r!==null),c!==null&&(c.visible=a!==null),l!==null&&(l.visible=s!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Kn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class Ho{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Ee(e),this.density=t}clone(){return new Ho(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class cu extends vt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new tn,this.environmentIntensity=1,this.environmentRotation=new tn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Xr extends Wt{constructor(e=null,t=1,n=1,r,a,s,o,c,l=gt,u=gt,h,d){super(null,s,o,c,l,u,r,a,h,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Eo extends Ft{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Li=new je,Cc=new je,fa=[],Pc=new _i,vh=new je,br=new Ye,Mr=new hr;class _h extends Ye{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Eo(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<n;r++)this.setMatrixAt(r,vh)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new _i),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Li),Pc.copy(e.boundingBox).applyMatrix4(Li),this.boundingBox.union(Pc)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new hr),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Li),Mr.copy(e.boundingSphere).applyMatrix4(Li),this.boundingSphere.union(Mr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,a=n.length+1,s=e*a+1;for(let o=0;o<n.length;o++)n[o]=r[s+o]}raycast(e,t){const n=this.matrixWorld,r=this.count;if(br.geometry=this.geometry,br.material=this.material,br.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Mr.copy(this.boundingSphere),Mr.applyMatrix4(n),e.ray.intersectsSphere(Mr)!==!1))for(let a=0;a<r;a++){this.getMatrixAt(a,Li),Cc.multiplyMatrices(n,Li),br.matrixWorld=Cc,br.raycast(e,fa);for(let s=0,o=fa.length;s<o;s++){const c=fa[s];c.instanceId=a,c.object=this,t.push(c)}fa.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Eo(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new Xr(new Float32Array(r*this.count),r,this.count,Gr,sn));const a=this.morphTexture.source.data.data;let s=0;for(let l=0;l<n.length;l++)s+=n[l];const o=this.geometry.morphTargetsRelative?1:1-s,c=r*e;a[c]=o,a.set(n,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const xs=new C,bh=new C,Mh=new We;class Yn{constructor(e=new C(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const r=xs.subVectors(n,t).cross(bh.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(xs),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return a<0||a>1?null:t.copy(e.start).addScaledVector(n,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Mh.getNormalMatrix(e),r=this.coplanarPoint(xs).applyMatrix4(e),a=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ii=new hr,yh=new ye(.5,.5),ha=new C;class Vo{constructor(e=new Yn,t=new Yn,n=new Yn,r=new Yn,a=new Yn,s=new Yn){this.planes=[e,t,n,r,a,s]}set(e,t,n,r,a,s){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(a),o[5].copy(s),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Mn,n=!1){const r=this.planes,a=e.elements,s=a[0],o=a[1],c=a[2],l=a[3],u=a[4],h=a[5],d=a[6],p=a[7],x=a[8],g=a[9],m=a[10],f=a[11],M=a[12],y=a[13],w=a[14],A=a[15];if(r[0].setComponents(l-s,p-u,f-x,A-M).normalize(),r[1].setComponents(l+s,p+u,f+x,A+M).normalize(),r[2].setComponents(l+o,p+h,f+g,A+y).normalize(),r[3].setComponents(l-o,p-h,f-g,A-y).normalize(),n)r[4].setComponents(c,d,m,w).normalize(),r[5].setComponents(l-c,p-d,f-m,A-w).normalize();else if(r[4].setComponents(l-c,p-d,f-m,A-w).normalize(),t===Mn)r[5].setComponents(l+c,p+d,f+m,A+w).normalize();else if(t===Pa)r[5].setComponents(c,d,m,w).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ii.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ii.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ii)}intersectsSprite(e){ii.center.set(0,0,0);const t=yh.distanceTo(e.center);return ii.radius=.7071067811865476+t,ii.applyMatrix4(e.matrixWorld),this.intersectsSphere(ii)}intersectsSphere(e){const t=this.planes,n=e.center,r=-e.radius;for(let a=0;a<6;a++)if(t[a].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const r=t[n];if(ha.x=r.normal.x>0?e.max.x:e.min.x,ha.y=r.normal.y>0?e.max.y:e.min.y,ha.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(ha)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class lu extends dr{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ee(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Dc=new je,wo=new eu,da=new hr,pa=new C;class Sh extends vt{constructor(e=new Nt,t=new lu){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,r=this.matrixWorld,a=e.params.Points.threshold,s=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),da.copy(n.boundingSphere),da.applyMatrix4(r),da.radius+=a,e.ray.intersectsSphere(da)===!1)return;Dc.copy(r).invert(),wo.copy(e.ray).applyMatrix4(Dc);const o=a/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=n.index,h=n.attributes.position;if(l!==null){const d=Math.max(0,s.start),p=Math.min(l.count,s.start+s.count);for(let x=d,g=p;x<g;x++){const m=l.getX(x);pa.fromBufferAttribute(h,m),Uc(pa,m,c,r,e,t,this)}}else{const d=Math.max(0,s.start),p=Math.min(h.count,s.start+s.count);for(let x=d,g=p;x<g;x++)pa.fromBufferAttribute(h,x),Uc(pa,x,c,r,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,s=r.length;a<s;a++){const o=r[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}}function Uc(i,e,t,n,r,a,s){const o=wo.distanceSqToPoint(i);if(o<t){const c=new C;wo.closestPointToPoint(i,c),c.applyMatrix4(n);const l=r.ray.origin.distanceTo(c);if(l<r.near||l>r.far)return;a.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:s})}}class Go extends Wt{constructor(e,t,n=Zn,r,a,s,o=gt,c=gt,l,u=sr,h=1){if(u!==sr&&u!==Or)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:h};super(d,r,a,s,o,c,u,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Bo(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class uu extends Wt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Ha extends Nt{constructor(e=1,t=32,n=0,r=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:r},t=Math.max(3,t);const a=[],s=[],o=[],c=[],l=new C,u=new ye;s.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let h=0,d=3;h<=t;h++,d+=3){const p=n+h/t*r;l.x=e*Math.cos(p),l.y=e*Math.sin(p),s.push(l.x,l.y,l.z),o.push(0,0,1),u.x=(s[d]/e+1)/2,u.y=(s[d+1]/e+1)/2,c.push(u.x,u.y)}for(let h=1;h<=t;h++)a.push(h,h+1,0);this.setIndex(a),this.setAttribute("position",new _t(s,3)),this.setAttribute("normal",new _t(o,3)),this.setAttribute("uv",new _t(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ha(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Br extends Nt{constructor(e=1,t=1,n=1,r=32,a=1,s=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:a,openEnded:s,thetaStart:o,thetaLength:c};const l=this;r=Math.floor(r),a=Math.floor(a);const u=[],h=[],d=[],p=[];let x=0;const g=[],m=n/2;let f=0;M(),s===!1&&(e>0&&y(!0),t>0&&y(!1)),this.setIndex(u),this.setAttribute("position",new _t(h,3)),this.setAttribute("normal",new _t(d,3)),this.setAttribute("uv",new _t(p,2));function M(){const w=new C,A=new C;let b=0;const R=(t-e)/n;for(let F=0;F<=a;F++){const S=[],v=F/a,P=v*(t-e)+e;for(let O=0;O<=r;O++){const L=O/r,q=L*c+o,H=Math.sin(q),G=Math.cos(q);A.x=P*H,A.y=-v*n+m,A.z=P*G,h.push(A.x,A.y,A.z),w.set(H,R,G).normalize(),d.push(w.x,w.y,w.z),p.push(L,1-v),S.push(x++)}g.push(S)}for(let F=0;F<r;F++)for(let S=0;S<a;S++){const v=g[S][F],P=g[S+1][F],O=g[S+1][F+1],L=g[S][F+1];(e>0||S!==0)&&(u.push(v,P,L),b+=3),(t>0||S!==a-1)&&(u.push(P,O,L),b+=3)}l.addGroup(f,b,0),f+=b}function y(w){const A=x,b=new ye,R=new C;let F=0;const S=w===!0?e:t,v=w===!0?1:-1;for(let O=1;O<=r;O++)h.push(0,m*v,0),d.push(0,v,0),p.push(.5,.5),x++;const P=x;for(let O=0;O<=r;O++){const q=O/r*c+o,H=Math.cos(q),G=Math.sin(q);R.x=S*G,R.y=m*v,R.z=S*H,h.push(R.x,R.y,R.z),d.push(0,v,0),b.x=H*.5+.5,b.y=G*.5*v+.5,p.push(b.x,b.y),x++}for(let O=0;O<r;O++){const L=A+O,q=P+O;w===!0?u.push(q,q+1,L):u.push(q+1,q,L),F+=3}l.addGroup(f,F,w===!0?1:2),f+=F}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Br(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Wo extends Nt{constructor(e=[new ye(0,-.5),new ye(.5,0),new ye(0,.5)],t=12,n=0,r=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:r},t=Math.floor(t),r=qe(r,0,Math.PI*2);const a=[],s=[],o=[],c=[],l=[],u=1/t,h=new C,d=new ye,p=new C,x=new C,g=new C;let m=0,f=0;for(let M=0;M<=e.length-1;M++)switch(M){case 0:m=e[M+1].x-e[M].x,f=e[M+1].y-e[M].y,p.x=f*1,p.y=-m,p.z=f*0,g.copy(p),p.normalize(),c.push(p.x,p.y,p.z);break;case e.length-1:c.push(g.x,g.y,g.z);break;default:m=e[M+1].x-e[M].x,f=e[M+1].y-e[M].y,p.x=f*1,p.y=-m,p.z=f*0,x.copy(p),p.x+=g.x,p.y+=g.y,p.z+=g.z,p.normalize(),c.push(p.x,p.y,p.z),g.copy(x)}for(let M=0;M<=t;M++){const y=n+M*u*r,w=Math.sin(y),A=Math.cos(y);for(let b=0;b<=e.length-1;b++){h.x=e[b].x*w,h.y=e[b].y,h.z=e[b].x*A,s.push(h.x,h.y,h.z),d.x=M/t,d.y=b/(e.length-1),o.push(d.x,d.y);const R=c[3*b+0]*w,F=c[3*b+1],S=c[3*b+0]*A;l.push(R,F,S)}}for(let M=0;M<t;M++)for(let y=0;y<e.length-1;y++){const w=y+M*e.length,A=w,b=w+e.length,R=w+e.length+1,F=w+1;a.push(A,b,F),a.push(R,F,b)}this.setIndex(a),this.setAttribute("position",new _t(s,3)),this.setAttribute("uv",new _t(o,2)),this.setAttribute("normal",new _t(l,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Wo(e.points,e.segments,e.phiStart,e.phiLength)}}class vi extends Nt{constructor(e=1,t=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};const a=e/2,s=t/2,o=Math.floor(n),c=Math.floor(r),l=o+1,u=c+1,h=e/o,d=t/c,p=[],x=[],g=[],m=[];for(let f=0;f<u;f++){const M=f*d-s;for(let y=0;y<l;y++){const w=y*h-a;x.push(w,-M,0),g.push(0,0,1),m.push(y/o),m.push(1-f/c)}}for(let f=0;f<c;f++)for(let M=0;M<o;M++){const y=M+l*f,w=M+l*(f+1),A=M+1+l*(f+1),b=M+1+l*f;p.push(y,w,b),p.push(w,A,b)}this.setIndex(p),this.setAttribute("position",new _t(x,3)),this.setAttribute("normal",new _t(g,3)),this.setAttribute("uv",new _t(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new vi(e.width,e.height,e.widthSegments,e.heightSegments)}}class zr extends Nt{constructor(e=.5,t=1,n=32,r=1,a=0,s=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:r,thetaStart:a,thetaLength:s},n=Math.max(3,n),r=Math.max(1,r);const o=[],c=[],l=[],u=[];let h=e;const d=(t-e)/r,p=new C,x=new ye;for(let g=0;g<=r;g++){for(let m=0;m<=n;m++){const f=a+m/n*s;p.x=h*Math.cos(f),p.y=h*Math.sin(f),c.push(p.x,p.y,p.z),l.push(0,0,1),x.x=(p.x/t+1)/2,x.y=(p.y/t+1)/2,u.push(x.x,x.y)}h+=d}for(let g=0;g<r;g++){const m=g*(n+1);for(let f=0;f<n;f++){const M=f+m,y=M,w=M+n+1,A=M+n+2,b=M+1;o.push(y,w,b),o.push(w,A,b)}}this.setIndex(o),this.setAttribute("position",new _t(c,3)),this.setAttribute("normal",new _t(l,3)),this.setAttribute("uv",new _t(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new zr(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Eh extends xn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Ua extends dr{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ee(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ee(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=$l,this.normalScale=new ye(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new tn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class er extends Ua{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ye(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return qe(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ee(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ee(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ee(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class wh extends dr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=bf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Th extends dr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Va extends vt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ee(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Ah extends Va{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(vt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ee(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const gs=new je,Ic=new C,Lc=new C;class Xo{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ye(512,512),this.mapType=bt,this.map=null,this.mapPass=null,this.matrix=new je,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Vo,this._frameExtents=new ye(1,1),this._viewportCount=1,this._viewports=[new nt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Ic.setFromMatrixPosition(e.matrixWorld),t.position.copy(Ic),Lc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Lc),t.updateMatrixWorld(),gs.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(gs,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(gs)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class Rh extends Xo{constructor(){super(new zt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,n=or*2*e.angle*this.focus,r=this.mapSize.width/this.mapSize.height*this.aspect,a=e.distance||t.far;(n!==t.fov||r!==t.aspect||a!==t.far)&&(t.fov=n,t.aspect=r,t.far=a,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class Ch extends Va{constructor(e,t,n=0,r=Math.PI/3,a=0,s=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(vt.DEFAULT_UP),this.updateMatrix(),this.target=new vt,this.distance=n,this.angle=r,this.penumbra=a,this.decay=s,this.map=null,this.shadow=new Rh}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const Fc=new je,yr=new C,vs=new C;class Ph extends Xo{constructor(){super(new zt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ye(4,2),this._viewportCount=6,this._viewports=[new nt(2,1,1,1),new nt(0,1,1,1),new nt(3,1,1,1),new nt(1,1,1,1),new nt(3,0,1,1),new nt(1,0,1,1)],this._cubeDirections=[new C(1,0,0),new C(-1,0,0),new C(0,0,1),new C(0,0,-1),new C(0,1,0),new C(0,-1,0)],this._cubeUps=[new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,0,1),new C(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,r=this.matrix,a=e.distance||n.far;a!==n.far&&(n.far=a,n.updateProjectionMatrix()),yr.setFromMatrixPosition(e.matrixWorld),n.position.copy(yr),vs.copy(n.position),vs.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(vs),n.updateMatrixWorld(),r.makeTranslation(-yr.x,-yr.y,-yr.z),Fc.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Fc,n.coordinateSystem,n.reversedDepth)}}class Dh extends Va{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=r,this.shadow=new Ph}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class qo extends su{constructor(e=-1,t=1,n=1,r=-1,a=.1,s=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=a,this.far=s,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,a,s){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=a,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let a=n-e,s=n+e,o=r+t,c=r-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=l*this.view.offsetX,s=a+l*this.view.width,o-=u*this.view.offsetY,c=o-u*this.view.height}this.projectionMatrix.makeOrthographic(a,s,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Uh extends Xo{constructor(){super(new qo(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Nc extends Va{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(vt.DEFAULT_UP),this.updateMatrix(),this.target=new vt,this.shadow=new Uh}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Ih extends zt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class Lh{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function Oc(i,e,t,n){const r=Fh(n);switch(t){case jl:return i*e;case Gr:return i*e/r.components*r.byteLength;case Lo:return i*e/r.components*r.byteLength;case Fo:return i*e*2/r.components*r.byteLength;case No:return i*e*2/r.components*r.byteLength;case Kl:return i*e*3/r.components*r.byteLength;case Vt:return i*e*4/r.components*r.byteLength;case Oo:return i*e*4/r.components*r.byteLength;case ya:case Sa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Ea:case wa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ks:case Zs:return Math.max(i,16)*Math.max(e,8)/4;case js:case $s:return Math.max(i,8)*Math.max(e,8)/2;case Js:case Qs:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case eo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case to:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case no:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case io:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case ro:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case ao:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case so:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case oo:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case co:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case lo:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case uo:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case fo:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case ho:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case po:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case mo:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case xo:case go:case vo:return Math.ceil(i/4)*Math.ceil(e/4)*16;case _o:case bo:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Mo:case yo:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Fh(i){switch(i){case bt:case Wl:return{byteLength:1,components:1};case Fr:case Xl:case Lt:return{byteLength:2,components:1};case Uo:case Io:return{byteLength:2,components:4};case Zn:case Do:case sn:return{byteLength:4,components:1};case ql:case Yl:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Co}}));typeof window<"u"&&(window.__THREE__?Ve("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Co);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function fu(){let i=null,e=!1,t=null,n=null;function r(a,s){t(a,s),n=i.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(r),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(a){t=a},setContext:function(a){i=a}}}function Nh(i){const e=new WeakMap;function t(o,c){const l=o.array,u=o.usage,h=l.byteLength,d=i.createBuffer();i.bindBuffer(c,d),i.bufferData(c,l,u),o.onUploadCallback();let p;if(l instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)p=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)p=i.SHORT;else if(l instanceof Uint32Array)p=i.UNSIGNED_INT;else if(l instanceof Int32Array)p=i.INT;else if(l instanceof Int8Array)p=i.BYTE;else if(l instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:p,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:h}}function n(o,c,l){const u=c.array,h=c.updateRanges;if(i.bindBuffer(l,o),h.length===0)i.bufferSubData(l,0,u);else{h.sort((p,x)=>p.start-x.start);let d=0;for(let p=1;p<h.length;p++){const x=h[d],g=h[p];g.start<=x.start+x.count+1?x.count=Math.max(x.count,g.start+g.count-x.start):(++d,h[d]=g)}h.length=d+1;for(let p=0,x=h.length;p<x;p++){const g=h[p];i.bufferSubData(l,g.start*u.BYTES_PER_ELEMENT,u,g.start,g.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(i.deleteBuffer(c.buffer),e.delete(o))}function s(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:r,remove:a,update:s}}var Oh=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,kh=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Bh=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,zh=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Hh=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Vh=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Gh=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Wh=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Xh=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,qh=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Yh=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,jh=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Kh=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,$h=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Zh=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Jh=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Qh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,ed=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,td=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,nd=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,id=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,rd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,ad=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,sd=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,od=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,cd=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,ld=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ud=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,fd=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,hd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,dd="gl_FragColor = linearToOutputTexel( gl_FragColor );",pd=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,md=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,xd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,gd=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,vd=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,_d=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,bd=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Md=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,yd=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Sd=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Ed=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,wd=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Td=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Ad=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Rd=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Cd=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Pd=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Dd=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Ud=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Id=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Ld=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Fd=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 uv = vec2( roughness, dotNV );
	return texture2D( dfgLUT, uv ).rg;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = DFGApprox( vec3(0.0, 0.0, 1.0), vec3(sqrt(1.0 - dotNV * dotNV), 0.0, dotNV), material.roughness );
	vec2 dfgL = DFGApprox( vec3(0.0, 0.0, 1.0), vec3(sqrt(1.0 - dotNL * dotNL), 0.0, dotNL), material.roughness );
	vec3 FssEss_V = material.specularColor * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColor * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColor + ( 1.0 - material.specularColor ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Nd=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Od=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,kd=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Bd=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,zd=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Hd=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Vd=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Gd=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Wd=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Xd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,qd=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Yd=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,jd=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Kd=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,$d=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Zd=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Jd=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Qd=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ep=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,tp=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,np=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ip=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,rp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,ap=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,sp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,op=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,cp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,lp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,up=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,fp=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,hp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,dp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,pp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,mp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,xp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,gp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,vp=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,_p=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,bp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Mp=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,yp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Sp=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Ep=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,wp=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Tp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Ap=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Rp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Cp=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Pp=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Dp=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Up=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Ip=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Lp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Fp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Np=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Op=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,kp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Bp=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,zp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Hp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Vp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Gp=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Wp=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Xp=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,qp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Yp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jp=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Kp=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,$p=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Zp=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Jp=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Qp=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,e0=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,t0=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,n0=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,i0=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,r0=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,a0=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,s0=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,o0=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,c0=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,l0=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,u0=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,f0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,h0=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,d0=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,p0=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,m0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Xe={alphahash_fragment:Oh,alphahash_pars_fragment:kh,alphamap_fragment:Bh,alphamap_pars_fragment:zh,alphatest_fragment:Hh,alphatest_pars_fragment:Vh,aomap_fragment:Gh,aomap_pars_fragment:Wh,batching_pars_vertex:Xh,batching_vertex:qh,begin_vertex:Yh,beginnormal_vertex:jh,bsdfs:Kh,iridescence_fragment:$h,bumpmap_pars_fragment:Zh,clipping_planes_fragment:Jh,clipping_planes_pars_fragment:Qh,clipping_planes_pars_vertex:ed,clipping_planes_vertex:td,color_fragment:nd,color_pars_fragment:id,color_pars_vertex:rd,color_vertex:ad,common:sd,cube_uv_reflection_fragment:od,defaultnormal_vertex:cd,displacementmap_pars_vertex:ld,displacementmap_vertex:ud,emissivemap_fragment:fd,emissivemap_pars_fragment:hd,colorspace_fragment:dd,colorspace_pars_fragment:pd,envmap_fragment:md,envmap_common_pars_fragment:xd,envmap_pars_fragment:gd,envmap_pars_vertex:vd,envmap_physical_pars_fragment:Cd,envmap_vertex:_d,fog_vertex:bd,fog_pars_vertex:Md,fog_fragment:yd,fog_pars_fragment:Sd,gradientmap_pars_fragment:Ed,lightmap_pars_fragment:wd,lights_lambert_fragment:Td,lights_lambert_pars_fragment:Ad,lights_pars_begin:Rd,lights_toon_fragment:Pd,lights_toon_pars_fragment:Dd,lights_phong_fragment:Ud,lights_phong_pars_fragment:Id,lights_physical_fragment:Ld,lights_physical_pars_fragment:Fd,lights_fragment_begin:Nd,lights_fragment_maps:Od,lights_fragment_end:kd,logdepthbuf_fragment:Bd,logdepthbuf_pars_fragment:zd,logdepthbuf_pars_vertex:Hd,logdepthbuf_vertex:Vd,map_fragment:Gd,map_pars_fragment:Wd,map_particle_fragment:Xd,map_particle_pars_fragment:qd,metalnessmap_fragment:Yd,metalnessmap_pars_fragment:jd,morphinstance_vertex:Kd,morphcolor_vertex:$d,morphnormal_vertex:Zd,morphtarget_pars_vertex:Jd,morphtarget_vertex:Qd,normal_fragment_begin:ep,normal_fragment_maps:tp,normal_pars_fragment:np,normal_pars_vertex:ip,normal_vertex:rp,normalmap_pars_fragment:ap,clearcoat_normal_fragment_begin:sp,clearcoat_normal_fragment_maps:op,clearcoat_pars_fragment:cp,iridescence_pars_fragment:lp,opaque_fragment:up,packing:fp,premultiplied_alpha_fragment:hp,project_vertex:dp,dithering_fragment:pp,dithering_pars_fragment:mp,roughnessmap_fragment:xp,roughnessmap_pars_fragment:gp,shadowmap_pars_fragment:vp,shadowmap_pars_vertex:_p,shadowmap_vertex:bp,shadowmask_pars_fragment:Mp,skinbase_vertex:yp,skinning_pars_vertex:Sp,skinning_vertex:Ep,skinnormal_vertex:wp,specularmap_fragment:Tp,specularmap_pars_fragment:Ap,tonemapping_fragment:Rp,tonemapping_pars_fragment:Cp,transmission_fragment:Pp,transmission_pars_fragment:Dp,uv_pars_fragment:Up,uv_pars_vertex:Ip,uv_vertex:Lp,worldpos_vertex:Fp,background_vert:Np,background_frag:Op,backgroundCube_vert:kp,backgroundCube_frag:Bp,cube_vert:zp,cube_frag:Hp,depth_vert:Vp,depth_frag:Gp,distanceRGBA_vert:Wp,distanceRGBA_frag:Xp,equirect_vert:qp,equirect_frag:Yp,linedashed_vert:jp,linedashed_frag:Kp,meshbasic_vert:$p,meshbasic_frag:Zp,meshlambert_vert:Jp,meshlambert_frag:Qp,meshmatcap_vert:e0,meshmatcap_frag:t0,meshnormal_vert:n0,meshnormal_frag:i0,meshphong_vert:r0,meshphong_frag:a0,meshphysical_vert:s0,meshphysical_frag:o0,meshtoon_vert:c0,meshtoon_frag:l0,points_vert:u0,points_frag:f0,shadow_vert:h0,shadow_frag:d0,sprite_vert:p0,sprite_frag:m0},he={common:{diffuse:{value:new Ee(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new We}},envmap:{envMap:{value:null},envMapRotation:{value:new We},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new We}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new We}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new We},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new We},normalScale:{value:new ye(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new We},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new We}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new We}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new We}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ee(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ee(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0},uvTransform:{value:new We}},sprite:{diffuse:{value:new Ee(16777215)},opacity:{value:1},center:{value:new ye(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}}},bn={basic:{uniforms:Bt([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.fog]),vertexShader:Xe.meshbasic_vert,fragmentShader:Xe.meshbasic_frag},lambert:{uniforms:Bt([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new Ee(0)}}]),vertexShader:Xe.meshlambert_vert,fragmentShader:Xe.meshlambert_frag},phong:{uniforms:Bt([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new Ee(0)},specular:{value:new Ee(1118481)},shininess:{value:30}}]),vertexShader:Xe.meshphong_vert,fragmentShader:Xe.meshphong_frag},standard:{uniforms:Bt([he.common,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.roughnessmap,he.metalnessmap,he.fog,he.lights,{emissive:{value:new Ee(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag},toon:{uniforms:Bt([he.common,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.gradientmap,he.fog,he.lights,{emissive:{value:new Ee(0)}}]),vertexShader:Xe.meshtoon_vert,fragmentShader:Xe.meshtoon_frag},matcap:{uniforms:Bt([he.common,he.bumpmap,he.normalmap,he.displacementmap,he.fog,{matcap:{value:null}}]),vertexShader:Xe.meshmatcap_vert,fragmentShader:Xe.meshmatcap_frag},points:{uniforms:Bt([he.points,he.fog]),vertexShader:Xe.points_vert,fragmentShader:Xe.points_frag},dashed:{uniforms:Bt([he.common,he.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xe.linedashed_vert,fragmentShader:Xe.linedashed_frag},depth:{uniforms:Bt([he.common,he.displacementmap]),vertexShader:Xe.depth_vert,fragmentShader:Xe.depth_frag},normal:{uniforms:Bt([he.common,he.bumpmap,he.normalmap,he.displacementmap,{opacity:{value:1}}]),vertexShader:Xe.meshnormal_vert,fragmentShader:Xe.meshnormal_frag},sprite:{uniforms:Bt([he.sprite,he.fog]),vertexShader:Xe.sprite_vert,fragmentShader:Xe.sprite_frag},background:{uniforms:{uvTransform:{value:new We},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xe.background_vert,fragmentShader:Xe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new We}},vertexShader:Xe.backgroundCube_vert,fragmentShader:Xe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xe.cube_vert,fragmentShader:Xe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xe.equirect_vert,fragmentShader:Xe.equirect_frag},distanceRGBA:{uniforms:Bt([he.common,he.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xe.distanceRGBA_vert,fragmentShader:Xe.distanceRGBA_frag},shadow:{uniforms:Bt([he.lights,he.fog,{color:{value:new Ee(0)},opacity:{value:1}}]),vertexShader:Xe.shadow_vert,fragmentShader:Xe.shadow_frag}};bn.physical={uniforms:Bt([bn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new We},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new We},clearcoatNormalScale:{value:new ye(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new We},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new We},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new We},sheen:{value:0},sheenColor:{value:new Ee(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new We},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new We},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new We},transmissionSamplerSize:{value:new ye},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new We},attenuationDistance:{value:0},attenuationColor:{value:new Ee(0)},specularColor:{value:new Ee(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new We},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new We},anisotropyVector:{value:new ye},anisotropyMap:{value:null},anisotropyMapTransform:{value:new We}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag};const ma={r:0,b:0,g:0},ri=new tn,x0=new je;function g0(i,e,t,n,r,a,s){const o=new Ee(0);let c=a===!0?0:1,l,u,h=null,d=0,p=null;function x(y){let w=y.isScene===!0?y.background:null;return w&&w.isTexture&&(w=(y.backgroundBlurriness>0?t:e).get(w)),w}function g(y){let w=!1;const A=x(y);A===null?f(o,c):A&&A.isColor&&(f(A,1),w=!0);const b=i.xr.getEnvironmentBlendMode();b==="additive"?n.buffers.color.setClear(0,0,0,1,s):b==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,s),(i.autoClear||w)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(y,w){const A=x(w);A&&(A.isCubeTexture||A.mapping===za)?(u===void 0&&(u=new Ye(new hn(1,1,1),new xn({name:"BackgroundCubeMaterial",uniforms:cr(bn.backgroundCube.uniforms),vertexShader:bn.backgroundCube.vertexShader,fragmentShader:bn.backgroundCube.fragmentShader,side:Gt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(b,R,F){this.matrixWorld.copyPosition(F.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),ri.copy(w.backgroundRotation),ri.x*=-1,ri.y*=-1,ri.z*=-1,A.isCubeTexture&&A.isRenderTargetTexture===!1&&(ri.y*=-1,ri.z*=-1),u.material.uniforms.envMap.value=A,u.material.uniforms.flipEnvMap.value=A.isCubeTexture&&A.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(x0.makeRotationFromEuler(ri)),u.material.toneMapped=tt.getTransfer(A.colorSpace)!==at,(h!==A||d!==A.version||p!==i.toneMapping)&&(u.material.needsUpdate=!0,h=A,d=A.version,p=i.toneMapping),u.layers.enableAll(),y.unshift(u,u.geometry,u.material,0,0,null)):A&&A.isTexture&&(l===void 0&&(l=new Ye(new vi(2,2),new xn({name:"BackgroundMaterial",uniforms:cr(bn.background.uniforms),vertexShader:bn.background.vertexShader,fragmentShader:bn.background.fragmentShader,side:En,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=A,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.toneMapped=tt.getTransfer(A.colorSpace)!==at,A.matrixAutoUpdate===!0&&A.updateMatrix(),l.material.uniforms.uvTransform.value.copy(A.matrix),(h!==A||d!==A.version||p!==i.toneMapping)&&(l.material.needsUpdate=!0,h=A,d=A.version,p=i.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function f(y,w){y.getRGB(ma,au(i)),n.buffers.color.setClear(ma.r,ma.g,ma.b,w,s)}function M(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(y,w=1){o.set(y),c=w,f(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(y){c=y,f(o,c)},render:g,addToRenderList:m,dispose:M}}function v0(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=d(null);let a=r,s=!1;function o(v,P,O,L,q){let H=!1;const G=h(L,O,P);a!==G&&(a=G,l(a.object)),H=p(v,L,O,q),H&&x(v,L,O,q),q!==null&&e.update(q,i.ELEMENT_ARRAY_BUFFER),(H||s)&&(s=!1,w(v,P,O,L),q!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(q).buffer))}function c(){return i.createVertexArray()}function l(v){return i.bindVertexArray(v)}function u(v){return i.deleteVertexArray(v)}function h(v,P,O){const L=O.wireframe===!0;let q=n[v.id];q===void 0&&(q={},n[v.id]=q);let H=q[P.id];H===void 0&&(H={},q[P.id]=H);let G=H[L];return G===void 0&&(G=d(c()),H[L]=G),G}function d(v){const P=[],O=[],L=[];for(let q=0;q<t;q++)P[q]=0,O[q]=0,L[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:O,attributeDivisors:L,object:v,attributes:{},index:null}}function p(v,P,O,L){const q=a.attributes,H=P.attributes;let G=0;const $=O.getAttributes();for(const V in $)if($[V].location>=0){const te=q[V];let me=H[V];if(me===void 0&&(V==="instanceMatrix"&&v.instanceMatrix&&(me=v.instanceMatrix),V==="instanceColor"&&v.instanceColor&&(me=v.instanceColor)),te===void 0||te.attribute!==me||me&&te.data!==me.data)return!0;G++}return a.attributesNum!==G||a.index!==L}function x(v,P,O,L){const q={},H=P.attributes;let G=0;const $=O.getAttributes();for(const V in $)if($[V].location>=0){let te=H[V];te===void 0&&(V==="instanceMatrix"&&v.instanceMatrix&&(te=v.instanceMatrix),V==="instanceColor"&&v.instanceColor&&(te=v.instanceColor));const me={};me.attribute=te,te&&te.data&&(me.data=te.data),q[V]=me,G++}a.attributes=q,a.attributesNum=G,a.index=L}function g(){const v=a.newAttributes;for(let P=0,O=v.length;P<O;P++)v[P]=0}function m(v){f(v,0)}function f(v,P){const O=a.newAttributes,L=a.enabledAttributes,q=a.attributeDivisors;O[v]=1,L[v]===0&&(i.enableVertexAttribArray(v),L[v]=1),q[v]!==P&&(i.vertexAttribDivisor(v,P),q[v]=P)}function M(){const v=a.newAttributes,P=a.enabledAttributes;for(let O=0,L=P.length;O<L;O++)P[O]!==v[O]&&(i.disableVertexAttribArray(O),P[O]=0)}function y(v,P,O,L,q,H,G){G===!0?i.vertexAttribIPointer(v,P,O,q,H):i.vertexAttribPointer(v,P,O,L,q,H)}function w(v,P,O,L){g();const q=L.attributes,H=O.getAttributes(),G=P.defaultAttributeValues;for(const $ in H){const V=H[$];if(V.location>=0){let ee=q[$];if(ee===void 0&&($==="instanceMatrix"&&v.instanceMatrix&&(ee=v.instanceMatrix),$==="instanceColor"&&v.instanceColor&&(ee=v.instanceColor)),ee!==void 0){const te=ee.normalized,me=ee.itemSize,ue=e.get(ee);if(ue===void 0)continue;const Le=ue.buffer,Ge=ue.type,$e=ue.bytesPerElement,K=Ge===i.INT||Ge===i.UNSIGNED_INT||ee.gpuType===Do;if(ee.isInterleavedBufferAttribute){const j=ee.data,fe=j.stride,Pe=ee.offset;if(j.isInstancedInterleavedBuffer){for(let Se=0;Se<V.locationSize;Se++)f(V.location+Se,j.meshPerAttribute);v.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let Se=0;Se<V.locationSize;Se++)m(V.location+Se);i.bindBuffer(i.ARRAY_BUFFER,Le);for(let Se=0;Se<V.locationSize;Se++)y(V.location+Se,me/V.locationSize,Ge,te,fe*$e,(Pe+me/V.locationSize*Se)*$e,K)}else{if(ee.isInstancedBufferAttribute){for(let j=0;j<V.locationSize;j++)f(V.location+j,ee.meshPerAttribute);v.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let j=0;j<V.locationSize;j++)m(V.location+j);i.bindBuffer(i.ARRAY_BUFFER,Le);for(let j=0;j<V.locationSize;j++)y(V.location+j,me/V.locationSize,Ge,te,me*$e,me/V.locationSize*j*$e,K)}}else if(G!==void 0){const te=G[$];if(te!==void 0)switch(te.length){case 2:i.vertexAttrib2fv(V.location,te);break;case 3:i.vertexAttrib3fv(V.location,te);break;case 4:i.vertexAttrib4fv(V.location,te);break;default:i.vertexAttrib1fv(V.location,te)}}}}M()}function A(){F();for(const v in n){const P=n[v];for(const O in P){const L=P[O];for(const q in L)u(L[q].object),delete L[q];delete P[O]}delete n[v]}}function b(v){if(n[v.id]===void 0)return;const P=n[v.id];for(const O in P){const L=P[O];for(const q in L)u(L[q].object),delete L[q];delete P[O]}delete n[v.id]}function R(v){for(const P in n){const O=n[P];if(O[v.id]===void 0)continue;const L=O[v.id];for(const q in L)u(L[q].object),delete L[q];delete O[v.id]}}function F(){S(),s=!0,a!==r&&(a=r,l(a.object))}function S(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:F,resetDefaultState:S,dispose:A,releaseStatesOfGeometry:b,releaseStatesOfProgram:R,initAttributes:g,enableAttribute:m,disableUnusedAttributes:M}}function _0(i,e,t){let n;function r(l){n=l}function a(l,u){i.drawArrays(n,l,u),t.update(u,n,1)}function s(l,u,h){h!==0&&(i.drawArraysInstanced(n,l,u,h),t.update(u,n,h))}function o(l,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,u,0,h);let p=0;for(let x=0;x<h;x++)p+=u[x];t.update(p,n,1)}function c(l,u,h,d){if(h===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let x=0;x<l.length;x++)s(l[x],u[x],d[x]);else{p.multiDrawArraysInstancedWEBGL(n,l,0,u,0,d,0,h);let x=0;for(let g=0;g<h;g++)x+=u[g]*d[g];t.update(x,n,1)}}this.setMode=r,this.render=a,this.renderInstances=s,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function b0(i,e,t,n){let r;function a(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");r=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function s(R){return!(R!==Vt&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const F=R===Lt&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==bt&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==sn&&!F)}function c(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const u=c(l);u!==l&&(Ve("WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);const h=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),M=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),y=i.getParameter(i.MAX_VARYING_VECTORS),w=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),A=x>0,b=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:s,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:h,reversedDepthBuffer:d,maxTextures:p,maxVertexTextures:x,maxTextureSize:g,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:M,maxVaryings:y,maxFragmentUniforms:w,vertexTextures:A,maxSamples:b}}function M0(i){const e=this;let t=null,n=0,r=!1,a=!1;const s=new Yn,o=new We,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const p=h.length!==0||d||n!==0||r;return r=d,n=h.length,p},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(h,d){t=u(h,d,0)},this.setState=function(h,d,p){const x=h.clippingPlanes,g=h.clipIntersection,m=h.clipShadows,f=i.get(h);if(!r||x===null||x.length===0||a&&!m)a?u(null):l();else{const M=a?0:n,y=M*4;let w=f.clippingState||null;c.value=w,w=u(x,d,y,p);for(let A=0;A!==y;++A)w[A]=t[A];f.clippingState=w,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=M}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(h,d,p,x){const g=h!==null?h.length:0;let m=null;if(g!==0){if(m=c.value,x!==!0||m===null){const f=p+g*4,M=d.matrixWorldInverse;o.getNormalMatrix(M),(m===null||m.length<f)&&(m=new Float32Array(f));for(let y=0,w=p;y!==g;++y,w+=4)s.copy(h[y]).applyMatrix4(M,o),s.normal.toArray(m,w),m[w+3]=s.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=g,e.numIntersection=0,m}}function y0(i){let e=new WeakMap;function t(s,o){return o===Xs?s.mapping=rr:o===qs&&(s.mapping=ar),s}function n(s){if(s&&s.isTexture){const o=s.mapping;if(o===Xs||o===qs)if(e.has(s)){const c=e.get(s).texture;return t(c,s.mapping)}else{const c=s.image;if(c&&c.height>0){const l=new xh(c.height);return l.fromEquirectangularTexture(i,s),e.set(s,l),s.addEventListener("dispose",r),t(l.texture,s.mapping)}else return null}}return s}function r(s){const o=s.target;o.removeEventListener("dispose",r);const c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function a(){e=new WeakMap}return{get:n,dispose:a}}const $n=4,kc=[.125,.215,.35,.446,.526,.582],di=20,S0=256,Sr=new qo,Bc=new Ee;let _s=null,bs=0,Ms=0,ys=!1;const E0=new C;class zc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,a={}){const{size:s=256,position:o=E0}=a;_s=this._renderer.getRenderTarget(),bs=this._renderer.getActiveCubeFace(),Ms=this._renderer.getActiveMipmapLevel(),ys=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(s);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,r,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Gc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Vc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(_s,bs,Ms),this._renderer.xr.enabled=ys,e.scissorTest=!1,Fi(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===rr||e.mapping===ar?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),_s=this._renderer.getRenderTarget(),bs=this._renderer.getActiveCubeFace(),Ms=this._renderer.getActiveMipmapLevel(),ys=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:xt,minFilter:xt,generateMipmaps:!1,type:Lt,format:Vt,colorSpace:gi,depthBuffer:!1},r=Hc(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Hc(e,t,n);const{_lodMax:a}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=w0(a)),this._blurMaterial=A0(a,e,t),this._ggxMaterial=T0(a,e,t)}return r}_compileMaterial(e){const t=new Ye(new Nt,e);this._renderer.compile(t,Sr)}_sceneToCubeUV(e,t,n,r,a){const c=new zt(90,1,t,n),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,p=h.toneMapping;h.getClearColor(Bc),h.toneMapping=Fn,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(r),h.clearDepth(),h.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Ye(new hn,new Wr({name:"PMREM.Background",side:Gt,depthWrite:!1,depthTest:!1})));const g=this._backgroundBox,m=g.material;let f=!1;const M=e.background;M?M.isColor&&(m.color.copy(M),e.background=null,f=!0):(m.color.copy(Bc),f=!0);for(let y=0;y<6;y++){const w=y%3;w===0?(c.up.set(0,l[y],0),c.position.set(a.x,a.y,a.z),c.lookAt(a.x+u[y],a.y,a.z)):w===1?(c.up.set(0,0,l[y]),c.position.set(a.x,a.y,a.z),c.lookAt(a.x,a.y+u[y],a.z)):(c.up.set(0,l[y],0),c.position.set(a.x,a.y,a.z),c.lookAt(a.x,a.y,a.z+u[y]));const A=this._cubeSize;Fi(r,w*A,y>2?A:0,A,A),h.setRenderTarget(r),f&&h.render(g,c),h.render(e,c)}h.toneMapping=p,h.autoClear=d,e.background=M}_textureToCubeUV(e,t){const n=this._renderer,r=e.mapping===rr||e.mapping===ar;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Gc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Vc());const a=r?this._cubemapMaterial:this._equirectMaterial,s=this._lodMeshes[0];s.material=a;const o=a.uniforms;o.envMap.value=e;const c=this._cubeSize;Fi(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(s,Sr)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const r=this._lodMeshes.length;for(let a=1;a<r;a++)this._applyGGXFilter(e,a-1,a);t.autoClear=n}_applyGGXFilter(e,t,n){const r=this._renderer,a=this._pingPongRenderTarget,s=this._ggxMaterial,o=this._lodMeshes[n];o.material=s;const c=s.uniforms,l=n/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),h=Math.sqrt(l*l-u*u),d=.05+l*.95,p=h*d,{_lodMax:x}=this,g=this._sizeLods[n],m=3*g*(n>x-$n?n-x+$n:0),f=4*(this._cubeSize-g);c.envMap.value=e.texture,c.roughness.value=p,c.mipInt.value=x-t,Fi(a,m,f,3*g,2*g),r.setRenderTarget(a),r.render(o,Sr),c.envMap.value=a.texture,c.roughness.value=0,c.mipInt.value=x-n,Fi(e,m,f,3*g,2*g),r.setRenderTarget(e),r.render(o,Sr)}_blur(e,t,n,r,a){const s=this._pingPongRenderTarget;this._halfBlur(e,s,t,n,r,"latitudinal",a),this._halfBlur(s,e,n,n,r,"longitudinal",a)}_halfBlur(e,t,n,r,a,s,o){const c=this._renderer,l=this._blurMaterial;s!=="latitudinal"&&s!=="longitudinal"&&pt("blur direction must be either latitudinal or longitudinal!");const u=3,h=this._lodMeshes[r];h.material=l;const d=l.uniforms,p=this._sizeLods[n]-1,x=isFinite(a)?Math.PI/(2*p):2*Math.PI/(2*di-1),g=a/x,m=isFinite(a)?1+Math.floor(u*g):di;m>di&&Ve(`sigmaRadians, ${a}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${di}`);const f=[];let M=0;for(let R=0;R<di;++R){const F=R/g,S=Math.exp(-F*F/2);f.push(S),R===0?M+=S:R<m&&(M+=2*S)}for(let R=0;R<f.length;R++)f[R]=f[R]/M;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=f,d.latitudinal.value=s==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:y}=this;d.dTheta.value=x,d.mipInt.value=y-n;const w=this._sizeLods[r],A=3*w*(r>y-$n?r-y+$n:0),b=4*(this._cubeSize-w);Fi(t,A,b,3*w,2*w),c.setRenderTarget(t),c.render(h,Sr)}}function w0(i){const e=[],t=[],n=[];let r=i;const a=i-$n+1+kc.length;for(let s=0;s<a;s++){const o=Math.pow(2,r);e.push(o);let c=1/o;s>i-$n?c=kc[s-i+$n-1]:s===0&&(c=0),t.push(c);const l=1/(o-2),u=-l,h=1+l,d=[u,u,h,u,h,h,u,u,h,h,u,h],p=6,x=6,g=3,m=2,f=1,M=new Float32Array(g*x*p),y=new Float32Array(m*x*p),w=new Float32Array(f*x*p);for(let b=0;b<p;b++){const R=b%3*2/3-1,F=b>2?0:-1,S=[R,F,0,R+2/3,F,0,R+2/3,F+1,0,R,F,0,R+2/3,F+1,0,R,F+1,0];M.set(S,g*x*b),y.set(d,m*x*b);const v=[b,b,b,b,b,b];w.set(v,f*x*b)}const A=new Nt;A.setAttribute("position",new Ft(M,g)),A.setAttribute("uv",new Ft(y,m)),A.setAttribute("faceIndex",new Ft(w,f)),n.push(new Ye(A,null)),r>$n&&r--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function Hc(i,e,t){const n=new On(i,e,t);return n.texture.mapping=za,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Fi(i,e,t,n,r){i.viewport.set(e,t,n,r),i.scissor.set(e,t,n,r)}function T0(i,e,t){return new xn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:S0,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Ga(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 3.2: Transform view direction to hemisphere configuration
				vec3 Vh = normalize(vec3(alpha * V.x, alpha * V.y, V.z));

				// Section 4.1: Orthonormal basis
				float lensq = Vh.x * Vh.x + Vh.y * Vh.y;
				vec3 T1 = lensq > 0.0 ? vec3(-Vh.y, Vh.x, 0.0) / sqrt(lensq) : vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(Vh, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + Vh.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * Vh;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Sn,depthTest:!1,depthWrite:!1})}function A0(i,e,t){const n=new Float32Array(di),r=new C(0,1,0);return new xn({name:"SphericalGaussianBlur",defines:{n:di,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Ga(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Sn,depthTest:!1,depthWrite:!1})}function Vc(){return new xn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ga(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Sn,depthTest:!1,depthWrite:!1})}function Gc(){return new xn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ga(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Sn,depthTest:!1,depthWrite:!1})}function Ga(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function R0(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===Xs||c===qs,u=c===rr||c===ar;if(l||u){let h=e.get(o);const d=h!==void 0?h.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return t===null&&(t=new zc(i)),h=l?t.fromEquirectangular(o,h):t.fromCubemap(o,h),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),h.texture;if(h!==void 0)return h.texture;{const p=o.image;return l&&p&&p.height>0||u&&p&&r(p)?(t===null&&(t=new zc(i)),h=l?t.fromEquirectangular(o):t.fromCubemap(o),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),o.addEventListener("dispose",a),h.texture):null}}}return o}function r(o){let c=0;const l=6;for(let u=0;u<l;u++)o[u]!==void 0&&c++;return c===l}function a(o){const c=o.target;c.removeEventListener("dispose",a);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function s(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:s}}function C0(i){const e={};function t(n){if(e[n]!==void 0)return e[n];const r=i.getExtension(n);return e[n]=r,r}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const r=t(n);return r===null&&kr("WebGLRenderer: "+n+" extension not supported."),r}}}function P0(i,e,t,n){const r={},a=new WeakMap;function s(h){const d=h.target;d.index!==null&&e.remove(d.index);for(const x in d.attributes)e.remove(d.attributes[x]);d.removeEventListener("dispose",s),delete r[d.id];const p=a.get(d);p&&(e.remove(p),a.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(h,d){return r[d.id]===!0||(d.addEventListener("dispose",s),r[d.id]=!0,t.memory.geometries++),d}function c(h){const d=h.attributes;for(const p in d)e.update(d[p],i.ARRAY_BUFFER)}function l(h){const d=[],p=h.index,x=h.attributes.position;let g=0;if(p!==null){const M=p.array;g=p.version;for(let y=0,w=M.length;y<w;y+=3){const A=M[y+0],b=M[y+1],R=M[y+2];d.push(A,b,b,R,R,A)}}else if(x!==void 0){const M=x.array;g=x.version;for(let y=0,w=M.length/3-1;y<w;y+=3){const A=y+0,b=y+1,R=y+2;d.push(A,b,b,R,R,A)}}else return;const m=new(Jl(d)?ru:iu)(d,1);m.version=g;const f=a.get(h);f&&e.remove(f),a.set(h,m)}function u(h){const d=a.get(h);if(d){const p=h.index;p!==null&&d.version<p.version&&l(h)}else l(h);return a.get(h)}return{get:o,update:c,getWireframeAttribute:u}}function D0(i,e,t){let n;function r(d){n=d}let a,s;function o(d){a=d.type,s=d.bytesPerElement}function c(d,p){i.drawElements(n,p,a,d*s),t.update(p,n,1)}function l(d,p,x){x!==0&&(i.drawElementsInstanced(n,p,a,d*s,x),t.update(p,n,x))}function u(d,p,x){if(x===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,a,d,0,x);let m=0;for(let f=0;f<x;f++)m+=p[f];t.update(m,n,1)}function h(d,p,x,g){if(x===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<d.length;f++)l(d[f]/s,p[f],g[f]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,a,d,0,g,0,x);let f=0;for(let M=0;M<x;M++)f+=p[M]*g[M];t.update(f,n,1)}}this.setMode=r,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function U0(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(a,s,o){switch(t.calls++,s){case i.TRIANGLES:t.triangles+=o*(a/3);break;case i.LINES:t.lines+=o*(a/2);break;case i.LINE_STRIP:t.lines+=o*(a-1);break;case i.LINE_LOOP:t.lines+=o*a;break;case i.POINTS:t.points+=o*a;break;default:pt("WebGLInfo: Unknown draw mode:",s);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:n}}function I0(i,e,t){const n=new WeakMap,r=new nt;function a(s,o,c){const l=s.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=u!==void 0?u.length:0;let d=n.get(o);if(d===void 0||d.count!==h){let v=function(){F.dispose(),n.delete(o),o.removeEventListener("dispose",v)};var p=v;d!==void 0&&d.texture.dispose();const x=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,f=o.morphAttributes.position||[],M=o.morphAttributes.normal||[],y=o.morphAttributes.color||[];let w=0;x===!0&&(w=1),g===!0&&(w=2),m===!0&&(w=3);let A=o.attributes.position.count*w,b=1;A>e.maxTextureSize&&(b=Math.ceil(A/e.maxTextureSize),A=e.maxTextureSize);const R=new Float32Array(A*b*4*h),F=new Ql(R,A,b,h);F.type=sn,F.needsUpdate=!0;const S=w*4;for(let P=0;P<h;P++){const O=f[P],L=M[P],q=y[P],H=A*b*4*P;for(let G=0;G<O.count;G++){const $=G*S;x===!0&&(r.fromBufferAttribute(O,G),R[H+$+0]=r.x,R[H+$+1]=r.y,R[H+$+2]=r.z,R[H+$+3]=0),g===!0&&(r.fromBufferAttribute(L,G),R[H+$+4]=r.x,R[H+$+5]=r.y,R[H+$+6]=r.z,R[H+$+7]=0),m===!0&&(r.fromBufferAttribute(q,G),R[H+$+8]=r.x,R[H+$+9]=r.y,R[H+$+10]=r.z,R[H+$+11]=q.itemSize===4?r.w:1)}}d={count:h,texture:F,size:new ye(A,b)},n.set(o,d),o.addEventListener("dispose",v)}if(s.isInstancedMesh===!0&&s.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",s.morphTexture,t);else{let x=0;for(let m=0;m<l.length;m++)x+=l[m];const g=o.morphTargetsRelative?1:1-x;c.getUniforms().setValue(i,"morphTargetBaseInfluence",g),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:a}}function L0(i,e,t,n){let r=new WeakMap;function a(c){const l=n.render.frame,u=c.geometry,h=e.get(c,u);if(r.get(h)!==l&&(e.update(h),r.set(h,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),r.get(c)!==l&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;r.get(d)!==l&&(d.update(),r.set(d,l))}return h}function s(){r=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:a,dispose:s}}const hu=new Wt,Wc=new Go(1,1),du=new Ql,pu=new zo,mu=new ou,Xc=[],qc=[],Yc=new Float32Array(16),jc=new Float32Array(9),Kc=new Float32Array(4);function pr(i,e,t){const n=i[0];if(n<=0||n>0)return i;const r=e*t;let a=Xc[r];if(a===void 0&&(a=new Float32Array(r),Xc[r]=a),e!==0){n.toArray(a,0);for(let s=1,o=0;s!==e;++s)o+=t,i[s].toArray(a,o)}return a}function Mt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function yt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Wa(i,e){let t=qc[e];t===void 0&&(t=new Int32Array(e),qc[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function F0(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function N0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Mt(t,e))return;i.uniform2fv(this.addr,e),yt(t,e)}}function O0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Mt(t,e))return;i.uniform3fv(this.addr,e),yt(t,e)}}function k0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Mt(t,e))return;i.uniform4fv(this.addr,e),yt(t,e)}}function B0(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Mt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),yt(t,e)}else{if(Mt(t,n))return;Kc.set(n),i.uniformMatrix2fv(this.addr,!1,Kc),yt(t,n)}}function z0(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Mt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),yt(t,e)}else{if(Mt(t,n))return;jc.set(n),i.uniformMatrix3fv(this.addr,!1,jc),yt(t,n)}}function H0(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Mt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),yt(t,e)}else{if(Mt(t,n))return;Yc.set(n),i.uniformMatrix4fv(this.addr,!1,Yc),yt(t,n)}}function V0(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function G0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Mt(t,e))return;i.uniform2iv(this.addr,e),yt(t,e)}}function W0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Mt(t,e))return;i.uniform3iv(this.addr,e),yt(t,e)}}function X0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Mt(t,e))return;i.uniform4iv(this.addr,e),yt(t,e)}}function q0(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Y0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Mt(t,e))return;i.uniform2uiv(this.addr,e),yt(t,e)}}function j0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Mt(t,e))return;i.uniform3uiv(this.addr,e),yt(t,e)}}function K0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Mt(t,e))return;i.uniform4uiv(this.addr,e),yt(t,e)}}function $0(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let a;this.type===i.SAMPLER_2D_SHADOW?(Wc.compareFunction=Zl,a=Wc):a=hu,t.setTexture2D(e||a,r)}function Z0(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture3D(e||pu,r)}function J0(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTextureCube(e||mu,r)}function Q0(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture2DArray(e||du,r)}function em(i){switch(i){case 5126:return F0;case 35664:return N0;case 35665:return O0;case 35666:return k0;case 35674:return B0;case 35675:return z0;case 35676:return H0;case 5124:case 35670:return V0;case 35667:case 35671:return G0;case 35668:case 35672:return W0;case 35669:case 35673:return X0;case 5125:return q0;case 36294:return Y0;case 36295:return j0;case 36296:return K0;case 35678:case 36198:case 36298:case 36306:case 35682:return $0;case 35679:case 36299:case 36307:return Z0;case 35680:case 36300:case 36308:case 36293:return J0;case 36289:case 36303:case 36311:case 36292:return Q0}}function tm(i,e){i.uniform1fv(this.addr,e)}function nm(i,e){const t=pr(e,this.size,2);i.uniform2fv(this.addr,t)}function im(i,e){const t=pr(e,this.size,3);i.uniform3fv(this.addr,t)}function rm(i,e){const t=pr(e,this.size,4);i.uniform4fv(this.addr,t)}function am(i,e){const t=pr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function sm(i,e){const t=pr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function om(i,e){const t=pr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function cm(i,e){i.uniform1iv(this.addr,e)}function lm(i,e){i.uniform2iv(this.addr,e)}function um(i,e){i.uniform3iv(this.addr,e)}function fm(i,e){i.uniform4iv(this.addr,e)}function hm(i,e){i.uniform1uiv(this.addr,e)}function dm(i,e){i.uniform2uiv(this.addr,e)}function pm(i,e){i.uniform3uiv(this.addr,e)}function mm(i,e){i.uniform4uiv(this.addr,e)}function xm(i,e,t){const n=this.cache,r=e.length,a=Wa(t,r);Mt(n,a)||(i.uniform1iv(this.addr,a),yt(n,a));for(let s=0;s!==r;++s)t.setTexture2D(e[s]||hu,a[s])}function gm(i,e,t){const n=this.cache,r=e.length,a=Wa(t,r);Mt(n,a)||(i.uniform1iv(this.addr,a),yt(n,a));for(let s=0;s!==r;++s)t.setTexture3D(e[s]||pu,a[s])}function vm(i,e,t){const n=this.cache,r=e.length,a=Wa(t,r);Mt(n,a)||(i.uniform1iv(this.addr,a),yt(n,a));for(let s=0;s!==r;++s)t.setTextureCube(e[s]||mu,a[s])}function _m(i,e,t){const n=this.cache,r=e.length,a=Wa(t,r);Mt(n,a)||(i.uniform1iv(this.addr,a),yt(n,a));for(let s=0;s!==r;++s)t.setTexture2DArray(e[s]||du,a[s])}function bm(i){switch(i){case 5126:return tm;case 35664:return nm;case 35665:return im;case 35666:return rm;case 35674:return am;case 35675:return sm;case 35676:return om;case 5124:case 35670:return cm;case 35667:case 35671:return lm;case 35668:case 35672:return um;case 35669:case 35673:return fm;case 5125:return hm;case 36294:return dm;case 36295:return pm;case 36296:return mm;case 35678:case 36198:case 36298:case 36306:case 35682:return xm;case 35679:case 36299:case 36307:return gm;case 35680:case 36300:case 36308:case 36293:return vm;case 36289:case 36303:case 36311:case 36292:return _m}}class Mm{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=em(t.type)}}class ym{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=bm(t.type)}}class Sm{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const r=this.seq;for(let a=0,s=r.length;a!==s;++a){const o=r[a];o.setValue(e,t[o.id],n)}}}const Ss=/(\w+)(\])?(\[|\.)?/g;function $c(i,e){i.seq.push(e),i.map[e.id]=e}function Em(i,e,t){const n=i.name,r=n.length;for(Ss.lastIndex=0;;){const a=Ss.exec(n),s=Ss.lastIndex;let o=a[1];const c=a[2]==="]",l=a[3];if(c&&(o=o|0),l===void 0||l==="["&&s+2===r){$c(t,l===void 0?new Mm(o,i,e):new ym(o,i,e));break}else{let h=t.map[o];h===void 0&&(h=new Sm(o),$c(t,h)),t=h}}}class Ta{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){const a=e.getActiveUniform(t,r),s=e.getUniformLocation(t,a.name);Em(a,s,this)}}setValue(e,t,n,r){const a=this.map[t];a!==void 0&&a.setValue(e,n,r)}setOptional(e,t,n){const r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let a=0,s=t.length;a!==s;++a){const o=t[a],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,r)}}static seqWithValue(e,t){const n=[];for(let r=0,a=e.length;r!==a;++r){const s=e[r];s.id in t&&n.push(s)}return n}}function Zc(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const wm=37297;let Tm=0;function Am(i,e){const t=i.split(`
`),n=[],r=Math.max(e-6,0),a=Math.min(e+6,t.length);for(let s=r;s<a;s++){const o=s+1;n.push(`${o===e?">":" "} ${o}: ${t[s]}`)}return n.join(`
`)}const Jc=new We;function Rm(i){tt._getMatrix(Jc,tt.workingColorSpace,i);const e=`mat3( ${Jc.elements.map(t=>t.toFixed(4))} )`;switch(tt.getTransfer(i)){case Ca:return[e,"LinearTransferOETF"];case at:return[e,"sRGBTransferOETF"];default:return Ve("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Qc(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),a=(i.getShaderInfoLog(e)||"").trim();if(n&&a==="")return"";const s=/ERROR: 0:(\d+)/.exec(a);if(s){const o=parseInt(s[1]);return t.toUpperCase()+`

`+a+`

`+Am(i.getShaderSource(e),o)}else return a}function Cm(i,e){const t=Rm(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Pm(i,e){let t;switch(e){case hf:t="Linear";break;case df:t="Reinhard";break;case pf:t="Cineon";break;case mf:t="ACESFilmic";break;case gf:t="AgX";break;case vf:t="Neutral";break;case xf:t="Custom";break;default:Ve("WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const xa=new C;function Dm(){tt.getLuminanceCoefficients(xa);const i=xa.x.toFixed(4),e=xa.y.toFixed(4),t=xa.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Um(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Cr).join(`
`)}function Im(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Lm(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const a=i.getActiveAttrib(e,r),s=a.name;let o=1;a.type===i.FLOAT_MAT2&&(o=2),a.type===i.FLOAT_MAT3&&(o=3),a.type===i.FLOAT_MAT4&&(o=4),t[s]={type:a.type,location:i.getAttribLocation(e,s),locationSize:o}}return t}function Cr(i){return i!==""}function el(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function tl(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Fm=/^[ \t]*#include +<([\w\d./]+)>/gm;function To(i){return i.replace(Fm,Om)}const Nm=new Map;function Om(i,e){let t=Xe[e];if(t===void 0){const n=Nm.get(e);if(n!==void 0)t=Xe[n],Ve('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return To(t)}const km=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function nl(i){return i.replace(km,Bm)}function Bm(i,e,t,n){let r="";for(let a=parseInt(e);a<parseInt(t);a++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return r}function il(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function zm(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Po?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Wu?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===vn&&(e="SHADOWMAP_TYPE_VSM"),e}function Hm(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case rr:case ar:e="ENVMAP_TYPE_CUBE";break;case za:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Vm(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case ar:e="ENVMAP_MODE_REFRACTION";break}return e}function Gm(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Vl:e="ENVMAP_BLENDING_MULTIPLY";break;case uf:e="ENVMAP_BLENDING_MIX";break;case ff:e="ENVMAP_BLENDING_ADD";break}return e}function Wm(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Xm(i,e,t,n){const r=i.getContext(),a=t.defines;let s=t.vertexShader,o=t.fragmentShader;const c=zm(t),l=Hm(t),u=Vm(t),h=Gm(t),d=Wm(t),p=Um(t),x=Im(a),g=r.createProgram();let m,f,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(Cr).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(Cr).join(`
`),f.length>0&&(f+=`
`)):(m=[il(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Cr).join(`
`),f=[il(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Fn?"#define TONE_MAPPING":"",t.toneMapping!==Fn?Xe.tonemapping_pars_fragment:"",t.toneMapping!==Fn?Pm("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Xe.colorspace_pars_fragment,Cm("linearToOutputTexel",t.outputColorSpace),Dm(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Cr).join(`
`)),s=To(s),s=el(s,t),s=tl(s,t),o=To(o),o=el(o,t),o=tl(o,t),s=nl(s),o=nl(o),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",t.glslVersion===So?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===So?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const y=M+m+s,w=M+f+o,A=Zc(r,r.VERTEX_SHADER,y),b=Zc(r,r.FRAGMENT_SHADER,w);r.attachShader(g,A),r.attachShader(g,b),t.index0AttributeName!==void 0?r.bindAttribLocation(g,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(g,0,"position"),r.linkProgram(g);function R(P){if(i.debug.checkShaderErrors){const O=r.getProgramInfoLog(g)||"",L=r.getShaderInfoLog(A)||"",q=r.getShaderInfoLog(b)||"",H=O.trim(),G=L.trim(),$=q.trim();let V=!0,ee=!0;if(r.getProgramParameter(g,r.LINK_STATUS)===!1)if(V=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,g,A,b);else{const te=Qc(r,A,"vertex"),me=Qc(r,b,"fragment");pt("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(g,r.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+H+`
`+te+`
`+me)}else H!==""?Ve("WebGLProgram: Program Info Log:",H):(G===""||$==="")&&(ee=!1);ee&&(P.diagnostics={runnable:V,programLog:H,vertexShader:{log:G,prefix:m},fragmentShader:{log:$,prefix:f}})}r.deleteShader(A),r.deleteShader(b),F=new Ta(r,g),S=Lm(r,g)}let F;this.getUniforms=function(){return F===void 0&&R(this),F};let S;this.getAttributes=function(){return S===void 0&&R(this),S};let v=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=r.getProgramParameter(g,wm)),v},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(g),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Tm++,this.cacheKey=e,this.usedTimes=1,this.program=g,this.vertexShader=A,this.fragmentShader=b,this}let qm=0;class Ym{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,r=this._getShaderStage(t),a=this._getShaderStage(n),s=this._getShaderCacheForMaterial(e);return s.has(r)===!1&&(s.add(r),r.usedTimes++),s.has(a)===!1&&(s.add(a),a.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new jm(e),t.set(e,n)),n}}class jm{constructor(e){this.id=qm++,this.code=e,this.usedTimes=0}}function Km(i,e,t,n,r,a,s){const o=new tu,c=new Ym,l=new Set,u=[],h=r.logarithmicDepthBuffer,d=r.vertexTextures;let p=r.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(S){return l.add(S),S===0?"uv":`uv${S}`}function m(S,v,P,O,L){const q=O.fog,H=L.geometry,G=S.isMeshStandardMaterial?O.environment:null,$=(S.isMeshStandardMaterial?t:e).get(S.envMap||G),V=$&&$.mapping===za?$.image.height:null,ee=x[S.type];S.precision!==null&&(p=r.getMaxPrecision(S.precision),p!==S.precision&&Ve("WebGLProgram.getParameters:",S.precision,"not supported, using",p,"instead."));const te=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,me=te!==void 0?te.length:0;let ue=0;H.morphAttributes.position!==void 0&&(ue=1),H.morphAttributes.normal!==void 0&&(ue=2),H.morphAttributes.color!==void 0&&(ue=3);let Le,Ge,$e,K;if(ee){const Ae=bn[ee];Le=Ae.vertexShader,Ge=Ae.fragmentShader}else Le=S.vertexShader,Ge=S.fragmentShader,c.update(S),$e=c.getVertexShaderID(S),K=c.getFragmentShaderID(S);const j=i.getRenderTarget(),fe=i.state.buffers.depth.getReversed(),Pe=L.isInstancedMesh===!0,Se=L.isBatchedMesh===!0,He=!!S.map,ft=!!S.matcap,ke=!!$,it=!!S.aoMap,D=!!S.lightMap,Be=!!S.bumpMap,ze=!!S.normalMap,Je=!!S.displacementMap,xe=!!S.emissiveMap,Qe=!!S.metalnessMap,be=!!S.roughnessMap,De=S.anisotropy>0,T=S.clearcoat>0,_=S.dispersion>0,z=S.iridescence>0,Z=S.sheen>0,Q=S.transmission>0,Y=De&&!!S.anisotropyMap,Me=T&&!!S.clearcoatMap,ce=T&&!!S.clearcoatNormalMap,we=T&&!!S.clearcoatRoughnessMap,ve=z&&!!S.iridescenceMap,ne=z&&!!S.iridescenceThicknessMap,ie=Z&&!!S.sheenColorMap,Ce=Z&&!!S.sheenRoughnessMap,Te=!!S.specularMap,de=!!S.specularColorMap,Ue=!!S.specularIntensityMap,U=Q&&!!S.transmissionMap,se=Q&&!!S.thicknessMap,re=!!S.gradientMap,ae=!!S.alphaMap,I=S.alphaTest>0,N=!!S.alphaHash,J=!!S.extensions;let le=Fn;S.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(le=i.toneMapping);const Fe={shaderID:ee,shaderType:S.type,shaderName:S.name,vertexShader:Le,fragmentShader:Ge,defines:S.defines,customVertexShaderID:$e,customFragmentShaderID:K,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:p,batching:Se,batchingColor:Se&&L._colorsTexture!==null,instancing:Pe,instancingColor:Pe&&L.instanceColor!==null,instancingMorph:Pe&&L.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:j===null?i.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:gi,alphaToCoverage:!!S.alphaToCoverage,map:He,matcap:ft,envMap:ke,envMapMode:ke&&$.mapping,envMapCubeUVHeight:V,aoMap:it,lightMap:D,bumpMap:Be,normalMap:ze,displacementMap:d&&Je,emissiveMap:xe,normalMapObjectSpace:ze&&S.normalMapType===yf,normalMapTangentSpace:ze&&S.normalMapType===$l,metalnessMap:Qe,roughnessMap:be,anisotropy:De,anisotropyMap:Y,clearcoat:T,clearcoatMap:Me,clearcoatNormalMap:ce,clearcoatRoughnessMap:we,dispersion:_,iridescence:z,iridescenceMap:ve,iridescenceThicknessMap:ne,sheen:Z,sheenColorMap:ie,sheenRoughnessMap:Ce,specularMap:Te,specularColorMap:de,specularIntensityMap:Ue,transmission:Q,transmissionMap:U,thicknessMap:se,gradientMap:re,opaque:S.transparent===!1&&S.blending===Ji&&S.alphaToCoverage===!1,alphaMap:ae,alphaTest:I,alphaHash:N,combine:S.combine,mapUv:He&&g(S.map.channel),aoMapUv:it&&g(S.aoMap.channel),lightMapUv:D&&g(S.lightMap.channel),bumpMapUv:Be&&g(S.bumpMap.channel),normalMapUv:ze&&g(S.normalMap.channel),displacementMapUv:Je&&g(S.displacementMap.channel),emissiveMapUv:xe&&g(S.emissiveMap.channel),metalnessMapUv:Qe&&g(S.metalnessMap.channel),roughnessMapUv:be&&g(S.roughnessMap.channel),anisotropyMapUv:Y&&g(S.anisotropyMap.channel),clearcoatMapUv:Me&&g(S.clearcoatMap.channel),clearcoatNormalMapUv:ce&&g(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:we&&g(S.clearcoatRoughnessMap.channel),iridescenceMapUv:ve&&g(S.iridescenceMap.channel),iridescenceThicknessMapUv:ne&&g(S.iridescenceThicknessMap.channel),sheenColorMapUv:ie&&g(S.sheenColorMap.channel),sheenRoughnessMapUv:Ce&&g(S.sheenRoughnessMap.channel),specularMapUv:Te&&g(S.specularMap.channel),specularColorMapUv:de&&g(S.specularColorMap.channel),specularIntensityMapUv:Ue&&g(S.specularIntensityMap.channel),transmissionMapUv:U&&g(S.transmissionMap.channel),thicknessMapUv:se&&g(S.thicknessMap.channel),alphaMapUv:ae&&g(S.alphaMap.channel),vertexTangents:!!H.attributes.tangent&&(ze||De),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!H.attributes.uv&&(He||ae),fog:!!q,useFog:S.fog===!0,fogExp2:!!q&&q.isFogExp2,flatShading:S.flatShading===!0&&S.wireframe===!1,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:fe,skinning:L.isSkinnedMesh===!0,morphTargets:H.morphAttributes.position!==void 0,morphNormals:H.morphAttributes.normal!==void 0,morphColors:H.morphAttributes.color!==void 0,morphTargetsCount:me,morphTextureStride:ue,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:S.dithering,shadowMapEnabled:i.shadowMap.enabled&&P.length>0,shadowMapType:i.shadowMap.type,toneMapping:le,decodeVideoTexture:He&&S.map.isVideoTexture===!0&&tt.getTransfer(S.map.colorSpace)===at,decodeVideoTextureEmissive:xe&&S.emissiveMap.isVideoTexture===!0&&tt.getTransfer(S.emissiveMap.colorSpace)===at,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===un,flipSided:S.side===Gt,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:J&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(J&&S.extensions.multiDraw===!0||Se)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return Fe.vertexUv1s=l.has(1),Fe.vertexUv2s=l.has(2),Fe.vertexUv3s=l.has(3),l.clear(),Fe}function f(S){const v=[];if(S.shaderID?v.push(S.shaderID):(v.push(S.customVertexShaderID),v.push(S.customFragmentShaderID)),S.defines!==void 0)for(const P in S.defines)v.push(P),v.push(S.defines[P]);return S.isRawShaderMaterial===!1&&(M(v,S),y(v,S),v.push(i.outputColorSpace)),v.push(S.customProgramCacheKey),v.join()}function M(S,v){S.push(v.precision),S.push(v.outputColorSpace),S.push(v.envMapMode),S.push(v.envMapCubeUVHeight),S.push(v.mapUv),S.push(v.alphaMapUv),S.push(v.lightMapUv),S.push(v.aoMapUv),S.push(v.bumpMapUv),S.push(v.normalMapUv),S.push(v.displacementMapUv),S.push(v.emissiveMapUv),S.push(v.metalnessMapUv),S.push(v.roughnessMapUv),S.push(v.anisotropyMapUv),S.push(v.clearcoatMapUv),S.push(v.clearcoatNormalMapUv),S.push(v.clearcoatRoughnessMapUv),S.push(v.iridescenceMapUv),S.push(v.iridescenceThicknessMapUv),S.push(v.sheenColorMapUv),S.push(v.sheenRoughnessMapUv),S.push(v.specularMapUv),S.push(v.specularColorMapUv),S.push(v.specularIntensityMapUv),S.push(v.transmissionMapUv),S.push(v.thicknessMapUv),S.push(v.combine),S.push(v.fogExp2),S.push(v.sizeAttenuation),S.push(v.morphTargetsCount),S.push(v.morphAttributeCount),S.push(v.numDirLights),S.push(v.numPointLights),S.push(v.numSpotLights),S.push(v.numSpotLightMaps),S.push(v.numHemiLights),S.push(v.numRectAreaLights),S.push(v.numDirLightShadows),S.push(v.numPointLightShadows),S.push(v.numSpotLightShadows),S.push(v.numSpotLightShadowsWithMaps),S.push(v.numLightProbes),S.push(v.shadowMapType),S.push(v.toneMapping),S.push(v.numClippingPlanes),S.push(v.numClipIntersection),S.push(v.depthPacking)}function y(S,v){o.disableAll(),v.supportsVertexTextures&&o.enable(0),v.instancing&&o.enable(1),v.instancingColor&&o.enable(2),v.instancingMorph&&o.enable(3),v.matcap&&o.enable(4),v.envMap&&o.enable(5),v.normalMapObjectSpace&&o.enable(6),v.normalMapTangentSpace&&o.enable(7),v.clearcoat&&o.enable(8),v.iridescence&&o.enable(9),v.alphaTest&&o.enable(10),v.vertexColors&&o.enable(11),v.vertexAlphas&&o.enable(12),v.vertexUv1s&&o.enable(13),v.vertexUv2s&&o.enable(14),v.vertexUv3s&&o.enable(15),v.vertexTangents&&o.enable(16),v.anisotropy&&o.enable(17),v.alphaHash&&o.enable(18),v.batching&&o.enable(19),v.dispersion&&o.enable(20),v.batchingColor&&o.enable(21),v.gradientMap&&o.enable(22),S.push(o.mask),o.disableAll(),v.fog&&o.enable(0),v.useFog&&o.enable(1),v.flatShading&&o.enable(2),v.logarithmicDepthBuffer&&o.enable(3),v.reversedDepthBuffer&&o.enable(4),v.skinning&&o.enable(5),v.morphTargets&&o.enable(6),v.morphNormals&&o.enable(7),v.morphColors&&o.enable(8),v.premultipliedAlpha&&o.enable(9),v.shadowMapEnabled&&o.enable(10),v.doubleSided&&o.enable(11),v.flipSided&&o.enable(12),v.useDepthPacking&&o.enable(13),v.dithering&&o.enable(14),v.transmission&&o.enable(15),v.sheen&&o.enable(16),v.opaque&&o.enable(17),v.pointsUvs&&o.enable(18),v.decodeVideoTexture&&o.enable(19),v.decodeVideoTextureEmissive&&o.enable(20),v.alphaToCoverage&&o.enable(21),S.push(o.mask)}function w(S){const v=x[S.type];let P;if(v){const O=bn[v];P=hh.clone(O.uniforms)}else P=S.uniforms;return P}function A(S,v){let P;for(let O=0,L=u.length;O<L;O++){const q=u[O];if(q.cacheKey===v){P=q,++P.usedTimes;break}}return P===void 0&&(P=new Xm(i,v,S,a),u.push(P)),P}function b(S){if(--S.usedTimes===0){const v=u.indexOf(S);u[v]=u[u.length-1],u.pop(),S.destroy()}}function R(S){c.remove(S)}function F(){c.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:w,acquireProgram:A,releaseProgram:b,releaseShaderCache:R,programs:u,dispose:F}}function $m(){let i=new WeakMap;function e(s){return i.has(s)}function t(s){let o=i.get(s);return o===void 0&&(o={},i.set(s,o)),o}function n(s){i.delete(s)}function r(s,o,c){i.get(s)[o]=c}function a(){i=new WeakMap}return{has:e,get:t,remove:n,update:r,dispose:a}}function Zm(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function rl(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function al(){const i=[];let e=0;const t=[],n=[],r=[];function a(){e=0,t.length=0,n.length=0,r.length=0}function s(h,d,p,x,g,m){let f=i[e];return f===void 0?(f={id:h.id,object:h,geometry:d,material:p,groupOrder:x,renderOrder:h.renderOrder,z:g,group:m},i[e]=f):(f.id=h.id,f.object=h,f.geometry=d,f.material=p,f.groupOrder=x,f.renderOrder=h.renderOrder,f.z=g,f.group=m),e++,f}function o(h,d,p,x,g,m){const f=s(h,d,p,x,g,m);p.transmission>0?n.push(f):p.transparent===!0?r.push(f):t.push(f)}function c(h,d,p,x,g,m){const f=s(h,d,p,x,g,m);p.transmission>0?n.unshift(f):p.transparent===!0?r.unshift(f):t.unshift(f)}function l(h,d){t.length>1&&t.sort(h||Zm),n.length>1&&n.sort(d||rl),r.length>1&&r.sort(d||rl)}function u(){for(let h=e,d=i.length;h<d;h++){const p=i[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:r,init:a,push:o,unshift:c,finish:u,sort:l}}function Jm(){let i=new WeakMap;function e(n,r){const a=i.get(n);let s;return a===void 0?(s=new al,i.set(n,[s])):r>=a.length?(s=new al,a.push(s)):s=a[r],s}function t(){i=new WeakMap}return{get:e,dispose:t}}function Qm(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new C,color:new Ee};break;case"SpotLight":t={position:new C,direction:new C,color:new Ee,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new C,color:new Ee,distance:0,decay:0};break;case"HemisphereLight":t={direction:new C,skyColor:new Ee,groundColor:new Ee};break;case"RectAreaLight":t={color:new Ee,position:new C,halfWidth:new C,halfHeight:new C};break}return i[e.id]=t,t}}}function ex(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ye};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ye};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ye,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let tx=0;function nx(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function ix(i){const e=new Qm,t=ex(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new C);const r=new C,a=new je,s=new je;function o(l){let u=0,h=0,d=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let p=0,x=0,g=0,m=0,f=0,M=0,y=0,w=0,A=0,b=0,R=0;l.sort(nx);for(let S=0,v=l.length;S<v;S++){const P=l[S],O=P.color,L=P.intensity,q=P.distance,H=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)u+=O.r*L,h+=O.g*L,d+=O.b*L;else if(P.isLightProbe){for(let G=0;G<9;G++)n.probe[G].addScaledVector(P.sh.coefficients[G],L);R++}else if(P.isDirectionalLight){const G=e.get(P);if(G.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const $=P.shadow,V=t.get(P);V.shadowIntensity=$.intensity,V.shadowBias=$.bias,V.shadowNormalBias=$.normalBias,V.shadowRadius=$.radius,V.shadowMapSize=$.mapSize,n.directionalShadow[p]=V,n.directionalShadowMap[p]=H,n.directionalShadowMatrix[p]=P.shadow.matrix,M++}n.directional[p]=G,p++}else if(P.isSpotLight){const G=e.get(P);G.position.setFromMatrixPosition(P.matrixWorld),G.color.copy(O).multiplyScalar(L),G.distance=q,G.coneCos=Math.cos(P.angle),G.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),G.decay=P.decay,n.spot[g]=G;const $=P.shadow;if(P.map&&(n.spotLightMap[A]=P.map,A++,$.updateMatrices(P),P.castShadow&&b++),n.spotLightMatrix[g]=$.matrix,P.castShadow){const V=t.get(P);V.shadowIntensity=$.intensity,V.shadowBias=$.bias,V.shadowNormalBias=$.normalBias,V.shadowRadius=$.radius,V.shadowMapSize=$.mapSize,n.spotShadow[g]=V,n.spotShadowMap[g]=H,w++}g++}else if(P.isRectAreaLight){const G=e.get(P);G.color.copy(O).multiplyScalar(L),G.halfWidth.set(P.width*.5,0,0),G.halfHeight.set(0,P.height*.5,0),n.rectArea[m]=G,m++}else if(P.isPointLight){const G=e.get(P);if(G.color.copy(P.color).multiplyScalar(P.intensity),G.distance=P.distance,G.decay=P.decay,P.castShadow){const $=P.shadow,V=t.get(P);V.shadowIntensity=$.intensity,V.shadowBias=$.bias,V.shadowNormalBias=$.normalBias,V.shadowRadius=$.radius,V.shadowMapSize=$.mapSize,V.shadowCameraNear=$.camera.near,V.shadowCameraFar=$.camera.far,n.pointShadow[x]=V,n.pointShadowMap[x]=H,n.pointShadowMatrix[x]=P.shadow.matrix,y++}n.point[x]=G,x++}else if(P.isHemisphereLight){const G=e.get(P);G.skyColor.copy(P.color).multiplyScalar(L),G.groundColor.copy(P.groundColor).multiplyScalar(L),n.hemi[f]=G,f++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=he.LTC_FLOAT_1,n.rectAreaLTC2=he.LTC_FLOAT_2):(n.rectAreaLTC1=he.LTC_HALF_1,n.rectAreaLTC2=he.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=d;const F=n.hash;(F.directionalLength!==p||F.pointLength!==x||F.spotLength!==g||F.rectAreaLength!==m||F.hemiLength!==f||F.numDirectionalShadows!==M||F.numPointShadows!==y||F.numSpotShadows!==w||F.numSpotMaps!==A||F.numLightProbes!==R)&&(n.directional.length=p,n.spot.length=g,n.rectArea.length=m,n.point.length=x,n.hemi.length=f,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.pointShadow.length=y,n.pointShadowMap.length=y,n.spotShadow.length=w,n.spotShadowMap.length=w,n.directionalShadowMatrix.length=M,n.pointShadowMatrix.length=y,n.spotLightMatrix.length=w+A-b,n.spotLightMap.length=A,n.numSpotLightShadowsWithMaps=b,n.numLightProbes=R,F.directionalLength=p,F.pointLength=x,F.spotLength=g,F.rectAreaLength=m,F.hemiLength=f,F.numDirectionalShadows=M,F.numPointShadows=y,F.numSpotShadows=w,F.numSpotMaps=A,F.numLightProbes=R,n.version=tx++)}function c(l,u){let h=0,d=0,p=0,x=0,g=0;const m=u.matrixWorldInverse;for(let f=0,M=l.length;f<M;f++){const y=l[f];if(y.isDirectionalLight){const w=n.directional[h];w.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),w.direction.sub(r),w.direction.transformDirection(m),h++}else if(y.isSpotLight){const w=n.spot[p];w.position.setFromMatrixPosition(y.matrixWorld),w.position.applyMatrix4(m),w.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),w.direction.sub(r),w.direction.transformDirection(m),p++}else if(y.isRectAreaLight){const w=n.rectArea[x];w.position.setFromMatrixPosition(y.matrixWorld),w.position.applyMatrix4(m),s.identity(),a.copy(y.matrixWorld),a.premultiply(m),s.extractRotation(a),w.halfWidth.set(y.width*.5,0,0),w.halfHeight.set(0,y.height*.5,0),w.halfWidth.applyMatrix4(s),w.halfHeight.applyMatrix4(s),x++}else if(y.isPointLight){const w=n.point[d];w.position.setFromMatrixPosition(y.matrixWorld),w.position.applyMatrix4(m),d++}else if(y.isHemisphereLight){const w=n.hemi[g];w.direction.setFromMatrixPosition(y.matrixWorld),w.direction.transformDirection(m),g++}}}return{setup:o,setupView:c,state:n}}function sl(i){const e=new ix(i),t=[],n=[];function r(u){l.camera=u,t.length=0,n.length=0}function a(u){t.push(u)}function s(u){n.push(u)}function o(){e.setup(t)}function c(u){e.setupView(t,u)}const l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:l,setupLights:o,setupLightsView:c,pushLight:a,pushShadow:s}}function rx(i){let e=new WeakMap;function t(r,a=0){const s=e.get(r);let o;return s===void 0?(o=new sl(i),e.set(r,[o])):a>=s.length?(o=new sl(i),s.push(o)):o=s[a],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const ax=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,sx=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function ox(i,e,t){let n=new Vo;const r=new ye,a=new ye,s=new nt,o=new wh({depthPacking:Mf}),c=new Th,l={},u=t.maxTextureSize,h={[En]:Gt,[Gt]:En,[un]:un},d=new xn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ye},radius:{value:4}},vertexShader:ax,fragmentShader:sx}),p=d.clone();p.defines.HORIZONTAL_PASS=1;const x=new Nt;x.setAttribute("position",new Ft(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new Ye(x,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Po;let f=this.type;this.render=function(b,R,F){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||b.length===0)return;const S=i.getRenderTarget(),v=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),O=i.state;O.setBlending(Sn),O.buffers.depth.getReversed()===!0?O.buffers.color.setClear(0,0,0,0):O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);const L=f!==vn&&this.type===vn,q=f===vn&&this.type!==vn;for(let H=0,G=b.length;H<G;H++){const $=b[H],V=$.shadow;if(V===void 0){Ve("WebGLShadowMap:",$,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;r.copy(V.mapSize);const ee=V.getFrameExtents();if(r.multiply(ee),a.copy(V.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(a.x=Math.floor(u/ee.x),r.x=a.x*ee.x,V.mapSize.x=a.x),r.y>u&&(a.y=Math.floor(u/ee.y),r.y=a.y*ee.y,V.mapSize.y=a.y)),V.map===null||L===!0||q===!0){const me=this.type!==vn?{minFilter:gt,magFilter:gt}:{};V.map!==null&&V.map.dispose(),V.map=new On(r.x,r.y,me),V.map.texture.name=$.name+".shadowMap",V.camera.updateProjectionMatrix()}i.setRenderTarget(V.map),i.clear();const te=V.getViewportCount();for(let me=0;me<te;me++){const ue=V.getViewport(me);s.set(a.x*ue.x,a.y*ue.y,a.x*ue.z,a.y*ue.w),O.viewport(s),V.updateMatrices($,me),n=V.getFrustum(),w(R,F,V.camera,$,this.type)}V.isPointLightShadow!==!0&&this.type===vn&&M(V,F),V.needsUpdate=!1}f=this.type,m.needsUpdate=!1,i.setRenderTarget(S,v,P)};function M(b,R){const F=e.update(g);d.defines.VSM_SAMPLES!==b.blurSamples&&(d.defines.VSM_SAMPLES=b.blurSamples,p.defines.VSM_SAMPLES=b.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new On(r.x,r.y)),d.uniforms.shadow_pass.value=b.map.texture,d.uniforms.resolution.value=b.mapSize,d.uniforms.radius.value=b.radius,i.setRenderTarget(b.mapPass),i.clear(),i.renderBufferDirect(R,null,F,d,g,null),p.uniforms.shadow_pass.value=b.mapPass.texture,p.uniforms.resolution.value=b.mapSize,p.uniforms.radius.value=b.radius,i.setRenderTarget(b.map),i.clear(),i.renderBufferDirect(R,null,F,p,g,null)}function y(b,R,F,S){let v=null;const P=F.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(P!==void 0)v=P;else if(v=F.isPointLight===!0?c:o,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const O=v.uuid,L=R.uuid;let q=l[O];q===void 0&&(q={},l[O]=q);let H=q[L];H===void 0&&(H=v.clone(),q[L]=H,R.addEventListener("dispose",A)),v=H}if(v.visible=R.visible,v.wireframe=R.wireframe,S===vn?v.side=R.shadowSide!==null?R.shadowSide:R.side:v.side=R.shadowSide!==null?R.shadowSide:h[R.side],v.alphaMap=R.alphaMap,v.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,v.map=R.map,v.clipShadows=R.clipShadows,v.clippingPlanes=R.clippingPlanes,v.clipIntersection=R.clipIntersection,v.displacementMap=R.displacementMap,v.displacementScale=R.displacementScale,v.displacementBias=R.displacementBias,v.wireframeLinewidth=R.wireframeLinewidth,v.linewidth=R.linewidth,F.isPointLight===!0&&v.isMeshDistanceMaterial===!0){const O=i.properties.get(v);O.light=F}return v}function w(b,R,F,S,v){if(b.visible===!1)return;if(b.layers.test(R.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&v===vn)&&(!b.frustumCulled||n.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(F.matrixWorldInverse,b.matrixWorld);const L=e.update(b),q=b.material;if(Array.isArray(q)){const H=L.groups;for(let G=0,$=H.length;G<$;G++){const V=H[G],ee=q[V.materialIndex];if(ee&&ee.visible){const te=y(b,ee,S,v);b.onBeforeShadow(i,b,R,F,L,te,V),i.renderBufferDirect(F,null,L,te,b,V),b.onAfterShadow(i,b,R,F,L,te,V)}}}else if(q.visible){const H=y(b,q,S,v);b.onBeforeShadow(i,b,R,F,L,H,null),i.renderBufferDirect(F,null,L,H,b,null),b.onAfterShadow(i,b,R,F,L,H,null)}}const O=b.children;for(let L=0,q=O.length;L<q;L++)w(O[L],R,F,S,v)}function A(b){b.target.removeEventListener("dispose",A);for(const F in l){const S=l[F],v=b.target.uuid;v in S&&(S[v].dispose(),delete S[v])}}}const cx={[ks]:Bs,[zs]:Gs,[Hs]:Ws,[ir]:Vs,[Bs]:ks,[Gs]:zs,[Ws]:Hs,[Vs]:ir};function lx(i,e){function t(){let U=!1;const se=new nt;let re=null;const ae=new nt(0,0,0,0);return{setMask:function(I){re!==I&&!U&&(i.colorMask(I,I,I,I),re=I)},setLocked:function(I){U=I},setClear:function(I,N,J,le,Fe){Fe===!0&&(I*=le,N*=le,J*=le),se.set(I,N,J,le),ae.equals(se)===!1&&(i.clearColor(I,N,J,le),ae.copy(se))},reset:function(){U=!1,re=null,ae.set(-1,0,0,0)}}}function n(){let U=!1,se=!1,re=null,ae=null,I=null;return{setReversed:function(N){if(se!==N){const J=e.get("EXT_clip_control");N?J.clipControlEXT(J.LOWER_LEFT_EXT,J.ZERO_TO_ONE_EXT):J.clipControlEXT(J.LOWER_LEFT_EXT,J.NEGATIVE_ONE_TO_ONE_EXT),se=N;const le=I;I=null,this.setClear(le)}},getReversed:function(){return se},setTest:function(N){N?j(i.DEPTH_TEST):fe(i.DEPTH_TEST)},setMask:function(N){re!==N&&!U&&(i.depthMask(N),re=N)},setFunc:function(N){if(se&&(N=cx[N]),ae!==N){switch(N){case ks:i.depthFunc(i.NEVER);break;case Bs:i.depthFunc(i.ALWAYS);break;case zs:i.depthFunc(i.LESS);break;case ir:i.depthFunc(i.LEQUAL);break;case Hs:i.depthFunc(i.EQUAL);break;case Vs:i.depthFunc(i.GEQUAL);break;case Gs:i.depthFunc(i.GREATER);break;case Ws:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ae=N}},setLocked:function(N){U=N},setClear:function(N){I!==N&&(se&&(N=1-N),i.clearDepth(N),I=N)},reset:function(){U=!1,re=null,ae=null,I=null,se=!1}}}function r(){let U=!1,se=null,re=null,ae=null,I=null,N=null,J=null,le=null,Fe=null;return{setTest:function(Ae){U||(Ae?j(i.STENCIL_TEST):fe(i.STENCIL_TEST))},setMask:function(Ae){se!==Ae&&!U&&(i.stencilMask(Ae),se=Ae)},setFunc:function(Ae,Rt,qt){(re!==Ae||ae!==Rt||I!==qt)&&(i.stencilFunc(Ae,Rt,qt),re=Ae,ae=Rt,I=qt)},setOp:function(Ae,Rt,qt){(N!==Ae||J!==Rt||le!==qt)&&(i.stencilOp(Ae,Rt,qt),N=Ae,J=Rt,le=qt)},setLocked:function(Ae){U=Ae},setClear:function(Ae){Fe!==Ae&&(i.clearStencil(Ae),Fe=Ae)},reset:function(){U=!1,se=null,re=null,ae=null,I=null,N=null,J=null,le=null,Fe=null}}}const a=new t,s=new n,o=new r,c=new WeakMap,l=new WeakMap;let u={},h={},d=new WeakMap,p=[],x=null,g=!1,m=null,f=null,M=null,y=null,w=null,A=null,b=null,R=new Ee(0,0,0),F=0,S=!1,v=null,P=null,O=null,L=null,q=null;const H=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let G=!1,$=0;const V=i.getParameter(i.VERSION);V.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(V)[1]),G=$>=1):V.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),G=$>=2);let ee=null,te={};const me=i.getParameter(i.SCISSOR_BOX),ue=i.getParameter(i.VIEWPORT),Le=new nt().fromArray(me),Ge=new nt().fromArray(ue);function $e(U,se,re,ae){const I=new Uint8Array(4),N=i.createTexture();i.bindTexture(U,N),i.texParameteri(U,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(U,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let J=0;J<re;J++)U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY?i.texImage3D(se,0,i.RGBA,1,1,ae,0,i.RGBA,i.UNSIGNED_BYTE,I):i.texImage2D(se+J,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,I);return N}const K={};K[i.TEXTURE_2D]=$e(i.TEXTURE_2D,i.TEXTURE_2D,1),K[i.TEXTURE_CUBE_MAP]=$e(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),K[i.TEXTURE_2D_ARRAY]=$e(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),K[i.TEXTURE_3D]=$e(i.TEXTURE_3D,i.TEXTURE_3D,1,1),a.setClear(0,0,0,1),s.setClear(1),o.setClear(0),j(i.DEPTH_TEST),s.setFunc(ir),Be(!1),ze(ac),j(i.CULL_FACE),it(Sn);function j(U){u[U]!==!0&&(i.enable(U),u[U]=!0)}function fe(U){u[U]!==!1&&(i.disable(U),u[U]=!1)}function Pe(U,se){return h[U]!==se?(i.bindFramebuffer(U,se),h[U]=se,U===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=se),U===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=se),!0):!1}function Se(U,se){let re=p,ae=!1;if(U){re=d.get(se),re===void 0&&(re=[],d.set(se,re));const I=U.textures;if(re.length!==I.length||re[0]!==i.COLOR_ATTACHMENT0){for(let N=0,J=I.length;N<J;N++)re[N]=i.COLOR_ATTACHMENT0+N;re.length=I.length,ae=!0}}else re[0]!==i.BACK&&(re[0]=i.BACK,ae=!0);ae&&i.drawBuffers(re)}function He(U){return x!==U?(i.useProgram(U),x=U,!0):!1}const ft={[hi]:i.FUNC_ADD,[qu]:i.FUNC_SUBTRACT,[Yu]:i.FUNC_REVERSE_SUBTRACT};ft[ju]=i.MIN,ft[Ku]=i.MAX;const ke={[$u]:i.ZERO,[Zu]:i.ONE,[Ju]:i.SRC_COLOR,[Ns]:i.SRC_ALPHA,[af]:i.SRC_ALPHA_SATURATE,[nf]:i.DST_COLOR,[ef]:i.DST_ALPHA,[Qu]:i.ONE_MINUS_SRC_COLOR,[Os]:i.ONE_MINUS_SRC_ALPHA,[rf]:i.ONE_MINUS_DST_COLOR,[tf]:i.ONE_MINUS_DST_ALPHA,[sf]:i.CONSTANT_COLOR,[of]:i.ONE_MINUS_CONSTANT_COLOR,[cf]:i.CONSTANT_ALPHA,[lf]:i.ONE_MINUS_CONSTANT_ALPHA};function it(U,se,re,ae,I,N,J,le,Fe,Ae){if(U===Sn){g===!0&&(fe(i.BLEND),g=!1);return}if(g===!1&&(j(i.BLEND),g=!0),U!==Xu){if(U!==m||Ae!==S){if((f!==hi||w!==hi)&&(i.blendEquation(i.FUNC_ADD),f=hi,w=hi),Ae)switch(U){case Ji:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Lr:i.blendFunc(i.ONE,i.ONE);break;case sc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case oc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:pt("WebGLState: Invalid blending: ",U);break}else switch(U){case Ji:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Lr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case sc:pt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case oc:pt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:pt("WebGLState: Invalid blending: ",U);break}M=null,y=null,A=null,b=null,R.set(0,0,0),F=0,m=U,S=Ae}return}I=I||se,N=N||re,J=J||ae,(se!==f||I!==w)&&(i.blendEquationSeparate(ft[se],ft[I]),f=se,w=I),(re!==M||ae!==y||N!==A||J!==b)&&(i.blendFuncSeparate(ke[re],ke[ae],ke[N],ke[J]),M=re,y=ae,A=N,b=J),(le.equals(R)===!1||Fe!==F)&&(i.blendColor(le.r,le.g,le.b,Fe),R.copy(le),F=Fe),m=U,S=!1}function D(U,se){U.side===un?fe(i.CULL_FACE):j(i.CULL_FACE);let re=U.side===Gt;se&&(re=!re),Be(re),U.blending===Ji&&U.transparent===!1?it(Sn):it(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),s.setFunc(U.depthFunc),s.setTest(U.depthTest),s.setMask(U.depthWrite),a.setMask(U.colorWrite);const ae=U.stencilWrite;o.setTest(ae),ae&&(o.setMask(U.stencilWriteMask),o.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),o.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),xe(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?j(i.SAMPLE_ALPHA_TO_COVERAGE):fe(i.SAMPLE_ALPHA_TO_COVERAGE)}function Be(U){v!==U&&(U?i.frontFace(i.CW):i.frontFace(i.CCW),v=U)}function ze(U){U!==Vu?(j(i.CULL_FACE),U!==P&&(U===ac?i.cullFace(i.BACK):U===Gu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):fe(i.CULL_FACE),P=U}function Je(U){U!==O&&(G&&i.lineWidth(U),O=U)}function xe(U,se,re){U?(j(i.POLYGON_OFFSET_FILL),(L!==se||q!==re)&&(i.polygonOffset(se,re),L=se,q=re)):fe(i.POLYGON_OFFSET_FILL)}function Qe(U){U?j(i.SCISSOR_TEST):fe(i.SCISSOR_TEST)}function be(U){U===void 0&&(U=i.TEXTURE0+H-1),ee!==U&&(i.activeTexture(U),ee=U)}function De(U,se,re){re===void 0&&(ee===null?re=i.TEXTURE0+H-1:re=ee);let ae=te[re];ae===void 0&&(ae={type:void 0,texture:void 0},te[re]=ae),(ae.type!==U||ae.texture!==se)&&(ee!==re&&(i.activeTexture(re),ee=re),i.bindTexture(U,se||K[U]),ae.type=U,ae.texture=se)}function T(){const U=te[ee];U!==void 0&&U.type!==void 0&&(i.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function _(){try{i.compressedTexImage2D(...arguments)}catch(U){U("WebGLState:",U)}}function z(){try{i.compressedTexImage3D(...arguments)}catch(U){U("WebGLState:",U)}}function Z(){try{i.texSubImage2D(...arguments)}catch(U){U("WebGLState:",U)}}function Q(){try{i.texSubImage3D(...arguments)}catch(U){U("WebGLState:",U)}}function Y(){try{i.compressedTexSubImage2D(...arguments)}catch(U){U("WebGLState:",U)}}function Me(){try{i.compressedTexSubImage3D(...arguments)}catch(U){U("WebGLState:",U)}}function ce(){try{i.texStorage2D(...arguments)}catch(U){U("WebGLState:",U)}}function we(){try{i.texStorage3D(...arguments)}catch(U){U("WebGLState:",U)}}function ve(){try{i.texImage2D(...arguments)}catch(U){U("WebGLState:",U)}}function ne(){try{i.texImage3D(...arguments)}catch(U){U("WebGLState:",U)}}function ie(U){Le.equals(U)===!1&&(i.scissor(U.x,U.y,U.z,U.w),Le.copy(U))}function Ce(U){Ge.equals(U)===!1&&(i.viewport(U.x,U.y,U.z,U.w),Ge.copy(U))}function Te(U,se){let re=l.get(se);re===void 0&&(re=new WeakMap,l.set(se,re));let ae=re.get(U);ae===void 0&&(ae=i.getUniformBlockIndex(se,U.name),re.set(U,ae))}function de(U,se){const ae=l.get(se).get(U);c.get(se)!==ae&&(i.uniformBlockBinding(se,ae,U.__bindingPointIndex),c.set(se,ae))}function Ue(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),s.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},ee=null,te={},h={},d=new WeakMap,p=[],x=null,g=!1,m=null,f=null,M=null,y=null,w=null,A=null,b=null,R=new Ee(0,0,0),F=0,S=!1,v=null,P=null,O=null,L=null,q=null,Le.set(0,0,i.canvas.width,i.canvas.height),Ge.set(0,0,i.canvas.width,i.canvas.height),a.reset(),s.reset(),o.reset()}return{buffers:{color:a,depth:s,stencil:o},enable:j,disable:fe,bindFramebuffer:Pe,drawBuffers:Se,useProgram:He,setBlending:it,setMaterial:D,setFlipSided:Be,setCullFace:ze,setLineWidth:Je,setPolygonOffset:xe,setScissorTest:Qe,activeTexture:be,bindTexture:De,unbindTexture:T,compressedTexImage2D:_,compressedTexImage3D:z,texImage2D:ve,texImage3D:ne,updateUBOMapping:Te,uniformBlockBinding:de,texStorage2D:ce,texStorage3D:we,texSubImage2D:Z,texSubImage3D:Q,compressedTexSubImage2D:Y,compressedTexSubImage3D:Me,scissor:ie,viewport:Ce,reset:Ue}}function ux(i,e,t,n,r,a,s){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new ye,u=new WeakMap;let h;const d=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(T,_){return p?new OffscreenCanvas(T,_):Da("canvas")}function g(T,_,z){let Z=1;const Q=De(T);if((Q.width>z||Q.height>z)&&(Z=z/Math.max(Q.width,Q.height)),Z<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const Y=Math.floor(Z*Q.width),Me=Math.floor(Z*Q.height);h===void 0&&(h=x(Y,Me));const ce=_?x(Y,Me):h;return ce.width=Y,ce.height=Me,ce.getContext("2d").drawImage(T,0,0,Y,Me),Ve("WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+Y+"x"+Me+")."),ce}else return"data"in T&&Ve("WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),T;return T}function m(T){return T.generateMipmaps}function f(T){i.generateMipmap(T)}function M(T){return T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?i.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(T,_,z,Z,Q=!1){if(T!==null){if(i[T]!==void 0)return i[T];Ve("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let Y=_;if(_===i.RED&&(z===i.FLOAT&&(Y=i.R32F),z===i.HALF_FLOAT&&(Y=i.R16F),z===i.UNSIGNED_BYTE&&(Y=i.R8)),_===i.RED_INTEGER&&(z===i.UNSIGNED_BYTE&&(Y=i.R8UI),z===i.UNSIGNED_SHORT&&(Y=i.R16UI),z===i.UNSIGNED_INT&&(Y=i.R32UI),z===i.BYTE&&(Y=i.R8I),z===i.SHORT&&(Y=i.R16I),z===i.INT&&(Y=i.R32I)),_===i.RG&&(z===i.FLOAT&&(Y=i.RG32F),z===i.HALF_FLOAT&&(Y=i.RG16F),z===i.UNSIGNED_BYTE&&(Y=i.RG8)),_===i.RG_INTEGER&&(z===i.UNSIGNED_BYTE&&(Y=i.RG8UI),z===i.UNSIGNED_SHORT&&(Y=i.RG16UI),z===i.UNSIGNED_INT&&(Y=i.RG32UI),z===i.BYTE&&(Y=i.RG8I),z===i.SHORT&&(Y=i.RG16I),z===i.INT&&(Y=i.RG32I)),_===i.RGB_INTEGER&&(z===i.UNSIGNED_BYTE&&(Y=i.RGB8UI),z===i.UNSIGNED_SHORT&&(Y=i.RGB16UI),z===i.UNSIGNED_INT&&(Y=i.RGB32UI),z===i.BYTE&&(Y=i.RGB8I),z===i.SHORT&&(Y=i.RGB16I),z===i.INT&&(Y=i.RGB32I)),_===i.RGBA_INTEGER&&(z===i.UNSIGNED_BYTE&&(Y=i.RGBA8UI),z===i.UNSIGNED_SHORT&&(Y=i.RGBA16UI),z===i.UNSIGNED_INT&&(Y=i.RGBA32UI),z===i.BYTE&&(Y=i.RGBA8I),z===i.SHORT&&(Y=i.RGBA16I),z===i.INT&&(Y=i.RGBA32I)),_===i.RGB&&(z===i.UNSIGNED_INT_5_9_9_9_REV&&(Y=i.RGB9_E5),z===i.UNSIGNED_INT_10F_11F_11F_REV&&(Y=i.R11F_G11F_B10F)),_===i.RGBA){const Me=Q?Ca:tt.getTransfer(Z);z===i.FLOAT&&(Y=i.RGBA32F),z===i.HALF_FLOAT&&(Y=i.RGBA16F),z===i.UNSIGNED_BYTE&&(Y=Me===at?i.SRGB8_ALPHA8:i.RGBA8),z===i.UNSIGNED_SHORT_4_4_4_4&&(Y=i.RGBA4),z===i.UNSIGNED_SHORT_5_5_5_1&&(Y=i.RGB5_A1)}return(Y===i.R16F||Y===i.R32F||Y===i.RG16F||Y===i.RG32F||Y===i.RGBA16F||Y===i.RGBA32F)&&e.get("EXT_color_buffer_float"),Y}function w(T,_){let z;return T?_===null||_===Zn||_===Nr?z=i.DEPTH24_STENCIL8:_===sn?z=i.DEPTH32F_STENCIL8:_===Fr&&(z=i.DEPTH24_STENCIL8,Ve("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===Zn||_===Nr?z=i.DEPTH_COMPONENT24:_===sn?z=i.DEPTH_COMPONENT32F:_===Fr&&(z=i.DEPTH_COMPONENT16),z}function A(T,_){return m(T)===!0||T.isFramebufferTexture&&T.minFilter!==gt&&T.minFilter!==xt?Math.log2(Math.max(_.width,_.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?_.mipmaps.length:1}function b(T){const _=T.target;_.removeEventListener("dispose",b),F(_),_.isVideoTexture&&u.delete(_)}function R(T){const _=T.target;_.removeEventListener("dispose",R),v(_)}function F(T){const _=n.get(T);if(_.__webglInit===void 0)return;const z=T.source,Z=d.get(z);if(Z){const Q=Z[_.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&S(T),Object.keys(Z).length===0&&d.delete(z)}n.remove(T)}function S(T){const _=n.get(T);i.deleteTexture(_.__webglTexture);const z=T.source,Z=d.get(z);delete Z[_.__cacheKey],s.memory.textures--}function v(T){const _=n.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),n.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(_.__webglFramebuffer[Z]))for(let Q=0;Q<_.__webglFramebuffer[Z].length;Q++)i.deleteFramebuffer(_.__webglFramebuffer[Z][Q]);else i.deleteFramebuffer(_.__webglFramebuffer[Z]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[Z])}else{if(Array.isArray(_.__webglFramebuffer))for(let Z=0;Z<_.__webglFramebuffer.length;Z++)i.deleteFramebuffer(_.__webglFramebuffer[Z]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let Z=0;Z<_.__webglColorRenderbuffer.length;Z++)_.__webglColorRenderbuffer[Z]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[Z]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}const z=T.textures;for(let Z=0,Q=z.length;Z<Q;Z++){const Y=n.get(z[Z]);Y.__webglTexture&&(i.deleteTexture(Y.__webglTexture),s.memory.textures--),n.remove(z[Z])}n.remove(T)}let P=0;function O(){P=0}function L(){const T=P;return T>=r.maxTextures&&Ve("WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+r.maxTextures),P+=1,T}function q(T){const _=[];return _.push(T.wrapS),_.push(T.wrapT),_.push(T.wrapR||0),_.push(T.magFilter),_.push(T.minFilter),_.push(T.anisotropy),_.push(T.internalFormat),_.push(T.format),_.push(T.type),_.push(T.generateMipmaps),_.push(T.premultiplyAlpha),_.push(T.flipY),_.push(T.unpackAlignment),_.push(T.colorSpace),_.join()}function H(T,_){const z=n.get(T);if(T.isVideoTexture&&Qe(T),T.isRenderTargetTexture===!1&&T.isExternalTexture!==!0&&T.version>0&&z.__version!==T.version){const Z=T.image;if(Z===null)Ve("WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)Ve("WebGLRenderer: Texture marked for update but image is incomplete");else{K(z,T,_);return}}else T.isExternalTexture&&(z.__webglTexture=T.sourceTexture?T.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,z.__webglTexture,i.TEXTURE0+_)}function G(T,_){const z=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&z.__version!==T.version){K(z,T,_);return}else T.isExternalTexture&&(z.__webglTexture=T.sourceTexture?T.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,z.__webglTexture,i.TEXTURE0+_)}function $(T,_){const z=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&z.__version!==T.version){K(z,T,_);return}t.bindTexture(i.TEXTURE_3D,z.__webglTexture,i.TEXTURE0+_)}function V(T,_){const z=n.get(T);if(T.version>0&&z.__version!==T.version){j(z,T,_);return}t.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture,i.TEXTURE0+_)}const ee={[pn]:i.REPEAT,[It]:i.CLAMP_TO_EDGE,[Ys]:i.MIRRORED_REPEAT},te={[gt]:i.NEAREST,[_f]:i.NEAREST_MIPMAP_NEAREST,[jr]:i.NEAREST_MIPMAP_LINEAR,[xt]:i.LINEAR,[ja]:i.LINEAR_MIPMAP_NEAREST,[dn]:i.LINEAR_MIPMAP_LINEAR},me={[Sf]:i.NEVER,[Cf]:i.ALWAYS,[Ef]:i.LESS,[Zl]:i.LEQUAL,[wf]:i.EQUAL,[Rf]:i.GEQUAL,[Tf]:i.GREATER,[Af]:i.NOTEQUAL};function ue(T,_){if(_.type===sn&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===xt||_.magFilter===ja||_.magFilter===jr||_.magFilter===dn||_.minFilter===xt||_.minFilter===ja||_.minFilter===jr||_.minFilter===dn)&&Ve("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,ee[_.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,ee[_.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,ee[_.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,te[_.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,te[_.minFilter]),_.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,me[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===gt||_.minFilter!==jr&&_.minFilter!==dn||_.type===sn&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){const z=e.get("EXT_texture_filter_anisotropic");i.texParameterf(T,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,r.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function Le(T,_){let z=!1;T.__webglInit===void 0&&(T.__webglInit=!0,_.addEventListener("dispose",b));const Z=_.source;let Q=d.get(Z);Q===void 0&&(Q={},d.set(Z,Q));const Y=q(_);if(Y!==T.__cacheKey){Q[Y]===void 0&&(Q[Y]={texture:i.createTexture(),usedTimes:0},s.memory.textures++,z=!0),Q[Y].usedTimes++;const Me=Q[T.__cacheKey];Me!==void 0&&(Q[T.__cacheKey].usedTimes--,Me.usedTimes===0&&S(_)),T.__cacheKey=Y,T.__webglTexture=Q[Y].texture}return z}function Ge(T,_,z){return Math.floor(Math.floor(T/z)/_)}function $e(T,_,z,Z){const Y=T.updateRanges;if(Y.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,_.width,_.height,z,Z,_.data);else{Y.sort((ne,ie)=>ne.start-ie.start);let Me=0;for(let ne=1;ne<Y.length;ne++){const ie=Y[Me],Ce=Y[ne],Te=ie.start+ie.count,de=Ge(Ce.start,_.width,4),Ue=Ge(ie.start,_.width,4);Ce.start<=Te+1&&de===Ue&&Ge(Ce.start+Ce.count-1,_.width,4)===de?ie.count=Math.max(ie.count,Ce.start+Ce.count-ie.start):(++Me,Y[Me]=Ce)}Y.length=Me+1;const ce=i.getParameter(i.UNPACK_ROW_LENGTH),we=i.getParameter(i.UNPACK_SKIP_PIXELS),ve=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,_.width);for(let ne=0,ie=Y.length;ne<ie;ne++){const Ce=Y[ne],Te=Math.floor(Ce.start/4),de=Math.ceil(Ce.count/4),Ue=Te%_.width,U=Math.floor(Te/_.width),se=de,re=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Ue),i.pixelStorei(i.UNPACK_SKIP_ROWS,U),t.texSubImage2D(i.TEXTURE_2D,0,Ue,U,se,re,z,Z,_.data)}T.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,ce),i.pixelStorei(i.UNPACK_SKIP_PIXELS,we),i.pixelStorei(i.UNPACK_SKIP_ROWS,ve)}}function K(T,_,z){let Z=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(Z=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&(Z=i.TEXTURE_3D);const Q=Le(T,_),Y=_.source;t.bindTexture(Z,T.__webglTexture,i.TEXTURE0+z);const Me=n.get(Y);if(Y.version!==Me.__version||Q===!0){t.activeTexture(i.TEXTURE0+z);const ce=tt.getPrimaries(tt.workingColorSpace),we=_.colorSpace===Ht?null:tt.getPrimaries(_.colorSpace),ve=_.colorSpace===Ht||ce===we?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ve);let ne=g(_.image,!1,r.maxTextureSize);ne=be(_,ne);const ie=a.convert(_.format,_.colorSpace),Ce=a.convert(_.type);let Te=y(_.internalFormat,ie,Ce,_.colorSpace,_.isVideoTexture);ue(Z,_);let de;const Ue=_.mipmaps,U=_.isVideoTexture!==!0,se=Me.__version===void 0||Q===!0,re=Y.dataReady,ae=A(_,ne);if(_.isDepthTexture)Te=w(_.format===Or,_.type),se&&(U?t.texStorage2D(i.TEXTURE_2D,1,Te,ne.width,ne.height):t.texImage2D(i.TEXTURE_2D,0,Te,ne.width,ne.height,0,ie,Ce,null));else if(_.isDataTexture)if(Ue.length>0){U&&se&&t.texStorage2D(i.TEXTURE_2D,ae,Te,Ue[0].width,Ue[0].height);for(let I=0,N=Ue.length;I<N;I++)de=Ue[I],U?re&&t.texSubImage2D(i.TEXTURE_2D,I,0,0,de.width,de.height,ie,Ce,de.data):t.texImage2D(i.TEXTURE_2D,I,Te,de.width,de.height,0,ie,Ce,de.data);_.generateMipmaps=!1}else U?(se&&t.texStorage2D(i.TEXTURE_2D,ae,Te,ne.width,ne.height),re&&$e(_,ne,ie,Ce)):t.texImage2D(i.TEXTURE_2D,0,Te,ne.width,ne.height,0,ie,Ce,ne.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){U&&se&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ae,Te,Ue[0].width,Ue[0].height,ne.depth);for(let I=0,N=Ue.length;I<N;I++)if(de=Ue[I],_.format!==Vt)if(ie!==null)if(U){if(re)if(_.layerUpdates.size>0){const J=Oc(de.width,de.height,_.format,_.type);for(const le of _.layerUpdates){const Fe=de.data.subarray(le*J/de.data.BYTES_PER_ELEMENT,(le+1)*J/de.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,I,0,0,le,de.width,de.height,1,ie,Fe)}_.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,I,0,0,0,de.width,de.height,ne.depth,ie,de.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,I,Te,de.width,de.height,ne.depth,0,de.data,0,0);else Ve("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else U?re&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,I,0,0,0,de.width,de.height,ne.depth,ie,Ce,de.data):t.texImage3D(i.TEXTURE_2D_ARRAY,I,Te,de.width,de.height,ne.depth,0,ie,Ce,de.data)}else{U&&se&&t.texStorage2D(i.TEXTURE_2D,ae,Te,Ue[0].width,Ue[0].height);for(let I=0,N=Ue.length;I<N;I++)de=Ue[I],_.format!==Vt?ie!==null?U?re&&t.compressedTexSubImage2D(i.TEXTURE_2D,I,0,0,de.width,de.height,ie,de.data):t.compressedTexImage2D(i.TEXTURE_2D,I,Te,de.width,de.height,0,de.data):Ve("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):U?re&&t.texSubImage2D(i.TEXTURE_2D,I,0,0,de.width,de.height,ie,Ce,de.data):t.texImage2D(i.TEXTURE_2D,I,Te,de.width,de.height,0,ie,Ce,de.data)}else if(_.isDataArrayTexture)if(U){if(se&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ae,Te,ne.width,ne.height,ne.depth),re)if(_.layerUpdates.size>0){const I=Oc(ne.width,ne.height,_.format,_.type);for(const N of _.layerUpdates){const J=ne.data.subarray(N*I/ne.data.BYTES_PER_ELEMENT,(N+1)*I/ne.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,N,ne.width,ne.height,1,ie,Ce,J)}_.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ne.width,ne.height,ne.depth,ie,Ce,ne.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Te,ne.width,ne.height,ne.depth,0,ie,Ce,ne.data);else if(_.isData3DTexture)U?(se&&t.texStorage3D(i.TEXTURE_3D,ae,Te,ne.width,ne.height,ne.depth),re&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ne.width,ne.height,ne.depth,ie,Ce,ne.data)):t.texImage3D(i.TEXTURE_3D,0,Te,ne.width,ne.height,ne.depth,0,ie,Ce,ne.data);else if(_.isFramebufferTexture){if(se)if(U)t.texStorage2D(i.TEXTURE_2D,ae,Te,ne.width,ne.height);else{let I=ne.width,N=ne.height;for(let J=0;J<ae;J++)t.texImage2D(i.TEXTURE_2D,J,Te,I,N,0,ie,Ce,null),I>>=1,N>>=1}}else if(Ue.length>0){if(U&&se){const I=De(Ue[0]);t.texStorage2D(i.TEXTURE_2D,ae,Te,I.width,I.height)}for(let I=0,N=Ue.length;I<N;I++)de=Ue[I],U?re&&t.texSubImage2D(i.TEXTURE_2D,I,0,0,ie,Ce,de):t.texImage2D(i.TEXTURE_2D,I,Te,ie,Ce,de);_.generateMipmaps=!1}else if(U){if(se){const I=De(ne);t.texStorage2D(i.TEXTURE_2D,ae,Te,I.width,I.height)}re&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ie,Ce,ne)}else t.texImage2D(i.TEXTURE_2D,0,Te,ie,Ce,ne);m(_)&&f(Z),Me.__version=Y.version,_.onUpdate&&_.onUpdate(_)}T.__version=_.version}function j(T,_,z){if(_.image.length!==6)return;const Z=Le(T,_),Q=_.source;t.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+z);const Y=n.get(Q);if(Q.version!==Y.__version||Z===!0){t.activeTexture(i.TEXTURE0+z);const Me=tt.getPrimaries(tt.workingColorSpace),ce=_.colorSpace===Ht?null:tt.getPrimaries(_.colorSpace),we=_.colorSpace===Ht||Me===ce?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,we);const ve=_.isCompressedTexture||_.image[0].isCompressedTexture,ne=_.image[0]&&_.image[0].isDataTexture,ie=[];for(let N=0;N<6;N++)!ve&&!ne?ie[N]=g(_.image[N],!0,r.maxCubemapSize):ie[N]=ne?_.image[N].image:_.image[N],ie[N]=be(_,ie[N]);const Ce=ie[0],Te=a.convert(_.format,_.colorSpace),de=a.convert(_.type),Ue=y(_.internalFormat,Te,de,_.colorSpace),U=_.isVideoTexture!==!0,se=Y.__version===void 0||Z===!0,re=Q.dataReady;let ae=A(_,Ce);ue(i.TEXTURE_CUBE_MAP,_);let I;if(ve){U&&se&&t.texStorage2D(i.TEXTURE_CUBE_MAP,ae,Ue,Ce.width,Ce.height);for(let N=0;N<6;N++){I=ie[N].mipmaps;for(let J=0;J<I.length;J++){const le=I[J];_.format!==Vt?Te!==null?U?re&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+N,J,0,0,le.width,le.height,Te,le.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+N,J,Ue,le.width,le.height,0,le.data):Ve("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):U?re&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+N,J,0,0,le.width,le.height,Te,de,le.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+N,J,Ue,le.width,le.height,0,Te,de,le.data)}}}else{if(I=_.mipmaps,U&&se){I.length>0&&ae++;const N=De(ie[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,ae,Ue,N.width,N.height)}for(let N=0;N<6;N++)if(ne){U?re&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+N,0,0,0,ie[N].width,ie[N].height,Te,de,ie[N].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+N,0,Ue,ie[N].width,ie[N].height,0,Te,de,ie[N].data);for(let J=0;J<I.length;J++){const Fe=I[J].image[N].image;U?re&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+N,J+1,0,0,Fe.width,Fe.height,Te,de,Fe.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+N,J+1,Ue,Fe.width,Fe.height,0,Te,de,Fe.data)}}else{U?re&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+N,0,0,0,Te,de,ie[N]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+N,0,Ue,Te,de,ie[N]);for(let J=0;J<I.length;J++){const le=I[J];U?re&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+N,J+1,0,0,Te,de,le.image[N]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+N,J+1,Ue,Te,de,le.image[N])}}}m(_)&&f(i.TEXTURE_CUBE_MAP),Y.__version=Q.version,_.onUpdate&&_.onUpdate(_)}T.__version=_.version}function fe(T,_,z,Z,Q,Y){const Me=a.convert(z.format,z.colorSpace),ce=a.convert(z.type),we=y(z.internalFormat,Me,ce,z.colorSpace),ve=n.get(_),ne=n.get(z);if(ne.__renderTarget=_,!ve.__hasExternalTextures){const ie=Math.max(1,_.width>>Y),Ce=Math.max(1,_.height>>Y);Q===i.TEXTURE_3D||Q===i.TEXTURE_2D_ARRAY?t.texImage3D(Q,Y,we,ie,Ce,_.depth,0,Me,ce,null):t.texImage2D(Q,Y,we,ie,Ce,0,Me,ce,null)}t.bindFramebuffer(i.FRAMEBUFFER,T),xe(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Z,Q,ne.__webglTexture,0,Je(_)):(Q===i.TEXTURE_2D||Q>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Z,Q,ne.__webglTexture,Y),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Pe(T,_,z){if(i.bindRenderbuffer(i.RENDERBUFFER,T),_.depthBuffer){const Z=_.depthTexture,Q=Z&&Z.isDepthTexture?Z.type:null,Y=w(_.stencilBuffer,Q),Me=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ce=Je(_);xe(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ce,Y,_.width,_.height):z?i.renderbufferStorageMultisample(i.RENDERBUFFER,ce,Y,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,Y,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Me,i.RENDERBUFFER,T)}else{const Z=_.textures;for(let Q=0;Q<Z.length;Q++){const Y=Z[Q],Me=a.convert(Y.format,Y.colorSpace),ce=a.convert(Y.type),we=y(Y.internalFormat,Me,ce,Y.colorSpace),ve=Je(_);z&&xe(_)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,ve,we,_.width,_.height):xe(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ve,we,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,we,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Se(T,_){if(_&&_.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,T),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Z=n.get(_.depthTexture);Z.__renderTarget=_,(!Z.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),H(_.depthTexture,0);const Q=Z.__webglTexture,Y=Je(_);if(_.depthTexture.format===sr)xe(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Q,0,Y):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Q,0);else if(_.depthTexture.format===Or)xe(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Q,0,Y):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function He(T){const _=n.get(T),z=T.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==T.depthTexture){const Z=T.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),Z){const Q=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,Z.removeEventListener("dispose",Q)};Z.addEventListener("dispose",Q),_.__depthDisposeCallback=Q}_.__boundDepthTexture=Z}if(T.depthTexture&&!_.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");const Z=T.texture.mipmaps;Z&&Z.length>0?Se(_.__webglFramebuffer[0],T):Se(_.__webglFramebuffer,T)}else if(z){_.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[Z]),_.__webglDepthbuffer[Z]===void 0)_.__webglDepthbuffer[Z]=i.createRenderbuffer(),Pe(_.__webglDepthbuffer[Z],T,!1);else{const Q=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Y=_.__webglDepthbuffer[Z];i.bindRenderbuffer(i.RENDERBUFFER,Y),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,Y)}}else{const Z=T.texture.mipmaps;if(Z&&Z.length>0?t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=i.createRenderbuffer(),Pe(_.__webglDepthbuffer,T,!1);else{const Q=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Y=_.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,Y),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,Y)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function ft(T,_,z){const Z=n.get(T);_!==void 0&&fe(Z.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),z!==void 0&&He(T)}function ke(T){const _=T.texture,z=n.get(T),Z=n.get(_);T.addEventListener("dispose",R);const Q=T.textures,Y=T.isWebGLCubeRenderTarget===!0,Me=Q.length>1;if(Me||(Z.__webglTexture===void 0&&(Z.__webglTexture=i.createTexture()),Z.__version=_.version,s.memory.textures++),Y){z.__webglFramebuffer=[];for(let ce=0;ce<6;ce++)if(_.mipmaps&&_.mipmaps.length>0){z.__webglFramebuffer[ce]=[];for(let we=0;we<_.mipmaps.length;we++)z.__webglFramebuffer[ce][we]=i.createFramebuffer()}else z.__webglFramebuffer[ce]=i.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){z.__webglFramebuffer=[];for(let ce=0;ce<_.mipmaps.length;ce++)z.__webglFramebuffer[ce]=i.createFramebuffer()}else z.__webglFramebuffer=i.createFramebuffer();if(Me)for(let ce=0,we=Q.length;ce<we;ce++){const ve=n.get(Q[ce]);ve.__webglTexture===void 0&&(ve.__webglTexture=i.createTexture(),s.memory.textures++)}if(T.samples>0&&xe(T)===!1){z.__webglMultisampledFramebuffer=i.createFramebuffer(),z.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let ce=0;ce<Q.length;ce++){const we=Q[ce];z.__webglColorRenderbuffer[ce]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,z.__webglColorRenderbuffer[ce]);const ve=a.convert(we.format,we.colorSpace),ne=a.convert(we.type),ie=y(we.internalFormat,ve,ne,we.colorSpace,T.isXRRenderTarget===!0),Ce=Je(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ce,ie,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ce,i.RENDERBUFFER,z.__webglColorRenderbuffer[ce])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(z.__webglDepthRenderbuffer=i.createRenderbuffer(),Pe(z.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Y){t.bindTexture(i.TEXTURE_CUBE_MAP,Z.__webglTexture),ue(i.TEXTURE_CUBE_MAP,_);for(let ce=0;ce<6;ce++)if(_.mipmaps&&_.mipmaps.length>0)for(let we=0;we<_.mipmaps.length;we++)fe(z.__webglFramebuffer[ce][we],T,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,we);else fe(z.__webglFramebuffer[ce],T,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0);m(_)&&f(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Me){for(let ce=0,we=Q.length;ce<we;ce++){const ve=Q[ce],ne=n.get(ve);let ie=i.TEXTURE_2D;(T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ie=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ie,ne.__webglTexture),ue(ie,ve),fe(z.__webglFramebuffer,T,ve,i.COLOR_ATTACHMENT0+ce,ie,0),m(ve)&&f(ie)}t.unbindTexture()}else{let ce=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ce=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ce,Z.__webglTexture),ue(ce,_),_.mipmaps&&_.mipmaps.length>0)for(let we=0;we<_.mipmaps.length;we++)fe(z.__webglFramebuffer[we],T,_,i.COLOR_ATTACHMENT0,ce,we);else fe(z.__webglFramebuffer,T,_,i.COLOR_ATTACHMENT0,ce,0);m(_)&&f(ce),t.unbindTexture()}T.depthBuffer&&He(T)}function it(T){const _=T.textures;for(let z=0,Z=_.length;z<Z;z++){const Q=_[z];if(m(Q)){const Y=M(T),Me=n.get(Q).__webglTexture;t.bindTexture(Y,Me),f(Y),t.unbindTexture()}}}const D=[],Be=[];function ze(T){if(T.samples>0){if(xe(T)===!1){const _=T.textures,z=T.width,Z=T.height;let Q=i.COLOR_BUFFER_BIT;const Y=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Me=n.get(T),ce=_.length>1;if(ce)for(let ve=0;ve<_.length;ve++)t.bindFramebuffer(i.FRAMEBUFFER,Me.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ve,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Me.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ve,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Me.__webglMultisampledFramebuffer);const we=T.texture.mipmaps;we&&we.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Me.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Me.__webglFramebuffer);for(let ve=0;ve<_.length;ve++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(Q|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(Q|=i.STENCIL_BUFFER_BIT)),ce){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Me.__webglColorRenderbuffer[ve]);const ne=n.get(_[ve]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ne,0)}i.blitFramebuffer(0,0,z,Z,0,0,z,Z,Q,i.NEAREST),c===!0&&(D.length=0,Be.length=0,D.push(i.COLOR_ATTACHMENT0+ve),T.depthBuffer&&T.resolveDepthBuffer===!1&&(D.push(Y),Be.push(Y),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Be)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,D))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ce)for(let ve=0;ve<_.length;ve++){t.bindFramebuffer(i.FRAMEBUFFER,Me.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ve,i.RENDERBUFFER,Me.__webglColorRenderbuffer[ve]);const ne=n.get(_[ve]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Me.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ve,i.TEXTURE_2D,ne,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Me.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&c){const _=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_])}}}function Je(T){return Math.min(r.maxSamples,T.samples)}function xe(T){const _=n.get(T);return T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function Qe(T){const _=s.render.frame;u.get(T)!==_&&(u.set(T,_),T.update())}function be(T,_){const z=T.colorSpace,Z=T.format,Q=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||z!==gi&&z!==Ht&&(tt.getTransfer(z)===at?(Z!==Vt||Q!==bt)&&Ve("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):pt("WebGLTextures: Unsupported texture color space:",z)),_}function De(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(l.width=T.naturalWidth||T.width,l.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(l.width=T.displayWidth,l.height=T.displayHeight):(l.width=T.width,l.height=T.height),l}this.allocateTextureUnit=L,this.resetTextureUnits=O,this.setTexture2D=H,this.setTexture2DArray=G,this.setTexture3D=$,this.setTextureCube=V,this.rebindTextures=ft,this.setupRenderTarget=ke,this.updateRenderTargetMipmap=it,this.updateMultisampleRenderTarget=ze,this.setupDepthRenderbuffer=He,this.setupFrameBufferTexture=fe,this.useMultisampledRTT=xe}function fx(i,e){function t(n,r=Ht){let a;const s=tt.getTransfer(r);if(n===bt)return i.UNSIGNED_BYTE;if(n===Uo)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Io)return i.UNSIGNED_SHORT_5_5_5_1;if(n===ql)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Yl)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Wl)return i.BYTE;if(n===Xl)return i.SHORT;if(n===Fr)return i.UNSIGNED_SHORT;if(n===Do)return i.INT;if(n===Zn)return i.UNSIGNED_INT;if(n===sn)return i.FLOAT;if(n===Lt)return i.HALF_FLOAT;if(n===jl)return i.ALPHA;if(n===Kl)return i.RGB;if(n===Vt)return i.RGBA;if(n===sr)return i.DEPTH_COMPONENT;if(n===Or)return i.DEPTH_STENCIL;if(n===Gr)return i.RED;if(n===Lo)return i.RED_INTEGER;if(n===Fo)return i.RG;if(n===No)return i.RG_INTEGER;if(n===Oo)return i.RGBA_INTEGER;if(n===ya||n===Sa||n===Ea||n===wa)if(s===at)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(n===ya)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Sa)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ea)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===wa)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(n===ya)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Sa)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ea)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===wa)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===js||n===Ks||n===$s||n===Zs)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(n===js)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ks)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===$s)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Zs)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Js||n===Qs||n===eo)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(n===Js||n===Qs)return s===at?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(n===eo)return s===at?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===to||n===no||n===io||n===ro||n===ao||n===so||n===oo||n===co||n===lo||n===uo||n===fo||n===ho||n===po||n===mo)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(n===to)return s===at?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===no)return s===at?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===io)return s===at?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===ro)return s===at?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ao)return s===at?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===so)return s===at?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===oo)return s===at?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===co)return s===at?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===lo)return s===at?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===uo)return s===at?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===fo)return s===at?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ho)return s===at?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===po)return s===at?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===mo)return s===at?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===xo||n===go||n===vo)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(n===xo)return s===at?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===go)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===vo)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===_o||n===bo||n===Mo||n===yo)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(n===_o)return a.COMPRESSED_RED_RGTC1_EXT;if(n===bo)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Mo)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===yo)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Nr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const hx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,dx=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class px{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new uu(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new xn({vertexShader:hx,fragmentShader:dx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ye(new vi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class mx extends ur{constructor(e,t){super();const n=this;let r=null,a=1,s=null,o="local-floor",c=1,l=null,u=null,h=null,d=null,p=null,x=null;const g=typeof XRWebGLBinding<"u",m=new px,f={},M=t.getContextAttributes();let y=null,w=null;const A=[],b=[],R=new ye;let F=null;const S=new zt;S.viewport=new nt;const v=new zt;v.viewport=new nt;const P=[S,v],O=new Ih;let L=null,q=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let j=A[K];return j===void 0&&(j=new ms,A[K]=j),j.getTargetRaySpace()},this.getControllerGrip=function(K){let j=A[K];return j===void 0&&(j=new ms,A[K]=j),j.getGripSpace()},this.getHand=function(K){let j=A[K];return j===void 0&&(j=new ms,A[K]=j),j.getHandSpace()};function H(K){const j=b.indexOf(K.inputSource);if(j===-1)return;const fe=A[j];fe!==void 0&&(fe.update(K.inputSource,K.frame,l||s),fe.dispatchEvent({type:K.type,data:K.inputSource}))}function G(){r.removeEventListener("select",H),r.removeEventListener("selectstart",H),r.removeEventListener("selectend",H),r.removeEventListener("squeeze",H),r.removeEventListener("squeezestart",H),r.removeEventListener("squeezeend",H),r.removeEventListener("end",G),r.removeEventListener("inputsourceschange",$);for(let K=0;K<A.length;K++){const j=b[K];j!==null&&(b[K]=null,A[K].disconnect(j))}L=null,q=null,m.reset();for(const K in f)delete f[K];e.setRenderTarget(y),p=null,d=null,h=null,r=null,w=null,$e.stop(),n.isPresenting=!1,e.setPixelRatio(F),e.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){a=K,n.isPresenting===!0&&Ve("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){o=K,n.isPresenting===!0&&Ve("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||s},this.setReferenceSpace=function(K){l=K},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return h===null&&g&&(h=new XRWebGLBinding(r,t)),h},this.getFrame=function(){return x},this.getSession=function(){return r},this.setSession=async function(K){if(r=K,r!==null){if(y=e.getRenderTarget(),r.addEventListener("select",H),r.addEventListener("selectstart",H),r.addEventListener("selectend",H),r.addEventListener("squeeze",H),r.addEventListener("squeezestart",H),r.addEventListener("squeezeend",H),r.addEventListener("end",G),r.addEventListener("inputsourceschange",$),M.xrCompatible!==!0&&await t.makeXRCompatible(),F=e.getPixelRatio(),e.getSize(R),g&&"createProjectionLayer"in XRWebGLBinding.prototype){let fe=null,Pe=null,Se=null;M.depth&&(Se=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,fe=M.stencil?Or:sr,Pe=M.stencil?Nr:Zn);const He={colorFormat:t.RGBA8,depthFormat:Se,scaleFactor:a};h=this.getBinding(),d=h.createProjectionLayer(He),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),w=new On(d.textureWidth,d.textureHeight,{format:Vt,type:bt,depthTexture:new Go(d.textureWidth,d.textureHeight,Pe,void 0,void 0,void 0,void 0,void 0,void 0,fe),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const fe={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:a};p=new XRWebGLLayer(r,t,fe),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),w=new On(p.framebufferWidth,p.framebufferHeight,{format:Vt,type:bt,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}w.isXRRenderTarget=!0,this.setFoveation(c),l=null,s=await r.requestReferenceSpace(o),$e.setContext(r),$e.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function $(K){for(let j=0;j<K.removed.length;j++){const fe=K.removed[j],Pe=b.indexOf(fe);Pe>=0&&(b[Pe]=null,A[Pe].disconnect(fe))}for(let j=0;j<K.added.length;j++){const fe=K.added[j];let Pe=b.indexOf(fe);if(Pe===-1){for(let He=0;He<A.length;He++)if(He>=b.length){b.push(fe),Pe=He;break}else if(b[He]===null){b[He]=fe,Pe=He;break}if(Pe===-1)break}const Se=A[Pe];Se&&Se.connect(fe)}}const V=new C,ee=new C;function te(K,j,fe){V.setFromMatrixPosition(j.matrixWorld),ee.setFromMatrixPosition(fe.matrixWorld);const Pe=V.distanceTo(ee),Se=j.projectionMatrix.elements,He=fe.projectionMatrix.elements,ft=Se[14]/(Se[10]-1),ke=Se[14]/(Se[10]+1),it=(Se[9]+1)/Se[5],D=(Se[9]-1)/Se[5],Be=(Se[8]-1)/Se[0],ze=(He[8]+1)/He[0],Je=ft*Be,xe=ft*ze,Qe=Pe/(-Be+ze),be=Qe*-Be;if(j.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(be),K.translateZ(Qe),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),Se[10]===-1)K.projectionMatrix.copy(j.projectionMatrix),K.projectionMatrixInverse.copy(j.projectionMatrixInverse);else{const De=ft+Qe,T=ke+Qe,_=Je-be,z=xe+(Pe-be),Z=it*ke/T*De,Q=D*ke/T*De;K.projectionMatrix.makePerspective(_,z,Z,Q,De,T),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function me(K,j){j===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(j.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(r===null)return;let j=K.near,fe=K.far;m.texture!==null&&(m.depthNear>0&&(j=m.depthNear),m.depthFar>0&&(fe=m.depthFar)),O.near=v.near=S.near=j,O.far=v.far=S.far=fe,(L!==O.near||q!==O.far)&&(r.updateRenderState({depthNear:O.near,depthFar:O.far}),L=O.near,q=O.far),O.layers.mask=K.layers.mask|6,S.layers.mask=O.layers.mask&3,v.layers.mask=O.layers.mask&5;const Pe=K.parent,Se=O.cameras;me(O,Pe);for(let He=0;He<Se.length;He++)me(Se[He],Pe);Se.length===2?te(O,S,v):O.projectionMatrix.copy(S.projectionMatrix),ue(K,O,Pe)};function ue(K,j,fe){fe===null?K.matrix.copy(j.matrixWorld):(K.matrix.copy(fe.matrixWorld),K.matrix.invert(),K.matrix.multiply(j.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(j.projectionMatrix),K.projectionMatrixInverse.copy(j.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=or*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(!(d===null&&p===null))return c},this.setFoveation=function(K){c=K,d!==null&&(d.fixedFoveation=K),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=K)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(O)},this.getCameraTexture=function(K){return f[K]};let Le=null;function Ge(K,j){if(u=j.getViewerPose(l||s),x=j,u!==null){const fe=u.views;p!==null&&(e.setRenderTargetFramebuffer(w,p.framebuffer),e.setRenderTarget(w));let Pe=!1;fe.length!==O.cameras.length&&(O.cameras.length=0,Pe=!0);for(let ke=0;ke<fe.length;ke++){const it=fe[ke];let D=null;if(p!==null)D=p.getViewport(it);else{const ze=h.getViewSubImage(d,it);D=ze.viewport,ke===0&&(e.setRenderTargetTextures(w,ze.colorTexture,ze.depthStencilTexture),e.setRenderTarget(w))}let Be=P[ke];Be===void 0&&(Be=new zt,Be.layers.enable(ke),Be.viewport=new nt,P[ke]=Be),Be.matrix.fromArray(it.transform.matrix),Be.matrix.decompose(Be.position,Be.quaternion,Be.scale),Be.projectionMatrix.fromArray(it.projectionMatrix),Be.projectionMatrixInverse.copy(Be.projectionMatrix).invert(),Be.viewport.set(D.x,D.y,D.width,D.height),ke===0&&(O.matrix.copy(Be.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),Pe===!0&&O.cameras.push(Be)}const Se=r.enabledFeatures;if(Se&&Se.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&g){h=n.getBinding();const ke=h.getDepthInformation(fe[0]);ke&&ke.isValid&&ke.texture&&m.init(ke,r.renderState)}if(Se&&Se.includes("camera-access")&&g){e.state.unbindTexture(),h=n.getBinding();for(let ke=0;ke<fe.length;ke++){const it=fe[ke].camera;if(it){let D=f[it];D||(D=new uu,f[it]=D);const Be=h.getCameraImage(it);D.sourceTexture=Be}}}}for(let fe=0;fe<A.length;fe++){const Pe=b[fe],Se=A[fe];Pe!==null&&Se!==void 0&&Se.update(Pe,j,l||s)}Le&&Le(K,j),j.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:j}),x=null}const $e=new fu;$e.setAnimationLoop(Ge),this.setAnimationLoop=function(K){Le=K},this.dispose=function(){}}}const ai=new tn,xx=new je;function gx(i,e){function t(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,au(i)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function r(m,f,M,y,w){f.isMeshBasicMaterial||f.isMeshLambertMaterial?a(m,f):f.isMeshToonMaterial?(a(m,f),h(m,f)):f.isMeshPhongMaterial?(a(m,f),u(m,f)):f.isMeshStandardMaterial?(a(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,w)):f.isMeshMatcapMaterial?(a(m,f),x(m,f)):f.isMeshDepthMaterial?a(m,f):f.isMeshDistanceMaterial?(a(m,f),g(m,f)):f.isMeshNormalMaterial?a(m,f):f.isLineBasicMaterial?(s(m,f),f.isLineDashedMaterial&&o(m,f)):f.isPointsMaterial?c(m,f,M,y):f.isSpriteMaterial?l(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function a(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,t(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Gt&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,t(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Gt&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,t(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,t(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const M=e.get(f),y=M.envMap,w=M.envMapRotation;y&&(m.envMap.value=y,ai.copy(w),ai.x*=-1,ai.y*=-1,ai.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(ai.y*=-1,ai.z*=-1),m.envMapRotation.value.setFromMatrix4(xx.makeRotationFromEuler(ai)),m.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,m.aoMapTransform))}function s(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform))}function o(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function c(m,f,M,y){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*M,m.scale.value=y*.5,f.map&&(m.map.value=f.map,t(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function l(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function u(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function h(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,M){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Gt&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,m.specularIntensityMapTransform))}function x(m,f){f.matcap&&(m.matcap.value=f.matcap)}function g(m,f){const M=e.get(f).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function vx(i,e,t,n){let r={},a={},s=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(M,y){const w=y.program;n.uniformBlockBinding(M,w)}function l(M,y){let w=r[M.id];w===void 0&&(x(M),w=u(M),r[M.id]=w,M.addEventListener("dispose",m));const A=y.program;n.updateUBOMapping(M,A);const b=e.render.frame;a[M.id]!==b&&(d(M),a[M.id]=b)}function u(M){const y=h();M.__bindingPointIndex=y;const w=i.createBuffer(),A=M.__size,b=M.usage;return i.bindBuffer(i.UNIFORM_BUFFER,w),i.bufferData(i.UNIFORM_BUFFER,A,b),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,y,w),w}function h(){for(let M=0;M<o;M++)if(s.indexOf(M)===-1)return s.push(M),M;return pt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(M){const y=r[M.id],w=M.uniforms,A=M.__cache;i.bindBuffer(i.UNIFORM_BUFFER,y);for(let b=0,R=w.length;b<R;b++){const F=Array.isArray(w[b])?w[b]:[w[b]];for(let S=0,v=F.length;S<v;S++){const P=F[S];if(p(P,b,S,A)===!0){const O=P.__offset,L=Array.isArray(P.value)?P.value:[P.value];let q=0;for(let H=0;H<L.length;H++){const G=L[H],$=g(G);typeof G=="number"||typeof G=="boolean"?(P.__data[0]=G,i.bufferSubData(i.UNIFORM_BUFFER,O+q,P.__data)):G.isMatrix3?(P.__data[0]=G.elements[0],P.__data[1]=G.elements[1],P.__data[2]=G.elements[2],P.__data[3]=0,P.__data[4]=G.elements[3],P.__data[5]=G.elements[4],P.__data[6]=G.elements[5],P.__data[7]=0,P.__data[8]=G.elements[6],P.__data[9]=G.elements[7],P.__data[10]=G.elements[8],P.__data[11]=0):(G.toArray(P.__data,q),q+=$.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,O,P.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(M,y,w,A){const b=M.value,R=y+"_"+w;if(A[R]===void 0)return typeof b=="number"||typeof b=="boolean"?A[R]=b:A[R]=b.clone(),!0;{const F=A[R];if(typeof b=="number"||typeof b=="boolean"){if(F!==b)return A[R]=b,!0}else if(F.equals(b)===!1)return F.copy(b),!0}return!1}function x(M){const y=M.uniforms;let w=0;const A=16;for(let R=0,F=y.length;R<F;R++){const S=Array.isArray(y[R])?y[R]:[y[R]];for(let v=0,P=S.length;v<P;v++){const O=S[v],L=Array.isArray(O.value)?O.value:[O.value];for(let q=0,H=L.length;q<H;q++){const G=L[q],$=g(G),V=w%A,ee=V%$.boundary,te=V+ee;w+=ee,te!==0&&A-te<$.storage&&(w+=A-te),O.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),O.__offset=w,w+=$.storage}}}const b=w%A;return b>0&&(w+=A-b),M.__size=w,M.__cache={},this}function g(M){const y={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(y.boundary=4,y.storage=4):M.isVector2?(y.boundary=8,y.storage=8):M.isVector3||M.isColor?(y.boundary=16,y.storage=12):M.isVector4?(y.boundary=16,y.storage=16):M.isMatrix3?(y.boundary=48,y.storage=48):M.isMatrix4?(y.boundary=64,y.storage=64):M.isTexture?Ve("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Ve("WebGLRenderer: Unsupported uniform value type.",M),y}function m(M){const y=M.target;y.removeEventListener("dispose",m);const w=s.indexOf(y.__bindingPointIndex);s.splice(w,1),i.deleteBuffer(r[y.id]),delete r[y.id],delete a[y.id]}function f(){for(const M in r)i.deleteBuffer(r[M]);s=[],r={},a={}}return{bind:c,update:l,dispose:f}}const _x=new Uint16Array([11481,15204,11534,15171,11808,15015,12385,14843,12894,14716,13396,14600,13693,14483,13976,14366,14237,14171,14405,13961,14511,13770,14605,13598,14687,13444,14760,13305,14822,13066,14876,12857,14923,12675,14963,12517,14997,12379,15025,12230,15049,12023,15070,11843,15086,11687,15100,11551,15111,11433,15120,11330,15127,11217,15132,11060,15135,10922,15138,10801,15139,10695,15139,10600,13012,14923,13020,14917,13064,14886,13176,14800,13349,14666,13513,14526,13724,14398,13960,14230,14200,14020,14383,13827,14488,13651,14583,13491,14667,13348,14740,13132,14803,12908,14856,12713,14901,12542,14938,12394,14968,12241,14992,12017,15010,11822,15024,11654,15034,11507,15041,11380,15044,11269,15044,11081,15042,10913,15037,10764,15031,10635,15023,10520,15014,10419,15003,10330,13657,14676,13658,14673,13670,14660,13698,14622,13750,14547,13834,14442,13956,14317,14112,14093,14291,13889,14407,13704,14499,13538,14586,13389,14664,13201,14733,12966,14792,12758,14842,12577,14882,12418,14915,12272,14940,12033,14959,11826,14972,11646,14980,11490,14983,11355,14983,11212,14979,11008,14971,10830,14961,10675,14950,10540,14936,10420,14923,10315,14909,10204,14894,10041,14089,14460,14090,14459,14096,14452,14112,14431,14141,14388,14186,14305,14252,14130,14341,13941,14399,13756,14467,13585,14539,13430,14610,13272,14677,13026,14737,12808,14790,12617,14833,12449,14869,12303,14896,12065,14916,11845,14929,11655,14937,11490,14939,11347,14936,11184,14930,10970,14921,10783,14912,10621,14900,10480,14885,10356,14867,10247,14848,10062,14827,9894,14805,9745,14400,14208,14400,14206,14402,14198,14406,14174,14415,14122,14427,14035,14444,13913,14469,13767,14504,13613,14548,13463,14598,13324,14651,13082,14704,12858,14752,12658,14795,12483,14831,12330,14860,12106,14881,11875,14895,11675,14903,11501,14905,11351,14903,11178,14900,10953,14892,10757,14880,10589,14865,10442,14847,10313,14827,10162,14805,9965,14782,9792,14757,9642,14731,9507,14562,13883,14562,13883,14563,13877,14566,13862,14570,13830,14576,13773,14584,13689,14595,13582,14613,13461,14637,13336,14668,13120,14704,12897,14741,12695,14776,12516,14808,12358,14835,12150,14856,11910,14870,11701,14878,11519,14882,11361,14884,11187,14880,10951,14871,10748,14858,10572,14842,10418,14823,10286,14801,10099,14777,9897,14751,9722,14725,9567,14696,9430,14666,9309,14702,13604,14702,13604,14702,13600,14703,13591,14705,13570,14707,13533,14709,13477,14712,13400,14718,13305,14727,13106,14743,12907,14762,12716,14784,12539,14807,12380,14827,12190,14844,11943,14855,11727,14863,11539,14870,11376,14871,11204,14868,10960,14858,10748,14845,10565,14829,10406,14809,10269,14786,10058,14761,9852,14734,9671,14705,9512,14674,9374,14641,9253,14608,9076,14821,13366,14821,13365,14821,13364,14821,13358,14821,13344,14821,13320,14819,13252,14817,13145,14815,13011,14814,12858,14817,12698,14823,12539,14832,12389,14841,12214,14850,11968,14856,11750,14861,11558,14866,11390,14867,11226,14862,10972,14853,10754,14840,10565,14823,10401,14803,10259,14780,10032,14754,9820,14725,9635,14694,9473,14661,9333,14627,9203,14593,8988,14557,8798,14923,13014,14922,13014,14922,13012,14922,13004,14920,12987,14919,12957,14915,12907,14909,12834,14902,12738,14894,12623,14888,12498,14883,12370,14880,12203,14878,11970,14875,11759,14873,11569,14874,11401,14872,11243,14865,10986,14855,10762,14842,10568,14825,10401,14804,10255,14781,10017,14754,9799,14725,9611,14692,9445,14658,9301,14623,9139,14587,8920,14548,8729,14509,8562,15008,12672,15008,12672,15008,12671,15007,12667,15005,12656,15001,12637,14997,12605,14989,12556,14978,12490,14966,12407,14953,12313,14940,12136,14927,11934,14914,11742,14903,11563,14896,11401,14889,11247,14879,10992,14866,10767,14851,10570,14833,10400,14812,10252,14789,10007,14761,9784,14731,9592,14698,9424,14663,9279,14627,9088,14588,8868,14548,8676,14508,8508,14467,8360,15080,12386,15080,12386,15079,12385,15078,12383,15076,12378,15072,12367,15066,12347,15057,12315,15045,12253,15030,12138,15012,11998,14993,11845,14972,11685,14951,11530,14935,11383,14920,11228,14904,10981,14887,10762,14870,10567,14850,10397,14827,10248,14803,9997,14774,9771,14743,9578,14710,9407,14674,9259,14637,9048,14596,8826,14555,8632,14514,8464,14471,8317,14427,8182,15139,12008,15139,12008,15138,12008,15137,12007,15135,12003,15130,11990,15124,11969,15115,11929,15102,11872,15086,11794,15064,11693,15041,11581,15013,11459,14987,11336,14966,11170,14944,10944,14921,10738,14898,10552,14875,10387,14850,10239,14824,9983,14794,9758,14762,9563,14728,9392,14692,9244,14653,9014,14611,8791,14569,8597,14526,8427,14481,8281,14436,8110,14391,7885,15188,11617,15188,11617,15187,11617,15186,11618,15183,11617,15179,11612,15173,11601,15163,11581,15150,11546,15133,11495,15110,11427,15083,11346,15051,11246,15024,11057,14996,10868,14967,10687,14938,10517,14911,10362,14882,10206,14853,9956,14821,9737,14787,9543,14752,9375,14715,9228,14675,8980,14632,8760,14589,8565,14544,8395,14498,8248,14451,8049,14404,7824,14357,7630,15228,11298,15228,11298,15227,11299,15226,11301,15223,11303,15219,11302,15213,11299,15204,11290,15191,11271,15174,11217,15150,11129,15119,11015,15087,10886,15057,10744,15024,10599,14990,10455,14957,10318,14924,10143,14891,9911,14856,9701,14820,9516,14782,9352,14744,9200,14703,8946,14659,8725,14615,8533,14568,8366,14521,8220,14472,7992,14423,7770,14374,7578,14315,7408,15260,10819,15260,10819,15259,10822,15258,10826,15256,10832,15251,10836,15246,10841,15237,10838,15225,10821,15207,10788,15183,10734,15151,10660,15120,10571,15087,10469,15049,10359,15012,10249,14974,10041,14937,9837,14900,9647,14860,9475,14820,9320,14779,9147,14736,8902,14691,8688,14646,8499,14598,8335,14549,8189,14499,7940,14448,7720,14397,7529,14347,7363,14256,7218,15285,10410,15285,10411,15285,10413,15284,10418,15282,10425,15278,10434,15272,10442,15264,10449,15252,10445,15235,10433,15210,10403,15179,10358,15149,10301,15113,10218,15073,10059,15033,9894,14991,9726,14951,9565,14909,9413,14865,9273,14822,9073,14777,8845,14730,8641,14682,8459,14633,8300,14583,8129,14531,7883,14479,7670,14426,7482,14373,7321,14305,7176,14201,6939,15305,9939,15305,9940,15305,9945,15304,9955,15302,9967,15298,9989,15293,10010,15286,10033,15274,10044,15258,10045,15233,10022,15205,9975,15174,9903,15136,9808,15095,9697,15053,9578,15009,9451,14965,9327,14918,9198,14871,8973,14825,8766,14775,8579,14725,8408,14675,8259,14622,8058,14569,7821,14515,7615,14460,7435,14405,7276,14350,7108,14256,6866,14149,6653,15321,9444,15321,9445,15321,9448,15320,9458,15317,9470,15314,9490,15310,9515,15302,9540,15292,9562,15276,9579,15251,9577,15226,9559,15195,9519,15156,9463,15116,9389,15071,9304,15025,9208,14978,9023,14927,8838,14878,8661,14827,8496,14774,8344,14722,8206,14667,7973,14612,7749,14556,7555,14499,7382,14443,7229,14385,7025,14322,6791,14210,6588,14100,6409,15333,8920,15333,8921,15332,8927,15332,8943,15329,8965,15326,9002,15322,9048,15316,9106,15307,9162,15291,9204,15267,9221,15244,9221,15212,9196,15175,9134,15133,9043,15088,8930,15040,8801,14990,8665,14938,8526,14886,8391,14830,8261,14775,8087,14719,7866,14661,7664,14603,7482,14544,7322,14485,7178,14426,6936,14367,6713,14281,6517,14166,6348,14054,6198,15341,8360,15341,8361,15341,8366,15341,8379,15339,8399,15336,8431,15332,8473,15326,8527,15318,8585,15302,8632,15281,8670,15258,8690,15227,8690,15191,8664,15149,8612,15104,8543,15055,8456,15001,8360,14948,8259,14892,8122,14834,7923,14776,7734,14716,7558,14656,7397,14595,7250,14534,7070,14472,6835,14410,6628,14350,6443,14243,6283,14125,6135,14010,5889,15348,7715,15348,7717,15348,7725,15347,7745,15345,7780,15343,7836,15339,7905,15334,8e3,15326,8103,15310,8193,15293,8239,15270,8270,15240,8287,15204,8283,15163,8260,15118,8223,15067,8143,15014,8014,14958,7873,14899,7723,14839,7573,14778,7430,14715,7293,14652,7164,14588,6931,14524,6720,14460,6531,14396,6362,14330,6210,14207,6015,14086,5781,13969,5576,15352,7114,15352,7116,15352,7128,15352,7159,15350,7195,15348,7237,15345,7299,15340,7374,15332,7457,15317,7544,15301,7633,15280,7703,15251,7754,15216,7775,15176,7767,15131,7733,15079,7670,15026,7588,14967,7492,14906,7387,14844,7278,14779,7171,14714,6965,14648,6770,14581,6587,14515,6420,14448,6269,14382,6123,14299,5881,14172,5665,14049,5477,13929,5310,15355,6329,15355,6330,15355,6339,15355,6362,15353,6410,15351,6472,15349,6572,15344,6688,15337,6835,15323,6985,15309,7142,15287,7220,15260,7277,15226,7310,15188,7326,15142,7318,15090,7285,15036,7239,14976,7177,14914,7045,14849,6892,14782,6736,14714,6581,14645,6433,14576,6293,14506,6164,14438,5946,14369,5733,14270,5540,14140,5369,14014,5216,13892,5043,15357,5483,15357,5484,15357,5496,15357,5528,15356,5597,15354,5692,15351,5835,15347,6011,15339,6195,15328,6317,15314,6446,15293,6566,15268,6668,15235,6746,15197,6796,15152,6811,15101,6790,15046,6748,14985,6673,14921,6583,14854,6479,14785,6371,14714,6259,14643,6149,14571,5946,14499,5750,14428,5567,14358,5401,14242,5250,14109,5111,13980,4870,13856,4657,15359,4555,15359,4557,15358,4573,15358,4633,15357,4715,15355,4841,15353,5061,15349,5216,15342,5391,15331,5577,15318,5770,15299,5967,15274,6150,15243,6223,15206,6280,15161,6310,15111,6317,15055,6300,14994,6262,14928,6208,14860,6141,14788,5994,14715,5838,14641,5684,14566,5529,14492,5384,14418,5247,14346,5121,14216,4892,14079,4682,13948,4496,13822,4330,15359,3498,15359,3501,15359,3520,15359,3598,15358,3719,15356,3860,15355,4137,15351,4305,15344,4563,15334,4809,15321,5116,15303,5273,15280,5418,15250,5547,15214,5653,15170,5722,15120,5761,15064,5763,15002,5733,14935,5673,14865,5597,14792,5504,14716,5400,14640,5294,14563,5185,14486,5041,14410,4841,14335,4655,14191,4482,14051,4325,13918,4183,13790,4012,15360,2282,15360,2285,15360,2306,15360,2401,15359,2547,15357,2748,15355,3103,15352,3349,15345,3675,15336,4020,15324,4272,15307,4496,15285,4716,15255,4908,15220,5086,15178,5170,15128,5214,15072,5234,15010,5231,14943,5206,14871,5166,14796,5102,14718,4971,14639,4833,14559,4687,14480,4541,14402,4401,14315,4268,14167,4142,14025,3958,13888,3747,13759,3556,15360,923,15360,925,15360,946,15360,1052,15359,1214,15357,1494,15356,1892,15352,2274,15346,2663,15338,3099,15326,3393,15309,3679,15288,3980,15260,4183,15226,4325,15185,4437,15136,4517,15080,4570,15018,4591,14950,4581,14877,4545,14800,4485,14720,4411,14638,4325,14556,4231,14475,4136,14395,3988,14297,3803,14145,3628,13999,3465,13861,3314,13729,3177,15360,263,15360,264,15360,272,15360,325,15359,407,15358,548,15356,780,15352,1144,15347,1580,15339,2099,15328,2425,15312,2795,15292,3133,15264,3329,15232,3517,15191,3689,15143,3819,15088,3923,15025,3978,14956,3999,14882,3979,14804,3931,14722,3855,14639,3756,14554,3645,14470,3529,14388,3409,14279,3289,14124,3173,13975,3055,13834,2848,13701,2658,15360,49,15360,49,15360,52,15360,75,15359,111,15358,201,15356,283,15353,519,15348,726,15340,1045,15329,1415,15314,1795,15295,2173,15269,2410,15237,2649,15197,2866,15150,3054,15095,3140,15032,3196,14963,3228,14888,3236,14808,3224,14725,3191,14639,3146,14553,3088,14466,2976,14382,2836,14262,2692,14103,2549,13952,2409,13808,2278,13674,2154,15360,4,15360,4,15360,4,15360,13,15359,33,15358,59,15357,112,15353,199,15348,302,15341,456,15331,628,15316,827,15297,1082,15272,1332,15241,1601,15202,1851,15156,2069,15101,2172,15039,2256,14970,2314,14894,2348,14813,2358,14728,2344,14640,2311,14551,2263,14463,2203,14376,2133,14247,2059,14084,1915,13930,1761,13784,1609,13648,1464,15360,0,15360,0,15360,0,15360,3,15359,18,15358,26,15357,53,15354,80,15348,97,15341,165,15332,238,15318,326,15299,427,15275,529,15245,654,15207,771,15161,885,15108,994,15046,1089,14976,1170,14900,1229,14817,1266,14731,1284,14641,1282,14550,1260,14460,1223,14370,1174,14232,1116,14066,1050,13909,981,13761,910,13623,839]);let Pn=null;function bx(){return Pn===null&&(Pn=new Xr(_x,32,32,Fo,Lt),Pn.minFilter=xt,Pn.magFilter=xt,Pn.wrapS=It,Pn.wrapT=It,Pn.generateMipmaps=!1,Pn.needsUpdate=!0),Pn}class Mx{constructor(e={}){const{canvas:t=Pf(),context:n=null,depth:r=!0,stencil:a=!1,alpha:s=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=s;const x=new Set([Oo,No,Lo]),g=new Set([bt,Zn,Fr,Nr,Uo,Io]),m=new Uint32Array(4),f=new Int32Array(4);let M=null,y=null;const w=[],A=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Fn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const b=this;let R=!1;this._outputColorSpace=Ut;let F=0,S=0,v=null,P=-1,O=null;const L=new nt,q=new nt;let H=null;const G=new Ee(0);let $=0,V=t.width,ee=t.height,te=1,me=null,ue=null;const Le=new nt(0,0,V,ee),Ge=new nt(0,0,V,ee);let $e=!1;const K=new Vo;let j=!1,fe=!1;const Pe=new je,Se=new C,He=new nt,ft={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ke=!1;function it(){return v===null?te:1}let D=n;function Be(E,k){return t.getContext(E,k)}try{const E={alpha:!0,depth:r,stencil:a,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Co}`),t.addEventListener("webglcontextlost",I,!1),t.addEventListener("webglcontextrestored",N,!1),t.addEventListener("webglcontextcreationerror",J,!1),D===null){const k="webgl2";if(D=Be(k,E),D===null)throw Be(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw E("WebGLRenderer: "+E.message),E}let ze,Je,xe,Qe,be,De,T,_,z,Z,Q,Y,Me,ce,we,ve,ne,ie,Ce,Te,de,Ue,U,se;function re(){ze=new C0(D),ze.init(),Ue=new fx(D,ze),Je=new b0(D,ze,e,Ue),xe=new lx(D,ze),Je.reversedDepthBuffer&&d&&xe.buffers.depth.setReversed(!0),Qe=new U0(D),be=new $m,De=new ux(D,ze,xe,be,Je,Ue,Qe),T=new y0(b),_=new R0(b),z=new Nh(D),U=new v0(D,z),Z=new P0(D,z,Qe,U),Q=new L0(D,Z,z,Qe),Ce=new I0(D,Je,De),ve=new M0(be),Y=new Km(b,T,_,ze,Je,U,ve),Me=new gx(b,be),ce=new Jm,we=new rx(ze),ie=new g0(b,T,_,xe,Q,p,c),ne=new ox(b,Q,Je),se=new vx(D,Qe,Je,xe),Te=new _0(D,ze,Qe),de=new D0(D,ze,Qe),Qe.programs=Y.programs,b.capabilities=Je,b.extensions=ze,b.properties=be,b.renderLists=ce,b.shadowMap=ne,b.state=xe,b.info=Qe}re();const ae=new mx(b,D);this.xr=ae,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){const E=ze.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=ze.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return te},this.setPixelRatio=function(E){E!==void 0&&(te=E,this.setSize(V,ee,!1))},this.getSize=function(E){return E.set(V,ee)},this.setSize=function(E,k,W=!0){if(ae.isPresenting){Ve("WebGLRenderer: Can't change size while VR device is presenting.");return}V=E,ee=k,t.width=Math.floor(E*te),t.height=Math.floor(k*te),W===!0&&(t.style.width=E+"px",t.style.height=k+"px"),this.setViewport(0,0,E,k)},this.getDrawingBufferSize=function(E){return E.set(V*te,ee*te).floor()},this.setDrawingBufferSize=function(E,k,W){V=E,ee=k,te=W,t.width=Math.floor(E*W),t.height=Math.floor(k*W),this.setViewport(0,0,E,k)},this.getCurrentViewport=function(E){return E.copy(L)},this.getViewport=function(E){return E.copy(Le)},this.setViewport=function(E,k,W,X){E.isVector4?Le.set(E.x,E.y,E.z,E.w):Le.set(E,k,W,X),xe.viewport(L.copy(Le).multiplyScalar(te).round())},this.getScissor=function(E){return E.copy(Ge)},this.setScissor=function(E,k,W,X){E.isVector4?Ge.set(E.x,E.y,E.z,E.w):Ge.set(E,k,W,X),xe.scissor(q.copy(Ge).multiplyScalar(te).round())},this.getScissorTest=function(){return $e},this.setScissorTest=function(E){xe.setScissorTest($e=E)},this.setOpaqueSort=function(E){me=E},this.setTransparentSort=function(E){ue=E},this.getClearColor=function(E){return E.copy(ie.getClearColor())},this.setClearColor=function(){ie.setClearColor(...arguments)},this.getClearAlpha=function(){return ie.getClearAlpha()},this.setClearAlpha=function(){ie.setClearAlpha(...arguments)},this.clear=function(E=!0,k=!0,W=!0){let X=0;if(E){let B=!1;if(v!==null){const oe=v.texture.format;B=x.has(oe)}if(B){const oe=v.texture.type,pe=g.has(oe),_e=ie.getClearColor(),ge=ie.getClearAlpha(),Ne=_e.r,Oe=_e.g,Re=_e.b;pe?(m[0]=Ne,m[1]=Oe,m[2]=Re,m[3]=ge,D.clearBufferuiv(D.COLOR,0,m)):(f[0]=Ne,f[1]=Oe,f[2]=Re,f[3]=ge,D.clearBufferiv(D.COLOR,0,f))}else X|=D.COLOR_BUFFER_BIT}k&&(X|=D.DEPTH_BUFFER_BIT),W&&(X|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",I,!1),t.removeEventListener("webglcontextrestored",N,!1),t.removeEventListener("webglcontextcreationerror",J,!1),ie.dispose(),ce.dispose(),we.dispose(),be.dispose(),T.dispose(),_.dispose(),Q.dispose(),U.dispose(),se.dispose(),Y.dispose(),ae.dispose(),ae.removeEventListener("sessionstart",Jo),ae.removeEventListener("sessionend",Qo),Jn.stop()};function I(E){E.preventDefault(),fc("WebGLRenderer: Context Lost."),R=!0}function N(){fc("WebGLRenderer: Context Restored."),R=!1;const E=Qe.autoReset,k=ne.enabled,W=ne.autoUpdate,X=ne.needsUpdate,B=ne.type;re(),Qe.autoReset=E,ne.enabled=k,ne.autoUpdate=W,ne.needsUpdate=X,ne.type=B}function J(E){pt("WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function le(E){const k=E.target;k.removeEventListener("dispose",le),Fe(k)}function Fe(E){Ae(E),be.remove(E)}function Ae(E){const k=be.get(E).programs;k!==void 0&&(k.forEach(function(W){Y.releaseProgram(W)}),E.isShaderMaterial&&Y.releaseShaderCache(E))}this.renderBufferDirect=function(E,k,W,X,B,oe){k===null&&(k=ft);const pe=B.isMesh&&B.matrixWorld.determinant()<0,_e=Nu(E,k,W,X,B);xe.setMaterial(X,pe);let ge=W.index,Ne=1;if(X.wireframe===!0){if(ge=Z.getWireframeAttribute(W),ge===void 0)return;Ne=2}const Oe=W.drawRange,Re=W.attributes.position;let Ke=Oe.start*Ne,rt=(Oe.start+Oe.count)*Ne;oe!==null&&(Ke=Math.max(Ke,oe.start*Ne),rt=Math.min(rt,(oe.start+oe.count)*Ne)),ge!==null?(Ke=Math.max(Ke,0),rt=Math.min(rt,ge.count)):Re!=null&&(Ke=Math.max(Ke,0),rt=Math.min(rt,Re.count));const ht=rt-Ke;if(ht<0||ht===1/0)return;U.setup(B,X,_e,W,ge);let dt,st=Te;if(ge!==null&&(dt=z.get(ge),st=de,st.setIndex(dt)),B.isMesh)X.wireframe===!0?(xe.setLineWidth(X.wireframeLinewidth*it()),st.setMode(D.LINES)):st.setMode(D.TRIANGLES);else if(B.isLine){let Ie=X.linewidth;Ie===void 0&&(Ie=1),xe.setLineWidth(Ie*it()),B.isLineSegments?st.setMode(D.LINES):B.isLineLoop?st.setMode(D.LINE_LOOP):st.setMode(D.LINE_STRIP)}else B.isPoints?st.setMode(D.POINTS):B.isSprite&&st.setMode(D.TRIANGLES);if(B.isBatchedMesh)if(B._multiDrawInstances!==null)kr("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),st.renderMultiDrawInstances(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount,B._multiDrawInstances);else if(ze.get("WEBGL_multi_draw"))st.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else{const Ie=B._multiDrawStarts,ct=B._multiDrawCounts,et=B._multiDrawCount,Zt=ge?z.get(ge).bytesPerElement:1,bi=be.get(X).currentProgram.getUniforms();for(let Jt=0;Jt<et;Jt++)bi.setValue(D,"_gl_DrawID",Jt),st.render(Ie[Jt]/Zt,ct[Jt])}else if(B.isInstancedMesh)st.renderInstances(Ke,ht,B.count);else if(W.isInstancedBufferGeometry){const Ie=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,ct=Math.min(W.instanceCount,Ie);st.renderInstances(Ke,ht,ct)}else st.render(Ke,ht)};function Rt(E,k,W){E.transparent===!0&&E.side===un&&E.forceSinglePass===!1?(E.side=Gt,E.needsUpdate=!0,Yr(E,k,W),E.side=En,E.needsUpdate=!0,Yr(E,k,W),E.side=un):Yr(E,k,W)}this.compile=function(E,k,W=null){W===null&&(W=E),y=we.get(W),y.init(k),A.push(y),W.traverseVisible(function(B){B.isLight&&B.layers.test(k.layers)&&(y.pushLight(B),B.castShadow&&y.pushShadow(B))}),E!==W&&E.traverseVisible(function(B){B.isLight&&B.layers.test(k.layers)&&(y.pushLight(B),B.castShadow&&y.pushShadow(B))}),y.setupLights();const X=new Set;return E.traverse(function(B){if(!(B.isMesh||B.isPoints||B.isLine||B.isSprite))return;const oe=B.material;if(oe)if(Array.isArray(oe))for(let pe=0;pe<oe.length;pe++){const _e=oe[pe];Rt(_e,W,B),X.add(_e)}else Rt(oe,W,B),X.add(oe)}),y=A.pop(),X},this.compileAsync=function(E,k,W=null){const X=this.compile(E,k,W);return new Promise(B=>{function oe(){if(X.forEach(function(pe){be.get(pe).currentProgram.isReady()&&X.delete(pe)}),X.size===0){B(E);return}setTimeout(oe,10)}ze.get("KHR_parallel_shader_compile")!==null?oe():setTimeout(oe,10)})};let qt=null;function Fu(E){qt&&qt(E)}function Jo(){Jn.stop()}function Qo(){Jn.start()}const Jn=new fu;Jn.setAnimationLoop(Fu),typeof self<"u"&&Jn.setContext(self),this.setAnimationLoop=function(E){qt=E,ae.setAnimationLoop(E),E===null?Jn.stop():Jn.start()},ae.addEventListener("sessionstart",Jo),ae.addEventListener("sessionend",Qo),this.render=function(E,k){if(k!==void 0&&k.isCamera!==!0){pt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),ae.enabled===!0&&ae.isPresenting===!0&&(ae.cameraAutoUpdate===!0&&ae.updateCamera(k),k=ae.getCamera()),E.isScene===!0&&E.onBeforeRender(b,E,k,v),y=we.get(E,A.length),y.init(k),A.push(y),Pe.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),K.setFromProjectionMatrix(Pe,Mn,k.reversedDepth),fe=this.localClippingEnabled,j=ve.init(this.clippingPlanes,fe),M=ce.get(E,w.length),M.init(),w.push(M),ae.enabled===!0&&ae.isPresenting===!0){const oe=b.xr.getDepthSensingMesh();oe!==null&&qa(oe,k,-1/0,b.sortObjects)}qa(E,k,0,b.sortObjects),M.finish(),b.sortObjects===!0&&M.sort(me,ue),ke=ae.enabled===!1||ae.isPresenting===!1||ae.hasDepthSensing()===!1,ke&&ie.addToRenderList(M,E),this.info.render.frame++,j===!0&&ve.beginShadows();const W=y.state.shadowsArray;ne.render(W,E,k),j===!0&&ve.endShadows(),this.info.autoReset===!0&&this.info.reset();const X=M.opaque,B=M.transmissive;if(y.setupLights(),k.isArrayCamera){const oe=k.cameras;if(B.length>0)for(let pe=0,_e=oe.length;pe<_e;pe++){const ge=oe[pe];tc(X,B,E,ge)}ke&&ie.render(E);for(let pe=0,_e=oe.length;pe<_e;pe++){const ge=oe[pe];ec(M,E,ge,ge.viewport)}}else B.length>0&&tc(X,B,E,k),ke&&ie.render(E),ec(M,E,k);v!==null&&S===0&&(De.updateMultisampleRenderTarget(v),De.updateRenderTargetMipmap(v)),E.isScene===!0&&E.onAfterRender(b,E,k),U.resetDefaultState(),P=-1,O=null,A.pop(),A.length>0?(y=A[A.length-1],j===!0&&ve.setGlobalState(b.clippingPlanes,y.state.camera)):y=null,w.pop(),w.length>0?M=w[w.length-1]:M=null};function qa(E,k,W,X){if(E.visible===!1)return;if(E.layers.test(k.layers)){if(E.isGroup)W=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(k);else if(E.isLight)y.pushLight(E),E.castShadow&&y.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||K.intersectsSprite(E)){X&&He.setFromMatrixPosition(E.matrixWorld).applyMatrix4(Pe);const pe=Q.update(E),_e=E.material;_e.visible&&M.push(E,pe,_e,W,He.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||K.intersectsObject(E))){const pe=Q.update(E),_e=E.material;if(X&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),He.copy(E.boundingSphere.center)):(pe.boundingSphere===null&&pe.computeBoundingSphere(),He.copy(pe.boundingSphere.center)),He.applyMatrix4(E.matrixWorld).applyMatrix4(Pe)),Array.isArray(_e)){const ge=pe.groups;for(let Ne=0,Oe=ge.length;Ne<Oe;Ne++){const Re=ge[Ne],Ke=_e[Re.materialIndex];Ke&&Ke.visible&&M.push(E,pe,Ke,W,He.z,Re)}}else _e.visible&&M.push(E,pe,_e,W,He.z,null)}}const oe=E.children;for(let pe=0,_e=oe.length;pe<_e;pe++)qa(oe[pe],k,W,X)}function ec(E,k,W,X){const{opaque:B,transmissive:oe,transparent:pe}=E;y.setupLightsView(W),j===!0&&ve.setGlobalState(b.clippingPlanes,W),X&&xe.viewport(L.copy(X)),B.length>0&&qr(B,k,W),oe.length>0&&qr(oe,k,W),pe.length>0&&qr(pe,k,W),xe.buffers.depth.setTest(!0),xe.buffers.depth.setMask(!0),xe.buffers.color.setMask(!0),xe.setPolygonOffset(!1)}function tc(E,k,W,X){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;y.state.transmissionRenderTarget[X.id]===void 0&&(y.state.transmissionRenderTarget[X.id]=new On(1,1,{generateMipmaps:!0,type:ze.has("EXT_color_buffer_half_float")||ze.has("EXT_color_buffer_float")?Lt:bt,minFilter:dn,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:tt.workingColorSpace}));const oe=y.state.transmissionRenderTarget[X.id],pe=X.viewport||L;oe.setSize(pe.z*b.transmissionResolutionScale,pe.w*b.transmissionResolutionScale);const _e=b.getRenderTarget(),ge=b.getActiveCubeFace(),Ne=b.getActiveMipmapLevel();b.setRenderTarget(oe),b.getClearColor(G),$=b.getClearAlpha(),$<1&&b.setClearColor(16777215,.5),b.clear(),ke&&ie.render(W);const Oe=b.toneMapping;b.toneMapping=Fn;const Re=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),y.setupLightsView(X),j===!0&&ve.setGlobalState(b.clippingPlanes,X),qr(E,W,X),De.updateMultisampleRenderTarget(oe),De.updateRenderTargetMipmap(oe),ze.has("WEBGL_multisampled_render_to_texture")===!1){let Ke=!1;for(let rt=0,ht=k.length;rt<ht;rt++){const dt=k[rt],{object:st,geometry:Ie,material:ct,group:et}=dt;if(ct.side===un&&st.layers.test(X.layers)){const Zt=ct.side;ct.side=Gt,ct.needsUpdate=!0,nc(st,W,X,Ie,ct,et),ct.side=Zt,ct.needsUpdate=!0,Ke=!0}}Ke===!0&&(De.updateMultisampleRenderTarget(oe),De.updateRenderTargetMipmap(oe))}b.setRenderTarget(_e,ge,Ne),b.setClearColor(G,$),Re!==void 0&&(X.viewport=Re),b.toneMapping=Oe}function qr(E,k,W){const X=k.isScene===!0?k.overrideMaterial:null;for(let B=0,oe=E.length;B<oe;B++){const pe=E[B],{object:_e,geometry:ge,group:Ne}=pe;let Oe=pe.material;Oe.allowOverride===!0&&X!==null&&(Oe=X),_e.layers.test(W.layers)&&nc(_e,k,W,ge,Oe,Ne)}}function nc(E,k,W,X,B,oe){E.onBeforeRender(b,k,W,X,B,oe),E.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),B.onBeforeRender(b,k,W,X,E,oe),B.transparent===!0&&B.side===un&&B.forceSinglePass===!1?(B.side=Gt,B.needsUpdate=!0,b.renderBufferDirect(W,k,X,B,E,oe),B.side=En,B.needsUpdate=!0,b.renderBufferDirect(W,k,X,B,E,oe),B.side=un):b.renderBufferDirect(W,k,X,B,E,oe),E.onAfterRender(b,k,W,X,B,oe)}function Yr(E,k,W){k.isScene!==!0&&(k=ft);const X=be.get(E),B=y.state.lights,oe=y.state.shadowsArray,pe=B.state.version,_e=Y.getParameters(E,B.state,oe,k,W),ge=Y.getProgramCacheKey(_e);let Ne=X.programs;X.environment=E.isMeshStandardMaterial?k.environment:null,X.fog=k.fog,X.envMap=(E.isMeshStandardMaterial?_:T).get(E.envMap||X.environment),X.envMapRotation=X.environment!==null&&E.envMap===null?k.environmentRotation:E.envMapRotation,Ne===void 0&&(E.addEventListener("dispose",le),Ne=new Map,X.programs=Ne);let Oe=Ne.get(ge);if(Oe!==void 0){if(X.currentProgram===Oe&&X.lightsStateVersion===pe)return rc(E,_e),Oe}else _e.uniforms=Y.getUniforms(E),E.onBeforeCompile(_e,b),Oe=Y.acquireProgram(_e,ge),Ne.set(ge,Oe),X.uniforms=_e.uniforms;const Re=X.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Re.clippingPlanes=ve.uniform),rc(E,_e),X.needsLights=ku(E),X.lightsStateVersion=pe,X.needsLights&&(Re.ambientLightColor.value=B.state.ambient,Re.lightProbe.value=B.state.probe,Re.directionalLights.value=B.state.directional,Re.directionalLightShadows.value=B.state.directionalShadow,Re.spotLights.value=B.state.spot,Re.spotLightShadows.value=B.state.spotShadow,Re.rectAreaLights.value=B.state.rectArea,Re.ltc_1.value=B.state.rectAreaLTC1,Re.ltc_2.value=B.state.rectAreaLTC2,Re.pointLights.value=B.state.point,Re.pointLightShadows.value=B.state.pointShadow,Re.hemisphereLights.value=B.state.hemi,Re.directionalShadowMap.value=B.state.directionalShadowMap,Re.directionalShadowMatrix.value=B.state.directionalShadowMatrix,Re.spotShadowMap.value=B.state.spotShadowMap,Re.spotLightMatrix.value=B.state.spotLightMatrix,Re.spotLightMap.value=B.state.spotLightMap,Re.pointShadowMap.value=B.state.pointShadowMap,Re.pointShadowMatrix.value=B.state.pointShadowMatrix),X.currentProgram=Oe,X.uniformsList=null,Oe}function ic(E){if(E.uniformsList===null){const k=E.currentProgram.getUniforms();E.uniformsList=Ta.seqWithValue(k.seq,E.uniforms)}return E.uniformsList}function rc(E,k){const W=be.get(E);W.outputColorSpace=k.outputColorSpace,W.batching=k.batching,W.batchingColor=k.batchingColor,W.instancing=k.instancing,W.instancingColor=k.instancingColor,W.instancingMorph=k.instancingMorph,W.skinning=k.skinning,W.morphTargets=k.morphTargets,W.morphNormals=k.morphNormals,W.morphColors=k.morphColors,W.morphTargetsCount=k.morphTargetsCount,W.numClippingPlanes=k.numClippingPlanes,W.numIntersection=k.numClipIntersection,W.vertexAlphas=k.vertexAlphas,W.vertexTangents=k.vertexTangents,W.toneMapping=k.toneMapping}function Nu(E,k,W,X,B){k.isScene!==!0&&(k=ft),De.resetTextureUnits();const oe=k.fog,pe=X.isMeshStandardMaterial?k.environment:null,_e=v===null?b.outputColorSpace:v.isXRRenderTarget===!0?v.texture.colorSpace:gi,ge=(X.isMeshStandardMaterial?_:T).get(X.envMap||pe),Ne=X.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,Oe=!!W.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Re=!!W.morphAttributes.position,Ke=!!W.morphAttributes.normal,rt=!!W.morphAttributes.color;let ht=Fn;X.toneMapped&&(v===null||v.isXRRenderTarget===!0)&&(ht=b.toneMapping);const dt=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,st=dt!==void 0?dt.length:0,Ie=be.get(X),ct=y.state.lights;if(j===!0&&(fe===!0||E!==O)){const Ot=E===O&&X.id===P;ve.setState(X,E,Ot)}let et=!1;X.version===Ie.__version?(Ie.needsLights&&Ie.lightsStateVersion!==ct.state.version||Ie.outputColorSpace!==_e||B.isBatchedMesh&&Ie.batching===!1||!B.isBatchedMesh&&Ie.batching===!0||B.isBatchedMesh&&Ie.batchingColor===!0&&B.colorTexture===null||B.isBatchedMesh&&Ie.batchingColor===!1&&B.colorTexture!==null||B.isInstancedMesh&&Ie.instancing===!1||!B.isInstancedMesh&&Ie.instancing===!0||B.isSkinnedMesh&&Ie.skinning===!1||!B.isSkinnedMesh&&Ie.skinning===!0||B.isInstancedMesh&&Ie.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&Ie.instancingColor===!1&&B.instanceColor!==null||B.isInstancedMesh&&Ie.instancingMorph===!0&&B.morphTexture===null||B.isInstancedMesh&&Ie.instancingMorph===!1&&B.morphTexture!==null||Ie.envMap!==ge||X.fog===!0&&Ie.fog!==oe||Ie.numClippingPlanes!==void 0&&(Ie.numClippingPlanes!==ve.numPlanes||Ie.numIntersection!==ve.numIntersection)||Ie.vertexAlphas!==Ne||Ie.vertexTangents!==Oe||Ie.morphTargets!==Re||Ie.morphNormals!==Ke||Ie.morphColors!==rt||Ie.toneMapping!==ht||Ie.morphTargetsCount!==st)&&(et=!0):(et=!0,Ie.__version=X.version);let Zt=Ie.currentProgram;et===!0&&(Zt=Yr(X,k,B));let bi=!1,Jt=!1,mr=!1;const lt=Zt.getUniforms(),Yt=Ie.uniforms;if(xe.useProgram(Zt.program)&&(bi=!0,Jt=!0,mr=!0),X.id!==P&&(P=X.id,Jt=!0),bi||O!==E){xe.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),lt.setValue(D,"projectionMatrix",E.projectionMatrix),lt.setValue(D,"viewMatrix",E.matrixWorldInverse);const jt=lt.map.cameraPosition;jt!==void 0&&jt.setValue(D,Se.setFromMatrixPosition(E.matrixWorld)),Je.logarithmicDepthBuffer&&lt.setValue(D,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&lt.setValue(D,"isOrthographic",E.isOrthographicCamera===!0),O!==E&&(O=E,Jt=!0,mr=!0)}if(B.isSkinnedMesh){lt.setOptional(D,B,"bindMatrix"),lt.setOptional(D,B,"bindMatrixInverse");const Ot=B.skeleton;Ot&&(Ot.boneTexture===null&&Ot.computeBoneTexture(),lt.setValue(D,"boneTexture",Ot.boneTexture,De))}B.isBatchedMesh&&(lt.setOptional(D,B,"batchingTexture"),lt.setValue(D,"batchingTexture",B._matricesTexture,De),lt.setOptional(D,B,"batchingIdTexture"),lt.setValue(D,"batchingIdTexture",B._indirectTexture,De),lt.setOptional(D,B,"batchingColorTexture"),B._colorsTexture!==null&&lt.setValue(D,"batchingColorTexture",B._colorsTexture,De));const nn=W.morphAttributes;if((nn.position!==void 0||nn.normal!==void 0||nn.color!==void 0)&&Ce.update(B,W,Zt),(Jt||Ie.receiveShadow!==B.receiveShadow)&&(Ie.receiveShadow=B.receiveShadow,lt.setValue(D,"receiveShadow",B.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(Yt.envMap.value=ge,Yt.flipEnvMap.value=ge.isCubeTexture&&ge.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&k.environment!==null&&(Yt.envMapIntensity.value=k.environmentIntensity),Yt.dfgLUT!==void 0&&(Yt.dfgLUT.value=bx()),Jt&&(lt.setValue(D,"toneMappingExposure",b.toneMappingExposure),Ie.needsLights&&Ou(Yt,mr),oe&&X.fog===!0&&Me.refreshFogUniforms(Yt,oe),Me.refreshMaterialUniforms(Yt,X,te,ee,y.state.transmissionRenderTarget[E.id]),Ta.upload(D,ic(Ie),Yt,De)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(Ta.upload(D,ic(Ie),Yt,De),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&lt.setValue(D,"center",B.center),lt.setValue(D,"modelViewMatrix",B.modelViewMatrix),lt.setValue(D,"normalMatrix",B.normalMatrix),lt.setValue(D,"modelMatrix",B.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){const Ot=X.uniformsGroups;for(let jt=0,Ya=Ot.length;jt<Ya;jt++){const Qn=Ot[jt];se.update(Qn,Zt),se.bind(Qn,Zt)}}return Zt}function Ou(E,k){E.ambientLightColor.needsUpdate=k,E.lightProbe.needsUpdate=k,E.directionalLights.needsUpdate=k,E.directionalLightShadows.needsUpdate=k,E.pointLights.needsUpdate=k,E.pointLightShadows.needsUpdate=k,E.spotLights.needsUpdate=k,E.spotLightShadows.needsUpdate=k,E.rectAreaLights.needsUpdate=k,E.hemisphereLights.needsUpdate=k}function ku(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return F},this.getActiveMipmapLevel=function(){return S},this.getRenderTarget=function(){return v},this.setRenderTargetTextures=function(E,k,W){const X=be.get(E);X.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,X.__autoAllocateDepthBuffer===!1&&(X.__useRenderToTexture=!1),be.get(E.texture).__webglTexture=k,be.get(E.depthTexture).__webglTexture=X.__autoAllocateDepthBuffer?void 0:W,X.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,k){const W=be.get(E);W.__webglFramebuffer=k,W.__useDefaultFramebuffer=k===void 0};const Bu=D.createFramebuffer();this.setRenderTarget=function(E,k=0,W=0){v=E,F=k,S=W;let X=!0,B=null,oe=!1,pe=!1;if(E){const ge=be.get(E);if(ge.__useDefaultFramebuffer!==void 0)xe.bindFramebuffer(D.FRAMEBUFFER,null),X=!1;else if(ge.__webglFramebuffer===void 0)De.setupRenderTarget(E);else if(ge.__hasExternalTextures)De.rebindTextures(E,be.get(E.texture).__webglTexture,be.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const Re=E.depthTexture;if(ge.__boundDepthTexture!==Re){if(Re!==null&&be.has(Re)&&(E.width!==Re.image.width||E.height!==Re.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");De.setupDepthRenderbuffer(E)}}const Ne=E.texture;(Ne.isData3DTexture||Ne.isDataArrayTexture||Ne.isCompressedArrayTexture)&&(pe=!0);const Oe=be.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Oe[k])?B=Oe[k][W]:B=Oe[k],oe=!0):E.samples>0&&De.useMultisampledRTT(E)===!1?B=be.get(E).__webglMultisampledFramebuffer:Array.isArray(Oe)?B=Oe[W]:B=Oe,L.copy(E.viewport),q.copy(E.scissor),H=E.scissorTest}else L.copy(Le).multiplyScalar(te).floor(),q.copy(Ge).multiplyScalar(te).floor(),H=$e;if(W!==0&&(B=Bu),xe.bindFramebuffer(D.FRAMEBUFFER,B)&&X&&xe.drawBuffers(E,B),xe.viewport(L),xe.scissor(q),xe.setScissorTest(H),oe){const ge=be.get(E.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+k,ge.__webglTexture,W)}else if(pe){const ge=k;for(let Ne=0;Ne<E.textures.length;Ne++){const Oe=be.get(E.textures[Ne]);D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0+Ne,Oe.__webglTexture,W,ge)}}else if(E!==null&&W!==0){const ge=be.get(E.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,ge.__webglTexture,W)}P=-1},this.readRenderTargetPixels=function(E,k,W,X,B,oe,pe,_e=0){if(!(E&&E.isWebGLRenderTarget)){pt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ge=be.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&pe!==void 0&&(ge=ge[pe]),ge){xe.bindFramebuffer(D.FRAMEBUFFER,ge);try{const Ne=E.textures[_e],Oe=Ne.format,Re=Ne.type;if(!Je.textureFormatReadable(Oe)){pt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Je.textureTypeReadable(Re)){pt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=E.width-X&&W>=0&&W<=E.height-B&&(E.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+_e),D.readPixels(k,W,X,B,Ue.convert(Oe),Ue.convert(Re),oe))}finally{const Ne=v!==null?be.get(v).__webglFramebuffer:null;xe.bindFramebuffer(D.FRAMEBUFFER,Ne)}}},this.readRenderTargetPixelsAsync=async function(E,k,W,X,B,oe,pe,_e=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ge=be.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&pe!==void 0&&(ge=ge[pe]),ge)if(k>=0&&k<=E.width-X&&W>=0&&W<=E.height-B){xe.bindFramebuffer(D.FRAMEBUFFER,ge);const Ne=E.textures[_e],Oe=Ne.format,Re=Ne.type;if(!Je.textureFormatReadable(Oe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Je.textureTypeReadable(Re))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ke=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,Ke),D.bufferData(D.PIXEL_PACK_BUFFER,oe.byteLength,D.STREAM_READ),E.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+_e),D.readPixels(k,W,X,B,Ue.convert(Oe),Ue.convert(Re),0);const rt=v!==null?be.get(v).__webglFramebuffer:null;xe.bindFramebuffer(D.FRAMEBUFFER,rt);const ht=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await Df(D,ht,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,Ke),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,oe),D.deleteBuffer(Ke),D.deleteSync(ht),oe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,k=null,W=0){const X=Math.pow(2,-W),B=Math.floor(E.image.width*X),oe=Math.floor(E.image.height*X),pe=k!==null?k.x:0,_e=k!==null?k.y:0;De.setTexture2D(E,0),D.copyTexSubImage2D(D.TEXTURE_2D,W,0,0,pe,_e,B,oe),xe.unbindTexture()};const zu=D.createFramebuffer(),Hu=D.createFramebuffer();this.copyTextureToTexture=function(E,k,W=null,X=null,B=0,oe=null){oe===null&&(B!==0?(kr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),oe=B,B=0):oe=0);let pe,_e,ge,Ne,Oe,Re,Ke,rt,ht;const dt=E.isCompressedTexture?E.mipmaps[oe]:E.image;if(W!==null)pe=W.max.x-W.min.x,_e=W.max.y-W.min.y,ge=W.isBox3?W.max.z-W.min.z:1,Ne=W.min.x,Oe=W.min.y,Re=W.isBox3?W.min.z:0;else{const nn=Math.pow(2,-B);pe=Math.floor(dt.width*nn),_e=Math.floor(dt.height*nn),E.isDataArrayTexture?ge=dt.depth:E.isData3DTexture?ge=Math.floor(dt.depth*nn):ge=1,Ne=0,Oe=0,Re=0}X!==null?(Ke=X.x,rt=X.y,ht=X.z):(Ke=0,rt=0,ht=0);const st=Ue.convert(k.format),Ie=Ue.convert(k.type);let ct;k.isData3DTexture?(De.setTexture3D(k,0),ct=D.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(De.setTexture2DArray(k,0),ct=D.TEXTURE_2D_ARRAY):(De.setTexture2D(k,0),ct=D.TEXTURE_2D),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,k.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,k.unpackAlignment);const et=D.getParameter(D.UNPACK_ROW_LENGTH),Zt=D.getParameter(D.UNPACK_IMAGE_HEIGHT),bi=D.getParameter(D.UNPACK_SKIP_PIXELS),Jt=D.getParameter(D.UNPACK_SKIP_ROWS),mr=D.getParameter(D.UNPACK_SKIP_IMAGES);D.pixelStorei(D.UNPACK_ROW_LENGTH,dt.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,dt.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Ne),D.pixelStorei(D.UNPACK_SKIP_ROWS,Oe),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Re);const lt=E.isDataArrayTexture||E.isData3DTexture,Yt=k.isDataArrayTexture||k.isData3DTexture;if(E.isDepthTexture){const nn=be.get(E),Ot=be.get(k),jt=be.get(nn.__renderTarget),Ya=be.get(Ot.__renderTarget);xe.bindFramebuffer(D.READ_FRAMEBUFFER,jt.__webglFramebuffer),xe.bindFramebuffer(D.DRAW_FRAMEBUFFER,Ya.__webglFramebuffer);for(let Qn=0;Qn<ge;Qn++)lt&&(D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,be.get(E).__webglTexture,B,Re+Qn),D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,be.get(k).__webglTexture,oe,ht+Qn)),D.blitFramebuffer(Ne,Oe,pe,_e,Ke,rt,pe,_e,D.DEPTH_BUFFER_BIT,D.NEAREST);xe.bindFramebuffer(D.READ_FRAMEBUFFER,null),xe.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else if(B!==0||E.isRenderTargetTexture||be.has(E)){const nn=be.get(E),Ot=be.get(k);xe.bindFramebuffer(D.READ_FRAMEBUFFER,zu),xe.bindFramebuffer(D.DRAW_FRAMEBUFFER,Hu);for(let jt=0;jt<ge;jt++)lt?D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,nn.__webglTexture,B,Re+jt):D.framebufferTexture2D(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,nn.__webglTexture,B),Yt?D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,Ot.__webglTexture,oe,ht+jt):D.framebufferTexture2D(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Ot.__webglTexture,oe),B!==0?D.blitFramebuffer(Ne,Oe,pe,_e,Ke,rt,pe,_e,D.COLOR_BUFFER_BIT,D.NEAREST):Yt?D.copyTexSubImage3D(ct,oe,Ke,rt,ht+jt,Ne,Oe,pe,_e):D.copyTexSubImage2D(ct,oe,Ke,rt,Ne,Oe,pe,_e);xe.bindFramebuffer(D.READ_FRAMEBUFFER,null),xe.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else Yt?E.isDataTexture||E.isData3DTexture?D.texSubImage3D(ct,oe,Ke,rt,ht,pe,_e,ge,st,Ie,dt.data):k.isCompressedArrayTexture?D.compressedTexSubImage3D(ct,oe,Ke,rt,ht,pe,_e,ge,st,dt.data):D.texSubImage3D(ct,oe,Ke,rt,ht,pe,_e,ge,st,Ie,dt):E.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,oe,Ke,rt,pe,_e,st,Ie,dt.data):E.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,oe,Ke,rt,dt.width,dt.height,st,dt.data):D.texSubImage2D(D.TEXTURE_2D,oe,Ke,rt,pe,_e,st,Ie,dt);D.pixelStorei(D.UNPACK_ROW_LENGTH,et),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,Zt),D.pixelStorei(D.UNPACK_SKIP_PIXELS,bi),D.pixelStorei(D.UNPACK_SKIP_ROWS,Jt),D.pixelStorei(D.UNPACK_SKIP_IMAGES,mr),oe===0&&k.generateMipmaps&&D.generateMipmap(ct),xe.unbindTexture()},this.initRenderTarget=function(E){be.get(E).__webglFramebuffer===void 0&&De.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?De.setTextureCube(E,0):E.isData3DTexture?De.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?De.setTexture2DArray(E,0):De.setTexture2D(E,0),xe.unbindTexture()},this.resetState=function(){F=0,S=0,v=null,xe.reset(),U.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Mn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=tt._getDrawingBufferColorSpace(e),t.unpackColorSpace=tt._getUnpackColorSpace()}}function yx(){const i=new Map;return{on(e,t){const n=e;let r=i.get(n);return r||(r=new Set,i.set(n,r)),r.add(t),()=>r.delete(t)},off(e,t){i.get(e)?.delete(t)},emit(e,t){const n=i.get(e);if(n)for(const r of Array.from(n))r(t)}}}function Sx(i,e){const t=new Mx({canvas:i,antialias:!1,alpha:!1,stencil:!1,depth:!0,powerPreference:"high-performance",preserveDrawingBuffer:!0});return t.setPixelRatio(Math.min(window.devicePixelRatio,e.pixelRatio)),t.outputColorSpace=Ut,t.toneMapping=Fn,t.toneMappingExposure=1,t.shadowMap.enabled=!0,t.shadowMap.type=e.softShadows?vn:Po,t.shadowMap.autoUpdate=!0,t.setClearColor(0,1),t.info.autoReset=!1,t}function Ex(i,e){return Math.min(i.capabilities.getMaxAnisotropy(),e.anisotropy)}function wx(i){const e=i.extensions,t=e.has("EXT_color_buffer_float"),n=e.has("OES_texture_float_linear")||i.capabilities.isWebGL2;return t&&n?Lt:bt}const xu={ultra:{tier:"ultra",pixelRatio:2,shadowMapSize:2048,softShadows:!0,taaSamples:16,bloomMips:6,dof:!0,ssr:!0,volumetrics:!0,maxParticles:24e3,anisotropy:16},high:{tier:"high",pixelRatio:1.75,shadowMapSize:2048,softShadows:!0,taaSamples:8,bloomMips:5,dof:!0,ssr:!0,volumetrics:!0,maxParticles:14e3,anisotropy:8},medium:{tier:"medium",pixelRatio:1.5,shadowMapSize:1024,softShadows:!0,taaSamples:4,bloomMips:4,dof:!1,ssr:!1,volumetrics:!0,maxParticles:7e3,anisotropy:4},low:{tier:"low",pixelRatio:1,shadowMapSize:512,softShadows:!1,taaSamples:1,bloomMips:3,dof:!1,ssr:!1,volumetrics:!1,maxParticles:2500,anisotropy:2}};function ji(i){return{...xu[i]}}function Tx(){const i=new URLSearchParams(location.search).get("quality");if(i&&i in xu)return ji(i);const e=navigator.deviceMemory??8,t=navigator.hardwareConcurrency??4;return matchMedia("(pointer: coarse)").matches?ji(e>=6&&t>=6?"medium":"low"):e>=8&&t>=8?ji("ultra"):e>=6&&t>=4?ji("high"):ji("medium")}const Es=["low","medium","high","ultra"];function gu(i){let e=i>>>0;return()=>{e=e+2654435769>>>0;let t=e;return t=Math.imul(t^t>>>16,569420461),t=Math.imul(t^t>>>15,1935289751),((t^t>>>15)>>>0)/4294967296}}function Ax(i){let e=2166136261;for(let t=0;t<i.length;t++)e^=i.charCodeAt(t),e=Math.imul(e,16777619);return e>>>0}const Rx=`
in vec3 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4( position.xy, 0.0, 1.0 );
}
`,gn=`
#ifndef PM_COMMON
#define PM_COMMON

float luma( vec3 c ) { return dot( c, vec3( 0.2126, 0.7152, 0.0722 ) ); }
float maxc( vec3 c ) { return max( c.r, max( c.g, c.b ) ); }
float sat1( float x ) { return clamp( x, 0.0, 1.0 ); }
vec3 sat3( vec3 x ) { return clamp( x, vec3( 0.0 ), vec3( 1.0 ) ); }

// Karis weight: suppresses fireflies by weighting a tap by its own brightness.
float karisWeight( vec3 c ) { return 1.0 / ( 1.0 + luma( c ) ); }

// Integer hash, exact in float32 for the ranges used here.
float hash13( vec3 p ) {
  p = fract( p * 0.1031 );
  p += dot( p, p.yzx + 33.33 );
  return fract( ( p.x + p.y ) * p.z );
}

// Depth buffer value (0..1, window space) to positive view space distance.
float linearDepth( float d, float near, float far ) {
  float z = d * 2.0 - 1.0;
  return ( 2.0 * near * far ) / ( far + near - z * ( far - near ) );
}

#endif
`;function $t(i,e,t={}){const n=Math.max(1,Math.round(i)),r=Math.max(1,Math.round(e)),a=t.filter??xt,s=new On(n,r,{type:t.type??Lt,format:t.format??Vt,colorSpace:Ht,depthBuffer:t.depthBuffer??!1,stencilBuffer:!1,samples:0,count:t.count??1}),o=t.wrap??It;for(const c of s.textures)c.minFilter=t.generateMipmaps?dn:a,c.magFilter=a,c.wrapS=o,c.wrapT=o,c.generateMipmaps=t.generateMipmaps??!1,c.anisotropy=1;if(t.depthTexture){const c=new Go(n,r,Zn);c.format=sr,c.minFilter=gt,c.magFilter=gt,c.generateMipmaps=!1,s.depthTexture=c}return s}function Tt(i){i&&(i.depthTexture&&i.depthTexture.dispose(),i.dispose())}class mn{material;constructor(e,t,n={}){this.material=new Eh({glslVersion:So,uniforms:t,defines:{...n},vertexShader:Rx,fragmentShader:`precision highp float;
precision highp int;
precision highp sampler3D;
${e}`,depthTest:!1,depthWrite:!1,blending:Sn,transparent:!1})}get uniforms(){return this.material.uniforms}set(e,t){const n=this.material.uniforms[e];n&&(n.value=t)}define(e,t){this.material.defines[e]!==t&&(this.material.defines[e]=t,this.material.needsUpdate=!0)}dispose(){this.material.dispose()}}class Cx{geometry;mesh;scene;camera;placeholder;constructor(){this.geometry=new Nt,this.geometry.setAttribute("position",new Ft(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3)),this.geometry.setAttribute("uv",new Ft(new Float32Array([0,0,2,0,0,2]),2)),this.placeholder=new Wr,this.mesh=new Ye(this.geometry,this.placeholder),this.mesh.frustumCulled=!1,this.scene=new cu,this.scene.add(this.mesh),this.camera=new qo(-1,1,1,-1,0,1)}render(e,t,n){this.mesh.material=t.material,e.setRenderTarget(n),e.render(this.scene,this.camera)}dispose(){this.geometry.dispose(),this.placeholder.dispose(),this.scene.clear()}}function ol(i,e){let t=0,n=1/e,r=i;for(;r>0;)t+=n*(r%e),r=Math.floor(r/e),n/=e;return t}function cl(i){const e=[];for(let t=1;t<=i;t++)e.push([ol(t,2)-.5,ol(t,3)-.5]);return e}const Px=`
${gn}

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D tCurrent;
uniform sampler2D tHistory;
uniform sampler2D tDepth;
uniform vec2 uTexel;
uniform vec2 uResolution;
uniform mat4 uInvViewProj;
uniform mat4 uPrevViewProj;
uniform float uFeedback;
uniform float uReset;
uniform float uClampScale;
uniform float uSharpen;

vec3 rgbToYCoCg( vec3 c ) {
  return vec3(
    0.25 * c.r + 0.5 * c.g + 0.25 * c.b,
    0.5 * c.r - 0.5 * c.b,
    -0.25 * c.r + 0.5 * c.g - 0.25 * c.b
  );
}

vec3 yCoCgToRgb( vec3 c ) {
  float t = c.x - c.z;
  return vec3( t + c.y, c.x + c.z, t - c.y );
}

// Tone weighting during the blend keeps a single very bright sample from
// dominating the average and flickering. Undone after the mix.
vec3 toneIn( vec3 c ) { return c / ( 1.0 + maxc( max( c, vec3( 0.0 ) ) ) ); }
vec3 toneOut( vec3 c ) { return c / max( 1e-4, 1.0 - maxc( min( c, vec3( 0.999 ) ) ) ); }

// Five tap Catmull-Rom: nine texel support from five bilinear fetches.
vec3 sampleHistory( vec2 uv ) {
  vec2 pos = uv * uResolution;
  vec2 tc1 = floor( pos - 0.5 ) + 0.5;
  vec2 f = pos - tc1;
  vec2 f2 = f * f;
  vec2 f3 = f2 * f;

  vec2 w0 = -0.5 * f3 + f2 - 0.5 * f;
  vec2 w1 = 1.5 * f3 - 2.5 * f2 + 1.0;
  vec2 w2 = -1.5 * f3 + 2.0 * f2 + 0.5 * f;
  vec2 w3 = 0.5 * f3 - 0.5 * f2;

  vec2 w12 = w1 + w2;
  vec2 off12 = w2 / max( w12, vec2( 1e-5 ) );

  vec2 p0 = ( tc1 - 1.0 ) * uTexel;
  vec2 p3 = ( tc1 + 2.0 ) * uTexel;
  vec2 p12 = ( tc1 + off12 ) * uTexel;

  vec3 acc = vec3( 0.0 );
  float wsum = 0.0;

  float w;
  w = w12.x * w0.y;  acc += texture( tHistory, vec2( p12.x, p0.y ) ).rgb * w;  wsum += w;
  w = w0.x * w12.y;  acc += texture( tHistory, vec2( p0.x, p12.y ) ).rgb * w;  wsum += w;
  w = w12.x * w12.y; acc += texture( tHistory, vec2( p12.x, p12.y ) ).rgb * w; wsum += w;
  w = w3.x * w12.y;  acc += texture( tHistory, vec2( p3.x, p12.y ) ).rgb * w;  wsum += w;
  w = w12.x * w3.y;  acc += texture( tHistory, vec2( p12.x, p3.y ) ).rgb * w;  wsum += w;

  return max( acc / max( wsum, 1e-5 ), vec3( 0.0 ) );
}

// Clip toward the box centre rather than clamping per axis: clamping snaps the
// history onto a face of the box and shows up as a hard edge crawl.
vec3 clipToBox( vec3 boxMin, vec3 boxMax, vec3 history, vec3 center ) {
  vec3 c = 0.5 * ( boxMax + boxMin );
  vec3 e = 0.5 * ( boxMax - boxMin ) + 1e-5;
  vec3 d = history - c;
  vec3 unit = d / e;
  float m = maxc( abs( unit ) );
  return m > 1.0 ? c + d / m : history;
}

void main() {
  vec3 current = texture( tCurrent, vUv ).rgb;

  // Closest fragment in a small cross: reprojecting the nearest depth keeps
  // silhouettes from smearing against the background behind them.
  float depth = texture( tDepth, vUv ).x;
  vec2 bestUv = vUv;
  #ifdef DILATE_DEPTH
  {
    vec2 offs[ 4 ];
    offs[ 0 ] = vec2( -1.0, -1.0 );
    offs[ 1 ] = vec2( 1.0, -1.0 );
    offs[ 2 ] = vec2( -1.0, 1.0 );
    offs[ 3 ] = vec2( 1.0, 1.0 );
    for ( int i = 0; i < 4; i++ ) {
      vec2 uv = vUv + offs[ i ] * uTexel;
      float d = texture( tDepth, uv ).x;
      if ( d < depth ) { depth = d; bestUv = uv; }
    }
  }
  #endif

  vec4 ndc = vec4( bestUv * 2.0 - 1.0, depth * 2.0 - 1.0, 1.0 );
  vec4 world = uInvViewProj * ndc;
  world /= world.w;
  vec4 prevClip = uPrevViewProj * world;
  bool behind = prevClip.w <= 1e-6;
  vec2 prevUv = ( prevClip.xy / max( prevClip.w, 1e-6 ) ) * 0.5 + 0.5;
  vec2 velocity = vUv - prevUv;
  vec2 historyUv = vUv - velocity;

  // Three by three neighbourhood in YCoCg, first and second moments.
  vec3 m1 = vec3( 0.0 );
  vec3 m2 = vec3( 0.0 );
  vec3 nmin = vec3( 1e9 );
  vec3 nmax = vec3( -1e9 );
  vec3 centerY = vec3( 0.0 );
  vec3 crossSum = vec3( 0.0 );

  for ( int y = -1; y <= 1; y++ ) {
    for ( int x = -1; x <= 1; x++ ) {
      vec3 c = texture( tCurrent, vUv + vec2( float( x ), float( y ) ) * uTexel ).rgb;
      vec3 y3 = rgbToYCoCg( toneIn( c ) );
      m1 += y3;
      m2 += y3 * y3;
      nmin = min( nmin, y3 );
      nmax = max( nmax, y3 );
      if ( x == 0 && y == 0 ) centerY = y3;
      if ( x == 0 || y == 0 ) crossSum += y3;
    }
  }

  vec3 mean = m1 / 9.0;
  vec3 sigma = sqrt( max( vec3( 0.0 ), m2 / 9.0 - mean * mean ) );
  vec3 boxMin = max( mean - uClampScale * sigma, nmin );
  vec3 boxMax = min( mean + uClampScale * sigma, nmax );

  vec3 historyRgb = sampleHistory( historyUv );
  vec3 historyY = rgbToYCoCg( toneIn( historyRgb ) );
  vec3 clipped = clipToBox( boxMin, boxMax, historyY, centerY );

  // Feedback drops off with screen space motion so fast pans resolve quickly
  // instead of dragging a tail, and collapses entirely off screen.
  float speed = length( velocity * uResolution );
  float blend = uFeedback * exp( -speed * 0.09 );
  bool offscreen = any( lessThan( historyUv, vec2( 0.0 ) ) ) || any( greaterThan( historyUv, vec2( 1.0 ) ) );
  if ( offscreen || behind || uReset > 0.5 ) blend = 0.0;

  // Luminance weighted average, the Karis trick, applied inside the tone
  // weighted domain where both samples are already range compressed.
  float wc = ( 1.0 - blend ) / ( 1.0 + centerY.x );
  float wh = blend / ( 1.0 + clipped.x );
  vec3 resolvedY = ( centerY * wc + clipped * wh ) / max( wc + wh, 1e-5 );

  vec3 resolved = toneOut( yCoCgToRgb( resolvedY ) );

  // Light sharpen recovers the sub texel energy the temporal filter removes.
  if ( uSharpen > 0.0 ) {
    vec3 blurY = crossSum / 5.0;
    vec3 blurRgb = toneOut( yCoCgToRgb( blurY ) );
    resolved += ( resolved - blurRgb ) * uSharpen;
  }

  fragColor = vec4( max( resolved, vec3( 0.0 ) ), 1.0 );
}
`;class Dx{constructor(e){this.options=e,this.jitter=cl(Math.max(1,e.samples)),this.pass=new mn(Px,{tCurrent:{value:null},tHistory:{value:null},tDepth:{value:null},uTexel:{value:new ye},uResolution:{value:new ye},uInvViewProj:{value:new je},uPrevViewProj:{value:new je},uFeedback:{value:e.feedback},uReset:{value:1},uClampScale:{value:e.clampScale},uSharpen:{value:e.sharpen}},e.dilateDepth?{DILATE_DEPTH:1}:{})}pass;history=null;write=0;jitter;frame=0;reset=!0;width=1;height=1;prevViewProj=new je;curViewProj=new je;prevCamPos=new C;prevCamDir=new C;tmpDir=new C;get enabled(){return this.options.samples>1}configure(e){const t=e.dilateDepth!==this.options.dilateDepth;this.options=e,this.jitter=cl(Math.max(1,e.samples)),this.pass.set("uFeedback",e.feedback),this.pass.set("uClampScale",e.clampScale),this.pass.set("uSharpen",e.sharpen),t&&(e.dilateDepth?this.pass.define("DILATE_DEPTH",1):(delete this.pass.material.defines.DILATE_DEPTH,this.pass.material.needsUpdate=!0)),this.resetHistory()}setSize(e,t){this.width=e,this.height=t,this.history&&(Tt(this.history[0]),Tt(this.history[1])),this.history=[$t(e,t,{type:Lt}),$t(e,t,{type:Lt})],this.pass.set("uTexel",new ye(1/e,1/t)),this.pass.set("uResolution",new ye(e,t)),this.resetHistory()}resetHistory(){this.reset=!0}applyJitter(e){if(this.curViewProj.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),!this.enabled)return()=>{};const[t,n]=this.jitter[this.frame%this.jitter.length],r=e.projectionMatrix.elements,a=r[8],s=r[9];return r[8]=a+t*2/this.width,r[9]=s+n*2/this.height,e.projectionMatrixInverse.copy(e.projectionMatrix).invert(),()=>{r[8]=a,r[9]=s,e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}checkCameraCut(e,t){if(this.tmpDir.set(0,0,-1).applyQuaternion(e.quaternion),this.frame>0){const n=e.position.distanceTo(this.prevCamPos),r=this.tmpDir.dot(this.prevCamDir);(n>Math.max(.5,30*t)||r<.966)&&this.resetHistory()}this.prevCamPos.copy(e.position),this.prevCamDir.copy(this.tmpDir)}render(e,t,n,r){if(!this.history)throw new Error("TaaPass.setSize was never called");const a=this.history[1-this.write],s=this.history[this.write];return this.pass.set("tCurrent",n),this.pass.set("tHistory",a.texture),this.pass.set("tDepth",r),this.pass.uniforms.uInvViewProj.value.copy(this.curViewProj).invert(),this.pass.uniforms.uPrevViewProj.value.copy(this.frame===0||this.reset?this.curViewProj:this.prevViewProj),this.pass.set("uReset",this.reset?1:0),t.render(e,this.pass,s),this.prevViewProj.copy(this.curViewProj),this.write=1-this.write,this.reset=!1,this.frame++,s.texture}step(){this.prevViewProj.copy(this.curViewProj),this.frame++}dispose(){this.pass.dispose(),this.history&&(Tt(this.history[0]),Tt(this.history[1]),this.history=null)}}const Ux=`
${gn}

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D tSource;
uniform sampler2D tMeter;
uniform vec2 uTexel;
uniform vec4 uCurve;   // x: threshold, y: threshold - knee, z: 2 * knee, w: 0.25 / knee
uniform float uClamp;
uniform float uExposureScale;

vec3 fetch( vec2 uv ) {
  // Exposure first. The threshold below is stated in exposed scene linear, so
  // it means the same thing whether the metered gain is one stop or five.
  float exposure = texture( tMeter, vec2( 0.5 ) ).b * uExposureScale;
  vec3 c = texture( tSource, uv ).rgb * exposure;
  // Hard clamp after exposure. Values above this are not light, they are a
  // sampling accident, and they would alias for the whole chain.
  return min( max( c, vec3( 0.0 ) ), vec3( uClamp ) );
}

vec3 knee( vec3 c ) {
  float br = maxc( c );
  float rq = clamp( br - uCurve.y, 0.0, uCurve.z );
  rq = uCurve.w * rq * rq;
  float contribution = max( rq, br - uCurve.x ) / max( br, 1e-5 );
  return c * contribution;
}

void main() {
  vec2 t = uTexel;

  vec3 a = fetch( vUv + t * vec2( -2.0,  2.0 ) );
  vec3 b = fetch( vUv + t * vec2(  0.0,  2.0 ) );
  vec3 c = fetch( vUv + t * vec2(  2.0,  2.0 ) );
  vec3 d = fetch( vUv + t * vec2( -2.0,  0.0 ) );
  vec3 e = fetch( vUv );
  vec3 f = fetch( vUv + t * vec2(  2.0,  0.0 ) );
  vec3 g = fetch( vUv + t * vec2( -2.0, -2.0 ) );
  vec3 h = fetch( vUv + t * vec2(  0.0, -2.0 ) );
  vec3 i = fetch( vUv + t * vec2(  2.0, -2.0 ) );
  vec3 j = fetch( vUv + t * vec2( -1.0,  1.0 ) );
  vec3 k = fetch( vUv + t * vec2(  1.0,  1.0 ) );
  vec3 l = fetch( vUv + t * vec2( -1.0, -1.0 ) );
  vec3 m = fetch( vUv + t * vec2(  1.0, -1.0 ) );

  vec3 g0 = ( j + k + l + m ) * 0.25;
  vec3 g1 = ( a + b + d + e ) * 0.25;
  vec3 g2 = ( b + c + e + f ) * 0.25;
  vec3 g3 = ( d + e + g + h ) * 0.25;
  vec3 g4 = ( e + f + h + i ) * 0.25;

  // Karis average over the groups: weight each two by two block by its own
  // inverse luminance so one blown texel cannot dominate the block.
  float w0 = karisWeight( g0 ) * 0.5;
  float w1 = karisWeight( g1 ) * 0.125;
  float w2 = karisWeight( g2 ) * 0.125;
  float w3 = karisWeight( g3 ) * 0.125;
  float w4 = karisWeight( g4 ) * 0.125;
  vec3 sum = g0 * w0 + g1 * w1 + g2 * w2 + g3 * w3 + g4 * w4;
  vec3 color = sum / max( w0 + w1 + w2 + w3 + w4, 1e-5 );

  fragColor = vec4( knee( color ), 1.0 );
}
`,Ix=`
${gn}

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D tSource;
uniform vec2 uTexel;

vec3 fetch( vec2 uv ) { return texture( tSource, uv ).rgb; }

void main() {
  vec2 t = uTexel;

  vec3 a = fetch( vUv + t * vec2( -2.0,  2.0 ) );
  vec3 b = fetch( vUv + t * vec2(  0.0,  2.0 ) );
  vec3 c = fetch( vUv + t * vec2(  2.0,  2.0 ) );
  vec3 d = fetch( vUv + t * vec2( -2.0,  0.0 ) );
  vec3 e = fetch( vUv );
  vec3 f = fetch( vUv + t * vec2(  2.0,  0.0 ) );
  vec3 g = fetch( vUv + t * vec2( -2.0, -2.0 ) );
  vec3 h = fetch( vUv + t * vec2(  0.0, -2.0 ) );
  vec3 i = fetch( vUv + t * vec2(  2.0, -2.0 ) );
  vec3 j = fetch( vUv + t * vec2( -1.0,  1.0 ) );
  vec3 k = fetch( vUv + t * vec2(  1.0,  1.0 ) );
  vec3 l = fetch( vUv + t * vec2( -1.0, -1.0 ) );
  vec3 m = fetch( vUv + t * vec2(  1.0, -1.0 ) );

  vec3 color = e * 0.125;
  color += ( a + c + g + i ) * 0.03125;
  color += ( b + d + f + h ) * 0.0625;
  color += ( j + k + l + m ) * 0.125;

  fragColor = vec4( color, 1.0 );
}
`,Lx=`
${gn}

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D tSource;   // smaller mip, already accumulated
uniform sampler2D tTarget;   // same size mip from the downsample chain
uniform vec2 uTexel;         // texel size of tSource
uniform float uRadius;
uniform vec3 uTint;

vec3 tent( vec2 uv ) {
  vec2 r = uTexel * uRadius;
  vec3 s = texture( tSource, uv + vec2( -r.x,  r.y ) ).rgb;
  s += texture( tSource, uv + vec2( 0.0,  r.y ) ).rgb * 2.0;
  s += texture( tSource, uv + vec2(  r.x,  r.y ) ).rgb;
  s += texture( tSource, uv + vec2( -r.x, 0.0 ) ).rgb * 2.0;
  s += texture( tSource, uv ).rgb * 4.0;
  s += texture( tSource, uv + vec2(  r.x, 0.0 ) ).rgb * 2.0;
  s += texture( tSource, uv + vec2( -r.x, -r.y ) ).rgb;
  s += texture( tSource, uv + vec2( 0.0, -r.y ) ).rgb * 2.0;
  s += texture( tSource, uv + vec2(  r.x, -r.y ) ).rgb;
  return s * ( 1.0 / 16.0 );
}

void main() {
  vec3 lower = tent( vUv ) * uTint;
  vec3 here = texture( tTarget, vUv ).rgb;
  fragColor = vec4( here + lower, 1.0 );
}
`;class Fx{constructor(e){this.options=e,this.prefilter=new mn(Ux,{tSource:{value:null},tMeter:{value:null},uTexel:{value:new ye},uCurve:{value:new nt},uClamp:{value:e.clamp},uExposureScale:{value:1}}),this.downsample=new mn(Ix,{tSource:{value:null},uTexel:{value:new ye}}),this.upsample=new mn(Lx,{tSource:{value:null},tTarget:{value:null},uTexel:{value:new ye},uRadius:{value:e.radius},uTint:{value:new C(1,1,1)}}),this.updateCurve()}prefilter;downsample;upsample;down=[];up=[];width=1;height=1;updateCurve(){const e=Math.max(1e-4,this.options.threshold),t=Math.max(1e-4,e*this.options.knee);this.prefilter.uniforms.uCurve.value.set(e,e-t,2*t,.25/t),this.prefilter.set("uClamp",this.options.clamp),this.upsample.set("uRadius",this.options.radius)}setThreshold(e,t=this.options.knee){this.options.threshold=e,this.options.knee=t,this.updateCurve()}configure(e){const t=e.mips!==this.options.mips;this.options=e,this.updateCurve(),t&&this.setSize(this.width,this.height)}get texture(){return this.up.length?this.up[0].texture:null}setSize(e,t){this.releaseTargets(),this.width=e,this.height=t;const n=Math.max(1,Math.floor(Math.log2(Math.max(4,Math.min(e,t))))-1),r=Math.max(1,Math.min(this.options.mips,n));let a=Math.max(1,Math.floor(e/2)),s=Math.max(1,Math.floor(t/2));for(let o=0;o<r;o++)this.down.push($t(a,s,{type:Lt})),this.up.push($t(a,s,{type:Lt})),a=Math.max(1,Math.floor(a/2)),s=Math.max(1,Math.floor(s/2))}setExposure(e,t){this.prefilter.set("tMeter",e),this.prefilter.set("uExposureScale",t)}render(e,t,n){if(!this.down.length)return;const r=this.down.length;this.prefilter.set("tSource",n),this.prefilter.uniforms.uTexel.value.set(1/this.width,1/this.height),t.render(e,this.prefilter,this.down[0]);for(let a=1;a<r;a++){const s=this.down[a-1];this.downsample.set("tSource",s.texture),this.downsample.uniforms.uTexel.value.set(1/s.width,1/s.height),t.render(e,this.downsample,this.down[a])}if(r===1){this.upsample.set("tSource",this.down[0].texture),this.upsample.set("tTarget",this.down[0].texture),this.upsample.uniforms.uTexel.value.set(0,0),this.upsample.uniforms.uTint.value.set(0,0,0),t.render(e,this.upsample,this.up[0]),this.upsample.uniforms.uTint.value.set(1,1,1);return}this.upsample.set("tSource",this.down[r-1].texture),this.upsample.set("tTarget",this.down[r-1].texture),this.upsample.uniforms.uTexel.value.set(0,0),this.upsample.uniforms.uTint.value.set(0,0,0),t.render(e,this.upsample,this.up[r-1]);for(let a=r-2;a>=0;a--){const s=this.up[a+1];this.upsample.set("tSource",s.texture),this.upsample.set("tTarget",this.down[a].texture),this.upsample.uniforms.uTexel.value.set(1/s.width,1/s.height);const o=a/Math.max(1,r-1);this.upsample.uniforms.uTint.value.set(1+.05*(1-o),1,1+.09*o),t.render(e,this.upsample,this.up[a])}this.upsample.uniforms.uTint.value.set(1,1,1)}releaseTargets(){for(const e of this.down)Tt(e);for(const e of this.up)Tt(e);this.down=[],this.up=[]}dispose(){this.releaseTargets(),this.prefilter.dispose(),this.downsample.dispose(),this.upsample.dispose()}}const vu=`
uniform float uFocalLength;   // metres
uniform float uFStop;
uniform float uSensorHeight;  // metres
uniform float uBokehScale;
uniform float uMaxRadius;     // full resolution pixels
uniform float uFocusRange;    // metres held in focus around the focal plane
uniform float uHeightPixels;
uniform float uNear;
uniform float uFar;

// Signed circle of confusion radius in full resolution pixels. Negative is in
// front of the focal plane.
float cocRadius( float z, float focus ) {
  float d = z - focus;
  float held = sign( d ) * max( abs( d ) - uFocusRange * 0.5, 0.0 );
  float zEff = focus + held;
  float f = uFocalLength;
  float denom = max( uFStop * max( zEff, 1e-3 ) * max( focus - f, 1e-4 ), 1e-9 );
  float diameter = f * f * abs( zEff - focus ) / denom;
  float px = diameter / uSensorHeight * uHeightPixels * uBokehScale * 0.5;
  return sign( held ) * min( px, uMaxRadius );
}
`,Nx=`
${gn}
${vu}

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D tColor;
uniform sampler2D tDepth;
uniform sampler2D tMeter;
uniform vec2 uFullTexel;

void main() {
  // One bilinear tap at a half resolution texel centre is already the exact
  // two by two box average of the source, so no extra colour taps are needed.
  vec3 color = texture( tColor, vUv ).rgb;

  // Depth must not be filtered. Take the four covered texels and keep the
  // nearest, so a thin foreground silhouette survives the downsample instead of
  // being averaged into the background behind it.
  float d0 = texture( tDepth, vUv + uFullTexel * vec2( -0.5, -0.5 ) ).x;
  float d1 = texture( tDepth, vUv + uFullTexel * vec2(  0.5, -0.5 ) ).x;
  float d2 = texture( tDepth, vUv + uFullTexel * vec2( -0.5,  0.5 ) ).x;
  float d3 = texture( tDepth, vUv + uFullTexel * vec2(  0.5,  0.5 ) ).x;
  float d = min( min( d0, d1 ), min( d2, d3 ) );

  float focus = texture( tMeter, vec2( 0.5 ) ).g;
  float z = linearDepth( d, uNear, uFar );
  float coc = cocRadius( z, focus );

  // Firefly guard: an unclamped highlight scattered over a wide aperture turns
  // into a visible disc of pure white.
  color = min( color, vec3( 24.0 ) );

  fragColor = vec4( color, coc / max( uMaxRadius, 1e-4 ) );
}
`,Ox=`
${gn}

in vec2 vUv;
layout( location = 0 ) out vec4 outFar;
layout( location = 1 ) out vec4 outNear;

uniform sampler2D tPrep;
uniform vec2 uTexel;        // half resolution texel size
uniform float uMaxRadius;   // half resolution pixels
uniform float uAperture;    // 0 circular, 1 hexagonal

// A golden angle spiral gives an even, low discrepancy disc with none of the
// spoke structure a ring pattern shows on out of focus points.
const float GOLDEN = 2.39996323;

void main() {
  vec4 center = texture( tPrep, vUv );

  vec3 farAcc = vec3( 0.0 );
  float farW = 0.0;
  vec3 nearAcc = vec3( 0.0 );
  float nearW = 0.0;

  for ( int i = 0; i < TAPS; i++ ) {
    float fi = float( i ) + 0.5;
    float r = sqrt( fi / float( TAPS ) );
    float a = fi * GOLDEN;
    vec2 dir = vec2( cos( a ), sin( a ) );

    // Hexagonal aperture: push the unit disc out toward the six blade edges so
    // point highlights read as hex bokeh rather than perfect circles. The 0.93
    // renormalises the mean radius so changing aperture shape does not change
    // how much the image blurs.
    float hex = 0.93 / max( cos( mod( a, 1.0471976 ) - 0.5235988 ), 0.7 );
    float shape = mix( 1.0, hex, uAperture );
    vec2 offset = dir * r * shape * uMaxRadius;

    vec4 s = texture( tPrep, vUv + offset * uTexel );
    float sr = s.a * uMaxRadius;
    float dist = length( offset );

    // Coverage: this tap's own circle of confusion must reach the pixel being
    // shaded. That is scatter as gather, and it is what makes the blur
    // brightness independent of how many taps happen to be in range.
    float cover = sat1( abs( sr ) - dist + 1.0 );

    // Far field takes only samples at or behind the focal plane.
    float wf = cover * step( 0.0, sr );
    farAcc += s.rgb * wf;
    farW += wf;

    // Near field takes only samples in front of it.
    float wn = cover * step( sr, -1e-4 );
    nearAcc += s.rgb * wn;
    nearW += wn;
  }

  // The centre sample always belongs to the far buffer at unit weight so an in
  // focus pixel resolves to exactly itself.
  float centerW = step( -1e-4, center.a ) * 1.0;
  farAcc += center.rgb * centerW;
  farW += centerW;

  outFar = vec4( farAcc / max( farW, 1e-4 ), 1.0 );

  // Coverage alpha. A foreground with a small circle of confusion only reaches
  // a handful of taps, so the metered alpha is floored by the receiving pixel's
  // own CoC, which is what keeps a mildly defocused foreground from turning
  // semi transparent.
  float alpha = sat1( nearW * 2.0 / float( TAPS ) );
  alpha = max( alpha, sat1( -center.a * uMaxRadius * 0.6 ) );
  outNear = vec4( nearAcc / max( nearW, 1e-4 ), alpha );
}
`,kx=`
${gn}
${vu}

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D tColor;
uniform sampler2D tFar;
uniform sampler2D tNear;
uniform sampler2D tDepth;
uniform sampler2D tMeter;

void main() {
  vec3 sharp = texture( tColor, vUv ).rgb;
  float focus = texture( tMeter, vec2( 0.5 ) ).g;
  float z = linearDepth( texture( tDepth, vUv ).x, uNear, uFar );
  float coc = cocRadius( z, focus );

  vec3 far = texture( tFar, vUv ).rgb;
  vec4 near = texture( tNear, vUv );

  // Ramp the far field in over the first pixel and a half of defocus so the
  // transition out of critical focus is smooth rather than a visible band.
  float t = sat1( coc / max( uMaxRadius * 0.22, 1e-3 ) );
  float farBlend = t * t * ( 3.0 - 2.0 * t );

  vec3 color = mix( sharp, far, farBlend );
  color = mix( color, near.rgb, sat1( near.a ) );

  fragColor = vec4( color, 1.0 );
}
`;class Bx{constructor(e){this.options=e;const t=()=>({uFocalLength:{value:.035},uFStop:{value:e.fStop},uSensorHeight:{value:e.sensorHeight/1e3},uBokehScale:{value:e.bokehScale},uMaxRadius:{value:e.maxRadius},uFocusRange:{value:.6},uHeightPixels:{value:1e3},uNear:{value:.05},uFar:{value:200}});this.prep=new mn(Nx,{tColor:{value:null},tDepth:{value:null},tMeter:{value:null},uFullTexel:{value:new ye},...t()}),this.gather=new mn(Ox,{tPrep:{value:null},uTexel:{value:new ye},uMaxRadius:{value:e.maxRadius*.5},uAperture:{value:e.aperture}},{TAPS:e.taps}),this.composite=new mn(kx,{tColor:{value:null},tFar:{value:null},tNear:{value:null},tDepth:{value:null},tMeter:{value:null},...t()})}prep;gather;composite;prepTarget=null;gatherTarget=null;outTarget=null;width=1;height=1;focusRange=.6;configure(e){const t=e.taps!==this.options.taps;this.options=e;for(const n of[this.prep,this.composite])n.set("uFStop",e.fStop),n.set("uSensorHeight",e.sensorHeight/1e3),n.set("uBokehScale",e.bokehScale),n.set("uMaxRadius",e.maxRadius);this.gather.set("uMaxRadius",e.maxRadius*.5),this.gather.set("uAperture",e.aperture),t&&this.gather.define("TAPS",e.taps)}setCamera(e){const n=this.options.sensorHeight/1e3/2/Math.tan(jf.degToRad(e.fov)/2);for(const r of[this.prep,this.composite])r.set("uFocalLength",n),r.set("uNear",e.near),r.set("uFar",e.far)}setFocusRange(e){this.focusRange=Math.max(0,e),this.prep.set("uFocusRange",this.focusRange),this.composite.set("uFocusRange",this.focusRange)}setFStop(e){this.prep.set("uFStop",e),this.composite.set("uFStop",e)}setSize(e,t){this.release(),this.width=e,this.height=t;const n=Math.max(1,Math.floor(e/2)),r=Math.max(1,Math.floor(t/2));this.prepTarget=$t(n,r,{type:Lt}),this.gatherTarget=$t(n,r,{type:Lt,count:2}),this.outTarget=$t(e,t,{type:Lt}),this.prep.uniforms.uFullTexel.value.set(1/e,1/t),this.gather.uniforms.uTexel.value.set(1/n,1/r),this.prep.set("uHeightPixels",t),this.composite.set("uHeightPixels",t)}render(e,t,n,r,a){return!this.prepTarget||!this.gatherTarget||!this.outTarget?n:(this.prep.set("tColor",n),this.prep.set("tDepth",r),this.prep.set("tMeter",a),t.render(e,this.prep,this.prepTarget),this.gather.set("tPrep",this.prepTarget.texture),t.render(e,this.gather,this.gatherTarget),this.composite.set("tColor",n),this.composite.set("tFar",this.gatherTarget.textures[0]),this.composite.set("tNear",this.gatherTarget.textures[1]),this.composite.set("tDepth",r),this.composite.set("tMeter",a),t.render(e,this.composite,this.outTarget),this.outTarget.texture)}release(){Tt(this.prepTarget),Tt(this.gatherTarget),Tt(this.outTarget),this.prepTarget=null,this.gatherTarget=null,this.outTarget=null}dispose(){this.release(),this.prep.dispose(),this.gather.dispose(),this.composite.dispose()}}const Ni=9,zx=`
${gn}

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D tSource;
uniform vec2 uCell;      // uv extent of one grid cell

void main() {
  vec2 base = floor( vUv * float( GRID ) ) * uCell;
  float acc = 0.0;
  for ( int y = 0; y < 4; y++ ) {
    for ( int x = 0; x < 4; x++ ) {
      vec2 uv = base + ( vec2( float( x ), float( y ) ) + 0.5 ) * 0.25 * uCell;
      vec3 c = max( texture( tSource, uv ).rgb, vec3( 0.0 ) );
      // Clamp before the log so a single specular pinprick cannot drag the
      // whole meter, and a pure black texel cannot drive it to negative
      // infinity.
      float l = clamp( luma( c ), 0.0005, 64.0 );
      acc += clamp( log2( l ), -11.0, 6.0 );
    }
  }
  acc /= 16.0;
  fragColor = vec4( ( acc + 11.0 ) / 17.0, 0.0, 0.0, 1.0 );
}
`,Hx=`
${gn}

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D tGrid;
uniform sampler2D tDepth;
uniform sampler2D tPrev;
uniform vec2 uTexel;         // full resolution texel size, for the depth cluster
uniform float uNear;
uniform float uFar;
uniform float uDt;
uniform float uReset;
uniform float uAttack;
uniform float uRelease;
uniform float uFocusRate;
uniform float uManualFocus;  // > 0 overrides the metered distance
uniform float uExposureBase;
uniform float uExposureComp;
uniform float uAutoExposure;
uniform float uMinExposure;
uniform float uMaxExposure;

// The single source of truth for scene exposure. Both the bloom prefilter and
// the grade read this, so the bloom threshold is measured against the same
// exposed image the viewer sees rather than against raw scene radiance.
float exposureFor( float ev ) {
  float metered = clamp( 0.18 / exp2( ev ), uMinExposure, uMaxExposure );
  return uExposureBase * exp2( uExposureComp ) * pow( metered, uAutoExposure );
}

void main() {
  // Centre weighted average of the log luminance grid.
  float sum = 0.0;
  float wsum = 0.0;
  for ( int y = 0; y < GRID; y++ ) {
    for ( int x = 0; x < GRID; x++ ) {
      vec2 g = ( vec2( float( x ), float( y ) ) + 0.5 ) / float( GRID );
      float d = length( ( g - 0.5 ) * vec2( 1.0, 1.15 ) );
      float w = exp( -d * d * 5.0 ) + 0.25;
      float v = texture( tGrid, g ).r * 17.0 - 11.0;
      sum += v * w;
      wsum += w;
    }
  }
  float curEv = sum / max( wsum, 1e-5 );

  // Focus: nine tap cluster at the frame centre, biased toward the nearest
  // surface because the subject is what stands in front, not behind.
  float dsum = 0.0;
  float dmin = 1e9;
  for ( int y = -1; y <= 1; y++ ) {
    for ( int x = -1; x <= 1; x++ ) {
      vec2 uv = vec2( 0.5, 0.5 ) + vec2( float( x ), float( y ) ) * uTexel * 24.0;
      float z = linearDepth( texture( tDepth, uv ).x, uNear, uFar );
      dsum += z;
      dmin = min( dmin, z );
    }
  }
  float curFocus = mix( dsum / 9.0, dmin, 0.65 );
  if ( uManualFocus > 0.0 ) curFocus = uManualFocus;
  curFocus = clamp( curFocus, uNear * 4.0, uFar * 0.5 );

  vec4 prev = texture( tPrev, vec2( 0.5 ) );
  float prevEv = prev.r;
  float prevFocus = prev.g;

  float ev = curEv;
  float focus = curFocus;

  if ( uReset < 0.5 ) {
    // Exponential convergence, frame rate independent. Attack and release are
    // asymmetric because adaptation to light is not symmetric.
    float rate = curEv > prevEv ? uAttack : uRelease;
    ev = mix( prevEv, curEv, 1.0 - exp( -uDt * rate ) );
    focus = mix( prevFocus, curFocus, 1.0 - exp( -uDt * uFocusRate ) );
  }

  fragColor = vec4( ev, focus, exposureFor( ev ), 1.0 );
}
`;class Vx{reduce;resolve;grid;state;write=0;reset=!0;manualFocus=-1;constructor(e){this.reduce=new mn(zx,{tSource:{value:null},uCell:{value:new ye(1/Ni,1/Ni)}},{GRID:Ni}),this.resolve=new mn(Hx,{tGrid:{value:null},tDepth:{value:null},tPrev:{value:null},uTexel:{value:new ye(1/1600,1/1e3)},uNear:{value:.05},uFar:{value:200},uDt:{value:1/60},uReset:{value:1},uAttack:{value:e.attack},uRelease:{value:e.release},uFocusRate:{value:e.focusRate},uManualFocus:{value:-1},uExposureBase:{value:1},uExposureComp:{value:0},uAutoExposure:{value:.6},uMinExposure:{value:.5},uMaxExposure:{value:9}},{GRID:Ni}),this.grid=$t(Ni,Ni,{type:bt,filter:gt}),this.state=[$t(1,1,{type:sn,filter:gt}),$t(1,1,{type:sn,filter:gt})]}get texture(){return this.state[1-this.write].texture}setExposure(e){this.resolve.set("uExposureBase",e.base),this.resolve.set("uExposureComp",e.comp),this.resolve.set("uAutoExposure",e.auto),this.resolve.set("uMinExposure",e.min),this.resolve.set("uMaxExposure",e.max)}setSize(e,t){this.resolve.uniforms.uTexel.value.set(1/e,1/t)}setCamera(e,t){this.resolve.set("uNear",e),this.resolve.set("uFar",t)}setManualFocus(e){this.manualFocus=e,this.resolve.set("uManualFocus",e)}get manualFocusDistance(){return this.manualFocus}configure(e){this.resolve.set("uAttack",e.attack),this.resolve.set("uRelease",e.release),this.resolve.set("uFocusRate",e.focusRate)}resetState(){this.reset=!0}render(e,t,n,r,a){this.reduce.set("tSource",n),t.render(e,this.reduce,this.grid);const s=this.state[this.write],o=this.state[1-this.write];this.resolve.set("tGrid",this.grid.texture),this.resolve.set("tDepth",r),this.resolve.set("tPrev",o.texture),this.resolve.set("uDt",Math.min(a,.1)),this.resolve.set("uReset",this.reset?1:0),t.render(e,this.resolve,s),this.write=1-this.write,this.reset=!1}dispose(){this.reduce.dispose(),this.resolve.dispose(),Tt(this.grid),Tt(this.state[0]),Tt(this.state[1])}}const _u={slope:[1.015,1,.985],offset:[-.006,-.004,.006],power:[1,1.005,1.035],contrast:1.12,saturation:1.08,highlightDesat:.28,shadowTint:[.87,.95,1.14],highlightTint:[1.07,1.005,.9],blackLift:.006,crosstalk:.045};function ws(i){return i<=.04045?i/12.92:Math.pow((i+.055)/1.055,2.4)}function Gx(i){return i<=0?0:i<=.0031308?i*12.92:1.055*Math.pow(i,1/2.4)-.055}const Oi=[.2126,.7152,.0722],ll=Math.log2(.18);function Wx(i=_u,e=33){const t=e,n=new Uint8Array(t*t*t*4),r=1/(t-1),a=[0,0,0];let s=0;for(let c=0;c<t;c++)for(let l=0;l<t;l++)for(let u=0;u<t;u++){a[0]=ws(u*r),a[1]=ws(l*r),a[2]=ws(c*r);for(let m=0;m<3;m++){const f=Math.max(0,a[m]*i.slope[m]+i.offset[m]);a[m]=Math.pow(f,i.power[m])}for(let m=0;m<3;m++){const f=Math.log2(Math.max(a[m],1e-5));a[m]=Math.pow(2,ll+(f-ll)*i.contrast)}let h=a[0]*Oi[0]+a[1]*Oi[1]+a[2]*Oi[2];const d=Math.min(1,Math.max(0,Math.pow(Math.min(1,h),1/2.2))),p=d*d*(3-2*d);for(let m=0;m<3;m++)a[m]*=i.shadowTint[m]*(1-p)+i.highlightTint[m]*p;h=a[0]*Oi[0]+a[1]*Oi[1]+a[2]*Oi[2];const x=i.highlightDesat*p,g=i.saturation*(1-x)+x*.55;for(let m=0;m<3;m++)a[m]=h+(a[m]-h)*g;if(i.crosstalk>0){const m=i.crosstalk,f=a[0],M=a[1],y=a[2];a[0]=f*(1-m)+(M+y)*m*.5,a[1]=M*(1-m)+(f+y)*m*.5,a[2]=y*(1-m)+(f+M)*m*.5}for(let m=0;m<3;m++){const f=Gx(Math.max(0,a[m]))*(1-i.blackLift)+i.blackLift;n[s+m]=Math.round(Math.min(1,Math.max(0,f))*255)}n[s+3]=255,s+=4}const o=new zo(n,t,t,t);return o.format=Vt,o.type=bt,o.minFilter=xt,o.magFilter=xt,o.wrapS=It,o.wrapT=It,o.wrapR=It,o.colorSpace=Ht,o.unpackAlignment=1,o.needsUpdate=!0,o}function Xx(i){return{scale:(i-1)/i,offset:1/(2*i)}}const qx=`
${gn}

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D tColor;
uniform sampler2D tBloom;
uniform sampler2D tMeter;
uniform sampler3D tLut;

uniform float uExposureScale;    // surge modulation on top of the metered value
uniform float uBloomStrength;
uniform float uCA;
uniform float uDistortion;
uniform float uVignette;
uniform float uGrain;
uniform float uGrainScale;
uniform float uGrainSeed;
uniform float uAspect;
uniform float uLutMix;
uniform vec2 uLutScaleOffset;
uniform vec3 uLookSlope;
uniform vec3 uLookOffset;
uniform vec3 uLookPower;
uniform float uLookSaturation;
uniform float uSurge;
uniform float uDither;

const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
  vec3( 0.6274, 0.0691, 0.0164 ),
  vec3( 0.3293, 0.9195, 0.0880 ),
  vec3( 0.0433, 0.0113, 0.8956 )
);

const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
  vec3( 1.6605, -0.1246, -0.0182 ),
  vec3( -0.5876, 1.1329, -0.1006 ),
  vec3( -0.0728, -0.0083, 1.1187 )
);

const mat3 AGX_INSET = mat3(
  vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
  vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
  vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
);

const mat3 AGX_OUTSET = mat3(
  vec3( 1.1271005818144368, -0.1413297634984383, -0.14132976349843826 ),
  vec3( -0.11060664309660323, 1.157823702216272, -0.11060664309660294 ),
  vec3( -0.016493938717834573, -0.016493938717834257, 1.2519364065950405 )
);

const float AGX_MIN_EV = -12.47393;
const float AGX_MAX_EV = 4.026069;

// Six order polynomial fit of the AgX sigmoid, mean squared error 3.7e-6.
vec3 agxContrast( vec3 x ) {
  vec3 x2 = x * x;
  vec3 x4 = x2 * x2;
  return 15.5 * x4 * x2
    - 40.14 * x4 * x
    + 31.96 * x4
    - 6.868 * x2 * x
    + 0.4298 * x2
    + 0.1191 * x
    - 0.00232;
}

// ASC CDL in the AgX base space, which is where Blender puts the look. Applied
// after the sigmoid and before the outset rotation so the saturation added back
// is measured against the already compressed image.
vec3 agxLook( vec3 v ) {
  float l = luma( v );
  v = pow( max( v * uLookSlope + uLookOffset, vec3( 0.0 ) ), uLookPower );
  return l + uLookSaturation * ( v - l );
}

vec3 agx( vec3 color ) {
  color = LINEAR_SRGB_TO_LINEAR_REC2020 * max( color, vec3( 0.0 ) );
  color = AGX_INSET * color;
  color = max( color, vec3( 1e-10 ) );
  color = log2( color );
  color = ( color - AGX_MIN_EV ) / ( AGX_MAX_EV - AGX_MIN_EV );
  color = clamp( color, 0.0, 1.0 );
  color = agxContrast( color );
  color = agxLook( color );
  color = AGX_OUTSET * color;
  color = pow( max( color, vec3( 0.0 ) ), vec3( 2.2 ) );
  color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
  return clamp( color, 0.0, 1.0 );
}

vec3 linearToSrgb( vec3 c ) {
  c = clamp( c, 0.0, 1.0 );
  vec3 lo = c * 12.92;
  vec3 hi = 1.055 * pow( c, vec3( 1.0 / 2.4 ) ) - 0.055;
  return mix( hi, lo, step( c, vec3( 0.0031308 ) ) );
}

void main() {
  vec2 d = vUv - 0.5;
  float r2 = dot( d, d );

  // Barrel distortion, kept very low. Above about two percent it reads as a
  // fisheye gag rather than as glass.
  vec2 dd = d * ( 1.0 + uDistortion * r2 + uDistortion * uDistortion * 6.0 * r2 * r2 );

  // Lateral chromatic aberration grows with field radius, which is the whole
  // point: a real lens is corrected on axis and fails at the edge.
  float ca = uCA * ( 0.15 + r2 * 4.0 );

  vec2 uvR = 0.5 + dd * ( 1.0 + ca );
  vec2 uvG = 0.5 + dd;
  vec2 uvB = 0.5 + dd * ( 1.0 - ca );

  vec3 color = vec3(
    texture( tColor, uvR ).r,
    texture( tColor, uvG ).g,
    texture( tColor, uvB ).b
  );

  vec3 bloom = vec3(
    texture( tBloom, uvR ).r,
    texture( tBloom, uvG ).g,
    texture( tBloom, uvB ).b
  );

  // Exposure is resolved once, by the meter, and shared. The bloom chain has
  // already been scaled by the same value, so it is added after exposure, not
  // before, and the threshold it was built against still means what it says.
  float exposure = texture( tMeter, vec2( 0.5 ) ).b * uExposureScale;
  color = max( color, vec3( 0.0 ) ) * exposure + max( bloom, vec3( 0.0 ) ) * uBloomStrength;

  // Optical falloff. One over one plus k r squared, squared, is a cheap stand
  // in for the cos to the fourth law and has the same shape.
  float vr = length( d * vec2( uAspect, 1.0 ) );
  float f = 1.0 / ( 1.0 + uVignette * vr * vr );
  color *= f * f;

  color = agx( color );

  vec3 disp = linearToSrgb( color );

  // Show LUT, sampled at texel centres of the 33 cube.
  vec3 lutUv = disp * uLutScaleOffset.x + uLutScaleOffset.y;
  vec3 graded = texture( tLut, lutUv ).rgb;
  disp = mix( disp, graded, uLutMix );

  // Film grain: fixed cell count in a frame normalised space, so the grain is
  // the same physical size at every resolution and device pixel ratio. Two
  // hashes summed give a triangular distribution, which is what real grain
  // clumping looks like and what a single uniform hash never does.
  vec2 gcell = floor( vUv * vec2( uAspect, 1.0 ) * uGrainScale );
  float n1 = hash13( vec3( gcell, uGrainSeed ) );
  float n2 = hash13( vec3( gcell + 37.7, uGrainSeed + 11.3 ) );
  float g = n1 + n2 - 1.0;
  float l = luma( disp );
  // Silver halide density peaks in the midtones. Clean blacks, clean specular.
  float grainAmt = uGrain * ( 0.25 + 1.5 * ( 1.0 - abs( l * 2.0 - 1.0 ) ) );
  disp += g * grainAmt * ( 1.0 + uSurge * 0.8 );

  // Triangular dither at one code value. A near black scene banding across an
  // eight bit framebuffer is the most obvious tell of an amateur chain.
  float d1 = hash13( vec3( gl_FragCoord.xy, uGrainSeed * 0.61 ) );
  float d2 = hash13( vec3( gl_FragCoord.yx + 13.1, uGrainSeed * 0.61 + 7.7 ) );
  disp += ( d1 + d2 - 1.0 ) * uDither;

  fragColor = vec4( clamp( disp, 0.0, 1.0 ), 1.0 );
}
`,bu={exposure:1,exposureComp:.35,autoExposure:.62,minExposure:.5,maxExposure:9,bloomStrength:.055,chromaticAberration:.0016,distortion:.012,vignette:.62,grain:.022,grainScale:760,lutMix:1,lookSlope:[1.02,1,1.01],lookOffset:[0,0,0],lookPower:[1.16,1.16,1.16],lookSaturation:1.24};class Yx{pass;lut;options;constructor(e=bu){this.options={...e};const t=33;this.lut=Wx(_u,t);const n=Xx(t);this.pass=new mn(qx,{tColor:{value:null},tBloom:{value:null},tMeter:{value:null},tLut:{value:this.lut},uExposureScale:{value:1},uBloomStrength:{value:e.bloomStrength},uCA:{value:e.chromaticAberration},uDistortion:{value:e.distortion},uVignette:{value:e.vignette},uGrain:{value:e.grain},uGrainScale:{value:e.grainScale},uGrainSeed:{value:0},uAspect:{value:1.6},uLutMix:{value:e.lutMix},uLutScaleOffset:{value:new ye(n.scale,n.offset)},uLookSlope:{value:new C(...e.lookSlope)},uLookOffset:{value:new C(...e.lookOffset)},uLookPower:{value:new C(...e.lookPower)},uLookSaturation:{value:e.lookSaturation},uSurge:{value:0},uDither:{value:1/255}})}configure(e){this.options={...this.options,...e};const t=this.options;this.pass.set("uBloomStrength",t.bloomStrength),this.pass.set("uCA",t.chromaticAberration),this.pass.set("uDistortion",t.distortion),this.pass.set("uVignette",t.vignette),this.pass.set("uGrain",t.grain),this.pass.set("uGrainScale",t.grainScale),this.pass.set("uLutMix",t.lutMix),this.pass.uniforms.uLookSlope.value.set(...t.lookSlope),this.pass.uniforms.uLookOffset.value.set(...t.lookOffset),this.pass.uniforms.uLookPower.value.set(...t.lookPower),this.pass.set("uLookSaturation",t.lookSaturation)}get base(){return this.options}setAspect(e){this.pass.set("uAspect",e)}dispose(){this.pass.dispose(),this.lut.dispose()}}const jx=`
${gn}

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D tDiffuse;
uniform vec2 uTexel;

#define EDGE_THRESHOLD_MIN 0.0312
#define EDGE_THRESHOLD_MAX 0.125
#define SUBPIXEL_QUALITY 0.75
#define ITERATIONS 12

float lumaOf( vec3 c ) { return sqrt( dot( c, vec3( 0.299, 0.587, 0.114 ) ) ); }

float quality( int i ) {
  if ( i < 5 ) return 1.0;
  if ( i == 5 ) return 1.5;
  if ( i < 10 ) return 2.0;
  if ( i == 10 ) return 4.0;
  return 8.0;
}

void main() {
  vec3 rgbM = texture( tDiffuse, vUv ).rgb;
  float lM = lumaOf( rgbM );
  float lN = lumaOf( texture( tDiffuse, vUv + vec2( 0.0, uTexel.y ) ).rgb );
  float lS = lumaOf( texture( tDiffuse, vUv - vec2( 0.0, uTexel.y ) ).rgb );
  float lE = lumaOf( texture( tDiffuse, vUv + vec2( uTexel.x, 0.0 ) ).rgb );
  float lW = lumaOf( texture( tDiffuse, vUv - vec2( uTexel.x, 0.0 ) ).rgb );

  float lMin = min( lM, min( min( lN, lS ), min( lE, lW ) ) );
  float lMax = max( lM, max( max( lN, lS ), max( lE, lW ) ) );
  float range = lMax - lMin;

  if ( range < max( EDGE_THRESHOLD_MIN, lMax * EDGE_THRESHOLD_MAX ) ) {
    fragColor = vec4( rgbM, 1.0 );
    return;
  }

  float lNW = lumaOf( texture( tDiffuse, vUv + vec2( -uTexel.x, uTexel.y ) ).rgb );
  float lNE = lumaOf( texture( tDiffuse, vUv + vec2( uTexel.x, uTexel.y ) ).rgb );
  float lSW = lumaOf( texture( tDiffuse, vUv + vec2( -uTexel.x, -uTexel.y ) ).rgb );
  float lSE = lumaOf( texture( tDiffuse, vUv + vec2( uTexel.x, -uTexel.y ) ).rgb );

  float lNS = lN + lS;
  float lWE = lW + lE;
  float lNWSW = lNW + lSW;
  float lNESE = lNE + lSE;
  float lNWNE = lNW + lNE;
  float lSWSE = lSW + lSE;

  float edgeH = abs( -2.0 * lW + lNWSW ) + abs( -2.0 * lM + lNS ) * 2.0 + abs( -2.0 * lE + lNESE );
  float edgeV = abs( -2.0 * lN + lNWNE ) + abs( -2.0 * lM + lWE ) * 2.0 + abs( -2.0 * lS + lSWSE );
  bool isHorizontal = edgeH >= edgeV;

  float l1 = isHorizontal ? lS : lW;
  float l2 = isHorizontal ? lN : lE;
  float g1 = abs( l1 - lM );
  float g2 = abs( l2 - lM );
  bool is1Steepest = g1 >= g2;
  float gradientScaled = 0.25 * max( g1, g2 );

  float stepLength = isHorizontal ? uTexel.y : uTexel.x;
  float lLocalAvg = 0.0;
  if ( is1Steepest ) {
    stepLength = -stepLength;
    lLocalAvg = 0.5 * ( l1 + lM );
  } else {
    lLocalAvg = 0.5 * ( l2 + lM );
  }

  vec2 currentUv = vUv;
  if ( isHorizontal ) currentUv.y += stepLength * 0.5;
  else currentUv.x += stepLength * 0.5;

  vec2 offset = isHorizontal ? vec2( uTexel.x, 0.0 ) : vec2( 0.0, uTexel.y );
  vec2 uv1 = currentUv - offset;
  vec2 uv2 = currentUv + offset;

  float lEnd1 = lumaOf( texture( tDiffuse, uv1 ).rgb ) - lLocalAvg;
  float lEnd2 = lumaOf( texture( tDiffuse, uv2 ).rgb ) - lLocalAvg;
  bool reached1 = abs( lEnd1 ) >= gradientScaled;
  bool reached2 = abs( lEnd2 ) >= gradientScaled;

  if ( !reached1 ) uv1 -= offset;
  if ( !reached2 ) uv2 += offset;

  if ( !reached1 || !reached2 ) {
    for ( int i = 2; i < ITERATIONS; i++ ) {
      if ( !reached1 ) lEnd1 = lumaOf( texture( tDiffuse, uv1 ).rgb ) - lLocalAvg;
      if ( !reached2 ) lEnd2 = lumaOf( texture( tDiffuse, uv2 ).rgb ) - lLocalAvg;
      reached1 = reached1 || abs( lEnd1 ) >= gradientScaled;
      reached2 = reached2 || abs( lEnd2 ) >= gradientScaled;
      if ( reached1 && reached2 ) break;
      if ( !reached1 ) uv1 -= offset * quality( i );
      if ( !reached2 ) uv2 += offset * quality( i );
    }
  }

  float dist1 = isHorizontal ? ( vUv.x - uv1.x ) : ( vUv.y - uv1.y );
  float dist2 = isHorizontal ? ( uv2.x - vUv.x ) : ( uv2.y - vUv.y );
  bool isDirection1 = dist1 < dist2;
  float distFinal = min( dist1, dist2 );
  float edgeThickness = dist1 + dist2;
  float pixelOffset = -distFinal / max( edgeThickness, 1e-5 ) + 0.5;

  bool isLumaCenterSmaller = lM < lLocalAvg;
  bool correctVariation =
    ( ( isDirection1 ? lEnd1 : lEnd2 ) < 0.0 ) != isLumaCenterSmaller;
  float finalOffset = correctVariation ? pixelOffset : 0.0;

  // Subpixel aliasing: a lone bright texel has no directional edge, so blend
  // toward the neighbourhood average instead.
  float lAvg = ( 1.0 / 12.0 ) * ( 2.0 * ( lNS + lWE ) + lNWSW + lNESE );
  float subShift = sat1( abs( lAvg - lM ) / max( range, 1e-5 ) );
  float subShift2 = ( -2.0 * subShift + 3.0 ) * subShift * subShift;
  float subPixelOffset = subShift2 * subShift2 * SUBPIXEL_QUALITY;
  finalOffset = max( finalOffset, subPixelOffset );

  vec2 finalUv = vUv;
  if ( isHorizontal ) finalUv.y += finalOffset * stepLength;
  else finalUv.x += finalOffset * stepLength;

  fragColor = vec4( texture( tDiffuse, finalUv ).rgb, 1.0 );
}
`;class Kx{pass;constructor(){this.pass=new mn(jx,{tDiffuse:{value:null},uTexel:{value:new ye(1/1600,1/1e3)}})}setSize(e,t){this.pass.uniforms.uTexel.value.set(1/e,1/t)}dispose(){this.pass.dispose()}}function ul(i){const e=i.tier==="ultra"||i.tier==="high";return{taa:{samples:i.taaSamples,feedback:i.taaSamples>=16?.955:i.taaSamples>=8?.94:.9,clampScale:i.taaSamples>=8?1.15:1.35,sharpen:e?.22:.12,dilateDepth:i.tier!=="low"},bloom:{mips:i.bloomMips,threshold:1.05,knee:.7,radius:e?1:.8,clamp:40},dof:{sensorHeight:24,fStop:2.2,bokehScale:1.45,maxRadius:20,taps:i.tier==="ultra"?32:22,aperture:.7},dofEnabled:i.dof,dofRadiusFraction:.021,grain:e?.022:.016,bloomStrength:.055}}class $x{sustain=0;impulse=0;fast=0;slow=0;setSustain(e){this.sustain=Math.min(1,Math.max(0,e))}pulse(e){this.impulse=Math.max(this.impulse,Math.min(1,Math.max(0,e)))}update(e){const t=Math.min(e,.1);this.impulse*=Math.exp(-t*2.4),this.impulse<1e-4&&(this.impulse=0);const n=Math.max(this.sustain,this.impulse),r=n>this.fast?1-Math.exp(-t*34):1-Math.exp(-t*4.5);this.fast+=(n-this.fast)*r,this.slow+=(this.fast-this.slow)*(1-Math.exp(-t*1.35))}reset(){this.sustain=0,this.impulse=0,this.fast=0,this.slow=0}}function Zx(i){const{renderer:e,scene:t,camera:n,quality:r,bus:a}=i;let s=ul(r);const o=new Cx,c=new Dx(s.taa),l=new Fx(s.bloom),u=new Bx(s.dof),h=new Vx({attack:2.6,release:.9,focusRate:3.4}),d=new Yx({...bu,grain:s.grain}),p=new Kx,x=new $x,g=wx(e);let m=$t(1,1,{type:g,depthBuffer:!0,depthTexture:!0}),f=null,M=0,y=0,w=0,A=.75;const b=new ye;function R(){const H=d.base;h.setExposure({base:H.exposure,comp:H.exposureComp,auto:H.autoExposure,min:H.minExposure,max:H.maxExposure})}function F(H,G){const $=Math.max(1,Math.round(H)),V=Math.max(1,Math.round(G));$===M&&V===y||(M=$,y=V,Tt(m),m=$t($,V,{type:g,depthBuffer:!0,depthTexture:!0}),c.setSize($,V),l.setSize($,V),h.setSize($,V),s.dofEnabled&&u.setSize($,V),Tt(f),f=null,c.enabled||(f=$t($,V,{type:bt}),p.setSize($,V)),d.setAspect($/V),u.configure({...s.dof,maxRadius:Math.max(4,V*s.dofRadiusFraction)}))}function S(){s=ul(r),c.configure(s.taa),l.configure(s.bloom),d.configure({grain:s.grain,bloomStrength:s.bloomStrength}),u.configure({...s.dof,maxRadius:Math.max(4,y*s.dofRadiusFraction)}),c.enabled?(Tt(f),f=null):!f&&M>1&&(f=$t(M,y,{type:bt}),p.setSize(M,y)),s.dofEnabled?M>0&&u.setSize(M,y):u.release(),R(),h.resetState(),c.resetHistory()}const v=[.16,.24,.42,.66,1],P=a.on("reveal:impact",({position:H})=>{x.pulse(v[Math.min(4,Math.max(0,H.card.rarity))])}),O=a.on("reveal:start",({position:H})=>{x.pulse(v[Math.min(4,Math.max(0,H.card.rarity))]*.35)});function L(){e.getDrawingBufferSize(b),F(b.x,b.y)}R(),L();const q={render(H){e.getDrawingBufferSize(b),(b.x!==M||b.y!==y)&&F(b.x,b.y),x.update(H.dt);const G=x.fast,$=x.slow;w=0,h.setCamera(n.near,n.far),u.setCamera(n),u.setFocusRange(A),u.setFStop(s.dof.fStop/(1+G*.55)),c.checkCameraCut(n,H.dt);const V=c.applyJitter(n);e.setRenderTarget(m),e.render(t,n),V(),w++;const ee=m.depthTexture;let te=m.texture;c.enabled?(te=c.render(e,o,te,ee),w++):c.step(),h.render(e,o,te,ee,H.dt),w+=2,s.dofEnabled&&(te=u.render(e,o,te,ee,h.texture),w+=3);const me=d.base,ue=1+G*.72-$*.3;l.setThreshold(s.bloom.threshold*(1-G*.55),s.bloom.knee),l.setExposure(h.texture,ue),l.render(e,o,te),w+=Math.max(1,s.bloom.mips*2-1),d.pass.set("uExposureScale",ue),d.pass.set("uBloomStrength",me.bloomStrength*(1+G*3.4)),d.pass.set("uCA",me.chromaticAberration*(1+G*3.2)),d.pass.set("uVignette",me.vignette*(1+G*.35)),d.pass.set("uSurge",G),d.pass.set("tColor",te),d.pass.set("tBloom",l.texture),d.pass.set("tMeter",h.texture),d.pass.set("uGrainSeed",H.frame%1024+1),c.enabled||!f?(o.render(e,d.pass,null),w++):(o.render(e,d.pass,f),p.pass.set("tDiffuse",f.texture),o.render(e,p.pass,null),w+=2),e.setRenderTarget(null)},resize(H,G){L()},setFocus(H,G){h.setManualFocus(H),G!==void 0&&(A=Math.max(0,G))},clearFocus(){h.setManualFocus(-1)},setSurge(H){x.setSustain(H)},surgePulse(H){x.pulse(H)},resetHistory(){c.resetHistory(),h.resetState()},applyQuality(){S(),L()},stats(){const H=M*y;let G=H*8+H*4;c.enabled&&(G+=H*8*2);let $=H/4;for(let V=0;V<s.bloom.mips;V++)G+=$*8*2,$/=4;return s.dofEnabled&&(G+=H/4*8*3+H*8),f&&(G+=H*4),{passes:w,drawCalls:e.info.render.calls,triangles:e.info.render.triangles,textures:e.info.memory.textures,programs:e.info.programs?.length??0,targetBytes:Math.round(G),bufferWidth:M,bufferHeight:y,taa:c.enabled,dof:s.dofEnabled,bloomMips:s.bloom.mips}},dispose(){P(),O(),Tt(m),Tt(f),f=null,c.dispose(),l.dispose(),u.dispose(),h.dispose(),d.dispose(),p.dispose(),o.dispose(),x.reset()}};return window.__pipeline=q,q}const Ze={wallRadius:6.4,wallHeight:4.3,skirtHeight:.3,ceilingY:4.8,floorRadius:7.4,panels:24,pilasters:8,daisRadius:2.3,daisHeight:.3,plinthRadius:1.1,plinthTopY:1.02,cardY:1.35,apertureRadius:1.35,portalZ:-6.28,portalY:1.95},Jx=new C(2.6,4.6,2).normalize();new C(-4.4,1.9,1.1).normalize();new C(-1.5,2.4,-3.6).normalize();const Ts=new Ee(1,.895,.775);new Ee(.34,.52,.95);new Ee(.58,.79,1);const Qx=new Ee(1,.6,.26),eg=new C(0,Ze.cardY,0),Er=new C;function an(i,e,t,n,r,a){const s=2*Math.PI*r/4,o=Math.max(a-2*r,0),c=Math.PI/4;Er.copy(e),Er[n]=0,Er.normalize();const l=.5*s/(s+o),u=1-Er.angleTo(i)/c;return Math.sign(Er[t])===1?u*l:o/(s+o)+l+l*(1-u)}class Yo extends hn{constructor(e=1,t=1,n=1,r=2,a=.1){const s=r*2+1;if(a=Math.min(e/2,t/2,n/2,a),super(1,1,1,s,s,s),this.type="RoundedBoxGeometry",this.parameters={width:e,height:t,depth:n,segments:r,radius:a},s===1)return;const o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;const c=new C,l=new C,u=new C(e,t,n).divideScalar(2).subScalar(a),h=this.attributes.position.array,d=this.attributes.normal.array,p=this.attributes.uv.array,x=h.length/6,g=new C,m=.5/s;for(let f=0,M=0;f<h.length;f+=3,M+=2)switch(c.fromArray(h,f),l.copy(c),l.x-=Math.sign(l.x)*m,l.y-=Math.sign(l.y)*m,l.z-=Math.sign(l.z)*m,l.normalize(),h[f+0]=u.x*Math.sign(c.x)+l.x*a,h[f+1]=u.y*Math.sign(c.y)+l.y*a,h[f+2]=u.z*Math.sign(c.z)+l.z*a,d[f+0]=l.x,d[f+1]=l.y,d[f+2]=l.z,Math.floor(f/x)){case 0:g.set(1,0,0),p[M+0]=an(g,l,"z","y",a,n),p[M+1]=1-an(g,l,"y","z",a,t);break;case 1:g.set(-1,0,0),p[M+0]=1-an(g,l,"z","y",a,n),p[M+1]=1-an(g,l,"y","z",a,t);break;case 2:g.set(0,1,0),p[M+0]=1-an(g,l,"x","z",a,e),p[M+1]=an(g,l,"z","x",a,n);break;case 3:g.set(0,-1,0),p[M+0]=1-an(g,l,"x","z",a,e),p[M+1]=1-an(g,l,"z","x",a,n);break;case 4:g.set(0,0,1),p[M+0]=1-an(g,l,"x","y",a,e),p[M+1]=1-an(g,l,"y","x",a,t);break;case 5:g.set(0,0,-1),p[M+0]=an(g,l,"x","y",a,e),p[M+1]=1-an(g,l,"y","x",a,t);break}}static fromJSON(e){return new Yo(e.width,e.height,e.depth,e.segments,e.radius)}}function tg(i,e=!1){const t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),r=new Set(Object.keys(i[0].morphAttributes)),a={},s={},o=i[0].morphTargetsRelative,c=new Nt;let l=0;for(let u=0;u<i.length;++u){const h=i[u];let d=0;if(t!==(h.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const p in h.attributes){if(!n.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;a[p]===void 0&&(a[p]=[]),a[p].push(h.attributes[p]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(o!==h.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const p in h.morphAttributes){if(!r.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;s[p]===void 0&&(s[p]=[]),s[p].push(h.morphAttributes[p])}if(e){let p;if(t)p=h.index.count;else if(h.attributes.position!==void 0)p=h.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,p,u),l+=p}}if(t){let u=0;const h=[];for(let d=0;d<i.length;++d){const p=i[d].index;for(let x=0;x<p.count;++x)h.push(p.getX(x)+u);u+=i[d].attributes.position.count}c.setIndex(h)}for(const u in a){const h=fl(a[u]);if(!h)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;c.setAttribute(u,h)}for(const u in s){const h=s[u][0].length;if(h===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[u]=[];for(let d=0;d<h;++d){const p=[];for(let g=0;g<s[u].length;++g)p.push(s[u][g][d]);const x=fl(p);if(!x)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;c.morphAttributes[u].push(x)}}return c}function fl(i){let e,t,n,r=-1,a=0;for(let l=0;l<i.length;++l){const u=i[l];if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=u.normalized),n!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(r===-1&&(r=u.gpuType),r!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;a+=u.count*t}const s=new e(a),o=new Ft(s,t,n);let c=0;for(let l=0;l<i.length;++l){const u=i[l];if(u.isInterleavedBufferAttribute){const h=c/t;for(let d=0,p=u.count;d<p;d++)for(let x=0;x<t;x++){const g=u.getComponent(d,x);o.setComponent(d+h,x,g)}}else s.set(u.array,c);c+=u.count*t}return r!==void 0&&(o.gpuType=r),o}function ci(i,e){const t=i.map(([n,r])=>new ye(n,r));return new Wo(t,e)}function As(i,e,t,n,r=3){return new Yo(i,e,t,r,n)}function hl(i){const e=tg(i,!1);for(const t of i)t.dispose();if(!e)throw new Error("geometry merge failed");return e}function ki(i,e,t){const n=new _h(i,e,t.length),r=new Float32Array(t.length*2);for(let a=0;a<t.length;a++)n.setMatrixAt(a,t[a].matrix),r[a*2]=t[a].uvOffset.x,r[a*2+1]=t[a].uvOffset.y;return n.instanceMatrix.needsUpdate=!0,i.setAttribute("aUvOffset",new Eo(r,2)),n}function ga(i,e,t,n,r=0){const a=[];for(let s=0;s<i;s++){const o=r+s/i*Math.PI*2,c=new je;c.makeRotationY(o),c.setPosition(Math.sin(o)*e,t,Math.cos(o)*e),a.push({matrix:c,uvOffset:new ye(n()*4,n()*4)})}return a}function wr(i,e,t=128){const n=new zr(i,e,t,1);return n.rotateX(-Math.PI/2),n}function ng(i,e=128){const t=new Ha(i,e);return t.rotateX(-Math.PI/2),t}function dl(i,e=96){const t=new Ha(i,e);return t.rotateX(Math.PI/2),t}function ig(i,e){const t=ci(i,e);return t.rotateX(Math.PI/2),t}function Mu(i,e,t){i.map=e.map,i.normalMap=e.normalMap,i.normalScale=new ye(t,t),i.roughnessMap=e.ormMap,i.metalnessMap=e.ormMap,i.aoMap=e.ormMap}function Rs(i,e={}){const t=new Ua({color:e.color??16777215,roughness:e.roughness??1,metalness:e.metalness??1,envMapIntensity:e.envMapIntensity??1,aoMapIntensity:e.aoMapIntensity??1,side:e.side??En,dithering:!0});return Mu(t,i,e.normalScale??1),t}function Cs(i,e={}){const t=new er({color:e.color??16777215,roughness:e.roughness??1,metalness:e.metalness??1,envMapIntensity:e.envMapIntensity??1.15,aoMapIntensity:e.aoMapIntensity??1,side:e.side??En,dithering:!0});return Mu(t,i,e.normalScale??1),t.anisotropy=e.anisotropy??.55,t.anisotropyRotation=e.anisotropyRotation??0,t}function Bi(i,e){const t=new Wr({color:i.clone(),toneMapped:!1,fog:!0});return e&&(t.map=e),t}function pl(i){i.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
attribute vec2 aUvOffset;`).replace("#include <uv_vertex>",`
        #include <uv_vertex>
        #ifdef USE_MAP
          vMapUv += aUvOffset;
        #endif
        #ifdef USE_NORMALMAP
          vNormalMapUv += aUvOffset;
        #endif
        #ifdef USE_ROUGHNESSMAP
          vRoughnessMapUv += aUvOffset;
        #endif
        #ifdef USE_METALNESSMAP
          vMetalnessMapUv += aUvOffset;
        #endif
        #ifdef USE_AOMAP
          vAoMapUv += aUvOffset;
        #endif
        `)},i.customProgramCacheKey=()=>"env-instance-uv-offset"}function rg(i,e,t,n){const r={uReflectMap:{value:e.texture},uReflectMatrix:{value:e.textureMatrix},uReflectStrength:{value:t},uReflectMaxLod:{value:e.maxLod},uReflectDistort:{value:.02},uReflectTint:{value:n.clone()}};return i.onBeforeCompile=a=>{Object.assign(a.uniforms,r),a.vertexShader=a.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vReflWorld;`).replace("#include <project_vertex>",`#include <project_vertex>
vReflWorld = ( modelMatrix * vec4( transformed, 1.0 ) ).xyz;`),a.fragmentShader=a.fragmentShader.replace("#include <common>",`
        #include <common>
        varying vec3 vReflWorld;
        uniform sampler2D uReflectMap;
        uniform mat4 uReflectMatrix;
        uniform float uReflectStrength;
        uniform float uReflectMaxLod;
        uniform float uReflectDistort;
        uniform vec3 uReflectTint;
        `).replace("#include <opaque_fragment>",`
        {
          vec4 reflClip = uReflectMatrix * vec4( vReflWorld, 1.0 );
          vec2 reflUv = reflClip.xy / max( 1e-4, reflClip.w );

          // Ripple the lookup with the surface's own microdetail so the
          // reflection breaks up exactly where the slab is not perfectly flat.
          #ifdef USE_NORMALMAP
            vec3 reflPerturb = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
            reflUv += reflPerturb.xy * uReflectDistort;
          #endif

          float reflDist = length( vReflWorld - cameraPosition );
          float reflLod = uReflectMaxLod * clamp(
            roughnessFactor * 1.9 + reflDist * 0.030, 0.0, 0.95 );

          vec3 reflColor = textureLod( uReflectMap, reflUv, reflLod ).rgb;

          vec3 reflViewDir = normalize( vViewPosition );
          float reflNdotV = clamp( dot( normal, reflViewDir ), 0.0, 1.0 );
          float reflFresnel = pow( 1.0 - reflNdotV, 4.0 );
          float reflAmount = uReflectStrength * mix( 0.10, 1.0, reflFresnel );
          reflAmount *= 1.0 - clamp( roughnessFactor * 1.15, 0.0, 0.92 );

          // Keep it inside the buffer; anything sampling off the edge would
          // smear the border pixel across the whole floor.
          vec2 reflEdge = smoothstep( vec2( 0.0 ), vec2( 0.04 ), reflUv ) *
                          smoothstep( vec2( 0.0 ), vec2( 0.04 ), 1.0 - reflUv );
          reflAmount *= reflEdge.x * reflEdge.y;

          outgoingLight += reflColor * reflAmount * uReflectTint;
        }
        #include <opaque_fragment>
        `)},i.customProgramCacheKey=()=>"env-floor-reflection",r}function Dt(i,e,t,n=0,r=0){const a=i.getAttribute("uv");if(!a)return i;for(let s=0;s<a.count;s++)a.setXY(s,a.getX(s)*e+n,a.getY(s)*t+r);return a.needsUpdate=!0,i}function pi(i,e,t){let n=Math.imul(i|0,668265261)^Math.imul(e|0,2654435761)^Math.imul(t|0,2246822507);return n=Math.imul(n^n>>>15,739982445),n=Math.imul(n^n>>>12,695872825),n^=n>>>15,(n>>>0)/4294967296}function ml(i){return i*i*i*(i*(i*6-15)+10)}function Ki(i,e){return(i%e+e)%e}function jo(i,e,t,n){const r=i*t,a=e*t,s=Math.floor(r),o=Math.floor(a),c=ml(r-s),l=ml(a-o),u=Ki(s,t),h=Ki(o,t),d=Ki(s+1,t),p=Ki(o+1,t),x=pi(u,h,n),g=pi(d,h,n),m=pi(u,p,n),f=pi(d,p,n),M=x+(g-x)*c,y=m+(f-m)*c;return M+(y-M)*l}function mi(i,e,t,n,r,a=.5){let s=0,o=1,c=0,l=t;for(let u=0;u<n;u++)s+=o*jo(i,e,l,r+u*7919),c+=o,o*=a,l*=2;return s/c}function xl(i,e,t,n){const r=i*t,a=e*t,s=Math.floor(r),o=Math.floor(a);let c=8;for(let l=-1;l<=1;l++)for(let u=-1;u<=1;u++){const h=s+u,d=o+l,p=Ki(h,t),x=Ki(d,t),g=h+pi(p,x,n),m=d+pi(p,x,n+4111),f=g-r,M=m-a,y=f*f+M*M;y<c&&(c=y)}return Math.min(1,Math.sqrt(c))}function ag(i,e){const t=i*i,n=new Uint8Array(t),r=new Float32Array(t),a=new Int32Array(t).fill(-1),s=5,o=1.9,c=s*2+1,l=new Float32Array(c*c);for(let f=-s,M=0;f<=s;f++)for(let y=-s;y<=s;y++,M++)l[M]=Math.exp(-(y*y+f*f)/(2*o*o));function u(f,M){const y=f%i,w=f/i|0;let A=0;for(let b=-s;b<=s;b++){const F=((w+b)%i+i)%i*i;for(let S=-s;S<=s;S++,A++){const v=((y+S)%i+i)%i;r[F+v]+=M*l[A]}}}function h(){let f=-1,M=-1/0;for(let y=0;y<t;y++)n[y]===1&&r[y]>M&&(M=r[y],f=y);return f}function d(){let f=-1,M=1/0;for(let y=0;y<t;y++)n[y]===0&&r[y]<M&&(M=r[y],f=y);return f}const p=Math.max(1,Math.round(t*.1));let x=0;for(;x<p;){const f=Math.min(t-1,Math.floor(e()*t));n[f]===0&&(n[f]=1,u(f,1),x++)}for(let f=0;f<t;f++){const M=h();n[M]=0,u(M,-1);const y=d();if(y===M){n[M]=1,u(M,1);break}n[y]=1,u(y,1)}const g=n.slice();for(let f=x-1;f>=0;f--){const M=h();n[M]=0,u(M,-1),a[M]=f}n.set(g),r.fill(0);for(let f=0;f<t;f++)n[f]===1&&u(f,1);for(let f=x;f<t;f++){const M=d();n[M]=1,u(M,1),a[M]=f}const m=new Uint8Array(t);for(let f=0;f<t;f++)m[f]=Math.min(255,Math.round(a[f]/(t-1)*255));return m}function xi(i){const e=i<=0?0:i>=1?1:i,t=e<=.0031308?e*12.92:1.055*Math.pow(e,1/2.4)-.055;return Math.round(t*255)}function jn(i){return i<0?0:i>1?1:i}function tr(i,e,t){const n=jn((t-i)/(e-i));return n*n*(3-2*n)}function Hr(i,e,t,n){const r=new Xr(i,e,e,Vt,bt);return r.colorSpace=t,r.wrapS=pn,r.wrapT=pn,r.minFilter=dn,r.magFilter=xt,r.generateMipmaps=!0,r.anisotropy=n,r.needsUpdate=!0,r}function $i(i,e,t,n){const r=(t%e+e)%e,a=(n%e+e)%e;return i[a*e+r]}function yu(i,e,t){const n=new Float32Array(e*e),r=new Float32Array(e*e),a=1/(t*2+1);for(let s=0;s<e;s++)for(let o=0;o<e;o++){let c=0;for(let l=-t;l<=t;l++)c+=$i(i,e,o+l,s);n[s*e+o]=c*a}for(let s=0;s<e;s++)for(let o=0;o<e;o++){let c=0;for(let l=-t;l<=t;l++)c+=$i(n,e,o,s+l);r[s*e+o]=c*a}return r}function Su(i,e,t,n){const r=new Uint8Array(e*e*4);for(let a=0;a<e;a++)for(let s=0;s<e;s++){const o=$i(i,e,s-1,a),c=$i(i,e,s+1,a),l=$i(i,e,s,a-1),u=$i(i,e,s,a+1);let h=(o-c)*t,d=(l-u)*t,p=1;const x=Math.hypot(h,d,p);h/=x,d/=x,p/=x;const g=(a*e+s)*4;r[g]=Math.round((h*.5+.5)*255),r[g+1]=Math.round((d*.5+.5)*255),r[g+2]=Math.round((p*.5+.5)*255),r[g+3]=255}return Hr(r,e,Ht,n)}function gl(i){const e=i.size??512,t=i.seed??1301,n=i.base??[.052,.056,.066],r=i.variation??.026,a=i.roughnessRange??[.52,.94],s=1/e,o=new Float32Array(e*e),c=new Float32Array(e*e),l=new Float32Array(e*e),u=new Float32Array(e*e);for(let f=0;f<e;f++)for(let M=0;M<e;M++){const y=(M+.5)*s,w=(f+.5)*s,A=f*e+M,b=mi(y,w,3,4,t)-.5,R=mi(y,w,24,5,t+31)-.5,F=1-tr(0,.42,xl(y,w,22,t+77)),S=xl(y,w,46,t+133),v=1-tr(0,.16,S),P=jo(y,w,128,t+211)-.5;c[A]=F,u[A]=v,l[A]=mi(y,w,2,3,t+401),o[A]=b*.55+R*.3+F*.16-v*.55+P*.06}const h=yu(o,e,6),d=new Uint8Array(e*e*4),p=new Uint8Array(e*e*4);for(let f=0;f<e*e;f++){const M=o[f]-h[f],y=jn(.42+tr(-.3,.06,M)*.58),w=(l[f]-.5)*2,A=w*r+c[f]*r*.85-u[f]*r*1.6,b=n[0]+A+w*.004,R=n[1]+A+w*.001,F=n[2]+A-w*.003,S=f*4;d[S]=xi(Math.max(.004,b)),d[S+1]=xi(Math.max(.004,R)),d[S+2]=xi(Math.max(.004,F)),d[S+3]=255;let v=a[0]+(a[1]-a[0])*(.55+(l[f]-.5)*.9);v-=c[f]*.26,v+=u[f]*.14,p[S]=Math.round(y*255),p[S+1]=Math.round(jn(v)*255),p[S+2]=0,p[S+3]=255}const x=Hr(d,e,Ut,i.anisotropy),g=Hr(p,e,Ht,i.anisotropy),m=Su(o,e,i.normalStrength??22,i.anisotropy);return{map:x,normalMap:m,ormMap:g,dispose(){x.dispose(),g.dispose(),m.dispose()}}}function vl(i){const e=i.size??512,t=i.seed??907,n=i.base??[.185,.196,.216],r=i.roughnessRange??[.16,.44],a=i.mode??"linear",s=i.wear??.14,o=1/e,c=new Float32Array(e*e),l=new Float32Array(e*e),u=new Float32Array(e*e),h=new Float32Array(e*e);for(let M=0;M<e;M++)for(let y=0;y<e;y++){const w=(y+.5)*o,A=(M+.5)*o,b=M*e+y;let R,F;if(a==="radial"){const L=w-.5,q=A-.5,H=Math.hypot(L,q);R=(Math.atan2(q,L)+Math.PI)/(Math.PI*2),F=H}else R=w,F=A;const S=mi(R*.06,F*1,96,3,t)-.5,v=mi(R*.25,F*1,26,3,t+17)-.5,P=mi(w,A,4,3,t+51),O=jn((mi(w,A,9,4,t+313)-.55)*4);l[b]=S*.7+v*.3,u[b]=P,h[b]=O,c[b]=l[b]*.9+(P-.5)*.22}const d=yu(c,e,4),p=new Uint8Array(e*e*4),x=new Uint8Array(e*e*4);for(let M=0;M<e*e;M++){const y=c[M]-d[M],w=jn(.68+tr(-.25,.1,y)*.32),A=h[M]*s,b=n[0]*(1+(u[M]-.5)*.22)+A*.5,R=n[1]*(1+(u[M]-.5)*.22)+A*.5,F=n[2]*(1+(u[M]-.5)*.22)+A*.46,S=M*4;p[S]=xi(b),p[S+1]=xi(R),p[S+2]=xi(F),p[S+3]=255;const v=jn(r[0]+(r[1]-r[0])*jn(.5+l[M]*1.4+(u[M]-.5)*.7)-A*.55);x[S]=Math.round(w*255),x[S+1]=Math.round(v*255),x[S+2]=Math.round(jn(1-h[M]*.12)*255),x[S+3]=255}const g=Hr(p,e,Ut,i.anisotropy),m=Hr(x,e,Ht,i.anisotropy),f=Su(c,e,i.normalStrength??9,i.anisotropy);return{map:g,normalMap:f,ormMap:m,dispose(){g.dispose(),m.dispose(),f.dispose()}}}function sg(i){const n=new Uint8Array(4096);for(let a=0;a<128;a++){const s=(a+.5)/128,o=tr(0,.14,s)*tr(0,.14,1-s),c=.94+.06*jo(.5,s,12,4021),l=xi(o*c);for(let u=0;u<8;u++){const h=(a*8+u)*4;n[h]=l,n[h+1]=l,n[h+2]=l,n[h+3]=255}}const r=new Xr(n,8,128,Vt,bt);return r.colorSpace=Ut,r.wrapS=pn,r.wrapT=It,r.minFilter=dn,r.magFilter=xt,r.generateMipmaps=!0,r.anisotropy=i,r.needsUpdate=!0,r}function og(i,e){const t=new Xr(i,e,e,Gr,bt);return t.colorSpace=Ht,t.wrapS=pn,t.wrapT=pn,t.minFilter=gt,t.magFilter=gt,t.generateMipmaps=!1,t.needsUpdate=!0,t}function cg(i,e){const t=new je().makeRotationX(-Math.PI/2).setPosition(0,e.planeY,0),n=new Yn,r=new C,a=new C,s=new C,o=new je,c=new C,l=new nt,u=new C,h=new C,d=new nt,p=new je,x=new zt;let g=2,m=2,f=y(g,m),M=0;function y(A,b){const R=new On(A,b,{type:Lt,colorSpace:gi,depthBuffer:!0,stencilBuffer:!1,generateMipmaps:!0,minFilter:dn,magFilter:xt});return R.texture.wrapS=It,R.texture.wrapT=It,R}const w={texture:f.texture,textureMatrix:p,maxLod:1,resize(A,b){const R=Math.max(64,Math.min(e.maxWidth,Math.round(A*e.scale))),F=Math.max(64,Math.round(R*(b/Math.max(1,A))));R===g&&F===m||(g=R,m=F,f.dispose(),f=y(g,m),w.texture=f.texture,w.maxLod=Math.floor(Math.log2(Math.max(g,m))))},update(A,b,R){if(M++,M<2||(a.setFromMatrixPosition(t),s.setFromMatrixPosition(b.matrixWorld),o.extractRotation(t),r.set(0,0,1).applyMatrix4(o),u.subVectors(a,s),u.dot(r)>0))return;u.reflect(r).negate().add(a),o.extractRotation(b.matrixWorld),c.set(0,0,-1).applyMatrix4(o).add(s),h.subVectors(a,c),h.reflect(r).negate().add(a),x.position.copy(u),x.up.set(0,1,0).applyMatrix4(o).reflect(r),x.lookAt(h),x.far=b.far,x.updateMatrixWorld(),x.projectionMatrix.copy(b.projectionMatrix),p.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),p.multiply(x.projectionMatrix),p.multiply(x.matrixWorldInverse),n.setFromNormalAndCoplanarPoint(r,a),n.applyMatrix4(x.matrixWorldInverse),l.set(n.normal.x,n.normal.y,n.normal.z,n.constant);const F=x.projectionMatrix;d.x=(Math.sign(l.x)+F.elements[8])/F.elements[0],d.y=(Math.sign(l.y)+F.elements[9])/F.elements[5],d.z=-1,d.w=(1+F.elements[10])/F.elements[14],l.multiplyScalar(2/l.dot(d)),F.elements[2]=l.x,F.elements[6]=l.y,F.elements[10]=l.z+1-.0035,F.elements[14]=l.w;const S=[];for(const L of R)L.visible&&(L.visible=!1,S.push(L));const v=i.getRenderTarget(),P=i.shadowMap.autoUpdate,O=i.xr.enabled;i.xr.enabled=!1,i.shadowMap.autoUpdate=!1,i.setRenderTarget(f),i.clear(),i.render(A,x),i.setRenderTarget(v),i.shadowMap.autoUpdate=P,i.xr.enabled=O;for(const L of S)L.visible=!0},dispose(){f.dispose()}};return w}function lg(i){const e=new Uint8Array(i*i*i),t=(o,c)=>(o%c+c)%c,n=o=>o*o*o*(o*(o*6-15)+10),r=(o,c,l,u,h)=>{const d=l*o,p=u*o,x=h*o,g=Math.floor(d),m=Math.floor(p),f=Math.floor(x),M=n(d-g),y=n(p-m),w=n(x-f);let A=0;for(let b=0;b<2;b++){const R=t(f+b,o),F=b===0?1-w:w;for(let S=0;S<2;S++){const v=t(m+S,o),P=S===0?1-y:y;for(let O=0;O<2;O++){const L=t(g+O,o),q=O===0?1-M:M;A+=q*P*F*pi(L+R*8191,v+R*131,c)}}}return A},a=1/i;for(let o=0;o<i;o++)for(let c=0;c<i;c++)for(let l=0;l<i;l++){const u=(l+.5)*a,h=(c+.5)*a,d=(o+.5)*a,p=r(4,5501,u,h,d)*.58+r(8,7717,u,h,d)*.28+r(16,9931,u,h,d)*.14;e[o*i*i+c*i+l]=Math.round(Math.min(1,Math.max(0,p))*255)}const s=new zo(e,i,i,i);return s.format=Gr,s.type=bt,s.colorSpace=Ht,s.minFilter=xt,s.magFilter=xt,s.wrapS=pn,s.wrapT=pn,s.wrapR=pn,s.unpackAlignment=1,s.needsUpdate=!0,s}const ug=`
  varying vec3 vWorld;
  void main() {
    vec4 world = modelMatrix * vec4( position, 1.0 );
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`,fg=`
  precision highp float;
  precision highp sampler3D;

  varying vec3 vWorld;

  uniform vec3 uLightDir;
  uniform vec3 uAxisPoint;
  uniform vec3 uApertureCenter;
  uniform vec3 uColor;
  uniform float uApertureRadius;
  uniform float uApertureY;
  uniform float uIntensity;
  uniform float uDensity;
  uniform float uExtinction;
  uniform float uHeightFalloff;
  uniform float uTime;
  uniform float uCeilY;
  uniform float uWallRadius;
  uniform float uDaisRadius;
  uniform float uDaisHeight;
  uniform float uPlinthRadius;
  uniform float uPlinthHeight;
  uniform sampler2D uBlueNoise;
  uniform vec2 uBlueNoiseScale;
  uniform sampler3D uHaze;

  const float INF = 1.0e9;

  // Nearest entry into a solid vertical cylinder standing on the floor.
  float cylinderEnter( vec3 ro, vec3 rd, float r, float h ) {
    vec2 o = ro.xz;
    vec2 d = rd.xz;
    float a = dot( d, d );
    if ( a < 1.0e-7 ) return INF;
    float b = dot( o, d );
    float c = dot( o, o ) - r * r;
    float disc = b * b - a * c;
    if ( disc < 0.0 ) return INF;
    float sq = sqrt( disc );
    float t0 = ( -b - sq ) / a;
    float t1 = ( -b + sq ) / a;
    if ( t1 < 0.0 ) return INF;

    float tyLo = -INF;
    float tyHi = INF;
    if ( abs( rd.y ) < 1.0e-6 ) {
      if ( ro.y < 0.0 || ro.y > h ) return INF;
    } else {
      float ta = ( 0.0 - ro.y ) / rd.y;
      float tb = ( h - ro.y ) / rd.y;
      tyLo = min( ta, tb );
      tyHi = max( ta, tb );
    }
    float tEnter = max( max( t0, tyLo ), 0.0 );
    float tExit = min( t1, tyHi );
    if ( tEnter > tExit ) return INF;
    return tEnter;
  }

  // Closed form depth of the chamber shell along a ray.
  float sceneDepth( vec3 ro, vec3 rd ) {
    float t = INF;
    if ( rd.y < -1.0e-5 ) {
      float tf = -ro.y / rd.y;
      if ( tf > 0.0 ) t = min( t, tf );
    }
    if ( rd.y > 1.0e-5 ) {
      float tc = ( uCeilY - ro.y ) / rd.y;
      if ( tc > 0.0 ) t = min( t, tc );
    }
    vec2 o = ro.xz;
    vec2 d = rd.xz;
    float a = dot( d, d );
    if ( a > 1.0e-7 ) {
      float b = dot( o, d );
      float c = dot( o, o ) - uWallRadius * uWallRadius;
      float disc = b * b - a * c;
      if ( disc > 0.0 ) {
        float tw = ( -b + sqrt( disc ) ) / a;
        if ( tw > 0.0 ) t = min( t, tw );
      }
    }
    t = min( t, cylinderEnter( ro, rd, uDaisRadius, uDaisHeight ) );
    t = min( t, cylinderEnter( ro, rd, uPlinthRadius, uPlinthHeight ) );
    return t;
  }

  // Soft analytic shadow of a vertical cylinder under a directional light.
  float cylinderShadow( vec3 p, float r, float h ) {
    if ( p.y >= h ) return 1.0;
    float tTop = ( h - p.y ) / max( 1.0e-4, uLightDir.y );
    vec2 o = p.xz;
    vec2 d = uLightDir.xz;
    float a = dot( d, d );
    if ( a < 1.0e-7 ) return length( o ) < r ? 0.0 : 1.0;
    float tc = clamp( -dot( o, d ) / a, 0.0, tTop );
    float dmin = length( o + d * tc );
    return smoothstep( r * 0.88, r * 1.30, dmin );
  }

  void main() {
    vec3 ro = cameraPosition;
    vec3 rd = normalize( vWorld - cameraPosition );

    // Bound the march to the beam: an infinite cylinder about the key axis.
    vec3 rel = ro - uAxisPoint;
    vec3 dPerp = rd - uLightDir * dot( rd, uLightDir );
    vec3 oPerp = rel - uLightDir * dot( rel, uLightDir );
    float a = dot( dPerp, dPerp );
    if ( a < 1.0e-7 ) discard;
    float b = dot( dPerp, oPerp );
    float c = dot( oPerp, oPerp ) - uApertureRadius * uApertureRadius;
    float disc = b * b - a * c;
    if ( disc <= 0.0 ) discard;
    float sq = sqrt( disc );
    float tNear = max( ( -b - sq ) / a, 0.0 );
    float tFar = ( -b + sq ) / a;
    if ( tFar <= tNear ) discard;

    tFar = min( tFar, sceneDepth( ro, rd ) );
    if ( tFar <= tNear ) discard;

    float span = tFar - tNear;
    float stepLen = span / float( VOLUME_STEPS );

    float dither = texture2D( uBlueNoise, gl_FragCoord.xy * uBlueNoiseScale ).r;
    float t = tNear + dither * stepLen;

    float acc = 0.0;
    float transmit = 1.0;

    for ( int i = 0; i < VOLUME_STEPS; i++ ) {
      vec3 p = ro + rd * t;

      // Aperture gate: trace back to the ceiling plane and test the hole.
      float tA = ( uApertureY - p.y ) / max( 1.0e-4, uLightDir.y );
      vec2 hit = ( p + uLightDir * tA ).xz - uApertureCenter.xz;
      float gate = 1.0 - smoothstep( uApertureRadius * 0.52, uApertureRadius, length( hit ) );

      if ( gate > 0.001 ) {
        float shadow = cylinderShadow( p, uPlinthRadius, uPlinthHeight );
        shadow = min( shadow, cylinderShadow( p, uDaisRadius, uDaisHeight ) );

        float drift = uTime * 0.035;
        float haze = texture( uHaze, p * 0.085 + vec3( drift * 0.4, -drift, drift * 0.7 ) ).r;
        float haze2 = texture( uHaze, p * 0.24 + vec3( -drift, drift * 0.5, drift ) ).r;
        float turbulence = 0.45 + haze * 0.85 + haze2 * 0.35;

        float dens = uDensity * exp( -max( 0.0, p.y ) * uHeightFalloff ) * turbulence;
        acc += gate * shadow * dens * stepLen * transmit;
        transmit *= exp( -dens * stepLen * uExtinction );
      }

      t += stepLen;
      if ( transmit < 0.02 ) break;
    }

    vec3 col = uColor * uIntensity * acc;
    gl_FragColor = vec4( col, 1.0 );
  }
`;function hg(i){const e=i.lightDir.clone().normalize(),t=lg(32),n=i.axisPoint.clone().addScaledVector(e,(i.ceilingY-i.axisPoint.y)/Math.max(1e-4,e.y)),r={uLightDir:{value:e},uAxisPoint:{value:i.axisPoint.clone()},uApertureCenter:{value:n},uColor:{value:i.color.clone()},uApertureRadius:{value:i.apertureRadius},uApertureY:{value:i.ceilingY},uIntensity:{value:i.intensity},uDensity:{value:i.density},uExtinction:{value:.55},uHeightFalloff:{value:.16},uTime:{value:0},uCeilY:{value:i.ceilingY},uWallRadius:{value:i.wallRadius},uDaisRadius:{value:i.daisRadius},uDaisHeight:{value:i.daisHeight},uPlinthRadius:{value:i.plinthRadius},uPlinthHeight:{value:i.plinthHeight},uBlueNoise:{value:i.blueNoise},uBlueNoiseScale:{value:new ye(1/i.blueNoiseSize,1/i.blueNoiseSize)},uHaze:{value:t}},a=new xn({uniforms:r,vertexShader:ug,fragmentShader:fg,defines:{VOLUME_STEPS:Math.max(4,Math.round(i.steps))},transparent:!0,blending:Lr,depthTest:!1,depthWrite:!1,side:Gt,toneMapped:!1,fog:!1}),s=new Br(i.apertureRadius*1.06,i.apertureRadius*1.06,13,28,1,!1),o=new Ye(s,a);o.quaternion.setFromUnitVectors(new C(0,1,0),e),o.position.copy(i.axisPoint).addScaledVector(e,1.6),o.frustumCulled=!1,o.renderOrder=24,o.name="vault-godrays";const c=i.intensity,l=i.density,u=new Ee;return{object:o,update(h,d,p){r.uTime.value=h,r.uIntensity.value=c*(1+d*2.6),r.uDensity.value=l*(1+d*.5),u.copy(i.color).lerp(p,Math.min(1,d*.9)),r.uColor.value.copy(u)},setQuality(h){a.defines.VOLUME_STEPS=Math.max(4,Math.round(h)),a.needsUpdate=!0},dispose(){s.dispose(),a.dispose(),t.dispose()}}}const Aa={target:0,value:0,velocity:0,color:new Ee(1,.72,.38),restColor:new Ee(1,.72,.38)};function dg(){return Aa}function pg(i){return i.copy(Aa.restColor).lerp(Aa.color,Math.min(1,Aa.value*1.35))}function mg(i){const{scene:e,quality:t,renderer:n,rng:r}=i,a=Ex(n,t),s=new Kn;s.name="vault";const o=[],c=N=>(o.push(N),N),l=t.tier==="low"?256:t.tier==="medium"?384:512,u=c(gl({size:l,seed:1301,base:[.062,.067,.079],variation:.03,roughnessRange:[.54,.95],normalStrength:26,anisotropy:a})),h=c(gl({size:l,seed:5507,base:[.028,.031,.038],variation:.014,roughnessRange:[.1,.4],normalStrength:9,anisotropy:a})),d=c(vl({size:l,seed:907,base:[.152,.163,.186],roughnessRange:[.14,.42],mode:"linear",normalStrength:8,wear:.16,anisotropy:a})),p=c(vl({size:l,seed:4409,base:[.205,.213,.232],roughnessRange:[.1,.34],mode:"radial",normalStrength:7,wear:.1,anisotropy:a})),x=c(sg(a)),g=64,m=c(og(ag(g,r),g)),f=c(Rs(u,{envMapIntensity:1,normalScale:1})),M=c(Rs(u,{envMapIntensity:1,normalScale:1}));pl(M);const y=c(Rs(h,{envMapIntensity:1.25,normalScale:.55,aoMapIntensity:.7})),w=c(Cs(d,{envMapIntensity:1.3,anisotropy:.7,normalScale:.85})),A=c(Cs(d,{envMapIntensity:1.3,anisotropy:.7,normalScale:.85}));pl(A);const b=c(Cs(p,{envMapIntensity:1.45,anisotropy:.85,normalScale:.7})),R=Qx.clone(),F=c(Bi(R.clone().multiplyScalar(3.4),x)),S=c(Bi(R.clone().multiplyScalar(2.2))),v=c(Bi(R.clone().multiplyScalar(5))),P=c(Bi(R.clone().multiplyScalar(1.1))),O=c(Bi(R.clone().multiplyScalar(6.5))),L=c(Bi(Ts.clone().multiplyScalar(7))),q=[F,S,v,P,O],H=q.map(N=>N.color.clone()),G=[3.4,2.2,5,1.1,6.5],V=t.tier!=="low"?c(cg(n,{planeY:0,scale:t.tier==="ultra"?.5:.4,maxWidth:t.tier==="ultra"?768:512})):null,ee=Dt(ng(Ze.floorRadius,128),9,9),te=new Ye(ee,y);te.receiveShadow=!0,te.name="vault-floor",s.add(te);const me=V?rg(y,V,.85,new Ee(.86,.9,1)):null,ue=hl([Dt(wr(2.58,2.66,128),10,1),Dt(wr(4.18,4.26,128),14,1),Dt(wr(5.78,5.86,128),18,1)]),Le=new Ye(ue,w);Le.position.y=.004,s.add(Le);const Ge=new vi(.055,3.7);Ge.rotateX(-Math.PI/2),Ge.translate(0,0,-4.300000000000001);const $e=[];for(let N=0;N<8;N++){const J=N/8*Math.PI*2+Math.PI/8,le=new je().makeRotationY(J);le.setPosition(0,.007,0),$e.push({matrix:le,uvOffset:new ye(0,0)})}const K=ki(Ge,P,$e);s.add(K);const j=Dt(ci([[2.335,0],[2.3,.036],[2.3,.115],[2.262,.15],[1.92,.15],[1.92,.262],[1.884,.3],[1.12,.3]],96),16,1),fe=new Ye(j,f);fe.castShadow=!0,fe.receiveShadow=!0,s.add(fe);const Pe=new Ye(wr(2.36,2.5,96),P);Pe.position.y=.006,s.add(Pe);const Se=Dt(ci([[1.1,.3],[1.1,.35],[1.062,.39],[.925,.44],[.905,.8],[.905,.86],[.965,.9],[.985,.955],[.985,.985],[.958,1.02],[0,1.02]],96),9,1),He=new Ye(Se,w);He.castShadow=!0,He.receiveShadow=!0,s.add(He);const ft=Dt(wr(.18,.94,96),1,1),ke=new Ye(ft,b);ke.position.y=Ze.plinthTopY+.002,ke.receiveShadow=!0,s.add(ke);const it=new Br(.913,.913,.045,96,1,!0),D=new Ye(it,v);D.position.y=.83,D.material.side=un,s.add(D);const Be=Math.PI*2/Ze.panels,ze=.34,Je=2*(Ze.wallRadius+ze/2)*Math.sin(Be/2)-.115,xe=Dt(As(Je,Ze.wallHeight,ze,.035,3),1.15,3),Qe=ki(xe,M,ga(Ze.panels,Ze.wallRadius+ze/2,Ze.skirtHeight+Ze.wallHeight/2,r));Qe.receiveShadow=!0,s.add(Qe);const be=new vi(.07,3.9),De=ki(be,F,ga(Ze.panels,Ze.wallRadius+.055,Ze.skirtHeight+Ze.wallHeight/2,r,Be/2).map(N=>(N.matrix.multiply(new je().makeRotationY(Math.PI)),N)));s.add(De);const T=Dt(As(.15,4.14,.3,.022,3),.4,3),_=ki(T,A,ga(Ze.pilasters,Ze.wallRadius-.1,Ze.skirtHeight+Ze.wallHeight/2,r,Be/2));_.castShadow=!1,s.add(_);const z=new Ye(Dt(ci([[6.44,.3],[6.34,.3],[6.28,.244],[6.28,0]],128),40,1),w);z.receiveShadow=!0,s.add(z);const Z=new Ye(Dt(ci([[6.06,4.8],[6.2,4.755],[6.3,4.66],[6.3,4.6],[6.44,4.52]],128),40,1),w);s.add(Z);const Q=new Ye(new Br(6.345,6.345,.075,128,1,!0),S);Q.position.y=4.565,Q.material.side=un,s.add(Q);const Y=new Ye(Dt(dl(6.12,96),8,8),f);Y.position.y=Ze.ceilingY,s.add(Y);const Me=Dt(As(.17,.15,4.4,.02,2),.5,.5);Me.translate(0,0,2.3);const ce=ki(Me,A,ga(24,0,Ze.ceilingY-.075,r,Be/2));s.add(ce);const we=new Ye(Dt(ci([[1.5,5.12],[1.5,4.82],[1.66,4.74]],64),12,1),b);s.add(we);const ve=new Ye(dl(1.48,64),L);ve.position.y=5.1,s.add(ve);const ne=Dt(ig([[2.62,0],[2.62,.2],[2.54,.26],[2.06,.26],[1.98,.19],[1.98,.1],[1.86,.06],[1.76,.06],[1.66,-.03],[1.66,-.34],[0,-.38]],96),8,1),ie=new Ye(ne,w);ie.position.set(0,Ze.portalY,Ze.portalZ),ie.receiveShadow=!0,s.add(ie);const Ce=hl([new zr(1.665,1.755,96,1),new zr(2.3,2.325,96,1)]),Te=new Ye(Ce,O);Te.position.set(0,Ze.portalY,Ze.portalZ+.075),s.add(Te);const de=Dt(ci([[0,0],[.075,0],[.075,.048],[.055,.068],[0,.068]],20),1,1);de.rotateX(Math.PI/2);const Ue=[];for(let N=0;N<12;N++){const J=N/12*Math.PI*2+Math.PI/12,le=new je().makeTranslation(Math.cos(J)*2.18,Ze.portalY+Math.sin(J)*2.18,Ze.portalZ+.26);Ue.push({matrix:le,uvOffset:new ye(r(),r())})}const U=ki(de,A,Ue);s.add(U);let se=null;t.volumetrics&&(se=hg({lightDir:Jx.clone(),axisPoint:eg.clone(),apertureRadius:Ze.apertureRadius,ceilingY:Ze.ceilingY,wallRadius:Ze.wallRadius,daisRadius:Ze.daisRadius,daisHeight:Ze.daisHeight,plinthRadius:Ze.plinthRadius,plinthHeight:Ze.plinthTopY,color:Ts.clone(),intensity:.62,density:.3,steps:t.tier==="ultra"?32:t.tier==="high"?22:14,blueNoise:m,blueNoiseSize:g}),s.add(se.object),o.push(se)),e.add(s),e.fog=new Ho(461329,.052),e.background=new Ee(197898);const re=[te,Le,K,Pe];se&&re.push(se.object);const ae=new Ee,I=new Ee;return{name:"vault",update(N){const J=dg();pg(ae);const le=1+Math.sin(N.elapsed*.55)*.05;for(let Fe=0;Fe<q.length;Fe++){const Ae=Fe===2?1:Fe===4?.8:.55,Rt=G[Fe]*le*(1+J.value*3.2*Ae);I.copy(H[Fe]).lerp(ae.clone().multiplyScalar(G[Fe]),Math.min(1,J.value*1.2));const qt=Math.max(I.r,I.g,I.b);qt>1e-6&&I.multiplyScalar(1/qt),q[Fe].color.copy(I).multiplyScalar(Rt)}L.color.copy(Ts).multiplyScalar(7*(1+J.value*1.8)),se&&se.update(N.elapsed,J.value,ae),V&&me&&(V.update(e,i.camera,re),me.uReflectMap.value=V.texture,me.uReflectMaxLod.value=V.maxLod)},resize(N,J){V?.resize(N,J)},dispose(){e.remove(s),s.traverse(N=>{const J=N;J.isMesh&&J.geometry.dispose()});for(const N of o)N.dispose()}}}function xg(i){const{scene:e,quality:t}=i,n=new Nc(16773856,3.2);n.position.set(3.2,5.4,2.6),n.castShadow=!0,n.shadow.mapSize.set(t.shadowMapSize,t.shadowMapSize),n.shadow.camera.near=.5,n.shadow.camera.far=20,n.shadow.camera.left=-5,n.shadow.camera.right=5,n.shadow.camera.top=5,n.shadow.camera.bottom=-5,n.shadow.bias=-6e-4,n.shadow.normalBias=.02,n.shadow.radius=4,e.add(n,n.target);const r=new Nc(4877567,.7);r.position.set(-4,2.2,-1.5),e.add(r);const a=new Ch(9426175,12,18,Math.PI*.24,.55,1.6);a.position.set(-1.4,4.6,-3.2),e.add(a,a.target);const s=new Ah(2765648,460813,.55);e.add(s);const o=new Dh(16777215,0,12,2);o.position.set(0,1.5,.6),e.add(o);let c=0;return{name:"lighting",key:n,rim:a,setSurge(l,u){c=l,u&&o.color.copy(u)},update(l){o.intensity=c*40,a.intensity=12+Math.sin(l.elapsed*.7)*1.2}}}const Ao=new Map,Ur={frozen:!1,resume:()=>{}};function _n(i,e){Ao.set(i,e)}function gg(i,e,t){_n("idle",{apply:()=>{},settleFrames:90});const n=s=>new Promise(o=>{const c=t.frame,l=()=>{t.frame-c>=s?o():requestAnimationFrame(l)};requestAnimationFrame(l)}),r={shots:[],ready:!1,async goto(s){r.ready=!1;const o=Ao.get(s);if(!o)throw new Error(`unknown shot: ${s}`);Ur.frozen=!1,Ur.resume(),await o.apply(),await n(o.settleFrames??60),Ur.frozen=!0,r.ready=!0}};Object.defineProperty(r,"shots",{get:()=>Array.from(Ao.keys())}),window.__harness=r;const a=new URLSearchParams(location.search).get("shot");a&&requestAnimationFrame(()=>void r.goto(a))}const ut=i=>i<0?0:i>1?1:i,ot=(i,e,t)=>i+(e-i)*t,lr=i=>i,Eu=i=>e=>Math.pow(ut(e),i),wu=i=>e=>1-Math.pow(1-ut(e),i),vg=Eu(2),Ia=wu(2),_l=Eu(3),Ko=wu(3),Vr=i=>-(Math.cos(Math.PI*ut(i))-1)/2,Tu=i=>i>=1?1:1-Math.pow(2,-10*ut(i)),_g=(i=1.70158)=>e=>{const t=ut(e)-1;return 1+(i+1)*t*t*t+i*t*t},bg=(i=1.70158)=>e=>{const t=ut(e);return(i+1)*t*t*t-i*t*t},Au=(i,e)=>1-3*e+3*i,Ru=(i,e)=>3*e-6*i,Cu=i=>3*i,Ps=(i,e,t)=>((Au(e,t)*i+Ru(e,t))*i+Cu(e))*i,Mg=(i,e,t)=>3*Au(e,t)*i*i+2*Ru(e,t)*i+Cu(e);function Ln(i,e,t,n){return i===e&&t===n?lr:r=>{const a=ut(r);if(a<=0)return 0;if(a>=1)return 1;let s=a;for(let o=0;o<6;o++){const c=Mg(s,i,t);if(Math.abs(c)<1e-6)break;s-=(Ps(s,i,t)-a)/c}if(!(s>=0&&s<=1)){let o=0,c=1;s=a;for(let l=0;l<24;l++){const u=Ps(s,i,t);if(Math.abs(u-a)<1e-6)break;u>a?c=s:o=s,s=(o+c)/2}}return Ps(s,e,n)}}const nr={charge:Ln(.55,.02,.86,.28),snap:Ln(.05,.86,.16,1),drift:Ln(.12,.72,.22,1),glide:Ln(.42,0,.24,1),arrive:Ln(.16,.9,.28,1),heroTurn:Ln(.14,.88,.1,1),settle:_g(1.28),anticipate:bg(2.1),linear:lr},Tr=[10467032,6547112,5547775,12483583,16758344],yg=[{t:0,v:0,ease:nr.arrive},{t:1,v:1}],bl=[{t:0,v:0,ease:Ln(.1,.82,.28,.98)},{t:.62,v:.9,ease:Vr},{t:1,v:1}],Ml=[{t:0,v:0,ease:Ln(.08,.9,.2,1)},{t:.34,v:.84,ease:lr},{t:.52,v:.865,ease:Vr},{t:.82,v:1.02,ease:Ia},{t:1,v:1}],yl=[{t:0,v:0,ease:Ko},{t:1,v:1}],Ds=[{t:0,v:0,ease:Tu},{t:.45,v:1.08,ease:Vr},{t:.78,v:.985,ease:Vr},{t:1,v:1}],Ar=[{t:0,v:1,ease:Ln(.2,0,.1,1)},{t:.72,v:.02,ease:Ia},{t:1,v:0}],Sl=[{chargeDur:.72,holdDur:.1,ejectSpeed:2.35,ejectForward:.3,ejectSpin:7.5,maxFlight:1.5,impactHold:.2,turnDur:.46,spinTurns:0,liftArc:.1,burstShake:.1,impactShake:.14,shakeDur:.3,camPush:.35,camArc:.05,camHero:1.72,fovSqueeze:1,glow:.9,color:new Ee(Tr[0]),turnKeys:yg,liftKeys:yl,spinKeys:Ar},{chargeDur:.86,holdDur:.14,ejectSpeed:2.65,ejectForward:.34,ejectSpin:8.6,maxFlight:1.6,impactHold:.24,turnDur:.58,spinTurns:0,liftArc:.13,burstShake:.14,impactShake:.2,shakeDur:.34,camPush:.45,camArc:.1,camHero:1.68,fovSqueeze:1,glow:1.15,color:new Ee(Tr[1]),turnKeys:bl,liftKeys:yl,spinKeys:Ar},{chargeDur:1.05,holdDur:.2,ejectSpeed:2.95,ejectForward:.36,ejectSpin:10.2,maxFlight:1.7,impactHold:.28,turnDur:.82,spinTurns:.5,liftArc:.17,burstShake:.2,impactShake:.3,shakeDur:.4,camPush:.58,camArc:.2,camHero:1.62,fovSqueeze:.985,glow:1.5,color:new Ee(Tr[2]),turnKeys:bl,liftKeys:Ds,spinKeys:Ar},{chargeDur:1.25,holdDur:.3,ejectSpeed:3.2,ejectForward:.38,ejectSpin:11.8,maxFlight:1.8,impactHold:.32,turnDur:1.15,spinTurns:1,liftArc:.2,burstShake:.26,impactShake:.4,shakeDur:.46,camPush:.7,camArc:.42,camHero:1.56,fovSqueeze:.96,glow:1.9,color:new Ee(Tr[3]),turnKeys:Ml,liftKeys:Ds,spinKeys:Ar},{chargeDur:1.5,holdDur:.46,ejectSpeed:3.55,ejectForward:.4,ejectSpin:13.5,maxFlight:2,impactHold:.4,turnDur:1.62,spinTurns:1.5,liftArc:.26,burstShake:.36,impactShake:.58,shakeDur:.55,camPush:.86,camArc:.72,camHero:1.5,fovSqueeze:.925,glow:2.6,color:new Ee(Tr[4]),turnKeys:Ml,liftKeys:Ds,spinKeys:Ar}];function La(i){return Sl[Math.max(0,Math.min(Sl.length-1,Math.round(i)))]}const Et={plinthTop:.62,plinthRadius:.85,packetY:1,heroPos:new C(0,1.34,.5)};class li{constructor(e){if(this.keys=e,e.length===0)throw new Error("track needs at least one key")}at(e){const t=this.keys,n=t[0];if(e<=n.t||t.length===1)return n.v;const r=t[t.length-1];if(e>=r.t)return r.v;let a=0;for(;a<t.length-2&&t[a+1].t<=e;)a++;const s=t[a],o=t[a+1],c=o.t-s.t,l=c>1e-9?(e-s.t)/c:1;return s.v+(o.v-s.v)*(s.ease??lr)(l)}}class El{constructor(e){this.duration=e}time=0;tracks=new Map;cues=[];track(e,t){return this.tracks.set(e,new li(t)),this}cue(e,t){return this.cues.push({at:e,fn:t,fired:!1}),this.cues.sort((n,r)=>n.at-r.at),this}advance(e){this.time+=e;const t=this.u;for(const n of this.cues)!n.fired&&t>=n.at&&(n.fired=!0,n.fn())}get u(){return this.duration>1e-9?ut(this.time/this.duration):1}get done(){return this.time>=this.duration}value(e,t=0){const n=this.tracks.get(e);return n?n.at(this.u):t}sample(e,t,n=0){const r=this.tracks.get(e);return r?r.at(ut(t)):n}reset(e=this.duration){this.duration=e,this.time=0;for(const t of this.cues)t.fired=!1;return this}}function Ra(i=0,e=0){return{value:i,velocity:e}}function yn(i,e,t,n,r=0){if(n<=0)return i.value;const a=Math.max(t,1e-5),s=e+2*r/a,o=i.value-s,c=i.velocity+o*a,l=Math.exp(-a*n);return i.value=l*(o+c*n)+s,i.velocity=l*(i.velocity-c*a*n),i.value}class Fa{value=new C;velocity=new C;sx={value:0,velocity:0};sy={value:0,velocity:0};sz={value:0,velocity:0};constructor(e){e&&this.snap(e)}snap(e){return this.value.copy(e),this.velocity.set(0,0,0),this}step(e,t,n,r){return this.sx.value=this.value.x,this.sy.value=this.value.y,this.sz.value=this.value.z,this.sx.velocity=this.velocity.x,this.sy.velocity=this.velocity.y,this.sz.velocity=this.velocity.z,yn(this.sx,e.x,t,n,r?r.x:0),yn(this.sy,e.y,t,n,r?r.y:0),yn(this.sz,e.z,t,n,r?r.z:0),this.value.set(this.sx.value,this.sy.value,this.sz.value),this.velocity.set(this.sx.velocity,this.sy.velocity,this.sz.velocity),this.value}}const wl=new At,Tl=new At,Us=new C,Is=new C,Al=new C,Rl=new At;function Sg(i,e){let{x:t,y:n,z:r,w:a}=i;a<0&&(t=-t,n=-n,r=-r,a=-a);const s=Math.sqrt(t*t+n*n+r*r);if(s<1e-8)return e.set(t*2,n*2,r*2);const o=2*Math.atan2(s,a);return e.set(t/s*o,n/s*o,r/s*o)}function Eg(i,e){const t=i.length();if(t<1e-8)return e.set(i.x*.5,i.y*.5,i.z*.5,1).normalize();const n=t*.5,r=Math.sin(n)/t;return e.set(i.x*r,i.y*r,i.z*r,Math.cos(n))}function wg(i,e,t,n,r){if(r<=0)return;const a=Math.max(n,1e-5);Tl.copy(t).invert(),wl.copy(i).multiply(Tl),Sg(wl,Us),Is.copy(e).addScaledVector(Us,a);const s=Math.exp(-a*r);Al.copy(Us).addScaledVector(Is,r).multiplyScalar(s),Eg(Al,Rl),i.copy(Rl).multiply(t).normalize(),e.addScaledVector(Is,-a*r).multiplyScalar(s)}function Zi(i){let e=Math.imul(i|0,668265261)^2654435769;return e^=e>>>15,e=Math.imul(e,2246822507),e^=e>>>13,e=Math.imul(e,3266489909),e^=e>>>16,(e>>>0)/2147483648-1}function Tg(...i){let e=2166136261;for(const t of i)e^=Math.imul(t|0,16777619),e=Math.imul(e^e>>>13,1540483477);return e>>>0}function ui(i,e=0){const t=Math.floor(i),n=i-t,r=n*n*n*(n*(n*6-15)+10),a=Math.imul(e|0,2654435761),s=Zi(t+a),o=Zi(t+1+a);return s+(o-s)*r}function wt(i,e=0,t=3){let n=0,r=.5,a=1,s=0;for(let o=0;o<t;o++)n+=ui(i*a,e+o*1013)*r,s+=r,r*=.5,a*=2.037;return s>0?n/s:0}function Ag(i,e,t){t.x=wt(i,e+17,2),t.y=wt(i*1.13+31.7,e+191,2),t.z=wt(i*.87+71.3,e+733,2)}const Rg={density:1.9,normalDrag:1.28,edgeDrag:.06,copShift:.42,rotationalDrag:.016,liftCoupling:.035},va=new C,_a=new C,ba=new C,Cl=new C,Cg=new C,Pl=new C;function Pg(i,e){if(!i.active||i.sleeping)return;const t=i.size.x,n=i.size.y,r=t*n,a=.5*Math.sqrt(t*n);i.axis(2,va);const s=i.velocity.length();if(s>1e-4){const c=i.velocity.dot(va),u=-(.5*e.density*r)*e.normalDrag*Math.abs(c)*c;ba.copy(va).multiplyScalar(u),_a.copy(i.velocity).addScaledVector(va,-c);const h=_a.length();if(h>1e-5){const d=Math.min(1,Math.abs(c)/s),p=a*e.copShift*(1-d);Cl.copy(_a).multiplyScalar(p/h),i.torque.add(Cg.copy(Cl).cross(ba));const x=r*.08+t*i.size.z,g=-.5*e.density*e.edgeDrag*x*h;ba.addScaledVector(_a,g)}i.force.add(ba),e.liftCoupling>0&&(Pl.copy(i.angularVelocity).cross(i.velocity),i.force.addScaledVector(Pl,e.liftCoupling*e.density*r))}const o=i.angularVelocity.length();if(o>1e-5){const c=e.rotationalDrag*e.density*r*a*a*o;i.torque.addScaledVector(i.angularVelocity,-c)}}const zi=new C,Dn=new C,Rr=new C,Xn=new C,qn=new C,Hi=new C,Vi=new C,Ls=new C,Dg=[[-1,-1,-1],[1,-1,-1],[-1,1,-1],[1,1,-1],[-1,-1,1],[1,-1,1],[-1,1,1],[1,1,1]];class Ug{gravity=new C(0,-9.4,0);planes=[];fixedStep=1/120;maxSubsteps=4;solverIterations=4;restitutionThreshold=.55;sleepLinear=.055;sleepAngular=.22;sleepDelay=.28;bodies=[];onContact=null;contact={planeId:"",point:new C,impulse:0,speed:0};add(e,t={}){return this.bodies.push({body:e,aero:t.aero??null,collide:t.collide??!0}),e}remove(e){const t=this.bodies.findIndex(n=>n.body===e);t>=0&&this.bodies.splice(t,1)}addPlane(e){return this.planes.push(e),e}contacts(e){this.onContact=e}step(e){if(e<=0)return;const t=Math.max(1,Math.min(this.maxSubsteps,Math.ceil(e/this.fixedStep-1e-6))),n=e/t;for(let r=0;r<t;r++)this.substep(n)}substep(e){for(const t of this.bodies){const n=t.body;!n.active||n.sleeping||(n.force.addScaledVector(this.gravity,n.mass),t.aero&&Pg(n,t.aero),n.integrate(e))}for(const t of this.bodies){if(!t.collide)continue;const n=t.body;!n.active||n.sleeping||(this.resolve(n),this.updateSleep(n,e))}}resolve(e){let t=0,n=0,r="";for(let a=0;a<this.solverIterations;a++){let s=0;Ls.set(0,0,0);for(const c of this.planes)for(const l of Dg){zi.set(l[0]*e.halfSize.x,l[1]*e.halfSize.y,l[2]*e.halfSize.z).applyQuaternion(e.quaternion).add(e.position);const u=c.offset-zi.dot(c.normal);if(u<=0)continue;if(c.radius!==void 0){const f=c.center?c.center.x:0,M=c.center?c.center.z:0,y=zi.x-f,w=zi.z-M;if(y*y+w*w>c.radius*c.radius)continue}u>s&&(s=u,Ls.copy(c.normal)),Dn.copy(zi).sub(e.position),Rr.copy(e.angularVelocity).cross(Dn).add(e.velocity);const h=Rr.dot(c.normal);if(h>=0)continue;Xn.copy(Dn).cross(c.normal),e.applyInvInertia(Xn,qn);const d=e.invMass+qn.cross(Dn).dot(c.normal);if(d<=1e-9)continue;const p=-h,g=-(1+(p<this.restitutionThreshold?0:c.restitution*e.restitution))*h/d;Hi.copy(c.normal).multiplyScalar(g),e.velocity.addScaledVector(Hi,e.invMass),Xn.copy(Dn).cross(Hi),e.applyInvInertia(Xn,qn),e.angularVelocity.add(qn),a===0&&g>t&&(t=g,n=p,r=c.id,this.contact.point.copy(zi)),Rr.copy(e.angularVelocity).cross(Dn).add(e.velocity),Vi.copy(Rr).addScaledVector(c.normal,-Rr.dot(c.normal));const m=Vi.length();if(m>1e-5){Vi.multiplyScalar(1/m),Xn.copy(Dn).cross(Vi),e.applyInvInertia(Xn,qn);const f=e.invMass+qn.cross(Dn).dot(Vi);if(f>1e-9){const M=c.friction*e.friction,y=Math.max(-m/f,-M*g);Hi.copy(Vi).multiplyScalar(y),e.velocity.addScaledVector(Hi,e.invMass),Xn.copy(Dn).cross(Hi),e.applyInvInertia(Xn,qn),e.angularVelocity.add(qn)}}}const o=4e-4;if(s>o)e.position.addScaledVector(Ls,(s-o)*.72);else if(s===0)break}t>0&&this.onContact&&(this.contact.planeId=r,this.contact.impulse=t,this.contact.speed=n,this.onContact(this.contact))}updateSleep(e,t){e.velocity.lengthSq()<this.sleepLinear*this.sleepLinear&&e.angularVelocity.lengthSq()<this.sleepAngular*this.sleepAngular?(e.restTimer+=t,e.restTimer>this.sleepDelay&&(e.sleeping=!0,e.velocity.set(0,0,0),e.angularVelocity.set(0,0,0))):e.restTimer=0}}const Dl=new At,Un=new C,Gi=new C,Ul=new At;class Il{position=new C;quaternion=new At;velocity=new C;angularVelocity=new C;force=new C;torque=new C;size;halfSize;invInertiaLocal=new C;mass;invMass;linearDamping;angularDamping;restitution;friction;active=!0;sleeping=!1;restTimer=0;constructor(e){this.mass=Math.max(e.mass,1e-6),this.invMass=1/this.mass,this.size=e.size.clone(),this.halfSize=e.size.clone().multiplyScalar(.5),this.linearDamping=e.linearDamping??0,this.angularDamping=e.angularDamping??0,this.restitution=e.restitution??.2,this.friction=e.friction??.5,this.setBoxInertia()}setBoxInertia(){const{x:e,y:t,z:n}=this.size,r=this.mass/12,a=r*(t*t+n*n),s=r*(e*e+n*n),o=r*(e*e+t*t);this.invInertiaLocal.set(1/a,1/s,1/o)}applyInvInertia(e,t){return Dl.copy(this.quaternion).conjugate(),t.copy(e).applyQuaternion(Dl),t.multiply(this.invInertiaLocal),t.applyQuaternion(this.quaternion),t}wake(){this.sleeping=!1,this.restTimer=0}addForce(e){this.force.add(e)}addTorque(e){this.torque.add(e)}addForceAtPoint(e,t){this.force.add(e),Gi.copy(t).sub(this.position),this.torque.add(Un.copy(Gi).cross(e))}addImpulseAtPoint(e,t){this.velocity.addScaledVector(e,this.invMass),Gi.copy(t).sub(this.position),Un.copy(Gi).cross(e),this.applyInvInertia(Un,Un),this.angularVelocity.add(Un),this.wake()}pointVelocity(e,t){return Gi.copy(e).sub(this.position),t.copy(this.angularVelocity).cross(Gi).add(this.velocity),t}axis(e,t){return t.set(e===0?1:0,e===1?1:0,e===2?1:0),t.applyQuaternion(this.quaternion)}integrate(e){if(!this.active||this.sleeping){this.force.set(0,0,0),this.torque.set(0,0,0);return}this.velocity.addScaledVector(this.force,this.invMass*e),this.applyInvInertia(this.torque,Un),this.angularVelocity.addScaledVector(Un,e),this.linearDamping>0&&this.velocity.multiplyScalar(Math.exp(-this.linearDamping*e)),this.angularDamping>0&&this.angularVelocity.multiplyScalar(Math.exp(-this.angularDamping*e)),this.position.addScaledVector(this.velocity,e);const t=this.angularVelocity.length();if(t>1e-8){const n=t*e;Un.copy(this.angularVelocity).multiplyScalar(1/t),Ul.setFromAxisAngle(Un,n),this.quaternion.premultiply(Ul).normalize()}this.force.set(0,0,0),this.torque.set(0,0,0)}writeTo(e){e.position.copy(this.position),e.quaternion.copy(this.quaternion)}readFrom(e,t){this.position.copy(e),this.quaternion.copy(t).normalize(),this.velocity.set(0,0,0),this.angularVelocity.set(0,0,0),this.wake()}}const Ro=.62,Ll=Ro*(63/88),Fl=.0042,si=.44,oi=.66,Wi=.016,Xi=.016,Ig=Math.PI*2,Kt=new C;new C;const In=new At,Nl=new At,qi=new tn;function Lg(i){const{bus:e}=i,t=new Kn;t.name="card-stage",i.scene.add(t);const n=[],r=I=>(n.push(I),I),a=Fg(r),s=a[4],o=a[5],c=r(new er({color:658972,roughness:.31,metalness:.96,clearcoat:1,clearcoatRoughness:.14,transparent:!0,opacity:1})),l=r(new er({color:1777976,roughness:.42,metalness:.88,transparent:!0,opacity:1})),u=r(new Ua({color:329484,emissive:new Ee(10467032),emissiveIntensity:1.2,roughness:.5,metalness:0})),h=r(new Ua({color:329484,emissive:new Ee(10467032),emissiveIntensity:.5,roughness:.6,metalness:0})),d=r(new Wr({color:10467032,transparent:!0,opacity:.85,blending:Lr,depthWrite:!1})),p=new Kn;p.position.set(0,Et.packetY,0),t.add(p);const x=new Kn;p.add(x);const g=r(new hn(si,oi,Wi)),m=new Ye(g,c);m.position.z=Xi;const f=new Ye(g,c);f.position.z=-Xi;for(const I of[m,f])I.castShadow=!0,I.receiveShadow=!0,x.add(I);const M=r(new hn(si*1.05,.044,Xi*2+Wi*1.6)),y=new Ye(M,l);y.position.y=oi/2+.006;const w=new Ye(M,l);w.position.y=-oi/2-.006;for(const I of[y,w])I.castShadow=!0,x.add(I);const A=r(new hn(si*1.06,.009,Xi*2+Wi*1.7)),b=new Ye(A,u);b.position.y=oi/2-.052,x.add(b);const R=r(new hn(.009,oi*.9,Xi*2+Wi*1.5)),F=new Ye(R,h);F.position.x=-si/2-.002;const S=new Ye(R,h);S.position.x=si/2+.002,x.add(F,S);const v=r(new vi(si*.84,oi*.86)),P=new Ye(v,d);P.position.z=Xi-Wi*.5-.001,x.add(P);const O=r(new hn(Ll,Ro,Fl)),L=new Ye(O,a);L.castShadow=!0,L.receiveShadow=!0,L.visible=!1,t.add(L);const q=r(c.clone());q.transparent=!0;const H=[{source:m,kick:new C(.85,1.35,1.5)},{source:f,kick:new C(-.9,1.2,-1.35)},{source:y,kick:new C(.2,3.1,.55)}].map(I=>{const N=new Ye(I.source===y?M:g,q);return N.castShadow=!0,N.visible=!1,t.add(N),{mesh:N,source:I.source,kick:I.kick,body:new Il({mass:I.source===y?.004:.012,size:new C(si,oi,Wi),linearDamping:.9,angularDamping:.6})}});let G=0,$=!1;const V=new Ug,ee=new Il({mass:.0019,size:new C(Ll,Ro,Fl),linearDamping:.05,angularDamping:.12,restitution:.24,friction:.62});ee.active=!1,V.add(ee,{aero:Rg}),V.addPlane({id:"plinth",normal:new C(0,1,0),offset:Et.plinthTop,radius:Et.plinthRadius,center:new C(0,0,0),restitution:.3,friction:.7}),V.addPlane({id:"floor",normal:new C(0,1,0),offset:.002,restitution:.2,friction:.85});let te="idle",me=0,ue=La(0),Le=0,Ge=1,$e=-1,K=!1;const j={charge:!1,burst:!1,turn:!1,settle:!1},fe=new El(1),Pe=new El(1);let Se=new li([{t:0,v:0}]),He=new li([{t:0,v:0}]),ft=new li([{t:0,v:0}]);const ke=new C,it=new At,D=new C,Be=new At().setFromEuler(new tn(-.045,.115,.018,"YXZ")),ze=new Fa(Et.heroPos),Je=new At().copy(Be),xe=new C,Qe=Ra(.35),be=new Fa(new C(0,Et.packetY,0)),De={x:0,y:Et.packetY,z:0,speed:0},T=new C(0,Et.packetY,0),_=[];window.__animBeats=_;function z(I,N,J){te=I,me=0,_.length<64&&_.push({beat:I,frame:J}),e.emit("anim:beat",{beat:I,rarity:Le,duration:N})}V.contacts(I=>{te==="burst"&&I.speed>.35&&(K=!0)});function Z(I=0){te="idle",me=0,K=!1,$e=-1,j.charge=!1,j.burst=!1,j.turn=!1,j.settle=!1,L.visible=!1,ee.active=!1,ee.sleeping=!1,p.visible=!0,x.scale.set(1,1,1),x.position.set(0,0,0),x.rotation.set(0,0,0),p.position.set(0,Et.packetY,0),be.snap(p.position),$=!1;for(const N of H)N.mesh.visible=!1;_.length=0,e.emit("anim:beat",{beat:"idle",rarity:Le,duration:0})}function Q(I){u.emissive.copy(I),h.emissive.copy(I),d.color.copy(I),s.emissive.copy(I),o.emissive.copy(I)}function Y(I,N,J){Le=I.card.rarity,ue=La(Le),$e=N,Ge=Tg(I.card.id,N,Le),Q(ue.color),K=!1,j.charge=!0,j.burst=!1,j.turn=!1,j.settle=!1,L.visible=!1,ee.active=!1,ee.sleeping=!1,p.visible=!0,$=!1;for(const le of H)le.mesh.visible=!1;Me(),z("charge",ue.chargeDur+ue.holdDur,J),e.emit("audio:cue",{id:"packet-charge",intensity:ut(Le/4)})}function Me(){const I=ue.chargeDur+ue.holdDur,N=ut(ue.chargeDur/I),J=[{t:0,v:0,ease:nr.charge},{t:N,v:1,ease:lr},{t:1,v:1}],le=[{t:0,v:0,ease:vg},{t:N*.86,v:1,ease:Tu},{t:N,v:.08,ease:Ia},{t:1,v:.03}],Fe=[{t:0,v:0,ease:_l},{t:N*.9,v:.88,ease:Ia},{t:N,v:.42,ease:_l},{t:1,v:1.15}],Ae=[{t:0,v:0,ease:nr.glide},{t:N*.8,v:1,ease:lr},{t:1,v:1}];fe.reset(I).track("squash",J).track("tremor",le).track("glow",Fe).track("face",Ae)}function ce(I){p.updateMatrixWorld(!0),x.updateMatrixWorld(!0),L.position.copy(p.position),L.quaternion.copy(p.quaternion),ee.readFrom(p.position,p.quaternion),ee.active=!0,L.visible=!0;const N=Zi(Ge^31),J=Zi(Ge^43),le=Zi(Ge^61),Fe=Zi(Ge^76);Kt.set(0,1,0).applyQuaternion(p.quaternion).multiplyScalar(ue.ejectSpeed),Kt.z+=ue.ejectForward,Kt.x+=N*.16,ee.velocity.copy(Kt),ee.angularVelocity.set(-ue.ejectSpin*(.78+.22*Math.abs(J)),ue.ejectSpin*.26*le,ue.ejectSpin*.14*Fe);for(const Ae of H)Ae.source.updateMatrixWorld(!0),Ae.source.matrixWorld.decompose(Ae.mesh.position,Ae.mesh.quaternion,Ae.mesh.scale),Ae.mesh.visible=!0,Ae.body.readFrom(Ae.mesh.position,Ae.mesh.quaternion),Ae.body.velocity.copy(Ae.kick).multiplyScalar(.55+.45*ue.ejectSpeed*.28),Ae.body.angularVelocity.set(N*9+3,J*7,le*11);$=!0,G=0,p.visible=!1,q.opacity=1,e.emit("camera:shake",{amount:ue.burstShake,duration:ue.shakeDur*.55}),e.emit("audio:cue",{id:"packet-burst",intensity:ut(.4+Le/5)}),z("burst",ue.maxFlight,I)}function we(I){e.emit("camera:shake",{amount:ue.impactShake,duration:ue.shakeDur}),e.emit("audio:cue",{id:"card-impact",intensity:ut(.3+Le/4)}),z("impact",ue.impactHold,I)}function ve(I){ee.active=!1,ke.copy(ee.position),it.copy(ee.quaternion),D.copy(ke).add(Et.heroPos).multiplyScalar(.5).add(Kt.set(0,ue.liftArc,.06)),Se=new li(ue.turnKeys),He=new li(ue.liftKeys),ft=new li(ue.spinKeys),Pe.reset(ue.turnDur),e.emit("audio:cue",{id:"reveal-turn",intensity:ut(.3+Le/4)}),z("turn",ue.turnDur,I)}function ne(I){ze.snap(L.position),Je.copy(L.quaternion),xe.set(0,0,0),e.emit("audio:cue",{id:"reveal-settled",intensity:ut(.3+Le/4)}),z("settle",0,I)}e.on("pull:committed",({positions:I})=>{I.length>0&&Y(I[0],0,ie)}),e.on("reveal:start",({position:I,index:N})=>{(te==="idle"||N!==$e)&&Y(I,N,ie),j.burst=!0}),e.on("reveal:impact",()=>{j.turn=!0}),e.on("reveal:settled",({position:I})=>{j.settle=!0}),e.on("pull:complete",()=>{j.settle=!0});let ie=0;function Ce(I,N){const J=Math.sin(I*.83)*.014+wt(I*.19,3)*.009,le=.5+.5*Math.sin(I*1.06);Kt.set(0,Et.packetY+J,0),be.step(Kt,3.4,N),p.position.copy(be.value),qi.set(.055+wt(I*.11,19)*.035,-.34+wt(I*.13,7)*.24,.028+wt(I*.09,41)*.02,"YXZ"),In.setFromEuler(qi),p.quaternion.slerp(In,1-Math.exp(-2.2*N));const Fe=1+le*.006;x.scale.set(Fe,1-le*.009,Fe),x.position.set(0,0,0),x.rotation.set(0,0,0),yn(Qe,.3+le*.45,4,N)}function Te(I,N){fe.advance(N);const J=fe.value("squash"),le=fe.value("tremor"),Fe=fe.value("glow"),Ae=fe.value("face");x.scale.set(1+.082*J,1-.15*J,1+.082*J),Kt.set(0,Et.packetY-.06*J,0),be.step(Kt,9,N),p.position.copy(be.value),qi.set(ot(.055,-.01,Ae),ot(-.34,-.08,Ae),ot(.028,0,Ae),"YXZ"),In.setFromEuler(qi),p.quaternion.slerp(In,1-Math.exp(-6*N));const Rt=le*.014;x.position.set(ui(I*47.3,Ge)*Rt,ui(I*53.1,Ge+11)*Rt*.7,ui(I*41.7,Ge+23)*Rt*.5),x.rotation.set(ui(I*44.9,Ge+31)*le*.03,ui(I*39.3,Ge+47)*le*.04,ui(I*51.7,Ge+59)*le*.03),yn(Qe,.35+Fe*ue.glow*3.4,14,N)}function de(I){Pe.advance(I);const N=Pe.u,J=Se.at(N),le=He.at(N),Fe=ft.at(N);ae(ke,D,Et.heroPos,le,L.position),In.slerpQuaternions(it,Be,Math.min(J,1.04)),ue.spinTurns>0&&Fe>1e-4&&(Nl.setFromAxisAngle(Kt.set(0,1,0),Fe*ue.spinTurns*Ig),In.multiply(Nl)),L.quaternion.copy(In),yn(Qe,ot(ue.glow*1.6,ue.glow*.5,N),3,I)}function Ue(I,N){const J=wt(I*.21,71,3);Kt.copy(Et.heroPos),Kt.y+=Math.sin(I*.72)*.012+J*.006,Kt.x+=wt(I*.17,131,2)*.008,ze.step(Kt,2.6,N),L.position.copy(ze.value),qi.set(-.045+wt(I*.15,211,2)*.03,.115+Math.sin(I*.41)*.055,.018+wt(I*.13,307,2)*.018,"YXZ"),In.setFromEuler(qi),wg(Je,xe,In,2.4,N),L.quaternion.copy(Je),yn(Qe,ue.glow*.45,2,N)}function U(I){G+=I;const N=1-ut((G-.22)/.55);q.opacity=Ko(N);for(const J of H)J.body.force.addScaledVector(V.gravity,J.body.mass),J.body.integrate(I),J.body.writeTo(J.mesh);if(N<=0){$=!1;for(const J of H)J.mesh.visible=!1}}function se(I){const J=window.__machine?.positions.find(le=>le.card.rarity===I);return J||{card:{id:1e3+I,name:"SEALED",host:"vault",urlHash:"0",hp:0,attack:0,speed:0,typeId:0,rarity:I,priceUsd:"0",latencyMs:0,alive:!0,network:"base"},backing:1,weight:1,standingBid:1}}function re(I,N){Z(),Y(se(I),0,ie),N.start&&(j.burst=!0),N.impact&&(j.turn=!0),N.settled&&(j.settle=!0)}return _n("idle",{apply:()=>Z(),settleFrames:110}),_n("charging",{apply:()=>re(4,{}),settleFrames:130}),_n("burst",{apply:()=>re(4,{start:!0}),settleFrames:142}),_n("reveal-turn",{apply:()=>re(4,{start:!0,impact:!0,settled:!0}),settleFrames:258}),_n("settled-legendary",{apply:()=>re(4,{start:!0,impact:!0,settled:!0}),settleFrames:360}),_n("settled-common",{apply:()=>re(0,{start:!0,impact:!0,settled:!0}),settleFrames:190}),_n("hero",{apply:()=>re(4,{start:!0,impact:!0,settled:!0}),settleFrames:360}),{name:"card-stage",update(I){switch(ie=I.frame,me+=I.dt,te){case"idle":Ce(I.elapsed,I.dt);break;case"charge":Te(I.elapsed,I.dt),fe.done&&j.burst&&ce(I.frame);break;case"burst":V.step(I.dt),ee.writeTo(L),(K||me>ue.maxFlight)&&we(I.frame);break;case"impact":V.step(I.dt),ee.writeTo(L),me>ue.impactHold&&j.turn&&ve(I.frame);break;case"turn":de(I.dt),Pe.done&&j.settle&&ne(I.frame);break;case"settle":Ue(I.elapsed,I.dt);break}$&&U(I.dt);const N=Qe.value;u.emissiveIntensity=.5+N*2.4,h.emissiveIntensity=.18+N*.9,d.opacity=ut(.18+N*.35),s.emissiveIntensity=.06+ut(N)*.22,o.emissiveIntensity=.03+ut(N)*.12;const J=te==="idle"||te==="charge"?p.position:L.position;De.speed=T.distanceTo(J)/Math.max(I.dt,1e-4),T.copy(J),De.x=J.x,De.y=J.y,De.z=J.z,e.emit("card:pose",De)},dispose(){i.scene.remove(t);for(const I of n)I.dispose()}};function ae(I,N,J,le,Fe){const Ae=1-le;return Fe.set(0,0,0).addScaledVector(I,Ae*Ae).addScaledVector(N,2*Ae*le).addScaledVector(J,le*le),Fe}}function Fg(i){const e=i(new er({color:13161704,roughness:.34,metalness:.9})),t=i(new er({color:9413832,roughness:.16,metalness:.82,clearcoat:1,clearcoatRoughness:.05,emissive:new Ee(10467032),emissiveIntensity:.1})),n=i(new er({color:1186352,roughness:.28,metalness:.92,clearcoat:1,clearcoatRoughness:.12,emissive:new Ee(10467032),emissiveIntensity:.05}));return[e,e,e,e,t,n]}function Ng(i){const e=Math.min(i.quality.maxParticles,4e3),t=new Float32Array(e*3),n=new Float32Array(e);for(let o=0;o<e;o++){const c=1.5+i.rng()*8,l=i.rng()*Math.PI*2;t[o*3]=Math.cos(l)*c,t[o*3+1]=i.rng()*5,t[o*3+2]=Math.sin(l)*c,n[o]=i.rng()}const r=new Nt;r.setAttribute("position",new Ft(t,3)),r.setAttribute("aSeed",new Ft(n,1));const a=new lu({size:.012,color:9418495,transparent:!0,opacity:.5,blending:Lr,depthWrite:!1,sizeAttenuation:!0}),s=new Sh(r,a);return s.frustumCulled=!1,i.scene.add(s),{name:"particles",update(o){const c=r.attributes.position,l=c.array;for(let u=0;u<e;u++)l[u*3+1]+=(.08+n[u]*.12)*o.dt,l[u*3+1]>5.2&&(l[u*3+1]=0);c.needsUpdate=!0},dispose(){i.scene.remove(s),r.dispose(),a.dispose()}}}const Ol=new C,kl=new C,Bl=new tn,zl=new At,Ma={x:0,y:0,z:0};function Og(i){const{camera:e,bus:t}=i,n=new Fa(e.position),r=new Fa(new C(0,Et.packetY,0)),a=Ra(0),s=Ra(1),o=Ra(e.position.length());let c=e.fov;const l=new C(0,Et.packetY,0),u=new C;let h="idle",d=0,p=0,x=La(0),g=!1;const m=new C,f=new C;let M=6,y=0,w=4,A=0;const b={pos:new C,look:new C,omega:2,roll:0,fov:1,range:1.2},R={distance:3,range:1.2};function F(v,P){y=Math.min(1,y+v),w=1/Math.max(P,.05),A=A+1|0}t.on("camera:shake",({amount:v,duration:P})=>F(v,P)),t.on("anim:beat",v=>{h=v.beat,d=0,p=v.duration,x=La(v.rarity),g=!1}),t.on("card:pose",v=>{l.set(v.x,v.y,v.z),v.speed});function S(v){const P=p>1e-4?ut(d/p):1,O=Et.heroPos;switch(h){case"idle":{b.pos.set(.34,1.5,3.62),b.look.set(0,Et.packetY-.04,0),b.omega=1.5,b.roll=-.008,b.fov=1,b.range=1.5;break}case"charge":{const L=nr.charge(P);b.pos.set(ot(.34,.12,L),ot(1.5,1.3,L),ot(3.62,3.62-x.camPush,L)),b.look.set(0,Et.packetY-.05*L,0),b.omega=ot(1.6,2.6,L),b.roll=ot(-.008,.014,L),b.fov=ot(1,.99,L),b.range=ot(1.5,.95,L);break}case"burst":{const L=Ko(ut(d/.42));b.pos.set(ot(.12,-.06,L),ot(1.3,1.56,L),ot(3.62-x.camPush,3.5,L)),b.look.copy(l),b.omega=5.2,b.roll=ot(.014,-.03,L),b.fov=ot(.99,1.02,L),b.range=1.1;break}case"impact":{const L=nr.arrive(ut(d/.3));b.pos.set(ot(-.06,.02,L),ot(1.56,1.14,L),ot(3.5,2.75,L)),b.look.copy(l).y+=.03,b.omega=6.5,b.roll=ot(-.03,.006,L),b.fov=1,b.range=.62;break}case"turn":{const L=Vr(P),q=x.camArc;b.pos.set(ot(-q,0,L),ot(O.y-.24,O.y+.02,L),O.z+ot(x.camHero+.6,x.camHero,nr.glide(P))),b.look.copy(l).lerp(O,.35*L),b.omega=ot(3.4,2.2,L),b.roll=Math.sin(P*Math.PI)*-.035*(.4+q),b.fov=ot(1,x.fovSqueeze,Math.sin(P*Math.PI*.85)),b.range=ot(.62,.34,L);break}case"settle":{b.pos.set(0,O.y+.02,O.z+x.camHero),b.look.copy(O),b.omega=2,b.roll=0,b.fov=ot(x.fovSqueeze,1,ut(d/1.2)),b.range=.34;break}}g&&(b.pos.copy(m),b.look.copy(f),b.omega=M)}return{name:"camera-rig",get focusDistance(){return o.value},get focusRange(){return b.range},moveTo(v,P,O=6){g=!0,m.copy(v),f.copy(P),M=O},releaseManual(){g=!1},shake(v,P){F(v,P)},resize(){c=e.fov/Math.max(s.value,.5)},update(v){d+=v.dt,S(v.dt),u.copy(l).sub(r.value).multiplyScalar(1/Math.max(v.dt,1e-4)),u.clampLength(0,8),n.step(b.pos,b.omega,v.dt),r.step(b.look,b.omega*1.35,v.dt),yn(a,b.roll,3.2,v.dt),yn(s,b.fov,3.6,v.dt);let P=0,O=0,L=0,q=0,H=0,G=0;if(y>0){y=Math.max(0,y-w*v.dt);const Le=y*y;Ag(v.elapsed*24.5,A*977+5,Ma),P=Ma.x*Le*.085,O=Ma.y*Le*.085,L=Ma.z*Le*.05,H=wt(v.elapsed*19.3,A*331+61,2)*Le*.028,G=wt(v.elapsed*21.7,A*557+13,2)*Le*.028,q=wt(v.elapsed*16.1,A*733+97,2)*Le*.045}let $=0,V=0,ee=0,te=0;i.deterministic||($=wt(v.elapsed*.37,101,3)*.012,V=wt(v.elapsed*.31+40,211,3)*.009,ee=wt(v.elapsed*.23+90,307,2)*.004,te=Math.sin(v.elapsed*.62)*.004),e.position.copy(n.value),e.position.x+=P+$,e.position.y+=O+V+te,e.position.z+=L,kl.copy(r.value),e.lookAt(kl),Bl.set(H,G,a.value+q+ee,"XYZ"),zl.setFromEuler(Bl),e.quaternion.multiply(zl);const me=c*s.value;Math.abs(e.fov-me)>1e-4&&(e.fov=me,e.updateProjectionMatrix()),Ol.copy(l).sub(e.position);const ue=Math.max(.2,Ol.length());yn(o,ue,7.5,v.dt),R.distance=o.value,R.range=b.range,t.emit("camera:focus",R)}}}const kg=JSON.parse('[{"id":1,"name":"auor full","host":"api.auor.io","urlHash":"0xf1a0ff5afe5b6487474e4aae2580f657e52eec5bdcd66642eaf54e85bccc805b","hp":108,"attack":41,"speed":74,"typeId":0,"rarity":1,"priceUsd":"0.04","latencyMs":397,"alive":true,"network":"eip155:8453"},{"id":2,"name":"auor public","host":"api.auor.io","urlHash":"0xbee54630c12f5d2971714141521f4147c82f55560df8bb38423173c948343a35","hp":113,"attack":14,"speed":89,"typeId":0,"rarity":0,"priceUsd":"0.0010","latencyMs":162,"alive":true,"network":"eip155:8453"},{"id":3,"name":"slamai price","host":"api.slamai.dev","urlHash":"0xd2e80d38fc8228ec23dbbb2665cbeb541db2d212cd80779772287f23fdf02387","hp":98,"attack":14,"speed":48,"typeId":0,"rarity":0,"priceUsd":"0.0010","latencyMs":781,"alive":true,"network":"base"},{"id":4,"name":"x-router generate","host":"api.x-router.ai","urlHash":"0x1b01e963edf3dcc2e37de0cc0cdff5573e6e5f9d1e599ba10c94eb71eed94dca","hp":56,"attack":22,"speed":75,"typeId":6,"rarity":0,"priceUsd":"0.0057","latencyMs":377,"alive":false,"network":"base"},{"id":5,"name":"emc2ai raw","host":"emc2ai.io","urlHash":"0xf2eba4faf7bb0ffc3bfb9fa2cfa96b195ea3393b8454fe4645feafe2c0e6cf57","hp":82,"attack":63,"speed":33,"typeId":0,"rarity":3,"priceUsd":"0.25","latencyMs":1011,"alive":true,"network":"base"},{"id":6,"name":"emc2ai raw 2","host":"emc2ai.io","urlHash":"0x81894d6d03bc07ebdfcc7405306377bb6bb4ebd9f68a702ba54326b5f3e8b038","hp":72,"attack":79,"speed":8,"typeId":0,"rarity":3,"priceUsd":"0.85","latencyMs":1434,"alive":true,"network":"base"},{"id":7,"name":"emc2ai top-tokens","host":"emc2ai.io","urlHash":"0xdf63f6e36f5f9b94273e298ddf31f225faa9a3b5b9b1c124717546b85525ba7d","hp":91,"attack":73,"speed":55,"typeId":0,"rarity":3,"priceUsd":"0.55","latencyMs":669,"alive":true,"network":"base"},{"id":8,"name":"gateway bafkreifoga2silttn6q","host":"gateway.grapevine.fyi","urlHash":"0xa86a7c8178a38daf836afcdc23b35551daf4df3c98fd0001856c6b45ddd2ebd1","hp":83,"attack":26,"speed":61,"typeId":0,"rarity":1,"priceUsd":"0.01","latencyMs":586,"alive":true,"network":"base"},{"id":9,"name":"library cryptoslate_list","host":"library.proofivy.com","urlHash":"0x5570753c0f4d5d06bba0249bb1690de7d6f33667241acd18d14914726469977a","hp":112,"attack":33,"speed":85,"typeId":0,"rarity":1,"priceUsd":"0.02","latencyMs":231,"alive":true,"network":"eip155:8453"},{"id":10,"name":"lowpaymentfee tvl","host":"lowpaymentfee.com","urlHash":"0x5f81c3115563e29d2c867cbfda986c9c638ccd9a5b909ccd9f4d9ae0829aac5d","hp":113,"attack":33,"speed":87,"typeId":0,"rarity":1,"priceUsd":"0.02","latencyMs":192,"alive":true,"network":"base"},{"id":11,"name":"lowpaymentfee 31","host":"lowpaymentfee.com","urlHash":"0x079fb686e687bab91d64810d68de7d5bb3dd4a53c3c0a4b47063b62af7e7f880","hp":100,"attack":33,"speed":53,"typeId":0,"rarity":1,"priceUsd":"0.02","latencyMs":711,"alive":true,"network":"base"},{"id":12,"name":"nacian top-pools-by-tvl","host":"nacian.finance","urlHash":"0xeab90c952dee40dfccf05fbb357cfc79a2fd5d524bba3d14e3af6b4190121f2c","hp":72,"attack":26,"speed":8,"typeId":0,"rarity":1,"priceUsd":"0.01","latencyMs":1412,"alive":true,"network":"base"},{"id":13,"name":"nittarab secret","host":"nittarab.dev","urlHash":"0x29cb8bc2241e266175f7aa7909730d6ffeb34b0c996b14d0edd81b661ddabfbb","hp":98,"attack":43,"speed":49,"typeId":0,"rarity":2,"priceUsd":"0.05","latencyMs":768,"alive":true,"network":"base"},{"id":14,"name":"padelmaps price","host":"padelmaps.org","urlHash":"0xfa4f2a03df406682232a9d8046da6c69999ed6d91fbd8560b07c6b44d8da60f7","hp":49,"attack":26,"speed":89,"typeId":6,"rarity":1,"priceUsd":"0.01","latencyMs":161,"alive":false,"network":"base"},{"id":15,"name":"padelmaps clubs","host":"padelmaps.org","urlHash":"0x1b08418d0128ea15a69d88e323ec94f67321793bea99095669e4dac10e581fe5","hp":42,"attack":26,"speed":56,"typeId":6,"rarity":1,"priceUsd":"0.01","latencyMs":665,"alive":false,"network":"base"},{"id":16,"name":"plush early-bird","host":"plush.fun","urlHash":"0x5ce09806d7dcd4a217ba32ef88dd3e79828362301cd8a8eaef45a8074a8ac422","hp":47,"attack":26,"speed":25,"typeId":6,"rarity":1,"priceUsd":"0.01","latencyMs":1123,"alive":false,"network":"base"},{"id":17,"name":"plush super-early-bird","host":"plush.fun","urlHash":"0xf637008ebf6ec6047e76de81f6f8b2a5f99f0704b87cc0f3ee6524f8d2b53af1","hp":46,"attack":26,"speed":24,"typeId":6,"rarity":1,"priceUsd":"0.01","latencyMs":1142,"alive":false,"network":"base"},{"id":18,"name":"public historical-token-pric","host":"public.zapper.xyz","urlHash":"0x05e1a72139ee9f9e03cb171e0e745a0d1e56a801ca79ec62c90fcd1ac80c9a8a","hp":42,"attack":18,"speed":97,"typeId":6,"rarity":0,"priceUsd":"0.0030","latencyMs":51,"alive":false,"network":"base"},{"id":19,"name":"public nft-balances","host":"public.zapper.xyz","urlHash":"0xe39d9a9baad5fcae4b8ac0e10ba5bcd22bef9d5bf46b58babcf25ae3f4914f51","hp":41,"attack":18,"speed":94,"typeId":6,"rarity":0,"priceUsd":"0.0030","latencyMs":86,"alive":false,"network":"base"},{"id":20,"name":"public nft-ranking","host":"public.zapper.xyz","urlHash":"0xc9bbad5089cb7a5d40d0ec02c3b012106e335b4469616360f7f236d48c14d8e6","hp":42,"attack":28,"speed":97,"typeId":6,"rarity":1,"priceUsd":"0.01","latencyMs":48,"alive":false,"network":"base"},{"id":21,"name":"public nft-token-metadata","host":"public.zapper.xyz","urlHash":"0x76471e7bfd7fa7ed6715f9d59e75cf29c0327a8dc52c9adc5dfe2eb06cfd70df","hp":41,"attack":18,"speed":95,"typeId":6,"rarity":0,"priceUsd":"0.0030","latencyMs":79,"alive":false,"network":"base"},{"id":22,"name":"public search","host":"public.zapper.xyz","urlHash":"0x930874d3c9a983c6173c2f5ecf5a566ffafae950c504547a68949d973cc911c6","hp":41,"attack":28,"speed":94,"typeId":6,"rarity":1,"priceUsd":"0.01","latencyMs":91,"alive":false,"network":"base"},{"id":23,"name":"public token-balances","host":"public.zapper.xyz","urlHash":"0x4cc14d087232dc36afea523c59bb7fb7d45c922ed309c449c5389c7c45d4f66a","hp":42,"attack":18,"speed":97,"typeId":6,"rarity":0,"priceUsd":"0.0030","latencyMs":50,"alive":false,"network":"base"},{"id":24,"name":"public token-price","host":"public.zapper.xyz","urlHash":"0x52dbc439e7d0a25bee69fb79d419c13aaa1edb36b34794ddad6e8e5a97baf74a","hp":41,"attack":18,"speed":92,"typeId":6,"rarity":0,"priceUsd":"0.0030","latencyMs":118,"alive":false,"network":"base"},{"id":25,"name":"public token-ranking","host":"public.zapper.xyz","urlHash":"0x5c3eff7600d392367068272fac99caee47a634af45ab0f2b09da67a9640202b5","hp":41,"attack":28,"speed":91,"typeId":6,"rarity":1,"priceUsd":"0.01","latencyMs":136,"alive":false,"network":"base"},{"id":26,"name":"public transaction-details","host":"public.zapper.xyz","urlHash":"0x1ac0dfd930e4862462c24e7bc0184c381e094b4baa0dc2d9f1a2c40b581814cd","hp":41,"attack":18,"speed":91,"typeId":6,"rarity":0,"priceUsd":"0.0030","latencyMs":132,"alive":false,"network":"base"},{"id":27,"name":"recoup-api-git-sweetmantech-","host":"recoup-api-git-sweetmantech-myc-4077-32a4e4-recoupable-ad724970.vercel.app","urlHash":"0x2be98cdc92c7bfb393188dc6f99f7ac11019ef559cac490f8e2d3ef14c593db3","hp":54,"attack":26,"speed":66,"typeId":6,"rarity":1,"priceUsd":"0.01","latencyMs":514,"alive":false,"network":"base"},{"id":28,"name":"recoup-rketqmcdu-recoupable-","host":"recoup-rketqmcdu-recoupable-ad724970.vercel.app","urlHash":"0xff7991f8eafa3f332e2a739ec3dd9f1e87937a0cbb9327eee779e36aaa54edf9","hp":92,"attack":27,"speed":31,"typeId":0,"rarity":1,"priceUsd":"0.01","latencyMs":1034,"alive":true,"network":"base"},{"id":29,"name":"silverback-x402 agent-discov","host":"silverback-x402.onrender.com","urlHash":"0x0a6de9847072cd82844c7848968db8d031f7df0e902d4008707f71300ef6336c","hp":114,"attack":16,"speed":90,"typeId":4,"rarity":0,"priceUsd":"0.0020","latencyMs":147,"alive":true,"network":"eip155:8453"},{"id":30,"name":"silverback-x402 agent-reputa","host":"silverback-x402.onrender.com","urlHash":"0xc4077943f1a686a98e4f14f7df0e20d60d644b91627a1912a8657ff2450b66c5","hp":113,"attack":14,"speed":89,"typeId":4,"rarity":0,"priceUsd":"0.0010","latencyMs":167,"alive":true,"network":"eip155:8453"},{"id":31,"name":"silverback-x402 arbitrage-sc","host":"silverback-x402.onrender.com","urlHash":"0xe7562f6fa050818fa4e74ab65b81dfd93ede9f9db262218490a010241bac000f","hp":116,"attack":33,"speed":96,"typeId":4,"rarity":1,"priceUsd":"0.02","latencyMs":63,"alive":true,"network":"eip155:8453"},{"id":32,"name":"silverback-x402 correlation-","host":"silverback-x402.onrender.com","urlHash":"0x96e940a6e3562f4a9b534d944bb9519fcac564368cbe9d0a7e98de99706cc88a","hp":115,"attack":21,"speed":95,"typeId":4,"rarity":0,"priceUsd":"0.0050","latencyMs":81,"alive":true,"network":"eip155:8453"},{"id":33,"name":"silverback-x402 defi-yield","host":"silverback-x402.onrender.com","urlHash":"0x92b8a1d56b18da53fab4599bcd81fe08967d6c6d815954a5cfd4136cda07f55e","hp":109,"attack":33,"speed":78,"typeId":4,"rarity":1,"priceUsd":"0.02","latencyMs":326,"alive":true,"network":"eip155:8453"},{"id":34,"name":"silverback-x402 gas-price","host":"silverback-x402.onrender.com","urlHash":"0x8ab514a161cb8079e08b1d0dd42d8cd8ae19c59f484e26cf5ae2c07471d801b6","hp":115,"attack":14,"speed":94,"typeId":4,"rarity":0,"priceUsd":"0.0010","latencyMs":84,"alive":true,"network":"eip155:8453"},{"id":35,"name":"silverback-x402 pool-analysi","host":"silverback-x402.onrender.com","urlHash":"0x8a2246e7b3caf0cdaec999c90ce14c40109663c49209f98ab9cc2cce4f106553","hp":114,"attack":21,"speed":90,"typeId":4,"rarity":0,"priceUsd":"0.0050","latencyMs":151,"alive":true,"network":"eip155:8453"},{"id":36,"name":"silverback-x402 swap-quote","host":"silverback-x402.onrender.com","urlHash":"0xacf70162bfa46cc3f1f9605ce703c8f761f5e46b41c7cd8fdb5aa071a80a88b2","hp":111,"attack":16,"speed":84,"typeId":1,"rarity":0,"priceUsd":"0.0020","latencyMs":244,"alive":true,"network":"eip155:8453"},{"id":37,"name":"silverback-x402 technical-an","host":"silverback-x402.onrender.com","urlHash":"0x96004f4ad25e2a9d20213119b27df34ef63dc3ce3c9bb6f4542b2aadb5e79983","hp":115,"attack":33,"speed":92,"typeId":4,"rarity":1,"priceUsd":"0.02","latencyMs":120,"alive":true,"network":"eip155:8453"},{"id":38,"name":"silverback-x402 token-audit","host":"silverback-x402.onrender.com","urlHash":"0x0f67418914d3cca24069653818323ee12c03691f39c73c6b7a13b63ff0848c94","hp":116,"attack":26,"speed":96,"typeId":4,"rarity":1,"priceUsd":"0.01","latencyMs":64,"alive":true,"network":"eip155:8453"},{"id":39,"name":"silverback-x402 top-coins","host":"silverback-x402.onrender.com","urlHash":"0x4f251c58920dc6203d08b7f59ae1a106b53bdbbc4421fbc1ed2960f4d5d92ebb","hp":114,"attack":14,"speed":92,"typeId":4,"rarity":0,"priceUsd":"0.0010","latencyMs":122,"alive":true,"network":"eip155:8453"},{"id":40,"name":"silverback-x402 top-pools","host":"silverback-x402.onrender.com","urlHash":"0xa73559ed84acd4a2c1e7ab78b80d91780c65ab7ad2dbfb270bdfa7ac4b6b3230","hp":115,"attack":14,"speed":94,"typeId":4,"rarity":0,"priceUsd":"0.0010","latencyMs":91,"alive":true,"network":"eip155:8453"},{"id":41,"name":"silverback-x402 top-protocol","host":"silverback-x402.onrender.com","urlHash":"0x5fb52ad43b66a7c59ea12629f480cfaf545cb1561014bbdefc04466ede6bf56e","hp":116,"attack":14,"speed":95,"typeId":4,"rarity":0,"priceUsd":"0.0010","latencyMs":80,"alive":true,"network":"eip155:8453"},{"id":42,"name":"silverback-x402 whale-moves","host":"silverback-x402.onrender.com","urlHash":"0x9197247130749ac86a7746fe2d2b8875074bc8d9897dd12f4182ed2a7a361fba","hp":113,"attack":26,"speed":89,"typeId":4,"rarity":1,"priceUsd":"0.01","latencyMs":166,"alive":true,"network":"eip155:8453"},{"id":43,"name":"sportsarbitrageapi-productio","host":"sportsarbitrageapi-production.up.railway.app","urlHash":"0x4b32f6f1a8f561a489c8cd4b2e5b801f56d3b2f402f87c75791849c3894d3e6e","hp":111,"attack":37,"speed":83,"typeId":0,"rarity":1,"priceUsd":"0.03","latencyMs":257,"alive":true,"network":"eip155:8453"},{"id":44,"name":"staging early-bird","host":"staging.plush.fun","urlHash":"0xc7b77043f158298663788abe43a0c6566bbb6bb4f6c3213f8d529f4c14d3201b","hp":57,"attack":26,"speed":77,"typeId":6,"rarity":1,"priceUsd":"0.01","latencyMs":340,"alive":false,"network":"base"},{"id":45,"name":"staging super-early-bird","host":"staging.plush.fun","urlHash":"0x58a54e9ee16377d19fb3a7bb0e966d6809498a568aa028abf1c94a95d1cac442","hp":50,"attack":26,"speed":45,"typeId":6,"rarity":1,"priceUsd":"0.01","latencyMs":830,"alive":false,"network":"base"},{"id":46,"name":"genbase create","host":"www.genbase.fun","urlHash":"0x5dbbcf6953e48613982180bffe40c60a7262857e7a0d8dde3bc7c289376c46ba","hp":116,"attack":33,"speed":97,"typeId":0,"rarity":1,"priceUsd":"0.02","latencyMs":50,"alive":true,"network":"base"},{"id":47,"name":"genbase create-xai","host":"www.genbase.fun","urlHash":"0x45a476b02c4f4d3a609ce2d3f91e8be95465ceec092b85036a352a909969e89f","hp":108,"attack":43,"speed":74,"typeId":0,"rarity":2,"priceUsd":"0.05","latencyMs":395,"alive":true,"network":"base"},{"id":48,"name":"luckymint mint","host":"www.luckymint.xyz","urlHash":"0xabf55406675ddb0d62cf70f06e981d93b7847442c8bdac047cc5403d9cb52000","hp":112,"attack":81,"speed":86,"typeId":0,"rarity":4,"priceUsd":"1.00","latencyMs":203,"alive":true,"network":"base"},{"id":49,"name":"shirt from-image","host":"www.shirt.sh","urlHash":"0x1927ff64df0b95d45052447b34f00f1e93f9c958cea57861db7b6f8c34495f07","hp":49,"attack":99,"speed":39,"typeId":6,"rarity":4,"priceUsd":"20.00","latencyMs":913,"alive":false,"network":"eip155:8453"},{"id":50,"name":"x402-ai-starter-topaz-seven","host":"x402-ai-starter-topaz-seven.vercel.app","urlHash":"0x75c7a4eb054d4574dc6ab65608c2dcaa83db80acad582978d44067fca1462ff5","hp":60,"attack":14,"speed":93,"typeId":6,"rarity":0,"priceUsd":"0.0010","latencyMs":100,"alive":false,"network":"base-sepolia"},{"id":51,"name":"x402-ai-starter add","host":"x402-ai-starter.vercel.app","urlHash":"0xddd87a59415eb729b59687417be6d57a609a2c4cee85079dd896094967e4cf4f","hp":89,"attack":21,"speed":23,"typeId":5,"rarity":0,"priceUsd":"0.0050","latencyMs":1148,"alive":true,"network":"base-sepolia"},{"id":52,"name":"x402-cybercentry-web-applica","host":"x402-cybercentry-web-application-verification.up.railway.app","urlHash":"0x71a08a22ea628ffdcdd1682ef36510fc23ac74886a48e3124fbdbf27c118f080","hp":114,"attack":33,"speed":91,"typeId":0,"rarity":1,"priceUsd":"0.02","latencyMs":129,"alive":true,"network":"base"},{"id":53,"name":"x402-demo-discovery-endpoint","host":"x402-demo-discovery-endpoint.vercel.app","urlHash":"0x2cfac83d72a0d12553ebc8672c515f26b99699f85f426ead8d7324d0bfc55ed2","hp":114,"attack":14,"speed":91,"typeId":0,"rarity":0,"priceUsd":"0.0010","latencyMs":132,"alive":true,"network":"base"},{"id":54,"name":"x402-mainnet protected","host":"x402-mainnet.vercel.app","urlHash":"0xa1753c48b1399f308e37e268270b7bd3dec7dfa1252639c08c752a48eac5960d","hp":92,"attack":14,"speed":33,"typeId":0,"rarity":0,"priceUsd":"0.0010","latencyMs":1001,"alive":true,"network":"base"},{"id":55,"name":"x402-tools horoscope","host":"x402-tools.vercel.app","urlHash":"0x55e891cd5b144d32577eaeadbc7a0888f22a8d68f0573ef9628ab0c873304ef4","hp":112,"attack":26,"speed":86,"typeId":0,"rarity":1,"priceUsd":"0.01","latencyMs":211,"alive":true,"network":"base"},{"id":56,"name":"911fund deep","host":"x402.911fund.io","urlHash":"0xd80facaff181435bd216ecdc8608f3444c8e4f3227878aeb06c5d5137cb22f5c","hp":110,"attack":57,"speed":81,"typeId":0,"rarity":2,"priceUsd":"0.15","latencyMs":287,"alive":true,"network":"base"},{"id":57,"name":"911fund search","host":"x402.911fund.io","urlHash":"0x502d5f5d4de04abfca9d3a1d8ac5e3d743365a455e751fb7d75bfec2a311c8d5","hp":116,"attack":37,"speed":95,"typeId":0,"rarity":1,"priceUsd":"0.03","latencyMs":79,"alive":true,"network":"base"},{"id":58,"name":"911fund sentiment","host":"x402.911fund.io","urlHash":"0xaedb320b24f546472eab6a585123e472b978a6051edd2d958e286a68b6cf435b","hp":111,"attack":49,"speed":82,"typeId":0,"rarity":2,"priceUsd":"0.08","latencyMs":269,"alive":true,"network":"base"},{"id":59,"name":"911fund token","host":"x402.911fund.io","urlHash":"0x5fa35317755a29d0b96bbfbb4df0efd54591d3dcc591f09b667b722c73d1fb79","hp":115,"attack":33,"speed":94,"typeId":0,"rarity":1,"priceUsd":"0.02","latencyMs":84,"alive":true,"network":"base"},{"id":60,"name":"911fund trending","host":"x402.911fund.io","urlHash":"0xfa9b4a4392c057680b55c9336422ec7a74a6f7cdee344e66e02e5ceab8d1caf4","hp":115,"attack":33,"speed":94,"typeId":0,"rarity":1,"priceUsd":"0.02","latencyMs":83,"alive":true,"network":"base"},{"id":61,"name":"blackswan flare","host":"x402.blackswan.wtf","urlHash":"0x73ce5b087c12a00ef519d20d97aac5c795ae422a53efb30756982b23decadf31","hp":108,"attack":26,"speed":75,"typeId":0,"rarity":1,"priceUsd":"0.01","latencyMs":376,"alive":true,"network":"eip155:8453"},{"id":62,"name":"browserbase create","host":"x402.browserbase.com","urlHash":"0x3e95b6e6cb30b0584306744b8e36513858b0488c08f8e3ed5fbf6d74595afb06","hp":89,"attack":16,"speed":24,"typeId":0,"rarity":0,"priceUsd":"0.0020","latencyMs":1137,"alive":true,"network":"base"},{"id":63,"name":"creative-tim shadcn-block","host":"x402.creative-tim.com","urlHash":"0xbdf485f881e941abb3682f43571b0c2254afccb3e3c3cd0a2cbd735fcf3c6477","hp":88,"attack":26,"speed":20,"typeId":0,"rarity":1,"priceUsd":"0.01","latencyMs":1195,"alive":true,"network":"eip155:8453"},{"id":64,"name":"onchainexpat token-metadata","host":"x402.onchainexpat.com","urlHash":"0xc1ea4c866a3b792495a175aaf372982c71ee9d772bf993b6066dc148673b6039","hp":44,"attack":33,"speed":65,"typeId":6,"rarity":1,"priceUsd":"0.02","latencyMs":519,"alive":false,"network":"base"},{"id":65,"name":"ottoai crypto-news","host":"x402.ottoai.services","urlHash":"0x2a23bcc39ea3d35eafe8ee8722b949af2e3179733c22a18755e94619efbd8a86","hp":109,"attack":26,"speed":77,"typeId":1,"rarity":1,"priceUsd":"0.01","latencyMs":344,"alive":true,"network":"eip155:8453"},{"id":66,"name":"ottoai trending-altcoins","host":"x402.ottoai.services","urlHash":"0x2a63413423a726a42f3cf0f54ca9cf9a163d3996dd10222a4b740d42f8e7d6ed","hp":104,"attack":43,"speed":64,"typeId":1,"rarity":2,"priceUsd":"0.05","latencyMs":544,"alive":true,"network":"eip155:8453"},{"id":67,"name":"ottoai yield-alpha","host":"x402.ottoai.services","urlHash":"0x0971c449fe0b47dc84b33aa3c16c9556ee4f0c875db416aa417ab6b0097d531d","hp":101,"attack":26,"speed":56,"typeId":1,"rarity":1,"priceUsd":"0.01","latencyMs":664,"alive":true,"network":"eip155:8453"},{"id":68,"name":"silverbackdefi agent-discove","host":"x402.silverbackdefi.app","urlHash":"0x3ac920f7a4976f7990fde5fcfe36bffd3f6c7880f7f8586516e79b7d3b62d39c","hp":115,"attack":16,"speed":93,"typeId":4,"rarity":0,"priceUsd":"0.0020","latencyMs":103,"alive":true,"network":"eip155:8453"},{"id":69,"name":"silverbackdefi agent-reputat","host":"x402.silverbackdefi.app","urlHash":"0xe828875e04facb74900e76c22cfe46e629e959f53b3065f4ce9516e968fde19d","hp":116,"attack":14,"speed":96,"typeId":4,"rarity":0,"priceUsd":"0.0010","latencyMs":67,"alive":true,"network":"eip155:8453"},{"id":70,"name":"silverbackdefi arbitrage-sca","host":"x402.silverbackdefi.app","urlHash":"0xde4e30fb157497635a375e8cddb49ef0efe9af439d057c95beb4cd3c6c8a2afd","hp":113,"attack":33,"speed":87,"typeId":4,"rarity":1,"priceUsd":"0.02","latencyMs":192,"alive":true,"network":"eip155:8453"},{"id":71,"name":"silverbackdefi backtest","host":"x402.silverbackdefi.app","urlHash":"0x7654552c97560ddaa291e53b57e26a2c9f6e8fff5417460fa675f8ff45d8b9b8","hp":116,"attack":52,"speed":96,"typeId":4,"rarity":2,"priceUsd":"0.10","latencyMs":55,"alive":true,"network":"eip155:8453"},{"id":72,"name":"silverbackdefi correlation-m","host":"x402.silverbackdefi.app","urlHash":"0x7c732290cf54453db5eda30e76789e2e41c8a30d41ad456aa9c3075d8989df81","hp":113,"attack":21,"speed":87,"typeId":4,"rarity":0,"priceUsd":"0.0050","latencyMs":195,"alive":true,"network":"eip155:8453"},{"id":73,"name":"silverbackdefi defi-yield","host":"x402.silverbackdefi.app","urlHash":"0xadf06f9fb90c163f571e3048bf30bec64e77fda44b7759db059e8adab33e1d75","hp":116,"attack":33,"speed":96,"typeId":4,"rarity":1,"priceUsd":"0.02","latencyMs":60,"alive":true,"network":"eip155:8453"},{"id":74,"name":"silverbackdefi gas-price","host":"x402.silverbackdefi.app","urlHash":"0x24a98b5406ba14579ac17cca9cd5e3c7420be4efe3f9da201030d59ab744d6a7","hp":112,"attack":14,"speed":86,"typeId":4,"rarity":0,"priceUsd":"0.0010","latencyMs":205,"alive":true,"network":"eip155:8453"},{"id":75,"name":"silverbackdefi pool-analysis","host":"x402.silverbackdefi.app","urlHash":"0x532aec9e42016a097be8e449f28c9c4e5644fdd0d1925f3d23423d003ebad711","hp":110,"attack":21,"speed":81,"typeId":4,"rarity":0,"priceUsd":"0.0050","latencyMs":281,"alive":true,"network":"eip155:8453"},{"id":76,"name":"silverbackdefi swap-quote","host":"x402.silverbackdefi.app","urlHash":"0x20123d3f86fcac43a98d125385f27f54c174243ea64be19ec1446971e68138f5","hp":112,"attack":16,"speed":84,"typeId":1,"rarity":0,"priceUsd":"0.0020","latencyMs":233,"alive":true,"network":"eip155:8453"},{"id":77,"name":"silverbackdefi technical-ana","host":"x402.silverbackdefi.app","urlHash":"0x37f95f3d42bf1dc1252ee0d20a05148213dccd58b1a535f559f931ed33b6ec9b","hp":111,"attack":33,"speed":83,"typeId":4,"rarity":1,"priceUsd":"0.02","latencyMs":254,"alive":true,"network":"eip155:8453"},{"id":78,"name":"silverbackdefi token-audit","host":"x402.silverbackdefi.app","urlHash":"0xc5de9dcdc56e03b11ce4aead5ae5ba070c77b41b6522d747951346a9393e127c","hp":116,"attack":26,"speed":95,"typeId":4,"rarity":1,"priceUsd":"0.01","latencyMs":71,"alive":true,"network":"eip155:8453"},{"id":79,"name":"silverbackdefi top-coins","host":"x402.silverbackdefi.app","urlHash":"0xa444b529d9cd3c15754fe760b8b4627db0d8b13562bcd098482b63139181549c","hp":115,"attack":14,"speed":94,"typeId":4,"rarity":0,"priceUsd":"0.0010","latencyMs":89,"alive":true,"network":"eip155:8453"},{"id":80,"name":"silverbackdefi top-pools","host":"x402.silverbackdefi.app","urlHash":"0x6c153ed94476b5b8ba8593f036f29302ec647c1fce350a0c813a1952fa565379","hp":116,"attack":14,"speed":95,"typeId":4,"rarity":0,"priceUsd":"0.0010","latencyMs":72,"alive":true,"network":"eip155:8453"},{"id":81,"name":"silverbackdefi top-protocols","host":"x402.silverbackdefi.app","urlHash":"0xc1fbd2deaef389fd64fc38bc8d3f21a4098cfdf57253f0e72fcbc59be87c11ff","hp":114,"attack":14,"speed":90,"typeId":4,"rarity":0,"priceUsd":"0.0010","latencyMs":145,"alive":true,"network":"eip155:8453"},{"id":82,"name":"silverbackdefi trending-toke","host":"x402.silverbackdefi.app","urlHash":"0x8c0407cb67c259f9add0289856c852168f77c360c5fd38eac15f98bdb7925cbc","hp":115,"attack":14,"speed":93,"typeId":4,"rarity":0,"priceUsd":"0.0010","latencyMs":102,"alive":true,"network":"eip155:8453"},{"id":83,"name":"silverbackdefi whale-moves","host":"x402.silverbackdefi.app","urlHash":"0x3fdc579c9d3497dc17c66b7135cc28dd71506dd88e5fd7bb3fa13454ae3f7546","hp":116,"attack":26,"speed":96,"typeId":4,"rarity":1,"priceUsd":"0.01","latencyMs":58,"alive":true,"network":"eip155:8453"},{"id":84,"name":"slinkylayer content-detect-s","host":"x402.slinkylayer.ai","urlHash":"0x0d574bd72ba200250dd6264f76e87c5437bb9c6a81e7004a7f7a6ca0eb3950c9","hp":42,"attack":52,"speed":52,"typeId":6,"rarity":2,"priceUsd":"0.10","latencyMs":726,"alive":false,"network":"base"},{"id":85,"name":"slinkylayer text-anonymize","host":"x402.slinkylayer.ai","urlHash":"0x43ba0e581854652aeaee3bd437a1129c261c0816f57fb90967eab72b2972194d","hp":42,"attack":43,"speed":52,"typeId":6,"rarity":2,"priceUsd":"0.05","latencyMs":723,"alive":false,"network":"base"},{"id":86,"name":"slinkylayer entity-sentiment","host":"x402.slinkylayer.ai","urlHash":"0x4becc2a6c7bd5c77e748ac1544f969925a0044592eed19d7c77ba65cc82b2aa1","hp":42,"attack":43,"speed":51,"typeId":6,"rarity":2,"priceUsd":"0.05","latencyMs":739,"alive":false,"network":"base"},{"id":87,"name":"x402factory bridge","host":"x402factory.ai","urlHash":"0xa23110cf66b5274a0e7e7803897efcc5095644e73736957cf59f0e1642c44bb9","hp":105,"attack":81,"speed":67,"typeId":0,"rarity":4,"priceUsd":"1.00","latencyMs":499,"alive":true,"network":"base"},{"id":88,"name":"x402factory tts","host":"x402factory.ai","urlHash":"0xec70d36343b226dc7fdd03d7536b27e8e4730a22cf88d276bcce9059caeb5f52","hp":94,"attack":66,"speed":90,"typeId":0,"rarity":3,"priceUsd":"0.30","latencyMs":152,"alive":true,"network":"base"},{"id":89,"name":"x402factory xprofile","host":"x402factory.ai","urlHash":"0x20913c9e6f6c414d8fd2886862a5d5f8c93f021d1d238b2e3671410626c8a96f","hp":93,"attack":14,"speed":88,"typeId":0,"rarity":0,"priceUsd":"0.0010","latencyMs":174,"alive":true,"network":"base"},{"id":90,"name":"x402repo chat","host":"x402repo.vercel.app","urlHash":"0x84f440615f5c84aea825bc0abad250dd0bbf4bf72ceea1ed028650accc3ffe44","hp":111,"attack":16,"speed":83,"typeId":0,"rarity":0,"priceUsd":"0.0020","latencyMs":256,"alive":true,"network":"base"}]'),Bg=kg,Hl=10000n,Na={MAX_FEE_BPS:500n,FEE_BPS:250n,MIN_BACKING:10000000000000000n};function zg(i){let e=0n,t=0n;for(const n of i)e+=n,t+=n*n;return{s1:e,s2:t,count:i.length}}function Hg(i){return i.s1===0n?0n:i.s2/i.s1}function Vg(i,e=Na.FEE_BPS){const t=Hg(i);return t===0n?0n:t*(Hl+Gg(e))/Hl}function Gg(i){return i>Na.MAX_FEE_BPS?Na.MAX_FEE_BPS:i}class Wg{tree;size;constructor(e){this.size=e.length,this.tree=new Array(this.size+1).fill(0n);for(let t=0;t<e.length;t++)this.add(t,e[t])}add(e,t){for(let n=e+1;n<=this.size;n+=n&-n)this.tree[n]+=t}total(){return this.prefix(this.size)}prefix(e){let t=0n;for(let n=e;n>0;n-=n&-n)t+=this.tree[n];return t}findByWeight(e){let t=0,n=e,r=1;for(;r<<1<=this.size;)r<<=1;for(;r>0;r>>=1){const a=t+r;a<=this.size&&this.tree[a]<=n&&(t=a,n-=this.tree[a])}return t}}function Xg(i,e){const t=i.total();return t===0n?-1:i.findByWeight(e%t)}function qg(i){const e=[];let t=0n;const n=i.map(r=>{const a=Math.max(Number.parseFloat(r.priceUsd)||.001,5e-4),s=1+600/Math.max(r.latencyMs,60),o=r.alive?1:.55,c=1+r.rarity*.9,l=.02*a*40*s*o*c,u=BigInt(Math.max(Math.round(l*1e18),Number(Na.MIN_BACKING)));return{card:r,wei:u}});for(const r of n)t+=r.wei;for(const r of n)e.push({card:r.card,backing:Number(r.wei)/1e18,weight:t===0n?0:Number(r.wei)/Number(t),standingBid:Number(r.wei)/1e18});return e}function Pu(i){return BigInt(Math.round(i.backing*1e18))}function Yg(i){const e=[0,0,0,0,0];for(const t of i)e[t.card.rarity]+=t.weight;return e}function jg(i,e){const t=gu(e),n=new Wg(i.map(Pu)),r=n.total(),a=BigInt(Math.floor(t()*Number.MAX_SAFE_INTEGER))%(r===0n?1n:r);return{index:Xg(n,a),word:a}}function Kg(i){const e=qg(Bg),t=zg(e.map(Pu));let n=!1;function r(s){const{index:o}=jg(e,s);return e[Math.max(o,0)]}async function a(s,o){if(n)return;n=!0;const c=o??Math.floor(i.rng()*4294967295),l=[];for(let u=0;u<s;u++)l.push(r(c+u*2654435769));i.bus.emit("pull:committed",{seed:c,positions:l});for(let u=0;u<l.length;u++)i.bus.emit("reveal:start",{position:l[u],index:u,total:l.length}),await Fs(i.deterministic?0:900),i.bus.emit("reveal:impact",{position:l[u],index:u}),await Fs(i.deterministic?0:450),i.bus.emit("reveal:settled",{position:l[u],index:u}),await Fs(i.deterministic?0:1200);i.bus.emit("pull:complete",{positions:l}),n=!1}return i.bus.on("pull:requested",({count:s})=>void a(s)),_n("reveal-legendary",{apply:()=>{const s=e.find(o=>o.card.rarity===4)??e[0];i.bus.emit("reveal:start",{position:s,index:0,total:1}),i.bus.emit("reveal:impact",{position:s,index:0}),i.bus.emit("reveal:settled",{position:s,index:0})},settleFrames:100}),_n("reveal-common",{apply:()=>{const s=e.find(o=>o.card.rarity===0)??e[0];i.bus.emit("reveal:start",{position:s,index:0,total:1}),i.bus.emit("reveal:impact",{position:s,index:0}),i.bus.emit("reveal:settled",{position:s,index:0})},settleFrames:100}),{name:"gacha-machine",positions:e,price:()=>Vg(t),odds:()=>Yg(e),pull:a,drawFor:r,update(){}}}function Fs(i){return new Promise(e=>setTimeout(e,i))}function $g(){return{name:"hud-stub",update(){},resize(){},dispose(){}}}function Zg(i){let e=null,t=null;function n(){return i.deterministic?null:(e||(e=new AudioContext,t=e.createGain(),t.gain.value=.35,t.connect(e.destination)),e.state==="suspended"&&e.resume(),e)}function r(a,s,o="sine"){const c=n();if(!c||!t)return;const l=c.createOscillator(),u=c.createGain();l.type=o,l.frequency.setValueAtTime(a,c.currentTime),u.gain.setValueAtTime(0,c.currentTime),u.gain.linearRampToValueAtTime(.6,c.currentTime+.01),u.gain.exponentialRampToValueAtTime(1e-4,c.currentTime+s),l.connect(u).connect(t),l.start(),l.stop(c.currentTime+s+.02)}return window.addEventListener("pointerdown",()=>n(),{once:!0}),i.bus.on("reveal:impact",({position:a})=>{r(220+a.card.rarity*110,.5+a.card.rarity*.2,"triangle")}),i.bus.on("pull:committed",()=>r(120,.35,"sawtooth")),{name:"audio",update(){},dispose(){e?.close()}}}function Jg(i,e){const n=[];let r=3,a=Es.indexOf(i.quality.tier);function s(o){a=o,Object.assign(i.quality,ji(Es[a])),i.renderer.setPixelRatio(Math.min(window.devicePixelRatio,i.quality.pixelRatio)),e.applyQuality(),i.bus.emit("quality:changed",{settings:i.quality}),r=5,n.length=0}return{name:"adaptive-quality",update(o){if(i.deterministic||(n.push(o.dt),n.length<90))return;if(r>0){r--,n.length=0;return}const c=n.slice().sort((u,h)=>u-h),l=c[c.length>>1];n.length=0,l>1/45&&a>0?s(a-1):l<1/110&&a<Es.length-1&&s(a+1)}}}const Du=document.getElementById("stage");document.getElementById("ui");const Oa=new URLSearchParams(location.search),Qg=Oa.has("shot")||Oa.has("seed"),ev=Oa.has("seed")?Ax(Oa.get("seed")):Math.random()*4294967295>>>0,Uu=Tx(),ka=Sx(Du,Uu),tv=new cu,Ir=new zt(38,1,.05,200);Ir.position.set(0,1.35,4.2);const Xt={renderer:ka,scene:tv,camera:Ir,canvas:Du,quality:Uu,bus:yx(),rng:gu(ev),size:{width:1,height:1},deterministic:Qg},$o=[];function kn(i){return $o.push(i),i}kn(xg(Xt));kn(mg(Xt));kn(Lg(Xt));kn(Ng(Xt));kn(Og(Xt));kn(Zg(Xt));const nv=kn(Kg(Xt));window.__machine=nv;kn($g());const Xa=Zx(Xt);kn(Jg(Xt,Xa));function Iu(){const i=Math.max(1,window.innerWidth),e=Math.max(1,window.innerHeight);Xt.size.width=i,Xt.size.height=e,ka.setPixelRatio(Math.min(window.devicePixelRatio,Xt.quality.pixelRatio)),ka.setSize(i,e,!1),Ir.aspect=i/e,Ir.fov=e>i?52:38,Ir.updateProjectionMatrix(),Xa.resize(i,e);for(const t of $o)t.resize?.(i,e)}window.addEventListener("resize",Iu,{passive:!0});Iu();const Lu=new Lh,fi={dt:0,elapsed:0,frame:0};let Ba=!1;function Zo(){if(Ur.frozen){Ba=!1;return}requestAnimationFrame(Zo);const i=Lu.getDelta();fi.dt=Xt.deterministic?1/60:Math.min(i,1/20),fi.elapsed+=fi.dt,fi.frame++,ka.info.reset();for(const e of $o)e.update(fi);Xa.render(fi)}Ur.resume=()=>{Ba||(Ba=!0,Lu.getDelta(),requestAnimationFrame(Zo))};Xt.bus.emit("scene:ready",{});gg(Xt,Xa,fi);Ba=!0;Zo();
