"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageCircle,CheckCircle } from "lucide-react"
import Link from "next/link"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { signIn,signUp } from "@/actions/auth.actions"
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/client.js";
import { toast } from "sonner";
import { isAuthenticated } from "@/actions/auth.actions"
import Image from "next/image"


export default function AuthPage() {

  const [isSignIn, setIsSignIn] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault()
    // toast.success("hello");
    // Access form values here
    // console.log("Form submitted with values:", formData)

    if (isSignIn) {
      // Sign in logic
      try {
        const {email,password} = formData;
  
        if(!email || !password){
          toast.error("Please fill all the fields");
          return
        }
  
        const userCredentials = await signInWithEmailAndPassword(auth,email,password);
  
        const idToken = await userCredentials.user.getIdToken();
  
        if(!idToken){
          toast.error("Failed to log into account. Please try again.");
          return
        }
  
        await signIn({
          email,
          idToken
        });
  
        toast.success("Signed In Successfully");
        router.push('/');
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }

    } else {
      // Sign up logic
      // console.log("Creating account with:", formData)
      try {
        const {name,email,password} = formData;
  
        if(!name || !email || !password){
          toast.error("Please fill all the fields");
          return
        }
  
        const userCredentials = await createUserWithEmailAndPassword(auth,email,password)
  
        const result = await signUp({
          uid: userCredentials.user.uid,
          name : name,
          email,
          password,
        })
  
        if(!result.success){
          toast.error(result.message)
          return
        }
  
        toast.success("Account Created Successfully, Please Sign In");
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
      
    }
    
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const toggleMode = () => {
    setIsSignIn(!isSignIn)
    // Clear form when switching modes
    setFormData({
      name: "",
      email: "",
      password: "",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      <Image 
                src='/sprinkle.svg'
                alt="background" 
                width={1000} 
                height={1000} 
                className="absolute inset-0 object-cover w-full h-full"
              />

      <div className="w-full max-w-sm relative z-10">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
          {/* Logo and Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-white text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                FinalRound AI
              </h1>
            </div>
            <p className="text-gray-300 text-base font-medium">Practice job interview with AI</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isSignIn && (
              <div className="space-y-3">
                <Label htmlFor="name" className="text-gray-200 text-sm font-medium">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 rounded-2xl h-14 px-4 focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all duration-200 backdrop-blur-sm"
                />
              </div>
            )}

            <div className="space-y-3">
              <Label htmlFor="email" className="text-gray-200 text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Your email address"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 rounded-2xl h-14 px-4 focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all duration-200 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-gray-200 text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 rounded-2xl h-14 px-4 focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all duration-200 backdrop-blur-sm"
              />
            </div>

            
<Button
  onClick={handleSubmit}
  type="button"
  className="w-full bg-white hover:bg-gray-100 text-black rounded-2xl h-14 mt-8 font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] border border-white/10"
>
  {isSignIn ? "Sign In" : "Create an Account"}
</Button>
          </form>

          <div className="text-center mt-8">
            <p className="text-gray-300 text-sm">
              {isSignIn ? "Don't have an account? " : "Have an account already? "}
              <button
                onClick={toggleMode}
                className="text-white font-medium hover:text-gray-300 transition-colors duration-200 underline decoration-white/50 underline-offset-2"
              >
                {isSignIn ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
