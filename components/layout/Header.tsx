import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <Link
          href="/"
          className="text-xl font-bold tracking-tight transition hover:text-zinc-300"
        >
          MANGA READER
        </Link>

        <nav>
          <ul className="flex items-center gap-6 text-sm text-zinc-400">
            <li>
              <Link
                href="/"
                className="transition hover:text-white"
              >
                Inicio
              </Link>
            </li>

            <li>
              <Link
                href="/#catalogo"
                className="transition hover:text-white"
              >
                Catálogo
              </Link>
            </li>

            <li>
              <Link
                href="/#nosotros"
                className="transition hover:text-white"
              >
                Nosotros
              </Link>
            </li>
          </ul>
        </nav>

      </div>
    </header>
  );
}