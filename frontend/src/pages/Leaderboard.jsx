import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Trophy,
  Medal,
  Crown,
  TrendingUp,
  TrendingDown,
  Users,
  Building,
  Leaf,
  Flame,
} from "lucide-react";
import { serverUrl } from "@/main";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("weekly");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${serverUrl}/api/v4/leader`, {
          credentials: "include",
        });
        const data = await res.json();
        setLeaders(data.leaderboard || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [timeframe]);

  const getRankIcon = (rank) => {
    if (rank === 1)
      return <Crown className="text-yellow-400 animate-pulse w-6 h-6" />;
    if (rank === 2)
      return <Medal className="text-slate-300 w-5 h-5" />;
    if (rank === 3)
      return <Medal className="text-amber-600 w-5 h-5" />;
    return (
      <span className="font-bold text-muted-foreground text-[0.95rem]">
        #{rank}
      </span>
    );
  };

  const topThree = leaders.slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f0d]">
        <Navbar />
        <div className="text-center mt-40 text-muted-foreground text-lg">
          Loading leaderboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f0d]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 pt-28 pb-12">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-[1.6rem] sm:text-[1.9rem] md:text-[2.2rem] font-bold text-white flex items-center gap-2">
              <Trophy className="text-yellow-400" />
              Leaderboard
            </h1>
            <p className="text-muted-foreground mt-1">
              See how you rank against others
            </p>
          </div>

          <div className="flex gap-2">
            {["weekly", "monthly", "alltime"].map((tf) => (
              <Button
                key={tf}
                size="sm"
                onClick={() => setTimeframe(tf)}
                className={
                  timeframe === tf
                    ? "bg-gradient-to-r from-green-400 to-teal-400 text-black"
                    : "border border-green-500/30 text-white"
                }
              >
                {tf}
              </Button>
            ))}
          </div>
        </div>

        {/* PODIUM */}
        {topThree.length === 3 && (
          <div className="flex justify-center items-end gap-6 mb-12">
            {[topThree[1], topThree[0], topThree[2]].map((user, index) => (
              <Card
                key={user._id || index}
                onClick={() => setSelectedUser(user)}
                className="cursor-pointer bg-[#141e19]/80 border border-green-500/20 rounded-xl hover:scale-105 transition-all"
                style={{
                  width: index === 1 ? 180 : 150,
                  height: index === 1 ? 210 : 180,
                }}
              >
                <CardContent className="flex flex-col items-center justify-end h-full pb-4">
                  <Avatar className="w-14 h-14 mb-2 border border-green-500/30">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.name?.[0]}
                    </AvatarFallback>
                  </Avatar>

                  {getRankIcon(user.rank)}

                  <p className="text-white text-[0.9rem] sm:text-[0.95rem] md:text-[1rem] font-medium mt-1">
                    {user.name}
                  </p>

                  <p className="text-[1rem] sm:text-[1.1rem] md:text-[1.2rem] font-bold text-green-400">
                    {user.score}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* TABS */}
        <Tabs defaultValue="all">
          <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-8 bg-[#141e19]/80">
            <TabsTrigger value="all">
              <Users className="w-4 h-4 mr-1" />
              All
            </TabsTrigger>
            <TabsTrigger value="individuals">
              <Trophy className="w-4 h-4 mr-1" />
              Individuals
            </TabsTrigger>
            <TabsTrigger value="cities">
              <Building className="w-4 h-4 mr-1" />
              Cities
            </TabsTrigger>
          </TabsList>

          {/* LEADERBOARD LIST */}
          <TabsContent value="all">
            <Card className="bg-[#141e19]/80 border border-green-500/20 rounded-xl">
              <CardContent className="p-0">
                {leaders.map((user, index) => (
                  <div
                    key={user._id || index}
                    onClick={() => setSelectedUser(user)}
                    className="flex items-center gap-4 p-4 border-b border-green-500/10 hover:bg-green-500/5 cursor-pointer transition"
                  >
                    <div className="w-8">{getRankIcon(user.rank)}</div>

                    <Avatar className="w-12 h-12 border border-green-500/30">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>
                        {user.name?.[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <p className="text-[0.95rem] sm:text-[1.05rem] md:text-[1.1rem] font-semibold text-white truncate">
                        {user.name}
                      </p>
                      <div className="flex items-center gap-2 text-[0.75rem] sm:text-[0.8rem] md:text-[0.85rem] text-muted-foreground">
                        <Flame className="w-3 h-3 text-orange-500" />
                        Eco Champion
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-[1rem] sm:text-[1.1rem] md:text-[1.15rem] font-bold text-green-400">
                        {user.score}
                      </p>

                      <div
                        className={`flex items-center justify-end gap-1 text-sm ${
                          user.change >= 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {user.change >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {user.change}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* USER DETAIL DIALOG */}
        <Dialog
          open={!!selectedUser}
          onOpenChange={() => setSelectedUser(null)}
        >
          <DialogContent className="bg-[#141e19] border border-green-500/30 rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-[1.1rem] sm:text-[1.2rem] md:text-[1.3rem] font-semibold text-white flex items-center gap-2">
                <Leaf className="text-green-400" />
                {selectedUser?.name}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                User eco performance summary
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4">
              <div className="flex justify-between p-3 bg-green-500/10 rounded-lg">
                <span className="text-white">Score</span>
                <span className="text-[1.15rem] text-green-400 font-bold">
                  {selectedUser?.score}
                </span>
              </div>

              <Badge className="mt-3 border border-green-500/40 text-green-400">
                <TrendingUp className="w-3 h-3 mr-1" />
                {selectedUser?.change}
              </Badge>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Leaderboard;
