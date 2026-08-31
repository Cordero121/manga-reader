"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase/client";

interface PanelLayoutProps {
  children: ReactNode;
}

export default function PanelLayout({
  children,
}: PanelLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [cargando, setCargando] = useState(true);

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

      setCargando(false);
    };

    comprobarSesion();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && !esLogin) {
        router.replace("/panel/login");
      }
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
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div>
          <p className="text-sm font-semibold">
            Panel de administración
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
        >
          Cerrar sesión
        </button>
      </div>
    </header>

    {children}
  </>
);
}