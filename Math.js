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
//var numSamples = 100;
var currentSample = 0;
var predictedClassLabels = nj.zeros(2);
var n = 0;
var m = 0;
var d = 3;
var programState = 0;
var digitToShow = 0;
var digitTested = 0;
var timeSinceLastDigitChange = new Date();

var mathGameActive = true;

// var answerCorrect = false;

var firstOperand;
var secondOperand;

var actualAnswer = -1;
var userAnswer;

var zero = [0,false];
var one = [1,false];
var two = [2,false];
var three = [3,false];
var four = [4,false];
var five = [5,false];
var six = [6,false];
var seven = [7,false];
var eight = [8,false];
var nine = [9,false];
var comebackto = [];
var numlist = [zero,one,two,three,four,five,six,seven,eight,nine];
var startshowingonlynumbers = false;

var time0 = 3;
var time1 = 3;
var time2 = 3;
var time3 = 3;
var time4 = 3;
var time5 = 3;
var time6 = 3;
var time7 = 3;
var time8 = 3;
var time9 = 3;
var timetogo = 3;
var times = [time0,time1,time2,time3,time4,time5,time6,time7,time8,time9];

//In order to make time window smaller
var maxTimeWindow = 6;
var minTimeWindow = 1;
var timeWindowPerDigit = [maxTimeWindow, maxTimeWindow, maxTimeWindow, maxTimeWindow, maxTimeWindow, maxTimeWindow, maxTimeWindow, maxTimeWindow, maxTimeWindow, maxTimeWindow];
var timewindow;

//In order to visualization that shows how their performance during their current session differs from their performance during their last
//Store current accuracies per digit
var currentCorrectSum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var timesDigitTested = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var currentMeanAccuracies = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var currentCorrectAvg = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0, 0, 0];
//Store pervious accuracies per digit
//var perviousCorrectAvg = [0.70, 0.71, 0.72, 0.73, 0.74, 0.75, 0.75, 0.75, 0.75, 0.75];
var perviousCorrectAvg = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var printPerviousCorrectAvg = false;

//For Rankings
var sessions = 2;
var avgCorrectOverall = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var avgCorrectOverallUser1 = [0.5, 0.5, 0.5, 0.5, 0.4, 0.5, 0, 0, 0];
var rank = 1;
var rankM = 1;

var Score = 0;
var Score1 = 0;
var LasrScore = 0;
var HighScore = 398;
var HighM = 120;

function SignIn(){
    username = document.getElementById('username').value;
    var list = document.getElementById('users');
    if(IsNewUser(username, list)){
        CreateNewUser(username,list)
        CreateSignInItem(username,list)
    } else { //Returing User
        //ID tag for the list item user’s number of sign in attempts
        var ID = String(username) + "_signins";
        //Will return such an item.
        var listItem = document.getElementById(ID);
        listItem.innerHTML = parseInt (listItem.innerHTML) + 1;
    }
    console.log(list.innerHTML);
    return false;

}

function IsNewUser(username, list) {
    var usernameFound = false;
    var users = list.children;
    for (var i = 0; i < users.length; i++) {
        if (username == users[i].innerHTML){
            usernameFound = true;
        }
    }
    return usernameFound == false;
}

function CreateNewUser(username,list){
    //Creating an html list item
    var item = document.createElement('li');
    item.id = String(username) + "_name";
    item.innerHTML = String(username);
    list.appendChild(item);
}
function CreateSignInItem(username,list){
    //Creating a 2nd list item (keep track of signins)
    var item2 = document.createElement('li');
    item2.id = String(username) + "_signins";
    item2.innerHTML = 1;
    list.appendChild(item2);
}


// function compute_prediction_7(c,d){
//     n++
//     m = (((n-1)*m) + (c==d))/n
//     console.log(n,m,c)
// }
function Test(){
    var currentTestingSample = oneFrameOfData.pick(null, null, null, 0);
    CenterDataX()
    CenterDataY()
    CenterDataZ()
    //currentLabel = digitToShow;
    currentTestingSample = currentTestingSample.reshape(120).tolist();
    //console.log(currentTestingSample)
    knnClassifier.classify(currentTestingSample, GotResults);
}

function GotResults(err, result){
    var c = result.label;


    predictedClassLabels.set(parseInt(result.label));
    n += 1;
    m = (((n-1)*m) + (c == digitToShow))/n;
    console.log(n + " " + m + " " + c);
}

function CenterDataX(){
    var xValues = oneFrameOfData.slice([],[],[0,6,3])
    var currentMean = xValues.mean()
    return currentMean

}

function CenterDataY(){
    var yValues = oneFrameOfData.slice([],[],[1,6,3])
    var currentMean = yValues.mean()
    return currentMean


}

function CenterDataZ(){
    var zValues = oneFrameOfData.slice([],[],[2,6,3])
    var currentMean = zValues.mean()
    //console.log(currentMean)
    return currentMean


}



function HandleFrame(frame){
    clear();

    //one hand over the device
    if(frame.hands.length >= 1){
        // first element in the hands
        var hand = frame.hands[0];
        var interactionBox = frame.interactionBox;
        HandleHand(hand,interactionBox);
    }
}

function HandleHand(hand,interactionBox){
    //fingers element
    var fingers = hand.fingers;
    //iterrate each finger
    for(var n = 3; 0 <=n; --n){
        for(var i=0; i <fingers.length; i++){
            HandleFinger(fingers[i],n,i,interactionBox)
        }
    }
}

function HandleFinger(finger,n,fingerIndex,interactionBox){

    HandleBone(finger.bones[n],n,fingerIndex,interactionBox);
}


function HandleBone(bone,type,fingerIndex,interactionBox){
    var bone_start = bone.prevJoint;
    var bone_end = bone.nextJoint;

    var normalizedPrevJoint = interactionBox.normalizePoint(bone.prevJoint,true);
    var normalizedNextJoint = interactionBox.normalizePoint(bone.nextJoint,true);

    var x_start = normalizedPrevJoint[0];
    var x_end =  normalizedNextJoint[0];

    var y_start = normalizedPrevJoint[1];
    var y_end = normalizedNextJoint[1];

    var z_start = normalizedPrevJoint[2];
    var z_end = normalizedNextJoint[2];


    oneFrameOfData.set(fingerIndex,type,0,x_start);
    oneFrameOfData.set(fingerIndex,type,1,y_start);
    oneFrameOfData.set(fingerIndex,type,2,z_start);
    oneFrameOfData.set(fingerIndex,type,3,x_end);
    oneFrameOfData.set(fingerIndex,type,4,y_end);
    oneFrameOfData.set(fingerIndex,type,5,z_end);


    // Test()

    var canvasXStart = (window.innerWidth * x_start) * 0.5;
    var canvasXEnd = (window.innerWidth * x_end) * 0.5;
    var canvasYStart = (window.innerHeight * (1-y_start)) * 0.5;
    var canvasYEnd =  (window.innerHeight * (1-y_end)) * 0.5;

    //line and line weight
    var yellow = m * 450;
    var red = (1 - m) * 450;
    if (type == 0) {
        stroke(red, yellow, 0);
        strokeWeight(20);

        line(canvasXStart,canvasYStart,canvasXEnd,canvasYEnd);
    } else if (type == 1) {
        stroke(red, yellow, 0);
        strokeWeight(15);
        line(canvasXStart,canvasYStart,canvasXEnd,canvasYEnd);
    } else if (type == 2) {
        stroke(red, yellow, 0);
        strokeWeight(10);
        line(canvasXStart,canvasYStart,canvasXEnd,canvasYEnd);
    } else {
        stroke(red, yellow, 0);
        strokeWeight(5);
        line(canvasXStart,canvasYStart,canvasXEnd,canvasYEnd);
    }

    //line(canvasXStart,canvasYStart,canvasXEnd,canvasYEnd);

}

function DetermineState(frame){
    if(frame.hands.length  == 0){
        programState = 0
    }
    else{
        HandleFrame(frame)
        if(HandIsUncentered()){
            programState = 1
        }
        else{
            programState = 2
        }
    }
}

function HandIsUncentered(){

    if(HandIsTooFarToTheLeft() || HandIsTooFarToTheRight() || HandIsTooFarToHigh() || HandIsTooFarToLow() || HandIsTooFar() || HandIsTooClose() ){
        return true;
    }
    else{
        return false;
    }
}


function HandIsTooFarToTheLeft(){
    if(CenterDataX() < 0.25 ){
        image(arrowRight,window.innerWidth/2,0,window.innerWidth/2,window.innerHeight/2);
        return true;
    }
    else{
        return false;
    }
}

function HandIsTooFarToTheRight(){
    if(CenterDataX() > 0.75 ){
        image(arrowLeft, window.innerWidth/2,0,window.innerWidth/2,window.innerHeight/2);
        return true;
    }
    else{
        return false;
    }
}

function HandIsTooFarToHigh(){
    if(CenterDataY() < 0.25 ){
        image(arrowUp, window.innerWidth/2,0,window.innerWidth/2,window.innerHeight/2);
        return true;
    }
    else{
        return false;
    }
}

function HandIsTooFarToLow(){
    if(CenterDataY() > 0.75 ){
        image(arrowDown, window.innerWidth/2,0,window.innerWidth/2,window.innerHeight/2);
        return true;
    }
    else{
        return false;
    }
}

function HandIsTooClose(){
    if(CenterDataZ() < 0.25 ){
        image(arrowTowards,window.innerWidth/2,0,window.innerWidth/2,window.innerHeight/2);
        return true;
    }
    else{
        return false;
    }
}

function HandIsTooFar(){
    if(CenterDataZ() > 0.75 ){
        image(arrowAway, window.innerWidth/2,0,window.innerWidth/2,window.innerHeight/2);
        return true;
    }
    else{
        return false;
    }
}
function HandleState0(frame) {
    TrainKNNIfNotDoneYet()
    DrawImageToHelpUserPutTheirHandOverTheDevice()
    // if (printPerviousCorrectAvg){
    //     for (var i = 0; i < perviousCorrectAvg.length; i++) {
    //         if (timesDigitTested[i] != 0){
    //             perviousCorrectAvg[i] = currentCorrectSum[i]/timesDigitTested[i];
    //         } else {
    //             perviousCorrectAvg[i] = 0;
    //         }
    //
    //     }
    //     console.log(perviousCorrectAvg);
    //     printPerviousCorrectAvg = false;
    // }
}
function HandleState1(frame) {
    //test
}
function HandleState2(frame) {
    HandleFrame(frame);
    DrawLowerRightPanel();
    DetermineWhetherToSwitchDigits()
    Test()
    //Write Accuracy to the screen
    strokeWeight(0);
    textSize(20);
    fill(50);
    if (startshowingonlynumbers == false) {
    if (m > 0.5) {
        Score = Score+1
        image(check, window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight / 2);
    }
    text('Score:', window.innerWidth / 8 - 95, window.innerHeight / 2 + 60);
    text(Score, window.innerWidth / 8 - 70, window.innerHeight / 2 + 80);
    LasrScore = Score;
    if (HighScore <= Score){
        HighScore = Score
        rank = 1
    }else{
        rank=2
    }
        text('Rank in Digital:', window.innerWidth / 8 + 175, window.innerHeight / 2 + 60);
        R = rank + '/' + '2';
        text(R, window.innerWidth / 8 + 175, window.innerHeight / 2 + 100);
    }


    else if ( startshowingonlynumbers == true){
        if (m > 0.5) {
            Score1 = Score1+1
            image(check, window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight / 2);
        }

        text('Digital game Score:', window.innerWidth / 8 - 95, window.innerHeight / 2 + 60 + 150);
        text(LasrScore, window.innerWidth / 8 - 95, window.innerHeight / 2 + 100 + 150);

        text('Math game Score:', window.innerWidth / 8 - 95, window.innerHeight / 2 + 60);
        text(Score1, window.innerWidth / 8 - 70, window.innerHeight / 2 + 80);

        if (HighM <= Score1){
            HighM = Score1
            rankM = 1
        }else{
            rankM = 2
        }
        text('Rank in Math:', window.innerWidth / 8 + 175, window.innerHeight / 2 + 60);
        r = rankM + '/' + '2';
        text(r, window.innerWidth / 8 + 175, window.innerHeight / 2 + 100);
    }
}
//     text('Current Average Correct:', window.innerWidth / 8 - 95, window.innerHeight / 2 + 60);
//     //text('Correct:', window.innerWidth/8-70, window.innerHeight/2+80);
//     if (timesDigitTested[digitToShow] == 0) {	//If first time signed of session
//         var printCorrect = "first time sign";
//     } else {	//Any sign after the first time signed of session
//         var printCorrect = ((currentCorrectSum[digitToShow] / timesDigitTested[digitToShow]) * 100).toFixed(2).toString() + "%";
//     }
//     text(printCorrect, window.innerWidth / 8 - 70, window.innerHeight / 2 + 80);
//
//     //Write Pervious Accuracy to the screen
//     text('Average Correct Last Session:', window.innerWidth / 8 + 175, window.innerHeight / 2 + 60);
//     //text('Last Session:', window.innerWidth/8-70, window.innerHeight/2+80+100);
//     var printPervCorrect = (perviousCorrectAvg[digitToShow] * 100).toString() + "%";
//     text(printPervCorrect, window.innerWidth / 8 + 175, window.innerHeight / 2 + 100);
//
//     //Update avg correct Over All Sessions, only once info is available
//     if (timesDigitTested[digitToShow] == 0) {
//         avgCorrectOverall[digitToShow] = perviousCorrectAvg[digitToShow];
//     } else {
//         //currentCorrectSum[digitToShow] = ((currentCorrectSum[digitToShow]/timesDigitTested[digitToShow])*100)
//         avgCorrectOverall[digitToShow] = (currentCorrectAvg[digitToShow] + perviousCorrectAvg[digitToShow]) / sessions;
//     }
//
//     text('Average Correct Over all Sessions:', window.innerWidth / 8 - 95, window.innerHeight / 2 + 60 + 150);
//     //text('Over all Sessions:', window.innerWidth/8-95, window.innerHeight/2+80+150);
//     var printAvgCorrectOverall = (avgCorrectOverall[digitToShow] * 100).toString() + "%";
//     text(printAvgCorrectOverall, window.innerWidth / 8 - 95, window.innerHeight / 2 + 100 + 150);
//     //Write Sessions
//
//     // if (timesDigitTested[di
//     // gitToShow] == 0){
//     //     sessions = 1
//     // }else{
//     //     sessions = 2
//     // }
//     // var printSessions = 'Sessions: ' + sessions;
//     // text(printSessions, window.innerWidth/8-95, window.innerHeight/2+140+150);
//
//     //rank = users
//     //count how many user you are greater than user>user1 -1
//     if (avgCorrectOverall[digitToShow] > avgCorrectOverallUser1[digitTested]) {
//         rank = 1
//     } else {
//         rank = 2
//     }
//     var users = 2;
//     var rankMsg = 'You rank ' + rank + ' / ' + users;
//     text(rankMsg, window.innerWidth / 8 + 300, window.innerHeight / 2 + 60 + 150);
// //     text('on average correctness', window.innerWidth/8+175, window.innerHeight/2+60+ 170);
// //     text('of all users', window.innerWidth/8+175, window.innerHeight/2+60+ 190);


function DrawLowerRightPanel(){
    if (startshowingonlynumbers == false){
        if (digitToShow == 0) {
            image(n0, window.innerWidth/2, window.innerHeight/2, 200, 200);
            //image(check, 0, window.innerHeight/2, window.innerWidth/2,window.innerHeight/2);
        }
        else if (digitToShow == 1) {
            image(n1, window.innerWidth/2, window.innerHeight/2, 200, 200);
        }
        else if (digitToShow == 2) {
            image(n2, window.innerWidth/2, window.innerHeight/2, 200, 200);
        }
        else if (digitToShow == 3) {
            image(n3, window.innerWidth/2, window.innerHeight/2, 200, 200);
        }
        else if (digitToShow == 4) {
            image(n4, window.innerWidth/2, window.innerHeight/2, 200, 200);
        }
        else if (digitToShow == 5) {
            image(n5, window.innerWidth/2, window.innerHeight/2, 200, 200);
        }
        else if (digitToShow == 6) {
            image(n6, window.innerWidth/2, window.innerHeight/2, 200, 200);
        }
        else if (digitToShow == 7) {
            image(n7, window.innerWidth/2, window.innerHeight/2, 200, 200);
        }
        else if (digitToShow == 8) {
            image(n8, window.innerWidth/2, window.innerHeight/2, 200, 200);
        }
        else if (digitToShow == 9) {
            image(n9, window.innerWidth/2, window.innerHeight/2, 200, 200);
        }
    }
    if (startshowingonlynumbers == true){
        if (digitToShow == 0) {
            image(m0, window.innerWidth/2, window.innerHeight/2, 300, 300);
            //image(check, 0, window.innerHeight/2, window.innerWidth/2,window.innerHeight/2);
        }
            // else if (digitToShow == 1) {
            //     image(d1, window.innerWidth/2, window.innerHeight/2, 200, 200);
        // }
        else if (digitToShow == 2) {
            image(m2, window.innerWidth/2, window.innerHeight/2, 300, 300);
        }
        else if (digitToShow == 3) {
            image(m3, window.innerWidth/2, window.innerHeight/2, 300, 300);
        }
        else if (digitToShow == 4) {
            image(m4, window.innerWidth/2, window.innerHeight/2, 300, 300);
        }
            // else if (digitToShow == 5) {
            //     image(d5, window.innerWidth/2, window.innerHeight/2, 200, 200);
            // }
            // else if (digitToShow == 6) {
            //     image(d6, window.innerWidth/2, window.innerHeight/2, 200, 200);
        // }
        else if (digitToShow == 7) {
            image(m7, window.innerWidth/2, window.innerHeight/2, 300, 300);
        }
            // else if (digitToShow == 8) {
            //     image(d8, window.innerWidth/2, window.innerHeight/2, 200, 200);
        // }
        else if (digitToShow == 9) {
            image(m9, window.innerWidth/2, window.innerHeight/2, 300, 300);
        }
    }
}

function DetermineWhetherToSwitchDigits() {
    if (TimeToSwitchDigits()) {
        SwitchDigits();
    }
}

function TimeToSwitchDigits() {
    var currentTime = new Date();
    var timeInBetweenInMilliseconds = currentTime - timeSinceLastDigitChange;
    var timeInBetweenInSeconds = timeInBetweenInMilliseconds / 1000;
    console.log(timeInBetweenInSeconds);
    if (timeInBetweenInSeconds > timetogo ) {
        //image(check, 0, window.innerHeight/2, window.innerWidth/2,window.innerHeight/2);

        timeSinceLastDigitChange = new Date();
        return true;
    } else {
        return false;
    }
}




function SwitchDigits(){

    n=0
    var countchocula = 0;
    var nextnumberplease = digitToShow+1;
    var thisdigit = digitToShow;
    var skip = false;
    if(nextnumberplease == 10){
        nextnumberplease = 0;
    }

    if(comebackto.length > 0){
        digitToShow = comebackto[0];
        comebackto.shift();
    }
    else{
        var searching = true;
        while(searching){
            if(countchocula == 9){
                searching = false;
                countchocula = 0;
                digitToShow = 0;
                comebackto = [];
                if ( startshowingonlynumbers = false){
                    numlist[0][1] = false;
                    numlist[1][1] = false;
                    numlist[2][1] = false;
                    numlist[3][1] = false;
                    numlist[4][1] = false;
                    numlist[5][1] = false;
                    numlist[6][1] = false;
                    numlist[7][1] = false;
                    numlist[8][1] = false;
                    numlist[9][1] = false;
                }
                else if ( startshowingonlynumbers = true){
                    numlist[0][1] = false;
                    //numlist[1][1] = false;
                    numlist[2][1] = false;
                    numlist[3][1] = false;
                    numlist[4][1] = false;
                    // numlist[5][1] = false;
                    //numlist[6][1] = false;
                    numlist[7][1] = false;
                    //numlist[8][1] = false;
                    numlist[9][1] = false;
                }

                startshowingonlynumbers = true;
                skip = true;

                times[0] = 3;
                times[1] = 3;
                times[2] = 3;
                times[3] = 3;
                times[4] = 3;
                times[5] = 3;
                times[6] = 3;
                times[7] = 3;
                times[8] = 3;
                times[9] = 3;

            }
            else{
                if((numlist[nextnumberplease][1]) == false){
                    digitToShow = nextnumberplease;
                    searching = false;
                }
                else{
                    countchocula+=1
                    nextnumberplease+=1
                    if(nextnumberplease == 10){
                        nextnumberplease = 0;
                    }
                }
            }
        }
    }
    if(skip == false){
        if(m >= 0.5){
            numlist[thisdigit][1] = true;
            //times[thisdigit] = times[thisdigit]-3;
        }
        else{
            comebackto.push(thisdigit);
            //times[thisdigit] = times[thisdigit]+1;
        }
    }
    m = 0;
    d = 0;
    timetogo = times[thisdigit];
}

function DrawImageToHelpUserPutTheirHandOverTheDevice(){
    image(img, 10, 10, window.innerWidth/2.2, window.innerHeight/2.2);
}

function TrainKNNIfNotDoneYet() {
    if(trainingCompleted == false){
        Train();
        trainingCompleted = true;
    }
}
Leap.loop(controllerOptions, function(frame){
    clear();
    DetermineState(frame);
    if(programState == 0){
        HandleState0(frame)
    }
    else if (programState == 1){
        HandleState1(frame)
    }
    else{
        HandleState2(frame)
        printPerviousCorrectAvg = true;
    }
    // clear();
    // if(trainingCompleted == false){
    //   // Train();
    //   trainingCompleted = true;
    // }

    //currentNumbHands = frame.hands.length;
    //HandleFrame(frame);
    //previousNumHands = currentNumbHands;

})



function Train() {
    trainingCompleted = true;

    for (var i = 0; i < train0.shape[3]; i++) {
        features0 = train0ke.pick(null, null, null, i);
        features0 = features0.reshape(120);
        //console.log(features.toString());
        knnClassifier.addExample(features0.tolist(), 0);
    }


    for (var i = 0; i < train1.shape[3]; i++) {
        features1 = train1ke.pick(null, null, null, i);
        features1 = features1.reshape(120);
        //console.log(features.toString());
        knnClassifier.addExample(features1.tolist(), 1);
    }

    for (var i = 0; i < train1.shape[3]; i++) {
        features1 = train1Li.pick(null, null, null, i);
        features1 = features1.reshape(120);
        //console.log(features.toString());
        knnClassifier.addExample(features1.tolist(), 1);
    }

    for (var i = 0; i < train1.shape[3]; i++) {
        features1 = train1Bongard.pick(null, null, null, i);
        features1 = features1.reshape(120);
        //console.log(features.toString());
        knnClassifier.addExample(features1.tolist(), 1);
    }
    for (var i = 0; i < train2.shape[3]; i++) {
        features2 = train2.pick(null, null, null, i);
        features2 = features2.reshape(120);
        //console.log(features.toString());
        knnClassifier.addExample(features2.tolist(), 2);
    }
    for (var i = 0; i < train2.shape[3]; i++) {
        features2 = train2ke.pick(null, null, null, i);
        features2 = features2.reshape(120);
        //console.log(features.toString());
        knnClassifier.addExample(features2.tolist(), 2);
    }

    for (var i = 0; i < train3.shape[3]; i++) {
        features3 = train3.pick(null, null, null, i);
        features3 = features3.reshape(120);
        //console.log(features.toString());
        knnClassifier.addExample(features3.tolist(), 3);
    }

    for (var i = 0; i < train4.shape[3]; i++) {
        features4 = train4ke.pick(null, null, null, i);
        features4 = features4.reshape(120);
        //console.log(features.toString());
        knnClassifier.addExample(features4.tolist(), 4);
    }

    for (var i = 0; i < train5.shape[3]; i++) {
        features5 = train5.pick(null, null, null, i);
        features5 = features5.reshape(120);
        knnClassifier.addExample(features5.tolist(), 5);
    }

    for (var i = 0; i < train5.shape[3]; i++) {
        features5 = train5f.pick(null, null, null, i);
        features5 = features5.reshape(120);
        knnClassifier.addExample(features5.tolist(), 5);
    }
    for (var i = 0; i < train6.shape[3]; i++) {
        features6 = train6.pick(null, null, null, i);
        features6 = features6.reshape(120);
        knnClassifier.addExample(features6.tolist(), 6);
    }

    for (var i = 0; i < train6.shape[3]; i++) {
        features6 = train6f.pick(null, null, null, i);
        features6 = features6.reshape(120);
        knnClassifier.addExample(features6.tolist(), 6);
    }

    for (var i = 0; i < train6.shape[3]; i++) {
        features6 = train6ko.pick(null, null, null, i);
        features6 = features6.reshape(120);
        knnClassifier.addExample(features6.tolist(), 6);
    }

    for (var i = 0; i < train7.shape[3]; i++) {
        features7 = train7ke.pick(null, null, null, i);
        features7 = features7.reshape(120);
        knnClassifier.addExample(features7.tolist(), 7);
    }

    for (var i = 0; i < train7.shape[3]; i++) {
        feature7 = train7Vega.pick(null, null, null, i);
        feature7 = feature7.reshape(120);
        knnClassifier.addExample(feature7.tolist(), 7);
    }


    for (var i = 0; i < train7.shape[3]; i++) {
        feature7 = train7Fisher.pick(null, null, null, i);
        feature7 = feature7.reshape(120);
        knnClassifier.addExample(feature7.tolist(), 7);
    }

    for (var i = 0; i < train8.shape[3]; i++) {
        features8 = train8.pick(null, null, null, i);
        features8 = features8.reshape(120);
        knnClassifier.addExample(features8.tolist(), 8);
    }
    for (var i = 0; i < train8.shape[3]; i++) {
        features8 = train8ke.pick(null, null, null, i);
        features8 = features8.reshape(120);
        knnClassifier.addExample(features8.tolist(), 8);
    }
    for (var i = 0; i < train9.shape[3]; i++) {
        features9 = train9.pick(null, null, null, i);
        features9 = features9.reshape(120);
        knnClassifier.addExample(features9.tolist(), 9);
    }
    for (var i = 0; i < train9.shape[3]; i++) {
        features9 = train9ke.pick(null, null, null, i);
        features9 = features9.reshape(120);
        knnClassifier.addExample(features9.tolist(), 9);
    }


}

