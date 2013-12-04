function ProximityVibro() {
    this.outer = 1000; //ms
    this.inner = 100; //ms
    this.geiger1;
    this.geiger2;

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

    this.intervalsStart();
};

ProximityVibro.prototype.updateInterval = function(period, portion){
    var self = this;
    this.outer = period;
    this.inner = period * portion;
};

ProximityVibro.prototype.updateFreq = function(freq) {
	this.oscillator.frequency.value = freq;
};
ProximityVibro.prototype.updateGain = function(gain) {
	this.gainNode.gain.value = gain;
};

ProximityVibro.prototype.intervalsStart = function(){
    var self = this;

    self.geiger1 = setInterval(function () {
        self.audioStart();

    	self.geiger2 = setTimeout(function() {
            self.audioStop();
            //self.playedOnce = true;
            console.log(self.outer, self.inner);
    	}, self.inner);
    }, self.outer);

};

ProximityVibro.prototype.intervalsStop = function(){
    //this.playedOnce = false;
    clearInterval(this.geiger1);
    clearTimeout(this.geiger2);
};

ProximityVibro.prototype.audioStart = function(){
    this.gainNode.connect(this.context.destination);
};

ProximityVibro.prototype.audioStop = function() {
	this.gainNode.disconnect();
};


ProximityVibro.prototype.constStart = function(){
    this.intervalsStop();
    this.audioStart();
};

ProximityVibro.prototype.constStop = function() {
	this.audioStop();
    this.intervalsStart();
};

ProximityVibro.prototype.refresh = function() {
    this.intervalsStop();
    this.constStop();
    this.updateGain(1);
    this.updateFreq(400);

    if (proximityStyle=="PWM" || proximityStyle=="Geiger"){
        this.intervalsStart();
    }
    if (proximityStyle=="Freq" || proximityStyle=="Gain"){
        this.constStart();
    }
};
