
'use strict'

function getIdFromUrl(url){
	return url.split("/")[4];
}

(function recurseGetAvatarUrl (callback) {
	let url = $(".container-iksrDt .avatar-small").css("background-image")
	if (!url) {
		setTimeout(() => {
			recurseGetAvatarUrl (callback)
		}, 300)
	} else {
		callback (url)
	}
})((avatarUrl) => {
	chrome.storage.sync.set( { 'userId': getIdFromUrl(avatarUrl) } , function() {
		console.log("id saved")
	});
})
