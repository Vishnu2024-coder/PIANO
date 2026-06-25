const octaveLabels = [
  { label: "Low", value: 3 },
  { label: "Medium", value: 4 },
  { label: "High", value: 5 }
];

const instruments = ["piano", "guitar", "organ", "synth"];

export default function Controls({
  octave,
  setOctave,
  volume,
  setVolume,
  sustain,
  setSustain,
  theme,
  setTheme,
  instrument,
  setInstrument,
  mode,
  setMode
}) {
  return (
    <section className="panel controls">
      <div className="control-group">
        <span className="control-label">Octave</span>
        <div className="segmented">
          {octaveLabels.map((item) => (
            <button
              className={octave === item.value ? "selected" : ""}
              key={item.value}
              onClick={() => setOctave(item.value)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <label className="control-group slider-control">
        <span className="control-label">Volume</span>
        <input
          max="1"
          min="0"
          onChange={(event) => setVolume(Number(event.target.value))}
          step="0.01"
          type="range"
          value={volume}
        />
      </label>

      <label className="control-group">
        <span className="control-label">Instrument</span>
        <select onChange={(event) => setInstrument(event.target.value)} value={instrument}>
          {instruments.map((item) => (
            <option key={item} value={item}>
              {item[0].toUpperCase() + item.slice(1)}
            </option>
          ))}
        </select>
      </label>

      <div className="control-group">
        <span className="control-label">Mode</span>
        <div className="segmented">
          {["freestyle", "practice", "chord"].map((item) => (
            <button
              className={mode === item ? "selected" : ""}
              key={item}
              onClick={() => setMode(item)}
              type="button"
            >
              {item[0].toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="toggle-row">
        <label className="toggle">
          <input checked={sustain} onChange={(event) => setSustain(event.target.checked)} type="checkbox" />
          <span>Sustain</span>
        </label>

        <label className="toggle">
          <input
            checked={theme === "dark"}
            onChange={(event) => setTheme(event.target.checked ? "dark" : "light")}
            type="checkbox"
          />
          <span>Dark Mode</span>
        </label>
      </div>
    </section>
  );
}
