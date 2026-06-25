export default function Leaderboard({ leaderboard }) {
  return (
    <section className="panel leaderboard">
      <div className="section-heading">
        <span className="eyebrow">Leaderboard</span>
        <strong>Practice scores</strong>
      </div>
      {leaderboard.length === 0 ? (
        <p>No completed songs yet.</p>
      ) : (
        <ol>
          {leaderboard.map((entry) => (
            <li key={entry.id}>
              <span>{entry.song}</span>
              <b>{entry.accuracy}%</b>
              <small>{entry.time}s</small>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
