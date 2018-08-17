kontra.init();
kontra.canvas.width = 320 / 16 * 5;
kontra.canvas.height = 480 / 16 * 5;

kontra.getImage = function (src) {
    const image = new Image();
    image.src = src;
    return image;
}

kontra.getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}