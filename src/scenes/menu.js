import State from '../state';

const menu = kontra.gameLoopEmpty();

menu.init = function () {
    kontra.canvas.style.background = '#268B67';
    kontra.keys.bind('enter', function () {
        State.switch('game');
    });
    const textArr = [
        ['Runner', 3, kontra.canvas.height / 2 - 45, '#CF6A39'],
        ['Start', 2, kontra.canvas.height / 2 - 15, '#7B112B'],
        ['Press enter', 1, kontra.canvas.height / 2, '#7B112B'],
        ['x - attack', 1, kontra.canvas.height / 2 + 10, '#E79269'],
        ['space - jump', 1, kontra.canvas.height / 2 + 10 * 2, '#E79269'],
        ['esc - pause', 1, kontra.canvas.height / 2 + 10 * 3, '#E79269'],
    ];
    textArr.forEach((text) => {
        kontra.drawTextCenter(text[0], text[1], {y: text[2]}, text[3] || '#fff');
    });
};
menu.destroy = function () {
    kontra.keys.unbind('enter');
};

export default menu;