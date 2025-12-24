import Link from 'next/link'
import Image from 'next/image'

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
              <Link href="/pricing" className="btn-secondary">
                Pricing
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
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                <span className="text-primary glow-text">Create, Edit & Publish</span>
                <br />
                <span className="text-foreground">Your E-Books, Kids Books, Audiobooks & Coloring Books</span>
              </h1>
              <p className="text-xl text-foreground/80 mb-8 leading-relaxed">
                Welcome to the future of book creation. Whether you're crafting your first children's story, producing a professional audiobook, or designing interactive coloring pages, our all-in-one platform gives you everything you need to bring your vision to life with style and ease.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link href="/dashboard" className="btn-primary text-lg px-8 py-4">
                  Get Started Free
                </Link>
                <Link href="#features" className="btn-secondary text-lg px-8 py-4">
                  Explore Features
                </Link>
              </div>
            </div>

            {/* Right: Hero Image Placeholder */}
            <div className="relative h-[400px] lg:h-[500px] rounded-lg border-2 border-primary/30 bg-navy-card overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">📚</div>
                  <p className="text-foreground/60">Cozy workspace with creative tools</p>
                  <p className="text-sm text-foreground/40 mt-2">(Add your hero image here)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Our Platform */}
      <section id="features" className="section bg-navy-card">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-12 text-center">
            Why Choose Our Platform?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Feature 1 */}
            <div className="bg-navy border border-primary/20 p-8 rounded-lg">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center mb-6">
                <span className="text-3xl">🎤</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Modern Design</h3>
              <p className="text-foreground/70 leading-relaxed">
                Intuitive interface tailored for creators of all ages and skill levels, making book creation effortless and enjoyable.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-navy border border-primary/20 p-8 rounded-lg">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center mb-6">
                <span className="text-3xl">📑</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Multiple Formats</h3>
              <p className="text-foreground/70 leading-relaxed">
                Generate and edit e-books, kids books, audiobooks, and coloring books seamlessly in one powerful workspace.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-navy border border-primary/20 p-8 rounded-lg">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center mb-6">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Creative Freedom</h3>
              <p className="text-foreground/70 leading-relaxed">
                Empower your storytelling with professional tools built specifically for today's digital publishing landscape.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-navy border border-primary/20 p-8 rounded-lg">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center mb-6">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">AI Training Center</h3>
              <p className="text-foreground/70 leading-relaxed">
                Train our AI to match your exact tone, style, and voice for consistent, personalized content generation every time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Transform Your Ideas Into Beautiful E-Books */}
      <section className="section">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Transform Your Ideas Into Beautiful E-Books
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div>
              <h3 className="text-3xl font-bold text-secondary mb-6">
                Professional Publishing Made Simple
              </h3>
              <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
                Our easy drag-and-drop editor puts professional e-book design at your fingertips. Choose from customizable layouts and fonts that bring your words to life beautifully on every screen.
              </p>
              <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
                Integrate multimedia elements seamlessly—add images, embed audio narration, and create interactive features that engage readers like never before. Export in EPUB, PDF, and MOBI formats, ready for all major e-readers and apps instantly.
              </p>

              {/* Process Steps */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold">01</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-foreground mb-2">Design & Layout</h4>
                    <p className="text-foreground/70">Choose templates or start from scratch</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold">02</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-foreground mb-2">Add Multimedia</h4>
                    <p className="text-foreground/70">Enhance with images and interactive elements</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold">03</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-foreground mb-2">Export & Publish</h4>
                    <p className="text-foreground/70">One-click export to all major formats</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Image Placeholder */}
            <div className="relative h-[500px] rounded-lg border-2 border-primary/30 bg-navy-card overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">💻</div>
                  <p className="text-foreground/60">Laptop showing e-book editor</p>
                  <p className="text-sm text-foreground/40 mt-2">(Add your image here)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bring Kids' Stories to Life */}
      <section className="section bg-navy-card">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-12 text-center">
            Bring Kids' Stories to Life with Fun, Engaging Tools
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Image Placeholder */}
            <div className="relative h-[500px] rounded-lg border-2 border-primary/30 bg-navy overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🦊</div>
                  <p className="text-foreground/60">Whimsical illustrated scene</p>
                  <p className="text-sm text-foreground/40 mt-2">(Add your kids book illustration here)</p>
                </div>
              </div>
            </div>

            {/* Right: Features */}
            <div className="space-y-8">
              {/* Feature 1 */}
              <div className="border border-primary/20 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-foreground mb-4">Specialized Templates</h3>
                <p className="text-foreground/70 leading-relaxed">
                  Access beautifully designed templates created specifically for children's books and picture books. Choose from various themes, layouts, and age-appropriate designs that make your story shine.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="border border-primary/20 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-foreground mb-4">AI Illustration Magic</h3>
                <p className="text-foreground/70 leading-relaxed">
                  Generate stunning illustrations with our AI-powered art tools, or upload your own artwork. Mix and match to create the perfect visual narrative that captivates young readers.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="border border-primary/20 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-foreground mb-4">Collaborative Creation</h3>
                <p className="text-foreground/70 leading-relaxed">
                  Built-in features let parents, teachers, and young authors work together in real-time. Share drafts, give feedback, and co-create stories that inspire imagination and learning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Create Immersive Audiobooks */}
      <section className="section">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-12 text-center">
            Create Immersive Audiobooks with Custom Narration
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div>
              <h3 className="text-3xl font-bold text-secondary mb-6">
                Your Voice, Your Story
              </h3>
              <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
                Record or upload voice narration directly within our platform—no external software needed. Our intuitive audio editor makes it simple to create professional-quality audiobooks that bring your stories to life.
              </p>
              <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
                Sync audio perfectly with text and illustrations for a rich, multi-sensory storytelling experience. Ideal for educators reaching auditory learners, parents creating bedtime stories, and authors expanding their audience reach.
              </p>

              {/* Features */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-3xl">🎤</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-foreground mb-2">Easy Recording</h4>
                    <p className="text-foreground/70">Built-in studio-quality recording tools</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-3xl">🌊</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-foreground mb-2">Perfect Sync</h4>
                    <p className="text-foreground/70">Align audio with text automatically</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-3xl">🎧</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-foreground mb-2">Pro Quality</h4>
                    <p className="text-foreground/70">Export broadcast-ready audiobooks</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Image Placeholder */}
            <div className="relative h-[500px] rounded-lg border-2 border-primary/30 bg-navy-card overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🎙️</div>
                  <p className="text-foreground/60">Professional recording studio</p>
                  <p className="text-sm text-foreground/40 mt-2">(Add your audiobook studio image here)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-navy-card">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Ready to Start Creating?
          </h2>
          <p className="text-xl text-foreground/80 mb-8">
            Join thousands of authors, educators, and creators bringing their stories to life with HydraSkript.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/dashboard" className="btn-primary text-lg px-8 py-4">
              Get Started Free
            </Link>
            <Link href="/pricing" className="btn-secondary text-lg px-8 py-4">
              View Pricing
            </Link>
          </div>
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
