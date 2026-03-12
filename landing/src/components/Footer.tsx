export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-brand-600 text-xs font-bold">
              S
            </span>
            SoulSquad
          </div>
          <div className="flex gap-6 text-sm text-white/30">
            <a href="https://github.com/iamevandrake/opensoul" className="hover:text-white/60 transition-colors">
              Open source
            </a>
            <a href="mailto:hello@soulsquad.ai" className="hover:text-white/60 transition-colors">
              Contact
            </a>
          </div>
          <p className="text-sm text-white/20">
            &copy; {new Date().getFullYear()} Simhasana LLC
          </p>
        </div>
      </div>
    </footer>
  );
}
