"use client"

import { MessageCircle, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="bg-black/50 backdrop-blur-xl border-b border-white/10 px-6 py-4 relative z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-white text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            PrepWise
          </h1>
        </Link>

        {/* User Profile */}
        <Button variant="ghost" size="sm" className="p-2 hover:bg-white/10 rounded-full">
          <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </Button>
      </div>
    </nav>
  )
}
