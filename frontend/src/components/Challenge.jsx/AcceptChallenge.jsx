import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  Swords,
  Trophy,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { serverUrl } from "@/main";

const AcceptChallenge = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("pending"); 
  // "pending" | "accepted" | "declined" | "error" | "loading"

  const accept = async () => {
    try {
      setStatus("loading");
      await fetch(`${serverUrl}/api/v6/accept/${id}`, {
        method: "POST",
        credentials: "include",
      });
      setStatus("accepted");
    } catch {
      setStatus("error");
    }
  };

  const decline = async () => {
    try {
      setStatus("loading");
      await fetch(`${serverUrl}/api/v6/decline/${id}`, {
        method: "POST",
        credentials: "include",
      });
      setStatus("declined");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-lg">
        <Card className="bg-card/80 border-border overflow-hidden">
          <CardContent className="p-8 text-center">
            {status === "pending" && (
              <div className="space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center">
                  <Swords className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    Challenge Invitation
                  </h2>
                  <p className="text-muted-foreground">
                    You've been challenged! Ready to compete?
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={accept}
                    className="h-12 text-lg bg-gradient-to-r from-emerald-500 to-emerald-600"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Accept Challenge
                  </Button>
                  <Button
                    onClick={decline}
                    variant="outline"
                    className="h-12 text-lg border-red-500/50 text-red-500 hover:bg-red-500/10"
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    Decline
                  </Button>
                </div>
              </div>
            )}

            {status === "loading" && (
              <div className="py-8">
                <Loader2 className="w-12 h-12 mx-auto animate-spin mb-4" />
                <p className="text-muted-foreground">Processing...</p>
              </div>
            )}

            {status === "accepted" && (
              <div className="space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    Challenge Accepted!
                  </h2>
                  <p className="text-muted-foreground">
                    Game on! Let's see who's more eco-friendly.
                  </p>
                </div>
                <Button
                  onClick={() => navigate(`/challenge/${id}`)}
                  className="h-12 text-lg bg-gradient-to-r from-primary to-primary/80"
                >
                  Go to Challenge
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}

            {status === "declined" && (
              <div className="space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                  <XCircle className="w-10 h-10 text-red-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    Challenge Declined
                  </h2>
                  <p className="text-muted-foreground">Maybe next time!</p>
                </div>
                <Button
                  onClick={() => navigate("/my-challenges")}
                  variant="outline"
                  className="border-primary/30"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  View My Challenges
                </Button>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
                  <XCircle className="w-10 h-10 text-yellow-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    Something Went Wrong
                  </h2>
                  <p className="text-muted-foreground">
                    This challenge may be invalid or expired.
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/my-challenges")}
                  variant="outline"
                  className="border-primary/30"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  View My Challenges
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AcceptChallenge;
