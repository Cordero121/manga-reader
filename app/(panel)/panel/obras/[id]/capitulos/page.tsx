import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "../../../../../../lib/supabase/client";

export const dynamic = "force-dynamic";

interface CapitulosObraPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CapitulosObraPage({
  params,
}: CapitulosObraPageProps) {
  const { id } = await params;
  const mangaId = Number(id);

  if (Number.isNaN(mangaId)) {
    notFound();
  }

  const { data: manga, error } = await supabase
    .from("mangas")
    .select(`
      id,
      titulo,
      capitulos (
        id,
        numero,
        titulo,
        fecha,
        paginas (
          id
        )
      )
    `)
    .eq("id", mangaId)
    .single();

  if (error || !manga) {
    notFound();
  }

  const capitulosOrdenados = [...(manga.capitulos ?? [])].sort(
    (a, b) => a.numero - b.numero
  );

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <Link
            href="/panel/obras"
            className="text-sm text-zinc-500 transition hover:text-white"
          >
            ← Volver a gestionar obras
          </Link>

          <p className="mt-6 text-sm uppercase tracking-[0.2em] text-zinc-500">
            Administración
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Capítulos de {manga.titulo}
          </h1>
        </div>

        {capitulosOrdenados.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8">
            <p className="text-zinc-400">
              Esta obra todavía no tiene capítulos.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {capitulosOrdenados.map((capitulo) => (
              <div
                key={capitulo.id}
                className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold">
                    Capítulo {capitulo.numero}: {capitulo.titulo}
                  </p>

                  <p className="mt-1 text-sm text-zinc-500">
                    {capitulo.paginas?.length ?? 0} páginas
                  </p>
                </div>

                <Link
                  href={`/panel/obras/${manga.id}/capitulos/${capitulo.id}/editar`}
                  className="rounded-lg border border-zinc-700 px-4 py-2 text-center text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                >
                  Editar capítulo
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}