import State from '../state';
import audio from '../audio';

let player;
let swordRoll;
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
        if (player.swordRoll) {
            swordRoll.update(dt);
        }

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
        const objects = [player, ...enemies];
        if (player.swordRoll) {
            objects.push(swordRoll);
        }
        objects.sort((a, b) => {
            return a.y - b.y;
        });
        objects.forEach(obj => {
            obj.render();
        });
        let scoreText = Math.floor(player.score);
        if (Date.now() - player.lastScoreTime < 1000) {
            scoreText += ' ' + (player.lastScore > 0 ? '+' : '') + Math.floor(player.lastScore);
        }
        kontra.drawText(scoreText, 1, { x: 1, y: 1 }, '#fff');

        const h = Array(player.health + 1).join('|');
        kontra.drawText(h, 1, { x: kontra.width - (player.health * 3 + player.health), y: 1 }, 'red');
        if (Date.now() - player.lastDamageTime < 500) {
            damage.render();
        }

        let time = player.swordRollExpiration + player.swordRollTime - Date.now();
        if (time > 0) {
            kontra.drawText(Math.round(time / 1000), 1, { x: kontra.width / 2, y: 1 }, '#00719dff');
        } else {
            kontra.drawText('$', 1, { x: kontra.width / 2, y: 1 }, '#6fddd5ff'); // #00abc4ff #00719dff
            kontra.drawText('*', 1, { x: kontra.width / 2, y: 1 }, '#00abc4ff'); // #00abc4ff #00719dff
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
            playerRotation: {
                frames: [0, 1, 2, 2, 3, 4, 0],
                frameRate: 8,
            },
            swordRoll: {
                frames: [5, 6, 7, 8],
                frameRate: 4,
            },
            enemyWalk: {
                frames: [9, 10],
                frameRate: 6,
            },
            enemyDead: {
                frames: 11,
                frameRate: 1,
                loop: false
            },
            gold: {
                frames: [13, 14],
                frameRate: 2
            },
            grass: {
                frames: 12,
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
        swordRoll: false,
        swordRollTime: 5000,
        swordRollExpiration: 0,
        health: 3,
        score: 0,
        lastDamageTime: 0,
        lastScore: 0,
        lastScoreTime: 0,
        addScore(score) {
            this.score += score;
            if (Date.now() - this.lastScoreTime < 1000) {
                this.lastScore += score;
            } else {
                this.lastScore = score;
            }
            this.lastScoreTime = Date.now();
        },
        skill() {
            if (!this.swordRoll && Date.now() > this.swordRollExpiration + this.swordRollTime) {
                this.swordRoll = true;
                swordRoll.radius = 0;
                this.playAnimation('playerRotation');
                this.swordRollExpiration = Date.now() + this.swordRollTime;
            }
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

            if (this.swordRoll && Date.now() > this.swordRollExpiration) {
                this.swordRoll = false;
                this.playAnimation('player');
            }

            if (kontra.keys.pressed('space')) {
                this.skill();
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
                    audio.goldStop();
                    audio.goldPlay();
                    this.addScore(50);
                    golds.splice(index, 1);
                }
            })
            if (this.health <= 0) {
                audio.gameoverPlay();
                State.switch('gameover');
                this.health = 3;
                this.score = 0;
                this.swordRollExpiration = 0;
                this.swordRoll = false;
                enemies = [];
            }
        }
    });
    player.playAnimation('player')

    swordRoll = kontra.sprite({
        type: 'swordRoll',
        x: 0,
        y: 0,
        animations: spriteSheet.animations,
        radius: 0,
        maxRadius: 26,
        angle: 0,
        speed: 4,
        update(dt) {
            this.advance(dt);
            if (this.radius < this.maxRadius) {
                this.radius++;
            }
            this.angle -= dt;
            this.x = Math.cos(this.angle * this.speed) * this.radius + player.x;
            this.y = Math.sin(this.angle * this.speed) * this.radius + player.y;
        }
    });

    swordRoll.playAnimation('swordRoll')

    damage = kontra.sprite({
        x: 0,
        y: kontra.height - 5,
        width: kontra.width,
        height: 5,
        color: '#DC143C'
    });

    createEnemy = function () {
        if (enemies.length < 5 && Date.now() - lastEnemyTime > 1000) {
            lastEnemyTime = Date.now();
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
                            player.lastDamageTime = Date.now();
                        }
                        enemies.forEach((enemy, index) => {
                            if (enemy == this) {
                                enemies.splice(index, 1);
                            }
                        })
                    }
                    if (!this.isDead) {
                        if (this.collidesWith(player) || (this.collidesWith(swordRoll) && player.swordRoll)) {
                            this.isDead = true;
                            this.speed = 1;
                            this.playAnimation('enemyDead');
                            audio.enemyKillStop();
                            audio.enemyKillPlay();
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
};
game.destroy = function () {
    State.store.score = player.score;
    State.store.bestScore = player.score > State.store.bestScore ? player.score : State.store.bestScore;
    kontra.keys.unbind('esc');
};
game.onUp = function () {
    player.skill();
};
game.deviceorientation = function (e) {
    deviceorientation = e;
};

export default game;