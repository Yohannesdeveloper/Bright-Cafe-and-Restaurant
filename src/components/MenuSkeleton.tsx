export function MenuSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fafafa] to-white dark:from-[#050508] dark:to-[#0a0a12] text-black dark:text-white animate-pulse">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#050508]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/[0.04]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:py-3.5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10" />
            <div className="h-4 w-20 rounded bg-black/5 dark:bg-white/10" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-black/5 dark:bg-white/10" />
            <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/10" />
          </div>
        </div>
      </header>

      {/* Hero Skeleton */}
      <div className="relative px-4 pb-8 pt-8 text-center flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-black/5 dark:bg-white/10 mb-6" />
        <div className="h-8 w-64 rounded bg-black/10 dark:bg-white/20 mb-3" />
        <div className="h-4 w-48 rounded bg-black/5 dark:bg-white/10" />
      </div>

      {/* Search Bar Skeleton */}
      <div className="mx-auto max-w-7xl px-4 pb-5">
        <div className="w-full h-11 rounded-xl bg-black/5 dark:bg-white/10" />
      </div>

      {/* Category Tabs Skeleton */}
      <nav className="mx-auto max-w-7xl px-4 py-3 flex gap-2 overflow-x-auto">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-24 rounded-xl bg-black/5 dark:bg-white/10 shrink-0" />
        ))}
      </nav>

      {/* Menu Grid Skeleton */}
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-6">
        <div className="h-6 w-32 rounded bg-black/10 dark:bg-white/20 mb-6 mx-auto" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-black/5 dark:border-white/[0.06] bg-white dark:bg-neutral-900/50 p-1.5 sm:p-2 flex gap-2">
              <div className="w-[8rem] h-[8rem] sm:w-[10rem] sm:h-[10rem] rounded-xl bg-black/5 dark:bg-white/10 shrink-0" />
              <div className="flex-1 p-2 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-3/4 rounded bg-black/5 dark:bg-white/10" />
                  <div className="h-3 w-1/2 rounded bg-black/5 dark:bg-white/5" />
                </div>
                <div className="flex justify-between items-center mt-auto">
                  <div className="h-5 w-1/3 rounded bg-black/5 dark:bg-white/10" />
                  <div className="w-9 h-9 rounded-xl bg-black/5 dark:bg-white/10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
