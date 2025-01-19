// import p5 from "./p5.js"

export default async function MusicVAE() {
    const mvae = new music_vae.MusicVAE('https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_2bar_small')

    await mvae.initialize()
    console.log('initialized!')

    const melody1 = {
        notes: [
            { pitch: Tone.Frequency("A3").toMidi(), quantizedStartStep: 0, quantizedEndStep: 4 },
            { pitch: Tone.Frequency("D4").toMidi(), quantizedStartStep: 4, quantizedEndStep: 6 },
            { pitch: Tone.Frequency("E4").toMidi(), quantizedStartStep: 6, quantizedEndStep: 8 },
            { pitch: Tone.Frequency("F4").toMidi(), quantizedStartStep: 8, quantizedEndStep: 10 },
            { pitch: Tone.Frequency("D4").toMidi(), quantizedStartStep: 10, quantizedEndStep: 12 },
            { pitch: Tone.Frequency("E4").toMidi(), quantizedStartStep: 12, quantizedEndStep: 16 },
            { pitch: Tone.Frequency("C4").toMidi(), quantizedStartStep: 16, quantizedEndStep: 20 },
            { pitch: Tone.Frequency("D4").toMidi(), quantizedStartStep: 20, quantizedEndStep: 26 },
            { pitch: Tone.Frequency("A3").toMidi(), quantizedStartStep: 26, quantizedEndStep: 28 },
            { pitch: Tone.Frequency("A3").toMidi(), quantizedStartStep: 28, quantizedEndStep: 32 }
        ],
        quantizationInfo: {
            stepsPerQuarter: 4,  // You can adjust this value to change the resolution
        }
    }

    const melody2 = {
        notes: [
            { pitch: Tone.Frequency('C4').toMidi(), quantizedStartStep: 0, quantizedEndStep: 4 },
            { pitch: Tone.Frequency('E4').toMidi(), quantizedStartStep: 4, quantizedEndStep: 6 },
            { pitch: Tone.Frequency('G4').toMidi(), quantizedStartStep: 6, quantizedEndStep: 8 },
            { pitch: Tone.Frequency('A4').toMidi(), quantizedStartStep: 8, quantizedEndStep: 10 },
            { pitch: Tone.Frequency('G4').toMidi(), quantizedStartStep: 10, quantizedEndStep: 12 },
            { pitch: Tone.Frequency('F4').toMidi(), quantizedStartStep: 12, quantizedEndStep: 16 },
            { pitch: Tone.Frequency('E4').toMidi(), quantizedStartStep: 16, quantizedEndStep: 18 },
            { pitch: Tone.Frequency('C4').toMidi(), quantizedStartStep: 18, quantizedEndStep: 22 },
            { pitch: Tone.Frequency('D4').toMidi(), quantizedStartStep: 22, quantizedEndStep: 26 },
            { pitch: Tone.Frequency('C4').toMidi(), quantizedStartStep: 26, quantizedEndStep: 32 }
        ],
        quantizationInfo: {
            stepsPerQuarter: 4,  // You can adjust this value to change the resolution
        }
    }

    const interpolatedMelodies = await mvae.interpolate([melody1, melody2], 4)

    // new p5((sketch) => {
    //     let numInterpolations = interpolatedMelodies.length;
    //     let TILE_SIZE = 150;
    //     let WIDTH = TILE_SIZE * numInterpolations;
    //     let HEIGHT = 170;

    //     let START_COLOR;
    //     let END_COLOR;

    //     sketch.setup = () => {
    //         sketch.createCanvas(WIDTH, HEIGHT);
    //         START_COLOR = sketch.color(60, 180, 203); // Initialize start color
    //         END_COLOR = sketch.color(233, 72, 88); // Initialize end color
    //         sketch.noStroke();
    //     };

    //     sketch.draw = () => {
    //         sketch.background(38);
    //         for (let i = 0; i < numInterpolations; i++) {
    //             let x = i * TILE_SIZE;
    //             let y = HEIGHT - TILE_SIZE;
    //             let currColor = sketch.lerpColor(START_COLOR, END_COLOR, i / numInterpolations);

    //             // Use currColor with opacity
    //             sketch.fill(sketch.red(currColor), sketch.green(currColor), sketch.blue(currColor), 125);
    //             sketch.rect(x, y, TILE_SIZE, TILE_SIZE);

    //             sketch.fill(currColor);
    //             drawNotes(sketch, interpolatedMelodies[i].notes, x, y, TILE_SIZE, TILE_SIZE);
    //         }
    //     };

    //     function drawNotes(sketch, notes, x, y, width, height) {
    //         sketch.push();
    //         sketch.translate(x, y);
    //         let cellWidth = width / 32; // Steps per measure
    //         let cellHeight = height / 88; // Notes from MIDI standard

    //         notes.forEach(function(note) {
    //             let emptyNoteSpacer = 1;
    //             sketch.rect(emptyNoteSpacer + cellWidth * note.quantizedStartStep, 
    //                         height - cellHeight * (note.pitch - 21), 
    //                         cellWidth * (note.quantizedEndStep - note.quantizedStartStep) - emptyNoteSpacer, 
    //                         cellHeight);
    //         });
    //         sketch.pop();
    //     }
    // })

    new p5((sketch) => {
        let TILE_SIZE = 150;
        let WIDTH = TILE_SIZE * interpolatedMelodies.length;
        let HEIGHT = 170;
        let START_COLOR, END_COLOR;

        sketch.setup = () => {
            sketch.createCanvas(WIDTH, HEIGHT);
            START_COLOR = sketch.color(60, 180, 203);
            END_COLOR = sketch.color(233, 72, 88);
            sketch.noStroke();
        };

        sketch.draw = () => {
            sketch.background(38);
            for (let i = 0; i < interpolatedMelodies.length; i++) {
                let x = i * TILE_SIZE;
                let y = HEIGHT - TILE_SIZE;
                let currColor = sketch.lerpColor(START_COLOR, END_COLOR, i / interpolatedMelodies.length)
                // sketch.fill(red(currColor), green(currColor), blue(currColor), 125)
                sketch.rect(x, y, TILE_SIZE, TILE_SIZE);
                sketch.fill(currColor);
                if (interpolatedMelodies) {
                    drawNotes(sketch, interpolatedMelodies[i].notes, x, y, TILE_SIZE, TILE_SIZE)
                }
            }
            sketch.fill(255, 64)
        }

        function drawNotes(sketch, notes, x, y, width, height) {
            sketch.push();
            sketch.translate(x, y);
            let cellWidth = width / 32; // Steps per measure
            let cellHeight = height / 88; // Notes from MIDI standard

            notes.forEach(function (note) {
                let emptyNoteSpacer = 1;
                sketch.rect(emptyNoteSpacer + cellWidth * note.quantizedStartStep,
                    height - cellHeight * (note.pitch - 21),
                    cellWidth * (note.quantizedEndStep - note.quantizedStartStep) - emptyNoteSpacer,
                    cellHeight);
            });
            sketch.pop();
        }
    })

    function audioPlayback() {
        const samplesPath = 'https://storage.googleapis.com/melody-mixer/piano/'
        const samples = {};
        const NUM_NOTES = 88;
        const MIDI_START_NOTE = 21;

        for (let i = MIDI_START_NOTE; i < NUM_NOTES + MIDI_START_NOTE; i++) {
            samples[i] = samplesPath + i + '.mp3';
        }

        const players = new Tone.Players(samples, function onPlayersLoaded() {
            console.log("Tone.js players loaded");
        }).toMaster()

        function playNote(midiNote, numNoteHolds) {
            const duration = Tone.Transport.toSeconds('8n') * (numNoteHolds || 1);
            const player = players.get(midiNote);
            player.fadeOut = 0.05;
            player.fadeIn = 0.01;
            player.start(Tone.now(), 0, duration);
        }

        const sequenceIndex = -1;
        const stepIndex = -1;
    }
}