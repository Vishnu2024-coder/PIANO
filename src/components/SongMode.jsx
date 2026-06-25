export const songs = {
  "Twinkle Twinkle": ["C", "C", "G", "G", "A", "A", "G", "F", "F", "E", "E", "D", "D", "C"],
  "Ode Starter": ["E", "E", "F", "G", "G", "F", "E", "D", "C", "C", "D", "E"],
  "Happy Steps": ["C", "D", "E", "C", "C", "D", "E", "C"]
};

export default function SongMode({
  selectedSong,
  setSelectedSong,
  songIndex,
  accuracy,
  bestScore,
  fastestTime,
  onResetPractice,
  onAutoPlay
}) {
  const song = songs[selectedSong];

  return (
    <section className="panel song-panel">
      <div className="section-heading">
        <span className="eyebrow">Song mode</span>
        <strong>{selectedSong}</strong>
      </div>

      <select onChange={(event) => setSelectedSong(event.target.value)} value={selectedSong}>
        {Object.keys(songs).map((name) => (
          <option key={name}>{name}</option>
        ))}
      </select>

      <div className="song-notes">
        {song.map((note, index) => (
          <span className={index === songIndex ? "current-step" : index < songIndex ? "done-step" : ""} key={`${note}-${index}`}>
            {note}
          </span>
        ))}
      </div>

      <div className="stats-grid">
        <span>Accuracy <b>{accuracy}%</b></span>
        <span>Best <b>{bestScore}%</b></span>
        <span>Fastest <b>{fastestTime ? `${fastestTime}s` : "--"}</b></span>
      </div>

      <div className="button-row">
        <button onClick={onResetPractice} type="button">Reset</button>
        <button onClick={() => onAutoPlay(song)} type="button">Play Song</button>
      </div>
    </section>
  );
}
