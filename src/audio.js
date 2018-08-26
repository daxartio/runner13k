import TinyMusic from 'tinymusic';

/*
'w' is a whole note
'h' is a half note
'q' is a quarter note
'e' is an eighth note
's' is a sixteenth note
'es' is a dotted eighth note (eighth plus sixteenth). This works for any combination of the letters above.
'0.0125' is a 32nd note, but any numeric value will work here. So '2' would be a half note, '0.5' would be an eighth note, etc.
*/

var ac = typeof AudioContext !== 'undefined' ? new AudioContext : new webkitAudioContext,
    when = ac.currentTime,
    tempo = 132,
    ttSequence,
    enemySequence,
    goldSequence,
    gameoverSequence,
    tt = [        
        '-   e',
        'Bb3 e',
        'A3  e',
        '- n',
        'G3  e',
        'A3  e',
        'F3  e',
        'A3  e',
    ],
    enemy = [
        'A3  s',
    ],
    gameover = [
        'E3  e',
        'F3  e',
        'D3  q',
    ],
    gold = [
        'A3  q',
    ];

ttSequence = new TinyMusic.Sequence(ac, tempo, tt);
enemySequence = new TinyMusic.Sequence(ac, tempo, enemy);
goldSequence = new TinyMusic.Sequence(ac, tempo, gold);
gameoverSequence = new TinyMusic.Sequence(ac, tempo, gameover);

ttSequence.loop = false;
enemySequence.loop = false;
goldSequence.loop = false;
gameoverSequence.loop = false;

ttSequence.staccato = 0.55;
enemySequence.staccato = 0.55;
goldSequence.staccato = 0.55;
gameoverSequence.staccato = 0.55;

ttSequence.gain.gain.value = 1.0 / 2;
enemySequence.gain.gain.value = 1.0 / 2;
goldSequence.gain.gain.value = 1.0 / 2;
gameoverSequence.gain.gain.value = 1.0 / 2;

ttSequence.mid.frequency.value = 600;
ttSequence.mid.gain.value = 6;
enemySequence.mid.frequency.value = 600;
enemySequence.mid.gain.value = 6;
goldSequence.mid.frequency.value = 600;
goldSequence.mid.gain.value = 6;
gameoverSequence.mid.frequency.value = 600;
gameoverSequence.mid.gain.value = 6;

function ttPlay() {
    when = ac.currentTime;
    ttSequence.play(when);
}

function ttStop() {
    ttSequence.stop();
}

function enemyKillPlay() {
    when = ac.currentTime;
    enemySequence.play(when);
}

function enemyKillStop() {
    enemySequence.stop();
}

function goldPlay() {
    when = ac.currentTime;
    goldSequence.play(when);
}

function goldStop() {
    goldSequence.stop();
}

function gameoverPlay() {
    when = ac.currentTime;
    gameoverSequence.play(when);
}

function gameoverStop() {
    gameoverSequence.stop();
}

export default {
    ttPlay,
    ttStop,
    enemyKillPlay,
    enemyKillStop,
    goldPlay,
    goldStop,
    gameoverPlay,
    gameoverStop,
};