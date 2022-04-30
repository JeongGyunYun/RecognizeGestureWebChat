import * as recong from "./recong.js";
import {isHiGesture} from "./recong.js";
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const hi_img = new Image();
hi_img.src = "../img/image01.png";

export function setCanvasBlurFilter() {
    document.getElementsByClassName("output_canvas")[0].style.filter = "blur(15px)";

}

export function unSetCanvasBlurFilter() {
    document.getElementsByClassName("output_canvas")[0].style.filter = "none";
}

export function setSourceInBlurFilter(canvas) {
    canvas.globalCompositeOperation = 'source-in';
    canvas.filter = 'blur(25px)';
}

export function unSetSourceInBlurFilter(canvas) {
    canvas.globalCompositeOperation = 'source-in';
    canvas.filter = 'none';
}

export function checkTwoHandInvaildGesture(results) {
    let hasInvalidGesture = false;

    if (results.leftHandLandmarks) {
        // console.log("LeftHand:  " +recong.isInvalidGesture(results.leftHandLandmarks))
        if (recong.isInvalidGesture(results.leftHandLandmarks)) {
            hasInvalidGesture = true;
        }
    }

    if (results.rightHandLandmarks) {
        // console.log("RightHand:  " +recong.isInvalidGesture(results.rightHandLandmarks))
        if (recong.isInvalidGesture(results.rightHandLandmarks)) {
            hasInvalidGesture = true;
        }
    }
    return hasInvalidGesture;
}

export function checkTwoHandHiGesture(canvas, results) {
    const rightHand = results.rightHandLandmarks;
    const leftHand = results.leftHandLandmarks;

    if (leftHand && isHiGesture(leftHand)) {
        drawHiImage(canvas, leftHand)
    }

    if (rightHand && isHiGesture(rightHand)) {
        drawHiImage(canvas, rightHand);
    }
}

function drawHiImage(canvas, handResult){
    canvas.drawImage(hi_img,
        handResult[recong.HandPointEnum.MIDDLE_FINGER_TIP].x*canvasElement.width - 50,
        handResult[recong.HandPointEnum.MIDDLE_FINGER_TIP].y*canvasElement.height - 150,
        100, 100)
}

export function isHandInCamera(results) {
    return !!(results.rightHandLandmarks || results.leftHandLandmarks);
}