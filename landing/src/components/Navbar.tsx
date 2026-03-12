"use client";

import { useState } from "react";
import { config } from "@/lib/config";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-midnight-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold">
            S
          </span>
          SoulSquad
        </a>

        {/* Desktop */}
        <div className="hidden items-center gap-8 md:flex">
          <a href="#how-it-works" className="text-sm text-white/60 hover:text-white transition-colors">
            How it works
          </a>
          <a href="#agents" className="text-sm text-white/60 hover:text-white transition-colors">
            Your team
          </a>
          <a href="#pricing" className="text-sm text-white/60 hover:text-white transition-colors">
            Pricing
          </a>
          <a
            href={`${config.apiUrl}/api/auth/signin/google`}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500 transition-colors"
          >
            Get started free
          </a>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-white/60" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/5 bg-midnight-950 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <a href="#how-it-works" className="text-sm text-white/60" onClick={() => setOpen(false)}>
              How it works
            </a>
            <a href="#agents" className="text-sm text-white/60" onClick={() => setOpen(false)}>
              Your team
            </a>
            <a href="#pricing" className="text-sm text-white/60" onClick={() => setOpen(false)}>
              Pricing
            </a>
            <a
              href={`${config.apiUrl}/api/auth/signin/google`}
              className="rounded-lg bg-brand-600 px-4 py-2 text-center text-sm font-medium"
            >
              Get started free
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
