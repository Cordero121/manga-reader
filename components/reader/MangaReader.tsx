'use client';

interface MangaReaderProps {
  pages?: string[];
  chapterTitle?: string;
}

export default function MangaReader({
  pages = [],
  chapterTitle = "Capítulo",
}: MangaReaderProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      <div className="mx-auto max-w-4xl px-4 py-8">

        <h1 className="mb-8 text-center text-2xl font-bold">
          {chapterTitle}
        </h1>

        {pages.length === 0 ? (
          <p className="text-center text-zinc-500">
            No hay páginas cargadas.
          </p>
        ) : (
          <div className="flex flex-col items-center gap-2">
            {pages.map((pageUrl, index) => (
              <img
                key={index}
                src={pageUrl}
                alt={`Página ${index + 1}`}
                className="h-auto w-full max-w-3xl"
              />
            ))}
          </div>
        )}

      </div>

    </div>
  );
}