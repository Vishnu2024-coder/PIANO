import { useEffect, useMemo, useRef, useState } from "react";
import BeatPad from "./components/BeatPad.jsx";
import ChordPad from "./components/ChordPad.jsx";
import Controls from "./components/Controls.jsx";
import FloatingNotes from "./components/FloatingNotes.jsx";
import Leaderboard from "./components/Leaderboard.jsx";
import Metronome from "./components/Metronome.jsx";
import NoteDisplay from "./components/NoteDisplay.jsx";
import Piano from "./components/Piano.jsx";
import Recorder from "./components/Recorder.jsx";
import SongMode, { songs } from "./components/SongMode.jsx";
import Visualizer from "./components/Visualizer.jsx";
import { playChord, playDrum, playNote } from "./sounds/audioEngine.js";

const keyboardToNote = {
  a: "C",
  w: "C#",
  s: "D",
  e: "D#",
  d: "E",
  f: "F",
  t: "F#",
  g: "G",
  y: "G#",
  h: "A",
  u: "A#",
  j: "B"
};

function readStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [octave, setOctave] = useState(4);
  const [volume, setVolume] = useState(0.7);
  const [sustain, setSustain] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [instrument, setInstrument] = useState("piano");
  const [mode, setMode] = useState("freestyle");
  const [activeNotes, setActiveNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState("");
  const [history, setHistory] = useState([]);
  const [recording, setRecording] = useState([]);
  const [savedRecordings, setSavedRecordings] = useState(() => readStorage("piano-recordings", []));
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStart, setRecordingStart] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedSong, setSelectedSong] = useState("Twinkle Twinkle");
  const [songIndex, setSongIndex] = useState(0);
  const [practiceStats, setPracticeStats] = useState({ correct: 0, total: 0, startedAt: 0 });
  const [leaderboard, setLeaderboard] = useState(() => readStorage("piano-leaderboard", []));
  const [bpm, setBpm] = useState(96);
  const [isMetronomeOn, setIsMetronomeOn] = useState(false);
  const pressedKeys = useRef(new Set());

  const currentSong = songs[selectedSong];
  const nextPracticeNote = mode === "practice" ? currentSong[songIndex] : "";
  const accuracy = practiceStats.total === 0 ? 100 : Math.round((practiceStats.correct / practiceStats.total) * 100);
  const bestScore = leaderboard[0]?.accuracy || 0;
  const fastestTime = leaderboard.length ? Math.min(...leaderboard.map((entry) => entry.time)) : null;

  const savedPayload = useMemo(() => JSON.stringify(savedRecordings), [savedRecordings]);
  const leaderboardPayload = useMemo(() => JSON.stringify(leaderboard), [leaderboard]);

  useEffect(() => localStorage.setItem("piano-recordings", savedPayload), [savedPayload]);
  useEffect(() => localStorage.setItem("piano-leaderboard", leaderboardPayload), [leaderboardPayload]);

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    function handleKeyDown(event) {
      const note = keyboardToNote[event.key.toLowerCase()];
      if (!note || pressedKeys.current.has(event.key)) return;
      pressedKeys.current.add(event.key);
      handlePlayNote(note);
    }

    function handleKeyUp(event) {
      pressedKeys.current.delete(event.key);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  });

  useEffect(() => {
    if (!isMetronomeOn) return undefined;
    const interval = window.setInterval(() => playDrum("clap", volume * 0.55), 60000 / bpm);
    return () => window.clearInterval(interval);
  }, [bpm, isMetronomeOn, volume]);

  function flashNote(note) {
    setActiveNotes((notes) => [...new Set([...notes, note])]);
    window.setTimeout(() => {
      setActiveNotes((notes) => notes.filter((item) => item !== note));
    }, sustain ? 520 : 260);
  }

  function updatePractice(note) {
    if (mode !== "practice") return;

    const expected = currentSong[songIndex];
    const isCorrect = note === expected;
    const nextStats = {
      correct: practiceStats.correct + (isCorrect ? 1 : 0),
      total: practiceStats.total + 1,
      startedAt: practiceStats.startedAt || Date.now()
    };

    setPracticeStats(nextStats);

    if (isCorrect) {
      const nextIndex = songIndex + 1;
      setSongIndex(nextIndex);

      if (nextIndex >= currentSong.length) {
        const elapsedSeconds = Math.max(1, Math.round((Date.now() - nextStats.startedAt) / 1000));
        const score = Math.round((nextStats.correct / nextStats.total) * 100);
        const entry = { id: Date.now(), song: selectedSong, accuracy: score, time: elapsedSeconds };
        setLeaderboard((entries) => [entry, ...entries].sort((a, b) => b.accuracy - a.accuracy || a.time - b.time).slice(0, 5));
        setSongIndex(0);
        setPracticeStats({ correct: 0, total: 0, startedAt: 0 });
      }
    }
  }

  function handlePlayNote(note) {
    const label = `${note}${octave}`;
    playNote(note, octave, instrument, volume, sustain);
    flashNote(note);
    updatePractice(note);
    setCurrentNote(label);
    setHistory((items) => [{ id: Date.now() + Math.random(), note: label }, ...items].slice(0, 18));

    if (isRecording) {
      setRecording((notes) => [
        ...notes,
        { note, octave, instrument, sustain, at: Date.now() - recordingStart }
      ]);
    }
  }

  function startRecording() {
    setRecording([]);
    setRecordingStart(Date.now());
    setIsRecording(true);
  }

  function stopRecording() {
    setIsRecording(false);
    if (recording.length > 0) {
      const take = { id: Date.now(), name: `Take ${savedRecordings.length + 1}`, notes: recording };
      setSavedRecordings((items) => [take, ...items].slice(0, 6));
    }
  }

  function replayNotes(notes) {
    notes.forEach((item) => {
      window.setTimeout(() => {
        playNote(item.note, item.octave, item.instrument, volume, item.sustain);
        flashNote(item.note);
        setCurrentNote(`${item.note}${item.octave}`);
      }, item.at / playbackSpeed);
    });
  }

  function resetPractice() {
    setSongIndex(0);
    setPracticeStats({ correct: 0, total: 0, startedAt: 0 });
  }

  function autoPlaySong(song) {
    const notes = song.map((note, index) => ({ note, octave, instrument, sustain, at: index * 520 }));
    replayNotes(notes);
  }

  function handleChord(notes, name) {
    playChord(notes, octave, instrument, volume, sustain);
    notes.forEach(flashNote);
    setCurrentNote(name);
    setHistory((items) => [{ id: Date.now(), note: name }, ...items].slice(0, 18));
  }

  function handleDrum(drum) {
    playDrum(drum, volume);
    setCurrentNote(drum.toUpperCase());
    setHistory((items) => [{ id: Date.now(), note: drum }, ...items].slice(0, 18));
  }

  return (
    <main className="app-shell">
      <FloatingNotes />

      <header className="hero">
        <div>
          <span className="eyebrow">React Web Audio</span>
          <h1>Piano Studio</h1>
        </div>
        <p>Keyboard: A S D F G H J for white keys, W E T Y U for black keys.</p>
      </header>

      <Controls
        instrument={instrument}
        mode={mode}
        octave={octave}
        setInstrument={setInstrument}
        setMode={setMode}
        setOctave={setOctave}
        setSustain={setSustain}
        setTheme={setTheme}
        setVolume={setVolume}
        sustain={sustain}
        theme={theme}
        volume={volume}
      />

      <NoteDisplay currentNote={currentNote} history={history} />
      <Piano activeNotes={activeNotes} nextPracticeNote={nextPracticeNote} onPlayNote={handlePlayNote} />

      <div className="dashboard">
        <SongMode
          accuracy={accuracy}
          bestScore={bestScore}
          fastestTime={fastestTime}
          onAutoPlay={autoPlaySong}
          onResetPractice={resetPractice}
          selectedSong={selectedSong}
          setSelectedSong={(song) => {
            setSelectedSong(song);
            resetPractice();
          }}
          songIndex={songIndex}
        />
        <Recorder
          isRecording={isRecording}
          onClear={() => setRecording([])}
          onReplay={replayNotes}
          onReplaySaved={(take) => replayNotes(take.notes)}
          onStart={startRecording}
          onStop={stopRecording}
          recording={recording}
          savedRecordings={savedRecordings}
          setSpeed={setPlaybackSpeed}
          speed={playbackSpeed}
        />
        <ChordPad onPlayChord={handleChord} />
        <BeatPad onPlayDrum={handleDrum} />
        <Metronome bpm={bpm} isMetronomeOn={isMetronomeOn} setBpm={setBpm} setIsMetronomeOn={setIsMetronomeOn} />
        <Visualizer />
        <Leaderboard leaderboard={leaderboard} />
      </div>
    </main>
  );
}
