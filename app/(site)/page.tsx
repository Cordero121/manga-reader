import Link from "next/link";
import { supabase } from "../../lib/supabase/client";
export default async function Home() {
  const { data: mangas, error } = await supabase
  .from("mangas")
  .select("*")
  .order("created_at", { ascending: false });

if (error) {
  console.error(error);
}
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <main>

        {/* BANNER PRINCIPAL */}
<section
  id="inicio"
  className="border-b border-zinc-800"
>
  <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2">

    {/* CONTENIDO */}
    <div>

      <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-zinc-400">
        Manga y comics traducidos al español
      </p>

      <h2 className="max-w-xl text-5xl font-bold leading-tight tracking-tight md:text-6xl">
        Descubrí nuevas historias.
        <span className="block text-zinc-400">
          Leelas en español.
        </span>
      </h2>

      <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400 md:text-lg">
        Un espacio creado para compartir mangas y comics traducidos,
        descubrir nuevas historias y conocer el trabajo detrás de cada
        proyecto.
      </p>

      <a
        href="#catalogo"
        className="mt-8 inline-flex items-center rounded-lg bg-white px-6 py-3 font-medium text-black transition hover:bg-zinc-200"
      >
        Explorar catálogo
      </a>

    </div>


    {/* ESPACIO PARA MANGA DESTACADO */}
    <div className="flex justify-center md:justify-end">

      <div className="flex aspect-[3/4] w-full max-w-md items-end rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-800 to-zinc-950 p-8">

        <div>
          <p className="text-sm uppercase tracking-widest text-zinc-500">
            Próximamente
          </p>

          <h3 className="mt-2 text-2xl font-bold">
            Manga destacado
          </h3>

          <p className="mt-2 text-sm text-zinc-400">
            Este espacio podrá utilizarse para destacar una obra,
            un capítulo nuevo o una próxima traducción.
          </p>
        </div>

      </div>

    </div>

  </div>
</section>


        {/* CATÁLOGO */}
<section
  id="catalogo"
  className="mx-auto max-w-7xl px-6 py-20"
>
  <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

    <div>
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
        Contenido disponible
      </p>

      <h2 className="mt-2 text-3xl font-bold">
        Explorá nuestro catálogo
      </h2>

      <p className="mt-3 max-w-xl text-zinc-400">
        Obras traducidas y proyectos en los que estamos trabajando.
      </p>
    </div>

    <p className="text-sm text-zinc-500">
      {mangas?.length ?? 0} obras disponibles
    </p>

  </div>


  <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

    {mangas?.map((manga) => (

      <Link
        key={manga.id}
        href={`/manga/${manga.slug}`}
        className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition duration-300 hover:-translate-y-1 hover:border-zinc-600"
      >

        {/* PORTADA TEMPORAL */}
        <div className="aspect-[2/3] overflow-hidden rounded-lg bg-zinc-800">
  {manga.portada_url ? (
    <img
      src={manga.portada_url}
      alt={`Portada de ${manga.titulo}`}
      className="h-full w-full object-cover"
    />
  ) : (
    <div className="flex h-full items-center justify-center text-sm text-zinc-500">
      Sin portada
    </div>
  )}
</div>


        {/* INFORMACIÓN */}
        <div className="p-4">

          <div className="flex items-center justify-between gap-4">

            <h3 className="font-semibold">
              {manga.titulo}
            </h3>

            <span className="text-xs text-zinc-500">
              {manga.tipo}
            </span>

          </div>


          <p className="mt-2 text-sm text-zinc-400">
            {manga.estado}
          </p>

        </div>

      </Link>

    ))}

  </div>
</section>


        {/* SOBRE EL PROYECTO */}
        <section id="nosotros" className="border-y border-zinc-800 bg-zinc-900/50">
          <div className="mx-auto max-w-7xl px-6 py-20">
            
            <p className="text-sm uppercase tracking-widest text-zinc-500">
              Sobre el proyecto
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Detrás de cada capítulo hay trabajo.
            </h2>

            <p className="mt-6 max-w-3xl leading-relaxed text-zinc-400">
              Este proyecto nace con la intención de compartir historias
              traducidas al español y, al mismo tiempo, mostrar el trabajo
              realizado durante cada proceso de traducción, edición y publicación.
            </p>

          </div>
        </section>


        {/* SERVICIOS */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          
          <p className="text-sm uppercase tracking-widest text-zinc-500">
            Lo que hacemos
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            También podemos ayudarte con tu proyecto.
          </h2>


          <div className="mt-10 grid gap-4 md:grid-cols-3">

            <div className="rounded-xl border border-zinc-800 p-6">
              <h3 className="font-semibold">Traducción</h3>

              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                Traducción y adaptación de contenido al español.
              </p>
            </div>


            <div className="rounded-xl border border-zinc-800 p-6">
              <h3 className="font-semibold">Desarrollo web</h3>

              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                Creación y desarrollo de sitios y proyectos web.
              </p>
            </div>


            <div className="rounded-xl border border-zinc-800 p-6">
              <h3 className="font-semibold">Diseño</h3>

              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                Diseño gráfico, identidad visual y creación de recursos.
              </p>
            </div>

          </div>

        </section>

      </main>


      {/* FOOTER */}
      <footer className="border-t border-zinc-800">
        <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-zinc-500">
          Proyecto de manga y comics traducidos al español.
        </div>
      </footer>

    </div>
  );
}