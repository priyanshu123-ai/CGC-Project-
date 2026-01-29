import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Bell,
  Clock,
  MapPin,
  Trophy,
  Download,
  Share2,
} from "lucide-react";

const monthlyReport = {
  month: "November 2024",
  totalCO2: 156,
  previousMonth: 189,
  improvement: 17.5,
  aqiExposure: {
    good: 45,
    moderate: 32,
    unhealthy: 18,
    hazardous: 5,
  },
  categories: [
    { name: "Transport", current: 45, previous: 62, change: -27 },
    { name: "Energy", current: 38, previous: 42, change: -9 },
    { name: "Shopping", current: 52, previous: 58, change: -10 },
    { name: "Lifestyle", current: 21, previous: 27, change: -22 },
  ],
  toxinsInhaled: {
    pm25: 234,
    pm10: 456,
    no2: 89,
    co: 12,
  },
};

const predictiveAlerts = [
  {
    id: 1,
    type: "warning",
    title: "High AQI Predicted Tomorrow",
    description: "AQI expected to reach 280+ between 8-10 AM in Central Delhi",
    recommendation: "Consider leaving 30 mins early or working from home",
    time: "Tomorrow, 8:00 AM",
  },
  {
    id: 2,
    type: "info",
    title: "Best Travel Window",
    description: "AQI will be lowest between 2-4 PM today",
    recommendation: "Ideal time for outdoor activities or commute",
    time: "Today, 2:00 PM",
  },
  {
    id: 3,
    type: "alert",
    title: "Entering High Pollution Zone",
    description: "Anand Vihar area has AQI 350+ currently",
    recommendation: "Take Ring Road alternate route (-45 min exposure)",
    time: "Real-time",
  },
];

const routeHeatmapData = [
  { area: "Connaught Place", aqi: 185, trend: "up" },
  { area: "Karol Bagh", aqi: 220, trend: "up" },
  { area: "South Extension", aqi: 145, trend: "down" },
  { area: "Dwarka", aqi: 165, trend: "stable" },
  { area: "Noida Sec 18", aqi: 195, trend: "up" },
  { area: "Gurgaon Cyber City", aqi: 175, trend: "down" },
];

const getAQIColor = (aqi) => {
  if (aqi <= 50) return "#22C55E";
  if (aqi <= 100) return "#FACC15";
  if (aqi <= 150) return "#FB923C";
  if (aqi <= 200) return "#EF4444";
  if (aqi <= 300) return "#A855F7";
  return "#881337";
};

const Insights = () => {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #030a06, #071a0f, #0a2915)" }} className="mt-16">
      <Navbar />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 16px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#f0f5f2", display: "flex", alignItems: "center", gap: "12px" }}>
              <BarChart3 style={{ color: "#4ade80" }} />
              Insights & Reports
            </h1>
            <p style={{ color: "rgba(156, 163, 175, 0.8)", marginTop: "8px" }}>
              Track your environmental impact over time
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <Button style={{ background: "rgba(34, 197, 94, 0.2)", border: "1px solid rgba(34, 197, 94, 0.3)", color: "#4ade80" }}>
              <Download size={16} style={{ marginRight: "8px" }} />
              Export PDF
            </Button>
            <Button style={{ background: "rgba(34, 197, 94, 0.2)", border: "1px solid rgba(34, 197, 94, 0.3)", color: "#4ade80" }}>
              <Share2 size={16} style={{ marginRight: "8px" }} />
              Share
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="monthly" style={{ width: "100%" }}>
          <TabsList style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.2)", marginBottom: "24px" }}>
            <TabsTrigger value="monthly" style={{ color: "#9ca3af" }}>Monthly Report</TabsTrigger>
            <TabsTrigger value="alerts" style={{ color: "#9ca3af" }}>Smart Alerts</TabsTrigger>
            <TabsTrigger value="heatmap" style={{ color: "#9ca3af" }}>Route Heatmap</TabsTrigger>
          </TabsList>

          {/* Monthly Report */}
          <TabsContent value="monthly">
            {/* Stats Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
              <Card style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.2)" }}>
                <CardContent style={{ padding: "24px", textAlign: "center" }}>
                  <p style={{ fontSize: "36px", fontWeight: "bold", color: "#4ade80" }}>{monthlyReport.totalCO2}kg</p>
                  <p style={{ color: "#9ca3af", fontSize: "14px" }}>Total CO₂ This Month</p>
                  <p style={{ color: "#22c55e", fontSize: "12px", marginTop: "8px", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                    <TrendingDown size={14} />
                    {monthlyReport.improvement}% vs last month
                  </p>
                </CardContent>
              </Card>

              <Card style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.2)" }}>
                <CardContent style={{ padding: "24px", textAlign: "center" }}>
                  <p style={{ fontSize: "36px", fontWeight: "bold", color: "#4ade80" }}>{monthlyReport.aqiExposure.good}%</p>
                  <p style={{ color: "#9ca3af", fontSize: "14px" }}>Time in Good AQI</p>
                </CardContent>
              </Card>

              <Card style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.2)" }}>
                <CardContent style={{ padding: "24px", textAlign: "center" }}>
                  <p style={{ fontSize: "36px", fontWeight: "bold", color: "#FB923C" }}>{monthlyReport.toxinsInhaled.pm25}μg</p>
                  <p style={{ color: "#9ca3af", fontSize: "14px" }}>PM2.5 Inhaled</p>
                </CardContent>
              </Card>

              <Card style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.2)" }}>
                <CardContent style={{ padding: "24px", textAlign: "center" }}>
                  <p style={{ fontSize: "36px", fontWeight: "bold", color: "#4ade80" }}>27</p>
                  <p style={{ color: "#9ca3af", fontSize: "14px" }}>Eco Activities Done</p>
                </CardContent>
              </Card>
            </div>

            {/* Categories */}
            <Card style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.2)" }}>
              <CardHeader>
                <CardTitle style={{ color: "#f0f5f2" }}>CO₂ by Category</CardTitle>
              </CardHeader>
              <CardContent style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {monthlyReport.categories.map((cat) => (
                  <div key={cat.name}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ color: "#f0f5f2" }}>{cat.name}</span>
                      <span style={{ color: cat.change < 0 ? "#22c55e" : "#ef4444", display: "flex", alignItems: "center", gap: "4px" }}>
                        {cat.change < 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                        {cat.change}%
                      </span>
                    </div>
                    <div style={{ height: "8px", background: "rgba(34, 197, 94, 0.2)", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${cat.current}%`, background: "#4ade80", borderRadius: "4px" }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts */}
          <TabsContent value="alerts">
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {predictiveAlerts.map((alert) => (
                <Card key={alert.id} style={{ 
                  background: "rgba(34, 197, 94, 0.1)", 
                  border: `1px solid ${alert.type === "warning" ? "rgba(251, 146, 60, 0.3)" : alert.type === "alert" ? "rgba(239, 68, 68, 0.3)" : "rgba(34, 197, 94, 0.3)"}` 
                }}>
                  <CardContent style={{ padding: "20px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    <AlertTriangle style={{ color: alert.type === "warning" ? "#FB923C" : alert.type === "alert" ? "#EF4444" : "#4ade80" }} />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ color: "#f0f5f2", fontWeight: "600", marginBottom: "4px" }}>{alert.title}</h3>
                      <p style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "8px" }}>{alert.description}</p>
                      <p style={{ color: "#4ade80", fontSize: "14px" }}>💡 {alert.recommendation}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Heatmap */}
          <TabsContent value="heatmap">
            <Card style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.2)" }}>
              <CardHeader>
                <CardTitle style={{ color: "#f0f5f2" }}>Area-wise AQI Status</CardTitle>
              </CardHeader>
              <CardContent style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {routeHeatmapData.map((area) => (
                  <div key={area.area} style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    background: "rgba(0, 0, 0, 0.2)",
                    borderRadius: "8px"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: getAQIColor(area.aqi) }} />
                      <span style={{ color: "#f0f5f2" }}>{area.area}</span>
                    </div>
                    <span style={{ color: getAQIColor(area.aqi), fontWeight: "600" }}>{area.aqi}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Insights;