export function setBackgroundImage(canvas, imageID) {
    const canvasElement = document.getElementsByClassName('output_canvas')[0];

    canvas.globalCompositeOperation = 'source-out';
    let image = new Image();
    image.src = "../img/"+imageID+".jpg";
    canvas.drawImage(image, 0, 0, canvasElement.width, canvasElement.height);
}