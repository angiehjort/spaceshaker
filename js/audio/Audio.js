function Audio() {
	this.context = new webkitAudioContext();
	this.channels = {};

	this.merger = this.context.createChannelMerger(2);
	
	this.gainNode = this.context.createGainNode();
	this.gainNode.gain.value = 1;
	this.merger.connect(this.gainNode);
	
	this.connect();
	
	document.addEventListener("keypress", this.handleKeyPress.bind(this));
	
	this.channelNameToIdx = {
		'left': 0,
		'right': 1
	}
}
Audio.prototype.handleKeyPress = function(e) {
		console.log(e.keyCode);
		if(e.keyCode == 112)
			this.connect();
		if(e.keyCode == 115)
			this.disconnect();
			
			
		if(e.keyCode == 122)
			this.channels[0].start();
		if(e.keyCode == 120)
			this.channels[0].stop();
			
		if(e.keyCode == 121)
			this.channels[1].start(true);
			
		if(e.keyCode == 119)
			this.channels[0].updateFreq(1000);
}
Audio.prototype.updateGain = function(gain) {
	this.gainNode.gain.value = gain;
	console.log('new master gain: ' + gain);
};
Audio.prototype.disconnect = function() {
	this.gainNode.disconnect();
};
Audio.prototype.connect = function() {
	this.gainNode.connect(this.context.destination);
};
Audio.prototype.isOn = function() {
	return this.gainNode.numberOfOutputs > 0;
};

Audio.prototype.createChannel = function(name, type, p) {
	var channelIndex = this.channelNameToIdx[name];
	// disconnect old channel
	if (typeof this.channels[channelIndex] !== 'undefined') this.channels[channelIndex].disconnect();
	
	// make new channel
	switch(type) {
		case 'oscillator':
			this.channels[channelIndex] = new OscillatorChannel(this.context, p.freq, p.gain);
			break;
		case 'file':
			this.channels[channelIndex] = new FileChannel(this.context, p.file, p.gain);
			break;
	}
	
	// connect new channel
	this.channels[channelIndex].connect(this.merger, 0, this.channelNameToIdx[name]);
	return this.channels[channelIndex];
}

var AudioChannel = function() {
	this.destination;
	this.outputIdx;
	this.inputInx;
	
	this.source;
}

AudioChannel.prototype.connect = function(destination, outputIdx, inputIdx) {
	this.destination = destination;
	this.destinationOutputIdx = outputIdx;
	this.destinationInputIdx = inputIdx;
	this.finalNode.connect(this.destination, this.destinationOutputIdx, this.destinationInputIdx);
}
AudioChannel.prototype.disconnect = function() {
	this.finalNode.disconnect();
}
AudioChannel.prototype.stop = function() {
	this.source.noteOff(0);
};
AudioChannel.prototype.start = function() {
	this.source.noteOn(0);
};
AudioChannel.prototype.isOn = function() {
	return this.gainNode.numberOfOutputs > 0;
};


