var autologin = function (data) {
	console.log(data);
	data = JSON.parse(data[location]);

	var form;
	var prop;
	if ("form" in data) {
		form = document.forms[data.form];
		for (prop in data.data) form.elements[prop].value = data.data[prop];
		// form.submit();
		document.createElement('form').submit.call(form);  // workaround for inputs with name "submit"
	}
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
	if (!Object.keys(message).length) {
		autologin(message);
	} else {
		recordData();
	}
});
