
function Calibration() {
	this.points = [];
	this.elements = document.getElementById('calibration').getElementsByClassName('calSpot');
	this.currentEl = 0;
	this.calibrateCurrent();
}

Calibration.prototype.calibrateCurrent = function() {
	var el = this.elements[this.currentEl];
	el.style.display = 'block';
	el.addEventListener('touchstart', this.handleTouchStart.bind(this));
}

Calibration.prototype.handleTouchStart = function(event) {
	
	if(typeof users[0] === 'undefined'){
		console.log('No kinect user found, reposition');
		return;
	}
		
	var el = event.target;
	el.style.display = 'none';
	el.removeEventListener('touchstart', this.handleTouchStart);
	
	this.points[this.currentEl] = {
		table: { 
			x: event.touches[0].clientX,
			y: event.touches[0].clientY
		},
		kinect: users[0].getPosition('rightHand')
	}
	
	console.log(this.points);
	
	if (++this.currentEl < this.elements.length)
		this.calibrateCurrent();
	else
		initMain();

}

