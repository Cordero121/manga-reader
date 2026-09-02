import { notFound } from "next/navigation";
import MangaReader from "../../../../../components/reader/MangaReader";
import { supabase } from "../../../../../lib/supabase/client";

interface ReaderPageProps {
  params: Promise<{
    slug: string;
    capitulo: string;
  }>;
}

export default async function ReaderPage({
  params,
}: ReaderPageProps) {
const { slug, capitulo } = await params;

const numeroCapitulo = Number(capitulo);

if (Number.isNaN(numeroCapitulo)) {
  notFound();
}

const { data: manga, error: mangaError } = await supabase
  .from("mangas")
  .select(`
    id,
    slug,
    titulo,
    capitulos (
      id,
      numero,
      titulo,
      paginas (
        id,
        numero,
        imagen_url
      )
    )
  `)
  .eq("slug", slug)
  .single();

if (mangaError) {
  console.error("ERROR SUPABASE MANGA:", mangaError);

  return (
    <main className="min-h-screen bg-zinc-950 p-10 text-white">
      <h1 className="text-2xl font-bold text-red-400">
        Error al cargar manga
      </h1>

      <p className="mt-4 text-zinc-300">
        {mangaError.message}
      </p>
    </main>
  );
}

if (!manga) {
  notFound();
}

const capitulosOrdenados = [...(manga.capitulos ?? [])].sort(
  (a, b) => a.numero - b.numero
);

const chapter = capitulosOrdenados.find(
  (item) => item.numero === numeroCapitulo
);

if (!chapter || !chapter.paginas || chapter.paginas.length === 0) {
  notFound();
}

const paginasOrdenadas = [...chapter.paginas].sort(
  (a, b) => a.numero - b.numero
);

const currentIndex = capitulosOrdenados.findIndex(
  (item) => item.numero === numeroCapitulo
);

const previousChapter = capitulosOrdenados[currentIndex - 1];
const nextChapter = capitulosOrdenados[currentIndex + 1];

const previousChapterUrl = previousChapter
  ? `/leer/${manga.slug}/${previousChapter.numero}`
  : undefined;

const nextChapterUrl = nextChapter
  ? `/leer/${manga.slug}/${nextChapter.numero}`
  : undefined;

  return (
  <MangaReader
  chapterTitle={`${manga.titulo} - Capítulo ${chapter.numero}: ${chapter.titulo}`}
  pages={paginasOrdenadas.map((pagina) => pagina.imagen_url)}
  mangaUrl={`/manga/${manga.slug}`}
  previousChapterUrl={previousChapterUrl}
  nextChapterUrl={nextChapterUrl}
/>
);
  
}