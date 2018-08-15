import State from '../state';

const menu = kontra.gameLoop({
    update(dt) {
        console.log('Pause');
    },
    render() {
    }
});

menu.init = function() {
    kontra.keys.bind('esc', function () {
        State.switch('game');
    });
};
menu.destroy = function() {
    kontra.keys.unbind('esc');
};

export default menu;