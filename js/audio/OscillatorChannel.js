
var OscillatorChannel = function(name, context, freq, gain) {
	this.name = name;
	this.source;
	this.context = context;
	this.freq = freq;
	this.gain = gain;
	
	// pulses
	this.pulseLength;
	this.periodLength;
	this.periodInterval;
	this.pulseChangeAllowed = true;

	this.gainNode = this.context.createGainNode();
	this.gainNode.gain.value = gain;

	this.waveType = {
		frequency: false,
		amplitude: false,
		pulseWidth: false,
		pulseFrequency: false
	}
	
	this.drawSettings();
	this.setWaveType('frequency', true);
	
	this.finalNode = this.gainNode;
}
OscillatorChannel.prototype = new AudioChannel();
OscillatorChannel.prototype.constructor = OscillatorChannel;

/** update oscillator properties **/
OscillatorChannel.prototype.updateFreq = function(freq) {
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

	this.unmute();
	this.source = this.context.createOscillator();
	this.source.type = 'sine';	

	this.source.frequency.value = this.freq;
	this.source.connect(this.gainNode);
	this.source.noteOn(0);
};

/** change type of oscillation **/
OscillatorChannel.prototype.setWaveType = function(type, setting) {
	this.waveType[type] = setting;
	this.pulseStop(); // stop pulse, will be started if type is pulse
	this.pulseChangeAllowed = true;
	this.start(); // start is also reset

	this.$settings.find('input[data-type="'+ type + '"]').toggleClass('active', setting);
}


/**
 *  pulses 
 ************/
OscillatorChannel.prototype.updateInterval = function(period, portion){
    this.pulseLength = period * portion;
	console.log(this.pulseChangeAllowed);
    // play at least one whole pulse before upgrading pulse-length property
    if (this.pulseChangeAllowed) {
    	this.pulseStop();
        this.periodLength = period;
    	this.pulseStart();
    }
};
OscillatorChannel.prototype.pulseStart = function(){
    var self = this;
	
	this.pulseChangeAllowed = false;
    this.periodInterval = setInterval(function () {
        self.unmute();
    	setTimeout(function() {
            self.mute();
            self.pulseChangeAllowed = true;
            console.log(self.periodLength, self.pulseLength);
    	}, self.pulseLength);
    }, this.periodLength);

};
OscillatorChannel.prototype.pulseStop = function(){
    clearInterval(this.periodInterval);
};


/**
 * SETTINGS
 ****************/
OscillatorChannel.prototype.drawSettings = function() {
	this.$settings = $(''
		+'<div id="'+this.name+'" data-channel="'+this.name+'">'
		+'	<strong>'+this.name+'</strong>'
		+'	<input type="button" value="frequency" data-type="frequency">'
		+'	<input type="button" value="amplitude" data-type="amplitude">'
		+'	<input type="button" value="pulse width" data-type="pulseWidth">'
		+'	<input type="button" value="pulse frequency" data-type="pulseFrequency">'
		+'</div>')
		.appendTo('#settings');
}