import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
export const dynamic = "force-dynamic";

export default async function PanelPage() {
  const { count: totalObras } = await supabase
  .from("mangas")
  .select("*", { count: "exact", head: true });

const { count: totalCapitulos } = await supabase
  .from("capitulos")
  .select("*", { count: "exact", head: true });
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
              Administración
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Bienvenido al panel
            </h1>

            <p className="mt-3 max-w-2xl text-zinc-400">
              Desde acá podés crear nuevas obras, publicar capítulos,
              administrar contenido existente y revisar cómo se ve la web
              para los lectores.
            </p>
          </div>

<div className="mb-10 grid gap-4 sm:grid-cols-2">
  <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
    <p className="text-sm text-zinc-500">
      Obras cargadas
    </p>

    <p className="mt-2 text-3xl font-bold">
      {totalObras ?? 0}
    </p>
  </div>

  <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
    <p className="text-sm text-zinc-500">
      Capítulos publicados
    </p>

    <p className="mt-2 text-3xl font-bold">
      {totalCapitulos ?? 0}
    </p>
  </div>
</div>


        <div className="grid gap-5 sm:grid-cols-2">
          <Link
            href="/panel/obras/nueva"
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-zinc-700 hover:bg-zinc-800"
          >
            <h2 className="text-xl font-semibold">
              Nueva obra
            </h2>

            <p className="mt-2 text-sm text-zinc-400">
              Crear una nueva obra y subir su portada.
            </p>
          </Link>

          <Link
            href="/panel/capitulos"
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-zinc-700 hover:bg-zinc-800"
          >
            <h2 className="text-xl font-semibold">
              Nuevo capítulo
            </h2>

            <p className="mt-2 text-sm text-zinc-400">
              Publicar un capítulo y cargar sus páginas.
            </p>
          </Link>

          <Link
            href="/panel/obras"
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-zinc-700 hover:bg-zinc-800"
          >
            <h2 className="text-xl font-semibold">
              Gestionar obras
            </h2>

            <p className="mt-2 text-sm text-zinc-400">
              Editar obras, capítulos y contenido existente.
            </p>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-zinc-700 hover:bg-zinc-800"
          >
            <h2 className="text-xl font-semibold">
              Ver como lector
            </h2>

            <p className="mt-2 text-sm text-zinc-400">
              Abrir la web pública en una nueva pestaña.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}