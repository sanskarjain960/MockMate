"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Database, Plus } from "lucide-react";
import Navbar from "@/components/navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants/index";
import { createFeedback } from "@/actions/general.actions";
import DisplayTechIcons from "./DisplayTechIcons";

// const interviewer = {
//   // Mock interviewer config
//   model: "gpt-4",
//   voice: "default",
// }

// const createFeedback = async (data) => {
//   // Mock feedback creation
//   console.log("Creating feedback", data)
//   return { success: true, feedbackId: "mock-feedback-id" }
// }

const CallStatus = {
  INACTIVE: "INACTIVE",
  CONNECTING: "CONNECTING",
  ACTIVE: "ACTIVE",
  FINISHED: "FINISHED",
};

export default function Agent({
  userName,
  userId,
  interviewId,
  type,
  questions,
  interviewData,
}) {
  const router = useRouter();

  // VAPI Integration State
  const [callStatus, setCallStatus] = useState(CallStatus.INACTIVE);
  const [messages, setMessages] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState("");

  // Mock interview data
  //   const [userName] = useState("JS Mastery")
  //   const [userId] = useState("user-123")
  //   const [interviewId] = useState(params?.id || "interview-123")
  //   const [feedbackId] = useState(null)
  //   const [type] = useState("interview")
  //   const [questions] = useState([
  //     "Tell me about a challenging project you worked on",
  //     "How do you handle debugging complex issues?",
  //     "What's your experience with backend technologies?",
  //   ])

  // VAPI Event Listeners
  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error) => {
      console.log("Error:", error);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  // Handle messages and feedback generation
  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages) => {
      try {
        console.log(messages);
        const { success, feedbackId: id } = await createFeedback({
          interviewId: interviewId,
          userId: userId,
          transcript: messages,
        });

        if (success && id) {
          router.push(`/interview/${interviewId}/feedback`);
        } else {
          console.log("Error saving feedback");
          router.push("/");
        }
      } catch (error) {
        console.error("Error saving feedback:", error);
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, interviewId, router, type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      await vapi.start(
        undefined,
        undefined,
        undefined,
        process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID,
        {
          variableValues: {
            username: userName,
            userid: userId,
          },
        }
      );
    } else {
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    }
  };

  // Handle call disconnect
  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const TechIcon = ({ tech }) => {
    const iconMap = {
      html: "🌐",
      css: "🎨",
      js: "⚡",
    };

    return (
      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/20 text-sm">
        {iconMap[tech] || "💻"}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background stars/sparkles effect */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-white rounded-full animate-pulse delay-100"></div>
        <div className="absolute bottom-32 left-40 w-1 h-1 bg-white rounded-full animate-pulse delay-200"></div>
        <div className="absolute top-60 right-20 w-1 h-1 bg-white rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-20 right-60 w-1 h-1 bg-white rounded-full animate-pulse delay-500"></div>
      </div>

      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        {/* Interview Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500">
                {interviewData ? (
                  <Image src={interviewData.coverImage} alt = {interviewData.role} width={70} height={70} className="w-10 h-10 text-white" />
                ): (
                  <Plus className="w-5 h-5 text-white" />
                )}
              
            </div>
            <div className="flex items-center gap-4">
                {interviewData ? (
                  <h1 className="text-white text-2xl font-bold">
                {interviewData.role} Interview
              </h1>
                ): (
                  <h1 className="text-white text-2xl font-bold">
                    Create New Interview
                  </h1>
                )}
              
              <div className="flex items-center gap-2">
                {interviewData && (
                  <DisplayTechIcons techStack={interviewData.techstack} />
                )}
              </div>
            </div>
          </div>
          {interviewData && (
            <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30 px-4 py-2">
              {interviewData.type}
            </Badge>
          )}
        </div>

        {/* Interview Interface */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* AI Interviewer Card */}
          <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20 hover:border-purple-500/30 transition-all duration-300">
            <div className="flex flex-col items-center justify-center h-72">
              <div className="relative mb-8">
                {/* Pulsing rings when AI is speaking */}
                {isSpeaking && (
                  <>
                    <div className="absolute inset-0 w-28 h-28 bg-purple-400/20 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 w-28 h-28 bg-purple-400/10 rounded-ful-cols-ate-ping animation-delay-75"></div>
                    <div className="absolute inset-0 w-28 h-28 bg-purple-400/5 rounded-full animate-ping animation-delay-150"></div>
                  </>
                )}
                <div className="relative w-28 h-28 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center z-10">
                  <MessageCircle className="w-14 h-14 text-white" />
                </div>
              </div>
              <h3 className="text-white text-2xl font-semibold">
                AI
              </h3>
            </div>
          </div>

          {/* Candidate Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
            <div className="flex flex-col items-center justify-center h-72">
              <div className="relative mb-8">
                {/* Pulsing rings when candidate is speaking */}
                {callStatus === CallStatus.ACTIVE && !isSpeaking && (
                  <>
                    <div className="absolute inset-0 w-28 h-28 bg-white/20 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 w-28 h-28 bg-white/10 rounded-full animate-ping animation-delay-75"></div>
                    <div className="absolute inset-0 w-28 h-28 bg-white/5 rounded-full animate-ping animation-delay-150"></div>
                  </>
                )}
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white/20 z-10">
                  <Image
                    src="/placeholder.svg?height=112&width=112"
                    alt="User profile"
                    width={112}
                    height={112}
                    className="rounded-full object-cover w-full h-full"
                  />
                </div>
              </div>
              <h3 className="text-white text-2xl font-semibold">
                Me
              </h3>
            </div>
          </div>
        </div>

        {/* Transcript/Question Section */}
        {messages.length > 0 && lastMessage && (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 mb-8">
            <div className="text-center">
              <p
                key={lastMessage}
                className={cn(
                  "text-white text-lg leading-relaxed max-w-4xl mx-auto transition-opacity duration-500 opacity-0",
                  "animate-fadeIn opacity-100"
                )}
              >
                {lastMessage}
              </p>
            </div>
          </div>
        )}

        {/* Call Controls */}
        <div className="flex justify-center">
          {callStatus !== CallStatus.ACTIVE ? (
            <Button
              onClick={handleCall}
              className="relative bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 text-white rounded-full px-12 py-4 text-lg font-semibold border border-green-400/30 hover:scale-105 transition-all duration-200"
            >
              <span
                className={cn(
                  "absolute inset-0 animate-ping rounded-full bg-green-400/75",
                  callStatus !== CallStatus.CONNECTING && "hidden"
                )}
              />
              <span className="relative">
                {callStatus === CallStatus.INACTIVE ||
                callStatus === CallStatus.FINISHED
                  ? "Start Interview"
                  : "Connecting..."}
              </span>
            </Button>
          ) : (
            <Button
              onClick={handleDisconnect}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white rounded-full px-12 py-4 text-lg font-semibold border border-red-400/30 hover:scale-105 transition-all duration-200"
            >
              End Interview
            </Button>
          )}
        </div>

        {/* Call Status Indicator */}
        {callStatus === CallStatus.ACTIVE && (
          <div className="fixed bottom-6 right-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-full px-4 py-2 border border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white text-sm">Interview Active</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .animation-delay-75 {
          animation-delay: 0.075s;
        }
        .animation-delay-150 {
          animation-delay: 0.15s;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
