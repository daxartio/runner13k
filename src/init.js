kontra.init();
canvas = kontra.canvas;
context = kontra.context;

canvas.width = 320 / 16 * 5 * 5;
canvas.height = 480 / 16 * 5 * 5;

kontra.width = canvas.width / 5;
kontra.height = canvas.height / 5;

context.mozImageSmoothingEnabled = false;  // firefox
context.imageSmoothingEnabled = false;
context.scale(5, 5);

kontra.getImage = function (src) {
    const image = new Image();
    image.src = src;
    return image;
}

kontra.clear = function () {
    context.clearRect(0, 0, kontra.width, kontra.height);
}

kontra.gameLoopEmpty = function () {
    return kontra.gameLoop({
        clearCanvas: false,
        update(dt) {
        },
        render() {
        }
    });
};

kontra.getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}