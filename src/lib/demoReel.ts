// Zero-cost reel generator: renders an animated canvas and records it to a
// downloadable video file entirely in the browser. No AI credits are used.

export type DemoReelOptions = {
  prompt: string;
  category: string;
  style: string;
  music: string;
  vertical: boolean;
  seconds?: number;
  onProgress?: (percent: number) => void;
};

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 6);
}

export async function generateDemoReel(opts: DemoReelOptions): Promise<string> {
  const { prompt, category, style, music, vertical, seconds = 10, onProgress } = opts;
  const width = vertical ? 720 : 1280;
  const height = vertical ? 1280 : 720;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser");

  const stream = canvas.captureStream(30);
  const mimeType = ["video/mp4", "video/webm;codecs=vp9", "video/webm"].find(
    (t) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t),
  );
  if (!mimeType) throw new Error("Recording is not supported in this browser");

  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 6_000_000 });
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  const scenes = [
    { label: category.toUpperCase(), text: prompt || category },
    { label: "SCENE 02", text: `Three quick points, ${style.toLowerCase()} visuals` },
    { label: "SCENE 03", text: "Follow for more" },
  ];

  const done = new Promise<Blob>((resolve) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
  });

  recorder.start();
  const start = performance.now();
  const total = seconds * 1000;

  await new Promise<void>((resolve) => {
    const draw = () => {
      const now = performance.now();
      const elapsed = now - start;
      const t = Math.min(elapsed / total, 1);
      onProgress?.(Math.round(t * 100));

      // Animated purple/blue gradient background
      const shift = Math.sin(t * Math.PI * 2) * 0.25 + 0.5;
      const g = ctx.createLinearGradient(0, height * (1 - shift), width, height * shift);
      g.addColorStop(0, "#5b21b6");
      g.addColorStop(0.5, "#4f46e5");
      g.addColorStop(1, "#0ea5e9");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);

      // Floating glass orbs
      for (let i = 0; i < 5; i++) {
        const p = (t * (0.4 + i * 0.12) + i / 5) % 1;
        const r = width * (0.12 + (i % 3) * 0.05);
        const x = width * (0.15 + ((i * 0.23) % 0.7));
        const y = height * (1.15 - p * 1.3);
        const rg = ctx.createRadialGradient(x, y, 0, x, y, r);
        rg.addColorStop(0, "rgba(255,255,255,0.28)");
        rg.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Scene text with fade transitions
      const sceneIdx = Math.min(scenes.length - 1, Math.floor(t * scenes.length));
      const local = t * scenes.length - sceneIdx;
      const fade = Math.min(1, Math.min(local, 1 - local) * 6);
      const scene = scenes[sceneIdx]!;

      ctx.globalAlpha = Math.max(0, fade);
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.font = `600 ${Math.round(width * 0.035)}px Manrope, system-ui, sans-serif`;
      ctx.fillText(scene.label, width / 2, height * 0.36);

      ctx.fillStyle = "#ffffff";
      const size = Math.round(width * 0.085);
      ctx.font = `700 ${size}px Sora, system-ui, sans-serif`;
      const lines = wrapText(ctx, scene.text, width * 0.8);
      lines.forEach((ln, i) => {
        ctx.fillText(ln, width / 2, height * 0.46 + i * size * 1.2);
      });
      ctx.globalAlpha = 1;

      // Progress bar + music caption
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fillRect(width * 0.1, height * 0.9, width * 0.8, 8);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(width * 0.1, height * 0.9, width * 0.8 * t, 8);
      ctx.font = `500 ${Math.round(width * 0.03)}px Manrope, system-ui, sans-serif`;
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.fillText(`♪ ${music}`, width / 2, height * 0.87);

      if (t >= 1) {
        resolve();
        return;
      }
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  });

  recorder.stop();
  stream.getTracks().forEach((tr) => tr.stop());
  const blob = await done;
  return URL.createObjectURL(blob);
}
