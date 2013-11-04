function HiddenObject(color, size, position) {
    //defaults
    if (color == null) color = 'pink';
    if (size == null) size = {width: 100, height: 100, depth: 100};
    if (position == null) position = {x: 0, y: -400, z: 1200};

	this.material = new THREE.MeshLambertMaterial( { color: color, transparent: true } );
	this.material.opacity = 0.5;
	this.mesh = new THREE.Mesh( new THREE.CubeGeometry(size.width, size.height, size.depth), this.material );
	this.mesh.position = position;
    this.mesh.geometry.dynamic = true;
	scene.add(this.mesh);
    //scene.add(objects[objects.length - 1].mesh);

	
	this.audioFound = document.getElementById('audio_' + color);
	this.audioFound.volume = 1;

    this.newDiv = document.createElement('div');
    this.newDiv.id = 'newDiv';
    this.newDiv.classList.add('square');
    this.newDiv.classList.add('newDiv');
    this.newDiv.style.background = color;
    touchArea.touchable.appendChild(this.newDiv);
    //this.newDiv.appendTo(touchArea.touchable);

    Hammer(this.newDiv).on('touch', this.checkDrop.bind(this));
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
HiddenObject.createNew = function(color, s, p) {
    objects.push(new HiddenObject(color, {width: s.w, height: s.h, depth: s.d }, {x: p.x, y: p.y, z: p.z}));
	console.log(color + ' object generated: ', coords);
};

HiddenObject.prototype.growY = function(h) {
    if(h!=null){
        delta = h-this.mesh.geometry.height;
        this.mesh.geometry.vertices[0].y += delta;
        this.mesh.geometry.vertices[1].y += delta;
        this.mesh.geometry.vertices[4].y += delta;
        this.mesh.geometry.vertices[5].y += delta;
        this.mesh.geometry.height=h;
    }
    this.mesh.geometry.verticesNeedUpdate = true;

    return 'object size updated';
};


