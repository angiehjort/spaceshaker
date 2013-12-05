
function Calibration() {
	this.points = [];
	this.elements = document.getElementById('calibration').getElementsByClassName('calSpot');

	this.currentEl = 0;
	this.ratio = {};
	this.offset = {};
	this.changeCurrent();

}

Calibration.prototype.changeCurrent = function() {
	var el = this.elements[this.currentEl];
	el.style.display = 'block';

    Hammer(el).on('tap', this.handleTouchStart.bind(this));
	//el.addEventListener('touchstart', this.handleTouchStart.bind(this));
}

Calibration.prototype.handleTouchStart = function(event) {
	
    console.log(event);
	// error handling
	if(typeof users[0] === 'undefined'){
		console.log('No kinect user found, reposition');
		return;
	}

	// remove calibration point
	var el = event.target;
	el.style.display = 'none';
	//el.removeEventListener('touchstart', this.handleTouchStart);
    Hammer(el).off('tap', this.handleTouchStart);
	
	// get coordinates
	kinect = users[0].getPosition('LeftHand');
	this.points[this.currentEl] = {
		table: { 
			x: event.gesture.touches[0].pageX,
			y: event.gesture.touches[0].pageY
		},
		kinect: {
			x: kinect.x,
			y: kinect.y,
			z: kinect.z
		}
	}
	
	// next point or end?
	if (++this.currentEl < this.elements.length)
		this.changeCurrent();
	else 
		this.calibrate();
}

// calibration-points have been found: now calibrate
Calibration.prototype.calibrate = function() {
	// kinectX = tableX
	// kinectZ = tableY
	
	dxTable = Math.abs(this.points[0].table.x - this.points[1].table.x);
	dyTable = Math.abs(this.points[0].table.y - this.points[1].table.y);

	dxKinect = Math.abs(this.points[0].kinect.x - this.points[1].kinect.x);
	dzKinect = Math.abs(this.points[0].kinect.z - this.points[1].kinect.z);
	
	this.ratio.x = dxTable/dxKinect;
	this.ratio.z = dyTable/dzKinect;

	this.offset.x = this.points[0].kinect.x - (this.ratio.x / this.points[0].table.x);
	this.offset.z = this.points[0].kinect.z - (this.ratio.z / this.points[0].table.y);
	console.log(this);
	testdiv = document.createElement('div');
	testdiv.id = 'calTest';
	//document.getElementById('calibration').appendChild(testdiv);

    audio.start();
    document.getElementById('main').style.visibility = 'visible';
}


Calibration.prototype.getTableX = function(kinectX) {
	return (kinectX - calibration.offset.x) * calibration.ratio.x;
}
Calibration.prototype.getTableY = function(kinectZ) {
	return (kinectZ - calibration.offset.z) * calibration.ratio.z;
}
Calibration.prototype.getKinectX = function(tableX) {
	return (tableX / calibration.ratio.x) + calibration.offset.x;
}
Calibration.prototype.getKinectZ = function(tableY) {
	return (tableY / calibration.ratio.z) + calibration.offset.z;
}



