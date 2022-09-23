(()=>{"use strict";var a,b={};function c(a,b){return`${a}:${b}`}function d(a){let[b,d]=a.p.split(".");return{userId:a.u,presenceKey:c(a.u,b),connectionCount:Number(d),metadata:a.m||[]}}function e(a){return a.startsWith("presence-")}class PresenceChannel{constructor(){this.presenceItems=new Map}shouldUsePresenceItem(a){let b=this.presenceItems.get(a.presenceKey);return!b||b.connectionCount<=a.connectionCount}addPresenceItem(a){this.shouldUsePresenceItem(a)&&this.presenceItems.set(a.presenceKey,a)}removePresenceItem(a){this.shouldUsePresenceItem(a)&&this.presenceItems.delete(a.presenceKey)}replacePresenceItems(a){for(let b of(this.presenceItems.clear(),a))this.addPresenceItem(b)}getPresenceItems(){return Array.from(this.presenceItems.values())}}class AlivePresence{constructor(){this.presenceChannels=new Map}getPresenceChannel(a){let b=this.presenceChannels.get(a)||new PresenceChannel;return this.presenceChannels.set(a,b),b}handleMessage(a,b){let c=this.getPresenceChannel(a);switch(b.e){case"pf":c.replacePresenceItems(b.d.map(d));break;case"pa":c.addPresenceItem(d(b.d));break;case"pr":c.removePresenceItem(d(b.d))}return this.getChannelItems(a)}getChannelItems(a){let b=this.getPresenceChannel(a);return b.getPresenceItems()}clearChannel(a){this.presenceChannels.delete(a)}}function f(a){return Object.assign(Object.assign({},a),{isLocal:!0})}class PresenceMetadataForChannel{constructor(){this.subscriberMetadata=new Map}setMetadata(a,b){this.subscriberMetadata.set(a,b)}removeSubscribers(a){let b=!1;for(let c of a)b=this.subscriberMetadata.delete(c)||b;return b}getMetadata(a){if(!a){let b=[],c;for(let d of this.subscriberMetadata.values())for(let e of d)if("_i"in e){let g=Boolean(e["_i"]);c=void 0===c?g:g&&c}else b.push(e);return void 0!==c&&b.push({"_i":c?1:0}),b}let h=[],{subscriber:i,markAllAsLocal:j}=a;for(let[k,l]of this.subscriberMetadata){let m=j||k===i,n=m?l.map(f):l;h.push(...n)}return h}hasSubscribers(){return this.subscriberMetadata.size>0}}class PresenceMetadataSet{constructor(){this.metadataByChannel=new Map}setMetadata({subscriber:a,channelName:b,metadata:c}){let d=this.metadataByChannel.get(b);d||(d=new PresenceMetadataForChannel,this.metadataByChannel.set(b,d)),d.setMetadata(a,c)}removeSubscribers(a){let b=new Set;for(let[c,d]of this.metadataByChannel){let e=d.removeSubscribers(a);e&&b.add(c),d.hasSubscribers()||this.metadataByChannel.delete(c)}return b}getChannelMetadata(a,b){let c=this.metadataByChannel.get(a);return(null==c?void 0:c.getMetadata(b))||[]}}async function g(a,b){let c,d=new Promise((b,d)=>{c=self.setTimeout(()=>d(Error("timeout")),a)});if(!b)return d;try{await Promise.race([d,j(b)])}catch(e){throw self.clearTimeout(c),e}}async function h(a,b){let c,d=new Promise(b=>{c=self.setTimeout(b,a)});if(!b)return d;try{await Promise.race([d,j(b)])}catch(e){throw self.clearTimeout(c),e}}async function i(a,b,c=1/0,d){let e=d?j(d):null;for(let f=0;f<b;f++)try{let g=e?Promise.race([a(),e]):a();return await g}catch(i){if("AbortError"===i.name||f===b-1)throw i;let l=1e3*Math.pow(2,f),m=k(.1*l);await h(Math.min(c,l+m),d)}throw Error("retry failed")}function j(a){return new Promise((b,c)=>{let d=Error("aborted");d.name="AbortError",a.aborted?c(d):a.addEventListener("abort",()=>c(d))})}function k(a){return Math.floor(Math.random()*Math.floor(a))}async function l(a,b,c){let d=new WebSocket(a),e=o(d);try{return await Promise.race([e,g(b,c)]),d}catch(f){throw m(e),f}}async function m(a){try{let b=await a;b.close()}catch(c){}}function n(a,b){return i(()=>l(a,b.timeout,b.signal),b.attempts,b.maxDelay,b.signal)}function o(a){return new Promise((b,c)=>{a.readyState===WebSocket.OPEN?b(a):(a.onerror=()=>{a.onerror=null,a.onopen=null,c(Error("connect failed"))},a.onopen=()=>{a.onerror=null,a.onopen=null,b(a)})})}class StableSocket{constructor(a,b,c){this.socket=null,this.opening=null,this.url=a,this.delegate=b,this.policy=c}async open(){if(this.opening||this.socket)return;this.opening=new AbortController;let a=Object.assign(Object.assign({},this.policy),{signal:this.opening.signal});try{this.socket=await n(this.url,a)}catch(b){this.delegate.socketDidFinish(this);return}finally{this.opening=null}this.socket.onclose=a=>{this.socket=null,this.delegate.socketDidClose(this,a.code,a.reason);let b=this.delegate.socketShouldRetry?!this.delegate.socketShouldRetry(this,a.code):q(a.code);b?this.delegate.socketDidFinish(this):setTimeout(()=>this.open(),p(100,100+(this.delegate.reconnectWindow||50)))},this.socket.onmessage=a=>{this.delegate.socketDidReceiveMessage(this,a.data)},this.delegate.socketDidOpen(this)}close(a,b){this.opening?(this.opening.abort(),this.opening=null):this.socket&&(this.socket.onclose=null,this.socket.close(a,b),this.socket=null,this.delegate.socketDidClose(this,a,b),this.delegate.socketDidFinish(this))}send(a){this.socket&&this.socket.send(a)}isOpen(){return!!this.socket}}function p(a,b){return Math.random()*(b-a)+a}function q(a){return a===r||a===s}let r=1008,s=1011;class MultiMap{constructor(a){if(this.map=new Map,a)for(let[b,c]of a)this.set(b,c)}get(a){let b=this.map.get(a);return b||new Set}set(a,b){let c=this.map.get(a);return c||(c=new Set,this.map.set(a,c)),c.add(b),this}has(a){return this.map.has(a)}delete(a,b){let c=this.map.get(a);if(!c)return!1;if(!b)return this.map.delete(a);let d=c.delete(b);return c.size||this.map.delete(a),d}drain(a){let b=[];for(let c of this.keys())this.delete(c,a)&&!this.has(c)&&b.push(c);return b}keys(){return this.map.keys()}values(){return this.map.values()}entries(){return this.map.entries()}[Symbol.iterator](){return this.entries()}clear(){this.map.clear()}get size(){return this.map.size}}class SubscriptionSet{constructor(){this.subscriptions=new MultiMap,this.signatures=new Map}add(...a){let b=[];for(let{subscriber:c,topic:d}of a)this.subscriptions.has(d.name)||(b.push(d),this.signatures.set(d.name,d)),this.subscriptions.set(d.name,c);return b}delete(...a){let b=[];for(let{subscriber:c,topic:d}of a){let e=this.subscriptions.delete(d.name,c);e&&!this.subscriptions.has(d.name)&&(b.push(d),this.signatures.delete(d.name))}return b}drain(...a){let b=[];for(let c of a)for(let d of this.subscriptions.drain(c)){let e=this.signatures.get(d);this.signatures.delete(d),b.push(e)}return b}topics(){return this.signatures.values()}topic(a){return this.signatures.get(a)||null}subscribers(a){return this.subscriptions.get(a).values()}}function*t(a,b){for(let c=0;c<a.length;c+=b)yield a.slice(c,c+b)}function u(a){return new Promise((b,c)=>{let d=Error("aborted");d.name="AbortError",a.aborted?c(d):a.addEventListener("abort",()=>c(d))})}async function v(a,b){let c,d=new Promise(b=>{c=self.setTimeout(b,a)});if(!b)return d;try{await Promise.race([d,u(b)])}catch(e){throw self.clearTimeout(c),e}}function w(a){return Math.floor(Math.random()*Math.floor(a))}async function x(a,b,c=1/0,d){let e=d?u(d):null;for(let f=0;f<b;f++)try{let g=e?Promise.race([a(),e]):a();return await g}catch(h){if("AbortError"===h.name||f===b-1)throw h;let i=1e3*Math.pow(2,f),j=w(.1*i);await v(Math.min(c,i+j),d)}throw Error("retry failed")}function y(){return`${Math.round(2147483647*Math.random())}_${Math.round(Date.now()/1e3)}`}function z(a){let b=a.match(/\/u\/(\d+)\/ws/);return b?+b[1]:0}!function(a){a.Deploy="Alive Redeploy",a.Reconnect="Alive Reconnect"}(a||(a={}));class alive_session_AliveSession{constructor(a,b,d,e){this.url=a,this.getUrl=b,this.inSharedWorker=d,this.notify=e,this.subscriptions=new SubscriptionSet,this.state="online",this.retrying=null,this.connectionCount=0,this.presence=new AlivePresence,this.presenceMetadata=new PresenceMetadataSet,this.intentionallyDisconnected=!1,this.lastCameOnline=0,this.userId=z(a),this.presenceId=y(),this.presenceKey=c(this.userId,this.presenceId),this.socket=this.connect()}subscribe(a){let b=this.subscriptions.add(...a);for(let c of(this.sendSubscribe(b),a)){let d=c.topic.name;e(d)&&this.notifyCachedPresence(c.subscriber,d)}}unsubscribe(a){let b=this.subscriptions.delete(...a);this.sendUnsubscribe(b)}unsubscribeAll(...a){let b=this.subscriptions.drain(...a);this.sendUnsubscribe(b);let c=this.presenceMetadata.removeSubscribers(a);this.sendPresenceMetadataUpdate(c)}requestPresence(a,b){for(let c of b)this.notifyCachedPresence(a,c)}notifyCachedPresence(a,b){let c=this.presence.getChannelItems(b);0!==c.length&&this.notifyPresenceChannel(b,c)}updatePresenceMetadata(a){let b=new Set;for(let c of a)this.presenceMetadata.setMetadata(c),b.add(c.channelName);this.sendPresenceMetadataUpdate(b)}sendPresenceMetadataUpdate(a){if(!a.size)return;let b=[];for(let c of a){let d=this.subscriptions.topic(c);d&&b.push(d)}this.sendSubscribe(b)}online(){var a;this.lastCameOnline=Date.now(),this.state="online",null===(a=this.retrying)|| void 0===a||a.abort(),this.socket.open()}offline(){var a;this.state="offline",null===(a=this.retrying)|| void 0===a||a.abort(),this.socket.close()}shutdown(){this.inSharedWorker&&self.close()}get reconnectWindow(){let a=Date.now()-this.lastCameOnline<6e4;return 0===this.connectionCount||this.intentionallyDisconnected||a?0:1e4}socketDidOpen(){this.intentionallyDisconnected=!1,this.connectionCount++,this.socket.url=this.getUrlWithPresenceId(),this.sendSubscribe(this.subscriptions.topics())}socketDidClose(a,b,c){if(void 0!==this.redeployEarlyReconnectTimeout&&clearTimeout(this.redeployEarlyReconnectTimeout),"Alive Reconnect"===c)this.intentionallyDisconnected=!0;else if("Alive Redeploy"===c){this.intentionallyDisconnected=!0;let d=3+22*Math.random(),e=6e4*d;this.redeployEarlyReconnectTimeout=setTimeout(()=>{this.intentionallyDisconnected=!0,this.socket.close(1e3,"Alive Redeploy Early Client Reconnect")},e)}}socketDidFinish(){"offline"!==this.state&&this.reconnect()}socketDidReceiveMessage(a,b){let c=JSON.parse(b);switch(c.e){case"ack":this.handleAck(c);break;case"msg":this.handleMessage(c)}}handleAck(a){for(let b of this.subscriptions.topics())b.offset=a.off}handleMessage(a){let b=a.ch,c=this.subscriptions.topic(b);if(c){if(c.offset=a.off,"e"in a.data){let d=this.presence.handleMessage(b,a.data);this.notifyPresenceChannel(b,d);return}a.data.wait||(a.data.wait=0),this.notify(this.subscriptions.subscribers(b),{channel:b,type:"message",data:a.data})}}notifyPresenceChannel(a,b){var c,d;let e=new Map;for(let f of b){let{userId:g,metadata:h,presenceKey:i}=f,j=e.get(g)||{userId:g,isOwnUser:g===this.userId,metadata:[]};if(i!==this.presenceKey){for(let k of h){if("_i"in k){!1!==j.isIdle&&(j.isIdle=Boolean(k["_i"]));continue}j.metadata.push(k)}e.set(g,j)}}for(let l of this.subscriptions.subscribers(a)){let m=this.userId,n=Array.from(e.values()).filter(a=>a.userId!==m),o=null!==(d=null===(c=e.get(this.userId))|| void 0===c?void 0:c.metadata)&& void 0!==d?d:[],p=this.presenceMetadata.getChannelMetadata(a,{subscriber:l,markAllAsLocal:!this.inSharedWorker});this.notify([l],{channel:a,type:"presence",data:[{userId:m,isOwnUser:!0,metadata:[...o,...p]},...n]})}}async reconnect(){if(!this.retrying)try{this.retrying=new AbortController;let a=await x(this.getUrl,1/0,6e4,this.retrying.signal);a?(this.url=a,this.socket=this.connect()):this.shutdown()}catch(b){if("AbortError"!==b.name)throw b}finally{this.retrying=null}}getUrlWithPresenceId(){let a=new URL(this.url,self.location.origin);return a.searchParams.set("shared",this.inSharedWorker.toString()),a.searchParams.set("p",`${this.presenceId}.${this.connectionCount}`),a.toString()}connect(){let a=new StableSocket(this.getUrlWithPresenceId(),this,{timeout:4e3,attempts:7});return a.open(),a}sendSubscribe(a){let b=Array.from(a);for(let c of t(b,25)){let d={};for(let f of c)e(f.name)?d[f.signed]=JSON.stringify(this.presenceMetadata.getChannelMetadata(f.name)):d[f.signed]=f.offset;this.socket.send(JSON.stringify({subscribe:d}))}}sendUnsubscribe(a){let b=Array.from(a,a=>a.signed);for(let c of t(b,25))this.socket.send(JSON.stringify({unsubscribe:c}));for(let d of a)e(d.name)&&this.presence.clearChannel(d.name)}}class AliveSession extends alive_session_AliveSession{getUrlFromRefreshUrl(){return A(this.refreshUrl)}constructor(a,b,c,d){super(a,()=>this.getUrlFromRefreshUrl(),c,d),this.refreshUrl=b}}async function A(a){let b=await B(a);return b&&b.url&&b.token?C(b.url,b.token):null}async function B(a){let b=await fetch(a,{headers:{Accept:"application/json"}});if(b.ok)return b.json();if(404===b.status)return null;throw Error("fetch error")}async function C(a,b){let c=await fetch(a,{method:"POST",mode:"same-origin",headers:{"Scoped-CSRF-Token":b}});if(c.ok)return c.text();throw Error("fetch error")}function D(a,b){for(let c of a)c.postMessage(b)}function E(a,b,c){let d=a=>({subscriber:b,topic:a});if(c.subscribe&&a.subscribe(c.subscribe.map(d)),c.unsubscribe&&a.unsubscribe(c.unsubscribe.map(d)),c.requestPresence&&a.requestPresence(b,c.requestPresence),c.updatePresenceMetadata){for(let e of c.updatePresenceMetadata)e.subscriber=b;a.updatePresenceMetadata(c.updatePresenceMetadata)}null!=c.online&&(c.online?a.online():a.offline()),c.hangup&&a.unsubscribeAll(b)}function F(){let a=null;return function(b){let c=b.target,d=b.data;d.connect&&!a?a=new AliveSession(d.connect.url,d.connect.refreshUrl,!0,D):a&&E(a,c,d)}}let G=F();if(self.onconnect=a=>{let b=a.ports[0];b.onmessage=G},"function"==typeof BroadcastChannel){let H=new BroadcastChannel("shared-worker-error");self.addEventListener("error",a=>{let{error:{name:b,message:c,stack:d}}=a;H.postMessage({error:{name:b,message:c,stack:d}})})}})()
//# sourceMappingURL=socket-worker-1188515d5c4d.js.map