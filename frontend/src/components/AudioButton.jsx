import { Play, Pause } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";

export default function AudioButton({ file, title, sub, size = "md", testid }) {
  const { track, playing, play } = usePlayer();
  const active = track?.file === file;
  const isPlaying = active && playing;
  const dims = size === "lg" ? "h-14 w-14" : size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const icon = size === "lg" ? 22 : size === "sm" ? 13 : 16;
  return (
    <button
      onClick={() => play({ file, title, sub })}
      aria-label={`${isPlaying ? "Pausar" : "Reproducir"}: ${title}`}
      data-testid={testid || `audio-btn-${file.split("/").pop().replace(".mp3", "")}`}
      className={`group relative flex ${dims} shrink-0 items-center justify-center border transition-colors ${
        isPlaying
          ? "border-brass bg-brass text-obsidian"
          : "border-olive-500 bg-olive-900 text-brass hover:border-brass hover:bg-brass hover:text-obsidian"
      }`}
    >
      {isPlaying ? <Pause size={icon} /> : <Play size={icon} className="ml-0.5" />}
      {isPlaying && <span className="absolute -right-1 -top-1 h-2 w-2 bg-green-500 led-pulse" />}
    </button>
  );
}
