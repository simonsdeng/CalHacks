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
			chrome.tabs.remove(loginTabId);

			data.push(current);
			current = {};
			store(data);
			data = [];
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
			chrome.storage.sync.get(changeInfo.url, function (items) {
				chrome.tabs.sendMessage(tabId, items);

				if (!Object.keys(items).length) {
					if (!current.data) current.data = {};
					current.data.url = changeInfo.url;
					data.push(current);
					current = {url: changeInfo.url};
				}
			});
		});
	}
});

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
	if (tabId === loginTabId) loginTabId = 0;
});

chrome.runtime.onMessage.addListener(function (message) {
	current.data = message;
});

var store = function (data) {
	var i;
	var obj;
	for (i = 0; i < data.length; i++) {
		var key = data[i].url;
		var value = JSON.stringify(data[i].data);

		var obj = {};
		obj[key] = value;
		chrome.storage.sync.set(obj);
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
