
function initSettings() {
	
	$('#settings').on('click', 'input', function() {
		channel = this.parentNode.dataset.channel;
		type    = this.dataset.type;
		audio.channels[channel].setWaveType(type, !audio.channels[channel].waveType[type]);
	});
	
};




