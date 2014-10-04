var interval = 3000;

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
		xhr.open("GET", "http://www.google.com/robots.txt");
		xhr.send();
	} else {
		setTimeout(startPing, interval);
	}
};

xhr.onloadend = function () { setTimeout(startPing, interval) };

startPing();
