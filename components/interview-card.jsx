"use client"
import { getRandomInterviewCover } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import DisplayTechIcons from "./DisplayTechIcons.jsx"
import { cn } from "@/lib/utils"
import { useEffect } from "react"
import { useState } from "react"
import { getFeedbackByInterviewId } from "@/actions/general.actions"
import Loader from "./Loading.jsx"

export default function InterviewCard({
  interviewId,
  userId,
  role,
  type,
  techstack = [],
  createdAt,
  hasScore = true,
}) {

  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const feedback =
    userId && interviewId
      ? await getFeedbackByInterviewId({
          interviewId,
          userId,
        })
      : null;
      
        setFeedback(feedback)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching feedback:", error)
      }
    }
    fetchFeedback()
  }, [interviewId])

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type

  const badgeColor =
    {
      Behavioral: "bg-green-500/20 text-green-300 border-green-500/30",
      Mixed: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      Technical: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    }[normalizedType] || "bg-gray-500/20 text-gray-300 border-gray-500/30"

  const formattedDate = new Date(feedback?.createdAt || createdAt || Date.now()).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  // if(loading) return <Loader />

  return (
    <div className="w-[360px] max-sm:w-full min-h-96">
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-[1.02] group relative">
        {/* Type Badge */}
        <Badge
          variant="secondary"
          className={cn(
            "absolute top-0 right-0 rounded-tl-none rounded-tr-2xl rounded-bl-lg rounded-br-none px-4 py-2",
            badgeColor,
          )}
        >
          {normalizedType}
        </Badge>

        <div>
          {/* Cover Image */}
          <div className="flex justify-center mb-4">
            <div className="w-[90px] h-[90px] bg-gradient-to-r from-gray-700 to-gray-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Image
                src={getRandomInterviewCover()}
                alt="cover-image"
                width={90}
                height={90}
                className="rounded-full object-cover"
              />
            </div>
          </div>

          {/* Interview Role */}
          <h3 className="text-white text-lg font-semibold mb-3 text-center capitalize group-hover:text-gray-200 transition-colors">
            {role} Interview
          </h3>

          {/* Date & Score */}
          <div className="flex flex-row gap-5 mb-5 justify-center">
            <div className="flex flex-row gap-2 items-center">
              <Calendar className="w-4 h-4 text-gray-400" />
              <p className="text-gray-300 text-sm">{formattedDate}</p>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <Star className="w-4 h-4 text-gray-400" />
              <p className={`text-sm ${hasScore ? "text-yellow-400 font-medium" : "text-gray-400"}`}>
                {hasScore && feedback?.totalScore ? `${feedback.totalScore}/100` : "---/100"}
              </p>
            </div>
          </div>

          {/* Feedback or Placeholder Text */}
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-6 text-center">
            {feedback?.finalAssessment || "You haven't taken this interview yet. Take it now to improve your skills."}
          </p>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-row justify-between items-center">
          <DisplayTechIcons techStack={techstack} />
          <Button className="bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white rounded-xl px-4 py-2 font-semibold text-sm border border-white/10 hover:scale-105 transition-all duration-200">
            <Link href={feedback ? `/interview/${interviewId}/feedback` : `/interview/${interviewId}`}>
              {feedback ? "Check Feedback" : "View Interview"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
