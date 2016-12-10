//initial config
$('.Xwins').hide();
$('.Owins').hide();
$('.draw').hide();
$('.player').hide();
$('.reset').hide();


//draw moves
function drawMove(sqr, plyr) {
    var gameBoard = $('.sqr');
    var playSqr = $(gameBoard[sqr]);
    if (!playSqr.hasClass("occupied")) {
        playSqr.html(plyr);
        playSqr.css({color: plyr === "X" ? "#2F79C3" : "#EB4549"});
        playSqr.addClass("occupied");
    }
}