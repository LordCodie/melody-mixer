export default function p5Canavas() {
    let interpolatedNoteSequences
    const numInterpolations = 5

    const sequenceIndex = -1;
    const stepIndex = -1;
    const NUM_STEPS = 32;
    const NUM_NOTES = 88;
    const MIDI_START_NOTE = 21;

    //p5.js setup
    const TILE_SIZE = 150;
    const WIDTH = TILE_SIZE * numInterpolations;
    const HEIGHT = 170;
    let START_COLOR;
    let END_COLOR;

    function setup() {
        createCanvas(WIDTH, HEIGHT)
        START_COLOR = color(60, 180, 203)
        END_COLOR = color(233, 72, 88)
        noStroke()
    }

    function draw() {
        //Draw Tiles + Notes
        background(38);
        for(let i = 0; i < numInterpolations; i++){
            let x = i * TILE_SIZE;
            let y = HEIGHT - TILE_SIZE;
            let currColor = lerpColor(START_COLOR, END_COLOR, i / numInterpolations);
            //use currColor but at 50% opacity
            fill(red(currColor), green(currColor), blue(currColor), 125);
            rect(x, y, TILE_SIZE, TILE_SIZE);
            fill(currColor);
            if(interpolatedNoteSequences){
                drawNotes(interpolatedNoteSequences[i].notes, x, y, TILE_SIZE, TILE_SIZE);
            }
        }
        fill(255, 64);
     }

     function drawNotes(notes, x, y, width, height) {
        push();
        translate(x, y);
        let cellWidth = width / NUM_STEPS;
        let cellHeight = height / NUM_NOTES;
        notes.forEach(function(note) {
            let emptyNoteSpacer = 1;
            rect(emptyNoteSpacer + cellWidth * note.quantizedStartStep, height - cellHeight * (note.pitch - MIDI_START_NOTE),
                cellWidth * (note.quantizedEndStep - note.quantizedStartStep) - emptyNoteSpacer, cellHeight);
        });
        pop();
    }

}


