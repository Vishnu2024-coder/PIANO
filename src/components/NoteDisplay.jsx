export default function NoteDisplay({ currentNote, history }) {
  return (
    <section className="panel note-panel">
      <div>
        <span className="eyebrow">Now playing</span>
        <strong>{currentNote || "Ready"}</strong>
      </div>
      <div className="history-strip">
        {history.length === 0 ? (
          <span>No notes yet</span>
        ) : (
          history.slice(0, 10).map((entry) => <b key={entry.id}>{entry.note}</b>)
        )}
      </div>
    </section>
  );
}
