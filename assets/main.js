!function(e){function n(i){if(t[i])return t[i].exports;var o=t[i]={i:i,l:!1,exports:{}};return e[i].call(o.exports,o,o.exports,n),o.l=!0,o.exports}var t={};n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:i})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="",n(n.s=8)}([function(e,n){function t(e,n){for(var t=n+"";t.length<e;)t="0"+t;return t}e.exports=function(e){let n=new Date,i=n.getFullYear()+"-"+t(2,n.getMonth()+1)+"-"+t(2,n.getDate())+" "+n.getHours()+":"+t(2,n.getMinutes())+":"+t(2,n.getSeconds())+":"+t(3,n.getMilliseconds());console.log(i,e)}},function(e,n,t){"use strict";const i=t(2),o=t(3);let u={playLists:"playLists/",cache:"cache/",tmp:"tmp/"},r={token:"app token here",prefix:"!",guildId:"your server id here",folders:u},s=o.join(__dirname,"/config.json");i.existsSync(s)||(i.writeFileSync(s,JSON.stringify(r)),process.exit(0));let c=JSON.parse(i.readFileSync(s));"app token here"!=c.token&&59==c.token.length&&"your server id here"!=c.guildId&&18==c.guildId.length&&"number"==typeof+c.guildId||(console.log("invalid config"),process.exit(0));for(let e in c.folders){let n=o.join(__dirname,u[e]);i.existsSync(n)||i.mkdirSync(n)}e.exports=c},function(e,n){e.exports=require("fs")},function(e,n){e.exports=require("path")},function(e,n){e.exports=require("http")},function(e,n){e.exports=require("util")},function(e,n){e.exports=require("events")},function(e,n){e.exports=require("ytdl-core")},function(e,n,t){const i=t(9),o=new i.Client,u=(t(2),t(7),t(4),t(3),t(0)),r=t(10),s=t(1),c=t(15);c.init(o);const a=(t(5),t(18));a.bind(o,c);const f=t(22);var l="127.0.0.1",d=()=>{f((e,n)=>{l=n;a.register(n,s.guildId)})};d(),setInterval(d,6e4);var h={play:e=>{let n=e.content.split(" ");n.splice(1,n.length)[0]},host:e=>{e.reply(`hosted on ${l}`)},stop:e=>{},pause:e=>{},resume:e=>{},volume:e=>{},loli:e=>{let n=o.guilds.find("id",s.guildId).members.find("id",o.user.id);["пошёл нахуй :)","Harold"].forEach((e,t)=>{setTimeout(()=>{n.setNickname(e)},1e3*t)});e.reply("https://cdn.discordapp.com/attachments/345930097250926602/351458063125053440/MOvL9CT49ME.png")},clear:e=>{},queue:e=>{let n=e.content.split(" ");let t=n.splice(1,1);var i=n=>{e.reply(n)};c.getUsers().then(n=>{u("[main] get all queues");let o="\n queues: \n";n.map(n=>{if(!n)return;if("all"!=t&&n.id!=e.member.id)return;o+=`${n}:
`;n.queue.getAll().forEach((e,n)=>{if(!e)return;let t=`\t${n+1}.\t${e.fileName}
`;o.length+t.length>1900&&(i(o),o="\n");o+=t})});i(o)})},reconnect:e=>{},off:e=>{let n=o.voiceConnections.filter((e,n)=>n==s.guildId).first();n&&n.disconnect();u("[main] stoped by "+e.member);process.exit(0)},summon:e=>{e.member.voiceChannel&&e.member.voiceChannel.join().then(e=>{u("[main] joined");c.refresh().then(()=>{c.np()||c.play()})}).catch(console.log)},np:e=>{e.reply(c.np?`now playing ${c.np.fileName||c.np.name}`:"now not playing")},help:e=>{},skip:e=>{u("[main] skiped by "+e.member);let n=o.voiceConnections.filter((e,n)=>n==s.guildId).first().dispatcher;n&&n.end("skip")},playlist:e=>{var n=n=>new Promise(t=>{n.map(n=>{n.id==e.member.id&&n.queue.playList.getAll().then(t)})});var t=e=>new Promise(n=>{let t=`
`;e.data.map((e,n)=>{let o=`${n+1}.\t ${e.fileName}
`;t.length+o.length>1950&&(i(t),t=`
`);t+=o});n(t)});var i=n=>{e.reply(n)};u(`[main] ${e.member} get playList`);c.getUsers().then(n).then(t).then(i)},add:e=>{let n=e.content.split(" ");let t=+n.splice(1,1);if(t>0&&t<=50){let n=o.voiceConnections.filter((e,n)=>n==s.guildId).first();e.member.voiceChannelID&&n.channel.id==e.member.voiceChannelID?c.add(e.member,t):e.reply(`зайди ко мне в канал`)}else e.reply(`incorrect input! min: 0, max: 50`)},debug2:e=>{c.play()},debug1:e=>{e.member.voiceChannel.join().then(e=>{e.playFile(`C:/test.mp3`)})}};r.on("song",e=>{c.addLocal(e)}),o.on("message",e=>{if(0!=e.content.indexOf(s.prefix))return;u("[main] get message: "+e.content);let n=e.content.split(" ");n[0]=n[0].substr(s.prefix.length,n[0].length);h[n[0]]&&h[n[0]](e)}),o.on("voiceStateUpdate",()=>{c.refresh()}),o.on("ready",()=>{u("[main] Bot connected");let e=o.guilds.find("id",s.guildId).channels.findAll("type","voice");var n=()=>new Promise((n,t)=>{u("[main] try to join "+e[0]);e[0].join().then(n).catch(t)});n().then(()=>{c.play()})}),o.login(s.token),u("[main] Bot started")},function(e,n){e.exports=require("discord.js")},function(e,n,t){const i=t(0),o=t(4),u=t(11),r=t(2),s=t(5),c=t(6),a=t(1),f=t(3),l=(t(12),t(13)),d=t(14);class h extends c{constructor(){super(),this.init()}init(){var e=this;o.createServer(function(n,t){t.setHeader("Access-Control-Allow-Origin","*"),t.setHeader("Access-Control-Allow-Methods","POST"),t.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");let o=new u.IncomingForm;o.uploadDir=f.join(__dirname,a.folders.tmp),o.parse(n,function(o,u,c){if(!c.kek||!u.userId)return t.end("???"),void i("[musicFromPlugin] not valid \n"+s.inspect({fields:u,files:c,host:n.headers.host,origins:n.headers.origin,userAgent:n.headers["user-agent"],contentType:n.headers["content-type"]}));let l=f.join(__dirname,a.folders.cache,u.userId);r.existsSync(l)||r.mkdirSync(l);let d=c.kek.path.split("\\"),h={oldName:f.join(__dirname,d[d.length-2],d[d.length-1]),newName:f.join(l,e.checkName(c.kek.name))};e.rename(h).then(n=>e.renameToMaybeRealName(n,u.userId)).then(e=>new Promise(n=>{t.end("kek");n(Object.assign({userId:u.userId},e))})).then(n=>e.newSongHandler(n)).catch(console.error)})}).listen(80)}newSongHandler(e){var n=this;let t=e.newName.split("\\"),o=t[t.length-1];i(`[musicFromPlugin] ready to add song ${o} to user ${e.userId}`),n.emit("song",{userId:e.userId,fileName:o})}rename(e){return new Promise((n,t)=>{i(`[musicFromPlugin]
\trename: \t${e.oldName} 
\tto: \t\t${e.newName}`);r.rename(e.oldName,e.newName,i=>{i&&t(i);n(e)})})}renameToMaybeRealName(e,n){var t=this;return new Promise((o,u)=>{e.newName.match(/[А-Я]/gi)&&o(e);i("[musicFromPlugin] try to get tags from: "+e.newName);let r=d.read(e.newName);if(r&&r.artist&&r.title){let i={oldName:e.newName,newName:f.join(__dirname,a.folders.cache,n,t.checkName(`/${r.artist} - ${r.title}.mp3`))};t.rename(i).then(o)}else o(e)})}checkName(e){let n=new RegExp('[/*?<>|`:"]',"g");return l(e).split("&nbsp;–&nbsp;").join(" - ").replace(n,"")}}e.exports=new h},function(e,n){e.exports=require("formidable")},function(e,n){function t(e){return!!e.constructor&&"function"==typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)}function i(e){return"function"==typeof e.readFloatLE&&"function"==typeof e.slice&&t(e.slice(0,0))}/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
e.exports=function(e){return null!=e&&(t(e)||i(e)||!!e._isBuffer)}},function(e,n){e.exports=function(e,n){var t=0,i=0,o=!1;void 0===n&&(n=2),e=e.toString().replace(/&lt;/g,"<").replace(/&gt;/g,">");var u={ENT_NOQUOTES:0,ENT_HTML_QUOTE_SINGLE:1,ENT_HTML_QUOTE_DOUBLE:2,ENT_COMPAT:2,ENT_QUOTES:3,ENT_IGNORE:4};if(0===n&&(o=!0),"number"!=typeof n){for(n=[].concat(n),i=0;i<n.length;i++)0===u[n[i]]?o=!0:u[n[i]]&&(t|=u[n[i]]);n=t}return n&u.ENT_HTML_QUOTE_SINGLE&&(e=e.replace(/&#0*39;/g,"'")),o||(e=e.replace(/&quot;/g,'"')),e=e.replace(/&amp;/g,"&")}},function(e,n){e.exports=require("node-id3")},function(e,n,t){function i(e){return function(){var n=e.apply(this,arguments);return new Promise(function(e,t){function i(o,u){try{var r=n[o](u),s=r.value}catch(e){return void t(e)}if(!r.done)return Promise.resolve(s).then(function(e){i("next",e)},function(e){i("throw",e)});e(s)}return i("next")})}}const o=t(1),u=t(16),r=t(0),s=t(3),c=(t(2),t(7)),{EventEmitter:EventEmitter}=(t(5),t(6));class a extends EventEmitter{constructor(){super(),this.users=[],this.nowPlaying=!1,this.vol=10,this.on("playEnd",()=>{this.pause=!1;this.emit("pauseStateChange",!1);this.play()})}init(e){this.client=e}allQueues(){return this.users}get np(){return this.nowPlaying}set np(e){this.nowPlaying=e,this.emit("npChange",e)}get pause(){let e=this.client.voiceConnections.filter((e,n)=>n==o.guildId).first();return!(!e||!e.dispatcher)&&e.dispatcher.paused}get volume(){return this.vol}set volume(e){this.emit("volumeChange",e),this.vol=e;let n=this.client.voiceConnections.filter((e,n)=>n==o.guildId).first();n&&n.dispatcher&&n.dispatcher.setVolume(e/100)}set pause(e){if(e!=this.pause){let n=this.client.voiceConnections.filter((e,n)=>n==o.guildId).first();if(!n||!n.dispatcher)return;let t=n.dispatcher;e?(t.pause(),r(`[musicPlayer] paused`)):(t.resume(),r(`[musicPlayer] resumed`)),this.emit("pauseStateChange",e)}}add(e,n){e=this.users.find("id",e.id||e);for(let t=0;t<n;t++)e.queue.addFromPlayList()}play(){var e=this,n=(()=>{var e=i(function*(e){return e.filter(function(e){return e||!1})});return function(n){return e.apply(this,arguments)}})(),t=e=>new Promise((n,t)=>{e.length?(r(`[musicPlayer] ${e.length} users geted`),n(e)):t("no users with songs")}),u=(()=>{var e=i(function*(e){return new Promise(function(n,t){let i=Math.round(Math.random()*(e.length-1)),o=e[i];o||t("invalid user"),r(`[musicPlayer] selected ${o}`),n(o)})});return function(n){return e.apply(this,arguments)}})(),a=(()=>{var e=i(function*(e){return{user:e,audio:yield e.queue.getThis()}});return function(n){return e.apply(this,arguments)}})(),f=n=>{let t=t=>new Promise((i,u)=>{e.np=n;e.pause=!1;let s=c(t,{filter:"audioonly"});const a={seek:0,volume:e.vol/100};let f=e.client.voiceConnections.filter((e,n)=>n==o.guildId).first().playStream(s,a);f.on("error",u);f.on("start",()=>{r(`[musicPlayer] start playing stream ${n.fileName}`)});f.on("end",()=>{r(`[musicPlayer] end playing stream ${n.fileName}`);e.np=!1;i()})});let i=n=>new Promise((t,i)=>{e.np=n;let u=s.join(__dirname,o.folders.cache,n.userId,n.fileName);let c=e.client.voiceConnections.filter((e,n)=>n==o.guildId).first().playFile(u,{volume:e.vol/100});c.on("error",i);c.on("start",()=>{r(`[musicPlayer] start playing file ${n.fileName}`)});c.on("end",()=>{r(`[musicPlayer] end playing file ${n.fileName}`);e.np=!1;t()})});return new Promise((e,o)=>{r(`[musicPlayer] audio geted ${n.audio.fileName}`);var u;u=n.audio.local?i:t;n.user.queue.skip();u(n.audio).then(e).catch(o)})};r(`[musicPlayer] waiting for song`),e.np||e.getUsers().then(n).then(t).then(u).then(a).then(f).then(()=>{setTimeout(()=>{e.emit("playEnd")},1e3)}).catch(n=>{r(`[musicPlayer] not playing because: ${n}, next try after 5s`);setTimeout(()=>{e.emit("playEnd")},5e3)})}addLocal(e){var n=this;if(e.local=!0,n.users&&!Array.isArray(n.users)){let t=n.users.find("id",e.userId);t?t.queue.add(e):r(`[musicPlayer] Audio not added, user <@${e.userId}> not in voice channel with bot`)}}refresh(){var e=this;return i(function*(){var n=e,t=(()=>{var e=i(function*(){n.client.voiceConnections.map(function(e,t){t==o.guildId&&(n.users=e.channel.members)}),r("[musicPlayer] update users")});return function(){return e.apply(this,arguments)}})(),s=(()=>{var e=i(function*(){n.users.map(function(e){e.queue||(e.queue=new u(e),e.queue.on("changed",function(t){n.emit("queueChange",e)}),e.queue.playList.on("playListChange",function(t){n.emit("playListChange",e)}))}),r("[musicPlayer] update queues")});return function(){return e.apply(this,arguments)}})();r("[musicPlayer] refresh"),yield t(),yield s()})()}getUsers(){var e=this;return i(function*(){return r("[musicPlayer] get users with queues "),e.users.array().filter(function(e){return e.queue.haveItems})})()}}e.exports=new a},function(e,n,t){const i=(t(1),t(17)),o=t(0),{EventEmitter:EventEmitter}=(t(5),t(6));class u extends EventEmitter{constructor(e){super(),this.member=e,this.queue=[],this.playList=new i(e),this.addFromPlayList()}add(e){e.addTime=Date.now(),this.queue.push(e),this.playList.add(e),this.emit("changed",this.queue),o(`[userQueue] ${this.member} added ${e.fileName}`)}remove(e){var n=0;return"all"==e?this.queue=[]:n=this.queue.splice(e,1),this.queue.length||this.addFromPlayList(),this.emit("changed",this.queue),n}skip(){return o(`[UserQueue] ${this.member} skiped`),this.remove(0)}getAll(){return o(`[UserQueue] ${this.member} get all`),this.queue}addFromPlayList(){return o(`[UserQueue] ${this.member} add 1 in queue from play list`),new Promise(e=>{this.playList.get("random").then(n=>{this.queue.push(n);this.emit("changed",this.queue);e(n)})})}fix(){this.queue=this.queue.filter(e=>e||!1),this.emit("changed",this.queue)}getThis(){var e=this;return o(`[UserQueue] ${e.member} try to get 1 from queue`),new Promise((n,t)=>{e.queue.length?(o(`[UserQueue] ${e.member} get ${e.queue[0]?e.queue[0].fileName:"void"} from queue`),e.queue[0]||e.fix(),n(e.queue[0])):(o(`[UserQueue] queue is empty`),e.addFromPlayList().then(n))})}get haveItems(){return!!this.queue.length}}e.exports=u},function(e,n,t){const i=t(3),o=t(1),u=t(2),r=t(0),{EventEmitter:EventEmitter}=t(6);class s extends EventEmitter{constructor(e){super(),this.member=e,this.fileName=this.member.id+".json",this.path=i.join(__dirname,o.folders.playLists),this.cachePath=i.join(__dirname,o.folders.cache),this.checkFileExist().then(()=>r("[UserPlayList] "+this.member+" file checked"))}checkFileExist(){var e=this;return new Promise(n=>{u.existsSync(i.join(e.path,e.fileName))?n():(r("[UserPlayList] "+this.member+" created file: "+i.join(e.path,e.fileName)),u.writeFile(e.path+e.fileName,JSON.stringify({data:[]}),n))})}add(e){var n=this,t=n=>new Promise((t,i)=>{let o=n.data.filter(n=>n.fileName==e.fileName);o.length||n.data.push(e);o.length&&i("audio already exist");t(n)}),o=t=>{u.writeFile(i.join(n.path,n.fileName),JSON.stringify(t),i=>{n.cache=t;n.emit("playListChange",t);r("[UserPlayList] "+this.member+" added: "+e.fileName)})};return new Promise((e,i)=>{n.getAll().then(t).then(o).catch(e=>{r(`[UserPlayList] audio not added because: ${e}`)})})}remove(e,n){var t=this;return new Promise((o,s)=>{t.getAll().then(t=>{var o=n=>new Promise((o,s)=>{let c=t.data.splice(n,1)[0];c||o();let a=i.join(this.cachePath,c.userId+"/",c.fileName);u.unlink(a,e=>{r(e?`[UserPlayList] ${this.member} not removed ${c.fileName} from cache. ${e}`:`[UserPlayList] ${this.member} removed ${c.fileName} from cache`);o()});r(`[UserPlayList] ${this.member} removed ${c.fileName} with id ${e} from playList`)});return new Promise(i=>{if(Array.isArray(e)&&e.every(e=>"number"==typeof e)){let n=[];e.map(e=>{n.push(o(e))}),Promise.all(n).then(()=>i(t))}else"number"==typeof e?o(e).then(()=>i(t)):(t.data=t.data.filter(t=>t[e]!=n),r(`[UserPlayList] ${this.member} removed all where: field ${e} == ${n}`),i(t))})}).then(e=>{u.writeFile(i.join(t.path,t.fileName),JSON.stringify(e),n=>{t.cache=e;t.emit("playListChange",e)})}).catch(console.error)})}getAll(){var e=this;return new Promise((n,t)=>{e.cache?(r("[UserPlayList] "+this.member+" get all from cache"),n(e.cache)):u.readFile(i.join(e.path,e.fileName),"utf8",(i,o)=>{i&&t(i);let u=JSON.parse(o);e.cache=u;r("[UserPlayList] "+this.member+" get all file content");n(u)})})}get(e){return r(`[UserPlayList] ${this.member} get 1 random from playList`),new Promise(n=>{new Promise(e=>{this.cache?e(this.cache):this.getAll().then(e).catch(()=>{r(`[UserPlayList] ${this.member} error read playList file`);n()})}).then(t=>{r(`[UserPlayList] get from ${this.cache?"cache":"file"}`);if(t.data.length)if("random"==e){let e=Math.round(Math.random()*(t.data.length-1)),i=t.data[e];r(`[UserPlayList] ${this.member} get random ${i.fileName} with id ${e+1} of ${t.data.length}`),n(i)}else{let i=t.data[e];r(`[UserPlayList] ${this.member} get ${i.fileName} with id ${e+1} of ${t.data.length}`),n(i)}else r(`[UserPlayList] ${this.member} playList is empty`),n()})})}}e.exports=s},function(e,n,t){const i=t(19),o=i(),u=t(4).createServer(o),r=t(0),s=t(1),c=(t(4),t(20)(u)),a=t(21);let f=function(){function e(){i.on("npChange",e=>{c.sockets.emit("nowPlayingChange",e)}),i.on("pauseStateChange",e=>{c.sockets.emit("pauseStateChange",e)}),i.on("queueChange",e=>{let n=f.filter(n=>n.uid==e.id);if(!n.length)return;let t=n[0].socket;t&&t.emit("queueChange",e.queue.getAll())}),i.on("playListChange",e=>{let n=f.filter(n=>n.uid==e.id)[0];if(!n)return;let t=n.socket;t&&e.queue.playList.getAll().then(e=>{t.emit("playListChange",e.data)})})}function n(){return c.on("connection",e=>{r(`[api] new connection ${e.id}`);setTimeout(()=>{e.emit("getUID")},300);e.on("disconnect",n=>{let t=f.map((n,t)=>{if(n.socket.id==e.id)return f.splice(t,1)[0]})[0];r(`[api] <@${t?t.uid:"no authorized"}> disconnected ${e.id}`)});e.on("UID",n=>{f.filter(e=>e.uid==n).length?f.map(t=>{t.uid=n;t.socket=e}):f.push({socket:e,uid:n});r(`[api] bind UID ${n} to socket ${e.id}`)});e.on("getAll",n=>{let t={users:[],nowPlaying:i.np,onPause:i.pause,volume:i.volume};let o=[];i.allQueues().map((e,n)=>{o.push(e.queue.playList.getAll());t.users.push({name:e.name,id:n,queue:e.queue.getAll()})});Promise.all(o).then(e=>new Promise(n=>{e.map((e,n)=>{t.users[n].playList=e.data});n()})).then(()=>{e.emit("all",t)})});e.on("skip",e=>{r("[api] try to skip from "+e.userId);let n=o.voiceConnections.filter((e,n)=>n==s.guildId).first().dispatcher;n&&n.end("skip")});e.on("add",e=>{e.count>0&&e.count<=100?(r(`[api] added ${e.count} random items from playlist to ${e.userId}`),i.add(e.userId,e.count)):r(`[api] not added ${e.count} random items from playlist to ${e.userId}`)});e.on("pauseStateChange",e=>{i.pause=!!e.newState;r(`[api] set pause to ${e.newState} by ${e.userId}`)});e.on("volumeChanged",n=>{if(n.newValue<0||n.newValue>100)return;i.volume=n.newValue;e.broadcast.emit("volumeChange",n.newValue)});e.on("clearQueue",e=>{let n=i.allQueues().find("id",e.userId);n&&(r(`[api] removed all queue for user ${e.userId}`),n.queue.remove("all"))});e.on("removeFromQueue",e=>{let n=i.allQueues().find("id",e.userId);n&&(r(`[api] removed ${e.index} from queue for user ${e.userId}`),n.queue.remove(e.index))});e.on("removeFromPlayList",e=>{let n=i.allQueues().find("id",e.userId);n&&(r(`[api] removed ${e.index} from playList for user ${e.userId}`),n.queue.playList.remove(e.index))});e.on("removeSelectedFromPlayList",e=>{let n=i.allQueues().find("id",e.userId);n&&e.ids&&(r(`[api] removed ${e.ids.length} items from playList for user ${e.userId}`),n.queue.playList.remove(e.ids))});e.on("addFromPlayListInQueue",e=>{let n=i.allQueues().find("id",e.userId);n&&(r(`[api] added ${e.index} from playList in queue for user ${e.userId}`),n.queue.playList.get(e.index).then(e=>{n.queue.add(e)}))});e.on("addSelectedFromPlaylistInQueue",e=>{let n=i.allQueues().find("id",e.userId);n&&e.ids&&(r(`[api] added ${e.ids.length} items from playList in queue for user ${e.userId}`),e.ids.map(e=>{n.queue.playList.get(e).then(e=>{n.queue.add(e)})}))})}),u.listen(2303),r(`[api] init`),{bind:(n,t)=>{o=n;i=t;e()},register:(e,n)=>{let t={type:"update",ip:e,guildId:n};let i="http://pew-pc.com/harold/index.php?";for(var o in t)t.hasOwnProperty(o)&&(i+=`${o}=${t[o]}&`);a.get(i,(e,n,t)=>{e||1==t?r("[api] cannot register. "+e||t):"0"==t&&r(`[api] registred`)})}}}var t,i,o,f=[];return{getInstance:function(){return t||(t=n()),t}}}();e.exports=f.getInstance()},function(e,n){e.exports=require("express")},function(e,n){e.exports=require("socket.io")},function(e,n){e.exports=require("request")},function(e,n){e.exports=require("externalip")}]);