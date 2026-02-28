import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { DASHBOARD_STATS, MONTHLY_TRENDS, RECENT_CASES } from "@/lib/mockData";

const PIE_COLORS = ["hsl(142, 76%, 36%)", "hsl(0, 84%, 60%)", "hsl(38, 92%, 50%)"];
const pieData = [
  { name: "Genuine", value: DASHBOARD_STATS.genuine },
  { name: "Fraudulent", value: DASHBOARD_STATS.fraudulent },
  { name: "Pending", value: DASHBOARD_STATS.pendingReview },
];

const statCards = [
  { label: "Total Bills", value: DASHBOARD_STATS.totalBills, icon: FileText, color: "text-foreground" },
  { label: "Fraudulent", value: DASHBOARD_STATS.fraudulent, icon: AlertTriangle, color: "text-destructive" },
  { label: "Genuine", value: DASHBOARD_STATS.genuine, icon: CheckCircle, color: "text-success" },
  { label: "Pending Review", value: DASHBOARD_STATS.pendingReview, icon: Clock, color: "text-warning" },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-1">Dashboard</h1>
        <p className="text-muted-foreground mb-8">Overview of bill analysis activity</p>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s) => (
            <Card key={s.label}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className={`text-3xl font-bold ${s.color} mt-1`}>{s.value.toLocaleString()}</p>
                  </div>
                  <s.icon className={`h-5 w-5 ${s.color} opacity-60`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Fraud Trends</CardTitle>
              <p className="text-sm text-muted-foreground">Monthly analysis over last 7 months</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={MONTHLY_TRENDS}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="genuine" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="fraudulent" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="45%" innerRadius={60} outerRadius={90} dataKey="value">
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Cases */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Flagged Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Case ID</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Hospital</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Patient</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Score</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_CASES.map((c) => (
                    <tr key={c.id} className="border-b border-border last:border-0">
                      <td className="py-3 px-2 font-mono text-xs text-foreground">{c.id}</td>
                      <td className="py-3 px-2 text-foreground">{c.hospital}</td>
                      <td className="py-3 px-2 text-foreground">{c.patient}</td>
                      <td className="py-3 px-2 font-semibold text-foreground">{c.score}</td>
                      <td className="py-3 px-2">
                        <Badge variant="outline" className={`text-xs ${
                          c.status === "High Risk" ? "border-destructive text-destructive" :
                          c.status === "Medium Risk" ? "border-warning text-warning" :
                          "border-success text-success"
                        }`}>
                          ● {c.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-muted-foreground">{c.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
