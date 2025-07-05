"use client"

import { useState, useEffect,use } from "react"
import { Button } from "@/components/ui/button"
import { Star, Calendar } from "lucide-react"
import Navbar from "@/components/navbar"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Loader from "@/components/Loading"
import { getInterviewById, getFeedbackByInterviewId } from "@/actions/general.actions"
import { getCurrentUser } from "@/actions/auth.actions"
// Mock functions to simulate the server actions

export default  function Feedback({ params }) {
  const {id,} = use(params);
  const [user, setUser] = useState(null)
  const [interview, setInterview] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
        
      try {
        const currentUser = await getCurrentUser()
        const interviewData = await getInterviewById(id)

        if (!interviewData) {
          router.push("/")
          return
        }

        const feedbackData = await getFeedbackByInterviewId({
          interviewId: id,
          userId: currentUser?.id,
        })

        setUser(currentUser)
        setInterview(interviewData)
        setFeedback(feedbackData)
      } catch (error) {
        console.error("Error fetching feedback:", error)
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, router])

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-yellow-400"
    if (score >= 40) return "text-orange-400"
    return "text-red-400"
  }

  if (loading) {
    return <Loader />
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

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Header Section */}
        <section className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-6">
            Feedback on the Interview — <span className="capitalize">{interview?.role} Interview</span>
          </h1>

          {/* Score and Date */}
          <div className="flex flex-row justify-center gap-8 mb-8">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <p className="text-gray-300">
                Overall Impression:{" "}
                <span className={`font-bold text-xl ${getScoreColor(feedback?.totalScore)}`}>
                  {feedback?.totalScore}
                </span>
                <span className="text-gray-400">/100</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <p className="text-gray-300">{formatDate(feedback?.createdAt)}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8"></div>
        </section>

        {/* Final Assessment */}
        <section className="mb-12">
          <p className="text-gray-300 text-lg leading-relaxed text-center max-w-3xl mx-auto">
            {feedback?.finalAssessment}
          </p>
        </section>

        {/* Breakdown of Evaluation */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-8">Breakdown of Evaluation:</h2>
          <div className="space-y-8">
            {feedback?.categoryScores?.map((category, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-xl font-semibold text-white">
                  {index + 1}. {category.name} ({category.score}/100)
                </h3>
                <div className="ml-6">
                  <p className="text-gray-300 leading-relaxed">{category.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Strengths and Areas for Improvement */}
        {(feedback?.strengths?.length > 0 || feedback?.areasForImprovement?.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Strengths */}
            {feedback?.strengths?.length > 0 && (
              <section>
                <h3 className="text-xl font-bold text-white mb-6">Strengths</h3>
                <div className="space-y-3">
                  {feedback.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2.5 flex-shrink-0"></div>
                      <p className="text-gray-300 leading-relaxed">{strength}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Areas for Improvement */}
            {feedback?.areasForImprovement?.length > 0 && (
              <section className={feedback?.strengths?.length > 0 ? "" : "col-span-full"}>
                <h3 className="text-xl font-bold text-white mb-6">Areas for Improvement</h3>
                <div className="space-y-3">
                  {feedback.areasForImprovement.map((area, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2.5 flex-shrink-0"></div>
                      <p className="text-gray-300 leading-relaxed">{area}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <section className="flex flex-col sm:flex-row gap-4">
          <Button
            asChild
            className="flex-1 bg-gray-600 hover:bg-gray-500 text-white rounded-full py-3 px-8 font-semibold transition-all duration-200"
          >
            <Link href="/" className="flex items-center justify-center">
              Back to Dashboard
            </Link>
          </Button>
          <Button
            asChild
            className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white rounded-full py-3 px-8 font-semibold transition-all duration-200"
          >
            <Link href={`/interview/${id}`} className="flex items-center justify-center">
              Retake interview
            </Link>
          </Button>
        </section>
      </main>
    </div>
  )
}
