import Link from "next/link";
import { notFound } from "next/navigation";
import { mangas } from "../../../data/mangas";

interface MangaPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function MangaPage({ params }: MangaPageProps) {
  const { slug } = await params;

  const manga = mangas.find((manga) => manga.slug === slug);

  if (!manga) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* INFORMACIÓN DEL MANGA */}
      <section className="border-b border-zinc-800">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[280px_1fr]">

          {/* PORTADA */}
          <div className="aspect-[2/3] w-full rounded-xl border border-zinc-800 bg-zinc-900 flex items-center justify-center text-zinc-600">
            Portada
          </div>

          {/* INFORMACIÓN */}
          <div>

            <Link
  href="/#catalogo"
  className="text-sm text-zinc-500 transition hover:text-white"
>
  ← Volver al catálogo
</Link>

            <p className="mt-8 text-sm uppercase tracking-[0.2em] text-zinc-500">
              {manga.tipo}
            </p>

            <h1 className="mt-3 text-4xl font-bold md:text-5xl">
              {manga.titulo}
            </h1>

            <p className="mt-4 text-zinc-400">
              {manga.autor}
            </p>

            {/* GÉNEROS */}
            <div className="mt-6 flex flex-wrap gap-2">
              {manga.generos.map((genero) => (
                <span
                  key={genero}
                  className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400"
                >
                  {genero}
                </span>
              ))}
            </div>

            {/* SINOPSIS */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold">
                Sinopsis
              </h2>

              <p className="mt-3 max-w-3xl leading-relaxed text-zinc-400">
                {manga.sinopsis}
              </p>
            </div>

            {/* ESTADO */}
            <div className="mt-8">
              <span className="text-sm text-zinc-500">
                Estado:
              </span>

              <span className="ml-2 text-sm font-medium">
                {manga.estado}
              </span>
            </div>

          </div>
        </div>
      </section>


      {/* CAPÍTULOS */}
      <section className="mx-auto max-w-7xl px-6 py-16">

        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
            Lectura
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Capítulos
          </h2>
        </div>


        {manga.capitulos.length === 0 ? (

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8">
            <p className="text-zinc-400">
              Todavía no hay capítulos publicados.
            </p>
          </div>

        ) : (

          <div className="overflow-hidden rounded-xl border border-zinc-800">

            {manga.capitulos.map((capitulo) => {

  const disponible = capitulo.paginas.length > 0;

  if (!disponible) {
    return (
      <div
        key={capitulo.numero}
        className="flex items-center justify-between border-b border-zinc-800 px-6 py-5 last:border-b-0 opacity-60"
      >
        <div>
          <p className="font-medium">
            Capítulo {capitulo.numero}
          </p>

          <p className="mt-1 text-sm text-zinc-500">
            {capitulo.titulo}
          </p>
        </div>

        <p className="text-sm text-zinc-500">
          {capitulo.fecha}
        </p>
      </div>
    );
  }

  return (
    <Link
      key={capitulo.numero}
      href={`/leer/${manga.slug}/${capitulo.numero}`}
      className="flex items-center justify-between border-b border-zinc-800 px-6 py-5 last:border-b-0 transition hover:bg-zinc-900"
    >
      <div>
        <p className="font-medium">
          Capítulo {capitulo.numero}
        </p>

        <p className="mt-1 text-sm text-zinc-500">
          {capitulo.titulo}
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm text-zinc-500">
          {capitulo.fecha}
        </p>

        <p className="mt-1 text-xs text-zinc-400">
          Leer capítulo →
        </p>
      </div>
    </Link>
  );

})}

          </div>

        )}

      </section>

    </main>
  );
}