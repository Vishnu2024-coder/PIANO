const KEYBOARD_HINTS = {
  C: "A",
  "C#": "W",
  D: "S",
  "D#": "E",
  E: "D",
  F: "F",
  "F#": "T",
  G: "G",
  "G#": "Y",
  A: "H",
  "A#": "U",
  B: "J"
};

const whiteKeys = ["C", "D", "E", "F", "G", "A", "B"];
const blackKeys = [
  { note: "C#", left: 13 },
  { note: "D#", left: 27 },
  { note: "F#", left: 56 },
  { note: "G#", left: 70 },
  { note: "A#", left: 84 }
];

export default function Piano({ activeNotes, nextPracticeNote, onPlayNote }) {
  return (
    <section className="piano-wrap" aria-label="Interactive piano keyboard">
      <div className="piano">
        <div className="white-keys">
          {whiteKeys.map((note) => {
            const isActive = activeNotes.includes(note);
            const isNext = nextPracticeNote === note;

            return (
              <button
                className={`key white ${isActive ? "active" : ""} ${isNext ? "next-key" : ""}`}
                key={note}
                onMouseDown={() => onPlayNote(note)}
                onTouchStart={(event) => {
                  event.preventDefault();
                  onPlayNote(note);
                }}
                type="button"
              >
                <span className="key-note">{note}</span>
                <span className="key-hint">{KEYBOARD_HINTS[note]}</span>
              </button>
            );
          })}
        </div>

        <div className="black-keys" aria-label="Sharp piano keys">
          {blackKeys.map(({ note, left }) => {
            const isActive = activeNotes.includes(note);
            const isNext = nextPracticeNote === note;

            return (
              <button
                className={`key black ${isActive ? "active" : ""} ${isNext ? "next-key" : ""}`}
                key={note}
                onMouseDown={() => onPlayNote(note)}
                onTouchStart={(event) => {
                  event.preventDefault();
                  onPlayNote(note);
                }}
                style={{ left: `${left}%` }}
                type="button"
              >
                <span className="key-note">{note}</span>
                <span className="key-hint">{KEYBOARD_HINTS[note]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
