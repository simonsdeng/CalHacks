var interval = 3000;
var pingUrl = "http://www.google.com/robots.txt";

var loginTabId = 0;
var xhr = new XMLHttpRequest();
var data = [];

xhr.onload = function () {
	var connected = !this.response.indexOf("User-agent:");

	if (!!loginTabId === connected) {
		if (connected) {
			chrome.tabs.remove(loginTabId);
			loginTabId = 0;
		} else {
			chrome.tabs.create({url: pingUrl}, function (tab) {
				loginTabId = tab.id;
			});
		}
	}
};

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (tabId === loginTabId && changeInfo.url) {
		chrome.tabs.executeScript(tabId, {file: "handleLogin.js"});
		chrome.tabs.sendMessage(tabId, {});
		data.push({url: changeInfo.url});
	}
});

chrome.runtime.onMessage.addListener(function (message) {
	data.push(message);
});

var store = function (key, object) {
	var value = JSON.stringify(object);

	chrome.storage.sync.set({key: value}, function() {
		console.log('Settings saved');
	});
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
