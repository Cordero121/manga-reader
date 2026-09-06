"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase/client";
import Link from "next/link";

interface PanelLayoutProps {
  children: ReactNode;
}

export default function PanelLayout({
  children,
}: PanelLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [cargando, setCargando] = useState(true);

const [emailUsuario, setEmailUsuario] = useState<string | null>(null);
  
const esLogin = pathname === "/panel/login";
    
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/panel/login");
    };

  useEffect(() => {
    if (esLogin) {
      setCargando(false);
      return;
    }

    const comprobarSesion = async () => {
      const {
  data: { session },
} = await supabase.auth.getSession();

if (!session) {
  router.replace("/panel/login");
  return;
}

setEmailUsuario(session.user.email ?? null);
setCargando(false);
    };

    comprobarSesion();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
  if (!session && !esLogin) {
    setEmailUsuario(null);
    router.replace("/panel/login");
    return;
  }

  setEmailUsuario(session?.user.email ?? null);
});

    return () => {
      subscription.unsubscribe();
    };
  }, [router, pathname, esLogin]);

  if (esLogin) {
    return children;
  }

  if (cargando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <p className="text-sm text-zinc-400">
          Comprobando sesión...
        </p>
      </main>
    );
  }

  return (
  <>
    <header className="border-b border-zinc-800 bg-zinc-950 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
        
        <div>
          <p className="text-sm font-semibold">
            Panel de administración
          </p>

          {emailUsuario && (
            <p className="mt-1 text-xs text-zinc-500">
              {emailUsuario}
            </p>
          )}
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          <Link
            href="/panel/obras/nueva"
            className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
          >
            Nueva obra
          </Link>

          <Link
            href="/panel/capitulos"
            className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
          >
            Nuevo capítulo
          </Link>
          <Link
            href="/panel/obras"
            className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
          >
            Gestionar obras
          </Link>

          <Link
            href="/"
            target="_blank"
            className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
          >
            Ver como lector
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-red-900 px-3 py-2 text-sm text-red-400 transition hover:bg-red-950"
          >
            Cerrar sesión
          </button>
        </nav>
      </div>
    </header>

    {children}
  </>
);
}