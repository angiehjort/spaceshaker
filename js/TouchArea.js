function TouchArea(touchable) {
    this.touchable = touchable;

    this.explained = false;

    this.who = null;
    this.newDiv = null;
    this.newObj = null;

    // attach listeners
    Hammer(this.touchable).on('touch', this.iWannaTouch.bind(this));
    Hammer(this.touchable).on('release', this.iWannaRelease.bind(this));
    Hammer(this.touchable).on('pinch', this.iWannaPinch.bind(this));
    Hammer(this.touchable).on('drag', this.iWannaSwipe.bind(this));
};

TouchArea.prototype.iWannaTouch = function () {
    if (users[users.length - 1] == null) {
        explanation.setText('You do not exist! Dont touch the table! >__<');
        return;
    } else {
        this.who = users[users.length - 1];
    }

    if (event.gesture.touches.length == 2 && this.who.settingBaseOf==null && this.who.settingHeightOf==null) {
        explanation.setText(this.explained?null:'Yeees, like this you make a box base')

        objects.push(this.newObj = new HiddenObject(c, null, null));
        this.who.settingBaseOf = this.newObj;
    }
}

TouchArea.prototype.iWannaPinch = function () {
    //console.log(this.who, this.who.settingBaseOf);
    if (this.who!=null && this.who.settingBaseOf!=null) {
        var scale = Math.round(event.gesture.scale * 100);
        this.touchable.lastChild.style.width = scale + 'px';
        this.touchable.lastChild.style.height = scale + 'px';

        objects[objects.length - 1].mesh.scale.x = scale / 100;
        objects[objects.length - 1].mesh.scale.z = scale / 100;
    }
}

TouchArea.prototype.iWannaRelease = function () {
    if (this.who!=null &&  event.gesture.touches.length == 2 && this.who.settingBaseOf!=null) {
        explanation.setText(this.explained?null:'Now swipe to cut off the box');

        this.who.settingHeightOf = this.who.settingBaseOf;
        this.who.settingBaseOf = null;

        if (users[users.length - 1]!=null)users[users.length - 1].settingHeightOf = this.newObj;
    }
}

TouchArea.prototype.iWannaSwipe = function () {
    if (this.who!=null && this.who.settingHeightOf!=null){
    explanation.setText(this.explained?null:this.newDiv[0].style.width + " box created. Create more!");
    this.explained = true;

    this.newDiv.removeClass('newDiv');

    this.who.settingHeightOf = null;
    this.newDiv = null;
    this.newObj = null;
    this.who = null;
    }
}
