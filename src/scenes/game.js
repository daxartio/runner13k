import State from '../state';

let sprite = kontra.sprite({
    x: 0,
    y: 440,
    color: '#ccc',
    width: 40,
    height: 40,
    dy: 30
});

let player = kontra.sprite({
    x: 140,
    y: 435,
    color: 'red',
    width: 40,
    height: 40,
    type: 'player'
});

const game = kontra.gameLoop({
    update(dt) {
        sprite.update(dt);
        if (sprite.y > kontra.canvas.height) {
            sprite.y = -sprite.height;
        }
        player.update(dt);
        if (kontra.keys.pressed('left') && player.x > 0) {
            player.x -= 20;
        }
        else if (kontra.keys.pressed('right') && player.x + player.width < kontra.canvas.width) {
            player.x += 20;
        }

        if (player.collidesWith(sprite)) {
            console.log('collide');
        }
    },
    render() {
        sprite.render();
        player.render();
    }
});

game.load = function () {
}

game.init = function () {
    kontra.keys.bind('esc', function () {
        State.switch('menu');
    });
};
game.destroy = function () {
    kontra.keys.unbind('esc');
};

export default game;