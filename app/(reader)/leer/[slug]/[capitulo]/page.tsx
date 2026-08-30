import { notFound } from "next/navigation";
import MangaReader from "../../../../../components/reader/MangaReader";
import { mangas } from "../../../../../data/mangas";

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

  const manga = mangas.find((manga) => manga.slug === slug);

  if (!manga) {
    notFound();
  }

  const numeroCapitulo = Number(capitulo);

  const chapter = manga.capitulos.find(
    (item) => item.numero === numeroCapitulo
  );

  if (!chapter || chapter.paginas.length === 0) {
    notFound();
  }
const currentIndex = manga.capitulos.findIndex(
  (item) => item.numero === numeroCapitulo
);

const previousChapter = manga.capitulos[currentIndex - 1];
const nextChapter = manga.capitulos[currentIndex + 1];

const previousChapterUrl =
  previousChapter && previousChapter.paginas.length > 0
    ? `/leer/${manga.slug}/${previousChapter.numero}`
    : undefined;

const nextChapterUrl =
  nextChapter && nextChapter.paginas.length > 0
    ? `/leer/${manga.slug}/${nextChapter.numero}`
    : undefined;
  return (
  <MangaReader
    chapterTitle={`${manga.titulo} - Capítulo ${chapter.numero}: ${chapter.titulo}`}
    pages={chapter.paginas}
    mangaUrl={`/manga/${manga.slug}`}
    previousChapterUrl={previousChapterUrl}
    nextChapterUrl={nextChapterUrl}
  />
);
  
}