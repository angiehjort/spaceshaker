
var OscillatorChannel = function(context, freq, gain) {
	this.source;
	this.context = context;
	this.freq = freq;

	this.gainNode = this.context.createGainNode();
	this.gainNode.gain.value = gain;

	this.finalNode = this.gainNode;
}
OscillatorChannel.prototype = new AudioChannel();
OscillatorChannel.prototype.constructor = OscillatorChannel;

OscillatorChannel.prototype.updateFreq = function(freq) {
	this.freq = freq;
	this.source.frequency.value = freq;
	console.log('new freq: ' + freq);
};
OscillatorChannel.prototype.updateGain = function(gain) {
	this.gainNode.gain.value = gain;
	console.log('new gain: ' + gain);
};

OscillatorChannel.prototype.start = function() {
	if (typeof this.source !== 'undefined') this.source.noteOff(0); // kill previous oscillator
	
	this.source = this.context.createOscillator();
	this.source.type = 'sine';	
	this.source.frequency.value = this.freq;
	this.source.connect(this.gainNode);
	this.source.noteOn(0);
};

