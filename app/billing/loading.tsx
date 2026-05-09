function Pulse({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200/70 ${className}`} />;
}

export default function BillingLoading() {
  return (
    <div className="h-[calc(100dvh-73px)] overflow-hidden px-4 py-4 lg:px-8 lg:py-6">
      <div className="grid h-full min-h-0 gap-4 overflow-hidden lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="min-h-0 h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-4">
          <Pulse className="h-5 w-20" />
          <div className="mt-6 space-y-3">
            <Pulse className="h-10 w-full" />
            <Pulse className="h-10 w-full" />
            <Pulse className="h-10 w-full" />
          </div>
        </aside>
        <main className="min-h-0 min-w-0 h-full overflow-y-auto pr-1">
          <div className="space-y-4">
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <Pulse className="h-6 w-32" />
              <Pulse className="mt-3 h-4 w-72 max-w-full" />
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <Pulse className="h-5 w-24" />
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <Pulse className="h-20 w-full" />
                <Pulse className="h-20 w-full" />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
