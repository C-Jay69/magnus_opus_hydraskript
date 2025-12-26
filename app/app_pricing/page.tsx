import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Assume shadcn/ui
import { Button } from "@/components/ui/button";

export default function Pricing() {
  return (
    <main className="min-h-screen bg-slate-900 text-foreground">
      {/* Hero Section */}
      <section className="section bg-gradient-dark p-8 text-center">
        <h1 className="text-2xl mb-4">HydraSkript Pricing</h1>
        <h2 className="section-title gradient-text">Stop Writing. Start Publishing.</h2>
        <p className="section-subtitle">HydraSkript isn't another "AI writer." It's a <strong>book production engine</strong>.</p>
        <p>Outlines. Chapters. Editorial logic. Covers. Audio. Exports. If your goal is <em>finished books</em> — not half-written drafts — you're in the right place.</p>
        <div className="flex justify-center gap-4">
          <Button className="btn-gradient">View Pricing</Button>
          <Button className="btn-outline">Compare Plans</Button>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="section">
        <h2 className="section-title gradient-text">Why HydraSkript Exists</h2>
        <p className="section-subtitle">Most tools help you <em>start</em> writing. HydraSkript helps you <strong>finish and publish.</strong></p>
        <Table className="bg-slate-800 border border-slate-700">
          <TableHeader>
            <TableRow>
              <TableHead>Feature</TableHead>
              <TableHead>HydraSkript</TableHead>
              <TableHead>AI Writing Tools</TableHead>
              <TableHead>Hiring a Human</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Full book generation</TableCell>
              <TableCell>✅ End-to-end</TableCell>
              <TableCell>❌ Fragmented</TableCell>
              <TableCell>✅ Slow & manual</TableCell>
            </TableRow>
            {/* Add all rows from PDF notes */}
          </TableBody>
        </Table>
      </section>

      {/* Pricing Tiers */}
      <section className="section grid md:grid-cols-3 gap-6">
        <div className="pricing-card pricing-card-cyan">
          <h3>Starter — <em>Just Getting Started</em></h3>
          <p className="text-3xl font-bold">$19 / month</p>
          {/* Add includes, best for */}
        </div>
        <div className="pricing-card pricing-card-purple relative">
          <span className="absolute top-0 right-0 bg-yellow-400 text-black px-2 py-1 rounded-bl">Most Popular</span>
          <h3>Author — <em>Where Real Books Are Born</em></h3>
          <p className="text-3xl font-bold">$79 / month</p>
          {/* Add details */}
        </div>
        <div className="pricing-card pricing-card-dark">
          <h3>Publisher — <em>Scale the Output</em></h3>
          <p className="text-3xl font-bold">$149 / month</p>
          {/* Add details */}
        </div>
      </section>

      {/* CTA and Footer similar to homepage */}
    </main>
  );
}