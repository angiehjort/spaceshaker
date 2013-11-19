function HiddenObject(color, size, position, position_twodee) {
    //defaults
    if (color == null) color = 'pink';
    if (size == null) size = {width: 100, height: 100, depth: 100};
    if (position == null) position = {x: 0, y: -400, z: 1200};
    if (position_twodee == null) position = {x: 100, y: 100};

    this.color = color;
	this.material = new THREE.MeshLambertMaterial( { color: this.color, transparent: true } );
	this.material.opacity = 0.5;
	this.mesh = new THREE.Mesh( new THREE.CubeGeometry(size.width, size.height, size.depth), this.material );
	this.mesh.position = position;
    this.mesh.geometry.dynamic = true;
	scene.add(this.mesh);
    //scene.add(objects[objects.length - 1].mesh);

	this.growWFactor = 1.4;
    this.growHFactor = 1.0;
    this.growDFactor = 1.4;

    this.growWminLimit = 100;
    this.growHminLimit = 100;
    this.growDminLimit = 100;

    this.growWmaxLimit = 700;
    this.growHmaxLimit = 700;
    this.growDmaxLimit = 700;

	this.audioFound = document.getElementById('audio_' + color);
	this.audioFound.volume = 1;

    this.div = document.createElement('div');
    this.div.id = 'rect_'+color;
    this.div.classList.add('square');
    this.div.classList.add('newDiv');
    this.div.style.background = color;
    this.div.style.left = position_twodee.x + 'px';
    this.div.style.top = position_twodee.y + 'px';
    touchArea.touchable.appendChild(this.div);

    Hammer(this.div).on('touch', this.checkDrop.bind(this));
}
HiddenObject.prototype.bake  = function()  {
    this.div.classList.remove('newDiv');
}

HiddenObject.prototype.destruct = function() {
	scene.remove(this.mesh);
    touchArea.touchable.removeChild(this.div);
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
				if(!mute)soundYe.play();
				this.destruct();
				user.stopCarrying();
			} else {
				if(!mute)soundNo.play();
			}
		}
	}	
};
HiddenObject.prototype.found = function() {
	if(!mute)this.audioFound.play();
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
        objects.push(new HiddenObject(color, {width: s.w, height: s.h, depth: s.d }, {x: coords.x, y: coords.y, z: coords.z}, {x:100, y:100}));
		objects[objects.length-1].bake();
        console.log(color + ' object generated: ', coords);
	}
};
HiddenObject.createNew = function(color, s, p) {
    objects.push(new HiddenObject(color, {width: s.w, height: s.h, depth: s.d }, {x: p.x, y: p.y, z: p.z}));
	console.log(color + ' object generated: ', coords);
};


HiddenObject.prototype.moveTwoDeeTo = function (X, Y) {
    this.div.style.left = X + 'px';
    this.div.style.top = Y + 'px';
}


HiddenObject.prototype.grow = function (W, H, D) {

    if (W == null || W * this.growWFactor < this.growWminLimit || W * this.growWFactor > this.growWmaxLimit) {
        ratioW = 1; W = this.mesh.geometry.width/this.growWFactor;
    } else {
        ratioW = W / this.mesh.geometry.width * this.growWFactor;
    }
    if (H == null || H * this.growHFactor < this.growHminLimit || H * this.growHFactor > this.growHmaxLimit) {
        ratioH = 1; H = this.mesh.geometry.height/this.growHFactor;
    } else {
        ratioH = H / this.mesh.geometry.height * this.growHFactor;
    }
    if (D == null || D * this.growDFactor < this.growDminLimit || D * this.growDFactor > this.growDmaxLimit) {
        ratioD = 1; D = this.mesh.geometry.depth/this.growDFactor;
    } else {
        ratioD = D / this.mesh.geometry.depth * this.growDFactor;
    }


for (point in this.mesh.geometry.vertices){
        this.mesh.geometry.vertices[point].x*=ratioW;
        this.mesh.geometry.vertices[point].y*=ratioH;
        this.mesh.geometry.vertices[point].z*=ratioD;
    }
    this.mesh.geometry.width*=ratioD;
    this.mesh.geometry.height*=ratioH;
    this.mesh.geometry.depth*=ratioD;

    this.mesh.position.y += this.mesh.geometry.vertices[2].y*(1-ratioH)/ratioH;

    this.div.style.width = W + 'px';
    this.div.style.height = D + 'px';

    this.div.style.border= H/20 + 'px inset grey';

    this.mesh.geometry.verticesNeedUpdate = true;


    return 'object base updated';
};

