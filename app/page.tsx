import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button"; // Or your button component

export default function Home() {
  return
   }

    <main className="min-h-screen bg-slate-900 text-foreground">
      {/* Hero Section - Already matching your screenshot */}
      <section className="section relative overflow-hidden">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-8 py-16">
          <div className="md:w-1/2 z-10">
            <h1 className="section-title gradient-text">Create, Edit & Publish Your E-Books, Kids Books, Audiobooks & Coloring Books — All in One Stylish Platform</h1>
            <p className="section-subtitle">Welcome to the future of book creation. Whether you're crafting your first children's story, producing a professional audiobook, or designing interactive coloring pages, our all-in-one platform gives you everything you need to bring your vision to life with style and ease.</p>
            <div className="flex gap-4 mt-8">
              <Button className="btn-gradient text-lg px-8 py-4">Get Started Free</Button>
              <Button variant="outline" className="btn-outline text-lg px-8 py-4">Explore Features</Button>
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <Image src="/images/hero-home.jpg" alt="Cozy creative workspace" width={1000} height={600} className="rounded-lg shadow-2xl glow-gradient" priority />
            
          </div>
        </div>
      </section>

      {/* Why Choose Our Platform? */}
      <section className="section bg-slate-800">
        <div className="container mx-auto text-center">
          <h2 className="section-title gradient-text">Why Choose Our Platform?</h2>
          <div className="grid md:grid-cols-4 gap-8 mt-12">
            <div className="feature-card text-center">
              <div className="text-6xl mb-4 gradient-text">🎤</div>
              <h3 className="text-2xl font-bold mb-2">Modern Design</h3>
              <p>Intuitive interface tailored for creators of all ages and skill levels, making book creation effortless and enjoyable.</p>
            </div>
            <div className="feature-card text-center">
              <div className="text-6xl mb-4 gradient-text">📚</div>
              <h3 className="text-2xl font-bold mb-2">Multiple Formats</h3>
              <p>Generate and edit e-books, kids books, audiobooks, and coloring books seamlessly in one powerful workspace.</p>
            </div>
            <div className="feature-card text-center">
              <div className="text-6xl mb-4 gradient-text">✨</div>
              <h3 className="text-2xl font-bold mb-2">Creative Freedom</h3>
              <p>Empower your storytelling with professional tools built specifically for today's digital publishing landscape.</p>
            </div>
            <div className="feature-card text-center">
              <div className="text-6xl mb-4 gradient-text">🤖</div>
              <h3 className="text-2xl font-bold mb-2">AI Training Center</h3>
              <p>Train our AI to match your exact tone, style, and voice for consistent, personalized content generation every time.</p>
            </div>
          </div>
          <Image src="/images/collaboration1.jpg" alt="Group collaborating" width={1000} height={600} className="mt-16 mx-auto rounded-lg glow-gradient" />
        </div>
      </section>

      {/* Transform Ideas Into E-Books */}
      <section className="section">
        <div className="container mx-auto flex flex-col md:flex-row-reverse items-center justify-between px-8">
          <div className="md:w-1/2">
            <h2 className="section-title gradient-text">Transform Your Ideas Into Beautiful E-Books</h2>
            <p className="section-subtitle">Professional Publishing Made Simple</p>
            <p className="mb-4">Our easy drag-and-drop editor puts professional e-book design at your fingertips. Choose from customizable layouts and fonts that bring your words to life beautifully on every screen.</p>
            <p>Integrate multimedia elements seamlessly—add images, embed audio narration, and create interactive features that engage readers like never before.</p>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <Image src="/images/ideas-into-ebooks.jpg" alt="E-Book example" width={1000} height={400} className="rounded-lg glow-gradient" />
          </div>
        </div>
      </section>

      {/* Bring Kids' Stories to Life */}
      <section className="section bg-slate-800">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-8">
          <div className="md:w-1/2">
            <h2 className="section-title gradient-text">Bring Kids' Stories to Life</h2>
            <p className="section-subtitle">Magic for Young Readers</p>
            <ul className="space-y-4 mt-8">
              <li className="feature-item"><span className="text-3xl">📖</span> Templates specifically for children's books and picture books...</li>
              <li className="feature-item"><span className="text-3xl">🎨</span> AI Illustration Magic: Generate stunning illustrations...</li>
              <li className="feature-item"><span className="text-3xl">👨‍👩‍👧</span> Collaborative Creation: Built-in features let parents, teachers...</li>
            </ul>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <Image src="/images/kids-forest.jpg" alt="Whimsical kids book illustration" width={1000} height={400} className="rounded-lg glow-gradient" />
          </div>
        </div>
      </section>

      {/* Create Immersive Audiobooks */}
      <section className="section">
        <div className="container mx-auto flex flex-col md:flex-row-reverse items-center justify-between px-8">
          <div className="md:w-1/2">
            <h2 className="section-title gradient-text">Create Immersive Audiobooks with Custom Narration</h2>
            <p className="section-subtitle">Your Voice, Your Story</p>
            <p className="mb-4">Record or upload voice narration directly within our platform—no external software needed.</p>
            <ul className="space-y-4 mt-8">
              <li className="feature-item"><span className="text-3xl">🎤</span> Easy Recording: Built-in studio-quality tools</li>
              <li className="feature-item"><span className="text-3xl">🌊</span> Perfect Sync: Align audio with text automatically</li>
              <li className="feature-item"><span className="text-3xl">🎧</span> Pro Quality: Export broadcast-ready audiobooks</li>
            </ul>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <Image src="/images/audiobook-studio.jpg" alt="Recording studio setup" width={1000} height={400} className="rounded-lg glow-gradient" />
          </div>
        </div>
      </section>

      {/* CTA & Footer */}
      <section className="section text-center bg-gradient-dark py-24">
        <h2 className="section-title gradient-text">Ready to Start Publishing?</h2>
        <Button className="btn-gradient text-2xl px-12 py-6 mt-8">Get Started Free</Button>
      </section>

      <footer className="bg-slate-950 py-8 text-center text-slate-400">
        © 2025 HydraSkript. All rights reserved.
      </footer>
    </main>
  