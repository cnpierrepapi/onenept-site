export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#09090b] text-white font-sans">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 sm:px-12 py-6 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <img
            src="/logo.jpg"
            alt="Onenept Studios"
            className="w-9 h-9 rounded-lg"
          />
          <span className="text-lg font-semibold tracking-tight">
            Onenept Studios
          </span>
        </div>
        <a
          href="mailto:hello@onenept.com"
          className="text-sm text-zinc-400 hover:text-white transition-colors"
        >
          Contact
        </a>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 text-sm text-zinc-400 mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Building in public
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-tight">
          AI tools that help
          <br />
          <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
            freelancers grow
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-2xl leading-relaxed">
          Onenept Studios is an AI development corporation building intelligent
          tools that help digital freelancers find clients, close deals, and
          scale their business.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <a
            href="https://warmleads.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white text-black font-medium text-base hover:bg-zinc-200 transition-colors"
          >
            Visit Warmleads
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
              />
            </svg>
          </a>
        </div>
      </main>

      {/* Product Section */}
      <section className="px-6 sm:px-12 py-24 max-w-6xl mx-auto w-full">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 sm:p-12">
          <div className="flex flex-col sm:flex-row sm:items-start gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 text-sm text-emerald-400 font-medium mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Flagship Product
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Warmleads
              </h2>
              <p className="mt-4 text-zinc-400 leading-relaxed max-w-lg">
                AI-powered lead intelligence for digital freelancers. Upload
                your niche, get scored leads with contact info, engagement
                signals, and conversion potential — so you spend less time
                prospecting and more time closing.
              </p>
              <a
                href="https://warmleads.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-6 text-sm font-medium text-white hover:text-zinc-300 transition-colors"
              >
                warmleads.app
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-4.5-6H18m0 0v4.5m0-4.5L10.5 13.5"
                  />
                </svg>
              </a>
            </div>
            <div className="flex flex-col gap-4 sm:text-right">
              <div>
                <div className="text-3xl font-bold">5,000+</div>
                <div className="text-sm text-zinc-500">Leads scored</div>
              </div>
              <div>
                <div className="text-3xl font-bold">AI</div>
                <div className="text-sm text-zinc-500">Powered enrichment</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="px-6 sm:px-12 py-16 max-w-6xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
          <img
            src="/founder.jpg"
            alt="Chukwudumaga Nnawuogo-Pierre"
            className="w-28 h-28 rounded-2xl object-cover object-top"
          />
          <div>
            <div className="text-sm text-zinc-500 font-medium mb-1">
              Founder &amp; Director
            </div>
            <h3 className="text-xl font-bold tracking-tight">
              Chukwudumaga Nnawuogo-Pierre
            </h3>
            <p className="mt-2 text-zinc-400 max-w-lg leading-relaxed">
              Building at the intersection of AI, culture, and digital commerce.
            </p>
            <a
              href="https://www.linkedin.com/in/cenpierrepapi/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 sm:px-12 py-8 border-t border-zinc-900 max-w-6xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-sm text-zinc-500">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <span className="text-zinc-400 font-medium">
              Onenept Studios Inc.
            </span>
            <span>1401 Pennsylvania Avenue #5158</span>
            <span>Wilmington, DE 19806-4125</span>
          </div>
          <div className="flex flex-col gap-1 text-center sm:text-right">
            <a
              href="mailto:hello@onenept.com"
              className="hover:text-zinc-300 transition-colors"
            >
              hello@onenept.com
            </a>
            <span>&copy; {new Date().getFullYear()} Onenept Studios Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
