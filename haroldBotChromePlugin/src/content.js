'use strict'

Vue.component('item', {
    template: `#item-tpl`,
    props: ['filename', 'index', 'add']
})

Vue.component('selectServerOption', {
    template: `#selectServerOption-tpl`,
    props: ['item']
})

var main = new Vue({
    el: '.mainWrapper',
    data: {
        'UID': "not set",
        nowPlaying: "loading",
        onPause: false,
        queue: [],
        playList: [],
        addCount: "",
        volume: 10,
		playListSelectedCount: 0,
		serverIp: "",
		selectedServerIp: "",
		onlineServers: [],
		port: 2303
    },
	computed: {
		ip: {
			get: function () {
				return this.serverIp;
			},
			set: function (newIp) {
				if (this.serverIp == newIp) return
				chrome.storage.sync.set({
					'serverIp': newIp
				})
				this.serverIp = newIp;

			}
		},
		selectedServer: {
			get: function () {
				return this.selectedServerIp
			},
			set: function (newValue) {
				this.selectedServerIp = newValue
				this.ip = newValue
				this.refreshAll()
			}
		}
	},
    methods: {
        clearUID: function(e) {
            chrome.storage.sync.set({
                'userId': ''
            })
        },
        pause: function(e) {
            socket.emit("pauseStateChange", {
                userId: UID,
                newState: true
            })
            console.log("paused", this);
        },
        resume: function(e) {
            socket.emit("pauseStateChange", {
                userId: UID,
                newState: false
            })
            console.log("resumed");
        },
        skip: function(e) {
            socket.emit("skip", {
                userId: UID
            })
        },
        add: function(e) {
            socket.emit("add", {
                userId: UID,
                count: +this.addCount
            })
			main.addCount = ""
        },
        stop: function() {
            socket.emit("stop", {
                userId: UID
            })
        },
        defaultVolume: function() {
            this.volume = 10
            volumeSlider.slider("value", 10)
            socket.emit("volumeChanged", {
                userId: UID,
                newValue: 10
            })
        },
        clearQueue: function() {
            socket.emit("clearQueue", {
                userId: UID
            })
        },
        removeFromQueue: function(index) {
            socket.emit("removeFromQueue", {
                userId: UID,
                index: index
            })
        },
		removeFromPlayList: function (index) {
			socket.emit("removeFromPlayList", {
                userId: UID,
                index: index
            })
		},
		addToQueueFromPlaylist: function (index) {
			socket.emit("addFromPlayListInQueue", {
                userId: UID,
                index: index
            })
		},
		unselectSelected: function (e) {
			$(".selectable .ui-selected").removeClass("ui-selected")
			this.playListSelectedCount = 0
			this.playList.map(el => el.selected = false)
		},
		addSelectedFromPlaylistInQueue: function () {
			let selectedIDS = main.playList
				.map((el, id) => {
					if (el.selected) return id
				})
				.filter(el => typeof el == 'number')
			if (selectedIDS.length > 2 && selectedIDS[0] == 0) selectedIDS.splice(0, 1)

			socket.emit("addSelectedFromPlaylistInQueue", {
                userId: UID,
                ids: selectedIDS
            })
		},
		removeSelectedFromPlayList: function () {
			let selectedIDS = main.playList
				.map((el, id) => {
					if (el.selected) return id
				})
				.filter(el => typeof el == 'number')
			if (selectedIDS.length > 2 && selectedIDS[0] == 0) selectedIDS.splice(0, 1)

			socket.emit("removeSelectedFromPlayList", {
                userId: UID,
                ids: selectedIDS
            })
		},
		refreshAll: function () {
			if (!this.ip) return
			let addr = `http://${this.ip}:${this.port}/`

			if (socket) {
				socket.disconnect()
			}

			socket = io(addr)
			addSocketEvents(socket)
			socket.emit("getAll", {
				userId: main.UID
			})
		}
    }
})


// ###  events  ###

var addSocketEvents = (socket) => {
	socket.on("all", cache => {
	    let thisUser = cache.users.filter(user => user.id == UID)[0]
	    main.nowPlaying = cache.nowPlaying.fileName
	    main.playList = thisUser.playList
	    main.onPause = cache.onPause
	    main.queue = thisUser.queue
	    main.volume = cache.volume
	    volumeSlider.slider("value", cache.volume)
	})

	socket.on("queueChange", data => {
	    main.queue = data
	})

	socket.on("nowPlayingChange", data => {
	    main.nowPlaying = data.fileName
	})

	socket.on("playListChange", data => {
	    main.playList = data
	})

	socket.on("pauseStateChange", data => {
	    main.onPause = data
	})

	socket.on("getUID", data => {
	    socket.emit("UID", UID)
	})

	socket.on("volumeChange", data => {
	    volumeSlider.slider("value", +data)
	    main.volume = +data
	})

}

chrome.storage.onChanged.addListener((data, area) => {
	if (!data.userId) return
    main.UID = data.userId.newValue
    UID = data.userId.newValue
})

// ###  init  ###

var UID, volumeSlider, sliderDataSendTimeout, socket;

$(function() {
    volumeSlider = $('#volumeSlider').slider({
        value: main.volume,
        min: 0,
        max: 100,
        step: 1,
        slide: function(e, ui) {
            main.volume = ui.value
			if (sliderDataSendTimeout) clearTimeout(sliderDataSendTimeout)
			sliderDataSendTimeout = setTimeout(() => {
				socket.emit("volumeChanged", {
					userId: UID,
					newValue: ui.value
				})
			}, 100)
        }
    })

	$(".selectable").selectable({
		selected: function (e, ui) {
			main.playList[$(ui.selected).index()].selected = true
			main.playListSelectedCount++
		},
		unselected: function (e, ui) {
			main.playList[$(ui.unselected).index()].selected = false
			main.playListSelectedCount--
		}
	})


    chrome.storage.sync.get(["userId", "serverIp"], (data) => {
        main.UID = data.userId
		main.ip = data.serverIp
		UID = data.userId

		main.refreshAll()
    })

	var refreshOnlineServers = () => {
		$.get("http://pew-pc.com/harold/index.php", data => {
			main.onlineServers = JSON.parse( data )
		})
	}

	refreshOnlineServers()
	setInterval(refreshOnlineServers, 10000)

})
