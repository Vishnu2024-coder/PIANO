const symbols = ["♪", "♫", "♬", "♩", "♭", "♯"];

export default function FloatingNotes() {
  return (
    <div className="floating-notes" aria-hidden="true">
      {Array.from({ length: 18 }, (_, index) => (
        <span
          key={index}
          style={{
            left: `${(index * 17) % 100}%`,
            animationDelay: `${index * 0.7}s`,
            animationDuration: `${8 + (index % 6)}s`
          }}
        >
          {symbols[index % symbols.length]}
        </span>
      ))}
    </div>
  );
}
