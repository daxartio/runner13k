import State from '../state';

const gameover = kontra.gameLoopEmpty();

gameover.init = function () {
    kontra.canvas.style.background = '#000';
    kontra.keys.bind('enter', function () {
        State.switch('menu');
    });
    setTimeout(() => {
        kontra.clear();
        const textArr = [
            ['Game Over', 2, {x: -2, y: kontra.canvas.height / 2 - 15}],
            ['Press enter', 1, {y: kontra.canvas.height / 2}]
        ];
        textArr.forEach((text) => {
            kontra.drawTextCenter(text[0], text[1], text[2], text[3] || '#fff');
        });
    });
};
gameover.destroy = function () {
    kontra.keys.unbind('enter');
};
gameover.onUp = function () {
    State.switch('menu');
};

export default gameover;