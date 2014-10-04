var i;
var form;
var onsubmit;

for (i = 0; i < document.forms.length; i++) {
	form = document.forms[i];
	onsubmit = form.onsubmit;
	form.onsubmit = function () {
		if (onsubmit) onsubmit();

		chrome.runtime.sendMessage("HELLYEAH");
	};
}
