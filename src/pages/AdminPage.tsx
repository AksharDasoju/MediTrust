import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Database, Shield, Activity } from "lucide-react";

const AdminPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-1">Admin Panel</h1>
        <p className="text-muted-foreground mb-8">System configuration and monitoring</p>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-primary" /> System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Fraud Engine</span><Badge className="bg-success text-white">Online</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">OCR Module</span><Badge className="bg-success text-white">Online</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Hospital DB</span><Badge className="bg-success text-white">Synced</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">API Gateway</span><Badge className="bg-success text-white">Active</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Mode</span><Badge variant="outline">Demo Simulation</Badge></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Database className="h-5 w-5 text-primary" /> Database Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Hospitals</span><span className="font-medium text-foreground">16 verified</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Pricing Rules</span><span className="font-medium text-foreground">21 procedures</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Fraud Patterns</span><span className="font-medium text-foreground">12 active rules</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">OCR Templates</span><span className="font-medium text-foreground">4 bill formats</span></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Data Retention</span><span className="font-medium text-foreground">Session only</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">File Sanitization</span><Badge className="bg-success text-white">Enabled</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Input Validation</span><Badge className="bg-success text-white">Enabled</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Injection Protection</span><Badge className="bg-success text-white">Enabled</Badge></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5 text-primary" /> Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Engine Type</span><span className="font-medium text-foreground">Hybrid (Rule + AI)</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">GST Validation</span><Badge className="bg-success text-white">Active</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Processing Target</span><span className="font-medium text-foreground">{"< 3 seconds"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Max File Size</span><span className="font-medium text-foreground">10 MB</span></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
