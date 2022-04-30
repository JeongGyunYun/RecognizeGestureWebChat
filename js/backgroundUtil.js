const image = new Image();
const canvasElement = document.getElementsByClassName('output_canvas')[0];

export function setBackgroundImage(canvas, imageID) {
    canvas.globalCompositeOperation = 'source-out';
    image.src = "../img/"+imageID+".jpg";
    canvas.drawImage(image, 0, 0, canvasElement.width, canvasElement.height);
}

export function noObjSetBackgroundImage(canvas, imageID) {
    image.src = "../img/"+imageID+".jpg";
    canvas.drawImage(image, 0, 0, canvasElement.width, canvasElement.height);
}

export function setDEFBackgroundImage(canvas, results) {
    canvas.globalCompositeOperation = 'source-out';
    canvas.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
}