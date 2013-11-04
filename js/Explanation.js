function Explanation(explainable) {
    this.explainable = explainable;
};

Explanation.prototype.setText = function (string) {
    if (string == 'none' || string == null) {
        this.hide();
    } else {
        this.show();
    }
    this.explainable.textContent = string;
};

Explanation.prototype.hide = function () {
    this.explainable.style.display = 'none';
};

Explanation.prototype.show = function () {
    this.explainable.style.display = '';
};
