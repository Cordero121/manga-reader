"use client";
import Link from "next/link";
import { useState } from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface MangaReaderProps {
  pages?: string[];
  chapterTitle?: string;
  mangaUrl?: string;
  previousChapterUrl?: string;
  nextChapterUrl?: string;
}

export default function MangaReader({
  pages = [],
  chapterTitle = "Capítulo",
  mangaUrl,
  previousChapterUrl,
  nextChapterUrl,
}: MangaReaderProps) {
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 150));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 70));
  };

  const handleResetZoom = () => {
    setZoom(100);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
  <div className="mx-auto max-w-6xl px-4 py-3">
    <div className="flex items-center justify-between gap-4">
      <h1 className="truncate text-sm font-semibold sm:text-base">
        {chapterTitle}
      </h1>

      <div className="flex shrink-0 items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-1">
        <button
          onClick={handleZoomOut}
          className="rounded-md p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          title="Reducir zoom"
        >
          <ZoomOut size={18} />
        </button>

        <span className="w-12 text-center text-sm text-zinc-300">
          {zoom}%
        </span>

        <button
          onClick={handleZoomIn}
          className="rounded-md p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          title="Aumentar zoom"
        >
          <ZoomIn size={18} />
        </button>

        <button
          onClick={handleResetZoom}
          className="rounded-md p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          title="Restablecer zoom"
        >
          <RotateCcw size={17} />
        </button>
      </div>
    </div>

    <div className="mt-3 flex items-center justify-between gap-3 text-sm">
      <div>
        {previousChapterUrl ? (
          <Link
            href={previousChapterUrl}
            className="text-zinc-400 transition hover:text-white"
          >
            ← Capítulo anterior
          </Link>
        ) : (
          <span className="text-zinc-700">← Capítulo anterior</span>
        )}
      </div>

      {mangaUrl && (
        <Link
          href={mangaUrl}
          className="rounded-md border border-zinc-800 px-3 py-1.5 text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
        >
          Volver al manga
        </Link>
      )}

      <div>
        {nextChapterUrl ? (
          <Link
            href={nextChapterUrl}
            className="text-zinc-400 transition hover:text-white"
          >
            Capítulo siguiente →
          </Link>
        ) : (
          <span className="text-zinc-700">Capítulo siguiente →</span>
        )}
      </div>
    </div>
  </div>
</header>

      <main className="flex flex-col items-center py-4">
        {pages.length === 0 ? (
          <p className="my-20 text-zinc-500">
            No hay páginas cargadas en este capítulo.
          </p>
        ) : (
          <div
            className="flex flex-col items-center"
            style={{
              width: `${zoom}%`,
              maxWidth: zoom === 100 ? "800px" : "1200px",
            }}
          >
            {pages.map((pageUrl, index) => (
              <img
                key={index}
                src={pageUrl}
                alt={`Página ${index + 1}`}
                className="block h-auto w-full select-none"
                loading="lazy"
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}