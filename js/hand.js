import * as recong from "./recong.js";
import {HandPointEnum, isIndexFold, isInvalidGesture} from "./recong.js";


const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');


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
    removeLandmarks(results);
    var alreadySetFilter = false;

    if(results.leftHandLandmarks){
        console.log("LeftHand:  " +isInvalidGesture(results.leftHandLandmarks))
        if (isInvalidGesture(results.leftHandLandmarks)) {
            recong.setBlurFilter();
            alreadySetFilter = true;
        } else {
            recong.unSetBlurFilter();
        }
    }

    if(results.rightHandLandmarks){
        console.log("RightHand:  " +isInvalidGesture(results.rightHandLandmarks))
        if(!alreadySetFilter){
            if (isInvalidGesture(results.rightHandLandmarks)) {
                recong.setBlurFilter();
            } else {
                recong.unSetBlurFilter();
            }
        }
    }

    if(!results.rightHandLandmarks && !results.leftHandLandmarks){
        recong.unSetBlurFilter();
    }

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    if(results.segmentationMask) {

        canvasCtx.drawImage(results.segmentationMask, 0, 0,
            canvasElement.width, canvasElement.height); //result.image or result.segmentationMask

        // Only overwrite existing pixels.
        canvasCtx.globalCompositeOperation = 'source-out';
        // canvasCtx.fillStyle = '#FF888888';    //뒷 배경 채우기
        let image = new Image();
        image.src = '../js/cafe1.jpg'
        canvasCtx.drawImage(image, 0, 0, canvasElement.width, canvasElement.height);


        //source-in set blur filter
        canvasCtx.globalCompositeOperation = 'source-in';
        canvasCtx.filter = 'blur(10px)';


        // Only overwrite missing pixels.
        canvasCtx.globalCompositeOperation = 'destination-atop';
        canvasCtx.drawImage(
            results.image, 0, 0, canvasElement.width, canvasElement.height);


        canvasCtx.globalCompositeOperation = 'source-over';
    } else {
        canvasCtx.drawImage(
            results.image, 0, 0, canvasElement.width, canvasElement.height
        );
    }

    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
        {color: '#00FF00', lineWidth: 4});
    drawLandmarks(canvasCtx, results.poseLandmarks,
        {color: '#FF0000', lineWidth: 2});
    // drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION,
    //     {color: '#C0C0C070', lineWidth: 1});
    drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS,
        {color: '#CC0000', lineWidth: 5});
    drawLandmarks(canvasCtx, results.leftHandLandmarks,
        {color: '#00FF00', lineWidth: 2});
    drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS,
        {color: '#00CC00', lineWidth: 5});
    drawLandmarks(canvasCtx, results.rightHandLandmarks,
        {color: '#FF0000', lineWidth: 2});
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
    minTrackingConfidence: 0.5,
    effect: 'mask',


});
holistic.onResults(onResults);