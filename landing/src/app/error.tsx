"use client";

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-midnight-950 px-6">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-brand-400">500</h1>
        <p className="mt-4 text-lg text-white/50">Something went wrong.</p>
        <a
          href="/"
          className="mt-8 inline-block rounded-xl bg-brand-600 px-6 py-3 font-medium text-white hover:bg-brand-500 transition-colors"
        >
          Back to home
        </a>
      </div>
    </div>
  );
}
