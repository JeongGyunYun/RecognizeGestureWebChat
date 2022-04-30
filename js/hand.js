import * as recong from "./recong.js";
import * as gestureUtil from "./gestureUtil.js";
import * as backgroundUtil from "./backgroundUtil.js";




const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const blurCheckboxElement = document.getElementById('blurCheckbox');
const backgroundSelBoxElement = document.getElementById('background');
const objectSelBoxElement = document.getElementById('objectSel');

function removeElements(landmarks, elements) {
    for (const element of elements) {
        delete landmarks[element];
    }
}

function removeLandmarks(results) {
    if (results.poseLandmarks) {
        removeElements(
            results.poseLandmarks,
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16, 17, 18, 19, 20, 21, 22]);
    }
}

function onResults(results) {
    // removeLandmarks(results);

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    if(results.segmentationMask) {
        canvasCtx.drawImage(results.segmentationMask, 0, 0,
            canvasElement.width, canvasElement.height); //result.image or result.segmentationMask

        //뒷배경 설정시 이미지 교체
        switch (backgroundSelBoxElement.options[backgroundSelBoxElement.selectedIndex].value) {
            case "none":
                backgroundUtil.setDEFBackgroundImage(canvasCtx, results);
                break;

            default:
                backgroundUtil.setBackgroundImage(canvasCtx, backgroundSelBoxElement.options[backgroundSelBoxElement.selectedIndex].value);
                break;
        }


        // invaild 한 행동이 존재할 때 Canvas 또는 Source-in에  blur 처리함
        if(blurCheckboxElement.checked){
            if (gestureUtil.checkTwoHandInvaildGesture(results)) {
                if(objectSelBoxElement.options[objectSelBoxElement.selectedIndex].value === "all") {
                    gestureUtil.setCanvasBlurFilter();
                } else {
                    gestureUtil.setSourceInBlurFilter(canvasCtx)
                }
            } else{
                gestureUtil.unSetCanvasBlurFilter();
                gestureUtil.unSetSourceInBlurFilter(canvasCtx);
            }

            // 양손이 없을 때는 blur 처리를 해제함
            if(!gestureUtil.isHandInCamera(results)){
                gestureUtil.unSetCanvasBlurFilter()
            }
        } else {
            gestureUtil.unSetCanvasBlurFilter()
            gestureUtil.unSetSourceInBlurFilter(canvasCtx)
        }



        // Only overwrite missing pixels.
        canvasCtx.globalCompositeOperation = 'destination-atop';
        canvasCtx.drawImage(
            results.image, 0, 0, canvasElement.width, canvasElement.height);

        canvasCtx.globalCompositeOperation = 'source-over';
        gestureUtil.checkTwoHandHiGesture(canvasCtx, results);
        gestureUtil.checkTwoHandVictoryGesture(canvasCtx, results);

    } else {
        switch (backgroundSelBoxElement.options[backgroundSelBoxElement.selectedIndex].value) {
            case "none":
                canvasCtx.drawImage(
                    results.image, 0, 0, canvasElement.width, canvasElement.height
                );
                break;

            default:
                backgroundUtil.noObjSetBackgroundImage(canvasCtx, backgroundSelBoxElement.options[backgroundSelBoxElement.selectedIndex].value);
                break;
        }

    }

    // drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS,
    //     {color: '#CC0000', lineWidth: 5});
    // drawLandmarks(canvasCtx, results.leftHandLandmarks,
    //     {color: '#00FF00', lineWidth: 2});
    // drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS,
    //     {color: '#00CC00', lineWidth: 5});
    // drawLandmarks(canvasCtx, results.rightHandLandmarks,
    //     {color: '#FF0000', lineWidth: 2});
    //

    canvasCtx.restore();
}

export const holistic = new Holistic({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
    }});

holistic.setOptions({
    selfieMode: true,
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: true,
    smoothSegmentation: true,
    refineFaceLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5


});
holistic.onResults(onResults);