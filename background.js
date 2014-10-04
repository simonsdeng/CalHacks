var interval = 3000;
var pingUrl = "http://www.google.com/robots.txt";

var loginTab = null;
var xhr = new XMLHttpRequest();
var data = [];

xhr.onload = function () {
	if (this.response.indexOf("User-agent:")) {
		loginTab = true;
		chrome.tabs.create({url: pingUrl}, function (tab) {
			loginTab = tab;
			chrome.tabs.executeScript(loginTab.id, {file: "handleLogin.js"});
		});
	}
};

chrome.runtime.onMessage.addListener(function (message) {
	if (navigate in form) {
		chrome.tabs.executeScript(loginTab.id, {file: "handleLogin.js"});
	}

	data.push(message);
});

var store = function (key, object) {
	var value = JSON.stringify(object);

	chrome.storage.sync.set({key: value}, function() {
		console.log('Settings saved');
        });
};

var startPing = function () {
	if (navigator.onLine && !loginTab) {
		xhr.open("GET", pingUrl);
		xhr.send();
	} else {
		setTimeout(startPing, interval);
	}
};

xhr.onloadend = function () { setTimeout(startPing, interval) };

startPing();
