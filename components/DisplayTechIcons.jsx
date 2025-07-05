"use client"
import Image from "next/image"
import { getRandomInterviewCover } from "@/lib/utils"
import { Code, Database, Globe, Smartphone, Server, Cloud } from "lucide-react"

const techIconMap = {
  react: Code,
  javascript: Code,
  typescript: Code,
  nodejs: Server,
  python: Code,
  java: Code,
  mongodb: Database,
  mysql: Database,
  postgresql: Database,
  html: Globe,
  css: Globe,
  tailwind: Globe,
  nextjs: Globe,
  express: Server,
  aws: Cloud,
  docker: Cloud,
  kubernetes: Cloud,
  reactnative: Smartphone,
  flutter: Smartphone,
}

export default function DisplayTechIcons({ techStack = [] }) {
  if (!techStack || techStack.length === 0) {
    return <div className="flex gap-1"></div>
  }

  const displayTechs = techStack.slice(0, 3) // Show max 3 icons
  const remainingCount = techStack.length - 3

  return (
    <div className="flex items-center gap-1">
      {displayTechs.map((tech, index) => {
        
        return (
          <div
            key={index}
            className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/20"
            title={tech}
          >
            <Image
            src={getRandomInterviewCover()}
            alt={tech}
            width={100}
            height={100}
            className="size-5"
          />
          </div>
        )
      })}
      {remainingCount > 0 && (
        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/20 text-xs text-gray-300">
          +{remainingCount}
        </div>
      )}
    </div>
  )
}
