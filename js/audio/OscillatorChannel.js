
var OscillatorChannel = function(context, freq, gain) {
	this.source;
	this.context = context;
	this.freq = freq;
	this.gain = gain;
	this.type = 'frequency';
	
	// pulses
	this.pulseLength;
	this.periodLength;
	this.periodInterval;
	this.pulsedOnce = true;

	this.gainNode = this.context.createGainNode();
	this.gainNode.gain.value = gain;

	this.finalNode = this.gainNode;
}
OscillatorChannel.prototype = new AudioChannel();
OscillatorChannel.prototype.constructor = OscillatorChannel;

/** update oscillator properties **/
OscillatorChannel.prototype.updateFreq = function(freq) {
	this.freq = freq;
	this.source.frequency.value = freq;
	//console.log('new freq: ' + freq);
};
OscillatorChannel.prototype.updateGain = function(gain) {
	this.gainNode.gain.value = gain;
	//console.log('new gain: ' + gain);
};

/** start oscillating! **/
OscillatorChannel.prototype.start = function() {
	if (typeof this.source !== 'undefined') this.source.noteOff(0); // kill previous oscillator

	this.gainNode.gain.value = this.gain;
	this.source = this.context.createOscillator();
	this.source.type = 'sine';	
	this.source.frequency.value = this.freq;
	this.source.connect(this.gainNode);
	this.source.noteOn(0);
};

/** change type of oscillation **/
OscillatorChannel.prototype.setType = function(type) {
	this.type = type;
	this.pulseStop(); // stop pulse, will be started if type is pulse
	this.start(); // start is also reset
}


/**
 *  pulses 
 ************/
OscillatorChannel.prototype.updateInterval = function(period, portion){
    this.pulseLength = period * portion;
    // play at least one whole pulse before upgrading pulse-length property
    if (this.periodLength != period && this.pulsedOnce) {
    	this.pulseStop();
        this.periodLength = period;
    	this.pulseStart();
    }
};
OscillatorChannel.prototype.pulseStart = function(){
    var self = this;
	
	this.pulsedOnce = false;
    this.periodInterval = setInterval(function () {
        self.unmute();
    	setTimeout(function() {
            self.mute();
            self.pulsedOnce = true;
            console.log(self.periodLength, self.pulseLength);
    	}, self.pulseLength);
    }, this.periodLength);

};
OscillatorChannel.prototype.pulseStop = function(){
    clearInterval(this.periodInterval);
};