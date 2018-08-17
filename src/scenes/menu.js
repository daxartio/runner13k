import State from '../state';


const menu = kontra.gameLoop({
    clearCanvas: false,
    update(dt) {
    },
    render() {
    }
});

menu.init = function () {
    kontra.canvas.style.background = '#000';
    kontra.keys.bind('enter', function () {
        State.switch('game');
    });
    kontra.drawText('Start', 2, {x: kontra.canvas.width / 2 - 20, y: kontra.canvas.height / 2 - 15}, '#fff');
};
menu.destroy = function () {
    kontra.keys.unbind('enter');
};

export default menu;