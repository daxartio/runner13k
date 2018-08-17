import './init';
import './text';
import State from './state';
import game from './scenes/game';
import menu from './scenes/menu';
import gameover from './scenes/gameover';

kontra.assets.load('./assets/runner13k.png')
    .then(function () {
        State
            .addScene('menu', menu)
            .addScene('game', game)
            .addScene('gameover', gameover)
            .switch('menu');

    }).catch(function (err) {
        console.error(err);
    });