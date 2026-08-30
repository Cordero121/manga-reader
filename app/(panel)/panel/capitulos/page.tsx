"use client";
import { mangas } from "../../../../data/mangas";
import { ChangeEvent, useState } from "react";
function obtenerProximoCapitulo(
  capitulos: { numero: number }[]
) {
  if (capitulos.length === 0) {
    return 1;
  }

  return Math.max(
    ...capitulos.map((capitulo) => capitulo.numero)
  ) + 1;
}
export default function NuevoCapituloPage() {
  const [paginas, setPaginas] = useState<string[]>([]);
  const [mangaSeleccionado, setMangaSeleccionado] = useState(
  mangas[0]?.slug ?? ""
);
const [numeroCapitulo, setNumeroCapitulo] = useState("");
const mangaActual = mangas.find(
  (manga) => manga.slug === mangaSeleccionado
);

const proximoCapitulo = mangaActual
  ? obtenerProximoCapitulo(mangaActual.capitulos)
  : 1;

const numeroCapituloConvertido = Number(numeroCapitulo);

const capituloRepetido =
  mangaActual?.capitulos.some(
    (capitulo) => capitulo.numero === numeroCapituloConvertido
  ) ?? false;

const moverPaginaArriba = (index: number) => {
  if (index === 0) return;

  setPaginas((prev) => {
    const nuevasPaginas = [...prev];

    [nuevasPaginas[index - 1], nuevasPaginas[index]] = [
      nuevasPaginas[index],
      nuevasPaginas[index - 1],
    ];

    return nuevasPaginas;
  });
};

const moverPaginaAbajo = (index: number) => {

    setPaginas((prev) => {
    if (index === prev.length - 1) return prev;

    const nuevasPaginas = [...prev];

    [nuevasPaginas[index], nuevasPaginas[index + 1]] = [
      nuevasPaginas[index + 1],
      nuevasPaginas[index],
    ];

    return nuevasPaginas;
  });
};
const eliminarPagina = (index: number) => {
  setPaginas((prev) => prev.filter((_, i) => i !== index));
}; 
const vaciarPaginas = () => {
  setPaginas([]);
};
 
  const handlePaginasChange = (event: ChangeEvent<HTMLInputElement>) => {
    const archivos = Array.from(event.target.files ?? []);

    const previews = archivos.map((archivo) =>
      URL.createObjectURL(archivo)
    );

    setPaginas(previews);
    
  };

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <p className="text-sm font-medium uppercase tracking-wider text-zinc-500">
            Administración
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Nuevo capítulo
          </h1>

          <p className="mt-3 text-zinc-400">
            Seleccioná una obra y cargá las páginas del capítulo.
          </p>
        </div>

        <form className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Obra
            </label>

            <select
  value={mangaSeleccionado}
onChange={(event) => {
  const nuevoSlug = event.target.value;

  setMangaSeleccionado(nuevoSlug);

  const nuevoManga = mangas.find(
    (manga) => manga.slug === nuevoSlug
  );

  const siguienteNumero = nuevoManga
  ? obtenerProximoCapitulo(nuevoManga.capitulos)
  : 1;

  setNumeroCapitulo(String(siguienteNumero));
}}  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none"
>
  {mangas.map((manga) => (
    <option key={manga.id} value={manga.slug}>
      {manga.titulo}
    </option>
  ))}
</select>
{mangaActual && (
  <div className="mt-3 rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-sm">
    <p className="text-zinc-400">
      Capítulos actuales:{" "}
      <span className="text-white">
        {mangaActual.capitulos.length}
      </span>
    </p>

    <p className="mt-1 text-zinc-400">
      Próximo capítulo sugerido:{" "}
      <span className="font-medium text-white">
        {proximoCapitulo}
      </span>
    </p>
  </div>
)}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Número de capítulo
              </label>

              <input
                type="number"
                min="1"
                value={numeroCapitulo}
                onChange={(event) => setNumeroCapitulo(event.target.value)}
                placeholder="Ej: 3"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none"
              />
              {capituloRepetido && (
                <p className="mt-2 text-sm text-red-400">
                 Este número de capítulo ya existe para la obra seleccionada.
                </p>
)}

            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Título
              </label>

              <input
                type="text"
                placeholder="Ej: Una nueva aventura"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Páginas
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePaginasChange}
              className="block w-full text-sm text-zinc-400 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-800 file:px-4 file:py-2 file:text-white hover:file:bg-zinc-700"
            />

            <p className="mt-2 text-xs text-zinc-500">
              Podés seleccionar varias imágenes al mismo tiempo.
            </p>
          </div>

          <button
  type="button"
  disabled={
  paginas.length === 0 ||
  numeroCapitulo === "" ||
  capituloRepetido
}
  className="rounded-lg bg-white px-5 py-3 font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-500"
>
  Crear capítulo
</button>
        </form>

        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between gap-4">
  <h2 className="text-xl font-semibold">
    Vista previa
  </h2>

  <div className="flex items-center gap-3">
    <p className="text-sm text-zinc-500">
      {paginas.length} páginas
    </p>

    {paginas.length > 0 && (
      <button
        type="button"
        onClick={vaciarPaginas}
        className="rounded-md border border-red-900 px-3 py-1.5 text-sm text-red-400 transition hover:bg-red-950"
      >
        Vaciar todas
      </button>
    )}
  </div>
</div>

          {paginas.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-800 py-16 text-center text-zinc-600">
              Todavía no seleccionaste páginas.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {paginas.map((pagina, index) => (
  <div key={pagina}>
    <div className="mb-2 flex items-center justify-between gap-2">
      <span className="text-sm text-zinc-500">
        Página {index + 1}
      </span>

      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => moverPaginaArriba(index)}
          disabled={index === 0}
          className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-300 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-30"
          title="Mover hacia arriba"
        >
          ↑
        </button>

        <button
          type="button"
          onClick={() => moverPaginaAbajo(index)}
          disabled={index === paginas.length - 1}
          className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-300 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-30"
          title="Mover hacia abajo"
        >
          ↓
        </button>
        <button
  type="button"
  onClick={() => eliminarPagina(index)}
  className="rounded border border-red-900 px-2 py-1 text-xs text-red-400 transition hover:bg-red-950"
  title="Eliminar página"
>
  Eliminar
</button>
      </div>
    </div>

    <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
      <img
        src={pagina}
        alt={`Página ${index + 1}`}
        className="aspect-[2/3] h-full w-full object-cover"
      />
    </div>
  </div>
))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}