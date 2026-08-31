import { supabase } from "../../../../lib/supabase/client";

export default async function PruebaSupabasePage() {
  const { data, error } = await supabase
    .from("mangas")
    .select("*");

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold">
          Prueba de Supabase
        </h1>

        {error ? (
          <div className="mt-6 rounded-lg border border-red-900 bg-red-950/40 p-4">
            <p className="font-semibold text-red-400">
              Error al consultar Supabase
            </p>

            <p className="mt-2 text-sm text-red-300">
              {error.message}
            </p>
          </div>
        ) : (
          <div className="mt-6 rounded-lg border border-green-900 bg-green-950/40 p-4">
            <p className="font-semibold text-green-400">
              Conexión realizada correctamente
            </p>

            <p className="mt-2 text-sm text-zinc-300">
              Registros encontrados: {data?.length ?? 0}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}