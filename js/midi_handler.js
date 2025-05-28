class MIDIHandler {
     constructor() {
        this.midiAccess = null;
       
        this.activeNotes = new Map();
       
        this.channelToString = {
            0: 0, // Channel 1 = String 1 (high E)
            1: 1, // Channel 2 = String 2 (B)
            2: 2, // Channel 3 = String 3 (G)
            3: 3, // Channel 4 = String 4 (D)
            4: 4, // Channel 5 = String 5 (A)
            5: 5  // Channel 6 = String 6 (low E)
        };
        this.init();
    }

    async init() {
        try {
            this.midiAccess = await navigator.requestMIDIAccess({sysex:true});
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
       
        const [statusByte, note, velocity] = message.data;
      
        
        const channel = statusByte & 0x0F; // Get channel (0-15)
        const command = statusByte & 0xF0; // Get command type

        if (channel > 5) return;

        const noteOn = command === 0x90 && velocity > 0;
        const noteOff = command === 0x80 || (command === 0x90 && velocity === 0);

        const stringNumber = this.channelToString[channel];

        if (noteOn) {
            this.handleNoteOn(note,stringNumber);
        } else if (noteOff) {
            this.handleNoteOff(note,stringNumber);
        }
    }

    
    handleNoteOn(midiNote, stringNumber) {
        const fret = this.getFretFromMidiNote(midiNote, stringNumber);
        if (fret >= 0 && fret <= 24) {
            this.highlightNote(stringNumber, fret);
            
            const noteId = `${stringNumber}-${fret}`;
            if (this.activeNotes.has(noteId)) {
                clearTimeout(this.activeNotes.get(noteId));
            }
        }
    }


    handleNoteOff(midiNote, stringNumber) {
        const fret = this.getFretFromMidiNote(midiNote, stringNumber);
        if (fret >= 0 && fret <= 24) {
            const noteId = `${stringNumber}-${fret}`;

            const timeoutId = setTimeout(() => {
                this.fadeOutNote(stringNumber, fret);
                this.activeNotes.delete(noteId);
            }, 1000);

            this.activeNotes.set(noteId, timeoutId);
        }
    }

    getMIDIFretboardPosition(midiNote, stringNumber) {
        const fret = this.getFretFromMidiNote(midiNote, stringNumber);
        if (fret >= 0 && fret <= 24) {
            return { string: stringNumber, fret };
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

            noteElement.style.transition = "fill 0s";
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
            noteElement.style.transition = "fill 0.5s";
            noteElement.style.fill = "#FFF";
            textElement.classList.remove("playmode");
            
            const { diatonic } = keySignatures[selectNota.value];
            const noteText = textElement.textContent;
            const isDiatonic = diatonic.includes(noteText);
            
            noteElement.style.opacity = isDiatonic ? "1" : "0.3";
        }
    }

     getFretFromMidiNote(midiNote, stringNumber) {
        // Standard tuning MIDI notes for open strings
        const standardTuning = [64, 59, 55, 50, 45, 40]; // E4, B3, G3, D3, A2, E2
        const openStringNote = standardTuning[stringNumber];
        return midiNote - openStringNote;
    }
}