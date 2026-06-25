const drums = ["kick", "snare", "clap"];

export default function BeatPad({ onPlayDrum }) {
  return (
    <section className="panel beat-pad">
      <div className="section-heading">
        <span className="eyebrow">Beat pad</span>
        <strong>Mini studio</strong>
      </div>
      <div className="pad-grid">
        {drums.map((drum) => (
          <button key={drum} onClick={() => onPlayDrum(drum)} type="button">
            <b>{drum}</b>
            <span>Tap</span>
          </button>
        ))}
      </div>
    </section>
  );
}
