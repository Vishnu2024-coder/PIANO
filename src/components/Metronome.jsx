export default function Metronome({ bpm, setBpm, isMetronomeOn, setIsMetronomeOn }) {
  return (
    <section className="panel metronome">
      <div className="section-heading">
        <span className="eyebrow">Metronome</span>
        <strong>{bpm} BPM</strong>
      </div>
      <label className="slider-control">
        <span className="control-label">Tempo</span>
        <input min="60" max="180" step="1" type="range" value={bpm} onChange={(event) => setBpm(Number(event.target.value))} />
      </label>
      <button className={isMetronomeOn ? "selected" : ""} onClick={() => setIsMetronomeOn((value) => !value)} type="button">
        {isMetronomeOn ? "Stop Click" : "Start Click"}
      </button>
    </section>
  );
}
