
Board.create();
Board.render();


var game =  {


  playMove: function (id, state) {
    for(var i=0; i<Board.fields.length; i++){
      for(var j=0; j<Board.fields[i].length; j++){
        if(Board.fields[i][j].cell.id == id){
          Board.fields[i][j].state = state;
        }
      }
    }
  },

  decorateFields: function(state) {
    for(var i=0; i<Board.fields.length; i++){
      for(var j=0; j<Board.fields[i].length; j++) {
        var field = Board.fields[i][j];
        field.combinations = [];
        if (field.state === States.stateless) {
          field.combinations = this.getFieldDecoration(state, i, j);
        }
      }
    }
  },

  getNextMove: function(state) {
     this.decorateFields(state);
     var maxCombinations = {max: 0};
     //DO I HAVE A WINNING MOVE?
    var moveExists = false;
    var emptyField = false;
    var maxFields = [];
    for(var i=0; i<Board.fields.length; i++){
      for(var j=0; j<Board.fields[i].length; j++) {
        var field = Board.fields[i][j];
        if (field.state !== States.stateless) continue;
        if (field.combinations.length > 0) moveExists = true;
        emptyField = {x: i, y: j};
        // IF THERE IS A WINNING MOVE
        if (field.combinations.indexOf(1) >= 0) { // indexOf(bla) >= 0 means "contains"
          return {max: -1, x: i, y: j};
        }
        //GAME OVA
        if (field.combinations.indexOf(0) >= 0) {
          return {gameOver: true, winner: state};
        }
        if (maxCombinations.max <= field.combinations.length) {
          var newMax = maxCombinations.max < field.combinations.length;
          maxCombinations.max = field.combinations.length;
          maxCombinations.x = i;
          maxCombinations.y = j;
          if (newMax) {
            maxFields = [];
          }
          maxFields.push({max: maxCombinations.max, x: maxCombinations.x, y: maxCombinations.y});
        }
      }
    }
    if (maxFields.length > 0) {
      var r = Math.round(Math.random() * (maxFields.length - 1));
      maxCombinations = maxFields[r];
    }
    if (emptyField) {
      // The other player?
      var opponentState = this.getOppositeState(state);
      this.decorateFields(opponentState);
      // TODO: WET AGAIN
      // DOES THE OPPONENT HAVE A WINNING MOVE?
      for (var i = 0; i < Board.fields.length; i++) {
        for (var j = 0; j < Board.fields[i].length; j++) {
          // IF THERE IS A WINNING MOVE
          var field = Board.fields[i][j];
          if (field.state !== States.stateless) continue;
          if (field.combinations.indexOf(1) >= 0) {
            return {max: -2, x: i, y: j};
          }
          if (field.combinations.indexOf(0) >= 0) {
            return {gameOver: true, winner: opponentState};
          }
        }
      }
    }
    //ELSE, PLAY WHERE I HAVE MOST CHANCES TO WIN
    return maxCombinations.max === 0 ? emptyField : maxCombinations;
  },

  compVsComp: function() {
    var winStr = false;
    var self = this;
    var int;
    var playMove = function(state) {
      var nextMove = self.getNextMove(state);
      if (!nextMove) {
        setTimeout(function() {alert("Game Over!!! Tie.");}, 500);
        clearInterval(int);
      }
      if (nextMove.gameOver) {
        Board.fields[nextMove.x][nextMove.y].state = state;
        Board.render();
        setTimeout(function() {alert(nextMove.winner ? "Game Over!!! You win!!!" : "Game Over!!! Tie.");}, 500);
        clearInterval(int);
      } else {
        if (typeof nextMove.x === 'number') {
          Board.fields[nextMove.x][nextMove.y].state = state;
        }

        Board.render();
        if (nextMove.max === -1) {
          setTimeout(function() {alert("Game Over!!! I win");}, 500);
          clearInterval(int);
        }

        if (nextMove.max === -2) {
          Board.fields[nextMove.x][nextMove.y].state = state;
        }
      }
      Board.render();
    };
    var s = States.X;
    var self = this;
    int = setInterval(function() {
      playMove(s);
      s = self.getOppositeState(s);
    }, 1000);
  },

  getOppositeState: function(state) {
     if (state === States.X) return States.O;
     if (state === States.O) return States.X;
     return state;
  },
  
  getFieldDecoration: function (state, x, y) {

    var isOnMainDiag = x === y;
    var isOnSecDiag = x === y - 2;

    var self = this;

    var processComb = function(getFieldFunc) {
      var retVal = [];
      var stateCount = 0;
      var stopped = false;

      for (i = 0 ; i < Board.fields.length; i++) {
        var field = getFieldFunc(i);// Board.fields[i][y];
        if (state === self.getOppositeState(field.state)) {
          stopped = true;
          break;
        }
        if (field.state === States.stateless) {
          stateCount++;
        }
      }
      if (!stopped) {
        retVal.push(stateCount);
      }
      return retVal;
    };

    //TODO: to make this n-dimensional, even the next section should be dried up
    var retVal = processComb(function(i) {
      return Board.fields[x][i];},
      x);

    retVal = retVal.concat(processComb(function(i) {
        return Board.fields[i][y];},
      y));

    if (isOnMainDiag) {
      retVal = retVal.concat(processComb(function (i) {
          return Board.fields[i][i];
        },
        y));
    }

    if (isOnSecDiag) {
      retVal = retVal.concat(processComb(function (i) {
          return Board.fields[i][2 - i];
        },
        y));
    }

    return retVal;

  },

  clicked: function (e) {
    var row = parseInt(e.id[0]);
    var col = parseInt(e.id[1]);
    Board.fields[row][col].state = States.X;

    var nextMove = this.getNextMove(States.O);
    var winStr = false;
    if (nextMove.gameOver) {
      winStr = nextMove.winner ? "Game Over!!! You win!!!" : "Game Over!!! Tie.";
    } else {
      Board.fields[nextMove.x][nextMove.y].state = States.O;
      if (nextMove.max === -1) {
        winStr = "Game Over!!! I win!!!";
      }
    }
    Board.render();
    if (winStr) setTimeout(function() {alert(winStr)}, 1000);
  }

};







