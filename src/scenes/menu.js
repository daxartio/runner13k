import State from '../state';

const menu = kontra.gameLoopEmpty();

menu.init = function () {
    kontra.canvas.style.background = '#000';
    kontra.keys.bind('enter', function () {
        State.switch('game');
    });
    kontra.drawTextCenter('Start', 2, {y: kontra.canvas.height / 2 - 15}, '#fff');
    kontra.drawTextCenter('Press enter', 1, {y: kontra.canvas.height / 2}, '#fff');
};
menu.destroy = function () {
    kontra.keys.unbind('enter');
};

export default menu;