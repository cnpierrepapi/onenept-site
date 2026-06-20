const STACK = [
  'Claude API', 'AI Agents & Tool Use', 'RAG / pgvector',
  'Next.js', 'TypeScript', 'Supabase', 'Solana / Web3', 'Stripe',
]

const PROJECTS = [
  {
    title: 'Company Intelligence Agent',
    description:
      'ReAct agent that researches any company via live web search, returns a structured brief — decision makers, pain points, talking points, and a suggested opening line.',
    tags: ['AI Agent', 'Tool Use', 'Next.js'],
    href: 'https://company-intel-tau.vercel.app',
    label: 'company-intel',
  },
  {
    title: 'Document Chat (RAG)',
    description:
      'Upload a PDF, paste text, or drop a URL. The app chunks and embeds the content into pgvector, then streams answers with source citations via Claude Haiku.',
    tags: ['RAG', 'Voyage AI', 'pgvector'],
    href: 'https://doc-chat-beige-beta.vercel.app',
    label: 'doc-chat',
  },
  {
    title: 'Warmleads',
    description:
      'Full-stack lead intelligence SaaS. Natural-language search returns AI-scored business leads with enriched contact info. Live with Stripe + Paystack billing.',
    tags: ['SaaS', 'Claude', 'Supabase'],
    href: 'https://warmleads.app',
    label: 'warmleads.app',
  },
]

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
    </svg>
  )
}

function ExternalLink({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-4.5-6H18m0 0v4.5m0-4.5L10.5 13.5" />
    </svg>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 sm:px-12 py-6 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <img src="/logo.jpg" alt="Onenept" className="w-8 h-8 rounded-md" />
          <span className="text-sm font-medium text-zinc-400 tracking-tight">Onenept</span>
        </div>
        <a
          href="https://www.upwork.com/freelancers/~yourprofile"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-700 bg-zinc-900 text-sm text-zinc-300 hover:border-zinc-500 hover:text-white transition-all"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Available for work
        </a>
      </nav>

      {/* Hero */}
      <main className="px-6 sm:px-12 pt-16 pb-24 max-w-5xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-start gap-10">
          <img
            src="/founder.jpg"
            alt="Chukwudumaga Nnawuogo-Pierre"
            className="w-24 h-24 rounded-2xl object-cover object-top shrink-0"
          />
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-2">
              AI Integration Developer · Malta
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
              Chukwudumaga<br />
              <span className="text-zinc-400">Nnawuogo-Pierre</span>
            </h1>
            <p className="mt-5 text-lg text-zinc-400 max-w-xl leading-relaxed">
              I build AI agents, RAG pipelines, and workflow automations —
              connecting LLM APIs to real products, from prototype to production.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://www.upwork.com/freelancers/~yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-100 transition-colors"
              >
                Hire me on Upwork
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="mailto:admin@onenept.com"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-700 text-sm font-medium text-zinc-300 hover:border-zinc-500 hover:text-white transition-all"
              >
                admin@onenept.com
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Work */}
      <section className="px-6 sm:px-12 py-16 max-w-5xl mx-auto w-full">
        <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-8">
          Selected work
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PROJECTS.map((p) => (
            <a
              key={p.title}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-zinc-600 hover:bg-zinc-900/70 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-md bg-zinc-800 text-xs text-zinc-400">
                      {t}
                    </span>
                  ))}
                </div>
                <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0 mt-0.5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{p.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed flex-1">{p.description}</p>
              <span className="mt-5 text-xs text-zinc-600 group-hover:text-zinc-400 transition-colors">
                {p.label} ↗
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Stack */}
      <section className="px-6 sm:px-12 py-16 max-w-5xl mx-auto w-full border-t border-zinc-900">
        <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-6">
          Stack
        </h2>
        <div className="flex flex-wrap gap-2">
          {STACK.map((s) => (
            <span
              key={s}
              className="px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 text-sm text-zinc-300"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 sm:px-12 py-10 border-t border-zinc-900 max-w-5xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-sm text-zinc-600">
          <span>© {new Date().getFullYear()} Onenept Studios Inc.</span>
          <div className="flex items-center gap-6">
            <a
              href="https://www.linkedin.com/in/cenpierrepapi/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-300 transition-colors"
            >
              LinkedIn
            </a>
            <a href="mailto:admin@onenept.com" className="hover:text-zinc-300 transition-colors">
              Email
            </a>
          </div>
        </div>
      </footer>

    </div>
  )
}
