

var FileChannel = function(context, file, gain) {
	this.buffer;
	this.sources = [];
	this.context = context;
	this.loadSound(file);
	
	this.gainNode = this.context.createGainNode();
	this.gainNode.gain.value = gain;
	
	// SILENT OSCILLATOR ON MERGER TO KEEP CHANNEL OPEN AFTER FILE PLAY STOPS 
	// HACKY & UGLY - NEED TO LOOK FURTHER IN WEBAUDIO TO DO THIS CLEANLY
	this.oscillator = this.context.createOscillator();
	this.oscillator.noteOn(0); // this method doesn't seem to exist, though it's in the docs?	
	this.oscGainNode = this.context.createGainNode();
	this.oscGainNode.gain.value = 0.00;
	this.oscillator.connect(this.oscGainNode);
	this.merger = this.context.createChannelMerger(2);
	this.oscGainNode.connect(this.merger, 0, 1);
	this.gainNode.connect(this.merger, 0, 0);
	
	this.finalNode = this.merger;
}
FileChannel.prototype = new AudioChannel();
FileChannel.prototype.constructor = FileChannel;

FileChannel.prototype.loadSound = function(url) {
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';

	var channel = this;

	// Decode asynchronously
	request.onload = function() {
		channel.context.decodeAudioData(
			request.response, 
			function(buffer) {
				channel.buffer = buffer;
			}, 
			function() {
				console.error('decodeAudio data error');
			}
		);
	}

	request.onerror = function() {
		console.error('BufferLoader: XHR error');
	}

	request.send();
}

FileChannel.prototype.start = function(loop) {
	this.stop(); // for now: no parallel loops
	var source = this.context.createBufferSource();
		source.connect(this.gainNode);
		source.buffer = this.buffer;
		source.loop   = typeof loop !== 'undefined' ? loop : false;;
		source.noteOn(0);
	
	this.sources.push(source);
	
	return source;
} 

FileChannel.prototype.stop = function() {
	for (i in this.sources) {
		this.sources[i].noteOff(0);
	}
	this.sources = [];
}
