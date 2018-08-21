import State from '../state';

const controller = {
    phase: 'up',
    x: -1,
    y: -1,
};

let player;
let heart;
let enemies = [];
let grasses = [];
let golds = [];

let lastEnemyTime = 0;
let createEnemy;
let createGold;

const game = kontra.gameLoop({
    // clearCanvas: false,
    update(dt) {
        grasses.forEach(grass => {
            grass.update(dt);
        });
        golds.forEach(gold => {
            gold.update(dt);
        });
        enemies.forEach(enemy => {
            enemy.update(dt);
        });
        player.update(dt);

        createEnemy();

        createGold();
        if (controller.phase === 'down') {
            player.x += (controller.x - player.x) / Math.abs(controller.x - player.x);
            player.y += (controller.y - player.y) / Math.abs(controller.y - player.y);
        }
    },
    render() {
        grasses.forEach(grass => {
            grass.render();
        });
        golds.forEach(gold => {
            gold.render();
        });
        var objects = [player, ...enemies];
        objects.sort((a, b) => {
            return a.y - b.y;
        });
        objects.forEach(obj => {
            obj.render();
        });

        kontra.drawText(String(Math.floor(player.score)), 1, { x: 1, y: 1 }, '#fff');
        var h = Array(player.health + 1).join('|');
        kontra.drawText(h, 1, { x: kontra.canvas.width - (player.health * 3 + player.health), y: 1 }, 'red');
    }
});

game.load = function () {
    const spriteSheet = kontra.spriteSheet({
        image: kontra.getImage('./assets/runner13k.png'),
        frameWidth: 16,
        frameHeight: 16,

        animations: {
            walk: {
                frames: [0, 1],
                frameRate: 8,
            },
            enemyWalk: {
                frames: [6, 7],
                frameRate: 6,
            },
            attack: {
                frames: [2, 3],
                frameRate: 8,
            },
            jump: {
                frames: 4,
                frameRate: 1,
                loop: false
            },
            heart: {
                frames: 5,
                frameRate: 1,
                loop: false
            },
            gold: {
                frames: 8,
                frameRate: 1,
                loop: false
            },
            grass: {
                frames: 9,
                frameRate: 1,
                loop: false
            },
        }
    });
    player = kontra.sprite({
        type: 'player',
        x: 0,
        y: kontra.canvas.height - 16,
        animations: spriteSheet.animations,
        playerState: 'walk',
        prevPlayerState: 'walk',
        health: 3,
        score: 0,
        collidesWith(object) {
            return this.x < object.x + object.width - 2 &&
                this.x + this.width - 2 > object.x &&
                this.y < object.y + object.height &&
                this.y + this.height > object.y;
        },
        update(dt) {
            this.advance(dt);

            this.playerState = 'walk';
            if (kontra.keys.pressed('left') && player.x > 0) {
                this.x -= 1;
                this.playerState = 'walk';
            }
            else if (kontra.keys.pressed('right') && this.x + this.width < kontra.canvas.width) {
                this.x += 1;
                this.playerState = 'walk';
            }
            if (kontra.keys.pressed('up') && this.y > 0) {
                this.y -= 1;
                this.playerState = 'walk';
            }
            else if (kontra.keys.pressed('down') && this.y + this.height < kontra.canvas.height) {
                this.y += 1;
                this.playerState = 'walk';
            }
            golds.forEach((gold, index) => {
                if (this.collidesWith(gold)) {
                    this.score += 50;
                    golds.splice(index, 1);
                }
            })
            if (this.prevPlayerState != this.playerState) {
                this.playAnimation(this.playerState);
                this.prevPlayerState = this.playerState;
            }
        }
    });

    createEnemy = function () {
        if (enemies.length < 10 && +new Date() - lastEnemyTime > 1000) {
            lastEnemyTime = +new Date();
            var enemy = kontra.sprite({
                type: 'enemy',
                x: kontra.getRandomInt(0, kontra.canvas.width - 16),
                y: kontra.getRandomInt(-kontra.canvas.height, -16),
                animations: spriteSheet.animations,
                collidesWith(object) {
                    return this.x < object.x + object.width - 2 &&
                        this.x + this.width - 2 > object.x &&
                        this.y < object.y + object.height &&
                        this.y + this.height > object.y;
                },
                update(dt) {
                    this.advance(dt);
                    this.y++;
                    if (this.y > kontra.canvas.height) {
                        this.y = -this.height;
                        this.x = kontra.getRandomInt(0, kontra.canvas.width - 16);
                    }
                }
            });
            enemy.playAnimation('enemyWalk');
            enemies.push(enemy);
        }
    };

    heart = kontra.sprite({
        type: 'heart',
        x: kontra.canvas.width - 16,
        y: -1,
        animations: spriteSheet.animations
    });
    heart.playAnimation('heart');

    const getObj = function (x, y, type) {
        return {
            type: type,
            x: x,
            y: y,
            animations: spriteSheet.animations,
            d: false,
            update(dt) {
                this.advance(dt);
                if (this.d) {
                    this.y += 1;
                }
                this.d = !this.d
                if (this.y > kontra.canvas.height) {
                    this.y = -this.height;
                    this.x = kontra.getRandomInt(0, kontra.canvas.width - 16);
                }
            }
        }
    }
    for (let i = 0; i < kontra.canvas.height / 16; i++) {
        grasses.push(kontra.sprite(getObj(kontra.getRandomInt(0, kontra.canvas.width - 16), i * 16, 'grass')));
    }
    grasses.forEach(grass => {
        grass.playAnimation('grass');
    });

    createGold = function () {
        if (golds.length < 2) {
            var gold = kontra.sprite(getObj(
                kontra.getRandomInt(0, kontra.canvas.width - 16),
                kontra.getRandomInt(0, -kontra.canvas.height - 16),
                'gold'
            ));
            gold.playAnimation('gold');
            golds.push(gold);
        }
    };
}

game.init = function () {
    kontra.canvas.style.background = '#66b632ff';
    kontra.keys.bind('esc', function () {
        State.switch('menu');
    });
};
game.destroy = function () {
    kontra.keys.unbind('esc');
};
game.onDown = function (event) {
    controller.x = event.x - 7;
    controller.y = event.y - 7;
    controller.phase = 'down';
};
game.onUp = function (event) {
    controller.phase = 'up';
};

export default game;