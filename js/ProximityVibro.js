function ProximityVibro() {
    this.outer = 1000; //ms
    this.inner = 100; //ms
    this.geiger1;
    this.geiger2;

    this.carryOn = false;
    this.playedOnce = false;
    this.playing = false;

    this.restart = false;

    this.start();
    this.context = new webkitAudioContext();
    this.oscillator = this.context.createOscillator();
	this.oscillator.type = 'sine';
	this.oscillator.frequency.value = 250;
    this.gainNode.gain.value = 1;
};

ProximityVibro.prototype.setPeriod = function(period, portion){
    var self = this;
    if (this.playedOnce){
        //this.stop();
        this.outer = period;
        if(this.carryOn == true) {
        	this.inner = period;
        	this.gainNode.gain.value = 1;
        } else {
            this.inner = period*portion;
        }
        //this.start();
    }
};

ProximityVibro.prototype.start = function(){
    var self = this;


    this.geiger1 = setInterval(function () {
    	setTimeout(function() {
            audio.stop();
            self.playedOnce = true;
    	}, self.inner);

        audio.start();

        //olddate = self.date;
        //self.date = Date.now();

        //console.log(self.outer, self.inner, 'bleep: ' + (self.date - olddate));
    }, this.outer);


};

ProximityVibro.prototype.stop = function(){
    this.playedOnce = false;
    clearInterval(this.geiger1);
};

ProximityVibro.prototype.audioStart = function(){
    this.gainNode.connect(this.context.destination);
};

ProximityVibro.prototype.audioStop = function() {
	this.gainNode.disconnect();
};
