

var Board =  {
  fields: [],

  create: function () {
    for(var i = 0; i<3;i++){
      var arr = [];
      for(var j = 0; j< 3; j++){
        arr.push(new Field("" + i + j));
      }
      this.fields.push(arr);
    }
  },

  render: function() {
    for(var i = 0; i<3;i++) {
      for (var j = 0; j < 3; j++) {
        var field = this.fields[i][j];
        field.cell.innerText = field.state;
        field.cell.style.cursor = field.state === States.stateless ? 'pointer' : '';
      }
    }
  }
};



