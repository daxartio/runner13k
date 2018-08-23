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
    sequence1,
    sequence2,
    sequence3,
    lead = [
        '-   e',
        'Bb3 e',
        'A3  e',
        '- n',
        'G3  e',
        'A3  e',
        'F3  e',
        'A3  e',

        'D3  e',
        'F3  e',
        'G3  e',
        '-  e',
        'E3  e',
        'F3  e',
        'D3  q',
    ],
    harmony = [

        'G3  e',
        'A3  e',
        'Bb3 e',
        'A3  e',
        'G3  e',
        'A3  e',
        'F3  q',

        'G3  e',
        'A3  e',
        'Bb3 e',
        'A3  e',
        'G3  s',
        'A3  s',
        'G3  e',
        'F3  q'
    ],
    bass = [
        'D3  q',
        '-   h',
        'D3  q',

        'F2  h',
        'A2  h'
    ];

sequence1 = new TinyMusic.Sequence(ac, tempo, lead);
sequence2 = new TinyMusic.Sequence(ac, tempo, harmony);
sequence3 = new TinyMusic.Sequence(ac, tempo, bass);

sequence1.staccato = 0.55;
sequence2.staccato = 0.55;
sequence3.staccato = 0.05;
sequence3.smoothing = 0.4;

sequence1.gain.gain.value = 1.0 / 2;
sequence2.gain.gain.value = 0.8 / 2;
sequence3.gain.gain.value = 0.65 / 2;

sequence1.mid.frequency.value = 600;
sequence1.mid.gain.value = 6;
sequence2.mid.frequency.value = 1200;
sequence3.mid.gain.value = 3;
sequence3.bass.gain.value = 6;
sequence3.bass.frequency.value = 80;
sequence3.mid.gain.value = -6;
sequence3.mid.frequency.value = 500;
sequence3.treble.gain.value = -2;
sequence3.treble.frequency.value = 1400;

function play() {
    when = ac.currentTime;
    sequence1.play(when);
    sequence2.play(when + (60 / tempo) * 16);
    sequence3.play(when);
}

function stop() {
    sequence1.stop();
    sequence2.stop();
    sequence3.stop();
}

export default {
    play,
    stop
};