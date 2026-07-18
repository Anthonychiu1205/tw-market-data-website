export default function GlobalLoading() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="space-y-4">
        <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />
        <div className="h-10 w-3/4 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-11/12 animate-pulse rounded bg-slate-100" />
      </div>
    </main>
  );
}
