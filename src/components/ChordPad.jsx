const chords = {
  "C Major": ["C", "E", "G"],
  "D Minor": ["D", "F", "A"],
  "G Major": ["G", "B", "D"]
};

export default function ChordPad({ onPlayChord }) {
  return (
    <section className="panel chord-pad">
      <div className="section-heading">
        <span className="eyebrow">Chord mode</span>
        <strong>One tap harmony</strong>
      </div>
      <div className="pad-grid">
        {Object.entries(chords).map(([name, notes]) => (
          <button key={name} onClick={() => onPlayChord(notes, name)} type="button">
            <b>{name}</b>
            <span>{notes.join(" + ")}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
