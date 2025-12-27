import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-4">
              <img 
                src="/HYDRASKRIPT_LOGO6.jpg" 
                alt="Hydraskript Logo" 
                className="h-12 w-auto rounded-md"
              />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                HydraSkript
              </h1>
            </Link>
            <div className="flex gap-3">
              <Link href="/pricing" className="px-6 py-2 text-white hover:text-cyan-400 transition-colors">
                Pricing
              </Link>
              <Link href="/dashboard" className="px-6 py-2 text-white hover:text-cyan-400 transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Page 1 */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div>
              <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Create, Edit & Publish Your E-Books, Kids Books, Audiobooks & Coloring Books — All in One Stylish Platform
                </span>
              </h1>
              <p className="text-lg text-gray-300 mb-10 leading-relaxed">
                Welcome to the future of book creation. Whether you're crafting your first children's story, producing a professional audiobook, or designing interactive coloring pages, our all-in-one platform gives you everything you need to bring your vision to life with style and ease.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link 
                  href="/dashboard" 
                  className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Get Started Free
                </Link>
                <Link 
                  href="#features" 
                  className="px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-lg hover:bg-white hover:text-black transition-all"
                >
                  Explore Features
                </Link>
              </div>
            </div>

            {/* Right: Image Placeholder */}
            <div className="relative h-[400px] lg:h-[600px] rounded-lg overflow-hidden bg-gray-900">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">📚</div>
                  <p className="text-gray-400">Add your cozy workspace image here</p>
                  <p className="text-sm text-gray-600 mt-2">(Tablet with colorful illustration, books, colored pencils)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Our Platform - Page 2 */}
      <section id="features" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Feature Cards */}
            <div>
              <h2 className="text-5xl lg:text-6xl font-bold mb-12 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Why Choose Our Platform?
              </h2>
              
              <div className="space-y-6">
                {/* Feature 1 */}
                <div className="bg-[#2a2a2a] p-8 rounded-lg">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Modern Design</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Intuitive interface tailored for creators of all ages and skill levels, making book creation effortless and enjoyable.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-[#2a2a2a] p-8 rounded-lg">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Multiple Formats</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Generate and edit e-books, kids books, audiobooks, and coloring books seamlessly in one powerful workspace.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-[#2a2a2a] p-8 rounded-lg">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Creative Freedom</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Empower your storytelling with professional tools built specifically for today's digital publishing landscape.
                  </p>
                </div>

                {/* Feature 4 */}
                <div className="bg-[#2a2a2a] p-8 rounded-lg">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">AI Training Center</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Train our AI to match your exact tone, style, and voice for consistent, personalized content generation every time.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Image Placeholder */}
            <div className="relative h-[600px] lg:h-[800px] rounded-lg overflow-hidden bg-gray-900">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">👥</div>
                  <p className="text-gray-400">Add group collaboration image here</p>
                  <p className="text-sm text-gray-600 mt-2">(People working together around tablet)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transform Your Ideas - Page 3 */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Transform Your Ideas Into Beautiful E-Books
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left: Content */}
            <div>
              <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Professional Publishing Made Simple
              </h3>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Our easy drag-and-drop editor puts professional e-book design at your fingertips. Choose from customizable layouts and fonts that bring your words to life beautifully on every screen.
              </p>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Integrate multimedia elements seamlessly—add images, embed audio narration, and create interactive features that engage readers like never before. Export in EPUB, PDF, and MOBI formats, ready for all major e-readers and apps instantly.
              </p>
            </div>

            {/* Right: Image Placeholder */}
            <div className="relative h-[400px] rounded-lg overflow-hidden bg-gray-900">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">💻</div>
                  <p className="text-gray-400">Add laptop e-book editor image here</p>
                </div>
              </div>
            </div>
          </div>

          {/* Process Steps */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">01</div>
              <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-cyan-500 mb-6"></div>
              <h4 className="text-2xl font-bold text-white mb-3">Design & Layout</h4>
              <p className="text-gray-300">Choose templates or start from scratch</p>
            </div>

            {/* Step 2 */}
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">02</div>
              <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-cyan-500 mb-6"></div>
              <h4 className="text-2xl font-bold text-white mb-3">Add Multimedia</h4>
              <p className="text-gray-300">Enhance with images and interactive elements</p>
            </div>

            {/* Step 3 */}
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">03</div>
              <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-cyan-500 mb-6"></div>
              <h4 className="text-2xl font-bold text-white mb-3">Export & Publish</h4>
              <p className="text-gray-300">One-click export to all major formats</p>
            </div>
          </div>
        </div>
      </section>

      {/* Kids Books - Page 4 */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl lg:text-6xl font-bold mb-12 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Bring Kids' Stories to Life with Fun, Engaging Tools
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Feature Boxes */}
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Box 1 */}
                <div className="border-2 border-white p-8 rounded-lg">
                  <h3 className="text-2xl font-bold text-white mb-4">Specialized Templates</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Access beautifully designed templates created specifically for children's books and picture books. Choose from various themes, layouts, and age-appropriate designs that make your story shine.
                  </p>
                </div>

                {/* Box 2 */}
                <div className="border-2 border-white p-8 rounded-lg">
                  <h3 className="text-2xl font-bold text-white mb-4">AI Illustration Magic</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Generate stunning illustrations with our AI-powered art tools, or upload your own artwork. Mix and match to create the perfect visual narrative that captivates young readers.
                  </p>
                </div>
              </div>

              {/* Box 3 - Full Width */}
              <div className="border-2 border-white p-8 rounded-lg">
                <h3 className="text-2xl font-bold text-white mb-4">Collaborative Creation</h3>
                <p className="text-gray-300 leading-relaxed">
                  Built-in features let parents, teachers, and young authors work together in real-time. Share drafts, give feedback, and co-create stories that inspire imagination and learning.
                </p>
              </div>
            </div>

            {/* Right: Image Placeholder */}
            <div className="relative h-[600px] rounded-lg overflow-hidden bg-gray-900">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🦊</div>
                  <p className="text-gray-400">Add whimsical kids book illustration here</p>
                  <p className="text-sm text-gray-600 mt-2">(Cute animals in magical forest scene)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audiobooks - Page 5 */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl lg:text-6xl font-bold mb-12 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Create Immersive Audiobooks with Custom Narration
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left: Image Placeholder */}
            <div className="relative h-[500px] rounded-lg overflow-hidden bg-gray-900">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🎙️</div>
                  <p className="text-gray-400">Add recording studio image here</p>
                  <p className="text-sm text-gray-600 mt-2">(Professional microphone and audio equipment)</p>
                </div>
              </div>
            </div>

            {/* Right: Content */}
            <div>
              <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Your Voice, Your Story
              </h3>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Record or upload voice narration directly within our platform—no external software needed. Our intuitive audio editor makes it simple to create professional-quality audiobooks that bring your stories to life.
              </p>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Sync audio perfectly with text and illustrations for a rich, multi-sensory storytelling experience. Ideal for educators reaching auditory learners, parents creating bedtime stories, and authors expanding their audience reach.
              </p>
            </div>
          </div>

          {/* Icon Features */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-white mb-3">Easy Recording</h4>
              <p className="text-gray-300">Built-in studio-quality recording tools</p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-white mb-3">Perfect Sync</h4>
              <p className="text-gray-300">Align audio with text automatically</p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-white mb-3">Pro Quality</h4>
              <p className="text-gray-300">Export broadcast-ready audiobooks</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Ready to Start Creating?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join thousands of authors, educators, and creators bringing their stories to life with HydraSkript.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link 
              href="/dashboard" 
              className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg hover:opacity-90 transition-opacity"
            >
              Get Started Free
            </Link>
            <Link 
              href="/pricing" 
              className="px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-lg hover:bg-white hover:text-black transition-all"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-500">
            © 2024 HydraSkript. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
