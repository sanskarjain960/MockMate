"use client"

import { CheckCircle,Mic,Target, User, LogOut,Trophy, UserCheck,Layers  } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { signOut } from "@/actions/auth.actions";
import { useState } from "react";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    
    try {
      const res = signOut();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return (
    <nav className="bg-black/50 backdrop-blur-xl border-b border-white/10 px-6 py-4 relative z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl">
            < CheckCircle  className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-white text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            FinalRound AI
          </h1>
        </Link>

        {/* User Profile */}
        <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="p-3 hover:bg-white/10 rounded-full transition-colors duration-200"
      >
        <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full flex items-center justify-center shadow-lg">
          <User className="w-6 h-6 text-white" />
        </div>
      </button>

      {isDropdownOpen && (
        <>
          {/* Backdrop to close dropdown when clicking outside */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsDropdownOpen(false)}
          />
          
          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors duration-150"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
      </div>
    </nav>
  )
}
