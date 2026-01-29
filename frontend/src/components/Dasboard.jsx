import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PollutionScoreRing from "./PollutionScoreRing";
import {
  Leaf,
  ChevronRight,
  Wind,
  AlertTriangle,
  Brain,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import ScoreBreakdown from "./ScoreBreakdown";
import { serverUrl } from "@/main";

const getScoreMeta = (score) => {
  if (score >= 701)
    return {
      text: "text-green-400",
      label: "Low Pollution Impact",
    };

  if (score >= 401)
    return {
      text: "text-yellow-400",
      label: "Moderate Pollution Impact",
    };

  return {
    text: "text-red-400",
    label: "High Pollution Impact",
  };
};

const Dashboard = () => {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch(`${serverUrl}/api/v4/eco/latest`, {
          credentials: "include",
        });
        const data = await res.json();
        setAssessment(data.assessment);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f0d]">
        <Navbar />
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full border-4 border-green-500/20 border-t-green-500 animate-spin" />
          <p className="text-gray-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const score = assessment?.score || 0;
  const meta = getScoreMeta(score);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0a0f0d] to-[#0d1512]">
      <Navbar />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                {assessment?.userId?.name || "Eco Warrior"}
              </span>
            </h1>
            <p className="text-gray-400 mt-1">
              Your environmental impact overview
            </p>
          </div>

          {/* ROW 1 → Score + Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Eco Score */}
            <Card className="border border-emerald-900/40 bg-[rgba(15,25,23,0.7)] backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-500/20">
                    <Leaf className="w-4 h-4 text-green-400" />
                  </div>
                  Eco Pollution Score
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col items-center py-6">
                <PollutionScoreRing score={score} size={180} />

                <p className={`mt-4 text-lg font-semibold ${meta.text}`}>
                  {assessment?.level || "No Data"}
                </p>

                <Link to="/questionnaire" className="w-full mt-6">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-black font-semibold">
                    Update Score
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Score Breakdown */}
            <ScoreBreakdown answers={assessment?.answers} />
          </div>

          {/* ROW 2 → AI Analysis (FULL WIDTH) */}
          <Card className="border border-purple-900/40 bg-[rgba(15,25,23,0.75)] backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white text-xl">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-purple-500/20">
                  <Brain className="w-5 h-5 text-purple-400" />
                </div>
                AI Pollution Analysis
              </CardTitle>
            </CardHeader>

            <CardContent className="text-gray-300 leading-relaxed text-[15px]">
              {assessment ? (
                assessment.aiExplanation
              ) : (
                <div className="flex flex-col items-center py-10">
                  <AlertTriangle className="w-10 h-10 text-yellow-500/60 mb-3" />
                  <p className="text-gray-400">
                    Complete the assessment to see AI analysis.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ROW 3 → Precautions */}
          {assessment && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border border-green-900/40 bg-[rgba(15,25,23,0.7)] backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <ShieldCheck className="w-5 h-5 text-green-400" />
                    Personal Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {assessment.precautions.personal.map((p, i) => (
                      <li key={i} className="flex gap-3 text-gray-300">
                        <span className="w-2 h-2 bg-green-400 rounded-full mt-2" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border border-blue-900/40 bg-[rgba(15,25,23,0.7)] backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Users className="w-5 h-5 text-blue-400" />
                    Area & Community Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {assessment.precautions.area.map((p, i) => (
                      <li key={i} className="flex gap-3 text-gray-300">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mt-2" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ROW 4 → AQI */}
          <Card className="border border-sky-900/40 bg-[rgba(15,25,23,0.7)] backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Wind className="w-5 h-5 text-sky-400" />
                Air Quality (Live)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-10">
              <p className="text-gray-400">
                Live AQI integration (OpenAQ / Google AQI) can be shown here.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
