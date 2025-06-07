class MIDIHandler {
  constructor() {
    this.midiAccess = null;
    this.freezeMode = 3;
    this.frozenNotes = new Set();
    this.activeNotes = new Map();
    this.isArrowDownHeld = false;
    this.FOOTSWITCH_NOTE = 66;
    this.CONTROL_CHANGE = 176; // Control Change messages for channels 1-6
    this.channelToString = {
      0: 0, // Channel 1 = String 1 (high E)
      1: 1, // Channel 2 = String 2 (B)
      2: 2, // Channel 3 = String 3 (G)
      3: 3, // Channel 4 = String 4 (D)
      4: 4, // Channel 5 = String 5 (A)
      5: 5, // Channel 6 = String 6 (low E)
    };
    this.init();
  }

  async init() {
    try {
      this.midiAccess = await navigator.requestMIDIAccess({ sysex: true });
      this.setupMIDIListeners();
    } catch (error) {
      console.error("MIDI access denied:", error);
    }
    this.setupFreezeButton();
  }

  setupFreezeButton() {
    document.addEventListener("keydown", (event) => {
      if (event.code === "ArrowDown") {
        event.preventDefault();
          this.isArrowDownHeld = true;
      }
    });

    document.addEventListener("keyup", (event) => {
      if (event.code === "ArrowDown") {
        this.isArrowDownHeld = false;
      }
    });
  }

  switchFreezeMode() {
    this.freezeMode = (this.freezeMode % 3) + 1;
    if (this.freezeMode === 3) {
      this.frozenNotes.clear();
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

    const channel = statusByte & 0x0f; // Get channel (0-15)
    const command = statusByte & 0xf0; // Get command type

    if (channel > 5) return;

    const noteOn = command === 0x90 && velocity > 0;
    const noteOff = command === 0x80 || (command === 0x90 && velocity === 0);

    const stringNumber = this.channelToString[channel];

    const settingsMode = localStorage.getItem("settings_mode");
    if (this.isArrowDownHeld && noteOn) {
      if (settingsMode === "3") this.toggleNoteSelection(note, stringNumber);
      else this.toggleNoteColor(note, stringNumber);
      return;
    }

    if( !this.isArrowDownHeld && noteOn && settingsMode === "3") 
      return

    // console.log(note, channel, command, velocity);

    /*
    // Check if it's a footswitch message
    if (command === this.CONTROL_CHANGE && note === this.FOOTSWITCH_NOTE) {
      this.isFreezeActive = velocity > 0;
      this.onFootswitchRelease();
      return;
    }
    */

    if (noteOn) {
      if (this.freezeMode === 1) {
        /*
      
        for (const frozenNote of this.frozenNotes) {
          const [string, note] = frozenNote.split("-").map(Number);
          if (string === stringNumber) {
            this.frozenNotes.delete(frozenNote);
            const fret = this.getFretFromMidiNote(note, string);
            this.fadeOutNote(string, fret);
            this.activeNotes.delete(`${stringNumber}-${fret}`);
          }
        }
        // Add and handle new note
       
         */
        const noteId = `${stringNumber}-${note}`;
        this.frozenNotes.add(noteId);
      }
      this.handleNoteOn(note, stringNumber);
    } else if (noteOff) {
      if (
        !this.frozenNotes.has(`${stringNumber}-${note}`) &&
        !this.isArrowDownHeld
      ) {
        this.handleNoteOff(note, stringNumber);
      }
    }
  }

  handleNoteOn(midiNote, stringNumber) {
    const fret = this.getFretFromMidiNote(midiNote, stringNumber);
    if (fret >= 0 && fret <= 24) {
      this.highlightNote(stringNumber, fret);
      this.activeNotes.set(`${stringNumber}-${fret}`, true);
    }
  }

  toggleNoteSelection(midiNote, string) {
    const table = document.getElementById("miTabla");
    const fret = this.getFretFromMidiNote(midiNote, string);
    if (fret >= 0 && fret <= 24) {
      const circulo =
        table.rows[string].cells[fret]?.querySelector("circle") || null;
      if (circulo) {
        const texto = table.rows[string].cells[fret].querySelector("text");
        switchNoteSelectionState(texto, circulo);
      }
    }
  }

  toggleNoteColor(midiNote, string) {
    const table = document.getElementById("miTabla");
    const fret = this.getFretFromMidiNote(midiNote, string);
    if (fret >= 0 && fret <= 24) {
      const circulo =
        table.rows[string].cells[fret]?.querySelector("circle") || null;
      if (circulo) {
        const texto = table.rows[string].cells[fret].querySelector("text");
        toggleNoteColorState(texto,circulo);
      }
    }
  }

  handleNoteOff(midiNote, stringNumber) {
    const fret = this.getFretFromMidiNote(midiNote, stringNumber);
    if (fret >= 0 && fret <= 24) {
      this.fadeOutNote(stringNumber, fret);
      this.activeNotes.delete(`${stringNumber}-${fret}`);
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
    const mode = localStorage.getItem("settings_mode");
    const table = document.getElementById("miTabla");
    const noteElement =
      table.rows[string].cells[fret]?.querySelector("circle") || null;

    if (noteElement) {
      const actualOpacity = noteElement.style.opacity;
      const actualFill = noteElement.style.fill;
      const textElement = table.rows[string].cells[fret].querySelector("text");
      const { diatonic, nonDiatonic } = keySignatures[selectNota.value];
      let noteText = textElement.textContent;

      const noteType = localStorage.getItem("noteType");
      if (["latin", "degrees"].includes(noteType)) {
        const noteIndex =
          noteStyles[selectNota.value][noteType].indexOf(noteText);
        noteText = noteStyles[selectNota.value]["names"][noteIndex];
      }

      const isDiatonic = diatonic.includes(noteText);
      const index = isDiatonic
        ? diatonic.indexOf(noteText)
        : nonDiatonic.indexOf(noteText);

      noteElement.style.transition = "fill 0s";
      let fill =
        mode === "1"
          ? "rgb(230, 231, 232)"
          : isDiatonic
          ? diatonicColors[index]
          : nonDiatonicColors[index];
      noteElement.style.fill = fill;

      textElement.classList.add("playmode");
      noteElement.style.opacity = actualOpacity == "1" ? "1" : "0.7";
      noteElement.setAttribute("actualOpacity", actualOpacity);
      noteElement.setAttribute("prevFill", actualFill);
    }
  }

  fadeOutNote(string, fret) {
    const table = document.getElementById("miTabla");
    const noteElement =
      table.rows[string].cells[fret]?.querySelector("circle") || null;

    if (noteElement) {
      const actualOpacity = noteElement.getAttribute("actualOpacity");
      const actualFill = noteElement.getAttribute("prevFill");
      const textElement = table.rows[string].cells[fret].querySelector("text");
      const { diatonic, nonDiatonic } = keySignatures[selectNota.value];
      const isDiatonic = diatonic.includes(textElement.textContent);

      console.log(this.isArrowDownHeld);

      if (!this.isArrowDownHeld) {
        noteElement.style.transition = "fill 1s";
        noteElement.style.fill = actualFill;
        noteElement.style.opacity = actualOpacity;
        if (noteElement.getAttribute("playmode") === "false") {
          textElement.classList.remove("playmode");
        }
      }
    }
  }

  getFretFromMidiNote(midiNote, stringNumber) {
    // Standard tuning MIDI notes for open strings
    const standardTuning = [64, 59, 55, 50, 45, 40]; // E4, B3, G3, D3, A2, E2
    const openStringNote = standardTuning[stringNumber];
    return midiNote - openStringNote;
  }

  onFootswitchRelease() {
    if (!this.isFreezeActive) {
      this.clearFrozenNotes();
    }
  }

  clearFrozenNotes() {
    for (const frozenNote of this.frozenNotes) {
      const [string, note] = frozenNote.split("-").map(Number);
      const fret = this.getFretFromMidiNote(note, string);
      this.fadeOutNote(string, fret);
    }
    this.frozenNotes.clear();
  }
}
