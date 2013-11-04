function ProximityAudio() {
	this.context = new webkitAudioContext();
	
	this.oscillator = this.context.createOscillator();
	this.oscillator.type = 'sine';	
	this.oscillator.frequency.value = 250;
	this.oscillator.noteOn && this.oscillator.noteOn(0); // this method doesn't seem to exist, though it's in the docs?

	this.gainNode = this.context.createGainNode();
	this.gainNode.gain.value = 0.05;
	
	this.oscillator.connect(this.gainNode);
	this.start();
}
ProximityAudio.prototype.updateFreq = function(freq) {
	this.oscillator.frequency.value = freq;
};
ProximityAudio.prototype.updateGain = function(gain) {
	this.gainNode.gain.value = gain;
	//console.log(gain);
};
ProximityAudio.prototype.stop = function() {
	this.gainNode.disconnect();
};
ProximityAudio.prototype.start = function() {
	this.gainNode.connect(this.context.destination);
};
ProximityAudio.prototype.isOn = function() {
	return this.gainNode.numberOfOutputs > 0;
};
