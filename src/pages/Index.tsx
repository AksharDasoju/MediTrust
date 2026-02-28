import { Link } from "react-router-dom";
import { ScanSearch, BarChart3, QrCode, Building2, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const stats = [
  { value: "99.2%", label: "Detection Accuracy" },
  { value: "< 3s", label: "Analysis Time" },
  { value: "50K+", label: "Bills Processed" },
  { value: "₹12Cr", label: "Fraud Prevented" },
];

const features = [
  { icon: ScanSearch, title: "OCR Extraction", desc: "Automatically extract and parse data from uploaded medical bills" },
  { icon: Shield, title: "Fraud Detection", desc: "AI-powered rule engine flags suspicious patterns and anomalies" },
  { icon: BarChart3, title: "Risk Scoring", desc: "Get instant fraud risk scores with color-coded status indicators" },
  { icon: QrCode, title: "QR Verification", desc: "Generate verification codes for authenticated genuine bills" },
  { icon: Building2, title: "Hospital Database", desc: "Cross-reference bills against verified hospital registry" },
  { icon: Zap, title: "Instant Results", desc: "Get fraud analysis results in seconds, not days" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="py-24 text-center px-4">
        <div className="inline-flex items-center gap-2 bg-secondary text-muted-foreground rounded-full px-4 py-1.5 text-sm mb-6">
          <Shield className="h-4 w-4 text-primary" />
          AI-Powered Healthcare Bill Verification
        </div>
        <h1 className="text-5xl font-bold text-foreground mb-4 max-w-2xl mx-auto leading-tight">
          Detect Fake Medical Bills{" "}
          <span className="text-primary">in Seconds</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
          MediTrust combines OCR, rule-based AI, and hospital verification to help insurance companies identify fraudulent medical claims instantly.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link to="/upload">Check a Bill</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/dashboard">View Dashboard</Link>
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-secondary py-12">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center px-4">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-foreground">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-2">How MediTrust Works</h2>
          <p className="text-muted-foreground text-center mb-12">End-to-end fraud detection pipeline, from bill upload to verified result.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-card border border-border rounded-lg p-6">
                <f.icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 text-center px-4">
        <h2 className="text-3xl font-bold text-primary-foreground mb-3">Ready to Protect Your Organization?</h2>
        <p className="text-primary-foreground/80 mb-6">Start analyzing medical bills today with our AI-powered fraud detection system.</p>
        <Button asChild size="lg" variant="secondary">
          <Link to="/upload">Get Started Free</Link>
        </Button>
      </section>
    </div>
  );
};

export default Index;
