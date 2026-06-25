import { useEffect, useRef } from "react";
import { getAnalyser } from "../sounds/audioEngine.js";

export default function Visualizer() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const analyser = getAnalyser();
    const data = new Uint8Array(analyser.frequencyBinCount);
    let frameId;

    function draw() {
      frameId = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(data);
      context.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / data.length;
      data.forEach((value, index) => {
        const height = (value / 255) * canvas.height;
        const gradient = context.createLinearGradient(0, canvas.height - height, 0, canvas.height);
        gradient.addColorStop(0, "#8cf7ff");
        gradient.addColorStop(1, "#8d5cff");
        context.fillStyle = gradient;
        context.fillRect(index * barWidth, canvas.height - height, Math.max(barWidth - 2, 2), height);
      });
    }

    draw();

    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <section className="panel visualizer">
      <div className="section-heading">
        <span className="eyebrow">Sound wave</span>
        <strong>Visualizer</strong>
      </div>
      <canvas aria-label="Audio visualizer" height="120" ref={canvasRef} width="520" />
    </section>
  );
}
