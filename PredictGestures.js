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

var time0 = 6;
var time1 = 6;
var time2 = 6;
var time3 = 6;
var time4 = 6;
var time5 = 6;
var time6 = 6;
var time7 = 6;
var time8 = 6;
var time9 = 6;
var timetogo = 6;
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
//Store pervious accuracies per digit
//var perviousCorrectAvg = [0.70, 0.71, 0.72, 0.73, 0.74, 0.75, 0.75, 0.75, 0.75, 0.75];
var perviousCorrectAvg = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var printPerviousCorrectAvg = false;

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
    if (printPerviousCorrectAvg){
        for (var i = 0; i < perviousCorrectAvg.length; i++) {
            if (timesDigitTested[i] != 0){
                perviousCorrectAvg[i] = currentCorrectSum[i]/timesDigitTested[i];
            } else {
                perviousCorrectAvg[i] = 0;
            }

        }
        console.log(perviousCorrectAvg);
        printPerviousCorrectAvg = false;
    }
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
    text('Current Average Correct:', window.innerWidth/8-70, window.innerHeight/2+60);
    //text('Correct:', window.innerWidth/8-70, window.innerHeight/2+80);
    if (timesDigitTested[digitToShow] == 0){	//If first time signed of session
        var printCorrect =  "first time sign";
    } else {	//Any sign after the first time signed of session
        var printCorrect =  ((currentCorrectSum[digitToShow]/timesDigitTested[digitToShow])*100).toFixed(2).toString() + "%";
    }
    text(printCorrect, window.innerWidth/8-70, window.innerHeight/2+80);

    //Write Pervious Accuracy to the screen
    text('Average Correct Last Session:', window.innerWidth/8-70, window.innerHeight/2+60+100);
    //text('Last Session:', window.innerWidth/8-70, window.innerHeight/2+80+100);
    var printPervCorrect = (perviousCorrectAvg[digitToShow]*100).toString() + "%";
    text(printPervCorrect, window.innerWidth/8-70, window.innerHeight/2+80+100);
    //text(perviousCorrectAvg.toString());
    //Write Average correct over all
    // text('Average Correct', window.innerWidth/8-70, window.innerHeight/2+60+100);
    // text('Over all Sessions:', window.innerWidth/8-70, window.innerHeight/2+80+100);

    //Users rank compared to others
    // text('You rank ', window.innerWidth/8-50+200, window.innerHeight/2+60+100);
    // text('out of ', window.innerWidth/8-50+200, window.innerHeight/2+60+100+20);
    // text('on overall number correct digits signed', window.innerWidth/8-50+200, window.innerHeight/2+60+100+40);

}

function DrawLowerRightPanel(){
    // if (startshowingonlynumbers == false){
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
        // else if (digitToShow == 6) {
        //     image(n6, window.innerWidth/2, window.innerHeight/2, 200, 200);
        // }
        // else if (digitToShow == 7) {
        //     image(n7, window.innerWidth/2, window.innerHeight/2, 200, 200);
        // }
        // else if (digitToShow == 8) {
        //     image(n8, window.innerWidth/2, window.innerHeight/2, 200, 200);
        // }
        // else if (digitToShow == 9) {
        //     image(n9, window.innerWidth/2, window.innerHeight/2, 200, 200);
        // }
    //}
     // if (startshowingonlynumbers == true){
     //    if (digitToShow == 0) {
     //        image(d0, window.innerWidth/2, window.innerHeight/2, 200, 200);
     //        //image(check, 0, window.innerHeight/2, window.innerWidth/2,window.innerHeight/2);
     //    }
     //    else if (digitToShow == 1) {
     //        image(d1, window.innerWidth/2, window.innerHeight/2, 200, 200);
     //    }
     //    else if (digitToShow == 2) {
     //        image(d2, window.innerWidth/2, window.innerHeight/2, 200, 200);
     //    }
     //    else if (digitToShow == 3) {
     //        image(d3, window.innerWidth/2, window.innerHeight/2, 200, 200);
     //    }
     //    else if (digitToShow == 4) {
     //        image(d4, window.innerWidth/2, window.innerHeight/2, 200, 200);
     //    }
     //    else if (digitToShow == 5) {
     //        image(d5, window.innerWidth/2, window.innerHeight/2, 200, 200);
     //    }
     //    else if (digitToShow == 6) {
     //        image(d6, window.innerWidth/2, window.innerHeight/2, 200, 200);
     //    }
     //    else if (digitToShow == 7) {
     //        image(d7, window.innerWidth/2, window.innerHeight/2, 200, 200);
     //    }
     //    else if (digitToShow == 8) {
     //        image(d8, window.innerWidth/2, window.innerHeight/2, 200, 200);
     //    }
     //    else if (digitToShow == 9) {
     //        image(d9, window.innerWidth/2, window.innerHeight/2, 200, 200);
     //    }
     // }
}

function DetermineWhetherToSwitchDigits() {
    if (TimeToSwitchDigits()) {
        SwitchDigits();
    }
}

function TimeToSwitchDigits() {
    //Count seconds passed since digit presented
    var currentTime = new Date();
    var ElapsedInMilliseconds = timeSinceLastDigitChange - currentTime;
    var ElapsedInSeconds = ElapsedInMilliseconds/-1000.0;

    //Must meet an accuracy of 50% or 5 seconds pass
    timewindow = TimeWidowForDigit(0)	//No time change just getting time window
    console.log(ElapsedInSeconds);

    //Which ever is first: digit is signed corrected or time widow has run out
    if (m >= .50 || ElapsedInSeconds >= timewindow){ //CHANGED!!!!!!!!!
        //If digit is signed correctly within timewindow
        if (m >= .50 && ElapsedInSeconds <= timewindow){
            //Shorten time widow
            var changeTime = TimeWidowForDigit(-1);
            console.log('Reduced');
            console.log(changeTime);
            //Correct ASL digit
            currentCorrectSum[digitToShow] = currentCorrectSum[digitToShow] + 1
            console.log(digitToShow + " " + currentCorrectSum[digitToShow])
        } else if (ElapsedInSeconds >= timewindow) {
            // Digit is NOT signed correctly within timewindow
            var changeTime = TimeWidowForDigit(1);
            console.log('Increased');
            console.log(changeTime);
            //Incorrect ASL digit
            currentCorrectSum[digitToShow] = currentCorrectSum[digitToShow] + 0
            console.log(digitToShow + " " + currentCorrectSum[digitToShow])
        }
        timeSinceLastDigitChange = new Date();
        timeWithDigit = false;
        return true;
    }
}

function TimeWidowForDigit(timechange){
    if (digitToShow == 0){
        if ((timeWindowPerDigit[0] + timechange) < minTimeWindow){
            return timeWindowPerDigit[0];
        } else if ((timeWindowPerDigit[0] + timechange) > maxTimeWindow){
            return timeWindowPerDigit[0];
        } else {
            timeWindowPerDigit[0] = timeWindowPerDigit[0] + timechange;
            return timeWindowPerDigit[0];
        }
    } else if (digitToShow == 1){
        if ((timeWindowPerDigit[1] + timechange) < minTimeWindow){
            return timeWindowPerDigit[1];
        } else if ((timeWindowPerDigit[1] + timechange) > maxTimeWindow){
            return timeWindowPerDigit[1];
        } else {
            timeWindowPerDigit[1] = timeWindowPerDigit[1] + timechange;
            return timeWindowPerDigit[1];
        }
    } else if (digitToShow == 2){
        if ((timeWindowPerDigit[2] + timechange) < minTimeWindow){
            return timeWindowPerDigit[2];
        } else if ((timeWindowPerDigit[2] + timechange) > maxTimeWindow){
            return timeWindowPerDigit[2];
        } else {
            timeWindowPerDigit[2] = timeWindowPerDigit[2] + timechange;
            return timeWindowPerDigit[2];
        }
    }else if (digitToShow == 3){
        if ((timeWindowPerDigit[3] + timechange) < minTimeWindow){
            return timeWindowPerDigit[3];
        } else if ((timeWindowPerDigit[3] + timechange) > maxTimeWindow){
            return timeWindowPerDigit[3];
        } else {
            timeWindowPerDigit[3] = timeWindowPerDigit[3] + timechange;
            return timeWindowPerDigit[3];
        }
    }else if (digitToShow == 4){
        if ((timeWindowPerDigit[4] + timechange) < minTimeWindow){
            return timeWindowPerDigit[4];
        } else if ((timeWindowPerDigit[4] + timechange) > maxTimeWindow){
            return timeWindowPerDigit[4];
        } else {
            timeWindowPerDigit[4] = timeWindowPerDigit[4] + timechange;
            return timeWindowPerDigit[4];
        }
    }else if (digitToShow == 5){
        if ((timeWindowPerDigit[5] + timechange) < minTimeWindow){
            return timeWindowPerDigit[5];
        } else if ((timeWindowPerDigit[5] + timechange) > maxTimeWindow){
            return timeWindowPerDigit[5];
        } else {
            timeWindowPerDigit[5] = timeWindowPerDigit[5] + timechange;
            return timeWindowPerDigit[5];
        }
    }
    // else if (digitToShow == 6){
    //     if ((timeWindowPerDigit[6] + timechange) < minTimeWindow){
    //         return timeWindowPerDigit[6];
    //     } else if ((timeWindowPerDigit[6] + timechange) > maxTimeWindow){
    //         return timeWindowPerDigit[6];
    //     } else {
    //         timeWindowPerDigit[6] = timeWindowPerDigit[6] + timechange;
    //         return timeWindowPerDigit[6];
    //     }
    // }else if (digitToShow == 7){
    //     if ((timeWindowPerDigit[7] + timechange) < minTimeWindow){
    //         return timeWindowPerDigit[7];
    //     } else if ((timeWindowPerDigit[7] + timechange) > maxTimeWindow){
    //         return timeWindowPerDigit[7];
    //     } else {
    //         timeWindowPerDigit[7] = timeWindowPerDigit[7] + timechange;
    //         return timeWindowPerDigit[7];
    //     }
    // }else if (digitToShow == 8){
    //     if ((timeWindowPerDigit[8] + timechange) < minTimeWindow){
    //         return timeWindowPerDigit[8];
    //     } else if ((timeWindowPerDigit[8] + timechange) > maxTimeWindow){
    //         return timeWindowPerDigit[8];
    //     } else {
    //         timeWindowPerDigit[8] = timeWindowPerDigit[8] + timechange;
    //         return timeWindowPerDigit[8];
    //     }
    // }else if (digitToShow == 9){
    //     if ((timeWindowPerDigit[9] + timechange) < minTimeWindow){
    //         return timeWindowPerDigit[9];
    //     } else if ((timeWindowPerDigit[9] + timechange) > maxTimeWindow){
    //         return timeWindowPerDigit[9];
    //     } else {
    //         timeWindowPerDigit[9] = timeWindowPerDigit[9] + timechange;
    //         return timeWindowPerDigit[9];
    //     }
    // }

}

function SwitchDigits(){
    timesDigitTested[digitToShow] = timesDigitTested[digitToShow] + 1
    console.log(digitToShow + " " + timesDigitTested[digitToShow])
    n=0
    var countchocula = 0;
    var nextnumberplease = digitToShow+1;
    var thisdigit = digitToShow;
    var skip = false;
    if(nextnumberplease == 6){
        nextnumberplease = 0;
    }

    if(comebackto.length > 0){
        digitToShow = comebackto[0];
        comebackto.shift();
    }
    else{
        var searching = true;
        while(searching){
            if(countchocula == 5){
                searching = false;
                countchocula = 0;
                digitToShow = 0;
                comebackto = [];
                numlist[0][1] = false;
                numlist[1][1] = false;
                numlist[2][1] = false;
                numlist[3][1] = false;
                numlist[4][1] = false;
                numlist[5][1] = false;
                // numlist[6][1] = false;
                // numlist[7][1] = false;
                // numlist[8][1] = false;
                // numlist[9][1] = false;
                startshowingonlynumbers = true;
                skip = true;

                times[0] = 6;
                times[1] = 6;
                times[2] = 6;
                times[3] = 6;
                times[4] = 6;
                times[5] = 6;
                // times[6] = 6;
                // times[7] = 6;
                // times[8] = 6;
                // times[9] = 6;

            }
            else{
                if((numlist[nextnumberplease][1]) == false){
                    digitToShow = nextnumberplease;
                    searching = false;
                }
                else{
                    countchocula+=1
                    nextnumberplease+=1
                    if(nextnumberplease == 6){
                        nextnumberplease = 0;
                    }
                }
            }
        }
    }
    if(skip == false){
        if(m >= 0.5){
            numlist[thisdigit][1] = true;
            times[thisdigit] = times[thisdigit]-3;
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



function Train(){
    trainingCompleted = true;

    for (var i = 0; i < train0.shape[3]; i++) {
        features0 = train0ke.pick(null,null,null,i);
        features0 = features0.reshape(120);
        //console.log(features.toString());
        knnClassifier.addExample(features0.tolist(), 0);
    }


    for (var i = 0; i < train1.shape[3]; i++) {
        features1 = train1ke.pick(null,null,null,i);
        features1 = features1.reshape(120);
        //console.log(features.toString());
        knnClassifier.addExample(features1.tolist(), 1);
    }

    for (var i = 0; i < train1.shape[3]; i++) {
        features1 = train1Li.pick(null,null,null,i);
        features1 = features1.reshape(120);
        //console.log(features.toString());
        knnClassifier.addExample(features1.tolist(), 1);
    }

    for (var i = 0; i < train1.shape[3]; i++) {
        features1 = train1Bongard.pick(null,null,null,i);
        features1 = features1.reshape(120);
        //console.log(features.toString());
        knnClassifier.addExample(features1.tolist(), 1);
    }
    for (var i = 0; i < train2.shape[3]; i++) {
        features2 = train2.pick(null,null,null,i);
        features2 = features2.reshape(120);
        //console.log(features.toString());
        knnClassifier.addExample(features2.tolist(), 2);
    }
    for (var i = 0; i < train2.shape[3]; i++) {
        features2 = train2ke.pick(null,null,null,i);
        features2 = features2.reshape(120);
        //console.log(features.toString());
        knnClassifier.addExample(features2.tolist(), 2);
    }

    for (var i = 0; i < train3.shape[3]; i++) {
        features3 = train3.pick(null,null,null,i);
        features3 = features3.reshape(120);
        //console.log(features.toString());
        knnClassifier.addExample(features3.tolist(), 3);
    }

    for (var i = 0; i < train4.shape[3]; i++) {
        features4 = train4ke.pick(null,null,null,i);
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
        features6 = train6.pick(null,null,null,i);
        features6 = features6.reshape(120);
        knnClassifier.addExample(features6.tolist(), 6);
    }

    for (var i = 0; i < train6.shape[3]; i++) {
        features6 = train6f.pick(null,null,null,i);
        features6 = features6.reshape(120);
        knnClassifier.addExample(features6.tolist(), 6);
    }

    for (var i = 0; i < train6.shape[3]; i++) {
        features6 = train6ko.pick(null,null,null,i);
        features6 = features6.reshape(120);
        knnClassifier.addExample(features6.tolist(), 6);
    }

    for (var i = 0; i < train7.shape[3]; i++) {
        features7 = train7ke.pick(null,null,null,i);
        features7 = features7.reshape(120);
        knnClassifier.addExample(features7.tolist(), 7);
    }

    for (var i = 0; i < train7.shape[3]; i++) {
        feature7 = train7Vega.pick(null,null,null,i);
        feature7 = feature7.reshape(120);
        knnClassifier.addExample(feature7.tolist(), 7);
    }


    for (var i = 0; i < train7.shape[3]; i++) {
        feature7 = train7Fisher.pick(null,null,null,i);
        feature7 = feature7.reshape(120);
        knnClassifier.addExample(feature7.tolist(), 7);
    }

    for (var i = 0; i < train8.shape[3]; i++) {
        features8 = train8.pick(null,null,null,i);
        features8 = features8.reshape(120);
        knnClassifier.addExample(features8.tolist(), 8);
    }
    for (var i = 0; i < train8.shape[3]; i++) {
        features8 = train8ke.pick(null,null,null,i);
        features8 = features8.reshape(120);
        knnClassifier.addExample(features8.tolist(), 8);
    }
    for (var i = 0; i < train9.shape[3]; i++) {
        features9= train9.pick(null,null,null,i);
        features9 = features9.reshape(120);
        knnClassifier.addExample(features9.tolist(), 9);
    }
    for (var i = 0; i < train9.shape[3]; i++) {
        features9= train9ke.pick(null,null,null,i);
        features9 = features9.reshape(120);
        knnClassifier.addExample(features9.tolist(), 9);
    }





}

