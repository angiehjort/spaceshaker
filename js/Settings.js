
function initSettings() {
	
	settings = document.getElementById('settings');
	inputs = document.getElementsByTagName('input');
	for (i = 0; i < inputs.length; i++) {
		inputs[i].addEventListener('click', function() {
			channel = this.parentNode.dataset.channel;
			type    = this.dataset.type;
			audio.channels[channel].setType(type);
		});
	}
	
};




