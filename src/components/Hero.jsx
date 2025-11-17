import ArrowTargetBackground from './ArrowTargetBackground'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-white">
      <ArrowTargetBackground />

      {/* Premium dark overlay with subtle glass gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-20%,rgba(59,130,246,0.12),transparent_60%)]" />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        {/* Logo / Brand */}
        <div className="mx-auto mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2 backdrop-blur-md shadow-[0_0_40px_rgba(59,130,246,0.15)]">
          <div className="relative h-6 w-6">
            <svg viewBox="0 0 40 40" className="absolute inset-0">
              <circle cx="20" cy="20" r="10" stroke="white" strokeOpacity="0.8" strokeWidth="2" fill="none" />
              <circle cx="20" cy="20" r="4" fill="white" fillOpacity="0.9" />
            </svg>
            <svg viewBox="0 0 40 40" className="absolute inset-0">
              <path d="M8 30 L22 22" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <path d="M22 22 L28 23 L26 17 Z" fill="white" />
            </svg>
          </div>
          <span className="text-xl font-semibold tracking-tight">Target™</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
          Let’s hit your target
        </h1>

        <p className="mt-6 text-white/80 text-lg max-w-2xl mx-auto">
          A premium, minimalist exploit-script experience with a focus on precision and elegance.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#get-script"
            className="group inline-flex items-center justify-center rounded-md bg-white text-black px-6 py-3 font-semibold tracking-tight shadow-[0_10px_30px_rgba(59,130,246,0.25)] hover:shadow-[0_14px_40px_rgba(59,130,246,0.35)] transition-all"
          >
            Get Script
            <span className="ml-2 inline-block opacity-70 group-hover:translate-x-0.5 transition-transform">→</span>
          </a>

          <a
            href="https://discord.gg/6FewA588"
            target="_blank" rel="noreferrer"
            className="inline-flex items-center justify-center rounded-md border border-white/20 bg-white/5 hover:bg-white/10 px-6 py-3 font-semibold tracking-tight backdrop-blur-md transition-colors"
          >
            Discord
          </a>
        </div>

        {/* Loadstring Panel */}
        <div id="get-script" className="mt-12 mx-auto max-w-2xl">
          <div className="relative rounded-xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur-md shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
            <div className="absolute -inset-px rounded-xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
            <div className="flex items-center justify-between">
              <span className="text-sm uppercase tracking-widest text-white/60">Loadstring</span>
              <span className="text-xs text-white/50">Copy</span>
            </div>
            <pre className="mt-3 select-text text-white/90 text-sm md:text-base whitespace-pre-wrap">SOON™</pre>
          </div>
          <p className="mt-2 text-center text-xs text-white/40">Replace this with your actual loadstring when ready.</p>
        </div>
      </div>
    </section>
  )
}
