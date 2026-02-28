import { useLocation, useNavigate, Link } from "react-router-dom";
import { AlertTriangle, CheckCircle, Info, ArrowLeft, ShieldCheck, ShieldAlert, ShieldX, Clock, Building2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import { FraudResult } from "@/lib/fraudEngine";

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { result: FraudResult; ocrConfidence: number; extractionTime: number; isDemo?: boolean } | null;

  if (!state?.result) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground mb-4">No analysis results found.</p>
          <Button asChild><Link to="/upload">Upload a Bill</Link></Button>
        </div>
      </div>
    );
  }

  const { result, ocrConfidence, extractionTime, isDemo } = state;
  const { fraudScore, riskLevel, confidenceScore, reasons, extractedData, verificationDetails, ruleBasedScore, aiAnomalyScore } = result;

  const riskColor = riskLevel === "High" ? "text-destructive" : riskLevel === "Medium" ? "text-warning" : "text-success";
  const riskBg = riskLevel === "High" ? "bg-destructive/10" : riskLevel === "Medium" ? "bg-warning/10" : "bg-success/10";
  const RiskIcon = riskLevel === "High" ? ShieldX : riskLevel === "Medium" ? ShieldAlert : ShieldCheck;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" size="sm" onClick={() => navigate("/upload")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Upload
        </Button>

        {isDemo && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-6 text-sm text-primary flex items-center gap-2">
            <Info className="h-4 w-4" /> This is a demo simulation. Upload a real bill for actual analysis.
          </div>
        )}

        {/* Fraud Score Hero */}
        <Card className={`mb-6 ${riskBg} border-0`}>
          <CardContent className="py-8 text-center">
            <RiskIcon className={`h-16 w-16 mx-auto mb-3 ${riskColor}`} />
            <div className={`text-5xl font-bold ${riskColor}`}>{fraudScore}%</div>
            <div className="text-lg font-semibold text-foreground mt-1">Fraud Score</div>
            <Badge className={`mt-2 ${riskLevel === "High" ? "bg-destructive" : riskLevel === "Medium" ? "bg-warning" : "bg-success"} text-white`}>
              {riskLevel} Risk
            </Badge>
            <div className="flex justify-center gap-8 mt-6 text-sm">
              <div>
                <span className="text-muted-foreground">Confidence: </span>
                <span className="font-semibold text-foreground">{confidenceScore}%</span>
              </div>
              <div>
                <span className="text-muted-foreground">Rule Score: </span>
                <span className="font-semibold text-foreground">{ruleBasedScore}/50</span>
              </div>
              <div>
                <span className="text-muted-foreground">AI Score: </span>
                <span className="font-semibold text-foreground">{aiAnomalyScore}/50</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Reasons */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Analysis Findings ({reasons.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {reasons.length === 0 ? (
                <div className="flex items-center gap-2 text-success text-sm">
                  <CheckCircle className="h-4 w-4" /> No suspicious patterns detected
                </div>
              ) : (
                reasons.map((r, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                      r.severity === "high" ? "bg-destructive" : r.severity === "medium" ? "bg-warning" : "bg-muted-foreground"
                    }`} />
                    <div>
                      <div className="text-sm font-medium text-foreground">{r.rule}</div>
                      <div className="text-sm text-muted-foreground">{r.description}</div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Extracted Data */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Extracted Bill Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Patient Name</span><span className="font-medium text-foreground">{extractedData.patientName}</span></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Hospital</span><span className="font-medium text-foreground">{extractedData.hospitalName}</span></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium text-foreground">{extractedData.date}</span></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-medium text-foreground">₹{extractedData.amount.toLocaleString("en-IN")}</span></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Invoice #</span><span className="font-medium text-foreground">{extractedData.invoiceNumber}</span></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">GSTIN</span><span className="font-medium text-foreground">{extractedData.gstin || "Not provided"}</span></div>
              {extractedData.diagnosis && (
                <>
                  <Separator />
                  <div className="flex justify-between"><span className="text-muted-foreground">Diagnosis</span><span className="font-medium text-foreground">{extractedData.diagnosis}</span></div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Verification Checks */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Verification Checks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "GST Number Valid", pass: verificationDetails.gstValid },
                { label: "Hospital Found in DB", pass: verificationDetails.hospitalFound },
                { label: "Hospital Accredited", pass: verificationDetails.hospitalAccredited },
                { label: "Pricing Within Range", pass: verificationDetails.pricingNormal },
                { label: "Date Valid", pass: verificationDetails.dateValid },
                { label: "Invoice Format Valid", pass: verificationDetails.invoiceFormatValid },
              ].map((check) => (
                <div key={check.label} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{check.label}</span>
                  {check.pass ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Line Items */}
          {extractedData.items && extractedData.items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bill Line Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {extractedData.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.description}</span>
                      <span className="font-medium text-foreground">₹{item.amount.toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between font-semibold text-sm">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">₹{extractedData.amount.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Processing Info */}
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Processed in {(extractionTime / 1000).toFixed(1)}s</span>
          <span>OCR Confidence: {ocrConfidence}%</span>
        </div>

        <div className="text-center mt-8">
          <Button asChild><Link to="/upload">Analyze Another Bill</Link></Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
