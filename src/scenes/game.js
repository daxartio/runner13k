import State from '../state';

let player;

let sprite = kontra.sprite({
    x: 16,
    y: kontra.canvas.height,
    color: '#808000',
    width: 16,
    height: 16,
    dy: 30,
    update(dt) {
        sprite.advance(dt);
        if (this.y > kontra.canvas.height) {
            this.y = -this.height;
        }
    }
});

const game = kontra.gameLoop({
    // clearCanvas: false,
    update(dt) {
        sprite.update(dt);
        player.update(dt);
    },
    render() {
        sprite.render();
        player.render();
    }
});

game.load = function () {
    player = kontra.sprite({
        type: 'player',
        x: 0,
        y: kontra.canvas.height - 16,
        animations: kontra.spriteSheet({
            image: kontra.getImage('./assets/player.png'),
            frameWidth: 16,
            frameHeight: 16,

            animations: {
                walk: {
                    frames: [0, 1],
                    frameRate: 8,
                },
                attack: {
                    frames: [2, 3],
                    frameRate: 8,
                },
                jump: {
                    frames: 4,
                    frameRate: 1,
                    loop: false
                }
            }
        }).animations,
        playerState: 'walk',
        prevPlayerState: 'walk',
        attackTime: 0,
        attackDuration: 500,
        jumpTime: 0,
        jumpDuration: 1000,
        collidesWith(object) {
            return this.x < object.x + object.width - 2 &&
                this.x + this.width - 2 > object.x &&
                this.y < object.y + object.height &&
                this.y + this.height > object.y;
        },
        update(dt) {
            player.advance(dt);
            let time = +new Date();
            var isJump, isAttack;
            if (time - this.jumpTime < this.jumpDuration) {
                isJump = true;
            } else if (time - this.attackTime < this.attackDuration) {
                isAttack = true;
            }
            if (isJump) {
                this.y = kontra.canvas.height - 20 - 8;
            } else {
                this.y = kontra.canvas.height - 20;
            }

            if (!isAttack && !isJump) {
                this.playerState = 'walk';
                if (kontra.keys.pressed('left') && player.x > 0) {
                    this.x -= 1;
                    this.playerState = 'walk';
                }
                else if (kontra.keys.pressed('right') && this.x + this.width < kontra.canvas.width) {
                    this.x += 1;
                    this.playerState = 'walk';
                }
                else if (kontra.keys.pressed('x')) {
                    this.playerState = 'attack';
                    this.attackTime = +new Date();
                }
                else if (kontra.keys.pressed('space') && time - this.jumpTime > this.jumpDuration + 200) {
                    this.playerState = 'jump';
                    this.jumpTime = +new Date();
                }

                if (this.collidesWith(sprite)) {
                    console.log('collide');
                }
            }
            if (this.prevPlayerState != this.playerState) {
                this.playAnimation(this.playerState);
                this.prevPlayerState = this.playerState;
            }
        }
    });
}

game.init = function () {
    kontra.canvas.style.background = 'green';
    kontra.keys.bind('esc', function () {
        State.switch('menu');
    });
};
game.destroy = function () {
    kontra.keys.unbind('esc');
};

export default game;