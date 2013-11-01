THREE.Mesh.prototype.axisToDim = {
		'x': 'width',
		'y': 'height',
		'z': 'depth'
};
THREE.Mesh.prototype.max = function(axis) { 
	return this.position[axis] + (this.geometry[this.axisToDim[axis]]/2);
};
THREE.Mesh.prototype.min = function(axis) { 
	return this.position[axis] - (this.geometry[this.axisToDim[axis]]/2);
};
THREE.Mesh.prototype.collidesWith = function(mesh) {
	return (this.max('x') >= mesh.min('x') && this.min('x') <= mesh.max('x'))
    	&& (this.max('y') >= mesh.min('y') && this.min('y') <= mesh.max('y'))
    	&& (this.max('z') >= mesh.min('z') && this.min('z') <= mesh.max('z'));
};
THREE.Mesh.prototype.distanceTo = function(mesh) {
	return Math.sqrt(
		Math.pow((this.position.x - mesh.position.x),2) + 
		Math.pow((this.position.y - mesh.position.y),2) +
		Math.pow((this.position.z - mesh.position.z),2)
	);
};
