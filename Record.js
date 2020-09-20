
var controllerOptions = {};
var rawXMin = -200;
var rawXMax = 200;
var rawYMin = 20;
var rawYMax = 200;
var previousNumHands = 0;
var currentNumHands = 0;
var twoHands;


Leap.loop(controllerOptions, function(frame){
    clear();
    HandleFrame(frame);
        currentNumHands = frame.hands.length;
        //console.log("Prev: " + previousNumHands + " -- Curr: " + currentNumHands);
        previousNumHands = currentNumHands;
}
)


function HandleFrame(frame) {
    if(frame.hands.length == 1){
        twoHands = false;
        var hand = frame.hands[0];
        HandleHand(hand, twoHands);
    } else if (frame.hands.length > 1) {
        twoHands = true;
        var hand = frame.hands[0];
        HandleHand(hand,twoHands);
    } else {
        twoHands = false;
    }
}

function HandleHand(hand) {

    var fingers = hand.fingers;
    var b1 = 3;
    for (var b2=0; b2<4; b2++){
        for(var b3=0; b3<fingers.length; b3++){
            var bones = fingers[b3].bones;
            HandleBone(bones[b1],twoHands);
        }
        b1--;
    }


}

function HandleFinger(finger) {
    var bones = finger.bones;
    for (i=0; i<bones.length; i++){
        HandleBone(finger.bones[i]);
    }
}

function HandleBone(bone,twoHands){
    var bone_end = bone.nextJoint;
    var endX = bone_end[0];
    var endY = bone_end[1];
    var endZ = bone_end[2];

    var bone_start = bone.prevJoint;
    var startX = bone_start[0];
    var startY = bone_start[1];
    var startZ = bone_start[2];

    var newBone_end = TransformCoordinates(endX,endZ-endY)
    var newBone_start = TransformCoordinates(startX,startZ-startY)

    if (twoHands) {
        if (bone.type == 0) {
            strokeWeight(8);
            stroke(250,0,0);
        } else if (bone.type == 1) {
            strokeWeight(6);
            stroke(180,0,0);
        } else if (bone.type == 2) {
            strokeWeight(4);
            stroke(120,0,0);
        } else {
            strokeWeight(2);
            stroke(80,0,0);
        }
    } else {
        if (bone.type == 0) {
            strokeWeight(8);
            stroke(0,250,0);
        } else if (bone.type == 1) {
            strokeWeight(6);
            stroke(0,180,0);
        } else if (bone.type == 2) {
            strokeWeight(4);
            stroke(0,120,0);
        } else {
            strokeWeight(2);
            stroke(0,80,0);
        }
    }

    line(newBone_end[0], newBone_end[1], newBone_start[0], newBone_start[1]);
}

function TransformCoordinates(x,y) {

    if(x < rawXMin){
        rawXMin = x;

    }
    if(y < rawYMin){
        rawYMin = y;

    }
    if(x > rawXMax){
        rawXMax = x;

    }
    if(y > rawYMax){
        rawYMax = y;

    }

    x = (((x - rawXMin) * (window.innerWidth)) / (rawXMax - rawXMin))
    y = (((y - rawYMin) * (window.innerHeight)) / (rawYMax - rawYMin))
    return [x,y];
}


