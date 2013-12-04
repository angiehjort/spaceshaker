function Settings(container) {
    self = this;
    this.container = container;



    var btnNames=["PWM", "Geiger", "Freq", "Gain"];
    this.buttons = [];


    for (i = 0; i < btnNames.length; ++i) {
	    var name = btnNames[i];
	    var button = document.createElement('div');
	        button = document.createElement('div');
	        button.id = 'button'+name;
	        button.classList.add('btn');
	        button.textContent = name;
	    self.container.appendChild(button);
	    self.buttons.push(button);
	
	    Hammer(button).on('touch', self.iWannaTouch.bind(self));
	    Hammer(button).on('release', self.iWannaRelease.bind(self));
    };

};

Settings.prototype.iWannaTouch = function () {event.target.classList.add('down'); }

Settings.prototype.iWannaRelease = function () {
    event.target.classList.remove('down');

    proximityStyle = event.target.textContent;
    console.log("set proximity style to " + proximityStyle);
}





