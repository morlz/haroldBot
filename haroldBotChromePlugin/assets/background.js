!function(e){function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}var t={};n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:o})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="",n(n.s=0)}([function(e,n,t){"use strict";function o(e){return new Promise(function(n){if(!(a.indexOf(e)+1)){a.push(e),console.log("catched url: ",e);var t=new XMLHttpRequest;t.open("GET",e,!0),t.responseType="blob",t.onload=function(){if(200===this.status){var t=this.response;console.log("loaded file",(t.size/1024/1024).toFixed(2),"mb"),n({blob:t,urlIndex:a.indexOf(e)})}},t.send()}})}function r(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return console.log("try to get name",d,e.urlIndex),new Promise(function(t,o){d[e.urlIndex]?(console.log("name geted",d[e.urlIndex]),t({blob:e.blob,fileName:d[e.urlIndex],urlIndex:e.urlIndex})):setTimeout(function(){n<10?r(e,n+1).then(t).catch(o):o()},100)})}function s(){return new Promise(function(e){a.length!=d.length&&(console.log("flushing memory"),!d.length||a.length?(a=[],d=[]):(a=[a[a.length-1]],d=[d[d.length-1]])),e()})}function u(e){console.log("try to send data");var n=new FormData;n.append("kek",e.blob,e.fileName+".mp3"),l().then(function(e){return new Promise(function(t){n.append("userId",e),t(n)})}).then(function(n){if(!i)return void console.warn("not send, no server ip");$.ajax({url:"http://"+i+":80/",data:n,type:"POST",contentType:!1,processData:!1,success:function(n){c(e.urlIndex),console.log("sended, server responce:",n)},error:function(n){c(e.urlIndex),console.warn("error, server responce:",n)}})})}function c(e){a.splice(e,1),d.splice(e,1),s()}function l(){return new Promise(function(e){chrome.storage.sync.get(["userId"],function(n){n.userId?e(n.userId):p?setTimeout(function(){l().then(e)},1e3):chrome.tabs.create({active:!0,url:"https://discordapp.com/channels/345551217918738432"},function(n){console.log("tab created with id",n.index),p=n.index,setTimeout(function(){l().then(e)},1e3)})})})}var i,a=[],d=[];chrome.storage.sync.get(["serverIp"],function(e){i=e.serverIp});var f={urls:["https://*.vk-cdn.net/*","https://*.userapi.com/*/audios/*","https://*.userapi.com/*.mp3?extra=*"]};chrome.webRequest.onSendHeaders.addListener(function(e){o(e.url).then(r).then(u).catch(s)},f,["requestHeaders"]),chrome.storage.onChanged.addListener(function(e,n){e.serverIp&&e.serverIp.newValue&&(i=e.serverIp.newValue),e.lastSongName&&e.lastSongName.newValue&&(console.log("geted song name",e.lastSongName.newValue),d.push(e.lastSongName.newValue))});var p=!1;l().then(function(e){console.log(e)})}]);