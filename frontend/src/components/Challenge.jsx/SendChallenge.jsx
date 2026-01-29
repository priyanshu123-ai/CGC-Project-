import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Leaf,
  Recycle,
  Bike,
  Zap,
  Trophy,
  Clock,
  Gift,
  Users,
  Target,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { CHALLENGE_TEMPLATES } from "./ChallengeTemplate";
import { serverUrl } from "@/main";

const iconMap = {
  leaf: <Leaf className="w-6 h-6" />,
  recycle: <Recycle className="w-6 h-6" />,
  bike: <Bike className="w-6 h-6" />,
  zap: <Zap className="w-6 h-6" />,
};

const SendChallenge = ({ opponent }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(
    CHALLENGE_TEMPLATES[0]
  );
  const [sent, setSent] = useState(false);

  const sendChallenge = async () => {
    try {
      setLoading(true);

      await fetch(`${serverUrl}/api/v6/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          opponentId: opponent?._id,
          email: email || undefined,
          template: selectedTemplate,
        }),
      });

      setSent(true);
      setTimeout(() => {
        setSent(false);
        setEmail("");
      }, 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(180deg, #0a0f0d 0%, #0d1512 100%)",
      }}
    >
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-4xl pt-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div
              className="p-3 rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(34,197,94,0.3), rgba(20,184,166,0.2))",
                border: "1px solid rgba(34,197,94,0.3)",
                boxShadow: "0 4px 12px rgba(34,197,94,0.2)",
              }}
            >
              <Send className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Send Challenge
              </h1>
              <p className="text-gray-400 mt-1">
                Challenge a friend to go green together
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => navigate("/my-challenges")}
            className="border-green-500/30 text-green-400 hover:bg-green-500/10"
          >
            <Trophy className="w-4 h-4 mr-2" />
            My Challenges
          </Button>
        </div>

        {/* Email Input */}
        {!opponent && (
          <Card
            className="border-0 backdrop-blur-xl mb-6"
            style={{
              background: "rgba(15,25,23,0.7)",
              border: "1px solid rgba(37,58,52,0.5)",
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-5 h-5 text-green-400" />
                <span className="font-medium text-white">
                  Challenge by Email
                </span>
              </div>
              <Input
                type="email"
                placeholder="Enter opponent's email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#0a0f0d] text-white"
              />
            </CardContent>
          </Card>
        )}

        {/* Templates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {CHALLENGE_TEMPLATES.map((template, index) => (
            <Card
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className="cursor-pointer border-0"
              style={{
                background:
                  selectedTemplate.id === template.id
                    ? "rgba(34,197,94,0.15)"
                    : "rgba(15,25,23,0.7)",
                border:
                  selectedTemplate.id === template.id
                    ? "2px solid rgba(34,197,94,0.6)"
                    : "1px solid rgba(37,58,52,0.5)",
                animation: `fadeIn 0.4s ease-out ${index * 0.1}s forwards`,
                opacity: 0,
              }}
            >
              <CardContent className="p-5 flex gap-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${template.color} text-white`}
                >
                  {iconMap[template.icon]}
                </div>
                <div>
                  <h3 className="text-white font-semibold">
                    {template.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {template.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Send Button */}
        <Button
          onClick={sendChallenge}
          disabled={loading || (!opponent && !email)}
          className="w-full h-14 text-lg font-semibold"
          style={{
            background: "linear-gradient(135deg, #22C55E, #14B8A6)",
            color: "#0a0f0d",
          }}
        >
          {loading ? "Sending..." : sent ? "Challenge Sent!" : "Send Challenge"}
          {!loading && !sent && <ArrowRight className="ml-2 w-5 h-5" />}
        </Button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SendChallenge;
