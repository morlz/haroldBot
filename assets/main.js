/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function addZero(digits_length, source) {
    var text = source + '';
    while (text.length < digits_length) {
        text = '0' + text;
    }return text;
}

module.exports = function (msg) {
    var d = new Date();
    var date = d.getFullYear() + "-" + addZero(2, d.getMonth() + 1) + "-" + addZero(2, d.getDate()) + " " + d.getHours() + ":" + addZero(2, d.getMinutes()) + ":" + addZero(2, d.getSeconds()) + ":" + addZero(3, d.getMilliseconds());
    console.log(date, msg);
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var fs = __webpack_require__(2);
var path = __webpack_require__(3);

var folders = {
	playLists: "playLists/",
	cache: "cache/",
	tmp: "tmp/"
};

var defaultOptions = {
	token: 'app token here',
	prefix: '!',
	guildId: "your server id here",
	folders: folders
};

var configFile = path.join(__dirname, "/config.json");
if (!fs.existsSync(configFile)) {
	fs.writeFileSync(configFile, JSON.stringify(defaultOptions));
	process.exit(0);
}

var options = JSON.parse(fs.readFileSync(configFile));

if (options.token == "app token here" || options.token.length != 59 || options.guildId == "your server id here" || options.guildId.length != 18 || typeof +options.guildId != 'number') {
	console.log("invalid config");
	process.exit(0);
}

/*
let options = {
	token: "MzQ1OTA1NzAxNjM5Njg0MTA2.DHCgYA.1SMCcJem_lXdWVuS90LNXFFpznA",
	prefix: "!",
	guildId: "345551217918738432",
	folders: folders
}
*/

for (var i in options.folders) {
	var folder = path.join(__dirname, folders[i]);
	if (!fs.existsSync(folder)) fs.mkdirSync(folder);
}

module.exports = options;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("ytdl-core");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Discord = __webpack_require__(9);
var client = new Discord.Client();
var fs = __webpack_require__(2);
var ytdl = __webpack_require__(7);
var http = __webpack_require__(4);
var path = __webpack_require__(3);
var log = __webpack_require__(0);
var musicFromPlugin = __webpack_require__(10);
var options = __webpack_require__(1);
var musicPlayer = __webpack_require__(15);
musicPlayer.init(client);

var util = __webpack_require__(5);
var api = __webpack_require__(18);

api.bind(client, musicPlayer);

var externalip = __webpack_require__(22);

var hostIp = "127.0.0.1",
    reg = function reg() {
	externalip(function (err, ip) {
		hostIp = ip;
		api.register(ip, options.guildId);
	});
};

reg();
setInterval(reg, 60000);

'use strict';

var messages = {
	'play': function play(msg) {
		var splited = msg.content.split(" ");
		var url = splited.splice(1, splited.length)[0];
		//musicPlayer.addUrl ( msg.member.id, url )
	},
	'host': function host(msg) {
		msg.reply("hosted on " + hostIp);
	},
	'stop': function stop(msg) {},
	'pause': function pause(msg) {},
	'resume': function resume(msg) {},
	'volume': function volume(msg) {},
	'loli': function loli(msg) {
		var botGuildMember = client.guilds.find("id", options.guildId).members.find("id", client.user.id);
		["пошёл нахуй :)", "Harold"].forEach(function (el, id) {
			setTimeout(function () {
				botGuildMember.setNickname(el);
			}, id * 1000);
		});

		msg.reply('https://cdn.discordapp.com/attachments/345930097250926602/351458063125053440/MOvL9CT49ME.png');
	},
	'clear': function clear(msg) {},
	'queue': function queue(msg) {
		var splited = msg.content.split(" ");
		var param = splited.splice(1, 1);
		var sendMsg = function sendMsg(replyMsg) {
			msg.reply(replyMsg);
		};
		musicPlayer.getUsers().then(function (queues) {
			log("[main] get all queues");
			var replyMsg = "\n queues: \n";
			queues.map(function (user) {
				if (!user) return;
				if (param != 'all' && user.id != msg.member.id) return;
				replyMsg += user + ":\n";
				user.queue.getAll().forEach(function (el, id2) {
					if (!el) return;
					var tmp = "\t" + (id2 + 1) + ".\t" + el.fileName + "\n";
					if (replyMsg.length + tmp.length > 1900) {
						sendMsg(replyMsg);
						replyMsg = '\n';
					}
					replyMsg += tmp;
				});
			});
			//log("send message: " + replyMsg)
			sendMsg(replyMsg);
		});
	},
	'reconnect': function reconnect(msg) {},
	'off': function off(msg) {
		var voiceConnection = client.voiceConnections.filter(function (el, id) {
			return id == options.guildId;
		}).first();
		if (voiceConnection) voiceConnection.disconnect();

		log("[main] stoped by " + msg.member);
		process.exit(0);
	},
	'summon': function summon(msg) {
		if (msg.member.voiceChannel) {
			msg.member.voiceChannel.join().then(function (connection) {
				log('[main] joined');
				musicPlayer.refresh().then(function () {
					//let dispatcher = client.voiceConnections.filter((el, id) => id == options.guildId).first().dispatcher

					if (!musicPlayer.np()) musicPlayer.play();
				});
			}).catch(console.log);
		}
	},
	'np': function np(msg) {
		msg.reply(musicPlayer.np ? "now playing " + (musicPlayer.np.fileName || musicPlayer.np.name) : 'now not playing');
	},
	'help': function help(msg) {},
	'skip': function skip(msg) {
		log("[main] skiped by " + msg.member);
		var dispatcher = client.voiceConnections.filter(function (el, id) {
			return id == options.guildId;
		}).first().dispatcher;
		if (dispatcher) dispatcher.end("skip");
	},
	'playlist': function playlist(msg) {
		var getPlayList = function getPlayList(users) {
			return new Promise(function (resolve) {
				users.map(function (user) {
					if (user.id == msg.member.id) user.queue.playList.getAll().then(resolve);
				});
			});
		};

		var createMsg = function createMsg(playList) {
			return new Promise(function (resolve) {
				var replyMsg = "\n";
				playList.data.map(function (el, id) {
					var tmp = id + 1 + ".\t " + el.fileName + "\n";
					if (replyMsg.length + tmp.length > 1950) {
						sendMsg(replyMsg);
						replyMsg = "\n";
					}
					replyMsg += tmp;
				});
				resolve(replyMsg);
			});
		};

		var sendMsg = function sendMsg(replyMsg) {
			msg.reply(replyMsg);
		};

		log("[main] " + msg.member + " get playList");

		musicPlayer.getUsers().then(getPlayList).then(createMsg).then(sendMsg);
	},
	'add': function add(msg) {
		var splited = msg.content.split(" ");
		var count = +splited.splice(1, 1);
		var min = 0,
		    max = 50;
		if (count > min && count <= max) {
			var voiceConnection = client.voiceConnections.filter(function (el, id) {
				return id == options.guildId;
			}).first();
			if (msg.member.voiceChannelID && voiceConnection.channel.id == msg.member.voiceChannelID) {
				musicPlayer.add(msg.member, count);
			} else {
				msg.reply("\u0437\u0430\u0439\u0434\u0438 \u043A\u043E \u043C\u043D\u0435 \u0432 \u043A\u0430\u043D\u0430\u043B");
			}
		} else msg.reply("incorrect input! min: " + min + ", max: " + max);
	},

	//debug

	'debug2': function debug2(msg) {
		musicPlayer.play();
	},
	'debug1': function debug1(msg) {
		msg.member.voiceChannel.join().then(function (connection) {
			connection.playFile("C:/test.mp3");
		});
	}
};

musicFromPlugin.on("song", function (data) {
	musicPlayer.addLocal(data);
});

client.on("message", function (msg) {
	if (msg.content.indexOf(options.prefix) != 0) return;

	log("[main] get message: " + msg.content);

	var splited = msg.content.split(" ");

	splited[0] = splited[0].substr(options.prefix.length, splited[0].length); // remove prefix

	if (messages[splited[0]]) messages[splited[0]](msg);
});

client.on("voiceStateUpdate", function () {
	musicPlayer.refresh();
});

client.on("ready", function () {
	log("[main] Bot connected");
	var voiceChannels = client.guilds.find("id", options.guildId).channels.findAll("type", "voice");

	var join = function join() {
		return new Promise(function (resolve, reject) {
			log("[main] try to join " + voiceChannels[0]);
			voiceChannels[0].join().then(resolve).catch(reject);
		});
	};
	join().then(function () {
		musicPlayer.play();
	});
});

client.login(options.token);

log("[main] Bot started");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("discord.js");

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var log = __webpack_require__(0);
var http = __webpack_require__(4);
var formidable = __webpack_require__(11);
var fs = __webpack_require__(2);
var util = __webpack_require__(5);
var EventEmitter = __webpack_require__(6);
var options = __webpack_require__(1);
var path = __webpack_require__(3);
var isBuffer = __webpack_require__(12);
var htmlspecialchars_decode = __webpack_require__(13);
var nodeID3 = __webpack_require__(14);

var MusicFromPlugin = function (_EventEmitter) {
	_inherits(MusicFromPlugin, _EventEmitter);

	function MusicFromPlugin() {
		_classCallCheck(this, MusicFromPlugin);

		var _this = _possibleConstructorReturn(this, (MusicFromPlugin.__proto__ || Object.getPrototypeOf(MusicFromPlugin)).call(this));

		_this.init();
		return _this;
	}

	_createClass(MusicFromPlugin, [{
		key: 'init',
		value: function init() {
			var _self = this;
			http.createServer(function (req, res) {
				res.setHeader("Access-Control-Allow-Origin", "*");
				res.setHeader("Access-Control-Allow-Methods", "POST");
				res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

				var form = new formidable.IncomingForm();

				form.uploadDir = path.join(__dirname, options.folders.tmp);

				form.parse(req, function (err, fields, files) {
					if (!files.kek || !fields.userId) {
						res.end("???");

						log("[musicFromPlugin] not valid \n" + util.inspect({
							fields: fields,
							files: files,
							host: req.headers.host,
							origins: req.headers.origin,
							userAgent: req.headers['user-agent'],
							contentType: req.headers['content-type']
						}));
						return;
					}

					var cachePath = path.join(__dirname, options.folders.cache, fields.userId);

					if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);

					var splited = files.kek.path.split("\\");

					var names = {
						oldName: path.join(__dirname, splited[splited.length - 2], splited[splited.length - 1]),
						newName: path.join(cachePath, _self.checkName(files.kek.name))
					};

					_self.rename(names).then(function (data) {
						return _self.renameToMaybeRealName(data, fields.userId);
					}).then(function (data) {
						return new Promise(function (resolve) {
							res.end("kek");
							resolve(Object.assign({ userId: fields.userId }, data));
						});
					}).then(function (data) {
						return _self.newSongHandler(data);
					}).catch(console.error);
				});
			}).listen(80);
		}
	}, {
		key: 'newSongHandler',
		value: function newSongHandler(data) {
			var _self = this;
			var splited = data.newName.split("\\");
			var fileName = splited[splited.length - 1];
			log('[musicFromPlugin] ready to add song ' + fileName + ' to user ' + data.userId);
			_self.emit("song", { userId: data.userId, fileName: fileName });
		}
	}, {
		key: 'rename',
		value: function rename(names) {
			return new Promise(function (resolve, reject) {
				log('[musicFromPlugin]\n\trename: \t' + names.oldName + ' \n\tto: \t\t' + names.newName);
				fs.rename(names.oldName, names.newName, function (err) {
					if (err) reject(err);
					resolve(names);
				});
			});
		}
	}, {
		key: 'renameToMaybeRealName',
		value: function renameToMaybeRealName(names, userId) {
			var _self = this;
			return new Promise(function (resolve, reject) {
				if (names.newName.match(/[А-Я]/gi)) resolve(names);
				log("[musicFromPlugin] try to get tags from: " + names.newName);
				var tags = nodeID3.read(names.newName);
				if (tags && tags.artist && tags.title) {
					var newNames = {
						oldName: names.newName,
						newName: path.join(__dirname, options.folders.cache, userId, _self.checkName('/' + tags.artist + ' - ' + tags.title + '.mp3'))
					};
					_self.rename(newNames).then(resolve);
				} else resolve(names);
			});
		}
	}, {
		key: 'checkName',
		value: function checkName(name) {
			var regExp = new RegExp('[/*?<>|`:"]', "g");

			return htmlspecialchars_decode(name).split("&nbsp;–&nbsp;").join(" - ").replace(regExp, '');
		}
	}]);

	return MusicFromPlugin;
}(EventEmitter);

module.exports = new MusicFromPlugin();

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("formidable");

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);
};

function isBuffer(obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj);
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer(obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0));
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function htmlspecialchars_decode(string, quoteStyle) {
  // eslint-disable-line camelcase
  //       discuss at: http://locutus.io/php/htmlspecialchars_decode/
  //      original by: Mirek Slugen
  //      improved by: Kevin van Zonneveld (http://kvz.io)
  //      bugfixed by: Mateusz "loonquawl" Zalega
  //      bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  //         input by: ReverseSyntax
  //         input by: Slawomir Kaniecki
  //         input by: Scott Cariss
  //         input by: Francois
  //         input by: Ratheous
  //         input by: Mailfaker (http://www.weedem.fr/)
  //       revised by: Kevin van Zonneveld (http://kvz.io)
  // reimplemented by: Brett Zamir (http://brett-zamir.me)
  //        example 1: htmlspecialchars_decode("<p>this -&gt; &quot;</p>", 'ENT_NOQUOTES')
  //        returns 1: '<p>this -> &quot;</p>'
  //        example 2: htmlspecialchars_decode("&amp;quot;")
  //        returns 2: '&quot;'
  var optTemp = 0;
  var i = 0;
  var noquotes = false;
  if (typeof quoteStyle === 'undefined') {
    quoteStyle = 2;
  }
  string = string.toString().replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  var OPTS = {
    'ENT_NOQUOTES': 0,
    'ENT_HTML_QUOTE_SINGLE': 1,
    'ENT_HTML_QUOTE_DOUBLE': 2,
    'ENT_COMPAT': 2,
    'ENT_QUOTES': 3,
    'ENT_IGNORE': 4
  };
  if (quoteStyle === 0) {
    noquotes = true;
  }
  if (typeof quoteStyle !== 'number') {
    // Allow for a single string or an array of string flags
    quoteStyle = [].concat(quoteStyle);
    for (i = 0; i < quoteStyle.length; i++) {
      // Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
      if (OPTS[quoteStyle[i]] === 0) {
        noquotes = true;
      } else if (OPTS[quoteStyle[i]]) {
        optTemp = optTemp | OPTS[quoteStyle[i]];
      }
    }
    quoteStyle = optTemp;
  }
  if (quoteStyle & OPTS.ENT_HTML_QUOTE_SINGLE) {
    // PHP doesn't currently escape if more than one 0, but it should:
    string = string.replace(/&#0*39;/g, "'");
    // This would also be useful here, but not a part of PHP:
    // string = string.replace(/&apos;|&#x0*27;/g, "'");
  }
  if (!noquotes) {
    string = string.replace(/&quot;/g, '"');
  }
  // Put this in last place to avoid escape being double-decoded
  string = string.replace(/&amp;/g, '&');
  return string;
};

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("node-id3");

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var options = __webpack_require__(1);
var UserQueue = __webpack_require__(16);
var log = __webpack_require__(0);
var path = __webpack_require__(3);
var fs = __webpack_require__(2);
var ytdl = __webpack_require__(7);
var util = __webpack_require__(5);

var _require = __webpack_require__(6),
    EventEmitter = _require.EventEmitter;

var MusicPlayer = function (_EventEmitter) {
	_inherits(MusicPlayer, _EventEmitter);

	function MusicPlayer() {
		_classCallCheck(this, MusicPlayer);

		var _this = _possibleConstructorReturn(this, (MusicPlayer.__proto__ || Object.getPrototypeOf(MusicPlayer)).call(this));

		_this.users = [];
		_this.nowPlaying = false;
		_this.vol = 10;
		_this.on("playEnd", function () {
			_this.pause = false;
			_this.emit("pauseStateChange", false);
			_this.play();
		});
		return _this;
	}

	_createClass(MusicPlayer, [{
		key: "init",
		value: function init(client) {
			this.client = client;
		}
	}, {
		key: "allQueues",
		value: function allQueues() {
			return this.users;
		}
	}, {
		key: "add",
		value: function add(member, count) {
			member = this.users.find("id", member.id || member);
			for (var i = 0; i < count; i++) {
				member.queue.addFromPlayList();
			}
		}
	}, {
		key: "getUsers",
		value: function getUsers() {
			var _self = this;
			log("[musicPlayer] get users with queues ");
			return new Promise(function (resolve) {
				var promises = [];
				_self.users.map(function (user) {
					promises.push(new Promise(function (resolve2) {
						log("[musicPlayer] checking user " + user);
						if (!user.user.bot) {
							user.queue.getThis().then(function (song) {
								//console.log('debug', song)
								song ? resolve2(user) : resolve2(false);
							});
						} else resolve2(false);
					}));
				});
				Promise.all(promises).then(resolve);
			});
		}
	}, {
		key: "play",
		value: function play() {
			var _self = this;

			var _filterUsers = function _filterUsers(users) {
				return new Promise(function (resolve) {
					resolve(users.filter(function (el) {
						return el ? el : false;
					}));
				});
			};

			var _checkUsersCount = function _checkUsersCount(users) {
				return new Promise(function (resolve, reject) {
					if (users.length) {
						log("[musicPlayer] " + users.length + " users geted");
						resolve(users);
					} else {
						reject('no users with songs');
					}
				});
			};

			var _getRandomUser = function _getRandomUser(users) {
				return new Promise(function (resolve, reject) {
					var randomUserId = Math.round(Math.random() * (users.length - 1));
					var randomUser = users[randomUserId];
					if (!randomUser) reject('invalid user');
					log("[musicPlayer] selected " + randomUser);
					resolve(randomUser);
				});
			};

			var _getAudio = function _getAudio(randomUser) {
				return new Promise(function (resolve, reject) {
					randomUser.queue.getThis().then(function (audio) {
						var data = {
							user: randomUser,
							audio: audio
						};
						resolve(data);
					});
				});
			};

			var _selectPlayerAndPlay = function _selectPlayerAndPlay(data) {
				var _playUrl = function _playUrl(url) {
					return new Promise(function (resolve, reject) {
						_self.np = data;
						_self.pause = false;

						var stream = ytdl(url, { filter: 'audioonly' });

						var streamOptions = { seek: 0, volume: _self.vol / 100 };
						var dispatcher = _self.client.voiceConnections.filter(function (el, id) {
							return id == options.guildId;
						}).first().playStream(stream, streamOptions);

						dispatcher.on("error", reject);

						dispatcher.on("start", function () {
							log("[musicPlayer] start playing stream " + data.fileName);
						});
						dispatcher.on("end", function () {
							log("[musicPlayer] end playing stream " + data.fileName);
							_self.np = false;
							resolve();
						});
					});
				};

				var _playFile = function _playFile(data) {
					return new Promise(function (resolve, reject) {
						_self.np = data;

						var filePath = path.join(__dirname, options.folders.cache, data.userId, data.fileName);
						var dispatcher = _self.client.voiceConnections.filter(function (el, id) {
							return id == options.guildId;
						}).first().playFile(filePath, { volume: _self.vol / 100 });

						dispatcher.on("error", reject);

						dispatcher.on("start", function () {
							log("[musicPlayer] start playing file " + data.fileName);
						});

						dispatcher.on("end", function () {
							log("[musicPlayer] end playing file " + data.fileName);
							_self.np = false;
							resolve();
						});
					});
				};

				/*
    let _play = (audio) => {
    	return new Promise((resolve, reject) => {
    		_self.np = data
    		_self.pause = false
    				let voiceConnection = _self.client.voiceConnections
    			.filter((el, id) => id == options.guildId)
    			.first()
    				var dispatcher;
    				if (data.audio.local) {
    			let filePath = path.join(__dirname, options.folders.cache, audio.data.userId, audio.data.fileName)
    			dispatcher = voiceConnection.playFile(filePath, { volume: _self.vol / 100 })
    		} else {
    			const streamOptions = { seek: 0, volume: _self.vol / 100 };
    			let stream = ytdl(url, { filter : 'audioonly' });
    			dispatcher = voiceConnection.playStream(stream, streamOptions)
    		}
    				dispatcher.on("error", reject)
    				dispatcher.on("start", () => {
    			log(`[musicPlayer] start playing file ${audio.data.fileName}`)
    		})
    				dispatcher.on("end", () => {
    			log(`[musicPlayer] end playing file ${audio.data.fileName}`)
    			_self.np = false
    			resolve()
    		})
    			})
    }
    */

				return new Promise(function (resolve, reject) {
					log("[musicPlayer] audio geted " + data.audio.fileName);
					var player;
					if (data.audio.local) {
						// playing from a fule from plugin
						player = _playFile;
					} else {
						//playing from url
						player = _playUrl;
					}
					player(data.audio).then(function () {
						//after playing skip queue and play again
						data.user.queue.skip();
						resolve();
					}).catch(reject);
				});
			};

			log("[musicPlayer] waiting for song");
			if (_self.np) {
				return;
			}
			_self.getUsers().then(_filterUsers).then(_checkUsersCount).then(_getRandomUser).then(_getAudio).then(_selectPlayerAndPlay).then(function () {
				setTimeout(function () {
					_self.emit("playEnd");
				}, 1000);
			}) // play next
			.catch(function (reason) {
				//console.trace(reason)
				log("[musicPlayer] not playing because: " + reason + ", next try after 5s");
				setTimeout(function () {
					_self.emit("playEnd");
				}, 5000);
			});
		}
	}, {
		key: "addLocal",
		value: function addLocal(data) {
			var _self = this;
			data.local = true;
			if (_self.users && !Array.isArray(_self.users)) {
				var user = _self.users.find("id", data.userId);
				if (user) {
					user.queue.add(data);
				} else {
					log("[musicPlayer] Audio not added, user <@" + data.userId + "> not in voice channel with bot");
				}
			}
		}
	}, {
		key: "refresh",
		value: function refresh() {
			var _self = this;

			var _updateUsers = function _updateUsers() {
				return new Promise(function (resolve) {
					_self.client.voiceConnections.map(function (el, id) {
						if (id == options.guildId) {
							_self.users = el.channel.members;
						}
					});
					log("[musicPlayer] update users");
					resolve();
				});
			};

			var _updateQueues = function _updateQueues() {
				return new Promise(function (resolve) {
					_self.users.map(function (user) {
						if (!user.queue) {
							user.queue = new UserQueue(user);

							user.queue.on("changed", function (data) {
								_self.emit("queueChange", user);
							});

							user.queue.playList.on("playListChange", function (data) {
								_self.emit("playListChange", user);
							});
						}
					});
					log("[musicPlayer] update queues");
					resolve();
				});
			};
			return new Promise(function (resolve) {
				log("[musicPlayer] refresh");
				_updateUsers().then(_updateQueues).then(resolve);
			});
		}
	}, {
		key: "getUsers",
		value: async function getUsers() {
			//return only users (no bots) with non zero length queue
			log("[musicPlayer] get users with queues ");
			var users = this.users.array().filter(function (user) {
				return user.queue.haveItems;
			});
			return users;
		}
	}, {
		key: "np",
		get: function get() {
			return this.nowPlaying;
		},
		set: function set(newState) {
			this.nowPlaying = newState;
			this.emit("npChange", newState);
		}
	}, {
		key: "pause",
		get: function get() {
			var voiceConnection = this.client.voiceConnections.filter(function (el, id) {
				return id == options.guildId;
			}).first();
			if (!voiceConnection || !voiceConnection.dispatcher) return false;
			return voiceConnection.dispatcher.paused;
		},
		set: function set(newState) {
			if (newState != this.pause) {
				var voiceConnection = this.client.voiceConnections.filter(function (el, id) {
					return id == options.guildId;
				}).first();

				if (!voiceConnection || !voiceConnection.dispatcher) return;
				var dispatcher = voiceConnection.dispatcher;

				if (newState) {
					dispatcher.pause();
					log("[musicPlayer] paused");
				} else {
					dispatcher.resume();
					log("[musicPlayer] resumed");
				}

				this.emit("pauseStateChange", newState);
			}
		}
	}, {
		key: "volume",
		get: function get() {
			return this.vol;
		},
		set: function set(newValue) {
			this.emit("volumeChange", newValue);
			this.vol = newValue;
			var voiceConnection = this.client.voiceConnections.filter(function (el, id) {
				return id == options.guildId;
			}).first();
			if (!voiceConnection || !voiceConnection.dispatcher) return;
			voiceConnection.dispatcher.setVolume(newValue / 100);
		}
	}]);

	return MusicPlayer;
}(EventEmitter);

module.exports = new MusicPlayer();

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var options = __webpack_require__(1);
var UserPlayList = __webpack_require__(17);
var log = __webpack_require__(0);
var util = __webpack_require__(5);

var _require = __webpack_require__(6),
    EventEmitter = _require.EventEmitter;

var UserQueue = function (_EventEmitter) {
	_inherits(UserQueue, _EventEmitter);

	function UserQueue(member) {
		_classCallCheck(this, UserQueue);

		var _this = _possibleConstructorReturn(this, (UserQueue.__proto__ || Object.getPrototypeOf(UserQueue)).call(this));

		_this.member = member;
		_this.queue = [];
		_this.playList = new UserPlayList(member);
		_this.addFromPlayList();
		return _this;
	}

	_createClass(UserQueue, [{
		key: "add",
		value: function add(toAdd) {
			toAdd.addTime = Date.now();
			this.queue.push(toAdd);
			this.playList.add(toAdd);
			this.emit("changed", this.queue);

			log("[userQueue] " + this.member + " added " + toAdd.fileName);
		}
	}, {
		key: "remove",
		value: function remove(id) {
			var ret = 0;
			if (id == "all") {
				this.queue = [];
			} else {
				ret = this.queue.splice(id, 1);
			}
			if (!this.queue.length) this.addFromPlayList();
			this.emit("changed", this.queue);
			return ret;
		}
	}, {
		key: "skip",
		value: function skip() {
			log("[UserQueue] " + this.member + " skiped");
			return this.remove(0);
		}
	}, {
		key: "getAll",
		value: function getAll() {
			log("[UserQueue] " + this.member + " get all");
			return this.queue;
		}
	}, {
		key: "addFromPlayList",
		value: function addFromPlayList() {
			var _this2 = this;

			log("[UserQueue] " + this.member + " add 1 in queue from play list");
			return new Promise(function (resolve) {
				_this2.playList.get("random").then(function (random) {
					_this2.queue.push(random);
					_this2.emit("changed", _this2.queue);
					resolve(random);
				});
			});
		}
	}, {
		key: "fix",
		value: function fix() {
			this.queue = this.queue.filter(function (el) {
				return el ? el : false;
			});
			this.emit("changed", this.queue);
		}
	}, {
		key: "getThis",
		value: function getThis() {
			var _self = this;
			log("[UserQueue] " + _self.member + " try to get 1 from queue");

			return new Promise(function (resolve, reject) {
				if (!_self.queue.length) {
					log("[UserQueue] queue is empty");
					_self.addFromPlayList().then(resolve);
				} else {
					log("[UserQueue] " + _self.member + " get " + (_self.queue[0] ? _self.queue[0].fileName : 'void') + " from queue");
					if (!_self.queue[0]) _self.fix();
					resolve(_self.queue[0]);
				}
			});
		}
	}, {
		key: "haveItems",
		get: function get() {
			return !!this.queue.length;
		}
	}]);

	return UserQueue;
}(EventEmitter);

module.exports = UserQueue;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var path = __webpack_require__(3);
var options = __webpack_require__(1);
var fs = __webpack_require__(2);
var log = __webpack_require__(0);

var _require = __webpack_require__(6),
    EventEmitter = _require.EventEmitter;

var UserPlayList = function (_EventEmitter) {
	_inherits(UserPlayList, _EventEmitter);

	function UserPlayList(member) {
		_classCallCheck(this, UserPlayList);

		var _this = _possibleConstructorReturn(this, (UserPlayList.__proto__ || Object.getPrototypeOf(UserPlayList)).call(this));

		_this.member = member;

		_this.fileName = _this.member.id + ".json";
		_this.path = path.join(__dirname, options.folders.playLists); //
		_this.cachePath = path.join(__dirname, options.folders.cache);

		_this.checkFileExist().then(function () {
			return log("[UserPlayList] " + _this.member + " file checked");
		});
		return _this;
	}

	_createClass(UserPlayList, [{
		key: "checkFileExist",
		value: function checkFileExist() {
			var _this2 = this;

			var _self = this;
			return new Promise(function (resolve) {
				if (!fs.existsSync(path.join(_self.path, _self.fileName))) {
					log("[UserPlayList] " + _this2.member + " created file: " + path.join(_self.path, _self.fileName));
					fs.writeFile(_self.path + _self.fileName, JSON.stringify({
						"data": []
					}), resolve);
				} else {
					resolve();
				}
			});
		}
	}, {
		key: "add",
		value: function add(toAdd) {
			var _this3 = this;

			var _self = this,
			    injectAudio = function injectAudio(playList) {
				return new Promise(function (resolve, reject) {
					var finded = playList.data.filter(function (audio) {
						return audio.fileName == toAdd.fileName;
					});

					if (!finded.length) playList.data.push(toAdd);
					if (finded.length) reject('audio already exist');
					resolve(playList);
				});
			},
			    writeFile = function writeFile(playList) {
				fs.writeFile(path.join(_self.path, _self.fileName), JSON.stringify(playList), function (err) {
					_self.cache = playList;
					_self.emit("playListChange", playList);
					log("[UserPlayList] " + _this3.member + " added: " + toAdd.fileName);
				});
			};

			return new Promise(function (resolve, reject) {
				_self.getAll().then(injectAudio).then(writeFile).catch(function (reason) {
					log("[UserPlayList] audio not added because: " + reason);
				});
			});
		}
	}, {
		key: "remove",
		value: function remove(field, content) {
			var _this4 = this;

			var _self = this;
			return new Promise(function (resolve, reject) {
				_self.getAll().then(function (playList) {
					var _remove = function _remove(id) {
						return new Promise(function (resolve, reject) {
							var removed = playList.data.splice(id, 1)[0];
							if (!removed) resolve();
							var cachedFilePath = path.join(_this4.cachePath, removed.userId + "/", removed.fileName);
							fs.unlink(cachedFilePath, function (err) {
								if (err) {
									log("[UserPlayList] " + _this4.member + " not removed " + removed.fileName + " from cache. " + err);
								} else {
									log("[UserPlayList] " + _this4.member + " removed " + removed.fileName + " from cache");
								}
								resolve();
							});
							log("[UserPlayList] " + _this4.member + " removed " + removed.fileName + " with id " + field + " from playList");
						});
					};

					return new Promise(function (resolve) {
						if (Array.isArray(field) && field.every(function (el) {
							return typeof el == 'number';
						})) {
							var ps = [];
							field.map(function (el) {
								ps.push(_remove(el));
							});
							Promise.all(ps).then(function () {
								return resolve(playList);
							});
						} else if (typeof field == 'number') {
							_remove(field).then(function () {
								return resolve(playList);
							});
						} else {
							playList.data = playList.data.filter(function (el) {
								return el[field] != content;
							});
							log("[UserPlayList] " + _this4.member + " removed all where: field " + field + " == " + content);
							resolve(playList);
						}

						//reject("[UserPlayList] remove() invalid arguments")
					});
				}).then(function (playList) {
					fs.writeFile(path.join(_self.path, _self.fileName), JSON.stringify(playList), function (err) {
						_self.cache = playList;
						_self.emit("playListChange", playList);
					});
				}).catch(console.error);
			});
		}
	}, {
		key: "getAll",
		value: function getAll() {
			var _this5 = this;

			var _self = this;
			return new Promise(function (resolve, reject) {
				if (_self.cache) {
					log("[UserPlayList] " + _this5.member + " get all from cache");

					resolve(_self.cache);
				} else {
					fs.readFile(path.join(_self.path, _self.fileName), 'utf8', function (err, data) {
						if (err) reject(err);
						var playList = JSON.parse(data);

						_self.cache = playList;

						log("[UserPlayList] " + _this5.member + " get all file content");

						resolve(playList);
					});
				}
			});
		}
	}, {
		key: "get",
		value: function get(id) {
			var _this6 = this;

			log("[UserPlayList] " + this.member + " get 1 random from playList");
			return new Promise(function (resolve) {
				new Promise(function (resolve2) {
					if (_this6.cache) {
						resolve2(_this6.cache);
					} else {
						_this6.getAll().then(resolve2).catch(function () {
							log("[UserPlayList] " + _this6.member + " error read playList file");
							resolve();
						});
					}
				}).then(function (from) {
					log("[UserPlayList] get from " + (_this6.cache ? 'cache' : 'file'));
					if (from.data.length) {
						if (id == "random") {
							var random = Math.round(Math.random() * (from.data.length - 1));
							var randomized = from.data[random];

							log("[UserPlayList] " + _this6.member + " get random " + randomized.fileName + " with id " + (random + 1) + " of " + from.data.length);
							resolve(randomized);
						} else {
							var geted = from.data[id];
							log("[UserPlayList] " + _this6.member + " get " + geted.fileName + " with id " + (id + 1) + " of " + from.data.length);
							resolve(geted);
						}
					} else {
						log("[UserPlayList] " + _this6.member + " playList is empty");
						resolve();
					}
				});
			});
		}
	}]);

	return UserPlayList;
}(EventEmitter);

module.exports = UserPlayList;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var express = __webpack_require__(19);
var app = express();
var server = __webpack_require__(4).createServer(app);
var log = __webpack_require__(0);
var options = __webpack_require__(1);
var http = __webpack_require__(4);
var io = __webpack_require__(20)(server);
var request = __webpack_require__(21);

'use strict';

var api = function () {
	var instance;

	var connections = [],
	    musicPlayer,
	    client;

	function handleMusicPlayerEvents() {
		musicPlayer.on("npChange", function (data) {
			io.sockets.emit("nowPlayingChange", data);
		});

		musicPlayer.on("pauseStateChange", function (data) {
			io.sockets.emit("pauseStateChange", data);
		});

		musicPlayer.on("queueChange", function (data) {
			var socketCon = connections.filter(function (el) {
				return el.uid == data.id;
			});
			if (!socketCon.length) return;

			var socket = socketCon[0].socket;
			if (socket) {
				socket.emit("queueChange", data.queue.getAll());
			}
		});

		musicPlayer.on("playListChange", function (data) {
			var socketCon = connections.filter(function (el) {
				return el.uid == data.id;
			})[0];
			if (!socketCon) return;

			var socket = socketCon.socket;
			if (socket) {
				data.queue.playList.getAll().then(function (playList) {
					socket.emit("playListChange", playList.data);
				});
			}
		});
	}

	function init() {
		io.on("connection", function (socket) {
			log('[api] new connection ' + socket.id);

			setTimeout(function () {
				socket.emit("getUID");
			}, 300);

			socket.on('disconnect', function (data) {
				var user = connections.map(function (el, id) {
					if (el.socket.id == socket.id) {
						return connections.splice(id, 1)[0];
					}
				})[0];
				log('[api] <@' + (user ? user.uid : 'no authorized') + '> disconnected ' + socket.id);
			});

			socket.on("UID", function (data) {
				if (connections.filter(function (el) {
					return el.uid == data;
				}).length) {
					connections.map(function (el) {
						el.uid = data;
						el.socket = socket;
					});
				} else {
					connections.push({
						socket: socket,
						uid: data
					});
				}

				log('[api] bind UID ' + data + ' to socket ' + socket.id);
			});

			socket.on("getAll", function (data) {
				var cache = {
					users: [],
					nowPlaying: musicPlayer.np,
					onPause: musicPlayer.pause,
					volume: musicPlayer.volume
				};

				var plPromises = [];

				musicPlayer.allQueues().map(function (user, id) {
					plPromises.push(user.queue.playList.getAll());
					cache.users.push({
						name: user.name,
						id: id,
						queue: user.queue.getAll()
					});
				});

				Promise.all(plPromises).then(function (pls) {
					return new Promise(function (resolve) {
						pls.map(function (pl, id) {
							cache.users[id].playList = pl.data;
						});
						resolve();
					});
				}).then(function () {
					socket.emit("all", cache);
				});
			});

			socket.on("skip", function (data) {
				log("[api] try to skip from " + data.userId);
				var dispatcher = client.voiceConnections.filter(function (el, id) {
					return id == options.guildId;
				}).first().dispatcher;
				if (dispatcher) dispatcher.end("skip");
			});

			socket.on("add", function (data) {
				var min = 0,
				    max = 100;

				if (data.count > min && data.count <= max) {
					log('[api] added ' + data.count + ' random items from playlist to ' + data.userId);
					musicPlayer.add(data.userId, data.count);
				} else {
					log('[api] not added ' + data.count + ' random items from playlist to ' + data.userId);
				}
			});

			socket.on("pauseStateChange", function (data) {
				musicPlayer.pause = !!data.newState;
				log('[api] set pause to ' + data.newState + ' by ' + data.userId);
			});

			socket.on("volumeChanged", function (data) {
				if (data.newValue < 0 || data.newValue > 100) return;
				musicPlayer.volume = data.newValue;
				socket.broadcast.emit("volumeChange", data.newValue);
			});

			socket.on("clearQueue", function (data) {
				var user = musicPlayer.allQueues().find("id", data.userId);
				if (user) {
					log('[api] removed all queue for user ' + data.userId);
					user.queue.remove("all");
				}
			});

			socket.on("removeFromQueue", function (data) {
				var user = musicPlayer.allQueues().find("id", data.userId);
				if (user) {
					log('[api] removed ' + data.index + ' from queue for user ' + data.userId);
					user.queue.remove(data.index);
				}
			});

			socket.on("removeFromPlayList", function (data) {
				var user = musicPlayer.allQueues().find("id", data.userId);
				if (user) {
					log('[api] removed ' + data.index + ' from playList for user ' + data.userId);
					user.queue.playList.remove(data.index);
				}
			});

			socket.on("removeSelectedFromPlayList", function (data) {
				var user = musicPlayer.allQueues().find("id", data.userId);
				if (user && data.ids) {
					log('[api] removed ' + data.ids.length + ' items from playList for user ' + data.userId);
					user.queue.playList.remove(data.ids);
				}
			});

			socket.on("addFromPlayListInQueue", function (data) {
				var user = musicPlayer.allQueues().find("id", data.userId);
				if (user) {
					log('[api] added ' + data.index + ' from playList in queue for user ' + data.userId);
					user.queue.playList.get(data.index).then(function (audio) {
						user.queue.add(audio);
					});
				}
			});

			socket.on("addSelectedFromPlaylistInQueue", function (data) {
				var user = musicPlayer.allQueues().find("id", data.userId);
				if (user && data.ids) {
					log('[api] added ' + data.ids.length + ' items from playList in queue for user ' + data.userId);
					data.ids.map(function (el) {
						user.queue.playList.get(el).then(function (audio) {
							user.queue.add(audio);
						});
					});
				}
			});
		});

		server.listen(2303);

		log('[api] init');

		return {
			bind: function bind(c, mp) {
				client = c;
				musicPlayer = mp;
				handleMusicPlayerEvents();
			},
			register: function register(ip, guildId) {
				var postData = {
					type: "update",
					ip: ip,
					guildId: guildId
				};

				var url = "http://pew-pc.com/harold/index.php?";

				for (var t in postData) {
					if (postData.hasOwnProperty(t)) {
						url += t + '=' + postData[t] + '&';
					}
				}

				request.get(url, function (err, res, body) {
					if (err || body == 1) {
						log("[api] cannot register. " + err || body);
					} else if (body == "0") {
						log('[api] registred');
					}
				});
			}
		};
	}

	return {
		getInstance: function getInstance() {
			if (!instance) {
				instance = init();
			}
			return instance;
		}
	};
}();

module.exports = api.getInstance();

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("request");

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = require("externalip");

/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map