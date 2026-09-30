import { useEffect } from "react";

export default function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — A Paso Ligero .com` : "A Paso Ligero .com — Web de Músicas Militares";
  }, [title]);
}
