!function(e){function n(i){if(t[i])return t[i].exports;var r=t[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}var t={};n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:i})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="",n(n.s=8)}([function(e,n,t){"use strict";function i(e,n){for(var t=n+"";t.length<e;)t="0"+t;return t}e.exports=function(e){var n=new Date,t=n.getFullYear()+"-"+i(2,n.getMonth()+1)+"-"+i(2,n.getDate())+" "+n.getHours()+":"+i(2,n.getMinutes())+":"+i(2,n.getSeconds())+":"+i(3,n.getMilliseconds());console.log(t,e)}},function(e,n,t){"use strict";var i=t(2),r=t(3),o={playLists:"playLists/",cache:"cache/",tmp:"tmp/"},u={token:"app token here",prefix:"!",guildId:"your server id here",folders:o},a=r.join(__dirname,"/config.json");i.existsSync(a)||(i.writeFileSync(a,JSON.stringify(u)),process.exit(0));var s=JSON.parse(i.readFileSync(a));"app token here"!=s.token&&59==s.token.length&&"your server id here"!=s.guildId&&18==s.guildId.length&&"number"==typeof+s.guildId||(console.log("invalid config"),process.exit(0));for(var c in s.folders){var l=r.join(__dirname,o[c]);i.existsSync(l)||i.mkdirSync(l)}e.exports=s},function(e,n){e.exports=require("fs")},function(e,n){e.exports=require("path")},function(e,n){e.exports=require("http")},function(e,n){e.exports=require("util")},function(e,n){e.exports=require("events")},function(e,n){e.exports=require("ytdl-core")},function(e,n,t){"use strict";var i=t(9),r=new i.Client,o=(t(2),t(7),t(4),t(3),t(0)),u=t(10),a=t(1),s=t(15);s.init(r);var c=(t(5),t(18));c.bind(r,s);var l=t(22),f="127.0.0.1",d=function(){l(function(e,n){f=n,c.register(n,a.guildId)})};d(),setInterval(d,6e4);var m={play:function(e){var n=e.content.split(" ");n.splice(1,n.length)[0]},host:function(e){e.reply("hosted on "+f)},stop:function(e){},pause:function(e){},resume:function(e){},volume:function(e){},loli:function(e){var n=r.guilds.find("id",a.guildId).members.find("id",r.user.id);["пошёл нахуй :)","Harold"].forEach(function(e,t){setTimeout(function(){n.setNickname(e)},1e3*t)}),e.reply("https://cdn.discordapp.com/attachments/345930097250926602/351458063125053440/MOvL9CT49ME.png")},clear:function(e){},queue:function(e){var n=e.content.split(" "),t=n.splice(1,1),i=function(n){e.reply(n)};s.getUsers().then(function(n){o("[main] get all queues");var r="\n queues: \n";n.map(function(n){n&&("all"!=t&&n.id!=e.member.id||(r+=n+":\n",n.queue.getAll().forEach(function(e,n){if(e){var t="\t"+(n+1)+".\t"+e.fileName+"\n";r.length+t.length>1900&&(i(r),r="\n"),r+=t}})))}),i(r)})},reconnect:function(e){},off:function(e){var n=r.voiceConnections.filter(function(e,n){return n==a.guildId}).first();n&&n.disconnect(),o("[main] stoped by "+e.member),process.exit(0)},summon:function(e){e.member.voiceChannel&&e.member.voiceChannel.join().then(function(e){o("[main] joined"),s.refresh().then(function(){s.np()||s.play()})}).catch(console.log)},np:function(e){e.reply(s.np?"now playing "+(s.np.fileName||s.np.name):"now not playing")},help:function(e){},skip:function(e){o("[main] skiped by "+e.member);var n=r.voiceConnections.filter(function(e,n){return n==a.guildId}).first().dispatcher;n&&n.end("skip")},playlist:function(e){var n=function(n){return new Promise(function(t){n.map(function(n){n.id==e.member.id&&n.queue.playList.getAll().then(t)})})},t=function(e){return new Promise(function(n){var t="\n";e.data.map(function(e,n){var r=n+1+".\t "+e.fileName+"\n";t.length+r.length>1950&&(i(t),t="\n"),t+=r}),n(t)})},i=function(n){e.reply(n)};o("[main] "+e.member+" get playList"),s.getUsers().then(n).then(t).then(i)},add:function(e){var n=e.content.split(" "),t=+n.splice(1,1);if(t>0&&t<=50){var i=r.voiceConnections.filter(function(e,n){return n==a.guildId}).first();e.member.voiceChannelID&&i.channel.id==e.member.voiceChannelID?s.add(e.member,t):e.reply("зайди ко мне в канал")}else e.reply("incorrect input! min: 0, max: 50")},debug2:function(e){s.play()},debug1:function(e){e.member.voiceChannel.join().then(function(e){e.playFile("C:/test.mp3")})}};u.on("song",function(e){s.addLocal(e)}),r.on("message",function(e){if(0==e.content.indexOf(a.prefix)){o("[main] get message: "+e.content);var n=e.content.split(" ");n[0]=n[0].substr(a.prefix.length,n[0].length),m[n[0]]&&m[n[0]](e)}}),r.on("voiceStateUpdate",function(){s.refresh()}),r.on("ready",function(){o("[main] Bot connected");var e=r.guilds.find("id",a.guildId).channels.findAll("type","voice");(function(){return new Promise(function(n,t){o("[main] try to join "+e[0]),e[0].join().then(n).catch(t)})})().then(function(){s.play()})}),r.login(a.token),o("[main] Bot started")},function(e,n){e.exports=require("discord.js")},function(e,n,t){"use strict";function i(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function r(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}function o(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}var u=function(){function e(e,n){for(var t=0;t<n.length;t++){var i=n[t];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(n,t,i){return t&&e(n.prototype,t),i&&e(n,i),n}}(),a=t(0),s=t(4),c=t(11),l=t(2),f=t(5),d=t(6),m=t(1),p=t(3),h=(t(12),t(13)),y=t(14),g=function(e){function n(){i(this,n);var e=r(this,(n.__proto__||Object.getPrototypeOf(n)).call(this));return e.init(),e}return o(n,e),u(n,[{key:"init",value:function(){var e=this;s.createServer(function(n,t){t.setHeader("Access-Control-Allow-Origin","*"),t.setHeader("Access-Control-Allow-Methods","POST"),t.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");var i=new c.IncomingForm;i.uploadDir=p.join(__dirname,m.folders.tmp),i.parse(n,function(i,r,o){if(!o.kek||!r.userId)return t.end("???"),void a("[musicFromPlugin] not valid \n"+f.inspect({fields:r,files:o,host:n.headers.host,origins:n.headers.origin,userAgent:n.headers["user-agent"],contentType:n.headers["content-type"]}));var u=p.join(__dirname,m.folders.cache,r.userId);l.existsSync(u)||l.mkdirSync(u);var s=o.kek.path.split("\\"),c={oldName:p.join(__dirname,s[s.length-2],s[s.length-1]),newName:p.join(u,e.checkName(o.kek.name))};e.rename(c).then(function(n){return e.renameToMaybeRealName(n,r.userId)}).then(function(e){return new Promise(function(n){t.end("kek"),n(Object.assign({userId:r.userId},e))})}).then(function(n){return e.newSongHandler(n)}).catch(console.error)})}).listen(80)}},{key:"newSongHandler",value:function(e){var n=this,t=e.newName.split("\\"),i=t[t.length-1];a("[musicFromPlugin] ready to add song "+i+" to user "+e.userId),n.emit("song",{userId:e.userId,fileName:i})}},{key:"rename",value:function(e){return new Promise(function(n,t){a("[musicFromPlugin]\n\trename: \t"+e.oldName+" \n\tto: \t\t"+e.newName),l.rename(e.oldName,e.newName,function(i){i&&t(i),n(e)})})}},{key:"renameToMaybeRealName",value:function(e,n){var t=this;return new Promise(function(i,r){e.newName.match(/[А-Я]/gi)&&i(e),a("[musicFromPlugin] try to get tags from: "+e.newName);var o=y.read(e.newName);if(o&&o.artist&&o.title){var u={oldName:e.newName,newName:p.join(__dirname,m.folders.cache,n,t.checkName("/"+o.artist+" - "+o.title+".mp3"))};t.rename(u).then(i)}else i(e)})}},{key:"checkName",value:function(e){var n=new RegExp('[/*?<>|`:"]',"g");return h(e).split("&nbsp;–&nbsp;").join(" - ").replace(n,"")}}]),n}(d);e.exports=new g},function(e,n){e.exports=require("formidable")},function(e,n,t){"use strict";function i(e){return!!e.constructor&&"function"==typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)}function r(e){return"function"==typeof e.readFloatLE&&"function"==typeof e.slice&&i(e.slice(0,0))}/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
e.exports=function(e){return null!=e&&(i(e)||r(e)||!!e._isBuffer)}},function(e,n,t){"use strict";e.exports=function(e,n){var t=0,i=0,r=!1;void 0===n&&(n=2),e=e.toString().replace(/&lt;/g,"<").replace(/&gt;/g,">");var o={ENT_NOQUOTES:0,ENT_HTML_QUOTE_SINGLE:1,ENT_HTML_QUOTE_DOUBLE:2,ENT_COMPAT:2,ENT_QUOTES:3,ENT_IGNORE:4};if(0===n&&(r=!0),"number"!=typeof n){for(n=[].concat(n),i=0;i<n.length;i++)0===o[n[i]]?r=!0:o[n[i]]&&(t|=o[n[i]]);n=t}return n&o.ENT_HTML_QUOTE_SINGLE&&(e=e.replace(/&#0*39;/g,"'")),r||(e=e.replace(/&quot;/g,'"')),e=e.replace(/&amp;/g,"&")}},function(e,n){e.exports=require("node-id3")},function(e,n,t){"use strict";function i(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function r(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}function o(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}var u=function(){function e(e,n){for(var t=0;t<n.length;t++){var i=n[t];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(n,t,i){return t&&e(n.prototype,t),i&&e(n,i),n}}(),a=t(1),s=t(16),c=t(0),l=t(3),f=(t(2),t(7)),d=(t(5),t(6)),m=d.EventEmitter,p=function(e){function n(){i(this,n);var e=r(this,(n.__proto__||Object.getPrototypeOf(n)).call(this));return e.users=[],e.nowPlaying=!1,e.vol=10,e.on("playEnd",function(){e.pause=!1,e.emit("pauseStateChange",!1),e.play()}),e}return o(n,e),u(n,[{key:"init",value:function(e){this.client=e}},{key:"allQueues",value:function(){return this.users}},{key:"add",value:function(e,n){e=this.users.find("id",e.id||e);for(var t=0;t<n;t++)e.queue.addFromPlayList()}},{key:"getUsers",value:function(){var e=this;return c("[musicPlayer] get users with queues "),new Promise(function(n){var t=[];e.users.map(function(e){t.push(new Promise(function(n){c("[musicPlayer] checking user "+e),e.user.bot?n(!1):e.queue.getThis().then(function(t){n(t?e:!1)})}))}),Promise.all(t).then(n)})}},{key:"play",value:function(){var e=this,n=function(e){return new Promise(function(n){n(e.filter(function(e){return e||!1}))})},t=function(e){return new Promise(function(n,t){e.length?(c("[musicPlayer] "+e.length+" users geted"),n(e)):t("no users with songs")})},i=function(e){return new Promise(function(n,t){var i=Math.round(Math.random()*(e.length-1)),r=e[i];r||t("invalid user"),c("[musicPlayer] selected "+r),n(r)})},r=function(e){return new Promise(function(n,t){e.queue.getThis().then(function(t){n({user:e,audio:t})})})},o=function(n){var t=function(t){return new Promise(function(i,r){e.np=n,e.pause=!1;var o=f(t,{filter:"audioonly"}),u={seek:0,volume:e.vol/100},s=e.client.voiceConnections.filter(function(e,n){return n==a.guildId}).first().playStream(o,u);s.on("error",r),s.on("start",function(){c("[musicPlayer] start playing stream "+n.fileName)}),s.on("end",function(){c("[musicPlayer] end playing stream "+n.fileName),e.np=!1,i()})})},i=function(n){return new Promise(function(t,i){e.np=n;var r=l.join(__dirname,a.folders.cache,n.userId,n.fileName),o=e.client.voiceConnections.filter(function(e,n){return n==a.guildId}).first().playFile(r,{volume:e.vol/100});o.on("error",i),o.on("start",function(){c("[musicPlayer] start playing file "+n.fileName)}),o.on("end",function(){c("[musicPlayer] end playing file "+n.fileName),e.np=!1,t()})})};return new Promise(function(e,r){c("[musicPlayer] audio geted "+n.audio.fileName);var o;o=n.audio.local?i:t,o(n.audio).then(function(){n.user.queue.skip(),e()}).catch(r)})};c("[musicPlayer] waiting for song"),e.np||e.getUsers().then(n).then(t).then(i).then(r).then(o).then(function(){setTimeout(function(){e.emit("playEnd")},1e3)}).catch(function(n){c("[musicPlayer] not playing because: "+n+", next try after 5s"),setTimeout(function(){e.emit("playEnd")},5e3)})}},{key:"addLocal",value:function(e){var n=this;if(e.local=!0,n.users){var t=n.users.find("id",e.userId);t?t.queue.add(e):c("[musicPlayer] Audio not added, user <@"+e.userId+"> not in voice channel with bot")}}},{key:"refresh",value:function(){var e=this,n=function(){return new Promise(function(n){e.client.voiceConnections.map(function(n,t){t==a.guildId&&(e.users=n.channel.members)}),c("[musicPlayer] update users"),n()})},t=function(){return new Promise(function(n){e.users.map(function(n){n.queue||(n.queue=new s(n),n.queue.on("changed",function(t){e.emit("queueChange",n)}),n.queue.playList.on("playListChange",function(t){e.emit("playListChange",n)}))}),c("[musicPlayer] update queues"),n()})};return new Promise(function(e){c("[musicPlayer] refresh"),n().then(t).then(e)})}},{key:"getUsers",value:function(){var e=this;return c("[musicPlayer] get users with queues "),new Promise(function(n){var t=[];e.users.map(function(e){t.push(new Promise(function(n){c("[musicPlayer] checking user "+e),e.user.bot?n(!1):e.queue.getThis().then(function(t){n(t?e:!1)})}))}),Promise.all(t).then(n)})}},{key:"np",get:function(){return this.nowPlaying},set:function(e){this.nowPlaying=e,this.emit("npChange",e)}},{key:"pause",get:function(){var e=this.client.voiceConnections.filter(function(e,n){return n==a.guildId}).first();return!(!e||!e.dispatcher)&&e.dispatcher.paused},set:function(e){if(e!=this.pause){var n=this.client.voiceConnections.filter(function(e,n){return n==a.guildId}).first();if(!n||!n.dispatcher)return;var t=n.dispatcher;e?(t.pause(),c("[musicPlayer] paused")):(t.resume(),c("[musicPlayer] resumed")),this.emit("pauseStateChange",e)}}},{key:"volume",get:function(){return this.vol},set:function(e){this.emit("volumeChange",e),this.vol=e;var n=this.client.voiceConnections.filter(function(e,n){return n==a.guildId}).first();n&&n.dispatcher&&n.dispatcher.setVolume(e/100)}}]),n}(m);e.exports=new p},function(e,n,t){"use strict";function i(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function r(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}function o(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}var u=function(){function e(e,n){for(var t=0;t<n.length;t++){var i=n[t];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(n,t,i){return t&&e(n.prototype,t),i&&e(n,i),n}}(),a=(t(1),t(17)),s=t(0),c=(t(5),t(6)),l=c.EventEmitter,f=function(e){function n(e){i(this,n);var t=r(this,(n.__proto__||Object.getPrototypeOf(n)).call(this));return t.member=e,t.queue=[],t.playList=new a(e),t}return o(n,e),u(n,[{key:"add",value:function(e){e.addTime=Date.now(),this.queue.push(e),this.playList.add(e),this.emit("changed",this.queue),s("[userQueue] "+this.member+" added "+e.fileName)}},{key:"remove",value:function(e){"all"==e?this.queue=[]:this.queue.splice(e,1),this.queue.length||this.addFromPlayList(),this.emit("changed",this.queue)}},{key:"skip",value:function(){s("[UserQueue] "+this.member+" skiped"),this.remove(0)}},{key:"getAll",value:function(){return s("[UserQueue] "+this.member+" get all"),this.queue}},{key:"addFromPlayList",value:function(){var e=this;return s("[UserQueue] "+this.member+" add 1 in queue from play list"),new Promise(function(n){e.playList.get("random").then(function(t){e.queue.push(t),e.emit("changed",e.queue),n(t)})})}},{key:"fix",value:function(){this.queue=this.queue.filter(function(e){return e||!1}),this.emit("changed",this.queue)}},{key:"getThis",value:function(){var e=this;return s("[UserQueue] "+e.member+" try to get 1 from queue"),new Promise(function(n,t){e.queue.length?(s("[UserQueue] "+e.member+" get "+(e.queue[0]?e.queue[0].fileName:"void")+" from queue"),e.queue[0]||e.fix(),n(e.queue[0])):(s("[UserQueue] queue is empty"),e.addFromPlayList().then(n))})}}]),n}(l);e.exports=f},function(e,n,t){"use strict";function i(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function r(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}function o(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}var u=function(){function e(e,n){for(var t=0;t<n.length;t++){var i=n[t];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(n,t,i){return t&&e(n.prototype,t),i&&e(n,i),n}}(),a=t(3),s=t(1),c=t(2),l=t(0),f=t(6),d=f.EventEmitter,m=function(e){function n(e){i(this,n);var t=r(this,(n.__proto__||Object.getPrototypeOf(n)).call(this));return t.member=e,t.fileName=t.member.id+".json",t.path=a.join(__dirname,s.folders.playLists),t.cachePath=a.join(__dirname,s.folders.cache),t.checkFileExist().then(function(){return l("[UserPlayList] "+t.member+" file checked")}),t}return o(n,e),u(n,[{key:"checkFileExist",value:function(){var e=this,n=this;return new Promise(function(t){c.existsSync(a.join(n.path,n.fileName))?t():(l("[UserPlayList] "+e.member+" created file: "+a.join(n.path,n.fileName)),c.writeFile(n.path+n.fileName,JSON.stringify({data:[]}),t))})}},{key:"add",value:function(e){var n=this,t=this,i=function(n){return new Promise(function(t,i){var r=n.data.filter(function(n){return n.fileName==e.fileName});r.length||n.data.push(e),r.length&&i("audio already exist"),t(n)})},r=function(i){c.writeFile(a.join(t.path,t.fileName),JSON.stringify(i),function(r){t.cache=i,t.emit("playListChange",i),l("[UserPlayList] "+n.member+" added: "+e.fileName)})};return new Promise(function(e,n){t.getAll().then(i).then(r).catch(function(e){l("[UserPlayList] audio not added because: "+e)})})}},{key:"remove",value:function(e,n){var t=this,i=this;return new Promise(function(r,o){i.getAll().then(function(i){var r=function(n){return new Promise(function(r,o){var u=i.data.splice(n,1)[0];u||r();var s=a.join(t.cachePath,u.userId+"/",u.fileName);c.unlink(s,function(e){l(e?"[UserPlayList] "+t.member+" not removed "+u.fileName+" from cache. "+e:"[UserPlayList] "+t.member+" removed "+u.fileName+" from cache"),r()}),l("[UserPlayList] "+t.member+" removed "+u.fileName+" with id "+e+" from playList")})};return new Promise(function(o){if(Array.isArray(e)&&e.every(function(e){return"number"==typeof e})){var u=[];e.map(function(e){u.push(r(e))}),Promise.all(u).then(function(){return o(i)})}else"number"==typeof e?r(e).then(function(){return o(i)}):(i.data=i.data.filter(function(t){return t[e]!=n}),l("[UserPlayList] "+t.member+" removed all where: field "+e+" == "+n),o(i))})}).then(function(e){c.writeFile(a.join(i.path,i.fileName),JSON.stringify(e),function(n){i.cache=e,i.emit("playListChange",e)})}).catch(console.error)})}},{key:"getAll",value:function(){var e=this,n=this;return new Promise(function(t,i){n.cache?(l("[UserPlayList] "+e.member+" get all from cache"),t(n.cache)):c.readFile(a.join(n.path,n.fileName),"utf8",function(r,o){r&&i(r);var u=JSON.parse(o);n.cache=u,l("[UserPlayList] "+e.member+" get all file content"),t(u)})})}},{key:"get",value:function(e){var n=this;return l("[UserPlayList] "+this.member+" get 1 random from playList"),new Promise(function(t){new Promise(function(e){n.cache?e(n.cache):n.getAll().then(e).catch(function(){l("[UserPlayList] "+n.member+" error read playList file"),t()})}).then(function(i){if(l("[UserPlayList] get from "+(n.cache?"cache":"file")),i.data.length)if("random"==e){var r=Math.round(Math.random()*(i.data.length-1)),o=i.data[r];l("[UserPlayList] "+n.member+" get random "+o.fileName+" with id "+(r+1)+" of "+i.data.length),t(o)}else{var u=i.data[e];l("[UserPlayList] "+n.member+" get "+u.fileName+" with id "+(e+1)+" of "+i.data.length),t(u)}else l("[UserPlayList] "+n.member+" playList is empty"),t()})})}}]),n}(d);e.exports=m},function(e,n,t){"use strict";var i=t(19),r=i(),o=t(4).createServer(r),u=t(0),a=t(1),s=(t(4),t(20)(o)),c=t(21),l=function(){function e(){i.on("npChange",function(e){s.sockets.emit("nowPlayingChange",e)}),i.on("pauseStateChange",function(e){s.sockets.emit("pauseStateChange",e)}),i.on("queueChange",function(e){var n=l.filter(function(n){return n.uid==e.id});if(n.length){var t=n[0].socket;t&&t.emit("queueChange",e.queue.getAll())}}),i.on("playListChange",function(e){var n=l.filter(function(n){return n.uid==e.id})[0];if(n){var t=n.socket;t&&e.queue.playList.getAll().then(function(e){t.emit("playListChange",e.data)})}})}function n(){return s.on("connection",function(e){u("[api] new connection "+e.id),setTimeout(function(){e.emit("getUID")},300),e.on("disconnect",function(n){var t=l.filter(function(n,t){if(n.id==e.id)return l.splice(t,1)})[0];u("[api] <@"+(t?t.uid:"no authorized")+"> disconnected "+e.id)}),e.on("UID",function(n){l.filter(function(e){return e.uid==n}).length?l.map(function(t){t.uid=n,t.socket=e}):l.push({socket:e,uid:n}),u("[api] bind UID "+n+" to socket "+e.id)}),e.on("getAll",function(n){var t={users:[],nowPlaying:i.np,onPause:i.pause,volume:i.volume},r=[];i.allQueues().map(function(e,n){r.push(e.queue.playList.getAll()),t.users.push({name:e.name,id:n,queue:e.queue.getAll()})}),Promise.all(r).then(function(e){return new Promise(function(n){e.map(function(e,n){t.users[n].playList=e.data}),n()})}).then(function(){e.emit("all",t)})}),e.on("skip",function(e){u("[api] try to skip from "+e.userId);var n=r.voiceConnections.filter(function(e,n){return n==a.guildId}).first().dispatcher;n&&n.end("skip")}),e.on("add",function(e){e.count>0&&e.count<=100?(u("[api] added "+e.count+" random items from playlist to "+e.userId),i.add(e.userId,e.count)):u("[api] not added "+e.count+" random items from playlist to "+e.userId)}),e.on("pauseStateChange",function(e){i.pause=!!e.newState,u("[api] set pause to "+e.newState+" by "+e.userId)}),e.on("volumeChanged",function(n){n.newValue<0||n.newValue>100||(i.volume=n.newValue,e.broadcast.emit("volumeChange",n.newValue))}),e.on("clearQueue",function(e){var n=i.allQueues().find("id",e.userId);n&&(u("[api] removed all queue for user "+e.userId),n.queue.remove("all"))}),e.on("removeFromQueue",function(e){var n=i.allQueues().find("id",e.userId);n&&(u("[api] removed "+e.index+" from queue for user "+e.userId),n.queue.remove(e.index))}),e.on("removeFromPlayList",function(e){var n=i.allQueues().find("id",e.userId);n&&(u("[api] removed "+e.index+" from playList for user "+e.userId),n.queue.playList.remove(e.index))}),e.on("removeSelectedFromPlayList",function(e){var n=i.allQueues().find("id",e.userId);n&&e.ids&&(u("[api] removed "+e.ids.length+" items from playList for user "+e.userId),n.queue.playList.remove(e.ids))}),e.on("addFromPlayListInQueue",function(e){var n=i.allQueues().find("id",e.userId);n&&(u("[api] added "+e.index+" from playList in queue for user "+e.userId),n.queue.playList.get(e.index).then(function(e){n.queue.add(e)}))}),e.on("addSelectedFromPlaylistInQueue",function(e){var n=i.allQueues().find("id",e.userId);n&&e.ids&&(u("[api] added "+e.ids.length+" items from playList in queue for user "+e.userId),e.ids.map(function(e){n.queue.playList.get(e).then(function(e){n.queue.add(e)})}))})}),o.listen(2303),u("[api] init"),{bind:function(n,t){r=n,i=t,e()},register:function(e,n){var t={type:"update",ip:e,guildId:n},i="http://pew-pc.com/harold/index.php?";for(var r in t)t.hasOwnProperty(r)&&(i+=r+"="+t[r]+"&");c.get(i,function(e,n,t){e||1==t?u("[api] cannot register. "+e||t):"0"==t&&u("[api] registred")})}}}var t,i,r,l=[];return{getInstance:function(){return t||(t=n()),t}}}();e.exports=l.getInstance()},function(e,n){e.exports=require("express")},function(e,n){e.exports=require("socket.io")},function(e,n){e.exports=require("request")},function(e,n){e.exports=require("externalip")}]);