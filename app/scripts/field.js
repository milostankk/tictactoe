var States = {X:'X', O: 'O', stateless: ' '};


var Field = function (id) {
  this.cell = document.getElementById(id);
  this.state = States.stateless;
};

Field.prototype.changeState = function (state) {
  this.state = state;
};
