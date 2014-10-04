var interval = 3000;
var pingUrl = "http://www.google.com/robots.txt";

var handleLoginPage = function (response) {
	
};

var xhr = new XMLHttpRequest();

xhr.onload = function () {
	if (this.response.indexOf("User-agent:")) {
		handleLoginPage(this.response);
	}
};

var startPing = function () {
	if (navigator.onLine) {
		xhr.open("GET", pingUrl);
		xhr.send();
	} else {
		setTimeout(startPing, interval);
	}
};

xhr.onloadend = function () { setTimeout(startPing, interval) };

startPing();
