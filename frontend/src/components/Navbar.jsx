import React, { useContext, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Database,
  Gamepad2,
  LayoutDashboard,
  Leaf,
  Presentation,
  Trophy,
  User,
  LogOut,
  Settings,
  Factory,
  ChartBar,
  Inspect,
  DatabaseIcon,
} from "lucide-react";

import { Button } from "./ui/button";
import { AuthContext } from "./context/context";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import axios from "axios";
import { toast } from "react-toastify";
import { serverUrl } from "@/main";



const Navbar = () => {
  const location = useLocation();
  


  const isActive = (path) => location.pathname === path;

  const { user, setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    const res = await axios.get(`${serverUrl}/api/v1/logout`,{
      withCredentials:true
    })
     setUser(null);

     toast.success(res.data.message)


  };

 


 

  const keyframe = `
    @keyframes logoGlow {
      0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.3); }
      50% { box-shadow: 0 0 30px rgba(34, 197, 94, 0.5); }
    }
  `;

  const mainNavLinks = [
    { path: "/bill-scanner", label: "Scanner", icon: LayoutDashboard },
    { path: "/dashboard", label: "Dashboard", icon: Database },
    { path: "/recommendations", label: "Eco Products", icon: Gamepad2 },
    { path: "/chat", label: "EcoBot", icon: Trophy },
    { path: "/routes", label: "Routes", icon: Presentation },
      { path: "/pollution", label: "Pollution Insights", icon: Factory },
  ];

  return (
    <div className="fixed top-0 py-2 left-0 right-0 z-50 bg-[rgba(10,15,13,0.8)] backdrop-blur-[20px] border-b border-green-500/20 animate-[logoGlow_3s_ease-in-out_infinite] transition-transform duration-300 ease-in-out">
      <style>{keyframe}</style>

      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex justify-center items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-[linear-gradient(135deg,#22C55E,#14B8A6,#3B82F6)] flex justify-center items-center animate-[logoGlow_3s_ease-in-out_infinite] transition-transform duration-300 ease-in-out">
              <Leaf className="w-5 h-5 text-[#0a0f0d]" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-br from-green-500 via-teal-500 to-blue-500 bg-clip-text text-transparent font-space-grotesk">
              EcoSense
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden items-center gap-1 md:flex">
            {mainNavLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Button
                  className={`
                    flex items-center gap-1.5 px-3 py-2 rounded-md border-none
                    text-sm font-medium cursor-pointer transition-all duration-300 ease-in-out
                    ${
                      isActive(link.path)
                        ? "bg-green-500/15 text-green-500"
                        : "bg-transparent text-gray-400"
                    }
                  `}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Right Side */}
      <div className="flex items-center gap-[12px]">
  {user ? (
   <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <button className="relative">
      <Avatar className="w-10 h-10 border-2 border-green-500/40">
        {user?.profile?.profilePhoto ? (
          <AvatarImage src={user.profile.profilePhoto} />
        ) : (
          <AvatarFallback className="bg-[#22C55E] text-[#0a0f0d] font-semibold">
            {user?.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        )}
      </Avatar>
    </button>
  </DropdownMenuTrigger>

  <DropdownMenuContent
    align="end"
    sideOffset={10}
    className="
      w-[260px]
      rounded-2xl
      border border-green-500/20
      bg-[#0f1917]/95
      backdrop-blur-xl
      p-0
      overflow-hidden
    "
  >
    {/* ===== TOP PROFILE SECTION ===== */}
    <div className="px-5 pt-4 pb-3">
      <p className="text-base font-semibold text-white">
        {user?.name}
      </p>
      <p className="text-sm text-gray-400 truncate">
        {user?.email}
      </p>

      {/* Progress */}
      <div className="mt-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-[#1f2937] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#22C55E] to-[#14B8A6]"
              style={{
                width: `${Math.min((user?.score || 0) / 900 * 100, 100)}%`,
              }}
            />
          </div>
          <span className="text-sm font-medium text-green-400">
            {user?.score || 0}/900
          </span>
        </div>
      </div>
    </div>

    <div className="h-px bg-green-500/10" />

    {/* ===== MENU ITEMS ===== */}
    <div className="py-2">
      <Link
        to="/profile"
        className="
          flex items-center gap-3
          px-5 py-2.5
          text-sm text-gray-200
          hover:bg-green-500/10
          transition
        "
      >
        <User size={18} />
        My Profile
      </Link>

      <Link
        to="/leaderboard"
        className="
          flex items-center gap-3
          px-5 py-2.5
          text-sm text-gray-200
          hover:bg-green-500/10
          transition
        "
      >
        <Trophy size={18} />
        Leaderboard
      </Link>

        <Link
        to="/send"
        className="
          flex items-center gap-3
          px-5 py-2.5
          text-sm text-gray-200
          hover:bg-green-500/10
          transition
        "
      >
        <ChartBar size={18} />
        Challenge
      </Link>

       <Link
        to="/insights"
        className="
          flex items-center gap-3
          px-5 py-2.5
          text-sm text-gray-200
          hover:bg-green-500/10
          transition
        "
      >
        <Inspect size={18} />
        Insights
      </Link>

        <Link
        to="/pitch"
        className="
          flex items-center gap-3
          px-5 py-2.5
          text-sm text-gray-200
          hover:bg-green-500/10
          transition
        "
      >
        <Inspect size={18} />
        Presentation
      </Link>

    


    </div>

    <div className="h-px bg-green-500/10" />

    {/* ===== LOGOUT ===== */}
    <button
      onClick={handleLogout}
      className="
        w-full flex items-center gap-3
        px-5 py-3
        text-sm font-medium
        text-red-400
        hover:bg-red-500/10
        transition
      "
    >
      <LogOut size={18} />
      Sign Out
    </button>
  </DropdownMenuContent>
</DropdownMenu>

  ) : (
    <Link to="/login">
      <Button
        size="sm"
        className="px-6 py-3.5 text-[17px] font-semibold tracking-wide
          text-[#0c100f] bg-gradient-to-br from-[#22C55E] to-[#14B8A6]
          rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.35)]
          hover:shadow-[0_0_30px_rgba(34,197,94,0.55)]
          hover:scale-[1.03] transition-all duration-300 ease-out"
      >
        Get Started
      </Button>
    </Link>
  )}
</div>

        </div>
      </div>
    </div>
  );
};

export default Navbar;
