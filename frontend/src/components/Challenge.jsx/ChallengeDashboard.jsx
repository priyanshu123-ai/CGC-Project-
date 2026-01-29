import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Swords,
  Send,
  Trophy,
  Leaf,
  Lightbulb,
  Clock,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { serverUrl } from "@/main";

const ChallengeDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState(null);
  const [logs, setLogs] = useState([]);
  const [action, setAction] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadChallenge = async () => {
    try {
      const res = await fetch(`${serverUrl}/api/v6/${id}`, {
        credentials: "include",
      });
      const data = await res.json();
      setChallenge(data.challenge);
      setLogs(data.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChallenge();
  }, [id]);

  const submitAction = async () => {
    if (!action.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch(`${serverUrl}/api/v7/recycle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action, challengeId: id }),
      });
      const data = await res.json();
      setSuggestions(data.suggestions || []);
      setAction("");
      loadChallenge();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen"
        style={{
          background: "linear-gradient(180deg, #0a0f0d 0%, #0d1512 100%)",
        }}
      >
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-4xl pt-24">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-14 h-14 rounded-full border-4 border-green-500/20 border-t-green-500 animate-spin" />
            <p className="text-gray-400 text-sm mt-4">
              Loading challenge...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div
        className="min-h-screen"
        style={{
          background: "linear-gradient(180deg, #0a0f0d 0%, #0d1512 100%)",
        }}
      >
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-4xl pt-24 text-center">
          <Swords className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Challenge Not Found
          </h2>
          <p className="text-gray-400 mb-4">
            This challenge may have ended or doesn't exist.
          </p>
          <Button
            onClick={() => navigate("/my-challenges")}
            variant="outline"
            className="border-green-500/30 text-green-400 hover:bg-green-500/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Challenges
          </Button>
        </div>
      </div>
    );
  }

  const totalProgress =
    challenge.progress.challenger + challenge.progress.opponent;

  const challengerPercent =
    totalProgress > 0
      ? (challenge.progress.challenger / totalProgress) * 100
      : 50;

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
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/my-challenges")}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-4 flex-1">
            <div
              className="p-3 rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(34,197,94,0.3), rgba(20,184,166,0.2))",
                border: "1px solid rgba(34,197,94,0.3)",
              }}
            >
              <Swords className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {challenge.title}
              </h1>
              <p className="text-gray-400">{challenge.description}</p>
            </div>
          </div>

          <Badge className="bg-green-500/20 text-green-400 border-0">
            <Trophy className="w-3 h-3 mr-1" />
            {challenge.reward} pts
          </Badge>
        </div>

        {/* Action Input */}
        <Card className="border-0 mb-6 bg-[rgba(15,25,23,0.7)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Leaf className="w-5 h-5 text-green-400" />
              Log Your Eco Action
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Input
                value={action}
                onChange={(e) => setAction(e.target.value)}
                placeholder="What eco action did you do today?"
                className="bg-[#0a0f0d] text-white"
                onKeyDown={(e) => e.key === "Enter" && submitAction()}
              />
              <Button
                onClick={submitAction}
                disabled={submitting || !action.trim()}
                className="px-6 bg-green-500 text-[#0a0f0d]"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-[#0a0f0d]/30 border-t-[#0a0f0d] rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit
                  </>
                )}
              </Button>
            </div>

            {/* AI Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-4 rounded-xl bg-green-500/10">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-green-400" />
                  <span className="font-medium text-white">
                    AI Suggestions
                  </span>
                </div>
                <div className="space-y-2">
                  {suggestions.map((s, i) => (
                    <div
                      key={i}
                      className="flex gap-2 p-3 rounded-lg bg-black/30"
                    >
                      <Lightbulb className="w-4 h-4 text-yellow-400 mt-1" />
                      <p className="text-sm text-gray-300">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Log */}
        <Card className="border-0 bg-[rgba(15,25,23,0.7)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Clock className="w-5 h-5 text-green-400" />
              Activity History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No actions logged yet.
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log, index) => (
                  <div
                    key={log._id || index}
                    className="flex gap-3 p-3 rounded-xl bg-black/30"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs text-white">
                        {log.user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white font-medium">
                        {log.user?.name}
                      </p>
                      <p className="text-sm text-gray-400">{log.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChallengeDashboard;
