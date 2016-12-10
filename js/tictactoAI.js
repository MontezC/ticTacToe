var AImoves = function(sqr) {
    this.move = sqr;
    this.miniMax = 0;
    this.makeMove = function(st) {
        var next = new State(st);
        next.board[this.move] = st.player;
        if (st.player === "O") {
            next.oMovesMade++;
        }
        next.changePlayer();
        return next;
    }
};

AImoves.ascending = function(firstMove, secondMove) {
    if (firstMove.miniMax < secondMove.miniMax) {
        return -1;
    }
    else if (firstMove.miniMax > secondMove.miniMax) {
        return 1;
    }
    else {
        return 0;
    }
}

AImoves.descending = function(firstMove, secondMove) {
    if (firstMove.miniMax > secondMove.miniMax) {
        return -1;
    }
    else if (firstMove.miniMax < secondMove.miniMax) {
        return 1;
    }
    else {
        return 0;
    }
}

var AI = function() {
    var game = {};
    function minMax(state) {
        if (state.isEnd()) {
            return Game.score(state);
        }
        else {
            var stScore;
            if (state.player === "X") {
                stScore = -1000;
            }
            else {
                stScore = 1000;
            }
            
            var avlMove = state.emptySqr();
            var avlState = avlMove.map(function(sqr) {
                var action = new AImoves(sqr);
                var nextState = action.makeMove(state);
                return nextState;
            });
            
            avlState.forEach(function(nextState) {
                var nextScore = minMax(nextState);
                if (state.player === "X") {
                    if (nextScore > stScore) {
                        stScore = nextScore;
                    }
                }
                    else {
                        if (nextScore < stScore) {
                            stScore = nextScore;
                        }
                    }
            });
            return stScore;
        }
    }
    
    function AIturn(turn) {
        var avlb = game.currentState.emptySqr();
        var avlbMoves = avlb.map(function(sqr) {
            var action = new AImoves(sqr);
            var next = action.makeMove(game.currentState);
            action.miniMax = minMax(next);
            return action;
        });
        if (turn === "X") {
            avlbMoves.sort(AImoves.descending);
        }
        else {
            avlbMoves.sort(AImoves.ascending);
        }
        
        var moveMade = avlbMoves[0];
        var next = moveMade.makeMove(game.currentState);
        
        //ui.insertAt(moveMade.move, turn);
        drawMove(moveMade.move, turn);
        
        game.moveTo(next);
    }
    this.plays =function(_game) {
        game = _game;
    };
    
    this.notify = function(turn) {
        AIturn(turn);
    };
    
};