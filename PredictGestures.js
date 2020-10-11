var testingSampleIndex = 0;
const knnClassifier = ml5.KNNClassifier();

var trainingCompleted = false;


var numSamples;
var numFeatures;
var Features;
var currentFeatures;
var currentLabel;
var predictedLabel;
var controllerOptions = {};
var oneFrameOfData = nj.zeros([5, 4, 6]);
var previousNumHands = 0;
var currentNumHands = 0;
var moreThanOneHand;
var numSamples = 100;
var currentSample = 0;

Leap.loop(controllerOptions, function(frame){
    clear();

    if (!trainingCompleted){
        Train();

    }
    HandleFrame(frame);

    //DrawCircles();
});

function Train(){
    trainingCompleted = true;

    for (var i = 0; i < train3.shape[3]; i++) {
        features = train3.pick(null,null,null,i);
        features = features.reshape(120);
        //console.log(features.toString());
        knnClassifier.addExample(features.tolist(), 3);
    }

    for (var i = 0; i < train5.shape[3]; i++) {
        features = train5.pick(null, null, null, i);
        features = features.reshape(120);
        //console.log(features.toString());
        knnClassifier.addExample(features.tolist(), 5);
    }

}

function Test(){
    currentFeatures = oneFrameOfData.pick(null, null, null, testingSampleIndex);

    currentLabel = 3;

    //console.log(currentFeatures.toString());

    predictedLabel = knnClassifier.classify(currentFeatures.tolist(), GotResults);

}

function GotResults(err, result){
    console.log(testingSampleIndex + " : " + result.label);

    testingSampleIndex++;

    //console.log(test.shape[3]);

    if (testingSampleIndex >= train3.shape[3]) {
        testingSampleIndex = 0;
    }
}

function DrawCircles(){

}

function HandleFrame(frame) {
    var interactionBox = frame.interactionBox;
    if (frame.hands.length == 1){
        moreThanOneHand = false;
        var hand = frame.hands[0];
        HandleHand(hand, moreThanOneHand, interactionBox);
        //console.log(oneFrameOfData.toString());
        Test();
    } else if (frame.hands.length > 1) {
        moreThanOneHand = true;
        var hand = frame.hands[0];
        HandleHand(hand, moreThanOneHand, interactionBox);
    } else {
        moreThanOneHand = false;
    }
}
function HandleHand(hand, moreThanOneHand, interactionBox) {
    var fingers = hand.fingers;
    for (var i = 3; i >= 0; i -= 1) {     // For each bone
        for (var j = 4; j >= 0; j -= 1) {   // For each finger

            HandleBone(fingers[j].bones[i], fingers[j].bones[i].type, j, moreThanOneHand, interactionBox);
        }
    }
}

function HandleBone(bone, boneType, fingerIndex, moreThanOneHand, interactionBox) {
    var normalizedPrevJoint = interactionBox.normalizePoint(bone.prevJoint, true);
    var normalizedNextJoint = interactionBox.normalizePoint(bone.nextJoint, true);


    xt = normalizedNextJoint[0];
    yt = normalizedNextJoint[1];
    zt = normalizedNextJoint[2];

    xb = normalizedPrevJoint[0];
    yb = normalizedPrevJoint[1];
    zb = normalizedPrevJoint[2];


    // console.log("Normalized Prev Joint: " + normalizedPrevJoint);
    // console.log("Normalized Next Joint: " + normalizedNextJoint);

    oneFrameOfData.set(fingerIndex, boneType, 0, xb);
    oneFrameOfData.set(fingerIndex, boneType, 1, yb);
    oneFrameOfData.set(fingerIndex, boneType, 2, zb);
    oneFrameOfData.set(fingerIndex, boneType, 3, xt);
    oneFrameOfData.set(fingerIndex, boneType, 4, yt);
    oneFrameOfData.set(fingerIndex, boneType, 5, zt);


    var canvasPrevX = window.innerWidth * normalizedPrevJoint[0];
    var canvasPrevY = window.innerHeight * (1 - normalizedPrevJoint[1]);

    var canvasNextX = window.innerWidth * normalizedNextJoint[0];
    var canvasNextY = window.innerHeight * (1 - normalizedNextJoint[1]);

    // console.log(oneFrameOfData);
    //if (moreThanOneHand) {
        if (boneType == 0) {
            strokeWeight(8*3);
            // stroke(20);
            stroke(200);
        } else if (boneType == 1) {
            strokeWeight(6*3);
            // stroke(60);
            stroke(150);
        } else if (boneType == 2) {
            strokeWeight(4*3);
            // stroke(80);
            stroke(100);
        } else {
            strokeWeight(2*3);
            // stroke(100);
            stroke(50);
        }
    // } else {
    //     if (boneType == 0) {
    //         strokeWeight(8*3);
    //         // stroke(20);
    //         stroke(200);
    //     } else if (boneType == 1) {
    //         strokeWeight(6*3);
    //         // stroke(60);
    //         stroke(150);
    //     } else if (boneType == 2) {
    //         strokeWeight(4*3);
    //         // stroke(80);
    //         stroke(100);
    //     } else {
    //         strokeWeight(2*3);
    //         // stroke(100);
    //         stroke(50);
    //     }
    // }
    line(canvasNextX, canvasNextY, canvasPrevX, canvasPrevY, zt, zb);
}

// function RecordData() {
//     if (currentNumHands == 2) {
//         currentSample += 1;
//         if (currentSample == numSamples) {
//             currentSample = 0;
//         }
//     }
//
//     if (previousNumHands == 2 && currentNumHands == 1) {
//         background(0)
//         // console.log(framesOfData.pick(null, null, null, currentSample).toString());
//         // console.log(framesOfData.pick(null, null, null, 0).toString());
//         // console.log(framesOfData.pick(null, null, null, 1).toString());
//         console.log(framesOfData.toString());
//
//         //console.log(currentSample);
//     }
// }

