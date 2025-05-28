class MIDIHandler {
    constructor() {
        this.midiAccess = null;
        this.activeNotes = new Map(); // Store active notes and their timeout IDs
        this.init();
    }

    async init() {
        try {
            this.midiAccess = await navigator.requestMIDIAccess();
            this.setupMIDIListeners();
        } catch (error) {
            console.error("MIDI access denied:", error);
        }
    }

    setupMIDIListeners() {
        for (const input of this.midiAccess.inputs.values()) {
            input.onmidimessage = this.handleMIDIMessage.bind(this);
        }

        this.midiAccess.onstatechange = (event) => {
            console.log(`MIDI port ${event.port.name} ${event.port.state}`);
        };
    }

    handleMIDIMessage(message) {
       // console.log(message)
        const [status, note, velocity] = message.data;
        const noteOn = status === 144 && velocity > 0;
        const noteOff = status === 128 || (status === 144 && velocity === 0);

        if (noteOn) {
            this.handleNoteOn(note);
        } else if (noteOff) {
            this.handleNoteOff(note);
        }
    }

    handleNoteOn(midiNote) {
        const fretboardPosition = this.getMIDIFretboardPosition(midiNote);
        if (fretboardPosition) {
            const { string, fret } = fretboardPosition;
            this.highlightNote(string, fret);
            
            // Clear any existing timeout for this note
            if (this.activeNotes.has(midiNote)) {
                clearTimeout(this.activeNotes.get(midiNote));
            }
        }
    }

    handleNoteOff(midiNote) {
        const fretboardPosition = this.getMIDIFretboardPosition(midiNote);
        if (fretboardPosition) {
            const { string, fret } = fretboardPosition;
            
            // Add fade-out animation
            const timeoutId = setTimeout(() => {
                this.fadeOutNote(string, fret);
                this.activeNotes.delete(midiNote);
            }, 1000);

            this.activeNotes.set(midiNote, timeoutId);
        }
    }

    getMIDIFretboardPosition(midiNote) {
        // Convert MIDI note to string and fret position
        const standardTuning = [64, 59, 55, 50, 45, 40]; // E4, B3, G3, D3, A2, E2
        
        for (let string = 0; string < standardTuning.length; string++) {
            const openNote = standardTuning[string];
            const fret = midiNote - openNote;
            
            if (fret >= 0 && fret <= 24) {
                return { string, fret };
            }
        }
        return null;
    }

    highlightNote(string, fret) {
        const table = document.getElementById('miTabla');
        const noteElement = table.rows[string].cells[fret].querySelector('circle');
        const textElement = table.rows[string].cells[fret].querySelector('text');

        if (noteElement) {
            const { diatonic } = keySignatures[selectNota.value];
            const noteText = textElement.textContent;
            const isDiatonic = diatonic.includes(noteText);
            const index = isDiatonic ? diatonic.indexOf(noteText) : 0;

            noteElement.style.fill = isDiatonic ? diatonicColors[index] : nonDiatonicColors[index];
            noteElement.style.opacity = isDiatonic ? "1" : "0.7";
            textElement.classList.add("playmode");
        }
    }

    fadeOutNote(string, fret) {
        const table = document.getElementById('miTabla');
        const noteElement = table.rows[string].cells[fret].querySelector('circle');
        const textElement = table.rows[string].cells[fret].querySelector('text');

        if (noteElement) {
            noteElement.style.transition = "fill 1s";
            noteElement.style.fill = "#FFF";
            textElement.classList.remove("playmode");
            
            const { diatonic } = keySignatures[selectNota.value];
            const noteText = textElement.textContent;
            const isDiatonic = diatonic.includes(noteText);
            
            noteElement.style.opacity = isDiatonic ? "1" : "0.3";
        }
    }
}