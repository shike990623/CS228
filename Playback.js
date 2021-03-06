


var oneFrameOfData = nj.array([[[ 0.67632, 0.59084, 0.63193, 0.67632, 0.59084, 0.63193],
    [ 0.67632, 0.59084, 0.63193, 0.55072, 0.65492, 0.61082],
    [ 0.55072, 0.65492, 0.61082, 0.47257, 0.69752, 0.55047],
    [ 0.47257, 0.69752, 0.55047, 0.42573, 0.72453, 0.48909]],
    [[ 0.70554, 0.65142, 0.63079, 0.58806, 0.76711, 0.42698],
        [ 0.58806, 0.76711, 0.42698, 0.52207, 0.83271, 0.30161],
        [ 0.52207, 0.83271, 0.30161, 0.48021, 0.84614,  0.2178],
        [ 0.48021, 0.84614,  0.2178, 0.45084,  0.8414, 0.15686]],
    [[ 0.73263, 0.65905, 0.59785, 0.64302, 0.76962,  0.3788],
        [ 0.64302, 0.76962,  0.3788, 0.58914, 0.84021, 0.21321],
        [ 0.58914, 0.84021, 0.21321, 0.54625, 0.85178, 0.10597],
        [ 0.54625, 0.85178, 0.10597, 0.51535, 0.84263, 0.03834]],
    [[ 0.75957,  0.6576, 0.56271,  0.7022, 0.75508, 0.34444],
        [  0.7022, 0.75508, 0.34444, 0.65976,  0.8195, 0.18429],
        [ 0.65976,  0.8195, 0.18429, 0.62059, 0.83213, 0.07767],
        [ 0.62059, 0.83213, 0.07767, 0.59011, 0.82506, 0.00954]],
    [[ 0.78237, 0.63629, 0.52191, 0.75243, 0.72849, 0.31026],
        [ 0.75243, 0.72849, 0.31026, 0.74869, 0.77117, 0.16583],
        [ 0.74869, 0.77117, 0.16583,  0.7331,  0.7785, 0.08184],
        [  0.7331,  0.7785, 0.08184, 0.71128,  0.7728, 0.01275]]])

var anotherFrameOfData = nj.array([[[ 415.26532, 275.32106,   87.0196, 415.26532, 275.32106,   87.0196],
    [ 415.26532, 275.32106,   87.0196,  359.5762, 321.53572,   55.1978],
    [  359.5762, 321.53572,   55.1978, 316.97562, 355.25426,   36.5604],
    [ 316.97562, 355.25426,   36.5604, 285.18292, 379.45975,   25.9969]],
    [[ 432.05849, 340.81423,   88.0275, 392.70368,  447.7524,   31.9364],
        [ 392.70368,  447.7524,   31.9364, 377.39259, 559.95193,   13.1278],
        [ 377.39259, 559.95193,   13.1278, 368.17135, 620.92459,   1.57301],
        [ 368.17135, 620.92459,   1.57301,  361.2674, 662.48107,  -7.21886]],
    [[ 451.40476,   347.554,   84.4231, 429.52444, 448.78828,   28.6459],
        [ 429.52444, 448.78828,   28.6459,  436.4355,  573.9232,   5.45266],
        [  436.4355,  573.9232,   5.45266, 439.84391, 645.77259,  -9.22819],
        [ 439.84391, 645.77259,  -9.22819, 441.67199, 691.92168,  -19.5371]],
    [[ 470.89493, 344.42669,   80.6796, 466.87444, 432.61414,   29.0518],
        [ 466.87444, 432.61414,   29.0518, 484.90284, 543.85318,   7.22709],
        [ 484.90284, 543.85318,   7.22709, 495.43455, 610.90672,  -7.32111],
        [ 495.43455, 610.90672,  -7.32111, 502.10854, 654.80704,  -17.7646]],
    [[ 488.67991, 319.58525,   76.0424, 499.13259, 403.32759,   28.8989],
        [ 499.13259, 403.32759,   28.8989, 538.30779, 463.06441,   12.0983],
        [ 538.30779, 463.06441,   12.0983, 559.53506, 494.22275,   1.92963],
        [ 559.53506, 494.22275,   1.92963, 577.81775, 520.03451,  -7.72719]]])


var xStart = 0;
var yStart = 0;
var zStart = 0;

var xEnd = 0;
var yEnd = 0;
var zEnd = 0;

var frameIndex = 0;
var flipFlop = 0;

function draw() {
    clear();

    if (flipFlop == 0) {
        for (var i = 0; i < oneFrameOfData.shape[0]; i++) {
            for (var j = 0; j < oneFrameOfData.shape[1]; j++) {
                xStart = oneFrameOfData.get(i, j, 3);
                yStart = oneFrameOfData.get(i, j, 4);
                zStart = oneFrameOfData.get(i, j, 5);
                xEnd = oneFrameOfData.get(i, j, 0);
                yEnd = oneFrameOfData.get(i, j, 1);
                zEnd = oneFrameOfData.get(i, j, 2);

                var canvasPrevX = window.innerWidth * xEnd;
                var canvasPrevY = window.innerHeight * (1 - yEnd);

                var canvasNextX = window.innerWidth * xStart;
                var canvasNextY = window.innerHeight * (1 - yStart);

                line(canvasNextX, canvasNextY, canvasPrevX, canvasPrevY, zStart, zEnd);
            }
        }
    } else {
        for (var i = 0; i < anotherFrameOfData.shape[0]; i++) {
            for (var j = 0; j < anotherFrameOfData.shape[1]; j++) {
                xStart = anotherFrameOfData.get(i, j, 3);
                yStart = anotherFrameOfData.get(i, j, 4);
                zStart = anotherFrameOfData.get(i, j, 5);
                xEnd = anotherFrameOfData.get(i, j, 0);
                yEnd = anotherFrameOfData.get(i, j, 1);
                zEnd = anotherFrameOfData.get(i, j, 2);

                line(xStart, window.innerHeight - yStart, xEnd, window.innerHeight - yEnd);
            }
        }
    }


    frameIndex++;

    if (frameIndex >= 100) {
        frameIndex = 0;
        if (flipFlop == 1) {
            flipFlop = 0;
        } else {
            flipFlop = 1;
        }
    }
}