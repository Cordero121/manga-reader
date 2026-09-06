import Link from "next/link";
import { supabase } from "../../../../lib/supabase/client";
import EliminarObraButton from "../../../../components/panel/EliminarObraButton";

export const dynamic = "force-dynamic";

export default async function ObrasPage() {
  const { data: mangas, error } = await supabase
    .from("mangas")
    .select(`
      id,
      slug,
      titulo,
      autor,
      estado,
      portada_url,
      capitulos (
        id
      )
    `)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
            Administración
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Gestionar obras
          </h1>

          <p className="mt-2 text-zinc-400">
            Obras actualmente cargadas en la plataforma.
          </p>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-900 bg-red-950/30 p-5">
            <p className="text-red-400">
              No se pudieron cargar las obras: {error.message}
            </p>
          </div>
        ) : mangas?.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8">
            <p className="text-zinc-400">
              Todavía no hay obras cargadas.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {mangas?.map((manga) => (
              <div
                key={manga.id}
                className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="h-24 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                    {manga.portada_url ? (
                      <img
                        src={manga.portada_url}
                        alt={`Portada de ${manga.titulo}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-zinc-600">
                        Sin portada
                      </div>
                    )}
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      {manga.titulo}
                    </h2>

                    <p className="mt-1 text-sm text-zinc-400">
                      {manga.autor}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      {manga.estado} · {manga.capitulos?.length ?? 0} capítulos
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                <Link
                    href={`/manga/${manga.slug}`}
                    target="_blank"
                    className="rounded-lg border border-zinc-700 px-4 py-2 text-center text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                >
                    Ver obra
                </Link>

                <Link
                    href={`/panel/obras/${manga.id}/editar`}
                    className="rounded-lg border border-zinc-700 px-4 py-2 text-center text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                >
                    Editar
                </Link>
                <Link
                    href={`/panel/obras/${manga.id}/capitulos`}
                    className="rounded-lg border border-zinc-700 px-4 py-2 text-center text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                    >
                    Capítulos
                    </Link>
                    <EliminarObraButton
                        mangaId={manga.id}
                        titulo={manga.titulo}
                        />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}