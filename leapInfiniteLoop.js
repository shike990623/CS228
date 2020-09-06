var controllerOptions = {};
var i = 0;
var h = 0;

var x = window.innerWidth/2;
var y = window.innerHeight/2;
Leap.loop(controllerOptions, function(frame)
{
clear();
HandleFrame(frame);

}
);

function HandleFrame(frame) {
    if (frame.hands.length == 1) {
        var hand = frame.hands[0];
        HandleHand(hand);
    }
}
