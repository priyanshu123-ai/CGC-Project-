import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Clock,
  CheckCircle,
  XCircle,
  Play,
  Send,
  Users,
  Gift,
  ChevronRight,
  Hourglass,
  Swords,
} from "lucide-react";
import { serverUrl } from "@/main";

const MyChallenges = () => {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        const res = await fetch(`${serverUrl}/api/v6/my`, {
          credentials: "include",
        });
        const data = await res.json();
        setChallenges(data.challenges || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadChallenges();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-0">
            <Hourglass className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "active":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-0">
            <Play className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-0">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "declined":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-0">
            <XCircle className="w-3 h-3 mr-1" />
            Declined
          </Badge>
        );
      default:
        return null;
    }
  };

  const filteredChallenges = challenges.filter((c) =>
    activeTab === "all" ? true : c.status === activeTab
  );

  const handleAccept = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/v6/accept/${id}`, {
        method: "POST",
        credentials: "include",
      });
      setChallenges((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: "active" } : c))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecline = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/v6/decline/${id}`, {
        method: "POST",
        credentials: "include",
      });
      setChallenges((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: "declined" } : c))
      );
    } catch (err) {
      console.error(err);
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
              Loading challenges...
            </p>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
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
              <h1 className="text-3xl font-bold text-white">My Challenges</h1>
              <p className="text-gray-400">
                Track and manage your eco challenges
              </p>
            </div>
          </div>

          <Button
            onClick={() => navigate("/send")}
            style={{
              background: "linear-gradient(135deg, #22C55E, #14B8A6)",
              color: "#0a0f0d",
            }}
          >
            <Send className="w-4 h-4 mr-2" />
            Send Challenge
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-[rgba(15,25,23,0.7)]">
            {["all", "pending", "active", "completed"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="capitalize data-[state=active]:bg-green-500"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Challenges */}
        <div className="space-y-4">
          {filteredChallenges.map((challenge) => (
            <Card
              key={challenge._id}
              className="border-0 bg-[rgba(15,25,23,0.7)]"
            >
              <CardContent className="p-5 flex justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {challenge.title}
                    </h3>
                    {getStatusBadge(challenge.status)}
                  </div>

                  <p className="text-gray-400 mb-2">
                    {challenge.description}
                  </p>

                  <div className="flex gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {challenge.durationDays} days
                    </span>
                    <span className="flex items-center gap-1">
                      <Gift className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">
                        {challenge.reward} pts
                      </span>
                    </span>
                    {challenge.challenger && (
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        vs {challenge.challenger.name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {challenge.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleAccept(challenge._id)}
                        className="bg-green-500 text-[#0a0f0d]"
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDecline(challenge._id)}
                        className="border-red-500 text-red-400"
                      >
                        Decline
                      </Button>
                    </>
                  )}

                  {challenge.status === "active" && (
                    <Button
                      size="sm"
                      onClick={() =>
                        navigate(`/challenge/${challenge._id}`)
                      }
                      className="bg-green-500 text-[#0a0f0d]"
                    >
                      Enter <ChevronRight className="ml-1 w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyChallenges;
