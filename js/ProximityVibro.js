function ProximityVibro() {
    this.outer = 1000; // ms
    this.inner = 100; // ms
    this.periodInterval;
    this.pulseLength;

    this.carryOn = false;
    this.playedOnce = false;
    this.playing = false;
    this.restart = false;


	this.context = new webkitAudioContext();
	this.oscillator = this.context.createOscillator();
	this.oscillator.type = 'sine';
	this.oscillator.frequency.value = 400;
	this.oscillator.noteOn && this.oscillator.noteOn(0); // this method doesn't seem to exist, though it's in the docs?
	this.gainNode = this.context.createGainNode();
	this.gainNode.gain.value = 1;
	this.oscillator.connect(this.gainNode);

    this.intervalStart();
};

ProximityVibro.prototype.updateInterval = function(period, portion){
    this.inner = period * portion;
    if (this.outer != period && this.playedOnce) {
    	this.intervalStop();
        this.outer = period;
    	this.intervalStart();
    	
    	this.playedOnce = false;
    }
};

ProximityVibro.prototype.updateFreq = function(freq) {
	this.oscillator.frequency.value = freq;
    console.log(freq);
};
ProximityVibro.prototype.updateGain = function(gain) {
	this.gainNode.gain.value = gain;
    console.log(gain);
};

ProximityVibro.prototype.intervalStart = function(){
    var self = this;

    self.periodInterval = setInterval(function () {
        self.audioStart();

    	self.pulseLength = setTimeout(function() {
            self.audioStop();
            self.playedOnce = true;
            console.log(self.outer, self.inner);
    	}, self.inner);
    }, self.outer);

};

ProximityVibro.prototype.intervalStop = function(){
    //this.playedOnce = false;
    clearInterval(this.periodInterval);
};

ProximityVibro.prototype.audioStart = function(){
    this.gainNode.connect(this.context.destination);
};

ProximityVibro.prototype.audioStop = function() {
	this.gainNode.disconnect();
};

ProximityVibro.prototype.refresh = function() {
    this.intervalStop();
    this.updateGain(1);
    this.updateFreq(400);

    if ((proximityStyle=="PWM" || proximityStyle=="Geiger")&& !this.carryOn){
        this.audioStop();
        this.intervalStart();
    }
    if (proximityStyle=="Freq" || proximityStyle=="Gain" || this.carryOn){
        this.intervalStop();
        this.audioStart();
    }
};
