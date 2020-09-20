var controllerOptions = {};
var i = 0;
var h = 0;
var x, y, z;
var x = window.innerWidth/2;
var y = window.innerHeight/2;
var rawXMin = -200;
var rawXMax = 200;
var rawYMin = 20;
var rawYMax = 200;
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

function HandleHand(hand){
    for (var i = 0; i < fingers.length; i++) {


        HandleFinger(fingers[i]);
    }
}

function HandleFinger(finger){
     [x, y, z] = finger.tipPosition;

     if (x < rawXMin) {
        rawXMin = x;
    }
     if (x > rawXMax) {
        rawXMax = x;
    }
     if (y < rawYMin) {
        rawYMin = y;
    }
     if (y > rawYMax) {
        rawYMax = y;
    }

     x = (((x - rawXMin) * (window.innerWidth)) / (rawXMax - rawXMin))
	   y = (((y - rawYMin) * (window.innerHeight)) / (rawYMax - rawYMin))
	   circle(x,window.innerHeight - y,100);

}
