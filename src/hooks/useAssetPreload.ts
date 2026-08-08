import { useEffect, useState } from "react";

/** Pré-carrega os assets principais antes de iniciar a experiência. */
export function useAssetPreload(urls: string[]) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let pending = urls.length;
    if (pending === 0) {
      setReady(true);
      return;
    }
    const done = () => {
      pending -= 1;
      if (pending <= 0 && !cancelled) setReady(true);
    };
    const images = urls.map((url) => {
      const img = new Image();
      img.onload = done;
      img.onerror = done;
      img.src = url;
      return img;
    });
    return () => {
      cancelled = true;
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [urls]);

  return ready;
}
