function addZero(digits_length, source){
    var text = source + '';
    while(text.length < digits_length)
        text = '0' + text;
    return text;
}

module.exports = function (msg) {
	let d = new Date()
	let date = d.getFullYear() + "-" + addZero( 2, (d.getMonth() + 1) ) + "-" + addZero( 2, d.getDate() ) + " " + d.getHours() + ":" + addZero( 2, d.getMinutes() ) + ":" + addZero( 2, d.getSeconds() ) + ":" + addZero( 3, d.getMilliseconds() )
	console.log(date, msg)
}
