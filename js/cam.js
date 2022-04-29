import {holistic} from "./hand.js";

const videoElement = document.getElementsByClassName('input_video')[0];
const camera = new Camera(videoElement, {
    onFrame: async () => {
        await holistic.send({image: videoElement});
    },
    width: 720,
    height: 360
});
camera.start();