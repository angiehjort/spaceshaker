function ProximityAudio() {
	this.context = new webkitAudioContext();

	this.oscillator = this.context.createOscillator();
	this.oscillator.type = 'sine';
	this.oscillator.frequency.value = 250;
	this.oscillator.noteOn && this.oscillator.noteOn(0); // this method doesn't seem to exist, though it's in the docs?

	this.gainNode = this.context.createGainNode();
	this.gainNode.gain.value = 1; //0.05

	this.oscillator.connect(this.gainNode);
	this.start();
};
ProximityAudio.prototype.updateFreq = function(freq) {
	this.oscillator.frequency.value = freq;
	console.log(freq);
};
ProximityAudio.prototype.updateGain = function(gain) {
	this.gainNode.gain.value = gain;
	//console.log(gain);
};
ProximityAudio.prototype.stop = function() {
	this.gainNode.disconnect();
};
ProximityAudio.prototype.start = function() {
	if (!mute)this.gainNode.connect(this.context.destination);
};
ProximityAudio.prototype.isOn = function() {
	return this.gainNode.numberOfOutputs > 0;
};


function GeigerCounter(audioSourse) {
    this.audioSourse = audioSourse;
    console.log(this.audioSourse);
    this.outer = 1000; //ms
    this.inner = 100; //ms
    this.geiger = 0;
    this.start();
    this.carryOn = false;
    this.playedOnce = false;
    this.playing = false;
this.sr = Date.now();

        this.start();
//    this.context = new webkitAudioContext();
//    this.oscillator = this.context.createOscillator();
//	this.oscillator.type = 'sine';
//	this.oscillator.frequency.value = 250;
//    this.gainNode.gain.value = 1;
};

GeigerCounter.prototype.setPeriod = function(period, portion){
    var self = this;
    if (this.playedOnce){
        this.stop();
        this.outer = period;
        this.inner = period*portion;
       if(this.carryOn) {
           this.inner=period;
           audio.updateGain(1);
       }
    }
};

GeigerCounter.prototype.start = function(){
    var self = this;

    //audio.start();
    audio.updateFreq(250);

    clearInterval(this.geiger1);
    this.geiger1 = setTimeout(function () {
        //audio.stop();
        audio.updateFreq(1);
        self.playedOnce = true;
    }, self.inner);

    clearInterval(this.geiger2);
    this.geiger2 = setTimeout(function () {
        self.start();
    }, self.outer);

};

GeigerCounter.prototype.stop = function(){
    this.playedOnce = false;
    //clearInterval(this.geiger);
};
