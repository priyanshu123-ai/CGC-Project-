import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Scan, Upload, Search, Loader2 } from "lucide-react";
import { serverUrl } from "@/main";

const BillScanner = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [manualInput, setManualInput] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      handleAnalyze(selectedFile);
    }
  };

  const handleAnalyze = async (selectedFile) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("bill", selectedFile);

      const res = await fetch(`${serverUrl}/api/v8/analyze`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      navigate("/bill-result", { state: { result: data } });
    } catch (err) {
      console.error(err);
      alert("Error analyzing bill");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSearch = async () => {
    if (!manualInput.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`${serverUrl}/api/v8/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billText: manualInput }),

        credentials: "include",
      });

      const data = await res.json();
      navigate("/bill-result", { state: { result: data } });
    } catch (err) {
      console.error(err);
      alert("Error analyzing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#0a0f0d" }}>
      <Navbar />

      <div className="container mx-auto px-4 py-12 mt-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Product </span>
            <span className="text-emerald-400">Scanner</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Scan any product to see its environmental impact on your score
          </p>
        </div>

        {/* Scanner Cards */}
        <Card
          className="max-w-4xl mx-auto border-emerald-500/20"
          style={{ background: "rgba(15, 25, 23, 0.9)" }}
        >
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Scan Product */}
              <div
                onClick={() => fileInputRef.current.click()}
                className="border-2 border-dashed border-emerald-500/30 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500/60 hover:bg-emerald-500/5 transition-all duration-300"
                style={{ minHeight: "200px" }}
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                  <Scan className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Scan Product
                </h3>
                <p className="text-gray-400 text-sm text-center">
                  Upload a photo or scan barcode
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Upload Image */}
              <div
                onClick={() => imageInputRef.current.click()}
                className="border-2 border-dashed border-emerald-500/30 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500/60 hover:bg-emerald-500/5 transition-all duration-300"
                style={{ minHeight: "200px" }}
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Upload Image
                </h3>
                <p className="text-gray-400 text-sm text-center">
                  Choose from gallery
                </p>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-emerald-500/20" />
              <span className="text-gray-400 text-sm">or search manually</span>
              <div className="flex-1 h-px bg-emerald-500/20" />
            </div>

            {/* Manual Search */}
            <div className="flex gap-3">
              <Input
                placeholder="Enter product name or barcode..."
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleManualSearch()}
                className="flex-1 bg-transparent border-emerald-500/30 text-white placeholder:text-gray-500 focus:border-emerald-500"
              />

              <Button
                onClick={handleManualSearch}
                disabled={loading || !manualInput.trim()}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Loading Overlay */}
        {loading && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "#0a0f0d" }}
          >
            <div
              className="rounded-2xl p-12 flex flex-col items-center"
              style={{
                background: "rgba(15, 25, 23, 0.9)",
                minWidth: "400px",
              }}
            >
              <div className="relative w-40 h-40 mb-8">
                <div
                  className="absolute inset-0 rounded-full border-4 border-emerald-500/30"
                  style={{
                    borderTopColor: "#10b981",
                    borderRightColor: "#10b981",
                    animation: "spin 1.5s linear infinite",
                  }}
                />
                <div
                  className="absolute inset-4 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(16, 185, 129, 0.1)" }}
                >
                  <Scan className="w-16 h-16 text-emerald-400" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">
                Analyzing Product...
              </h3>
              <p className="text-gray-400">Calculating environmental impact</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillScanner;
