export default function Recorder({
  isRecording,
  recording,
  savedRecordings,
  onStart,
  onStop,
  onReplay,
  onClear,
  onReplaySaved,
  speed,
  setSpeed
}) {
  return (
    <section className="panel recorder">
      <div className="section-heading">
        <span className="eyebrow">Recorder</span>
        <strong>{recording.length} notes captured</strong>
      </div>

      <div className="button-row">
        <button className={isRecording ? "danger" : ""} onClick={isRecording ? onStop : onStart} type="button">
          {isRecording ? "Stop" : "Record"}
        </button>
        <button disabled={recording.length === 0} onClick={() => onReplay(recording)} type="button">
          Replay
        </button>
        <button disabled={recording.length === 0} onClick={onClear} type="button">
          Clear
        </button>
      </div>

      <label className="slider-control">
        <span className="control-label">Playback speed</span>
        <input min="0.5" max="1.75" step="0.05" type="range" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} />
      </label>

      <div className="saved-list">
        {savedRecordings.length === 0 ? (
          <span>No saved takes yet</span>
        ) : (
          savedRecordings.map((take) => (
            <button key={take.id} onClick={() => onReplaySaved(take)} type="button">
              {take.name}
            </button>
          ))
        )}
      </div>
    </section>
  );
}
