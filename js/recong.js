// WRIST = 0        손목
// THUMB_CMC = 1
// THUMB_MCP = 2
// THUMB_IP = 3
// THUMB_TIP = 4    엄지
// INDEX_FINGER_MCP = 5  검지  손바닥
// INDEX_FINGER_PIP = 6
// INDEX_FINGER_DIP = 7
// INDEX_FINGER_TIP = 8  검지 손끝
// MIDDLE_FINGER_MCP = 9
// MIDDLE_FINGER_PIP = 10
// MIDDLE_FINGER_DIP = 11
// MIDDLE_FINGER_TIP = 12  중지
// RING_FINGER_MCP = 13
// RING_FINGER_PIP = 14
// RING_FINGER_DIP = 15
// RING_FINGER_TIP = 16  약지
// PINKY_MCP = 17
// PINKY_PIP = 18
// PINKY_DIP = 19
// PINKY_TIP = 20  새끼

export let HandPointEnum = Object.freeze({
    "WRIST": 0,
    "THUMB_CMC": 1,
    "THUMB_MCP": 2,
    "THUMB_IP": 3,
    "THUMB_TIP": 4,
    "INDEX_FINGER_MCP": 5,
    "INDEX_FINGER_PIP": 6,
    "INDEX_FINGER_DIP": 7,
    "INDEX_FINGER_TIP": 8,
    "MIDDLE_FINGER_MCP": 9,
    "MIDDLE_FINGER_PIP": 10,
    "MIDDLE_FINGER_DIP": 11,
    "MIDDLE_FINGER_TIP": 12,
    "RING_FINGER_MCP": 13,
    "RING_FINGER_PIP": 14,
    "RING_FINGER_DIP": 15,
    "RING_FINGER_TIP": 16,
    "PINKY_MCP": 17,
    "PINKY_PIP": 18,
    "PINKY_DIP": 19,
    "PINKY_TIP": 20
})

export function isInvalidGesture(handResult) {
    return isMiddleFold(handResult) === false &&
        isRingFold(handResult) === true &&
        isPinkyFold(handResult) === true &&
        isIndexFold(handResult) === true;

}

export function isHiGesture(handResult) {
    return isMiddleFold(handResult) === false &&
        isRingFold(handResult) === false &&
        isPinkyFold(handResult) === false &&
        isIndexFold(handResult) === false;

}

export function isThumbFold(handResult) {
    const markPoint = handResult[HandPointEnum.PINKY_MCP]
    const p1 = handResult[HandPointEnum.THUMB_TIP]
    const p2 = handResult[HandPointEnum.THUMB_IP]
    return  calcFingerLen(p1, markPoint) < calcFingerLen(p2, markPoint);
}

export function isIndexFold(handResult) {
    const markPoint = handResult[HandPointEnum.WRIST]
    const p1 = handResult[HandPointEnum.INDEX_FINGER_TIP]
    const p2 = handResult[HandPointEnum.INDEX_FINGER_PIP]
    return  calcFingerLen(p1, markPoint) < calcFingerLen(p2, markPoint);
}

export function isMiddleFold(handResult) {
        const markPoint = handResult[HandPointEnum.WRIST]
        const p1 = handResult[HandPointEnum.MIDDLE_FINGER_TIP]
        const p2 = handResult[HandPointEnum.MIDDLE_FINGER_PIP]
        return  calcFingerLen(p1, markPoint) < calcFingerLen(p2, markPoint);
}

export function isRingFold(handResult) {
    const markPoint = handResult[HandPointEnum.WRIST]
    const p1 = handResult[HandPointEnum.RING_FINGER_TIP]
    const p2 = handResult[HandPointEnum.RING_FINGER_PIP]
    return  calcFingerLen(p1, markPoint) < calcFingerLen(p2, markPoint);
}

export function isPinkyFold(handResult) {
    const markPoint = handResult[HandPointEnum.WRIST]
    const p1 = handResult[HandPointEnum.PINKY_TIP]
    const p2 = handResult[HandPointEnum.PINKY_PIP]
    return  calcFingerLen(p1, markPoint) < calcFingerLen(p2, markPoint);
}

export function isHandOnMouse(handResult, faceResult) {

}

function calcFingerLen(fPoint, sPoint){
    const xVal = Math.pow(fPoint.x - sPoint.x, 2);
    const yVal = Math.pow(fPoint.y - sPoint.y, 2);
    const zVal = Math.pow(fPoint.z - sPoint.z, 2);
    return Math.sqrt(xVal + yVal + zVal);
}