import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button"; // Assume you have shadcn/ui or similar

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 text-foreground">
      {/* Hero Section from PDF */}
      <section className="section bg-gradient-dark flex flex-col md:flex-row items-center justify-between p-8">
        <div className="md:w-1/2">
          <h1 className="section-title gradient-text">Create, Edit & Publish Your E-Books, Kids Books, Audiobooks & Coloring Books — All in One Stylish Platform</h1>
          <p className="section-subtitle">Welcome to the future of book creation. Whether you're crafting your first children's story, producing a professional audiobook, or designing interactive coloring pages, our all-in-one platform gives you everything you need to bring your vision to life with style and ease.</p>
          <div className="flex gap-4">
            <Button className="btn-gradient">Get Started Free</Button>
            <Button className="btn-outline">Explore Features</Button>
          </div>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0">
          <Image src="/images/cozy-workspace.jpg" alt="Cozy workspace" width={600} height={400} className="rounded-lg" />
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="section">
        <h2 className="section-title gradient-text text-center">Why Choose Our Platform?</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="feature-card">
            <div className="feature-icon">🎤</div> {/* Microphone icon */}
            <p>Intuitive interface tailored for creators of all ages and skill levels, making book creation effortless and enjoyable.</p>
          </div>
          {/* Add the other 3 features similarly */}
        </div>
        <Image src="/images/group-collaborating.jpg" alt="Group collaborating" width={800} height={400} className="mt-8 mx-auto" />
      </section>

      {/* E-Books Section */}
      <section className="section bg-slate-800">
        <h2 className="section-title gradient-text">Transform Your Ideas Into Beautiful E-Books</h2>
        <p className="section-subtitle">Professional Publishing Made Simple</p>
        {/* Add content, features, image as per PDF notes */}
      </section>

      {/* Kids Books Section */}
      <section className="section">
        <h2 className="section-title gradient-text">Bring Kids' Stories to Life</h2>
        {/* Add features, image */}
      </section>

      {/* Audiobooks Section */}
      <section className="section bg-slate-800">
        <h2 className="section-title gradient-text">Create Immersive Audiobooks with Custom Narration</h2>
        {/* Add content, features, image */}
      </section>

      {/* CTA Section */}
      <section className="section text-center">
        <Button className="btn-gradient text-lg">Start Creating Today</Button>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 p-4 text-center text-slate-400">
        © 2025 HydraSkript. All rights reserved.
      </footer>
    </main>
  );
}