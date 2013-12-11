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
/** keys for controlling audio, not for end-users **/
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
/** 
 * Start audio, i.e. channels
 */
Audio.prototype.start = function(channel) {
	// one channel
	if (typeof channel !== 'undefined' && typeof channels[channel] !== 'undefined') {
		this.channels[channel].start();
	}
	// or all!
	else {
		for (i in this.channels) {
			this.channels[i].start();
		}
	}
}
/** updating master volume **/
Audio.prototype.updateGain = function(gain) {
	this.gainNode.gain.value = gain;
	console.log('new master gain: ' + gain);
};
/** connect/disconnect **/
Audio.prototype.connect = function() {
	this.gainNode.connect(this.context.destination);
};
Audio.prototype.disconnect = function() {
	this.gainNode.disconnect();
};
Audio.prototype.isOn = function() {
	return this.gainNode.numberOfOutputs > 0;
};

/**
 * New Channel creation
 * name of channel (corresponds to channel-indexes in this.channelNameToIdx)
 * type is type of channel (oscillator/file)
 * p    are parameters for channel (differ per type)
 */
Audio.prototype.createChannel = function(name, type, p) {
	// disconnect old channel
	if (typeof this.channels[name] !== 'undefined') this.channels[name].disconnect();
	
	// make new channel
	switch(type) {
		case 'oscillator':
			this.channels[name] = new OscillatorChannel(name, this.context, p.freq, p.gain);
			break;
		case 'file':
			this.channels[name] = new FileChannel(name, this.context, p.file, p.gain);
			break;
	}
	
	// connect new channel
	this.channels[name].connect(this.merger, 0, this.channelNameToIdx[name]);
	return this.channels[name];
}

/** AUDIOCHANNELS **/

var AudioChannel = function() {
	this.destination;
	this.outputIdx;
	this.inputInx;
	
	this.source;
}

/** connect/disconnect **/
AudioChannel.prototype.connect = function(destination, outputIdx, inputIdx) {
	this.destination = destination;
	this.destinationOutputIdx = outputIdx;
	this.destinationInputIdx = inputIdx;
	this.finalNode.connect(this.destination, this.destinationOutputIdx, this.destinationInputIdx);
}
AudioChannel.prototype.disconnect = function() {
	this.finalNode.disconnect();
}

/** start/stop **/
AudioChannel.prototype.start = function() {
	this.source.noteOn(0);
};
AudioChannel.prototype.stop = function() {
	this.source.noteOff(0);
};

/** mute/unmute **/
AudioChannel.prototype.mute = function(freq) {
	this.gainNode.gain.value = 0;
	//console.log('mute');
};
AudioChannel.prototype.unmute = function(freq) {
	this.gainNode.gain.value = this.gain;
};
AudioChannel.prototype.isOn = function() {
	return this.gainNode.numberOfOutputs > 0;
};

/** skeleton **/
AudioChannel.prototype.setType = function(type) {
	
}


