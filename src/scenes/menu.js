import State from '../state';

const menu = kontra.gameLoopEmpty();

menu.init = function () {
    kontra.canvas.style.background = '#268B67';
    kontra.keys.bind('enter', function () {
        State.switch('game');
    });
    const textArr = [
        ['Fknight', 3, kontra.canvas.height / 2 - 45, '#CF6A39'],
        ['Press enter', 1, kontra.canvas.height / 2 - 15, '#7B112B'],
        ['esc - pause', 1, kontra.canvas.height / 2 + 10 * 1, '#E79269'],
    ];
    textArr.forEach((text) => {
        kontra.drawTextCenter(text[0], text[1], { y: text[2] }, text[3] || '#fff');
    });
};
menu.destroy = function () {
    kontra.keys.unbind('enter');
};
menu.onUp = function () {
    State.switch('game');
};

export default menu;