
import { Button } from "@/components/ui/button"
import { Bot, Sparkles, Code, Database } from "lucide-react"
import Navbar from "@/components/navbar"
import InterviewCard from "@/components/interview-card"
import { isAuthenticated } from "@/actions/auth.actions"

export default async function Dashboard() {

  const isUserAuth = await isAuthenticated();

  if(!isUserAuth) redirect('/auth');



  const pastInterviews = [
    {
      interviewId: "1",
      userId: "user1",
      role: "Frontend Developer",
      type: "Technical",
      techstack: ["react", "javascript", "tailwind", "nextjs"],
      createdAt: "2024-12-15",
      feedback: {
        totalScore: 85,
        finalAssessment:
          "Great performance on React concepts and component architecture. Could improve on state management patterns.",
        createdAt: "2024-12-15",
      },
      hasScore: true,
    },
    {
      interviewId: "2",
      userId: "user1",
      role: "Frontend Developer",
      type: "Technical",
      techstack: ["react", "typescript"],
      createdAt: "2024-03-15",
      hasScore: false,
    },
    {
      interviewId: "3",
      userId: "user1",
      role: "Backend Developer",
      type: "Technical",
      techstack: ["nodejs", "mongodb", "express"],
      createdAt: "2024-12-10",
      feedback: {
        totalScore: 78,
        finalAssessment: "Solid understanding of Node.js and database concepts. Work on API design patterns.",
        createdAt: "2024-12-10",
      },
      hasScore: true,
    },
  ]

  const availableInterviews = [
    {
      interviewId: "4",
      role: "Full Stack Developer",
      type: "Technical",
      techstack: ["react", "nodejs", "mongodb"],
      createdAt: "2024-12-20",
      hasScore: false,
    },
    {
      interviewId: "5",
      role: "DevOps Engineer",
      type: "Technical",
      techstack: ["aws", "docker", "kubernetes"],
      createdAt: "2024-12-20",
      hasScore: false,
    },
    {
      interviewId: "6",
      role: "Product Manager",
      type: "Behavioral",
      techstack: [],
      createdAt: "2024-12-20",
      hasScore: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="relative mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800/20 to-transparent rounded-3xl"></div>
          <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10">
            <div className="flex items-center justify-between">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  Get Interview-Ready with{" "}
                  <span className="bg-gradient-to-r from-gray-300 to-white bg-clip-text text-transparent">
                    AI-Powered Practice
                  </span>{" "}
                  & Feedback
                </h1>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  Practice real interview questions & get instant feedback.
                </p>
                <Button className="bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white px-8 py-3 rounded-xl text-base font-semibold border border-white/10 hover:scale-105 transition-all duration-200">
                  Start an Interview
                </Button>
              </div>

              {/* AI Robot Illustration */}
              <div className="hidden lg:flex items-center justify-center relative">
                <div className="relative">
                  <div className="w-48 h-48 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full flex items-center justify-center">
                    <Bot className="w-24 h-24 text-white" />
                  </div>
                  {/* Floating Icons */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center animate-bounce">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center animate-bounce delay-100">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute top-1/2 -left-8 w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center animate-bounce delay-200">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Past Interviews Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Your Past Interviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastInterviews.map((interview) => (
              <InterviewCard key={interview.interviewId} {...interview} />
            ))}
          </div>
        </section>

        {/* Pick Your Interview Section */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-8">Pick Your Interview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableInterviews.map((interview) => (
              <InterviewCard key={interview.interviewId} {...interview} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
