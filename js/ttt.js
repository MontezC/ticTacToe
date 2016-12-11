var State = function(x) {
    this.player = "";
    this.oMovesMade = 0;
    this.result = "game active";
    this.board = [];
    if (typeof x !== "undefined") {
        this.board = new Array(x.board.length);
        for (var i = 0; i < x.board.length; i++) {
            this.board[i] = x.board[i];
        }
        this.oMovesMade = x.oMovesMade;
        this.result = x.result;
        this.player = x.player;
    }
    this.changePlayer = function() {
        this.player = this.player === "X" ? "O" : "X";
    }
    this.emptySqr = function() {
        var sqrs = [];
        for (var j = 0; j < 9; j++) {
            if (this.board[j] === " ") {
                sqrs.push(j);
            }
        }
        return sqrs
    }
    this.isEnd = function() {
        var brd = this.board;
        for (var n = 0; n <= 6; n = n + 3) {
            //row wins
            if (brd[n] !== " " && brd[n] === brd[n + 1] && brd[n + 1] == brd[n + 2]) {
                this.result = brd[n] + "wins";
                return true;
            }
        }
        //column wins
        for (var m = 0; m <= 2; m++) {
            if (brd[m] !== " " && brd[m] === brd[m + 3] && brd[m + 3] === brd[m + 6]) {
                this.result = brd[m] + "wins";
                return true;
            }
        }
        //diagonal wins
        for (var k = 0, l = 4; k <= 2; k = k + 2, l = l - 2) {
            if (brd[k] !== " " && brd[k] == brd[k + l] && brd[k + l] === brd[k + 2 * l]) {
                this.result = brd[k] + "wins";
                return true;
            }
        }
        var free = this.emptySqr();
        if (free.length == 0) {
            this.result = "draw";
            return true;
        }
        else {
            return false;
        }
    };
};

//game
var Game = function(aiPlayer) {
    this.AI = aiPlayer;
    this.currentState = new State();
    this.currentState.board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
    this.currentState.player = "X"; //x goes first
    this.part = "start"; //game status
    this.moveTo = function(_state) {
        this.currentState = _state;
        if (_state.isEnd()) {
            this.part = "finish";
            if (_state.result === "Xwins") {
                $('.Xwins').show();
            }
            else if (_state.result === "Owins") {
                $('.Owins').show();
            }
            else {
                $('.draw').show();
            }
        }
        else {
            //alert player to turn
            if (this.currentState.player === "X") {
                $('.player').show();
            }
            else {
                $('.player').hide();
                this.AI.notify("O");
            }
        }
    };
    this.play = function() {
        if (this.part = "start") {
            this.moveTo(this.currentState);
            this.part = "active";
        }
    };
    this.reset = function() {
        if (this.part = "active") {
            var gameBoard = $('.sqr');
            gameBoard.each(function() {
                var idx = parseInt($(this).data("sqr"));
                var playSqr = $(gameBoard[idx]);
                playSqr.html(" ");
                if ($(this).hasClass("occupied")) {
                    $(this).removeClass("occupied");
                }
            });
            this.part = "start";
        }
    };
};

//score
Game.score = function(_state) {
    if (_state.result === "Xwins") {
        return 10 - _state.oMovesMade;
    }
    else if (_state.result === "Owins") {
        return - 10 + _state.oMovesMade;
    }
    else {
        return 0;
    }
};

//functionality
var globals = {};

//change after program ai
$('.play').click(function() {
    var aiPlayer = new AI();
    globals.game = new Game(aiPlayer);
    aiPlayer.plays(globals.game);
    globals.game.play();
    $('.play').hide();
    $('.reset').show();
});
$('.reset').click(function() {
    globals.game.reset();
    $('.reset').hide();
    $('.play').show();
    if ($('.Xwins').is(':visible') || $('.Owins').is(':visible') || $('.draw').is(':visible')) {
        $('.Xwins').hide();
        $('.Owins').hide();
        $('.draw').hide();
    }
    $('.player').hide();
});

$('.sqr').each(function() {
    $(this).click(function() {
        if (globals.game.part === "active" && globals.game.currentState.player === "X" && !$(this).hasClass('occupied')) {
            var idx = parseInt($(this).data("sqr"));
            var newState = new State(globals.game.currentState);
            newState.board[idx] = "X";
            drawMove(idx, "X");
            newState.changePlayer();
            globals.game.moveTo(newState);
        }
    });
});