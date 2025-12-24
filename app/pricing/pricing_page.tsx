import Link from 'next/link'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-navy">
      {/* Navigation */}
      <nav className="border-b border-navy-light bg-navy-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-4">
              <img 
                src="/HYDRASKRIPT_LOGO6.jpg" 
                alt="Hydraskript Logo" 
                className="h-12 w-auto rounded-md border border-primary/30"
              />
              <h1 className="text-2xl font-bold text-primary">
                HydraSkript
              </h1>
            </Link>
            <div className="flex gap-3">
              <Link href="/" className="btn-secondary">
                Home
              </Link>
              <Link href="/dashboard" className="btn-primary">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-card to-navy opacity-50"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-primary text-lg mb-4 font-semibold">HydraSkript Pricing</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-primary glow-text">Stop Writing.</span>
              <br />
              <span className="text-foreground">Start Publishing.</span>
            </h1>
            <p className="text-xl text-foreground/80 mb-4">
              HydraSkript isn't another "AI writer." It's a <span className="text-secondary font-semibold">book production engine</span>.
            </p>
            <p className="text-lg text-foreground/70 mb-10 max-w-3xl mx-auto leading-relaxed">
              Outlines. Chapters. Editorial logic. Covers. Audio. Exports. If your goal is <em className="text-primary">finished books</em> — not half-written drafts — you're in the right place.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href="#pricing" className="btn-primary text-lg px-8 py-4">
                View Pricing
              </a>
              <a href="#comparison" className="btn-secondary text-lg px-8 py-4">
                Compare Plans
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why HydraSkript Exists */}
      <section id="comparison" className="section bg-navy-card">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8">
            Why HydraSkript Exists
          </h2>
          <p className="text-xl text-foreground/80 mb-12">
            Most tools help you <em className="text-secondary">start</em> writing. HydraSkript helps you <span className="text-primary font-semibold">finish and publish</span>.
          </p>
          
          <p className="text-lg text-foreground/70 mb-8">Here's the difference:</p>

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
      <section id="pricing" className="section">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-4xl md:text-5xl font-bold text-primary mb-16">
            Choose Your Weapon
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter */}
            <div className="relative bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border-2 border-cyan-500/30 rounded-lg p-8 hover:border-cyan-500/50 transition-all">
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">🏅</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Starter</h3>
                <p className="text-foreground/60 italic">Test the Waters</p>
              </div>
              <div className="mb-6">
                <div className="text-5xl font-bold text-cyan-400 mb-2">
                  $29<span className="text-xl text-foreground/60"> / month</span>
                </div>
                <p className="text-sm text-foreground/70">Perfect for testing ideas and kicking the tyres.</p>
              </div>
              <div className="space-y-3 mb-8">
                <p className="font-semibold text-foreground">Includes:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">•</span>
                    <span className="text-foreground/80">100 credits / month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">•</span>
                    <span className="text-foreground/80">Outline & chapter generation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">•</span>
                    <span className="text-foreground/80">Partial book creation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">•</span>
                    <span className="text-foreground/80">1 active project</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">•</span>
                    <span className="text-foreground/80">PDF export</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">•</span>
                    <span className="text-foreground/80">Standard processing queue</span>
                  </li>
                </ul>
              </div>
              <p className="text-sm text-foreground/70 mb-6">
                <strong>Best for:</strong> indie writers, bloggers, the "maybe I'll write a book" crowd.
              </p>
              <Link href="/dashboard" className="btn-secondary w-full text-center">
                Get Started
              </Link>
            </div>

            {/* Author - Most Popular */}
            <div className="relative bg-gradient-to-br from-blue-500/10 to-purple-600/10 border-2 border-primary rounded-lg p-8 hover:border-primary/80 transition-all transform lg:scale-105">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                <span>⭐</span> Most Popular
              </div>
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">🏅</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Author</h3>
                <p className="text-foreground/60 italic">Where Real Books Are Born</p>
              </div>
              <div className="mb-6">
                <div className="text-5xl font-bold text-primary mb-2">
                  $79<span className="text-xl text-foreground/60"> / month</span>
                </div>
                <p className="text-sm text-foreground/70">This is where HydraSkript starts paying for itself.</p>
              </div>
              <div className="space-y-3 mb-8">
                <p className="font-semibold text-foreground">Includes:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-foreground/80">400 credits / month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-foreground/80">Generate <strong>1 full-length book per month</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-foreground/80">PDF, EPUB & DOCX exports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-foreground/80">AI cover generation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-foreground/80">Editorial analysis pass</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-foreground/80">5 active projects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-foreground/80">Faster processing queue</span>
                  </li>
                </ul>
              </div>
              <p className="text-sm text-foreground/70 mb-6">
                <strong>Best for:</strong> authors, educators, serious creators.
              </p>
              <Link href="/dashboard" className="btn-primary w-full text-center">
                Get Started
              </Link>
            </div>

            {/* Publisher */}
            <div className="relative bg-gradient-to-br from-gray-700/10 to-gray-900/10 border-2 border-gray-500/30 rounded-lg p-8 hover:border-gray-500/50 transition-all">
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">🏅</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Publisher</h3>
                <p className="text-foreground/60 italic">Scale the Output</p>
              </div>
              <div className="mb-6">
                <div className="text-5xl font-bold text-primary mb-2">
                  $149<span className="text-xl text-foreground/60"> / month</span>
                </div>
                <p className="text-sm text-foreground/70">For people who publish, not dabble.</p>
              </div>
              <div className="space-y-3 mb-8">
                <p className="font-semibold text-foreground">Includes:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span className="text-foreground/80">1,000 credits / month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span className="text-foreground/80">2–3 full books per month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span className="text-foreground/80">Audiobook generation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span className="text-foreground/80">Advanced editorial logic</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span className="text-foreground/80">Series & multi-book workflows</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span className="text-foreground/80">Highest priority queue</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span className="text-foreground/80">Early access to new features</span>
                  </li>
                </ul>
              </div>
              <p className="text-sm text-foreground/70 mb-6">
                <strong>Best for:</strong> publishers, agencies, content businesses.
              </p>
              <Link href="/dashboard" className="btn-secondary w-full text-center">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-navy-card">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Ready to Start Publishing?
          </h2>
          <p className="text-xl text-foreground/80 mb-8">
            Choose your plan and start creating finished books today.
          </p>
          <Link href="/dashboard" className="btn-primary text-lg px-8 py-4">
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-navy-light bg-navy py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-foreground/60">
            © 2024 HydraSkript. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
