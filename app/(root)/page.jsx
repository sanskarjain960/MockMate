"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Code, Database } from "lucide-react"
import Navbar from "@/components/navbar"
import InterviewCard from "@/components/interview-card"
import Image from "next/image"
import Link from "next/link"
import { getInterviewsByUserId, getLatestInterviews } from "@/actions/general.actions"
import { getCurrentUser } from "@/actions/auth.actions"
import Loader from "@/components/Loading"


export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [userInterviews, setUserInterviews] = useState([])
  const [allInterviews, setAllInterviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await getCurrentUser()
        const [pastInterviews, availableInterviews] = await Promise.all([
          getInterviewsByUserId(currentUser?.id),
          getLatestInterviews({ userId: currentUser?.id }),
        ])

        setUser(currentUser)
        setUserInterviews(pastInterviews || [])
        setAllInterviews(availableInterviews || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  

  const hasPastInterviews = userInterviews?.length > 0
  const hasUpcomingInterviews = allInterviews?.length > 0

  if (loading) {
    return <Loader/>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-white rounded-full animate-pulse delay-100"></div>
        <div className="absolute bottom-32 left-40 w-1 h-1 bg-white rounded-full animate-pulse delay-200"></div>
        <div className="absolute top-60 right-20 w-1 h-1 bg-white rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-20 right-60 w-1 h-1 bg-white rounded-full animate-pulse delay-500"></div>
      </div>
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section - CTA */}
        <section className="relative mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800/20 to-transparent rounded-3xl"></div>
          <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10">
            <div className="flex items-center justify-between">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  Get Interview-Ready with{" "}
                  <span className="bg-gradient-to-r from-gray-300 to-white bg-clip-text text-transparent">
                    AI-Powered Practice
                  </span>{" "}
                  & Feedback
                </h2>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  Practice real interview questions & get instant feedback.
                </p>
                <Button
                  asChild
                  className="bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white px-8 py-3 rounded-xl text-base font-semibold border border-white/10 hover:scale-105 transition-all duration-200 max-sm:w-full"
                >
                  <Link href="/interview">Start an Interview</Link>
                </Button>
              </div>

              {/* Robot Illustration */}
              <div className="hidden lg:flex items-center justify-center relative">
                <Image
                  src="/robot.png"
                  alt="robo-dude"
                  width={400}
                  height={400}
                  className="max-sm:hidden"
                />
                {/* Floating Icons */}
                {/* <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center animate-bounce">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center animate-bounce delay-100">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute top-1/2 -left-8 w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center animate-bounce delay-200">
                  <Database className="w-5 h-5 text-white" />
                </div> */}
              </div>
            </div>
          </div>
        </section>

        {/* Your Interviews Section */}
        <section className="mb-16">
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-white">Your Interviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hasPastInterviews ? (
                userInterviews.map((interview) => (
                  <InterviewCard
                    key={interview.id}
                    userId={user?.id}
                    interviewId={interview.id}
                    role={interview.role}
                    type={interview.type}
                    techstack={interview.techstack}
                    createdAt={interview.createdAt}
                    hasScore={true}
                    feedback={{
                      totalScore: Math.floor(Math.random() * 40) + 60, // Random score 60-100
                      finalAssessment:
                        "Great performance on technical concepts. Could improve on communication skills.",
                      createdAt: interview.createdAt,
                    }}
                  />
                ))
              ) : (
                <div className="col-span-full">
                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center">
                    <p className="text-gray-300 text-lg">You haven&apos;t taken any interviews yet</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Take Interviews Section */}
        <section>
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-white">Take Interviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hasUpcomingInterviews ? (
                allInterviews.map((interview) => (
                  <InterviewCard
                    key={interview.id}
                    userId={user?.id}
                    interviewId={interview.id}
                    role={interview.role}
                    type={interview.type}
                    techstack={interview.techstack}
                    createdAt={interview.createdAt}
                    hasScore={false}
                  />
                ))
              ) : (
                <div className="col-span-full">
                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center">
                    <p className="text-gray-300 text-lg">There are no interviews available</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
