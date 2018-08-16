import State from '../state';

const ctx = kontra.canvas.getContext("2d");
ctx.font = '11px serif';
ctx.textAlign = "center";


const menu = kontra.gameLoop({
    update(dt) {
    },
    render() {
        ctx.fillText("Pause", kontra.canvas.width / 2, kontra.canvas.height / 2);
    }
});

menu.init = function () {
    kontra.canvas.style.background = 'black';
    kontra.keys.bind('esc', function () {
        State.switch('game');
    });
};
menu.destroy = function () {
    kontra.keys.unbind('esc');
};

export default menu;