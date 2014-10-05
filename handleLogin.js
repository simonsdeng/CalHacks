var autologin = function (message) {
	// TODO autologin
};

var recordData = function () {
	var i;
	var form;

	var generateHandler = function (form, i, onsubmit) {
		return function () {
			if (onsubmit) onsubmit();

			var data = {};
			var j;
			var input;

			for (j = 0; j < form.elements.length; j++) {
				input = form.elements[j]
				if (input.name) data[input.name] = input.value;
			}

			chrome.runtime.sendMessage({form: i, data: data});
		};
	};

	for (i = 0; i < document.forms.length; i++) {
		form = document.forms[i];
		form.onsubmit = generateHandler(form, i, form.onsubmit);
	}
};

chrome.runtime.onMessage.addListener(function (message) {
	if (false && !message.empty /*or something like this*/) {
		autologin(message); // or something
	} else {
		recordData();
	}
});
