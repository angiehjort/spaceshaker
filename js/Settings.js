function Settings(container) {
    self = this;
    this.container = container;



    var btnNames=["PWM", "Geiger", "Freq", "Gain"];
    this.buttons = [];


    for (i = 0; i < btnNames.length; ++i) {
    var name = btnNames[i];
    var button = new Object();
        button.div = document.createElement('div');
        button.div.id = 'button'+name;
        button.div.classList.add('btn');
        button.div.textContent = name;
    self.container.appendChild(button.div);
    self.buttons.push(button);

    Hammer(button.div).on('touch', self.iWannaTouch.bind(self));
    Hammer(button.div).on('release', self.iWannaRelease.bind(self));
    };

};

Settings.prototype.iWannaTouch = function () {event.target.classList.add('down'); }

Settings.prototype.iWannaRelease = function () {
    event.target.classList.remove('down');

    proximityStyle = event.target.textContent;
    console.log("set proximity style to " + proximityStyle);
}





