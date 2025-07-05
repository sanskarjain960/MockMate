"use client"

import Image from "next/image"
import { getTechLogos, cn } from "@/lib/utils"
import { useEffect, useState } from "react"

export default function DisplayTechIcons({ techStack = [] }) {
  const [techIcons, setTechIcons] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTechLogos = async () => {
      if (!techStack || techStack.length === 0) {
        setIsLoading(false)
        return
      }

      try {
        const icons = await getTechLogos(techStack)
        setTechIcons(icons)
      } catch (error) {
        console.error("Error fetching tech logos:", error)
        setTechIcons([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchTechLogos()
  }, [techStack])

  if (isLoading) {
    return (
      <div className="flex flex-row">
        {[...Array(Math.min(3, techStack.length))].map((_, index) => (
          <div
            key={index}
            className={cn(
              "relative bg-gray-200 dark:bg-gray-700 rounded-full p-2 w-9 h-9 animate-pulse",
              index >= 1 && "-ml-3",
            )}
          />
        ))}
      </div>
    )
  }

  if (!techStack || techStack.length === 0 || techIcons.length === 0) {
    return <div className="flex gap-1"></div>
  }

  const displayTechs = techIcons.slice(0, 3) // Show max 3 icons
  const remainingCount = techIcons.length - 3

  return (
    <div className="flex flex-row items-center">
      {displayTechs.map(({ tech, url }, index) => (
        <div
          key={tech}
          className={cn(
            "relative group bg-white/10 dark:bg-dark-300 rounded-full p-2 flex items-center justify-center border border-white/20 transition-transform hover:scale-110 hover:z-10",
            index >= 1 && "-ml-3",
          )}
        >
          {/* Tooltip */}
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
            {tech}
          </span>

          <Image src={url || "/placeholder.svg"} alt={tech} width={100} height={100} className="size-5" />
        </div>
      ))}

      {remainingCount > 0 && (
        <div className="w-9 h-9 bg-white/10 dark:bg-dark-300 rounded-full flex items-center justify-center border border-white/20 text-xs text-gray-300 -ml-3">
          +{remainingCount}
        </div>
      )}
    </div>
  )
}
