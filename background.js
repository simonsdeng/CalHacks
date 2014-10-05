var interval = 3000;
var pingUrl = "http://www.google.com/robots.txt";

var data = [];
var current = {};
var loginTabId = 0;

var xhr = new XMLHttpRequest();
xhr.timeout = interval * 2;

xhr.onload = function () {
	var connected = !this.response.indexOf("User-agent:");

	if (!!loginTabId === connected) {
		if (connected) {
			data.push(current);
			current = {};
			chrome.tabs.remove(loginTabId);
		} else {
			chrome.tabs.create({url: pingUrl}, function (tab) {
				loginTabId = tab.id;
				current.url = tab.url;
			});
		}
	}
};

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (tabId === loginTabId && changeInfo.url) {
		chrome.tabs.executeScript(tabId, {file: "handleLogin.js"}, function () {
			// TODO send data to handleLogin.js
			chrome.tabs.sendMessage(tabId, {});
			current.url = changeInfo.url;
			data.push(current);
			current = {url: changeInfo.url};
		});
	}
});

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
	if (tabId === loginTabId) loginTabId = 0;
});

chrome.runtime.onMessage.addListener(function (message) {
	current.data = message;
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
