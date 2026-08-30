import { notFound } from "next/navigation";
import MangaReader from "../../../../components/reader/MangaReader";
import { mangas } from "../../../../data/mangas";

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

  return (
    <MangaReader
      chapterTitle={`${manga.titulo} - Capítulo ${chapter.numero}: ${chapter.titulo}`}
      pages={chapter.paginas}
    />
  );
}