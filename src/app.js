import './init';
import State from './state';
import game from './scenes/game';
import menu from './scenes/menu';

kontra.assets.load('./assets/player.png')
    .then(function () {
        State
            .addScene('menu', menu)
            .addScene('game', game)
            .switch('game');

    }).catch(function (err) {
        console.error(err);
    });