var testingSampleIndex = 0;
const knnClassifier = ml5.KNNClassifier();

var trainingCompleted = false;


var numSamples;
var numFeatures;
var Features;
var currentFeatures;
var currentLabel;
var predictedLabel;

function draw(){
    clear();

    if (!trainingCompleted){
        Train();

    }
    Test();
    //DrawCircles();
}

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
    currentFeatures = test.pick(null, null, null, testingSampleIndex);

    currentLabel = 3;

    //console.log(currentFeatures.toString());

    predictedLabel = knnClassifier.classify(currentFeatures.tolist(), GotResults);

}

function GotResults(err, result){
    console.log(testingSampleIndex + " : " + result.label);

    testingSampleIndex++;

    //console.log(test.shape[3]);

    if (testingSampleIndex >= test.shape[3]) {
        testingSampleIndex = 0;
    }
}

function DrawCircles(){

}