import State from '../state';
import audio from '../audio';

let player;
let damage;
let enemies = [];
let grasses = [];
let golds = [];

let lastEnemyTime = 0;
let createEnemy;
let createGold;

let deviceorientation = { x: 0, y: 0 };

const game = kontra.gameLoop({
    // clearCanvas: false,
    fps: 45,
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
        if (deviceorientation.x !== 0 || deviceorientation.y !== 0) {
            if (deviceorientation.x !== 0) {
                player.y += deviceorientation.x / Math.abs(deviceorientation.x);
            }
            if (deviceorientation.y !== 0) {
                player.x += deviceorientation.y / Math.abs(deviceorientation.y);
            }
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
        let scoreText = Math.floor(player.score);
        if (+new Date() - player.lastScoreTime < 1000) {
            scoreText += ' ' + (player.lastScore > 0 ? '+' : '') + Math.floor(player.lastScore);
        }
        kontra.drawText(scoreText, 1, { x: 1, y: 1 }, '#fff');

        var h = Array(player.health + 1).join('|');
        kontra.drawText(h, 1, { x: kontra.width - (player.health * 3 + player.health), y: 1 }, 'red');
        if (+new Date() - player.lastDamageTime < 500) {
            damage.render();
        }
    }
});

game.load = function () {
    State.store.score = State.store.score || 0;
    State.store.bestScore = State.store.bestScore || 0;
    const spriteSheet = kontra.spriteSheet({
        image: kontra.getImage('./assets/runner13k.png'),
        frameWidth: 16,
        frameHeight: 16,

        animations: {
            player: {
                frames: [0, 1, 2, 2, 1, 0],
                frameRate: 8,
            },
            enemyWalk: {
                frames: [3, 4],
                frameRate: 6,
            },
            enemyDead: {
                frames: 5,
                frameRate: 1,
                loop: false
            },
            gold: {
                frames: [7, 8],
                frameRate: 2
            },
            grass: {
                frames: 6,
                frameRate: 1,
                loop: false
            },
        }
    });
    player = kontra.sprite({
        type: 'player',
        x: 0,
        y: kontra.height - 16,
        animations: spriteSheet.animations,
        health: 3,
        score: 0,
        lastDamageTime: 0,
        lastScore: 0,
        lastScoreTime: 0,
        addScore(score) {
            this.score += score;
            if (+new Date() - this.lastScoreTime < 1000) {
                this.lastScore += score;
            } else {
                this.lastScore = score;
            }
            this.lastScoreTime = +new Date();
        },
        update(dt) {
            this.advance(dt);

            if (this.x + this.width > kontra.width) {
                this.x = kontra.width - this.width;
            }
            if (this.x < 0) {
                this.x = 0;
            }
            if (this.y + this.height > kontra.height) {
                this.y = kontra.height - this.height;
            }
            if (this.y < 0) {
                this.y = 0;
            }

            if (kontra.keys.pressed('left')) {
                this.x -= 1;
            }
            else if (kontra.keys.pressed('right')) {
                this.x += 1;
            }
            if (kontra.keys.pressed('up')) {
                this.y -= 1;
            }
            else if (kontra.keys.pressed('down')) {
                this.y += 1;
            }
            golds.forEach((gold, index) => {
                if (this.collidesWith(gold)) {
                    this.addScore(50);
                    golds.splice(index, 1);
                }
            })
            if (this.health <= 0) {
                State.switch('gameover');
                this.health = 3;
                this.score = 0;
                enemies = [];
            }
        }
    });
    player.playAnimation('player')

    damage = kontra.sprite({
        x: 0,
        y: kontra.height - 5,
        width: kontra.width,
        height: 5,
        color: '#DC143C'
    });

    createEnemy = function () {
        if (enemies.length < 5 && +new Date() - lastEnemyTime > 1000) {
            lastEnemyTime = +new Date();
            var enemy = kontra.sprite({
                type: 'enemy',
                x: kontra.getRandomInt(0, kontra.width - 16),
                y: kontra.getRandomInt(-kontra.height, -16),
                animations: spriteSheet.animations,
                isDead: false,
                speed: 2,
                update(dt) {
                    this.advance(dt);
                    this.y += this.speed;
                    if (this.y > kontra.height) {
                        if (!this.isDead) {
                            player.health--;
                            player.lastDamageTime = +new Date();
                        }
                        enemies.forEach((enemy, index) => {
                            if (enemy == this) {
                                enemies.splice(index, 1);
                            }
                        })
                    }
                    if (!this.isDead) {
                        if (this.collidesWith(player)) {
                            this.isDead = true;
                            this.speed = 1;
                            this.playAnimation('enemyDead');
                        }
                    }
                }
            });
            enemy.playAnimation('enemyWalk');
            enemies.push(enemy);
        }
    };

    const getObj = function (x, y, type) {
        return {
            type: type,
            x: x,
            y: y,
            animations: spriteSheet.animations,
            update(dt) {
                this.advance(dt);
                this.y += 1;
                if (this.y > kontra.height) {
                    if (this.type === 'gold') {
                        player.addScore(-100);
                    }
                    this.y = -this.height;
                    this.x = kontra.getRandomInt(0, kontra.width - 16);
                }
            }
        }
    }
    for (let i = 0; i < kontra.height / 16; i++) {
        grasses.push(kontra.sprite(getObj(kontra.getRandomInt(0, kontra.width - 16), i * 16, 'grass')));
    }
    grasses.forEach(grass => {
        grass.playAnimation('grass');
    });

    createGold = function () {
        if (golds.length < 2) {
            var gold = kontra.sprite(getObj(
                kontra.getRandomInt(0, kontra.width - 16),
                kontra.getRandomInt(0, -kontra.height - 16),
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

    audio.play();
};
game.destroy = function () {
    State.store.score = player.score;
    State.store.bestScore = player.score > State.store.bestScore ? player.score : State.store.bestScore;
    kontra.keys.unbind('esc');
    audio.stop();
};
game.onUp = function () {
    State.switch('menu');
};
game.deviceorientation = function (e) {
    deviceorientation = e;
};

export default game;