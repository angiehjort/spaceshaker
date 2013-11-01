function HiddenObject(color, size, position) {
	this.material = new THREE.MeshLambertMaterial( { color: color, transparent: true } );
	this.material.opacity = 0.9;
	this.mesh = new THREE.Mesh( new THREE.CubeGeometry(size.width, size.height, size.depth), this.material );
	this.mesh.position = position;
	scene.add(this.mesh);
	
	this.audioFound = document.getElementById('audio_' + color);
	this.audioFound.volume = 1;
	
	this.rect = document.getElementById('rect_' + color);

    Hammer(this.rect).on('touch', this.checkDrop.bind(this));
    this.rect.addEventListener('touchstart', this.checkDrop.bind(this));
}
HiddenObject.prototype.destruct = function() {
	scene.remove(this.mesh);
	objects.splice(objects.indexOf(this),1);
};
HiddenObject.prototype.checkDrop = function() {


	var soundYe=document.getElementById("soundYe");
	var soundNo=document.getElementById("soundNo");
    soundYe.pause(); soundNo.pause();
	for (i in users) {
		user = users[i];
		if (user != null && user.carries != null) {
			if (user.carries == this) {
				soundYe.play();
				this.destruct();
				user.carries = null;
			} else {
				soundNo.play();
			}
		}
	}	
};
HiddenObject.prototype.found = function() {
	this.audioFound.play();
};
HiddenObject.prototype.collidesWith = function(mesh) {
	return this.mesh.collidesWith(mesh);
};
HiddenObject.prototype.distanceTo = function(mesh) {
	return this.mesh.distanceTo(mesh);
};
HiddenObject.generateObjects = function(c, b, s) {
	coords = {x: 0, y:0, z:0 };
	for (i in c) {
		color = c[i];
		for (j in coords) {
			// random(0-1) * range + offset
			coords[j] = Math.random() * Math.abs(b[j].max - b[j].min) + b[j].min;
		}
		objects.push(new HiddenObject(color, {width: s.w, height: s.h, depth: s.d }, {x: coords.x, y: coords.y, z: coords.z}));
		console.log(color + ' object generated: ', coords);
	}
};
