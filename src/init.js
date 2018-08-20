kontra.init();
kontra.canvas.width = 320 / 16 * 5;
kontra.canvas.height = 480 / 16 * 5;

kontra.getImage = function (src) {
    const image = new Image();
    image.src = src;
    return image;
}

kontra.clear = function () {
    kontra.context.clearRect(0, 0, kontra.canvas.width, kontra.canvas.height);
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