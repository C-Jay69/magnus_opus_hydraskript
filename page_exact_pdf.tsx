import Link from 'next/link'

export default function PricingPage() {
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
              <Link href="/" className="px-6 py-2 text-white hover:text-cyan-400 transition-colors">
                Home
              </Link>
              <Link href="/dashboard" className="px-6 py-2 text-white hover:text-cyan-400 transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Page 1 */}
      <section className="relative py-32 lg:py-48 overflow-hidden">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 opacity-40"></div>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        
        <div className="relative max-w-5xl mx-auto px-6">
          <p className="text-blue-300 text-xl mb-6">HydraSkript Pricing</p>
          
          <h1 className="text-6xl lg:text-8xl font-bold mb-8 text-blue-300 leading-tight">
            Stop Writing. Start Publishing.
          </h1>
          
          <p className="text-2xl text-gray-200 mb-4">
            HydraSkript isn't another "AI writer." It's a <strong className="text-white">book production engine.</strong>
          </p>
          
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            Outlines. Chapters. Editorial logic. Covers. Audio. Exports. If your goal is <em>finished books</em> — not half-written drafts — you're in the right place.
          </p>
          
          <div className="flex gap-4 flex-wrap">
            <Link 
              href="#pricing" 
              className="px-8 py-4 text-lg font-semibold text-black bg-blue-300 rounded-lg hover:bg-blue-200 transition-colors"
            >
              View Pricing
            </Link>
            <Link 
              href="#compare" 
              className="px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-lg hover:bg-white hover:text-black transition-all"
            >
              Compare Plans
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison Table - Page 2 */}
      <section id="compare" className="py-20 lg:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl lg:text-6xl font-bold mb-6 text-blue-300">
            Why HydraSkript Exists
          </h2>
          
          <p className="text-2xl text-gray-200 mb-4">
            Most tools help you <em>start</em> writing. HydraSkript helps you <strong className="text-white">finish and publish.</strong>
          </p>
          
          <p className="text-xl text-gray-300 mb-12">Here's the difference:</p>
          
          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-700">
              <thead>
                <tr className="bg-gray-900">
                  <th className="text-left p-6 text-white font-bold text-xl border-r border-gray-700">Feature</th>
                  <th className="text-left p-6 text-white font-bold text-xl border-r border-gray-700">HydraSkript</th>
                  <th className="text-left p-6 text-white font-bold text-xl border-r border-gray-700">AI Writing Tools</th>
                  <th className="text-left p-6 text-white font-bold text-xl">Hiring a Human</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-700">
                  <td className="p-6 text-gray-200 border-r border-gray-700">Full book generation</td>
                  <td className="p-6 border-r border-gray-700">
                    <span className="text-green-500 text-2xl">✅</span> <span className="text-gray-300">End-to-end</span>
                  </td>
                  <td className="p-6 border-r border-gray-700">
                    <span className="text-red-500 text-2xl">❌</span> <span className="text-gray-300">Fragmented</span>
                  </td>
                  <td className="p-6">
                    <span className="text-green-500 text-2xl">✅</span> <span className="text-gray-300">Slow & manual</span>
                  </td>
                </tr>
                
                <tr className="border-t border-gray-700 bg-gray-950">
                  <td className="p-6 text-gray-200 border-r border-gray-700">Structured outlines & chapters</td>
                  <td className="p-6 border-r border-gray-700">
                    <span className="text-green-500 text-2xl">✅</span> <span className="text-gray-300">Built-in</span>
                  </td>
                  <td className="p-6 border-r border-gray-700">
                    <span className="text-yellow-500 text-2xl">⚠️</span> <span className="text-gray-300">Partial</span>
                  </td>
                  <td className="p-6">
                    <span className="text-green-500 text-2xl">✅</span>
                  </td>
                </tr>
                
                <tr className="border-t border-gray-700">
                  <td className="p-6 text-gray-200 border-r border-gray-700">Editorial logic & analysis</td>
                  <td className="p-6 border-r border-gray-700">
                    <span className="text-green-500 text-2xl">✅</span> <span className="text-gray-300">Included</span>
                  </td>
                  <td className="p-6 border-r border-gray-700">
                    <span className="text-red-500 text-2xl">❌</span>
                  </td>
                  <td className="p-6">
                    <span className="text-yellow-500 text-2xl">⚠️</span> <span className="text-gray-300">Extra cost</span>
                  </td>
                </tr>
                
                <tr className="border-t border-gray-700 bg-gray-950">
                  <td className="p-6 text-gray-200 border-r border-gray-700">Covers & formatting</td>
                  <td className="p-6 border-r border-gray-700">
                    <span className="text-green-500 text-2xl">✅</span> <span className="text-gray-300">Yes</span>
                  </td>
                  <td className="p-6 border-r border-gray-700">
                    <span className="text-red-500 text-2xl">❌</span>
                  </td>
                  <td className="p-6">
                    <span className="text-yellow-500 text-2xl">⚠️</span> <span className="text-gray-300">Extra cost</span>
                  </td>
                </tr>
                
                <tr className="border-t border-gray-700">
                  <td className="p-6 text-gray-200 border-r border-gray-700">Audiobook generation</td>
                  <td className="p-6 border-r border-gray-700">
                    <span className="text-green-500 text-2xl">✅</span> <span className="text-gray-300">Yes</span>
                  </td>
                  <td className="p-6 border-r border-gray-700">
                    <span className="text-red-500 text-2xl">❌</span>
                  </td>
                  <td className="p-6">
                    <span className="text-yellow-500 text-2xl">⚠️</span> <span className="text-gray-300">Very expensive</span>
                  </td>
                </tr>
                
                <tr className="border-t border-gray-700 bg-gray-950">
                  <td className="p-6 text-gray-200 border-r border-gray-700">Publish-ready exports</td>
                  <td className="p-6 border-r border-gray-700">
                    <span className="text-green-500 text-2xl">✅</span> <span className="text-gray-300">PDF / EPUB / DOCX</span>
                  </td>
                  <td className="p-6 border-r border-gray-700">
                    <span className="text-yellow-500 text-2xl">⚠️</span> <span className="text-gray-300">Copy-paste</span>
                  </td>
                  <td className="p-6">
                    <span className="text-red-500 text-2xl">❌</span>
                  </td>
                </tr>
                
                <tr className="border-t border-gray-700">
                  <td className="p-6 text-gray-200 border-r border-gray-700">Time to finished book</td>
                  <td className="p-6 text-gray-300 border-r border-gray-700">Days</td>
                  <td className="p-6 text-gray-300 border-r border-gray-700">Weeks</td>
                  <td className="p-6 text-gray-300">Months</td>
                </tr>
                
                <tr className="border-t border-gray-700 bg-gray-950">
                  <td className="p-6 text-gray-200 border-r border-gray-700">Cost per book</td>
                  <td className="p-6 text-gray-300 border-r border-gray-700">$20–$100</td>
                  <td className="p-6 text-gray-300 border-r border-gray-700">$100s + time</td>
                  <td className="p-6 text-gray-300">$3,000–$15,000</td>
                </tr>
                
                <tr className="border-t border-gray-700">
                  <td className="p-6 text-gray-200 border-r border-gray-700">You own the rights</td>
                  <td className="p-6 border-r border-gray-700">
                    <span className="text-green-500 text-2xl">✅</span> <span className="text-gray-300">Always</span>
                  </td>
                  <td className="p-6 border-r border-gray-700">
                    <span className="text-yellow-500 text-2xl">⚠️</span> <span className="text-gray-300">Depends</span>
                  </td>
                  <td className="p-6">
                    <span className="text-yellow-500 text-2xl">⚠️</span> <span className="text-gray-300">Contract-based</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <p className="text-2xl text-gray-200 mt-12 text-center">
            HydraSkript replaces tools, freelancers, and waiting.
          </p>
        </div>
      </section>

      {/* Pricing Cards - Pages 3, 4, 5 */}
      <section id="pricing" className="py-20 lg:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl lg:text-6xl font-bold mb-16 text-center text-white">
            Choose Your Weapon
          </h2>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Starter Plan - CYAN BACKGROUND */}
            <div className="rounded-lg overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="bg-gray-800 py-6 flex justify-center">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              
              {/* Content - CYAN BACKGROUND */}
              <div className="bg-cyan-400 p-10">
                <h3 className="text-3xl font-bold text-black mb-2">
                  Starter — <em>Test the Waters</em>
                </h3>
                
                <div className="my-8">
                  <span className="text-7xl font-bold text-purple-600">$29</span>
                  <span className="text-4xl text-black"> / month</span>
                </div>
                
                <p className="text-black text-lg mb-6">
                  Perfect for testing ideas and kicking the tyres.
                </p>
                
                <div className="mb-8">
                  <p className="font-bold text-black text-xl mb-4">Includes:</p>
                  <ul className="space-y-3 text-black">
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>100 credits / month</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Outline & chapter generation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Partial book creation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>1 active project</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>PDF export</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Standard processing queue</span>
                    </li>
                  </ul>
                </div>
                
                <p className="text-black">
                  <strong>Best for:</strong> indie writers, bloggers, the "maybe I'll write a book" crowd.
                </p>
                
                <Link 
                  href="/dashboard" 
                  className="mt-8 block w-full py-4 text-center text-lg font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Author Plan - MOST POPULAR */}
            <div className="rounded-lg overflow-hidden shadow-2xl border-4 border-blue-500 relative">
              {/* Most Popular Badge */}
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-6 py-2 rounded-bl-lg font-bold flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <span>Most Popular</span>
              </div>
              
              {/* Header */}
              <div className="bg-blue-400 py-6 flex justify-center">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              
              {/* Content - BLACK BACKGROUND */}
              <div className="bg-black p-10">
                <h3 className="text-3xl font-bold text-white mb-2">
                  Author — <em>Where Real Books Are Born</em>
                </h3>
                
                <div className="my-8">
                  <span className="text-7xl font-bold text-white">$79</span>
                  <span className="text-4xl text-white"> / month</span>
                </div>
                
                <p className="text-white text-lg mb-6">
                  This is where HydraSkript starts paying for itself.
                </p>
                
                <div className="mb-8">
                  <p className="font-bold text-white text-xl mb-4">Includes:</p>
                  <ul className="space-y-3 text-white">
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>400 credits / month</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Generate <strong>1 full-length book per month</strong></span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>PDF, EPUB & DOCX exports</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>AI cover generation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Editorial analysis pass</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>5 active projects</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Faster processing queue</span>
                    </li>
                  </ul>
                </div>
                
                <p className="text-white">
                  <strong>Best for:</strong> authors, educators, serious creators.
                </p>
                
                <Link 
                  href="/dashboard" 
                  className="mt-8 block w-full py-4 text-center text-lg font-semibold text-black bg-blue-400 rounded-lg hover:bg-blue-300 transition-colors"
                >
                  Start Creating
                </Link>
              </div>
            </div>

            {/* Publisher Plan */}
            <div className="rounded-lg overflow-hidden shadow-2xl border-2 border-gray-700">
              {/* Header */}
              <div className="bg-gray-700 py-6 flex justify-center">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              
              {/* Content - BLACK BACKGROUND */}
              <div className="bg-black p-10">
                <h3 className="text-3xl font-bold text-white mb-2">
                  Publisher — <em>Scale the Output</em>
                </h3>
                
                <div className="my-8">
                  <span className="text-7xl font-bold text-blue-400">$149</span>
                  <span className="text-4xl text-white"> / month</span>
                </div>
                
                <p className="text-white text-lg mb-6">
                  For people who publish, not dabble.
                </p>
                
                <div className="mb-8">
                  <p className="font-bold text-white text-xl mb-4">Includes:</p>
                  <ul className="space-y-3 text-white">
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>1,000 credits / month</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span><strong>2–3 full books per month</strong></span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Audiobook generation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Advanced editorial logic</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Series & multi-book workflows</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Highest priority queue</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Early access to new features</span>
                    </li>
                  </ul>
                </div>
                
                <p className="text-white">
                  <strong>Best for:</strong> publishers, agencies, content businesses.
                </p>
                
                <Link 
                  href="/dashboard" 
                  className="mt-8 block w-full py-4 text-center text-lg font-semibold text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Scale Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-blue-300">
            Ready to Finish Your Book?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Stop writing. Start publishing. Join HydraSkript today.
          </p>
          <Link 
            href="/dashboard" 
            className="inline-block px-10 py-5 text-xl font-semibold text-black bg-blue-300 rounded-lg hover:bg-blue-200 transition-colors"
          >
            Get Started Now
          </Link>
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
