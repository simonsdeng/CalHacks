var interval = 3000;
var pingUrl = "http://www.google.com/robots.txt";

var login = false;
var xhr = new XMLHttpRequest();

xhr.onload = function () {
	if (this.response.indexOf("User-agent:")) {
		login = true;
		chrome.tabs.create({url: pingUrl}, function (tab) {
			chrome.tabs.executeScript(tab.id, {code: "alert(\"hi\")"});
		});
	}
};

var startPing = function () {
	if (navigator.onLine && !login) {
		xhr.open("GET", pingUrl);
		xhr.send();
	} else {
		setTimeout(startPing, interval);
	}
};

xhr.onloadend = function () { setTimeout(startPing, interval) };

startPing();
