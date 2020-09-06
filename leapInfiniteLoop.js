var controllerOptions = {};
var i = 0;
var h = 0;

var x = window.innerWidth/2;
var y = window.innerHeight/2;
Leap.loop(controllerOptions, function(frame)
{
//clear()
//console.log(i)
//circle(x + (Math.floor(Math.random()* 2) - 1),y + (Math.floor(Math.random()* 2) - 1),100)

if (frame.hands.length == 1) {
    console.log(frame.hands);
}
}
);
