import React, { useContext, useState } from 'react'
import { Leaf, Lock, Mail, Upload, User, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import { Button } from '@/components/ui/button';

import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import { AuthContext } from '@/components/context/context';
import { serverUrl } from '@/main';

const Login = () => {
    const [loginData,setLoginData] = useState({
        email:"",
        password:""

    })

    const { setUser } = useContext(AuthContext);


    const [isLoading,setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name,value} = e.target;
        setLoginData({...loginData,[name]:value})

    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true)
            const res = await axios.post(`${serverUrl}/api/v1/login`,
                loginData,
                {withCredentials:true}

            )


            console.log(res.data)
            toast.success(res.data.messsage)
            setUser(res.data.user);
            setSuccess(true)

            setTimeout(() => {
               navigate("/") 
            },1500)
            
        } catch (err) {
            console.log(err)
             toast.error(err.response?.data?.message || "Login failed");
            
        }

    }
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg,#0c1210 0%,#060908 100%)",
      }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(29,185,84,0.15), transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(31,168,161,0.15), transparent 70%)",
          }}
        />
      </div>

      {/* Card */}
      <Card
        className="w-full max-w-xl relative z-10"
        style={{
          background:
            "linear-gradient(135deg, rgba(15,25,23,0.88), rgba(8,13,11,0.88))",
          border: "1px solid rgba(37,58,52,0.6)",
          backdropFilter: "blur(20px)",
          borderRadius: "18px",
        }}
      >
        <CardHeader className="text-center">
          <div
            className="mx-auto mb-4 w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg,#1db954,#1fa8a1,#199fe6)",
            }}
          >
            <Leaf color="#f0f5f2" />
          </div>

          <CardTitle style={{ color: "#f0f5f2", fontSize: "22px" }}>
            Welcome Back
          </CardTitle>

          <CardDescription style={{ color: "#9fb6ad", fontSize: "17px" }}>
           Sign in to continue your sustainability journey
          </CardDescription>

       
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Upload */}
           

         

            {/* Email */}
            <div>
              <label style={{ color: "#f0f5f2", fontSize: "14px" }}>
                Email
              </label>
              <div className="relative mt-2">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  color="#9fb6ad"
                />
                <Input
                  name="email"
                  placeholder="you@example.com"
                  value={loginData.email}
                  onChange={handleChange}
                  className="pl-12"
                  style={{
                    height: "54px",
                    background: "rgba(0,0,0,0.35)",
                    border: "1.5px solid #253a34",
                    borderRadius: "14px",
                    color: "#f0f5f2",
                    fontSize: "15px",
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ color: "#f0f5f2", fontSize: "14px" }}>
                Password
              </label>
              <div className="relative mt-2">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  color="#9fb6ad"
                />
                <Input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={handleChange}
                  className="pl-12"
                  style={{
                    height: "54px",
                    background: "rgba(0,0,0,0.35)",
                    border: "1.5px solid #253a34",
                    borderRadius: "14px",
                    color: "#f0f5f2",
                    fontSize: "15px",
                  }}
                />
              </div>
            </div>

        

            <Button
  type="submit"
  disabled={isLoading || success}
  className="
    mt-2 w-full h-[54px]
    flex items-center justify-center gap-2
    rounded-[14px]
    bg-gradient-to-br from-[#1db954] to-[#1fa8a1]
    text-[#0c1210] text-base font-semibold
    transition-all duration-300
    shadow-[0_0_25px_rgba(29,185,84,0.35)]
    hover:shadow-[0_0_40px_rgba(29,185,84,0.55)]
    hover:-translate-y-[1px]
    disabled:opacity-60
    disabled:cursor-not-allowed
  "
>
  {isLoading && !success && "Logging in..."}
  {success && "Login successful, redirecting..."}
  {!isLoading && !success && (
    <>
      Login
      <ArrowRight size={16} />
    </>
  )}
</Button>

          </form>

          <p className="text-center text-sm mt-6" style={{ color: "#9fb6ad" }}>
             Don't have an account?{" "}
            <Link to="/register" style={{ color: "#1db954" }}>
              Create One
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login