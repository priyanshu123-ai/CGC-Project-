import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Recycle,
  Leaf,
  AlertTriangle,
  CheckCircle,
  Scan,
} from "lucide-react";

const BillResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0a0f0d" }}
      >
        <div className="text-center">
          <p className="text-gray-400 mb-4">No analysis data found</p>
          <Button
            onClick={() => navigate("/bill-scanner")}
            className="bg-emerald-500 hover:bg-emerald-600"
          >
            Go to Scanner
          </Button>
        </div>
      </div>
    );
  }

  const getImpactStyles = (impact) => {
    switch (impact) {
      case "hazardous":
        return {
          border: "border-red-500/50",
          bg: "bg-red-500/10",
          badge: "bg-red-500/20 text-red-400",
          icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
        };
      case "moderate":
        return {
          border: "border-yellow-500/50",
          bg: "bg-yellow-500/10",
          badge: "bg-yellow-500/20 text-yellow-400",
          icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
        };
      case "eco":
        return {
          border: "border-emerald-500/50",
          bg: "bg-emerald-500/10",
          badge: "bg-emerald-500/20 text-emerald-400",
          icon: <Leaf className="w-5 h-5 text-emerald-400" />,
        };
      default:
        return {
          border: "border-gray-500/50",
          bg: "bg-gray-500/10",
          badge: "bg-gray-500/20 text-gray-400",
          icon: <CheckCircle className="w-5 h-5 text-gray-400" />,
        };
    }
  };

  const getScoreColor = (score) => {
    if (score <= 10) return "text-emerald-400";
    if (score <= 20) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen" style={{ background: "#0a0f0d" }}>
      <Navbar />

      <div className="container mx-auto px-4 py-8 mt-16">
        {/* Back Button */}
        <Button
          onClick={() => navigate("/bill-scanner")}
          variant="ghost"
          className="mb-6 text-gray-400 hover:text-white hover:bg-emerald-500/10"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Scanner
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-white">Analysis </span>
            <span className="text-emerald-400">Results</span>
          </h1>
          <p className="text-gray-400">
            {result.productsDetected} products detected from {result.inputType}
          </p>
        </div>

        {/* Summary Card */}
        <Card
          className="max-w-4xl mx-auto mb-8 border-emerald-500/30"
          style={{ background: "rgba(15, 25, 23, 0.9)" }}
        >
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Pollution Score
                </h2>
                <p className="text-gray-400">{result.summary}</p>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className={`text-6xl font-bold ${getScoreColor(
                    result.pollutionScore
                  )}`}
                >
                  {result.pollutionScore}
                </div>
                <div className="text-gray-400 text-sm">
                  / 100
                  <br />
                  points
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Breakdown */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold text-white mb-4">
            Product Breakdown
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            {result.breakdown.map((item, index) => {
              const styles = getImpactStyles(item.impact);

              return (
                <Card
                  key={index}
                  className={`${styles.border} ${styles.bg}`}
                  style={{ background: "rgba(15, 25, 23, 0.7)" }}
                >
                  <CardContent className="p-5">
                    {/* Header */}
                    <div className="flex justify-between mb-3">
                      <h4 className="text-lg font-semibold text-white">
                        {item.item}
                      </h4>
                      {styles.icon}
                    </div>

                    {/* Reason */}
                    <p className="text-gray-400 text-sm mb-4">
                      {item.reason}
                    </p>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-3 mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${styles.badge}`}
                      >
                        {item.impact.toUpperCase()}
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                          item.recyclable
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        <Recycle className="w-3 h-3" />
                        {item.recyclable
                          ? "Recyclable"
                          : "Not Recyclable"}
                      </span>

                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400">
                        Score: {item.pollution}
                      </span>
                    </div>

                    {/* Alternatives */}
                    {item.alternatives?.length > 0 && (
                      <div className="pt-3 border-t border-emerald-500/20">
                        <p className="text-sm font-medium text-emerald-400 mb-2 flex items-center gap-2">
                          <Leaf className="w-4 h-4" />
                          Better Alternatives
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {item.alternatives.map((alt, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 rounded-md text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                            >
                              {alt}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Scan Again */}
        <div className="text-center mt-10">
          <Button
            onClick={() => navigate("/bill-scanner")}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg"
          >
            <Scan className="w-5 h-5 mr-2" />
            Scan Another Product
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BillResult;
