import { useRef } from "react";
import type { Archetype } from "../types";

interface ShareCardProps {
  archetype: Archetype;
  daysRecorded: number;
}

export function ShareCard({ archetype, daysRecorded }: ShareCardProps) {
  return (
    <div
      className="bg-cream border border-sand/40 rounded-2xl p-8 text-center"
      aria-label="Share card preview"
    >
      <p className="font-display text-2xl text-olive-deep mb-1">Wave</p>
      <p className="text-olive-muted text-xs uppercase tracking-widest mb-8">
        75 Days Complete
      </p>

      <p className="font-display text-xl text-olive-deep mb-3">
        You are {archetype.name}
      </p>

      <p className="text-olive text-sm leading-relaxed mb-8 max-w-xs mx-auto">
        {archetype.message}
      </p>

      <p className="text-olive-deep font-display text-lg">
        {daysRecorded} days showed up
      </p>
    </div>
  );
}

interface ShareCardActionsProps {
  archetype: Archetype;
  daysRecorded: number;
}

export function ShareCardActions({
  archetype,
  daysRecorded,
}: ShareCardActionsProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const shareText = [
    "Wave — 75 Days Complete",
    `You are ${archetype.name}`,
    archetype.message,
    `${daysRecorded} days showed up`,
  ].join("\n\n");

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Wave — 75 Days Complete",
          text: shareText,
        });
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
    } catch {
      // Clipboard unavailable
    }
  };

  const handleSaveImage = () => {
    const canvas = document.createElement("canvas");
    const width = 600;
    const height = 800;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#F5F0E8";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "#D4C4A8";
    ctx.lineWidth = 1;
    ctx.strokeRect(32, 32, width - 64, height - 64);

    ctx.fillStyle = "#3D4A36";
    ctx.font = "48px 'Cormorant Garamond', Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("Wave", width / 2, 120);

    ctx.fillStyle = "#7A8470";
    ctx.font = "14px Inter, sans-serif";
    ctx.letterSpacing = "2px";
    ctx.fillText("75 DAYS COMPLETE", width / 2, 160);

    ctx.fillStyle = "#3D4A36";
    ctx.font = "36px 'Cormorant Garamond', Georgia, serif";
    ctx.fillText(`You are ${archetype.name}`, width / 2, 260);

    ctx.fillStyle = "#5E6D54";
    ctx.font = "18px Inter, sans-serif";
    wrapText(ctx, archetype.message, width / 2, 320, 440, 28);

    ctx.fillStyle = "#3D4A36";
    ctx.font = "28px 'Cormorant Garamond', Georgia, serif";
    ctx.fillText(`${daysRecorded} days showed up`, width / 2, 680);

    const link = document.createElement("a");
    link.download = "wave-journey.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div>
      <div ref={cardRef} className="mb-6">
        <ShareCard archetype={archetype} daysRecorded={daysRecorded} />
      </div>

      <div className="flex flex-col gap-2">
        <button onClick={handleShare} className="btn-primary w-full text-base">
          Share journey
        </button>
        <button
          onClick={handleSaveImage}
          className="btn-secondary w-full text-base"
        >
          Save image
        </button>
      </div>
    </div>
  );
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (const word of words) {
    const testLine = line + word + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line !== "") {
      ctx.fillText(line.trim(), x, currentY);
      line = word + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
}
