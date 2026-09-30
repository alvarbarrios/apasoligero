import { ListPlus, Check } from "lucide-react";
import { toast } from "sonner";
import { usePlayer } from "@/context/PlayerContext";

export default function QueueButton({ file, title, sub, testid, size = "sm" }) {
  const { queue, track, enqueue } = usePlayer();
  const queued = queue.some((q) => q.file === file);
  const current = track?.file === file;
  const dims = size === "md" ? "h-10 w-10" : "h-8 w-8";
  const icon = size === "md" ? 16 : 13;
  const add = () => {
    const r = enqueue({ file, title, sub });
    if (r === "queued") toast.success(`En cola: ${title}`);
    else if (r === "duplicate") toast.message(current ? "Ya se está reproduciendo" : "Ya está en la cola");
  };
  return (
    <button
      onClick={add}
      disabled={queued || current}
      aria-label={queued ? `${title} en cola` : `Añadir ${title} a la cola`}
      title={queued ? "En cola" : "Añadir a la cola"}
      data-testid={testid || `queue-btn-${file.split("/").pop().replace(".mp3", "")}`}
      className={`flex ${dims} shrink-0 items-center justify-center border transition-colors ${
        queued
          ? "border-brass/50 text-brass/70"
          : current
            ? "border-olive-600 text-khaki/50"
            : "border-olive-600 text-khaki hover:border-brass hover:text-brass"
      }`}
    >
      {queued ? <Check size={icon} /> : <ListPlus size={icon} />}
    </button>
  );
}
