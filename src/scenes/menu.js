import State from '../state';
import audio from '../audio';

const deviceTextArray = ['\\', '=', '/', '='];
let deviceTextState = 0;

const menu = kontra.gameLoop({
    fps: 2,
    update(){
        deviceTextState++;
        if (deviceTextState === 4) {
            deviceTextState = 0;
        }
    },
    render() {
        kontra.context.fillStyle = '#000';
        kontra.context.fillRect(3, 30, kontra.width - 6, kontra.height - 60);

        const textArr = [
            ['FKnight', 3, {x: -3, y: kontra.height / 2 - 30}, '#CF6A39'],
            ['Press enter', 1, {y: kontra.height / 2}, '#7B112B'],
            ['LRUD - move', 1, {x: -1, y: kontra.height / 2 + 10 * 1}, '#E79269'],
            ['space - skill', 1, {x: 1, y: kontra.height / 2 + 10 * 2}, '#E79269'],
            [deviceTextArray[deviceTextState], 3, {x: -2, y: kontra.height / 2 + 10 * 5}, '#000'],
        ];
        if (State.store.bestScore > 0) {
            textArr.push(['Best: ' + State.store.bestScore, 1, {x: 1, y: kontra.height / 2 + 10 * 3}]);
        }
        textArr.forEach((text) => {
            kontra.drawTextCenter(text[0], text[1], text[2], text[3] || '#fff');
        });
    }
});

menu.init = function () {
    audio.ttStop();
    audio.ttPlay();
    kontra.canvas.style.background = '#66b632ff';
    kontra.keys.bind('enter', function () {
        setTimeout(() => {
            State.switch('game');
        });
    });
};
menu.destroy = function () {
    kontra.keys.unbind('enter');
};
menu.onUp = function () {
    State.switch('game');
};

export default menu;