import State from '../state';

const gameover = kontra.gameLoopEmpty();

gameover.init = function () {
    kontra.canvas.style.background = '#000';
    kontra.keys.bind('enter', function () {
        State.switch('menu');
    });
    setTimeout(() => {
        kontra.clear();
        kontra.drawTextCenter('Game Over', 2, {y: kontra.canvas.height / 2 - 15}, '#fff');
    });
};
gameover.destroy = function () {
    kontra.keys.unbind('enter');
};

export default gameover;