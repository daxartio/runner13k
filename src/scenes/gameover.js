import State from '../state';

const gameover = kontra.gameLoopEmpty();

gameover.init = function () {
    kontra.canvas.style.background = '#66b632ff';
    kontra.keys.bind('enter', function () {
        setTimeout(() => {
            State.switch('menu');
        });
    });
    setTimeout(() => {
        kontra.clear();
        kontra.context.fillStyle = '#000';
        kontra.context.fillRect(3, 30, kontra.width - 6, kontra.height - 60);
        const textArr = [
            ['Game Over', 2, { x: -2, y: kontra.height / 2 - 15 }, '#CF6A39'],
            ['Press enter', 1, { y: kontra.height / 2 }, '#7B112B'],
            [State.store.score + '', 1, { y: kontra.height / 2 + 10 }],
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