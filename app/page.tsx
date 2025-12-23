import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-navy">
      {/* Navigation */}
      <nav className="border-b border-navy-light bg-navy-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img 
                src="/HYDRASKRIPT_LOGO6.jpg" 
                alt="Hydraskript Logo" 
                className="h-12 w-auto rounded-md border border-primary/30"
              />
              <h1 className="text-2xl font-bold text-primary">
                HydraSkript
              </h1>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard" className="btn-primary">
                Dashboard
              </Link>
              <Link href="/admin" className="btn-secondary">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="section-title text-primary glow-text">
              Stop Writing. Start Publishing.
            </h1>
            <p className="section-subtitle">
              HydraSkript isn't another "AI writer." It's a <span className="text-secondary font-semibold">book production engine</span>.
            </p>
            <p className="text-lg text-foreground/70 mb-10 max-w-3xl mx-auto">
              Outlines. Chapters. Editorial logic. Covers. Audio. Exports. If your goal is <em className="text-primary">finished books</em> — not half-written drafts — you're in the right place.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/dashboard" className="btn-primary text-lg px-8 py-4">
                View Pricing
              </Link>
              <Link href="/admin" className="btn-secondary text-lg px-8 py-4">
                Compare Plans
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why HydraSkript Exists */}
      <section className="section bg-navy-card">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8">
            Why HydraSkript Exists
          </h2>
          <p className="text-xl text-foreground/80 mb-12">
            Most tools help you <em className="text-secondary">start</em> writing. HydraSkript helps you <span className="text-primary font-semibold">finish and publish</span>.
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-primary/30">
                  <th className="text-left py-4 px-4 text-foreground font-semibold">Feature</th>
                  <th className="text-left py-4 px-4 text-primary font-semibold">HydraSkript</th>
                  <th className="text-left py-4 px-4 text-foreground/60 font-semibold">AI Writing Tools</th>
                  <th className="text-left py-4 px-4 text-foreground/60 font-semibold">Hiring a Human</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-light">
                <tr>
                  <td className="py-4 px-4 text-foreground/90">Full book generation</td>
                  <td className="py-4 px-4"><span className="text-success">✅</span> End-to-end</td>
                  <td className="py-4 px-4"><span className="text-red-400">❌</span> Fragmented</td>
                  <td className="py-4 px-4"><span className="text-success">✅</span> Slow & manual</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-foreground/90">Structured outlines & chapters</td>
                  <td className="py-4 px-4"><span className="text-success">✅</span> Built-in</td>
                  <td className="py-4 px-4"><span className="text-warning">⚠️</span> Partial</td>
                  <td className="py-4 px-4"><span className="text-success">✅</span></td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-foreground/90">Editorial logic & analysis</td>
                  <td className="py-4 px-4"><span className="text-success">✅</span> Included</td>
                  <td className="py-4 px-4"><span className="text-red-400">❌</span></td>
                  <td className="py-4 px-4"><span className="text-warning">⚠️</span> Extra cost</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-foreground/90">Covers & formatting</td>
                  <td className="py-4 px-4"><span className="text-success">✅</span> Yes</td>
                  <td className="py-4 px-4"><span className="text-red-400">❌</span></td>
                  <td className="py-4 px-4"><span className="text-warning">⚠️</span> Extra cost</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-foreground/90">Audiobook generation</td>
                  <td className="py-4 px-4"><span className="text-success">✅</span> Yes</td>
                  <td className="py-4 px-4"><span className="text-red-400">❌</span></td>
                  <td className="py-4 px-4"><span className="text-warning">⚠️</span> Very expensive</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-foreground/90">Publish-ready exports</td>
                  <td className="py-4 px-4"><span className="text-success">✅</span> PDF / EPUB / DOCX</td>
                  <td className="py-4 px-4"><span className="text-warning">⚠️</span> Copy-paste</td>
                  <td className="py-4 px-4"><span className="text-red-400">❌</span></td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-foreground/90">Time to finished book</td>
                  <td className="py-4 px-4 text-secondary font-semibold">Days</td>
                  <td className="py-4 px-4 text-foreground/60">Weeks</td>
                  <td className="py-4 px-4 text-foreground/60">Months</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-foreground/90">Cost per book</td>
                  <td className="py-4 px-4 text-secondary font-semibold">$20–$100</td>
                  <td className="py-4 px-4 text-foreground/60">$100s + time</td>
                  <td className="py-4 px-4 text-foreground/60">$3,000–$15,000</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-foreground/90">You own the rights</td>
                  <td className="py-4 px-4"><span className="text-success">✅</span> Always</td>
                  <td className="py-4 px-4"><span className="text-warning">⚠️</span> Depends</td>
                  <td className="py-4 px-4"><span className="text-warning">⚠️</span> Contract-based</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <p className="text-xl text-primary mt-12 font-semibold">
            HydraSkript replaces tools, freelancers, and waiting.
          </p>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="section">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center section-title mb-16">Choose Your Weapon</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Starter */}
            <div className="pricing-card pricing-card-starter">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">🏅</div>
                <h3 className="text-2xl font-bold text-foreground mb-1">Starter</h3>
                <p className="text-foreground/60 italic">Test the Waters</p>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-bold text-secondary mb-2">$29<span className="text-xl text-foreground/60"> / month</span></div>
                <p className="text-sm text-foreground/70">Perfect for testing ideas and kicking the tyres.</p>
              </div>
              <div className="space-y-3 mb-6">
                <p className="font-semibold text-foreground">Includes:</p>
                <ul className="space-y-2 text-sm">
                  <li className="feature-item"><span className="feature-icon">•</span> 100 credits / month</li>
                  <li className="feature-item"><span className="feature-icon">•</span> Outline & chapter generation</li>
                  <li className="feature-item"><span className="feature-icon">•</span> Partial book creation</li>
                  <li className="feature-item"><span className="feature-icon">•</span> 1 active project</li>
                  <li className="feature-item"><span className="feature-icon">•</span> PDF export</li>
                  <li className="feature-item"><span className="feature-icon">•</span> Standard processing queue</li>
                </ul>
              </div>
              <p className="text-sm text-foreground/70"><strong>Best for:</strong> indie writers, bloggers, the "maybe I'll write a book" crowd.</p>
            </div>

            {/* Author - Most Popular */}
            <div className="pricing-card pricing-card-author relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
                ⭐ Most Popular
              </div>
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">🏅</div>
                <h3 className="text-2xl font-bold text-foreground mb-1">Author</h3>
                <p className="text-foreground/60 italic">Where Real Books Are Born</p>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-bold text-primary mb-2">$79<span className="text-xl text-foreground/60"> / month</span></div>
                <p className="text-sm text-foreground/70">This is where HydraSkript starts paying for itself.</p>
              </div>
              <div className="space-y-3 mb-6">
                <p className="font-semibold text-foreground">Includes:</p>
                <ul className="space-y-2 text-sm">
                  <li className="feature-item"><span className="feature-icon">•</span> 400 credits / month</li>
                  <li className="feature-item"><span className="feature-icon">•</span> Generate <strong>1 full-length book per month</strong></li>
                  <li className="feature-item"><span className="feature-icon">•</span> PDF, EPUB & DOCX exports</li>
                  <li className="feature-item"><span className="feature-icon">•</span> AI cover generation</li>
                  <li className="feature-item"><span className="feature-icon">•</span> Editorial analysis pass</li>
                  <li className="feature-item"><span className="feature-icon">•</span> 5 active projects</li>
                  <li className="feature-item"><span className="feature-icon">•</span> Faster processing queue</li>
                </ul>
              </div>
              <p className="text-sm text-foreground/70"><strong>Best for:</strong> authors, educators, serious creators.</p>
            </div>

            {/* Publisher */}
            <div className="pricing-card pricing-card-publisher">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">🏅</div>
                <h3 className="text-2xl font-bold text-foreground mb-1">Publisher</h3>
                <p className="text-foreground/60 italic">Scale the Output</p>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-bold text-primary mb-2">$149<span className="text-xl text-foreground/60"> / month</span></div>
                <p className="text-sm text-foreground/70">For people who publish, not dabble.</p>
              </div>
              <div className="space-y-3 mb-6">
                <p className="font-semibold text-foreground">Includes:</p>
                <ul className="space-y-2 text-sm">
                  <li className="feature-item"><span className="feature-icon">•</span> 1,000 credits / month</li>
                  <li className="feature-item"><span className="feature-icon">•</span> 2-3 full books per month</li>
                  <li className="feature-item"><span className="feature-icon">•</span> Audiobook generation</li>
                  <li className="feature-item"><span className="feature-icon">•</span> Advanced editorial logic</li>
                  <li className="feature-item"><span className="feature-icon">•</span> Series & multi-book workflows</li>
                  <li className="feature-item"><span className="feature-icon">•</span> Highest priority queue</li>
                  <li className="feature-item"><span className="feature-icon">•</span> Early access to new features</li>
                </ul>
              </div>
              <p className="text-sm text-foreground/70"><strong>Best for:</strong> publishers, agencies, content businesses.</p>
            </div>

            {/* Studio */}
            <div className="pricing-card pricing-card-studio">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">🐉</div>
                <h3 className="text-2xl font-bold text-foreground mb-1">Studio</h3>
                <p className="text-foreground/60 italic">IP Factory Mode</p>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-bold text-secondary mb-2">From $299<span className="text-xl text-foreground/60"> / month</span></div>
                <p className="text-sm text-foreground/70">Built for volume, teams, and commercial scale.</p>
              </div>
              <div className="space-y-3 mb-6">
                <p className="font-semibold text-foreground">Includes:</p>
                <ul className="space-y-2 text-sm">
                  <li className="feature-item"><span className="feature-icon">•</span> 3,000+ credits</li>
                  <li className="feature-item"><span className="feature-icon">•</span> Bulk & batch generation</li>
                  <li className="feature-item"><span className="feature-icon">•</span> White-label exports</li>
                  <li className="feature-item"><span className="feature-icon">•</span> Team accounts</li>
                  <li className="feature-item"><span className="feature-icon">•</span> Priority support</li>
                  <li className="feature-item"><span className="feature-icon">•</span> Commercial licensing included</li>
                  <li className="feature-item"><span className="feature-icon">•</span> API access (coming soon)</li>
                </ul>
              </div>
              <p className="text-sm text-foreground/70"><strong>Best for:</strong> studios, IP farms, serious operators.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-to-br from-navy-card to-navy">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 glow-text">
            Ready to Publish?
          </h2>
          <p className="text-2xl text-secondary mb-4">
            Stop flirting with the idea of a book.
          </p>
          <p className="text-2xl text-primary mb-10">
            Start shipping them.
          </p>
          <Link href="/dashboard" className="btn-primary text-xl px-10 py-5 inline-block">
            Get Started with HydraSkript →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-navy-light py-8 bg-navy-card">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-foreground/60">
            Magnus Opus Hydraskript © 2025 | AI-Powered Book Production Engine
          </p>
        </div>
      </footer>
    </div>
  )
}
