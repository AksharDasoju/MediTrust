import { useState, useCallback } from "react";
import { Upload, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { simulateOCR, sanitizeBillData } from "@/lib/ocrSimulator";
import { analyzeBill, FraudResult } from "@/lib/fraudEngine";
import { DEMO_GENUINE_BILL, DEMO_FAKE_BILL, BillData } from "@/lib/mockData";

const UploadPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const navigate = useNavigate();

  const processFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    toast.info("Processing bill...");

    try {
      const ocrResult = await simulateOCR(file);

      if (!ocrResult.success || !ocrResult.data) {
        toast.error(ocrResult.warnings[0] || "Failed to process file");
        setIsProcessing(false);
        return;
      }

      if (ocrResult.warnings.length > 0) {
        ocrResult.warnings.forEach((w) => toast.warning(w));
      }

      const sanitized = sanitizeBillData(ocrResult.data);
      const result = analyzeBill(sanitized);

      // Navigate to results
      navigate("/results", { state: { result, ocrConfidence: ocrResult.confidence, extractionTime: ocrResult.extractionTime } });
    } catch (err) {
      toast.error("An error occurred during processing. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [navigate]);

  const runDemo = useCallback((bill: BillData) => {
    setIsProcessing(true);
    toast.info("Running demo analysis...");

    setTimeout(() => {
      const sanitized = sanitizeBillData(bill);
      const result = analyzeBill(sanitized);
      navigate("/results", { state: { result, ocrConfidence: 95, extractionTime: 1200, isDemo: true } });
      setIsProcessing(false);
    }, 1200);
  }, [navigate]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground mb-2">Upload Medical Bill</h1>
        <p className="text-muted-foreground mb-8">Upload a medical bill image or PDF for AI-powered fraud analysis.</p>

        <label
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-16 cursor-pointer transition-colors ${
            dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          } ${isProcessing ? "pointer-events-none opacity-50" : ""}`}
        >
          <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.webp,.pdf" onChange={handleFileInput} disabled={isProcessing} />
          {isProcessing ? (
            <div className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="text-muted-foreground">Analyzing bill...</p>
            </div>
          ) : (
            <>
              <Upload className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-foreground font-medium">Drop your bill here or click to browse</p>
              <p className="text-sm text-muted-foreground mt-1">Supports JPG, PNG, PDF up to 10MB</p>
            </>
          )}
        </label>

        <p className="text-center text-sm text-muted-foreground mt-4">
          No bill handy?{" "}
          <button onClick={() => runDemo(DEMO_GENUINE_BILL)} className="text-primary hover:underline" disabled={isProcessing}>
            Try a genuine bill
          </button>
          {" · "}
          <button onClick={() => runDemo(DEMO_FAKE_BILL)} className="text-destructive hover:underline" disabled={isProcessing}>
            Try a fake bill
          </button>
        </p>
      </div>
    </div>
  );
};

export default UploadPage;
