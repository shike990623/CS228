
//Global Variables
var controllerOptions = {};
var rawXMin = -10; //-300
var rawXMax = 20; //200
var rawYMin = -10; //-400, -300
var rawYMax = 20; //30
var previousNumHands = 0;
var currentNumHands = 0;

var oneFrameOfData = nj.zeros([6,5,4]); //6 stacks of 5x4 matrices

//Infinite Loop to catch each frame
Leap.loop(controllerOptions, function(frame){
    currentNumHands = frame.hands.length;

    clear();
    HandleFrame(frame);
    RecordData();

    previousNumHands = currentNumHands;
});

//Handles a single frame
function HandleFrame(frame) {
    //console.log(frame.hands.length);
    //No hand - variables undefine
    if(frame.hands.length == 1 || frame.hands.length == 2){
        //Grabs 1st hand per frame
        var hand = frame.hands[0];
        HandleHand(hand,1);
        if(frame.hands.length == 2){
            //Grabs 2nd hand per frame
            //var hand = frame.hands[1];
            HandleHand(hand,2);
        }
    }
}

//Handles a single hand
function HandleHand(hand, numHand) {
    //Grabs fingers
    var fingers = hand.fingers;
    //Draws all five finger bones(1-4) at a time

    //Distal phalanges are bones.type = 3
    var l = 3;

    //We know there are 4 bones in each finger
    for (var j=0; j<4; j++){
        //All five bones of a type at a time
        for(var k=0; k<fingers.length; k++){
            //Gets all bones of a finger
            var bones = fingers[k].bones;
            //Draws finger w/ finger index i --holds the value of the current finger
            HandleBone(bones[l], k);
        }
        l--;
    }
}

//Handles a single bone
function HandleBone(bone, fingerIndex){
    //Capture the x, y, and z coordinates the tip of each bone
    var tipPosition = bone.nextJoint;
    var tipX = tipPosition[0];
    var tipY = tipPosition[1];
    var tipZ = tipPosition[2];

    //Capture the x, y, and z coordinates the base of each bone
    var basePosition = bone.prevJoint;
    var baseX = basePosition[0];
    var baseY = basePosition[1];
    var baseZ = basePosition[2];

    //Transform the bone positions into canvas positions.
    var newTipPosition = TransformCoordinates(tipX,tipZ-tipY);
    var newBasePostion = TransformCoordinates(baseX,baseZ-baseY);

    //Del3 Step21 Sum all 6 coordinates together after they have been transformed
    // var transformedXPosition = TransformCoordinates(tipX, baseX);
    // var transformedYPosition = TransformCoordinates(tipY, baseY);
    var transformedZPosition = TransformCoordinates(tipZ, baseZ);
    var sum = newTipPosition[0] + newTipPosition[1] + newBasePostion[0] + newBasePostion[1] + transformedZPosition[0] + transformedZPosition[1]

    oneFrameOfData.set(0,fingerIndex, bone.type, newBasePostion[0]);
    oneFrameOfData.set(1,fingerIndex, bone.type, newBasePostion[1]);
    oneFrameOfData.set(2,fingerIndex, bone.type, transformedZPosition[1]);
    oneFrameOfData.set(3,fingerIndex, bone.type, newTipPosition[0]);
    oneFrameOfData.set(4,fingerIndex, bone.type, newTipPosition[1]);
    oneFrameOfData.set(5,fingerIndex, bone.type, transformedZPosition[0]);

    //Determine strokeWeight
    if (bone.type == 0){
        strokeWeight(6);
        if (currentNumHands == 1){
            stroke('rgb(0,210,0)');
        } else {
            stroke('rgb(210,0,0)');
        }

    } else if (bone.type == 1){
        strokeWeight(4);
        if (currentNumHands == 1){
            stroke('rgb(0,153,0)');
        } else {
            stroke('rgb(153,0,0)');
        }
    } else if (bone.type == 2){
        strokeWeight(2);
        if (currentNumHands == 1){
            stroke('rgb(0,75,0)');
        } else {
            stroke('rgb(75,0,0)');
        }
    } else {
        strokeWeight(1);
        if (currentNumHands == 1){
            stroke('rgb(0,51,0)');
        } else {
            stroke('rgb(51,0,0)');
        }
    }
    //Draw lines
    line(newTipPosition[0], newTipPosition[1], newBasePostion[0], newBasePostion[1]);

    //we’ll store the coordinates in the vector inside this function.
}

//Translate the positions into canvas positions.
//MAKE SURE Y = Z-Y
function TransformCoordinates(x,y) {
    //Check min & max
    if(x < rawXMin){
        rawXMin = x;
        //-364.348
    }
    if(y < rawYMin){
        rawYMin = y;
        //-631.54
    }
    if(x > rawXMax){
        rawXMax = x;
        //217.779
    }
    if(y > rawYMax){
        rawYMax = y;
        //59.44879999999999
    }

    x = ((x-rawXMin)*(window.innerWidth-0))/(rawXMax-rawXMin);
    y = ((y-rawYMin)*(window.innerHeight-0))/(rawYMax-rawYMin);
    return [x,y];
}

function RecordData(){
    if (previousNumHands == 2 && currentNumHands == 1){
        background('#222222');
        console.log(oneFrameOfData.toString());
    }
}


