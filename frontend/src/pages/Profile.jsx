import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Trophy, 
  Leaf, 
  Zap, 
  Car, 
  ShoppingBag,
  Award,
  Target,
  Calendar,
  MapPin,
  Edit,
  Settings,
  TrendingUp,
  CheckCircle,
  Clock,
  Loader2
} from "lucide-react";
import { serverUrl } from "@/main";



const staticData = {
  maxScore: 900,
  rank: 4,
  totalUsers: 15000,
  streakDays: 12,
  carbonSaved: "245 kg",
  treesPlanted: 8,
};

const scoreBreakdown = [
  { category: "Electricity", score: 185, maxScore: 225, icon: Zap, color: "#F59E0B" },
  { category: "Transport", score: 210, maxScore: 225, icon: Car, color: "#3B82F6" },
  { category: "Shopping", score: 165, maxScore: 225, icon: ShoppingBag, color: "#14B8A6" },
  { category: "Lifestyle", score: 160, maxScore: 225, icon: Leaf, color: "#22C55E" },
];

const recentActivities = [
  { action: "Completed 'Plastic-Free Week' challenge", points: "+50", time: "2 hours ago", type: "challenge" },
  { action: "Used public transport for 5 days", points: "+30", time: "1 day ago", type: "transport" },
  { action: "Scanned eco-friendly product", points: "+10", time: "2 days ago", type: "scan" },
  { action: "Joined family competition", points: "+20", time: "3 days ago", type: "family" },
  { action: "Reduced electricity by 15%", points: "-25", time: "5 days ago", type: "electricity" },
];

const badges = [
  { name: "Eco Warrior", description: "Complete 10 challenges", icon: Trophy, earned: true },
  { name: "Green Streak", description: "7-day eco streak", icon: Zap, earned: true },
  { name: "Carbon Crusher", description: "Save 100kg CO₂", icon: Leaf, earned: true },
  { name: "Public Transport Hero", description: "Use public transport 20 times", icon: Car, earned: false },
  { name: "Smart Shopper", description: "Scan 50 eco products", icon: ShoppingBag, earned: false },
  { name: "Family Champion", description: "Win 5 family competitions", icon: Award, earned: false },
];

const Profile = () => {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch(`${serverUrl}/api/v4/eco/latest`, {
          credentials: "include",
        });
        const data = await res.json();
        setAssessment(data.assessment);
      } catch (err) {
        console.error("Failed to fetch assessment:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  const fadeInStyle = (delay) => ({
    animation: `fadeInUp 0.6s ease-out ${delay}s forwards`,
    opacity: 0,
  });

  if (loading) {
    return (
      <div className="min-h-screen mt-5" style={{ background: "linear-gradient(135deg, #0a0f0d 0%, #1a2e1a 50%, #0d1f15 100%)" }}>
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-green-500 mx-auto mb-4" />
            <p className="text-green-400 text-lg">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0a0f0d 0%, #1a2e1a 50%, #0d1f15 100%)" }}>
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <Card className="bg-white/5 border-red-500/30 backdrop-blur-sm p-8">
            <div className="text-center">
              <Target className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-400 text-lg">Unauthorized or no assessment found</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4"
                style={{ background: "linear-gradient(135deg, #22C55E, #14B8A6)" }}
              >
                Retry
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const userProfile = {
    name: assessment.userId?.name || "User",
    email: assessment.userId?.email || "user@example.com",
    location: assessment.userId?.profile?.location || "India",
    joinedDate: assessment.userId?.createdAt 
      ? new Date(assessment.userId.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : "2024",
    avatar: assessment.userId?.profile?.profilePhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
    pollutionScore: assessment.score || 0,
    maxScore: staticData.maxScore,
    rank: staticData.rank,
    totalUsers: staticData.totalUsers,
    streakDays: staticData.streakDays,
    carbonSaved: staticData.carbonSaved,
    treesPlanted: staticData.treesPlanted,
  };

  const scorePercentage = (userProfile.pollutionScore / userProfile.maxScore) * 100;
  const strokeDashoffset = 565 - (scorePercentage / 100) * 565;

  return (
    <div className="min-h-screen text-white" style={{ background: "linear-gradient(135deg, #0a0f0d 0%, #1a2e1a 50%, #0d1f15 100%)" }}>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scoreRingFill {
          from {
            stroke-dashoffset: 565;
          }
          to {
            stroke-dashoffset: ${strokeDashoffset};
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .hover-lift {
          transition: all 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(34, 197, 94, 0.2);
        }
      `}</style>
      
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header */}
        <Card 
          className="mb-8 overflow-hidden border-0 hover-lift"
          style={{ 
            ...fadeInStyle(0.1),
            background: "linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(20, 184, 166, 0.05))",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(34, 197, 94, 0.2)"
          }}
        >
          <div 
            className="h-32"
            style={{ background: "linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(20, 184, 166, 0.2))" }}
          />
          <CardContent className="relative pt-0 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-16">
              <Avatar className="h-32 w-32 border-4 border-green-500/30 shadow-xl" style={{ boxShadow: "0 0 30px rgba(34, 197, 94, 0.3)" }}>
                <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                <AvatarFallback className="text-3xl font-bold" style={{ background: "linear-gradient(135deg, #22C55E, #14B8A6)" }}>
                  {userProfile.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1">
                      {userProfile.name}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                      <MapPin className="h-4 w-4" />
                      {userProfile.location}
                      <span>•</span>
                      <Calendar className="h-4 w-4" />
                      Joined {userProfile.joinedDate}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Rank #{userProfile.rank}
                      </Badge>
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30" style={{ animation: "pulse 2s infinite" }}>
                        <Zap className="h-3 w-3 mr-1" />
                        {userProfile.streakDays} Day Streak
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsEditing(!isEditing)}
                      className="border-green-500/30 text-green-400 hover:bg-green-500/10 bg-transparent"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/10">
                      <Settings className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Pollution Score Card */}
          <Card 
            className="border-0 hover-lift"
            style={{ 
              ...fadeInStyle(0.2),
              background: "linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(20, 184, 166, 0.05))",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(34, 197, 94, 0.2)"
            }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <Leaf className="h-5 w-5 text-green-500" />
                Pollution Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="90"
                      stroke="rgba(34, 197, 94, 0.1)"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="90"
                      stroke="url(#scoreGradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray="565"
                      strokeLinecap="round"
                      style={{ 
                        strokeDashoffset: strokeDashoffset,
                        animation: "scoreRingFill 1.5s ease-out forwards",
                        filter: "drop-shadow(0 0 10px rgba(34, 197, 94, 0.5))"
                      }}
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22C55E" />
                        <stop offset="100%" stopColor="#14B8A6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span 
                      className="text-5xl font-bold"
                      style={{ 
                        background: "linear-gradient(135deg, #22C55E, #14B8A6)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                      }}
                    >
                      {userProfile.pollutionScore}
                    </span>
                    <span className="text-gray-400 text-sm">
                      / {userProfile.maxScore}
                    </span>
                  </div>
                </div>
                <p className="text-center text-gray-400 text-sm mt-4">
                  You're in the top <span className="text-green-400 font-semibold">8%</span> of users!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Score Breakdown */}
          <Card 
            className="border-0 hover-lift"
            style={{ 
              ...fadeInStyle(0.3),
              background: "linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(20, 184, 166, 0.05))",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(34, 197, 94, 0.2)"
            }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <Target className="h-5 w-5 text-green-500" />
                Score Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {scoreBreakdown.map((item) => (
                <div key={item.category}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div 
                        className="p-1.5 rounded-lg"
                        style={{ background: `${item.color}20` }}
                      >
                        <item.icon className="h-4 w-4" style={{ color: item.color }} />
                      </div>
                      <span className="text-sm text-gray-300">
                        {item.category}
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">
                      {item.score}/{item.maxScore}
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${(item.score / item.maxScore) * 100}%`,
                        background: `linear-gradient(90deg, ${item.color}, ${item.color}aa)`,
                        boxShadow: `0 0 10px ${item.color}50`
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Badges */}
          <Card 
            className="border-0 hover-lift"
            style={{ 
              ...fadeInStyle(0.4),
              background: "linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(20, 184, 166, 0.05))",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(34, 197, 94, 0.2)"
            }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <Trophy className="h-5 w-5 text-green-500" />
                Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {badges.map((badge) => (
                  <div 
                    key={badge.name}
                    className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${
                      badge.earned 
                        ? 'hover:scale-105 cursor-pointer' 
                        : 'opacity-40'
                    }`}
                    style={{
                      background: badge.earned 
                        ? "linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(20, 184, 166, 0.1))"
                        : "rgba(255,255,255,0.05)",
                      border: badge.earned ? "1px solid rgba(34, 197, 94, 0.3)" : "1px solid rgba(255,255,255,0.1)"
                    }}
                    title={badge.description}
                  >
                    <div 
                      className="p-2 rounded-full mb-2"
                      style={{ 
                        background: badge.earned 
                          ? "linear-gradient(135deg, #22C55E, #14B8A6)" 
                          : "rgba(255,255,255,0.1)"
                      }}
                    >
                      <badge.icon className={`h-5 w-5 ${badge.earned ? 'text-white' : 'text-gray-500'}`} />
                    </div>
                    <span className={`text-xs text-center ${badge.earned ? 'text-white' : 'text-gray-500'}`}>
                      {badge.name}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <span className="text-sm text-gray-400">
                  <span className="text-green-400 font-semibold">{badges.filter(b => b.earned).length}</span>/{badges.length} badges earned
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card 
          className="border-0 hover-lift"
          style={{ 
            ...fadeInStyle(0.5),
            background: "linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(20, 184, 166, 0.05))",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(34, 197, 94, 0.2)"
          }}
        >
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <Clock className="h-5 w-5 text-green-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-xl transition-all duration-300 hover:bg-white/5"
                  style={{ 
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)"
                  }}
                >
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{activity.action}</p>
                    <p className="text-gray-500 text-xs">{activity.time}</p>
                  </div>
                  <Badge 
                    className={`${
                      activity.points.startsWith('+') 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}
                  >
                    {activity.points}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
