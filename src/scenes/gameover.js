import State from '../state';


const gameover = kontra.gameLoop({
    update(dt) {
    },
    render() {
        kontra.drawText('Game Over', 2, {x: 10, y: kontra.canvas.height / 2 - 15}, '#fff');
    }
});

gameover.init = function () {
    kontra.canvas.style.background = '#000';
    kontra.keys.bind('enter', function () {
        State.switch('menu');
    });
};
gameover.destroy = function () {
    kontra.keys.unbind('enter');
};

export default gameover;